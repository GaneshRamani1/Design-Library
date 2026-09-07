# Arcwell UI — Angular Design Library

A themeable Angular 22 library with 26 exported standalone components and a Storybook 10 catalog. Includes interactive controls, generated documentation, accessibility inspection, and GitHub Pages CI.

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
npx playwright install chromium webkit  # Once per machine
npm test                         # Browser interaction checks against static Storybook
```

## Publish to GitHub Pages

1. Push this project to GitHub on `main`.
2. In **Settings → Pages → Build and deployment**, select **GitHub Actions**.
3. The included `.github/workflows/pages.yml` builds, checks, tests, and deploys Storybook. You can also run the workflow manually.

The expected URL for this repository is https://ganeshramani1.github.io/Design-Library/. Storybook's static output supports the repository subpath; there is no Angular router base-path configuration to maintain. Pull requests run validation without deploying.

GitHub Pages hosts the catalog; the Angular package is built separately in `dist/design-library` and uploaded as a CI artifact. To publish to npm, first choose a package name/scope you own in `projects/design-library/package.json`, rebuild, and run `npm publish ./dist/design-library`. The default `@arcwell/ui` name is a placeholder; no registry publication is performed automatically.

Framework references: [Angular version compatibility](https://angular.dev/reference/versions), [Storybook for Angular](https://storybook.js.org/docs/get-started/frameworks/angular).

## Light and dark themes

The catalog opens in dark mode. Use the **Light / Dark** toolbar menu to switch the overview, all components, documentation, and Storybook interface together.

In a consuming app, import `@arcwell/ui/styles.css` and set the theme on the document or a containing section:

```html
<html data-theme="dark"></html>
```

Use `data-theme="light"` for the light palette (the library default). Components inherit semantic CSS tokens, so sections can have their own theme and either palette can be customized.

## Layout

Storybook groups components under **Layout**, **Inputs**, **Actions**, **Data display**, and **Feedback**. The overview links to the new layout documentation and a complete reactive form playground.

| Export               | Selector       | Purpose                                                    |
| -------------------- | -------------- | ---------------------------------------------------------- |
| `ContainerComponent` | `dl-container` | Centered content with a maximum width                      |
| `SectionComponent`   | `dl-section`   | A page region; `label` gives it an accessible name         |
| `PaneComponent`      | `dl-pane`      | A glass, solid, or transparent panel with overflow control |

All three accept `stretch` (default `true`), `size` (`sm` 480px, `md` 768px, `lg` 1024px, `xl` 1280px, `full`), `layout` (`flex` or `block`), `direction`, `align`, `justify`, `wrap`, `gap`, `padding`, `height`, and `minHeight`. Numeric lengths are pixels; strings accept CSS lengths such as `20rem`, `100%`, and `auto`. Percentage heights need a parent with a defined height. Flex props apply when `layout="flex"`. Stretch fills available width and shares flex space; turn it off for content sizing. Pane additionally accepts `surface` and `overflow` (`auto`, `visible`, or `hidden`). The multi-select uses the native Popover API to escape panel clipping in modern browsers.

```html
<dl-container size="lg" [padding]="24">
  <dl-section label="Workspace" direction="row" [gap]="24" [padding]="0">
    <dl-pane [height]="320">Main content</dl-pane>
    <dl-pane size="sm" [height]="320">Details</dl-pane>
  </dl-section>
</dl-container>
```

## Selection inputs

| Export                     | Selector              | Form value                                            |
| -------------------------- | --------------------- | ----------------------------------------------------- |
| `DropdownComponent`        | `dl-dropdown`         | `string`                                              |
| `ContextSelectorComponent` | `dl-context-selector` | `string` (segmented context switch)                   |
| `RadioComponent`           | `dl-radio`            | `string`                                              |
| `ToggleComponent`          | `dl-toggle`           | `boolean`                                             |
| `MultiSelectComponent`     | `dl-multi-select`     | `string[]`                                            |
| `RangeSelectorComponent`   | `dl-range-selector`   | `number`, or `[number, number]` with `[range]="true"` |

The new controls accept a unique `id`, visible `label`, `hint`, `error`, `disabled`, `size` (`sm`, `md`, `lg`), and `stretch`. Choice controls accept `options: SelectOption[]`, with `{ value, label, description?, disabled? }`; values must be unique, nonempty strings. Dropdown also accepts `placeholder`, multi-select accepts `placeholder` and `searchable`, radio accepts `orientation`, and range accepts `min`, `max`, `step`, `range`, and `unit`.

Use `[(ngModel)]`, `[formControl]`, or `formControlName` to initialize and update values. `valueChange` reports user edits. Import `FormsModule` or `ReactiveFormsModule` alongside the standalone controls. Configure Angular validators on the bound form control and supply the resulting message to `error`; `required` marks choice inputs but does not add validators to the enclosing Angular form control. The existing toggle retains its `label` and `disabled` API.

```html
<dl-dropdown
  id="region"
  label="Region"
  [options]="regions"
  formControlName="region"
/>
<dl-multi-select
  id="teams"
  label="Teams"
  [options]="teams"
  formControlName="teams"
/>
<dl-range-selector
  id="budget"
  label="Budget"
  [range]="true"
  [min]="0"
  [max]="100"
  [step]="5"
  formControlName="budget"
