import { z } from "zod";

export const AssessmentStatusSchema = z.enum([
  "not_started",
  "in_progress",
  "implemented",
  "not_applicable",
]);

export const SubmitAssessmentInputSchema = z
  .object({
    control_id: z
      .string()
      .describe("Annex A control ID, e.g. 'A.6.2.4'. Use iso42001_list_controls to find valid IDs."),
    status: AssessmentStatusSchema.describe(
      "Current implementation status of this control."
    ),
    description: z
      .string()
      .default("")
      .describe("How the control is (or will be) implemented in this organization."),
    owner: z
      .string()
      .default("")
      .describe("Person or role accountable for this control."),
    evidence_refs: z
      .array(z.string())
      .default([])
      .describe(
        "Links or references to evidence (policy doc, ticket, repo path, Confluence/Jira link, etc.)."
      ),
    target_date: z
      .string()
      .optional()
      .describe(
        "ISO 8601 date (YYYY-MM-DD) by which this control should be implemented, if not yet done. Omit if not set."
      ),
    last_reviewed: z
      .string()
      .optional()
      .describe(
        "ISO 8601 date (YYYY-MM-DD) this control's status was last confirmed accurate. Omit if not set."
      ),
    notes: z.string().default("").describe("Free-text notes, caveats, or context."),
    justification_for_exclusion: z
      .string()
      .optional()
      .describe(
        "Required if status is 'not_applicable': why this control is excluded from the Statement of Applicability."
      ),
  })
  .strict();

export type SubmitAssessmentInput = z.infer<typeof SubmitAssessmentInputSchema>;
