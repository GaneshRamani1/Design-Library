import type { Meta, StoryObj } from "@storybook/angular";
import { argsToTemplate, moduleMetadata } from "@storybook/angular";
import { FormsModule } from "@angular/forms";
import { DatepickerComponent } from "./datepicker.component";
const meta: Meta<DatepickerComponent> = {
  id: "inputs-datepicker",
  title: "Inputs/Datepicker/Variations",
  component: DatepickerComponent,
  tags: ["autodocs"],
  argTypes: {
    dateFilter: {
      control: "object",
      description:
        "Optional (YYYY-MM-DD) => boolean predicate. See Weekend filter.",
    },
  },
  decorators: [moduleMetadata({ imports: [FormsModule] })],
  args: {
    id: "date-example",
    label: "Start date",
    min: "2026-09-01",
    max: "2026-12-31",
    disabledDates: ["2026-09-12"],
  },
  render: (args, context) => ({
    props: {
      ...args,
      id: `control-${context.id}`,
      selection: "2026-09-06",
      filterDate: args.dateFilter,
    },
    template: `<dl-datepicker ${argsToTemplate(args, { exclude: ["dateFilter"] })} [dateFilter]="filterDate ?? null" [(ngModel)]="selection" /><output style="display:block;margin-top:16px;font:12px var(--dl-font);color:var(--dl-muted)">{{selection}}</output>`,
  }),
};
export default meta;
type Story = StoryObj<DatepickerComponent>;
export const Default: Story = {};
export const MondayFirst: Story = {
  args: { locale: "en-GB", weekStartsOn: 1 },
};
export const Disabled: Story = { args: { disabled: true } };
export const ReadOnly: Story = { args: { readOnly: true } };
export const WeekendFilter: Story = {
  args: {
    dateFilter: (iso: string) => {
      const d = new Date(iso + "T12:00:00");
      return d.getDay() !== 0 && d.getDay() !== 6;
    },
  },
};
