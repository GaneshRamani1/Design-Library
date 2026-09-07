import { Appearance } from "./shared/appearance";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  signal,
  input,
} from "@angular/core";
@Component({
  selector: "dl-avatar",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@if (src() && !failed()) {
      <img [src]="src()" alt="" (error)="failed.set(true)" />
    } @else {
      {{ customInitials() || initials() }}
    }
    @if (status()) {
      <span class="status" [attr.data-status]="status()"></span>
    }`,
  host: {
    role: "img",
    "[attr.aria-label]": "name() + (status()?', '+status():'')",
    "[attr.data-shape]": "shape()",
    "[style.border-width]": "showBorder()?null:'0'",
    "[attr.data-size]": "size()",
  },
  styles: [
    `
      :host {
        position: relative;
        display: inline-flex;
        width: 36px;
        height: 36px;
        border-radius: var(--dl-ui-radius, 50%);
        align-items: center;
        justify-content: center;
        background: var(--dl-ui-background, var(--dl-avatar-bg, #e9eee4));
        color: var(--dl-ui-color, var(--dl-avatar-text, #476044));
        border: var(--dl-ui-border-width, 2px) solid
          var(--dl-ui-border-color, var(--dl-surface, white));
        font: 600 var(--dl-ui-font-size, 11px) var(--dl-font, sans-serif);
        flex-shrink: 0;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: var(--dl-ui-radius, inherit);
      }
      .status {
        position: absolute;
        right: -1px;
        bottom: -1px;
        width: 9px;
        height: 9px;
        border: var(--dl-ui-border-width, 2px) solid
          var(--dl-ui-border-color, var(--dl-surface));
        border-radius: var(--dl-ui-radius, 50%);
        background: var(--dl-ui-background, var(--dl-success));
      }
      .status[data-status="busy"] {
        background: var(--dl-ui-background, var(--dl-danger));
      }
      .status[data-status="away"] {
        background: var(--dl-ui-background, var(--dl-warning-text));
      }
      .status[data-status="offline"] {
        background: var(--dl-ui-background, var(--dl-muted));
      }
      :host([data-shape="rounded"]) {
        border-radius: var(--dl-ui-radius, 10px);
      }
      :host([data-shape="square"]) {
        border-radius: var(--dl-ui-radius, 0);
      }
      :host([data-size="sm"]) {
        width: 26px;
        height: 26px;
        font-size: var(--dl-ui-font-size, 9px);
      }
      :host([data-size="lg"]) {
        width: 48px;
        height: 48px;
        font-size: var(--dl-ui-font-size, 15px);
      }
    `,
  ],
})
export class AvatarComponent extends Appearance {
  readonly src = input("");
  readonly customInitials = input("");
  readonly shape = input<"circle" | "rounded" | "square">("circle");
  readonly showBorder = input(true);
  readonly status = input<"" | "online" | "offline" | "busy" | "away">("");
  readonly failed = signal(false);
  constructor() {
    super();
    effect(() => {
      this.src();
      this.failed.set(false);
    });
  }
  readonly name = input.required<string>();
  readonly size = input<"sm" | "md" | "lg">("md");
  readonly initials = computed(() =>
    this.name()
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase(),
  );
}
