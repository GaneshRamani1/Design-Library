import { ChangeDetectionStrategy, Component, input } from "@angular/core";
@Component({
  selector: "dl-badge",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { "[attr.data-tone]": "tone()" },
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        padding: 4px 9px;
        border-radius: 6px;
        font: 600 11px var(--dl-font, sans-serif);
        line-height: 1.4;
        background: #eef0ed;
        color: #59625b;
      }
      :host([data-tone="success"]) {
        background: #e9f3e9;
        color: #2b623c;
      }
      :host([data-tone="warning"]) {
        background: #fff2d9;
        color: #86580c;
      }
      :host([data-tone="danger"]) {
        background: #fceaea;
        color: #a33232;
      }
      :host([data-tone="info"]) {
        background: #eaf0fc;
        color: #395e9a;
      }
    `,
  ],
})
export class BadgeComponent {
  readonly tone = input<"neutral" | "success" | "warning" | "danger" | "info">(
    "neutral",
  );
}
