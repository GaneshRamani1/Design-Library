import { Component, input, TemplateRef, viewChild } from "@angular/core";
import { Appearance } from "../shared/appearance";
@Component({
  selector: "dl-step",
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
export class StepComponent extends Appearance {
  readonly value = input.required<string>();
  readonly label = input.required<string>();
  readonly description = input("");
  readonly icon = input("");
  readonly completed = input(false);
  readonly disabled = input(false);
  readonly optional = input(false);
  readonly error = input("");
  readonly content = viewChild<TemplateRef<unknown>>("content");
}