/>
```

The multi-select uses a searchable checkbox disclosure: Tab moves through its controls, Space selects, Escape closes and returns focus, and clicking outside dismisses it. Context selectors and radios use native arrow-key navigation. The range selector uses one slider or separately labeled lower/upper sliders; user values stay within bounds, snap to the step, and cannot cross.

### Consistent field sizing

Text inputs, custom dropdowns, multi-select triggers, and context selectors share a sizing scale: `sm` is 36px high, `md` is 44px, and `lg` is 52px. Text inputs and both dropdown triggers use the same padding (7px 10px, 11px 12px, and 15px 16px), 20px line height, borders, and focus styling. Set the same `size` on related controls.

Dropdowns use a custom combobox and popover list rather than an OS-native picker. Use arrows, Home/End, or typing to navigate; Enter/Space selects, Escape cancels, and Tab moves on. Disabled choices are skipped. The optional placeholder choice clears a non-required field.

### Multi-select configuration

**Select all** and **Clear** are shown by default. Bulk actions update the Angular form and `valueChange` once per action. They skip disabled options; Clear preserves disabled preselected values. With a selection limit, Select all adds enabled options in their displayed order until the limit is reached. Programmatic form values are never silently truncated when a limit changes.

| Props                                                                     | Default                                       | Purpose                                                                                                                                              |
| ------------------------------------------------------------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `showSelectAll`, `showClear`, `showDone`, `showCount`, `showDescriptions` | `true`                                        | Independently show or hide actions, counts, and option descriptions                                                                                  |
| `selectAllLabel`, `clearLabel`, `doneLabel`                               | `Select all`, `Clear`, `Done`                 | Action text                                                                                                                                          |
| `bulkScope`                                                               | `all`                                         | Apply both bulk actions to all options or only `filtered` search results; selections outside filtered results remain unchanged                       |
| `maxSelected`                                                             | `null`                                        | Unlimited by default; a nonnegative integer caps new selections, including bulk additions. Existing selections can always be removed unless disabled |
| `searchable`                                                              | `true`                                        | Show search; disabling it shows all options                                                                                                          |
| `searchPlaceholder`, `searchLabel`                                        | `Search options…`, automatic accessible label | Search text and accessible name                                                                                                                      |
| `emptyText`                                                               | `No options found.`                           | Empty-results message                                                                                                                                |
| `selectedCountLabel`                                                      | `{count} selected`                            | Count text in the footer and count summary                                                                                                           |
| `limitMessage`                                                            | `You can select up to {limit} options.`       | Limit feedback; supports `{limit}` and `{count}`                                                                                                     |
| `summaryMode`, `labelSeparator`                                           | `labels`, `, `                                | Show selected labels or `count`, and choose how labels are separated                                                                                 |
| `optionsMaxHeight`                                                        | `220`                                         | Scrollable options height in pixels (minimum 44px)                                                                                                   |
| `menuWidth`                                                               | `null`                                        | Match the trigger by default, or set a width in pixels; the menu stays within the viewport                                                           |
| `closeOnSelect`                                                           | `false`                                       | Close after an individual or bulk change                                                                                                             |
| `resetSearchOnOpen`                                                       | `true`                                        | Clear the search each time the menu opens                                                                                                            |

`valueChange` emits all user selection edits. `selectAllChange` and `clearChange` additionally emit the resulting selected values for those actions. `searchChange` emits user-entered query text. The inherited `id`, `label`, `placeholder`, `size`, `stretch`, `disabled`, `required`, `hint`, and `error` props remain available.

```html
<dl-multi-select
  id="project-teams"
  label="Teams"
  [options]="teams"
  [maxSelected]="3"
  bulkScope="filtered"
  selectAllLabel="Select results"
  clearLabel="Clear results"
  summaryMode="count"
  selectedCountLabel="{count} teams chosen"
  [optionsMaxHeight]="260"
  [menuWidth]="360"
  [(ngModel)]="selectedTeams"
/>
```

Storybook includes **Filtered bulk actions**, **Selection limit**, **Count summary**, **Minimal**, **Custom labels**, **Close after selection**, and **Locked selection** examples, with controls for every public setting.

## Overlays, navigation, and new controls

Bottom sheets open at `90dvh` (90% of the dynamic viewport height) by default. Use the `height` input for a custom height.

| Export                        | Selector                               | Purpose                                                             |
| ----------------------------- | -------------------------------------- | ------------------------------------------------------------------- |
| `CheckboxComponent`           | `dl-checkbox`                          | Forms-compatible checkbox with indeterminate state                  |
| `CounterComponent`            | `dl-counter`                           | Bounded numeric input with increase/decrease buttons                |
| `SidepanelComponent`          | `dl-sidepanel`                         | CDK dialog positioned at a side of the viewport                     |
| `BottomSheetComponent`        | `dl-bottom-sheet`                      | CDK dialog positioned at the bottom                                 |
| `ConfirmationDialogComponent` | `dl-confirmation-dialog`               | An `alertdialog` with configurable confirmation actions             |
| `ModalComponent`              | `dl-modal`                             | Centered CDK dialog                                                 |
| `TabComponent`                | `dl-tab`                               | A tab label and projected panel                                     |
| `TabContainerComponent`       | `dl-tab-container`                     | Tab selection, orientation, keyboard navigation and panel lifecycle |
| `StepComponent`               | `dl-step`                              | Step label, content, completion, optional/disabled/error state      |
| `StepperContainerComponent`   | `dl-stepper-container` or `dl-stepper` | Step navigation and optional linear completion rules                |

`StepperComponent` is also exported as an alias of `StepperContainerComponent`. Tab and step values must be unique within their container. Both containers support `[(value)]`; tabs use arrow keys plus Home/End, automatic or manual activation, and optional retained panel state. Tab close events let the caller remove the corresponding projected tab. Linear steppers only permit forward navigation past completed or optional steps; disabled steps are skipped. `finished` reports completion without silently marking the caller's steps complete.

```html
<dl-tab-container label="Project" [(value)]="activeTab" variant="pill">
  <dl-tab value="overview" label="Overview">Overview content</dl-tab>
  <dl-tab value="activity" label="Activity" badge="3">Activity content</dl-tab>
</dl-tab-container>

<dl-stepper-container [(value)]="activeStep" [linear]="true">
  <dl-step value="account" label="Account" [completed]="accountValid"
    >Account form</dl-step
  >
  <dl-step value="review" label="Review" [completed]="reviewValid"
    >Review form</dl-step
  >
</dl-stepper-container>
```

### CDK overlay configuration

The library now requires `@angular/cdk` 22 as a peer dependency. Its structural overlay styles are included by `@arcwell/ui/styles.css`; import that stylesheet once. Dialogs use CDK focus trapping, autofocus, focus restoration and scroll strategies. On a click trigger, explicitly focus the triggering button before setting `open` if you need Safari to restore focus to that exact button (Safari does not focus buttons on mouse click by default).

```html
<button #launch (click)="launch.focus(); modalOpen = true">Open</button>
<dl-modal
  [(open)]="modalOpen"
  heading="Edit workspace"
  description="Changes apply to your team."
  size="lg"
  [closeOnBackdrop]="false"
  confirmLabel="Save"
  [closeOnConfirm]="false"
  [busy]="saving"
  (confirmed)="save()"
  (closed)="handleClose($event)"
>
  Your form or content
