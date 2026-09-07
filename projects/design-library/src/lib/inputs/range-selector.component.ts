import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import {
  FormControlBase,
  fieldStyles,
  fieldMessage,
} from "./form-control-base";
export type RangeValue = number | [number, number];
/** One native slider or a bounded lower/upper pair. Values snap to step. */
@Component({
  selector: "dl-range-selector",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RangeSelectorComponent),
      multi: true,
    },
  ],
  template:
    `<fieldset [disabled]="isDisabled()" [attr.aria-describedby]="descriptionId()" [attr.aria-invalid]="error() ? true : null">
    <legend>{{ label() }}</legend>
    <div class="readout"><span>{{ range() ? 'Selected range' : 'Selected value' }}</span><output>{{ formatValue(lower()) }}{{ range() ? ' – ' + formatValue(upper()) : '' }}</output></div>
    <div class="sliders" [class.vertical]="orientation()==='vertical'">
    <input type="range" [id]="id() + '-control'" [attr.list]="ticks()>1 ? id()+'-ticks' : null" [attr.aria-label]="range() ? label() + ' minimum' : label()" [attr.aria-describedby]="descriptionId()" [attr.aria-valuetext]="formatValue(lower())" [disabled]="isDisabled()" [min]="minimum()" [max]="range() ? upper() : maximum()" [step]="increment()" [value]="lower()" (input)="slide($event, false)" (blur)="onTouched()" />
    @if (range()) { <input type="range" [id]="id() + '-upper'" [attr.list]="ticks()>1 ? id()+'-ticks' : null" [attr.aria-label]="label() + ' maximum'" [attr.aria-describedby]="descriptionId()" [attr.aria-valuetext]="formatValue(upper())" [disabled]="isDisabled()" [min]="lower()" [max]="maximum()" [step]="increment()" [value]="upper()" (input)="slide($event, true)" (blur)="onTouched()" /> }
    </div>
    @if(tickValues().length){<datalist [id]="id()+'-ticks'">@for(tick of tickValues();track tick){<option [value]="tick" [label]="formatValue(tick)"></option>}</datalist>}
    <div class="bounds"><span>{{ formatValue(minimum()) }}</span><span>{{ formatValue(maximum()) }}</span></div>
  </fieldset>` + fieldMessage,
  styles: [
    fieldStyles,
    `
      .readout,
      .bounds {
        display: flex;
        justify-content: space-between;
        gap: var(--dl-ui-gap, 12px);
        font-size: var(--dl-ui-font-size, 12px);
        color: var(--dl-ui-color, var(--dl-muted));
      }
      .readout {
        margin: 0 0 12px;
      }
      output {
        color: var(--dl-ui-color, var(--dl-text));
        font-variant-numeric: tabular-nums;
      }
      input {
        display: block;
        width: 100%;
        margin: 8px 0;
        cursor: pointer;
        height: 22px;
      }
      .vertical { min-height:180px; display:flex; gap:12px; align-items:center; }
      .vertical input { width:180px; transform:rotate(-90deg); }
      .bounds {
        margin-top: 8px;
      }
    `,
  ],
})
export class RangeSelectorComponent extends FormControlBase<RangeValue> {
  readonly min = input(0);
  readonly max = input(100);
  readonly step = input(1);
  readonly range = input(false);
  readonly unit = input("");
  readonly orientation = input<"horizontal" | "vertical">("horizontal");
  /** Number of evenly spaced native tick marks; zero hides ticks. */
  readonly ticks = input(0);
  /** Display template supporting {value} and {unit}. */
  readonly valueFormat = input("{value}{unit}");
  readonly tickValues = computed(() => {
    const count = Math.max(0, Math.min(20, Math.floor(this.ticks())));
    return count < 2 ? [] : Array.from({ length: count }, (_, index) => this.snap(this.minimum() + ((this.maximum()-this.minimum())*index)/(count-1)));
  });
  readonly minimum = computed(() =>
    Number.isFinite(this.min()) ? this.min() : 0,
  );
  readonly maximum = computed(() =>
    Number.isFinite(this.max())
      ? Math.max(this.minimum(), this.max())
      : Math.max(this.minimum(), 100),
  );
  readonly increment = computed(() =>
    Number.isFinite(this.step()) && this.step() > 0 ? this.step() : 1,
  );
  readonly lower = computed(() => {
    const value = this.value();
    if (Array.isArray(value))
      return Math.min(this.snap(value[0]), this.snap(value[1]));
    return this.snap(value ?? this.minimum());
  });
  readonly upper = computed(() => {
    const value = this.value();
    return Array.isArray(value)
      ? Math.max(this.snap(value[0]), this.snap(value[1]))
      : this.snap(this.maximum());
  });
  private snap(value: number): number {
    const safe = Number.isFinite(value) ? value : this.minimum();
    const steps = Math.round(
      (Math.min(this.maximum(), Math.max(this.minimum(), safe)) -
        this.minimum()) /
        this.increment(),
    );
    const last = Math.floor(
      (this.maximum() - this.minimum()) / this.increment() + 1e-9,
    );
    return Number(
      (this.minimum() + Math.min(steps, last) * this.increment()).toFixed(10),
    );
  }
  formatValue(value: number): string {
    return this.valueFormat().replaceAll("{value}", String(value)).replaceAll("{unit}", this.unit());
  }
  slide(event: Event, upper: boolean): void {
    const value = this.snap((event.target as HTMLInputElement).valueAsNumber);
    this.commit(
      this.range()
        ? upper
          ? [this.lower(), Math.max(this.lower(), value)]
          : [Math.min(value, this.upper()), this.upper()]
        : value,
    );
  }
}
