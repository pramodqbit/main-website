export type Action = "created" | "updated" | "skipped" | "failed";

type Row = { step: string; collection: string; key: string; action: Action; note?: string };

const rows: Row[] = [];
let currentStep = "";

export const report = {
  step(name: string) {
    currentStep = name;
    console.log(`\n=== ${name} ===`);
  },
  log(collection: string, key: string, action: Action, note?: string) {
    rows.push({ step: currentStep, collection, key, action, note });
    const tag = action.padEnd(7);
    console.log(`  ${tag} ${collection.padEnd(14)} ${key}${note ? `  (${note})` : ""}`);
  },
  get failures() {
    return rows.filter((r) => r.action === "failed");
  },
  summary() {
    const byCollection = new Map<string, Record<Action, number>>();
    for (const r of rows) {
      const c = byCollection.get(r.collection) ?? { created: 0, updated: 0, skipped: 0, failed: 0 };
      c[r.action] += 1;
      byCollection.set(r.collection, c);
    }
    console.log("\n=== Summary ===");
    console.table(Object.fromEntries(byCollection));
  },
};