</dl-modal>
```

All four overlays expose:

- **State and accessibility:** `open`, `id`, `heading`, `description`, `ariaLabel`, `autoFocus`, `restoreFocus`.
- **Dimensions and placement:** `size`, `width`, `height`, `maxWidth`, `maxHeight`, `placement`, `padding`, `radius`.
- **Backdrop and scrolling:** `hasBackdrop`, `backdropClass`, `panelClass`, `scrollStrategy` (`block`, `noop`, or `reposition`). These structural options apply when opening.
- **Dismissal:** `closeOnBackdrop`, `closeOnEscape`, `showClose`, `closeLabel`. `busy` blocks user dismissal while work is pending; the caller can still set `open` to false.
- **Header and actions:** `showHeader`, `showFooter`, `showCancel`, `showConfirm`, `cancelLabel`, `confirmLabel`, `confirmVariant`, `confirmDisabled`, `closeOnConfirm`, and `busy`.
- **Events:** `openChange`, `confirmed`, `cancelled`, and `closed` with a typed close reason (`close`, `backdrop`, `escape`, `cancel`, `confirm`, `programmatic`, or `destroy`).

Use `[overlayFooter]` content for custom footer actions. When you hide built-in actions, provide another dismissal route unless the overlay is intentionally blocking. Custom CSS classes are caller-defined; default overlay styles remain available through `dl-overlay-panel` and `dl-overlay-backdrop`.

### Alert and badge states

Both offer `neutral`, `info`, `success`, `warning`, `danger`, and `custom`, each with its own story. Use `customBackground`, `customColor`, and `customBorder` for a custom palette. `variant` selects `soft`, `outline`, or `solid`; `size` selects `sm`, `md`, or `lg`.

Alerts also support configurable icons, heading, live announcement behavior, an action, and optional dismissal with `[(visible)]`. Badges support icons, a dot, pill shape, and removal with `[(visible)]`. Dismiss/remove actions emit their corresponding events.

### Per-instance appearance and exhaustive stories

Every component exposes `appearance` and `styleTokens`. Appearance fields are `padding`, `radius`, `borderWidth`, `borderColor`, `background`, `color`, `fontSize`, `gap`, `shadow`, and `focusColor`; CSS lengths include units. Use `styleTokens` to override individual CSS custom properties for a component and its descendants, including the shared field sizing and theme tokens. Styling does not remove semantic roles or keyboard behavior.

```html
<dl-card
  [appearance]="{ padding: '32px', radius: '24px', borderColor: '#a78bfa' }"
>
  Per-instance styling
</dl-card>
```

Every component follows the same sidebar order: **Configuration → Variations → Events → Appearance**. Configuration starts with an **Overview** and editable Controls, followed by setting folders for content, behavior, layout, states, validation, and accessibility as applicable. Variations contains the working examples and built-in tone/surface/variant choices. Events demonstrates actual outputs in Actions. Appearance comes last with theme tokens, custom styles, and individual visual overrides. Each setting story highlights its property and example value above the preview, and the note marks the current stage of the guide. Existing story URLs remain stable. The generator maintains this structure when new inputs or outputs are added.

Every story displays an explanation above the example, describing its purpose and what to try. Generated stories live in component-specific `stories/<component>/<category>/<setting>.stories.ts` folders; mask examples are grouped by use case.

The catalog includes a machine-readable coverage manifest at `projects/design-library/configuration-coverage.json`. Configuration stories are generated from the actual input/model/output declarations, including inherited APIs:

```sh
npm run stories:generate  # Refresh named configuration stories after changing APIs
npm run stories:check    # Fail if generated coverage is stale; also part of npm run check
```

Generated configuration stories live beside their main stories and are excluded from the default autodocs pages to keep those pages usable. Behavioral examples and configuration examples are both available in the sidebar.

## Notifications, anchored content, and utility components

The catalog now contains **44 standalone components and 5 directives**, with **2,157 generated setting stories**, plus behavioral examples and an SVG browser. The new additions retain the black/glass dark theme, light theme, shared appearance overrides, and field sizes.

| Export                      | Selector               | Key configuration                                                                                      |
| --------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------ |
| `ToastComponent`            | `dl-toast`             | Message, heading, six tones, icon, timer, progress, action, dismissal and live announcements           |
| `SnackbarComponent`         | `dl-snackbar`          | The same notification API in a wider, compact surface                                                  |
| `TooltipDirective`          | `[dlTooltip]`          | Text, hover/focus or manual trigger, placement, offset, delays, width and dismissal                    |
| `PopoverDirective`          | `[dlPopover]`          | Text or `TemplateRef`, click/hover/manual trigger, focus, placement and dismissal                      |
| `SkeletonComponent`         | `dl-skeleton`          | Loading state, text/rectangle/circle shape, dimensions, line count, gap, last-line width and animation |
| `ListComponent`             | `dl-list`              | Items, density, separators, descriptions, icons, metadata, disabled items and item click events        |
| `IconButtonComponent`       | `button[dlIconButton]` | Accessible label, SVG name, icon size, stroke, shape, pressed state and inherited button settings      |
| `FabButtonComponent`        | `button[dlFab]`        | SVG, extended label, inline/fixed placement, offset, elevation and inherited button settings           |
| `DividerComponent`          | `dl-divider`           | Orientation, label, thickness, color, solid/dashed/dotted line, inset and margin                       |
| `DatepickerComponent`       | `dl-datepicker`        | Locale, week start, date limits/filter, outside days, calendar width, labels and footer actions        |
| `ChipsComponent`            | `dl-chips`             | Display/selection mode, single/multiple selection, removable/disabled items and labels                 |
| `SegmentedButtonsComponent` | `dl-segmented-buttons` | Single/multiple selection, optional empty state, orientation, icons and disabled segments              |
| `IconComponent`             | `dl-icon`              | Registered name or direct SVG data, size, stroke, color, fill, label, rotation, flip and spin          |

All new components and directives have categorized setting stories for their public inputs, output events and individual appearance fields. Freeform values have editable representative examples; finite modes have individual stories.

### Toast and snackbar service

Import `@arcwell/ui/styles.css` once for CDK structural styles. Inject `NotificationService` to create notifications anywhere in the app; no notification outlet needs to be added to the application template.

```ts
import { inject } from "@angular/core";
import { NotificationService, provideNotifications } from "@arcwell/ui";

// Add to application providers when overriding defaults:
// provideNotifications({ maxVisible: 5, duration: 5000, position: 'top-right',
//                        gap: '12px', offset: '24px' })

