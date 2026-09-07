import {
  afterNextRender,
  ElementRef,
  Injector,
  inject,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from "@angular/core";
import { Appearance } from "../shared/appearance";
import { LinkDirective } from "./link.directive";
import { IconComponent } from "../icons/icon.component";
export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
  disabled?: boolean;
  target?: "_self" | "_blank" | "_parent" | "_top";
  ariaLabel?: string;
}
export interface BreadcrumbSelection {
  item: BreadcrumbItem;
  index: number;
  event: MouseEvent;
}
@Component({
  selector: "dl-breadcrumb",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LinkDirective, IconComponent],
  host: {
    "[style.font-size]":
      "'var(--dl-ui-font-size, ' + ({sm:12,md:14,lg:16}[size()]) + 'px)'",
  },
  template: `<nav [attr.aria-label]="ariaLabel()">
    <ol>
      @for (entry of entries(); track entry.index; let first = $first) {
        @if (!first) {
          <li class="separator" aria-hidden="true">{{ separator() }}</li>
        }
        <li>
          @if (entry.index === -1) {
            <button
              type="button"
              [attr.aria-label]="expandLabel()"
              [disabled]="disabled()"
              aria-expanded="false"
              (click)="expand()"
            >
              {{ collapseLabel() }}
            </button>
          } @else if (entry.index === items().length - 1 && !linkCurrent()) {
            <span class="current" aria-current="page">
              @if (showIcons() && entry.item.icon) {
                <dl-icon [name]="entry.item.icon" [size]="iconSize()" />
              }
              {{ entry.item.label }}
            </span>
          } @else if (entry.item.href) {
            <a
              dlLink
              [href]="entry.item.href || ''"
              [target]="entry.item.target || '_self'"
              [disabled]="disabled() || !!entry.item.disabled"
              [ariaLabel]="entry.item.ariaLabel || ''"
              [current]="entry.index === items().length - 1 ? 'page' : 'none'"
              [size]="size()"
              [tone]="tone()"
              [underline]="underline()"
              (activated)="
                selected.emit({
                  item: entry.item,
                  index: entry.index,
                  event: $event,
                })
              "
            >
              @if (showIcons() && entry.item.icon) {
                <dl-icon [name]="entry.item.icon" [size]="iconSize()" />
              }
              {{ entry.item.label }}
            </a>
          } @else {
            <span>{{ entry.item.label }}</span>
          }
        </li>
      }
    </ol>
  </nav>`,
  styles: [
    `
      :host {
        display: block;
        max-width: 100%;
        font: var(--dl-ui-font-size, 14px)/1.5 var(--dl-font);
        color: var(--dl-ui-color, var(--dl-muted));
      }
      nav {
        padding: var(--dl-ui-padding, 0);
        border: var(--dl-ui-border-width, 0) solid
          var(--dl-ui-border-color, transparent);
        border-radius: var(--dl-ui-radius, 0);
        background: var(--dl-ui-background, transparent);
        box-shadow: var(--dl-ui-shadow, none);
      }
      ol {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: var(--dl-ui-gap, 8px);
        list-style: none;
        padding: 0;
        margin: 0;
      }
      li {
        min-width: 0;
        display: inline-flex;
        align-items: center;
        overflow-wrap: anywhere;
      }
      a,
      span.current {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        min-width: 0;
      }
      .current {
        color: var(--dl-ui-color, var(--dl-text));
        font-weight: 600;
      }
      .separator {
        user-select: none;
      }
      button {
        background: transparent;
        color: inherit;
        border: 1px solid var(--dl-border);
        border-radius: 4px;
        font: inherit;
        padding: 0 6px;
        cursor: pointer;
      }
      button:focus-visible {
        outline: 2px solid var(--dl-ui-focus-color, var(--dl-focus));
        outline-offset: 3px;
      }
    `,
  ],
})
export class BreadcrumbComponent extends Appearance {
  readonly items = input<BreadcrumbItem[]>([]);
  readonly ariaLabel = input("Breadcrumb");
  readonly separator = input("/");
  readonly size = input<"sm" | "md" | "lg">("md");
  readonly tone = input<"primary" | "neutral" | "danger" | "inherit">(
    "neutral",
  );
  readonly underline = input<"always" | "hover" | "none">("hover");
  readonly disabled = input(false);
  readonly showIcons = input(true);
  readonly iconSize = input(16);
  readonly linkCurrent = input(false);
  /** Zero shows all items. Positive limits retain the first and final items. */
  readonly maxItems = input(0);
  readonly collapseLabel = input("…");
  readonly expandLabel = input("Show full breadcrumb path");
  readonly selected = output<BreadcrumbSelection>();
  readonly expanded = output<void>();
  readonly structuredData = computed(() => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: this.items().map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: item.href } : {}),
    })),
  }));
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly expandedItems = signal<BreadcrumbItem[] | null>(null);
  readonly entries = computed(() => {
    const items = this.items().map((item, index) => ({ item, index }));
    const limit = Math.max(3, Math.floor(this.maxItems()));
    if (
      this.maxItems() <= 0 ||
      !Number.isFinite(this.maxItems()) ||
      this.expandedItems() === this.items() ||
      items.length <= limit
    )
      return items;
    return [
      items[0],
      { item: { label: this.collapseLabel() }, index: -1 },
      ...items.slice(-(limit - 2)),
    ];
  });
  expand(): void {
    this.expandedItems.set(this.items());
    this.expanded.emit();
    afterNextRender(
      () => {
        const links =
          this.element.nativeElement.querySelectorAll<HTMLAnchorElement>(
            "a[href]",
          );
        (links[1] ?? links[0])?.focus();
      },
      { injector: this.injector },
    );
  }
}
