---
prompt_id: test-review
prompt_version: 1.0.0
skill: test-review
stage_id: test-review
approval_key: TEST_REVIEW_APPROVED
variables: [task_name, task_path, workflow_run_id]
changelog:
  - "1.0.0: Initial version (ADR-001 mandatory Test Review)."
---

# Prompt — Test Review

> Versioning rule: any change to the text of this file requires a
> `prompt_version` bump. The journal identifies the prompt used for each run by
> `prompt_id` + `prompt_version`, and stores one verbatim snapshot of each version
> with its SHA-256 in the task's `journal/prompts.json`.

## Purpose

Review the **exact approved version** of the task's test cases before anything
is executed or automated. Check them against the **approved documented scope**
and the **approved observed behavior**. Record every problem as a finding with a
proposed change and its reason. **Never modify the test cases.** This is a
**review** stage: nothing is executed.

```
approved TestCases.md (exact SHA-256) + approved ProjectContext.md + approved ExplorationReport.md
  → TestReview.md → HUMAN REVIEW → TEST_REVIEW_APPROVED (only with no open Change Required finding)
```

## Expected Inputs

| Input | Location | Role |
|---|---|---|
| Approved Test Cases | `{{task_path}}/test-design/TestCases.md` | **The reviewed artifact.** Read only. |
| Approved Project Context | `{{task_path}}/context/ProjectContext.md` | Documented scope and business rules (`PC SA/BR/EB/DEP/RK/AS/GAP/OQ-###`) |
| Approved Exploration Report | `{{task_path}}/exploration/ExplorationReport.md` | Observed behavior (`OBS/FND/XGAP/XQ/PB/XDEP-###`), coverage limits |
| Task identity | `{{task_path}}/context/TaskContext.md` § Identity | Identity only |
| PRD | `{{task_path}}/prd/PRD.md` | Traceability chains only |
| Previous review | `{{task_path}}/test-review/TestReview.md` | Re-reviews and revisions only: finding IDs and history |
| workflow_run_id | `{{workflow_run_id}}` (orchestration-owned, read only) | Header and journal |

## Prerequisites

Do not review anything unless all of the following hold:

- The task, TaskContext.md, PRD.md, ProjectContext.md, ExplorationReport.md and
  TestCases.md exist, and TestCases.md is not the template placeholder.
- ProjectContext, ExplorationReport and TestCases.md are approved with
  `PROJECT_CONTEXT_APPROVED`, `EXPLORATION_APPROVED` and `TEST_DESIGN_APPROVED`,
  and each approval is current.
- The approved exploration was performed against the current approved
  ProjectContext, and the approved test design was produced against the current
  approved ProjectContext and ExplorationReport.
- An active `workflow_run_id` exists.

Otherwise stop and report which prerequisite failed.

## Binding

Before reviewing, record the SHA-256, version and approval event of TestCases.md,
ProjectContext.md and ExplorationReport.md. Hash TestCases.md again at the end.
If the two TestCases.md hashes differ, stop: the review is invalid. The approval
of this review will apply **only** to the TestCases.md hash recorded here.

## Review Instructions

Review **every active test case** against all eight checks, and verify **every
applicable source** for coverage:

1. **Missing coverage:** every applicable PC BR and PC EB, and every FINDING,
   POTENTIAL BUG, GAP and QUESTION observation, has a covering case, a TQ or a
   coverage gap (CG). Check that each matrix claim is real: the case's steps and
   expected result actually exercise the source. Dependencies (PC DEP, XDEP) and
   Exploration coverage limits are covered or listed as gaps.
2. **Duplicates:** cases with the same preconditions, data partition, steps and
   expected outcome that add no distinct coverage.
3. **Unclear steps:** ambiguous, unordered, or missing values; or using a screen,
   field, control or flow that ProjectContext and approved exploration do not
   establish.
4. **Invalid expected results:** no approved basis; contradicts ProjectContext;
   uses FINDING-observed behavior as the expectation; more than one expectation;
   a `Not established` case not typed Exploratory or not linked to a TQ; an
   Exploratory case whose expected result is not exactly
   `Not established by approved requirements.` Judge against the test-design
   Expected Result Rules.
5. **Missing preconditions:** state, role, record or data the case needs but does
   not set up; any dependency on another case running first.
6. **Unsupported assumptions:** an assumption, limit, state, transition, role or
   value that no approved source supports, or reliance on an unconfirmed
   assumption without saying so.
