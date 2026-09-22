import { test } from "node:test";
import assert from "node:assert/strict";
import { CONTROLS, CONTROL_THEMES } from "./controls.js";
import { CLAUSES } from "./clauses.js";

test("Annex A has exactly 38 controls", () => {
  assert.equal(CONTROLS.length, 38);
});

test("control IDs are unique", () => {
  const ids = CONTROLS.map((c) => c.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("every control's theme is a known theme", () => {
  for (const control of CONTROLS) {
    assert.ok(control.theme in CONTROL_THEMES, `${control.id} has unknown theme ${control.theme}`);
  }
});

test("clause IDs are unique", () => {
  const ids = CLAUSES.map((c) => c.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("no control or clause text is empty", () => {
  for (const control of CONTROLS) {
    assert.ok(control.summary.trim().length > 0, `${control.id} missing summary`);
    assert.ok(control.guidance.trim().length > 0, `${control.id} missing guidance`);
  }
  for (const clause of CLAUSES) {
    assert.ok(clause.summary.trim().length > 0, `${clause.id} missing summary`);
  }
});
