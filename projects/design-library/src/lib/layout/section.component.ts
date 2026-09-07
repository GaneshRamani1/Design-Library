import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { LayoutBase, layoutStyles } from "./layout-base";
/** A named page region. Project a heading and any content inside. */
@Component({
  selector: "dl-section",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[attr.role]": "label() ? 'region' : null",
    "[attr.aria-label]": "label() || null",
  },
  template: `<ng-content />`,
  styles: [layoutStyles],
})
export class SectionComponent extends LayoutBase {
  readonly label = input("");
}
