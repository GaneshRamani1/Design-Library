import { Component, TemplateRef, input } from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
@Component({
  selector: "dl-floating-panel",
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `<div
    class="panel"
    [style]="styles()"
    [id]="id()"
    [attr.role]="role()"
    [attr.aria-label]="role() === 'dialog' ? label() : null"
  >
    @if (template()) {
      <ng-container [ngTemplateOutlet]="template()" />
    } @else {
      {{ text() }}
    }
  </div>`,
  styles: [
    `
      :host {
        display: block;
      }
      .panel {
        box-sizing: border-box;
        max-height: calc(100dvh - 24px);
        overflow: auto;
        padding: var(--dl-ui-padding, 12px 16px);
        border: var(--dl-ui-border-width, 1px) solid
          var(--dl-ui-border-color, var(--dl-border));
        border-radius: var(--dl-ui-radius, var(--dl-radius));
        background: var(--dl-ui-background, var(--dl-surface));
        color: var(--dl-ui-color, var(--dl-text));
        font: var(--dl-ui-font-size, 13px)/1.6 var(--dl-font);
        box-shadow: var(--dl-ui-shadow, 0 8px 32px #0004);
        overflow-wrap: anywhere;
      }
    `,
  ],
})
export class FloatingPanel {
  readonly text = input("");
  readonly template = input<TemplateRef<unknown> | null>(null);
  readonly styles = input<Record<string, string>>({});
  readonly id = input("");
  readonly role = input<"tooltip" | "dialog">("tooltip");
  readonly label = input("Popover");
}
