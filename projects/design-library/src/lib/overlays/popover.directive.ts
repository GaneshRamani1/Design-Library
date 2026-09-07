import { Directive, TemplateRef, input } from "@angular/core";
import { AnchoredOverlayBase } from "./anchored-overlay-base";
/** Nonmodal anchored content. A TemplateRef supports arbitrary interactive content. */
@Directive({
  selector: "[dlPopover]",
  standalone: true,
  exportAs: "dlPopover",
  host: {
    "[attr.aria-expanded]": "open()",
    "[attr.aria-haspopup]": "'dialog'",
    "[attr.aria-controls]": "open()?id():null",
  },
})
export class PopoverDirective extends AnchoredOverlayBase {
  readonly dlPopover = input<string | TemplateRef<unknown> | null>(null);
  readonly trigger = input<"click" | "hover" | "manual">("click");
  readonly autoFocus = input(true);
  readonly restoreFocus = input(true);
  protected getContent() {
    return this.dlPopover();
  }
  protected mode() {
    return this.trigger();
  }
  protected kind() {
    return "dialog" as const;
  }
  protected override shouldFocus() {
    return this.autoFocus();
  }
  protected override restore() {
    return this.restoreFocus();
  }
}
