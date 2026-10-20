#!/usr/bin/env node
// Validates the QA Journal page, its data bundle and every data reference. No dependencies, read only.
// Usage: node reports/qa-journal/tools/validate.js [path-to-session.jsonl]
//        (with the transcript path, every prompt is also re-verified against the original transcript)
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const crypto = require("crypto");

const REPO = path.resolve(__dirname, "..", "..", "..");
const J = path.join(REPO, "reports", "qa-journal");
const rel = (p) => path.relative(REPO, p).replace(/\\/g, "/");
const sha = (b) => crypto.createHash("sha256").update(b).digest("hex");
const read = (p) => fs.readFileSync(p, "utf8");
const results = [];
function check(id, desc, fn) {
  let r;
  try { r = fn(); } catch (e) { r = { ok: false, detail: "exception: " + e.message }; }
  if (r === true) r = { ok: true };
  results.push({ id, desc, ok: !!r.ok, detail: r.detail || "" });
}

const html = read(path.join(J, "index.html"));
const appJs = read(path.join(J, "assets", "app.js"));
const css = read(path.join(J, "assets", "app.css"));
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(read(path.join(J, "data", "journal-data.js")), sandbox, { filename: "journal-data.js" });
vm.runInContext(read(path.join(J, "assets", "i18n.js")), sandbox, { filename: "i18n.js" });
const D = sandbox.window.QA_JOURNAL_DATA;
const I = sandbox.window.QA_I18N;
const history = JSON.parse(read(path.join(J, "data", "session-history.json")));
const curation = JSON.parse(read(path.join(J, "data", "curation.json")));

