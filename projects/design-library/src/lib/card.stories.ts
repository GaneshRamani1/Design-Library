import { argsToTemplate, moduleMetadata } from "@storybook/angular";
import type { Meta, StoryObj } from "@storybook/angular";
import { CardComponent } from "./card.component";
import { ButtonComponent } from "./button.component";
import { CodeBlockComponent } from "./data-display/code-block.component";
const meta: Meta<CardComponent> = {
  id: "layout-card",
  title: "Layout/Card/Variations",
  component: CardComponent,
  tags: [],
  decorators: [
    moduleMetadata({ imports: [ButtonComponent, CodeBlockComponent] }),
  ],
  args: {
    heading: "A little structure. A lot of possibility.",
    description: "A flexible container for your next great idea.",
    showHeader: true,
    showFooter: false,
    headingLevel: 3,
    surface: "glass",
    layout: "default",
    splitLeftWidth: "1fr",
    splitRightWidth: "1fr",
    splitGap: "0px",
    splitPadding: "24px",
    splitDivider: true,
    splitPlacement: "left",
    splitAlign: "stretch",
    splitStackAt: "md",
    railWidth: "260px",
    railPlacement: "left",
    railCollapsible: false,
    railInitiallyOpen: true,
    stickyRail: false,
    previewMinHeight: "240px",
    previewMaxHeight: "none",
    previewScrollable: false,
    showGuidance: true,
    showCode: true,
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
    layout: { control: "select", options: ["default", "showcase", "split"] },
    appearance: { control: "object" },
    styleTokens: { control: "object" },
  },
  render: (args) => ({
    props: {
      ...args,
      codeSample: '<button dlButton variant="primary">Continue</button>',
    },
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
export const Showcase: Story = {
  args: { layout: "showcase", showHeader: false },
  render: (args) => ({
    props: args,
    template: `<dl-card ${argsToTemplate(args)}>
      <div cardRail>
        <strong style="display:block;margin-bottom:8px">variant</strong>
        <p style="margin:0 0 18px">Choose the hierarchy that fits the action.</p>
        <div style="display:grid;gap:8px">
          <button dlButton variant="secondary" fullWidth>Primary</button>
          <button dlButton variant="tertiary" fullWidth>Secondary</button>
          <button dlButton variant="tertiary" fullWidth>Tertiary</button>
        </div>
      </div>
      <div cardPreview><button dlButton>Continue</button></div>
      <div cardGuidance><small>WHEN TO USE PRIMARY</small><p>Use once per region for the action most likely to move the task forward.</p></div>
      <dl-code-block cardCode language="Angular" [code]="codeSample" />
      <span cardFooter>Optional footer content.</span>
    </dl-card>`,
  }),
  parameters: {
    storyNote:
      "The showcase layout composes a configuration rail, live preview, usage guidance, and copyable code. It collapses into one column on mobile.",
  },
};
export const ShowcaseRightRail: Story = {
  ...Showcase,
  args: {
    ...Showcase.args,
    railPlacement: "right",
    railCollapsible: true,
    stickyRail: true,
  },
};
export const ShowcaseScrollablePreview: Story = {
  ...Showcase,
  args: {
    ...Showcase.args,
    previewScrollable: true,
    previewMaxHeight: "320px",
  },
};
export const TwoColumn: Story = {
  args: {
    layout: "split",
    showHeader: false,
    splitLeftWidth: "34%",
    splitRightWidth: "1fr",
    splitDivider: true,
  },
  render: (args) => ({
    props: args,
    template: `<dl-card ${argsToTemplate(args)}>
      <div cardLeft><strong style="color:var(--dl-primary)">heading</strong><p style="margin-top:8px">Change the value to update this example.</p></div>
      <div cardRight><small>WHAT THIS VALUE CHANGES</small><p style="margin:10px 0 24px">Customizes the component heading and keeps guidance beside the preview.</p><div style="min-height:180px;display:grid;place-items:center;background:linear-gradient(var(--dl-border) 1px,transparent 1px),linear-gradient(90deg,var(--dl-border) 1px,transparent 1px);background-size:24px 24px"><button dlButton>Preview action</button></div><dl-code-block style="margin-top:20px" language="Angular" [code]="codeSample" /></div>
    </dl-card>`,
  }),
  parameters: {
    layout: "fullscreen",
    storyNote:
      "Projects independent left and right regions into a configurable two-column card. The columns stack at the selected container breakpoint.",
  },
};
export const TwoColumnRightLabel: Story = {
  ...TwoColumn,
  args: { ...TwoColumn.args, splitPlacement: "right", splitLeftWidth: "280px" },
};
export const TwoColumnWithGap: Story = {
  ...TwoColumn,
  args: {
    ...TwoColumn.args,
    splitGap: "24px",
    splitPadding: "20px",
    splitDivider: false,
  },
};
