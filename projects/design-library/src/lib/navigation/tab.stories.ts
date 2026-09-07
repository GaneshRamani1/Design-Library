import type { Meta, StoryObj } from "@storybook/angular";
import { argsToTemplate, moduleMetadata } from "@storybook/angular";
import { FormsModule } from "@angular/forms";
import { InputComponent } from "../input.component";
import { TabComponent } from "./tab.component";
import { TabContainerComponent } from "./tab-container.component";
const meta: Meta<TabComponent> = {
  id: "navigation-tab",
  title: "Navigation/Tab/Variations",
  component: TabComponent,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({
      imports: [
        TabComponent,
        TabContainerComponent,
        InputComponent,
        FormsModule,
      ],
    }),
  ],
  parameters: { layout: "padded" },
  args: { value: "overview", label: "Overview", closable: false },
  argTypes: {},
  render: (args, context) => ({
    props: { ...args, showFirst: true },
    template: `<dl-tab-container label="Project tabs">@if(showFirst){<dl-tab ${argsToTemplate(args)} (closed)="showFirst=false"><h3>Project overview</h3><dl-input id="${context.id}-project" label="Project name" ngModel="Studio"/></dl-tab>}<dl-tab value="activity" label="Activity" badge="3"><h3>Recent activity</h3><p>Your team is up to date.</p></dl-tab><dl-tab value="settings" label="Settings" [disabled]="true">Restricted settings</dl-tab></dl-tab-container>`,
  }),
};
export default meta;
type Story = StoryObj<TabComponent>;
export const Default: Story = {};
