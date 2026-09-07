import {
  Component,
  computed,
  contentChildren,
  ElementRef,
  inject,
  input,
  model,
  output,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { ButtonComponent } from "../button.component";
import { Appearance } from "../shared/appearance";
import { StepComponent } from "./step.component";
let nextStepper = 0;
@Component({
  selector: "dl-stepper-container, dl-stepper",
  standalone: true,
  imports: [NgTemplateOutlet, ButtonComponent],
  template: `<div
      class="stepper"
      [class.vertical]="orientation() === 'vertical'"
    >
      <ol [attr.aria-label]="label()">
        @for (step of steps(); track step.value(); let index = $index) {
          <li>
            <button
              type="button"
              [id]="id() + '-step-' + index"
              [attr.aria-current]="active() === step ? 'step' : null"
              [disabled]="!canSelect(index)"
              (click)="select(index)"
              (keydown)="key($event, index)"
            >
              @if (showNumbers()) {
                <span class="number">{{
                  step.error()
                    ? "!"
                    : step.completed()
                      ? "✓"
                      : step.icon() || index + 1
                }}</span>
              }
              <span
                ><strong>{{ step.label() }}</strong>
                @if (showDescriptions() && step.description()) {
                  <small>{{ step.description() }}</small>
                }
                @if (step.optional()) {
                  <small>{{ optionalLabel() }}</small>
                }
              </span>
            </button>
          </li>
        }
      </ol>
      <div class="content">
        @if (active(); as step) {
          <section
            role="region"
            [attr.aria-labelledby]="id() + '-step-' + activeIndex()"
            [style.padding]="panelPadding()"
          >
            @if (step.content(); as content) {
              <ng-container [ngTemplateOutlet]="content" />
            }
            @if (step.error()) {
              <p class="error" role="alert">{{ step.error() }}</p>
            }
          </section>
        }
        @if (showControls()) {
          <footer>
            <button
              dlButton
              variant="secondary"
              [disabled]="!allowBack() || previousIndex() < 0"
              (click)="previous()"
            >
              {{ previousLabel() }}</button
            ><button dlButton [disabled]="!canAdvance()" (click)="next()">
              {{ nextIndex() < 0 ? finishLabel() : nextLabel() }}
            </button>
          </footer>
        }
      </div>
    </div>
    <ng-content />`,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        color: var(--dl-ui-color, var(--dl-text));
        font: var(--dl-ui-font-size, 14px) var(--dl-font);
      }
      .stepper {
        display: flex;
        flex-direction: column;
        gap: var(--dl-ui-gap, 24px);
      }
      .vertical {
        flex-direction: row;
      }
      .vertical ol {
        flex-direction: column;
        flex-shrink: 0;
      }
      ol {
        list-style: none;
        display: flex;
        gap: var(--dl-ui-gap, 12px);
        padding: var(--dl-ui-padding, 0);
        margin: 0;
        overflow: auto;
      }
      li {
        flex: 1;
      }
      button:not([dlButton]) {
        display: flex;
        align-items: center;
        gap: var(--dl-ui-gap, 10px);
        width: 100%;
        text-align: left;
        background: var(--dl-ui-background, transparent);
        border: var(--dl-ui-border-width, 1px) solid
          var(--dl-ui-border-color, var(--dl-border));
        border-radius: var(--dl-ui-radius, 12px);
        padding: var(--dl-ui-padding, 14px);
        color: var(--dl-ui-color, var(--dl-muted));
        font: inherit;
        cursor: pointer;
      }
      button[aria-current="step"] {
        color: var(--dl-ui-color, var(--dl-text));
        border-color: var(--dl-ui-border-color, var(--dl-primary));
      }
      button:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
      .number {
        width: 28px;
        height: 28px;
        display: grid;
        place-items: center;
        border-radius: var(--dl-ui-radius, 50%);
        background: var(--dl-ui-background, var(--dl-neutral-bg));
        flex-shrink: 0;
      }
      button[aria-current="step"] .number {
        background: var(--dl-ui-background, var(--dl-primary));
        color: var(--dl-ui-color, var(--dl-on-primary));
      }
      strong {
        font-weight: 500;
      }
      small {
        display: block;
        font-size: var(--dl-ui-font-size, 11px);
        margin-top: 4px;
      }
      .content {
        min-width: 0;
        flex: 1;
      }
      footer {
        display: flex;
        justify-content: space-between;
        gap: var(--dl-ui-gap, 12px);
      }
      .error {
        color: var(--dl-ui-color, var(--dl-danger));
      }
      button:focus-visible {
        outline: 2px solid var(--dl-ui-focus-color, var(--dl-focus));
        outline-offset: 2px;
      }
      @media (max-width: 600px) {
        .vertical {
          flex-direction: column;
        }
      }

      :host,
      .stepper,
      ol {
        min-width: 0;
        max-width: 100%;
      }
      .content {
        overflow-wrap: anywhere;
      }
      footer {
        flex-wrap: wrap;
      }
      @media (max-width: 600px) {
        .vertical {
          flex-direction: column;
        }
        .vertical ol {
          flex-shrink: 1;
        }
        .vertical button {
          min-width: 0;
          overflow-wrap: anywhere;
        }
        .vertical button > span:last-child {
          min-width: 0;
        }
      }
    `,
  ],
})
export class StepperContainerComponent extends Appearance {
  readonly id = input(`dl-stepper-${++nextStepper}`);
  readonly label = input("Steps");
  readonly value = model<string | null>(null);
  readonly orientation = input<"horizontal" | "vertical">("horizontal");
  readonly linear = input(false);
  readonly allowBack = input(true);
  readonly showNumbers = input(true);
  readonly showDescriptions = input(true);
  readonly showControls = input(true);
  readonly previousLabel = input("Previous");
  readonly nextLabel = input("Next");
  readonly finishLabel = input("Finish");
  readonly optionalLabel = input("Optional");
  readonly panelPadding = input("24px 0");
  readonly finished = output<void>();
  readonly steps = contentChildren(StepComponent);
  readonly active = computed(
    () =>
      this.steps().find(
        (step) => step.value() === this.value() && !step.disabled(),
      ) ?? this.steps().find((step) => !step.disabled()),
  );
  readonly activeIndex = computed(() => this.steps().indexOf(this.active()!));
  readonly previousIndex = computed(
    () =>
      this.steps()
        .map((s, i) => (!s.disabled() && i < this.activeIndex() ? i : -1))
        .filter((i) => i >= 0)
        .at(-1) ?? -1,
  );
  readonly nextIndex = computed(() =>
    this.steps().findIndex((s, i) => !s.disabled() && i > this.activeIndex()),
  );
  readonly canAdvance = computed(
    () =>
      !!this.active() &&
      (this.nextIndex() >= 0
        ? this.canSelect(this.nextIndex())
        : !this.linear() ||
          !!this.active()?.completed() ||
          !!this.active()?.optional()),
  );
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  canSelect(index: number): boolean {
    const step = this.steps()[index];
    return (
      !!step &&
      !step.disabled() &&
      (this.allowBack() || index >= this.activeIndex()) &&
      (!this.linear() ||
        this.steps()
          .slice(0, index)
          .every((s) => s.disabled() || s.completed() || s.optional()))
    );
  }
  select(index: number): void {
    if (this.canSelect(index)) this.value.set(this.steps()[index].value());
  }
  previous(): void {
    if (this.allowBack() && this.previousIndex() >= 0)
      this.select(this.previousIndex());
  }
  next(): void {
    if (!this.canAdvance()) return;
    if (this.nextIndex() < 0) this.finished.emit();
    else this.select(this.nextIndex());
  }
  key(event: KeyboardEvent, index: number): void {
    if (
      ![
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
      ].includes(event.key)
    )
      return;
    event.preventDefault();
    const enabled = this.steps()
      .map((_, i) => (this.canSelect(i) ? i : -1))
      .filter((i) => i >= 0);
    if (!enabled.length) return;
    const n =
      event.key === "Home"
        ? enabled[0]
        : event.key === "End"
          ? enabled.at(-1)!
          : enabled[
              (enabled.indexOf(index) +
                (["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : -1) +
                enabled.length) %
                enabled.length
            ];
    this.select(n);
    this.element.nativeElement
      .querySelectorAll<HTMLButtonElement>("ol button")
      [n]?.focus();
  }
}
export { StepperContainerComponent as StepperComponent };
