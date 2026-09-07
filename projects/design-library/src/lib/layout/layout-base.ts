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
    "[style.--dl-layout-display]": "layout()",
    "[style.--dl-layout-direction]": "direction()",
    "[style.--dl-layout-align]": "align()",
    "[style.--dl-layout-justify]": "justify()",
    "[style.flex-wrap]": "wrap() ? 'wrap' : 'nowrap'",
    "[style.--dl-layout-gap]": "appearance().gap ?? length(gap())",
    "[style.--dl-layout-padding]": "appearance().padding ?? length(padding())",
    "[style.--dl-layout-mobile-direction]": "mobileDirection() ?? direction()",
    "[style.--dl-layout-mobile-align]": "mobileAlign() ?? align()",
    "[style.--dl-layout-mobile-justify]": "mobileJustify() ?? justify()",
    "[style.--dl-layout-mobile-gap]": "mobileGap() === null ? (appearance().gap ?? length(gap())) : length(mobileGap()!)",
    "[style.--dl-layout-mobile-padding]": "mobilePadding() === null ? (appearance().padding ?? length(padding())) : length(mobilePadding()!)",
    "[style.height]": "length(height())",
    "[style.min-height]": "length(minHeight())",
    "[style.max-width]": "widths[size()]",
    "[style.width]": "stretch() ? '100%' : 'fit-content'",
    "[style.flex-grow]": "flexGrow() ?? (stretch() ? 1 : 0)",
    "[style.flex-shrink]": "flexShrink() ?? (stretch() ? 1 : 0)",
    "[style.flex-basis]": "flexBasis() === null ? (stretch() ? '0%' : 'auto') : length(flexBasis()!)",
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
  readonly flexGrow = input<number | null>(null);
  readonly flexShrink = input<number | null>(null);
  readonly flexBasis = input<LayoutLength | null>(null);
  readonly mobileDirection = input<"row" | "column" | null>(null);
  readonly mobileAlign = input<"stretch" | "flex-start" | "center" | "flex-end" | "baseline" | null>(null);
  readonly mobileJustify = input<"flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly" | null>(null);
  readonly mobileGap = input<LayoutLength | null>(null);
  readonly mobilePadding = input<LayoutLength | null>(null);
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
  :host { display:var(--dl-layout-display); flex-direction:var(--dl-layout-direction); align-items:var(--dl-layout-align); justify-content:var(--dl-layout-justify); gap:var(--dl-layout-gap); padding:var(--dl-layout-padding); box-sizing: border-box; border:var(--dl-ui-border-width,0) solid var(--dl-ui-border-color,transparent);border-radius:var(--dl-ui-radius,0);background:var(--dl-ui-background,transparent);box-shadow:var(--dl-ui-shadow,none); min-width: 0; max-width: 100%; color: var(--dl-ui-color, var(--dl-text)); font: var(--dl-ui-font-size, 14px) var(--dl-font); }
  @media(max-width:600px){:host{flex-direction:var(--dl-layout-mobile-direction);align-items:var(--dl-layout-mobile-align);justify-content:var(--dl-layout-mobile-justify);gap:var(--dl-layout-mobile-gap);padding:var(--dl-layout-mobile-padding)}}
`;
