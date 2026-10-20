# QA Journal (HTML)

A read-only journal of the AI QA Platform, in simple English with an Arabic toggle.
It has three sections:

1. **Overview:** what is ready, what is not ready, and what has actually been
   executed. So far that is nothing: no QA task exists yet.
2. **Project History:** each of your original requests, what Claude changed, and
   Claude's actual result. Every entry stays collapsed until clicked. The full
   technical records (commands, checks, errors) are inside each entry.
3. **Next Step:** the single action needed to start the first real QA task.

**Open:** [`index.html`](index.html). Open it directly in a browser. It works from
`file://` with no server, network or install, because all data is in local files.

## What it is, and what it is not

The journal is **reconstructed** from verifiable sources. It is **not runtime
telemetry**. No QA task has been created or executed, so no runtime journal
(`platform/tasks/<task>/journal/execution-log.json`) exists. The page states this
on the Overview and in "About this page's data":

- Requests, written files, edits, command output and Claude's results are copied
  exactly from the session transcript.
- Status numbers are computed from the repository when the data is built.
- The short titles and descriptions (`data/curation.json`) were written for the
  page, and the page says so.

## Files

| Path | Role |
|---|---|
| `index.html` | The page |
| `assets/app.css`, `assets/app.js`, `assets/i18n.js` | Styles, viewer logic and UI strings (EN/AR). No external resources. |
| `data/session-history.json` | **Facts.** Records copied from the session transcript: prompts, timestamps, Write/Edit/Bash tool calls, outputs (up to 6,000 characters per command), errors, final reports. |
| `data/curation.json` | **Inferred.** Activity titles and summaries, and Arabic stage names. |
| `data/journal-data.js` | Generated bundle loaded by the page: the history, the curation, and the current repository files, workflow, registry, prompts and ADRs. Do not edit it by hand. |
| `tools/extract-history.js` | Transcript → `data/session-history.json` |
| `tools/build-data.js` | History + curation + repository → `data/journal-data.js`, plus build-time checks |
| `tools/validate.js` | Validates the page, the data and every data reference |

## Rebuild

From the repository root (Node.js, no dependencies):

```
node reports/qa-journal/tools/extract-history.js "<path to the session .jsonl>"
node reports/qa-journal/tools/build-data.js
node reports/qa-journal/tools/validate.js "<path to the session .jsonl>"
```

The session transcript is Claude Code's local history file. It sits outside this
repository, under `~/.claude/projects/<project-folder>/<session-id>.jsonl`.
`data/session-history.json` is the committed extract, so the page and
`build-data.js` work without it. Re-run `build-data.js` after any repository change,
or `validate.js` reports the data as stale.

## Reusing the journal formats

When QA tasks start running, their events follow
`platform/schemas/journal-event.schema.json`. This page does not render those yet,
because none exist. The stage, prompt and validation concepts it shows map
directly onto the runtime event fields. See
[`docs/architecture/ai-qa-execution-journal.md`](../../docs/architecture/ai-qa-execution-journal.md).
