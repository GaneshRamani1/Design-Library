import { ChangeDetectionStrategy, Component, input } from "@angular/core";
@Component({
  selector: "dl-card",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@if (heading()) {
      <header>
        <h3>{{ heading() }}</h3>
        @if (description()) {
          <p>{{ description() }}</p>
        }
      </header>
    }
    <ng-content />`,
  styles: [
    `
      :host {
        display: block;
        background: var(--dl-surface, #fff);
        border: 1px solid var(--dl-border, #dce2da);
        border-radius: 14px;
        padding: 24px;
        color: var(--dl-text, #202a24);
        font-family: var(--dl-font, sans-serif);
      }
      header {
        margin-bottom: 20px;
      }
      h3 {
        font-size: 17px;
        margin: 0 0 6px;
        font-weight: 600;
        letter-spacing: -0.4px;
      }
      p {
        font-size: 13px;
        color: var(--dl-muted, #647068);
        line-height: 1.6;
        margin: 0;
      }
    `,
  ],
})
export class CardComponent {
  readonly heading = input("");
  readonly description = input("");
}
