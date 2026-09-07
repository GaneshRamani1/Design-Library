import type { Meta, StoryObj } from "@storybook/angular";
import { argsToTemplate } from "@storybook/angular";
import { DividerComponent } from "./divider.component";

const meta: Meta<DividerComponent> = {
  id: "layout-divider",
  title: "Layout/Divider/Variations",
  component: DividerComponent,
  tags: ["autodocs"],
  args: { label: "or" },
  render: (args) => ({
    props: args,
    template: `<div style="width:360px;max-width:90vw;min-height:100px;display:flex;align-items:center"><dl-divider ${argsToTemplate(args)}/></div>`,
  }),
};
export default meta;
type Story = StoryObj<DividerComponent>;
export const Default: Story = {};
