---
adr_id: ADR-001
title: Test Review is a mandatory workflow stage
status: accepted               # decision accepted by the user; approval key TEST_REVIEW_APPROVED was proposed here and confirmed later (see §10 Follow-up)
decided_by: user
recorded_at: 2026-10-12T09:30:01Z   # system clock (UTC) when this record was written
scope: platform                # platform-level change, not a task; no task journal exists, so no journal events were written
implementation_prompt:
  path: docs/architecture/decisions/ADR-001/implementation-prompt.md
  sha256: e34f3c70e908a9f7421abcee72740309cd33fa8f24650f66f27da4a8330ccc91
  note: Verbatim transcription of the user's request. The hash is of the stored file.
workflow_version: { before: 0.6.0, after: 0.7.0 }
registry_version: { before: 0.6.0, after: 0.7.0 }
journal_event_schema: { before: 1.4.0, after: 1.4.0, changed: false }
---

# ADR-001 — Test Review is a mandatory workflow stage

> This is an architecture decision record for a **platform** change. It is not a
> task journal: no task exists, and no `execution-log.json` events were created or
> fabricated. Its structure (front matter plus fixed sections) is intended to be
> readable by the future bilingual HTML Journal. That HTML page does not exist yet.

## 1. User decision

> Record and implement the architecture decision that **Test Review is a mandatory
> workflow stage** before both Manual Execution and Automation Generation.

The full prompt is stored verbatim in
[`ADR-001/implementation-prompt.md`](ADR-001/implementation-prompt.md)
(SHA-256 `e34f3c70…cc91`).

## 2. Context (verified before editing)

| Fact (as found) | Location |
|---|---|
| `test-review` was `optional: true`, `on_mandatory_path: false`, with no gate | `platform/workflows/default-qa-workflow.yaml` (v0.6.0) |
| `TEST_DESIGN_APPROVED` unlocked `manual-execution` directly | same file, test-design `gate.unlocks` |
| `manual-execution` depended on, and required approval of, `test-design` | same file |
| `automation-generation` required only `MANUAL_EXECUTION_APPROVED` | same file |
| CLAUDE.md principle 6 already said "`test-review` gates all execution", which conflicted with the workflow | `CLAUDE.md` |
| Approval-key convention: `<STAGE_ID uppercased, - → _>_APPROVED`, with one exception (`PRD_APPROVED` for prd-generation) | workflow gates, CLAUDE.md gate table |
| Approval currency is checked with post-approval SHA-256 in `approval_decision.output_artifacts`, plus "no later `stage_execution`" | `docs/architecture/ai-qa-execution-journal.md` |

## 3. Decision

1. `test-review` is a **mandatory** stage, order 5, between `test-design` and
   `manual-execution`.
2. `TEST_DESIGN_APPROVED` now unlocks **only** `test-review`.
3. `test-review` has a hard-stop gate, with the **proposed** key
   `TEST_REVIEW_APPROVED`, which follows the existing convention. It unlocks
   **both** `manual-execution` and `automation-generation`.
4. `manual-execution` requires a current `TEST_REVIEW_APPROVED`. This holds even
   if approved test cases already exist (`approval_policy.no_bypass: true`).
5. `automation-generation` requires `TEST_REVIEW_APPROVED` **and**
   `MANUAL_EXECUTION_APPROVED`, and the review approval must be the **same** one the
   approved manual execution used (`same_review_as: manual-execution`).
6. **Review contract.** This is documented in the workflow; the skill is not
   implemented yet.
   - **Validates against:** the approved ProjectContext and ExplorationReport.
   - **Checks for:** missing coverage, duplicates, unclear steps, invalid expected
     results, missing preconditions, unsupported assumptions.
   - **Never modifies test cases.** Proposed changes are recorded with their
     reasons.
   - **Resolution path:** requested changes go through a test-design revision, then
     `TEST_DESIGN_APPROVED` again, then a new review.
   - **Approval** requires no unresolved requested changes.
7. **Binding.** The approval is tied to the reviewed `TestCases.md` SHA-256. It
   becomes stale when any of these happens:
   - TestReview.md changes,
   - a later review run exists,
   - the TestCases.md hash differs from the reviewed hash,
   - a later test-design run exists, or `TEST_DESIGN_APPROVED` is no longer current.

## 4. Workflow before and after

**Before (v0.6.0):**

```
test-design ──TEST_DESIGN_APPROVED──▶ manual-execution ──MANUAL_EXECUTION_APPROVED──▶ automation-generation
     └─▶ test-review (optional, off the mandatory path, no gate)
```

**After (v0.7.0):**

```
test-design ──TEST_DESIGN_APPROVED──▶ test-review (MANDATORY) ──TEST_REVIEW_APPROVED──┬─▶ manual-execution ──MANUAL_EXECUTION_APPROVED──┐
                                                                                      └──────────────(same, current approval)─────────────┴─▶ automation-generation
```

