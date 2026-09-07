import {
  argsToTemplate,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from "@storybook/angular";
import { HeaderComponent } from "./header.component";
import { ButtonComponent } from "../button.component";
import { BadgeComponent } from "../badge.component";
import { InputComponent } from "../input.component";
const meta: Meta<HeaderComponent> = {
  id: "layout-header",
  title: "Layout/Header/Variations",
  component: HeaderComponent,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({
      imports: [
        HeaderComponent,
        ButtonComponent,
        BadgeComponent,
        InputComponent,
      ],
    }),
  ],
  parameters: { layout: "padded" },
  args: {
    heading: "Workspace overview",
    subheading: "Manage projects, people, and activity in one place.",
    eyebrow: "Workspace",
    metadata: [
      { label: "Owner", value: "Design team" },
      { label: "Updated", value: "Today" },
      { value: "12 projects" },
    ],
    headingLevel: 1,
    size: "md",
    surface: "transparent",
    width: "100%",
    padding: "24px",
    gap: "24px",
    contentGap: "8px",
    metadataGap: "8px",
    align: "center",
    textAlign: "start",
    layout: "responsive",
    responsiveBreakpoint: 640,
    headingColor: "",
    subheadingColor: "",
    metadataColor: "",
    metadataSeparator: "·",
    metadataLabel: "Workspace details",
    showHeading: true,
    showSubheading: true,
    showMetadata: true,
    showLeft: true,
    showRight: true,
    showDivider: false,
  },
  render: (args) => ({
    props: { ...args, notice: "" },
    template: `<div style="width:100%;min-width:0"><dl-header ${argsToTemplate(args)}><button headerLeft dlButton variant="ghost" (click)="notice='Back selected'">← Back</button><div headerRight style="display:flex;gap:8px;flex-wrap:wrap"><button dlButton variant="secondary" (click)="notice='Export selected'">Export</button><button dlButton (click)="notice='New project selected'">New project</button></div></dl-header><p role="status">{{notice}}</p></div>`,
  }),
};
export default meta;
type Story = StoryObj<HeaderComponent>;
export const Default: Story = {
  parameters: {
    storyNote:
      "A heading, subheading and metadata share space with projected content on both sides. Back, Export and New project remain ordinary buttons with their own handlers and Actions logging.",
  },
};
export const TextOnly: Story = {
  args: { eyebrow: "", metadata: [], padding: "0" },
  render: (args) => ({
    props: args,
    template: `<dl-header ${argsToTemplate(args)}/>`,
  }),
  parameters: {
    storyNote:
      "Optional slots take no space when empty. Use heading and subheading alone for a simple page or section introduction.",
  },
};
export const LeftContent: Story = {
  render: (args) => ({
    props: args,
    template: `<dl-header ${argsToTemplate(args)}><dl-badge headerLeft tone="success">Live</dl-badge></dl-header>`,
  }),
  parameters: {
    storyNote:
      "Project a badge, icon, avatar, button or group into headerLeft. The content keeps its existing component API.",
  },
};
export const RightContent: Story = {
  render: (args) => ({
    props: args,
    template: `<dl-header ${argsToTemplate(args)}><dl-input headerRight id="header-search" label="Search projects" placeholder="Find a project"/></dl-header>`,
  }),
  parameters: {
    storyNote:
      "The right slot accepts full components, including form controls. Their keyboard behavior and values remain independent of the header.",
  },
};
export const CustomMetadata: Story = {
  args: { metadata: [] },
  render: (args) => ({
    props: args,
    template: `<dl-header ${argsToTemplate(args)}><div headerMetadata style="display:flex;gap:12px;flex-wrap:wrap;align-items:center"><dl-badge tone="success">Published</dl-badge><time datetime="2026-09-06">September 6, 2026</time><span>By Design team</span></div></dl-header>`,
  }),
  parameters: {
    storyNote:
      "Use headerMetadata for badges, dates, links or richer metadata. Leave the metadata array empty to use only projected content, or combine both.",
  },
};
export const CustomText: Story = {
  args: { heading: "", subheading: "", metadata: [] },
  render: (args) => ({
    props: args,
    template: `<dl-header ${argsToTemplate(args)}><h2 headerHeading style="margin:0">Project <em>Atlas</em></h2><p headerSubheading style="margin:0">Compose rich text with <strong>your own markup</strong>.</p><p style="margin:0">Unmarked projected content appears below the metadata.</p></dl-header>`,
  }),
  parameters: {
    storyNote:
      "Use headerHeading and headerSubheading for rich text. Supply your own semantic heading level in the projected markup. Unmarked content appears below the metadata.",
  },
};
export const Glass: Story = {
  args: { surface: "glass", padding: "24px", showDivider: false },
  parameters: {
    storyNote:
      "The glass surface uses the library’s black/glass dark theme and light theme tokens. Adjust padding, radius, border and colors through appearance.",
  },
};
export const SectionHeader: Story = {
  args: {
    heading: "Recent activity",
    subheading: "The latest changes across your workspace.",
    headingLevel: 2,
    size: "sm",
    eyebrow: "",
    metadata: [],
    showDivider: true,
    padding: "0 0 16px",
  },
  parameters: {
    storyNote:
      "A compact h2 section heading with a bottom divider. Heading level is independent of visual size.",
  },
};
export const NarrowContainer: Story = {
  render: (args) => ({
    props: args,
    template: `<div style="width:360px;max-width:100%"><dl-header ${argsToTemplate(args)}><button headerLeft dlButton variant="ghost">← Back</button><div headerRight style="display:flex;gap:8px;flex-wrap:wrap"><button dlButton variant="secondary">Export</button><button dlButton>New project</button></div></dl-header></div>`,
  }),
  parameters: {
    storyNote:
      "Responsive layout uses the header’s container width, not just the viewport. Below the configured breakpoint, left content, text and right content stack in reading order.",
  },
};
export const LongContent: Story = {
  args: {
    heading:
      "A long project heading that wraps gracefully inside a narrow workspace",
    subheading:
      "Long descriptions and metadata wrap without hiding the content or requiring horizontal page scrolling.",
    metadata: [
      {
        label: "Reference",
        value:
          "workspace_reference_with_a_very_long_unbroken_identifier_0123456789",
      },
      { label: "Owner", value: "Product design and engineering" },
    ],
  },
  parameters: {
    storyNote:
      "Long headings, descriptions and metadata wrap within their available width. Projected action groups should also permit wrapping, as this example does.",
  },
};
