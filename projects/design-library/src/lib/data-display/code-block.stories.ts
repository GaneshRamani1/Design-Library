import type { Meta, StoryObj } from "@storybook/angular";
import { CodeBlockComponent } from "./code-block.component";

const sample = `<button
  dlButton
  variant="primary"
  (click)="continue($event)"
>
  Continue
</button>`;

const meta: Meta<CodeBlockComponent> = {
  id: "data-display-code-block",
  title: "Data display/Code block/Variations",
  component: CodeBlockComponent,
  tags: ["autodocs"],
  args: { code: sample, language: "Angular", showHeader: true, copyable: true },
};
export default meta;
type Story = StoryObj<CodeBlockComponent>;
export const Default: Story = {};
export const WithLineNumbers: Story = { args: { lineNumbers: true } };
export const Wrapped: Story = {
  args: {
    wrap: true,
    code: `${sample}\n<!-- Long content wraps instead of forcing the containing layout wider. -->`,
  },
};
export const Light: Story = { args: { theme: "light" } };
export const FileActions: Story = {
  args: {
    filename: "button.component.html",
    downloadable: true,
    playgroundLink: "https://stackblitz.com/",
    lineNumbers: true,
  },
};
export const Collapsed: Story = {
  args: { collapsible: true, initiallyExpanded: false },
};
