import { Component } from "@angular/core";
import { IconComponent } from "../icons/icon.component";
import { NoticeBase, noticeTemplate, noticeStyles } from "./notice-base";
@Component({
  selector: "dl-snackbar",
  standalone: true,
  imports: [IconComponent],
  template: noticeTemplate,
  styles: [
    noticeStyles,
    `
      :host {
        width: 480px;
      }
      .notice {
        border-radius: var(--dl-ui-radius, 8px);
      }
    `,
  ],
})
export class SnackbarComponent extends NoticeBase {}
