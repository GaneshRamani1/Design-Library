import type { Meta, StoryObj } from "@storybook/angular";
import { argsToTemplate } from "@storybook/angular";
import { SkeletonComponent } from "./skeleton.component";

const meta: Meta<SkeletonComponent> = {
  id: "feedback-loading-skeleton",
  title: "Feedback/Loading skeleton/Variations",
  component: SkeletonComponent,
  tags: ["autodocs"],
  args: { width: "360px", count: 3 },
  render: (args) => ({
    props: args,
    template: `<dl-skeleton ${argsToTemplate(args)}><p>Content has loaded.</p></dl-skeleton>`,
  }),
};
export default meta;
type Story = StoryObj<SkeletonComponent>;
export const Default: Story = {};
export const Avatar: Story = {
  args: { shape: "circle", width: "64px", height: "64px", count: 1 },
};
export const Image: Story = {
  args: { shape: "rectangle", width: "360px", height: "200px", count: 1 },
};
export const Loaded: Story = { args: { loading: false } };
