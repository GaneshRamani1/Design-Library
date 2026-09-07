import type { Meta, StoryObj } from "@storybook/angular";
import { argsToTemplate, moduleMetadata } from "@storybook/angular";
import { FormsModule } from "@angular/forms";
import { ContextSelectorComponent } from "./context-selector.component";
const meta: Meta<ContextSelectorComponent> = {
  id: "inputs-context-selector",
  title: "Inputs/Context selector/Variations",
  component: ContextSelectorComponent,
  tags: ["autodocs"],
  decorators: [moduleMetadata({ imports: [FormsModule] })],
  args: {
    id: "context-selector-example",
    label: "Environment",
    hint: "Choose what works for you.",
    error: "",
    disabled: false,
    required: false,
    stretch: false,
    size: "md",
    options: [
      { value: "development", label: "Development" },
      { value: "staging", label: "Staging" },
      { value: "production", label: "Production", disabled: true },
    ],
  },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    value: { table: { disable: true }, control: false },
  },
  render: (args, context) => ({
    props: {
      ...args,
      id: `${args.id}-${context.id}`,
      selection: "development",
    },
    template: `<div style="width:min(440px, 85vw);min-height:360px"><dl-context-selector ${argsToTemplate(args)} [(ngModel)]="selection" /><p style="font:12px var(--dl-font);color:var(--dl-muted);margin-top:24px">Form value: <output>{{ selection }}</output></p></div>`,
  }),
};
export default meta;
type Story = StoryObj<ContextSelectorComponent>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Invalid: Story = {
  args: { error: "Please review your selection." },
};
export const Large: Story = { args: { size: "lg", stretch: true } };
