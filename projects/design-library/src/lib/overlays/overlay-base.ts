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
  readonly autoFocus = input("first-tabbable");
  readonly restoreFocus = input(true);
  readonly scrollStrategy = input<"block" | "noop" | "reposition">("block");
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();
  readonly closed = output<OverlayCloseReason>();
  protected readonly defaultPlacement: "center" | "right" | "bottom" = "center";
  protected readonly dialogRole: "dialog" | "alertdialog" = "dialog";
  private readonly template = viewChild<TemplateRef<unknown>>("overlayContent");
  private readonly dialog = inject(Dialog);
  private readonly overlay = inject(Overlay);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private ref: DialogRef<OverlayCloseReason> | null = null;
  constructor() {
    super();
    effect(() => {
      const template = this.template();
      if (!this.open()) {
        this.ref?.close("programmatic");
        return;
      }
      if (!template) return;
      const placement =
        this.placement() === "auto" ? this.defaultPlacement : this.placement();
      const widths = { sm: "360px", md: "560px", lg: "800px", full: "100vw" };
      const width =
        this.width() ??
        (placement === "bottom" ? "100vw" : widths[this.size()]);
      const height =
        this.height() ??
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
    inject(DestroyRef).onDestroy(() => this.ref?.close("destroy"));
  }
  requestClose(reason: OverlayCloseReason = "close"): void {
    if (!this.busy()) this.ref?.close(reason);
  }
  cancel(): void {
    if (this.busy()) return;
    this.cancelled.emit();
    this.requestClose("cancel");
  }
  confirm(): void {
    if (this.busy() || this.confirmDisabled()) return;
    this.confirmed.emit();
    if (this.closeOnConfirm()) this.requestClose("confirm");
  }
}
export const overlayTemplate = `<ng-template #overlayContent><div class="surface" [style]="appearanceStyles()" [style.padding]="appearance().padding ?? padding()" [style.border-radius]="appearance().radius ?? radius()">
 @if(showHeader()){<header><div><h2 [id]="id()+'-title'">{{heading()}}</h2>@if(description()){<p [id]="id()+'-description'">{{description()}}</p>}</div>@if(showClose()){<button class="close" type="button" [attr.aria-label]="closeLabel()" [disabled]="busy()" (click)="requestClose()">×</button>}</header>}
 @if(!showHeader()&&showClose()){<button class="close standalone" type="button" [attr.aria-label]="closeLabel()" [disabled]="busy()" (click)="requestClose()">×</button>}
 @if(!showHeader()&&description()){<p [id]="id()+'-description'">{{description()}}</p>}
 <div class="body"><ng-content/></div>
 @if(showFooter()){<footer><ng-content select="[overlayFooter]"/>@if(showCancel()){<button dlButton class="cancel" variant="secondary" [disabled]="busy()" (click)="cancel()">{{cancelLabel()}}</button>}@if(showConfirm()){<button dlButton [variant]="confirmVariant()" [disabled]="confirmDisabled()" [loading]="busy()" (click)="confirm()">{{confirmLabel()}}</button>}</footer>}
</div></ng-template>`;
export const overlayStyles = `:host{display:contents}.surface{box-sizing:border-box;width:100%;height:100%;max-height:100dvh;display:flex;flex-direction:column;gap:var(--dl-ui-gap, 24px);background:var(--dl-ui-background, var(--dl-surface));background-image:var(--dl-card-sheen);border:var(--dl-ui-border-width, 1px) solid var(--dl-ui-border-color, var(--dl-border));color:var(--dl-ui-color, var(--dl-text));font: var(--dl-ui-font-size, 14px) var(--dl-font);box-shadow:var(--dl-ui-shadow, 0 24px 80px #0006)}header{display:flex;align-items:flex-start;justify-content:space-between;gap:var(--dl-ui-gap, 20px)}h2{margin:0;font-size:var(--dl-ui-font-size, 22px);letter-spacing:-.6px;font-weight:600}p{color:var(--dl-ui-color, var(--dl-muted));line-height:1.6;margin:8px 0 0}.body{overflow:auto;min-height:0;flex:1;line-height:1.7}footer{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:var(--dl-ui-gap, 12px);margin-top:auto}.close{border:0;background:var(--dl-ui-background, transparent);color:var(--dl-ui-color, var(--dl-muted));font: var(--dl-ui-font-size, 24px) var(--dl-font);cursor:pointer;width:32px;height:32px;flex-shrink:0}.standalone{align-self:flex-end}.close:focus-visible{outline:2px solid var(--dl-ui-focus-color, var(--dl-focus));outline-offset:2px}.close:disabled{opacity:.5;cursor:not-allowed}
.surface{overflow:auto;overscroll-behavior:contain}
header,footer{flex-shrink:0}
header>div{min-width:0;overflow-wrap:anywhere}
.body{overflow-wrap:anywhere}
@media(max-width:600px),(max-height:480px){
  .surface{gap:var(--dl-ui-gap,16px)}
  footer>button{max-width:100%;overflow-wrap:anywhere}
}
`;
