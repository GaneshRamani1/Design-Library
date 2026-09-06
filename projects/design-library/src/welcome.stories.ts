import { Component, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import type { Meta, StoryObj } from "@storybook/angular";
import {
  ButtonComponent,
  BadgeComponent,
  CardComponent,
  InputComponent,
  ToggleComponent,
  AlertComponent,
  AvatarComponent,
  ProgressComponent,
} from "./public-api";

@Component({
  selector: "dl-welcome",
  standalone: true,
  imports: [
    FormsModule,
    ButtonComponent,
    BadgeComponent,
    CardComponent,
    InputComponent,
    ToggleComponent,
    AlertComponent,
    AvatarComponent,
    ProgressComponent,
  ],
  template: ` <main class="page">
    <nav class="top">
      <a
        class="brand"
        href="./?path=/story/welcome-overview--default"
        target="_top"
        ><span class="mark">f</span> forma<span class="brand-sub"
          >DESIGN SYSTEM</span
        ></a
      >
      <div class="top-right">
        <span class="version">v0.1.0</span
        ><a
          href="https://github.com/GaneshRamani1/Design-Library"
          target="_blank"
          rel="noreferrer"
          >GitHub ↗</a
        >
      </div>
    </nav>
    <section class="hero">
      <div class="eyebrow">
        <span></span> BUILT FOR ANGULAR. DESIGNED FOR PEOPLE.
      </div>
      <h1>Good interfaces start<br />with <em>great foundations.</em></h1>
      <p>
        A considered collection of flexible, accessible components.<br />Less
        starting from scratch. More making it yours.
      </p>
      <div class="hero-actions">
        <a
          class="primary-link"
          href="./?path=/docs/components-button--documentation"
          target="_top"
          >Explore components <span>↗</span></a
        ><a
          href="./?path=/story/foundations-getting-started--installation"
          target="_top"
          class="text-link"
          >Get started <span>→</span></a
        >
      </div>
      <div class="hero-art" aria-hidden="true">
        <div class="art-grid"></div>
        <div class="orbit orbit-one"></div>
        <div class="orbit orbit-two"></div>
        <div class="art-tile tile-back"></div>
        <div class="art-tile tile-front"><span>f</span></div>
        <span class="art-dot dot-one"></span
        ><span class="art-dot dot-two"></span>
        <div class="art-caption">LESS FRICTION. MORE FORMA.</div>
      </div>
    </section>
    <div class="features">
      <span><i>◈</i> 8 standalone components</span
      ><span><i>⌘</i> Fully typed APIs</span
      ><span><i>◉</i> Accessible by design</span
      ><span><i>↗</i> Ready to export</span>
    </div>
    <section class="collection">
      <div class="section-head">
        <div>
          <div class="eyebrow subtle">THE BUILDING BLOCKS</div>
          <h2>Small pieces. Endless possibilities.</h2>
        </div>
        <span class="count">COMPONENT PREVIEW <span>08</span></span>
      </div>
      <div class="grid">
        <article class="specimen">
          <div class="specimen-title">
            <span>Buttons</span
            ><a
              href="./?path=/docs/components-button--documentation"
              target="_top"
              aria-label="Button documentation"
              >↗</a
            >
          </div>
          <div class="button-demo">
            <button dlButton (click)="saved.set(!saved())">
              {{ saved() ? "Saved ✓" : "Create project + " }}</button
            ><button dlButton variant="secondary" (click)="saved.set(false)">
              Cancel</button
            ><button
              dlButton
              variant="ghost"
              size="sm"
              (click)="details.set(!details())"
            >
              {{ details() ? "Hide details ↑" : "View details →" }}
            </button>
          </div>
          <p>
            {{
              details()
                ? "Primary, secondary, ghost, and danger. Three sizes."
                : "A clear next step, in every context."
            }}
          </p>
          <div class="specimen-foot">
            <code>dlButton</code><dl-badge tone="success">Stable</dl-badge>
          </div>
        </article>
        <article class="specimen">
          <div class="specimen-title">
            <span>Form inputs</span
            ><a
              href="./?path=/docs/components-input--documentation"
              target="_top"
              aria-label="Input documentation"
              >↗</a
            >
          </div>
          <div class="input-demo">
            <dl-input
              id="welcome-email"
              label="Email address"
              placeholder="you@company.com"
              type="email"
              [(ngModel)]="email"
            />
          </div>
          <p>Make every interaction feel effortless.</p>
          <div class="specimen-foot">
            <code>dl-input</code><dl-badge tone="success">Stable</dl-badge>
          </div>
        </article>
        <article class="specimen">
          <div class="specimen-title">
            <span>Badges</span
            ><a
              href="./?path=/docs/components-badge--documentation"
              target="_top"
              aria-label="Badge documentation"
              >↗</a
            >
          </div>
          <div class="badge-demo">
            <dl-badge tone="success">● Published</dl-badge
            ><dl-badge tone="warning">In progress</dl-badge
            ><dl-badge tone="info">New feature</dl-badge
            ><dl-badge>Draft</dl-badge>
          </div>
          <p>A little context goes a long way.</p>
          <div class="specimen-foot">
            <code>dl-badge</code><dl-badge tone="success">Stable</dl-badge>
          </div>
        </article>
        <article class="specimen">
          <div class="specimen-title">
            <span>Avatars</span
            ><a
              href="./?path=/docs/components-avatar--documentation"
              target="_top"
              aria-label="Avatar documentation"
              >↗</a
            >
          </div>
          <div class="avatar-demo">
            <div class="avatar-stack">
              <dl-avatar name="Alex Morgan" /><dl-avatar
                name="Sam Chen"
              /><dl-avatar name="Jordan Lee" /><dl-avatar name="Taylor Kim" />
            </div>
            <div>
              <strong>Better, together.</strong
              ><small>A place for everyone on your team.</small>
            </div>
          </div>
          <p>Give your product a human touch.</p>
          <div class="specimen-foot">
            <code>dl-avatar</code><dl-badge tone="success">Stable</dl-badge>
          </div>
        </article>
        <article class="specimen">
          <div class="specimen-title">
            <span>Toggles</span
            ><a
              href="./?path=/docs/components-toggle--documentation"
              target="_top"
              aria-label="Toggle documentation"
              >↗</a
            >
          </div>
          <div class="toggle-demo">
            <dl-toggle
              label="Email notifications"
              [(ngModel)]="notifications"
            /><dl-toggle label="Weekly digest" [(ngModel)]="digest" />
          </div>
          <p>Simple choices. Instant feedback.</p>
          <div class="specimen-foot">
            <code>dl-toggle</code><dl-badge tone="success">Stable</dl-badge>
          </div>
        </article>
        <article class="specimen">
          <div class="specimen-title">
            <span>Progress</span
            ><a
              href="./?path=/docs/components-progress--documentation"
              target="_top"
              aria-label="Progress documentation"
              >↗</a
            >
          </div>
          <div class="progress-demo">
            <dl-progress label="Your workspace is taking shape" [value]="64" />
          </div>
          <p>Keep people moving in the right direction.</p>
          <div class="specimen-foot">
            <code>dl-progress</code><dl-badge tone="success">Stable</dl-badge>
          </div>
        </article>
      </div>
      <div class="bottom-grid">
        <article class="wide-specimen">
          <div class="specimen-title">
            <span>Alerts <code>dl-alert</code></span
            ><a
              href="./?path=/docs/components-alert--documentation"
              target="_top"
              aria-label="Alert documentation"
              >↗</a
            >
          </div>
          <dl-alert tone="success" heading="Everything is in sync"
            >Your latest changes are saved and ready to share.</dl-alert
          >
        </article>
        <article class="wide-specimen">
          <div class="specimen-title">
            <span>Cards <code>dl-card</code></span
            ><a
              href="./?path=/docs/components-card--documentation"
              target="_top"
              aria-label="Card documentation"
              >↗</a
            >
          </div>
          <dl-card
            heading="Your next idea starts here"
            description="A flexible space for content that belongs together."
          />
        </article>
      </div>
    </section>
    <footer>
      <span><b>forma</b> A foundation for what’s next.</span
      ><span
        >Angular 22 <span class="footer-dot">·</span> Storybook 10
        <span class="footer-dot">·</span> Made to be yours</span
      >
    </footer>
  </main>`,
  styles: [
    `
      :host {
        display: block;
        background: #f8f9f6;
        color: #26352b;
        font-family:
          Inter,
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      * {
        box-sizing: border-box;
      }
      a {
        color: inherit;
        text-decoration: none;
      }
      a:focus-visible {
        outline: 3px solid #3577b9;
        outline-offset: 4px;
      }
      .page {
        max-width: 1440px;
        margin: auto;
        padding: 0 52px;
      }
      .top {
        height: 86px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #e1e5dc;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 9px;
        font-size: 25px;
        font-weight: 700;
        letter-spacing: -1.1px;
      }
      .mark {
        width: 29px;
        height: 29px;
        background: #285b45;
        border-radius: 8px;
        color: #fff;
        display: grid;
        place-items: center;
        font-family: Georgia, serif;
        font-size: 30px;
        font-style: italic;
        line-height: 1;
      }
      .brand-sub {
        font-size: 9px;
        font-weight: 500;
        letter-spacing: 1.5px;
        margin-left: 14px;
        color: #748071;
      }
      .top-right {
        display: flex;
        align-items: center;
        gap: 22px;
        font-size: 12px;
      }
      .version {
        border: 1px solid #dce2d6;
        border-radius: 6px;
        padding: 4px 7px;
        color: #78826f;
        font-family: monospace;
        font-size: 10px;
      }
      .hero {
        position: relative;
        padding: 56px 0 42px;
        overflow: hidden;
      }
      .eyebrow {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 9px;
        letter-spacing: 1.6px;
        font-weight: 600;
      }
      .eyebrow > span {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #5b865d;
      }
      h1 {
        font-size: clamp(36px, 4.4vw, 61px);
        font-weight: 500;
        line-height: 1.13;
        letter-spacing: -2.8px;
        margin: 23px 0 18px;
      }
      h1 em {
        font-style: normal;
        color: #718468;
      }
      .hero p {
        font-size: 14px;
        line-height: 1.9;
        color: #748071;
        margin-bottom: 25px;
      }
      .hero-actions {
        display: flex;
        gap: 26px;
        align-items: center;
        font-size: 12px;
      }
      .primary-link {
        padding: 12px 17px;
        border-radius: 8px;
        background: #285b45;
        color: #fff;
        font-weight: 500;
        display: flex;
        gap: 24px;
      }
      .primary-link:hover {
        background: #1e4835;
      }
      .text-link {
        display: flex;
        gap: 14px;
      }
      .hero-art {
        position: absolute;
        right: 5px;
        top: 28px;
        width: 340px;
        height: 320px;
      }
      .art-grid {
        position: absolute;
        inset: 0;
        background-image: radial-gradient(#b9c4b0 1px, transparent 1px);
        background-size: 20px 20px;
        mask-image: radial-gradient(ellipse, #000, transparent 70%);
      }
      .orbit {
        position: absolute;
        border: 1px solid #d8e1d0;
        border-radius: 50%;
        width: 270px;
        height: 270px;
        left: 30px;
        top: 22px;
      }
      .orbit-two {
        width: 215px;
        height: 215px;
        left: 58px;
        top: 50px;
      }
      .art-tile {
        width: 136px;
        height: 147px;
        border-radius: 28px;
        position: absolute;
        left: 100px;
        top: 80px;
        transform: rotate(-13deg);
      }
      .tile-back {
        background: #d8e2c8;
        transform: rotate(14deg) translate(18px, -8px);
      }
      .tile-front {
        background: linear-gradient(135deg, #39624b, #204632);
        box-shadow: 0 18px 35px #264a3126;
        display: grid;
        place-items: center;
      }
      .tile-front span {
        font-family: Georgia, serif;
        font-style: italic;
        font-size: 122px;
        color: #e8efdc;
        line-height: 1;
        transform: translateY(-6px);
      }
      .art-dot {
        position: absolute;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #a7ba90;
        border: 3px solid #f8f9f6;
      }
      .dot-one {
        top: 62px;
        left: 60px;
      }
      .dot-two {
        right: 44px;
        bottom: 76px;
        width: 17px;
        height: 17px;
        background: #285b45;
      }
      .art-caption {
        position: absolute;
        bottom: 8px;
        width: 100%;
        text-align: center;
        font-size: 8px;
        letter-spacing: 2px;
        color: #87917d;
      }
      .features {
        display: flex;
        justify-content: space-between;
        border-top: 1px solid #e1e5dc;
        border-bottom: 1px solid #e1e5dc;
        padding: 20px 0;
        color: #64715f;
        font-size: 11px;
      }
      .features span {
        display: flex;
        align-items: center;
        gap: 9px;
      }
      .features i {
        font-size: 16px;
        font-style: normal;
        color: #6a7f61;
      }
      .collection {
        padding: 38px 0;
      }
      .section-head {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        margin-bottom: 25px;
      }
      .subtle {
        color: #89927f;
        font-size: 8px;
        letter-spacing: 1.6px;
      }
      h2 {
        font-size: 23px;
        font-weight: 500;
        letter-spacing: -0.8px;
        margin: 10px 0 0;
      }
      .count {
        font-size: 8px;
        letter-spacing: 1.2px;
        color: #858e7c;
      }
      .count span {
        margin-left: 7px;
        padding: 3px 5px;
        border: 1px solid #dce2d6;
        border-radius: 4px;
        font-family: monospace;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 16px;
      }
      .specimen {
        border: 1px solid #dfe4d9;
        border-radius: 12px;
        background: #fff;
        padding: 19px 20px 0;
        min-width: 0;
      }
      .specimen-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        font-weight: 600;
      }
      .specimen-title a {
        color: #8b9683;
        font-size: 16px;
      }
      .specimen > p {
        font-size: 10px;
        color: #84907e;
        margin: 0 0 19px;
        line-height: 1.5;
      }
      .button-demo,
      .input-demo,
      .badge-demo,
      .avatar-demo,
      .toggle-demo,
      .progress-demo {
        min-height: 116px;
        display: flex;
        align-items: center;
        align-content: center;
        gap: 8px;
        flex-wrap: wrap;
        padding: 20px 0;
      }
      .button-demo button {
        font-size: 11px;
        padding: 9px 12px;
      }
      .button-demo button:last-child {
        flex-basis: 100%;
        justify-content: flex-start;
        padding-left: 0;
      }
      .input-demo dl-input {
        width: 100%;
        min-width: 0;
      }
      .avatar-demo {
        gap: 12px;
      }
      .avatar-stack {
        display: flex;
        padding-left: 0;
      }
      .avatar-stack dl-avatar + dl-avatar {
        margin-left: -11px;
      }
      .avatar-stack dl-avatar:nth-child(2) {
        background: #e8dcd1;
        color: #8a6852;
      }
      .avatar-stack dl-avatar:nth-child(3) {
        background: #e0e5f0;
        color: #576b91;
      }
      .avatar-stack dl-avatar:nth-child(4) {
        background: #ece0e6;
        color: #91657d;
      }
      .avatar-demo strong {
        display: block;
        font-size: 11px;
        font-weight: 500;
      }
      .avatar-demo small {
        display: block;
        font-size: 9px;
        margin-top: 5px;
        color: #84907e;
      }
      .toggle-demo {
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        gap: 15px;
      }
      .progress-demo dl-progress {
        width: 100%;
        min-width: 0;
      }
      .specimen-foot {
        border-top: 1px solid #eff1ec;
        padding: 12px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      code {
        color: #8a937f;
        font:
          10px ui-monospace,
          monospace;
      }
      .specimen-foot dl-badge {
        font-size: 8px;
        padding: 2px 6px;
        background: #f0f5ec;
      }
      .bottom-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-top: 16px;
      }
      .wide-specimen {
        border: 1px solid #dfe4d9;
        background: #fff;
        border-radius: 12px;
        padding: 18px 20px;
      }
      .wide-specimen .specimen-title {
        margin-bottom: 17px;
      }
      .wide-specimen code {
        margin-left: 10px;
        font-weight: 400;
      }
      .wide-specimen dl-card {
        padding: 16px;
        background: #fafbf8;
      }
      .wide-specimen dl-alert {
        font-size: 11px;
      }
      footer {
        padding: 24px 0 28px;
        display: flex;
        justify-content: space-between;
        border-top: 1px solid #e1e5dc;
        font-size: 10px;
        color: #8a9381;
      }
      footer b {
        font-size: 16px;
        color: #54674e;
        margin-right: 14px;
        letter-spacing: -0.5px;
      }
      .footer-dot {
        margin: 0 9px;
        color: #a6af9e;
      }
      @media (min-width: 1400px) {
        .hero-art {
          right: 8%;
        }
      }
      @media (max-width: 1000px) {
        .page {
          padding: 0 28px;
        }
        .hero-art {
          width: 270px;
          right: -40px;
          opacity: 0.65;
        }
        .hero h1,
        .hero p,
        .hero-actions,
        .hero > .eyebrow {
          position: relative;
          z-index: 1;
        }
        .grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .hero-art {
          transform: scale(0.8);
          transform-origin: right center;
        }
        .features {
          gap: 14px;
          flex-wrap: wrap;
        }
      }
      @media (max-width: 650px) {
        .page {
          padding: 0 20px;
        }
        .brand-sub,
        .hero-art,
        .count {
          display: none;
        }
        .top {
          height: 70px;
        }
        .hero {
          padding: 35px 0;
        }
        h1 {
          font-size: 39px;
          letter-spacing: -1.8px;
        }
        .hero p {
          font-size: 13px;
        }
        .hero p br {
          display: none;
        }
        .features {
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-size: 9px;
        }
        .grid,
        .bottom-grid {
          grid-template-columns: 1fr;
        }
        h2 {
          font-size: 21px;
        }
        .specimen {
          padding: 18px 20px 0;
        }
        .specimen > p {
          font-size: 12px;
        }
        footer {
          gap: 16px;
          flex-direction: column;
        }
        .eyebrow {
          font-size: 8px;
          letter-spacing: 1px;
        }
      }
    `,
  ],
})
class WelcomeComponent {
  readonly saved = signal(false);
  readonly details = signal(false);
  email = "";
  notifications = true;
  digest = false;
}
const meta: Meta<WelcomeComponent> = {
  title: "Welcome/Overview",
  component: WelcomeComponent,
  parameters: { layout: "fullscreen", controls: { disable: true } },
};
export default meta;
export const Default: StoryObj<WelcomeComponent> = {};
