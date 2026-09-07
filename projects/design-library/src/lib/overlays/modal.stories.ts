import type { Meta, StoryObj } from "@storybook/angular";
import { argsToTemplate, moduleMetadata } from "@storybook/angular";
import { FormsModule } from "@angular/forms";
import { InputComponent } from "../input.component";
import { ButtonComponent } from "../button.component";
import { ModalComponent } from "./modal.component";
const meta: Meta<ModalComponent> = {
  id: "overlays-modal",
  title: "Overlays/Modal/Variations",
  component: ModalComponent,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({ imports: [ButtonComponent, InputComponent, FormsModule] }),
  ],
  args: {
    open: false,
    heading: "Modal",
    description: "A flexible space for focused work.",
    confirmLabel: "Save changes",
    confirmVariant: "primary",
    autoFocus: "first-tabbable",
  },
  argTypes: {},
  render: (args, context) => ({
    props: { ...args, id: `overlay-${context.id}`, result: "" },
    template: `<button dlButton (click)="$any($event.currentTarget).focus();open=true">Open modal</button><dl-modal ${argsToTemplate(args, { exclude: ["openChange", "closed"] })} (openChange)="open=$event;openChange && openChange($event)" (closed)="result=$event;closed && closed($event)"><p>Use any components, forms, or content here.</p><dl-input [id]="id+'-workspace'" label="Workspace name" ngModel="Studio"/></dl-modal><p style="font:12px var(--dl-font);color:var(--dl-muted)">Closed: <output>{{result}}</output></p>`,
  }),
};
export default meta;
type Story = StoryObj<ModalComponent>;
export const Default: Story = {};
