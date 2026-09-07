import type { Meta, StoryObj } from "@storybook/angular";
import { ProgressComponent } from "./progress.component";
const meta: Meta<ProgressComponent> = {
  id: "feedback-progress",
  title: "Feedback/Progress/Variations",
  component: ProgressComponent,
  tags: ["autodocs"],
  args: { label: "Project progress", value: 64 },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
  },
};
export default meta;
type Story = StoryObj<ProgressComponent>;
export const Default: Story = {};
export const Complete: Story = { args: { value: 100 } };
export const Empty: Story = { args: { value: 0 } };
