import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type { AssessmentRecord, AssessmentStore } from "../types.js";

const DATA_PATH =
  process.env.ISO42001_DATA_PATH ?? new URL("../../data/assessments.json", import.meta.url).pathname;

let cache: AssessmentStore | null = null;

async function load(): Promise<AssessmentStore> {
  if (cache) return cache;
  try {
    const raw = await readFile(DATA_PATH, "utf-8");
    cache = JSON.parse(raw) as AssessmentStore;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      cache = {};
    } else {
      throw error;
    }
  }
  return cache;
}

async function persist(store: AssessmentStore): Promise<void> {
  await mkdir(dirname(DATA_PATH), { recursive: true });
  await writeFile(DATA_PATH, JSON.stringify(store, null, 2), "utf-8");
  cache = store;
}

export async function getAssessment(controlId: string): Promise<AssessmentRecord | undefined> {
  const store = await load();
  return store[controlId];
}

export async function listAssessments(): Promise<AssessmentRecord[]> {
  const store = await load();
  return Object.values(store);
}

export async function saveAssessment(record: AssessmentRecord): Promise<AssessmentRecord> {
  const store = await load();
  store[record.controlId] = record;
  await persist(store);
  return record;
}
