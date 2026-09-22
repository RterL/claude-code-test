import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CONTROLS } from "../data/controls.js";
import { SubmitAssessmentInputSchema } from "../schemas/assessment.js";
import { saveAssessment } from "../services/store.js";
import type { AssessmentRecord } from "../types.js";

export function registerSubmitAssessment(server: McpServer): void {
  server.registerTool(
    "iso42001_submit_assessment",
    {
      title: "Submit a Control Assessment",
      description: `Record or update the assessment for a single Annex A control: status, owner, evidence, dates, and notes.

Args (see iso42001_get_assessment_form for the full field list):
  - control_id (string, required)
  - status ('not_started' | 'in_progress' | 'implemented' | 'not_applicable', required)
  - description, owner, notes (strings, optional)
  - evidence_refs (string array, optional)
  - target_date, last_reviewed (YYYY-MM-DD or null, optional)
  - justification_for_exclusion (string, required only when status is 'not_applicable')

Persists to local storage and returns the saved record. Call iso42001_get_gap_report afterward to see the updated overall picture.

Error Handling:
  - Returns an error if control_id doesn't match a known Annex A control.
  - Returns a validation error if status is 'not_applicable' without justification_for_exclusion.`,
      inputSchema: SubmitAssessmentInputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params) => {
      const control = CONTROLS.find((c) => c.id.toLowerCase() === params.control_id.toLowerCase());
      if (!control) {
        return {
          content: [
            {
              type: "text",
              text: `Error: no Annex A control found with id '${params.control_id}'. Use iso42001_list_controls to find valid IDs.`,
            },
          ],
        };
      }

      if (params.status === "not_applicable" && !params.justification_for_exclusion?.trim()) {
        return {
          content: [
            {
              type: "text",
              text: "Error: justification_for_exclusion is required when status is 'not_applicable' (ISO 42001 6.1.3 f requires a documented justification for every excluded control).",
            },
          ],
        };
      }

      const record: AssessmentRecord = {
        controlId: control.id,
        status: params.status,
        description: params.description,
        owner: params.owner,
        evidenceRefs: params.evidence_refs,
        targetDate: params.target_date ?? null,
        lastReviewed: params.last_reviewed ?? null,
        notes: params.notes,
        justificationForExclusion: params.justification_for_exclusion,
        updatedAt: new Date().toISOString(),
      };

      const saved = await saveAssessment(record);

      return {
        content: [
          {
            type: "text",
            text: `Saved assessment for ${control.id} (${control.topic}): status=${saved.status}${saved.owner ? `, owner=${saved.owner}` : ""}.`,
          },
        ],
        structuredContent: { ...saved } as Record<string, unknown>,
      };
    }
  );
}
