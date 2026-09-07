import { Directive, input } from "@angular/core";
import { AnchoredOverlayBase } from "./anchored-overlay-base";
/** Hover/focus help text; use popover for interactive content. */
@Directive({ selector: "[dlTooltip]", standalone: true })
export class TooltipDirective extends AnchoredOverlayBase {
  readonly dlTooltip = input("");
  readonly trigger = input<"hover" | "longpress" | "manual">("hover");
  protected getContent() {
    return this.dlTooltip();
  }
  protected mode() {
    return this.trigger();
  }
  protected kind() {
    return "tooltip" as const;
  }
}
