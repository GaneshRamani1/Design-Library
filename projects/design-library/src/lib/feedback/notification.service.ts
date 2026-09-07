import {
  Component,
  DestroyRef,
  Injectable,
  InjectionToken,
  inject,
  signal,
  type Provider,
} from "@angular/core";
import { Overlay, type OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { Subject } from "rxjs";
import { ToastComponent } from "./toast.component";
import { SnackbarComponent } from "./snackbar.component";
import type { ComponentTone } from "../shared/tone";
import type { ComponentAppearance } from "../shared/appearance";
import type { NoticeDismissReason } from "./notice-base";
export type NotificationPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";
export interface NotificationOptions {
  id?: string;
  heading?: string;
  tone?: ComponentTone;
  size?: "sm" | "md" | "lg";
  variant?: "soft" | "outline" | "solid";
  customBackground?: string;
  customColor?: string;
  customBorder?: string;
  styleTokens?: Record<string, string>;
  position?: NotificationPosition;
  duration?: number;
  icon?: string;
  showIcon?: boolean;
  dismissible?: boolean;
  dismissLabel?: string;
  actionLabel?: string;
  closeOnAction?: boolean;
  pauseOnHover?: boolean;
  showProgress?: boolean;
  live?: "polite" | "assertive" | "off";
  appearance?: ComponentAppearance;
}
export interface NotificationDefaults {
  maxVisible: number;
  duration: number;
  position: NotificationPosition;
  gap: string;
  offset: string;
}
export const DL_NOTIFICATION_DEFAULTS = new InjectionToken<
  Partial<NotificationDefaults>
>("Arcwell notification defaults");
export function provideNotifications(
  defaults: Partial<NotificationDefaults>,
): Provider {
  return { provide: DL_NOTIFICATION_DEFAULTS, useValue: defaults };
}
export class NotificationRef {
  private readonly closeSubject = new Subject<
    NoticeDismissReason | "programmatic" | "overflow"
  >();
  private readonly actionSubject = new Subject<void>();
  readonly afterDismissed = this.closeSubject.asObservable();
  readonly onAction = this.actionSubject.asObservable();
  constructor(
    readonly id: string,
    private readonly dismissFn: () => void,
  ) {}
  dismiss(): void {
    this.dismissFn();
  }
  /** @internal */ finish(
    reason: NoticeDismissReason | "programmatic" | "overflow",
  ): void {
    this.closeSubject.next(reason);
    this.closeSubject.complete();
    this.actionSubject.complete();
  }
  /** @internal */ notifyAction(): void {
    this.actionSubject.next();
  }
}
interface Entry extends NotificationOptions {
  id: string;
  message: string;
  kind: "toast" | "snackbar";
  ref: NotificationRef;
  position: NotificationPosition;
  duration: number;
}
const POSITIONS: NotificationPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];
@Component({
  selector: "dl-notification-outlet",
  standalone: true,
  imports: [ToastComponent, SnackbarComponent],
  template: `@for (position of positions; track position) {
    <section
      class="stack"
      [attr.data-position]="position"
      [style.gap]="gap()"
      [style.--notice-offset]="offset()"
      [attr.aria-label]="'Notifications ' + position"
    >
      @for (item of items(); track item.id) {
        @if (item.position === position) {
          @if (item.kind === "toast") {
            <dl-toast
              [message]="item.message"
              [heading]="item.heading ?? ''"
              [tone]="item.tone ?? 'neutral'"
              [size]="item.size ?? 'md'"
              [variant]="item.variant ?? 'soft'"
              [customBackground]="
                item.customBackground ?? 'var(--dl-primary-soft)'
              "
              [customColor]="item.customColor ?? 'var(--dl-primary)'"
              [customBorder]="item.customBorder ?? 'var(--dl-primary)'"
              [styleTokens]="item.styleTokens ?? {}"
              [duration]="item.duration"
              [icon]="item.icon ?? ''"
              [showIcon]="item.showIcon ?? true"
              [dismissible]="item.dismissible ?? true"
              [dismissLabel]="item.dismissLabel ?? 'Dismiss notification'"
              [actionLabel]="item.actionLabel ?? ''"
              [closeOnAction]="item.closeOnAction ?? true"
              [pauseOnHover]="item.pauseOnHover ?? true"
              [showProgress]="item.showProgress ?? false"
              [live]="item.live ?? 'polite'"
              [appearance]="item.appearance ?? {}"
              (action)="item.ref.notifyAction()"
              (dismissed)="remove(item.id, $event)"
            />
          } @else {
            <dl-snackbar
              [message]="item.message"
              [heading]="item.heading ?? ''"
              [tone]="item.tone ?? 'neutral'"
              [size]="item.size ?? 'md'"
              [variant]="item.variant ?? 'soft'"
              [customBackground]="
                item.customBackground ?? 'var(--dl-primary-soft)'
              "
              [customColor]="item.customColor ?? 'var(--dl-primary)'"
              [customBorder]="item.customBorder ?? 'var(--dl-primary)'"
              [styleTokens]="item.styleTokens ?? {}"
              [duration]="item.duration"
              [icon]="item.icon ?? ''"
              [showIcon]="item.showIcon ?? true"
              [dismissible]="item.dismissible ?? true"
              [dismissLabel]="item.dismissLabel ?? 'Dismiss notification'"
              [actionLabel]="item.actionLabel ?? ''"
              [closeOnAction]="item.closeOnAction ?? true"
              [pauseOnHover]="item.pauseOnHover ?? true"
              [showProgress]="item.showProgress ?? false"
              [live]="item.live ?? 'polite'"
              [appearance]="item.appearance ?? {}"
              (action)="item.ref.notifyAction()"
              (dismissed)="remove(item.id, $event)"
            />
          }
        }
      }
    </section>
  }`,
  styles: [
    `
      :host {
        pointer-events: none;
      }
      .stack {
        position: fixed;
        display: flex;
        flex-direction: column;
        max-width: calc(100vw - 32px);
        max-height: calc(100dvh - 32px);
        overflow: auto;
      }
      .stack:empty {
        display: none;
      }
      .stack[data-position^="top"] {
        top: var(--notice-offset, 24px);
      }
      .stack[data-position^="bottom"] {
        bottom: var(--notice-offset, 24px);
      }
      .stack[data-position$="left"] {
        left: var(--notice-offset, 24px);
      }
      .stack[data-position$="right"] {
        right: var(--notice-offset, 24px);
      }
      .stack[data-position$="center"] {
        left: 50%;
        transform: translateX(-50%);
      }
      dl-toast,
      dl-snackbar {
        pointer-events: auto;
        flex-shrink: 0;
      }
    `,
  ],
})
class NotificationOutlet {
  readonly items = signal<Entry[]>([]);
  readonly gap = signal("12px");
  readonly offset = signal("24px");
  readonly positions = POSITIONS;
  remove: (id: string, reason: NoticeDismissReason) => void = () => {};
}
@Injectable({ providedIn: "root" })
export class NotificationService {
  private readonly overlay = inject(Overlay);
  private readonly defaults: NotificationDefaults = {
    maxVisible: 5,
    duration: 5000,
    position: "top-right",
    gap: "12px",
    offset: "24px",
    ...inject(DL_NOTIFICATION_DEFAULTS, { optional: true }),
  };
  private overlayRef: OverlayRef | null = null;
  private outlet: NotificationOutlet | null = null;
  private sequence = 0;
  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.clear();
      this.overlayRef?.dispose();
    });
  }
  toast(message: string, options: NotificationOptions = {}): NotificationRef {
    return this.add("toast", message, options);
  }
  snackbar(
    message: string,
    options: NotificationOptions = {},
  ): NotificationRef {
    return this.add("snackbar", message, {
      position: "bottom-center",
      ...options,
    });
  }
  dismiss(
    id: string,
    reason: NoticeDismissReason | "programmatic" | "overflow" = "programmatic",
  ): void {
    const item = this.outlet?.items().find((i) => i.id === id);
    if (!item) return;
    this.outlet!.items.update((items) => items.filter((i) => i.id !== id));
    item.ref.finish(reason);
  }
  clear(): void {
    for (const item of [...(this.outlet?.items() ?? [])]) this.dismiss(item.id);
  }
  private add(
    kind: "toast" | "snackbar",
    message: string,
    options: NotificationOptions,
  ): NotificationRef {
    if (!this.outlet) {
      this.overlayRef = this.overlay.create({
        positionStrategy: this.overlay.position().global().top("0").left("0"),
        panelClass: "dl-notification-overlay",
      });
      this.overlayRef.overlayElement.style.pointerEvents = "none";
      this.outlet = this.overlayRef.attach(
        new ComponentPortal(NotificationOutlet),
      ).instance;
      this.outlet.gap.set(this.defaults.gap);
      this.outlet.offset.set(this.defaults.offset);
      this.outlet.remove = (id, reason) => this.dismiss(id, reason);
    }
    const id = options.id ?? `dl-notice-${++this.sequence}`;
    this.dismiss(id);
    while (this.outlet.items().length >= Math.max(1, this.defaults.maxVisible))
      this.dismiss(this.outlet.items()[0].id, "overflow");
    const ref = new NotificationRef(id, () => this.dismiss(id));
    this.outlet.items.update((items) => [
      ...items,
      {
        ...options,
        id,
        kind,
        message,
        ref,
        position: options.position ?? this.defaults.position,
        duration: options.duration ?? this.defaults.duration,
      },
    ]);
    return ref;
  }
}
