import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CONTROLS } from "../data/controls.js";
import { CLAUSES } from "../data/clauses.js";

const InputSchema = z
  .object({
    id: z
      .string()
      .describe(
        "A clause id (e.g. '6.1.3') or Annex A control id (e.g. 'A.7.4') to get guidance for."
      ),
  })
  .strict();

export function registerGetGuidance(server: McpServer): void {
  server.registerTool(
    "iso42001_get_guidance",
    {
      title: "Get ISO 42001 Implementation Guidance",
      description: `Get CISO-oriented implementation guidance for a specific ISO/IEC 42001 clause or Annex A control.

Args:
  - id (string): A clause id (e.g. '6.1.3') or control id (e.g. 'A.7.4').

Returns practical guidance on what to actually do to satisfy that requirement -- interpretive guidance grounded in the standard, not a quotation of its normative text. This is advisory only: it does not verify or enforce compliance, and does not replace legal or certification-body advice.`,
      inputSchema: InputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ id }) => {
      const control = CONTROLS.find((c) => c.id.toLowerCase() === id.toLowerCase());
      if (control) {
        const output = {
          type: "control" as const,
          id: control.id,
          topic: control.topic,
          theme: `${control.theme} - ${control.themeTitle}`,
          summary: control.summary,
          guidance: control.guidance,
        };
        return {
          content: [
            {
              type: "text",
              text: `## ${control.id} - ${control.topic}\n\n**What it requires:** ${control.summary}\n\n**Guidance:** ${control.guidance}`,
            },
          ],
          structuredContent: output,
        };
      }

      const clause = CLAUSES.find((c) => c.id === id);
      if (clause) {
        const output = {
          type: "clause" as const,
          id: clause.id,
          title: clause.title,
          summary: clause.summary,
        };
        return {
          content: [
            {
              type: "text",
              text: `## Clause ${clause.id} - ${clause.title}\n\n${clause.summary}`,
            },
          ],
          structuredContent: output,
        };
      }

      return {
        content: [
          {
            type: "text",
            text: `Error: no clause or control found with id '${id}'. Use iso42001_list_clauses or iso42001_list_controls to find valid IDs.`,
          },
        ],
      };
    }
  );
}