Full lifecycle:

```
Task Creation → PRD Generation → PRD_APPROVED → Project Context → PROJECT_CONTEXT_APPROVED
  → Exploration → EXPLORATION_APPROVED → Test Design → TEST_DESIGN_APPROVED
  → Test Review → TEST_REVIEW_APPROVED → Manual Execution → MANUAL_EXECUTION_APPROVED
  → Automation Generation → Automation Execution → Self-Healing (when needed) → Reporting
```

## 5. Effect on Manual Execution and Automation Generation

| Stage | Effect |
|---|---|
| **manual-execution** (skill 1.0.0 → **1.1.0**, prompt 1.0.0 → **1.1.0**) | New prerequisite 15: the review exists and is approved. New prerequisite 16: the approval is current and bound to the current TestCases.md hash. New blocked failures `ME-E23` and `ME-E24`. Journal input references now include TestReview.md and its approval event. **Practical effect:** Test Review is not implemented yet, so **no task can currently reach Manual Execution.** |
| **automation-generation** (planned, not implemented) | The workflow and registry now require `TEST_REVIEW_APPROVED` + `MANUAL_EXECUTION_APPROVED`, with the same review approval. The future skill must enforce this. |
| **test-design** (skill 1.0.0 → **1.0.1**, prompt unchanged at 1.0.0) | Downstream and `next_stage` are now `test-review`. A revision request may cite Test Review findings (`TR-###`). |

## 6. Files

**Inspected** (read before editing): `CLAUDE.md`, `README.md`,
`platform/workflows/default-qa-workflow.yaml`, `platform/registry/skills.yaml`,
`platform/schemas/{journal-event,prompt-record,workflow-run}.schema.json`, all
five implemented skills' `SKILL.md` and `journal-event.template.json`, the
`.claude/prompts/{test-design,manual-execution}.md` prompts,
`docs/architecture/ai-qa-execution-journal.md`, and
`platform/templates/task-template/` (tree).

**Created:**
- `docs/architecture/decisions/ADR-001-mandatory-test-review.md` (this file)
- `docs/architecture/decisions/ADR-001/implementation-prompt.md`
- `platform/templates/task-template/test-review/.gitkeep` (output location only, no content)

**Modified:**
- `platform/workflows/default-qa-workflow.yaml` (0.6.0 → 0.7.0)
- `platform/registry/skills.yaml` (0.6.0 → 0.7.0)
- `.claude/skills/test-design/SKILL.md`, `.claude/skills/test-design/journal-event.template.json` (1.0.1)
- `.claude/skills/manual-execution/SKILL.md`, `.claude/skills/manual-execution/journal-event.template.json` (1.1.0)
- `.claude/prompts/manual-execution.md` (1.1.0, changelog entry added)
- `CLAUDE.md`, `README.md`, `docs/architecture/ai-qa-execution-journal.md`

**Not changed:** the journal event schema (the existing `sha256` fields carry the
binding), the test-design prompt, the other skills, framework-selection content,
and orchestration.

## 7. Validation (actually executed)

A Node.js checker ran from the session scratchpad, using Ajv 8 (draft 2020-12),
ajv-formats and js-yaml. It reads project files only. Final run: **38/38 passed.**

| ID | Check | Result |
|---|---|---|
| V01 | All 3 schemas compile | PASS |
| V02 | Event schema unchanged (enum 1.2.0/1.3.0/1.4.0) | PASS |
| V03 | All 19 event-template variants (5 skills) validate (synthetic in-memory fill) | PASS |
| V04 | Implemented set unchanged (5). test-review still planned, with no SKILL.md or prompt | PASS |
| V05 | Registry ↔ SKILL.md ↔ prompt ↔ template ↔ workflow versions and keys consistent | PASS |
| V06 | test-design 1.0.1 (prompt 1.0.0); manual-execution 1.1.0 (prompt 1.1.0 + changelog) | PASS |
| V07 | test-design prompt not modified (mtime older than workflow edit) → no prompt bump needed | PASS |
| V08 | Stage order 1–10 as in the lifecycle | PASS |
| V09 | test-review mandatory, requires test-design, gate `TEST_REVIEW_APPROVED` unlocks ME + AG | PASS |
| V10 | test-design gate unlocks only test-review | PASS |
| V11 | manual-execution depends on, and requires approval of, test-review | PASS |
| V12 | automation-generation requires test-review + manual-execution, `same_review_as` | PASS |
| V13 | Graph: with test-review removed, test-design cannot reach ME or AG (no bypass) | PASS |
| V14 | Review contract: 6 checks, no test-case modification, SHA-256 binding, 4 stale conditions | PASS |
| V15 | `no_bypass: true`; run-ID rules unchanged | PASS |
| V16 | Existing 5 gates preserved, plus the new one | PASS |
| V17–V19 | manual-execution SKILL (prereqs 15/16, ME-E23/24), prompt, and template enforce the review | PASS |
| V20 | test-design SKILL and template point downstream to test-review | PASS |
| V21 | No stale "optional test-review" or "TEST_DESIGN_APPROVED unlocks manual-execution" text | PASS |
| V22 | CLAUDE.md and README consistent with the workflow | PASS |
| V23 ×13 | **Rule model** (in-memory simulation of the documented rules over synthetic journals): ME blocked with no review, a rejected review, a blocked review, an edited TestCases.md, an edited TestReview.md, a later review run, a different reviewed hash, or a later test-design run. ME allowed with a current bound review. AG blocked without ME approval, with an older review than the current one, or after TestCases.md was edited. AG allowed with the same current review plus ME approval | PASS (13/13) |
| V24 | No task, runtime artifacts or automation code | PASS |
| V25 | Template change limited to `test-review/.gitkeep`; journal containers empty | PASS |
| V26 | Framework-selection content not changed (the pre-existing conflict is still present, reported in §9) | PASS |

