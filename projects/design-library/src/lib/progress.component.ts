import { Appearance } from "./shared/appearance";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
} from "@angular/core";
@Component({
  selector: "dl-progress",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@if (showLabel() || showValue()) {
      <div class="labels">
        @if (showLabel()) {
          <span>{{ label() }}</span>
        }
        @if (showValue()) {
          <span>{{ displayValue() }}</span>
        }
      </div>
    }
    @if(variant()==='circular') {
      <div class="circle" role="progressbar" [attr.aria-label]="label()" [attr.aria-valuemin]="minimum()" [attr.aria-valuemax]="maximum()" [attr.aria-valuenow]="indeterminate()?null:clamped()" [class.indeterminate]="indeterminate()" [style.--progress]="normalized()+'%'" [style.--circle-size]="circleSize()"><span>{{showValue()?displayValue():''}}</span></div>
    } @else {<div
      class="track"
      role="progressbar"
      [attr.aria-label]="label()"
      [attr.aria-valuemin]="minimum()"
      [attr.aria-valuemax]="maximum()"
      [attr.aria-valuenow]="indeterminate() ? null : clamped()"
      [style.height]="height()"
      [style.background]="trackColor()"
      [class.indeterminate]="indeterminate()" [class.segmented]="segments()>1" [style.--segments]="segments()"
    >
      <div
        [style.width.%]="indeterminate() ? 35 : normalized()"
        [style.background]="barColor()"
      ></div>
    </div>}`,
  styles: [
    `
      :host {
        display: block;
        min-width: 180px;
        font: var(--dl-ui-font-size, 12px) var(--dl-font, sans-serif);
        color: var(--dl-ui-color, var(--dl-text, #202a24));
      }
      .labels {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        gap: var(--dl-ui-gap, 20px);
      }
      .track {
        height: 6px;
        background: var(--dl-ui-background, var(--dl-track, #e8ede5));
        border-radius: var(--dl-ui-radius, 20px);
        overflow: hidden;
      }
      .indeterminate div {
        animation: travel 1.2s infinite alternate ease-in-out;
      }
      @keyframes travel {
        to {
          transform: translateX(180%);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .indeterminate div {
          animation: none;
        }
      }
      .track div {
        height: 100%;
        background: var(--dl-ui-background, var(--dl-primary, #285b45));
        border-radius: var(--dl-ui-radius, 20px);
      }
      .track.segmented{background:repeating-linear-gradient(90deg,var(--dl-track) 0 calc((100% / var(--segments)) - 3px),transparent calc((100% / var(--segments)) - 3px) calc(100% / var(--segments)))}
      .circle{width:var(--circle-size);height:var(--circle-size);border-radius:50%;display:grid;place-items:center;background:conic-gradient(var(--dl-ui-background,var(--dl-primary)) var(--progress),var(--dl-track) 0);position:relative}
      .circle:after{content:"";position:absolute;inset:8px;border-radius:50%;background:var(--dl-surface)}
      .circle span{position:relative;z-index:1}
    `,
  ],
})
export class ProgressComponent extends Appearance {
  readonly label = input.required<string>();
  readonly value = input(0);
  readonly min = input(0);
  readonly max = input(100);
  readonly showLabel = input(true);
  readonly showValue = input(true);
  readonly indeterminate = input(false);
  readonly height = input("6px");
  readonly trackColor = input("var(--dl-track)");
  readonly barColor = input("var(--dl-primary)");
  readonly valueLabel = input("{percent}%");
  readonly variant = input<"linear" | "circular">("linear");
  readonly segments = input(1);
  readonly circleSize = input("72px");
  /** Emits once whenever determinate progress crosses into its completed state. */
  readonly completed = output<{ value: number; max: number }>();
  private wasComplete = false;
  constructor() {
    super();
    effect(() => {
      const complete = !this.indeterminate() && this.clamped() >= this.maximum();
      if (complete && !this.wasComplete)
        this.completed.emit({ value: this.clamped(), max: this.maximum() });
      this.wasComplete = complete;
    });
  }
  readonly minimum = computed(() =>
    Number.isFinite(this.min()) ? this.min() : 0,
  );
  readonly maximum = computed(() =>
    Math.max(this.minimum(), Number.isFinite(this.max()) ? this.max() : 100),
  );
  readonly clamped = computed(() =>
    Math.min(
      this.maximum(),
      Math.max(
        this.minimum(),
        Number.isFinite(this.value()) ? this.value() : this.minimum(),
      ),
    ),
  );
  readonly normalized = computed(() =>
    this.maximum() === this.minimum()
      ? 0
      : ((this.clamped() - this.minimum()) /
          (this.maximum() - this.minimum())) *
        100,
  );
  readonly displayValue = computed(() =>
    this.valueLabel()
      .replaceAll("{value}", String(this.clamped()))
      .replaceAll("{percent}", String(Math.round(this.normalized()))),
  );
}
