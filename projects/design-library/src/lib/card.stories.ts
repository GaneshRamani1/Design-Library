import { argsToTemplate } from "@storybook/angular";
import type { Meta, StoryObj } from "@storybook/angular";
import { CardComponent } from "./card.component";
const meta: Meta<CardComponent> = {
  id: "layout-card",
  title: "Layout/Card/Variations",
  component: CardComponent,
  tags: [],
  args: {
    heading: "A little structure. A lot of possibility.",
    description: "A flexible container for your next great idea.",
    showHeader: true,
    showFooter: false,
    headingLevel: 3,
    surface: "glass",
    appearance: {},
    styleTokens: {},
  },
  argTypes: {
    heading: { control: "text" },
    description: { control: "text" },
    showHeader: { control: "boolean" },
    showFooter: { control: "boolean" },
    headingLevel: { control: "select", options: [2, 3, 4] },
    surface: {
      control: "select",
      options: ["glass", "solid", "transparent"],
    },
    appearance: { control: "object" },
    styleTokens: { control: "object" },
  },
  render: (args) => ({
    props: args,
    template: `<dl-card ${argsToTemplate(args)}><p>Compose any content inside this card.</p><span cardFooter>Optional footer content.</span></dl-card>`,
  }),
};
export default meta;
type Story = StoryObj<CardComponent>;
export const Glass: Story = {
  args: { surface: "glass" },
  parameters: {
    storyNote:
      "The default glass surface adds translucency and blur while retaining the shared card structure.",
  },
};
export const Solid: Story = {
  args: { surface: "solid" },
  parameters: {
    storyNote:
      "The solid surface uses the theme surface token for content that needs a stronger visual boundary.",
  },
};
export const Transparent: Story = {
  args: { surface: "transparent" },
  parameters: {
    storyNote:
      "The transparent surface keeps the card's spacing and content structure without adding a background.",
  },
};
export const Default: Story = {};
