import { argsToTemplate, type Meta, type StoryObj } from "@storybook/angular";
import { InlineNotificationComponent } from "./inline-notification.component";
const meta: Meta<InlineNotificationComponent> = {
  id: "feedback-inline-notification",
  title: "Feedback/Inline notification/Variations",
  component: InlineNotificationComponent,
  tags: ["autodocs"],
  args: {
    live: "polite",
    dismissible: true,
    showIcon: true,
    heading: "Check your billing details",
    message:
      "Your saved card expires this month. Update it before your next renewal.",
    tone: "warning",
    actionLabel: "Update card",
  },
  render: (args) => ({
    props: args,
    template: `<section style="width:680px;max-width:100%"><dl-inline-notification ${argsToTemplate(args)}/></section>`,
  }),
};
export default meta;
type Story = StoryObj<InlineNotificationComponent>;
export const Default: Story = {};
export const InContext: Story = {
  parameters: {
    storyNote:
      "Contextual feedback stays beside the setting it describes. The action keeps this message visible; dismissing removes it from the document flow.",
  },
  render: (args) => ({
    props: args,
    template: `<section style="width:680px;max-width:100%"><h2>Billing settings</h2><p>Manage your payment method and invoices.</p><dl-inline-notification ${argsToTemplate(args)}/><p>Next renewal: October 1</p></section>`,
  }),
};
export const ProjectedContent: Story = {
  parameters: {
    storyNote:
      "Add rich supporting content through content projection. The message, heading, action and dismiss controls remain configurable.",
  },
  render: (args) => ({
    props: args,
    template: `<dl-inline-notification ${argsToTemplate(args)}><a href="#billing" style="color:inherit">Read the billing guide</a></dl-inline-notification>`,
  }),
};
export const Timed: Story = {
  args: { duration: 5000, showProgress: true },
  parameters: {
    storyNote:
      "This optional timer dismisses the notification after five seconds. Hovering or focusing an action pauses the countdown.",
  },
};
