import { Component, computed, forwardRef, input, output, signal } from "@angular/core";
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
    `<span class="label" [id]="id()+'-label'">{{label()}}</span><div class="chips" role="group" [attr.aria-labelledby]="id()+'-label'" [attr.aria-describedby]="descriptionId()">@for(chip of visibleOptions();track chip.value;let index=$index){<span class="chip" [class.selected]="isSelected(chip.value)" [class.disabled]="isDisabled()||chip.disabled">@if(selectable()){<button type="button" class="main" [disabled]="isDisabled()||chip.disabled" [attr.aria-pressed]="isSelected(chip.value)" (click)="toggleChip(chip)" (blur)="onTouched()">@if(chip.icon){<dl-icon [name]="chip.icon" [size]="16"/>}{{chip.label}}</button>}@else{<span class="main">@if(chip.icon){<dl-icon [name]="chip.icon" [size]="16"/>}{{chip.label}}</span>}@if(reorderable()){<button type="button" class="reorder" [disabled]="isDisabled()||chip.disabled||index===0" [attr.aria-label]="moveBeforeLabel()+' '+chip.label" (click)="move(index,-1)">←</button><button type="button" class="reorder" [disabled]="isDisabled()||chip.disabled||index===options().length-1" [attr.aria-label]="moveAfterLabel()+' '+chip.label" (click)="move(index,1)">→</button>}@if(removable()){<button type="button" class="remove" [disabled]="isDisabled()||chip.disabled" [attr.aria-label]="removeLabel()+' '+chip.label" (click)="remove(chip)"><dl-icon name="x" [size]="14"/></button>}</span>}@if(hiddenCount()>0){<span class="chip"><span class="main">{{overflowLabel().replace('{count}',hiddenCount().toString())}}</span></span>}@if(allowCreate()){<span class="creator"><input [attr.aria-label]="createInputLabel()" [placeholder]="createPlaceholder()" [value]="draft()" [disabled]="isDisabled()" (input)="draft.set($any($event.target).value)" (keydown.enter)="create();$event.preventDefault()"/><button type="button" [disabled]="isDisabled()||!draft().trim()" (click)="create()">{{createLabel()}}</button></span>}@if(!options().length&&!allowCreate()){<span class="message">{{emptyText()}}</span>}</div>` +
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
      .reorder{border:0;background:transparent;color:inherit;padding:4px;cursor:pointer}.reorder:disabled{opacity:.35;cursor:not-allowed}
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
      .creator{display:inline-flex;gap:6px}.creator input,.creator button{min-height:36px;border:1px solid var(--dl-border);border-radius:8px;background:var(--dl-surface);color:var(--dl-text);font:inherit;padding:6px 10px}
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
  readonly maxVisible = input<number | null>(null);
  readonly overflowLabel = input("+{count} more");
  readonly allowCreate = input(false);
  readonly createPlaceholder = input("Add a value");
  readonly createInputLabel = input("New chip value");
  readonly createLabel = input("Add");
  readonly reorderable = input(false);
  readonly moveBeforeLabel = input("Move before");
  readonly moveAfterLabel = input("Move after");
  readonly removed = output<ChipOption>();
  readonly created = output<ChipOption>();
  readonly reordered = output<{ options: ChipOption[]; from: number; to: number }>();
  readonly draft = signal("");
  readonly visibleOptions = computed(() => this.maxVisible() === null ? this.options() : this.options().slice(0, Math.max(0, Math.floor(this.maxVisible()!))));
  readonly hiddenCount = computed(() => Math.max(0, this.options().length - this.visibleOptions().length));
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
  create(): void {
    const label = this.draft().trim();
    if (!label || this.isDisabled()) return;
    const chip = { value: label, label };
    this.created.emit(chip);
    if (this.selectable()) this.commit(this.multiple() ? [...(this.value() ?? []), chip.value] : [chip.value]);
    this.draft.set("");
  }
  move(from: number, direction: number): void {
    const to = from + direction;
    if (!this.reorderable() || this.isDisabled() || to < 0 || to >= this.options().length) return;
    const options = [...this.options()];
    const [item] = options.splice(from, 1);
    options.splice(to, 0, item);
    this.reordered.emit({ options, from, to });
  }
}
