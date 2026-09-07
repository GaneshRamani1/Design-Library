import type { Meta, StoryObj } from "@storybook/angular";
import { argsToTemplate, moduleMetadata } from "@storybook/angular";
import { ContainerComponent } from "./container.component";
import { PaneComponent } from "./pane.component";
const meta: Meta<ContainerComponent> = {
  id: "layout-container",
  title: "Layout/Container/Variations",
  component: ContainerComponent,
  tags: ["autodocs"],
  decorators: [moduleMetadata({ imports: [PaneComponent] })],
  parameters: { layout: "padded" },
  args: {
    variant: "tertiary",
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
    template: `<dl-container ${argsToTemplate(args)}><dl-pane [padding]="24" [minHeight]="120"><strong>Overview</strong><span style="color:var(--dl-muted)">Your main content belongs here.</span></dl-pane><dl-pane [padding]="24" [minHeight]="120"><strong>Details</strong><span style="color:var(--dl-muted)">A flexible companion pane.</span></dl-pane></dl-container>`,
  }),
};
export default meta;
type Story = StoryObj<ContainerComponent>;
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

export const Primary: Story = {
  args: { variant: "primary" },
  parameters: {
    storyNote:
      "A prominent glass container with themed border, rounded corners and elevation. Appearance overrides still take precedence.",
  },
};
export const Secondary: Story = {
  args: { variant: "secondary" },
  parameters: {
    storyNote:
      "A solid, outlined container for supporting content. Sizing, flex layout and appearance remain independently configurable.",
  },
};
export const Tertiary: Story = {
  args: { variant: "tertiary" },
  parameters: {
    storyNote:
      "A transparent container for layout and grouping with minimal visual emphasis. This remains the default.",
  },
};
export const Variants: Story = {
  render: () => ({
    props: { variants: ["primary", "secondary", "tertiary"] },
    template: `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(240px,100%),1fr));gap:24px;width:100%">@for(v of variants;track v){<dl-container [variant]="v" [padding]="24" [minHeight]="180"><h3 style="margin:0;text-transform:capitalize">{{v}}</h3><p style="margin:0;line-height:1.6">A responsive content container with configurable padding, gap, size and appearance.</p></dl-container>}</div>`,
  }),
  parameters: {
    storyNote:
      "Compare primary glass, secondary solid/outlined and tertiary transparent containers. Resize the preview to see them stack on narrow screens.",
  },
};
