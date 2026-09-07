import type { Meta, StoryObj } from "@storybook/angular";
import { argsToTemplate } from "@storybook/angular";
import { ToastComponent } from "./toast.component";

const meta: Meta<ToastComponent> = {
  id: "feedback-toast",
  title: "Feedback/Toast/Variations",
  component: ToastComponent,
  tags: ["autodocs"],
  args: {
    message: "Your workspace is ready.",
    heading: "Saved successfully",
    tone: "success",
    duration: 0,
  },
  render: (args) => ({
    props: args,
    template: `<dl-toast ${argsToTemplate(args)}/>`,
  }),
};
export default meta;
type Story = StoryObj<ToastComponent>;
export const Default: Story = {};
export const Timed: Story = { args: { duration: 3000, showProgress: true } };
export const Persistent: Story = {
  args: { duration: 0, actionLabel: "View workspace" },
};
export const Error: Story = {
  args: {
    tone: "danger",
    heading: "Could not save",
    message: "Try again in a moment.",
    live: "assertive",
  },
};
