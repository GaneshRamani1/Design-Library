import {
  afterNextRender,
  afterRenderEffect,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from "@angular/core";
import { FormControlBase } from "./form-control-base";
/** Shared top-layer positioning and dismissal for custom selection controls. */
@Directive({
  host: {
    "(document:pointerdown)": "outside($event)",
    "(keydown.escape)": "escape($event)",
    "(focusout)": "leave($event)",
  },
})
export abstract class PopoverControlBase<T> extends FormControlBase<T> {
  readonly opened = signal(false);
  protected readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly trigger =
    viewChild<ElementRef<HTMLButtonElement>>("trigger");
  protected readonly panel = viewChild<ElementRef<HTMLDivElement>>("panel");
  protected readonly destroyRef = inject(DestroyRef);
  constructor() {
    super();
    effect(() => {
      if (this.isDisabled()) this.dismiss();
    });
    afterRenderEffect(() => {
      if (this.opened()) this.positionPanel();
    });
    afterNextRender(() => {
      const document = this.element.nativeElement.ownerDocument;
      const reposition = () => {
        if (this.opened()) this.positionPanel();
      };
      document.addEventListener("scroll", reposition, true);
      document.defaultView?.addEventListener("resize", reposition);
      document.defaultView?.visualViewport?.addEventListener(
        "resize",
        reposition,
      );
      document.defaultView?.visualViewport?.addEventListener(
        "scroll",
        reposition,
      );
      this.destroyRef.onDestroy(() => {
        document.removeEventListener("scroll", reposition, true);
        document.defaultView?.removeEventListener("resize", reposition);
        document.defaultView?.visualViewport?.removeEventListener(
          "resize",
          reposition,
        );
        document.defaultView?.visualViewport?.removeEventListener(
          "scroll",
          reposition,
        );
      });
    });
  }
  protected requestedPanelWidth(anchorWidth: number): number {
    return anchorWidth;
  }
  protected positionPanel(): void {
    const panel = this.panel()?.nativeElement;
    const trigger = this.trigger()?.nativeElement;
    const view = this.element.nativeElement.ownerDocument.defaultView;
    if (!panel || !trigger || !view) return;
    const anchor = trigger.getBoundingClientRect();
    const viewport = view.visualViewport;
    const viewportWidth = viewport?.width ?? view.innerWidth;
    const viewportHeight = viewport?.height ?? view.innerHeight;
    const viewportLeft = viewport?.offsetLeft ?? 0;
    const viewportTop = viewport?.offsetTop ?? 0;
    panel.style.width = `${Math.min(this.requestedPanelWidth(anchor.width), Math.max(0, viewportWidth - 24))}px`;
    panel.style.maxHeight = `${Math.max(0, viewportHeight - 24)}px`;
    const height = panel.getBoundingClientRect().height;
    const below = viewportTop + viewportHeight - anchor.bottom - 12;
    const top =
      below < height && anchor.top - viewportTop > below
        ? anchor.top - height - 8
        : anchor.bottom + 8;
    panel.style.left = `${Math.max(viewportLeft + 12, Math.min(anchor.left, viewportLeft + viewportWidth - panel.offsetWidth - 12))}px`;
    panel.style.top = `${Math.max(viewportTop + 12, Math.min(top, viewportTop + viewportHeight - height - 12))}px`;
  }
  protected dismiss(): void {
    this.opened.set(false);
    this.panel()?.nativeElement.hidePopover?.();
  }
  toggle(): void {
    if (!this.isDisabled()) {
      if (this.opened()) {
        this.close();
        return;
      }
      this.opened.set(true);
      this.panel()?.nativeElement.showPopover();
      this.positionPanel();
    }
  }
  close(): void {
    this.dismiss();
    this.trigger()?.nativeElement.focus();
    this.onTouched();
  }
  escape(event: Event): void {
    if (this.opened()) {
      event.preventDefault();
      event.stopPropagation();
      this.close();
    }
  }
  outside(event: Event): void {
    if (
      this.opened() &&
      !this.element.nativeElement.contains(event.target as Node)
    ) {
      this.dismiss();
      this.onTouched();
    }
  }
  leave(event: FocusEvent): void {
    if (
      !this.element.nativeElement.contains(event.relatedTarget as Node | null)
    ) {
      this.dismiss();
      this.onTouched();
    }
  }
}
