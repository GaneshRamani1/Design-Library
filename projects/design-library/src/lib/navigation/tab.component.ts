import {
  Component,
  input,
  output,
  TemplateRef,
  viewChild,
} from "@angular/core";
import { Appearance } from "../shared/appearance";
/** A tab descriptor and projected panel, rendered by dl-tab-container. */
@Component({
  selector: "dl-tab",
  standalone: true,
  template: `<ng-template #content
    ><div
      [style]="appearanceStyles()"
      style="padding:var(--dl-ui-padding,0);border-radius:var(--dl-ui-radius,0);background:var(--dl-ui-background,transparent);color:var(--dl-ui-color,inherit);font-size:var(--dl-ui-font-size,inherit);box-shadow:var(--dl-ui-shadow,none);border:var(--dl-ui-border-width,0) solid var(--dl-ui-border-color,transparent);display:flex;flex-direction:column;gap:var(--dl-ui-gap,0)"
    >
      <ng-content /></div
  ></ng-template>`,
  styles: [
    `
      :host {
        display: none;
      }
    `,
  ],
})
export class TabComponent extends Appearance {
  readonly value = input.required<string>();
  readonly label = input.required<string>();
  readonly disabled = input(false);
  readonly icon = input("");
  readonly badge = input("");
  readonly closable = input(false);
  readonly closeLabel = input("");
  readonly closed = output<void>();
  readonly content = viewChild<TemplateRef<unknown>>("content");
}
