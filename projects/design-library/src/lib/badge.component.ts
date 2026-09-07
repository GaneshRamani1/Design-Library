import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from "@angular/core";
import { ToneAppearance } from "./shared/tone";
@Component({
  selector: "dl-badge",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[style.display]": "visible()?null:'none'",
    "[attr.data-pill]": "pill()",
  },
  template: `@if (dot()) {
      <span class="dot" aria-hidden="true"></span>
    }
    @if (icon()) {
      <span aria-hidden="true">{{ icon() }}</span>
    }
    <span><ng-content /></span>
    @if (removable()) {
      <button
        type="button"
        [attr.aria-label]="removeLabel()"
        (click)="remove()"
      >
        ×
      </button>
    }`,
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        gap: var(--dl-ui-gap, 6px);
        padding: var(--dl-ui-padding, 4px 9px);
        border: var(--dl-ui-border-width, 1px) solid
          var(--dl-ui-border-color, var(--tone-border));
        border-radius: var(--dl-ui-radius, 6px);
        font: 600 var(--dl-ui-font-size, 11px) var(--dl-font);
        line-height: 1.4;
        background: var(--dl-ui-background, var(--tone-bg));
        color: var(--dl-ui-color, var(--tone-text));
      }
      :host([data-pill="true"]) {
        border-radius: var(--dl-ui-radius, 999px);
      }
      :host([data-size="sm"]) {
        padding: var(--dl-ui-padding, 2px 6px);
        font-size: var(--dl-ui-font-size, 10px);
      }
      :host([data-size="lg"]) {
        padding: var(--dl-ui-padding, 7px 12px);
        font-size: var(--dl-ui-font-size, 13px);
      }
      .dot {
        width: 6px;
        height: 6px;
        border-radius: var(--dl-ui-radius, 50%);
        background: var(--dl-ui-background, currentColor);
      }
      button {
        border: 0;
        background: var(--dl-ui-background, none);
        color: var(--dl-ui-color, inherit);
        font: inherit;
        padding: var(--dl-ui-padding, 0 2px);
        cursor: pointer;
      }
      button:focus-visible {
        outline: 2px solid var(--dl-ui-focus-color, var(--dl-focus));
        outline-offset: 2px;
      }
    `,
  ],
})
export class BadgeComponent extends ToneAppearance {
  readonly pill = input(false);
  readonly dot = input(false);
  readonly icon = input("");
  readonly removable = input(false);
  readonly removeLabel = input("Remove badge");
  readonly visible = model(true);
  readonly removed = output<void>();
  remove(): void {
    this.visible.set(false);
    this.removed.emit();
  }
}
