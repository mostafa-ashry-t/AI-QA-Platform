---
name: test-review
description: Test Review stage of the AI QA Platform (mandatory, ADR-001). Reviews the exact approved TestCases.md version against the task's APPROVED ProjectContext.md and APPROVED ExplorationReport.md for missing coverage, duplicates, unclear steps, invalid expected results, missing preconditions, unsupported assumptions, traceability errors and flag inconsistencies. Classifies every finding as Advisory (non-blocking) or Change Required (blocks approval), and records each proposed change with its reason. Never modifies test cases. Produces platform/tasks/<task-name>/test-review/TestReview.md, bound by SHA-256 to the reviewed TestCases.md. Review only, with no browser, no Playwright MCP, no execution and no automation. Then HARD STOPS until the exact standalone key TEST_REVIEW_APPROVED, which is accepted only when no Change Required finding is open. Use when asked to "review the test cases", "check the test design", "re-review after the test design revision", or "revise the test review".
---

# Test Review

## Stage Identity

| Field | Value |
|---|---|
| Skill | `test-review` |
| Skill version | `1.0.0` |
| stage_id | `test-review` (ordering is owned by the workflow, not this skill) |
| Mandatory | **Yes** ([ADR-001](../../../docs/architecture/decisions/ADR-001-mandatory-test-review.md)). No task reaches `manual-execution` or `automation-generation` without a current `TEST_REVIEW_APPROVED`. |
| Prompt | [`.claude/prompts/test-review.md`](../../prompts/test-review.md). `prompt_id: test-review`, `prompt_version: 1.0.0` |
| Output structure | [`TestReview.template.md`](TestReview.template.md) |
| Journal event template | [`journal-event.template.json`](journal-event.template.json) |
| Journal schemas | [`journal-event.schema.json`](../../../platform/schemas/journal-event.schema.json) (v1.5.0), [`prompt-record.schema.json`](../../../platform/schemas/prompt-record.schema.json), [`workflow-run.schema.json`](../../../platform/schemas/workflow-run.schema.json) |
| Upstream | `test-design` (`TEST_DESIGN_APPROVED`), which rests on `exploration`, `project-context` and `prd-generation` approvals |
| Downstream | `manual-execution` and `automation-generation`. Both require the **same** current `TEST_REVIEW_APPROVED`. |
| Approval key | `TEST_REVIEW_APPROVED` |
| MCP | **Not used.** Playwright MCP is never called. |

```
APPROVED TestCases.md (exact SHA-256) + APPROVED ProjectContext.md + APPROVED ExplorationReport.md
        ↓
   TEST REVIEW (8 checks per case and per source → findings → classification)
        ↓
   TestReview.md = binding + per-case review + source coverage verification
                   + findings (Advisory | Change Required) + proposed changes + resolution tracking
        ↓
   ⛔ HARD STOP → HUMAN REVIEW
        ├─ open Change Required → test-design revision → TEST_DESIGN_APPROVED → re-review (new hash)
        └─ none open → TEST_REVIEW_APPROVED → Manual Execution → Automation Generation (same approval)
```

## Purpose

Give the test design an independent, evidence-based check before any case is
executed or automated. Execution and automation both trust TestCases.md as their
contract. This stage makes sure that contract is **complete, executable,
grounded in approved sources, and internally consistent**, and that the human
approves **exactly one, identified version** of it.

This is a **review** stage. It does not edit test cases, design new cases,
execute tests, open a browser, use Playwright MCP, generate automation code, or
create bug reports.

## Separation of concerns

| Concept | For this stage |
|---|---|
| **Skill** (this file) | *How* the review is performed, classified, bound, gated, revised and journaled. |
| **Prompt** (`.claude/prompts/test-review.md`) | The versioned *instruction*. Recorded by id and version, with the verbatim text in `prompts.json`. |
| **Workflow** (`default-qa-workflow.yaml`) | *When* the stage runs. It requires a current `TEST_DESIGN_APPROVED`, and `TEST_REVIEW_APPROVED` unlocks `manual-execution` and `automation-generation`. |
| **Journal** (`journal/*.json`) | *What actually happened*: binding hashes, checks, findings, classifications, resolutions, gate replies. |
| **Artifact** (`test-review/TestReview.md`) | *What was produced*. This is the only artifact. |
| **TestCases.md** | The **reviewed artifact**. It is read only and never modified here. |

