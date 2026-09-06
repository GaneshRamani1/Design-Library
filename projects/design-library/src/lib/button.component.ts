import { ChangeDetectionStrategy, Component, input } from "@angular/core";
/** A native button with consistent variants, sizes, and loading feedback. */
@Component({
  selector: "button[dlButton]",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@if (loading()) {
      <span class="spinner" aria-hidden="true"></span>
    }
    <ng-content />`,
  host: {
    "[attr.data-variant]": "variant()",
    "[attr.data-size]": "size()",
    "[disabled]": "disabled() || loading()",
    "[attr.aria-busy]": "loading()",
    "[attr.type]": "type()",
  },
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        border: 1px solid transparent;
        border-radius: var(--dl-radius, 10px);
        font: 600 14px var(--dl-font, sans-serif);
        cursor: pointer;
        padding: 11px 18px;
        background: var(--dl-primary, #285b45);
        color: white;
        transition:
          background 0.15s,
          box-shadow 0.15s;
      }
      :host(:hover:not(:disabled)) {
        background: var(--dl-primary-hover, #1e4835);
      }
      :host([data-variant="secondary"]) {
        background: var(--dl-surface, #fff);
        color: var(--dl-text, #202a24);
        border-color: var(--dl-border, #dce2da);
      }
      :host([data-variant="ghost"]) {
        background: transparent;
        color: var(--dl-primary, #285b45);
      }
      :host([data-variant="danger"]) {
        background: var(--dl-danger, #ab3434);
      }
      :host([data-variant="secondary"]:hover:not(:disabled)),
      :host([data-variant="ghost"]:hover:not(:disabled)) {
        background: var(--dl-primary-soft, #edf4ee);
      }
      :host([data-size="sm"]) {
        padding: 7px 12px;
        font-size: 12px;
      }
      :host([data-size="lg"]) {
        padding: 14px 23px;
        font-size: 16px;
      }
      :host(:focus-visible) {
        outline: 3px solid var(--dl-focus, #3577b9);
        outline-offset: 3px;
      }
      :host(:disabled) {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .spinner {
        width: 12px;
        height: 12px;
        border: 2px solid currentColor;
        border-right-color: transparent;
        border-radius: 50%;
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
    `,
  ],
})
export class ButtonComponent {
  readonly variant = input<"primary" | "secondary" | "ghost" | "danger">(
    "primary",
  );
  readonly size = input<"sm" | "md" | "lg">("md");
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly type = input<"button" | "submit" | "reset">("button");
}
