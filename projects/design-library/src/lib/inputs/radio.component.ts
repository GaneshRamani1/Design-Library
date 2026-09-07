import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import {
  FormControlBase,
  fieldStyles,
  fieldMessage,
  type SelectOption,
} from "./form-control-base";
/** A native radio group; arrow keys move between enabled choices. */
@Component({
  selector: "dl-radio",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioComponent),
      multi: true,
    },
  ],
  template:
    `<fieldset [disabled]="isDisabled()" [attr.aria-describedby]="descriptionId()" [attr.aria-invalid]="error() ? true : null">
    <legend>{{ label() }}{{ required() ? ' *' : '' }}</legend>
    <div class="choices" [class.horizontal]="orientation() === 'horizontal'">
      @for (option of options(); track option.value) {
        <label class="choice"><input type="radio" [name]="id()" [value]="option.value" [checked]="value() === option.value" [disabled]="isDisabled() || !!option.disabled" [required]="required()" (change)="choose(option.value)" (blur)="onTouched()" />
          <span>{{ option.label }} @if (showDescriptions() && option.description) { <small>{{ option.description }}</small> }</span>
        </label>
      }
    </div>
  </fieldset>` + fieldMessage,
  styles: [
    fieldStyles,
    `
      .choices {
        display: flex;
        flex-direction: column;
        gap: var(--dl-ui-gap, 14px);
      }
      .horizontal {
        flex-direction: row;
        flex-wrap: wrap;
      }
      .choice {
        display: flex;
        align-items: flex-start;
        gap: var(--dl-ui-gap, 10px);
        cursor: pointer;
        line-height: 1.5;
      }
      input {
        flex-shrink: 0;
        width: 16px;
        height: 16px;
        margin: 2px 0 0;
      }
      small {
        display: block;
        font-size: var(--dl-ui-font-size, 12px);
        color: var(--dl-ui-color, var(--dl-muted));
      }
      .choice:has(input:disabled) {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `,
  ],
})
export class RadioComponent extends FormControlBase<string> {
  readonly showDescriptions = input(true);
  readonly options = input<SelectOption[]>([]);
  readonly orientation = input<"vertical" | "horizontal">("vertical");
  choose(value: string): void {
    this.commit(value);
  }
}
