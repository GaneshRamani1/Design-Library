# Arcwell UI MCP server

The Arcwell MCP server exposes the generated component, directive, service, Storybook, and composition-pattern catalog to MCP clients. The generated files under `skills/arcwell-ui` remain the source of truth.

## Local use

Install dependencies and verify the catalog:

```sh
npm ci
npm run mcp:test
```

Register the STDIO server with Codex:

```sh
codex mcp add arcwell-ui -- node /absolute/path/to/Design-Library/mcp/server.mjs
codex mcp list
```

The equivalent project-scoped `.codex/config.toml` entry is:

```toml
[mcp_servers.arcwell-ui]
command = "node"
args = ["mcp/server.mjs"]
cwd = "/absolute/path/to/Design-Library"
required = true
default_tools_approval_mode = "auto"
```

Restart the local Codex client after changing its MCP configuration. Use `/mcp` to confirm that the server and tools are connected.

## Run the HTTP server

```sh
MCP_BEARER_TOKEN="replace-with-a-long-random-secret" npm run mcp:http
```

The MCP endpoint is `http://localhost:3000/mcp`; the health endpoint is `http://localhost:3000/health`. `STORYBOOK_BASE_URL` can point generated story links at a deployed Storybook site.

## Deploy for shared access

Build and run the included container:

```sh
docker build -f Dockerfile.mcp -t arcwell-ui-mcp .
docker run --rm -p 3000:3000 \
  -e MCP_BEARER_TOKEN="replace-with-a-long-random-secret" \
  -e STORYBOOK_BASE_URL="https://storybook.example.com" \
  arcwell-ui-mcp
```

Push the repository to GitHub and create a web service on a container host such as Render, Railway, Fly.io, Azure Container Apps, AWS App Runner, or Google Cloud Run. Configure it to use `Dockerfile.mcp`, expose port `3000`, and set `MCP_BEARER_TOKEN` and `STORYBOOK_BASE_URL` as secrets/environment variables. The host must preserve HTTPS and allow POST requests to `/mcp`.

People can register the deployed endpoint in Codex with:

```sh
export ARCWELL_MCP_TOKEN="the-shared-or-user-specific-token"
codex mcp add arcwell-ui --url https://mcp.example.com/mcp --bearer-token-env-var ARCWELL_MCP_TOKEN
```

Or use this configuration:

```toml
[mcp_servers.arcwell-ui]
url = "https://mcp.example.com/mcp"
bearer_token_env_var = "ARCWELL_MCP_TOKEN"
required = true
```

Leaving `MCP_BEARER_TOKEN` unset makes the endpoint public without authentication. Use a token for an internet-facing deployment. A single token is sufficient for a trusted internal team; public or multi-tenant distribution should add OAuth, per-user authorization, rate limiting, request limits, monitoring, and a privacy policy.

## Keeping the server current

Run `npm run skills:generate` whenever components or stories change, commit the generated catalog, then rebuild the container. The MCP server reads the manifest and Markdown at request time, so it needs no separate indexing step.
