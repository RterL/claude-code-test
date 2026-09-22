import { test } from "node:test";
import assert from "node:assert/strict";
import { isOverdue } from "./getGapReport.js";
import type { AssessmentRecord } from "../types.js";

function record(overrides: Partial<AssessmentRecord>): AssessmentRecord {
  return {
    controlId: "A.2.2",
    status: "in_progress",
    description: "",
    owner: "",
    evidenceRefs: [],
    targetDate: null,
    lastReviewed: null,
    notes: "",
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

test("isOverdue is false when there is no record", () => {
  assert.equal(isOverdue(undefined, "2026-01-01"), false);
});

test("isOverdue is false when there is no target date", () => {
  assert.equal(isOverdue(record({ targetDate: null }), "2026-01-01"), false);
});

test("isOverdue is true when target date is in the past and not implemented", () => {
  assert.equal(isOverdue(record({ targetDate: "2020-01-01" }), "2026-01-01"), true);
});

test("isOverdue is false when status is implemented, even past target date", () => {
  assert.equal(
    isOverdue(record({ targetDate: "2020-01-01", status: "implemented" }), "2026-01-01"),
    false
  );
});

test("isOverdue is false when status is not_applicable", () => {
  assert.equal(
    isOverdue(record({ targetDate: "2020-01-01", status: "not_applicable" }), "2026-01-01"),
    false
  );
});
