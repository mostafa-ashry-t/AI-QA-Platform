#!/usr/bin/env node
// Extracts the verifiable implementation history of this repository from a Claude Code
// session transcript (.jsonl) into reports/qa-journal/data/session-history.json.
//
// Read only: it never modifies the transcript or any project file except the output JSON.
// It copies records; it does not summarize, infer or invent anything. Every value comes from
// a transcript record and keeps its transcript line number so it can be checked.
//
// Usage: node reports/qa-journal/tools/extract-history.js <path-to-session.jsonl>
"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const EXTRACTOR_VERSION = "1.0.0";
const REPO = path.resolve(__dirname, "..", "..", "..");
const OUT = path.join(REPO, "reports", "qa-journal", "data", "session-history.json");
const MAX_OUTPUT = 6000; // characters of tool output kept per command (truncation is recorded)

const src = process.argv[2];
if (!src) { console.error("usage: extract-history.js <session.jsonl>"); process.exit(2); }
const raw = fs.readFileSync(src);
const lines = raw.toString("utf8").split("\n");
const sha = (s) => crypto.createHash("sha256").update(s).digest("hex");

const recs = [];
lines.forEach((l, i) => { if (!l.trim()) return; recs.push({ line: i + 1, o: JSON.parse(l) }); });

const repoNorm = REPO.replace(/\\/g, "/").toLowerCase();
function rel(p) {
  if (!p) return null;
  const n = p.replace(/\\/g, "/");
  const low = n.toLowerCase();
  if (low.startsWith(repoNorm + "/")) return { scope: "repo", path: n.slice(repoNorm.length + 1) };
  if (/\/temp\/claude\/.*\/scratchpad\//i.test(n)) return { scope: "scratchpad", path: n.replace(/^.*\/scratchpad\//i, "scratchpad/") };
  return { scope: "external", path: n };
}
const textOf = (c) => (typeof c === "string" ? c : Array.isArray(c) ? c.filter((b) => b.type === "text").map((b) => b.text).join("\n") : "");
function clip(s) { s = s || ""; return s.length > MAX_OUTPUT ? { text: s.slice(0, MAX_OUTPUT), truncated: true, original_length: s.length } : { text: s, truncated: false, original_length: s.length }; }

// tool results by id
const results = {};
for (const { o } of recs) {
  if (o.type !== "user" || !Array.isArray(o.message && o.message.content)) continue;
  for (const b of o.message.content) if (b.type === "tool_result") {
    const t = Array.isArray(b.content) ? b.content.map((x) => x.text || "").join("\n") : String(b.content == null ? "" : b.content);
    results[b.tool_use_id] = { text: t, is_error: !!b.is_error };
  }
}

// prompts = user records whose content is typed text (not tool results, not meta, not compact summary, not local commands)
const prompts = recs.filter(({ o }) => {
  if (o.type !== "user" || o.isMeta || o.isCompactSummary || !o.message) return false;
  const c = o.message.content;
  if (Array.isArray(c) && c.some((b) => b.type === "tool_result")) return false;
  const t = textOf(c).trim();
  return t && !t.startsWith("<command-name>") && !t.startsWith("<local-command-");
});

const events = [];
for (const { line, o } of recs) {
  if (o.type === "system" && o.subtype === "compact_boundary") events.push({ type: "compact_boundary", timestamp: o.timestamp, transcript_line: line, note: "Context compaction: the conversation was summarized; later turns continue from the summary." });
  if (o.type === "user" && !o.isMeta && o.message && textOf(o.message.content).trim().startsWith("<command-name>")) {
    const cmd = (textOf(o.message.content).match(/<command-name>([^<]*)<\/command-name>/) || [])[1];
    events.push({ type: "local_command", command: cmd, timestamp: o.timestamp, transcript_line: line });
  }
}

const VALIDATION_RE = /valid|verif|check|compile|test|mutation|re-run|rerun/i;
const activities = prompts.map((p, idx) => {
  const startLine = p.line;
  const endLine = idx + 1 < prompts.length ? prompts[idx + 1].line : Infinity;
  const inside = recs.filter((r) => r.line > startLine && r.line < endLine);
  const text = textOf(p.o.message.content);
  const act = {
    id: "ACT-" + String(idx + 1).padStart(2, "0"),
    prompt: { text, sha256: sha(text), timestamp: p.o.timestamp, transcript_line: startLine, uuid: p.o.uuid, characters: text.length },
    first_record_timestamp: p.o.timestamp,
    last_assistant_record_timestamp: null,
    models: [],
    tool_counts: {},
    writes: [], edits: [], commands: [], reads: [], searches: [],
    validation_commands: [],
    errors: [],
    assistant_text_blocks: 0,
    final_report: null,
  };
  const models = new Set();
  let textsAfterLastTool = [];
  for (const { line, o } of inside) {
    if (o.type !== "assistant" || !o.message) continue;
    if (o.timestamp) act.last_assistant_record_timestamp = o.timestamp; // last assistant record = end of the activity's work
    if (o.message.model) models.add(o.message.model);
    for (const b of o.message.content || []) {
      if (b.type === "text" && b.text.trim()) { act.assistant_text_blocks++; textsAfterLastTool.push({ text: b.text, timestamp: o.timestamp, line }); }
      if (b.type !== "tool_use") continue;
      textsAfterLastTool = [];
      act.tool_counts[b.name] = (act.tool_counts[b.name] || 0) + 1;
      const r = results[b.id] || { text: null, is_error: false };
      const base = { timestamp: o.timestamp, transcript_line: line, tool_use_id: b.id, is_error: r.is_error };
      if (r.is_error) act.errors.push({ ...base, tool: b.name, description: b.input.description || b.input.file_path || null, output: clip(r.text) });
      if (b.name === "Write") act.writes.push({ ...base, target: rel(b.input.file_path), content: b.input.content, sha256: sha(b.input.content || "") });
      else if (b.name === "Edit") act.edits.push({ ...base, target: rel(b.input.file_path), old_string: b.input.old_string, new_string: b.input.new_string, replace_all: !!b.input.replace_all });
      else if (b.name === "Bash" || b.name === "PowerShell") {
        const c = { ...base, tool: b.name, description: b.input.description || null, command: b.input.command, output: r.text == null ? null : clip(r.text) };
        act.commands.push(c);
        if (VALIDATION_RE.test(c.description || "")) act.validation_commands.push(c.tool_use_id);
      } else if (b.name === "Read") act.reads.push({ ...base, target: rel(b.input.file_path) });
      else if (b.name === "Grep" || b.name === "Glob") act.searches.push({ ...base, tool: b.name, pattern: b.input.pattern, path: b.input.path ? rel(b.input.path) : null });
    }
  }
  act.models = [...models];
  if (textsAfterLastTool.length) act.final_report = { text: textsAfterLastTool.map((t) => t.text).join("\n\n"), timestamp: textsAfterLastTool[textsAfterLastTool.length - 1].timestamp, transcript_line: textsAfterLastTool[0].line };
  return act;
});

const out = {
  format: "ai-qa-platform/session-history",
  extractor_version: EXTRACTOR_VERSION,
  extracted_at: new Date().toISOString(),
  provenance: "Copied from a Claude Code session transcript. Not runtime telemetry of any QA task. Values are copied, not inferred.",
  source: { file_name: path.basename(src), sha256: sha(raw), lines: lines.filter((l) => l.trim()).length, session_id: (recs.find((r) => r.o.sessionId) || { o: {} }).o.sessionId || null, first_timestamp: (recs.find((r) => r.o.timestamp) || { o: {} }).o.timestamp || null, last_timestamp: [...recs].reverse().find((r) => r.o.timestamp).o.timestamp },
  limits: { tool_output_max_characters: MAX_OUTPUT },
  session_events: events,
  activities,
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + "\n");
console.log(`extracted ${activities.length} activities, ${events.length} session events → ${path.relative(REPO, OUT)}`);
