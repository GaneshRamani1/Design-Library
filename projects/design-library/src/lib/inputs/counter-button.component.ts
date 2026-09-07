import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  output,
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import {
  FormControlBase,
  fieldStyles,
  fieldMessage,
} from "./form-control-base";
import { formatNumber, numberPrecision } from "./number-format";
@Component({
  selector: "dl-counter-button",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CounterButtonComponent),
      multi: true,
    },
  ],
  template:
    `<span class="label" [id]="id()+'-label'">{{label()}}</span><div class="counter" [class.vertical]="orientation()==='vertical'"><button type="button" [disabled]="isDisabled()||readOnly()||current()<=minimum()" [attr.aria-label]="decrementLabel()" (click)="adjust(-1)" (blur)="onTouched()">{{decrementIcon()}}</button><span class="value" role="spinbutton" [attr.tabindex]="isDisabled()?-1:0" [attr.aria-labelledby]="id()+'-label'" [attr.aria-valuenow]="current()" [attr.aria-valuemin]="minimum()" [attr.aria-valuemax]="maximum()" [attr.aria-valuetext]="prefix()+formatted()+suffix()" [attr.aria-disabled]="isDisabled()||null" [attr.aria-readonly]="readOnly()||null" [attr.aria-describedby]="descriptionId()" [attr.aria-invalid]="error()?true:null" (keydown)="key($event)" (blur)="onTouched()">{{prefix()}}{{formatted()}}{{suffix()}}</span><button type="button" [disabled]="isDisabled()||readOnly()||current()>=maximum()" [attr.aria-label]="incrementLabel()" (click)="adjust(1)" (blur)="onTouched()">{{incrementIcon()}}</button></div>` +
    fieldMessage,
  styles: [
    fieldStyles,
    `
      .counter {
        display: flex;
        align-items: stretch;
        border: var(--dl-ui-border-width, 1px) solid
          var(--dl-ui-border-color, var(--dl-border));
        border-radius: var(--dl-ui-radius, var(--dl-radius));
        background: var(--dl-ui-background, var(--dl-surface));
        color: var(--dl-ui-color, var(--dl-text));
        min-width: 0;
        max-width: 100%;
      }
      button {
        flex: 0 0 var(--field-height);
        height: var(--field-height);
        border: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        cursor: pointer;
        border-radius: inherit;
      }
      .value {
        flex: 1 1 auto;
        min-width: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--dl-ui-padding, 0 8px);
        font-variant-numeric: tabular-nums;
        overflow-wrap: anywhere;
        white-space: normal;
        text-align: center;
        outline-offset: 2px;
      }
      .value:focus-visible {
        outline: 2px solid var(--dl-ui-focus-color, var(--dl-focus));
      }
      .vertical {
        flex-direction: column;
      }
      .vertical .value {
        min-height: var(--field-height);
      }
    `,
  ],
})
export class CounterButtonComponent extends FormControlBase<number> {
  readonly min = input(0);
  readonly max = input(100);
  readonly step = input(1);
  readonly precision = input(0);
  readonly locale = input("en-US");
  readonly prefix = input("");
  readonly suffix = input("");
  readonly readOnly = input(false);
  readonly orientation = input<"horizontal" | "vertical">("horizontal");
  readonly incrementLabel = input("Increase");
  readonly decrementLabel = input("Decrease");
  readonly incrementIcon = input("+");
  readonly decrementIcon = input("−");
  readonly incremented = output<number>();
  readonly decremented = output<number>();
  readonly minimum = computed(() =>
    Number.isFinite(this.min()) ? this.min() : 0,
  );
  readonly maximum = computed(() =>
    Math.max(this.minimum(), Number.isFinite(this.max()) ? this.max() : 100),
  );
  readonly current = computed(() => this.clamp(this.value() ?? this.minimum()));
  readonly formatted = computed(() =>
    formatNumber(this.current(), {
      locale: this.locale(),
      precision: this.precision(),
    }),
  );
  private clamp(value: number): number {
    return Math.min(
      this.maximum(),
      Math.max(this.minimum(), Number.isFinite(value) ? value : this.minimum()),
    );
  }
  adjust(direction: number): void {
    if (this.isDisabled() || this.readOnly()) return;
    const step =
      Number.isFinite(this.step()) && this.step() > 0 ? this.step() : 1;
    const next = this.clamp(
      Number(
        (this.current() + direction * step).toFixed(
          numberPrecision(this.precision()),
        ),
      ),
    );
    this.change(next);
  }
  private change(next: number): void {
    const previous = this.current();
    if (next === previous) return;
    this.commit(next);
    this.onTouched();
    if (next > previous) this.incremented.emit(next);
    else this.decremented.emit(next);
  }
  key(event: KeyboardEvent): void {
    if (
      this.isDisabled() ||
      this.readOnly() ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey
    )
      return;
    if (event.key === "ArrowUp" || event.key === "ArrowRight") {
      event.preventDefault();
      this.adjust(1);
    } else if (event.key === "ArrowDown" || event.key === "ArrowLeft") {
      event.preventDefault();
      this.adjust(-1);
    } else if (event.key === "Home") {
      event.preventDefault();
      this.change(this.minimum());
    } else if (event.key === "End") {
      event.preventDefault();
      this.change(this.maximum());
    }
  }
}
