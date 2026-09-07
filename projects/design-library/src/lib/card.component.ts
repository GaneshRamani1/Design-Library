import { Appearance } from "./shared/appearance";
import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
@Component({
  selector: "dl-card",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { "[attr.data-surface]": "surface()", "[attr.data-layout]": "layout()", "[style.--dl-card-rail-width]": "railWidth()", "[style.--dl-card-preview-min-height]": "previewMinHeight()", "[attr.data-interactive]": "interactive() || null", "[attr.role]": "interactive() ? 'button' : role() || null", "[attr.tabindex]": "interactive() && !disabled() ? 0 : null", "[attr.aria-disabled]": "interactive() && disabled() || null", "[attr.aria-busy]": "loading() || null", "(click)": "activate($event)", "(keydown.enter)": "activate($event)", "(keydown.space)": "$event.preventDefault(); activate($event)" },
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
    @if(loading()){<div class="state" role="status"><ng-content select="[cardLoading]" />{{loadingLabel()}}</div>}@else if(error()){<div class="state error" role="alert"><ng-content select="[cardError]" />{{error()}}</div>}@else if(empty()){<div class="state"><ng-content select="[cardEmpty]" />{{emptyText()}}</div>}@else if(layout()==='showcase'){
      <div class="showcase">
        <aside><ng-content select="[cardRail]" /></aside>
        <div class="showcase-main">
          <section class="preview"><ng-content select="[cardPreview]" /></section>
          @if(showGuidance()){<section class="guidance"><ng-content select="[cardGuidance]" /></section>}
          @if(showCode()){<section class="code"><ng-content select="[cardCode]" /></section>}
        </div>
      </div>
    }@else{<ng-content />}
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
      :host([data-layout="showcase"]){padding:0;overflow:hidden}
      :host([data-layout="showcase"])>header{padding:24px;margin:0;border-bottom:1px solid var(--dl-border)}
      .showcase{display:grid;grid-template-columns:minmax(180px,var(--dl-card-rail-width,260px)) minmax(0,1fr)}
      .showcase>aside{padding:24px;border-right:1px solid var(--dl-border);background:color-mix(in srgb,var(--dl-surface) 72%,transparent)}
      .showcase-main{min-width:0}.preview{display:grid;min-height:var(--dl-card-preview-min-height,240px);place-items:center;padding:24px;background-image:linear-gradient(var(--dl-border) 1px,transparent 1px),linear-gradient(90deg,var(--dl-border) 1px,transparent 1px);background-size:24px 24px}
      .guidance,.code{padding:20px;border-top:1px solid var(--dl-border)}
      :host([data-layout="showcase"])>footer{margin:0;padding:20px 24px;border-top:1px solid var(--dl-border)}
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
      @media(max-width:760px){.showcase{grid-template-columns:1fr}.showcase>aside{border-right:0;border-bottom:1px solid var(--dl-border)}.preview{min-height:min(var(--dl-card-preview-min-height,240px),55vh)}}
    `,
  ],
})
export class CardComponent extends Appearance {
  readonly showHeader = input(true);
  readonly showFooter = input(false);
  readonly headingLevel = input<2 | 3 | 4>(3);
  readonly surface = input<"glass" | "solid" | "transparent">("glass");
  /** Switches from a standard content surface to a responsive documentation/demo composition. */
  readonly layout = input<"default" | "showcase">("default");
  readonly railWidth = input("260px");
  readonly previewMinHeight = input("240px");
  readonly showGuidance = input(true);
  readonly showCode = input(true);
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
