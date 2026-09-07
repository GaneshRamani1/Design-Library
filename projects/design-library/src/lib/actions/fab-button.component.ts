import { Component, input } from "@angular/core";
import { ButtonComponent, buttonStyles } from "../button.component";
import { IconComponent } from "../icons/icon.component";
@Component({
  selector: "button[dlFab]",
  standalone: true,
  imports: [IconComponent],
  template: `<dl-icon
      [name]="loading() ? 'loader-circle' : icon() || 'plus'"
      [size]="iconSize()"
      [spin]="loading()"
    />
    @if (extended()) {
      <span>{{ label() }}</span>
    }`,
  host: {
    "[attr.aria-label]": "label()",
    "[class.extended]": "extended()",
    "[class.collapse-mobile]": "collapseOnMobile()",
    "[style.position]": "placement()==='inline'?'relative':'fixed'",
    "[style.bottom]": "placement()==='inline'?null:bottomOffset()",
    "[style.right]": "placement()==='bottom-right'?offset():null",
    "[style.left]": "placement()==='bottom-left'?offset():null",
    "[style.z-index]": "zIndex()",
  },
  styles: [
    buttonStyles,
    `
      :host {
        box-sizing: border-box;
        border-radius: var(--dl-ui-radius, 18px);
        min-width: 56px;
        height: 56px;
        padding: var(--dl-ui-padding, 16px);
        box-shadow: var(--dl-ui-shadow, 0 8px 24px #0004);
        gap: var(--dl-ui-gap, 12px);
      }
      :host([data-size="sm"]) {
        min-width: 40px;
        height: 40px;
        padding: var(--dl-ui-padding, 8px);
      }
      :host([data-size="lg"]) {
        min-width: 72px;
        height: 72px;
        padding: var(--dl-ui-padding, 24px);
      }
      :host(.extended) {
        padding-inline: var(--dl-ui-padding, 24px);
      }
      @media(max-width:600px){:host(.collapse-mobile) span{display:none}:host(.collapse-mobile){padding-inline:var(--dl-ui-padding,16px)}}
    `,
  ],
})
export class FabButtonComponent extends ButtonComponent {
  readonly label = input.required<string>();
  readonly extended = input(false);
  readonly iconSize = input(24);
  readonly placement = input<"inline" | "bottom-right" | "bottom-left">(
    "inline",
  );
  readonly offset = input("24px");
  readonly zIndex = input(100);
  readonly safeArea = input(true);
  readonly collapseOnMobile = input(false);
  bottomOffset(): string {
    return this.safeArea() ? `calc(${this.offset()} + env(safe-area-inset-bottom, 0px))` : this.offset();
  }
}
