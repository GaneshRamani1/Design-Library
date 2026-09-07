/** Human-readable introductions for hand-written examples. Generated stories supply their own notes. */
const summaries: Record<string, string> = {
  "Number input":
    "Format numeric, currency and percentage values with localized separators and numeric form models. Try precision, range and step validation with configurable feedback.",
  "Counter button":
    "A compact decrement/value/increment control with bounds, decimal steps, keyboard access and configurable labels. Changes are logged in Actions.",
  Header:
    "Combine a heading, subheading and metadata with projected components on the left and right. Compare responsive layouts, content slots and appearance settings.",
  "Carousel directive":
    "Turn direct child components into responsive slides. Try touch scrolling, keyboard navigation and custom controls; position changes are logged in Actions.",
  "Link directive":
    "A styled native anchor. Try keyboard focus, navigation and the configurable disabled, underline and color states.",
  Breadcrumb:
    "An accessible navigation path. Ancestors are links and the final item identifies the current page. Long paths can collapse and expand.",
  Tiles:
    "A dashboard metric tile with configurable value, trend, history chart, goal and action. Compare the states and try its action button.",
  "Validation directive":
    "Apply Angular validators to a form control and map its error keys to messages. Compare inline and popover displays, visibility timing and custom styles.",
  Overview:
    "Explore the component library in a working interface. Use the examples and links below to browse individual components.",
  "Getting started":
    "Use this guide to install the library and understand its shared design tokens.",
  Button:
    "A native button with primary, secondary, ghost and danger styles. Try it with the pointer or keyboard.",
  "Icon button":
    "An icon-only button with an accessible label. Try the action and compare its size and shape.",
  "FAB button":
    "A floating action button for a prominent action. Compare the icon-only and extended label variants.",
  Input:
    "A labeled text field with help text and validation states. Type a value and use Tab to leave the field.",
  "Input masks":
    "Type or paste synthetic example data to see how the mask formats it. The form value and validation state below show what your application receives.",
  Checkbox:
    "A checkbox that supports checked, unchecked and mixed states. Use Space or click the control to change it.",
  Toggle:
    "A switch for a binary preference. Use Space or click to toggle the value.",
  Dropdown:
    "A custom single-select field. Open it, choose an option, or use the arrow keys and Enter.",
  "Multi-select dropdown":
    "Choose multiple options in a custom dropdown. Try search, bulk selection and clearing the selection.",
  "Context selector":
    "Switch between related contexts with a segmented selection. Disabled choices cannot be selected.",
  Radio:
    "A set of mutually exclusive choices. Choose an option with the pointer or the arrow keys.",
  "Range selector":
    "Adjust a value or a pair of bounds using the range controls. Keyboard arrows make incremental changes.",
  Counter:
    "A numeric field with increase and decrease actions. Try typing a number and checking the configured bounds.",
  Datepicker:
    "Open the calendar to choose a local date. Try the arrow keys, month navigation and clear action.",
  Chips:
    "Compact labels that can be selected or removed. The example shows how those actions update the form value.",
  "Segmented buttons":
    "Switch between related choices. Single selection uses radio behavior; multiple selection uses toggle buttons.",
  "Form playground":
    "Try the inputs together in a reactive form. Changes, reset and disabled state are shared across the controls.",
  Card: "A surface for related content, with optional heading and footer sections. Compare the spacing and surface treatment.",
  Container:
    "Constrain and arrange projected content with configurable width, height, spacing and flex layout.",
  Section:
    "Divide a page into sections with configurable spacing, dimensions and content layout.",
  Pane: "A glass or solid content panel with configurable dimensions and layout. Compare the surface and spacing.",
  Divider:
    "Separate related content with a horizontal or vertical rule and an optional label.",
  Avatar:
    "Represent a person with an image or initials. Compare size, shape, border and status variants.",
  Badge:
    "A compact status label. Compare the semantic tones, custom colors, icons and removal behavior.",
  List: "Present related items with optional icons, descriptions and metadata. Interactive rows expose click actions.",
  Icon: "An SVG icon with configurable size, stroke and accessible labeling. The selected name comes from the local icon registry.",
  "Icon catalog":
    "Search the full local SVG collection, choose an icon, and copy its component name from the example markup.",
  "Inline notification":
    "Contextual feedback beside related content. Try the action or dismiss button. The message stays visible until dismissed unless a duration is configured.",
  "Global notification":
    "A page-wide announcement for the application shell. Compare static, sticky and fixed placement, and try the action or dismissal.",
  Alert:
    "An inline message for status or feedback. Compare the tones, optional action and dismiss button.",
  Progress:
    "Show progress within configured bounds. Compare numeric, labeled and indeterminate states.",
  Toast:
    "A transient notification with optional heading, action and timer. Hover or focus the message to pause its timer.",
  Snackbar:
    "A compact notification with an optional action such as Undo. Try its action and dismiss button.",
  "Loading skeleton":
    "Preview a loading placeholder before content arrives. Compare shapes, animation and the loaded state.",
  "Notifications service":
    "Use the launch buttons to stack toasts and snackbars. Try the action buttons and clear all notifications.",
  Modal:
    "Open a centered dialog. Try keyboard focus, Escape, the backdrop and the footer actions.",
  Sidepanel:
    "Open a panel attached to a viewport edge. Try its content, dismissal and focus restoration.",
  "Bottom sheet":
    "Open a sheet at the bottom of the viewport. Try its actions and keyboard dismissal.",
  "Confirmation dialog":
    "Open a confirmation prompt and compare cancel and confirm actions. The close reason is displayed below.",
  "Tooltip directive":
    "Hover over or focus the trigger to reveal helpful text. Escape dismisses the tooltip.",
  "Popover directive":
    "Open content anchored to a trigger. The interactive example also demonstrates focus and dismissal.",
  Tab: "A projected tab label and panel, displayed inside a tab container. Try selecting another tab.",
  "Tab container":
    "Switch panels with the tab buttons or arrow keys. Compare activation mode and retained panel state.",
  Step: "A step descriptor with content and completion state. Try its completion action before moving forward.",
  "Stepper container":
    "Move through a sequence of steps. Compare optional steps, completion rules and navigation actions.",
};
const scenarios: Record<string, string> = {
  Disabled: "This example disables interaction.",
  ReadOnly: "This example allows reading but prevents editing.",
  Invalid: "This example shows a validation error.",
  Loading: "This example shows work in progress.",
  Small: "This example uses the small size.",
  Large: "This example uses the large size.",
  "Flex Row": "The content is arranged in a flex row.",
  "Fixed Height":
    "The container uses a fixed height so overflow is easy to inspect.",
  Compact: "Spacing is reduced for a denser layout.",
  "Visible Guide": "Empty mask positions remain visible as guide characters.",
  "Formatted Model":
    "The form stores the formatted value, including separators.",
  "Obscured Characters":
    "Entered characters are obscured in the field; this demo still displays synthetic raw values below.",
  "Custom Pattern":
    "The pattern accepts three letters followed by four digits and converts letters to uppercase.",
  "Custom Definitions":
    "A custom token restricts entry to hexadecimal characters.",
  "Optional Extension":
    "The extension is optional after the ten-digit phone number.",
  "Partial Allowed":
    "Incomplete values do not produce a mask validation error in this example.",
  "Weekend Filter": "Weekend dates cannot be selected.",
  "Monday First":
    "The calendar week starts on Monday and uses British date formatting.",
  "Filtered Bulk Actions":
    "Bulk selection applies only to the choices matching the search.",
  "Selection Limit": "The number of selected options is capped.",
  "Locked Selection":
    "A disabled preselected option is preserved when other choices are cleared.",
  Interactive:
    "The panel contains an interactive control. Try opening it with the keyboard and returning focus to the trigger.",
  Timed:
    "The notification dismisses automatically after its configured duration.",
  Persistent:
    "This notification remains visible until an action or dismissal closes it.",
  "Replace By Id":
    "Repeated launches use the same ID, replacing the previous notification.",
  "Keep After Action": "The notification remains visible after its action.",
};
export function storyNote(
  title: string,
  name: string,
  args: Record<string, unknown>,
): string {
  const component = title.includes("/Mask examples/")
    ? "Input masks"
    : (title.split("/")[1] ?? title);
  let text =
    summaries[component] ??
    `Explore ${component.toLowerCase()} in this ${name.toLowerCase()} example. Use the controls to compare its behavior and appearance.`;
  const scenario = scenarios[name];
  if (scenario) text += " " + scenario;
  if (
    component === "Input masks" &&
    typeof args["maskPreset"] === "string" &&
    args["maskPreset"] !== "none"
  )
    text += ` The selected formatting preset is ${args["maskPreset"]}${args["maskPreset"] === "tin" ? " (" + (args["tinType"] ?? "individual") + ")" : ""}.`;
  if (name !== "Default" && !scenario && typeof args["tone"] === "string")
    text += ` This example uses the ${args["tone"]} tone.`;
  if (
    typeof (args["options"] as { position?: string } | undefined)?.position ===
    "string"
  )
    text += ` Notifications appear at ${(args["options"] as { position: string }).position.replaceAll("-", " ")}.`;
  return text;
}
