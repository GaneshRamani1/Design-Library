import { Appearance } from "./shared/appearance";
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  signal,
  output,
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
  host: { "[attr.data-size]": "size()" },
  template: `<label [class.reverse]="labelPosition() === 'start'"
    ><input
      type="checkbox"
      role="switch"
      [attr.aria-label]="showLabel() ? null : label()"
      [checked]="checked()"
      [disabled]="disabled() || formDisabled()"
      (change)="update($event)"
      (blur)="onTouched()"
    /><span class="track" aria-hidden="true"><span></span></span>
    @if (showLabel()) {
      <span
        >{{ label() }}
        @if (description()) {
          <small>{{ description() }}</small>
        }
      </span>
    }
  </label>`,
  styles: [
    `
      :host {
        display: inline-block;
        font: var(--dl-ui-font-size, 13px) var(--dl-font, sans-serif);
        color: var(--dl-ui-color, var(--dl-text, #202a24));
      }
      small {
        display: block;
        color: var(--dl-ui-color, var(--dl-muted));
        font-size: var(--dl-ui-font-size, 12px);
        margin-top: 4px;
      }
      .reverse {
        flex-direction: row-reverse;
        justify-content: flex-end;
      }
      :host([data-size="sm"]) {
        font-size: var(--dl-ui-font-size, 12px);
      }
      :host([data-size="lg"]) {
        font-size: var(--dl-ui-font-size, 16px);
      }
      label {
        display: flex;
        align-items: center;
        gap: var(--dl-ui-gap, 11px);
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
        border-radius: var(--dl-ui-radius, 20px);
        align-items: center;
        background: var(--dl-ui-background, var(--dl-switch-track, #a4afa5));
        transition: background 0.15s;
      }
      .track span {
        width: 16px;
        height: 16px;
        margin: 3px;
        border-radius: var(--dl-ui-radius, 50%);
        background: var(--dl-ui-background, var(--dl-switch-thumb, white));
        transition: transform 0.15s;
      }
      input:checked + .track {
        background: var(--dl-ui-background, var(--dl-primary, #285b45));
      }
      input:checked + .track span {
        transform: translateX(14px);
        background: var(--dl-ui-background, var(--dl-on-primary, white));
      }
      input:focus-visible + .track {
        outline: 3px solid var(--dl-ui-focus-color, var(--dl-focus, #3577b9));
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
export class ToggleComponent
  extends Appearance
  implements ControlValueAccessor
{
  readonly size = input<"sm" | "md" | "lg">("md");
  readonly description = input("");
  readonly labelPosition = input<"start" | "end">("end");
  readonly showLabel = input(true);
  readonly label = input.required<string>();
  readonly disabled = input(false);
  readonly valueChange = output<boolean>();
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
    this.valueChange.emit(checked);
  }
}
