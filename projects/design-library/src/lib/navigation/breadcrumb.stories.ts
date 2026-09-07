import { argsToTemplate, type Meta, type StoryObj } from "@storybook/angular";
import { BreadcrumbComponent } from "./breadcrumb.component";
const meta: Meta<BreadcrumbComponent> = {
  id: "navigation-breadcrumb",
  title: "Navigation/Breadcrumb/Variations",
  component: BreadcrumbComponent,
  tags: ["autodocs"],
  args: {
    items: [
      { label: "Home", href: "#home" },
      { label: "Workspace", href: "#workspace", icon: "settings" },
      { label: "Projects", href: "#projects" },
      { label: "Design library" },
    ],
  },
  render: (args) => ({
    props: args,
    template: `<dl-breadcrumb ${argsToTemplate(args)}/>`,
  }),
};
export default meta;
type Story = StoryObj<BreadcrumbComponent>;
export const Default: Story = {};
export const Collapsed: Story = {
  args: { maxItems: 3 },
  parameters: {
    storyNote:
      "Long paths retain the first and final locations. Activate the ellipsis with a pointer or keyboard to reveal the complete path.",
  },
};
export const CustomSeparator: Story = { args: { separator: "›" } };
export const LinkedCurrentPage: Story = {
  args: {
    linkCurrent: true,
    items: [
      { label: "Home", href: "#home" },
      { label: "Settings", href: "#settings" },
    ],
  },
};
export const LongLabels: Story = {
  args: {
    items: [
      { label: "Workspace", href: "#workspace", icon: "settings" },
      { label: "Product design and engineering", href: "#design" },
      { label: "Shared component library documentation" },
    ],
  },
};
