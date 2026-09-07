import type { Meta, StoryObj } from "@storybook/angular";
import { argsToTemplate } from "@storybook/angular";
import { ListComponent } from "./list.component";

const meta: Meta<ListComponent> = {
  id: "data-display-list",
  title: "Data display/List/Variations",
  component: ListComponent,
  tags: ["autodocs"],
  args: {
    label: "Workspace settings",
    items: [
      {
        id: "team",
        label: "Team members",
        description: "Manage invitations and access",
        icon: "heart",
        meta: "12 members",
      },
      {
        id: "settings",
        label: "Preferences",
        description: "Make this space yours",
        icon: "settings",
      },
      {
        id: "archive",
        label: "Archived workspace",
        icon: "bell",
        disabled: true,
      },
    ],
    interactive: true,
  },
  render: (args) => ({
    props: args,
    template: `<div style="width:480px;max-width:90vw"><dl-list ${argsToTemplate(args)}/></div>`,
  }),
};
export default meta;
type Story = StoryObj<ListComponent>;
export const Default: Story = {};
export const Nested: Story = {
  args: {
    expandedIds: ["workspace"],
    items: [{ id: "workspace", label: "Workspace", icon: "folder", children: [
      { id: "members", label: "Members", description: "Manage access", icon: "users" },
      { id: "billing", label: "Billing", icon: "credit-card" },
    ] }],
  },
  parameters: { storyNote: "Activate a parent row to expand or collapse its nested items. expandedIds and expandedIdsChange support controlled state." },
};
export const CustomRowTemplate: Story = {
  parameters: { storyNote: "Supply itemTemplate to replace the built-in row while preserving selection, disabled state, nesting and events." },
  render: (args) => ({
    props: args,
    template: `<div style="width:480px;max-width:90vw"><ng-template #custom let-item let-selected="selected"><span style="flex:1"><strong>{{item.label}}</strong><small style="display:block">Custom projected row</small></span><span>{{selected ? 'Selected' : 'Select'}}</span></ng-template><dl-list ${argsToTemplate(args)} [itemTemplate]="custom"/></div>`,
  }),
};
