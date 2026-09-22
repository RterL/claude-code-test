/**
 * Structural data types for ISO/IEC 42001:2023. Clause and control text in
 * src/data is an original paraphrase of the standard's structure (clause
 * numbers, control IDs, topics) written from a licensed reading of the
 * document -- not a reproduction of its normative text. Organizations
 * implementing this server should hold their own licensed copy of the
 * standard for authoritative wording.
 */

export type RequirementLevel = "shall" | "should";

export interface ClauseRequirement {
  id: string;
  title: string;
  /** Original paraphrase of what the organization must demonstrate. */
  summary: string;
  level: RequirementLevel;
  parentId?: string;
}

export type ControlTheme =
  | "A.2"
  | "A.3"
  | "A.4"
  | "A.5"
  | "A.6"
  | "A.7"
  | "A.8"
  | "A.9"
  | "A.10";

export interface AnnexAControl {
  id: string;
  theme: ControlTheme;
  themeTitle: string;
  topic: string;
  /** Original paraphrase of the control's intent (not the standard's exact wording). */
  summary: string;
  /** Original paraphrase of practical implementation guidance, informed by Annex B. */
  guidance: string;
}

export type AssessmentStatus =
  | "not_started"
  | "in_progress"
  | "implemented"
  | "not_applicable";

export interface AssessmentRecord {
  controlId: string;
  status: AssessmentStatus;
  description: string;
  owner: string;
  evidenceRefs: string[];
  targetDate: string | null;
  lastReviewed: string | null;
  notes: string;
  justificationForExclusion?: string;
  updatedAt: string;
}

export interface AssessmentStore {
  [controlId: string]: AssessmentRecord;
}
