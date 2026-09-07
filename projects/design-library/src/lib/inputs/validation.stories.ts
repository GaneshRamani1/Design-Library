import {
  argsToTemplate,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from "@storybook/angular";
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
  type ValidatorFn,
  type AsyncValidatorFn,
} from "@angular/forms";
import { of, delay } from "rxjs";
import { ValidationDirective } from "./validation.directive";
import { InputComponent } from "../input.component";
import { DropdownComponent } from "./dropdown.component";
import { CheckboxComponent } from "./checkbox.component";
import { ButtonComponent } from "../button.component";
const companyEmail: ValidatorFn = (control) =>
  !control.value || String(control.value).endsWith("@example.com")
    ? null
    : { companyEmail: { domain: "example.com" } };
const availableName: AsyncValidatorFn = (control) =>
  of(control.value === "reserved" ? { taken: true } : null).pipe(delay(250));
const meta: Meta<ValidationDirective> = {
  id: "inputs-validation-directive",
  title: "Inputs/Validation directive/Variations",
  component: ValidationDirective,
  decorators: [
    moduleMetadata({
      imports: [
        ValidationDirective,
        InputComponent,
        DropdownComponent,
        CheckboxComponent,
        ButtonComponent,
        ReactiveFormsModule,
        FormsModule,
      ],
    }),
  ],
  tags: ["autodocs"],
  args: {
    dlValidation: true,
    validationDisplay: "popover",
    validationWhen: "always",
    validators: [companyEmail, Validators.minLength(8)],
    validationMessages: {
      companyEmail: "Use your @example.com work email.",
      minlength: "Enter at least eight characters.",
    },
  },
  argTypes: {
    validators: { control: false },
    asyncValidators: { control: false },
    validationMessages: { control: "object" },
  },
  render: (args) => ({
    props: {
      ...args,
      control: new FormControl("hello", {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    template: `<div style="width:360px;max-width:100%;min-height:300px"><dl-input id="validation-email" label="Work email" hint="Your work account email." [formControl]="control" ${argsToTemplate(args)}/><button dlButton variant="secondary" style="margin-top:170px" (click)="control.reset('')">Reset</button><p>Form status: <output>{{control.status}}</output></p></div>`,
  }),
};
export default meta;
type Story = StoryObj<ValidationDirective>;
export const Default: Story = {
  parameters: {
    storyNote:
      "Custom validators return Angular error objects. The popover maps those keys to messages beneath the input. Enter someone@example.com to resolve both errors.",
  },
};
export const Inline: Story = { args: { validationDisplay: "inline" } };
export const OnBlur: Story = {
  args: { validationWhen: "touched" },
  parameters: {
    storyNote:
      "The field starts untouched. Focus it and move away to reveal validation. Reset clears touched state and hides the messages.",
  },
};
export const WhileEditing: Story = {
  args: { validationWhen: "dirty", validationPopoverTrigger: "focus" },
  parameters: {
    storyNote:
      "Validation appears while the edited input has focus. It hides on blur; Escape dismisses it until focus returns or the errors change.",
  },
};
export const OnSubmit: Story = {
  args: { validationWhen: "submitted" },
  render: (args) => ({
    props: {
      ...args,
      form: new FormGroup({
        email: new FormControl("", {
          nonNullable: true,
          validators: [Validators.required],
        }),
      }),
    },
    template: `<form [formGroup]="form" style="width:360px;max-width:100%;min-height:320px"><dl-input id="submit-email" label="Work email" formControlName="email" ${argsToTemplate(args)}/><button dlButton style="margin-top:170px" type="submit">Submit form</button><button dlButton variant="secondary" type="reset" style="margin:24px 0">Reset form</button></form>`,
  }),
};
export const Async: Story = {
  args: {
    validators: [],
    asyncValidators: [availableName],
    validationShowPending: true,
    validationMessages: { taken: "This name is already reserved." },
  },
  render: (args) => ({
    props: {
      ...args,
      control: new FormControl("reserved", { nonNullable: true }),
    },
    template: `<div style="width:360px;max-width:100%;min-height:300px"><dl-input id="async-name" label="Workspace name" [formControl]="control" ${argsToTemplate(args)}/><p style="margin-top:170px">Form status: <output>{{control.status}}</output></p></div>`,
  }),
  parameters: {
    storyNote:
      "This demo simulates an asynchronous availability check. The name reserved fails after 250ms. Enter another name to pass. Angular cancels stale checks when the value changes.",
  },
};
export const TemplateDriven: Story = {
  render: (args) => ({
    props: { ...args, email: "hello" },
    template: `<form style="width:360px;max-width:100%;min-height:300px"><dl-input id="template-email" name="email" label="Work email" [(ngModel)]="email" ${argsToTemplate(args)}/><p style="margin-top:170px">Model: <output>{{email}}</output></p></form>`,
  }),
};
export const Dropdown: Story = {
  args: {
    validators: [],
    validationMessages: { required: "Choose a workspace." },
  },
  render: (args) => ({
    props: {
      ...args,
      control: new FormControl(null, Validators.required),
      options: [
        { value: "design", label: "Design" },
        { value: "engineering", label: "Engineering" },
      ],
    },
    template: `<div style="width:360px;max-width:100%;min-height:320px"><dl-dropdown id="validation-dropdown" label="Workspace" [options]="options" [formControl]="control" ${argsToTemplate(args)}/></div>`,
  }),
};
export const Checkbox: Story = {
  args: {
    validators: [],
    validationMessages: { required: "Accept the terms to continue." },
  },
  render: (args) => ({
    props: {
      ...args,
      control: new FormControl(false, Validators.requiredTrue),
    },
    template: `<div style="width:360px;max-width:100%;min-height:300px"><dl-checkbox id="validation-terms" label="Accept the terms" [formControl]="control" ${argsToTemplate(args)}/></div>`,
  }),
};
export const DynamicValidators: Story = {
  render: (args) => ({
    props: {
      ...args,
      companyEmail,
      validators: [companyEmail],
      control: new FormControl("", Validators.required),
    },
    template: `<div style="width:360px;max-width:100%;min-height:340px"><dl-input id="dynamic-email" label="Work email" [formControl]="control" ${argsToTemplate(args)}/><button dlButton style="margin-top:170px" (click)="validators=validators.length?[]:[companyEmail]">Toggle company rule</button></div>`,
  }),
  parameters: {
    storyNote:
      "Toggle the custom company rule at runtime. The original required validator remains installed. Type a personal email to see only the custom rule change.",
  },
};
export const CustomMessages: Story = {
  args: {
    validationMessages: {
      companyEmail: (details) =>
        `Your address must end with @${(details as { domain: string }).domain}.`,
      minlength: "A longer email address is needed.",
    },
    validationHeading: "Check your account details",
    validationAppearance: {
      radius: "18px",
      background: "#251c32",
      color: "#e9d5ff",
      borderColor: "#a78bfa",
    },
  },
};

export const NativeInput: Story = {
  render: () => ({
    props: { control: new FormControl("", Validators.required) },
    template: `<div style="width:360px;max-width:100%;min-height:300px"><label for="native-validation">Native input</label><input id="native-validation" style="display:block;width:100%;box-sizing:border-box;padding:12px" [formControl]="control" dlValidation validationDisplay="popover" validationWhen="always" /></div>`,
  }),
  parameters: {
    storyNote:
      "The same directive supports native Angular form controls. This input uses a required validator already on its FormControl and the shorthand dlValidation attribute.",
  },
};
