#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createArcwellServer } from "./create-server.mjs";

const server = createArcwellServer();
await server.connect(new StdioServerTransport());
