// Run with `node scripts/check-calendar.cjs`; no additional test dependencies.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "src/lib/engine.ts"), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
    esModuleInterop: true,
  },
}).outputText;
const engineModule = { exports: {} };
const resolveImport = (id) =>
  id === "@/data/seed.json"
    ? require(path.join(root, "src/data/seed.json"))
    : require(id);
new Function("require", "module", "exports", compiled)(
  resolveImport,
  engineModule,
  engineModule.exports,
);
const { dayKey, weekPosts, applyAction, SEED_STATE } = engineModule.exports;

const cases = [
  [undefined, undefined],
  ["invalid", undefined],
  ["2026-08-30", "2026-08-30"],
  ["2026-08-31T03:00:00Z", "2026-08-30"],
  ["2026-08-31T07:00:00Z", "2026-08-31"],
  // Pacific spring-forward: midnight is still UTC-8 before the transition.
  ["2026-03-08T07:59:59Z", "2026-03-07"],
  ["2026-03-08T08:00:00Z", "2026-03-08"],
  ["2026-03-09T06:59:59Z", "2026-03-08"],
  ["2026-03-09T07:00:00Z", "2026-03-09"],
  // Pacific fall-back: midnight at the end of the day is UTC-8 again.
  ["2026-11-01T06:59:59Z", "2026-10-31"],
  ["2026-11-01T07:00:00Z", "2026-11-01"],
  ["2026-11-02T07:59:59Z", "2026-11-01"],
  ["2026-11-02T08:00:00Z", "2026-11-02"],
];
for (const [input, expected] of cases)
  assert.equal(dayKey(input), expected, input);

// Exercise the real action and selector: Sunday evening must remain this week.
let state = structuredClone(SEED_STATE);
const postId = state.posts.find((post) => post.status === "approved").id;
state = applyAction(state, {
  type: "schedule",
  postId,
  scheduledFor: "2026-08-31T03:00:00Z",
});
assert(weekPosts(state).scheduled.some((post) => post.id === postId));
assert.equal(
  dayKey(state.posts.find((post) => post.id === postId).scheduledFor),
  "2026-08-30",
);
state = applyAction(state, {
  type: "mark-posted",
  postId,
  postedAt: "2026-08-31T03:00:00Z",
});
assert(weekPosts(state).posted.some((post) => post.id === postId));
state.posts.find((post) => post.id === postId).postedAt =
  "2026-08-31T07:00:00Z";
assert(!weekPosts(state).posted.some((post) => post.id === postId));
console.log(
  `Calendar checks passed: ${cases.length} date cases plus schedule/posted week boundaries (${Intl.DateTimeFormat().resolvedOptions().timeZone}).`,
);
