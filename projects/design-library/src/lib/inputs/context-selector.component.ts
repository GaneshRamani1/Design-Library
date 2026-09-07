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
/** Segmented single selection for switching workspace or environment context. */
@Component({
  selector: "dl-context-selector",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ContextSelectorComponent),
      multi: true,
    },
  ],
  template:
    `<fieldset [disabled]="isDisabled()" [attr.aria-describedby]="descriptionId()" [attr.aria-invalid]="error() ? true : null">
    <legend>{{ label() }}{{ required() ? ' *' : '' }}</legend>
    <div class="segments">
      @for (option of options(); track option.value) {
        <label class="segment"><input type="radio" [name]="id()" [value]="option.value" [checked]="value() === option.value" [disabled]="isDisabled() || !!option.disabled" [required]="required()" (focus)="reveal($event)" (change)="choose(option.value)" (blur)="onTouched()" /><span>{{ option.label }}</span></label>
      }
    </div>
  </fieldset>` + fieldMessage,
  styles: [
    fieldStyles,
    `
      .segments {
        display: flex;
        flex-wrap: nowrap;
        gap: var(--dl-ui-gap, 4px);
        padding: var(--dl-ui-padding, 4px);
        height: var(--field-height);
        border: var(--dl-ui-border-width, 1px) solid
          var(--dl-ui-border-color, var(--dl-card-border));
        background: var(--dl-ui-background, var(--dl-card-surface));
        border-radius: var(--dl-ui-radius, 14px);
      }
      .segment {
        flex: 1 1 0;
        min-width: 0;
        position: relative;
        cursor: pointer;
      }
      input {
        position: absolute;
        width: 100%;
        height: 100%;
        margin: 0;
        opacity: 0;
        cursor: inherit;
      }
      span {
        display: block;
        padding: var(--dl-ui-padding, 0 var(--field-inset));
        height: calc(var(--field-height) - 10px);
        line-height: calc(var(--field-height) - 10px);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
        border-radius: var(--dl-ui-radius, 9px);
        color: var(--dl-ui-color, var(--dl-muted));
        overflow-wrap: anywhere;
      }
      .segment input:disabled {
        opacity: 0;
      }
      .segment input:focus-visible {
        outline: none;
      }
      input:checked + span {
        background: var(--dl-ui-background, var(--dl-primary));
        color: var(--dl-ui-color, var(--dl-on-primary));
        box-shadow: var(--dl-ui-shadow, 0 2px 8px #0002);
      }
      input:focus-visible + span {
        outline: 2px solid var(--dl-ui-focus-color, var(--dl-focus));
        outline-offset: 2px;
      }
      .segment:has(input:disabled) {
        opacity: 0.5;
        cursor: not-allowed;
      }

      @media (max-width: 600px) {
        .segments {
          overflow-x: auto;
        }
        .segment {
          flex: 1 0 auto;
        }
        .segment span {
          overflow: visible;
          text-overflow: clip;
        }
      }
    `,
  ],
})
export class ContextSelectorComponent extends FormControlBase<string> {
  readonly options = input<SelectOption[]>([]);
  reveal(event: FocusEvent): void {
    (event.target as HTMLElement).scrollIntoView({
      block: "nearest",
      inline: "nearest",
    });
  }
  choose(value: string): void {
    this.commit(value);
  }
}
