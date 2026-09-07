import {
  Component,
  TemplateRef,
  ViewContainerRef,
  inject,
} from "@angular/core";
import { action } from "storybook/actions";
import { PopoverRef, PopoverService } from "./popover.service";
import { ButtonComponent } from "../button.component";
import { STORY_OUTPUT_OBSERVERS } from "../../../../../.storybook/output-observers.generated";

@Component({
  selector: "dl-popover-service-demo",
  standalone: true,
  imports: [ButtonComponent, ...STORY_OUTPUT_OBSERVERS],
  template: `
    <div style="padding:100px 24px;display:flex;gap:16px;flex-wrap:wrap">
      <button dlButton (click)="show($any($event.currentTarget), details)">
        Open template from service
      </button>
      <button
        dlButton
        variant="secondary"
        (click)="
          show(
            $any($event.currentTarget),
            'This text was opened with PopoverService.open().'
          )
        "
      >
        Open text from service
      </button>
      <button dlButton variant="tertiary" (click)="service.closeAll()">
        Close all popovers
      </button>
    </div>
    <ng-template #details>
      <h3 style="margin:0 0 8px">Service popover</h3>
      <p>Template content keeps its Angular bindings.</p>
      <button dlButton (click)="ref?.close()">Done</button>
    </ng-template>
  `,
})
export class PopoverServiceDemo {
  readonly service = inject(PopoverService);
  private readonly view = inject(ViewContainerRef);
  ref?: PopoverRef;
  show(anchor: HTMLElement, content: string | TemplateRef<unknown>): void {
    this.ref = this.service.open(anchor, content, {
      placement: "bottom-start",
      ariaLabel: "Service details",
      viewContainerRef: this.view,
    });
    action("PopoverService.opened")({ placement: "bottom-start" });
    this.ref.afterClosed.subscribe((reason) =>
      action("PopoverService.afterClosed")(reason),
    );
  }
}
