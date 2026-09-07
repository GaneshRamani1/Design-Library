import { Component, input, computed } from "@angular/core";
import { Appearance } from "../shared/appearance";
@Component({
  selector: "dl-skeleton",
  standalone: true,
  template: `@if (loading()) {
      <span class="sr-only" role="status">{{ label() }}</span>
      <div class="blocks" aria-hidden="true" [style.gap]="gap()">
        @for (line of lines(); track $index) {
          <span
            class="bone"
            [class.shimmer]="animation() === 'shimmer'"
            [class.pulse]="animation() === 'pulse'"
            [style.width]="$last && count() > 1 ? lastLineWidth() : width()"
            [style.height]="height()"
            [style.border-radius]="shape() === 'circle' ? '50%' : radius()"
            [style.background-color]="color()"
          ></span>
        }
      </div>
    } @else {
      <ng-content />
    }`,
  host: { "[attr.aria-busy]": "loading()" },
  styles: [
    `
      :host {
        display: block;
        max-width: 100%;
      }
      .blocks {
        display: flex;
        flex-direction: column;
      }
      .bone {
        display: block;
        position: relative;
        overflow: hidden;
        max-width: 100%;
        background: var(--dl-ui-background, var(--dl-border));
      }
      .shimmer:after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(
          90deg,
          transparent,
          var(--dl-skeleton-highlight, #ffffff18),
          transparent
        );
        animation: shimmer 1.6s infinite;
        transform: translateX(-100%);
      }
      .pulse {
        animation: pulse 1.6s ease-in-out infinite;
      }
      @keyframes shimmer {
        to {
          transform: translateX(100%);
        }
      }
      @keyframes pulse {
        50% {
          opacity: 0.4;
        }
      }
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(50%);
      }
      @media (prefers-reduced-motion: reduce) {
        .shimmer:after,
        .pulse {
          animation: none;
        }
      }
    `,
  ],
})
export class SkeletonComponent extends Appearance {
  readonly loading = input(true);
  readonly label = input("Loading content");
  readonly shape = input<"text" | "rectangle" | "circle">("text");
  readonly width = input("100%");
  readonly height = input("16px");
  readonly count = input(3);
  readonly gap = input("12px");
  readonly radius = input("6px");
  readonly lastLineWidth = input("65%");
  readonly animation = input<"shimmer" | "pulse" | "none">("shimmer");
  readonly color = input("var(--dl-border)");
  readonly lines = computed(() =>
    Array.from({
      length: Math.max(1, Math.min(100, Math.floor(this.count()) || 1)),
    }),
  );
}
