import type { Meta, StoryObj } from "@storybook/angular";
import { argsToTemplate, moduleMetadata } from "@storybook/angular";
import { SectionComponent } from "./section.component";
import { PaneComponent } from "./pane.component";
const meta: Meta<SectionComponent> = {
  id: "layout-section",
  title: "Layout/Section/Variations",
  component: SectionComponent,
  tags: ["autodocs"],
  decorators: [moduleMetadata({ imports: [PaneComponent] })],
  parameters: { layout: "padded" },
  args: {
    label: "Content section",
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
    template: `<dl-section ${argsToTemplate(args)}><dl-pane [padding]="24" [minHeight]="120"><strong>Overview</strong><span style="color:var(--dl-muted)">Your main content belongs here.</span></dl-pane><dl-pane [padding]="24" [minHeight]="120"><strong>Details</strong><span style="color:var(--dl-muted)">A flexible companion pane.</span></dl-pane></dl-section>`,
  }),
};
export default meta;
type Story = StoryObj<SectionComponent>;
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
