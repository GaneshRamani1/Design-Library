import type { Meta, StoryObj } from "@storybook/angular";
import { argsToTemplate } from "@storybook/angular";
import { IconButtonComponent } from "./icon-button.component";

const meta: Meta<IconButtonComponent> = {
  id: "actions-icon-button",
  title: "Actions/Icon button/Variations",
  component: IconButtonComponent,
  tags: ["autodocs"],
  args: { label: "Add to favorites", icon: "heart", variant: "secondary" },
  render: (args) => ({
    props: args,
    template: `<button dlIconButton ${argsToTemplate(args)}></button>`,
  }),
};
export default meta;
type Story = StoryObj<IconButtonComponent>;
export const Default: Story = {};
