import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  signal,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
@Component({
  selector: "dl-toggle",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleComponent),
      multi: true,
    },
  ],
  template: `<label
    ><input
      type="checkbox"
      role="switch"
      [checked]="checked()"
      [disabled]="disabled() || formDisabled()"
      (change)="update($event)"
      (blur)="onTouched()"
    /><span class="track" aria-hidden="true"><span></span></span
    ><span>{{ label() }}</span></label
  >`,
  styles: [
    `
      :host {
        display: inline-block;
        font: 13px var(--dl-font, sans-serif);
        color: var(--dl-text, #202a24);
      }
      label {
        display: flex;
        align-items: center;
        gap: 11px;
        cursor: pointer;
        position: relative;
      }
      input {
        position: absolute;
        z-index: 1;
        opacity: 0;
        cursor: inherit;
        width: 36px;
        height: 22px;
        margin: 0;
      }
      .track {
        display: inline-flex;
        width: 36px;
        height: 22px;
        border-radius: 20px;
        align-items: center;
        background: #a4afa5;
        transition: background 0.15s;
      }
      .track span {
        width: 16px;
        height: 16px;
        margin: 3px;
        border-radius: 50%;
        background: white;
        transition: transform 0.15s;
      }
      input:checked + .track {
        background: var(--dl-primary, #285b45);
      }
      input:checked + .track span {
        transform: translateX(14px);
      }
      input:focus-visible + .track {
        outline: 3px solid var(--dl-focus, #3577b9);
        outline-offset: 3px;
      }
      label:has(input:disabled) {
        opacity: 0.5;
        cursor: not-allowed;
      }
      @media (prefers-reduced-motion: reduce) {
        .track,
        .track span {
          transition: none;
        }
      }
    `,
  ],
})
export class ToggleComponent implements ControlValueAccessor {
  readonly label = input.required<string>();
  readonly disabled = input(false);
  readonly checked = signal(false);
  readonly formDisabled = signal(false);
  private onChange: (value: boolean) => void = () => {};
  onTouched: () => void = () => {};
  writeValue(value: boolean | null): void {
    this.checked.set(!!value);
  }
  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(value: boolean): void {
    this.formDisabled.set(value);
  }
  update(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.checked.set(checked);
    this.onChange(checked);
  }
}
