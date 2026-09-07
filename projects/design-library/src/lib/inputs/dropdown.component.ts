import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  signal,
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import {
  fieldStyles,
  fieldMessage,
  type SelectOption,
} from "./form-control-base";
import { PopoverControlBase } from "./popover-control-base";
import { selectionStyles, chevron } from "./selection-styles";
/** Custom select-only combobox with keyboard navigation and typeahead. */
@Component({
  selector: "dl-dropdown",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    },
  ],
  template:
    `<label class="label" [id]="id() + '-label'" [for]="id() + '-control'">{{ label() }}{{ required() ? ' *' : '' }}</label>
    <button #trigger class="field trigger" type="button" role="combobox" aria-haspopup="listbox" [id]="id() + '-control'" [disabled]="isDisabled()" [attr.aria-labelledby]="id() + '-label'" [attr.aria-required]="required()" [attr.aria-expanded]="opened()" [attr.aria-controls]="id() + '-panel'" [attr.aria-activedescendant]="opened() && activeIndex() >= 0 ? id() + '-option-' + activeIndex() : null" [attr.aria-invalid]="error() ? true : null" [attr.aria-describedby]="descriptionId()" (click)="toggleMenu()" (keydown)="key($event)">
      <span>{{ summary() }}</span>@if(showChevron()){${chevron}}
    </button>
    <div #panel class="panel" popover="manual" role="listbox" [id]="id() + '-panel'" [attr.aria-labelledby]="id() + '-label'" (pointerdown)="$event.preventDefault()">
      @for (option of choices(); track option.value; let index = $index) {
        <div class="option" role="option" [id]="id() + '-option-' + index" [attr.aria-selected]="(value() || '') === option.value" [attr.aria-disabled]="!!option.disabled" [class.active]="activeIndex() === index" (pointermove)="activate(index)" (click)="choose(index)">
          <span>{{ option.label }} @if (showDescriptions() && option.description) { <small>{{ option.description }}</small> }</span>
          <svg class="check" viewBox="0 0 20 20" fill="none" aria-hidden="true" [style.visibility]="(value() || '') === option.value ? 'visible' : 'hidden'"><path d="m5 10 3 3 7-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
      } @empty { <p class="empty">{{emptyText()}}</p> }
    </div>` + fieldMessage,
  styles: [
    fieldStyles,
    selectionStyles,
    `
      .option {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--dl-ui-gap, 12px);
        min-height: var(--field-height);
        padding: var(--dl-ui-padding, var(--field-padding));
        border-radius: var(--dl-ui-radius, 7px);
        cursor: pointer;
        line-height: 20px;
      }
      .option.active {
        background: var(--dl-ui-background, var(--dl-primary-soft));
      }
      .option[aria-disabled="true"] {
        opacity: 0.45;
        cursor: not-allowed;
      }
      .check {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
      }
      small {
        display: block;
        font-size: var(--dl-ui-font-size, 12px);
        color: var(--dl-ui-color, var(--dl-muted));
      }
      .empty {
        padding: var(--dl-ui-padding, 8px);
        color: var(--dl-ui-color, var(--dl-muted));
        font-size: var(--dl-ui-font-size, 12px);
      }
    `,
  ],
})
export class DropdownComponent extends PopoverControlBase<string> {
  readonly showChevron = input(true);
  readonly showDescriptions = input(true);
  readonly emptyText = input("No options available.");
  readonly options = input<SelectOption[]>([]);
  readonly placeholder = input("Select an option");
  readonly choices = computed<SelectOption[]>(() =>
    this.required()
      ? this.options()
      : [{ value: "", label: this.placeholder() }, ...this.options()],
  );
  readonly summary = computed(
    () =>
      this.options().find((option) => option.value === this.value())?.label ??
      this.placeholder(),
  );
  readonly activeIndex = signal(-1);
  private typed = "";
  private typedAt = 0;
  toggleMenu(): void {
    if (!this.opened()) this.activeIndex.set(this.initialIndex());
    super.toggle();
  }
  private initialIndex(): number {
    const selected = this.choices().findIndex(
      (option) => option.value === (this.value() ?? "") && !option.disabled,
    );
    return selected >= 0
      ? selected
      : this.choices().findIndex((option) => !option.disabled);
  }
  activate(index: number): void {
    if (!this.choices()[index]?.disabled) this.activeIndex.set(index);
  }
  choose(index: number): void {
    const option = this.choices()[index];
    if (!option || option.disabled || this.isDisabled()) return;
    this.commit(option.value);
    this.close();
  }
  key(event: KeyboardEvent): void {
    if (this.isDisabled()) return;
    const key = event.key;
    if (key === "Tab") {
      this.dismiss();
      return;
    }
    if (["ArrowDown", "ArrowUp", "Home", "End", "Enter", " "].includes(key)) {
      event.preventDefault();
      if (key === "Enter" || key === " ") {
        if (this.opened()) this.choose(this.activeIndex());
        else this.toggleMenu();
        return;
      }
      const wasOpen = this.opened();
      if (!wasOpen) this.toggleMenu();
      const enabled = this.choices()
        .map((option, index) => (option.disabled ? -1 : index))
        .filter((index) => index >= 0);
      if (!enabled.length) return;
      const current = enabled.indexOf(this.activeIndex());
      const index =
        key === "Home"
          ? enabled[0]
          : key === "End"
            ? enabled[enabled.length - 1]
            : !wasOpen
              ? key === "ArrowUp"
                ? enabled[enabled.length - 1]
                : this.activeIndex()
              : enabled[
                  (current + (key === "ArrowDown" ? 1 : -1) + enabled.length) %
                    enabled.length
                ];
      this.activeIndex.set(index);
      this.scrollActive();
    } else if (
      key.length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      event.preventDefault();
      const now = Date.now();
      this.typed = now - this.typedAt > 700 ? key : this.typed + key;
      this.typedAt = now;
      if (!this.opened()) this.toggleMenu();
      const query = /^(.)\1*$/.test(this.typed)
        ? key.toLowerCase()
        : this.typed.toLowerCase();
      const options = this.choices();
      for (let offset = 1; offset <= options.length; offset++) {
        const index =
          (this.activeIndex() + offset + options.length) % options.length;
        if (
          !options[index].disabled &&
          options[index].label.toLowerCase().startsWith(query)
        ) {
          this.activeIndex.set(index);
          this.scrollActive();
          break;
        }
      }
    }
  }
  private scrollActive(): void {
    this.panel()
      ?.nativeElement.querySelectorAll<HTMLElement>('[role="option"]')
      [this.activeIndex()]?.scrollIntoView({ block: "nearest" });
  }
}
