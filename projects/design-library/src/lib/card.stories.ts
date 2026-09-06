import type { Meta, StoryObj } from "@storybook/angular";
import { CardComponent } from "./card.component";
const meta: Meta<CardComponent> = {
  title: "Components/Card",
  component: CardComponent,
  tags: ["autodocs"],
  args: {
    heading: "A little structure. A lot of possibility.",
    description: "A flexible container for your next great idea.",
  },
  argTypes: {},
  render: (args) => ({
    props: args,
    template:
      '<dl-card [heading]="heading" [description]="description"><p style="font-size:14px">Compose any content inside this card.</p></dl-card>',
  }),
};
export default meta;
type Story = StoryObj<CardComponent>;
export const Default: Story = {};
