#!/usr/bin/env node
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createArcwellServer } from "./create-server.mjs";

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "0.0.0.0";
const token = process.env.MCP_BEARER_TOKEN;
const app = createMcpExpressApp({ host });

app.get("/health", (_req, res) =>
  res.json({ status: "ok", server: "arcwell-ui" }),
);

app.use("/mcp", (req, res, next) => {
  if (!token) return next();
  if (req.headers.authorization !== `Bearer ${token}`)
    return res.status(401).json({ error: "Unauthorized" });
  next();
});

app.post("/mcp", async (req, res) => {
  const server = createArcwellServer();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error(error);
    if (!res.headersSent)
      res
        .status(500)
        .json({
          jsonrpc: "2.0",
          error: { code: -32603, message: "Internal server error" },
          id: null,
        });
  } finally {
    res.on("close", () => {
      transport.close();
      server.close();
    });
  }
});

app.all("/mcp", (_req, res) =>
  res
    .status(405)
    .json({
      jsonrpc: "2.0",
      error: { code: -32000, message: "Method not allowed" },
      id: null,
    }),
);

app.listen(port, host, () =>
  console.log(`Arcwell MCP listening on http://${host}:${port}/mcp`),
);
