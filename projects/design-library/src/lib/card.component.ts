import { Appearance } from "./shared/appearance";
import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
@Component({
  selector: "dl-card",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { "[attr.data-surface]": "surface()", "[attr.data-interactive]": "interactive() || null", "[attr.role]": "interactive() ? 'button' : role() || null", "[attr.tabindex]": "interactive() && !disabled() ? 0 : null", "[attr.aria-disabled]": "interactive() && disabled() || null", "[attr.aria-busy]": "loading() || null", "(click)": "activate($event)", "(keydown.enter)": "activate($event)", "(keydown.space)": "$event.preventDefault(); activate($event)" },
  template: `@if (showHeader() && heading()) {
      <header>
        @switch (headingLevel()) {
          @case (2) {
            <h2>{{ heading() }}</h2>
          }
          @case (4) {
            <h4>{{ heading() }}</h4>
          }
          @default {
            <h3>{{ heading() }}</h3>
          }
        }
        @if (description()) {
          <p>{{ description() }}</p>
        }
      </header>
    }
    @if(loading()){<div class="state" role="status"><ng-content select="[cardLoading]" />{{loadingLabel()}}</div>}@else if(error()){<div class="state error" role="alert"><ng-content select="[cardError]" />{{error()}}</div>}@else if(empty()){<div class="state"><ng-content select="[cardEmpty]" />{{emptyText()}}</div>}@else{<ng-content />}
    @if (showFooter()) {
      <footer><ng-content select="[cardFooter]" /></footer>
    }`,
  styles: [
    `
      :host {
        display: block;
        background-color: var(--dl-ui-background, var(--dl-card-surface, #fff));
        background-image: var(--dl-card-sheen, none);
        backdrop-filter: var(--dl-card-blur, none);
        -webkit-backdrop-filter: var(--dl-card-blur, none);
        box-shadow: var(--dl-ui-shadow, var(--dl-card-shadow, none));
        border: var(--dl-ui-border-width, 1px) solid
          var(--dl-ui-border-color, var(--dl-card-border, #dce2da));
        border-radius: var(--dl-ui-radius, var(--dl-card-radius, 14px));
        padding: var(--dl-ui-padding, 24px);
        color: var(--dl-ui-color, var(--dl-text, #202a24));
        font-family: var(--dl-font, sans-serif);
      }
      :host([data-surface="solid"]) {
        background: var(--dl-ui-background, var(--dl-surface));
        backdrop-filter: none;
      }
      :host([data-surface="transparent"]) {
        background: var(--dl-ui-background, transparent);
        box-shadow: var(--dl-ui-shadow, none);
        backdrop-filter: none;
      }
      footer {
        margin-top: 20px;
        padding-top: 16px;
        border-top: 1px solid var(--dl-border);
      }
      header {
        margin-bottom: 20px;
      }
      h2,
      h3,
      h4 {
        margin: 0 0 6px;
        font-weight: 600;
        letter-spacing: -0.4px;
      }
      h2 {
        font-size: var(--dl-ui-font-size, 22px);
      }
      h3 {
        font-size: var(--dl-ui-font-size, 18px);
      }
      h4 {
        font-size: var(--dl-ui-font-size, 15px);
      }
      p {
        font-size: var(--dl-ui-font-size, 13px);
        color: var(--dl-ui-color, var(--dl-muted, #647068));
        line-height: 1.6;
        margin: 0;
      }
      .state{min-height:80px;display:grid;place-items:center;color:var(--dl-muted);text-align:center}.error{color:var(--dl-danger-text)}
      :host([data-interactive="true"]){cursor:pointer}:host([data-interactive="true"]):focus-visible{outline:2px solid var(--dl-ui-focus-color,var(--dl-focus));outline-offset:3px}:host([aria-disabled="true"]){opacity:.55;cursor:not-allowed}
    `,
  ],
})
export class CardComponent extends Appearance {
  readonly showHeader = input(true);
  readonly showFooter = input(false);
  readonly headingLevel = input<2 | 3 | 4>(3);
  readonly surface = input<"glass" | "solid" | "transparent">("glass");
  readonly heading = input("");
  readonly description = input("");
  readonly role = input("");
  readonly interactive = input(false);
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly loadingLabel = input("Loading");
  readonly error = input("");
  readonly empty = input(false);
  readonly emptyText = input("No content available");
  readonly activated = output<Event>();
  activate(event: Event): void {
    if (this.interactive() && !this.disabled() && !this.loading()) this.activated.emit(event);
  }
}