const notifications = inject(NotificationService);
notifications.toast("Workspace saved.", {
  tone: "success",
  showProgress: true,
});
const notice = notifications.snackbar("Conversation archived.", {
  actionLabel: "Undo",
  duration: 8000,
});
notice.onAction.subscribe(() => undoArchive());
notice.afterDismissed.subscribe((reason) => console.log(reason));
// notice.dismiss(); notifications.clear();
```

Positions are `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, and `bottom-right`. Snackbars default to bottom-center. `duration: 0` keeps a message visible until dismissed. Hover pauses the timer when `pauseOnHover` is enabled; keyboard focus always pauses it. `closeOnAction: false` keeps the notification after its action. A repeated explicit `id` replaces the old message; reaching `maxVisible` dismisses the oldest notification with reason `overflow`. Notifications do not trap or move keyboard focus.

Standalone toast/snackbar components also expose `[(visible)]`, `(action)` and `(dismissed)`. The service options support message appearance, tone, heading/icon, action/dismiss labels, timer/progress, pause behavior and live announcements. `afterDismissed` and `onAction` complete when a notification is removed.

### Tooltip and popover directives

```html
<button dlButton dlTooltip="Saved automatically" placement="top">Save</button>
<button
  dlButton
  [dlPopover]="details"
  #popover="dlPopover"
  ariaLabel="Project details"
  placement="bottom-start"
>
  Details
</button>
<ng-template #details>
  <p>Any Angular content can be projected here.</p>
  <button dlButton (click)="popover.close()">Done</button>
</ng-template>
```

Tooltips open on hover and keyboard focus. They add their ID to the existing `aria-describedby` value and remove only their own ID when closed. Popovers are nonmodal dialogs; `autoFocus` optionally focuses their first interactive element, and Escape returns focus to the anchor when `restoreFocus` is enabled. Use `trigger="manual"` with `[(open)]` for application-controlled visibility. CDK repositions the panel while scrolling and tries a fallback placement at viewport edges. `disabled` prevents opening; when combined with a button component's `disabled` input it also disables that button. Tooltip content should be plain help text; use a popover template for controls.

### Programmatic popovers

Inject `PopoverService` to open text or an Angular `TemplateRef` beside an explicit `HTMLElement` or `ElementRef<HTMLElement>`:

```ts
import { inject, ViewContainerRef } from '@angular/core';
import { PopoverService } from '@arcwell/ui';

readonly popovers = inject(PopoverService);
readonly view = inject(ViewContainerRef);

showDetails(anchor: HTMLElement) {
  const ref = this.popovers.open(anchor, 'Workspace details', {
    placement: 'bottom-start',
    offset: 8,
    maxWidth: '320px',
    ariaLabel: 'Workspace details',
    viewContainerRef: this.view,
  });
  ref.afterClosed.subscribe(reason => console.log(reason));
  // ref.close(); ref.updatePosition();
}
```

`PopoverConfig` also supports `width`, `viewportMargin`, `panelClass`, `id`, `styles` (CSS custom properties), `autoFocus`, `restoreFocus`, `closeOnEscape`, and `closeOnOutside`. Placement supports top/bottom/left/right and top/bottom start/end alignment. The service defaults to bottom placement, 8px offset, 320px maximum width, 12px viewport margin, and enabled focus/dismissal behavior. `afterClosed` emits once with `api`, `escape`, `outside`, or `destroy`, then completes. `closeAll()` closes all service popovers; opening again on the same anchor replaces its previous panel. Pass the owning `ViewContainerRef` for automatic cleanup when that view is destroyed, or close the returned ref during your own teardown. Outside dismissal leaves focus at the clicked target.

Both directives and the service position against the trigger's viewport bounds, track ordinary nested scroll containers and viewport resizing, and choose the opposite side when space is insufficient. Call `updatePosition()` on the service ref after moving an anchor without resizing or scrolling it. See **Overlays → Popover directive → Service** and the **Nested Anchor** stories for working examples and Actions events.

### Datepicker, chips, and segmented buttons

All three support Angular reactive forms and `ngModel`, `valueChange`, disabled/touched state, labels, validation messages and shared `sm`/`md`/`lg` field sizing.

```html
<dl-datepicker
  id="start"
  label="Start date"
  [(ngModel)]="startDate"
  min="2026-09-01"
  max="2026-12-31"
  locale="en-GB"
  [weekStartsOn]="1"
  [disabledDates]="['2026-09-12']"
/>
<dl-chips
  id="topics"
  label="Topics"
  [options]="topics"
  [(ngModel)]="selectedTopics"
  (removed)="removeTopic($event)"
/>
<dl-segmented-buttons
  id="view"
  label="View"
  [options]="views"
  [(ngModel)]="selectedViews"
/>
```

The datepicker value is a local **`YYYY-MM-DD` string or `null`**; it never converts the selection through UTC. `dateFilter` accepts a function `(isoDate: string) => boolean`. Arrow keys move between enabled dates, Home/End move to week boundaries, Page Up/Down change months, and Shift + Page Up/Down changes years. Enter/Space chooses the focused date; Escape closes. Clear is disabled when `required` is true. `readOnly` keeps the trigger focusable without allowing editing.

Chips and segmented buttons use **`string[]` values in both single- and multiple-selection modes**. Chips emit `removed` so the caller can update its source `options`; removing a chip also removes its value from the form selection. Disabled chips cannot be selected or removed. Single segmented selection uses radio semantics and roving keyboard focus; multiple selection uses toggle buttons.

### SVG icons

Install the SVG data peer dependency alongside the library:

```sh
npm install @arcwell/ui @angular/cdk @lucide/icons
```

The library includes 22 common names by default. Register additional icons in application providers, or pass an imported icon directly to `[data]`:

```ts
import { Camera, Pencil } from "@lucide/icons";
import { provideIcons } from "@arcwell/ui";

// Application providers:
provideIcons({ camera: Camera, pencil: Pencil });
```

```html
<dl-icon name="camera" [size]="24" label="Camera" />
<button dlIconButton icon="heart" label="Add to favorites"></button>
<button dlFab icon="plus" label="Create project" [extended]="true"></button>
```

For the full local collection, use `provideIcons(ICON_CATALOG)` from `@arcwell/ui`. **1,807 unique Lucide SVGs** are available in the installed version; `ICON_NAMES` exposes the sorted names. The **Data display → Icon catalog → All Icons** story searches the entire collection, paginates the result, and shows the chosen component markup. Importing the complete catalog includes all of its SVG data; selective registration allows bundlers to remove unused icons. No remote icon requests or font loading are required.

