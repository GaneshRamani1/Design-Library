import assert from "node:assert/strict";
import test from "node:test";
import {
  catalogSummary,
  getGuide,
  getPattern,
  getStory,
  loadCatalog,
  searchCatalog,
  validateUsage,
} from "./catalog.mjs";

test("loads the complete generated catalog", async () => {
  const catalog = await loadCatalog();
  const summary = catalogSummary(catalog);
  assert.equal(summary.components, 49);
  assert.equal(summary.services, 3);
  assert.equal(summary.patterns, 31);
  assert.ok(summary.stories > 2000);
});

test("retrieves components by selector and services by name", async () => {
  const catalog = await loadCatalog();
  const input = await getGuide(catalog, "component", "dl-input");
  const popover = await getGuide(catalog, "service", "PopoverService");
  assert.equal(input.component, "InputComponent");
  assert.match(input.markdown, /maskPreset/);
  assert.match(popover.markdown, /PopoverService/);
});

test("searches API metadata and retrieves stories and patterns", async () => {
  const catalog = await loadCatalog();
  assert.equal(
    searchCatalog(catalog, "currency precision", "component", 5)[0].name,
    "NumberInputComponent",
  );
  assert.equal(
    getStory(catalog, "actions-button--primary").id,
    "actions-button--primary",
  );
  assert.match(
    (await getPattern(catalog, "actions-button--variants")).markdown,
    /Variants/i,
  );
});

test("validates inputs and outputs", async () => {
  const catalog = await loadCatalog();
  const valid = validateUsage(
    catalog,
    "dl-alert",
    ["tone", "dismissible"],
    ["dismissed"],
  );
  const invalid = validateUsage(
    catalog,
    "dl-alert",
    ["imaginary"],
    ["dismissed"],
  );
  assert.equal(valid.valid, true);
  assert.equal(invalid.valid, false);
  assert.match(invalid.errors[0], /imaginary/);
});
