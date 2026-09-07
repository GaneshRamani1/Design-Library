import type { Meta, StoryObj } from "@storybook/angular";
import { AvatarComponent } from "./avatar.component";
const meta: Meta<AvatarComponent> = {
  id: "data-display-avatar",
  title: "Data display/Avatar/Variations",
  component: AvatarComponent,
  tags: ["autodocs"],
  args: { name: "Alex Morgan", size: "md" },
  argTypes: { size: { control: "inline-radio", options: ["sm", "md", "lg"] } },
};
export default meta;
type Story = StoryObj<AvatarComponent>;
export const Default: Story = {};
export const Large: Story = { args: { size: "lg" } };
export const GroupWithOverflow: Story = {
  parameters: { storyNote: "Avatars overlap by group index and the final avatar announces the hidden member count." },
  render: () => ({
    template: `<div style="display:flex;align-items:center;padding-inline-start:10px"><dl-avatar name="Alex Morgan" [groupIndex]="0"/><dl-avatar name="Sam Lee" [groupIndex]="1" status="online"/><dl-avatar name="Priya Shah" [groupIndex]="2"/><dl-avatar name="More team members" [groupIndex]="3" [excessCount]="8" [interactive]="true"/></div>`,
  }),
};
