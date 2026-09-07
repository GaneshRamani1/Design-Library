import { Component, forwardRef, input, output } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import {
  FormControlBase,
  fieldStyles,
  fieldMessage,
} from "./form-control-base";
import { IconComponent } from "../icons/icon.component";
export interface ChipOption {
  value: string;
  label: string;
  icon?: string;
  disabled?: boolean;
}
@Component({
  selector: "dl-chips",
  standalone: true,
  imports: [IconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChipsComponent),
      multi: true,
    },
  ],
  template:
    `<span class="label" [id]="id()+'-label'">{{label()}}</span><div class="chips" role="group" [attr.aria-labelledby]="id()+'-label'" [attr.aria-describedby]="descriptionId()">@for(chip of options();track chip.value){<span class="chip" [class.selected]="isSelected(chip.value)" [class.disabled]="isDisabled()||chip.disabled">@if(selectable()){<button type="button" class="main" [disabled]="isDisabled()||chip.disabled" [attr.aria-pressed]="isSelected(chip.value)" (click)="toggleChip(chip)" (blur)="onTouched()">@if(chip.icon){<dl-icon [name]="chip.icon" [size]="16"/>}{{chip.label}}</button>}@else{<span class="main">@if(chip.icon){<dl-icon [name]="chip.icon" [size]="16"/>}{{chip.label}}</span>}@if(removable()){<button type="button" class="remove" [disabled]="isDisabled()||chip.disabled" [attr.aria-label]="removeLabel()+' '+chip.label" (click)="remove(chip)"><dl-icon name="x" [size]="14"/></button>}</span>}@empty{<span class="message">{{emptyText()}}</span>}</div>` +
    fieldMessage,
  styles: [
    fieldStyles,
    `
      :host {
        width: auto;
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: var(--dl-ui-gap, 8px);
      }
      .chip {
        display: inline-flex;
        align-items: center;
        border: var(--dl-ui-border-width, 1px) solid
          var(--dl-ui-border-color, var(--dl-border));
        border-radius: var(--dl-ui-radius, 999px);
        background: var(--dl-ui-background, var(--dl-surface));
        overflow: hidden;
      }
      .main,
      .remove {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        border: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        padding: var(--dl-ui-padding, 8px 12px);
      }
      button {
        cursor: pointer;
      }
      .remove {
        padding-inline: 6px;
        margin-right: 4px;
      }
      .selected {
        background: var(--dl-primary);
        color: var(--dl-on-primary);
      }
      .disabled {
        opacity: 0.5;
      }
      :host([data-size="sm"]) .main {
        padding: var(--dl-ui-padding, 4px 8px);
      }
      :host([data-size="lg"]) .main {
        padding: var(--dl-ui-padding, 12px 16px);
      }
    `,
  ],
})
export class ChipsComponent extends FormControlBase<string[]> {
  readonly options = input<ChipOption[]>([]);
  readonly selectable = input(true);
  readonly multiple = input(true);
  readonly removable = input(true);
  readonly removeLabel = input("Remove");
  readonly emptyText = input("No chips");
  readonly removed = output<ChipOption>();
  isSelected(v: string): boolean {
    return (this.value() ?? []).includes(v);
  }
  toggleChip(chip: ChipOption): void {
    if (this.isDisabled() || chip.disabled) return;
    const selected = this.value() ?? [];
    this.commit(
      this.isSelected(chip.value)
        ? selected.filter((v) => v !== chip.value)
        : this.multiple()
          ? [...selected, chip.value]
          : [chip.value],
    );
  }
  remove(chip: ChipOption): void {
    if (this.isDisabled() || chip.disabled) return;
    this.commit((this.value() ?? []).filter((v) => v !== chip.value));
    this.removed.emit(chip);
    this.onTouched();
  }
}