Icons without `label` are decorative. Meaningful standalone icons need a label; icon-only buttons require one. Custom `IconData` uses the same typed SVG node format. Rendering accepts geometry elements and safe presentation attributes without inserting raw HTML. Missing names use the configurable fallback icon. Lucide's SVG data is provided under its [ISC license](https://github.com/lucide-icons/lucide/blob/main/LICENSE); see the [official package guide](https://lucide.dev/guide/packages/icons).

## Input masking

`dl-input` supports masks through [IMask](https://imask.js.org/guide.html). Install the `imask` peer dependency when consuming the library:

```sh
npm install imask
```

```html
<dl-input id="ssn" label="SSN" maskPreset="ssn" [(ngModel)]="ssn" />
<dl-input id="ein" label="EIN" maskPreset="ein" [(ngModel)]="ein" />
<dl-input
  id="tin"
  label="TIN"
  maskPreset="tin"
  tinType="business"
  [(ngModel)]="tin"
/>
<dl-input
  id="phone"
  label="Phone"
  maskPreset="phone-us"
  autocomplete="tel-national"
  [(ngModel)]="phone"
/>
<dl-input
  id="reference"
  label="Reference"
  mask="aaa-0000"
  maskCase="upper"
  [(ngModel)]="reference"
/>
```

| Preset                | Display format                                                            |
| --------------------- | ------------------------------------------------------------------------- |
| `ssn`, `itin`         | `000-00-0000`                                                             |
| `ein`                 | `00-0000000`                                                              |
| `tin`                 | Individual format by default; `tinType="business"` selects EIN formatting |
| `phone-us`            | `(000) 000-0000`                                                          |
| `phone-international` | `+` followed by 1–15 digits; use a custom mask for national grouping      |
| `zip`, `zip-plus4`    | `00000` / `00000-0000`                                                    |
| `card-16`             | Four groups of four digits                                                |
| `date`, `time`        | `00/00/0000` / `00:00` text patterns                                      |

These presets format text and validate **mask completeness**, not identifier issuance, phone reachability, card checksums, or calendar correctness. TIN is not a single universal format. Use the relevant preset or a custom pattern for the identifier you accept.

`maskValueMode="raw"` is the default: the form receives `000123456`, while the input displays `000-12-3456`. Set `maskValueMode="formatted"` to store separators as well. Placeholder-guide characters and obscuring characters are excluded from the form value. Programmatic writes and resets update the display without emitting user `maskAccept` or `maskComplete` events.

The controls work with `ngModel` and reactive forms. Nonempty incomplete values return a `mask` validation error; disable that check with `[maskValidate]="false"`. Empty values are left to your form's required validator. Surface `control.hasError('mask')` through the input's existing `error` property when appropriate.

Custom patterns use `0` for digits, `a` for letters, and `*` for alphanumeric characters. Square brackets make a section optional; escape pattern characters with `\` when they should be literals. A custom `mask` overrides `maskPreset`.

```html
<dl-input
  id="hex"
  label="Hex color"
  mask="#HHHHHH"
  [maskDefinitions]="{ H: '[0-9a-fA-F]' }"
  maskCase="upper"
/>
<dl-input
  id="extension"
  label="Phone with extension"
  mask="(000) 000-0000[ ext. 0000]"
  inputMode="tel"
/>
```

Fine-grained settings include `maskLazy`, `maskPlaceholderChar`, `maskOverwrite`, `maskEager`, `maskSkipInvalid`, `maskCase`, `maskDefinitions`, and `inputMode`. `maskOptions` exposes additional IMask pattern options and overrides the convenience settings. Masked fields use a selection-capable text input (or password input) and their mask controls length; `maxLength` continues to apply to unmasked fields.

`maskDisplayChar="•"` obscures entered characters visually. It does not encrypt or remove the raw value. `type="password"` uses the browser's password presentation instead. The Storybook examples intentionally show synthetic raw and formatted values so that bindings can be inspected.

`maskAccept` emits `{raw, formatted, complete}` after user edits; `maskComplete` emits on a transition to complete; `valueChange` emits the chosen form representation. **Inputs → Input → Mask examples** includes individual preset stories, custom definitions, optional extensions, formatted-model, visible-guide, obscured-character, overwrite, validation, size, read-only and disabled examples. Each mask setting also has a story under **Inputs → Input → Masking**.

### Inline and global notifications

Use `InlineNotificationComponent` beside related fields or content. Use `GlobalNotificationComponent` once in the application shell for announcements affecting the whole workspace.

```html
<dl-inline-notification
  tone="warning"
  heading="Update your payment method"
  message="Your saved card expires this month."
  actionLabel="Update card"
  (action)="openBilling()"
/>

<dl-global-notification
  tone="info"
  heading="Scheduled maintenance"
  message="The workspace will be read-only tonight."
  position="sticky"
  placement="top"
  offset="0px"
  [(visible)]="showMaintenance"
  (dismissed)="onDismiss($event)"
/>
```

Both support neutral, info, success, warning, danger and custom tones; soft, outline and solid variants; sizes; message and projected content; custom icons; action and dismiss labels; two-way visibility; live announcement modes; width, maximum width, inline or stacked layout; appearance overrides and theme tokens. They persist by default (`duration=0`) and actions keep them open (`closeOnAction=false`). Optional timers support progress and pause on hover or keyboard focus. Dismissal emits `close`, `action` or `timeout`.

Global banners additionally expose `position` (static, sticky or fixed), `placement` (top or bottom), `offset`, `zIndex` and `contentWidth`. Sticky placement follows the containing scroll area; fixed placement overlays the viewport, so reserve space in the application shell when necessary. Existing `NotificationService.toast()` and `.snackbar()` remain available for transient stacked notifications.

Browse **Feedback → Inline notification** and **Feedback → Global notification** for contextual examples and dedicated folders covering every public setting and event.

### Links and breadcrumbs

Import `LinkDirective` for native `<a dlLink>` navigation and `BreadcrumbComponent` for a labeled breadcrumb landmark.

```html
<a dlLink href="/workspace" underline="hover">View workspace</a>
<dl-breadcrumb
  [items]="[{label: 'Home', href: '/'}, {label: 'Workspace', href: '/workspace'}, {label: 'Settings'}]"
  separator="›"
  [maxItems]="3"
  (selected)="onNavigate($event)"
/>
```

Links expose href, target, rel, download, disabled state, accessible label/current location/tab order, size, tone, underline mode/offset, font weight, appearance and theme overrides. New-tab targets automatically include `noopener`. Disabled links remove their href and tab stop and block activation. The `activated` output receives the native mouse event; normal and modified clicks retain native browser behavior.

Breadcrumb items support label, href, icon, disabled, target and accessible label. The final item has `aria-current="page"` and is plain text unless `linkCurrent` is enabled. Customize separator, landmark label, icon visibility/size, typography, disabled state, collapse/expand labels and appearance. `maxItems=0` shows the full path; a positive limit (minimum three visible entries) shows the first location, expansion control and trailing locations. Expansion moves keyboard focus to a revealed link. The `selected` output includes item, original index and native event; `expanded` announces expansion. Use real href destinations for navigation; router-specific integration is not required.

Find contextual examples and individual setting stories under **Navigation → Link directive** and **Navigation → Breadcrumb**.

### Dashboard tiles

Import `TilesComponent` and use `dl-tiles` (or the `dl-tile` alias) for one analytics tile. Compose tiles in a CSS grid or layout container.

```html
<dl-tiles
  label="Revenue"
  value="48,250"
  prefix="$"
  tone="success"
  trend="12.8%"
  trendDirection="up"
  trendTone="success"
  comparison="vs. last month"
  [series]="[18, 25, 21, 32, 29, 42, 48]"
  chartLabel="Revenue over the past seven days"
  actionLabel="View report"
  (action)="openReport()"
/>
```

Configure labels, description, value/empty text, prefix/suffix, value typography, icon, sizes, dimensions and glass/solid/transparent surfaces. The five semantic tones plus custom colors style accents; soft/outline/solid variants style the icon treatment. Trend direction and sentiment are independent, so a decrease can be positive for metrics such as response time.

History charts accept numeric series, a descriptive accessible label, color, height, stroke width and optional area fill. Empty histories hide the chart; flat histories stay level; a single observation renders as a point. Non-finite observations are ignored. Optional goal progress clamps to 0–100 and exposes its value to assistive technology.

Loading shows a skeleton and disables the action. Errors replace stale data and can pair with a retry action. Header/value/icon/trend/chart/progress/footer visibility, action labels and variants, footer text, projected body and `[tileFooter]` content are configurable. Shared `appearance` and `styleTokens` control spacing, corners, borders, colors, typography, shadows and focus styling.

See **Data display → Tiles → Dashboard** for a responsive dashboard, with individual setting stories in the adjacent folders.

### Responsive layouts

The catalog is checked at 320px phone and 768px tablet widths, with portrait and landscape tests for menus and overlays. Use flexible parent layouts (for example, `repeat(auto-fit, minmax(min(100%, 240px), 1fr))`) to arrange dashboard tiles and cards.

At widths up to 600px, vertical tabs and steppers place their navigation above the panel while retaining their configured keyboard orientation. Horizontal segmented choices scroll within the control when their labels need more room. Toast and snackbar actions wrap below their message on narrow screens. Dialog content scrolls within available space; bottom sheets retain their 90dvh default.

Dropdown and calendar panels resize/reposition with the visual viewport, including viewport changes from a software keyboard or zoom. Popovers keep a viewport margin. Touch-phone input text defaults to 16px to avoid focus zoom, while field heights retain their configured size. Override `--dl-mobile-input-font-size` only when needed.

Explicit custom dimensions, projected content and application layouts still need to fit their parent. The library does not hide page overflow to conceal oversized content. Code samples in the installation guide scroll within their own container.

### Storybook Actions and component outputs

Open the **Actions** panel and interact with any default, setting or event story. All 68 declared component/directive outputs are observed, including inherited outputs and model change events. Entries use `ComponentName.outputName` and show the actual emitted payload. Native button clicks appear as `ButtonComponent.click`, `IconButtonComponent.click` or `FabButtonComponent.click`.

Each output has a dedicated **Events → Output name** story. Dismiss, remove, expand, mask completion and close examples enable the relevant control so the event can be exercised. Logging also covers nested form examples and notification-service ref callbacks; existing form state, counters and demo handlers keep running.

Outputs are observed independently of input Controls. An input update from Controls or a parent does not automatically emit a change event; the component must actually emit it. For example, closing a dialog emits `openChange`, while setting its `open` input from the parent does not.

The Toggle now exposes `valueChange: boolean` on user interaction, matching the other form controls. Programmatic ControlValueAccessor writes do not emit it.

Story-only observers are generated from the component declarations by `npm run stories:generate` and checked by `npm run stories:check`. They are imported only by Storybook and its standalone demo components, not by the published library. Components with no declared outputs do not receive artificial events.

### Custom form validation

Import `ValidationDirective` alongside your control. It works with reactive forms and `ngModel`, including text inputs, dropdowns and checkboxes. Pass Angular `ValidatorFn` / `AsyncValidatorFn` arrays, or use validators already installed on the form control. The directive adds its validators without replacing the existing ones and removes its own rules when bindings change or the directive is destroyed.

```ts
import { FormControl, Validators, type ValidatorFn } from "@angular/forms";
import { InputComponent, ValidationDirective } from "@arcwell/ui";

const companyEmail: ValidatorFn = (control) =>
  !control.value || String(control.value).endsWith("@example.com")
    ? null
    : { companyEmail: true };

// Component members; import InputComponent, ValidationDirective and ReactiveFormsModule.
email = new FormControl("", Validators.required);
emailValidators = [companyEmail];
emailMessages = {
  required: "Enter your work email.",
  companyEmail: "Use your @example.com address.",
};
```

```html
<dl-input
  label="Work email"
  [formControl]="email"
  [dlValidation]="true"
  [validators]="emailValidators"
  [validationMessages]="emailMessages"
  validationDisplay="popover"
  validationWhen="touched"
  (validationChange)="onValidationChange($event)"
/>
```

Use `[dlValidation]="true"` when binding explicitly. `validationDisplay` supports `inline` (default), `popover`, or `none`. Popovers anchor beneath the control, fall back above when space is limited, and stay within the viewport. They preserve focus and associate messages with the control using `aria-describedby`.

- **Timing:** `validationWhen` is `touched` by default; choose `dirty`, `always`, or `submitted`. `validationPopoverTrigger="focus"` limits popovers to the focused control. Resetting a form clears touched/submitted visibility. Escape dismisses a popover until focus returns or errors change; configure `validationCloseOnEscape` to disable dismissal.
- **Messages:** Map error keys to strings or `(errorDetails, control) => string`. Built-in messages cover required, email, length, numeric bounds, pattern and incomplete masks. Configure `validationHeading`, `validationFallback`, `validationShowAll` and `validationMaxMessages` (default 5).
- **Async:** Pass `[asyncValidators]`, enable `validationShowPending`, and customize `validationPendingMessage`. Angular runs async rules after synchronous rules pass and cancels obsolete observable checks.
- **Presentation:** Configure `validationOffset`, `validationWidth`, `validationAppearance` and `validationLive`. `[dlValidation]="false"` disables this directive's feedback; `validationDisplay="none"` hides the message while retaining invalid-state accessibility. Neither option disables the validators themselves.
- **Events:** `validationChange` emits `{errors, messages, visible, pending}` and is connected to Storybook Actions.

**Inputs → Validation directive** includes custom rules, async checks, dynamic validator replacement, reactive/template-driven forms, dropdown and checkbox examples, and separate configuration stories with explanatory notes. Avoid supplying the control's static `error` message simultaneously unless you intentionally want both presentations.

### Carousel directive

Apply `CarouselDirective` (`dlCarousel`) to a container whose **direct element children** are slides. Cards, tiles, figures/images and wrappers containing other controls can share one carousel. Slides stay mounted and are never cloned, preserving form values and component state. Keep navigation controls outside the track.

```html
<div
  dlCarousel
  #carousel="dlCarousel"
  ariaLabel="Featured projects"
  [slidesPerView]="1"
  [breakpoints]="{0: 1, 540: 2, 720: 3}"
  [gap]="16"
  [(index)]="activeSlide"
  (slideChange)="onSlideChange($event)"
>
  <dl-card heading="Project one">...</dl-card>
  <dl-card heading="Project two">...</dl-card>
  <dl-tiles label="Revenue" prefix="" value="$24,800" />
</div>
<button (click)="carousel.previous()" [disabled]="!carousel.canPrevious()">
  Previous
</button>
<button (click)="carousel.next()" [disabled]="!carousel.canNext()">Next</button>
```

- **Layout:** `slidesPerView` is a positive whole number; `breakpoints` maps minimum **container** widths to visible slide counts. Configure `gap` in pixels, `width`, `height`, horizontal/vertical `orientation`, and `showScrollbar`. Vertical mode uses a 320px height when `height` is `auto`.
- **Navigation:** Native touch/trackpad scrolling and CSS snapping; `keyboard` enables arrows and Home/End when the track is focused, preserving nested controls' keys. RTL follows the inherited document direction. `step` controls how many positions navigation advances; `loop` wraps between endpoints without clones. `behavior` selects smooth or instant scrolling; reduced motion always uses instant movement.
- **State and events:** `index` is the zero-based first visible slide and supports two-way binding. `indexChange` and `slideChange` are wired to Storybook Actions. The latter emits `{index, previousIndex, total, source}` with source `api`, `keyboard`, `scroll` or `autoplay`. `count()`, `visibleCount()`, `maxIndex()`, `canNext()` and `canPrevious()` support custom controls. Call `next()`, `previous()`, or `goTo(index)` for navigation.
- **Autoplay:** Off by default. Configure `autoplay`, `interval` (milliseconds, minimum 250), `pauseOnHover` and `pauseOnFocus`. Supply a pause button using `pause()` / `play()`; `paused()` and `playing()` expose rotation state. Hidden tabs and reduced-motion preferences always suspend rotation. Without looping, playback pauses at the last position.
- **Accessibility and lifecycle:** Configure `ariaLabel` and `slideLabel`; existing slide roles/labels are preserved. `disabled` blocks carousel navigation. `[dlCarousel]="false"` removes slide sizing and disables enhancement. Added/removed direct children and container resizing are observed automatically; removed slides' styles and attributes are restored. No slide content is hidden from assistive technology.

**Navigation → Carousel directive** includes cards, responsive layouts, analytics tiles, vertical and RTL layouts, looping, autoplay, dynamic slides, mixed content, custom pagination and separate stories for every input/output. Use a bounded-width container; this directive arranges a component list, rather than individual parts inside controls such as dropdowns or tabs.

### Header

`HeaderComponent` (`dl-header`) combines a semantic heading, subheading and metadata with projected components on either side. Import it and whichever components you project.

```html
<dl-header
  heading="Workspace overview"
  subheading="Manage projects and people."
  [metadata]="[{label: 'Owner', value: 'Design team'}, {value: '12 projects'}]"
>
  <button headerLeft dlButton variant="ghost" (click)="goBack()">← Back</button>
  <div headerRight style="display:flex;gap:8px;flex-wrap:wrap">
    <button dlButton variant="secondary" (click)="export()">Export</button>
    <button dlButton (click)="createProject()">New project</button>
  </div>
</dl-header>
```

- **Text:** Configure `heading`, `subheading`, optional `eyebrow`, `headingLevel` (1–6) and visual `size` independently. `metadata` accepts `{label?: string, value: string | number}[]`; configure `metadataSeparator`, `metadataLabel`, spacing and colors.
- **Projection:** `headerLeft` and `headerRight` accept buttons, icons, badges, form controls or groups. `headerHeading`, `headerSubheading` and `headerMetadata` accept rich content; clear the corresponding text/array input when you want projected content alone. Unmarked content appears beneath the metadata. Empty slots collapse.
- **Layout:** `layout="responsive"` stacks the left slot, central content and right slot below `responsiveBreakpoint` (640px by default), measured against the component's container. Choose `row` or `column` explicitly; configure `width`, `padding`, `gap`, `contentGap`, `metadataGap`, `align` and `textAlign`. Groups you project should permit wrapping to fit narrow containers.
- **Appearance:** `surface` supports transparent, solid or glass. Configure `showDivider`, individual text colors, inherited `appearance` overrides and `styleTokens`. `showHeading`, `showSubheading`, `showMetadata`, `showLeft` and `showRight` control visibility.
- **Events:** The header is presentational. Projected controls retain their existing inputs, outputs and event handlers; their events are connected to Storybook Actions. No artificial header click event is introduced.

**Layout → Header** includes both-side actions, text only, individual left/right content, rich text, custom metadata, glass, a compact section heading, narrow containers and long content. Every configurable input and appearance field has its own setting story.

### Numeric, currency and percentage fields

`NumberInputComponent` (`dl-number-input`) is the numeric companion to `dl-input`. It uses a **number or null** form model, with localized decimal, currency or percentage formatting. Existing SSN/phone/pattern masks on `dl-input` keep their string models.

```html
<dl-number-input
  id="price"
  label="Price"
  format="currency"
  currency="USD"
  locale="en-US"
  [precision]="2"
  [min]="0"
  [formControl]="price"
  dlValidation
  validationDisplay="popover"
  validationWhen="touched"
/>

<dl-number-input
  id="discount"
  label="Discount"
  format="percent"
  percentValue="points"
  [precision]="1"
  [min]="0"
  [max]="100"
  [formControl]="discount"
  dlValidation
  validationDisplay="popover"
/>
```

- `format` is `decimal`, `currency` or `percent`. Configure `locale`, `currency`, `currencyDisplay`, `useGrouping` and `signDisplay`.
- `precision` sets maximum decimal places (0–20); `minPrecision` sets zero padding. Currency defaults to padding to `precision`; decimal and percent formats default to no unnecessary trailing zeros.
- `formatOn="blur"` shows an editable number on focus and formatted text on blur. `selectOnFocus` selects that editable amount by default. `formatOn="input"` applies formatting while typing, preserving trailing decimal drafts. `maskInput` rejects characters outside the recognized localized numeric syntax and emits `inputRejected`; disable it to retain invalid text and show a numeric validation error.
- Built-in validation covers nonnumeric values, `min`, `max`, `step` (relative to `min` or zero) and precision. Bounds use model units. Extra significant decimal places remain visible and invalid, rather than being silently removed from the model. Set `validatePrecision=false` to permit values with extra decimals while rounding their display. Empty input becomes null; add Angular `Validators.required` when required.
- `percentValue="points"` means 12.5 → 12.5%. `percentValue="fraction"` means 0.125 → 12.5%. For fraction models, precision counts decimals in the displayed percentage; bounds and steps still use fraction units. The field has no implicit range limits; set min/max for the application's rules.
- `valueChange` emits numeric user edits; `formattedChange` emits `{value, formatted}` on edits/blur; `inputRejected` emits `{attempted}` for rejected masked input. All three are observed in Storybook Actions.

The exported pure helpers are also available outside the component:

```ts
formatNumber(1234.5, { format: "currency", currency: "USD" }); // '$1,234.50'
parseNumber("1.234,50 €", {
  format: "currency",
  currency: "EUR",
  locale: "de-DE",
}); // 1234.5
formatNumber(0.125, {
  format: "percent",
  percentValue: "fraction",
  precision: 1,
}); // '12.5%'

price = new FormControl<number | null>(null, [
  Validators.required,
  currencyValidator({ precision: 2, min: 0, max: 10000 }),
]);
discount = new FormControl(12.5, percentageValidator({ precision: 1 }));
quantity = new FormControl(
  1,
  numericValidator({ min: 0, max: 100, precision: 0, step: 1 }),
);
```

`parseNumber` returns null for empty input and NaN for invalid text. `numericValidator`, `precisionValidator`, `currencyValidator` and `percentageValidator` compose with existing Angular validators. Currency defaults to two decimal places; percentage validation defaults to 0–100 (or 0–1 for fractions) and two display decimals. `dlValidation` includes numeric, precision and step messages for inline or popover presentation. Standalone `formatNumber` rounds for display; it does not validate or mutate the supplied number.

**Inputs → Number input** includes USD/EUR currency, live currency masking, integers, decimal precision, percentage-point/fraction models, range/step validation, reusable validators and `ngModel`, alongside individual configuration stories.

### Counter button

`CounterButtonComponent` (`dl-counter-button`) provides a compact minus/value/plus control. The existing `dl-counter` remains the editable numeric counter.

```html
<dl-counter-button
  id="quantity"
  label="Quantity"
  [formControl]="quantity"
  [min]="0"
  [max]="10"
  [step]="0.25"
  [precision]="2"
  suffix=" kg"
  (incremented)="onIncrease($event)"
  (decremented)="onDecrease($event)"
/>
```

Configure bounds, step, precision, locale, prefix/suffix, button labels/icons, size, orientation, read-only/disabled state and appearance. Set precision to accommodate decimal steps. The central spinbutton supports arrows, Home and End; boundary buttons disable automatically. `valueChange`, `incremented` and `decremented` report user changes and appear in Storybook Actions. **Inputs → Counter button** includes decimal steps, vertical layout and disabled/read-only examples plus individual setting stories.

### Primary, secondary and tertiary variants

Buttons (`dlButton`, `dlIconButton` and `dlFab`) support `variant="primary"`, `"secondary"` and `"tertiary"`: filled, solid/outlined and transparent respectively. Tertiary retains hover and keyboard-focus feedback; `ghost` remains a compatible alias, and `danger` is still available. Tile actions also accept tertiary through `actionVariant`.

`dl-container` uses the same three names for content emphasis: primary glass/elevated, secondary solid/outlined and tertiary transparent. Tertiary remains its default. Variants are independent of sizing, flex layout, padding and appearance overrides, and adapt to the light and black themes.

```html
<button dlButton variant="tertiary">Cancel</button>
<dl-container variant="primary" [padding]="24">Main content</dl-container>
<dl-container variant="secondary">Supporting content</dl-container>
<dl-container variant="tertiary">Plain layout group</dl-container>
```

Compare them under **Actions → Button → Variants** and **Layout → Container → Variants**. Each variant also has its own setting story.

### Generated skills and LLM prompts

[SKILLS.md](SKILLS.md) links to the repository's portable [Arcwell UI skill](skills/arcwell-ui/SKILL.md), detailed per-component prompts, and composition patterns extracted from Storybook. Each component guide includes its source-derived selector, inherited inputs/models/outputs, required bindings, slots, types, story recipes and configuration links. Patterns preserve references to their original CSF setup; they are examples to adapt, not standalone applications.

- `npm run skills:generate` regenerates Storybook configuration coverage and all guidance. `npm run stories:generate` also updates the guidance automatically.
- `npm run skills:watch` regenerates after component, story or generator edits; stop it with Ctrl+C.
- `npm run skills:check` detects stale or missing generated files without writing them.
- `npm run skills:test` verifies API coverage, inheritance, links, deterministic generation, stale detection and watch behavior using isolated fixtures.
- `npm run skills:verify-storybook` checks the generated links against the built Storybook index.

`npm run check` and the existing pull-request CI enforce freshness, run the generator tests, and verify links after the Storybook build. Edit source components/stories rather than generated Markdown. Generation is local and deterministic; it does not require an LLM API, credentials, or a running Storybook server. The skill is versioned in this repository; copy the complete `skills/arcwell-ui` folder into your agent's skill location when using it elsewhere. Other LLMs can consume the individual Markdown prompts directly.
