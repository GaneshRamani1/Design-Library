import { Component, forwardRef, input } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import {
  FormControlBase,
  fieldStyles,
  fieldMessage,
  type SelectOption,
} from "./form-control-base";
import { IconComponent } from "../icons/icon.component";
export interface SegmentOption extends SelectOption {
  icon?: string;
  description?: string;
}
@Component({
  selector: "dl-segmented-buttons",
  standalone: true,
  imports: [IconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SegmentedButtonsComponent),
      multi: true,
    },
  ],
  template:
    `@if(showLabel()){<span class="label" [id]="id()+'-label'">{{label()}}</span>}<div class="segments" [class.vertical]="orientation()==='vertical'" [class.selectable-list]="presentation()==='list'" [attr.role]="multiple()?'group':'radiogroup'" [attr.aria-label]="showLabel()?null:label()" [attr.aria-labelledby]="showLabel()?id()+'-label':null" [attr.aria-describedby]="descriptionId()" [attr.aria-orientation]="orientation()" (keydown)="navigate($event)">@for(option of options();track option.value){<button type="button" [disabled]="isDisabled()||option.disabled" [attr.role]="multiple()?null:'radio'" [attr.aria-checked]="multiple()?null:selected(option.value)" [attr.aria-pressed]="multiple()?selected(option.value):null" [attr.tabindex]="multiple()?0:tabIndex(option.value)" [class.selected]="selected(option.value)" (click)="choose(option)" (focus)="reveal($event)" (blur)="onTouched()">@if(option.icon){<dl-icon [name]="option.icon" [size]="18"/>}<span class="option-copy"><span>{{option.label}}</span>@if(option.description){<small>{{option.description}}</small>}</span>@if(presentation()==='list'){<span class="indicator" aria-hidden="true">{{selected(option.value)?'✓':''}}</span>}</button>}</div>` +
    fieldMessage,
  styles: [
    fieldStyles,
    `
      :host {
        width: auto;
      }
      .segments {
        display: flex;
        padding: var(--dl-ui-padding, 4px);
        gap: var(--dl-ui-gap, 4px);
        border: var(--dl-ui-border-width, 1px) solid
          var(--dl-ui-border-color, var(--dl-border));
        border-radius: var(--dl-ui-radius, var(--dl-radius));
        background: var(--dl-ui-background, var(--dl-surface));
      }
      button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        flex: 1;
        min-width: 0;
        min-height: calc(var(--field-height) - 10px);
        padding: 6px 16px;
        border: 0;
        border-radius: calc(var(--dl-radius) - 3px);
        background: transparent;
        color: var(--dl-muted);
        font: inherit;
        cursor: pointer;
      }
      .selected {
        background: var(--dl-primary);
        color: var(--dl-on-primary);
      }
      .vertical {
        flex-direction: column;
      }

      .segments {
        overflow-x: auto;
        max-width: 100%;
      }
      button span {
        min-width: 0;
        overflow-wrap: anywhere;
      }
      .option-copy { display:flex; flex-direction:column; gap:2px; }
      .option-copy small { color:var(--dl-muted); font-size:12px; line-height:1.4; }
      .selectable-list { flex-direction:column; padding:0; gap:0; overflow:hidden; }
      .selectable-list button { justify-content:flex-start; min-height:58px; padding:10px 12px; border-radius:0; text-align:left; }
      .selectable-list button + button { border-top:1px solid var(--dl-border); }
      .selectable-list .option-copy { flex:1; }
      .selectable-list .indicator { width:20px; color:var(--dl-primary); text-align:center; }
      .selectable-list .selected { background:var(--dl-primary-soft); color:var(--dl-text); box-shadow:inset 3px 0 var(--dl-primary); }
      .selectable-list .selected .option-copy small { color:var(--dl-muted); }
      @media (max-width: 600px) {
        .segments:not(.vertical) button {
          flex: 1 0 auto;
          max-width: 100%;
        }
      }
    `,
  ],
})
export class SegmentedButtonsComponent extends FormControlBase<string[]> {
  readonly showLabel = input(true);
  readonly options = input<SegmentOption[]>([]);
  readonly multiple = input(false);
  readonly allowEmpty = input(false);
  readonly orientation = input<"horizontal" | "vertical">("horizontal");
  readonly presentation = input<"segmented" | "list">("segmented");
  reveal(event: FocusEvent): void {
    (event.target as HTMLElement).scrollIntoView({
      block: "nearest",
      inline: "nearest",
    });
  }
  selected(value: string): boolean {
    return (this.value() ?? []).includes(value);
  }
  tabIndex(value: string): number {
    const options = this.options().filter((o) => !o.disabled),
      active = options.find((o) => this.selected(o.value)) ?? options[0];
    return active?.value === value ? 0 : -1;
  }
  choose(o: SegmentOption): void {
    if (this.isDisabled() || o.disabled) return;
    const current = this.value() ?? [];
    this.commit(
      this.multiple()
        ? this.selected(o.value)
          ? current.filter((v) => v !== o.value)
          : [...current, o.value]
        : this.allowEmpty() && this.selected(o.value)
          ? []
          : [o.value],
    );
  }
  navigate(event: KeyboardEvent): void {
    const buttons = Array.from(
      (event.currentTarget as HTMLElement).querySelectorAll<HTMLButtonElement>(
        "button:not(:disabled)",
      ),
    );
    const i = buttons.indexOf(event.target as HTMLButtonElement);
    const next =
        this.orientation() === "horizontal" ? "ArrowRight" : "ArrowDown",
      prev = this.orientation() === "horizontal" ? "ArrowLeft" : "ArrowUp";
    if (![next, prev, "Home", "End"].includes(event.key) || !buttons.length)
      return;
    event.preventDefault();
    const index =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? buttons.length - 1
          : (i + (event.key === next ? 1 : -1) + buttons.length) %
            buttons.length;
    buttons[index].focus();
    if (!this.multiple()) buttons[index].click();
  }
}
