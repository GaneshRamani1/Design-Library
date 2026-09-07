import {
  argsToTemplate,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from "@storybook/angular";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { CounterButtonComponent } from "./counter-button.component";
const meta: Meta<CounterButtonComponent> = {
  id: "inputs-counter-button",
  title: "Inputs/Counter button/Variations",
  component: CounterButtonComponent,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({ imports: [CounterButtonComponent, ReactiveFormsModule] }),
  ],
  args: {
    id: "counter-button-demo",
    label: "Quantity",
    min: 0,
    max: 10,
    step: 1,
    precision: 0,
    locale: "en-US",
    prefix: "",
    suffix: "",
    readOnly: false,
    orientation: "horizontal",
    incrementLabel: "Increase",
    decrementLabel: "Decrease",
    incrementIcon: "+",
    decrementIcon: "−",
    disabled: false,
    size: "md",
    stretch: false,
  },
  render: (args) => ({
    props: { ...args, control: new FormControl(2) },
    template: `<dl-counter-button ${argsToTemplate(args)} [formControl]="control"/><p>Numeric model: <output>{{control.value}}</output></p>`,
  }),
};
export default meta;
type Story = StoryObj<CounterButtonComponent>;
export const Default: Story = {
  parameters: {
    storyNote:
      "A compact minus/value/plus quantity control. Use the buttons or focus the value and press arrow keys, Home or End. Value changes and increment/decrement outputs are logged in Actions.",
  },
};
export const DecimalSteps: Story = {
  args: { step: 0.25, precision: 2, suffix: " kg", label: "Weight" },
  parameters: {
    storyNote:
      "Quarter-unit steps with two-decimal precision avoid floating-point display artifacts. Bounds disable the corresponding button.",
  },
};
export const Vertical: Story = {
  args: { orientation: "vertical" },
  parameters: {
    storyNote:
      "The same counter stacks vertically, with its value remaining keyboard accessible.",
  },
};
export const ReadOnly: Story = {
  args: { readOnly: true },
  parameters: {
    storyNote:
      "Read-only counters preserve their value and accessible spinbutton information, while preventing changes.",
  },
};
export const Disabled: Story = { args: { disabled: true } };
