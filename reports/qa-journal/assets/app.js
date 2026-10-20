/* AI QA Platform — QA Journal (simple view). Read-only. Renders window.QA_JOURNAL_DATA; never fetches anything. */
(function () {
  "use strict";
  const D = window.QA_JOURNAL_DATA;
  const I = window.QA_I18N;
  const root = document.getElementById("view");
  if (!D || !I) { root.textContent = "The journal data could not be loaded (data/journal-data.js or assets/i18n.js is missing)."; return; }

  // ---------- language ----------
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* optional */ } } };
  let lang = store.get("qa-journal-lang") === "ar" ? "ar" : "en";
  let query = "";
  function t(k, vars) {
    let s = I[lang] && I[lang][k] != null ? I[lang][k] : I.en[k] != null ? I.en[k] : k;
    if (vars) for (const [a, b] of Object.entries(vars)) s = s.split("{" + a + "}").join(String(b));
    return s;
  }
  const L = (o) => (o && typeof o === "object" ? o[lang] || o.en : o);
  const stageName = (id) => L(D.stage_names[id]) || id;
  const fileBy = Object.fromEntries(D.files.map((f) => [f.path, f]));

  // ---------- DOM helpers ----------
  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === "class") el.className = v;
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? "" : v);
    }
    for (const c of kids.flat(Infinity)) if (c != null && c !== false) el.append(c instanceof Node ? c : document.createTextNode(String(c)));
    return el;
  }
  const fmtDate = (iso) => { try { return new Intl.DateTimeFormat(lang === "ar" ? "ar" : "en-GB", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(iso)); } catch (e) { return iso.slice(0, 10); } };
  const fmtDateTime = (iso) => { try { return new Intl.DateTimeFormat(lang === "ar" ? "ar" : "en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(new Date(iso)) + " UTC"; } catch (e) { return iso; } };

  // ---------- minimal, escaping Markdown renderer ----------
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  function inline(s) {
    let out = esc(s);
    out = out.replace(/`([^`]+)`/g, (m, c) => "<code>" + c + "</code>");
    out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, txt, url) => (/^https?:/i.test(url) ? `<a href="${url}" target="_blank" rel="noopener noreferrer">${txt}</a>` : `<a href="#" data-rel="${url}">${txt}</a>`));
    return out;
  }
  function mdToHtml(src) {
    const lines = src.replace(/\r\n/g, "\n").split("\n");
    const out = []; let i = 0;
    if (lines[0] === "---") { const end = lines.indexOf("---", 1); if (end > 0) { out.push("<pre><code>" + esc(lines.slice(0, end + 1).join("\n")) + "</code></pre>"); i = end + 1; } }
    while (i < lines.length) {
      const l = lines[i];
      if (/^```/.test(l)) { const buf = []; i++; while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]); i++; out.push("<pre><code>" + esc(buf.join("\n")) + "</code></pre>"); continue; }
      if (/^\s*\|/.test(l) && i + 1 < lines.length && /^\s*\|?\s*:?-{2,}/.test(lines[i + 1])) {
        const row = (r) => r.trim().replace(/^\||\|$/g, "").split(/(?<!\\)\|/).map((c) => inline(c.trim().replace(/\\\|/g, "|")));
        const head = row(l); i += 2; const body = [];
        while (i < lines.length && /^\s*\|/.test(lines[i])) body.push(row(lines[i++]));
        out.push('<div class="tbl-wrap"><table><thead><tr>' + head.map((c) => "<th>" + c + "</th>").join("") + "</tr></thead><tbody>" + body.map((r) => "<tr>" + r.map((c) => "<td>" + c + "</td>").join("") + "</tr>").join("") + "</tbody></table></div>");
        continue;
      }
      let m;
      if ((m = l.match(/^(#{1,6})\s+(.*)$/))) { const n = Math.min(m[1].length + 1, 5); out.push(`<h${n}>${inline(m[2])}</h${n}>`); i++; continue; }
      if (/^>\s?/.test(l)) { const buf = []; while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, "")); out.push("<blockquote>" + buf.map(inline).join("<br>") + "</blockquote>"); continue; }
      if (/^\s*([-*]|\d+\.)\s+/.test(l)) {
        const ordered = /^\s*\d+\.\s/.test(l); const items = [];
        while (i < lines.length && (/^\s*([-*]|\d+\.)\s+/.test(lines[i]) || (/^\s{2,}\S/.test(lines[i]) && items.length))) {
          const cur = lines[i++];
          if (/^\s*([-*]|\d+\.)\s+/.test(cur)) items.push({ d: cur.match(/^\s*/)[0].length, s: cur.replace(/^\s*([-*]|\d+\.)\s+/, "") }); else items[items.length - 1].s += " " + cur.trim();
        }
        out.push(`<${ordered ? "ol" : "ul"}>` + items.map((it) => `<li style="margin-inline-start:${it.d * 6}px">${inline(it.s)}</li>`).join("") + `</${ordered ? "ol" : "ul"}>`);
        continue;
      }
      if (!l.trim()) { i++; continue; }
      const buf = [];
      while (i < lines.length && lines[i].trim() && !/^(#{1,6}\s|```|>|\s*\||\s*([-*]|\d+\.)\s+)/.test(lines[i])) buf.push(lines[i++]);
      if (!buf.length) buf.push(lines[i++]);
      out.push("<p>" + buf.map(inline).join("<br>") + "</p>");
    }
    return out.join("\n");
  }
  function resolveRel(base, url) {
    const clean = url.split("#")[0];
    if (!clean) return null;
    const st = [];
    for (const p of (base ? base.split("/").slice(0, -1) : []).concat(clean.split("/"))) { if (p === "..") st.pop(); else if (p && p !== ".") st.push(p); }
    return fileBy[st.join("/")] ? st.join("/") : null;
  }
  function mdNode(text, basePath) {
    const div = h("div", { class: "md", dir: "ltr" });
    div.innerHTML = mdToHtml(text); // every piece of text is escaped first; no raw HTML passes through
    div.querySelectorAll("a[data-rel]").forEach((a) => {
      const target = resolveRel(basePath, a.getAttribute("data-rel"));
      if (target) a.addEventListener("click", (e) => { e.preventDefault(); openFile(target); });
      else a.removeAttribute("href");
    });
    return div;
  }

  // ---------- viewer ----------
  const dlg = document.getElementById("viewer");
  function openViewer({ title, text, mode = "raw", base = null, note = null }) {
    const body = h("div", { class: "vbody" });
    let current = mode;
    const render = () => {
      body.replaceChildren();
      if (note) body.append(h("p", { class: "note" }, note));
      if (current === "md") body.append(mdNode(text, base));
      else if (current === "node") body.append(text);
      else body.append(h("pre", { class: "code tall", dir: "ltr" }, text));
    };
    const toggle = mode === "md" ? h("button", { class: "btn sm", onclick: () => { current = current === "md" ? "raw" : "md"; toggle.textContent = current === "md" ? t("show_raw") : t("show_formatted"); render(); } }, t("show_raw")) : null;
    const copy = typeof text === "string" ? h("button", { class: "btn sm", onclick: () => copyText(text, copy) }, t("copy")) : null;
    dlg.replaceChildren(h("header", null, h("h3", { class: "ltr" }, title), toggle, copy, h("button", { class: "btn sm", onclick: () => dlg.close(), "aria-label": t("close") }, "✕")), body);
    render();
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
  }
  function copyText(text, btn) {
    const done = () => { const o = btn.textContent; btn.textContent = t("copied"); setTimeout(() => (btn.textContent = o), 1200); };
    const fallback = () => { const ta = h("textarea", { style: "position:fixed;opacity:0" }); ta.value = text; document.body.append(ta); ta.select(); try { document.execCommand("copy"); done(); } catch (e) { /* ignore */ } ta.remove(); };
    try { navigator.clipboard.writeText(text).then(done, fallback); } catch (e) { fallback(); }
  }
  function openFile(p) {
    const f = fileBy[p];
    if (!f) return;
    if (f.content == null) { openViewer({ title: p, text: t("not_embedded") }); return; }
    openViewer({ title: p, text: f.content, mode: /\.md$/i.test(p) ? "md" : "raw", base: p, note: t("current_file_note") });
  }

  // ---------- facts used by the views ----------
  const workStages = D.stages.filter((s) => !s.orchestration);
  const ready = workStages.filter((s) => s.definition_status === "implemented");
  const notReady = workStages.filter((s) => s.definition_status !== "implemented");
  const tasks = D.repository.task_instances.length;
  const runtimeEvents = D.repository.runtime_journal_events;
  const brief = fileBy["docs/assignment/assignment-brief.md"];
  const appUrl = brief && brief.content ? (brief.content.match(/^- UI: (\S+)/m) || [])[1] : null;
  const apiUrl = brief && brief.content ? (brief.content.match(/^- API: (\S+)/m) || [])[1] : null;

  // ---------- views ----------
  const views = {
    overview() {
      const acts = D.activities;
      return [
        h("div", { class: "hero" }, h("h1", null, t("ov_title")), h("p", { class: "lead" }, t("ov_lead"))),
        h("div", { class: "grid status-grid" },
          h("section", { class: "panel status-card ok" },
            h("h2", null, "✅ ", t("ov_ready")),
            h("div", { class: "big" }, t("n_of_m_steps", { n: ready.length, m: workStages.length })),
            h("p", { class: "muted" }, t("ov_ready_sub")),
            h("ul", { class: "items" }, ready.map((s) => h("li", null, h("span", { class: "ic" }, "✓"), h("span", null, stageName(s.id), h("span", { class: "sub" }, t("desc_" + s.id))))),
              h("li", null, h("span", { class: "ic" }, "✓"), h("span", null, t("ov_template"), h("span", { class: "sub" }, t("ov_template_sub")))))),
          h("section", { class: "panel status-card no" },
            h("h2", null, "⏳ ", t("ov_not_ready")),
            h("div", { class: "big" }, t("n_steps", { n: notReady.length })),
            h("p", { class: "muted" }, t("ov_not_ready_sub")),
            h("ul", { class: "items" }, notReady.map((s) => h("li", null, h("span", { class: "ic" }, "○"), h("span", null, stageName(s.id), h("span", { class: "sub" }, t("desc_" + s.id))))),
              h("li", null, h("span", { class: "ic" }, "○"), h("span", null, t("ov_tool_choice"), h("span", { class: "sub" }, t("ov_tool_choice_sub")))),
              h("li", null, h("span", { class: "ic" }, "○"), h("span", null, t("ov_task_tool"), h("span", { class: "sub" }, t("ov_task_tool_sub")))))),
          h("section", { class: "panel status-card run" },
            h("h2", null, "▶ ", t("ov_executed")),
            h("div", { class: "big" }, runtimeEvents === 0 ? t("ov_nothing_run") : t("ov_events", { n: runtimeEvents })),
            h("p", { class: "muted" }, t("ov_executed_sub")),
            h("ul", { class: "items" },
              h("li", null, h("span", { class: "ic" }, String(tasks)), h("span", null, t("ov_tasks_created"))),
              h("li", null, h("span", { class: "ic" }, String(runtimeEvents)), h("span", null, t("ov_steps_run"))),
              h("li", null, h("span", { class: "ic" }, tasks === 0 ? "0" : "—"), h("span", null, t("ov_bugs")))),
            h("p", { style: "margin-bottom:0" }, t("ov_what_happened", { n: acts.length, from: fmtDate(acts[0].prompt.timestamp), to: fmtDate(acts[acts.length - 1].prompt.timestamp) }), " ",
              h("a", { href: "#/history" }, t("ov_see_history"))))),
        h("section", { class: "panel next-hero", style: "margin-top:14px" },
          h("h2", null, t("ov_next_title")), h("p", null, t("ns_title")), h("a", { class: "btn primary", href: "#/next" }, t("ov_next_btn"))),
      ];
    },

    history(param) {
      if (param) query = "";
      const list = h("div");
      const search = h("input", { class: "search", type: "search", placeholder: t("hist_search"), "aria-label": t("hist_search"), value: query, oninput: (e) => { query = e.target.value; draw(); } });
      function draw() {
        const q = query.trim().toLowerCase();
        const shown = D.activities.filter((a) => !q || searchText(a).includes(q));
        list.replaceChildren(...shown.map((a) => historyItem(a, a.id === param)));
        if (!shown.length) list.append(h("p", { class: "empty" }, t("no_match")));
      }
      draw();
      if (param) setTimeout(() => { const el = document.getElementById("act-" + param); if (el) el.scrollIntoView({ block: "start" }); }, 0);
      return [h("h1", null, t("hist_title")), h("p", { class: "lead" }, t("hist_lead")), h("p", { class: "source-note" }, t("hist_note")),
        h("div", { class: "filters" }, search), list];
    },

    next() {
      const example = t("ns_example", { app: appUrl || "<application URL>", api: apiUrl || "<API URL>" });
      return [
        h("h1", null, t("ns_heading")),
        h("section", { class: "panel next-hero" },
          h("h2", null, t("ns_title")),
          h("p", null, t("ns_why")),
          h("h3", null, t("ns_you_provide")),
          h("ul", { class: "clean" }, t("ns_provide_list").map((x) => h("li", null, x))),
          appUrl ? h("p", { class: "note" }, t("ns_urls_known"), " ", h("span", { class: "ltr" }, appUrl + (apiUrl ? " · " + apiUrl : ""))) : null,
          h("h3", null, t("ns_how")),
          h("ol", { class: "steps" }, t("ns_steps").map((x) => h("li", null, x))),
          h("h3", null, t("ns_copy_title")),
          h("pre", { class: "code", dir: "ltr" }, example),
          h("button", { class: "btn sm", onclick: (e) => copyText(example, e.currentTarget) }, t("copy"))),
        h("div", { class: "grid two", style: "margin-top:14px" },
          h("section", { class: "panel" }, h("h3", null, t("ns_after_title")), h("p", null, t("ns_after"))),
          h("section", { class: "panel" }, h("h3", null, t("ns_not_yet_title")), h("ul", { class: "clean" }, t("ns_not_yet").map((x) => h("li", null, x))))),
      ];
    },
  };

  function searchText(a) {
    if (!a._s) a._s = [a.prompt.text, a.final_report && a.final_report.text, a.curated && [a.curated.title.en, a.curated.title.ar, a.curated.summary.en, a.curated.summary.ar].join(" "), a.file_operations.map((f) => f.path).join(" ")].join("\n").toLowerCase();
    return a._s;
  }

  function historyItem(a, open) {
    const n = Number(a.id.slice(4));
    const c = a.curated;
    const inner = h("div", { class: "in" });
    let built = false;
    const build = () => { if (!built) { built = true; inner.append(...historyBody(a)); } };
    const det = h("details", { class: "panel hist-item", id: "act-" + a.id, open: open || null, ontoggle: () => { if (det.open) build(); } },
      h("summary", null, h("span", { class: "num" }, String(n)),
        h("span", { class: "what" }, h("b", null, c ? L(c.title) : a.id), h("span", { class: "muted" }, c ? L(c.summary) : "")),
        h("span", { class: "when" }, fmtDate(a.prompt.timestamp))),
      inner);
    if (open) build();
    return det;
  }

  function historyBody(a) {
    const out = [];
    // 1. the request
    const p = a.prompt.text;
    out.push(h("div", { class: "part" }, h("h3", null, t("h_request")),
      h("pre", { class: "code", dir: "ltr" }, p.length > 900 ? p.slice(0, 900) + "\n…" : p),
      h("div", { class: "chips" },
        h("button", { class: "btn sm primary", onclick: () => openViewer({ title: t("h_request") + " — " + fmtDateTime(a.prompt.timestamp), text: p, note: t("exact_note") }) }, t("read_full_request")),
        h("button", { class: "btn sm", onclick: (e) => copyText(p, e.currentTarget) }, t("copy")))));

    // 2. what changed
    const byPath = new Map();
    for (const o of a.file_operations.filter((o) => o.scope === "repo")) {
      if (!byPath.has(o.path)) byPath.set(o.path, { path: o.path, created: o.op.startsWith("write (first"), ops: [] });
      byPath.get(o.path).ops.push(o);
    }
    const temp = new Set(a.file_operations.filter((o) => o.scope === "scratchpad").map((o) => o.path)).size;
    const files = [...byPath.values()];
    out.push(h("div", { class: "part" }, h("h3", null, t("h_changed")),
      files.length ? h("ul", { class: "items" }, files.map((f) => h("li", null,
        h("span", { class: "ic" }, f.created ? "+" : "✎"),
        h("span", { style: "flex:1;min-width:0" }, h("span", { class: "ltr mono", style: "overflow-wrap:anywhere" }, f.path), h("span", { class: "sub" }, f.created ? t("created") : t("updated"))),
        h("span", { class: "chips" }, viewButton(a, f.ops[f.ops.length - 1]), fileBy[f.path] ? h("button", { class: "btn sm", onclick: () => openFile(f.path) }, t("today_version")) : null))))
        : h("p", { class: "empty" }, t("no_changes")),
      temp ? h("p", { class: "note" }, t("temp_files", { n: temp })) : null,
      h("p", { class: "note" }, t("changed_note"))));

    // 3. result
    out.push(h("div", { class: "part" }, h("h3", null, t("h_result")),
      a.final_report
        ? [h("div", { style: "max-height:440px;overflow:auto;border:1px solid var(--border);border-radius:8px;padding:4px 12px" }, mdNode(a.final_report.text, null)),
          h("div", { class: "chips", style: "margin-top:6px" }, h("button", { class: "btn sm", onclick: () => openViewer({ title: t("h_result"), text: a.final_report.text, mode: "md", note: t("exact_note") }) }, t("open_full")))]
        : h("p", { class: "empty" }, t("no_result"))));

    // 4. technical records, collapsed
    const vids = new Set(a.validation_commands);
    const cmdRow = (x) => h("li", null, h("span", { class: "ic" }, x.is_error ? "⚠" : vids.has(x.tool_use_id) ? "✓" : "›"),
      h("span", { style: "flex:1;min-width:0", class: "ltr" }, x.description || x.tool, h("span", { class: "sub" }, x.timestamp.slice(11, 19) + " UTC")),
      h("button", { class: "btn sm", onclick: () => openCommand(x) }, t("open")));
    out.push(h("details", { class: "sec" }, h("summary", null, t("h_technical"), h("span", { class: "count" }, t("tech_counts", { c: a.commands.length, v: vids.size, e: a.errors.length }))),
      h("div", { class: "in" },
        h("p", { class: "note" }, t("tech_note")),
        a.commands.length ? h("ul", { class: "items" }, a.commands.map(cmdRow)) : h("p", { class: "empty" }, t("no_commands")),
        a.errors.length ? [h("h4", null, t("errors")), h("ul", { class: "items" }, a.errors.map((e) => h("li", null, h("span", { class: "ic" }, "⚠"), h("span", { class: "ltr", style: "flex:1" }, `${e.tool} · ${e.description || ""}`),
          h("button", { class: "btn sm", onclick: () => openViewer({ title: t("errors"), text: e.output.text + (e.output.truncated ? "\n\n[" + t("truncated", { n: e.output.original_length }) + "]" : "") }) }, t("open")))))] : null,
        h("p", { class: "note ltr" }, "Prompt SHA-256 " + a.prompt.sha256))));
    return out;
  }
  function viewButton(a, o) {
    if (o.op.startsWith("write")) {
      const w = a.writes.find((x) => x.tool_use_id === o.tool_use_id);
      return h("button", { class: "btn sm", onclick: () => openViewer({ title: o.path, text: w.content, mode: /\.md$/i.test(o.path) ? "md" : "raw", base: o.path, note: t("as_written_note") }) }, t("as_written"));
    }
    const e = a.edits.find((x) => x.tool_use_id === o.tool_use_id);
    const pre = h("pre", { class: "code tall", dir: "ltr" });
    (e.old_string || "").split("\n").forEach((l) => pre.append(h("span", { class: "diff-del" }, "- " + l)));
    (e.new_string || "").split("\n").forEach((l) => pre.append(h("span", { class: "diff-add" }, "+ " + l)));
    return h("button", { class: "btn sm", onclick: () => openViewer({ title: o.path, text: pre, mode: "node", note: t("edit_note") }) }, t("the_edit"));
  }
  function openCommand(x) {
    const outText = x.output ? x.output.text + (x.output.truncated ? "\n\n[" + t("truncated", { n: x.output.original_length }) + "]" : "") : t("no_output");
    openViewer({ title: x.description || x.tool, text: "$ " + x.command + "\n\n──────── " + t("output") + " ────────\n" + outText });
  }
  function showSources() {
    const p = D.provenance, tr = p.transcript;
    const text = [t("src_intro"), "", t("src_transcript") + ": " + tr.file_name, "SHA-256: " + tr.sha256, t("src_period") + ": " + tr.first_timestamp + " → " + tr.last_timestamp,
      t("src_extracted") + ": " + p.extracted_at, t("src_built") + ": " + D.built_at, "", t("src_limits_title"), ...t("src_limits").map((x) => "- " + x), "", t("src_rebuild"),
      "node reports/qa-journal/tools/extract-history.js <session.jsonl>", "node reports/qa-journal/tools/build-data.js", "node reports/qa-journal/tools/validate.js"].join("\n");
    openViewer({ title: t("about_data"), text });
  }

  // ---------- routing ----------
  const TABS = ["overview", "history", "next"];
  function go(view) { location.hash = "#/" + view; }
  function route() {
    const m = location.hash.match(/^#\/([a-z]+)(?:\/(.+))?$/);
    const view = m && views[m[1]] ? m[1] : "overview";
    const param = m && m[2] ? decodeURIComponent(m[2]) : null;
    document.querySelectorAll("nav.tabs .tab").forEach((b) => b.setAttribute("aria-current", b.dataset.view === view ? "page" : "false"));
    root.replaceChildren(...[views[view](param)].flat(Infinity).filter((n) => n != null && n !== false));
    if (!(view === "history" && param)) window.scrollTo(0, 0);
  }
  function applyLang() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.title = t("page_title");
    document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
    const lb = document.getElementById("lang-btn");
    lb.textContent = lang === "ar" ? "English" : "العربية";
    lb.setAttribute("lang", lang === "ar" ? "en" : "ar");
    document.getElementById("tabs").replaceChildren(...TABS.map((v) => h("button", { class: "tab", "data-view": v, onclick: () => go(v) }, t("tab_" + v))));
    route();
  }
  document.getElementById("lang-btn").addEventListener("click", () => { lang = lang === "ar" ? "en" : "ar"; store.set("qa-journal-lang", lang); applyLang(); });
  document.getElementById("about-btn").addEventListener("click", showSources);
  window.addEventListener("hashchange", route);
  applyLang();
})();
