import * as lucide from "@lucide/icons";
import type { IconCollection, IconData } from "./icon-registry";
/** Opt in to the complete Lucide collection. Use provideIcons({name: Icon}) for smaller bundles. */
export const ICON_CATALOG: IconCollection = /*#__PURE__*/ Object.fromEntries(
  Object.values(lucide)
    .filter(
      (v): v is IconData =>
        typeof v === "object" && v !== null && "node" in v && "name" in v,
    )
    .map((v) => [v.name, v]),
);
export const ICON_NAMES: readonly string[] =
  /*#__PURE__*/ Object.keys(ICON_CATALOG).sort();
