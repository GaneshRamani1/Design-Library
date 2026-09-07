import {
  DestroyRef,
  ElementRef,
  Injectable,
  TemplateRef,
  ViewContainerRef,
  inject,
} from "@angular/core";
import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { Subject } from "rxjs";
import { FloatingPanel } from "./floating-panel";
import type { AnchorPlacement } from "./anchored-overlay-base";
import { anchorPositions, trackAnchor } from "./anchor-position";

export interface PopoverConfig {
  placement?: AnchorPlacement;
  offset?: number;
  width?: string;
  maxWidth?: string;
  viewportMargin?: number;
  panelClass?: string | string[];
  ariaLabel?: string;
  id?: string;
  autoFocus?: boolean;
  restoreFocus?: boolean;
  closeOnEscape?: boolean;
  closeOnOutside?: boolean;
  /** Preserves the caller's injection context for template content. */
  viewContainerRef?: ViewContainerRef;
  /** CSS custom properties supported by the floating panel. */
  styles?: Record<string, string>;
}
export type PopoverCloseReason = "api" | "escape" | "outside" | "destroy";

/** Handle for one popover. Closing is idempotent; afterClosed emits once then completes. */
export class PopoverRef {
  private readonly closedSubject = new Subject<PopoverCloseReason>();
  readonly afterClosed = this.closedSubject.asObservable();
  private closed = false;
  constructor(
    private readonly overlay: OverlayRef,
    private readonly cleanup: (reason: PopoverCloseReason) => void,
  ) {}
  updatePosition(): void {
    if (!this.closed) this.overlay.updatePosition();
  }
  close(reason: PopoverCloseReason = "api"): void {
    if (this.closed) return;
    this.closed = true;
    this.cleanup(reason);
    this.overlay.dispose();
    this.closedSubject.next(reason);
    this.closedSubject.complete();
  }
}
let nextPopover = 0;
/** Opens nonmodal text or template content next to an explicit DOM anchor. */
@Injectable({ providedIn: "root" })
export class PopoverService {
  private readonly overlay = inject(Overlay);
  private readonly active = new Set<PopoverRef>();
  private readonly anchors = new Map<HTMLElement, PopoverRef>();
  constructor() {
    inject(DestroyRef).onDestroy(() => this.closeAll());
  }
  open(
    anchor: HTMLElement | ElementRef<HTMLElement>,
    content: string | TemplateRef<unknown>,
    config: PopoverConfig = {},
  ): PopoverRef {
    const element =
      anchor instanceof ElementRef ? anchor.nativeElement : anchor;
    if (
      !element ||
      typeof element.getBoundingClientRect !== "function" ||
      typeof element.closest !== "function"
    ) {
      throw new TypeError(
        "PopoverService.open requires an HTMLElement or ElementRef<HTMLElement> anchor. Use ViewChild with read: ElementRef for component hosts.",
      );
    }
    this.anchors.get(element)?.close("destroy");
    const margin = config.viewportMargin ?? 12;
    const overlay = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(element)
        .withPositions(
          anchorPositions(config.placement ?? "bottom", config.offset ?? 8),
        )
        .withFlexibleDimensions(false)
        .withPush(true)
        .withViewportMargin(margin),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      width: config.width,
      maxWidth: `min(${config.maxWidth ?? "320px"}, calc(100vw - ${margin * 2}px))`,
      panelClass: config.panelClass,
    });
    const panel = overlay.attach(
      new ComponentPortal(FloatingPanel, config.viewContainerRef),
    );
    const id = config.id ?? `dl-service-popover-${++nextPopover}`;
    panel.setInput("text", typeof content === "string" ? content : "");
    panel.setInput("template", typeof content === "string" ? null : content);
    panel.setInput("role", "dialog");
    panel.setInput("id", id);
    panel.setInput("label", config.ariaLabel ?? "Popover");
    panel.setInput("styles", config.styles ?? {});
    const theme = element.closest("[data-theme]")?.getAttribute("data-theme");
    if (theme) overlay.overlayElement.setAttribute("data-theme", theme);
    panel.changeDetectorRef.detectChanges();
    overlay.updatePosition();
    const stopTracking = trackAnchor(overlay, element);
    const original = ["aria-expanded", "aria-controls", "aria-haspopup"].map(
      (name) => [name, element.getAttribute(name)] as const,
    );
    element.setAttribute("aria-expanded", "true");
    element.setAttribute("aria-controls", id);
    element.setAttribute("aria-haspopup", "dialog");
    let unregisterOwner: (() => void) | undefined;
    let focusTimer: ReturnType<typeof setTimeout> | undefined;
    const ref = new PopoverRef(overlay, (reason) => {
      clearTimeout(focusTimer);
      stopTracking();
      this.active.delete(ref);
      this.anchors.delete(element);
      unregisterOwner?.();
      // Do not overwrite attributes belonging to a newer popover on this anchor.
      if (element.getAttribute("aria-controls") === id)
        for (const [name, value] of original) {
          if (value === null) element.removeAttribute(name);
          else element.setAttribute(name, value);
        }
      if (
        (config.restoreFocus ?? true) &&
        reason !== "outside" &&
        reason !== "destroy" &&
        element.isConnected
      )
        element.focus();
    });
    this.active.add(ref);
    this.anchors.set(element, ref);
    unregisterOwner = config.viewContainerRef?.injector
      .get(DestroyRef)
      .onDestroy(() => ref.close("destroy"));
    overlay.outsidePointerEvents().subscribe((event) => {
      if (
        (config.closeOnOutside ?? true) &&
        !element.contains(event.target as Node)
      )
        ref.close("outside");
    });
    overlay.keydownEvents().subscribe((event) => {
      if (event.key === "Escape" && (config.closeOnEscape ?? true)) {
        event.preventDefault();
        event.stopPropagation();
        ref.close("escape");
      }
    });
    if (config.autoFocus ?? true)
      focusTimer = setTimeout(() => {
        const target = overlay.overlayElement.querySelector<HTMLElement>(
          'button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href],[tabindex="0"]',
        );
        if (target) target.focus();
        else {
          overlay.overlayElement.tabIndex = -1;
          overlay.overlayElement.focus();
        }
      });
    return ref;
  }
  closeAll(): void {
    for (const ref of this.active) ref.close("destroy");
  }
}
