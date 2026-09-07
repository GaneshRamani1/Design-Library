import {
  Component,
  afterRenderEffect,
  computed,
  forwardRef,
  input,
  model,
  signal,
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { PopoverControlBase } from "./popover-control-base";
import { fieldStyles, fieldMessage } from "./form-control-base";
import { IconComponent } from "../icons/icon.component";
/** Local calendar dates use YYYY-MM-DD strings, without UTC conversions. */
export function parseCalendarDate(
  value: string | null | undefined,
): Date | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(0);
  date.setHours(12, 0, 0, 0);
  date.setFullYear(y, m - 1, d);
  return date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
    ? date
    : null;
}
export function calendarDate(date: Date): string {
  return `${String(date.getFullYear()).padStart(4, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function dayOffset(date: Date, offset: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + offset);
  return result;
}
@Component({
  selector: "dl-datepicker",
  standalone: true,
  imports: [IconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true,
    },
  ],
  template:
    `<label class="label" [id]="id()+'-label'" [for]="id()">{{label()}}@if(required()){ *}</label><button #trigger class="field trigger" type="button" [id]="id()" [disabled]="isDisabled()" [attr.aria-labelledby]="id()+'-label'" aria-haspopup="dialog" [attr.aria-expanded]="opened()" [attr.aria-controls]="id()+'-calendar'" [attr.aria-describedby]="descriptionId()" [attr.aria-invalid]="!!error()" [attr.data-readonly]="readOnly() || null" (click)="toggle()" (keydown.arrowdown)="$event.preventDefault();!opened()&&toggle()"><span [class.placeholder]="!value()">{{displayValue()||placeholder()}}</span>@if(showIcon()){<dl-icon name="calendar" [size]="18"/>}</button><div #panel class="calendar" (pointerdown)="$event.preventDefault()" popover="manual" role="dialog" [id]="id()+'-calendar'" [attr.aria-label]="calendarLabel()"><header><button type="button" [attr.aria-label]="previousLabel()" [disabled]="!canMoveMonth(-1)" (click)="moveMonth(-1)"><dl-icon name="chevron-left" [size]="18"/></button>@if(showMonthYearSelectors()){<div class="month-year"><select [attr.aria-label]="monthSelectLabel()" [value]="month().getMonth()" (change)="setMonth($event)">@for(option of monthOptions();track option.value){<option [value]="option.value">{{option.label}}</option>}</select><select [attr.aria-label]="yearSelectLabel()" [value]="month().getFullYear()" (change)="setYear($event)">@for(year of yearOptions();track year){<option [value]="year">{{year}}</option>}</select></div>}@else{<span aria-live="polite">{{monthLabel()}}</span>}<button type="button" [attr.aria-label]="nextLabel()" [disabled]="!canMoveMonth(1)" (click)="moveMonth(1)"><dl-icon name="chevron-right" [size]="18"/></button></header><div role="grid" [attr.aria-label]="monthLabel()" (keydown)="navigate($event)"><div role="row" class="week">@for(day of weekdays();track $index){<span role="columnheader" [attr.aria-label]="day.full">{{day.short}}</span>}</div>@for(week of weeks();track $index){<div class="week" role="row">@for(day of week;track day.iso){<button type="button" role="gridcell" [attr.data-date]="day.iso" [attr.aria-label]="day.label" [attr.aria-selected]="value()===day.iso||rangeEnd()===day.iso" [attr.aria-current]="day.iso===today?'date':null" [attr.tabindex]="cursor()===day.iso?0:-1" [disabled]="day.disabled" [class.in-range]="isInRange(day.iso)" [class.outside]="day.outside" [style.visibility]="day.outside&&!showOutsideDays()?'hidden':null" (click)="selectDate(day.iso)">{{day.day}}</button>}</div>}</div>@if(showToday()||showClear()){<footer>@if(showToday()){<button type="button" [disabled]="!allowed(today)" (click)="selectDate(today)">{{todayLabel()}}</button>}@if(showClear()){<button type="button" [disabled]="!value()||required()" (click)="clear()">{{clearLabel()}}</button>}</footer>}</div>` +
    fieldMessage,
  styles: [
    fieldStyles,
    `
      .trigger {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        text-align: start;
        cursor: pointer;
      }
      .placeholder {
        color: var(--dl-muted);
      }
      .calendar {
        position: fixed;
        margin: 0;
        inset: auto;
        box-sizing: border-box;
        padding: var(--dl-ui-padding, 16px);
        border: var(--dl-ui-border-width, 1px) solid
          var(--dl-ui-border-color, var(--dl-border));
        border-radius: var(--dl-ui-radius, var(--dl-card-radius));
        background: var(--dl-ui-background, var(--dl-surface));
        color: var(--dl-ui-color, var(--dl-text));
        box-shadow: var(--dl-ui-shadow, 0 16px 48px #0005);
        font: 14px var(--dl-font);
        overflow: auto;
      }
      .calendar header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
        font-weight: 600;
      }
      .month-year { display: flex; gap: 6px; min-width: 0; }
      .month-year select { min-width: 0; border: 1px solid var(--dl-border); border-radius: 6px; background: var(--dl-surface); color: var(--dl-text); padding: 5px; }
      .calendar button {
        border: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        cursor: pointer;
        border-radius: 6px;
        min-height: 36px;
      }
      .calendar button:hover:not(:disabled) {
        background: var(--dl-primary-soft);
      }
      .week {
        display: grid;
        grid-template-columns: repeat(7, minmax(0, 1fr));
        gap: 2px;
      }
      .week span {
        text-align: center;
        font-size: 11px;
        color: var(--dl-muted);
        padding: 8px 0;
      }
      .week button[aria-selected="true"] {
        background: var(--dl-primary);
        color: var(--dl-on-primary);
      }
      .week button.in-range:not([aria-selected="true"]){background:var(--dl-primary-soft)}
      .week button[aria-current="date"] {
        box-shadow: inset 0 0 0 1px var(--dl-border);
      }
      .outside {
        color: var(--dl-muted) !important;
      }
      .calendar footer {
        display: flex;
        justify-content: space-between;
        margin-top: 12px;
        border-top: 1px solid var(--dl-border);
        padding-top: 8px;
      }
      .calendar footer button {
        padding: 6px 12px;
      }
    `,
  ],
})
export class DatepickerComponent extends PopoverControlBase<string | null> {
  readonly placeholder = input("Choose a date");
  readonly min = input("");
  readonly max = input("");
  readonly locale = input("en-US");
  readonly weekStartsOn = input(0);
  readonly disabledDates = input<string[]>([]);
  readonly dateFilter = input<((date: string) => boolean) | null>(null);
  readonly readOnly = input(false);
  readonly showIcon = input(true);
  readonly showOutsideDays = input(true);
  readonly showToday = input(true);
  readonly showClear = input(true);
  readonly todayLabel = input("Today");
  readonly clearLabel = input("Clear");
  readonly previousLabel = input("Previous month");
  readonly nextLabel = input("Next month");
  readonly calendarLabel = input("Choose a date");
  readonly displayFormat = input<"short" | "medium" | "long">("medium");
  readonly calendarWidth = input(320);
  readonly selectionMode = input<"single" | "range">("single");
  readonly rangeEnd = model<string | null>(null);
  readonly rangeSeparator = input(" – ");
  readonly showMonthYearSelectors = input(false);
  readonly monthSelectLabel = input("Month");
  readonly yearSelectLabel = input("Year");
  readonly yearRange = input(100);
  private movingFocus = false;
  readonly today = calendarDate(new Date());
  readonly month = signal(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1, 12),
  );
  readonly cursor = signal(this.today);
  private readonly validLocale = computed(() => {
    try {
      return new Intl.DateTimeFormat(this.locale()).resolvedOptions().locale;
    } catch {
      return "en-US";
    }
  });
  private readonly weekStart = computed(
    () => ((Math.trunc(this.weekStartsOn()) % 7) + 7) % 7,
  );
  readonly displayValue = computed(() => {
    const date = parseCalendarDate(this.value());
    const formatter = new Intl.DateTimeFormat(this.validLocale(), {
          dateStyle: this.displayFormat(),
        });
    if (!date) return "";
    const end = this.selectionMode() === "range" ? parseCalendarDate(this.rangeEnd()) : null;
    return formatter.format(date) + (end ? this.rangeSeparator() + formatter.format(end) : "");
  });
  readonly monthLabel = computed(() =>
    new Intl.DateTimeFormat(this.validLocale(), {
      month: "long",
      year: "numeric",
    }).format(this.month()),
  );
  readonly monthOptions = computed(() =>
    Array.from({ length: 12 }, (_, value) => ({
      value,
      label: new Intl.DateTimeFormat(this.validLocale(), { month: "long" }).format(new Date(2026, value, 1)),
    })),
  );
  readonly yearOptions = computed(() => {
    const selected = this.month().getFullYear();
    const min = parseCalendarDate(this.min())?.getFullYear() ?? selected - Math.max(1, this.yearRange());
    const max = parseCalendarDate(this.max())?.getFullYear() ?? selected + Math.max(1, this.yearRange());
    return Array.from({ length: max - min + 1 }, (_, index) => min + index);
  });
  readonly weekdays = computed(() =>
    Array.from({ length: 7 }, (_, i) => {
      const d = new Date(2026, 0, 4 + this.weekStart() + i);
      return {
        short: new Intl.DateTimeFormat(this.validLocale(), {
          weekday: "short",
        }).format(d),
        full: new Intl.DateTimeFormat(this.validLocale(), {
          weekday: "long",
        }).format(d),
      };
    }),
  );
  readonly weeks = computed(() => {
    const first = this.month(),
      offset = (first.getDay() - this.weekStart() + 7) % 7,
      start = dayOffset(first, -offset);
    const days = Array.from({ length: 42 }, (_, i) => {
      const d = dayOffset(start, i),
        iso = calendarDate(d);
      return {
        iso,
        day: d.getDate(),
        outside: d.getMonth() !== first.getMonth(),
        disabled: !this.allowed(iso),
        label: new Intl.DateTimeFormat(this.validLocale(), {
          dateStyle: "full",
        }).format(d),
      };
    });
    return Array.from({ length: 6 }, (_, i) => days.slice(i * 7, i * 7 + 7));
  });
  constructor() {
    super();
    afterRenderEffect(() => {
      const cursor = this.cursor();
      if (this.opened() && this.movingFocus)
        this.panel()
          ?.nativeElement.querySelector<HTMLButtonElement>(
            `[data-date="${cursor}"]:not(:disabled)`,
          )
          ?.focus();
      this.movingFocus = false;
    });
  }
  override leave(_event: FocusEvent): void {
    if (this.movingFocus) return;
    // Native select menus can report a transient null relatedTarget before
    // their change event updates and refocuses the calendar.
    setTimeout(() => {
      if (
        !this.movingFocus &&
        !this.element.nativeElement.contains(
          this.element.nativeElement.ownerDocument.activeElement,
        )
      ) {
        this.dismiss();
        this.onTouched();
      }
    });
  }
  protected override requestedPanelWidth(): number {
    return this.calendarWidth();
  }
  allowed(iso: string): boolean {
    return (
      !!parseCalendarDate(iso) &&
      (!parseCalendarDate(this.min()) || iso >= this.min()) &&
      (!parseCalendarDate(this.max()) || iso <= this.max()) &&
      !this.disabledDates().includes(iso) &&
      (this.dateFilter()?.(iso) ?? true)
    );
  }
  override toggle(): void {
    if (this.readOnly() || this.isDisabled()) return;
    if (!this.opened()) {
      this.movingFocus = true;
      let date =
        parseCalendarDate(this.value()) ?? parseCalendarDate(this.today)!;
      if (parseCalendarDate(this.min()) && calendarDate(date) < this.min())
        date = parseCalendarDate(this.min())!;
      if (parseCalendarDate(this.max()) && calendarDate(date) > this.max())
        date = parseCalendarDate(this.max())!;
      this.month.set(new Date(date.getFullYear(), date.getMonth(), 1, 12));
      if (!this.allowed(calendarDate(date))) {
        const candidates = Array.from({ length: 366 }, (_, i) =>
          dayOffset(date, i),
        );
        date = candidates.find((d) => this.allowed(calendarDate(d))) ?? date;
        this.month.set(new Date(date.getFullYear(), date.getMonth(), 1, 12));
      }
      this.cursor.set(calendarDate(date));
    }
    super.toggle();
  }
  selectDate(iso: string): void {
    if (!this.allowed(iso) || this.readOnly()) return;
    if (this.selectionMode() === "range") {
      if (!this.value() || this.rangeEnd()) { this.commit(iso); this.rangeEnd.set(null); return; }
      const start = this.value()!;
      this.commit(iso < start ? iso : start);
      this.rangeEnd.set(iso < start ? start : iso);
      this.close();
      return;
    }
    this.commit(iso);
    this.close();
  }
  clear(): void {
    if (this.required() || this.readOnly()) return;
    this.commit(null);
    this.rangeEnd.set(null);
    this.close();
  }
  isInRange(iso: string): boolean { return this.selectionMode() === "range" && !!this.value() && !!this.rangeEnd() && iso > this.value()! && iso < this.rangeEnd()!; }
  canMoveMonth(delta: number): boolean {
    const current = this.month(),
      first = new Date(
        current.getFullYear(),
        current.getMonth() + delta,
        1,
        12,
      ),
      last = new Date(first.getFullYear(), first.getMonth() + 1, 0, 12);
    return (
      first.getFullYear() >= 1 &&
      first.getFullYear() <= 9999 &&
      (!parseCalendarDate(this.min()) || calendarDate(last) >= this.min()) &&
      (!parseCalendarDate(this.max()) || calendarDate(first) <= this.max())
    );
  }
  moveMonth(delta: number): void {
    if (!this.canMoveMonth(delta)) return;
    const m = this.month(),
      d = new Date(m.getFullYear(), m.getMonth() + delta, 1, 12);
    this.movingFocus = true;
    this.month.set(d);
    const match = Array.from({ length: 31 }, (_, i) => dayOffset(d, i)).find(
      (date) =>
        date.getMonth() === d.getMonth() && this.allowed(calendarDate(date)),
    );
    this.cursor.set(calendarDate(match ?? d));
  }
  setMonth(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    this.setVisibleMonth(this.month().getFullYear(), value);
  }
  setYear(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    this.setVisibleMonth(value, this.month().getMonth());
  }
  private setVisibleMonth(year: number, month: number): void {
    const next = new Date(year, month, 1, 12);
    if (!Number.isFinite(year) || year < 1 || year > 9999) return;
    const delta = (year - this.month().getFullYear()) * 12 + month - this.month().getMonth();
    if (!this.canMoveMonth(delta)) return;
    this.movingFocus = true;
    this.month.set(next);
    const selectedDay = Math.min(parseCalendarDate(this.cursor())?.getDate() ?? 1, new Date(year, month + 1, 0).getDate());
    const candidate = new Date(year, month, selectedDay, 12);
    this.cursor.set(calendarDate(candidate));
  }
  navigate(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    if (!target.hasAttribute("data-date")) return;
    const date = parseCalendarDate(target.dataset["date"])!;
    if (event.key === "PageUp" || event.key === "PageDown") {
      event.preventDefault();
      this.moveMonth(
        (event.key === "PageUp" ? -1 : 1) * (event.shiftKey ? 12 : 1),
      );
      return;
    }
    let delta =
      event.key === "ArrowRight"
        ? 1
        : event.key === "ArrowLeft"
          ? -1
          : event.key === "ArrowDown"
            ? 7
            : event.key === "ArrowUp"
              ? -7
              : event.key === "Home"
                ? -(date.getDay() - this.weekStart() + 7) % 7
                : event.key === "End"
                  ? 6 - ((date.getDay() - this.weekStart() + 7) % 7)
                  : null;
    if (delta === null) return;
    event.preventDefault();
    let next = dayOffset(date, delta);
    for (let i = 0; i < 366 && !this.allowed(calendarDate(next)); i++)
      next = dayOffset(next, delta < 0 ? -1 : 1);
    if (!this.allowed(calendarDate(next))) return;
    this.movingFocus = true;
    this.cursor.set(calendarDate(next));
    if (
      next.getMonth() !== this.month().getMonth() ||
      next.getFullYear() !== this.month().getFullYear()
    ) {
      this.month.set(new Date(next.getFullYear(), next.getMonth(), 1, 12));
    }
    this.panel()
      ?.nativeElement.querySelector<HTMLButtonElement>(
        `[data-date="${calendarDate(next)}"]`,
      )
      ?.focus();
  }
}
