import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CONTROLS, CONTROL_THEMES } from "../data/controls.js";

const InputSchema = z
  .object({
    theme: z
      .string()
      .optional()
      .describe(
        "Optional Annex A theme to filter by, e.g. 'A.6' for AI system life cycle. Omit to list all 38 controls."
      ),
  })
  .strict();

export function registerListControls(server: McpServer): void {
  server.registerTool(
    "iso42001_list_controls",
    {
      title: "List ISO 42001 Annex A Controls",
      description: `List the ISO/IEC 42001 Annex A reference controls (organized into 9 themes, A.2 through A.10) used for AI risk treatment.

Args:
  - theme (string, optional): Filter to one theme, e.g. 'A.4' (Resources for AI systems). Omit for all controls.

Returns JSON with each control's id, theme, topic, and a summary of its intent. Not every control is required for every organization -- inclusion/exclusion is a risk-based decision recorded in the Statement of Applicability (use iso42001_submit_assessment with status 'not_applicable' and a justification to record an exclusion).

Use iso42001_get_assessment_form to get the input fields for assessing a specific control, and iso42001_get_guidance for implementation guidance.`,
      inputSchema: InputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ theme }) => {
      const controls = theme ? CONTROLS.filter((c) => c.theme === theme) : CONTROLS;

      if (!controls.length) {
        return {
          content: [
            {
              type: "text",
              text: `No controls found for theme '${theme}'. Valid themes: ${Object.keys(CONTROL_THEMES).join(", ")}.`,
            },
          ],
        };
      }

      const output = {
        count: controls.length,
        themes: CONTROL_THEMES,
        controls: controls.map(({ id, theme: t, themeTitle, topic, summary }) => ({
          id,
          theme: t,
          themeTitle,
          topic,
          summary,
        })),
      };

      return {
        content: [{ type: "text", text: JSON.stringify(output, null, 2) }],
        structuredContent: output,
      };
    }
  );
}
