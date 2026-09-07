import type { Meta, StoryObj } from "@storybook/angular";
import { argsToTemplate, moduleMetadata } from "@storybook/angular";
import { FormsModule } from "@angular/forms";
import { CheckboxComponent } from "./checkbox.component";
const meta: Meta<CheckboxComponent> = {
  id: "inputs-checkbox",
  title: "Inputs/Checkbox/Variations",
  component: CheckboxComponent,
  tags: ["autodocs"],
  decorators: [moduleMetadata({ imports: [FormsModule] })],
  args: {
    id: "checkbox-example",
    label: "Email updates",
    size: "md",
    disabled: false,
    description: "Updates about your workspace",
    indeterminate: false,
  },
  argTypes: {},
  render: (args, context) => ({
    props: { ...args, id: `${args.id}-${context.id}`, selection: true },
    template: `<dl-checkbox ${argsToTemplate(args)} [(ngModel)]="selection"/><p style="color:var(--dl-muted);font:12px var(--dl-font)">Form value: <output>{{selection}}</output></p>`,
  }),
};
export default meta;
type Story = StoryObj<CheckboxComponent>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
