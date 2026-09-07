import { argsToTemplate } from "@storybook/angular";
import type { Meta, StoryObj } from "@storybook/angular";
import { CardComponent } from "./card.component";
const meta: Meta<CardComponent> = {
  id: "layout-card",
  title: "Layout/Card/Variations",
  component: CardComponent,
  tags: ["autodocs"],
  args: {
    heading: "A little structure. A lot of possibility.",
    description: "A flexible container for your next great idea.",
  },
  argTypes: {},
  render: (args) => ({
    props: args,
    template: `<dl-card ${argsToTemplate(args)}><p>Compose any content inside this card.</p><span cardFooter>Optional footer content.</span></dl-card>`,
  }),
};
export default meta;
type Story = StoryObj<CardComponent>;
export const Default: Story = {};
