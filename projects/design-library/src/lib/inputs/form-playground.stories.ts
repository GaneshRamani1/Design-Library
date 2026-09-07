import { STORY_OUTPUT_OBSERVERS } from "../../../../../.storybook/output-observers.generated";
import { Component, signal } from "@angular/core";
import { JsonPipe } from "@angular/common";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import type { Meta, StoryObj } from "@storybook/angular";
import {
  ButtonComponent,
  ContainerComponent,
  SectionComponent,
  PaneComponent,
  InputComponent,
  ToggleComponent,
  DropdownComponent,
  ContextSelectorComponent,
  RadioComponent,
  MultiSelectComponent,
  RangeSelectorComponent,
  type RangeValue,
} from "../../public-api";

@Component({
  selector: "dl-form-playground",
  standalone: true,
  imports: [
    ...STORY_OUTPUT_OBSERVERS,
    JsonPipe,
    ReactiveFormsModule,
    ButtonComponent,
    ContainerComponent,
    SectionComponent,
    PaneComponent,
    InputComponent,
    ToggleComponent,
    DropdownComponent,
    ContextSelectorComponent,
    RadioComponent,
    MultiSelectComponent,
    RangeSelectorComponent,
  ],
  template: `<dl-container size="lg" [padding]="24" [gap]="28">
    <header>
      <p class="eyebrow">INPUTS / WORKING TOGETHER</p>
      <h1>Make yourself at home.</h1>
      <p class="intro">
        A workspace form built from the library. Every control shares one
        reactive form.
      </p>
    </header>
    <dl-section label="Workspace preferences" [padding]="0" [gap]="24">
      <form [formGroup]="form" class="form-grid">
        <dl-pane [padding]="28" [gap]="28" overflow="visible">
          <h2>Your workspace</h2>
          <dl-input
            [stretch]="true"
            id="workspace-name"
            label="Workspace name"
            formControlName="name"
            [required]="true"
            [error]="
              form.controls.name.touched && form.controls.name.invalid
                ? 'Enter a workspace name.'
                : ''
            "
          />
          <dl-dropdown
            id="workspace-region"
            label="Region"
            [stretch]="true"
            [options]="regions"
            formControlName="region"
            [required]="true"
          />
          <dl-context-selector
            id="workspace-environment"
            label="Environment"
            [stretch]="true"
            [options]="environments"
            formControlName="environment"
          />
          <dl-multi-select
            id="workspace-teams"
            label="Teams"
            [stretch]="true"
            [options]="teams"
            formControlName="teams"
            hint="Invite more than one team to this workspace."
          />
        </dl-pane>
        <dl-pane [padding]="28" [gap]="28" overflow="visible">
          <h2>Fine-tune the details</h2>
          <dl-radio
            id="workspace-plan"
            label="Plan"
            [stretch]="true"
            [options]="plans"
            formControlName="plan"
          />
          <dl-range-selector
            id="workspace-volume"
            label="Volume"
            [stretch]="true"
            [step]="5"
            unit="%"
            formControlName="volume"
          />
          <dl-range-selector
            id="workspace-budget"
            label="Budget"
            [stretch]="true"
            [range]="true"
            [step]="5"
            unit="k"
            formControlName="budget"
          />
          <dl-toggle
            label="Email notifications"
            formControlName="notifications"
          />
        </dl-pane>
      </form>
      <div class="actions">
        <button dlButton (click)="reset()">Reset form</button
        ><button dlButton variant="secondary" (click)="toggleDisabled()">
          {{ locked() ? "Enable form" : "Disable form" }}</button
        ><span role="status">{{
          locked()
            ? "Disabled"
            : form.valid
              ? "All set"
              : "Check required fields"
        }}</span>
      </div>
    </dl-section>
    <dl-pane [padding]="24"
      ><h2>Live form value</h2>
      <pre data-testid="form-value">{{ form.getRawValue() | json }}</pre>
    </dl-pane>
  </dl-container>`,
  styles: [
    `
      :host {
        display: block;
        color: var(--dl-text);
        font-family: var(--dl-font);
      }
      .eyebrow {
        font-size: 10px;
        letter-spacing: 2px;
        color: var(--dl-muted);
      }
      h1 {
        font-size: clamp(28px, 4vw, 42px);
        letter-spacing: -1.5px;
        margin: 12px 0;
        font-weight: 500;
      }
      .intro {
        color: var(--dl-muted);
        font-size: 14px;
        line-height: 1.7;
      }
      h2 {
        margin: 0;
        font-size: 17px;
        font-weight: 500;
      }
      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 24px;
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        align-items: center;
      }
      .actions span {
        font-size: 12px;
        color: var(--dl-muted);
      }
      pre {
        margin: 0;
        font-size: 12px;
        line-height: 1.7;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
      }
      @media (max-width: 700px) {
        .form-grid {
          grid-template-columns: minmax(0, 1fr);
        }
      }
    `,
  ],
})
class FormPlaygroundComponent {
  readonly locked = signal(false);
  readonly regions = [
    { value: "us", label: "United States" },
    { value: "eu", label: "Europe" },
  ];
  readonly environments = [
    { value: "dev", label: "Development" },
    { value: "stage", label: "Staging" },
    { value: "prod", label: "Production", disabled: true },
  ];
  readonly teams = [
    { value: "design", label: "Design" },
    { value: "engineering", label: "Engineering" },
    { value: "marketing", label: "Marketing" },
    { value: "support", label: "Support", disabled: true },
  ];
  readonly plans = [
    {
      value: "personal",
      label: "Personal",
      description: "A little space of your own",
    },
    { value: "team", label: "Team", description: "Better together" },
  ];
  readonly form = new FormGroup({
    name: new FormControl("Studio", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    region: new FormControl("us", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    environment: new FormControl("dev", { nonNullable: true }),
    teams: new FormControl(["design"], { nonNullable: true }),
    plan: new FormControl("team", { nonNullable: true }),
    volume: new FormControl<RangeValue>(40, { nonNullable: true }),
    budget: new FormControl<RangeValue>([20, 80], { nonNullable: true }),
    notifications: new FormControl(true, { nonNullable: true }),
  });
  reset(): void {
    this.form.reset();
  }
  toggleDisabled(): void {
    this.locked.update((value) => !value);
    if (this.locked()) this.form.disable();
    else this.form.enable();
  }
}
export default {
  id: "inputs-form-playground",
  title: "Inputs/Form playground/Variations",
  component: FormPlaygroundComponent,
  parameters: { layout: "fullscreen", controls: { disable: true } },
} satisfies Meta<FormPlaygroundComponent>;
export const Default: StoryObj<FormPlaygroundComponent> = {};
