import {
  argsToTemplate,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from "@storybook/angular";
import {
  FormControl,
  ReactiveFormsModule,
  FormsModule,
  Validators,
} from "@angular/forms";
import { NumberInputComponent } from "./number-input.component";
import { ValidationDirective } from "./validation.directive";
import { ButtonComponent } from "../button.component";
import {
  currencyValidator,
  percentageValidator,
  numericValidator,
} from "./number-format";
const meta: Meta<NumberInputComponent> = {
  id: "inputs-number-input",
  title: "Inputs/Number input/Variations",
  component: NumberInputComponent,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({
      imports: [
        NumberInputComponent,
        ValidationDirective,
        ReactiveFormsModule,
        FormsModule,
        ButtonComponent,
      ],
    }),
  ],
  args: {
    id: "numeric-demo",
    label: "Amount",
    hint: "The form model holds a number, not formatted text.",
    format: "decimal",
    locale: "en-US",
    currency: "USD",
    currencyDisplay: "symbol",
    precision: 2,
    minPrecision: null,
    useGrouping: true,
    percentValue: "points",
    signDisplay: "auto",
    formatOn: "blur",
    maskInput: true,
    selectOnFocus: true,
    validatePrecision: true,
    min: null,
    max: null,
    step: null,
    readOnly: false,
    placeholder: "Enter a value",
    textAlign: "start",
    disabled: false,
    required: false,
    size: "md",
    stretch: false,
  },
  render: (args) => ({
    props: { ...args, control: new FormControl<number | null>(1234.5) },
    template: `<div style="min-height:320px;max-width:100%"><dl-number-input ${argsToTemplate(args)} [formControl]="control" dlValidation validationDisplay="popover" validationWhen="dirty"/><div style="margin-top:150px"><p>Numeric model: <output>{{control.value===null?'null':control.value}}</output></p><p>Status: <span data-status>{{control.status}}</span></p><button dlButton variant="secondary" (click)="control.reset(null)">Reset</button></div></div>`,
  }),
};
export default meta;
type Story = StoryObj<NumberInputComponent>;
export const Default: Story = {
  parameters: {
    storyNote:
      "Edit a localized number. Grouping is applied on blur; the Angular model remains numeric. More than two decimal places produces a precision error without silently rounding the model.",
  },
};
export const Currency: Story = {
  args: { format: "currency", label: "Price" },
  parameters: {
    storyNote:
      "USD currency formatting uses two decimal places by default. Focus to edit the numeric amount, then blur to restore the currency symbol and grouping.",
  },
};
export const Euro: Story = {
  args: {
    format: "currency",
    currency: "EUR",
    locale: "de-DE",
    label: "Price in euros",
  },
  parameters: {
    storyNote:
      "German formatting uses a decimal comma and period grouping. Paste 1.234,50 € or type 1234,50; the model is 1234.5.",
  },
};
export const LiveCurrencyMask: Story = {
  args: { format: "currency", formatOn: "input", label: "Live price" },
  parameters: {
    storyNote:
      "Currency formatting updates while typing. Known currency affixes and grouping are accepted when pasting. Invalid characters are rejected and emit inputRejected; trailing decimal drafts are preserved until blur.",
  },
};
export const Percentage: Story = {
  args: {
    format: "percent",
    precision: 1,
    min: 0,
    max: 100,
    label: "Discount",
  },
  render: (args) => ({
    props: { ...args, control: new FormControl(12.5) },
    template: `<div style="min-height:280px"><dl-number-input ${argsToTemplate(args)} [formControl]="control" dlValidation validationDisplay="popover" validationWhen="dirty"/><p style="margin-top:150px">Numeric model: <output>{{control.value}}</output></p></div>`,
  }),
  parameters: {
    storyNote:
      "Percentage-point models are explicit: 12.5 means 12.5%. This example validates a range of 0–100 and one decimal place.",
  },
};
export const FractionPercentage: Story = {
  ...Percentage,
  args: { ...Percentage.args, percentValue: "fraction", max: 1 },
  render: (args) => ({
    props: { ...args, control: new FormControl(0.125) },
    template: `<div style="min-height:280px"><dl-number-input ${argsToTemplate(args)} [formControl]="control" dlValidation validationDisplay="popover" validationWhen="dirty"/><p style="margin-top:150px">Numeric model: <output>{{control.value}}</output></p></div>`,
  }),
  parameters: {
    storyNote:
      "Fraction models use 0.125 for 12.5%. Bounds apply to the model (0–1); precision applies to the displayed percentage (one decimal here).",
  },
};
export const PrecisionValidation: Story = {
  args: { precision: 2 },
  render: (args) => ({
    props: { ...args, control: new FormControl(12.345) },
    template: `<div style="min-height:280px"><dl-number-input ${argsToTemplate(args)} [formControl]="control" dlValidation validationDisplay="popover" validationWhen="always"/></div>`,
  }),
  parameters: {
    storyNote:
      "A programmatic value with excessive precision is invalid immediately. The input keeps the extra digit visible so the user can correct it.",
  },
};
export const Integer: Story = {
  args: { precision: 0, min: 0, label: "Quantity" },
  parameters: {
    storyNote:
      "Whole-number formatting and validation. Decimal input remains visible but invalid until corrected.",
  },
};
export const StepValidation: Story = {
  args: { min: 0, max: 100, step: 0.25, label: "Quarter increments" },
  parameters: {
    storyNote:
      "Valid values fall on 0.25 increments from the minimum. Range, step and precision rules compose and report separate messages.",
  },
};
export const ReusableValidators: Story = {
  args: { validatePrecision: false },
  render: (args) => ({
    props: {
      ...args,
      control: new FormControl(12.345, {
        validators: [
          Validators.required,
          currencyValidator({ min: 0, max: 100 }),
        ],
      }),
    },
    template: `<div style="min-height:300px"><dl-number-input ${argsToTemplate(args)} [formControl]="control" dlValidation validationDisplay="inline" validationWhen="always"/><p>Form status: {{control.status}}</p></div>`,
  }),
  parameters: {
    storyNote:
      "Exported numericValidator, currencyValidator, percentageValidator and precisionValidator work independently with Angular FormControls. Here currencyValidator is installed on the control and dlValidation displays its errors.",
  },
};
export const TemplateDriven: Story = {
  render: (args) => ({
    props: { ...args, amount: 42.5 },
    template: `<dl-number-input ${argsToTemplate(args)} [(ngModel)]="amount"/><p>Numeric model: <output>{{amount}}</output></p>`,
  }),
  parameters: {
    storyNote:
      "Two-way ngModel binding works with numeric values and null for an empty field, using the same formatting options as reactive forms.",
  },
};
