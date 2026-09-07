import { useEffect, useRef } from "react";
import { setCustomElementProperties } from "../utils/customElement";

interface DocsButtonProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "tertiary" | "ghost" | "danger";
}

export function DocsButton({ children, className, disabled = false, onClick, size = "sm", variant = "tertiary" }: DocsButtonProps) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => { void setCustomElementProperties(ref.current, { disabled, size, variant }); }, [disabled, size, variant]);
  return <arc-button className={className} onClick={onClick} ref={ref}>{children}</arc-button>;
}
