import { computed, Directive, input } from "@angular/core";
/** Fine-grained, per-instance styling. CSS lengths include their units. */
export interface ComponentAppearance {
  padding?: string;
  radius?: string;
  borderWidth?: string;
  borderColor?: string;
  background?: string;
  color?: string;
  fontSize?: string;
  gap?: string;
  shadow?: string;
  focusColor?: string;
}
@Directive({ host: { "[style]": "appearanceStyles()" } })
export abstract class Appearance {
  readonly appearance = input<ComponentAppearance>({});
  /** Any --dl-* token can be overridden without changing the global theme. */
  readonly styleTokens = input<Record<string, string>>({});
  protected readonly appearanceStyles = computed(() => {
    const styles: Record<string, string> = {};
    for (const [key, value] of Object.entries(this.styleTokens()))
      if (key.startsWith("--")) styles[key] = value;
    for (const [key, value] of Object.entries(this.appearance()))
      if (value !== undefined)
        styles[
          `--dl-ui-${key.replace(/[A-Z]/g, (letter) => "-" + letter.toLowerCase())}`
        ] = value;
    return styles;
  });
}
