import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { DialogModule } from "@angular/cdk/dialog";
import { ButtonComponent } from "../button.component";
import { OverlayBase, overlayStyles, overlayTemplate } from "./overlay-base";
@Component({
  selector: "dl-sidepanel",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogModule, ButtonComponent],
  template: overlayTemplate,
  styles: [overlayStyles],
})
export class SidepanelComponent extends OverlayBase {
  override readonly fullScreenOnMobile = input(true);
  protected override readonly defaultPlacement = "right" as const;
  protected override readonly dialogRole = "dialog" as const;
}
