import { Appearance } from "../shared/appearance";
import { Directive, input } from "@angular/core";

export type LayoutSize = "sm" | "md" | "lg" | "xl" | "full";
export type LayoutLength = string | number;
export function cssLength(value: LayoutLength): string {
  return typeof value === "number" ? `${value}px` : value;
}
/** Shared responsive sizing and flex props. Numeric lengths are pixels. */
@Directive({
  host: {
    "[style.display]": "layout()",
    "[style.flex-direction]": "direction()",
    "[style.align-items]": "align()",
    "[style.justify-content]": "justify()",
    "[style.flex-wrap]": "wrap() ? 'wrap' : 'nowrap'",
    "[style.gap]": "appearance().gap ?? length(gap())",
    "[style.padding]": "appearance().padding ?? length(padding())",
    "[style.height]": "length(height())",
    "[style.min-height]": "length(minHeight())",
    "[style.max-width]": "widths[size()]",
    "[style.width]": "stretch() ? '100%' : 'fit-content'",
    "[style.flex]": "stretch() ? '1 1 0%' : '0 0 auto'",
  },
})
export abstract class LayoutBase extends Appearance {
  readonly size = input<LayoutSize>("full");
  readonly stretch = input(true);
  readonly layout = input<"block" | "flex">("flex");
  readonly direction = input<"row" | "column">("column");
  readonly align = input<
    "stretch" | "flex-start" | "center" | "flex-end" | "baseline"
  >("stretch");
  readonly justify = input<
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-between"
    | "space-around"
    | "space-evenly"
  >("flex-start");
  readonly wrap = input(false);
  readonly gap = input<LayoutLength>(16);
  readonly padding = input<LayoutLength>(24);
  readonly height = input<LayoutLength>("auto");
  readonly minHeight = input<LayoutLength>(0);
  protected readonly length = cssLength;
  protected readonly widths: Record<LayoutSize, string> = {
    sm: "480px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    full: "100%",
  };
}
export const layoutStyles = `
  :host { box-sizing: border-box; border:var(--dl-ui-border-width,0) solid var(--dl-ui-border-color,transparent);border-radius:var(--dl-ui-radius,0);background:var(--dl-ui-background,transparent);box-shadow:var(--dl-ui-shadow,none); min-width: 0; max-width: 100%; color: var(--dl-ui-color, var(--dl-text)); font: var(--dl-ui-font-size, 14px) var(--dl-font); }
`;
