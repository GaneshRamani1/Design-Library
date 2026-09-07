import {
  Directive,
  DestroyRef,
  ElementRef,
  Injector,
  ViewContainerRef,
  afterNextRender,
  booleanAttribute,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
  type ComponentRef,
} from "@angular/core";
import {
  NgControl,
  FormGroupDirective,
  NgForm,
  type AbstractControl,
  type ValidatorFn,
  type AsyncValidatorFn,
  type ValidationErrors,
} from "@angular/forms";
import { Overlay, type OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import type { ComponentAppearance } from "../shared/appearance";
import { ValidationMessage, validationStyles } from "./validation-message";

export type ValidationMessageResolver =
  | string
  | ((details: unknown, control: AbstractControl) => string);
export type ValidationMessages = Record<string, ValidationMessageResolver>;
export interface ValidationState {
  errors: ValidationErrors | null;
  messages: string[];
  visible: boolean;
  pending: boolean;
}
let nextValidationId = 0;
/** Composes consumer validators and presents an Angular control's errors. */
@Directive({
  selector: "[dlValidation]",
  standalone: true,
  host: {
    "(focusin)": "focus(true)",
    "(focusout)": "leave($event)",
    "(document:keydown.escape)": "escape()",
  },
})
export class ValidationDirective {
  readonly dlValidation = input(true, { transform: booleanAttribute });
  readonly validators = input<ValidatorFn[]>([]);
  readonly asyncValidators = input<AsyncValidatorFn[]>([]);
  readonly validationMessages = input<ValidationMessages>({});
  readonly validationDisplay = input<"inline" | "popover" | "none">("inline");
  readonly validationWhen = input<"touched" | "dirty" | "always" | "submitted">(
    "touched",
  );
  readonly validationPopoverTrigger = input<"always" | "focus">("always");
  readonly validationShowAll = input(true);
  readonly validationMaxMessages = input(5);
  readonly validationHeading = input("Please check this field");
  readonly validationFallback = input("This value is invalid.");
  readonly validationPendingMessage = input("Checking this value…");
  readonly validationShowPending = input(false);
  readonly validationOffset = input(8);
  readonly validationWidth = input<string | null>(null);
  readonly validationCloseOnEscape = input(true);
  readonly validationLive = input<"off" | "polite" | "assertive">("polite");
  readonly validationAppearance = input<ComponentAppearance>({});
  readonly validationChange = output<ValidationState>();
  private readonly id = "dl-validation-" + ++nextValidationId;
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly view = inject(ViewContainerRef);
  private readonly overlay = inject(Overlay);
  private readonly destroyRef = inject(DestroyRef);
  private readonly boundControl = signal<AbstractControl | null>(null);
  private readonly revision = signal(0);
  private readonly focused = signal(false);
  private readonly submitted = signal(false);
  private readonly dismissed = signal(false);
  private panel: ComponentRef<ValidationMessage> | null = null;
  private overlayRef: OverlayRef | null = null;
  private mode: "inline" | "popover" | null = null;
  private lastState = "";
  private lastErrors: ValidationErrors | null = null;
  private readonly originals = new Map<HTMLElement, string | null>();

  constructor() {
    afterNextRender(() => {
      // Resolve after the value accessor has been initialized, avoiding an NgControl/CVA injection cycle.
      const ngControl = this.injector.get(NgControl, null, {
        self: true,
        optional: true,
      });
      if (!ngControl?.control) return;
      this.boundControl.set(ngControl.control);
      const resize =
        typeof ResizeObserver !== "undefined"
          ? new ResizeObserver(() => this.revision.update((v) => v + 1))
          : null;
      resize?.observe(this.element.nativeElement);
      this.destroyRef.onDestroy(() => resize?.disconnect());
      const events = ngControl.control.events.subscribe(() => {
        this.revision.update((v) => v + 1);
        const parent =
          this.injector.get(FormGroupDirective, null, { optional: true }) ??
          this.injector.get(NgForm, null, { optional: true });
        this.submitted.set(!!parent?.submitted);
      });
      const parent =
        this.injector.get(FormGroupDirective, null, { optional: true }) ??
        this.injector.get(NgForm, null, { optional: true });
      this.submitted.set(!!parent?.submitted);
      const parentEvents = parent?.control.events.subscribe(() => {
        // Angular emits the form reset event before clearing the submitted flag.
        queueMicrotask(() => {
          if (this.destroyRef.destroyed) return;
          this.submitted.set(!!parent.submitted);
          this.revision.update((v) => v + 1);
        });
      });
      const submit = parent?.ngSubmit.subscribe(() => {
        this.submitted.set(true);
        this.revision.update((v) => v + 1);
      });
      this.destroyRef.onDestroy(() => {
        events.unsubscribe();
        submit?.unsubscribe();
        parentEvents?.unsubscribe();
      });
    });
    effect((onCleanup) => {
      const control = this.boundControl(),
        validators = this.validators(),
        asyncValidators = this.asyncValidators();
      if (!control) return;
      untracked(() => {
        const added = validators.filter((v) => !control.hasValidator(v));
        const addedAsync = asyncValidators.filter(
          (v) => !control.hasAsyncValidator(v),
        );
        control.addValidators(added);
        control.addAsyncValidators(addedAsync);
        if (added.length || addedAsync.length) control.updateValueAndValidity();
        onCleanup(() => {
          control.removeValidators(added);
          control.removeAsyncValidators(addedAsync);
          if (added.length || addedAsync.length)
            control.updateValueAndValidity();
        });
      });
    });
    effect(() => {
      const control = this.boundControl();
      this.revision();
      const enabled = this.dlValidation();
      const when = this.validationWhen();
      const display = this.validationDisplay();
      const focusOnly = this.validationPopoverTrigger() === "focus";
      const focused = this.focused(),
        submitted = this.submitted();
      this.dismissed();
      const messages = this.validationMessages(),
        showAll = this.validationShowAll(),
        limit = this.validationMaxMessages();
      const fallback = this.validationFallback(),
        pending = this.validationPendingMessage(),
        showPending = this.validationShowPending();
      const config = {
        heading: this.validationHeading(),
        live: this.validationLive(),
        appearance: this.validationAppearance(),
        offset: this.validationOffset(),
        width: this.validationWidth(),
      };
      untracked(() => {
        if (!control) {
          this.hide();
          return;
        }
        const errors = control.errors;
        const errorsChanged = errors !== this.lastErrors;
        if (errorsChanged) {
          this.lastErrors = errors;
          this.dismissed.set(false);
        }
        const eligible =
          enabled &&
          !control.disabled &&
          (when === "always" ||
            (when === "dirty" && control.dirty) ||
            (when === "touched" && control.touched) ||
            (when === "submitted" && submitted));
        const resolved = Object.entries(errors ?? {})
          .map(([key, details]) => {
            const custom = messages[key];
            return typeof custom === "function"
              ? custom(details, control)
              : (custom ?? this.defaultMessage(key, details, fallback));
          })
          .filter(Boolean);
        const shown = control.pending
          ? showPending
            ? [pending]
            : []
          : resolved.slice(
              0,
              showAll ? Math.max(1, Math.floor(limit) || 1) : 1,
            );
        // A changed error set reopens a dismissed message; Escape otherwise keeps it closed until focus returns.
        const actualVisible =
          eligible &&
          shown.length > 0 &&
          display !== "none" &&
          !this.dismissed() &&
          !(display === "popover" && focusOnly && !focused);
        this.describe(eligible && !!errors, actualVisible);
        if (actualVisible)
          this.show(display as "inline" | "popover", shown, config);
        else this.hide();
        const state = {
          errors,
          messages: shown,
          visible: actualVisible,
          pending: control.pending,
        };
        const signature = JSON.stringify({
          ...state,
          errors: Object.keys(errors ?? {}),
        });
        if (signature !== this.lastState || errorsChanged) {
          this.lastState = signature;
          this.validationChange.emit(state);
        }
      });
    });
    this.destroyRef.onDestroy(() => {
      this.hide();
      this.describe(false, false);
    });
  }
  private defaultMessage(key: string, details: any, fallback: string): string {
    switch (key) {
      case "numeric":
        return "Enter a valid number.";
      case "precision":
        return `Use no more than ${details.requiredPrecision} decimal places.`;
      case "step":
        return `Use increments of ${details.step}.`;
      case "required":
        return "This field is required.";
      case "email":
        return "Enter a valid email address.";
      case "minlength":
        return `Use at least ${details.requiredLength} characters.`;
      case "maxlength":
        return `Use no more than ${details.requiredLength} characters.`;
      case "min":
        return `Enter a value of at least ${details.min}.`;
      case "max":
        return `Enter a value no greater than ${details.max}.`;
      case "pattern":
        return "Use the required format.";
      case "mask":
      case "maskIncomplete":
        return "Complete the required format.";
      default:
        return fallback;
    }
  }
  focus(value: boolean): void {
    this.focused.set(value);
    if (value) this.dismissed.set(false);
  }
  leave(event: FocusEvent): void {
    if (
      !this.element.nativeElement.contains(event.relatedTarget as Node | null)
    )
      this.focus(false);
  }
  escape(): void {
    if (
      this.validationDisplay() === "popover" &&
      this.validationCloseOnEscape()
    )
      this.dismissed.set(true);
  }
  private describe(invalid: boolean, visible: boolean): void {
    const host = this.element.nativeElement;
    const targets = host.matches("input,select,textarea")
      ? [host]
      : Array.from(
          host.querySelectorAll<HTMLElement>(
            "input,select,textarea,button.field,fieldset,[role=radiogroup]",
          ),
        );
    for (const target of targets) {
      if (!this.originals.has(target))
        this.originals.set(target, target.getAttribute("aria-invalid"));
      if (invalid) target.setAttribute("aria-invalid", "true");
      else {
        const original = this.originals.get(target);
        if (original !== null && original !== undefined)
          target.setAttribute("aria-invalid", original);
        else target.removeAttribute("aria-invalid");
      }
      const ids = (target.getAttribute("aria-describedby") ?? "")
        .split(/\s+/)
        .filter((id) => id && id !== this.id);
      if (visible) ids.push(this.id);
      if (ids.length) target.setAttribute("aria-describedby", ids.join(" "));
      else target.removeAttribute("aria-describedby");
    }
  }
  private show(
    mode: "inline" | "popover",
    messages: string[],
    config: {
      heading: string;
      live: "off" | "polite" | "assertive";
      appearance: ComponentAppearance;
      offset: number;
      width: string | null;
    },
  ): void {
    if (this.mode !== mode) this.hide();
    const width =
      config.width ??
      `${this.element.nativeElement.getBoundingClientRect().width}px`;
    if (!this.panel) {
      this.mode = mode;
      if (mode === "popover") {
        this.overlayRef = this.overlay.create({
          positionStrategy: this.position(config.offset),
          scrollStrategy: this.overlay.scrollStrategies.reposition(),
          width,
          maxWidth: "calc(100vw - 24px)",
        });
        const themeHost = this.element.nativeElement.closest("[data-theme]");
        const theme =
          themeHost !== this.element.nativeElement.ownerDocument.documentElement
            ? themeHost?.getAttribute("data-theme")
            : null;
        if (theme)
          this.overlayRef.overlayElement.setAttribute("data-theme", theme);
        this.panel = this.overlayRef.attach(
          new ComponentPortal(ValidationMessage, this.view),
        );
      } else {
        this.panel = this.view.createComponent(ValidationMessage);
        this.panel.location.nativeElement.style.marginTop = "8px";
        this.panel.location.nativeElement.style.width = width;
      }
    }
    if (this.overlayRef) {
      this.overlayRef.updateSize({ width, maxWidth: "calc(100vw - 24px)" });
      this.overlayRef.updatePositionStrategy(this.position(config.offset));
    } else this.panel.location.nativeElement.style.width = width;
    this.panel.setInput("id", this.id);
    this.panel.setInput("messages", messages);
    this.panel.setInput("heading", config.heading);
    this.panel.setInput("live", config.live);
    this.panel.setInput("styles", validationStyles(config.appearance));
  }
  private position(offset: number) {
    return this.overlay
      .position()
      .flexibleConnectedTo(this.element)
      .withViewportMargin(12)
      .withPush(true)
      .withPositions([
        {
          originX: "start",
          originY: "bottom",
          overlayX: "start",
          overlayY: "top",
          offsetY: offset,
        },
        {
          originX: "start",
          originY: "top",
          overlayX: "start",
          overlayY: "bottom",
          offsetY: -offset,
        },
      ]);
  }
  private hide(): void {
    if (this.overlayRef) this.overlayRef.dispose();
    else this.panel?.destroy();
    this.overlayRef = null;
    this.panel = null;
    this.mode = null;
  }
}
