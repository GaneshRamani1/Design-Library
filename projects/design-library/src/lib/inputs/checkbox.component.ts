import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  model,
  output,
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import {
  FormControlBase,
  fieldStyles,
  fieldMessage,
} from "./form-control-base";
/** Native checkbox with optional indeterminate state and Angular forms support. */
@Component({
  selector: "dl-checkbox",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
  template:
    `<label class="choice" [class.reverse]="labelPosition() === 'start'"><input type="checkbox" [id]="id() + '-control'" [checked]="resolvedChecked()" [indeterminate]="resolvedIndeterminate()" [disabled]="isDisabled()" [required]="required()" [attr.aria-describedby]="descriptionId()" [attr.aria-invalid]="error() ? true : null" (change)="change($event)" (blur)="onTouched()"/><span>{{label()}}{{required() ? ' *' : ''}} @if(description()){<small>{{description()}}</small>}</span></label>` +
    fieldMessage,
  styles: [
    fieldStyles,
    `
      .choice {
        display: flex;
        align-items: flex-start;
        gap: var(--dl-ui-gap, 10px);
        cursor: pointer;
        line-height: 20px;
      }
      .reverse {
        flex-direction: row-reverse;
        justify-content: flex-end;
      }
      input {
        width: 18px;
        height: 18px;
        margin: 1px 0;
        flex-shrink: 0;
      }
      :host([data-size="sm"]) input {
        width: 16px;
        height: 16px;
      }
      :host([data-size="lg"]) input {
        width: 22px;
        height: 22px;
      }
      small {
        display: block;
        color: var(--dl-ui-color, var(--dl-muted));
        font-size: var(--dl-ui-font-size, 12px);
      }
      .choice:has(input:disabled) {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `,
  ],
})
export class CheckboxComponent extends FormControlBase<boolean> {
  readonly indeterminate = model(false);
  readonly description = input("");
  readonly labelPosition = input<"start" | "end">("end");
  readonly checkedCount = input<number | null>(null);
  readonly totalCount = input<number | null>(null);
  readonly cascade = output<boolean>();
  readonly resolvedChecked = computed(() => this.totalCount() !== null && this.checkedCount() !== null ? this.totalCount()! > 0 && this.checkedCount()! >= this.totalCount()! : !!this.value());
  readonly resolvedIndeterminate = computed(() => this.totalCount() !== null && this.checkedCount() !== null ? this.checkedCount()! > 0 && this.checkedCount()! < this.totalCount()! : this.indeterminate());
  change(event: Event): void {
    if (this.isDisabled()) return;
    this.indeterminate.set(false);
    const checked = (event.target as HTMLInputElement).checked;
    this.commit(checked);
    if (this.totalCount() !== null) this.cascade.emit(checked);
  }
}
