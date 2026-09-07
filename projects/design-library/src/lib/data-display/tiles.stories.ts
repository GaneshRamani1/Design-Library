import { argsToTemplate, type Meta, type StoryObj } from "@storybook/angular";
import { TilesComponent } from "./tiles.component";
const meta: Meta<TilesComponent> = {
  id: "data-display-tiles",
  title: "Data display/Tiles/Variations",
  component: TilesComponent,
  tags: ["autodocs"],
  args: {
    label: "Total revenue",
    value: "48,250",
    prefix: "$",
    trend: "12.8%",
    comparison: "vs. last month",
    tone: "success",
    series: [18, 25, 21, 32, 29, 42, 48],
    footerText: "Updated just now",
    actionLabel: "View report",
  },
  render: (args) => ({
    props: args,
    template: `<div style="width:360px;max-width:100%"><dl-tiles ${argsToTemplate(args)}/></div>`,
  }),
};
export default meta;
type Story = StoryObj<TilesComponent>;
export const Default: Story = {};
export const Dashboard: Story = {
  parameters: {
    layout: "padded",
    storyNote:
      "A responsive dashboard built from metric tiles. Each tile independently configures its value, trend meaning, chart, goal and action. The grid adapts to the available width.",
  },
  render: () => ({
    template: `<section style="padding:16px"><h2 style="margin-top:0">Workspace overview</h2><p style="color:var(--dl-muted);margin-bottom:24px">Performance over the last 30 days</p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:20px"><dl-tiles label="Total revenue" value="48,250" prefix="$" tone="success" trend="12.8%" comparison="vs. last month" [series]="[18,25,21,32,29,42,48]" footerText="Monthly revenue"/><dl-tiles label="Active customers" value="2,840" prefix="" icon="heart" tone="info" trend="8.2%" [series]="[12,18,17,20,28,26,34]" footerText="Across all workspaces"/><dl-tiles label="Support resolution" value="94" prefix="" suffix="%" icon="circle-check" tone="success" [showProgress]="true" [progress]="94" progressLabel="Resolution target" footerText="312 tickets resolved"/><dl-tiles label="Response time" value="1.2" prefix="" suffix="hrs" icon="bell" tone="warning" trend="18%" trendDirection="down" trendTone="success" comparison="faster than last month" [series]="[40,34,38,28,24,20,15]" footerText="Lower is better"/></div></section>`,
  }),
};
export const Loading: Story = {
  args: { loading: true },
  parameters: {
    storyNote:
      "Loading replaces the metric and chart with a skeleton, announces the busy state and disables the action.",
  },
};
export const Error: Story = {
  args: { error: "The metric could not be loaded.", actionLabel: "Retry" },
  parameters: {
    storyNote:
      "An error replaces stale metrics with an alert. The configurable action can trigger a retry.",
  },
};
export const Goal: Story = {
  args: {
    showChart: false,
    showProgress: true,
    progress: 72,
    progressLabel: "Monthly revenue goal",
  },
};
export const Empty: Story = {
  args: {
    value: null,
    prefix: "",
    trend: "",
    series: [],
    footerText: "No data for this period",
    actionLabel: "",
  },
};
export const CustomContent: Story = {
  parameters: {
    storyNote:
      "Project additional supporting content into the tile and use tileFooter for a custom footer. Built-in metric and chart options remain available.",
  },
  render: (args) => ({
    props: args,
    template: `<div style="width:360px;max-width:100%"><dl-tiles ${argsToTemplate(args)}><p style="margin:0;color:var(--dl-muted)">Subscriptions account for 82% of revenue.</p><span tileFooter>Last 30 days</span></dl-tiles></div>`,
  }),
};
export const ReplacedRegions: Story = {
  args: { showDefaultHeader: false, showDefaultValue: false, showDefaultChart: false },
  parameters: { storyNote: "Named slots can fully replace built-in header, value and chart regions while the tile retains layout, loading, error and footer behavior." },
  render: (args) => ({
    props: args,
    template: `<div style="width:360px;max-width:100%"><dl-tiles ${argsToTemplate(args)}><div tileHeader style="display:flex;justify-content:space-between;width:100%"><strong>Custom KPI</strong><span>Live</span></div><div tileValue style="font-size:32px;font-weight:700">84 / 100</div><div tileChart style="height:64px;display:grid;place-items:center;border:1px dashed var(--dl-border)">Projected visualization</div></dl-tiles></div>`,
  }),
};

export const FlatHistory: Story = {
  args: {
    series: [12, 12, 12, 12],
    trendDirection: "flat",
    trendTone: "neutral",
    trend: "0%",
  },
};
export const SingleDataPoint: Story = {
  args: { series: [12], trend: "" },
  parameters: {
    storyNote:
      "A single observation is shown as a point. Empty histories hide the chart; flat histories remain a horizontal line.",
  },
};
