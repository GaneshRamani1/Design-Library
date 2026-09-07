import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { LayoutBase, layoutStyles } from "./layout-base";
/** A named page region. Project a heading and any content inside. */
@Component({
  selector: "dl-section",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[attr.role]": "label() || labelledBy() ? 'region' : null",
    "[attr.aria-label]": "labelledBy() ? null : label() || null",
    "[attr.aria-labelledby]": "labelledBy() || null",
  },
  template: `<ng-content />`,
  styles: [layoutStyles],
})
export class SectionComponent extends LayoutBase {
  readonly label = input("");
  /** ID of a projected visible heading that names this section landmark. */
  readonly labelledBy = input("");
}
