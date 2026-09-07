import type { OverlayRef, ConnectedPosition } from "@angular/cdk/overlay";
import type { AnchorPlacement } from "./anchored-overlay-base";

export function anchorPositions(
  placement: AnchorPlacement,
  offset: number,
): ConnectedPosition[] {
  const position = (p: string): ConnectedPosition => {
    const [side, align] = p.split("-");
    if (side === "left" || side === "right")
      return {
        originX: side === "left" ? "start" : "end",
        originY: "center",
        overlayX: side === "left" ? "end" : "start",
        overlayY: "center",
        offsetX: offset * (side === "left" ? -1 : 1),
      };
    const x = align === "start" ? "start" : align === "end" ? "end" : "center";
    return {
      originX: x,
      overlayX: x,
      originY: side === "top" ? "top" : "bottom",
      overlayY: side === "top" ? "bottom" : "top",
      offsetY: offset * (side === "top" ? -1 : 1),
    };
  };
  const opposite = {
    top: "bottom",
    bottom: "top",
    left: "right",
    right: "left",
  };
  const [side, align] = placement.split("-");
  return [
    position(placement),
    position(
      opposite[side as keyof typeof opposite] + (align ? `-${align}` : ""),
    ),
  ];
}

/** Track ordinary scrolling containers as well as CDK scrollables and resized content. */
export function trackAnchor(ref: OverlayRef, anchor: HTMLElement): () => void {
  const doc = anchor.ownerDocument;
  const win = doc.defaultView;
  const update = () => ref.updatePosition();
  doc.addEventListener("scroll", update, true);
  win?.addEventListener("resize", update);
  win?.visualViewport?.addEventListener("resize", update);
  win?.visualViewport?.addEventListener("scroll", update);
  const observer =
    typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
  observer?.observe(anchor);
  observer?.observe(ref.overlayElement);
  return () => {
    observer?.disconnect();
    doc.removeEventListener("scroll", update, true);
    win?.removeEventListener("resize", update);
    win?.visualViewport?.removeEventListener("resize", update);
    win?.visualViewport?.removeEventListener("scroll", update);
  };
}
