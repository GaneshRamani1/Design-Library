import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
@Component({
  selector: "dl-avatar",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{ initials() }}`,
  host: {
    role: "img",
    "[attr.aria-label]": "name()",
    "[attr.data-size]": "size()",
  },
  styles: [
    `
      :host {
        display: inline-flex;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        align-items: center;
        justify-content: center;
        background: #e9eee4;
        color: #476044;
        border: 2px solid white;
        font: 600 11px var(--dl-font, sans-serif);
        flex-shrink: 0;
      }
      :host([data-size="sm"]) {
        width: 26px;
        height: 26px;
        font-size: 9px;
      }
      :host([data-size="lg"]) {
        width: 48px;
        height: 48px;
        font-size: 15px;
      }
    `,
  ],
})
export class AvatarComponent {
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
