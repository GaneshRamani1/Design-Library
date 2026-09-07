import { Component, input, output } from "@angular/core";
import { ButtonComponent, buttonStyles } from "../button.component";
import { IconComponent } from "../icons/icon.component";
/** A native icon-only button; label is required for assistive technology. */
@Component({
  selector: "button[dlIconButton]",
  standalone: true,
  imports: [IconComponent],
  template: `<dl-icon
    [name]="loading() ? 'loader-circle' : icon() || 'plus'"
    [size]="iconSize()"
    [strokeWidth]="strokeWidth()"
    [spin]="loading()"
  />`,
  host: {
    "[attr.aria-label]": "label()",
    "[attr.aria-pressed]": "pressed()",
    "(click)": "togglePressed()",
    "[style.border-radius]":
      "appearance().radius ?? (shape()==='circle'?'50%':'var(--dl-radius)')",
  },
  styles: [
    buttonStyles,
    `
      :host {
        box-sizing: border-box;
        padding: var(--dl-ui-padding, 0) !important;
        width: 44px;
        height: 44px;
        flex-shrink: 0;
        box-shadow: var(--dl-ui-shadow, none);
      }
      :host([data-size="sm"]) {
        width: 36px;
        height: 36px;
      }
      :host([data-size="lg"]) {
        width: 52px;
        height: 52px;
      }
    `,
  ],
})
export class IconButtonComponent extends ButtonComponent {
  readonly label = input.required<string>();
  readonly iconSize = input(20);
  readonly strokeWidth = input(2);
  readonly shape = input<"circle" | "rounded">("rounded");
  readonly pressed = input<boolean | null>(null);
  /** Requests the next controlled pressed state for toggle-style icon buttons. */
  readonly pressedChange = output<boolean>();
  togglePressed(): void {
    if (this.pressed() === null || this.disabled() || this.loading()) return;
    this.pressedChange.emit(!this.pressed());
  }
}
