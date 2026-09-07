import type { DetailedHTMLProps, HTMLAttributes } from "react";

type ElementProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "arc-card": ElementProps & {
        heading?: string;
        description?: string;
        "heading-level"?: number;
        surface?: "glass" | "solid" | "transparent";
        "show-header"?: boolean;
        "show-footer"?: boolean;
      };
      "arc-code-block": ElementProps;
      "arc-button": ElementProps & {
        cardFooter?: boolean;
        variant?: "primary" | "secondary" | "tertiary" | "ghost" | "danger";
        size?: "sm" | "md" | "lg";
        disabled?: boolean;
        loading?: boolean;
        fullWidth?: boolean;
        loadingLabel?: string;
      };
      "arc-docs-toggle": ElementProps;
      "arc-docs-dropdown": ElementProps;
      "arc-docs-search": ElementProps;
      "arc-docs-segmented": ElementProps;
      "arc-docs-tabs": ElementProps;
    }
  }
}

export {};
