import type { Meta, StoryObj } from "@storybook/angular";
import { argsToTemplate } from "@storybook/angular";
import { FabButtonComponent } from "./fab-button.component";

const meta: Meta<FabButtonComponent> = {
  id: "actions-fab-button",
  title: "Actions/FAB button/Variations",
  component: FabButtonComponent,
  tags: ["autodocs"],
  args: { label: "Create workspace", icon: "plus" },
  render: (args) => ({
    props: args,
    template: `<button dlFab ${argsToTemplate(args)}></button>`,
  }),
};
export default meta;
type Story = StoryObj<FabButtonComponent>;
export const Default: Story = {};
export const Extended: Story = { args: { extended: true } };
export const Floating: Story = { args: { placement: "bottom-right" } };
