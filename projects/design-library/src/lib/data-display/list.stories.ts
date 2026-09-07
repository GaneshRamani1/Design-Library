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
