import { Component, input } from "@angular/core";
import { Appearance } from "../shared/appearance";
@Component({
  selector: "dl-divider",
  standalone: true,
  template: `@if (label()) {
    <span>{{ label() }}</span>
  }`,
  host: {
    role: "separator",
    "[attr.aria-orientation]": "orientation()",
    "[attr.aria-label]": "label()||null",
    "[attr.data-orientation]": "orientation()",
    "[style.--divider-color]": "color()",
    "[style.--divider-width]": "thickness()",
    "[style.--divider-style]": "lineStyle()",
    "[style.margin]": "margin()",
    "[style.--divider-inset]": "inset()",
  },
  styles: [
    `
      :host {
        display: flex;
        align-items: center;
        gap: var(--dl-ui-gap, 12px);
        font: var(--dl-ui-font-size, 12px) var(--dl-font);
        color: var(--dl-ui-color, var(--dl-muted));
        width: 100%;
        box-sizing: border-box;
        padding-inline: var(--divider-inset);
      }
      :host:before,
      :host:after {
        content: "";
        flex: 1;
        border-top: var(--divider-width) var(--divider-style)
          var(--dl-ui-border-color, var(--divider-color));
      }
      :host:not(:has(span)):after {
        display: none;
      }
      :host([data-orientation="vertical"]) {
        align-self: stretch;
        width: auto;
        min-height: 24px;
        padding-inline: 0;
        flex-direction: column;
      }
      :host([data-orientation="vertical"]):before,
      :host([data-orientation="vertical"]):after {
        border-top: 0;
        border-left: var(--divider-width) var(--divider-style)
          var(--dl-ui-border-color, var(--divider-color));
      }
      span {
        white-space: nowrap;
      }
    `,
  ],
})
export class DividerComponent extends Appearance {
  readonly orientation = input<"horizontal" | "vertical">("horizontal");
  readonly label = input("");
  readonly thickness = input("1px");
  readonly color = input("var(--dl-border)");
  readonly lineStyle = input<"solid" | "dashed" | "dotted">("solid");
  readonly inset = input("0px");
  readonly margin = input("16px 0");
}
