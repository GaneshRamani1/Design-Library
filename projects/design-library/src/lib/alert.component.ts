import { ChangeDetectionStrategy, Component, input } from "@angular/core";
@Component({
  selector: "dl-alert",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[attr.data-tone]": "tone()",
    "[attr.role]": "tone() === 'danger' ? 'alert' : 'status'",
  },
  template: `<span class="icon" aria-hidden="true">{{
      tone() === "success" ? "✓" : tone() === "danger" ? "!" : "i"
    }}</span>
    <div>
      <strong>{{ heading() }}</strong>
      <div class="body"><ng-content /></div>
    </div>`,
  styles: [
    `
      :host {
        display: flex;
        gap: 12px;
        border: 1px solid #d6e3f6;
        background: #f1f6fd;
        color: #315786;
        border-radius: 10px;
        padding: 15px 17px;
        font: 13px var(--dl-font, sans-serif);
        line-height: 1.6;
      }
      :host([data-tone="success"]) {
        border-color: #d5e7d7;
        background: #f0f7f0;
        color: #285b3b;
      }
      :host([data-tone="warning"]) {
        border-color: #efdeb7;
        background: #fff8e9;
        color: #825916;
      }
      :host([data-tone="danger"]) {
        border-color: #f0d0d0;
        background: #fff2f2;
        color: #993535;
      }
      .icon {
        border: 1.5px solid currentColor;
        border-radius: 50%;
        width: 17px;
        height: 17px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
        margin-top: 2px;
        font-size: 11px;
        font-weight: 700;
      }
      strong {
        font-weight: 600;
      }
      .body {
        opacity: 0.9;
      }
    `,
  ],
})
export class AlertComponent {
  readonly tone = input<"info" | "success" | "warning" | "danger">("info");
  readonly heading = input.required<string>();
}
