import {
  Directive,
  DestroyRef,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { ToneAppearance } from "../shared/tone";
export type NoticeDismissReason = "close" | "timeout" | "action" | "secondary-action";
@Directive()
export abstract class NoticeBase extends ToneAppearance {
  readonly message = input("Your changes have been saved.");
  readonly heading = input("");
  readonly icon = input("");
  readonly showIcon = input(true);
  readonly dismissible = input(true);
  readonly dismissLabel = input("Dismiss notification");
  readonly actionLabel = input("");
  readonly closeOnAction = input(true);
  readonly secondaryActionLabel = input("");
  readonly closeOnSecondaryAction = input(true);
  readonly duration = input(5000);
  readonly pauseOnHover = input(true);
  readonly showProgress = input(false);
  readonly visible = model(true);
  readonly live = input<"polite" | "assertive" | "off">("polite");
  readonly dismissed = output<NoticeDismissReason>();
  readonly action = output<void>();
  readonly secondaryAction = output<void>();
  readonly resolvedIcon = computed(
    () =>
      this.icon() ||
      {
        neutral: "bell",
        info: "info",
        success: "circle-check",
        warning: "triangle-alert",
        danger: "circle-x",
        custom: "bell",
      }[this.tone()],
  );
  readonly progress = signal(100);
  private timer: ReturnType<typeof setInterval> | undefined;
  private remaining = 0;
  private last = 0;
  private hovered = false;
  private focused = false;
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  constructor() {
    super();
    effect(() => {
      clearInterval(this.timer);
      if (!this.visible()) return;
      this.remaining = Math.max(0, this.duration());
      this.progress.set(100);
      this.last = Date.now();
      if (!this.browser || this.remaining === 0) return;
      this.timer = setInterval(() => {
        const now = Date.now(),
          elapsed = now - this.last;
        this.last = now;
        if ((this.pauseOnHover() && this.hovered) || this.focused) return;
        this.remaining -= elapsed;
        this.progress.set(
          Math.max(0, (100 * this.remaining) / Math.max(1, this.duration())),
        );
        if (this.remaining <= 0) this.dismiss("timeout");
      }, 50);
    });
    inject(DestroyRef).onDestroy(() => clearInterval(this.timer));
  }
  hover(value: boolean): void {
    this.hovered = value;
    this.last = Date.now();
  }
  focus(value: boolean): void {
    this.focused = value;
    this.last = Date.now();
  }
  dismiss(reason: NoticeDismissReason = "close"): void {
    if (!this.visible()) return;
    clearInterval(this.timer);
    this.visible.set(false);
    this.dismissed.emit(reason);
  }
  act(): void {
    this.action.emit();
    if (this.closeOnAction()) this.dismiss("action");
  }
  actSecondary(): void {
    this.secondaryAction.emit();
    if (this.closeOnSecondaryAction()) this.dismiss("secondary-action");
  }
}
export const noticeTemplate = `@if(visible()){<div class="notice" [attr.role]="live()==='assertive'?'alert':live()==='polite'?'status':null" [attr.aria-live]="live()" aria-atomic="true" (mouseenter)="hover(true)" (mouseleave)="hover(false)" (focusin)="focus(true)" (focusout)="focus(false)">@if(showIcon()){<dl-icon [name]="resolvedIcon()" [size]="20"/>}<div class="copy">@if(heading()){<strong>{{heading()}}</strong>}<span>{{message()}}</span><ng-content/></div>@if(secondaryActionLabel()){<button class="secondary-action" type="button" (click)="actSecondary()">{{secondaryActionLabel()}}</button>}@if(actionLabel()){<button class="action" type="button" (click)="act()">{{actionLabel()}}</button>}@if(dismissible()){<button class="close" type="button" [attr.aria-label]="dismissLabel()" (click)="dismiss()"><dl-icon name="x" [size]="16"/></button>}@if(showProgress()&&duration()>0){<span class="progress" aria-hidden="true" [style.width.%]="progress()"></span>}</div>}`;
export const noticeStyles = `:host{display:block;width:380px;max-width:100%;font:var(--dl-ui-font-size,14px)/1.5 var(--dl-font);color:var(--dl-ui-color,var(--tone-text))}.notice{position:relative;display:flex;align-items:center;gap:var(--dl-ui-gap,12px);padding:var(--dl-ui-padding,16px);border:var(--dl-ui-border-width,1px) solid var(--dl-ui-border-color,var(--tone-border));border-radius:var(--dl-ui-radius,var(--dl-radius));background:var(--dl-ui-background,var(--tone-bg));box-shadow:var(--dl-ui-shadow,0 8px 32px #0003);overflow:hidden;box-sizing:border-box}.copy{display:flex;flex-direction:column;gap:4px;flex:1;min-width:0;overflow-wrap:anywhere}strong{font-weight:600}button{flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;background:transparent;border:0;color:inherit;font:600 13px var(--dl-font);padding:6px;cursor:pointer}button:focus-visible{outline:2px solid var(--dl-ui-focus-color,var(--dl-focus));outline-offset:2px;border-radius:4px}.progress{position:absolute;height:2px;background:currentColor;bottom:0;left:0}:host([data-size=sm]) .notice{padding:var(--dl-ui-padding,10px);font-size:12px}:host([data-size=lg]) .notice{padding:var(--dl-ui-padding,20px);font-size:16px}
:host{box-sizing:border-box;min-width:0}
@media(max-width:480px){
  .notice{flex-wrap:wrap}
  .copy{flex-basis:calc(100% - 40px)}
  .action,.secondary-action{max-width:100%;white-space:normal;overflow-wrap:anywhere}
}
`;
