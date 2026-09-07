import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  output,
  signal,
} from "@angular/core";
import { PopoverControlBase } from "./popover-control-base";
import { selectionStyles, chevron } from "./selection-styles";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import {
  fieldStyles,
  fieldMessage,
  type SelectOption,
} from "./form-control-base";
/** Searchable checkbox disclosure. Tab navigates, Space selects, Escape closes. */
@Component({
  selector: "dl-multi-select",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true,
    },
  ],
  template:
    `<span class="label" [id]="id() + '-label'">{{ label() }}{{ required() ? ' *' : '' }}</span>
    <button #trigger class="field trigger" type="button" [id]="id() + '-control'" [disabled]="isDisabled()" [attr.aria-labelledby]="id() + '-label ' + id() + '-selection'" [attr.aria-expanded]="opened()" [attr.aria-controls]="id() + '-panel'" [attr.aria-describedby]="descriptionId()" [attr.aria-invalid]="error() ? true : null" (click)="toggle()">
      <span [id]="id() + '-selection'">{{ summary() }}</span>@if(showChevron()){${chevron}}
    </button>
      <div #panel popover="manual" class="panel" (mousedown)="focusPanel($event)" role="group" [id]="id() + '-panel'" [attr.aria-labelledby]="id() + '-label'">
        @if (searchable()) { <input class="field search" type="search" [disabled]="isDisabled()" [attr.aria-label]="searchLabel() || 'Search ' + label()" [placeholder]="searchPlaceholder()" [value]="query()" (input)="search($event)" /> }
        @if (showSelectAll() || showClear()) {
          <div class="bulk-actions">
            @if (showSelectAll()) { <button type="button" [disabled]="!canSelectAll()" (click)="selectAll()">{{ selectAllLabel() }}</button> }
            @if (showClear()) { <button type="button" [disabled]="!canClear()" (click)="clear()">{{ clearLabel() }}</button> }
          </div>
        }
        <div class="options" [style.max-height.px]="listHeight()">
          @for (option of filtered(); track option.value) {
            <label class="option"><input type="checkbox" [checked]="selected().includes(option.value)" [disabled]="optionDisabled(option)" (change)="select(option, $event)" /><span>{{ option.label }} @if (showDescriptions() && option.description) { <small>{{ option.description }}</small> }</span></label>
          } @empty { <p class="empty">{{ emptyText() }}</p> }
        </div>
        @if (atLimit()) { <p class="limit-message" role="status">{{ limitText() }}</p> }
        @if (showCount() || showDone()) {
          <div class="panel-footer">@if (showCount()) { <span aria-live="polite">{{ countText() }}</span> }@if (showDone()) { <button type="button" [disabled]="isDisabled()" (click)="close()">{{ doneLabel() }}</button> }</div>
        }
      </div>` + fieldMessage,
  styles: [
    fieldStyles,
    selectionStyles,
    `
      :host {
        position: relative;
      }
      .bulk-actions {
        display: flex;
        justify-content: space-between;
        gap: var(--dl-ui-gap, 12px);
        padding: var(--dl-ui-padding, 2px 0 8px);
        margin-bottom: 4px;
        border-bottom: 1px solid var(--dl-border);
      }
      .bulk-actions button {
        border: 0;
        background: var(--dl-ui-background, transparent);
        color: var(--dl-ui-color, var(--dl-text));
        font: inherit;
        font-size: var(--dl-ui-font-size, 12px);
        padding: var(--dl-ui-padding, 7px 8px);
        border-radius: var(--dl-ui-radius, 6px);
        cursor: pointer;
      }
      .bulk-actions button:hover:not(:disabled) {
        background: var(--dl-ui-background, var(--dl-primary-soft));
      }
      .limit-message {
        font-size: var(--dl-ui-font-size, 12px);
        color: var(--dl-ui-color, var(--dl-muted));
        margin: 10px 8px;
        line-height: 1.5;
      }
      .search {
        margin-bottom: 8px;
      }
      .options {
        max-height: 220px;
        overflow: auto;
      }
      .option {
        display: flex;
        align-items: flex-start;
        gap: var(--dl-ui-gap, 10px);
        padding: var(--dl-ui-padding, 11px 8px);
        cursor: pointer;
        border-radius: var(--dl-ui-radius, 8px);
        line-height: 1.4;
      }
      .option:hover {
        background: var(--dl-ui-background, var(--dl-primary-soft));
      }
      .option:has(input:disabled) {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .option input {
        margin: 2px 0 0;
        width: 16px;
        height: 16px;
        flex-shrink: 0;
      }
      small {
        display: block;
        font-size: var(--dl-ui-font-size, 12px);
        color: var(--dl-ui-color, var(--dl-muted));
      }
      .panel-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--dl-ui-padding, 10px 4px 0);
        margin-top: 8px;
        border-top: 1px solid var(--dl-border);
        font-size: var(--dl-ui-font-size, 12px);
        color: var(--dl-ui-color, var(--dl-muted));
      }
      .panel-footer button {
        border: 0;
        border-radius: var(--dl-ui-radius, 6px);
        padding: var(--dl-ui-padding, 6px 10px);
        background: var(--dl-ui-background, var(--dl-primary));
        color: var(--dl-ui-color, var(--dl-on-primary));
        font: inherit;
        cursor: pointer;
      }
      .empty {
        padding: var(--dl-ui-padding, 12px 8px);
        color: var(--dl-ui-color, var(--dl-muted));
        font-size: var(--dl-ui-font-size, 12px);
      }
    `,
  ],
})
export class MultiSelectComponent extends PopoverControlBase<string[]> {
  readonly showChevron = input(true);
  readonly options = input<SelectOption[]>([]);
  readonly placeholder = input("Select options");
  readonly searchable = input(true);
  readonly showSelectAll = input(true);
  readonly showClear = input(true);
  readonly showDone = input(true);
  readonly showCount = input(true);
  readonly showDescriptions = input(true);
  readonly selectAllLabel = input("Select all");
  readonly clearLabel = input("Clear");
  readonly doneLabel = input("Done");
  readonly searchPlaceholder = input("Search options…");
  readonly searchLabel = input("");
  readonly emptyText = input("No options found.");
  readonly selectedCountLabel = input("{count} selected");
  readonly limitMessage = input("You can select up to {limit} options.");
  readonly summaryMode = input<"labels" | "count">("labels");
  readonly labelSeparator = input(", ");
  readonly bulkScope = input<"all" | "filtered">("all");
  readonly maxSelected = input<number | null>(null);
  readonly optionsMaxHeight = input(220);
  readonly menuWidth = input<number | null>(null);
  readonly closeOnSelect = input(false);
  readonly resetSearchOnOpen = input(true);
  readonly selectAllChange = output<string[]>();
  readonly clearChange = output<string[]>();
  readonly searchChange = output<string>();
  readonly query = signal("");
  readonly selected = computed(() => [...new Set(this.value() ?? [])]);
  readonly filtered = computed(() =>
    this.options().filter((option) =>
      `${option.label} ${option.description ?? ""}`
        .toLowerCase()
        .includes(this.searchable() ? this.query().trim().toLowerCase() : ""),
    ),
  );
  readonly limit = computed(() => {
    const limit = this.maxSelected();
    return limit === null || !Number.isFinite(limit)
      ? Infinity
      : Math.max(0, Math.floor(limit));
  });
  readonly atLimit = computed(() => this.selected().length >= this.limit());
  readonly listHeight = computed(() =>
    Number.isFinite(this.optionsMaxHeight())
      ? Math.max(44, this.optionsMaxHeight())
      : 220,
  );
  readonly countText = computed(() =>
    this.selectedCountLabel().replaceAll(
      "{count}",
      String(this.selected().length),
    ),
  );
  readonly limitText = computed(() =>
    this.limitMessage()
      .replaceAll("{limit}", String(this.limit()))
      .replaceAll("{count}", String(this.selected().length)),
  );
  readonly bulkOptions = computed(() =>
    (this.bulkScope() === "filtered" ? this.filtered() : this.options()).filter(
      (option) => !option.disabled,
    ),
  );
  readonly canSelectAll = computed(
    () =>
      !this.isDisabled() &&
      !this.atLimit() &&
      this.bulkOptions().some(
        (option) => !this.selected().includes(option.value),
      ),
  );
  readonly canClear = computed(
    () =>
      !this.isDisabled() &&
      (this.bulkScope() === "filtered"
        ? this.bulkOptions().some((option) =>
            this.selected().includes(option.value),
          )
        : this.selected().some(
            (value) =>
              !this.options().some(
                (option) => option.value === value && option.disabled,
              ),
          )),
  );
  readonly summary = computed(() => {
    const selected = this.selected();
    if (!selected.length) return this.placeholder();
    if (this.summaryMode() === "count") return this.countText();
    return selected
      .map(
        (value) =>
          this.options().find((option) => option.value === value)?.label ??
          value,
      )
      .join(this.labelSeparator());
  });
  constructor() {
    super();
    afterRenderEffect(() => {
      this.query();
      this.filtered();
      this.menuWidth();
      this.listHeight();
      this.atLimit();
      this.showSelectAll();
      this.showClear();
      this.showDone();
      this.showCount();
      if (this.opened()) this.positionPanel();
    });
  }
  override toggle(): void {
    if (!this.opened() && this.resetSearchOnOpen()) this.query.set("");
    super.toggle();
  }
  protected override requestedPanelWidth(anchorWidth: number): number {
    const width = this.menuWidth();
    return width !== null && Number.isFinite(width)
      ? Math.max(120, width)
      : anchorWidth;
  }
  optionDisabled(option: SelectOption): boolean {
    return (
      this.isDisabled() ||
      !!option.disabled ||
      (this.atLimit() && !this.selected().includes(option.value))
    );
  }
  selectAll(): void {
    if (!this.canSelectAll()) return;
    const selected = new Set(this.selected());
    for (const option of this.bulkOptions()) {
      if (selected.size >= this.limit()) break;
      selected.add(option.value);
    }
    this.trigger()?.nativeElement.focus({ preventScroll: true });
    this.applySelection([...selected]);
    this.selectAllChange.emit([...selected]);
  }
  clear(): void {
    if (!this.canClear()) return;
    const editable = new Set(this.bulkOptions().map((option) => option.value));
    const selected = this.selected().filter((value) =>
      this.bulkScope() === "filtered"
        ? !editable.has(value)
        : this.options().some(
            (option) => option.value === value && option.disabled,
          ),
    );
    this.trigger()?.nativeElement.focus({ preventScroll: true });
    this.applySelection(selected);
    this.clearChange.emit(selected);
  }
  private applySelection(selected: string[]): void {
    this.commit(selected);
    if (this.closeOnSelect()) this.close();
  }
  // Safari does not focus checkboxes/buttons on mouse-down by default. Keep
  // focus inside the popover so a search blur cannot dismiss it before click.
  focusPanel(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.closest('input[type="search"]')) return;
    event.preventDefault();
    const control =
      target.closest("label")?.querySelector("input") ??
      target.closest("button");
    control?.focus({ preventScroll: true });
  }
  search(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.query.set(query);
    this.searchChange.emit(query);
  }
  select(option: SelectOption, event: Event): void {
    if (this.optionDisabled(option)) return;
    const selected = new Set(this.selected());
    if ((event.target as HTMLInputElement).checked) selected.add(option.value);
    else selected.delete(option.value);
    this.applySelection([...selected]);
  }
}
