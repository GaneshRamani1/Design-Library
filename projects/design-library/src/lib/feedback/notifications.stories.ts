import { action } from "storybook/actions";
import { STORY_OUTPUT_OBSERVERS } from "../../../../../.storybook/output-observers.generated";
import { Component, inject, signal, input } from "@angular/core";
import type { Meta, StoryObj } from "@storybook/angular";
import { applicationConfig } from "@storybook/angular";
import {
  NotificationService,
  type NotificationOptions,
  provideNotifications,
} from "./notification.service";
import { ButtonComponent } from "../button.component";
@Component({
  selector: "dl-notification-demo",
  standalone: true,
  imports: [...STORY_OUTPUT_OBSERVERS, ButtonComponent],
  template: `<div style="display:flex;gap:12px;flex-wrap:wrap">
      <button dlButton (click)="toast()">Show toast</button
      ><button dlButton variant="secondary" (click)="snackbar()">
        Show snackbar</button
      ><button dlButton variant="secondary" (click)="notifications.clear()">
        Clear notifications
      </button>
    </div>
    <p style="font:14px var(--dl-font);color:var(--dl-muted)">
      {{ result() }}
    </p>`,
})
class NotificationDemo {
  readonly options = input<NotificationOptions>({});
  readonly notifications = inject(NotificationService);
  readonly result = signal("Notifications never move your keyboard focus.");
  toast() {
    const ref = this.notifications.toast("Your workspace has been saved.", {
      heading: "All set",
      tone: "success",
      showProgress: true,
      ...this.options(),
    });
    ref.onAction.subscribe(() =>
      action("NotificationService.toast.onAction")({ id: ref.id }),
    );
    ref.afterDismissed.subscribe((reason) =>
      action("NotificationService.toast.afterDismissed")({
        id: ref.id,
        reason,
      }),
    );
  }
  snackbar() {
    const ref = this.notifications.snackbar("Conversation archived.", {
      actionLabel: "Undo",
      duration: 8000,
      ...this.options(),
    });
    ref.onAction.subscribe(() => {
      this.result.set("Archive undone");
      action("NotificationService.snackbar.onAction")({ id: ref.id });
    });
    ref.afterDismissed.subscribe((reason) => {
      action("NotificationService.snackbar.afterDismissed")({
        id: ref.id,
        reason,
      });
      if (reason !== "action") this.result.set("Dismissed: " + reason);
    });
  }
}
const meta: Meta<NotificationDemo> = {
  id: "feedback-notifications-service",
  title: "Feedback/Notifications service/Variations",
  component: NotificationDemo,
  parameters: { serviceApi: "NotificationService" },
  decorators: [
    applicationConfig({ providers: [provideNotifications({ maxVisible: 3 })] }),
  ],
};
export default meta;
type Story = StoryObj<NotificationDemo>;
export const Default: Story = {};

export const TopLeft: Story = {
  args: { options: { position: "top-left", duration: 0 } },
};
export const TopCenter: Story = {
  args: { options: { position: "top-center", duration: 0 } },
};
export const TopRight: Story = {
  args: { options: { position: "top-right", duration: 0 } },
};
export const BottomLeft: Story = {
  args: { options: { position: "bottom-left", duration: 0 } },
};
export const BottomCenter: Story = {
  args: { options: { position: "bottom-center", duration: 0 } },
};
export const BottomRight: Story = {
  args: { options: { position: "bottom-right", duration: 0 } },
};
export const ReplaceById: Story = {
  args: { options: { id: "workspace-save", duration: 0 } },
};
export const KeepAfterAction: Story = {
  args: { options: { closeOnAction: false, duration: 0 } },
};
export const CustomAppearance: Story = {
  args: {
    options: {
      tone: "custom",
      customBackground: "#251c32",
      customColor: "#e9d5ff",
      customBorder: "#a78bfa",
      appearance: { radius: "24px" },
      duration: 0,
    },
  },
};
