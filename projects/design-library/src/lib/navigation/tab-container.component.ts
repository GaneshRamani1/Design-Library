import {
  Component,
  computed,
  contentChildren,
  ElementRef,
  inject,
  input,
  model,
  output,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { TabComponent } from "./tab.component";
import { Appearance } from "../shared/appearance";
let nextTabContainer = 0;
@Component({
  selector: "dl-tab-container",
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `<div
      class="tabs"
      [class.vertical]="orientation() === 'vertical'"
      [attr.data-variant]="variant()"
      [attr.data-size]="size()"
    >
      <div
        class="tablist"
        role="tablist"
        [attr.aria-label]="label()"
        [attr.aria-orientation]="orientation()"
        [style.justify-content]="align()"
        [style.gap]="gap()"
        [class.divider]="showDivider()"
      >
        @for (tab of tabs(); track tab.value(); let index = $index) {
          <div class="tab-item" [style.flex]="stretch() ? '1' : null">
            <button
              type="button"
              role="tab"
              [id]="id() + '-tab-' + index"
              [attr.aria-controls]="id() + '-panel-' + index"
              [attr.aria-selected]="active() === tab"
              [tabIndex]="active() === tab ? 0 : -1"
              [disabled]="tab.disabled()"
              (click)="select(tab)"
              (keydown)="key($event, index)"
            >
              @if (tab.icon()) {
                <span aria-hidden="true">{{ tab.icon() }}</span>
              }
              {{ tab.label() }}
              @if (tab.badge()) {
                <span class="badge">{{ tab.badge() }}</span>
              }
            </button>
            @if (tab.closable()) {
              <button
                class="close"
                type="button"
                [disabled]="tab.disabled()"
                [attr.aria-label]="tab.closeLabel() || 'Close ' + tab.label()"
                (click)="tab.closed.emit(); tabClose.emit(tab.value())"
              >
                ×
              </button>
            }
          </div>
        }
      </div>
      <div class="panels">
        @for (tab of tabs(); track tab.value(); let index = $index) {
          @if (keepAlive() || active() === tab) {
            <section
              role="tabpanel"
              [id]="id() + '-panel-' + index"
              [attr.aria-labelledby]="id() + '-tab-' + index"
              [hidden]="active() !== tab"
              tabindex="0"
              [style.padding]="panelPadding()"
            >
              @if (tab.content(); as content) {
                <ng-container [ngTemplateOutlet]="content" />
              }
            </section>
          }
        }
      </div>
    </div>
    <ng-content />`,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        color: var(--dl-ui-color, var(--dl-text));
        font: var(--dl-ui-font-size, 14px) var(--dl-font);
      }
      .tabs {
        display: flex;
        flex-direction: column;
        gap: var(--dl-ui-gap, 16px);
      }
      .vertical {
        flex-direction: row;
      }
      .vertical .tablist {
        flex-direction: column;
        align-items: stretch;
      }
      .tablist {
        display: flex;
        overflow: auto;
        flex-shrink: 0;
      }
      .divider {
        border-bottom: 1px solid var(--dl-border);
      }
      .tab-item {
        display: flex;
        align-items: center;
        min-width: max-content;
      }
      button {
        font: inherit;
        color: var(--dl-ui-color, var(--dl-muted));
        background: var(--dl-ui-background, transparent);
        border: 0;
        border-bottom: 2px solid transparent;
        padding: var(--dl-ui-padding, 12px 16px);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--dl-ui-gap, 8px);
        cursor: pointer;
        flex: 1;
      }
      button[aria-selected="true"] {
        color: var(--dl-ui-color, var(--dl-text));
        border-color: var(--dl-ui-border-color, var(--dl-primary));
      }
      [data-variant="pill"] button[aria-selected="true"] {
        background: var(--dl-ui-background, var(--dl-primary));
        color: var(--dl-ui-color, var(--dl-on-primary));
        border-radius: var(--dl-ui-radius, 10px);
      }
      .close {
        padding: var(--dl-ui-padding, 8px);
        flex: 0;
      }
      .badge {
        font-size: var(--dl-ui-font-size, 10px);
        padding: var(--dl-ui-padding, 2px 6px);
        background: var(--dl-ui-background, var(--dl-neutral-bg));
        color: var(--dl-ui-color, var(--dl-neutral-text));
        border-radius: var(--dl-ui-radius, 6px);
      }
      button:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
      button:focus-visible,
      section:focus-visible {
        outline: 2px solid var(--dl-ui-focus-color, var(--dl-focus));
        outline-offset: -2px;
      }
      .panels {
        min-width: 0;
        flex: 1;
      }
      [data-size="sm"] button {
        font-size: var(--dl-ui-font-size, 12px);
        padding: var(--dl-ui-padding, 8px 12px);
      }
      [data-size="lg"] button {
        font-size: var(--dl-ui-font-size, 16px);
        padding: var(--dl-ui-padding, 16px 20px);
      }

      :host,
      .tabs,
      .tablist {
        min-width: 0;
        max-width: 100%;
      }
      .panels {
        overflow-wrap: anywhere;
      }
      @media (max-width: 600px) {
        .vertical {
          flex-direction: column;
        }
        .vertical .tab-item {
          min-width: 0;
        }
        .vertical button {
          overflow-wrap: anywhere;
          min-width: 0;
        }
      }
    `,
  ],
})
export class TabContainerComponent extends Appearance {
  readonly id = input(`dl-tabs-${++nextTabContainer}`);
  readonly label = input("Tabs");
  readonly value = model<string | null>(null);
  readonly orientation = input<"horizontal" | "vertical">("horizontal");
  readonly variant = input<"underline" | "pill">("underline");
  readonly activation = input<"automatic" | "manual">("automatic");
  readonly size = input<"sm" | "md" | "lg">("md");
  readonly align = input<"flex-start" | "center" | "flex-end">("flex-start");
  readonly stretch = input(false);
  readonly gap = input("4px");
  readonly panelPadding = input("16px");
  readonly keepAlive = input(true);
  readonly showDivider = input(true);
  readonly tabClose = output<string>();
  readonly tabs = contentChildren(TabComponent);
  readonly active = computed(
    () =>
      this.tabs().find(
        (tab) => tab.value() === this.value() && !tab.disabled(),
      ) ?? this.tabs().find((tab) => !tab.disabled()),
  );
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  select(tab: TabComponent): void {
    if (!tab.disabled()) this.value.set(tab.value());
  }
  key(event: KeyboardEvent, index: number): void {
    const previous =
        this.orientation() === "vertical" ? "ArrowUp" : "ArrowLeft",
      next = this.orientation() === "vertical" ? "ArrowDown" : "ArrowRight";
    if (![previous, next, "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const enabled = this.tabs()
      .map((tab, i) => (tab.disabled() ? -1 : i))
      .filter((i) => i >= 0);
    if (!enabled.length) return;
    const position = enabled.indexOf(index);
    const target =
      event.key === "Home"
        ? enabled[0]
        : event.key === "End"
          ? enabled.at(-1)!
          : enabled[
              (position + (event.key === next ? 1 : -1) + enabled.length) %
                enabled.length
            ];
    this.element.nativeElement
      .querySelectorAll<HTMLButtonElement>("[role=tab]")
      [target]?.focus();
    if (this.activation() === "automatic") this.select(this.tabs()[target]);
  }
}
