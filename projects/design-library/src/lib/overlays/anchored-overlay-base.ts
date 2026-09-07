import {
  ComponentRef,
  DestroyRef,
  Directive,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
  effect,
  inject,
  input,
  model,
  output,
} from "@angular/core";
import { Overlay, type OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { Appearance } from "../shared/appearance";
import { FloatingPanel } from "./floating-panel";
import { anchorPositions, trackAnchor } from "./anchor-position";
export type AnchorPlacement =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-start"
  | "bottom-start"
  | "top-end"
  | "bottom-end";
let nextAnchor = 0;
@Directive({
  host: {
    "(mouseenter)": "enter()",
    "(mouseleave)": "leave()",
    "(focusin)": "focusIn()",
    "(focusout)": "focusOut($event)",
    "(click)": "click()",
    "(keydown.escape)": "escape($event)",
  },
})
export abstract class AnchoredOverlayBase extends Appearance {
  readonly id = input(`dl-floating-${++nextAnchor}`);
  readonly open = model(false);
  readonly disabled = input(false);
  readonly placement = input<AnchorPlacement>("top");
  readonly offset = input(8);
  readonly width = input<string | null>(null);
  readonly maxWidth = input("320px");
  readonly showDelay = input(150);
  readonly hideDelay = input(100);
  readonly closeOnEscape = input(true);
  readonly closeOnOutside = input(true);
  readonly panelClass = input("");
  readonly ariaLabel = input("Popover");
  readonly shown = output<void>();
  readonly hidden = output<void>();
  protected readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly overlay = inject(Overlay);
  private readonly view = inject(ViewContainerRef);
  private ref: OverlayRef | null = null;
  private panel: ComponentRef<FloatingPanel> | null = null;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private stopTracking: (() => void) | null = null;
  private focusTimer: ReturnType<typeof setTimeout> | undefined;
  protected abstract getContent(): string | TemplateRef<unknown> | null;
  protected abstract mode(): "hover" | "click" | "manual";
  protected abstract kind(): "tooltip" | "dialog";
  protected shouldFocus(): boolean {
    return false;
  }
  protected restore(): boolean {
    return true;
  }
  constructor() {
    super();
    effect(() => {
      const content = this.getContent();
      if (!this.open() || this.disabled() || !content) {
        this.dispose();
        if (this.disabled() && this.open()) this.open.set(false);
        return;
      }
      const strategy = this.overlay
        .position()
        .flexibleConnectedTo(this.element)
        .withPositions(anchorPositions(this.placement(), this.offset()))
        .withFlexibleDimensions(false)
        .withPush(true)
        .withViewportMargin(12);
      if (!this.ref) {
        this.ref = this.overlay.create({
          positionStrategy: strategy,
          scrollStrategy: this.overlay.scrollStrategies.reposition(),
          width: this.width() ?? undefined,
          maxWidth: `min(${this.maxWidth()}, calc(100vw - 24px))`,
          panelClass: this.panelClass(),
        });
        this.panel = this.ref.attach(
          new ComponentPortal(FloatingPanel, this.view),
        );
        this.stopTracking = trackAnchor(this.ref, this.element.nativeElement);
        const panelEl = this.ref.overlayElement;
        panelEl.addEventListener("mouseenter", () => this.clearTimer());
        panelEl.addEventListener("mouseleave", () => this.leave());
        panelEl.addEventListener("focusout", (e) => this.focusOut(e));
        this.ref.outsidePointerEvents().subscribe((e) => {
          if (
            this.closeOnOutside() &&
            !this.element.nativeElement.contains(e.target as Node)
          )
            this.close(false);
        });
        this.ref.keydownEvents().subscribe((e) => {
          if (e.key === "Escape") this.escape(e);
        });
        const theme = this.element.nativeElement
          .closest("[data-theme]")
          ?.getAttribute("data-theme");
        if (theme) panelEl.setAttribute("data-theme", theme);
        if (this.kind() === "tooltip") this.describe(true);
        this.shown.emit();
        if (this.shouldFocus())
          this.focusTimer = setTimeout(
            () =>
              this.ref?.overlayElement
                .querySelector<HTMLElement>(
                  'button:not(:disabled),input:not(:disabled),a[href],[tabindex="0"]',
                )
                ?.focus(),
            0,
          );
      } else {
        this.ref.updatePositionStrategy(strategy);
        this.ref.updateSize({
          width: this.width() ?? undefined,
          maxWidth: `min(${this.maxWidth()}, calc(100vw - 24px))`,
        });
      }
      this.panel!.setInput("text", typeof content === "string" ? content : "");
      this.panel!.setInput(
        "template",
        content instanceof TemplateRef ? content : null,
      );
      this.panel!.setInput("styles", this.appearanceStyles());
      this.panel!.setInput("id", this.id());
      this.panel!.setInput("role", this.kind());
      this.panel!.setInput("label", this.ariaLabel());
      // Measure the rendered content, not the initially empty portal.
      this.panel!.changeDetectorRef.detectChanges();
      this.ref!.updatePosition();
    });
    inject(DestroyRef).onDestroy(() => {
      this.clearTimer();
      clearTimeout(this.focusTimer);
      this.dispose();
    });
  }
  private describedId: string | null = null;
  private describe(add: boolean): void {
    const el = this.element.nativeElement;
    const ids = (el.getAttribute("aria-describedby") ?? "")
      .split(/\s+/)
      .filter(Boolean)
      .filter((id) => id !== this.describedId);
    this.describedId = add ? this.id() : null;
    if (add) ids.push(this.id());
    if (ids.length) el.setAttribute("aria-describedby", ids.join(" "));
    else el.removeAttribute("aria-describedby");
  }
  private dispose(): void {
    if (!this.ref) return;
    if (this.kind() === "tooltip") this.describe(false);
    this.stopTracking?.();
    this.stopTracking = null;
    this.ref.dispose();
    this.ref = null;
    this.panel = null;
    clearTimeout(this.focusTimer);
    this.hidden.emit();
  }
  private clearTimer(): void {
    clearTimeout(this.timer);
  }
  enter(): void {
    if (this.mode() !== "hover" || this.disabled()) return;
    this.clearTimer();
    this.timer = setTimeout(
      () => this.open.set(true),
      Math.max(0, this.showDelay()),
    );
  }
  leave(): void {
    if (this.mode() !== "hover") return;
    this.clearTimer();
    this.timer = setTimeout(
      () => {
        const active = this.element.nativeElement.ownerDocument.activeElement;
        if (
          !this.element.nativeElement.contains(active) &&
          !this.ref?.overlayElement.contains(active)
        )
          this.open.set(false);
      },
      Math.max(0, this.hideDelay()),
    );
  }
  focusIn(): void {
    if (this.mode() === "hover") this.enter();
  }
  focusOut(e: FocusEvent): void {
    if (this.mode() !== "hover") return;
    if (
      this.ref?.overlayElement.contains(e.relatedTarget as Node) ||
      this.element.nativeElement.contains(e.relatedTarget as Node)
    )
      return;
    this.clearTimer();
    this.timer = setTimeout(
      () => this.open.set(false),
      Math.max(0, this.hideDelay()),
    );
  }
  click(): void {
    if (this.mode() !== "click" || this.disabled()) return;
    this.clearTimer();
    this.open.update((v) => !v);
  }
  escape(e: Event): void {
    if (this.open() && this.closeOnEscape()) {
      e.preventDefault();
      e.stopPropagation();
      this.close(this.kind() === "dialog");
    }
  }
  close(focus = true): void {
    this.clearTimer();
    this.open.set(false);
    if (focus && this.restore()) this.element.nativeElement.focus();
  }
}
