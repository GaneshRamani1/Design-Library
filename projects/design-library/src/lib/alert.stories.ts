import type { Meta, StoryObj } from "@storybook/angular";
import { AlertComponent } from "./alert.component";
const meta: Meta<AlertComponent> = {
  title: "Components/Alert",
  component: AlertComponent,
  tags: ["autodocs"],
  args: { heading: "You’re all set", tone: "success" },
  argTypes: {
    tone: {
      control: "select",
      options: ["info", "success", "warning", "danger"],
    },
  },
  render: (args) => ({
    props: args,
    template:
      '<dl-alert [heading]="heading" [tone]="tone">Your changes have been saved successfully.</dl-alert>',
  }),
};
export default meta;
type Story = StoryObj<AlertComponent>;
export const Default: Story = {};
export const Danger: Story = {
  args: { heading: "Something needs attention", tone: "danger" },
};
