import { Appearance } from "./shared/appearance";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
export const buttonStyles = `
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--dl-ui-gap, 8px);
        border: var(--dl-ui-border-width, 1px) solid
          var(--dl-ui-border-color, transparent);
        border-radius: var(--dl-ui-radius, var(--dl-radius, 10px));
        font: 600 var(--dl-ui-font-size, 14px) var(--dl-font, sans-serif);
        cursor: pointer;
        padding: var(--dl-ui-padding, 11px 18px);
        background: var(--dl-ui-background, var(--dl-primary, #285b45));
        color: var(--dl-ui-color, var(--dl-on-primary, white));
        box-shadow: var(--dl-ui-shadow, none);
        transition:
          background 0.15s,
          box-shadow 0.15s;
      }
      :host(:hover:not(:disabled)) {
        background: var(--dl-ui-background, var(--dl-primary-hover, #1e4835));
      }
      :host([data-variant="secondary"]) {
        background: var(--dl-ui-background, var(--dl-surface, #fff));
        color: var(--dl-ui-color, var(--dl-text, #202a24));
        border-color: var(--dl-ui-border-color, var(--dl-border, #dce2da));
      }
      :host([data-variant="tertiary"]),
      :host([data-variant="ghost"]) {
        background: var(--dl-ui-background, transparent);
        color: var(--dl-ui-color, var(--dl-primary, #285b45));
      }
      :host([data-variant="danger"]) {
        background: var(--dl-ui-background, var(--dl-danger-fill, #ab3434));
        color: var(--dl-ui-color, var(--dl-on-danger, white));
      }
      :host([data-variant="danger"]:hover:not(:disabled)) {
        background: var(--dl-ui-background, var(--dl-danger-hover, #8e2929));
      }
      :host([data-variant="secondary"]:hover:not(:disabled)),
      :host([data-variant="tertiary"]:hover:not(:disabled)),
      :host([data-variant="ghost"]:hover:not(:disabled)) {
        background: var(--dl-ui-background, var(--dl-primary-soft, #edf4ee));
      }
      :host([data-size="sm"]) {
        padding: var(--dl-ui-padding, 7px 12px);
        font-size: var(--dl-ui-font-size, 12px);
      }
      :host([data-size="lg"]) {
        padding: var(--dl-ui-padding, 14px 23px);
        font-size: var(--dl-ui-font-size, 16px);
      }
      :host(:focus-visible) {
        outline: 3px solid var(--dl-ui-focus-color, var(--dl-focus, #3577b9));
        outline-offset: 3px;
      }
      :host(:disabled) {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .spinner {
        width: 12px;
        height: 12px;
        border: var(--dl-ui-border-width, 2px) solid
          var(--dl-ui-border-color, currentColor);
        border-right-color: transparent;
        border-radius: var(--dl-ui-radius, 50%);
        animation: spin 0.7s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .spinner {
          animation: none;
        }
      }
    `;
/** A native button with consistent variants, sizes, and loading feedback. */
@Component({
  selector: "button[dlButton]",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@if (loading()) {
      <span class="spinner" aria-hidden="true"></span>
    }
    @if (icon() && iconPosition() === "start") {
      <span aria-hidden="true">{{ icon() }}</span>
    }
    @if (loading() && loadingLabel()) {
      <span>{{ loadingLabel() }}</span>
    } @else {
      <ng-content />
    }
    @if (icon() && iconPosition() === "end") {
      <span aria-hidden="true">{{ icon() }}</span>
    }`,
  host: {
    "[attr.data-variant]": "variant()",
    "[attr.data-size]": "size()",
    "[disabled]": "disabled() || loading()",
    "[attr.aria-busy]": "loading()",
    "[attr.type]": "type()",
    "[style.width]": "fullWidth()?'100%':null",
    "[style.min-width]": "loading() && loadingMinWidth() ? loadingMinWidth() : null",
  },
  styles: [buttonStyles],
})
export class ButtonComponent extends Appearance {
  readonly fullWidth = input(false);
  readonly icon = input("");
  readonly iconPosition = input<"start" | "end">("start");
  readonly loadingLabel = input("");
  readonly variant = input<
    "primary" | "secondary" | "tertiary" | "ghost" | "danger"
  >("primary");
  readonly size = input<"sm" | "md" | "lg">("md");
  readonly disabled = input(false);
  readonly loading = input(false);
  /** Optional stable minimum width applied while loading. */
  readonly loadingMinWidth = input("");
  readonly type = input<"button" | "submit" | "reset">("button");
}