## Trigger Conditions

Run when a human, or the orchestration layer, asks to review, re-review, or
revise the review of a **named task**. If no task is named, ask. Never guess a
task.

A re-review is required whenever the reviewed TestCases.md changes (a
`test-design` revision followed by a new `TEST_DESIGN_APPROVED`). The skill never
starts itself, and never starts `test-design`.

## Prerequisites

Check all of these, in order, before reviewing anything:

| # | Prerequisite | Failure |
|---|---|---|
| 1 | `platform/tasks/<task-name>/` exists and is not under `platform/templates/` | `TR-E01` / `TR-E02` |
| 2 | `context/TaskContext.md` exists | `TR-E03` |
| 3 | `prd/PRD.md` exists, and its `PRD_APPROVED` is still current | `TR-E04` |
| 4 | `context/ProjectContext.md` exists | `TR-E05` |
| 5 | A `project-context` `approval_decision` with `approval_outcome: accepted` exists in the active run, and it is **current**: the post-approval hash equals the current file, and no later `project-context` `stage_execution` exists | `TR-E06` / `TR-E07` |
| 6 | `exploration/ExplorationReport.md` exists | `TR-E08` |
| 7 | An `exploration` `approval_decision` with `approval_outcome: accepted` exists in the active run, and it is **current** | `TR-E09` / `TR-E10` |
| 8 | **The approved exploration matches the current approved ProjectContext**: the `exploration` `stage_execution` that produced the approved report recorded a ProjectContext SHA-256 equal to the current approved hash | `TR-E11` |
| 9 | `test-design/TestCases.md` exists and is **not** the template placeholder | `TR-E12` |
| 10 | A `test-design` `approval_decision` with `approval_outcome: accepted` (`TEST_DESIGN_APPROVED`) exists in the active run | `TR-E13` |
| 11 | **Test Design approval is current**: the post-approval hash equals the current TestCases.md, and no later `test-design` `stage_execution` exists | `TR-E14` |
| 12 | **The approved test design matches the current approved upstream**: the `test-design` `stage_execution` that produced the approved version recorded ProjectContext and ExplorationReport SHA-256 values equal to the current approved ones | `TR-E15` |
| 13 | `journal/workflow-run.json` → `active_run_id` is non-null. It is owned by orchestration, and this skill never creates it | `TR-E16` |

If any prerequisite fails:

- do not review anything, and do not create or modify TestReview.md,
- do not use Playwright MCP,
- append a `stage_execution` event with `status: blocked` (MCP not used, with
  the reason),
- report and STOP.

## Inputs

| Input | Path | Use |
|---|---|---|
| **Approved TestCases.md** | `test-design/TestCases.md` | **The reviewed artifact.** Hashed at the start and at the end of the review; the two hashes must be equal. Read only. |
| **Approved ProjectContext** | `context/ProjectContext.md` | **Documented** scope and rules: `PC SA`, `PC BR`, `PC EB`, `PC DEP`, `PC RK`, `PC AS`, `PC GAP`, `PC OQ`, roles, out of scope |
| **Approved ExplorationReport** | `exploration/ExplorationReport.md` | **Observed** behavior: `OBS` (with class), `FND`, `XGAP`, `XQ`, `PB`, `XDEP`, `EVD`, coverage limits (§13) |
| TaskContext.md | `context/TaskContext.md` § Identity | **Identity only** |
| PRD | `prd/PRD.md` | `PRD FR-###` etc., only to verify traceability chains |
| Approvals and producing events | `journal/execution-log.json` | Prerequisites 3, 5, 7, 8, 10–12, and the binding |
| Run context | `journal/workflow-run.json` | `active_run_id`, read only |
| Prompt | `.claude/prompts/test-review.md` | Loaded, hashed and recorded |
| Previous artifact | `test-review/TestReview.md` | On re-reviews and revisions only, to carry finding IDs and resolution history |

Candidate locators in the ExplorationReport are **not** reviewed here. They
belong to automation.

## Outputs

| Kind | Path | Notes |
|---|---|---|
| **Artifact** (exactly one) | `test-review/TestReview.md` | Created on attempt 1, replacing the template placeholder, and updated in place on every later attempt. |
| Journal | `journal/execution-log.json`, `journal/prompts.json` | Events and the prompt snapshot. |

