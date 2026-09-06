import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  signal,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
/** Labeled form field supporting Angular reactive and template-driven forms. */
@Component({
  selector: "dl-input",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
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
        [type]="type()"
        [placeholder]="placeholder()"
        [value]="value()"
        [disabled]="disabled() || formDisabled()"
        [required]="required()"
        [attr.autocomplete]="autocomplete()"
        [attr.aria-invalid]="error() ? true : null"
        [attr.aria-describedby]="error() || hint() ? id() + '-message' : null"
        (input)="update($event)"
        (blur)="onTouched()"
    /></label>
    @if (error() || hint()) {
      <p [id]="id() + '-message'" [class.error]="error()">
        {{ error() || hint() }}
      </p>
    }`,
  styles: [
    `
      :host {
        display: block;
        font-family: var(--dl-font, sans-serif);
        min-width: 220px;
      }
      .label {
        display: block;
        font-weight: 500;
        font-size: 13px;
        margin-bottom: 8px;
        color: var(--dl-text, #202a24);
      }
      input {
        box-sizing: border-box;
        width: 100%;
        border: 1px solid var(--dl-border, #dce2da);
        border-radius: 8px;
        padding: 11px 12px;
        background: var(--dl-surface, #fff);
        color: var(--dl-text, #202a24);
        font: 14px var(--dl-font, sans-serif);
      }
      input:focus {
        outline: 2px solid var(--dl-focus, #3577b9);
        outline-offset: 2px;
      }
      input[aria-invalid="true"] {
        border-color: var(--dl-danger, #ab3434);
      }
      input:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }
      p {
        font-size: 12px;
        color: var(--dl-muted, #647068);
        margin: 7px 0 0;
      }
      .error {
        color: var(--dl-danger, #ab3434);
      }
    `,
  ],
})
export class InputComponent implements ControlValueAccessor {
  /** Unique, stable identifier used to associate hint/error text. */
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly placeholder = input("");
  readonly hint = input("");
  readonly error = input("");
  readonly type = input<
    "text" | "email" | "password" | "search" | "tel" | "url"
  >("text");
  readonly autocomplete = input("off");
  readonly required = input(false);
  readonly disabled = input(false);
  readonly value = signal("");
  readonly formDisabled = signal(false);
  private onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};
  writeValue(value: string | null): void {
    this.value.set(value ?? "");
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
    const value = (event.target as HTMLInputElement).value;
    this.value.set(value);
    this.onChange(value);
  }
}
