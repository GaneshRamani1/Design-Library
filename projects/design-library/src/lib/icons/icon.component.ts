import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  Renderer2,
  viewChild,
} from "@angular/core";
import { Appearance } from "../shared/appearance";
import { IconRegistry, type IconData } from "./icon-registry";
/** Accessible SVG icon. Registered names or a direct icon definition; never inserts raw HTML. */
@Component({
  selector: "dl-icon",
  standalone: true,
  template: `<svg
    #svg
    [attr.viewBox]="viewBox()"
    [attr.width]="size()"
    [attr.height]="size()"
    [attr.fill]="fill()"
    [attr.stroke]="color()"
    [attr.stroke-width]="strokeWidth()"
    stroke-linecap="round"
    stroke-linejoin="round"
    [attr.role]="label() ? 'img' : null"
    [attr.aria-label]="label() || null"
    [attr.aria-hidden]="label() ? null : 'true'"
    focusable="false"
  ></svg>`,
  host: { "[style.transform]": "transform()", "[class.spin]": "spin()" },
  styles: [
    `
      :host {
        display: inline-flex;
        flex-shrink: 0;
        vertical-align: middle;
        color: var(--dl-ui-color, inherit);
        padding: var(--dl-ui-padding, 0);
        border-radius: var(--dl-ui-radius, 0);
      }
      svg {
        display: block;
      }
      .spin {
        animation: dl-icon-spin 1s linear infinite;
      }
      :host(.spin) {
        animation: dl-icon-spin 1s linear infinite;
      }
      @keyframes dl-icon-spin {
        to {
          transform: rotate(360deg);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        :host(.spin) {
          animation: none;
        }
      }
    `,
  ],
})
export class IconComponent extends Appearance {
  readonly name = input("circle-help");
  readonly data = input<IconData | null>(null);
  readonly size = input<string | number>(24);
  readonly strokeWidth = input(2);
  readonly color = input("currentColor");
  readonly fill = input("none");
  readonly label = input("");
  readonly rotation = input(0);
  readonly flip = input<"none" | "horizontal" | "vertical" | "both">("none");
  readonly spin = input(false);
  readonly fallback = input("circle-help");
  private readonly registry = inject(IconRegistry);
  private readonly renderer = inject(Renderer2);
  private readonly svg = viewChild<ElementRef<SVGSVGElement>>("svg");
  readonly definition = computed(
    () =>
      this.data() ??
      this.registry.get(this.name()) ??
      this.registry.get(this.fallback()),
  );
  readonly viewBox = computed(() => {
    const d = this.definition();
    return d
      ? `0 0 ${"size" in d ? d.size : d.width} ${"size" in d ? d.size : d.height}`
      : "0 0 24 24";
  });
  readonly transform = computed(
    () =>
      `rotate(${this.rotation()}deg) scale(${this.flip() === "horizontal" || this.flip() === "both" ? -1 : 1},${this.flip() === "vertical" || this.flip() === "both" ? -1 : 1})`,
  );
  constructor() {
    super();
    effect(() => {
      const svg = this.svg()?.nativeElement,
        d = this.definition();
      if (!svg) return;
      while (svg.firstChild) this.renderer.removeChild(svg, svg.firstChild);
      const add = (nodes: IconData["node"], parent: SVGElement) => {
        for (const [tag, attrs, children] of nodes) {
          if (
            ![
              "path",
              "circle",
              "ellipse",
              "line",
              "polyline",
              "polygon",
              "rect",
              "g",
            ].includes(tag)
          )
            continue;
          const node = this.renderer.createElement(tag, "svg");
          for (const [key, value] of Object.entries(attrs)) {
            if (
              /^(d|cx|cy|r|rx|ry|x|y|x1|x2|y1|y2|width|height|points|fill|fill-rule|clip-rule|stroke|stroke-width|stroke-linecap|stroke-linejoin|opacity|transform)$/.test(
                key,
              ) &&
              !/[<>]|url\s*\(/i.test(value)
            )
              this.renderer.setAttribute(node, key, value);
          }
          this.renderer.appendChild(parent, node);
          if (children) add(children, node);
        }
      };
      if (d) add(d.node, svg);
    });
  }
}
