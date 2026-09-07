import { Appearance } from "./shared/appearance";
import {
  afterRenderEffect,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  output,
  untracked,
  viewChild,
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  signal,
} from "@angular/core";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  type AbstractControl,
  type ValidationErrors,
  type Validator,
} from "@angular/forms";
import IMask, {
  createMask,
  type InputMask,
  type MaskedPatternOptions,
} from "imask";
import {
  INPUT_MASK_PRESETS,
  type InputMaskPreset,
  type InputMaskValue,
  type InputMaskOptions,
} from "./inputs/input-mask";
import { fieldStyles } from "./inputs/form-control-base";
/** Labeled form field supporting Angular reactive and template-driven forms. */
@Component({
  selector: "dl-input",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[attr.data-size]": "size()",
    "[style.width]": "stretch() ? '100%' : null",
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `<label
      ><span class="label"
        >{{ label() }}
        @if (required()) {
          <span aria-hidden="true">*</span>
        }</span
      ><input
        #field
        class="field"
        [id]="id() + '-input'"
        [attr.inputmode]="resolvedInputMode()"
        [type]="
          maskPattern() ? (type() === 'password' ? 'password' : 'text') : type()
        "
        [readOnly]="readOnly()"
        [attr.maxlength]="maskPattern() ? null : maxLength()"
        [attr.minlength]="minLength()"
        [attr.pattern]="pattern() || null"
        [attr.name]="name() || null"
        [placeholder]="placeholder()"
        [value]="displayValue()"
        [disabled]="disabled() || formDisabled()"
        [required]="required()"
        [attr.autocomplete]="autocomplete()"
        [attr.aria-invalid]="error() ? true : null"
        [attr.aria-describedby]="error() || hint() ? id() + '-message' : null"
        (input)="update($event)"
        (blur)="onTouched()"
    /></label>
    @if (error() || hint()) {
      <p class="message" [id]="id() + '-message'" [class.error]="error()">
        {{ error() || hint() }}
      </p>
    }`,
  styles: [fieldStyles],
})
export class InputComponent
  extends Appearance
  implements ControlValueAccessor, Validator
{
  /** Unique, stable identifier used to associate hint/error text. */
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly size = input<"sm" | "md" | "lg">("md");
  readonly stretch = input(false);
  readonly readOnly = input(false);
  readonly maxLength = input<number | null>(null);
  readonly minLength = input<number | null>(null);
  readonly pattern = input("");
  readonly name = input("");
  readonly placeholder = input("");
  readonly hint = input("");
  readonly error = input("");
  readonly type = input<
    "text" | "email" | "password" | "search" | "tel" | "url"
  >("text");
  readonly autocomplete = input("off");
  readonly required = input(false);
  readonly disabled = input(false);
  readonly maskPreset = input<InputMaskPreset>("none");
  /** Custom IMask pattern; overrides maskPreset when nonempty. */
  readonly mask = input("");
  readonly tinType = input<"individual" | "business">("individual");
  readonly maskValueMode = input<"raw" | "formatted">("raw");
  readonly maskValidate = input(true);
  readonly maskLazy = input(true);
  readonly maskPlaceholderChar = input("_");
  readonly maskDisplayChar = input("");
  readonly maskOverwrite = input<boolean | "shift">(false);
  readonly maskEager = input<boolean | "append" | "remove">(false);
  readonly maskSkipInvalid = input(true);
  readonly maskCase = input<"none" | "upper" | "lower">("none");
  readonly maskDefinitions = input<Record<string, string>>({});
  /** Advanced IMask pattern options; explicit options here override the convenience settings. */
  readonly maskOptions = input<InputMaskOptions>({});
  readonly inputMode = input<
    | "auto"
    | "text"
    | "numeric"
    | "decimal"
    | "tel"
    | "email"
    | "url"
    | "search"
    | "none"
  >("auto");
  readonly maskAccept = output<InputMaskValue>();
  readonly maskComplete = output<InputMaskValue>();
  readonly valueChange = output<string>();
  readonly maskPattern = computed(
    () =>
      this.mask() ||
      (this.maskPreset() === "none"
        ? ""
        : this.maskPreset() === "tin"
          ? INPUT_MASK_PRESETS[this.tinType() === "business" ? "ein" : "ssn"]
          : INPUT_MASK_PRESETS[
              this.maskPreset() as keyof typeof INPUT_MASK_PRESETS
            ]),
  );
  readonly resolvedInputMode = computed(() =>
    this.inputMode() !== "auto"
      ? this.inputMode()
      : this.maskPattern()
        ? this.maskPreset().startsWith("phone")
          ? "tel"
          : !this.mask()
            ? "numeric"
            : "text"
        : this.type() === "tel"
          ? "tel"
          : this.type() === "email"
            ? "email"
            : null,
  );
  readonly value = signal("");
  readonly displayValue = signal("");
  private readonly field = viewChild<ElementRef<HTMLInputElement>>("field");
  private maskControl: InputMask<MaskedPatternOptions> | null = null;
  private appliedOptions: MaskedPatternOptions | null = null;
  private updating = false;
  private wasComplete = false;
  private validatorChange: () => void = () => {};
  private readonly options = computed<MaskedPatternOptions>(() => {
    const casing = this.maskCase();
    return {
      mask: this.maskPattern(),
      lazy: this.maskLazy(),
      placeholderChar: this.maskPlaceholderChar().slice(0, 1) || "_",
      displayChar: this.maskDisplayChar().slice(0, 1) || undefined,
      overwrite: this.maskOverwrite(),
      eager: this.maskEager(),
      skipInvalid: this.maskSkipInvalid(),
      prepare: (value: string) =>
        casing === "upper"
          ? value.toUpperCase()
          : casing === "lower"
            ? value.toLowerCase()
            : value,
      definitions: Object.fromEntries(
        Object.entries(this.maskDefinitions()).map(([key, pattern]) => [
          key,
          new RegExp(pattern),
        ]),
      ),
      ...this.maskOptions(),
    };
  });
  constructor() {
    super();
    afterRenderEffect(() => {
      const options = this.options(),
        mode = this.maskValueMode(),
        value = this.value(),
        field = this.field()?.nativeElement,
        validate = this.maskValidate();
      if (!field) return;
      untracked(() => {
        this.updating = true;
        try {
          if (!options.mask) {
            this.maskControl?.destroy();
            this.maskControl = null;
            this.appliedOptions = null;
            this.displayValue.set(value);
            field.value = value;
          } else {
            if (!this.maskControl) {
              this.maskControl = IMask(field, options);
              this.maskControl.on("accept", () => this.acceptMask());
              this.appliedOptions = options;
            } else if (this.appliedOptions !== options) {
              this.maskControl.updateOptions(options);
              this.appliedOptions = options;
            }
            const current =
              mode === "raw"
                ? this.maskControl.unmaskedValue
                : this.snapshot().formatted;
            if (current !== value) {
              if (mode === "raw") this.maskControl.unmaskedValue = value;
              else this.maskControl.value = value;
            }
            this.displayValue.set(this.maskControl.displayValue);
            this.wasComplete = this.maskControl.masked.isComplete;
          }
          this.validatorChange();
        } finally {
          this.updating = false;
        }
      });
    });
    inject(DestroyRef).onDestroy(() => this.maskControl?.destroy());
  }
  private snapshot(): InputMaskValue {
    const raw = this.maskControl?.unmaskedValue ?? "";
    const formatted = createMask({
      ...this.options(),
      lazy: true,
      displayChar: undefined,
    });
    formatted.unmaskedValue = raw;
    return {
      raw,
      formatted: formatted.value,
      complete: this.maskControl?.masked.isComplete ?? false,
    };
  }
  private acceptMask(): void {
    if (this.updating || !this.maskControl) return;
    const state = this.snapshot(),
      value = this.maskValueMode() === "raw" ? state.raw : state.formatted;
    this.displayValue.set(this.maskControl.displayValue);
    this.value.set(value);
    this.onChange(value);
    this.valueChange.emit(value);
    this.maskAccept.emit(state);
    if (state.complete && !this.wasComplete) this.maskComplete.emit(state);
    this.wasComplete = state.complete;
  }
  validate(control: AbstractControl): ValidationErrors | null {
    if (
      !this.maskPattern() ||
      !this.maskValidate() ||
      control.value == null ||
      control.value === ""
    )
      return null;
    const masked = createMask({
      ...this.options(),
      lazy: true,
      displayChar: undefined,
    });
    const original = String(control.value);
    if (this.maskValueMode() === "raw") masked.unmaskedValue = original;
    else masked.value = original;
    const normalized =
      this.maskValueMode() === "raw" ? masked.unmaskedValue : masked.value;
    return masked.isComplete && normalized === original
      ? null
      : {
          mask: {
            preset: this.maskPreset(),
            pattern: this.maskPattern(),
            complete: masked.isComplete,
          },
        };
  }
  registerOnValidatorChange(fn: () => void): void {
    this.validatorChange = fn;
  }

  readonly formDisabled = signal(false);
  private onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};
  writeValue(value: string | null): void {
    this.value.set(value ?? "");
    if (!this.maskPattern()) this.displayValue.set(value ?? "");
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }
  update(event: Event): void {
    if (
      this.maskPattern() ||
      this.readOnly() ||
      this.disabled() ||
      this.formDisabled()
    )
      return;
    const value = (event.target as HTMLInputElement).value;
    this.value.set(value);
    this.displayValue.set(value);
    this.onChange(value);
    this.valueChange.emit(value);
  }
}
