#!/usr/bin/env node
// Builds reports/qa-journal/data/journal-data.js (loaded by index.html) from:
//   1. data/session-history.json  — records copied from the session transcript (facts)
//   2. data/curation.json         — titles and summaries written by the journal builder (inferred)
//   3. the repository itself      — current files, workflow, registry, prompts, ADRs (facts at build time)
// No network access, no dependencies, no writes outside data/journal-data.js.
//
// Usage: node reports/qa-journal/tools/build-data.js
"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const BUILDER_VERSION = "1.0.0";
const REPO = path.resolve(__dirname, "..", "..", "..");
const J = path.join(REPO, "reports", "qa-journal");
const sha = (b) => crypto.createHash("sha256").update(b).digest("hex");
const rd = (p) => fs.readFileSync(path.join(REPO, p), "utf8");
const ex = (p) => fs.existsSync(path.join(REPO, p));

const history = JSON.parse(fs.readFileSync(path.join(J, "data", "session-history.json"), "utf8"));
const curation = JSON.parse(fs.readFileSync(path.join(J, "data", "curation.json"), "utf8"));

// ---------- repository files ----------
const SKIP_DIRS = new Set([".git", "node_modules", ".playwright-mcp"]);
const SELF = "reports/qa-journal/";
const TEXT_EXT = /\.(md|json|ya?ml|txt|js|html|css|gitkeep|gitignore)$|^\.gitkeep$|^\.gitignore$|\.mcp\.json$/i;
function walk(dir, acc) {
  for (const n of fs.readdirSync(path.join(REPO, dir))) {
    const r = dir ? dir + "/" + n : n;
    if (SKIP_DIRS.has(n)) continue;
    const st = fs.statSync(path.join(REPO, r));
    if (st.isDirectory()) walk(r, acc); else acc.push({ r, st });
  }
  return acc;
}
const category = (p) =>
  p.startsWith(".claude/skills/") ? "skill" : p.startsWith(".claude/prompts/") ? "prompt" : p.startsWith("platform/schemas/") ? "schema"
  : p.startsWith("platform/workflows/") ? "workflow" : p.startsWith("platform/registry/") ? "registry" : p.startsWith("platform/templates/") ? "template"
  : p.startsWith("docs/architecture/decisions/") ? "decision" : p.startsWith("docs/") ? "documentation" : p.startsWith(SELF) ? "journal" : p.startsWith("platform/") ? "platform" : "root";
const files = walk("", []).map(({ r, st }) => {
  const buf = fs.readFileSync(path.join(REPO, r));
  const isSelfGenerated = r === SELF + "data/journal-data.js";
  const embed = !isSelfGenerated && !r.startsWith(SELF + "data/") && TEXT_EXT.test(path.basename(r));
  return { path: r, category: category(r), bytes: st.size, sha256: sha(buf), modified_at: st.mtime.toISOString(), content: embed ? buf.toString("utf8") : null, content_note: isSelfGenerated ? "Generated data bundle (this file); not embedded in itself." : r.startsWith(SELF + "data/") ? "Journal data file; open it directly from the repository." : null };
}).sort((a, b) => a.path.localeCompare(b.path));
const fileBy = Object.fromEntries(files.map((f) => [f.path, f]));