**Template placeholder:** a task copied from the template contains
`test-review/TestReview.md` with the marker
`<!-- AI-QA-PLATFORM:PLACEHOLDER test-review/TestReview.md -->`. A file carrying
that marker is treated as **absent**. It is replaced, and the journal records
`operation: created`. A `TestReview.md` without the marker and without a journaled
`test-review` origin is never overwritten (`TR-E19`).

Nothing else is created or modified. **TestCases.md, ProjectContext.md,
ExplorationReport.md, PRD.md and TaskContext.md are never written.**

## Responsibilities

- **Bind** the review to the exact reviewed artifact: TestCases.md path, version
  and SHA-256, the `TEST_DESIGN_APPROVED` event, and the `test-design` execution
  event that produced it. Also bind the ProjectContext and ExplorationReport
  hashes and approval events the review validated against.
- **Review every active test case** against all eight checks (next section).
  Withdrawn cases are listed, not reviewed.
- **Verify source coverage** independently of the TestCases.md matrix: every
  applicable `PC BR` and `PC EB`, and every FINDING, POTENTIAL BUG, GAP and
  QUESTION observation, must have a covering case, a TQ, or a `CG-###` in
  TestCases.md. A matrix claim that a case covers a source is checked against
  the case's actual steps and expected result.
- **Record each problem as a finding** (`TR-###`) with its classification,
  category, affected cases or sources, basis, **proposed change** and
  **reason**.
- **Never modify test cases.** Proposed changes are recommendations for a
  `test-design` revision. They are never applied here, partially or silently.
- **Re-assess every earlier finding** on a re-review against the new
  TestCases.md version.
- State explicitly what was checked, and what could not be checked and why.

## Non-Responsibilities

This stage never does any of the following:

- Edit, add, remove, renumber or re-flag test cases, or write any file in
  `test-design/`. Not even to fix a typo.
- Design replacement cases. A proposed change describes *what* must change and
  *why*. The full rewrite belongs to `test-design`.
- Open a browser, use Playwright MCP, or explore the live application. A doubt
  that needs live observation becomes a finding or an open question.
- Execute test cases, report pass or fail results, create bug reports, or
  confirm a POTENTIAL BUG.
- Generate automation or code (Playwright Test, TypeScript, Selenium, SHAFT,
  Java, TestNG, Maven, scripts), or choose an automation framework.
- Modify ProjectContext.md, ExplorationReport.md, PRD.md, TaskContext.md,
  `workflow-run.json`, or the template.
- Resolve open questions on the business's behalf, or downgrade or withdraw a
  Change Required finding on its own.
- Start `test-design`, `manual-execution` or `automation-generation`, or create a
  `workflow_run_id`.

## Source-of-Truth Rules

| Source | Meaning for the review |
|---|---|
| **ProjectContext** | Documented scope and business rules: the standard expected results are judged against |
| **ExplorationReport** | Observed behavior: which UI, flows, data and limits are established, and which behavior is known to diverge (FINDING) |
| **TestCases.md** | The artifact under review, never a source of truth about the application |

- A finding is valid only if it is grounded in an approved source, or in
  TestCases.md's own internal consistency. Cite the source IDs or TestCases
  sections every time.
- **The reviewer never invents application behavior.** If an approved source
  does not establish what the right expected result is, the finding says so.
  The proposed change is then "mark Exploratory / raise TQ", never a guessed
  expected result.
- The test-design Expected Result Rules (`.claude/skills/test-design/SKILL.md`)
  are the standard for judging expected results. Re-read them; do not restate
  them from memory.

## Review Checks

Every active case is checked against all eight categories. Every applicable
upstream source is checked for coverage.

