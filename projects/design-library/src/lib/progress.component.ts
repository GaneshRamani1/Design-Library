import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
@Component({
  selector: "dl-progress",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="labels">
      <span>{{ label() }}</span
      ><span>{{ normalized() }}%</span>
    </div>
    <div
      class="track"
      role="progressbar"
      [attr.aria-label]="label()"
      aria-valuemin="0"
      aria-valuemax="100"
      [attr.aria-valuenow]="normalized()"
    >
      <div [style.width.%]="normalized()"></div>
    </div>`,
  styles: [
    `
      :host {
        display: block;
        min-width: 180px;
        font: 12px var(--dl-font, sans-serif);
        color: var(--dl-text, #202a24);
      }
      .labels {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        gap: 20px;
      }
      .track {
        height: 6px;
        background: #e8ede5;
        border-radius: 20px;
        overflow: hidden;
      }
      .track div {
        height: 100%;
        background: var(--dl-primary, #285b45);
        border-radius: 20px;
      }
    `,
  ],
})
export class ProgressComponent {
  readonly label = input.required<string>();
  readonly value = input(0);
  readonly normalized = computed(() =>
    Number.isFinite(this.value())
      ? Math.max(0, Math.min(100, this.value()))
      : 0,
  );
}
