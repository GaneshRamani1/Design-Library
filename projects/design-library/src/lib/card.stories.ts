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
  decorators: [moduleMetadata({ imports: [ButtonComponent, CodeBlockComponent] })],
  args: {
    heading: "A little structure. A lot of possibility.",
    description: "A flexible container for your next great idea.",
    showHeader: true,
    showFooter: false,
    headingLevel: 3,
    surface: "glass",
    layout: "default",
    railWidth: "260px",
    previewMinHeight: "240px",
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
    layout: { control: "select", options: ["default", "showcase"] },
    appearance: { control: "object" },
    styleTokens: { control: "object" },
  },
  render: (args) => ({
    props: { ...args, codeSample: '<button dlButton variant="primary">Continue</button>' },
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
  parameters: { storyNote: "The showcase layout composes a configuration rail, live preview, usage guidance, and copyable code. It collapses into one column on mobile." },
};