7. **Traceability errors:** a cited source ID that does not exist upstream;
   disagreement between the two traceability directions; coverage counts that do
   not match the case index; missing OBS or TQ links; a FALSE Valid in Scope
   without a CG.
8. **Flag inconsistencies:** Needs Automation TRUE on an Exploratory,
   `Not established`, non-deterministic or out-of-scope case; Valid in Scope TRUE
   on a case that depends on excluded functionality; a flag without a reason.

Report each category as performed, with its count, or as not applicable with the
reason.

## Source-of-Truth Rules

- ProjectContext is documented scope and business rules. ExplorationReport is
  observed behavior. TestCases.md is the artifact under review, never a source of
  truth about the application.
- Every finding cites the approved source IDs or the TestCases sections it rests
  on. Never cite an ID that does not exist.
- **Never invent application behavior.** If the approved sources do not establish
  the right expected result, say so. The proposed change is then "mark
  Exploratory / raise a TQ", never a guessed expected result.

## Findings

Record each problem as `TR-###` with: classification, category, affected cases
or sources, basis, **proposed change** (what must change, and where), **reason**
(why, citing the source or rule), and resolution status.

- **Change Required** blocks approval. Use it whenever the problem, left
  unresolved, would make an execution or automation result untrustworthy, or
  violates a platform rule. This always includes:
  - an invalid expected result,
  - a flag inconsistency,
  - an applicable source with neither a case nor a CG, or a false matrix claim,
  - a step that two testers could perform differently or cannot perform as written,
  - a missing precondition the result depends on, or an execution-order dependency,
  - an invented source ID or a wrong count,
  - an assumption that decides the steps or the expected result,
  - duplicates that contradict each other.

  If unsure, classify Change Required and state the doubt.
- **Advisory** does not block approval. Use it for improvements that do not
  change how a case is performed or judged: clearer wording, consistent
  duplicates to consolidate, an optional extra case where a CG already
  documents the gap, a weak priority basis.
- **Never** edit TestCases.md, write a replacement case, or apply a proposed
  change. Changes are made only through a `test-design` revision.
- **Never** withdraw a Change Required finding or downgrade it to Advisory unless
  the human explicitly decided so in a change request. Cite that request.

## Re-Review

When TestCases.md has a new approved version:

- re-bind to its new hash,
- re-run all eight checks over the whole file (not only the changes),
- re-assess every earlier finding: `resolved` (state what was verified in the new
  version), or still `open`,
- give new findings the next unused `TR-###`, and never renumber or reuse an ID.

## Output Structure

Write `{{task_path}}/test-review/TestReview.md` following
`.claude/skills/test-review/TestReview.template.md`, with these sections:

1. Review Information (including the binding)
2. Review Scope
3. Review Checks
4. Per-Case Review
5. Source Coverage Verification
6. Findings
7. Open Questions
8. Resolution Tracking
9. Review Summary

§9 gives counts and the review outcome only, with **no** quality score.

## Stop Conditions

After writing TestReview.md: **STOP** and present it for review. If any Change
Required finding is open, state that the review cannot be approved until it is
resolved through a test-design revision, or withdrawn or downgraded by the human.
Do **not**:

- modify TestCases.md or any other upstream artifact,
- execute any case, open a browser, or use Playwright MCP,
- generate automation in any framework, report pass/fail results, or create bugs,
- start Test Design, Manual Execution or Automation Generation.

## Approval Requirements

- The only progression key is the exact, case-sensitive, standalone value:

  ```
  TEST_REVIEW_APPROVED
  ```

- These are **not** approval: `approved`, `looks good`, `continue`, `proceed`,
  `LGTM`, `TEST_REVIEW_APPROVED please continue`, any message containing the key
  with other text, silence, `TEST_DESIGN_APPROVED`, or another stage's key.
- The exact key is **refused** while any Change Required finding is open, or if
  TestCases.md, TestReview.md, ProjectContext.md or ExplorationReport.md changed
  since the review. Say which, and what is needed.
- The approval applies only to the TestCases.md hash bound in §1. Any later change
  to TestCases.md or TestReview.md voids it.
- **Revisions:**
  - update the same TestReview.md (never `-v2` or `-final`),
  - keep the existing finding IDs,
  - bump the minor version,
  - record the reason and the findings added, changed, resolved or withdrawn,
  - STOP, and require `TEST_REVIEW_APPROVED` again.
