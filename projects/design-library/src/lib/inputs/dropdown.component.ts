import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  output,
  signal,
  TemplateRef,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
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
  imports: [NgTemplateOutlet],
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
      <span>{{ busy() ? loadingText() : summary() }}</span>@if(showChevron()){${chevron}}
    </button>
    <div #panel class="panel" popover="manual" role="listbox" [id]="id() + '-panel'" [attr.aria-labelledby]="id() + '-label'" (pointerdown)="$event.preventDefault()">
      @for (option of renderedChoices(); track option.value; let index = $index) {
        @if (showGroup(index)) { <div class="group-label" role="presentation">{{ option.group }}</div> }
        <div class="option" role="option" [id]="id() + '-option-' + index" [attr.aria-selected]="(value() || '') === option.value" [attr.aria-disabled]="!!option.disabled" [class.active]="activeIndex() === index" (pointermove)="activate(index)" (click)="choose(index)">
          <span>@if(optionTemplate()){<ng-container [ngTemplateOutlet]="optionTemplate()" [ngTemplateOutletContext]="{$implicit:option,index:index,selected:(value()||'')===option.value}"/>}@else{{{ option.label }}} @if (!optionTemplate() && showDescriptions() && option.description) { <small>{{ option.description }}</small> }</span>
          <svg class="check" viewBox="0 0 20 20" fill="none" aria-hidden="true" [style.visibility]="(value() || '') === option.value ? 'visible' : 'hidden'"><path d="m5 10 3 3 7-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
      } @empty { <p class="empty">{{emptyText()}}</p> }@if(hiddenOptionCount()){<p class="empty">{{moreOptionsLabel().replace('{count}',hiddenOptionCount().toString())}}</p>}
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
      .group-label { padding:12px 10px 4px; color:var(--dl-muted); font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; }
    `,
  ],
})
export class DropdownComponent extends PopoverControlBase<string> {
  readonly showChevron = input(true);
  readonly showDescriptions = input(true);
  readonly emptyText = input("No options available.");
  readonly options = input<SelectOption[]>([]);
  readonly optionsProvider = input<(() => Promise<SelectOption[]>) | null>(null);
  readonly optionTemplate = input<TemplateRef<{ $implicit: SelectOption; index: number; selected: boolean }> | null>(null);
  readonly placeholder = input("Select an option");
  readonly loading = input(false);
  readonly loadingText = input("Loading options…");
  readonly clearable = input(false);
  readonly maxRenderedOptions = input(0);
  readonly moreOptionsLabel = input("{count} more options. Refine your search.");
  readonly cleared = output<void>();
  readonly optionsLoaded = output<SelectOption[]>();
  readonly loadFailed = output<unknown>();
  private readonly loadedOptions = signal<SelectOption[] | null>(null);
  private readonly internalLoading = signal(false);
  readonly busy = computed(() => this.loading() || this.internalLoading());
  readonly effectiveOptions = computed(() => this.loadedOptions() ?? this.options());
  readonly choices = computed<SelectOption[]>(() =>
    this.required()
      ? this.effectiveOptions()
      : [{ value: "", label: this.placeholder() }, ...this.effectiveOptions()],
  );
  readonly renderedChoices = computed(() => this.maxRenderedOptions() > 0 ? this.choices().slice(0, this.maxRenderedOptions()) : this.choices());
  readonly hiddenOptionCount = computed(() => this.choices().length - this.renderedChoices().length);
  readonly summary = computed(
    () =>
      this.effectiveOptions().find((option) => option.value === this.value())?.label ??
      this.placeholder(),
  );
  readonly activeIndex = signal(-1);
  private typed = "";
  private typedAt = 0;
  async toggleMenu(): Promise<void> {
    if (this.busy()) return;
    if (!this.opened() && this.optionsProvider() && this.loadedOptions() === null) await this.loadOptions();
    if (!this.opened()) this.activeIndex.set(this.initialIndex());
    super.toggle();
  }
  async loadOptions(): Promise<void> {
    const provider = this.optionsProvider();
    if (!provider) return;
    this.internalLoading.set(true);
    try { const options = await provider(); this.loadedOptions.set(options); this.optionsLoaded.emit(options); }
    catch (error) { this.loadFailed.emit(error); }
    finally { this.internalLoading.set(false); }
  }
  refresh(): Promise<void> { this.loadedOptions.set(null); return this.loadOptions(); }
  private initialIndex(): number {
    const selected = this.renderedChoices().findIndex(
      (option) => option.value === (this.value() ?? "") && !option.disabled,
    );
    return selected >= 0
      ? selected
      : this.renderedChoices().findIndex((option) => !option.disabled);
  }
  activate(index: number): void {
    if (!this.renderedChoices()[index]?.disabled) this.activeIndex.set(index);
  }
  choose(index: number): void {
    const option = this.renderedChoices()[index];
    if (!option || option.disabled || this.isDisabled()) return;
    this.commit(option.value);
    this.close();
  }
  key(event: KeyboardEvent): void {
    if (this.isDisabled()) return;
    const key = event.key;
    if ((key === "Delete" || key === "Backspace") && this.clearable() && !this.opened() && this.value()) {
      event.preventDefault();
      this.commit("");
      this.cleared.emit();
      return;
    }
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
      const enabled = this.renderedChoices()
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
      const options = this.renderedChoices();
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
  showGroup(index: number): boolean {
    const group = this.renderedChoices()[index]?.group;
    return !!group && group !== this.renderedChoices()[index - 1]?.group;
  }
  private scrollActive(): void {
    this.panel()
      ?.nativeElement.querySelectorAll<HTMLElement>('[role="option"]')
      [this.activeIndex()]?.scrollIntoView({ block: "nearest" });
  }
}
