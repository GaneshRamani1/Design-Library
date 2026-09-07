import { Directive, computed, input, output, signal } from "@angular/core";
import { Appearance } from "../shared/appearance";

/** Styled native anchor; preserves browser navigation and modified clicks. */
@Directive({
  selector: "a[dlLink]",
  standalone: true,
  host: {
    "[attr.href]": "disabled() ? null : href() || null",
    "[attr.target]": "target() || null",
    "[attr.rel]": "resolvedRel() || null",
    "[attr.download]": "download()",
    "[attr.aria-disabled]": "disabled() || null",
    "[attr.aria-label]": "ariaLabel() || null",
    "[attr.aria-current]": "current() === 'none' ? null : current()",
    "[attr.tabindex]": "disabled() ? -1 : tabIndex()",
    role: "link",
    "[style]": "linkStyles()",
    "(mouseenter)": "hovered.set(true)",
    "(mouseleave)": "hovered.set(false)",
    "(focus)": "focused.set(true)",
    "(blur)": "focused.set(false)",
    "(click)": "activate($event)",
    "(auxclick)": "blockDisabled($event)",
  },
})
export class LinkDirective extends Appearance {
  readonly href = input("");
  readonly target = input<"_self" | "_blank" | "_parent" | "_top">("_self");
  readonly rel = input("");
  readonly download = input<string | null>(null);
  readonly disabled = input(false);
  readonly ariaLabel = input("");
  readonly current = input<"none" | "page" | "step" | "location">("none");
  readonly tabIndex = input<number | null>(null);
  readonly size = input<"sm" | "md" | "lg">("md");
  readonly tone = input<"primary" | "neutral" | "danger" | "inherit">(
    "primary",
  );
  readonly underline = input<"always" | "hover" | "none">("hover");
  readonly fontWeight = input("500");
  readonly underlineOffset = input("3px");
  readonly activated = output<MouseEvent>();
  readonly hovered = signal(false);
  readonly focused = signal(false);
  readonly resolvedRel = computed(() => {
    const tokens = new Set(this.rel().split(/\s+/).filter(Boolean));
    if (this.target() === "_blank") tokens.add("noopener");
    return [...tokens].join(" ");
  });
  readonly linkStyles = computed(() => ({
    ...this.appearanceStyles(),
    display: "inline-flex",
    alignItems: "center",
    gap: "var(--dl-ui-gap, 6px)",
    color: `var(--dl-ui-color, ${{ primary: "var(--dl-primary)", neutral: "var(--dl-text)", danger: "var(--dl-danger-text)", inherit: "inherit" }[this.tone()]})`,
    fontFamily: "var(--dl-font, sans-serif)",
    fontSize: `var(--dl-ui-font-size, ${{ sm: "12px", md: "14px", lg: "16px" }[this.size()]})`,
    fontWeight: this.fontWeight(),
    lineHeight: "1.5",
    textDecoration:
      this.underline() === "always" ||
      (this.underline() === "hover" && (this.hovered() || this.focused()))
        ? "underline"
        : "none",
    textUnderlineOffset: this.underlineOffset(),
    padding: "var(--dl-ui-padding, 0)",
    borderRadius: "var(--dl-ui-radius, 3px)",
    border:
      "var(--dl-ui-border-width, 0) solid var(--dl-ui-border-color, transparent)",
    background: "var(--dl-ui-background, transparent)",
    boxShadow: "var(--dl-ui-shadow, none)",
    outline: this.focused()
      ? "2px solid var(--dl-ui-focus-color, var(--dl-focus))"
      : "none",
    outlineOffset: "3px",
    opacity: this.disabled() ? "0.5" : "1",
    cursor: this.disabled() ? "not-allowed" : "pointer",
  }));
  blockDisabled(event: MouseEvent): void {
    if (this.disabled()) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
  activate(event: MouseEvent): void {
    this.blockDisabled(event);
    if (!this.disabled()) this.activated.emit(event);
  }
}
