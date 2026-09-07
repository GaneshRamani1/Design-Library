import type { Meta, StoryObj } from "@storybook/angular";
import { argsToTemplate, moduleMetadata } from "@storybook/angular";
import { ButtonComponent } from "../button.component";
import { StepComponent } from "./step.component";
import { StepperContainerComponent } from "./stepper-container.component";
const meta: Meta<StepperContainerComponent> = {
  id: "navigation-stepper-container",
  title: "Navigation/Stepper container/Variations",
  component: StepperContainerComponent,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({
      imports: [StepComponent, StepperContainerComponent, ButtonComponent],
    }),
  ],
  parameters: { layout: "padded" },
  args: { label: "Setup steps", value: "account", linear: false },
  argTypes: {},
  render: (args) => ({
    props: { ...args, complete: false, done: false },
    template: `<dl-stepper-container ${argsToTemplate(args)} (finished)="done=true"><dl-step value="account" label="Account" description="Your details" [completed]="complete"><h3>Account details</h3><button dlButton variant="secondary" type="button" (click)="complete=true;completed=true">Mark account complete</button></dl-step><dl-step value="preferences" label="Preferences" [optional]="true"><h3>Choose your preferences</h3></dl-step><dl-step value="review" label="Review" [completed]="true"><h3>Ready to finish</h3></dl-step></dl-stepper-container><output>{{done?'Setup complete':''}}</output>`,
  }),
};
export default meta;
type Story = StoryObj<StepperContainerComponent>;
export const Default: Story = {};
