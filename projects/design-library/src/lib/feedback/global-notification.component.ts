import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { IconComponent } from "../icons/icon.component";
import { noticeTemplate, noticeStyles } from "./notice-base";
import { InlineNotificationComponent } from "./inline-notification.component";

/** Application-wide banner. Mount once in the application shell. */
@Component({
  selector: "dl-global-notification",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  host: {
    "[style.position]": "position()",
    "[style.top]":
      "position() !== 'static' && placement() === 'top' ? offset() : null",
    "[style.bottom]":
      "position() !== 'static' && placement() === 'bottom' ? offset() : null",
    "[style.inset-inline-start]": "position() === 'fixed' ? '0' : null",
    "[style.z-index]": "zIndex()",
    "[style.--notification-content-width]": "contentWidth()",
  },
  template: noticeTemplate,
  styles: [
    noticeStyles,
    `
      :host {
        width: 100%;
        min-width: 0;
      }
      .notice {
        border-radius: var(--dl-ui-radius, 0);
        box-shadow: var(--dl-ui-shadow, none);
        padding-inline: var(
          --dl-ui-padding,
          max(
            20px,
            calc((100% - var(--notification-content-width, 1120px)) / 2)
          )
        );
      }
      :host([data-layout="stacked"]) .notice {
        flex-wrap: wrap;
      }
      :host([data-layout="stacked"]) .copy {
        flex-basis: calc(100% - 40px);
      }
      .action {
        white-space: normal;
        overflow-wrap: anywhere;
        max-width: 100%;
      }
      @media (max-width: 480px) {
        .notice {
          flex-wrap: wrap;
        }
        .copy {
          flex-basis: calc(100% - 40px);
        }
      }
    `,
  ],
})
export class GlobalNotificationComponent extends InlineNotificationComponent {
  readonly position = input<"static" | "sticky" | "fixed">("static");
  readonly placement = input<"top" | "bottom">("top");
  readonly offset = input("0px");
  readonly zIndex = input(100);
  readonly contentWidth = input("1120px");
}