| # | Category (`category`) | What is checked | Typically Change Required when | Typically Advisory when |
|---|---|---|---|---|
| 1 | `missing_coverage` | An applicable `PC BR`/`PC EB`, a FINDING/POTENTIAL BUG observation, a documented or discovered dependency (`PC DEP`/`XDEP`), or an Exploration §13 limit has no covering case, TQ or `CG`. A matrix claim the case does not actually exercise. An applicable coverage type marked not applicable without a reason. | The source has neither a case nor a `CG`, or a matrix claim is false. | A `CG` exists, but an established, testable case could reasonably close it. |
| 2 | `duplicate` | Two or more active cases with the same preconditions, data partition, steps and expected outcome, adding no distinct coverage. | The duplicates **contradict** each other (same conditions, different expected results). | They are consistent; consolidation is suggested. |
| 3 | `unclear_step` | A step that is ambiguous, not ordered, missing a concrete value or `DATA-###`, or uses a screen, field, control or flow not established by ProjectContext or approved exploration. | Two testers could perform it differently, or it cannot be performed as written. | Wording could be clearer, but the action is unambiguous. |
| 4 | `invalid_expected_result` | No approved basis; contradicts ProjectContext; uses FINDING-observed behavior as the expectation; contains more than one expectation; a `Not established` case not typed Exploratory or not linked to a `TQ`; an Exploratory case whose expected result is not exactly `Not established by approved requirements.` | Always, when any of these is present. | Never. A wording nit that does not change the expectation is `unclear_step`. |
| 5 | `missing_precondition` | The case needs a state, role, record or data item its preconditions do not set up, or it depends on another case running first. | The case cannot pass or fail reliably without it, or depends on execution order. | The precondition is implied by an established flow but should be stated. |
| 6 | `unsupported_assumption` | The case relies on an assumption, limit, state, transition, role or value that no approved source supports, or on a `PC AS` still `Unconfirmed` without saying so. | The assumption decides the expected result or the steps. | It only affects priority or wording. |
| 7 | `traceability_error` | A cited source ID does not exist upstream; the two traceability directions disagree; §11 counts do not match §4; an exploratory case lacks its `OBS`/`TQ`; a FALSE Valid in Scope lacks its `CG`. | A source ID is invented or missing, or a count is wrong. | A reference is incomplete but the link can be inferred unambiguously. |
| 8 | `flag_inconsistency` | Valid in Scope or Needs Automation violates the test-design rules: Needs Automation TRUE on an Exploratory, `Not established`, non-deterministic or out-of-scope case; Valid in Scope TRUE on a case that depends on excluded functionality; a flag without a reason. | Always, because the flags drive the execution and automation filters. | Never. |

A category with nothing to check (e.g. no Exploratory cases) is reported as not
applicable, with the reason.

## Finding Classification

Every finding is exactly one of:

| Classification | Meaning | Effect on approval |
|---|---|---|
| **Change Required** | Left unresolved, the finding would make an execution or automation result untrustworthy, or it violates a platform rule (CLAUDE.md principles 3–4, 7–8, or the test-design Expected Result Rules). | **Blocks** `TEST_REVIEW_APPROVED` while `open`. |
| **Advisory** | An improvement that does not change how a case is performed or judged. | Does **not** block approval. It stays visible in TestReview.md, the journal and the approval event. |

Rules:

- Apply the "Typically Change Required when" column first. If any of its
  conditions hold, the finding is **Change Required**. That column is a floor:
  the reviewer may also raise other findings as Change Required, with the
  reason.
- If the reviewer is unsure whether a result could become untrustworthy, the
  finding is **Change Required**, and the reason states the doubt.
- **Only a human can withdraw a Change Required finding or downgrade it to
  Advisory**, through a `revision_request` on this stage. The next attempt
  records the change in the finding's `classification_history` or `resolution`,
  citing that journal event. The skill never downgrades on its own.
- Upgrading Advisory to Change Required on a re-review is allowed, and recorded
  in `classification_history` with the reason.

## Proposed Changes

Each finding carries a proposed change and its reason:

- **What** must change, and in which case or section. For example: "TC-007
  Expected Result: replace with `Not established by approved requirements.`,
  type Exploratory, Needs Automation FALSE, add TQ".
- **Why**, citing the approved source or the test-design rule it violates.
- **Never** a full replacement case, never applied to TestCases.md, and never an
  expected result that the approved sources do not establish.

## Resolution

| Finding status | Meaning | How it is reached |
|---|---|---|
| `open` | Not yet resolved | Initial state |
| `resolved` | The proposed change (or an equivalent fix) is present in a **later approved** TestCases.md version | Verified on a re-review. `resolution.method: test_design_revision`, citing the TestCases version and its `TEST_DESIGN_APPROVED` event |
| `withdrawn` | The human decided the finding does not apply | `resolution.method: reviewer_decision`, citing the human's `revision_request` event on this stage |

