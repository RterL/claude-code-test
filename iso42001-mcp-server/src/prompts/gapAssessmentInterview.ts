import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CONTROL_THEMES } from "../data/controls.js";

export function registerGapAssessmentInterview(server: McpServer): void {
  server.registerPrompt(
    "iso42001_gap_assessment_interview",
    {
      title: "ISO 42001 Gap Assessment Interview",
      description:
        "Walk a CISO through a control-by-control ISO/IEC 42001 gap assessment interview, theme by theme, recording answers as they go.",
      argsSchema: {
        theme: z
          .string()
          .optional()
          .describe(`Optional Annex A theme to focus on (${Object.keys(CONTROL_THEMES).join(", ")}). Omit to cover all themes.`),
      },
    },
    ({ theme }) => {
      const scope = theme ? `the ${theme} (${CONTROL_THEMES[theme] ?? "unknown theme"}) controls` : "all Annex A themes, in order (A.2 through A.10)";
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `You are helping a CISO run an ISO/IEC 42001 gap assessment interview, covering ${scope}.

For each control:
1. Call iso42001_get_assessment_form to get its input fields, summary, guidance, and any existing assessment.
2. Ask the CISO plain-language questions to fill in status, owner, evidence, target date, and notes -- don't just recite the field names.
3. If they say a control doesn't apply to their organization, press for a specific reason and require it before recording 'not_applicable' (the standard requires a documented justification for every excluded control).
4. Call iso42001_submit_assessment to save their answer before moving to the next control.
5. After finishing the scoped controls, call iso42001_get_gap_report and summarize progress, overdue items, and suggested next priorities.

Keep the interview efficient: one control at a time, don't re-ask what's already answered in an existing assessment unless the CISO wants to update it.`,
            },
          },
        ],
      };
    }
  );
}
