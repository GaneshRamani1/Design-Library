import type { Meta, StoryObj } from "@storybook/angular";
import { argsToTemplate } from "@storybook/angular";
import { SnackbarComponent } from "./snackbar.component";

const meta: Meta<SnackbarComponent> = {
  id: "feedback-snackbar",
  title: "Feedback/Snackbar/Variations",
  component: SnackbarComponent,
  tags: ["autodocs"],
  args: { message: "Conversation archived.", actionLabel: "Undo", duration: 0 },
  render: (args) => ({
    props: args,
    template: `<dl-snackbar ${argsToTemplate(args)}/>`,
  }),
};
export default meta;
type Story = StoryObj<SnackbarComponent>;
export const Default: Story = {};
export const Timed: Story = { args: { duration: 4000, showProgress: true } };
export const Persistent: Story = { args: { duration: 0 } };
export const RecoveryActions: Story = {
  args: { message: "Draft deleted.", secondaryActionLabel: "Undo", actionLabel: "Dismiss", duration: 0 },
  parameters: { storyNote: "Primary and secondary recovery actions emit separate outputs and independently control dismissal." },
};
