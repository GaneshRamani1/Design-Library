import type { Meta, StoryObj } from "@storybook/angular";
import { argsToTemplate, moduleMetadata } from "@storybook/angular";
import { Component, inject } from "@angular/core";
import { IconComponent } from "./icon.component";
import { applicationConfig } from "@storybook/angular";
import { IconRegistry, provideIcons } from "./icon-registry";
import { ICON_CATALOG } from "./icon-catalog";

@Component({
  selector: "dl-icon-registry-demo",
  standalone: true,
  imports: [IconComponent],
  template: `
    <div style="display:grid;gap:12px;max-width:560px">
      <strong>{{ registry.names.length }} registered SVG icons</strong>
      <span style="color:var(--dl-muted)">
        {{ registry.names.slice(0, 12).join(", ") }}…
      </span>
      <div style="display:flex;gap:12px;align-items:center">
        <dl-icon [data]="registry.get('heart')" label="Heart from registry" />
        <code>registry.get('heart')</code>
      </div>
    </div>
  `,
})
class IconRegistryDemo {
  readonly registry = inject(IconRegistry);
}
const meta: Meta<IconComponent> = {
  id: "data-display-icon",
  title: "Data display/Icon/Variations",
  component: IconComponent,
  tags: ["autodocs"],
  parameters: { serviceApi: "IconRegistry" },
  decorators: [applicationConfig({ providers: provideIcons(ICON_CATALOG) })],
  args: { name: "heart", size: 32, label: "Favorite" },
  render: (args) => ({
    props: args,
    template: `<dl-icon ${argsToTemplate(args)}/>`,
  }),
};
export default meta;
type Story = StoryObj<IconComponent>;
export const Default: Story = {};
export const Registry: Story = {
  decorators: [moduleMetadata({ imports: [IconRegistryDemo] })],
  parameters: {
    storyNote:
      "Inject IconRegistry to inspect registered names or resolve SVG data by name. The catalog provider in this story registers the complete local icon set.",
  },
  render: () => ({ template: "<dl-icon-registry-demo />" }),
};
