import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core";
import { ToneAppearance } from "../shared/tone";
import { IconComponent } from "../icons/icon.component";
import { ButtonComponent } from "../button.component";

/** A dashboard metric tile. Compose multiple tiles with a layout container or CSS grid. */
@Component({
  selector: "dl-tiles, dl-tile",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, ButtonComponent],
  host: {
    "[attr.data-surface]": "surface()",
    "[attr.aria-busy]": "loading()",
    "[style.width]": "width()",
    "[style.height]": "height()",
    "[style.min-height]": "minHeight()",
    "[style.--tile-value-size]": "valueSize()",
    "[style.--tile-value-color]": "valueColor()",
    "[style.--tile-chart-color]": "chartColor()",
  },
  template: `@if (showHeader()) {
      <header>
        <div class="heading">
          <span class="label">{{ label() }}</span>
          @if (description()) {
            <p>{{ description() }}</p>
          }
        </div>
        @if (showIcon() && icon()) {
          <span class="icon"
            ><dl-icon [name]="icon()" [size]="iconSize()"
          /></span>
        }
      </header>
    }
    @if (loading()) {
      <div class="loading" role="status" [attr.aria-label]="loadingLabel()">
        <span class="skeleton"></span><span class="skeleton short"></span>
      </div>
    } @else if (error()) {
      <div class="error" role="alert">{{ error() }}</div>
    } @else {
      @if (showValue()) {
        <div
          class="metric"
          [attr.role]="valueLabel() ? 'group' : null"
          [attr.aria-label]="valueLabel() || null"
        >
          <span class="affix">{{ prefix() }}</span
          ><strong>{{ value() ?? emptyText() }}</strong
          ><span class="affix">{{ suffix() }}</span>
        </div>
      }
      @if (showTrend() && trend()) {
        <div class="comparison">
          <span class="trend" [attr.data-tone]="trendTone()"
            ><span aria-hidden="true">{{
              trendDirection() === "up"
                ? "↗"
                : trendDirection() === "down"
                  ? "↘"
                  : "→"
            }}</span
            ><span class="sr-only">{{ trendDirection() }} </span
            >{{ trend() }}</span
          >
          @if (comparison()) {
            <span>{{ comparison() }}</span>
          }
        </div>
      }
      @if (showChart() && chartPoints().length) {
        <svg
          class="chart"
          viewBox="0 0 300 80"
          preserveAspectRatio="none"
          role="img"
          [attr.aria-label]="chartLabel()"
          [style.height]="chartHeight()"
        >
          @if (chartFill() && chartPoints().length > 1) {
            <polygon
              [attr.points]="'0,78 ' + chartPath() + ' 300,78'"
              fill="currentColor"
              opacity=".12"
            />
          }
          @if (chartPoints().length === 1) {
            <circle cx="150" cy="40" r="3" fill="currentColor" />
          }
          <polyline
            [attr.points]="chartPath()"
            fill="none"
            stroke="currentColor"
            [attr.stroke-width]="chartStrokeWidth()"
            stroke-linejoin="round"
            stroke-linecap="round"
            vector-effect="non-scaling-stroke"
          />
        </svg>
      }
      @if (showProgress()) {
        <div class="goal">
          <div class="goal-label">
            <span>{{ progressLabel() }}</span
            ><span>{{ progressPercent() }}%</span>
          </div>
          <div
            class="track"
            role="progressbar"
            [attr.aria-label]="progressLabel()"
            aria-valuemin="0"
            aria-valuemax="100"
            [attr.aria-valuenow]="progressPercent()"
          >
            <span [style.width.%]="progressPercent()"></span>
          </div>
        </div>
      }
      <ng-content />
    }
    @if (showFooter()) {
      <footer>
        @if (footerText()) {
          <span>{{ footerText() }}</span>
        }
        <ng-content select="[tileFooter]" />
        @if (actionLabel()) {
          <button
            dlButton
            [variant]="actionVariant()"
            [disabled]="disabled() || loading()"
            [attr.aria-label]="actionAriaLabel() || actionLabel()"
            (click)="action.emit()"
          >
            {{ actionLabel() }}
          </button>
        }
      </footer>
    }`,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        min-width: 0;
        max-width: 100%;
        gap: var(--dl-ui-gap, 18px);
        padding: var(--dl-ui-padding, 24px);
        border: var(--dl-ui-border-width, 1px) solid
          var(--dl-ui-border-color, var(--dl-card-border));
        border-radius: var(--dl-ui-radius, var(--dl-card-radius));
        background: var(--dl-ui-background, var(--dl-card-surface));
        background-image: var(--dl-card-sheen);
        backdrop-filter: var(--dl-card-blur);
        box-shadow: var(--dl-ui-shadow, var(--dl-card-shadow));
        color: var(--dl-ui-color, var(--dl-text));
        font: var(--dl-ui-font-size, 14px)/1.5 var(--dl-font);
      }
      :host([data-surface="solid"]) {
        background: var(--dl-ui-background, var(--dl-surface));
        backdrop-filter: none;
      }
      :host([data-surface="transparent"]) {
        background: var(--dl-ui-background, transparent);
        backdrop-filter: none;
        box-shadow: var(--dl-ui-shadow, none);
      }
      :host([data-size="sm"]) {
        padding: var(--dl-ui-padding, 16px);
        gap: var(--dl-ui-gap, 12px);
      }
      :host([data-size="lg"]) {
        padding: var(--dl-ui-padding, 32px);
        gap: var(--dl-ui-gap, 24px);
      }
      header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
      }
      .heading {
        min-width: 0;
      }
      .label {
        font-weight: 600;
      }
      p {
        margin: 4px 0 0;
        font-size: 12px;
        color: var(--dl-muted);
      }
      .icon {
        display: inline-flex;
        padding: 8px;
        border-radius: 10px;
        background: var(--tone-bg);
        color: var(--tone-text);
        border: 1px solid var(--tone-border);
        flex-shrink: 0;
      }
      .metric {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 4px;
        color: var(--tile-value-color, var(--dl-text));
        overflow-wrap: anywhere;
      }
      .metric strong {
        font-size: var(--tile-value-size, 36px);
        font-weight: 600;
        letter-spacing: -1px;
        line-height: 1.15;
        min-width: 0;
      }
      .affix {
        font-size: 18px;
        color: var(--dl-muted);
      }
      .comparison {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        font-size: 12px;
        color: var(--dl-muted);
      }
      .trend {
        display: inline-flex;
        gap: 4px;
        font-weight: 600;
      }
      .trend[data-tone="success"] {
        color: var(--dl-success-text);
      }
      .trend[data-tone="danger"] {
        color: var(--dl-danger-text);
      }
      .trend[data-tone="neutral"] {
        color: var(--dl-muted);
      }
      .chart {
        display: block;
        width: 100%;
        min-height: 0;
        color: var(--tile-chart-color, var(--tone-text));
        overflow: visible;
      }
      .goal-label {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        font-size: 12px;
        color: var(--dl-muted);
        margin-bottom: 8px;
      }
      .track {
        height: 6px;
        background: var(--dl-border);
        border-radius: 20px;
        overflow: hidden;
      }
      .track span {
        display: block;
        height: 100%;
        background: var(--tile-chart-color, var(--tone-text));
        border-radius: inherit;
      }
      footer {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 12px;
        margin-top: auto;
        font-size: 12px;
        color: var(--dl-muted);
      }
      footer:empty {
        display: none;
      }
      .error {
        color: var(--dl-danger-text);
      }
      .loading {
        display: grid;
        gap: 12px;
      }
      .skeleton {
        height: 38px;
        width: 65%;
        border-radius: 6px;
        background: var(--dl-border);
      }
      .skeleton.short {
        width: 45%;
        height: 14px;
      }
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
      }
    `,
  ],
})
export class TilesComponent extends ToneAppearance {
  readonly showHeader = input(true);
  readonly label = input("Total revenue");
  readonly description = input("");
  readonly value = input<string | number | null>("48,250");
  readonly prefix = input("$");
  readonly suffix = input("");
  readonly valueLabel = input("");
  readonly emptyText = input("—");
  readonly valueSize = input("36px");
  readonly valueColor = input("var(--dl-text)");
  readonly showValue = input(true);
  readonly icon = input("star");
  readonly iconSize = input(20);
  readonly showIcon = input(true);
  readonly surface = input<"glass" | "solid" | "transparent">("glass");
  readonly width = input("100%");
  readonly height = input("auto");
  readonly minHeight = input("220px");
  readonly trend = input("");
  readonly trendDirection = input<"up" | "down" | "flat">("up");
  readonly trendTone = input<"success" | "danger" | "neutral">("success");
  readonly comparison = input("");
  readonly showTrend = input(true);
  readonly series = input<number[]>([]);
  readonly showChart = input(true);
  readonly chartLabel = input("Metric history");
  readonly chartHeight = input("64px");
  readonly chartColor = input("var(--tone-text)");
  readonly chartStrokeWidth = input(2);
  readonly chartFill = input(true);
  readonly showProgress = input(false);
  readonly progress = input(0);
  readonly progressLabel = input("Goal completion");
  readonly loading = input(false);
  readonly loadingLabel = input("Loading metric");
  readonly error = input("");
  readonly showFooter = input(true);
  readonly footerText = input("");
  readonly actionLabel = input("");
  readonly actionAriaLabel = input("");
  readonly actionVariant = input<
    "primary" | "secondary" | "tertiary" | "ghost"
  >("ghost");
  readonly disabled = input(false);
  readonly action = output<void>();
  readonly progressPercent = computed(() =>
    Number.isFinite(this.progress())
      ? Math.round(Math.min(100, Math.max(0, this.progress())))
      : 0,
  );
  readonly chartPoints = computed(() => this.series().filter(Number.isFinite));
  readonly chartPath = computed(() => {
    const points = this.chartPoints();
    if (!points.length) return "";
    const min = Math.min(...points),
      max = Math.max(...points),
      span = max - min;
    return points
      .map(
        (v, i) =>
          `${points.length === 1 ? 150 : (i * 300) / (points.length - 1)},${span ? 74 - ((v - min) / span) * 68 : 40}`,
      )
      .join(" ");
  });
}
