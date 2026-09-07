import {
  argsToTemplate,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from "@storybook/angular";
import { LinkDirective } from "./link.directive";
const meta: Meta<LinkDirective> = {
  id: "navigation-link-directive",
  title: "Navigation/Link directive/Variations",
  component: LinkDirective,
  tags: ["autodocs"],
  decorators: [moduleMetadata({ imports: [LinkDirective] })],
  args: { href: "#link-destination", disabled: false },
  render: (args) => ({
    props: args,
    template: `<a dlLink ${argsToTemplate(args)}>View workspace</a><div id="link-destination" style="margin-top:32px">Workspace destination</div>`,
  }),
};
export default meta;
type Story = StoryObj<LinkDirective>;
export const Default: Story = {};
export const NewTab: Story = {
  args: { target: "_blank", href: "https://example.com" },
  parameters: {
    storyNote:
      "A native link opens in a new tab and includes noopener. Its visible text announces the new tab.",
  },
  render: (args) => ({
    props: args,
    template: `<a dlLink ${argsToTemplate(args)}>Visit example.com (opens in a new tab)</a>`,
  }),
};
export const Disabled: Story = {
  args: { disabled: true },
  parameters: {
    storyNote:
      "The disabled link has no destination, is excluded from the tab order, and does not emit activation events.",
  },
};
