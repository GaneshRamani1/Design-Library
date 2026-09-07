import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { LayoutBase, layoutStyles } from "./layout-base";
/** A glass or solid panel with controlled height and overflow. */
@Component({
  selector: "dl-pane",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[attr.data-surface]": "surface()",
    "[style.overflow]": "overflow()",
  },
  template: `<ng-content />`,
  styles: [
    layoutStyles,
    `
      :host {
        border: var(--dl-ui-border-width, 1px) solid
          var(--dl-ui-border-color, var(--dl-card-border));
        border-radius: var(--dl-ui-radius, var(--dl-card-radius));
        background-color: var(--dl-ui-background, var(--dl-card-surface));
        background-image: var(--dl-card-sheen);
        box-shadow: var(--dl-ui-shadow, var(--dl-card-shadow));
        backdrop-filter: var(--dl-card-blur);
        -webkit-backdrop-filter: var(--dl-card-blur);
      }
      :host([data-surface="solid"]) {
        background: var(--dl-ui-background, var(--dl-surface));
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
      }
      :host([data-surface="transparent"]) {
        background: var(--dl-ui-background, transparent);
        border-color: var(--dl-ui-border-color, transparent);
        box-shadow: var(--dl-ui-shadow, none);
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
      }
    `,
  ],
})
export class PaneComponent extends LayoutBase {
  readonly surface = input<"glass" | "solid" | "transparent">("glass");
  readonly overflow = input<"visible" | "auto" | "hidden">("auto");
}
