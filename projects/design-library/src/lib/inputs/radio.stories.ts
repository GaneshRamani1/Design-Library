import type { Meta, StoryObj } from "@storybook/angular";
import { argsToTemplate, moduleMetadata } from "@storybook/angular";
import { FormsModule } from "@angular/forms";
import { RadioComponent } from "./radio.component";
const meta: Meta<RadioComponent> = {
  id: "inputs-radio",
  title: "Inputs/Radio/Variations",
  component: RadioComponent,
  tags: ["autodocs"],
  decorators: [moduleMetadata({ imports: [FormsModule] })],
  args: {
    orientation: "vertical",
    id: "radio-example",
    label: "Billing plan",
    hint: "Choose what works for you.",
    error: "",
    disabled: false,
    required: false,
    stretch: false,
    size: "md",
    options: [
      {
        value: "personal",
        label: "Personal",
        description: "For your own projects",
      },
      {
        value: "team",
        label: "Team",
        description: "A shared space to collaborate",
      },
      { value: "enterprise", label: "Enterprise", disabled: true },
    ],
  },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    value: { table: { disable: true }, control: false },
  },
  render: (args, context) => ({
    props: { ...args, id: `${args.id}-${context.id}`, selection: "team" },
    template: `<div style="width:min(440px, 85vw);min-height:360px"><dl-radio ${argsToTemplate(args)} [(ngModel)]="selection" /><p style="font:12px var(--dl-font);color:var(--dl-muted);margin-top:24px">Form value: <output>{{ selection }}</output></p></div>`,
  }),
};
export default meta;
type Story = StoryObj<RadioComponent>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Invalid: Story = {
  args: { error: "Please review your selection." },
};
export const Large: Story = { args: { size: "lg", stretch: true } };
export const Horizontal: Story = {
  args: { orientation: "horizontal", stretch: true },
};