**Limit of V23:** it validates the **documented rules** through a reference model.
It cannot validate runtime behavior, because no skill or orchestrator executes yet.

## 8. Errors and fixes

| Error | Cause | Fix | Result |
|---|---|---|---|
| The first validation run had 36/38 pass. Two V23 "allowed" scenarios failed with "later test-design run" | **Validation-harness bug:** the synthetic test-design `approval_decision` was created before its `stage_execution`, so the approval had the lower step number | Reordered event creation in the harness. No project file changed | 38/38 PASS |

## 9. Assumptions, conflicts and open questions

**Assumptions:**
- `TEST_REVIEW_APPROVED` is the right key, because it follows the existing
  `<STAGE>_APPROVED` convention.
- The Test Review output lives at `test-review/TestReview.md`, matching the
  PascalCase artifact naming. The old planned path was `test-design/test-review.md`.
- Test Review uses no MCP (it reviews approved artifacts only). This is proposed.

**Open questions for the user:**
1. Confirm the approval key `TEST_REVIEW_APPROVED`.
2. Confirm the artifact path `test-review/TestReview.md`.
3. Should review findings support an "advisory" class that does not block
   approval, in addition to "change required"?
4. Test Review is now mandatory but unimplemented, so Manual Execution is blocked
   for every task until the `test-review` skill exists. Implement it next?

**Pre-existing conflict, reported separately and not changed by this ADR:**
- The automation framework is still contradictory. `CLAUDE.md` principle 8 and
  the workflow and registry `automation-*` descriptions say Playwright. The
  `CLAUDE.md` Tooling Rule and the exploration locator guidance say
  Selenium + SHAFT + Java + TestNG.
- The intended direction is both: Playwright Test + TypeScript, and SHAFT +
  Selenium + Java 21 + TestNG + Maven.
- This needs its own decision record (proposed ADR-002).

## 10. Follow-up: test-review skill implemented (2026-10-12T10:36:35Z)

The user's request to implement the `test-review` skill answered open questions
1–4 above:

| Question | Answer (from the user's request) |
|---|---|
| 1. Approval key | `TEST_REVIEW_APPROVED`, now confirmed rather than proposed |
| 2. Artifact path | `platform/tasks/<task>/test-review/TestReview.md`, confirmed |
| 3. Advisory class | Yes: findings are `Advisory` (non-blocking) or `Change Required` (blocks approval while open) |
| 4. Implement next | Done: `test-review` skill v1.0.0, prompt v1.0.0 |

Changes made by that implementation:

- **New skill files:** `.claude/skills/test-review/` (SKILL.md,
  TestReview.template.md, journal-event.template.json) and
  `.claude/prompts/test-review.md`.
- **Placeholder:** `platform/templates/task-template/test-review/TestReview.md`.
- **Journal schema 1.4.0 → 1.5.0**, a backward-compatible superset. It adds
  `review_binding`, `reviewed_test_case_ids`, `review_findings`,
  `review_outcome`, and a test-review `coverage` shape. This record's front matter
  still states the schema unchanged, which was true for ADR-001 itself.
- **Workflow and registry 0.7.0 → 0.8.0.** The review contract adds two check
  categories (`traceability_errors`, `flag_inconsistencies`), the finding
  classes, and a fifth stale condition: the approved ProjectContext or
  ExplorationReport hash differs from the hash bound at review time.
- **Manual Execution is unchanged.** Its prerequisite 10 already rejects a
  TestCases.md produced against an older ProjectContext or ExplorationReport, so
  it enforces the fifth stale condition transitively.

No task was created and no journal events were written.
