import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { LayoutBase, layoutStyles } from "./layout-base";
/** Centered, width-constrained content with optional flex layout. */
@Component({
  selector: "dl-container",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { "[attr.data-variant]": "variant()" },
  template: `<ng-content />`,
  styles: [
    layoutStyles,
    `
      :host {
        margin-inline: auto;
      }
      :host([data-variant="primary"]) {
        background-color: var(--dl-ui-background, var(--dl-card-surface));
        background-image: var(--dl-card-sheen, none);
        border: var(--dl-ui-border-width, 1px) solid
          var(--dl-ui-border-color, var(--dl-card-border));
        border-radius: var(--dl-ui-radius, var(--dl-card-radius));
        box-shadow: var(--dl-ui-shadow, var(--dl-card-shadow));
        backdrop-filter: var(--dl-card-blur, none);
        -webkit-backdrop-filter: var(--dl-card-blur, none);
      }
      :host([data-variant="secondary"]) {
        background: var(--dl-ui-background, var(--dl-surface));
        border: var(--dl-ui-border-width, 1px) solid
          var(--dl-ui-border-color, var(--dl-border));
        border-radius: var(--dl-ui-radius, var(--dl-radius));
        box-shadow: var(--dl-ui-shadow, none);
      }
    `,
  ],
})
export class ContainerComponent extends LayoutBase {
  readonly variant = input<"primary" | "secondary" | "tertiary">("tertiary");
}
