import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import type { ComponentAppearance } from "../shared/appearance";
@Component({
  selector: "dl-validation-message",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div
    class="validation"
    [id]="id()"
    role="status"
    [attr.aria-live]="live()"
    aria-atomic="true"
    [style]="styles()"
  >
    @if (heading()) {
      <strong>{{ heading() }}</strong>
    }
    <ul>
      @for (message of messages(); track $index) {
        <li>{{ message }}</li>
      }
    </ul>
  </div>`,
  styles: [
    `
      :host {
        display: block;
        max-width: 100%;
        min-width: 0;
      }
      .validation {
        box-sizing: border-box;
        max-width: 100%;
        overflow-wrap: anywhere;
        padding: var(--dl-ui-padding, 12px 16px);
        border: var(--dl-ui-border-width, 1px) solid
          var(--dl-ui-border-color, var(--dl-danger-border));
        border-radius: var(--dl-ui-radius, 10px);
        background: var(--dl-ui-background, var(--dl-surface));
        color: var(--dl-ui-color, var(--dl-danger-text));
        font: var(--dl-ui-font-size, 13px)/1.5 var(--dl-font);
        box-shadow: var(--dl-ui-shadow, 0 8px 24px #0003);
        max-height: calc(100dvh - 24px);
        overflow: auto;
      }
      strong {
        display: block;
        margin-bottom: 4px;
      }
      ul {
        margin: 0;
        padding-inline-start: 18px;
      }
      li + li {
        margin-top: var(--dl-ui-gap, 4px);
      }
    `,
  ],
})
export class ValidationMessage {
  readonly id = input("");
  readonly heading = input("");
  readonly messages = input<string[]>([]);
  readonly live = input<"off" | "polite" | "assertive">("polite");
  readonly styles = input<Record<string, string>>({});
}
export function validationStyles(
  appearance: ComponentAppearance,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(appearance)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [
        "--dl-ui-" + key.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase()),
        value!,
      ]),
  );
}
