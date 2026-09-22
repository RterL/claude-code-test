import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CLAUSES, CLAUSE_SECTIONS } from "../data/clauses.js";

const InputSchema = z
  .object({
    section: z
      .union([z.string(), z.number()])
      .transform((v) => String(v))
      .optional()
      .describe(
        "Optional clause section number to filter by ('4' through '10'). Omit to list all clauses."
      ),
  })
  .strict();

export function registerListClauses(server: McpServer): void {
  server.registerTool(
    "iso42001_list_clauses",
    {
      title: "List ISO 42001 Management Clauses",
      description: `List the ISO/IEC 42001 AI management system (AIMS) requirements in clauses 4-10 (Context, Leadership, Planning, Support, Operation, Performance evaluation, Improvement).

Args:
  - section (string, optional): Filter to one top-level section ('4'-'10'). Omit for all clauses.

Returns JSON with each clause's id, title, one-paragraph summary of what the organization must do, and requirement level.

Use this to orient a CISO on what the management-system side of ISO 42001 requires, separate from the Annex A technical controls (see iso42001_list_controls).`,
      inputSchema: InputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ section }) => {
      const clauses = section
        ? CLAUSES.filter((c) => c.id === section || c.id.startsWith(`${section}.`))
        : CLAUSES;

      if (!clauses.length) {
        return {
          content: [
            {
              type: "text",
              text: `No clauses found for section '${section}'. Valid sections: ${Object.keys(CLAUSE_SECTIONS).join(", ")}.`,
            },
          ],
        };
      }

      const output = {
        count: clauses.length,
        sections: CLAUSE_SECTIONS,
        clauses,
      };

      return {
        content: [{ type: "text", text: JSON.stringify(output, null, 2) }],
        structuredContent: output,
      };
    }
  );
}