- Change Required findings are resolved **only** through a `test-design`
  revision (TestCases.md updated in place, `TEST_DESIGN_APPROVED` again), or
  withdrawn or downgraded by a human decision. They are never resolved inside
  this stage.
- A re-review **re-runs every check over the whole new TestCases.md**, not just
  the diff, because the approval binds to the whole file. Earlier findings are
  each re-assessed: `resolved` (with what was verified), still `open`, or newly
  affected cases noted. New findings take the next unused `TR-###`.
- Advisory findings may stay `open` at approval. The approval event lists them.

## Approval Binding and Staleness

The review binds to (and records in TestReview.md §1 and the journal
`review_binding`):

| Bound item | Recorded |
|---|---|
| Reviewed TestCases.md | path, version, SHA-256, `TEST_DESIGN_APPROVED` event, producing `test-design` event |
| ProjectContext.md | path, version, SHA-256, `PROJECT_CONTEXT_APPROVED` event |
| ExplorationReport.md | path, version, SHA-256, `EXPLORATION_APPROVED` event |

A `TEST_REVIEW_APPROVED` approval is **current** only while all of these hold.
Otherwise it is **stale**, and every downstream stage must reject it:

| # | Stale when | Typical cause |
|---|---|---|
| S1 | The current TestReview.md SHA-256 differs from the approval's post-approval hash | TestReview.md edited after approval |
| S2 | A later `test-review` `stage_execution` exists in the run | Re-review or revision after approval |
| S3 | The current TestCases.md SHA-256 differs from `review_binding.reviewed_test_cases.sha256` | TestCases.md edited after the review |
| S4 | The bound `TEST_DESIGN_APPROVED` is no longer current (hash mismatch, or a later `test-design` `stage_execution`) | Test design revised |
| S5 | The current approved ProjectContext or ExplorationReport SHA-256 differs from the bound one, or their approvals are no longer current | Upstream revised and re-approved |

A change of the `test-review` skill or prompt version does **not** by itself
make an approval stale. The approval certifies artifact versions, not tool
versions. The versions used are recorded in every event, so the HTML journal
shows them.

## Validation Rules (self-checks before presenting)

| Check | Rule |
|---|---|
| TR-V01 | All prerequisites (1–13) were verified before any review work. |
| TR-V02 | All 9 sections are present, in order. Empty sections say "None." |
| TR-V03 | The binding is complete (TestCases, ProjectContext and ExplorationReport path, version, SHA-256 and approval events), and matches the hashes computed at the start. |
| TR-V04 | Every active case appears in §4 with a result for each of the 8 checks. Withdrawn cases are listed as not reviewed. |
| TR-V05 | All 8 categories were performed and reported in §3. Not-applicable categories state the reason. |
| TR-V06 | Every finding has an ID, classification, category, affected cases or sources, basis, proposed change, reason and resolution status. |
| TR-V07 | Classification follows the rules: no "Change Required when" condition is classified Advisory. Every downgrade or withdrawal cites a human journal event. |
| TR-V08 | Every cited upstream ID exists upstream. No invented source IDs, expected results or application behavior. |
| TR-V09 | **TestCases.md was not modified**: its SHA-256 at the end equals the reviewed hash. ProjectContext.md and ExplorationReport.md hashes are unchanged. |
| TR-V10 | §5 lists every applicable `PC BR` and `PC EB`, and every FINDING, POTENTIAL BUG, GAP and QUESTION observation, with a verified result. |
| TR-V11 | On a re-review, every earlier finding was re-assessed against the new version. `TR` IDs are preserved, never renumbered or reused. |
| TR-V12 | §9 counts equal the §6 findings. The review outcome is `changes_required` exactly when at least one Change Required finding is open. |
| TR-V13 | No execution results, bug reports, automation code, browser or MCP usage, secrets or real credentials appear. |
| TR-V14 | Exactly one `TestReview.md` exists, with no `-v2` or `-final` copies. |
| TR-G01 | (gate) The reply is exactly `TEST_REVIEW_APPROVED`, standalone. |
| TR-G02 | (gate) No Change Required finding is `open` in the current TestReview.md. |
| TR-G03 | (gate) The review is still current at the moment of the reply (S1–S5 above, with S1/S2 checked against the latest `stage_execution` output). |

