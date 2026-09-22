import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const tmpDir = mkdtempSync(join(tmpdir(), "iso42001-store-test-"));
process.env.ISO42001_DATA_PATH = join(tmpDir, "assessments.json");

const { saveAssessment, getAssessment, listAssessments } = await import("./store.js");

test("round-trips an assessment through save/get/list", async () => {
  const record = {
    controlId: "A.2.2",
    status: "implemented" as const,
    description: "test",
    owner: "CISO",
    evidenceRefs: ["https://example.com/policy"],
    targetDate: null,
    lastReviewed: "2026-01-01",
    notes: "",
    updatedAt: new Date().toISOString(),
  };

  await saveAssessment(record);

  const fetched = await getAssessment("A.2.2");
  assert.deepEqual(fetched, record);

  const all = await listAssessments();
  assert.equal(all.length, 1);
  assert.equal(all[0].controlId, "A.2.2");
});

test("getAssessment returns undefined for an unknown control", async () => {
  const fetched = await getAssessment("A.99.9");
  assert.equal(fetched, undefined);
});

test.after(() => {
  rmSync(tmpDir, { recursive: true, force: true });
});
