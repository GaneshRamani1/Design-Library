import {
  groupFor,
  catalogGroupFor,
  settingName,
  explanation,
  variantName,
} from "./story-catalog.mjs";
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
const manifest = [];
for (const [name, c] of classes) {
  if (!/\.(component|directive)\.ts$/.test(c.file)) continue;
  const storyFile = c.file.replace(
    /\.(component|directive)\.ts$/,
    ".stories.ts",
  );
  if (!fs.existsSync(storyFile)) continue;
  const content = fs.readFileSync(storyFile, "utf8");
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
        description: `Configure ${f.name}. See its dedicated setting folder for examples of each supported mode.`,
        ...(union(f.type).length
          ? { control: "select", options: union(f.type) }
          : {}),
      },
    ]),
  );
  const buckets = new Map();
  function addStory(prop, exportName, story, value) {
    const group = catalogGroupFor(prop),
      setting = settingName(prop),
      storyTitle = `${title}/${group}/${setting}`;
    const description = explanation(prop, value, title.split("/").at(-1));
    story.parameters = {
      ...story.parameters,
      storyNote: description,
      configuration: { property: prop.replace(/^event\./, ""), value },
      docs: { ...story.parameters?.docs, description: { story: description } },
    };
    const bucket = buckets.get(storyTitle) ?? { group, setting, stories: [] };
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
        `${title}/${groupFor(prop)}/${setting}`,
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
    const file = path.join(
      path.dirname(c.file),
      "stories",
      path.basename(c.file).replace(/\.(component|directive)\.ts$/, ""),
      ...bucket.group.split("/").map(slug),
      slug(bucket.setting) + ".stories.ts",
    );
    const relative = (target) => {
      let rel = path.relative(path.dirname(file), target).replace(/\.ts$/, "");
      return rel.startsWith(".") ? rel : "./" + rel;
    };
    let out = `// Generated by scripts/generate-config-stories.mjs. Edit the generator, then regenerate.\nimport type { Meta, StoryObj } from "@storybook/angular";\nimport baseMeta from ${JSON.stringify(relative(storyFile))};\nimport { ${name} } from ${JSON.stringify(relative(c.file))};\nconst meta: Meta<${name}> = { title: ${JSON.stringify(storyTitle)}, id: ${JSON.stringify(toId(`${title}/${groupFor(records.find((r) => r.title === storyTitle).prop)}/${bucket.setting}`))}, component: ${name}, tags: [], args: baseMeta.args, ${inheritsRender ? "render: (args, context) => baseMeta.render!(args, context), " : ""}decorators: baseMeta.decorators, parameters: baseMeta.parameters, argTypes: ${JSON.stringify(descriptions)} };\nexport default meta;\ntype Story = StoryObj<${name}>;\n`;
    for (const { exportName, story } of bucket.stories)
      out += `export const ${exportName}: Story = ${JSON.stringify(story).replace(/^\{"name":/, "{name:")};\n`;
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
  const hasDefault = /export const Default\b/.test(content);
  writeOutput(
    overviewFile,
    `// Generated by scripts/generate-config-stories.mjs. Edit the generator, then regenerate.
import type { Meta, StoryObj } from "@storybook/angular";
import baseMeta${hasDefault ? ", { Default as baseStory }" : ""} from ${JSON.stringify(overviewImport.startsWith(".") ? overviewImport : "./" + overviewImport)};
import { ${name} } from ${JSON.stringify(overviewComponent.startsWith(".") ? overviewComponent : "./" + overviewComponent)};
const meta: Meta<${name}> = { id: ${JSON.stringify(toId(overviewTitle))}, title: ${JSON.stringify(overviewTitle)}, component: ${name}, tags: [], args: baseMeta.args, ${inheritsRender ? "render: (args, context) => baseMeta.render!(args, context), " : ""}decorators: baseMeta.decorators, parameters: baseMeta.parameters, argTypes: ${JSON.stringify(descriptions)} };
export default meta;
export const Overview: StoryObj<${name}> = { ${hasDefault ? "args: baseStory.args, render: baseStory.render, play: baseStory.play," : ""} parameters: { storyNote: "Start here: configure the component using Controls below. Browse individual settings next, then Variations, Events and Appearance.", controls: { expanded: true, sort: "requiredFirst" } } };
`,
  );
  records.unshift({
    prop: "overview",
    story: "Overview",
    title: overviewTitle,
    group: "Configuration",
    description:
      "Configure the component using Controls, then explore individual settings.",
    id: overviewId,
  });

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
  if (!rel.endsWith(".stories.ts") || expectedFiles.has(file)) continue;
  if (
    fs
      .readFileSync(file, "utf8")
      .startsWith("// Generated by scripts/generate-config-stories.mjs.")
  ) {
    if (check) throw new Error("Obsolete generated story: " + file);
    fs.unlinkSync(file);
  }
}
console.log(
  `${manifest.length} components, ${manifest.reduce((n, c) => n + c.stories.length, 0)} configuration stories generated.`,
);
