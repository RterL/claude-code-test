import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CONTROLS } from "../data/controls.js";
import { getAssessment } from "../services/store.js";

const InputSchema = z
  .object({
    control_id: z
      .string()
      .describe("Annex A control ID, e.g. 'A.6.2.4'. Use iso42001_list_controls to find valid IDs."),
  })
  .strict();

const FORM_FIELDS = [
  {
    name: "status",
    type: "enum",
    options: ["not_started", "in_progress", "implemented", "not_applicable"],
    required: true,
    description: "Current implementation status of this control.",
  },
  {
    name: "description",
    type: "string",
    required: false,
    description: "How the control is (or will be) implemented in this organization.",
  },
  {
    name: "owner",
    type: "string",
    required: false,
    description: "Person or role accountable for this control.",
  },
  {
    name: "evidence_refs",
    type: "string[]",
    required: false,
    description: "Links/references to evidence (policy doc, ticket, repo path, external system link).",
  },
  {
    name: "target_date",
    type: "date (YYYY-MM-DD) | null",
    required: false,
    description: "Date by which this control should be implemented, if not yet done.",
  },
  {
    name: "last_reviewed",
    type: "date (YYYY-MM-DD) | null",
    required: false,
    description: "Date this control's status was last confirmed accurate.",
  },
  {
    name: "notes",
    type: "string",
    required: false,
    description: "Free-text notes, caveats, or context.",
  },
  {
    name: "justification_for_exclusion",
    type: "string",
    required: "if status is 'not_applicable'",
    description:
      "Why this control is excluded from the Statement of Applicability (ISO 42001 6.1.3 f requires this for every excluded control).",
  },
];

export function registerGetAssessmentForm(server: McpServer): void {
  server.registerTool(
    "iso42001_get_assessment_form",
    {
      title: "Get Assessment Input Fields for a Control",
      description: `Get the structured input fields needed to assess a specific Annex A control, plus its current recorded state if one exists.

Args:
  - control_id (string): Annex A control ID, e.g. 'A.6.2.4'.

Returns JSON describing each field the CISO/team needs to fill in (status, owner, evidence, dates, notes) along with the control's summary/guidance and any existing assessment already on file. Feed the answers to iso42001_submit_assessment to persist them.`,
      inputSchema: InputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ control_id }) => {
      const control = CONTROLS.find((c) => c.id.toLowerCase() === control_id.toLowerCase());
      if (!control) {
        return {
          content: [
            {
              type: "text",
              text: `Error: no Annex A control found with id '${control_id}'. Use iso42001_list_controls to find valid IDs.`,
            },
          ],
        };
      }

      const existing = await getAssessment(control.id);

      const output = {
        control: {
          id: control.id,
          topic: control.topic,
          theme: `${control.theme} - ${control.themeTitle}`,
          summary: control.summary,
          guidance: control.guidance,
        },
        fields: FORM_FIELDS,
        existing_assessment: existing ?? null,
      };

      return {
        content: [{ type: "text", text: JSON.stringify(output, null, 2) }],
        structuredContent: output,
      };
    }
  );
}