If a check fails because of the review artifact, correct it and record the
correction in `fixes`. If it fails because of the inputs, record a finding or an
open question. Never pass a check by inventing content. TR-V09 failing means
something modified TestCases.md during the review: stop, record the error, and
present nothing as reviewed.

## Failure Conditions

Every failure below results in `status: blocked`, with MCP not used. No
TestReview.md is written or modified.

| Code | Condition |
|---|---|
| TR-E01 / E02 | Task folder missing / target is the template |
| TR-E03 | TaskContext.md missing |
| TR-E04 | PRD.md missing, or its approval stale |
| TR-E05 | ProjectContext.md missing |
| TR-E06 / E07 | ProjectContext not approved / approval stale |
| TR-E08 | ExplorationReport.md missing |
| TR-E09 / E10 | Exploration not approved / approval stale |
| TR-E11 | The approved exploration was performed against a different ProjectContext version |
| TR-E12 | TestCases.md missing, or still the template placeholder |
| TR-E13 | Test Design not approved with `TEST_DESIGN_APPROVED` in the active run |
| TR-E14 | Test Design approval stale (TestCases.md changed, or a later `test-design` run exists) |
| TR-E15 | The approved test design was produced against a different ProjectContext or ExplorationReport version |
| TR-E16 | No active workflow run (event `workflow_run_id: null`). A run ID is never created. |
| TR-E17 | Prompt file missing, or `prompt_id`/`prompt_version` unreadable |
| TR-E18 | Same `prompt_id`/`prompt_version` recorded with a different SHA-256 |
| TR-E19 | `TestReview.md` exists without the placeholder marker and without a journaled `test-review` origin (never overwritten) |
| TR-E20 | Journal file missing or invalid JSON. Nothing is recreated silently. If the artifact was already written, state that the run is **not journaled**. |

TR-V09 failing during a review is recorded as `status: failed` (the stage started
but could not complete), not `blocked`.

## Revision and Re-Review Behavior

There are two ways the review changes. Both update the **same** TestReview.md.

**A. Re-review after a test-design revision** (the reviewed TestCases.md changed):

1. Re-check all prerequisites. A new, current `TEST_DESIGN_APPROVED` is required.
2. Re-bind to the new TestCases.md version and hash.
3. Re-run all checks over the whole file, re-assess every earlier finding, and
   raise new ones with the next unused IDs.
