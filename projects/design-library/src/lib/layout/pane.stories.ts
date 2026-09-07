import type { Meta, StoryObj } from "@storybook/angular";
import { argsToTemplate, moduleMetadata } from "@storybook/angular";
import { PaneComponent } from "./pane.component";

const meta: Meta<PaneComponent> = {
  id: "layout-pane",
  title: "Layout/Pane/Variations",
  component: PaneComponent,
  tags: ["autodocs"],
  decorators: [moduleMetadata({ imports: [] })],
  parameters: { layout: "padded" },
  args: {
    surface: "glass",
    overflow: "auto",
    size: "lg",
    stretch: true,
    layout: "flex",
    direction: "column",
    align: "stretch",
    justify: "flex-start",
    wrap: false,
    gap: 16,
    padding: 24,
    height: "auto",
    minHeight: 200,
  },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg", "xl", "full"] },
    layout: { control: "select", options: ["block", "flex"] },
    direction: { control: "inline-radio", options: ["row", "column"] },
    align: {
      control: "select",
      options: ["stretch", "flex-start", "center", "flex-end", "baseline"],
    },
    justify: {
      control: "select",
      options: [
        "flex-start",
        "center",
        "flex-end",
        "space-between",
        "space-around",
        "space-evenly",
      ],
    },
    height: { control: "text" },
    minHeight: { control: "text" },
    gap: { control: "text" },
    padding: { control: "text" },
  },
  render: (args) => ({
    props: args,
    template: `<dl-pane ${argsToTemplate(args)}><h2 style="margin:0;font-size:22px">A space for your next idea</h2><p style="margin:0;color:var(--dl-muted);line-height:1.6">Control width, stretch, direction, spacing and height from the toolbar below.</p></dl-pane>`,
  }),
};
export default meta;
type Story = StoryObj<PaneComponent>;
export const Default: Story = {};
export const FlexRow: Story = {
  args: {
    direction: "row",
    wrap: true,
    align: "center",
    justify: "space-between",
  },
};
export const Compact: Story = {
  args: { size: "sm", stretch: false, padding: 16 },
};
export const FixedHeight: Story = {
  args: { height: "320px", justify: "center" },
};
export const Solid: Story = { args: { surface: "solid" } };
