import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { IconComponent } from "../icons/icon.component";
import { NoticeBase, noticeTemplate, noticeStyles } from "./notice-base";

/** Persistent contextual feedback in the document flow. */
@Component({
  selector: "dl-inline-notification",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  host: {
    "[style.display]": "visible() ? null : 'none'",
    "[style.width]": "width()",
    "[style.max-width]": "maxWidth()",
    "[attr.data-layout]": "layout()",
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
        box-shadow: var(--dl-ui-shadow, none);
        align-items: flex-start;
      }
      :host([data-layout="stacked"]) .notice {
        flex-wrap: wrap;
      }
      :host([data-layout="stacked"]) .copy {
        flex-basis: calc(100% - 40px);
      }
      :host([data-layout="stacked"]) .action {
        margin-inline-start: 28px;
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
export class InlineNotificationComponent extends NoticeBase {
  override readonly duration = input(0);
  override readonly closeOnAction = input(false);
  readonly width = input("100%");
  readonly maxWidth = input("100%");
  readonly layout = input<"inline" | "stacked">("inline");
}
