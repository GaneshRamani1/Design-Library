import type { Meta, StoryObj } from "@storybook/angular";
import { argsToTemplate, moduleMetadata } from "@storybook/angular";
import { FormsModule } from "@angular/forms";
import { ChipsComponent } from "./chips.component";
const meta: Meta<ChipsComponent> = {
  id: "inputs-chips",
  title: "Inputs/Chips/Variations",
  component: ChipsComponent,
  tags: ["autodocs"],
  decorators: [moduleMetadata({ imports: [FormsModule] })],
  args: {
    id: "chips-example",
    label: "Topics",
    options: [
      { value: "design", label: "Design", icon: "heart" },
      { value: "engineering", label: "Engineering", icon: "settings" },
      { value: "locked", label: "Locked", disabled: true },
    ],
  },
  render: (args, context) => ({
    props: {
      ...args,
      id: `control-${context.id}`,
      selection: ["design"],
      keepChip: (chip: { value: string }) => (option: { value: string }) =>
        option.value !== chip.value,
    },
    template: `<dl-chips ${argsToTemplate(args, { exclude: ["removed"] })} [(ngModel)]="selection" (removed)="options=options.filter(keepChip($event));removed && removed($event)"/><output style="display:block;margin-top:16px;font:12px var(--dl-font);color:var(--dl-muted)">{{selection}}</output>`,
  }),
};
export default meta;
type Story = StoryObj<ChipsComponent>;
export const Default: Story = {};
export const DisplayOnly: Story = {
  args: { selectable: false, removable: false },
};
export const SingleSelection: Story = { args: { multiple: false } };
