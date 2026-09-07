import {
  Directive,
  DestroyRef,
  ElementRef,
  TemplateRef,
  effect,
  inject,
  input,
  model,
  output,
  viewChild,
  signal,
  afterNextRender,
} from "@angular/core";
import { Dialog, DialogRef } from "@angular/cdk/dialog";
import { Overlay } from "@angular/cdk/overlay";
import { Appearance } from "../shared/appearance";
export type OverlayCloseReason =
  | "close"
  | "backdrop"
  | "escape"
  | "cancel"
  | "confirm"
  | "programmatic"
  | "destroy";
let nextOverlayId = 0;
@Directive()
export abstract class OverlayBase extends Appearance {
  readonly id = input(`dl-overlay-${++nextOverlayId}`);
  readonly open = model(false);
  readonly heading = input("Dialog");
  readonly description = input("");
  readonly ariaLabel = input("Dialog");
  readonly size = input<"sm" | "md" | "lg" | "full">("md");
  readonly width = input<string | null>(null);
  readonly height = input<string | null>(null);
  readonly maxWidth = input("100vw");
  readonly maxHeight = input("100dvh");
  readonly placement = input<"auto" | "center" | "left" | "right" | "bottom">(
    "auto",
  );
  readonly padding = input("24px");
  readonly radius = input("var(--dl-card-radius)");
  readonly hasBackdrop = input(true);
  readonly backdropClass = input("dl-overlay-backdrop");
  readonly panelClass = input("");
  readonly closeOnBackdrop = input(true);
  readonly closeOnEscape = input(true);
  readonly showHeader = input(true);
  readonly showClose = input(true);
  readonly closeLabel = input("Close dialog");
  readonly showFooter = input(true);
  readonly showCancel = input(true);
  readonly showConfirm = input(true);
  readonly cancelLabel = input("Cancel");
  readonly confirmLabel = input("Continue");
  readonly confirmVariant = input<"primary" | "secondary" | "danger">(
    "primary",
  );
  readonly closeOnConfirm = input(true);
  readonly confirmDisabled = input(false);
  readonly busy = input(false);
  readonly error = input("");
  readonly confirmationPhrase = input("");
  readonly confirmationValue = model("");
  readonly confirmationLabel = input("Type the confirmation phrase to continue");
  readonly autoFocus = input("first-tabbable");
  readonly restoreFocus = input(true);
  readonly scrollStrategy = input<"block" | "noop" | "reposition">("block");
  readonly fullScreenOnMobile = input(false);
  readonly mobileBreakpoint = input(600);
  readonly showDragHandle = input(false);
  readonly snapPoints = input<string[]>([]);
  readonly activeSnap = model(0);
  readonly snapChanged = output<{ index: number; height: string }>();
  /** Emits closeRequested without closing, allowing an application to run an async guard and update open itself. */
  readonly controlledClose = input(false);
  /** Return false, or a promise resolving false, to keep the overlay open. */
  readonly beforeClose = input<
    ((reason: OverlayCloseReason) => boolean | Promise<boolean>) | null
  >(null);
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();
  readonly closed = output<OverlayCloseReason>();
  readonly closeRequested = output<OverlayCloseReason>();
  readonly closeBlocked = output<OverlayCloseReason>();
  readonly closeGuardError = output<unknown>();
  protected readonly defaultPlacement: "center" | "right" | "bottom" = "center";
  protected readonly dialogRole: "dialog" | "alertdialog" = "dialog";
  private readonly template = viewChild<TemplateRef<unknown>>("overlayContent");
  private readonly dialog = inject(Dialog);
  private readonly overlay = inject(Overlay);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private ref: DialogRef<OverlayCloseReason> | null = null;
  private readonly viewportWidth = signal(Infinity);
  constructor() {
    super();
    afterNextRender(() => {
      const view = this.element.nativeElement.ownerDocument.defaultView;
      if (!view) return;
      const measure = () => this.viewportWidth.set(view.innerWidth);
      measure();
      view.addEventListener("resize", measure);
      this.destroyRef.onDestroy(() => view.removeEventListener("resize", measure));
    });
    effect(() => {
      const template = this.template();
      if (!this.open()) {
        this.ref?.close("programmatic");
        return;
      }
      if (!template) return;
      const requestedPlacement = this.placement();
      const placement =
        requestedPlacement === "auto" ? this.defaultPlacement : requestedPlacement;
      const widths = { sm: "360px", md: "560px", lg: "800px", full: "100vw" };
      const mobileFull = this.fullScreenOnMobile() && this.viewportWidth() <= Math.max(0, this.mobileBreakpoint());
      const width = mobileFull ? "100vw" : this.width() ?? (placement === "bottom" ? "100vw" : widths[this.size()]);
      const height = mobileFull ? "100dvh" : this.resolvedHeight(
        placement,
      ) ??
        (placement === "left" || placement === "right" ? "100dvh" : "auto");
      const strategy = this.overlay.position().global();
      if (placement === "left") strategy.left("0").top("0");
      else if (placement === "right") strategy.right("0").top("0");
      else if (placement === "bottom")
        strategy.centerHorizontally().bottom("0");
      else strategy.centerHorizontally().centerVertically();
      const maxWidth = this.maxWidth(),
        maxHeight = this.maxHeight();
      const accessibleName = this.showHeader()
        ? this.heading()
        : this.ariaLabel();
      const descriptionId = this.description()
        ? this.id() + "-description"
        : null;
      if (this.ref) {
        this.ref.overlayRef.updateSize({ width, height, maxWidth, maxHeight });
        const container = this.ref.overlayRef.overlayElement.querySelector(
          '[role="dialog"], [role="alertdialog"]',
        );
        container?.setAttribute("aria-label", accessibleName);
        if (descriptionId)
          container?.setAttribute("aria-describedby", descriptionId);
        else container?.removeAttribute("aria-describedby");
        this.ref.overlayRef.updatePositionStrategy(strategy);
        return;
      }
      const ref = this.dialog.open<OverlayCloseReason>(template, {
        id: this.id(),
        role: this.dialogRole,
        width,
        height,
        maxWidth,
        maxHeight,
        positionStrategy: strategy,
        hasBackdrop: this.hasBackdrop(),
        backdropClass: this.backdropClass(),
        panelClass: ["dl-overlay-panel", this.panelClass()].filter(Boolean),
        disableClose: true,
        autoFocus: this.autoFocus(),
        restoreFocus: this.restoreFocus(),
        ariaLabel: accessibleName,
        ariaDescribedBy: this.description()
          ? this.id() + "-description"
          : undefined,
        scrollStrategy: this.overlay.scrollStrategies[this.scrollStrategy()](),
      });
      this.ref = ref;
      const themeHost = this.element.nativeElement.closest("[data-theme]");
      if (
        themeHost &&
        themeHost !== this.element.nativeElement.ownerDocument.documentElement
      )
        ref.overlayRef.overlayElement.setAttribute(
          "data-theme",
          themeHost.getAttribute("data-theme")!,
        );
      ref.backdropClick.subscribe(() => {
        if (this.closeOnBackdrop()) this.requestClose("backdrop");
      });
      ref.keydownEvents.subscribe((event) => {
        if (event.key === "Escape" && this.closeOnEscape()) {
          event.preventDefault();
          this.requestClose("escape");
        }
      });
      ref.closed.subscribe((reason) => {
        this.ref = null;
        this.open.set(false);
        this.closed.emit(reason ?? "programmatic");
      });
    });
    this.destroyRef.onDestroy(() => this.ref?.close("destroy"));
  }
  async requestClose(reason: OverlayCloseReason = "close"): Promise<void> {
    if (this.busy()) return;
    this.closeRequested.emit(reason);
    if (this.controlledClose()) return;
    try {
      if ((await this.beforeClose()?.(reason)) === false) {
        this.closeBlocked.emit(reason);
        return;
      }
      this.ref?.close(reason);
    } catch (error) {
      this.closeGuardError.emit(error);
    }
  }
  cancel(): void {
    if (this.busy()) return;
    this.cancelled.emit();
    this.requestClose("cancel");
  }
  confirm(): void {
    if (this.confirmUnavailable()) return;
    this.confirmed.emit();
    if (this.closeOnConfirm()) this.requestClose("confirm");
  }
  confirmUnavailable(): boolean {
    return this.busy() || this.confirmDisabled() || (!!this.confirmationPhrase() && this.confirmationValue() !== this.confirmationPhrase());
  }
  protected resolvedHeight(_placement: "center" | "left" | "right" | "bottom"): string | null {
    const points = this.snapPoints();
    return points.length ? points[Math.max(0, Math.min(points.length - 1, this.activeSnap()))]! : this.height();
  }
  private dragStartY: number | null = null;
  startSheetDrag(event: PointerEvent): void {
    if (!this.showDragHandle()) return;
    this.dragStartY = event.clientY;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }
  endSheetDrag(event: PointerEvent): void {
    if (this.dragStartY === null || !this.snapPoints().length) return;
    const delta = event.clientY - this.dragStartY;
    const direction = Math.abs(delta) < 32 ? 0 : delta > 0 ? -1 : 1;
    const index = Math.max(0, Math.min(this.snapPoints().length - 1, this.activeSnap() + direction));
    this.dragStartY = null;
    if (index !== this.activeSnap()) {
      this.activeSnap.set(index);
      this.snapChanged.emit({ index, height: this.snapPoints()[index]! });
    }
  }
}
export const overlayTemplate = `<ng-template #overlayContent><div class="surface" [style]="appearanceStyles()" [style.padding]="appearance().padding ?? padding()" [style.border-radius]="appearance().radius ?? radius()">@if(showDragHandle()){<button type="button" class="drag-handle" aria-label="Resize sheet" (pointerdown)="startSheetDrag($event)" (pointerup)="endSheetDrag($event)" (pointercancel)="endSheetDrag($event)"><span></span></button>}
 @if(showHeader()){<header><div><h2 [id]="id()+'-title'">{{heading()}}</h2>@if(description()){<p [id]="id()+'-description'">{{description()}}</p>}</div>@if(showClose()){<button class="close" type="button" [attr.aria-label]="closeLabel()" [disabled]="busy()" (click)="requestClose()">×</button>}</header>}
 @if(!showHeader()&&showClose()){<button class="close standalone" type="button" [attr.aria-label]="closeLabel()" [disabled]="busy()" (click)="requestClose()">×</button>}
 @if(!showHeader()&&description()){<p [id]="id()+'-description'">{{description()}}</p>}
 <div class="body"><ng-content/>@if(error()){<p class="overlay-error" role="alert">{{error()}}</p>}@if(confirmationPhrase()){<label class="confirmation">{{confirmationLabel()}}<strong>{{confirmationPhrase()}}</strong><input [value]="confirmationValue()" [disabled]="busy()" (input)="confirmationValue.set($any($event.target).value)"/></label>}</div>
 @if(showFooter()){<footer><ng-content select="[overlayFooter]"/>@if(showCancel()){<button dlButton class="cancel" variant="secondary" [disabled]="busy()" (click)="cancel()">{{cancelLabel()}}</button>}@if(showConfirm()){<button dlButton [variant]="confirmVariant()" [disabled]="confirmUnavailable()" [loading]="busy()" (click)="confirm()">{{confirmLabel()}}</button>}</footer>}
</div></ng-template>`;
export const overlayStyles = `:host{display:contents}.surface{box-sizing:border-box;width:100%;height:100%;max-height:100dvh;display:flex;flex-direction:column;gap:var(--dl-ui-gap, 24px);background:var(--dl-ui-background, var(--dl-surface));background-image:var(--dl-card-sheen);border:var(--dl-ui-border-width, 1px) solid var(--dl-ui-border-color, var(--dl-border));color:var(--dl-ui-color, var(--dl-text));font: var(--dl-ui-font-size, 14px) var(--dl-font);box-shadow:var(--dl-ui-shadow, 0 24px 80px #0006)}header{display:flex;align-items:flex-start;justify-content:space-between;gap:var(--dl-ui-gap, 20px)}h2{margin:0;font-size:var(--dl-ui-font-size, 22px);letter-spacing:-.6px;font-weight:600}p{color:var(--dl-ui-color, var(--dl-muted));line-height:1.6;margin:8px 0 0}.body{overflow:auto;min-height:0;flex:1;line-height:1.7}footer{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:var(--dl-ui-gap, 12px);margin-top:auto}.close{border:0;background:var(--dl-ui-background, transparent);color:var(--dl-ui-color, var(--dl-muted));font: var(--dl-ui-font-size, 24px) var(--dl-font);cursor:pointer;width:32px;height:32px;flex-shrink:0}.standalone{align-self:flex-end}.close:focus-visible{outline:2px solid var(--dl-ui-focus-color, var(--dl-focus));outline-offset:2px}.close:disabled{opacity:.5;cursor:not-allowed}
.surface{overflow:auto;overscroll-behavior:contain}
header,footer{flex-shrink:0}
header>div{min-width:0;overflow-wrap:anywhere}
.body{overflow-wrap:anywhere}
.overlay-error{color:var(--dl-danger-text)}.confirmation{display:grid;gap:8px;margin-top:16px}.confirmation input{min-height:42px;border:1px solid var(--dl-border);border-radius:var(--dl-radius);background:var(--dl-surface);color:var(--dl-text);padding:0 12px;font:inherit}.drag-handle{align-self:center;width:64px;height:24px;border:0;background:transparent;padding:8px;touch-action:none;cursor:ns-resize}.drag-handle span{display:block;height:4px;border-radius:4px;background:var(--dl-muted)}
@media(max-width:600px),(max-height:480px){
  .surface{gap:var(--dl-ui-gap,16px)}
  footer>button{max-width:100%;overflow-wrap:anywhere}
}
`;
