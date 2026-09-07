import {
  afterRenderEffect,
  viewChild,
  ElementRef,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  forwardRef,
  input,
  output,
  signal,
  untracked,
} from "@angular/core";
import {
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  type AbstractControl,
  type Validator,
  type ValidationErrors,
} from "@angular/forms";
import {
  FormControlBase,
  fieldStyles,
  fieldMessage,
} from "./form-control-base";
import {
  formatNumber,
  shiftDecimal,
  parseNumber,
  numericErrors,
  type NumberFormatOptions,
} from "./number-format";
@Component({
  selector: "dl-number-input",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NumberInputComponent),
      multi: true,
    },
  ],
  template:
    `<label class="label" [for]="id()+'-control'">{{label()}}@if(required()){<span aria-hidden="true"> *</span>}</label><input class="field"
      #nativeField type="text" inputmode="decimal" [id]="id()+'-control'" [placeholder]="placeholder()" [readOnly]="readOnly()" [disabled]="isDisabled()" [required]="required()" [attr.aria-describedby]="descriptionId()" [attr.aria-invalid]="error()?true:null" [style.text-align]="textAlign()" (focus)="focus($event)" (input)="edit($event)" (blur)="blur($event)"/>` +
    fieldMessage,
  styles: [fieldStyles],
})
export class NumberInputComponent
  extends FormControlBase<number | null>
  implements Validator
{
  readonly format = input<"decimal" | "currency" | "percent">("decimal");
  readonly locale = input("en-US");
  readonly currency = input("USD");
  readonly currencyDisplay = input<"symbol" | "narrowSymbol" | "code">(
    "symbol",
  );
  readonly precision = input(2);
  readonly minPrecision = input<number | null>(null);
  readonly useGrouping = input(true);
  readonly percentValue = input<"points" | "fraction">("points");
  readonly signDisplay = input<"auto" | "always" | "exceptZero" | "never">(
    "auto",
  );
  readonly formatOn = input<"blur" | "input">("blur");
  readonly maskInput = input(true);
  readonly selectOnFocus = input(true);
  readonly validatePrecision = input(true);
  readonly min = input<number | null>(null);
  readonly max = input<number | null>(null);
  readonly step = input<number | null>(null);
  readonly readOnly = input(false);
  readonly placeholder = input("");
  readonly textAlign = input<"start" | "center" | "end">("start");
  readonly formattedChange = output<{
    value: number | null;
    formatted: string;
  }>();
  readonly inputRejected = output<{ attempted: string }>();
  readonly display = signal("");
  private readonly nativeField =
    viewChild<ElementRef<HTMLInputElement>>("nativeField");
  private invalidDraft = false;
  private editing = false;
  private validatorChange: () => void = () => {};
  readonly formatOptions = computed<NumberFormatOptions>(() => ({
    format: this.format(),
    locale: this.locale(),
    currency: this.currency(),
    currencyDisplay: this.currencyDisplay(),
    precision: this.precision(),
    minPrecision: this.minPrecision(),
    useGrouping: this.useGrouping(),
    percentValue: this.percentValue(),
    signDisplay: this.signDisplay(),
  }));
  readonly validationOptions = computed(() => ({
    min: this.min(),
    max: this.max(),
    step: this.step(),
    precision: this.validatePrecision() ? this.precision() : null,
    percentValue:
      this.format() === "percent" ? this.percentValue() : ("points" as const),
  }));
  constructor() {
    super();
    afterRenderEffect(() => {
      const field = this.nativeField()?.nativeElement;
      const value = this.display();
      // Do not reassign an unchanged DOM value: it would reset the selection after focus/editing.
      if (field && field.value !== value) field.value = value;
    });
    effect(() => {
      const options = this.formatOptions();
      this.validationOptions();
      untracked(() => {
        if (!this.editing)
          this.display.set(this.formatValue(this.value(), options));
        this.validatorChange();
      });
    });
  }
  override writeValue(value: number | null): void {
    super.writeValue(value);
    this.invalidDraft = false;
    this.display.set(this.formatValue(value));
  }
  validate(control: AbstractControl): ValidationErrors | null {
    return this.invalidDraft
      ? { numeric: true }
      : numericErrors(control.value, this.validationOptions());
  }
  registerOnValidatorChange(fn: () => void): void {
    this.validatorChange = fn;
  }
  private formatValue(
    value: number | null,
    options = this.formatOptions(),
  ): string {
    // Preserve visible precision errors instead of rounding away invalid digits.
    const invalid = this.validatePrecision()
      ? numericErrors(value, {
          precision: this.precision(),
          percentValue:
            this.format() === "percent" ? this.percentValue() : "points",
        })
      : null;
    if (invalid?.["precision"]?.actualPrecision > 20 && value != null)
      return String(
        this.format() === "percent" && this.percentValue() === "fraction"
          ? shiftDecimal(value, 2)
          : value,
      );
    return formatNumber(
      value,
      invalid?.["precision"]
        ? {
            ...options,
            precision: Math.min(20, invalid["precision"].actualPrecision),
            minPrecision: 0,
          }
        : options,
    );
  }
  focus(event: FocusEvent): void {
    this.editing = true;
    if (this.readOnly() || this.formatOn() === "input") return;
    const value = this.value();
    if (!this.invalidDraft)
      this.display.set(
        formatNumber(value, {
          ...this.formatOptions(),
          format: "decimal",
          useGrouping: false,
          precision: 20,
          minPrecision: 0,
          signDisplay: "auto",
          percentValue: "points",
        }),
      );
    if (
      this.format() === "percent" &&
      this.percentValue() === "fraction" &&
      value != null &&
      !this.invalidDraft
    )
      this.display.set(
        formatNumber(shiftDecimal(value, 2), {
          ...this.formatOptions(),
          format: "decimal",
          precision: 20,
          minPrecision: 0,
          useGrouping: false,
          signDisplay: "auto",
        }),
      );
    const field = event.target as HTMLInputElement;
    field.value = this.display();
    if (this.selectOnFocus()) field.select();
  }
  edit(event: Event): void {
    if (this.isDisabled() || this.readOnly()) return;
    const field = event.target as HTMLInputElement,
      attempted = field.value;
    const transient = /^[+-]$/.test(attempted) || /^[+-]?[.,]$/.test(attempted);
    const parsed = parseNumber(attempted, this.formatOptions());
    if (Number.isNaN(parsed) && this.maskInput() && !transient) {
      field.value = this.display();
      this.inputRejected.emit({ attempted });
      return;
    }
    this.invalidDraft = Number.isNaN(parsed);
    const value = this.invalidDraft ? null : parsed;
    this.display.set(attempted);
    this.commit(value);
    this.validatorChange();
    // Defer trailing decimal / zero drafts until blur so edits stay natural.
    if (
      this.formatOn() === "input" &&
      value != null &&
      !/[.,]$|[.,]\d*0$/.test(attempted)
    ) {
      const position = field.selectionStart ?? attempted.length;
      const digits = attempted.slice(0, position).replace(/\D/g, "").length;
      const formatted = this.formatValue(value);
      this.display.set(formatted);
      field.value = formatted;
      let cursor = 0,
        seen = 0;
      while (cursor < formatted.length && seen < digits) {
        if (/\d/.test(formatted[cursor]!)) seen++;
        cursor++;
      }
      field.setSelectionRange(cursor, cursor);
    }
    this.formattedChange.emit({ value, formatted: this.display() });
  }
  blur(event: FocusEvent): void {
    this.editing = false;
    if (!this.invalidDraft) this.display.set(this.formatValue(this.value()));
    (event.target as HTMLInputElement).value = this.display();
    this.onTouched();
    this.formattedChange.emit({
      value: this.value(),
      formatted: this.display(),
    });
  }
}
