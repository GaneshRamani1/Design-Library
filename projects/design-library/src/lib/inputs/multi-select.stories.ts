import type { Meta, StoryObj } from "@storybook/angular";
import { argsToTemplate, moduleMetadata } from "@storybook/angular";
import { FormsModule } from "@angular/forms";
import { MultiSelectComponent } from "./multi-select.component";
const meta: Meta<MultiSelectComponent> = {
  id: "inputs-multi-select-dropdown",
  title: "Inputs/Multi-select dropdown/Variations",
  component: MultiSelectComponent,
  tags: ["autodocs"],
  decorators: [moduleMetadata({ imports: [FormsModule] })],
  args: {
    placeholder: "Select options",
    searchable: true,
    showSelectAll: true,
    showClear: true,
    showDone: true,
    showCount: true,
    showDescriptions: true,
    selectAllLabel: "Select all",
    clearLabel: "Clear",
    doneLabel: "Done",
    searchPlaceholder: "Search options…",
    searchLabel: "",
    emptyText: "No options found.",
    selectedCountLabel: "{count} selected",
    limitMessage: "You can select up to {limit} options.",
    summaryMode: "labels",
    labelSeparator: ", ",
    bulkScope: "all",
    maxSelected: null,
    optionsMaxHeight: 220,
    menuWidth: null,
    closeOnSelect: false,
    resetSearchOnOpen: true,
    id: "multi-select-example",
    label: "Teams",
    hint: "Choose what works for you.",
    error: "",
    disabled: false,
    required: false,
    stretch: false,
    size: "md",
    options: [
      { value: "design", label: "Design", description: "Product and brand" },
      { value: "engineering", label: "Engineering" },
      { value: "marketing", label: "Marketing" },
      { value: "support", label: "Support", disabled: true },
    ],
  },
  argTypes: {
    bulkScope: {
      control: "select",
      options: ["all", "filtered"],
      table: { category: "Behavior" },
    },
    summaryMode: {
      control: "select",
      options: ["labels", "count"],
      table: { category: "Appearance" },
    },
    maxSelected: {
      control: { type: "number", min: 0 },
      table: { category: "Behavior" },
    },
    menuWidth: {
      control: { type: "number", min: 120 },
      table: { category: "Appearance" },
    },
    optionsMaxHeight: {
      control: { type: "number", min: 44 },
      table: { category: "Appearance" },
    },
    valueChange: { action: "valueChange", table: { category: "Events" } },
    selectAllChange: {
      action: "selectAllChange",
      table: { category: "Events" },
    },
    clearChange: { action: "clearChange", table: { category: "Events" } },
    searchChange: { action: "searchChange", table: { category: "Events" } },
    size: { control: "select", options: ["sm", "md", "lg"] },
    value: { table: { disable: true }, control: false },
  },
  render: (args, context) => ({
    props: { ...args, id: `${args.id}-${context.id}`, selection: ["design"] },
    template: `<div style="width:min(440px, 85vw);min-height:360px"><dl-multi-select ${argsToTemplate(args)} [(ngModel)]="selection" /><p style="font:12px var(--dl-font);color:var(--dl-muted);margin-top:24px">Form value: <output>{{ selection }}</output></p></div>`,
  }),
};
export default meta;
type Story = StoryObj<MultiSelectComponent>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Invalid: Story = {
  args: { error: "Please review your selection." },
};
export const Large: Story = { args: { size: "lg", stretch: true } };
export const Empty: Story = { args: { options: [] } };

export const FilteredBulkActions: Story = {
  args: {
    bulkScope: "filtered",
    selectAllLabel: "Select results",
    clearLabel: "Clear results",
  },
};
export const SelectionLimit: Story = {
  args: { maxSelected: 2, hint: "Choose up to two teams." },
};
export const CountSummary: Story = {
  args: { summaryMode: "count", selectedCountLabel: "{count} teams chosen" },
};
export const Minimal: Story = {
  args: {
    searchable: false,
    showSelectAll: false,
    showClear: false,
    showDone: false,
    showCount: false,
    showDescriptions: false,
  },
};
export const CustomLabels: Story = {
  args: {
    label: "Project teams",
    placeholder: "Choose teams",
    selectAllLabel: "Add all teams",
    clearLabel: "Remove teams",
    doneLabel: "Apply",
    searchPlaceholder: "Find a team",
    searchLabel: "Find project teams",
    emptyText: "No matching teams",
    selectedCountLabel: "{count} teams chosen",
    menuWidth: 360,
    optionsMaxHeight: 140,
    labelSeparator: " · ",
  },
};
export const CloseAfterSelection: Story = { args: { closeOnSelect: true } };
export const LockedSelection: Story = {
  args: {
    options: [
      { value: "design", label: "Design", disabled: true },
      { value: "engineering", label: "Engineering" },
      { value: "marketing", label: "Marketing" },
    ],
  },
};
