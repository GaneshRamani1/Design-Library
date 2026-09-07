import { argsToTemplate, type Meta, type StoryObj } from "@storybook/angular";
import { GlobalNotificationComponent } from "./global-notification.component";
const meta: Meta<GlobalNotificationComponent> = {
  id: "feedback-global-notification",
  title: "Feedback/Global notification/Variations",
  component: GlobalNotificationComponent,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    live: "polite",
    dismissible: true,
    showIcon: true,
    heading: "Scheduled maintenance",
    message: "The workspace will be read-only tonight from 10 to 11 PM.",
    tone: "info",
    actionLabel: "View details",
  },
  render: (args) => ({
    props: args,
    template: `<dl-global-notification ${argsToTemplate(args)}/><main style="padding:32px;max-width:1120px;margin:auto"><h2>Your workspace</h2><p>Global messages keep everyone informed across the application.</p></main>`,
  }),
};
export default meta;
type Story = StoryObj<GlobalNotificationComponent>;
export const Default: Story = {};
export const FixedBottom: Story = {
  args: { position: "fixed", placement: "bottom" },
  parameters: {
    storyNote:
      "A persistent page-wide banner is pinned to the bottom of the viewport. Fixed banners overlay content; reserve space in your application shell if needed.",
  },
};
export const Sticky: Story = {
  args: { position: "sticky", offset: "0px" },
  parameters: {
    storyNote:
      "Scroll the example. The banner stays at the top after reaching it, then dismissal releases its space. Sticky placement is bounded by its scroll container.",
  },
  render: (args) => ({
    props: args,
    template: `<section style="height:360px;overflow:auto"><div style="padding:32px">Scroll down to the application announcement.</div><dl-global-notification ${argsToTemplate(args)}/><main style="height:800px;padding:32px"><h2>Application content</h2><p>Scroll to keep the banner in view.</p></main></section>`,
  }),
};
