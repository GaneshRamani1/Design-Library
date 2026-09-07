import { STORY_OUTPUT_OBSERVERS } from "../../../../../.storybook/output-observers.generated";
import { Component, computed, signal } from "@angular/core";
import type { Meta, StoryObj } from "@storybook/angular";
import { applicationConfig } from "@storybook/angular";
import { FormsModule } from "@angular/forms";
import { IconComponent } from "./icon.component";
import { ICON_CATALOG, ICON_NAMES } from "./icon-catalog";
import { provideIcons } from "./icon-registry";
import { InputComponent } from "../input.component";
import { ButtonComponent } from "../button.component";
@Component({
  selector: "dl-icon-gallery-demo",
  standalone: true,
  imports: [
    ...STORY_OUTPUT_OBSERVERS,
    IconComponent,
    InputComponent,
    ButtonComponent,
    FormsModule,
  ],
  template: `<main>
    <p class="eyebrow">THE SVG COLLECTION</p>
    <h1>Every detail, an icon.</h1>
    <p>
      {{ names.length }} Lucide icons. Search by name, choose an icon, and use
      its name in your component.
    </p>
    <dl-input
      id="icon-catalog-search"
      label="Search icons"
      placeholder="Search icons…"
      [ngModel]="query()"
      (ngModelChange)="query.set($event); page.set(0)"
      [stretch]="true"
    />
    <div class="chosen">
      <dl-icon [name]="selected()" [size]="32" /><code
        >&lt;dl-icon name="{{ selected() }}" /&gt;</code
      >
    </div>
    <div class="grid">
      @for (name of visible(); track name) {
        <button
          type="button"
          [attr.aria-label]="name"
          [attr.aria-pressed]="selected() === name"
          (click)="selected.set(name)"
        >
          <dl-icon [name]="name" [size]="24" /><span>{{ name }}</span>
        </button>
      } @empty {
        <p>No matching icons.</p>
      }
    </div>
    <footer>
      <button
        dlButton
        variant="secondary"
        [disabled]="page() === 0"
        (click)="page.set(page() - 1)"
      >
        Previous</button
      ><span
        >{{ filtered().length }} matches · Page {{ page() + 1 }} of
        {{ pages() }}</span
      ><button
        dlButton
        variant="secondary"
        [disabled]="page() + 1 >= pages()"
        (click)="page.set(page() + 1)"
      >
        Next
      </button>
    </footer>
  </main>`,
  styles: [
    `
      main {
        max-width: 1100px;
        margin: auto;
        padding: 40px 24px;
        color: var(--dl-text);
        font: 14px var(--dl-font);
      }
      .eyebrow {
        letter-spacing: 3px;
        font-size: 10px;
        color: var(--dl-muted);
      }
      h1 {
        font-size: 40px;
        letter-spacing: -1.8px;
        margin: 16px 0;
      }
      p {
        color: var(--dl-muted);
        line-height: 1.6;
      }
      .chosen {
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 24px;
        margin: 24px 0;
        border: 1px solid var(--dl-border);
        border-radius: var(--dl-radius);
        background: var(--dl-surface);
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
        gap: 8px;
      }
      .grid button {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 16px;
        min-height: 106px;
        background: var(--dl-surface);
        border: 1px solid var(--dl-border);
        border-radius: var(--dl-radius);
        color: var(--dl-text);
        cursor: pointer;
        padding: 12px;
        font: 11px var(--dl-font);
        overflow-wrap: anywhere;
      }
      .grid button:hover,
      .grid button[aria-pressed="true"] {
        border-color: var(--dl-primary);
        background: var(--dl-primary-soft);
      }
      button:focus-visible {
        outline: 2px solid var(--dl-focus);
        outline-offset: 2px;
      }
      footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-top: 24px;
      }
      code {
        overflow-wrap: anywhere;
      }
    `,
  ],
})
class IconGalleryDemo {
  readonly names = ICON_NAMES;
  readonly query = signal("");
  readonly page = signal(0);
  readonly selected = signal("heart");
  readonly filtered = computed(() =>
    this.names.filter((n) =>
      n.includes(this.query().trim().toLowerCase().replaceAll(" ", "-")),
    ),
  );
  readonly pages = computed(() =>
    Math.max(1, Math.ceil(this.filtered().length / 72)),
  );
  readonly visible = computed(() =>
    this.filtered().slice(this.page() * 72, (this.page() + 1) * 72),
  );
}
const meta: Meta<IconGalleryDemo> = {
  id: "data-display-icon-catalog",
  title: "Data display/Icon catalog/Variations",
  component: IconGalleryDemo,
  decorators: [applicationConfig({ providers: provideIcons(ICON_CATALOG) })],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<IconGalleryDemo>;
export const AllIcons: Story = {};
