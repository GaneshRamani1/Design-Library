import type { Meta, StoryObj } from "@storybook/angular";
import { AvatarComponent } from "./avatar.component";
const meta: Meta<AvatarComponent> = {
  title: "Components/Avatar",
  component: AvatarComponent,
  tags: ["autodocs"],
  args: { name: "Alex Morgan", size: "md" },
  argTypes: { size: { control: "inline-radio", options: ["sm", "md", "lg"] } },
};
export default meta;
type Story = StoryObj<AvatarComponent>;
export const Default: Story = {};
export const Large: Story = { args: { size: "lg" } };
