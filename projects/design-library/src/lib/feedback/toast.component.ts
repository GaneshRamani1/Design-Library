import { Component } from "@angular/core";
import { IconComponent } from "../icons/icon.component";
import { NoticeBase, noticeTemplate, noticeStyles } from "./notice-base";
@Component({
  selector: "dl-toast",
  standalone: true,
  imports: [IconComponent],
  template: noticeTemplate,
  styles: [noticeStyles],
})
export class ToastComponent extends NoticeBase {}
