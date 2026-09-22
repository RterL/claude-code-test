import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CLAUSES } from "./data/clauses.js";
import { CONTROLS } from "./data/controls.js";
import { listAssessments } from "./services/store.js";

export function registerResources(server: McpServer): void {
  server.registerResource(
    "iso42001-clauses",
    "iso42001://clauses",
    {
      title: "ISO 42001 Clauses 4-10",
      description: "The AI management system (AIMS) requirements structure.",
      mimeType: "application/json",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(CLAUSES, null, 2),
        },
      ],
    })
  );

  server.registerResource(
    "iso42001-annex-a",
    "iso42001://annex-a",
    {
      title: "ISO 42001 Annex A Controls",
      description: "The 38 reference controls used for AI risk treatment.",
      mimeType: "application/json",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(CONTROLS, null, 2),
        },
      ],
    })
  );

  server.registerResource(
    "iso42001-assessments",
    "iso42001://assessments",
    {
      title: "Current Control Assessments",
      description: "The organization's current recorded status for each assessed control.",
      mimeType: "application/json",
    },
    async (uri) => {
      const assessments = await listAssessments();
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify(assessments, null, 2),
          },
        ],
      };
    }
  );
}
