import type { Meta, StoryObj } from "@storybook/angular";
import { argsToTemplate, moduleMetadata } from "@storybook/angular";
import { FormsModule } from "@angular/forms";
import { InputComponent } from "../input.component";
import { ButtonComponent } from "../button.component";
import { ConfirmationDialogComponent } from "./confirmation-dialog.component";
const meta: Meta<ConfirmationDialogComponent> = {
  id: "overlays-confirmation-dialog",
  title: "Overlays/Confirmation dialog/Variations",
  component: ConfirmationDialogComponent,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({ imports: [ButtonComponent, InputComponent, FormsModule] }),
  ],
  args: {
    open: false,
    heading: "Remove this workspace?",
    description: "This action needs your confirmation.",
    confirmLabel: "Remove workspace",
    confirmVariant: "danger",
    autoFocus: ".cancel",
  },
  argTypes: {},
  render: (args, context) => ({
    props: { ...args, id: `overlay-${context.id}`, result: "" },
    template: `<button dlButton (click)="$any($event.currentTarget).focus();open=true">Open confirmation dialog</button><dl-confirmation-dialog ${argsToTemplate(args, { exclude: ["openChange", "closed"] })} (openChange)="open=$event;openChange && openChange($event)" (closed)="result=$event;closed && closed($event)"><p>Remove this workspace and its settings?</p><dl-input [id]="id+'-workspace'" label="Workspace name" ngModel="Studio"/></dl-confirmation-dialog><p style="font:12px var(--dl-font);color:var(--dl-muted)">Closed: <output>{{result}}</output></p>`,
  }),
};
export default meta;
type Story = StoryObj<ConfirmationDialogComponent>;
export const Default: Story = {};
