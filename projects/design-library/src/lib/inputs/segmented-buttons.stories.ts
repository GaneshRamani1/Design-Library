import type { Meta, StoryObj } from "@storybook/angular";
import { argsToTemplate, moduleMetadata } from "@storybook/angular";
import { FormsModule } from "@angular/forms";
import { SegmentedButtonsComponent } from "./segmented-buttons.component";
const meta: Meta<SegmentedButtonsComponent> = {
  id: "inputs-segmented-buttons",
  title: "Inputs/Segmented buttons/Variations",
  component: SegmentedButtonsComponent,
  tags: ["autodocs"],
  decorators: [moduleMetadata({ imports: [FormsModule] })],
  args: {
    id: "segments-example",
    label: "View",
    options: [
      { value: "list", label: "List", icon: "menu" },
      { value: "grid", label: "Grid", icon: "settings" },
      { value: "locked", label: "Locked", disabled: true },
    ],
  },
  render: (args, context) => ({
    props: { ...args, id: `control-${context.id}`, selection: ["list"] },
    template: `<dl-segmented-buttons ${argsToTemplate(args, {})} [(ngModel)]="selection" /><output style="display:block;margin-top:16px;font:12px var(--dl-font);color:var(--dl-muted)">{{selection}}</output>`,
  }),
};
export default meta;
type Story = StoryObj<SegmentedButtonsComponent>;
export const Default: Story = {};
export const Multiple: Story = { args: { multiple: true } };
export const Vertical: Story = { args: { orientation: "vertical" } };
