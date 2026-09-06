import type { Meta, StoryObj } from "@storybook/angular";
import { BadgeComponent } from "./badge.component";
const meta: Meta<BadgeComponent> = {
  title: "Components/Badge",
  component: BadgeComponent,
  tags: ["autodocs"],
  args: { tone: "success" },
  argTypes: {
    tone: {
      control: "select",
      options: ["neutral", "success", "warning", "danger", "info"],
    },
  },
  render: (args) => ({
    props: args,
    template: '<dl-badge [tone]="tone">Published</dl-badge>',
  }),
};
export default meta;
type Story = StoryObj<BadgeComponent>;
export const Default: Story = {};
export const Warning: Story = { args: { tone: "warning" } };
