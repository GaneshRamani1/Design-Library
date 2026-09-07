import { ChangeDetectionStrategy, Component } from "@angular/core";
import { DialogModule } from "@angular/cdk/dialog";
import { ButtonComponent } from "../button.component";
import { OverlayBase, overlayStyles, overlayTemplate } from "./overlay-base";
@Component({
  selector: "dl-confirmation-dialog",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogModule, ButtonComponent],
  template: overlayTemplate,
  styles: [overlayStyles],
})
export class ConfirmationDialogComponent extends OverlayBase {
  protected override readonly defaultPlacement = "center" as const;
  protected override readonly dialogRole = "alertdialog" as const;
}
