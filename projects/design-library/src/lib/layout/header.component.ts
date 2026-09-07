import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
} from "@angular/core";
import { Appearance } from "../shared/appearance";

export interface HeaderMetadata {
  label?: string;
  value: string | number;
}
/** A page or section heading with arbitrary content projected to either side. */
@Component({
  selector: "dl-header",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[attr.data-surface]": "surface()",
    "[attr.data-size]": "size()",
    "[style.width]": "width()",
    "[style.--header-padding]": "padding()",
    "[style.--header-gap]": "gap()",
    "[style.--header-content-gap]": "contentGap()",
    "[style.--header-heading-color]": "headingColor()",
    "[style.--header-subheading-color]": "subheadingColor()",
    "[style.--header-metadata-color]": "metadataColor()",
    "[style.--header-metadata-gap]": "metadataGap()",
  },
  template: `<header
    class="header"
    [class.stacked]="stacked()"
    [class.divided]="showDivider()"
    [style.align-items]="align()"
    [style.text-align]="textAlign()"
  >
    <div class="slot left" [class.hidden]="!showLeft()">
      <ng-content select="[headerLeft]" />
    </div>
    <div class="content">
      @if (eyebrow()) {
        <p class="eyebrow">{{ eyebrow() }}</p>
      }
      @if (showHeading()) {
        @if (heading()) {
          @switch (headingLevel()) {
            @case (1) {
              <h1>{{ heading() }}</h1>
            }
            @case (2) {
              <h2>{{ heading() }}</h2>
            }
            @case (3) {
              <h3>{{ heading() }}</h3>
            }
            @case (4) {
              <h4>{{ heading() }}</h4>
            }
            @case (5) {
              <h5>{{ heading() }}</h5>
            }
            @case (6) {
              <h6>{{ heading() }}</h6>
            }
          }
        }
        <div class="projected-heading">
          <ng-content select="[headerHeading]" />
        </div>
      }
      @if (showSubheading()) {
        @if (subheading()) {
          <p class="subheading">{{ subheading() }}</p>
        }
        <div class="projected-subheading">
          <ng-content select="[headerSubheading]" />
        </div>
      }
      @if (showMetadata()) {
        @if (metadata().length) {
          <ul class="metadata" [attr.aria-label]="metadataLabel()">
            @for (item of metadata(); track $index) {
              <li>
                @if ($index && metadataSeparator()) {
                  <span class="separator" aria-hidden="true">{{
                    metadataSeparator()
                  }}</span>
                }
                <span>
                  @if (item.label) {
                    <span class="metadata-label">{{ item.label }}:</span>
                  }
                  {{ item.value }}</span
                >
              </li>
            }
          </ul>
        }
        <div class="projected-metadata">
          <ng-content select="[headerMetadata]" />
        </div>
      }
      <div class="extra"><ng-content /></div>
    </div>
    <div class="slot right" [class.hidden]="!showRight()">
      <ng-content select="[headerRight]" />
    </div>
  </header>`,
  styles: [
    `
      :host {
        display: block;
        box-sizing: border-box;
        max-width: 100%;
        min-width: 0;
        color: var(--dl-ui-color, var(--dl-text));
        font-family: var(--dl-font, sans-serif);
      }
      .header {
        display: flex;
        gap: var(--dl-ui-gap, var(--header-gap, 24px));
        padding: var(--dl-ui-padding, var(--header-padding, 0));
        box-sizing: border-box;
        min-width: 0;
        max-width: 100%;
        border: var(--dl-ui-border-width, 0) solid
          var(--dl-ui-border-color, var(--dl-border));
        border-radius: var(--dl-ui-radius, 0);
        background: var(--dl-ui-background, transparent);
        box-shadow: var(--dl-ui-shadow, none);
      }
      :host([data-surface="solid"]) .header {
        background: var(--dl-ui-background, var(--dl-surface));
      }
      :host([data-surface="glass"]) .header {
        background-color: var(--dl-ui-background, var(--dl-card-surface));
        background-image: var(--dl-card-sheen, none);
        backdrop-filter: var(--dl-card-blur, none);
        border-width: var(--dl-ui-border-width, 1px);
        border-radius: var(--dl-ui-radius, 16px);
        box-shadow: var(--dl-ui-shadow, var(--dl-card-shadow, none));
      }
      .header.divided {
        border-bottom-width: var(--dl-ui-border-width, 1px);
      }
      .content {
        flex: 1 1 0;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: var(--header-content-gap, 8px);
        overflow-wrap: anywhere;
      }
      h1,
      h2,
      h3,
      h4,
      h5,
      h6,
      p {
        margin: 0;
      }
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        font-size: var(--dl-ui-font-size, 32px);
        line-height: 1.2;
        letter-spacing: -0.025em;
        font-weight: 650;
        color: var(--header-heading-color, var(--dl-ui-color, var(--dl-text)));
      }
      :host([data-size="sm"]) :is(h1, h2, h3, h4, h5, h6) {
        font-size: var(--dl-ui-font-size, 20px);
      }
      :host([data-size="lg"]) :is(h1, h2, h3, h4, h5, h6) {
        font-size: var(--dl-ui-font-size, 40px);
      }
      .eyebrow {
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        color: var(--header-subheading-color, var(--dl-muted));
      }
      .subheading,
      .projected-subheading {
        font-size: 14px;
        line-height: 1.6;
        color: var(--header-subheading-color, var(--dl-muted));
      }
      .metadata {
        display: flex;
        flex-wrap: wrap;
        gap: var(--header-metadata-gap, 8px);
        padding: 0;
        margin: 0;
        list-style: none;
      }
      .metadata,
      .projected-metadata {
        font-size: 12px;
        line-height: 1.5;
        color: var(--header-metadata-color, var(--dl-muted));
      }
      .metadata li {
        display: flex;
        gap: var(--header-metadata-gap, 8px);
        min-width: 0;
        max-width: 100%;
      }
      .metadata-label {
        font-weight: 600;
      }
      .separator {
        opacity: 0.65;
      }
      .slot,
      .projected-metadata {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
        min-width: 0;
        max-width: 100%;
      }
      .slot {
        flex: 0 1 auto;
        overflow-wrap: anywhere;
      }
      .right {
        justify-content: flex-end;
      }
      .slot:empty,
      .projected-heading:empty,
      .projected-subheading:empty,
      .projected-metadata:empty,
      .extra:empty,
      .hidden {
        display: none;
      }
      .stacked {
        flex-direction: column;
      }
      .stacked .content,
      .stacked .slot {
        width: 100%;
        box-sizing: border-box;
      }
      .stacked .right {
        justify-content: flex-start;
      }
      @media (max-width: 480px) {
        :host([data-size="lg"]) :is(h1, h2, h3, h4, h5, h6) {
          font-size: var(--dl-ui-font-size, 32px);
        }
      }
    `,
  ],
})
export class HeaderComponent extends Appearance {
  readonly heading = input("");
  readonly subheading = input("");
  readonly eyebrow = input("");
  readonly metadata = input<HeaderMetadata[]>([]);
  readonly headingLevel = input<1 | 2 | 3 | 4 | 5 | 6>(1);
  readonly size = input<"sm" | "md" | "lg">("md");
  readonly surface = input<"transparent" | "solid" | "glass">("transparent");
  readonly width = input("100%");
  readonly padding = input("0");
  readonly gap = input("24px");
  readonly contentGap = input("8px");
  readonly metadataGap = input("8px");
  readonly align = input<"flex-start" | "center" | "flex-end">("center");
  readonly textAlign = input<"start" | "center" | "end">("start");
  readonly layout = input<"responsive" | "row" | "column">("responsive");
  readonly responsiveBreakpoint = input(640);
  readonly headingColor = input("");
  readonly subheadingColor = input("");
  readonly metadataColor = input("");
  readonly metadataSeparator = input("·");
  readonly metadataLabel = input("Details");
  readonly showHeading = input(true);
  readonly showSubheading = input(true);
  readonly showMetadata = input(true);
  readonly showLeft = input(true);
  readonly showRight = input(true);
  readonly showDivider = input(false);
  private readonly containerWidth = signal(Infinity);
  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  readonly stacked = computed(
    () =>
      this.layout() === "column" ||
      (this.layout() === "responsive" &&
        this.containerWidth() < Math.max(0, this.responsiveBreakpoint())),
  );
  constructor() {
    super();
    afterNextRender(() => {
      const observer = new ResizeObserver((entries) =>
        this.containerWidth.set(entries[0]?.contentRect.width ?? 0),
      );
      observer.observe(this.hostElement.nativeElement);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
