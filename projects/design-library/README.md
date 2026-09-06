# Arcwell UI — Angular Design Library

A themeable Angular 22 library with eight exported standalone components and a Storybook 10 catalog. Includes interactive controls, generated documentation, accessibility inspection, and GitHub Pages CI.

## Develop

Use Node 24.15+ (see `.nvmrc`).

```sh
nvm use
npm ci
npm start
```

Storybook opens at http://localhost:6006. The Welcome story is a responsive, interactive component showcase. Component documentation includes source examples and controls.

## Export and use components

```sh
npm run pack:library
```

Install the generated tarball in an Angular 22 application:

```sh
npm install /path/to/Design-Library/dist/arcwell-ui-0.1.0.tgz
```

Add the shared theme to your application's global CSS:

```css
@import "@arcwell/ui/styles.css";
```

Then import the standalone components:

```ts
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonComponent, InputComponent, ToggleComponent } from "@arcwell/ui";

@Component({
  selector: "app-example",
  standalone: true,
  imports: [FormsModule, ButtonComponent, InputComponent, ToggleComponent],
  template: `
    <dl-input
      id="contact-email"
      label="Email address"
      type="email"
      [(ngModel)]="email"
    />
    <dl-toggle label="Send updates" [(ngModel)]="updates" />
    <button dlButton (click)="save()">Save preferences</button>
  `,
})
export class ExampleComponent {
  email = "";
  updates = true;
  save() {
    console.log({ email: this.email, updates: this.updates });
  }
}
```

| Export              | Selector           | Features                                            |
| ------------------- | ------------------ | --------------------------------------------------- |
| `ButtonComponent`   | `button[dlButton]` | Four variants, three sizes, disabled/loading states |
| `InputComponent`    | `dl-input`         | Label, hint, error, required state, Angular forms   |
| `ToggleComponent`   | `dl-toggle`        | Native keyboard interaction, Angular forms          |
| `BadgeComponent`    | `dl-badge`         | Five semantic tones                                 |
| `CardComponent`     | `dl-card`          | Heading, description, projected content             |
| `AlertComponent`    | `dl-alert`         | Four tones, status/alert semantics                  |
| `AvatarComponent`   | `dl-avatar`        | Initials from a name, three sizes                   |
| `ProgressComponent` | `dl-progress`      | Accessible percentage, clamped values               |

Input and toggle implement `ControlValueAccessor` and also work with reactive forms. Each input requires a unique, stable `id` and a visible `label`. Validation is controlled by the consuming form; pass a message to `error` when appropriate.

## Theme

Override `--dl-primary`, `--dl-primary-hover`, `--dl-primary-soft`, `--dl-text`, `--dl-muted`, `--dl-border`, `--dl-surface`, `--dl-background`, `--dl-radius`, `--dl-focus`, and `--dl-font` in your global `:root` selector. Recheck contrast for custom colors. The default typeface uses local system fonts with no remote font dependency.

## Verify

```sh
npm run check                    # Type checking, Angular package, static Storybook
npx playwright install chromium  # Once per machine
npm test                         # Browser interaction checks against static Storybook
```

## Publish to GitHub Pages

1. Push this project to GitHub on `main`.
2. In **Settings → Pages → Build and deployment**, select **GitHub Actions**.
3. The included `.github/workflows/pages.yml` builds, checks, tests, and deploys Storybook. You can also run the workflow manually.

The expected URL for this repository is https://ganeshramani1.github.io/Design-Library/. Storybook's static output supports the repository subpath; there is no Angular router base-path configuration to maintain. Pull requests run validation without deploying.

GitHub Pages hosts the catalog; the Angular package is built separately in `dist/design-library` and uploaded as a CI artifact. To publish to npm, first choose a package name/scope you own in `projects/design-library/package.json`, rebuild, and run `npm publish ./dist/design-library`. The default `@arcwell/ui` name is a placeholder; no registry publication is performed automatically.

Framework references: [Angular version compatibility](https://angular.dev/reference/versions), [Storybook for Angular](https://storybook.js.org/docs/get-started/frameworks/angular).
