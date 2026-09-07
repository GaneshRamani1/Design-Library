import {
  groupFor,
  catalogGroupFor,
  settingName,
  explanation,
  variantName,
} from "./story-catalog.mjs";
import { guidanceFor, outputExplanation } from "./component-guidance.mjs";
import { toId, storyNameFromExport } from "storybook/internal/csf";
import ts from "typescript";
import fs from "node:fs";
import path from "node:path";
const check = process.argv.includes("--check");
const expectedFiles = new Set();
function writeOutput(file, content) {
  expectedFiles.add(file);
  if (check) {
    if (!fs.existsSync(file) || fs.readFileSync(file, "utf8") !== content)
      throw new Error(
        "Configuration stories are stale: " +
          file +
          "; run npm run stories:generate.",
      );
  } else {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
  }
}
const root = "projects/design-library/src/lib";
const files = fs
  .readdirSync(root, { recursive: true })
  .filter((f) => f.endsWith(".ts") && !f.includes(".stories."))
  .map((f) => path.join(root, f));
const classes = new Map(),
  aliases = new Map();
for (const file of files) {
  const source = ts.createSourceFile(
    file,
    fs.readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
  );
  for (const node of source.statements) {
    if (ts.isTypeAliasDeclaration(node)) aliases.set(node.name.text, node.type);
    if (!ts.isClassDeclaration(node) || !node.name) continue;
    const fields = [];
    for (const member of node.members) {
      if (
        !ts.isPropertyDeclaration(member) ||
        !member.initializer ||
        !ts.isCallExpression(member.initializer)
      )
        continue;
      const call = member.initializer,
        kind = call.expression.getText(source);
      if (!/^(input|model|output)(\.required)?$/.test(kind)) continue;
      fields.push({
        name: member.name.getText(source),
        kind: kind.split(".")[0],
        type: call.typeArguments?.[0],
        initial: call.arguments[0],
        source,
      });
    }
    classes.set(node.name.text, {
      file,
      name: node.name.text,
      parent: node.heritageClauses?.[0]?.types[0]?.expression.getText(source),
      fields,
    });
  }
}
function allFields(cls) {
  const c = classes.get(cls);
  return c ? [...allFields(c.parent), ...c.fields] : [];
}
function literal(node) {
  if (!node) return undefined;
  if (ts.isStringLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (node.kind === ts.SyntaxKind.NullKeyword) return null;
  return undefined;
}
function union(node) {
  if (!node) return [];
  if (node.kind === ts.SyntaxKind.BooleanKeyword) return [false, true];
  if (ts.isTypeReferenceNode(node))
    return union(aliases.get(node.typeName.getText()));
  if (ts.isUnionTypeNode(node)) return node.types.flatMap(union);
  if (ts.isLiteralTypeNode(node)) {
    const value = literal(node.literal);
    return value === null || value === undefined ? [] : [value];
  }
  return [];
}
const text = {
  id: "custom-example",
  label: "Custom label",
  heading: "A custom heading",
  description: "More context, in your own words.",
  hint: "A helpful hint.",
  error: "Please review this value.",
  placeholder: "Choose something…",
  ariaLabel: "Custom accessible dialog name",
  icon: "★",
  src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect width="64" height="64" fill="%237c3aed"/%3E%3Ccircle cx="32" cy="25" r="12" fill="white"/%3E%3C/svg%3E',
  customInitials: "UI",
  name: "Taylor Lee",
  gap: "24px",
  padding: "32px",
  height: "280px",
  width: "420px",
  maxWidth: "90vw",
  maxHeight: "75dvh",
  panelPadding: "32px",
  radius: "24px",
  fontSize: "18px",
  valueLabel: "{value} complete ({percent}%)",
  customBackground: "#302040",
  customColor: "#ead6ff",
  customBorder: "#a78bfa",
  trackColor: "#3f3f46",
  barColor: "#a78bfa",
  unit: " units",
  iconSize: "18px",
  pattern: "[A-Za-z]+",
  autocomplete: "email",
  labelSeparator: " · ",
  searchLabel: "Find options",
  selectedCountLabel: "{count} choices",
  limitMessage: "Maximum: {limit}; chosen: {count}",
  backdropClass: "dl-overlay-backdrop",
  panelClass: "custom-overlay",
  closeLabel: "Dismiss window",
  doneLabel: "Apply",
  confirmLabel: "Confirm action",
  cancelLabel: "Go back",
  removeLabel: "Remove item",
  dismissLabel: "Dismiss message",
  actionLabel: "Review details",
  loadingLabel: "Working…",
  previousLabel: "Back",
  nextLabel: "Continue",
  finishLabel: "Complete setup",
  optionalLabel: "Not required",
  incrementIcon: "＋",
  decrementIcon: "−",
  incrementLabel: "Add one",
  decrementLabel: "Remove one",
  closeOnSelect: false,
};
const numeric = {
  min: 2,
  max: 10,
  step: 2,
  maxLength: 8,
  minLength: 3,
  maxSelected: 2,
  optionsMaxHeight: 140,
  menuWidth: 360,
  minHeight: 180,
};
const appearance = {
  padding: "28px",
  radius: "24px",
  borderWidth: "3px",
  borderColor: "#a78bfa",
  background: "#251c32",
  color: "#e9d5ff",
  fontSize: "18px",
  gap: "24px",
  shadow: "0 12px 32px #7c3aed40",
  focusColor: "#f59e0b",
};
function values(field, cls) {
  if (field.name === "snapPoints") return [["45dvh", "70dvh", "90dvh"]];
  if (["NumberInputComponent", "CounterButtonComponent"].includes(cls)) {
    const samples = {
      locale: "de-DE",
      currency: "EUR",
      precision: 3,
      minPrecision: 2,
      min: 0,
      max: 100,
      step: 0.25,
    };
    if (field.name in samples) return [samples[field.name]];
  }
  if (cls === "HeaderComponent") {
    const samples = {
      metadata: [
        { label: "Owner", value: "Engineering" },
        { label: "Version", value: "2.0" },
      ],
      responsiveBreakpoint: 800,
      padding: "32px",
      gap: "32px",
      contentGap: "16px",
      metadataGap: "16px",
      headingColor: "#a78bfa",
      subheadingColor: "#8b5cf6",
      metadataColor: "#7c3aed",
    };
    if (field.name in samples) return [samples[field.name]];
  }
  if (cls === "CarouselDirective") {
    const samples = {
      breakpoints: { 0: 1, 540: 2, 720: 3 },
      slidesPerView: 2,
      gap: 24,
      step: 2,
      index: 2,
      interval: 2000,
      height: "400px",
      width: "600px",
      slideLabel: "Project",
    };
    if (field.name in samples) return [samples[field.name]];
  }
  if (cls === "ValidationDirective") {
    if (["validators", "asyncValidators"].includes(field.name)) return [[]];
    if (field.name === "validationMessages")
      return [
        {
          companyEmail: "Only a work email is accepted.",
          required: "This field cannot be empty.",
        },
      ];
    if (field.name === "validationAppearance")
      return [{ padding: "18px", radius: "16px", borderColor: "#a78bfa" }];
    if (field.name === "validationWidth") return ["300px"];
  }
  if (cls === "TilesComponent") {
    const samples = {
      series: [8, 12, 10, 19, 22, 18, 28],
      icon: "heart",
      iconSize: 28,
      valueSize: "48px",
      valueColor: "#a78bfa",
      chartColor: "#a78bfa",
      chartHeight: "100px",
      chartStrokeWidth: 3,
      progress: 72,
      minHeight: "280px",
      prefix: "€",
      suffix: " / month",
      trend: "8.4%",
      comparison: "vs. last week",
      footerText: "Updated 5 minutes ago",
      emptyText: "No data",
    };
    if (field.name in samples) return [samples[field.name]];
  }
  if (cls === "LinkDirective" && field.name === "download")
    return ["workspace.txt"];
  if (cls === "LinkDirective" && field.name === "tabIndex") return [0];
  if (cls === "LinkDirective" && field.name === "rel") return ["nofollow"];
  if (cls === "BreadcrumbComponent" && field.name === "iconSize") return [24];
  if (cls === "LinkDirective" && field.name === "href")
    return ["#link-destination"];
  if (cls === "LinkDirective" && field.name === "underlineOffset")
    return ["6px"];
  if (cls === "LinkDirective" && field.name === "fontWeight") return ["700"];
  if (cls === "BreadcrumbComponent" && field.name === "items")
    return [
      [
        { label: "Home", href: "#home" },
        { label: "Disabled", href: "#disabled", disabled: true },
        { label: "Current page" },
      ],
    ];
  if (cls === "BreadcrumbComponent" && field.name === "maxItems") return [3];
  if (
    ["InlineNotificationComponent", "GlobalNotificationComponent"].includes(cls)
  ) {
    if (field.name === "icon") return ["star"];
    if (field.name === "contentWidth") return ["640px"];
    if (field.name === "offset") return ["24px"];
  }
  if (cls === "DatepickerComponent" && ["min", "max"].includes(field.name))
    return [field.name === "min" ? "2026-09-03" : "2026-12-20"];
  if (
    ["IconComponent", "IconButtonComponent", "FabButtonComponent"].includes(
      cls,
    ) &&
    ["name", "icon", "fallback"].includes(field.name)
  )
    return ["star"];
  if (field.name === "dlPopover") return ["Popover with custom content."];
  if (field.name === "dlTooltip") return ["A custom tooltip."];
  if (field.name === "items")
    return [
      [
        {
          id: "one",
          label: "First item",
          icon: "heart",
          description: "Custom item data",
        },
        { id: "two", label: "Second item", disabled: true },
      ],
    ];
  if (field.name === "disabledDates") return [["2026-09-10", "2026-09-12"]];
  if (field.name === "expandedIds") return [["one"]];
  if (field.name === "dateFilter" || field.name === "data") return [null];
  if (field.name === "min" && cls === "DatepickerComponent")
    return ["2026-09-01"];
  if (field.name === "locale") return ["fr-FR"];
  if (field.name === "color") return ["#a78bfa"];
  if (field.name === "fill") return ["none"];
  if (field.name === "size" && cls === "IconComponent") return [16, 24, 32, 48];
  if (field.name === "strokeWidth") return [1, 2, 3];
  if (field.name === "width" && cls === "IconComponent") return [32];
  if (
    field.name === "iconSize" &&
    ["ListComponent", "IconButtonComponent", "FabButtonComponent"].includes(cls)
  )
    return [28];
  if (field.name === "duration") return [0, 3000, 8000];
  if (field.name === "mask") return ["aaa-0000"];
  if (field.name === "maskDefinitions") return [{ H: "[0-9a-fA-F]" }];
  if (field.name === "maskOptions")
    return [{ lazy: false, placeholderChar: "·" }];
  if (field.name === "maskPlaceholderChar") return ["·"];
  if (field.name === "maskDisplayChar") return ["•"];
  const u = union(field.type);
  if (u.length) return u;
  const d = literal(field.initial);
  if (typeof d === "boolean") return [false, true];
  if (field.name === "appearance") return [{ padding: "24px", radius: "20px" }];
  if (field.name === "styleTokens")
    return [
      {
        "--dl-primary": "#7c3aed",
        "--dl-text": "#a78bfa",
        "--dl-success-bg": "#2e1c47",
        "--dl-success-text": "#dfc7ff",
      },
    ];
  if (field.name === "options" && cls === "ChipsComponent")
    return [
      [
        { value: "alpha", label: "Alpha", icon: "heart" },
        { value: "beta", label: "Beta" },
        { value: "locked", label: "Locked", disabled: true },
      ],
    ];
  if (field.name === "options")
    return [
      [
        { value: "alpha", label: "Alpha", description: "A custom option" },
        { value: "beta", label: "Beta" },
        { value: "locked", label: "Locked", disabled: true },
      ],
    ];
  if (field.name === "value")
    return [
      cls.includes("Tab")
        ? "activity"
        : cls.includes("Step")
          ? "preferences"
          : typeof d === "boolean"
            ? !d
            : 2,
    ];
  if (field.name === "autoFocus") return ["dialog", ".cancel"];
  if (field.name === "badge") return ["12"];
  if (field.name in numeric) return [numeric[field.name]];
  if (typeof d === "number") return [d + 8];
  if (field.name in text) return [text[field.name]];
  if (typeof d === "string") return ["Custom " + field.name];
  return [null];
}
function titleCase(value) {
  return String(value)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join("");
}
function mdxText(value) {
  return String(value ?? "")
    .replaceAll("|", "\\|")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("{", "&#123;")
    .replaceAll("}", "&#125;");
}
const manifest = [];
for (const [name, c] of classes) {
  if (!/\.(component|directive)\.ts$/.test(c.file)) continue;
  const storyFile = c.file.replace(
    /\.(component|directive)\.ts$/,
    ".stories.ts",
  );
  if (!fs.existsSync(storyFile)) continue;
  const content = fs.readFileSync(storyFile, "utf8");
  const hasDefault = /export const Default\b/.test(content);
  const baseMetaSource = content.slice(
    0,
    content.indexOf("export default meta"),
  );
  const inheritsRender = /\brender\s*:/.test(baseMetaSource);
  const sourceTitle = content.match(/title:\s*["']([^"']+)/)?.[1];
  const title = sourceTitle?.replace("/Variations", "");
  if (!title) throw Error("Missing title: " + storyFile);
  const unique = new Map(allFields(name).map((f) => [f.name, f]));
  const fields = [...unique.values()];
  const inputs = fields.filter((f) => f.kind !== "output");
  const events = fields
    .filter((f) => f.kind === "output")
    .map((f) => f.name)
    .concat(
      fields.filter((f) => f.kind === "model").map((f) => f.name + "Change"),
    );
  const descriptions = Object.fromEntries(
    inputs.map((f) => [
      f.name,
      {
        table: {
          category: catalogGroupFor(f.name).split("/")[0],
          subcategory: groupFor(f.name),
        },
        description: explanation(
          f.name,
          literal(f.initial),
          title.split("/").at(-1),
        ),
        table: {
          category: catalogGroupFor(f.name).split("/")[0],
          subcategory: groupFor(f.name),
          type: { summary: f.type?.getText(f.source) ?? "inferred" },
          defaultValue: {
            summary: f.initial?.getText(f.source) ??
              (f.kind === "model" ? "model" : "required"),
          },
        },
        ...(union(f.type).length === 2 &&
        union(f.type).every((value) => typeof value === "boolean")
          ? { control: "boolean" }
          : union(f.type).length
            ? { control: "select", options: union(f.type) }
            : /number/.test(f.type?.getText(f.source) ?? "")
              ? { control: "number" }
              : /string/.test(f.type?.getText(f.source) ?? "")
                ? { control: "text" }
                : { control: "object" }),
      },
    ]),
  );
  for (const event of events)
    descriptions[event] = {
      control: false,
      table: { category: "Outputs" },
      description: `Emitted by ${title.split("/").at(-1)} during interaction and logged in Storybook Actions.`,
    };
  if (name === "CardComponent") {
    Object.assign(descriptions, {
      heading: {
        ...descriptions.heading,
        control: "text",
        description:
          "Text rendered in the optional Card header. Leave it empty when projected content provides the heading.",
      },
      description: {
        ...descriptions.description,
        control: "text",
        description:
          "Supporting copy displayed below the heading inside the Card header.",
      },
      headingLevel: {
        ...descriptions.headingLevel,
        description:
          "Semantic heading element used for the generated title: h2, h3, or h4. Choose it from the surrounding page hierarchy, not visual size.",
      },
      showHeader: {
        ...descriptions.showHeader,
        control: "boolean",
        description:
          "Shows the generated header when a heading is present. Disable it when the projected body owns its heading structure.",
      },
      showFooter: {
        ...descriptions.showFooter,
        control: "boolean",
        description:
          "Displays content projected with the cardFooter attribute in a separated footer region.",
      },
      surface: {
        ...descriptions.surface,
        description:
          "Selects the Card surface treatment: translucent glass, opaque solid, or transparent.",
      },
      appearance: {
        ...descriptions.appearance,
        control: "object",
        description:
          "Applies coordinated instance-level values such as padding, radius, border, background, color, and shadow.",
      },
      styleTokens: {
        ...descriptions.styleTokens,
        control: "object",
        description:
          "Overrides Card CSS custom properties for reusable theme-level customization.",
      },
    });
  }
  const buckets = new Map();
  function addStory(prop, exportName, story, value) {
    const group = catalogGroupFor(prop).split("/")[0],
      setting = settingName(prop),
      storyTitle = `${title}/${group}`;
    const description = explanation(prop, value, title.split("/").at(-1));
    story.parameters = {
      ...story.parameters,
      storyNote: description,
      configuration: { property: prop.replace(/^event\./, ""), value },
      docs: { ...story.parameters?.docs, description: { story: description } },
    };
    const bucket = buckets.get(storyTitle) ?? { group, stories: [] };
    bucket.stories.push({ exportName, story });
    buckets.set(storyTitle, bucket);
    records.push({
      prop,
      story: exportName,
      value,
      title: storyTitle,
      group,
      description,
      id: toId(
        storyTitle,
        storyNameFromExport(exportName),
      ),
    });
  }
  const records = [];
  for (const f of inputs) {
    for (const [i, v] of values(f, name).entries()) {
      const variants = values(f, name);
      const storyName =
        titleCase(f.name) + (variants.length > 1 ? titleCase(v) : "");
      const args = { [f.name]: v };
      if (
        name === "NumberInputComponent" &&
        ["currency", "currencyDisplay"].includes(f.name)
      )
        args.format = "currency";
      if (name === "NumberInputComponent" && f.name === "percentValue")
        args.format = "percent";
      if (name === "CounterButtonComponent" && f.name === "step")
        args.precision = 2;
      if (
        name === "CarouselDirective" &&
        ["interval", "pauseOnFocus", "pauseOnHover"].includes(f.name)
      ) {
        args.autoplay = true;
        args.loop = true;
      }
      if (
        name === "TilesComponent" &&
        ["progress", "progressLabel"].includes(f.name)
      )
        args.showProgress = true;
      if (name === "TilesComponent" && f.name === "emptyText") {
        args.value = null;
        args.prefix = "";
      }
      if (name === "TilesComponent" && f.name === "loadingLabel")
        args.loading = true;
      if (name === "BreadcrumbComponent" && f.name === "linkCurrent")
        args.items = [
          { label: "Home", href: "#home" },
          { label: "Settings", href: "#settings" },
        ];
      if (
        name === "BreadcrumbComponent" &&
        ["collapseLabel", "expandLabel"].includes(f.name)
      )
        args.maxItems = 3;
      if (
        name === "GlobalNotificationComponent" &&
        ["placement", "offset", "zIndex"].includes(f.name)
      )
        args.position = "fixed";
      if (
        ["InlineNotificationComponent", "GlobalNotificationComponent"].includes(
          name,
        ) &&
        ["showProgress", "pauseOnHover"].includes(f.name)
      )
        args.duration = 8000;
      if (
        name === "InputComponent" &&
        f.name.startsWith("mask") &&
        !["mask", "maskPreset", "maskDefinitions"].includes(f.name)
      ) {
        args.maskPreset = "ssn";
        args.type = "text";
      }
      if (f.name === "maskDefinitions") {
        args.mask = "#HHHHHH";
        args.type = "text";
      }
      if (f.name === "tinType") args.maskPreset = "tin";
      if (f.name === "loadingLabel") args.loading = true;
      if (
        f.name === "customColor" ||
        f.name === "customBackground" ||
        f.name === "customBorder"
      )
        args.tone = "custom";
      if (
        f.name === "closeLabel" &&
        inputs.some((input) => input.name === "closable")
      )
        args.closable = true;
      if (f.name === "removeLabel") args.removable = true;
      if (f.name === "dismissLabel") args.dismissible = true;
      addStory(
        f.name,
        storyName,
        { name: variantName(v, variants.length), args },
        v,
      );
    }
  }
  const appearanceKey = inputs.some((f) => f.name === "appearance")
    ? "appearance"
    : inputs.some((f) => f.name === "validationAppearance")
      ? "validationAppearance"
      : null;
  for (const [key, value] of Object.entries(appearanceKey ? appearance : {})) {
    addStory(
      appearanceKey + "." + key,
      "Appearance" + titleCase(key),
      { name: "Example", args: { [appearanceKey]: { [key]: value } } },
      value,
    );
  }

  for (const event of events) {
    const eventStory = {
      name: "event · " + event,
      args: {
        ...(["dismissed", "visibleChange"].includes(event) &&
        inputs.some((f) => f.name === "dismissible")
          ? { dismissible: true }
          : {}),
        ...(["removed", "visibleChange"].includes(event) &&
        inputs.some((f) => f.name === "removable")
          ? { removable: true }
          : {}),
        ...(event === "action" ? { actionLabel: "Try action" } : {}),
        ...(event === "closed" && name === "TabComponent"
          ? { closable: true }
          : {}),
        ...(event === "expanded" ? { maxItems: 3 } : {}),
        ...(event === "indeterminateChange" ? { indeterminate: true } : {}),
        ...(["maskAccept", "maskComplete"].includes(event)
          ? { maskPreset: "ssn", type: "text" }
          : {}),
      },
      argTypes: {
        [event]: {
          control: false,
          table: { category: "Outputs" },
          description: "Emissions appear in Actions as " + name + "." + event,
        },
      },
      parameters: {
        docs: {
          description: {
            story:
              "Interact with the component to inspect " +
              event +
              " in the Actions panel.",
          },
        },
      },
    };
    eventStory.name = "Try the event";
    addStory("event." + event, "Event" + titleCase(event), eventStory);
  }
  const slug = (value) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  for (const [storyTitle, bucket] of buckets) {
    if (name === "CardComponent") continue;
    const file = path.join(
      path.dirname(c.file),
      "stories",
      path.basename(c.file).replace(/\.(component|directive)\.ts$/, ""),
      slug(bucket.group) + ".stories.ts",
    );
    const relative = (target) => {
      let rel = path.relative(path.dirname(file), target).replace(/\.ts$/, "");
      return rel.startsWith(".") ? rel : "./" + rel;
    };
    let out = `// Generated by scripts/generate-config-stories.mjs. Edit the generator, then regenerate.\nimport type { Meta, StoryObj } from "@storybook/angular";\nimport baseMeta${hasDefault ? ", { Default as baseStory }" : ""} from ${JSON.stringify(relative(storyFile))};\nimport { ${name} } from ${JSON.stringify(relative(c.file))};\nconst meta: Meta<${name}> = { ...baseMeta, title: ${JSON.stringify(storyTitle)}, id: ${JSON.stringify(toId(storyTitle))}, component: ${name}, tags: [], args: { ...baseMeta.args }, argTypes: { ...baseMeta.argTypes, ...${JSON.stringify(descriptions)} } };\nexport default meta;\ntype Story = StoryObj<${name}>;\n`;
    if (bucket.group === "Configuration")
      out += `export const Default: Story = { ${hasDefault ? "...baseStory," : ""} parameters: { ${hasDefault ? "...baseStory.parameters," : ""} storyNote: "Start with the recommended defaults, then use Controls to configure every public input." } };\n`;
    for (const { exportName, story } of bucket.stories) {
      const storySource = JSON.stringify(story).replace(/^\{"name":/, "{name:");
      out += hasDefault
        ? `export const ${exportName}: Story = { ...baseStory, ...${storySource}, args: { ...baseStory.args, ...${JSON.stringify(story.args ?? {})} }, parameters: { ...baseStory.parameters, ...${JSON.stringify(story.parameters ?? {})} } };\n`
        : `export const ${exportName}: Story = ${storySource};\n`;
    }
    writeOutput(file, out);
  }

  const overviewFile = path.join(
    path.dirname(c.file),
    "stories",
    path.basename(c.file).replace(/\.(component|directive)\.ts$/, ""),
    "configuration",
    "overview.stories.ts",
  );
  const overviewImport = path
    .relative(path.dirname(overviewFile), storyFile)
    .replace(/\.ts$/, "");
  const overviewComponent = path
    .relative(path.dirname(overviewFile), c.file)
    .replace(/\.ts$/, "");
  const overviewTitle = `${title}/Configuration/Overview`;
  const overviewId = toId(overviewTitle, "overview");

  if (name === "CardComponent") {
    const cardDirectory = path.join(path.dirname(c.file), "stories", "card");
    const relativeFromCard = (target) => {
      let rel = path.relative(cardDirectory, target).replace(/\.ts$/, "");
      return rel.startsWith(".") ? rel : "./" + rel;
    };
    const cardArgs = JSON.stringify({
      heading: "A little structure. A lot of possibility.",
      description: "A flexible container for your next great idea.",
      showHeader: true,
      showFooter: false,
      headingLevel: 3,
      surface: "glass",
      appearance: {},
      styleTokens: {},
    });
    const sharedMeta = `component: CardComponent, tags: [], args: ${cardArgs}, render: (args) => ({ props: args, template: \`<dl-card \${argsToTemplate(args)}><p>Compose any content inside this card.</p><span cardFooter>Optional footer content.</span></dl-card>\` })`;
    const cardOverrideStories = Object.entries(appearance)
      .map(
        ([property, value]) =>
          `export const ${titleCase(property)}: Story = { args: { appearance: { ${property}: ${JSON.stringify(value)} } }, parameters: { storyNote: ${JSON.stringify(explanation("appearance." + property, value, "Card"))} } };`,
      )
      .join("\n");
    writeOutput(
      path.join(cardDirectory, "configuration.stories.ts"),
      `// Generated by scripts/generate-config-stories.mjs. Edit the generator, then regenerate.
import { argsToTemplate, type Meta, type StoryObj } from "@storybook/angular";
import { CardComponent } from ${JSON.stringify(relativeFromCard(c.file))};
const meta: Meta<CardComponent> = { id: "layout-card-configuration", title: "Layout/Card/Configuration", ${sharedMeta}, argTypes: ${JSON.stringify(descriptions)} };
export default meta;
type Story = StoryObj<CardComponent>;
export const Default: Story = { parameters: { storyNote: "The recommended card configuration includes a heading and description with optional projected body content." } };
export const HideHeader: Story = { args: { showHeader: false }, parameters: { storyNote: "Hide the generated header when the projected content supplies its own heading structure." } };
export const ShowFooter: Story = { args: { showFooter: true }, parameters: { storyNote: "Show the footer slot for secondary actions, summaries, or supporting metadata." } };
export const HeadingLevel2: Story = { name: "Heading level 2", args: { headingLevel: 2 }, parameters: { storyNote: "Use level 2 when the card heading begins a major page section." } };
export const HeadingLevel3: Story = { name: "Heading level 3", args: { headingLevel: 3 }, parameters: { storyNote: "Level 3 is the default for cards nested within a page section." } };
export const HeadingLevel4: Story = { name: "Heading level 4", args: { headingLevel: 4 }, parameters: { storyNote: "Use level 4 for cards nested within a more detailed content hierarchy." } };
export const CustomContent: Story = { args: { heading: "Quarterly performance", description: "Updated five minutes ago", showFooter: true }, parameters: { storyNote: "Heading, description, body projection, and footer projection can be composed as one content surface." } };
`,
    );
    writeOutput(
      path.join(cardDirectory, "appearance.stories.ts"),
      `// Generated by scripts/generate-config-stories.mjs. Edit the generator, then regenerate.
import { argsToTemplate, type Meta, type StoryObj } from "@storybook/angular";
import { CardComponent } from ${JSON.stringify(relativeFromCard(c.file))};
const meta: Meta<CardComponent> = { id: "layout-card-appearance", title: "Layout/Card/Appearance", ${sharedMeta}, argTypes: ${JSON.stringify(descriptions)} };
export default meta;
type Story = StoryObj<CardComponent>;
export const Default: Story = { parameters: { storyNote: "The default appearance inherits the active light or dark theme tokens." } };
export const CustomStyles: Story = { args: { appearance: { padding: "32px", radius: "24px", borderWidth: "2px", borderColor: "#a78bfa", background: "#251c32", color: "#f5edff", shadow: "0 18px 48px #7c3aed33" } }, parameters: { storyNote: "Use the appearance object when one card needs several coordinated visual overrides." } };
export const ThemeTokens: Story = { args: { styleTokens: { "--dl-card-surface": "#13231b", "--dl-card-border": "#3f7255", "--dl-card-radius": "20px", "--dl-card-shadow": "0 16px 40px #0005" } }, parameters: { storyNote: "Theme tokens customize the card and can be shared across a feature or product area." } };
export const Compact: Story = { args: { appearance: { padding: "16px", gap: "12px", radius: "10px" } }, parameters: { storyNote: "A compact appearance works for dense dashboards while preserving the same Card API." } };
${cardOverrideStories}
`,
    );
    for (const record of records) {
      if (record.prop === "surface") {
        record.title = "Layout/Card/Variations";
        record.story = titleCase(record.value);
        record.id = toId("layout-card", storyNameFromExport(record.story));
      } else if (record.prop.startsWith("appearance.")) {
        record.title = "Layout/Card/Appearance";
        record.story = titleCase(record.prop.slice("appearance.".length));
        record.id = toId(
          "layout-card-appearance",
          storyNameFromExport(record.story),
        );
      } else if (["appearance", "styleTokens"].includes(record.prop)) {
        record.title = "Layout/Card/Appearance";
        record.story =
          record.prop === "styleTokens" ? "ThemeTokens" : "CustomStyles";
        record.id = toId(
          "layout-card-appearance",
          storyNameFromExport(record.story),
        );
      } else {
        record.title = "Layout/Card/Configuration";
        record.story =
          record.prop === "headingLevel"
            ? `HeadingLevel${record.value}`
            : record.prop === "showHeader" && record.value === false
              ? "HideHeader"
              : record.prop === "showFooter" && record.value === true
                ? "ShowFooter"
                : ["heading", "description"].includes(record.prop)
                  ? "CustomContent"
                  : "Default";
        record.id = toId(
          "layout-card-configuration",
          storyNameFromExport(record.story),
        );
      }
    }
  }

  const componentSlug = path
    .basename(c.file)
    .replace(/\.(component|directive)\.ts$/, "");
  const componentStoryDirectory = path.join(
    path.dirname(c.file),
    "stories",
    componentSlug,
  );
  const playgroundFile = path.join(
    componentStoryDirectory,
    "playground.stories.ts",
  );
  const playgroundStoryImport = path
    .relative(path.dirname(playgroundFile), storyFile)
    .replace(/\.ts$/, "");
  const playgroundComponentImport = path
    .relative(path.dirname(playgroundFile), c.file)
    .replace(/\.ts$/, "");
  const playgroundTitle = `${title}/Playground`;
  if (name === "CardComponent")
    writeOutput(
      playgroundFile,
      `// Generated by scripts/generate-config-stories.mjs. Edit the generator, then regenerate.
import { argsToTemplate, type Meta, type StoryObj } from "@storybook/angular";
import { ${name} } from ${JSON.stringify(playgroundComponentImport.startsWith(".") ? playgroundComponentImport : "./" + playgroundComponentImport)};
const meta: Meta<${name}> = { id: ${JSON.stringify(toId(playgroundTitle))}, title: ${JSON.stringify(playgroundTitle)}, component: ${name}, tags: [], args: { heading: "A little structure. A lot of possibility.", description: "A flexible container for your next great idea.", showHeader: true, showFooter: false, headingLevel: 3, surface: "glass", appearance: {}, styleTokens: {} }, render: (args) => ({ props: args, template: \`<dl-card \${argsToTemplate(args)}><p>Compose any content inside this card.</p><span cardFooter>Optional footer content.</span></dl-card>\` }), argTypes: ${JSON.stringify(descriptions)} };
export default meta;
export const Playground: StoryObj<${name}> = { parameters: { storyNote: "Use Controls to configure every public input. Interact with the rendered component to inspect output payloads in the Actions panel.", controls: { expanded: true, sort: "requiredFirst" }, docs: { description: { story: "A complete interactive workspace for this component. Every public input is available through Controls and every output is connected to Actions." } } } };
`,
    );
  else
    writeOutput(
      playgroundFile,
      `// Generated by scripts/generate-config-stories.mjs. Edit the generator, then regenerate.
import type { Meta, StoryObj } from "@storybook/angular";
import baseMeta from ${JSON.stringify(playgroundStoryImport.startsWith(".") ? playgroundStoryImport : "./" + playgroundStoryImport)};
import { ${name} } from ${JSON.stringify(playgroundComponentImport.startsWith(".") ? playgroundComponentImport : "./" + playgroundComponentImport)};
const meta: Meta<${name}> = { ...baseMeta, id: ${JSON.stringify(toId(playgroundTitle))}, title: ${JSON.stringify(playgroundTitle)}, component: ${name}, tags: [], args: { ...baseMeta.args }, argTypes: { ...baseMeta.argTypes, ...${JSON.stringify(descriptions)} } };
export default meta;
export const Playground: StoryObj<${name}> = { parameters: { storyNote: "Use Controls to configure every public input. Interact with the rendered component to inspect output payloads in the Actions panel.", controls: { expanded: true, sort: "requiredFirst" }, docs: { description: { story: "A complete interactive workspace for this component. Every public input is available through Controls and every output is connected to Actions." } } } };
`,
    );

  const source = fs.readFileSync(c.file, "utf8");
  const selector = source.match(/selector:\s*["']([^"']+)/)?.[1] ?? name;
  const slots = [
    ...new Set(
      [
        ...source.matchAll(/<ng-content(?:\s+select=["']([^"']+)["'])?[^>]*>/g),
      ].map((match) => match[1] ?? "default content"),
    ),
  ];
  const featureGroups = new Map();
  for (const field of inputs) {
    const group = catalogGroupFor(field.name).split("/")[0];
    featureGroups.set(group, [...(featureGroups.get(group) ?? []), field.name]);
  }
  const inputRows = inputs.length
    ? inputs
        .map(
          (field) =>
            `| \`${mdxText(field.name)}\` | \`${mdxText(field.type?.getText(field.source) ?? "inferred")}\` | \`${mdxText(field.initial?.getText(field.source) ?? (field.kind === "model" ? "model" : "required"))}\` | ${mdxText(explanation(field.name, literal(field.initial), title.split("/").at(-1)))} |`,
        )
        .join("\n")
    : "| — | — | — | This component has no configurable inputs. |";
  const eventRows = events.length
    ? events
        .map(
          (event) =>
            `| \`${mdxText(event)}\` | ${mdxText(outputExplanation(event))} The real payload is logged in Actions. |`,
        )
        .join("\n")
    : "| — | This component does not expose an Angular output. Native events still behave normally. |";
  const featureList = [...featureGroups]
    .map(
      ([group, props]) =>
        `- **${mdxText(group)}:** ${props.map((prop) => `\`${mdxText(prop)}\``).join(", ")}`,
    )
    .join("\n");
  const [purpose, usage] = guidanceFor(name, title.split("/").at(-1));
  const recipesFile = path.join(componentStoryDirectory, "recipes.stories.ts");
  const recipesBaseImport = path
    .relative(path.dirname(recipesFile), storyFile)
    .replace(/\.ts$/, "");
  const recipesComponentImport = path
    .relative(path.dirname(recipesFile), c.file)
    .replace(/\.ts$/, "");
  const recipeArgs = {};
  if (inputs.some((field) => field.name === "heading"))
    recipeArgs.heading = "A clear heading that remains readable on a narrow screen";
  if (inputs.some((field) => field.name === "label"))
    recipeArgs.label = "A descriptive label that may wrap onto another line";
  if (inputs.some((field) => field.name === "description"))
    recipeArgs.description = "Supporting information can be longer than expected, translated, or enlarged without hiding actions or causing horizontal scrolling.";
  if (inputs.some((field) => field.name === "message"))
    recipeArgs.message = "This longer message verifies wrapping, readable spacing, and action placement when the available width is limited.";
  if (inputs.some((field) => field.name === "stretch")) recipeArgs.stretch = true;
  const stateArgs = {};
  if (inputs.some((field) => field.name === "disabled")) stateArgs.disabled = true;
  else if (inputs.some((field) => field.name === "loading")) stateArgs.loading = true;
  else if (inputs.some((field) => field.name === "error")) stateArgs.error = "Review this value.";
  const recipesTitle = `${title}/Recipes`;
  writeOutput(
    recipesFile,
    `// Generated by scripts/generate-config-stories.mjs. Edit the generator, then regenerate.
import type { Meta, StoryObj } from "@storybook/angular";
import baseMeta${hasDefault ? ", { Default as baseStory }" : ""} from ${JSON.stringify(recipesBaseImport.startsWith(".") ? recipesBaseImport : "./" + recipesBaseImport)};
import { ${name} } from ${JSON.stringify(recipesComponentImport.startsWith(".") ? recipesComponentImport : "./" + recipesComponentImport)};
const meta: Meta<${name}> = { ...baseMeta, id: ${JSON.stringify(toId(recipesTitle))}, title: ${JSON.stringify(recipesTitle)}, component: ${name}, tags: [], args: { ...baseMeta.args } };
export default meta;
type Story = StoryObj<${name}>;
export const Mobile: Story = { ${hasDefault ? "...baseStory," : ""} args: { ${hasDefault ? "...baseStory.args," : ""} ...${JSON.stringify(recipeArgs)} }, parameters: { viewport: { defaultViewport: "mobile1" }, storyNote: "Verify the component at a narrow mobile width. Content must wrap without horizontal page scrolling, clipped focus rings, or unreachable actions." } };
export const LongContent: Story = { ${hasDefault ? "...baseStory," : ""} args: { ${hasDefault ? "...baseStory.args," : ""} ...${JSON.stringify(recipeArgs)} }, parameters: { storyNote: "Verify long, translated, and enlarged content. The component must preserve meaning, focus order, and access to every action." } };
export const NonDefaultState: Story = { ${hasDefault ? "...baseStory," : ""} args: { ${hasDefault ? "...baseStory.args," : ""} ...${JSON.stringify(stateArgs)} }, parameters: { storyNote: "Inspect a supported non-default state and confirm that meaning is conveyed through semantics and text as well as color." } };
`,
  );
  const docsFile = path.join(componentStoryDirectory, "documentation.mdx");
  if (name === "CardComponent")
    writeOutput(
      docsFile,
      `{/* Generated by scripts/generate-config-stories.mjs. Edit the generator, then regenerate. */}
import { Meta, Canvas, Controls, ArgTypes } from "@storybook/addon-docs/blocks";
import * as PlaygroundStories from "./playground.stories";
import * as RecipeStories from "./recipes.stories";
import * as ConfigurationStories from "./configuration.stories";
import * as VariationStories from "../../card.stories";
import * as AppearanceStories from "./appearance.stories";

<Meta title=${JSON.stringify(`${title}/Documentation`)} />

# Card

Build responsive content surfaces for dashboards, forms, settings, and grouped information. Card provides one consistent structure with projected content, an optional footer, semantic headings, three surfaces, and theme-aware styling.

<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", margin: "24px 0 36px" }}>
  <div style={{ padding: "18px", border: "1px solid var(--dl-border)", borderRadius: "12px" }}><strong>Structure</strong><br/><small>Header, body, and optional footer</small></div>
  <div style={{ padding: "18px", border: "1px solid var(--dl-border)", borderRadius: "12px" }}><strong>Semantic headings</strong><br/><small>Heading levels 2, 3, and 4</small></div>
  <div style={{ padding: "18px", border: "1px solid var(--dl-border)", borderRadius: "12px" }}><strong>Surfaces</strong><br/><small>Glass, solid, and transparent</small></div>
  <div style={{ padding: "18px", border: "1px solid var(--dl-border)", borderRadius: "12px" }}><strong>Responsive</strong><br/><small>Fluid content and theme tokens</small></div>
</div>

## Start with the default

The default combines a glass surface, level-three heading, description, and projected body content.

<Canvas of={ConfigurationStories.Default} />

## Configuration

Use focused scenarios instead of browsing one folder for every property.

- [Default card](?path=/story/layout-card-configuration--default)
- [Hide the generated header](?path=/story/layout-card-configuration--hide-header)
- [Show projected footer content](?path=/story/layout-card-configuration--show-footer)
- [Heading level 2](?path=/story/layout-card-configuration--heading-level-2)
- [Heading level 3](?path=/story/layout-card-configuration--heading-level-3)
- [Heading level 4](?path=/story/layout-card-configuration--heading-level-4)
- [Custom heading, description, and footer](?path=/story/layout-card-configuration--custom-content)

## Variations

Choose the surface from the visual context around the card.

<Canvas of={VariationStories.Glass} />

- [Glass surface](?path=/story/layout-card--glass)
- [Solid surface](?path=/story/layout-card--solid)
- [Transparent surface](?path=/story/layout-card--transparent)

## Appearance

Shared style overrides are consolidated because they all use the same \`appearance\` or \`styleTokens\` API.

- [Theme default](?path=/story/layout-card-appearance--default)
- [Coordinated custom styles](?path=/story/layout-card-appearance--custom-styles)
- [Theme-token overrides](?path=/story/layout-card-appearance--theme-tokens)
- [Compact dashboard treatment](?path=/story/layout-card-appearance--compact)
${Object.keys(appearance)
  .map(
    (property) =>
      `- [${titleCase(property)} override](?path=/story/layout-card-appearance--${slug(property)})`,
  )
  .join("\n")}

<Canvas of={AppearanceStories.CustomStyles} />

## Inputs

Card inputs are grouped by the decision they control:

- **Structure:** \`showHeader\` and \`showFooter\` determine which regions render.
- **Content:** \`heading\`, \`description\`, and \`headingLevel\` define the generated header and its semantic hierarchy.
- **Variation:** \`surface\` selects glass, solid, or transparent treatment.
- **Appearance:** \`appearance\` handles one-off coordinated styling; \`styleTokens\` supplies reusable CSS token overrides.

The table below contains the accepted type, default value, control, and a specific explanation for every input.

<ArgTypes of={PlaygroundStories.Playground} />

## Outputs

Card does not emit a custom Angular output because it is a structural content surface. Interactive elements projected into its body or footer keep their own native or component outputs. For example, a projected \`button[dlButton]\` continues to emit its click event directly to the consuming application and to Storybook Actions.

## Content projection

- **Default slot:** place the Card's primary body content between \`<dl-card>\` and \`</dl-card>\`.
- **Footer slot:** add \`cardFooter\` to an element and enable \`showFooter\` to render it below the divider.

## Production recipes

- [Mobile width](?path=/story/layout-card-recipes--mobile)
- [Long and translated content](?path=/story/layout-card-recipes--long-content)
- [Non-default state](?path=/story/layout-card-recipes--non-default-state)

<Canvas of={RecipeStories.Mobile} />

## Playground

Use the playground after reviewing the supported patterns. Every Card input is connected to Controls.

<Canvas of={PlaygroundStories.Playground} />

<Controls of={PlaygroundStories.Playground} />

## Accessibility

- Provide the component's label, ID, and ARIA inputs whenever they are available.
- Preserve native keyboard behavior and visible focus styles.
- Keep disabled, read-only, loading, validation, and empty states understandable without color alone.
- Test the playground in light and dark themes and at mobile width.

## Implementation checklist

1. Choose the heading level from the surrounding page hierarchy.
2. Choose glass, solid, or transparent from the visual context.
3. Project body content and add \`cardFooter\` only when needed.
4. Apply appearance overrides and verify both themes and mobile width.
`,
    );
  else {
    const stageImports = [...new Set(records.map((record) => record.group))]
      .filter((group) => ["Configuration", "Events", "Appearance"].includes(group))
      .map((group) => {
        const variable = group + "Stories";
        return `import * as ${variable} from "./${slug(group)}.stories";`;
      })
      .join("\n");
    const linksFor = (group) =>
      records
        .filter((record) => record.group === group)
        .map(
          (record) =>
            `- [${mdxText(record.description)}](?path=/story/${record.id})`,
        )
        .join("\n") || "This component has no dedicated examples in this stage.";
    const defaultCanvas = records.some((record) => record.group === "Configuration")
      ? "<Canvas of={ConfigurationStories.Default} />"
      : "<Canvas of={PlaygroundStories.Playground} />";
    writeOutput(
      docsFile,
      `{/* Generated by scripts/generate-config-stories.mjs. Edit the generator, then regenerate. */}
import { Meta, Canvas, Controls, ArgTypes } from "@storybook/addon-docs/blocks";
import * as PlaygroundStories from "./playground.stories";
import * as RecipeStories from "./recipes.stories";
${stageImports}

<Meta title=${JSON.stringify(`${title}/Documentation`)} />

# ${mdxText(title.split("/").at(-1))}

${mdxText(purpose)}

${mdxText(usage)}

<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", margin: "24px 0 36px" }}>
  <div style={{ padding: "18px", border: "1px solid var(--dl-border)", borderRadius: "12px" }}><strong>Configuration</strong><br/><small>Content, behavior, states, labels, accessibility, and sizing</small></div>
  <div style={{ padding: "18px", border: "1px solid var(--dl-border)", borderRadius: "12px" }}><strong>Variations</strong><br/><small>Supported semantic and visual modes</small></div>
  <div style={{ padding: "18px", border: "1px solid var(--dl-border)", borderRadius: "12px" }}><strong>Events</strong><br/><small>Output payloads logged to Storybook Actions</small></div>
  <div style={{ padding: "18px", border: "1px solid var(--dl-border)", borderRadius: "12px" }}><strong>Appearance</strong><br/><small>Instance styles and reusable theme tokens</small></div>
</div>

## Start with the default

${defaultCanvas}

## Configuration

${linksFor("Configuration")}

## Variations

Use the Variations stories in the sidebar to compare the component's supported modes using realistic content.

## Events

${linksFor("Events")}

All listed outputs are observed globally and appear in the Storybook Actions panel when the example is operated.

## Appearance

${linksFor("Appearance")}

## Inputs

Inputs are grouped by purpose in Controls. Each row explains the accepted type and the behavior it changes.

<ArgTypes of={PlaygroundStories.Playground} />

## Outputs

| Output | Behavior |
| --- | --- |
${eventRows}

## Content projection

${slots.length ? slots.map((slot) => `- \`${mdxText(slot)}\``).join("\n") : "This component does not declare a content projection slot."}

## Production recipes

Use these scenarios as release checks in both light and black-glass dark themes.

- [Mobile width](?path=/story/${toId(recipesTitle, "mobile")})
- [Long and translated content](?path=/story/${toId(recipesTitle, "long-content")})
- [Non-default state](?path=/story/${toId(recipesTitle, "non-default-state")})

<Canvas of={RecipeStories.Mobile} />

## Playground

Every public input is connected to Controls. Output interactions are connected to Actions.

<Canvas of={PlaygroundStories.Playground} />

<Controls of={PlaygroundStories.Playground} />

## Accessibility and responsive checks

- Verify labels, IDs, ARIA names, keyboard behavior, disabled states, and visible focus.
- Check narrow mobile width, fluid containers, long text, light theme, and black glass dark theme.
- Confirm loading, validation, empty, selected, and error states without relying on color alone.
`,
    );
  }

  manifest.push({
    component: name,
    title,
    inputs: inputs.map((f) => f.name),
    events,
    stories: records,
  });
}

const observerFile = ".storybook/output-observers.generated.ts";
let observers =
  '// Generated by scripts/generate-config-stories.mjs. Edit the generator, then regenerate.\nimport { Directive, inject } from "@angular/core";\nimport { observeOutputs, observeNativeClick } from "./observe-outputs";\n';
const observerNames = [],
  observerCatalog = [];
for (const entry of manifest) {
  const c = classes.get(entry.component);
  const native = [
    "ButtonComponent",
    "IconButtonComponent",
    "FabButtonComponent",
  ].includes(entry.component);
  const fields = [
    ...new Map(allFields(entry.component).map((f) => [f.name, f])).values(),
  ];
  const bindings = Object.fromEntries(
    fields
      .filter((f) => ["model", "output"].includes(f.kind))
      .map((f) => [f.kind === "model" ? f.name + "Change" : f.name, f.name]),
  );
  const selector = fs
    .readFileSync(c.file, "utf8")
    .match(/selector:\s*["']([^"']+)/)?.[1];
  if (!selector) throw Error("Missing selector: " + c.file);
  if (!native && !Object.keys(bindings).length) continue;
  const observer = entry.component + "StoryObserver";
  const source = "../" + c.file.replace(/\.ts$/, "");
  observers +=
    "import { " + entry.component + " } from " + JSON.stringify(source) + ";\n";
  observers +=
    "@Directive({selector:" +
    JSON.stringify(selector) +
    ",standalone:true})\nexport class " +
    observer +
    " { constructor(){";
  if (Object.keys(bindings).length)
    observers +=
      "observeOutputs(inject(" +
      entry.component +
      ", {self:true})," +
      JSON.stringify(entry.component) +
      "," +
      JSON.stringify(bindings) +
      ");";
  if (native)
    observers += "observeNativeClick(" + JSON.stringify(entry.component) + ");";
  observers += "} }\n";
  observerNames.push(observer);
  observerCatalog.push({
    component: entry.component,
    title: entry.title,
    selector,
    outputs: Object.keys(bindings),
    nativeClick: native,
  });
}
observers +=
  "export const STORY_OUTPUT_OBSERVERS = [" + observerNames.join(",") + "];\n";
observers +=
  "export const STORY_OUTPUT_CATALOG = " +
  JSON.stringify(observerCatalog) +
  ";\n";
writeOutput(observerFile, observers);

writeOutput(
  "projects/design-library/configuration-coverage.json",
  JSON.stringify(manifest, null, 2) + "\n",
);
for (const rel of fs.readdirSync(root, { recursive: true })) {
  const file = path.join(root, rel);
  if (
    (!rel.endsWith(".stories.ts") && !rel.endsWith(".mdx")) ||
    expectedFiles.has(file)
  )
    continue;
  const generatedSource = fs.readFileSync(file, "utf8");
  if (
    generatedSource.startsWith(
      "// Generated by scripts/generate-config-stories.mjs.",
    ) ||
    generatedSource.startsWith(
      "{/* Generated by scripts/generate-config-stories.mjs.",
    )
  ) {
    if (check) throw new Error("Obsolete generated story: " + file);
    fs.unlinkSync(file);
  }
}
console.log(
  `${manifest.length} components, ${manifest.reduce((n, c) => n + c.stories.length, 0)} configuration stories generated.`,
);
