import { Appearance } from "../shared/appearance";
import { computed, Directive, input, output, signal } from "@angular/core";
import { fieldMetrics } from "./field-metrics";
import type { ControlValueAccessor } from "@angular/forms";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}
/** Bind with ngModel or formControl; valueChange also reports user edits. */
@Directive({
  host: {
    "[attr.data-size]": "size()",
    "[style.width]": "stretch() ? '100%' : null",
  },
})
export abstract class FormControlBase<T>
  extends Appearance
  implements ControlValueAccessor
{
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly hint = input("");
  readonly error = input("");
  readonly required = input(false);
  readonly disabled = input(false);
  readonly size = input<"sm" | "md" | "lg">("md");
  readonly stretch = input(false);
  readonly valueChange = output<T>();
  readonly value = signal<T | null>(null);
  protected readonly formDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  readonly descriptionId = computed(() =>
    this.hint() || this.error() ? `${this.id()}-message` : null,
  );
  protected onChange: (value: T) => void = () => {};
  onTouched: () => void = () => {};
  writeValue(value: T | null): void {
    this.value.set(value);
  }
  registerOnChange(fn: (value: T) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }
  protected commit(value: T): void {
    if (this.isDisabled()) return;
    this.value.set(value);
    this.onChange(value);
    this.valueChange.emit(value);
  }
}
export const fieldStyles = `
  :host { display: block; min-width: 0; width: 280px; max-width: 100%; font: var(--dl-ui-font-size, 14px) var(--dl-font); color: var(--dl-ui-color, var(--dl-text)); }
  ${fieldMetrics}
  * { box-sizing: border-box; }
  .label, legend { display: block; font-size: var(--dl-ui-font-size, 13px); font-weight: 500; margin-bottom: 8px; padding: var(--dl-ui-padding, 0); }
  .field { appearance: none; -webkit-appearance: none; width: 100%; height: var(--field-height); padding: var(--dl-ui-padding, var(--field-padding)); border:var(--dl-ui-border-width, 1px) solid var(--dl-ui-border-color, var(--dl-border)); border-radius: var(--dl-ui-radius, var(--dl-radius)); background: var(--dl-ui-background, var(--dl-surface)); color: var(--dl-ui-color, var(--dl-text)); font: inherit; line-height: 20px; }
  .field[aria-invalid="true"] { border-color: var(--dl-ui-border-color, var(--dl-danger)); }
  :is(button, select, input):focus-visible { outline: 2px solid var(--dl-ui-focus-color, var(--dl-focus)); outline-offset: 3px; }
  :is(button, select, input):disabled { cursor: not-allowed; opacity: 0.5; }
  .label, legend, .message { overflow-wrap:anywhere; }
  @media(max-width:600px) and (pointer:coarse) { .field, input:not([type=radio]):not([type=checkbox]), select, textarea { font-size:var(--dl-mobile-input-font-size,16px); } }
  .message { font-size: var(--dl-ui-font-size, 12px); line-height: 1.5; color: var(--dl-ui-color, var(--dl-muted)); margin: 8px 0 0; }
  .error { color: var(--dl-ui-color, var(--dl-danger)); }
  fieldset { min-width: 0; margin: 0; padding: var(--dl-ui-padding, 0); border: 0; }
  input { accent-color: var(--dl-primary); }
`;
export const fieldMessage = `@if (hint() || error()) { <p class="message" [class.error]="error()" [id]="id() + '-message'">{{ error() || hint() }}</p> }`;
