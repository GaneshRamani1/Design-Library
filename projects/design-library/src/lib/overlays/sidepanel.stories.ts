import type { Meta, StoryObj } from "@storybook/angular";
import { argsToTemplate, moduleMetadata } from "@storybook/angular";
import { FormsModule } from "@angular/forms";
import { InputComponent } from "../input.component";
import { ButtonComponent } from "../button.component";
import { SidepanelComponent } from "./sidepanel.component";
const meta: Meta<SidepanelComponent> = {
  id: "overlays-sidepanel",
  title: "Overlays/Sidepanel/Variations",
  component: SidepanelComponent,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({ imports: [ButtonComponent, InputComponent, FormsModule] }),
  ],
  args: {
    open: false,
    heading: "Sidepanel",
    description: "A flexible space for focused work.",
    confirmLabel: "Save changes",
    confirmVariant: "primary",
    autoFocus: "first-tabbable",
  },
  argTypes: {},
  render: (args, context) => ({
    props: { ...args, id: `overlay-${context.id}`, result: "" },
    template: `<button dlButton (click)="$any($event.currentTarget).focus();open=true">Open sidepanel</button><dl-sidepanel ${argsToTemplate(args, { exclude: ["openChange", "closed"] })} (openChange)="open=$event;openChange && openChange($event)" (closed)="result=$event;closed && closed($event)"><p>Use any components, forms, or content here.</p><dl-input [id]="id+'-workspace'" label="Workspace name" ngModel="Studio"/></dl-sidepanel><p style="font:12px var(--dl-font);color:var(--dl-muted)">Closed: <output>{{result}}</output></p>`,
  }),
};
export default meta;
type Story = StoryObj<SidepanelComponent>;
export const Default: Story = {};
