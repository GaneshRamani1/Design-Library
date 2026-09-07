import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import test from "node:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const root = new URL("../", import.meta.url).pathname;

async function freePort() {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  await new Promise((resolve) => server.close(resolve));
  return port;
}

async function waitForHealth(url, process) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (process.exitCode !== null)
      throw new Error(`HTTP server exited with code ${process.exitCode}`);
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error("Timed out waiting for the HTTP server");
}

test("STDIO transport initializes and calls a catalog tool", async () => {
  const client = new Client({ name: "arcwell-test", version: "1.0.0" });
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: ["mcp/server.mjs"],
    cwd: root,
    stderr: "pipe",
  });
  try {
    await client.connect(transport);
    const tools = await client.listTools();
    assert.ok(tools.tools.some(({ name }) => name === "get_component"));
    assert.match(client.getInstructions(), /authoritative Arcwell UI catalog/);
    const response = await client.callTool({
      name: "validate_component_usage",
      arguments: {
        selector: "dl-alert",
        inputs: ["tone"],
        outputs: ["dismissed"],
      },
    });
    assert.equal(response.structuredContent.valid, true);
  } finally {
    await client.close();
  }
});

test("Streamable HTTP transport initializes, authenticates, and calls a tool", async () => {
  const port = await freePort();
  const token = "integration-test-token";
  const child = spawn(process.execPath, ["mcp/http-server.mjs"], {
    cwd: root,
    env: {
      ...process.env,
      HOST: "127.0.0.1",
      PORT: String(port),
      MCP_BEARER_TOKEN: token,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  const client = new Client({ name: "arcwell-http-test", version: "1.0.0" });
  try {
    await waitForHealth(`http://127.0.0.1:${port}/health`, child);
    const unauthorized = await fetch(`http://127.0.0.1:${port}/mcp`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{}",
    });
    assert.equal(unauthorized.status, 401);
    const transport = new StreamableHTTPClientTransport(
      new URL(`http://127.0.0.1:${port}/mcp`),
      { requestInit: { headers: { Authorization: `Bearer ${token}` } } },
    );
    await client.connect(transport);
    const response = await client.callTool({
      name: "catalog_summary",
      arguments: {},
    });
    assert.equal(response.structuredContent.components, 49);
  } finally {
    await client.close().catch(() => {});
    child.kill("SIGTERM");
    await new Promise((resolve) => child.once("exit", resolve));
  }
});
