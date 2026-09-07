import type { Meta, StoryObj } from "@storybook/angular";
import { argsToTemplate, moduleMetadata } from "@storybook/angular";
import { FormsModule } from "@angular/forms";
import { InputComponent } from "../input.component";
import { ButtonComponent } from "../button.component";
import { BottomSheetComponent } from "./bottom-sheet.component";
const meta: Meta<BottomSheetComponent> = {
  id: "overlays-bottom-sheet",
  title: "Overlays/Bottom sheet/Variations",
  component: BottomSheetComponent,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({ imports: [ButtonComponent, InputComponent, FormsModule] }),
  ],
  args: {
    open: false,
    heading: "Bottom sheet",
    description: "A flexible space for focused work.",
    confirmLabel: "Save changes",
    confirmVariant: "primary",
    autoFocus: "first-tabbable",
  },
  argTypes: {},
  render: (args, context) => ({
    props: { ...args, id: `overlay-${context.id}`, result: "" },
    template: `<button dlButton (click)="$any($event.currentTarget).focus();open=true">Open bottom sheet</button><dl-bottom-sheet ${argsToTemplate(args, { exclude: ["openChange", "closed"] })} (openChange)="open=$event;openChange && openChange($event)" (closed)="result=$event;closed && closed($event)"><p>Use any components, forms, or content here.</p><dl-input [id]="id+'-workspace'" label="Workspace name" ngModel="Studio"/></dl-bottom-sheet><p style="font:12px var(--dl-font);color:var(--dl-muted)">Closed: <output>{{result}}</output></p>`,
  }),
};
export default meta;
type Story = StoryObj<BottomSheetComponent>;
export const Default: Story = {
  parameters: {
    storyNote:
      "Opens from the bottom at 90% of the dynamic viewport height. Content scrolls inside the sheet; the height input can override the default.",
  },
};
