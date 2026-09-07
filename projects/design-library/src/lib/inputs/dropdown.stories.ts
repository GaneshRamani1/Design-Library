import type { Meta, StoryObj } from "@storybook/angular";
import { argsToTemplate, moduleMetadata } from "@storybook/angular";
import { FormsModule } from "@angular/forms";
import { DropdownComponent } from "./dropdown.component";
const meta: Meta<DropdownComponent> = {
  id: "inputs-dropdown",
  title: "Inputs/Dropdown/Variations",
  component: DropdownComponent,
  tags: ["autodocs"],
  decorators: [moduleMetadata({ imports: [FormsModule] })],
  args: {
    placeholder: "Select an option",
    id: "dropdown-example",
    label: "Workspace",
    hint: "Choose what works for you.",
    error: "",
    disabled: false,
    required: false,
    stretch: false,
    size: "md",
    options: [
      { value: "design", label: "Design studio" },
      { value: "engineering", label: "Engineering" },
      { value: "archived", label: "Archived workspace", disabled: true },
    ],
  },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    value: { table: { disable: true }, control: false },
  },
  render: (args, context) => ({
    props: { ...args, id: `${args.id}-${context.id}`, selection: "design" },
    template: `<div style="width:min(440px, 85vw);min-height:360px"><dl-dropdown ${argsToTemplate(args)} [(ngModel)]="selection" /><p style="font:12px var(--dl-font);color:var(--dl-muted);margin-top:24px">Form value: <output>{{ selection }}</output></p></div>`,
  }),
};
export default meta;
type Story = StoryObj<DropdownComponent>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Invalid: Story = {
  args: { error: "Please review your selection." },
};
export const Large: Story = { args: { size: "lg", stretch: true } };
