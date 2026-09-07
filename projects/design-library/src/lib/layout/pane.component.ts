import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, input, output } from "@angular/core";
import { LayoutBase, layoutStyles, type LayoutLength } from "./layout-base";
/** A glass or solid panel with controlled height and overflow. */
@Component({
  selector: "dl-pane",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[attr.data-surface]": "surface()",
    "[style.overflow]": "overflow()",
    "[style.min-width]": "length(minWidth())",
    "[style.max-width]": "maxWidth() === null ? null : length(maxWidth()!)",
    "[style.resize]": "resizable()",
  },
  template: `<ng-content />`,
  styles: [
    layoutStyles,
    `
      :host {
        border: var(--dl-ui-border-width, 1px) solid
          var(--dl-ui-border-color, var(--dl-card-border));
        border-radius: var(--dl-ui-radius, var(--dl-card-radius));
        background-color: var(--dl-ui-background, var(--dl-card-surface));
        background-image: var(--dl-card-sheen);
        box-shadow: var(--dl-ui-shadow, var(--dl-card-shadow));
        backdrop-filter: var(--dl-card-blur);
        -webkit-backdrop-filter: var(--dl-card-blur);
      }
      :host([data-surface="solid"]) {
        background: var(--dl-ui-background, var(--dl-surface));
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
      }
      :host([data-surface="transparent"]) {
        background: var(--dl-ui-background, transparent);
        border-color: var(--dl-ui-border-color, transparent);
        box-shadow: var(--dl-ui-shadow, none);
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
      }
    `,
  ],
})
export class PaneComponent extends LayoutBase {
  readonly surface = input<"glass" | "solid" | "transparent">("glass");
  readonly overflow = input<"visible" | "auto" | "hidden">("auto");
  readonly minWidth = input<LayoutLength>(0);
  readonly maxWidth = input<LayoutLength | null>(null);
  readonly resizable = input<"none" | "horizontal" | "vertical" | "both">("none");
  readonly resized = output<{ width: number; height: number }>();
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  constructor() {
    super();
    afterNextRender(() => {
      let previous = "";
      const observer = new ResizeObserver(([entry]) => {
        const value = { width: entry?.contentRect.width ?? 0, height: entry?.contentRect.height ?? 0 };
        const signature = `${value.width}:${value.height}`;
        if (previous && signature !== previous) this.resized.emit(value);
        previous = signature;
      });
      observer.observe(this.element.nativeElement);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
