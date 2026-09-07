import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { DialogModule } from "@angular/cdk/dialog";
import { ButtonComponent } from "../button.component";
import { OverlayBase, overlayStyles, overlayTemplate } from "./overlay-base";
@Component({
  selector: "dl-bottom-sheet",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogModule, ButtonComponent],
  template: overlayTemplate,
  styles: [overlayStyles],
})
export class BottomSheetComponent extends OverlayBase {
  override readonly height = input<string | null>("90dvh");
  override readonly showDragHandle = input(true);
  protected override readonly defaultPlacement = "bottom" as const;
  protected override readonly dialogRole = "dialog" as const;
}