check("J01", "index.html references only local files that exist (scripts, stylesheet)", () => {
  const refs = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map((m) => m[1]);
  const missing = refs.filter((r) => /^[a-z]+:/i.test(r) || !fs.existsSync(path.join(J, r)));
  return { ok: refs.length === 4 && !missing.length, detail: `${refs.length} references: ${refs.join(", ")}${missing.length ? " | bad: " + missing : ""}` };
});
check("J02", "No network access: no fetch/XMLHttpRequest/WebSocket/import in app.js, no remote url() in CSS, no remote src/href in HTML", () => {
  const bad = [/\bfetch\s*\(/, /XMLHttpRequest/, /WebSocket/, /\bimport\s*\(/].filter((r) => r.test(appJs)).map(String);
  if (/url\(\s*['"]?https?:/i.test(css)) bad.push("css url()");
  if (/(src|href)="https?:/i.test(html)) bad.push("html remote ref");
  return { ok: !bad.length, detail: bad.join(", ") };
});
check("J03", "index.html is structurally balanced (open/close tags) and declares charset, viewport, title, lang and dir", () => {
  const voids = new Set(["meta", "link", "br", "img", "input", "hr"]);
  const stack = []; const errs = [];
  for (const m of html.replace(/<!--[\s\S]*?-->/g, "").matchAll(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b[^>]*?(\/?)>/g)) {
    const [, close, tag0, self] = m; const tag = tag0.toLowerCase();
    if (tag === "!doctype" || voids.has(tag) || self) continue;
    if (!close) stack.push(tag); else if (stack.pop() !== tag) errs.push(tag);
  }
  const head = /<meta charset="utf-8">/.test(html) && /name="viewport"/.test(html) && /<title>[^<]+<\/title>/.test(html) && /<html lang="en" dir="ltr">/.test(html);
  return { ok: !errs.length && !stack.length && head, detail: errs.length || stack.length ? `unbalanced: ${errs} / open: ${stack}` : "balanced" };
});
check("J04", "Every element id that app.js looks up exists in index.html", () => {
  const ids = [...appJs.matchAll(/getElementById\("([^"]+)"\)/g)].map((m) => m[1]);
  const missing = [...new Set(ids)].filter((id) => !new RegExp(`id="${id}"`).test(html));
  return { ok: !missing.length, detail: [...new Set(ids)].join(", ") + (missing.length ? " | missing " + missing : "") };
});
check("J05", "Data bundle loads and has the expected top-level structure", () => {
  const keys = ["format", "builder_version", "built_at", "provenance", "repository", "stages", "skills", "prompts", "adrs", "activities", "session_events", "stage_names", "checks", "files"];
  const missing = keys.filter((k) => !(k in D));
  return { ok: D.format === "ai-qa-platform/qa-journal-data" && !missing.length && D.provenance.kind === "reconstructed", detail: missing.join(",") };
});
check("J06", "i18n: English and Arabic have identical keys; list/table entries have equal lengths", () => {
  const en = Object.keys(I.en).sort(), ar = Object.keys(I.ar).sort();
  const onlyEn = en.filter((k) => !(k in I.ar)), onlyAr = ar.filter((k) => !(k in I.en));
  const lenBad = en.filter((k) => Array.isArray(I.en[k]) && (!Array.isArray(I.ar[k]) || I.en[k].length !== I.ar[k].length || I.en[k].some((x, i) => Array.isArray(x) && x.length !== I.ar[k][i].length)));
  return { ok: !onlyEn.length && !onlyAr.length && !lenBad.length, detail: `${en.length} keys${onlyEn.length ? " | only en: " + onlyEn : ""}${onlyAr.length ? " | only ar: " + onlyAr : ""}${lenBad.length ? " | length: " + lenBad : ""}` };
});
check("J07", "Every UI string the page uses exists in both languages (t(...), data-i18n, tab_*, desc_<stage>)", () => {
  const used = new Set([...appJs.matchAll(/\bt\("([a-z0-9_]+)"/g)].map((m) => m[1]).concat([...html.matchAll(/data-i18n="([a-z0-9_]+)"/g)].map((m) => m[1])));
  for (const k of [...used]) if (k.endsWith("_")) used.delete(k); // dynamic prefixes are enumerated below
  for (const v of ["overview", "history", "next"]) used.add("tab_" + v);
  for (const s of D.stages) if (!s.orchestration) used.add("desc_" + s.id);
  const missing = [...used].filter((k) => !(k in I.en) || !(k in I.ar));
  const tabs = (appJs.match(/const TABS = \[([^\]]*)\]/) || [])[1];
  const threeTabs = tabs && tabs.replace(/\s/g, "") === '"overview","history","next"';
  return { ok: !missing.length && threeTabs, detail: `${used.size} keys used; tabs: ${tabs}${missing.length ? " | missing: " + missing : ""}` };
});
check("J08", "Data is current: every repository file is listed, and each listed file's SHA-256 equals the file on disk", () => {
  const SKIP = new Set([".git", "node_modules", ".playwright-mcp"]);
  const disk = [];
  (function walk(d) { for (const n of fs.readdirSync(path.join(REPO, d))) { if (SKIP.has(n)) continue; const r = d ? d + "/" + n : n; fs.statSync(path.join(REPO, r)).isDirectory() ? walk(r) : disk.push(r); } })("");
  const listed = new Set(D.files.map((f) => f.path));
  const notListed = disk.filter((p) => !listed.has(p));
  const gone = [...listed].filter((p) => !fs.existsSync(path.join(REPO, p)));
  const self = "reports/qa-journal/data/journal-data.js";
  const stale = D.files.filter((f) => f.path !== self && fs.existsSync(path.join(REPO, f.path)) && sha(fs.readFileSync(path.join(REPO, f.path))) !== f.sha256).map((f) => f.path);
  const embeddedOk = D.files.every((f) => f.content == null || sha(Buffer.from(f.content, "utf8")) === f.sha256);
  return { ok: !notListed.length && !gone.length && !stale.length && embeddedOk, detail: `${disk.length} files on disk, ${listed.size} listed${notListed.length ? " | not listed: " + notListed : ""}${gone.length ? " | gone: " + gone : ""}${stale.length ? " | stale (rebuild needed): " + stale : ""}${embeddedOk ? "" : " | embedded content hash mismatch"}` };
});
check("J09", "Activities match the extracted history: same IDs, prompt text and hashes; IDs sequential; prompt times ascending", () => {
  const errs = [];
  if (D.activities.length !== history.activities.length) errs.push("count");
  D.activities.forEach((a, i) => {
    const h = history.activities[i];
    if (a.id !== "ACT-" + String(i + 1).padStart(2, "0")) errs.push(a.id + " id");
    if (a.prompt.text !== h.prompt.text || sha(a.prompt.text) !== a.prompt.sha256) errs.push(a.id + " prompt");
    if (i && a.prompt.timestamp <= D.activities[i - 1].prompt.timestamp) errs.push(a.id + " order");
  });
  return { ok: !errs.length, detail: errs.length ? errs.join(", ") : `${D.activities.length} activities` };
});
check("J10", "Recorded write contents hash to their recorded SHA-256; file-operation states agree with the current files", () => {
  const errs = []; let n = 0;
  for (const a of D.activities) {
    for (const w of a.writes) if (sha(w.content || "") !== w.sha256) errs.push(a.id + " write hash");
    for (const o of a.file_operations) {
      if (o.scope !== "repo") continue; n++;
      const p = path.join(REPO, o.path); const exists = fs.existsSync(p);
      if (o.current_state === "file no longer exists" ? exists : !exists) errs.push(`${a.id} ${o.path} existence`);
      if (o.current_state === "identical to current file" && sha(fs.readFileSync(p)) !== o.written_sha256) errs.push(`${a.id} ${o.path} identical?`);
      if (o.current_state === "changed later" && sha(fs.readFileSync(p)) === o.written_sha256) errs.push(`${a.id} ${o.path} changed?`);
    }
  }
  return { ok: !errs.length, detail: errs.length ? errs.slice(0, 8).join(", ") : `${n} repository file operations checked` };
});
check("J11", "Cross-references resolve: curation covers every activity; stage names cover every stage; stage→activity, ADR, prompt and skill paths exist", () => {
  const errs = [];
  for (const a of D.activities) if (!curation.activities[a.id]) errs.push("curation " + a.id);
  for (const s of D.stages) {
    if (!D.stage_names[s.id]) errs.push("name " + s.id);
    for (const id of s.activities) if (!D.activities.find((a) => a.id === id)) errs.push("stage act " + id);
    if (s.prompt && !fs.existsSync(path.join(REPO, s.prompt.path))) errs.push("prompt " + s.prompt.path);
    if (s.definition_status === "implemented") for (const p of [s.registry.skill_path, s.registry.prompt_path, s.registry.output_template, s.registry.event_template]) if (!fs.existsSync(path.join(REPO, p))) errs.push("skill file " + p);
  }
  for (const a of D.adrs) for (const p of [a.path, a.implementation_prompt_path]) if (p && !fs.existsSync(path.join(REPO, p))) errs.push("adr " + p);
  for (const c of Object.keys(curation.activities)) if (!D.activities.find((a) => a.id === c)) errs.push("curation orphan " + c);
  return { ok: !errs.length, detail: errs.join(", ") || `${D.stages.length} stages, ${D.adrs.length} ADR(s)` };
});
check("J12", "Every build-time check in the data passed, and there is no runtime-telemetry claim (provenance = reconstructed, runtime events = 0 while no task exists)", () => {
  const failed = D.checks.filter((c) => c.result !== "pass").map((c) => c.id);
  const honest = D.provenance.kind === "reconstructed" && (D.repository.task_instances.length > 0 || D.repository.runtime_journal_events === 0) && D.stages.every((s) => s.runtime_status === "not_executed" || D.repository.runtime_journal_events > 0);
  return { ok: !failed.length && honest, detail: failed.length ? "failed: " + failed : `${D.checks.length} checks` };
});
check("J13", "Privacy: no email addresses (except placeholder/example domains) and no credential-like values in the data bundle or history", () => {
  const blob = read(path.join(J, "data", "journal-data.js")) + read(path.join(J, "data", "session-history.json"));
  const emails = [...new Set((blob.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z0-9.-]+/g) || []))].filter((e) => !/@(example\.(com|org)|anthropic\.com|[a-z0-9-]+\.test)$/i.test(e) && !/^[0-9.]+@/.test(e) && !/@[0-9]/.test(e) && !/\.(js|md|json|ya?ml|ts|java)$/i.test(e) && !/@(latest|types|playwright|modelcontextprotocol|anthropic-ai)\b/i.test(e));
  const secrets = (blob.match(/(?:api[_-]?key|secret|password|passwd|token)\s*[:=]\s*["'][A-Za-z0-9_\-]{12,}["']|Bearer\s+[A-Za-z0-9\-_.]{20,}/gi) || []);
  return { ok: !emails.length && !secrets.length, detail: (emails.length ? "emails: " + emails.slice(0, 5) : "no emails") + (secrets.length ? " | secrets: " + secrets.length : "") };
});

const transcript = process.argv[2];
if (transcript) check("J14", "Every prompt equals the original transcript record at its recorded line (text and record uuid)", () => {
  const lines = read(transcript).split("\n");
  const errs = [];
  for (const a of history.activities) {
    const o = JSON.parse(lines[a.prompt.transcript_line - 1]);
    const c = o.message.content; const txt = typeof c === "string" ? c : c.filter((b) => b.type === "text").map((b) => b.text).join("\n");
    if (o.uuid !== a.prompt.uuid || txt !== a.prompt.text || o.timestamp !== a.prompt.timestamp) errs.push(a.id);
  }
  return { ok: !errs.length, detail: errs.length ? "mismatch: " + errs : `${history.activities.length} prompts verified against ${path.basename(transcript)}` };
});

let n = 0;
for (const r of results) { if (r.ok) n++; console.log(`${r.ok ? "PASS" : "FAIL"} ${r.id} ${r.desc}${r.detail ? "  [" + r.detail + "]" : ""}`); }
console.log(`\n${n}/${results.length} passed`);
process.exitCode = n === results.length ? 0 : 1;
