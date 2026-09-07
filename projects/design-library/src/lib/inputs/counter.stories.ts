import type { Meta, StoryObj } from "@storybook/angular";
import { argsToTemplate, moduleMetadata } from "@storybook/angular";
import { FormsModule } from "@angular/forms";
import { CounterComponent } from "./counter.component";
const meta: Meta<CounterComponent> = {
  id: "inputs-counter",
  title: "Inputs/Counter/Variations",
  component: CounterComponent,
  tags: ["autodocs"],
  decorators: [moduleMetadata({ imports: [FormsModule] })],
  args: {
    id: "counter-example",
    label: "Quantity",
    size: "md",
    disabled: false,
    min: 0,
    max: 10,
    step: 1,
  },
  argTypes: {},
  render: (args, context) => ({
    props: { ...args, id: `${args.id}-${context.id}`, selection: 3 },
    template: `<dl-counter ${argsToTemplate(args)} [(ngModel)]="selection"/><p style="color:var(--dl-muted);font:12px var(--dl-font)">Form value: <output>{{selection}}</output></p>`,
  }),
};
export default meta;
type Story = StoryObj<CounterComponent>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