// ---------- tiny line-based readers for the two YAML files (structure is fixed and validated) ----------
function yamlBlocks(text, marker) {
  const parts = text.split("\n" + marker).slice(1);
  return parts.map((p) => marker.trimStart() + p);
}
function scalar(block, key, indent) {
  const m = block.match(new RegExp("^" + " ".repeat(indent) + key + ":\\s*(.*?)\\s*(#.*)?$", "m"));
  if (!m) return undefined;
  const v = m[1];
  if (v === "true") return true; if (v === "false") return false; if (v === "null" || v === "") return v === "" ? "" : null;
  if (/^\[.*\]$/.test(v)) return v.slice(1, -1).split(",").map((s) => s.trim()).filter(Boolean);
  if (/^\d+$/.test(v)) return Number(v);
  return v.replace(/^["']|["']$/g, "");
}
function list(block, key, indent) {
  const s = scalar(block, key, indent);
  if (Array.isArray(s)) return s;
  const m = block.match(new RegExp("^" + " ".repeat(indent) + key + ":\\s*(#.*)?\\n((?:" + " ".repeat(indent + 2) + "- .*\\n?)+)", "m"));
  return m ? m[2].split("\n").filter((l) => l.trim().startsWith("- ")).map((l) => l.trim().slice(2).replace(/\s+#.*$/, "").trim()) : [];
}
const wfText = rd("platform/workflows/default-qa-workflow.yaml");
const wfVersion = scalar(wfText, "version", 2);
const stages = yamlBlocks(wfText.split("\nstages:")[1], "  - id: ").map((b) => {
  const gate = b.includes("\n    gate:") ? b.split("\n    gate:")[1] : null;
  return {
    id: b.match(/^- id: (\S+)/)[1], order: scalar(b, "order", 4), skill: scalar(b, "skill", 4), implemented: scalar(b, "implemented", 4),
    mandatory: scalar(b, "mandatory", 4) === true, conditional: scalar(b, "conditional", 4) === true,
    depends_on: list(b, "depends_on", 4), requires_approval_of: list(b, "requires_approval_of", 4),
    purpose: (b.match(/^    purpose: (?:>\n)?([\s\S]*?)\n    \w+:/m) || [])[1]?.replace(/\s+/g, " ").trim() || null,
    inputs: list(b, "inputs", 4), outputs: list(b, "outputs", 4), mcp: scalar(b, "mcp", 4) || null, filter: scalar(b, "filter", 4) || null,
    gate: gate ? { hard_stop: scalar(gate, "hard_stop", 6), approval_key: scalar(gate, "approval_key", 6), unlocks: list(gate, "unlocks", 6) } : null,
  };
});
const regText = rd("platform/registry/skills.yaml");
const regVersion = scalar(regText, "version", 2);
const skills = yamlBlocks(regText.split("\nskills:")[1], "  - id: ").map((b) => ({
  id: b.match(/^- id: (\S+)/)[1], status: scalar(b, "status", 4), implemented: scalar(b, "implemented", 4), version: scalar(b, "version", 4) || null,
  skill_path: scalar(b, "skill_path", 4), prompt_path: scalar(b, "prompt_path", 4), prompt_id: scalar(b, "prompt_id", 4) || null, prompt_version: scalar(b, "prompt_version", 4),
  output_template: scalar(b, "output_template", 4) || null, approval_key: scalar(b, "approval_key", 4) || null, event_template: scalar(b, "event_template", 6) || null,
}));
const skillBy = Object.fromEntries(skills.map((s) => [s.id, s]));

// ---------- prompt files and ADRs ----------
function frontMatter(text) { const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/); return m ? m[1] : null; }
const prompts = files.filter((f) => f.category === "prompt").map((f) => {
  const fm = frontMatter(f.content) || "";
  return { path: f.path, prompt_id: scalar(fm, "prompt_id", 0), prompt_version: scalar(fm, "prompt_version", 0), sha256: f.sha256, changelog: list(fm, "changelog", 0).map((s) => s.replace(/^"|"$/g, "")) };
});
const adrs = files.filter((f) => /docs\/architecture\/decisions\/ADR-\d+[^/]*\.md$/.test(f.path)).map((f) => {
  const fm = frontMatter(f.content) || "";
  return { path: f.path, adr_id: scalar(fm, "adr_id", 0), title: scalar(fm, "title", 0), status: scalar(fm, "status", 0), recorded_at: scalar(fm, "recorded_at", 0), implementation_prompt_path: (fm.match(/^\s+path: (.+)$/m) || [])[1] || null, implementation_prompt_sha256: (fm.match(/^\s+sha256: ([0-9a-f]{64})/m) || [])[1] || null };
});

// ---------- runtime evidence (task instances) ----------
const taskDirs = fs.readdirSync(path.join(REPO, "platform/tasks")).filter((n) => fs.statSync(path.join(REPO, "platform/tasks", n)).isDirectory());
const runtimeEvents = taskDirs.reduce((n, t) => { const p = `platform/tasks/${t}/journal/execution-log.json`; return n + (ex(p) ? (JSON.parse(rd(p)).entries || []).length : 0); }, 0);

// ---------- activities: facts + derived file operations ----------
const seen = new Set();
const activities = history.activities.map((a) => {
  const cur = curation.activities[a.id] || null;
  const fileOps = [];
  const pushOp = (t, op, extra) => { if (!t) return; fileOps.push({ scope: t.scope, path: t.path, op, ...extra }); };
  // chronological order of Write/Edit within the activity
  const ops = [...a.writes.map((w) => ({ k: "write", ...w })), ...a.edits.map((e) => ({ k: "edit", ...e }))].sort((x, y) => x.transcript_line - y.transcript_line);
  for (const o of ops) {
    const key = o.target.scope + ":" + o.target.path;
    const first = !seen.has(key); seen.add(key);
    const current = o.target.scope === "repo" ? fileBy[o.target.path] : null;
    if (o.k === "write") pushOp(o.target, first ? "write (first recorded write)" : "write (rewrite)", { timestamp: o.timestamp, transcript_line: o.transcript_line, tool_use_id: o.tool_use_id, is_error: o.is_error, written_sha256: o.sha256, current_state: o.target.scope !== "repo" ? "outside repository" : !current ? "file no longer exists" : current.sha256 === o.sha256 ? "identical to current file" : "changed later" });
    else pushOp(o.target, "edit", { timestamp: o.timestamp, transcript_line: o.transcript_line, tool_use_id: o.tool_use_id, is_error: o.is_error, current_state: o.target.scope !== "repo" ? "outside repository" : current ? "file exists" : "file no longer exists" });
  }
  const promptVersionsWritten = a.writes.filter((w) => w.target.scope === "repo" && /^\.claude\/prompts\/.+\.md$/.test(w.target.path)).map((w) => {
    const fm = frontMatter(w.content) || "";
    return { path: w.target.path, prompt_id: scalar(fm, "prompt_id", 0), prompt_version: scalar(fm, "prompt_version", 0), written_sha256: w.sha256 };
  });
  const repoFiles = [...new Set(fileOps.filter((f) => f.scope === "repo").map((f) => f.path))].sort();
  return { ...a, curated: cur, file_operations: fileOps, repo_files_touched_by_write_or_edit: repoFiles, prompt_versions_written: promptVersionsWritten };
});

// ---------- stages: verified status ----------
const stageCards = [{ id: "task-creation", order: 0, orchestration: true }].concat(stages).map((s) => {
  if (s.orchestration) return { id: s.id, order: 0, orchestration: true, definition_status: "defined_manual", runtime_status: taskDirs.length ? "has_tasks" : "not_executed", verified: { performed_by: (wfText.match(/task_creation:\n\s+performed_by: (\S+)/) || [])[1] || null, tooling_files: [] }, activities: activities.filter((a) => (a.curated?.stages || []).includes(s.id)).map((a) => a.id) };
  const sk = skillBy[s.skill] || {};
  const filesOk = sk.implemented ? [sk.skill_path, sk.prompt_path, sk.output_template, sk.event_template].filter(Boolean).every(ex) : null;
  const touching = activities.filter((a) => a.repo_files_touched_by_write_or_edit.some((p) => p.startsWith(`.claude/skills/${s.skill}/`) || p === `.claude/prompts/${s.skill}.md`)).map((a) => a.id);
  return {
    ...s, registry: sk,
    definition_status: s.implemented && sk.implemented && filesOk ? "implemented" : !s.implemented && !sk.implemented ? "planned" : "inconsistent",
    runtime_status: runtimeEvents ? "has_events" : "not_executed",
    skill_files_exist: filesOk,
    prompt: prompts.find((p) => p.path === sk.prompt_path) || null,
    activities: [...new Set([...touching, ...activities.filter((a) => (a.curated?.stages || []).includes(s.id)).map((a) => a.id)])],
  };
});

// ---------- build-time checks (facts computed now) ----------
const checks = [];
const ck = (id, desc, ok, detail) => checks.push({ id, description: desc, result: ok ? "pass" : "fail", detail: detail || null });
ck("B01", "Workflow defines 10 stages in order 1..10", stages.length === 10 && stages.every((s, i) => s.order === i + 1), `${stages.length} stages, workflow v${wfVersion}`);
ck("B02", "Workflow and registry agree on which skills are implemented", stages.every((s) => !!skillBy[s.skill] && skillBy[s.skill].implemented === s.implemented), `${stages.filter((s) => s.implemented).length} implemented, ${stages.filter((s) => !s.implemented).length} planned (registry v${regVersion})`);
ck("B03", "Every implemented skill's SKILL.md, prompt, output template and event template exist", stageCards.filter((c) => c.definition_status === "implemented").length === stages.filter((s) => s.implemented).length);
ck("B04", "Each registry prompt_version equals the prompt file front matter", skills.filter((s) => s.implemented).every((s) => (prompts.find((p) => p.path === s.prompt_path) || {}).prompt_version === s.prompt_version));
ck("B05", "No task instance exists under platform/tasks (so no runtime journal exists)", taskDirs.length === 0, `${taskDirs.length} task folders, ${runtimeEvents} runtime journal events`);
ck("B06", "Every user prompt's SHA-256 matches its stored text", activities.every((a) => sha(a.prompt.text) === a.prompt.sha256), `${activities.length} prompts`);
const adr1 = adrs.find((a) => a.adr_id === "ADR-001");
const adr1Prompt = adr1 && adr1.implementation_prompt_path && fileBy[adr1.implementation_prompt_path];
const act8 = activities.find((a) => a.id === "ACT-08");
const adrExact = adr1Prompt && act8 && adr1Prompt.content === act8.prompt.text;
const adrTrailingNl = adr1Prompt && act8 && adr1Prompt.content === act8.prompt.text + "\n";
ck("B07", "ADR-001's stored implementation prompt matches the ACT-08 prompt in the transcript", !!(adrExact || adrTrailingNl), adrExact ? "byte-identical" : adrTrailingNl ? "identical except one trailing newline added when the file was saved" : "differs");
ck("B08", "ADR-001's recorded prompt SHA-256 equals the stored file's hash", !!(adr1Prompt && adr1.implementation_prompt_sha256 === adr1Prompt.sha256));
const writesWithCurrent = activities.flatMap((a) => a.file_operations.filter((o) => o.op.startsWith("write") && o.scope === "repo"));
ck("B09", "Recorded Write operations compared with current files", true, `${writesWithCurrent.filter((o) => o.current_state === "identical to current file").length} identical, ${writesWithCurrent.filter((o) => o.current_state === "changed later").length} changed later, ${writesWithCurrent.filter((o) => o.current_state === "file no longer exists").length} no longer exist`);

const data = {
  format: "ai-qa-platform/qa-journal-data",
  builder_version: BUILDER_VERSION,
  built_at: new Date().toISOString(),
  provenance: {
    kind: "reconstructed",
    statement: "Read-only historical project journal reconstructed from repository files and the Claude Code session transcript. It is not runtime telemetry: no QA task has been created or executed.",
    transcript: history.source,
    extracted_at: history.extracted_at,
    extractor_version: history.extractor_version,
    tool_output_max_characters: history.limits.tool_output_max_characters,
  },
  repository: { workflow_version: wfVersion, registry_version: regVersion, task_instances: taskDirs, runtime_journal_events: runtimeEvents, file_count: files.length },
  stages: stageCards,
  skills, prompts, adrs,
  activities,
  session_events: history.session_events,
  stage_names: curation.stage_names,
  curation_about: curation.about,
  checks,
  files,
};
const out = path.join(J, "data", "journal-data.js");
fs.writeFileSync(out, "/* Generated by reports/qa-journal/tools/build-data.js — do not edit by hand. */\nwindow.QA_JOURNAL_DATA = " + JSON.stringify(data) + ";\n");
console.log(`journal-data.js: ${activities.length} activities, ${stageCards.length} stages, ${files.length} files, ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
for (const c of checks) console.log(`${c.result.toUpperCase()} ${c.id} ${c.description}${c.detail ? " — " + c.detail : ""}`);
