import type { Meta, StoryObj } from "@storybook/angular";
import { argsToTemplate, moduleMetadata } from "@storybook/angular";
import { FormsModule } from "@angular/forms";
import { InputComponent } from "../input.component";
import { ButtonComponent } from "../button.component";
const meta: Meta<InputComponent> = {
  title: "Inputs/Input masks",
  component: InputComponent,
  tags: ["autodocs"],
  decorators: [moduleMetadata({ imports: [FormsModule, ButtonComponent] })],
  args: {
    id: "mask-example",
    label: "SSN",
    maskPreset: "ssn",
    hint: "Example data only. Enter nine digits.",
    type: "text",
    disabled: false,
  },
  render: (args, context) => ({
    props: {
      ...args,
      id: `mask-${context.id}`,
      modelValue: "",
      lastMask: "",
      events: 0,
      completionCount: 0,
    },
    template: `<div style="width:380px;max-width:90vw"><dl-input ${argsToTemplate(args, { exclude: ["maskAccept", "maskComplete"] })} [(ngModel)]="modelValue" #control="ngModel" (maskAccept)="lastMask=$event.formatted;events=events+1;maskAccept && maskAccept($event)" (maskComplete)="completionCount=completionCount+1;maskComplete && maskComplete($event)"/><dl style="font:12px/1.7 var(--dl-font);color:var(--dl-muted)"><dt>Form value</dt><dd><output data-testid="model-value">{{modelValue}}</output></dd><dt>Formatted value</dt><dd><output data-testid="formatted-value">{{lastMask}}</output></dd><dt>Form status</dt><dd data-testid="mask-validity">{{control.invalid?'Invalid':'Valid'}}{{control.touched?' · touched':''}}</dd><dt>Accept events / completions</dt><dd data-testid="mask-events">{{events}} / {{completionCount}}</dd></dl><div style="display:flex;flex-wrap:wrap;gap:8px"><button dlButton variant="secondary" (click)="control.reset('');lastMask=''">Reset</button><button dlButton variant="secondary" (click)="modelValue='000123456'">Set example value</button><button dlButton variant="secondary" (click)="disabled=!disabled">Toggle disabled</button><button dlButton variant="secondary" (click)="maskPreset=maskPreset==='ein'?'ssn':'ein'">Switch SSN / EIN</button></div></div>`,
  }),
};
export default meta;
type Story = StoryObj<InputComponent>;
export const SSN: Story = {};
export const ITIN: Story = {
  args: {
    label: "Individual taxpayer ID",
    maskPreset: "itin",
    hint: "Formats nine digits; does not verify an identifier.",
  },
};
export const TINIndividual: Story = {
  args: {
    label: "TIN — individual format",
    maskPreset: "tin",
    tinType: "individual",
  },
};
export const TINBusiness: Story = {
  args: {
    label: "TIN — business format",
    maskPreset: "tin",
    tinType: "business",
  },
};
export const EIN: Story = { args: { label: "Employer ID", maskPreset: "ein" } };
export const PhoneUS: Story = {
  args: {
    label: "US phone",
    maskPreset: "phone-us",
    hint: "Ten digits, formatted as (000) 000-0000.",
    autocomplete: "tel-national",
  },
};
export const PhoneInternational: Story = {
  args: {
    label: "International phone",
    maskPreset: "phone-international",
    hint: "Country code and number: up to 15 digits. Format only.",
    autocomplete: "tel",
  },
};
export const ZIP: Story = {
  args: { label: "ZIP code", maskPreset: "zip", hint: "Five digits." },
};
export const ZIPPlus4: Story = {
  args: { label: "ZIP+4", maskPreset: "zip-plus4", hint: "Nine digits." },
};
export const Card16: Story = {
  args: {
    label: "Card number — 16-digit format",
    maskPreset: "card-16",
    hint: "Formatting only; not card-brand or checksum validation.",
  },
};
export const DatePattern: Story = {
  args: {
    label: "Date text",
    maskPreset: "date",
    hint: "DD/MM/YYYY formatting only. Use Datepicker for calendar validation.",
  },
};
export const TimePattern: Story = {
  args: {
    label: "Time text",
    maskPreset: "time",
    hint: "HH:MM formatting only.",
  },
};
export const CustomPattern: Story = {
  args: {
    label: "Reference code",
    maskPreset: "none",
    mask: "aaa-0000",
    maskCase: "upper",
    hint: "Three letters followed by four digits.",
  },
};
export const CustomDefinitions: Story = {
  args: {
    label: "Hex color",
    maskPreset: "none",
    mask: "#HHHHHH",
    maskDefinitions: { H: "[0-9a-fA-F]" },
    maskCase: "upper",
    hint: "Six hexadecimal characters.",
  },
};
export const OptionalExtension: Story = {
  args: {
    label: "Phone with extension",
    maskPreset: "none",
    mask: "(000) 000-0000[ ext. 0000]",
    inputMode: "tel",
    hint: "An optional four-digit extension.",
  },
};
export const FormattedModel: Story = {
  args: {
    maskValueMode: "formatted",
    hint: "The form value includes separators.",
  },
};
export const VisibleGuide: Story = {
  args: { maskLazy: false, maskPlaceholderChar: "_" },
};
export const ObscuredCharacters: Story = {
  args: {
    maskDisplayChar: "•",
    maskOverwrite: "shift",
    hint: "Typed characters are obscured; the form retains its raw value. This demo displays that value below.",
  },
};
export const Overwrite: Story = { args: { maskOverwrite: true } };
export const PartialAllowed: Story = {
  args: {
    maskValidate: false,
    hint: "Incomplete values do not produce a mask validation error.",
  },
};
export const ReadOnly: Story = { args: { readOnly: true } };
export const Disabled: Story = { args: { disabled: true } };
export const Small: Story = { args: { size: "sm" } };
export const Large: Story = { args: { size: "lg" } };
