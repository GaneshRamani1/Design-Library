import type { Meta, StoryObj } from "@storybook/angular";
import { argsToTemplate, moduleMetadata } from "@storybook/angular";
import { FormsModule } from "@angular/forms";
import { RangeSelectorComponent } from "./range-selector.component";
const meta: Meta<RangeSelectorComponent> = {
  id: "inputs-range-selector",
  title: "Inputs/Range selector/Variations",
  component: RangeSelectorComponent,
  tags: ["autodocs"],
  decorators: [moduleMetadata({ imports: [FormsModule] })],
  args: {
    id: "range-selector-example",
    label: "Volume",
    hint: "Choose what works for you.",
    error: "",
    disabled: false,
    required: false,
    stretch: false,
    size: "md",
    min: 0,
    max: 100,
    step: 5,
    range: false,
    unit: "%",
  },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    value: { table: { disable: true }, control: false },
  },
  render: (args, context) => ({
    props: {
      ...args,
      id: `${args.id}-${context.id}`,
      selection: args.range ? [20, 80] : 40,
    },
    template: `<div style="width:min(440px, 85vw);min-height:360px"><dl-range-selector ${argsToTemplate(args)} [(ngModel)]="selection" /><p style="font:12px var(--dl-font);color:var(--dl-muted);margin-top:24px">Form value: <output>{{ selection }}</output></p></div>`,
  }),
};
export default meta;
type Story = StoryObj<RangeSelectorComponent>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Invalid: Story = {
  args: { error: "Please review your selection." },
};
export const Large: Story = { args: { size: "lg", stretch: true } };
export const Interval: Story = {
  args: { label: "Budget", range: true, min: 0, max: 100, step: 5, unit: "k" },
};
