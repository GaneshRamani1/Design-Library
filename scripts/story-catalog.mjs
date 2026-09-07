export function words(value) {
  return String(value)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[._-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
const groups = {
  "Layout and sizing":
    "chartHeight valueSize position contentWidth size stretch fullWidth width height minWidth minHeight maxWidth maxHeight padding gap margin inset layout direction align justify wrap overflow orientation placement offset zIndex menuWidth optionsMaxHeight calendarWidth panelPadding labelPosition iconPosition density",
  States:
    "disabled readOnly loading busy required error indeterminate completed optional selected pressed visible open status",
  Appearance:
    "valueColor chartColor chartStrokeWidth chartFill trendTone underline underlineOffset fontWeight tone variant surface shape pill dot radius borderWidth borderColor background color fontSize shadow focusColor customBackground customColor customBorder showBorder lineStyle thickness trackColor barColor iconBorder fill strokeWidth rotation flip spin animation",
  Content:
    "series trend trendDirection comparison prefix suffix footerText label heading headingLevel description hint placeholder message name src customInitials icon badge unit items options data fallback emptyText valueLabel labelSeparator summaryMode selectedCountLabel limitMessage",
  Visibility:
    "showChart showTrend showHeader showFooter showLabel showIcon showIcons showDescriptions showMeta showChevron showValue showCount showProgress showButtons showNumbers showControls showDivider dividers showClose showClear showCancel showConfirm showDone showSelectAll showToday showOutsideDays",
  Accessibility:
    "tabIndex current id ariaLabel role live autoFocus restoreFocus autocomplete inputMode searchLabel calendarLabel",
  Labels:
    "collapseLabel expandLabel chartLabel progressLabel valueLabel actionAriaLabel actionLabel cancelLabel clearLabel closeLabel confirmLabel decrementLabel dismissLabel doneLabel finishLabel incrementLabel loadingLabel nextLabel optionalLabel previousLabel removeLabel selectAllLabel todayLabel",
  Behavior:
    "href target rel download linkCurrent maxItems activation allowBack allowEmpty closable closeOnAction closeOnBackdrop closeOnConfirm closeOnEscape closeOnOutside closeOnSelect confirmDisabled dismissible editable interactive keepAlive linear multiple pauseOnHover removable resetSearchOnOpen scrollStrategy searchable selectable trigger duration showDelay hideDelay bulkScope hasBackdrop backdropClass panelClass",
  "Values and validation":
    "value min max step range minLength maxLength maxSelected pattern type dateFilter disabledDates locale weekStartsOn displayFormat",
};
export function groupFor(prop) {
  if (
    [
      "format",
      "currency",
      "currencyDisplay",
      "precision",
      "minPrecision",
      "useGrouping",
      "percentValue",
      "signDisplay",
      "formatOn",
      "maskInput",
      "validatePrecision",
    ].includes(prop)
  )
    return "Numeric formatting";
  if (
    ["responsiveBreakpoint", "contentGap", "metadataGap", "textAlign"].includes(
      prop,
    )
  )
    return "Layout and sizing";
  if (
    [
      "showHeading",
      "showSubheading",
      "showMetadata",
      "showLeft",
      "showRight",
    ].includes(prop)
  )
    return "Visibility";
  if (["headingColor", "subheadingColor", "metadataColor"].includes(prop))
    return "Appearance";
  if (prop === "metadataLabel") return "Accessibility";
  if (["slidesPerView", "breakpoints"].includes(prop))
    return "Layout and sizing";
  if (
    [
      "dlCarousel",
      "loop",
      "keyboard",
      "autoplay",
      "interval",
      "pauseOnFocus",
      "behavior",
    ].includes(prop)
  )
    return "Behavior";
  if (prop === "slideLabel") return "Accessibility";
  if (prop === "showScrollbar") return "Visibility";
  if (prop.startsWith("validationAppearance.")) return "Validation/Appearance";
  if (
    prop.startsWith("validation") ||
    ["dlValidation", "validators", "asyncValidators"].includes(prop)
  )
    return "Validation";
  if (prop.startsWith("appearance.")) return "Appearance/Style overrides";
  if (prop.startsWith("event.")) return "Events";
  if (prop.startsWith("mask") || prop === "tinType") return "Masking";
  if (
    prop === "appearance" ||
    prop === "styleTokens" ||
    prop.startsWith("appearance.")
  )
    return "Appearance";
  for (const [name, list] of Object.entries(groups))
    if (list.split(" ").includes(prop)) return name;
  return "Content";
}
export function settingName(prop) {
  if (prop.startsWith("validationAppearance.")) return words(prop.slice(21));
  if (prop === "appearance") return "Custom styles";
  if (prop === "styleTokens") return "Theme tokens";
  if (prop.startsWith("appearance.")) return words(prop.slice(11));
  return words(prop.replace(/^event\./, ""));
}
const purposes = {
  href: "Sets the native link destination.",
  target: "Chooses which browsing context opens the destination.",
  rel: "Configures the relationship to the linked destination; new-tab links also include noopener.",
  download:
    "Requests a download filename for browser-supported downloadable destinations.",
  underline:
    "Controls whether the link underline is always visible, appears on interaction, or is hidden.",
  underlineOffset: "Changes the distance between the text and its underline.",
  fontWeight: "Adjusts the weight of the link text.",
  current:
    "Identifies the current navigation destination for assistive technology.",
  linkCurrent:
    "Allows the current breadcrumb item to remain a link when it has a destination.",
  maxItems:
    "Collapses long paths while retaining their first and final locations; expand the ellipsis to see all items.",
  separator: "Changes the visual separator between breadcrumb items.",
  contentWidth:
    "Aligns banner content to the application’s maximum content width.",
  position:
    "Chooses normal document flow, a sticky banner, or a fixed viewport banner.",
  size: "Changes the component size while keeping its proportions consistent.",
  stretch: "Lets the component fill the available container width.",
  fullWidth: "Makes the button span its container.",
  width: "Sets an explicit width.",
  height: "Sets an explicit height.",
  minHeight: "Sets the minimum height.",
  maxHeight: "Limits the height before content needs to scroll.",
  maxWidth: "Limits how wide the component can grow.",
  padding: "Changes the space inside the component.",
  gap: "Changes the space between children.",
  margin: "Changes the space outside the component.",
  layout: "Chooses block or flex layout for projected content.",
  direction: "Arranges flex children in a row or column.",
  align: "Aligns children across the flex direction.",
  justify: "Distributes children along the flex direction.",
  wrap: "Allows children to continue on another line.",
  overflow:
    "Controls whether oversized content is visible, hidden, or scrollable.",
  orientation: "Switches between horizontal and vertical arrangements.",
  placement:
    "Changes where the surface opens relative to its anchor or viewport.",
  offset: "Changes the distance from the anchor or viewport edge.",
  disabled: "Prevents user interaction.",
  readOnly: "Keeps the value readable without allowing edits.",
  loading: "Shows the loading state.",
  busy: "Indicates pending work and blocks the relevant actions.",
  required: "Marks this field as required.",
  error: "Displays an error message or error state.",
  indeterminate: "Shows a mixed checkbox state.",
  completed: "Marks a step as completed.",
  selected: "Controls which item is selected.",
  pressed: "Exposes the pressed state of a toggle-style button.",
  visible: "Controls whether the component is visible.",
  open: "Controls whether the overlay is open.",
  tone: "Changes the semantic color state.",
  variant: "Changes the visual treatment.",
  surface: "Changes the surface background treatment.",
  shape: "Changes the component shape.",
  color: "Sets the foreground color.",
  radius: "Changes the corner radius.",
  appearance: "Overrides multiple visual properties for this instance.",
  styleTokens:
    "Overrides CSS theme tokens for this instance and its descendants.",
  label: "Customizes the visible label.",
  heading: "Customizes the heading.",
  description: "Adds supporting context below the main label or heading.",
  hint: "Adds help text below the field.",
  placeholder: "Shows guidance while no value has been entered.",
  message: "Customizes the notification text.",
  options: "Provides a custom set of choices, including a disabled option.",
  items: "Provides the list content and item metadata.",
  icon: "Changes the leading icon.",
  data: "Accepts a direct SVG icon definition.",
  fallback: "Chooses the fallback when an icon name is missing.",
  src: "Loads an image instead of generated initials.",
  emptyText: "Customizes the message when there are no items or matches.",
  id: "Supplies a stable identifier used by labels and descriptions.",
  ariaLabel: "Changes the accessible name announced by assistive technology.",
  role: "Changes the semantic role exposed to assistive technology.",
  live: "Controls how changes are announced by screen readers.",
  autoFocus: "Controls where keyboard focus moves when the overlay opens.",
  restoreFocus:
    "Controls whether focus returns to the trigger after dismissal.",
  autocomplete: "Provides a browser autofill hint.",
  inputMode: "Requests a suitable on-screen keyboard.",
  activation: "Chooses whether focusing a tab also activates its panel.",
  keepAlive: "Retains tab panel state while another tab is active.",
  linear:
    "Requires earlier steps to be completed or optional before advancing.",
  allowBack: "Controls whether the stepper can return to an earlier step.",
  multiple: "Enables selecting more than one option.",
  allowEmpty: "Allows the selection to be cleared.",
  removable: "Adds a remove action for each item.",
  dismissible: "Adds a dismiss action.",
  closable: "Adds an action for closing a tab.",
  duration: "Sets how long a notification remains visible; zero keeps it open.",
  pauseOnHover: "Pauses a notification timer while the pointer is over it.",
  closeOnEscape: "Controls dismissal with the Escape key.",
  closeOnBackdrop: "Controls dismissal when the backdrop is clicked.",
  closeOnOutside:
    "Controls dismissal when clicking outside the anchored content.",
  closeOnSelect: "Controls whether the menu closes after choosing an option.",
  closeOnConfirm: "Controls whether confirmation also closes the dialog.",
  closeOnAction: "Controls whether the notification closes after its action.",
  hasBackdrop: "Adds or removes the backdrop behind an overlay.",
  scrollStrategy: "Controls scrolling while the overlay is open.",
  searchable: "Adds search to narrow the available options.",
  bulkScope:
    "Chooses whether bulk actions affect all choices or only search results.",
  resetSearchOnOpen:
    "Controls whether the previous search is cleared on opening.",
  trigger: "Chooses the interaction that opens the anchored content.",
  showDelay: "Sets the delay before anchored content appears.",
  hideDelay: "Sets the delay before anchored content disappears.",
  min: "Sets the lower allowed bound.",
  max: "Sets the upper allowed bound.",
  step: "Changes the amount added or removed by each step.",
  value: "Sets the selected or displayed value.",
  maxSelected: "Limits the number of selected choices.",
  dateFilter: "Controls which calendar dates can be selected.",
  disabledDates: "Disables specific calendar dates.",
  locale: "Changes the language and date formatting.",
  weekStartsOn: "Chooses the first day of the calendar week.",
  displayFormat: "Changes how the selected date appears in the field.",
  mask: "Applies a custom input pattern; 0 accepts digits, a accepts letters, and * accepts either.",
  maskPreset: "Applies a named formatting preset such as SSN, EIN, or phone.",
  tinType: "Chooses individual or business formatting for the TIN preset.",
  maskValueMode:
    "Chooses whether the form receives raw characters or formatted text.",
  maskValidate:
    "Controls whether incomplete nonempty masks produce a validation error.",
  maskLazy: "Controls whether empty positions in the mask remain hidden.",
  maskPlaceholderChar:
    "Changes the guide character shown at empty mask positions.",
  maskDisplayChar:
    "Obscures entered characters visually while retaining the form value.",
  maskOverwrite: "Controls how typing replaces characters at the caret.",
  maskEager: "Controls when fixed separators are inserted or removed.",
  maskSkipInvalid:
    "Controls whether invalid characters are skipped during entry.",
  maskCase: "Converts entered letters to the selected case.",
  maskDefinitions:
    "Defines additional pattern tokens with character-matching expressions.",
  maskOptions: "Overrides advanced IMask pattern settings.",
};
export function explanation(prop, value, component) {
  if (prop.startsWith("event."))
    return `Try the ${component.toLowerCase()} below and inspect ${prop.slice(6)} in the Actions panel. Actions shows the real emitted payload; normal form and demo updates still run.`;
  if (prop.startsWith("appearance."))
    return `Overrides ${words(prop.slice(11)).toLowerCase()} for this instance. Compare the example with the default to see the visual change; the component's behavior stays the same.`;
  const purpose =
    purposes[prop] ??
    (prop.startsWith("show")
      ? `Controls whether ${words(prop.slice(4)).toLowerCase()} are shown.`
      : prop.endsWith("Label")
        ? `Customizes the text for the ${words(prop.slice(0, -5)).toLowerCase()} action.`
        : `Demonstrates the ${words(prop).toLowerCase()} setting on this ${component.toLowerCase()}.`);
  let selected =
    typeof value === "boolean"
      ? ` This example has it turned ${value ? "on" : "off"}.`
      : typeof value === "string" || typeof value === "number"
        ? ` Here it is set to “${value}”.`
        : "";
  const action = prop.startsWith("mask")
    ? " Type or paste an example value to try the mask."
    : prop.startsWith("closeOn") ||
        ["open", "autoFocus", "restoreFocus", "placement", "trigger"].includes(
          prop,
        )
      ? " Open the example and try the relevant pointer or keyboard action."
      : "";
  return purpose + selected + action;
}
export function variantName(value, total) {
  if (typeof value === "boolean") return value ? "On" : "Off";
  if (total === 1) return "Example";
  return (
    { sm: "Small", md: "Medium", lg: "Large", xl: "Extra large", none: "None" }[
      value
    ] ?? words(value)
  );
}

/** Sidebar journey; groupFor remains the stable legacy ID classification. */
export function catalogGroupFor(prop) {
  const group = groupFor(prop);
  if (prop.startsWith("event.")) return "Events";
  if (["variant", "tone", "surface"].includes(prop)) return "Variations";
  if (group.startsWith("Appearance")) return group;
  if (group === "Validation/Appearance") return "Appearance/Validation";
  return `Configuration/${group}`;
}
