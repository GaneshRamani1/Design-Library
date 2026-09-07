import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
} from "@angular/core";
import { ToneAppearance } from "./shared/tone";
@Component({
  selector: "dl-alert",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[style.display]": "visible()?null:'none'",
    "[attr.role]":
      "role()==='auto'?(tone()==='danger'?'alert':'status'):role()==='none'?null:role()",
    "[attr.aria-live]": "live()",
  },
  template: `@if (showIcon()) {
      <span
        class="icon"
        [style.font-size]="iconSize()"
        [class.bordered]="iconBorder()"
        aria-hidden="true"
        >{{ resolvedIcon() }}</span
      >
    }
    <div class="content">
      @if (heading()) {
        <strong>{{ heading() }}</strong>
      }
      <div class="body"><ng-content /></div>
      @if (actionLabel()) {
        <button type="button" class="action" (click)="action.emit()">
          {{ actionLabel() }}
        </button>
      }
    </div>
    @if (dismissible()) {
      <button
        class="close"
        type="button"
        [attr.aria-label]="dismissLabel()"
        (click)="dismiss()"
      >
        ×
      </button>
    }`,
  styles: [
    `
      :host {
        display: flex;
        align-items: flex-start;
        gap: var(--dl-ui-gap, 12px);
        border: var(--dl-ui-border-width, 1px) solid
          var(--dl-ui-border-color, var(--tone-border));
        background: var(--dl-ui-background, var(--tone-bg));
        color: var(--dl-ui-color, var(--tone-text));
        border-radius: var(--dl-ui-radius, 10px);
        padding: var(--dl-ui-padding, 15px 17px);
        font: var(--dl-ui-font-size, 13px) var(--dl-font);
        line-height: 1.6;
      }
      .content {
        flex: 1;
        min-width: 0;
      }
      .icon {
        width: 20px;
        height: 20px;
        display: grid;
        place-items: center;
        flex-shrink: 0;
        margin-top: 2px;
        font-weight: 700;
      }
      .bordered {
        border: var(--dl-ui-border-width, 1px) solid
          var(--dl-ui-border-color, currentColor);
        border-radius: var(--dl-ui-radius, 50%);
      }
      strong {
        font-weight: 600;
      }
      .body {
        opacity: 0.9;
      }
      button {
        font: inherit;
        color: var(--dl-ui-color, inherit);
        cursor: pointer;
      }
      .action {
        display: block;
        border: 0;
        background: var(--dl-ui-background, none);
        padding: var(--dl-ui-padding, 0);
        margin-top: 8px;
        text-decoration: underline;
      }
      .close {
        border: 0;
        background: var(--dl-ui-background, none);
        padding: var(--dl-ui-padding, 0 4px);
        font-size: var(--dl-ui-font-size, 20px);
      }
      button:focus-visible {
        outline: 2px solid var(--dl-ui-focus-color, var(--dl-focus));
        outline-offset: 3px;
      }
      :host([data-size="sm"]) {
        font-size: var(--dl-ui-font-size, 12px);
        padding: var(--dl-ui-padding, 10px 12px);
      }
      :host([data-size="lg"]) {
        font-size: var(--dl-ui-font-size, 15px);
        padding: var(--dl-ui-padding, 20px 24px);
      }
    `,
  ],
})
export class AlertComponent extends ToneAppearance {
  readonly heading = input("");
  readonly visible = model(true);
  readonly showIcon = input(true);
  readonly icon = input("");
  readonly iconSize = input("12px");
  readonly iconBorder = input(true);
  readonly dismissible = input(false);
  readonly dismissLabel = input("Dismiss alert");
  readonly actionLabel = input("");
  readonly role = input<"auto" | "status" | "alert" | "none">("auto");
  readonly live = input<"off" | "polite" | "assertive">("polite");
  readonly dismissed = output<void>();
  readonly action = output<void>();
  readonly resolvedIcon = computed(
    () =>
      this.icon() ||
      {
        neutral: "i",
        info: "i",
        success: "✓",
        warning: "!",
        danger: "!",
        custom: "★",
      }[this.tone()],
  );
  dismiss(): void {
    this.visible.set(false);
    this.dismissed.emit();
  }
}
