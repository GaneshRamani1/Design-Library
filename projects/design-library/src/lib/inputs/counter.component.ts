import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  forwardRef,
  inject,
  input,
  output,
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import {
  FormControlBase,
  fieldStyles,
  fieldMessage,
} from "./form-control-base";
/** Bounded numeric counter with native spinbutton keyboard support. */
@Component({
  selector: "dl-counter",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CounterComponent),
      multi: true,
    },
  ],
  template:
    `<label class="label" [for]="id()+'-control'">{{label()}}</label><div class="counter" [class.vertical]="orientation()==='vertical'">@if(showButtons()){<button type="button" [attr.aria-label]="decrementLabel()" [disabled]="isDisabled()||normalized()<=minimum()" (click)="adjust(-1)" (pointerdown)="startRepeat(-1)" (pointerup)="stopRepeat()" (pointercancel)="stopRepeat()" (pointerleave)="stopRepeat()">{{decrementIcon()}}</button>}<input class="field" type="number" [id]="id()+'-control'" [value]="normalized()" [min]="minimum()" [max]="maximum()" [step]="increment()" [readOnly]="!editable()" [disabled]="isDisabled()" [attr.aria-describedby]="descriptionId()" [attr.aria-invalid]="error()?true:null" (change)="edit($event)" (blur)="onTouched()"/>@if(showButtons()){<button type="button" [attr.aria-label]="incrementLabel()" [disabled]="isDisabled()||normalized()>=maximum()" (click)="adjust(1)" (pointerdown)="startRepeat(1)" (pointerup)="stopRepeat()" (pointercancel)="stopRepeat()" (pointerleave)="stopRepeat()">{{incrementIcon()}}</button>}</div>` +
    fieldMessage,
  styles: [
    fieldStyles,
    `
      .counter {
        display: flex;
        gap: var(--dl-ui-gap, 8px);
      }
      .counter input {
        text-align: center;
        min-width: 0;
        appearance: textfield;
      }
      .counter input::-webkit-inner-spin-button {
        appearance: none;
      }
      button {
        flex: 0 0 var(--field-height);
        height: var(--field-height);
        border: var(--dl-ui-border-width, 1px) solid
          var(--dl-ui-border-color, var(--dl-border));
        border-radius: var(--dl-ui-radius, var(--dl-radius));
        background: var(--dl-ui-background, var(--dl-surface));
        color: var(--dl-ui-color, var(--dl-text));
        font: inherit;
        cursor: pointer;
      }
      .vertical {
        flex-direction: column;
      }
      .vertical button {
        flex-basis: auto;
      }
    `,
  ],
})
export class CounterComponent extends FormControlBase<number> {
  readonly min = input(0);
  readonly max = input(100);
  readonly step = input(1);
  readonly editable = input(true);
  readonly showButtons = input(true);
  readonly orientation = input<"horizontal" | "vertical">("horizontal");
  readonly incrementLabel = input("Increase");
  readonly decrementLabel = input("Decrease");
  readonly incrementIcon = input("+");
  readonly decrementIcon = input("−");
  readonly repeat = input(true);
  readonly repeatDelay = input(450);
  readonly repeatInterval = input(90);
  readonly limitReached = output<"min" | "max">();
  private repeatDelayTimer: ReturnType<typeof setTimeout> | undefined;
  private repeatTimer: ReturnType<typeof setInterval> | undefined;
  constructor() {
    super();
    inject(DestroyRef).onDestroy(() => this.stopRepeat());
  }
  readonly minimum = computed(() =>
    Number.isFinite(this.min()) ? this.min() : 0,
  );
  readonly maximum = computed(() =>
    Math.max(this.minimum(), Number.isFinite(this.max()) ? this.max() : 100),
  );
  readonly increment = computed(() =>
    this.step() > 0 && Number.isFinite(this.step()) ? this.step() : 1,
  );
  readonly normalized = computed(() =>
    this.clamp(this.value() ?? this.minimum()),
  );
  private clamp(value: number): number {
    return Math.min(
      this.maximum(),
      Math.max(this.minimum(), Number.isFinite(value) ? value : this.minimum()),
    );
  }
  adjust(direction: number): void {
    const current = this.normalized();
    const next = this.clamp(
      Number((this.normalized() + direction * this.increment()).toFixed(10)),
    );
    if (next === current) {
      this.limitReached.emit(direction < 0 ? "min" : "max");
      this.stopRepeat();
      return;
    }
    this.commit(next);
    this.onTouched();
  }
  startRepeat(direction: number): void {
    if (!this.repeat() || this.isDisabled()) return;
    this.stopRepeat();
    this.repeatDelayTimer = setTimeout(() => {
      this.repeatTimer = setInterval(
        () => this.adjust(direction),
        Math.max(40, this.repeatInterval()),
      );
    }, Math.max(0, this.repeatDelay()));
  }
  stopRepeat(): void {
    clearTimeout(this.repeatDelayTimer);
    clearInterval(this.repeatTimer);
    this.repeatDelayTimer = undefined;
    this.repeatTimer = undefined;
  }
  edit(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = this.clamp(input.valueAsNumber);
    this.commit(value);
    input.value = String(value);
  }
}
