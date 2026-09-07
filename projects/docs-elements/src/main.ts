import { importProvidersFrom, Type } from "@angular/core";
import { createApplication } from "@angular/platform-browser";
import { createCustomElement } from "@angular/elements";
import { DialogModule } from "@angular/cdk/dialog";
import { OverlayModule } from "@angular/cdk/overlay";
import {
  AlertComponent, AvatarComponent, BadgeComponent, BottomSheetComponent,
  BreadcrumbComponent, ButtonComponent, CardComponent, CheckboxComponent,
  ChipsComponent, ConfirmationDialogComponent, ContainerComponent,
  ContextSelectorComponent, CounterButtonComponent, CounterComponent,
  DatepickerComponent, DividerComponent, DropdownComponent, FabButtonComponent,
  GlobalNotificationComponent, HeaderComponent, IconButtonComponent,
  IconComponent, InlineNotificationComponent, InputComponent, ListComponent,
  ModalComponent, MultiSelectComponent, NumberInputComponent, PaneComponent,
  ProgressComponent, RadioComponent, RangeSelectorComponent, SectionComponent,
  SegmentedButtonsComponent, SidepanelComponent, SkeletonComponent,
  SnackbarComponent, StepComponent, StepperContainerComponent,
  TabComponent, TabContainerComponent, TilesComponent, ToastComponent,
  ToggleComponent,
} from "@arcwell/ui";
import { DocsDropdownAdapter, DocsSegmentedAdapter, DocsTabsAdapter, DocsToggleAdapter } from "./control-adapters";

const elements: Array<[string, Type<unknown>]> = [
  ["alert", AlertComponent], ["avatar", AvatarComponent], ["badge", BadgeComponent],
  ["bottom-sheet", BottomSheetComponent], ["breadcrumb", BreadcrumbComponent],
  ["button", ButtonComponent], ["card", CardComponent], ["checkbox", CheckboxComponent],
  ["chips", ChipsComponent], ["confirmation-dialog", ConfirmationDialogComponent],
  ["container", ContainerComponent], ["context-selector", ContextSelectorComponent],
  ["counter-button", CounterButtonComponent], ["counter", CounterComponent],
  ["datepicker", DatepickerComponent], ["divider", DividerComponent],
  ["dropdown", DropdownComponent], ["fab-button", FabButtonComponent],
  ["global-notification", GlobalNotificationComponent], ["header", HeaderComponent],
  ["icon-button", IconButtonComponent], ["icon", IconComponent],
  ["inline-notification", InlineNotificationComponent], ["input", InputComponent],
  ["list", ListComponent], ["modal", ModalComponent], ["multi-select", MultiSelectComponent],
  ["number-input", NumberInputComponent], ["pane", PaneComponent],
  ["progress", ProgressComponent], ["radio", RadioComponent],
  ["range-selector", RangeSelectorComponent], ["section", SectionComponent],
  ["segmented-buttons", SegmentedButtonsComponent], ["sidepanel", SidepanelComponent],
  ["skeleton", SkeletonComponent], ["snackbar", SnackbarComponent],
  ["step", StepComponent], ["stepper-container", StepperContainerComponent],
  ["tab", TabComponent], ["tab-container", TabContainerComponent],
  ["tiles", TilesComponent], ["toast", ToastComponent], ["toggle", ToggleComponent],
  ["docs-dropdown", DocsDropdownAdapter], ["docs-toggle", DocsToggleAdapter],
  ["docs-segmented", DocsSegmentedAdapter],
  ["docs-tabs", DocsTabsAdapter],
];

async function registerElements() {
  const application = await createApplication({ providers: [importProvidersFrom(DialogModule, OverlayModule)] });
  for (const [name, component] of elements) {
    const tag = `arc-${name}`;
    if (!customElements.get(tag)) customElements.define(tag, createCustomElement(component, { injector: application.injector }));
  }
}

void registerElements();
