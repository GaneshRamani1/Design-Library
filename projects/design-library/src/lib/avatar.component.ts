import { Appearance } from "./shared/appearance";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  HostListener,
  signal,
  input,
  output,
} from "@angular/core";
@Component({
  selector: "dl-avatar",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@if (excessCount() > 0) {
      <span class="excess">{{ formattedExcess() }}</span>
    } @else if (src() && !failed()) {
      <img [src]="src()" alt="" (load)="imageLoaded.emit({ src: src() })" (error)="failImage()" />
    } @else {
      {{ customInitials() || initials() }}
    }
    @if (status()) {
      <span class="status" [attr.data-status]="status()"></span>
    }`,
  host: {
    "[attr.data-shape]": "shape()",
    "[style.border-width]": "showBorder()?null:'0'",
    "[attr.data-size]": "size()",
    "[attr.tabindex]": "interactive() ? 0 : null",
    "[attr.role]": "interactive() ? 'button' : 'img'",
    "[attr.aria-label]": "resolvedLabel()",
    "[style.margin-inline-start]": "groupIndex() > 0 ? '-' + overlap() : null",
    "[style.z-index]": "stackOrder()",
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
      :host([tabindex]) { cursor: pointer; }
      :host([tabindex]):focus-visible { outline: 2px solid var(--dl-ui-focus-color,var(--dl-focus)); outline-offset: 2px; }
      .excess { white-space: nowrap; }
    `,
  ],
})
export class AvatarComponent extends Appearance {
  readonly src = input("");
  readonly customInitials = input("");
  readonly shape = input<"circle" | "rounded" | "square">("circle");
  readonly showBorder = input(true);
  readonly status = input<"" | "online" | "offline" | "busy" | "away">("");
  /** Zero-based position when avatars overlap in a group. */
  readonly groupIndex = input(0);
  readonly overlap = input("10px");
  readonly reverseStack = input(false);
  /** Renders an overflow avatar such as +4 when greater than zero. */
  readonly excessCount = input(0);
  readonly excessLabel = input("{count} more people");
  readonly maxExcess = input(99);
  readonly interactive = input(false);
  readonly failed = signal(false);
  readonly imageLoaded = output<{ src: string }>();
  readonly imageFailed = output<{ src: string }>();
  readonly activated = output<{ name: string; excessCount: number }>();
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
  readonly formattedExcess = computed(() => this.excessCount() > this.maxExcess() ? `+${this.maxExcess()}+` : `+${Math.max(0, this.excessCount())}`);
  readonly resolvedLabel = computed(() => this.excessCount() > 0
    ? this.excessLabel().replace("{count}", String(this.excessCount()))
    : this.name() + (this.status() ? `, ${this.status()}` : ""));
  readonly stackOrder = computed(() => this.reverseStack() ? this.groupIndex() + 1 : 1000 - this.groupIndex());
  @HostListener("click") activate(): void {
    if (this.interactive()) this.activated.emit({ name: this.name(), excessCount: this.excessCount() });
  }
  @HostListener("keydown.enter", ["$event"])
  @HostListener("keydown.space", ["$event"])
  activateFromKeyboard(event: Event): void { if (this.interactive()) { event.preventDefault(); this.activate(); } }
  failImage(): void {
    const src = this.src();
    this.failed.set(true);
    this.imageFailed.emit({ src });
  }
}
