import { computed, Directive, input } from "@angular/core";
import { Appearance } from "./appearance";
export type ComponentTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "custom";
@Directive({
  host: {
    "[attr.data-tone]": "tone()",
    "[attr.data-size]": "size()",
    "[style.--tone-bg]": "toneBackground()",
    "[style.--tone-text]": "toneText()",
    "[style.--tone-border]": "toneBorder()",
  },
})
export abstract class ToneAppearance extends Appearance {
  readonly tone = input<ComponentTone>("neutral");
  readonly size = input<"sm" | "md" | "lg">("md");
  readonly variant = input<"soft" | "outline" | "solid">("soft");
  readonly customBackground = input("var(--dl-primary-soft)");
  readonly customColor = input("var(--dl-primary)");
  readonly customBorder = input("var(--dl-primary)");
  private readonly bg = computed(() =>
    this.tone() === "custom"
      ? this.customBackground()
      : `var(--dl-${this.tone()}-bg)`,
  );
  private readonly fg = computed(() =>
    this.tone() === "custom"
      ? this.customColor()
      : `var(--dl-${this.tone()}-text)`,
  );
  readonly toneBackground = computed(() =>
    this.variant() === "outline"
      ? "transparent"
      : this.variant() === "solid"
        ? this.fg()
        : this.bg(),
  );
  readonly toneText = computed(() =>
    this.variant() === "solid" ? this.bg() : this.fg(),
  );
  readonly toneBorder = computed(() =>
    this.tone() === "custom"
      ? this.customBorder()
      : this.tone() === "neutral"
        ? "var(--dl-border)"
        : `var(--dl-${this.tone()}-border)`,
  );
}
