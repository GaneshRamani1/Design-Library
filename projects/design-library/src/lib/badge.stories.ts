import { argsToTemplate } from "@storybook/angular";
import type { Meta, StoryObj } from "@storybook/angular";
import { BadgeComponent } from "./badge.component";
const meta: Meta<BadgeComponent> = {
  id: "data-display-badge",
  title: "Data display/Badge/Variations",
  component: BadgeComponent,
  tags: ["autodocs"],
  args: { tone: "success" },
  argTypes: {
    tone: {
      control: "select",
      options: ["neutral", "success", "warning", "danger", "info", "custom"],
    },
  },
  render: (args) => ({
    props: args,
    template: `<dl-badge ${argsToTemplate(args)}>Published</dl-badge>`,
  }),
};
export default meta;
type Story = StoryObj<BadgeComponent>;
export const Default: Story = {};
export const Warning: Story = { args: { tone: "warning" } };

export const Neutral: Story = { args: { tone: "neutral" } };

export const Info: Story = { args: { tone: "info" } };

export const Success: Story = { args: { tone: "success" } };

export const Danger: Story = { args: { tone: "danger" } };

export const Custom: Story = { args: { tone: "custom" } };
