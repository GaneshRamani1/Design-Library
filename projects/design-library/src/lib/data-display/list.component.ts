import { NgTemplateOutlet } from "@angular/common";
import { Component, input, output } from "@angular/core";
import { Appearance } from "../shared/appearance";
import { IconComponent } from "../icons/icon.component";
export interface ListItem {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  meta?: string;
  disabled?: boolean;
}
@Component({
  selector: "dl-list",
  standalone: true,
  imports: [IconComponent, NgTemplateOutlet],
  template: `<ul [attr.aria-label]="label()" [class.divided]="dividers()">
      @for (item of items(); track item.id) {
        <li>
          @if (interactive()) {
            <button
              type="button"
              [disabled]="disabled() || item.disabled"
              [attr.aria-current]="selected() === item.id ? 'true' : null"
              (click)="itemClick.emit(item)"
            >
              <ng-container [ngTemplateOutlet]="row" />
            </button>
          } @else {
            <div class="row"><ng-container [ngTemplateOutlet]="row" /></div>
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
              <dl-icon name="chevron-right" [size]="16" />
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
  readonly selected = input("");
  readonly disabled = input(false);
  readonly density = input<"compact" | "regular" | "comfortable">("regular");
  readonly dividers = input(true);
  readonly showIcons = input(true);
  readonly iconSize = input(20);
  readonly showDescriptions = input(true);
  readonly showMeta = input(true);
  readonly showChevron = input(true);
  readonly emptyText = input("No items");
  readonly itemClick = output<ListItem>();
}
