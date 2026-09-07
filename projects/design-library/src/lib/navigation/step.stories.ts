import type { Meta, StoryObj } from "@storybook/angular";
import { argsToTemplate, moduleMetadata } from "@storybook/angular";
import { ButtonComponent } from "../button.component";
import { StepComponent } from "./step.component";
import { StepperContainerComponent } from "./stepper-container.component";
const meta: Meta<StepComponent> = {
  id: "navigation-step",
  title: "Navigation/Step/Variations",
  component: StepComponent,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({
      imports: [StepComponent, StepperContainerComponent, ButtonComponent],
    }),
  ],
  parameters: { layout: "padded" },
  args: {
    value: "account",
    label: "Account",
    description: "Your details",
    completed: false,
  },
  argTypes: {},
  render: (args) => ({
    props: { ...args, complete: false, done: false },
    template: `<dl-stepper-container label="Setup steps" (finished)="done=true"><dl-step ${argsToTemplate(args)}><h3>Account details</h3><button dlButton variant="secondary" type="button" (click)="complete=true;completed=true">Mark account complete</button></dl-step><dl-step value="preferences" label="Preferences" [optional]="true"><h3>Choose your preferences</h3></dl-step><dl-step value="review" label="Review" [completed]="true"><h3>Ready to finish</h3></dl-step></dl-stepper-container><output>{{done?'Setup complete':''}}</output>`,
  }),
};
export default meta;
type Story = StoryObj<StepComponent>;
export const Default: Story = {};