4. Bump the minor version, add a Revision History row (reason: "Re-review of
   TestCases vX.Y.Z", findings resolved, still open, added), and reset Status.
5. Append a `stage_execution` event whose `revision` records the versions, reason,
   `changed_sections`, `items_added`, `items_modified` and `items_removed`.
   `revision_request_event_id` is `null` unless a `test-review` change request
   also exists.

**B. Revision of the review itself** (the human disputes, withdraws or
downgrades a finding, or asks for clarification), with TestCases.md unchanged:

1. Append a `revision_request` event with the verbatim request.
2. Re-check prerequisites. The binding must still be current; if TestCases.md
   changed, do a re-review (A) instead.
3. Apply only what the human decided. Cite the event in the finding's
   `resolution` or `classification_history`. Never extend a human decision to
   other findings.
4. Bump the minor version, add a Revision History row, and reset Status.
5. If the prompt version changed, register it and set
   `revision.prompt_version_changed: true`.
6. Append a `stage_execution` event with the `revision` object.

In both cases, present the result and **STOP**. `TEST_REVIEW_APPROVED` is required
again. **Changing an approved TestReview.md voids its approval.**

## Hard-Stop Behavior

After TestReview.md is written (initial, re-review or revision):

- **STOP.** Present the review: the binding, finding counts by classification
  and category, every open Change Required finding with its proposed change, the
  Advisory findings, and open questions.
- With open Change Required findings, state plainly that the review **cannot be
  approved yet**, and that the path forward is a `test-design` revision (or a
  human decision to withdraw or downgrade specific findings).
- Do **not** edit TestCases.md, execute any case, open a browser, generate
  automation, create bugs, or start any other stage.
- The gate is unconditional.

## Approval Gate

- The only valid progression key is the **exact, case-sensitive, standalone**
  value:

  ```
  TEST_REVIEW_APPROVED
  ```

- **Invalid:** `approved`, `looks good`, `continue`, `proceed`, `LGTM`,
  `TEST_REVIEW_APPROVED please continue`, any message containing the key with
  other text, silence, `TEST_DESIGN_APPROVED`, or another stage's key. Each is
  journaled as an `approval_decision` with `not_accepted`, and the stage remains
  stopped. A message that also contains a change request proceeds to revision.
- **The exact key is still not accepted** when:
  - any Change Required finding is `open` (TR-G02). The decision records the
    open finding IDs, and the human is told what must be resolved, or
  - the review is no longer current (TR-G03), e.g. TestCases.md changed after
    the review. The decision states that a re-review is required.
- **When accepted:**
  - set Status to `Approved`, with the version unchanged,
  - append an `approval_decision` (`accepted`, `next_stage.unlocked: true`)
    carrying the **post-update SHA-256** of TestReview.md, the full
    `review_binding`, and the open Advisory findings,
  - report that `manual-execution` is unlocked, and that `automation-generation`
    also needs this **same** approval to be current, plus
    `MANUAL_EXECUTION_APPROVED`.
- The skill **never** starts Manual Execution or Automation Generation. The
  orchestration layer decides when the next stage starts.

## Downstream Contract

`manual-execution` (prerequisites 15–16, `ME-E23`/`ME-E24`) and the future
`automation-generation` verify, from the journal alone:

1. an accepted `test-review` `approval_decision` exists in the active run,
2. it is current (S1–S5),
3. for `automation-generation`, it is the **same** approval event that the
   approved manual execution referenced.

The `approval_decision.review_binding.reviewed_test_cases.sha256` is the hash
they compare with the current TestCases.md. `manual-execution` already checks S5
through its own prerequisite 10 (ProjectContext and ExplorationReport currency,
and the test-design baseline).

## Journal Integration

Use the existing journal only:

- `journal/execution-log.json` (events, schema v1.5.0)
- `journal/prompts.json` (prompt records)

The stage's constant values are in
[`journal-event.template.json`](journal-event.template.json).

| Moment | Event type | Status |
|---|---|---|
| Prerequisite not met | `stage_execution` | `blocked` |
| TestCases.md changed during the review (TR-V09) | `stage_execution` | `failed` |
| TestReview.md written (each attempt) | `stage_execution` | `awaiting_approval` |
| Change requested | `revision_request` | `revision_requested` |
| Reply is the key, no open Change Required, review current | `approval_decision` | `approved` |
| Any other reply, or the key with open Change Required or a stale review | `approval_decision` | `approval_not_accepted` |

Field rules (`stage_execution`):

- **Identity:**
  - `event_id` / `step_number` are the next in sequence.
  - `attempt` counts this stage's executions within the run.
  - `workflow_run_id` is **read** from `workflow-run.json`, never created. It is
    `null` only on TR-E16.
  - Also record `task_id` and `timestamp` (system clock, UTC), plus the stage and
    skill identity and versions.
- **Prompt:**
  - `prompt_id` / `prompt_version` reference `prompts.json`.
  - On first use in the task, append the verbatim content, SHA-256,
    `captured_at` and `first_used_by_event_id`.
  - Later events reference it without duplicating the text.
  - `prompt_variables` records `task_name`, `task_path` and `workflow_run_id`.
- **`trigger`**: the reason and the verbatim user message.
- **`input_references`**:
  - TestCases.md (`upstream_artifact`, the **reviewed** SHA-256) and its
    `TEST_DESIGN_APPROVED` (`upstream_approval`)
  - ProjectContext.md and ExplorationReport.md (`upstream_artifact`, SHA-256) and
    their approvals
  - PRD.md (`task_prd`) and TaskContext.md (`task_metadata`)
  - the prompt
  - on re-reviews and revisions, the previous TestReview.md and the change
    request
- **`review_binding`**: the bound items above.
- **`source_references`**: TestCases, ProjectContext, ExplorationReport and PRD
  sections and IDs used.
- **`tools_used`**: file read, write and hash tools only.
- **`mcp_used`**: `{ used: false, servers: [], intentionally_not_used: [{ server: "playwright", reason: "Test Review operates on approved artifacts only and does not require live browser access." }] }`.
  The HTML journal shows **MCP: Not used**, with that reason.
- **`actions`**, **`decisions`**: checks run, classification calls (with the
  rule applied), and re-assessments.
- **`reviewed_test_case_ids`**: every active case reviewed.
- **`review_findings`**: every finding (`TR-###`), including resolved and
  withdrawn ones, with classification, category, cases, sources, basis,
  proposed change, reason, status, resolution and classification history.
- **`review_outcome`**: `changes_required` or `ready_for_approval`.
- **`coverage`** (test-review shape): cases reviewed, sources checked, findings by
  classification and category, open Change Required and Advisory counts.
- **`open_questions`**: `RQ-###`, with related cases and the required
  clarification.
- **`output_artifacts`**: TestReview.md (operation, status, version, SHA-256,
  counts).
- **Also recorded:** `assumptions`, and `gaps` (empty; review gaps are findings).
- **`validation.checks`**: TR-V01…V14 with their real results.
- **Gate fields:**
  - `status`
  - `stop_reason`
  - `approval_required: true`
  - `approval_key: "TEST_REVIEW_APPROVED"`
  - `approval_outcome` (`null` except on `approval_decision`)
  - `next_stage` (`manual-execution`, unlocked only after an accepted approval;
    the condition also names `automation-generation`)
- **Also recorded:** `errors`, `fixes`, `revision` (`null` on attempt 1) and
  `notes`. `evidence` is empty: a review produces no evidence, and upstream `EVD`
  items are referenced through sources.
- **Never fabricate** runtime values. If a value is unavailable, use `null` and
  explain it in `notes`.

## HTML Journal Observability

The future interactive HTML journal must be able to show all of the following for
this stage, from the journal plus TestReview.md, without rerunning anything:

| # | Shown | From |
|---|---|---|
| 1 | Why Test Review ran (first review, re-review, revision) | `trigger.reason` |
| 2 | Triggering message | `trigger.user_message` |
| 3 | Exact prompt version | `prompt_id`/`prompt_version` → `prompts.json` content |
| 4 | Exactly which TestCases.md was reviewed | `review_binding.reviewed_test_cases` (version, hash, approval event) |
| 5 | ProjectContext and ExplorationReport validated against | `review_binding.project_context`, `review_binding.exploration_report` |
| 6 | Workflow Run ID | `workflow_run_id` |
| 7 | Cases reviewed | `reviewed_test_case_ids` → TestReview.md §4 |
| 8 | Checks performed | `coverage.by_category`, `validation.checks` → TestReview.md §3 |
| 9 | Findings, with classification and category | `review_findings[]` |
| 10 | Proposed change and reason per finding | `review_findings[].proposed_change`, `.reason` |
| 11 | Which findings block approval | `review_findings[]` where Change Required and `open` |
| 12 | Resolution history across versions | `review_findings[].resolution`, `.classification_history`, TestReview.md §8 |
| 13 | Source coverage verification | TestReview.md §5, `coverage.sources_without_coverage` |
| 14 | Open questions | `open_questions[]` |
| 15 | Review outcome | `review_outcome` |
| 16 | Validation results | `validation.checks` |
| 17 | Why the stage stopped | `stop_reason`, `status` |
| 18 | `TEST_REVIEW_APPROVED` requirement | `approval_key` |
| 19 | Approval result, and why a key was refused | `approval_decision` events → `approval_outcome`, `validation.checks` (TR-G01–G03) |
| 20 | Revisions and re-reviews | `revision_request` events, `revision` |
| 21 | Errors and fixes | `errors`, `fixes` |

**Navigation paths:**

- **Test Case → Findings → Proposed Change → Resolution → TestCases version**:
  `reviewed_test_case_ids` → `review_findings[].test_case_ids` →
  `proposed_change` → `resolution.reference` → the `test-design` events.
- **Source → Coverage verification → Finding**: TestReview.md §5 →
  `review_findings[]` where `category: missing_coverage`.
- **Approval → Binding → Downstream**: `approval_decision.review_binding` → the
  `manual-execution` event's `upstream_approval` input reference.
