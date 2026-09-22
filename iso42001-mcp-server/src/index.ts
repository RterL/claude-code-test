#!/usr/bin/env node
/**
 * MCP server for working an AI management system through ISO/IEC 42001.
 *
 * Exposes tools to browse the standard's clause (4-10) and Annex A control
 * structure, generate assessment input fields per control, record status
 * and evidence, get implementation guidance, and produce a gap report --
 * so a CISO (or anyone driving an AIMS build-out) can work through the
 * standard conversationally via an MCP client.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerListClauses } from "./tools/listClauses.js";
import { registerListControls } from "./tools/listControls.js";
import { registerGetAssessmentForm } from "./tools/getAssessmentForm.js";
import { registerSubmitAssessment } from "./tools/submitAssessment.js";
import { registerGetGapReport } from "./tools/getGapReport.js";
import { registerGetGuidance } from "./tools/getGuidance.js";
import { registerGapAssessmentInterview } from "./prompts/gapAssessmentInterview.js";
import { registerResources } from "./resources.js";

const server = new McpServer({
  name: "iso42001-mcp-server",
  version: "1.0.0",
});

registerListClauses(server);
registerListControls(server);
registerGetAssessmentForm(server);
registerSubmitAssessment(server);
registerGetGapReport(server);
registerGetGuidance(server);
registerGapAssessmentInterview(server);
registerResources(server);

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("iso42001-mcp-server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
