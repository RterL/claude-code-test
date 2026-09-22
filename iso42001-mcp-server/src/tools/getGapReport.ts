import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CONTROLS, CONTROL_THEMES } from "../data/controls.js";
import { listAssessments } from "../services/store.js";
import type { AssessmentRecord, AssessmentStatus } from "../types.js";

const InputSchema = z.object({}).strict();

interface ThemeSummary {
  theme: string;
  themeTitle: string;
  total: number;
  not_started: number;
  in_progress: number;
  implemented: number;
  not_applicable: number;
}

export function isOverdue(record: AssessmentRecord | undefined, today: string): boolean {
  if (!record || !record.targetDate) return false;
  if (record.status === "implemented" || record.status === "not_applicable") return false;
  return record.targetDate < today;
}

export function registerGetGapReport(server: McpServer): void {
  server.registerTool(
    "iso42001_get_gap_report",
    {
      title: "Get ISO 42001 Gap Report",
      description: `Aggregate all recorded control assessments into a Statement-of-Applicability-style gap report: completion by theme, overall completion percentage, unassessed controls, and overdue items.

Takes no arguments.

Returns JSON with:
  - overall: { total_controls, assessed, not_started, in_progress, implemented, not_applicable, completion_pct }
  - by_theme: per-theme (A.2-A.10) breakdown
  - overdue: controls with a target_date in the past that are still not implemented
  - unassessed: control IDs with no assessment recorded at all

Use this to answer "are we compliant" / "what's left" questions for a CISO, and to identify where to focus next.`,
      inputSchema: InputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async () => {
      const assessments = await listAssessments();
      const byId = new Map(assessments.map((a) => [a.controlId, a]));
      const today = new Date().toISOString().slice(0, 10);

      const counts: Record<AssessmentStatus, number> = {
        not_started: 0,
        in_progress: 0,
        implemented: 0,
        not_applicable: 0,
      };

      const themeMap = new Map<string, ThemeSummary>();
      const unassessed: string[] = [];
      const overdue: Array<{ controlId: string; topic: string; targetDate: string; owner: string }> = [];

      for (const control of CONTROLS) {
        const record = byId.get(control.id);
        if (!record) {
          unassessed.push(control.id);
        } else {
          counts[record.status]++;
          if (isOverdue(record, today)) {
            overdue.push({
              controlId: control.id,
              topic: control.topic,
              targetDate: record.targetDate as string,
              owner: record.owner,
            });
          }
        }

        if (!themeMap.has(control.theme)) {
          themeMap.set(control.theme, {
            theme: control.theme,
            themeTitle: control.themeTitle,
            total: 0,
            not_started: 0,
            in_progress: 0,
            implemented: 0,
            not_applicable: 0,
          });
        }
        const themeSummary = themeMap.get(control.theme)!;
        themeSummary.total++;
        if (record) {
          themeSummary[record.status]++;
        } else {
          themeSummary.not_started++;
        }
      }

      const totalControls = CONTROLS.length;
      const assessed = assessments.length;
      const completionPct =
        totalControls === 0
          ? 0
          : Math.round(((counts.implemented + counts.not_applicable) / totalControls) * 1000) / 10;

      const output = {
        overall: {
          total_controls: totalControls,
          assessed,
          not_started: counts.not_started + unassessed.length,
          in_progress: counts.in_progress,
          implemented: counts.implemented,
          not_applicable: counts.not_applicable,
          completion_pct: completionPct,
        },
        by_theme: Array.from(themeMap.values()).map((t) => ({
          ...t,
          themeTitle: CONTROL_THEMES[t.theme] ?? t.themeTitle,
        })),
        overdue,
        unassessed,
      };

      return {
        content: [
          {
            type: "text",
            text: `ISO 42001 gap report: ${completionPct}% complete (${counts.implemented} implemented + ${counts.not_applicable} N/A out of ${totalControls} controls). ${overdue.length} overdue, ${unassessed.length} not yet assessed.`,
          },
        ],
        structuredContent: output,
      };
    }
  );
}
