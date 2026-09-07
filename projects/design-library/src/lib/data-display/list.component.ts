import { NgTemplateOutlet } from "@angular/common";
import { Component, TemplateRef, computed, input, model, output } from "@angular/core";
import { Appearance } from "../shared/appearance";
import { IconComponent } from "../icons/icon.component";
export interface ListItem {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  meta?: string;
  disabled?: boolean;
  children?: ListItem[];
}
interface VisibleListItem { item: ListItem; depth: number; }
@Component({
  selector: "dl-list",
  standalone: true,
  imports: [IconComponent, NgTemplateOutlet],
  template: `<ul [attr.aria-label]="label()" [class.divided]="dividers()">
      @for (entry of visibleItems(); track entry.item.id) {
        @let item = entry.item;
        <li>
          @if (interactive()) {
            <button
              type="button"
              [disabled]="disabled() || item.disabled"
              [attr.aria-current]="selectionMode()==='single' && isSelected(item.id) ? 'true' : null"
              [attr.aria-pressed]="selectionMode()==='multiple' ? isSelected(item.id) : null"
              (click)="activate(item)"
              [style.padding-inline-start]="nestedPadding(entry.depth)"
            >
              <ng-container [ngTemplateOutlet]="itemTemplate() || row" [ngTemplateOutletContext]="{$implicit:item, depth:entry.depth, selected:isSelected(item.id), expanded:isExpanded(item.id)}" />
            </button>
          } @else {
            <div class="row" [style.padding-inline-start]="nestedPadding(entry.depth)"><ng-container [ngTemplateOutlet]="itemTemplate() || row" [ngTemplateOutletContext]="{$implicit:item, depth:entry.depth, selected:isSelected(item.id), expanded:isExpanded(item.id)}" /></div>
          }
          <ng-template #row>
            @if (showIcons() && item.icon) {
              <dl-icon [name]="item.icon" [size]="iconSize()" />
            }
            <span class="text"
              ><span>{{ item.label }}</span>
              @if (showDescriptions() && item.description) {
                <small>{{ item.description }}</small>
              }
            </span>
            @if (showMeta() && item.meta) {
              <small>{{ item.meta }}</small>
            }
            @if (interactive() && showChevron()) {
              <dl-icon [name]="item.children?.length && isExpanded(item.id) ? 'chevron-down' : 'chevron-right'" [size]="16" />
            }
          </ng-template>
        </li>
      } @empty {
        <li class="empty">{{ emptyText() }}</li>
      }
    </ul>
    <ng-content />`,
  host: { "[attr.data-density]": "density()" },
  styles: [
    `
      :host {
        display: block;
        font: var(--dl-ui-font-size, 14px) var(--dl-font);
        color: var(--dl-ui-color, var(--dl-text));
        border: var(--dl-ui-border-width, 1px) solid
          var(--dl-ui-border-color, var(--dl-border));
        border-radius: var(--dl-ui-radius, var(--dl-radius));
        background: var(--dl-ui-background, var(--dl-surface));
        overflow: hidden;
      }
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      li {
        margin: 0;
      }
      .row,
      button {
        box-sizing: border-box;
        width: 100%;
        display: flex;
        align-items: center;
        gap: var(--dl-ui-gap, 12px);
        padding: var(--dl-ui-padding, 16px);
        font: inherit;
        color: inherit;
        background: transparent;
        border: 0;
        text-align: start;
      }
      .text {
        display: flex;
        flex-direction: column;
        gap: 4px;
        flex: 1;
        min-width: 0;
      }
      small {
        font-size: 12px;
        color: var(--dl-muted);
      }
      .divided li + li {
        border-top: 1px solid var(--dl-border);
      }
      button {
        cursor: pointer;
      }
      button:hover,
      button[aria-current="true"] {
        background: var(--dl-primary-soft);
      }
      button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      button:focus-visible {
        outline: 2px solid var(--dl-ui-focus-color, var(--dl-focus));
        outline-offset: -3px;
      }
      :host([data-density="compact"]) .row,
      :host([data-density="compact"]) button {
        padding: var(--dl-ui-padding, 8px 12px);
      }
      :host([data-density="comfortable"]) .row,
      :host([data-density="comfortable"]) button {
        padding: var(--dl-ui-padding, 24px);
      }
      .empty {
        padding: 24px;
        color: var(--dl-muted);
      }
    `,
  ],
})
export class ListComponent extends Appearance {
  readonly label = input("Items");
  readonly items = input<ListItem[]>([]);
  readonly interactive = input(false);
  readonly selected = model<string | string[]>("");
  readonly selectionMode = input<"none" | "single" | "multiple">("single");
  readonly disabled = input(false);
  readonly density = input<"compact" | "regular" | "comfortable">("regular");
  readonly dividers = input(true);
  readonly showIcons = input(true);
  readonly iconSize = input(20);
  readonly showDescriptions = input(true);
  readonly showMeta = input(true);
  readonly showChevron = input(true);
  readonly emptyText = input("No items");
  readonly itemTemplate = input<TemplateRef<{ $implicit: ListItem; depth: number; selected: boolean; expanded: boolean }> | null>(null);
  readonly nestedIndent = input(24);
  readonly expandOnActivate = input(true);
  readonly expandedIds = model<string[]>([]);
  readonly itemClick = output<ListItem>();
  readonly expandedChange = output<{ item: ListItem; expanded: boolean }>();
  readonly visibleItems = computed<VisibleListItem[]>(() => {
    const expanded = new Set(this.expandedIds());
    const flatten = (items: ListItem[], depth = 0): VisibleListItem[] => items.flatMap((item) => [
      { item, depth },
      ...(item.children?.length && expanded.has(item.id) ? flatten(item.children, depth + 1) : []),
    ]);
    return flatten(this.items());
  });
  readonly selectedIds = computed(() => Array.isArray(this.selected()) ? this.selected() as string[] : this.selected() ? [this.selected() as string] : []);
  isSelected(id: string): boolean { return this.selectedIds().includes(id); }
  isExpanded(id: string): boolean { return this.expandedIds().includes(id); }
  nestedPadding(depth: number): string { return `calc(var(--dl-ui-padding, 16px) + ${Math.max(0, depth) * this.nestedIndent()}px)`; }
  activate(item: ListItem): void {
    if (this.disabled() || item.disabled) return;
    this.itemClick.emit(item);
    if (this.expandOnActivate() && item.children?.length) {
      const expanded = !this.isExpanded(item.id);
      this.expandedIds.update((ids) => expanded ? [...ids, item.id] : ids.filter((id) => id !== item.id));
      this.expandedChange.emit({ item, expanded });
    }
    if (this.selectionMode() === "single") this.selected.set(item.id);
    else if (this.selectionMode() === "multiple") this.selected.set(this.isSelected(item.id) ? this.selectedIds().filter((id) => id !== item.id) : [...this.selectedIds(), item.id]);
  }
}
