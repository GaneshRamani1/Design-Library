import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import * as z from "zod/v4";
import {
  catalogSummary,
  getGuide,
  getPattern,
  getStory,
  listCatalog,
  loadCatalog,
  searchCatalog,
  validateUsage,
} from "./catalog.mjs";

const result = (value) => ({
  content: [
    {
      type: "text",
      text: typeof value === "string" ? value : JSON.stringify(value, null, 2),
    },
  ],
  structuredContent: typeof value === "string" ? { text: value } : value,
});

const guarded = (handler) => async (args) => {
  try {
    return result(await handler(args));
  } catch (error) {
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: error instanceof Error ? error.message : String(error),
        },
      ],
    };
  }
};

export function createArcwellServer() {
  const server = new McpServer(
    {
      name: "arcwell-ui",
      version: "1.0.0",
      websiteUrl: "https://github.com/ganeshramani/Design-Library",
    },
    {
      instructions:
        "Use this read-only server as the authoritative Arcwell UI catalog. Search first when the requested component is unclear, then retrieve the exact component, service, pattern, or story. Preserve documented selectors, input and output types, slots, accessibility behavior, responsive behavior, and form value contracts. Use validate_component_usage before finalizing generated Angular templates.",
    },
  );

  const readOnly = {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  };

  server.registerTool(
    "catalog_summary",
    {
      description: "Return Arcwell catalog version and counts.",
      annotations: readOnly,
    },
    guarded(async () => catalogSummary(await loadCatalog())),
  );
  server.registerTool(
    "list_catalog",
    {
      description:
        "List Arcwell components, services, and composition patterns.",
      inputSchema: {
        kind: z.enum(["all", "component", "service", "pattern"]).default("all"),
      },
      annotations: readOnly,
    },
    guarded(async ({ kind }) => listCatalog(await loadCatalog(), kind)),
  );
  server.registerTool(
    "search_catalog",
    {
      description:
        "Search names, selectors, inputs, outputs, services, and patterns in the Arcwell catalog.",
      inputSchema: {
        query: z.string().min(1),
        kind: z.enum(["all", "component", "service", "pattern"]).default("all"),
        limit: z.number().int().min(1).max(25).default(10),
      },
      annotations: readOnly,
    },
    guarded(async ({ query, kind, limit }) =>
      searchCatalog(await loadCatalog(), query, kind, limit),
    ),
  );
  server.registerTool(
    "get_component",
    {
      description:
        "Return a component or directive API plus its complete generated Markdown guide.",
      inputSchema: { name: z.string().min(1) },
      annotations: readOnly,
    },
    guarded(async ({ name }) =>
      getGuide(await loadCatalog(), "component", name),
    ),
  );
  server.registerTool(
    "get_service",
    {
      description:
        "Return a service API plus its complete generated Markdown guide.",
      inputSchema: { name: z.string().min(1) },
      annotations: readOnly,
    },
    guarded(async ({ name }) => getGuide(await loadCatalog(), "service", name)),
  );
  server.registerTool(
    "get_pattern",
    {
      description:
        "Return an exact Storybook-backed Arcwell composition pattern.",
      inputSchema: { id: z.string().min(1) },
      annotations: readOnly,
    },
    guarded(async ({ id }) => getPattern(await loadCatalog(), id)),
  );
  server.registerTool(
    "get_story",
    {
      description:
        "Resolve a Storybook story ID to its URL and related pattern metadata.",
      inputSchema: { id: z.string().min(1) },
      annotations: readOnly,
    },
    guarded(async ({ id }) => getStory(await loadCatalog(), id)),
  );
  server.registerTool(
    "validate_component_usage",
    {
      description:
        "Check Angular input and output names against the generated Arcwell component API.",
      inputSchema: {
        selector: z.string().min(1),
        inputs: z.array(z.string()).default([]),
        outputs: z.array(z.string()).default([]),
      },
      annotations: readOnly,
    },
    guarded(async ({ selector, inputs, outputs }) =>
      validateUsage(await loadCatalog(), selector, inputs, outputs),
    ),
  );

  server.registerResource(
    "arcwell-catalog",
    "arcwell://catalog",
    { title: "Arcwell UI catalog", mimeType: "application/json" },
    async (uri) => {
      const catalog = await loadCatalog();
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify(
              { summary: catalogSummary(catalog), ...listCatalog(catalog) },
              null,
              2,
            ),
          },
        ],
      };
    },
  );
  server.registerResource(
    "arcwell-component",
    new ResourceTemplate("arcwell://components/{name}", { list: undefined }),
    { title: "Arcwell component guide", mimeType: "text/markdown" },
    async (uri, { name }) => {
      const guide = await getGuide(
        await loadCatalog(),
        "component",
        String(name),
      );
      return {
        contents: [
          { uri: uri.href, mimeType: "text/markdown", text: guide.markdown },
        ],
      };
    },
  );
  server.registerResource(
    "arcwell-service",
    new ResourceTemplate("arcwell://services/{name}", { list: undefined }),
    { title: "Arcwell service guide", mimeType: "text/markdown" },
    async (uri, { name }) => {
      const guide = await getGuide(
        await loadCatalog(),
        "service",
        String(name),
      );
      return {
        contents: [
          { uri: uri.href, mimeType: "text/markdown", text: guide.markdown },
        ],
      };
    },
  );

  server.registerPrompt(
    "build_with_arcwell",
    {
      description:
        "Create an implementation request grounded in the Arcwell catalog.",
      argsSchema: {
        request: z.string().min(1),
        constraints: z.string().optional(),
      },
    },
    async ({ request, constraints }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Build this with Arcwell UI: ${request}\n${constraints ? `Constraints: ${constraints}\n` : ""}Search the Arcwell catalog, retrieve every selected component and service, use Storybook patterns where applicable, validate inputs and outputs, and preserve accessibility and responsive behavior.`,
          },
        },
      ],
    }),
  );

  return server;
}
