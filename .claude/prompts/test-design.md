---
prompt_id: test-design
prompt_version: 1.0.0
skill: test-design
stage_id: test-design
approval_key: TEST_DESIGN_APPROVED
variables: [task_name, task_path, workflow_run_id]
changelog:
  - "1.0.0: Initial version."
---

# Prompt — Test Design

> Versioning rule: any change to the text of this file requires a
> `prompt_version` bump. The journal identifies the prompt used for each run by
> `prompt_id` + `prompt_version`, and stores one verbatim snapshot of each version
> with its SHA-256 in the task's `journal/prompts.json`.

## Purpose

Turn **approved documented scope** and **approved observed behavior** into
concrete, executable, traceable test cases. Use recognized design techniques
rather than intuition, so coverage is defensible and the gaps are visible, not
accidental. This is a **design** stage: nothing is executed.

```
approved ProjectContext.md + approved ExplorationReport.md → TestCases.md → HUMAN REVIEW → TEST_DESIGN_APPROVED
```

## Expected Inputs

| Input | Location | Role |
|---|---|---|
| Approved Project Context | `{{task_path}}/context/ProjectContext.md` | Documented scope and business rules (`PC SA/BR/EB/DEP/RK/GAP/OQ-###`) |
| Approved Exploration Report | `{{task_path}}/exploration/ExplorationReport.md` | Observed behavior (`OBS/FND/XGAP/XQ/PB/XDEP-###`), coverage limits |
| Task identity | `{{task_path}}/context/TaskContext.md` § Identity | Identity only |
| PRD | `{{task_path}}/prd/PRD.md` | PRD IDs where traceability requires them |
| Constraints | Environment, test-data and role constraints from the inputs or the human | Feasibility and gaps |
| workflow_run_id | `{{workflow_run_id}}` (orchestration-owned, read only) | Header and journal |

## Prerequisites

Do not design anything unless all of the following hold:

- The task, TaskContext.md, PRD.md, ProjectContext.md and ExplorationReport.md exist.
- ProjectContext is approved with `PROJECT_CONTEXT_APPROVED`, and that approval
  is current.
- ExplorationReport is approved with `EXPLORATION_APPROVED`, and that approval is
  current.
- The approved exploration was performed against the currently approved
  ProjectContext.
- An active `workflow_run_id` exists.

Otherwise stop and report which prerequisite failed.

## Source-of-Truth Rules

- **ProjectContext** is documented scope and business rules. **ExplorationReport**
  is observed behavior. **Test Design** is coverage derived from both.
- ExplorationReport never replaces ProjectContext. Undocumented behavior is
  never a confirmed requirement.
- **Never invent an expected result.** An expected result must be supported by:
  1. ProjectContext (a PC BR or PC EB),
  2. approved exploration that is **consistent** with documented behavior (a
     MATCH observation can supply concrete detail, such as an exact message text
     or option list, for a documented behavior), or
  3. an explicit documented business rule.
- If none of these supports an expected result, the case is **Exploratory**
  and/or the point becomes an **Open Question**. Write the Expected Result exactly
  as `Not established by approved requirements.` and state what must be
  clarified.
- **FINDING:** the expected result stays the *documented* expectation, and the
  case notes the known finding.
- **GAP / QUESTION observations:** the case becomes Exploratory and/or an Open
  Question.
- **POTENTIAL BUG:** use the documented expectation if one exists. Otherwise the
  case is Exploratory. A potential bug is never treated as confirmed.

## Test Design Instructions

For each in-scope behavior or rule:

1. identify it (PC BR / PC EB / OBS),
2. decide which technique is appropriate,
3. apply the technique,
4. explain why it was selected,
5. generate the **minimum defensible** set of cases,
6. verify coverage.

Do **not** apply every technique blindly. For any technique not applied,
record why.

### Techniques

- **Equivalence Partitioning (EP):** partition inputs into logically equivalent
  classes (valid, invalid, missing, malformed, …). For each partition, record
  the partition, a representative value, the expected behavior and the source.
  Do not add redundant cases without justification.
- **Boundary Value Analysis (BVA):** for every documented, or approved-observed,
  numeric, length, date, quantity or similar limit, use just below, at and just
  above the boundary. Where applicable, also use min, min+1, max−1, max and max+1.
  Only use boundaries supported by approved sources.
- **Decision Tables (DT):** use these where behavior depends on multiple
  conditions. Record the conditions, condition values, resulting actions, the
  combinations covered, and the test case IDs. Collapse combinations whose
  outcomes are equivalent, and justify doing so.
- **State Transition Testing (ST):** use this for lifecycle or state behavior.
  Cover valid transitions, and the invalid transitions that sources establish.
  Never invent states or transitions.
- **Pairwise / Combinatorial (PW):** use this for many independent parameters.
  Record the dimensions, values, strategy, selected combinations and the coverage
  achieved. Never claim exhaustive coverage for pairwise.
- **Error Guessing (EG):** supplementary only. It never replaces a systematic
  technique. Candidate areas: missing required data, malformed input, repeated
  submission, unexpected sequence, timeout, duplicate action, invalid state,
  stale data. Record the rationale. The expected result still needs an approved
  source, or the case is Exploratory.

## Coverage Rules

- Cover these types where applicable:
  1. Positive
  2. Negative
  3. Boundary
  4. Validation (each field rule, including the exact message where it is
     established)
  5. Business Rule (each PC BR individually)
  6. Dependency
  7. Error Handling
  8. Exploratory
  9. End-to-End (the full realistic workflow)
- Every applicable **PC BR** has at least one covering case, or an explicit
  Coverage Gap. Every **PC EB** is covered or has a gap.
- Consider every **Exploration observation**.
  - FINDING and POTENTIAL BUG observations need a covering case or a gap.
  - GAP and QUESTION observations need an Exploratory case and/or an Open
    Question.
  - An observation that needs no case is listed with the reason.
- Exploration coverage limits are carried into Coverage Gaps.

## Test Case Rules

- Each case records:
  - ID `TC-###`, Title, Type, Priority (+ basis)
  - Preconditions, Test Data (`DATA-###` refs), ordered Steps
  - **one single unambiguous Expected Result**, and its Expected Result Basis
  - Traceability, Technique (`TA-###`)
  - Valid in Scope (+ reason), Needs Automation (+ rationale)
  - Status, Notes
- Split independent expectations into separate cases.
- Cases are independent, repeatable, executable and deterministic where
  possible. Preconditions set up their own state, and nothing relies on
  execution order.
- Steps use only screens, fields and flows established by ProjectContext or
  approved exploration. Never invent UI elements.
- **Priority:** High, Medium or Low, based on documented business importance,
  risk (PC RK), critical-workflow impact, or explicit project context. Record the
  basis. If no basis exists, write `Not established`. Use a project-defined
  default only if one exists.
- **Valid in Scope:** TRUE when the case exercises an in-scope PC area and does
  not depend on excluded functionality. Otherwise FALSE, with a reason and a
  matching Coverage Gap.
- **Needs Automation:** TRUE only when all of these hold:
  - Valid in Scope is TRUE,
  - the expected result is established (not Exploratory),
  - the case is deterministic and repeatable,
  - the case has regression value.

  Otherwise FALSE, with a rationale. Exploratory cases are always FALSE.
- IDs are stable: `TC-001`, `TC-002`, … An edited case keeps its ID. A removed case
  is marked withdrawn with the reason, and its ID is never reused or renumbered.
- **Source IDs:** reuse upstream IDs exactly, qualified as `PC BR-001`,
  `PC EB-003` or `PRD FR-002`. Exploration IDs are used as they are (`OBS-014`,
  `FND-002`). Never invent a source ID.

## Exploratory Cases, Open Questions, Gaps, Test Data

- **Exploratory cases:** only where behavior is undocumented, the expected result
  is not established, exploration found a GAP, or further investigation is
  needed. Each one records the case ID, why it is exploratory, the observed
  behavior, what is unknown, the question (`TQ-###`), and the evidence or source
  references. Never convert a GAP into a guessed expected result.
- **Open Questions (`TQ-###`):** the related source, related cases, the exact
  ambiguity, and the required clarification. Owner is `not stated` unless given.
  Questions stay open until a human or business decision is provided.
- **Coverage Gaps (`CG-###`):** uncovered business rules, uncovered observations,
  inaccessible functionality, missing test data, unavailable roles, environment
  limitations and intentional exclusions. Each gap records the reason, impact
  (if known), dependency or blocker, and whether follow-up is required. Never
  hide missing coverage.
- **Test Data (`DATA-###`):** the data required for execution, such as users,
  roles, dates, ranges, account states and dependent records. Include its
  category, the cases that use it, and its source.
  - Never include real credentials or secrets. Reference the configured test-data
    source instead.
  - Synthetic values use reserved domains (e.g. `example.com`, `.test`).

## Output Structure

Write `{{task_path}}/test-design/TestCases.md` following
`.claude/skills/test-design/TestCases.template.md`, with these sections:

1. Test Design Information
2. Scope
3. Test Design Strategy
4. Test Cases
5. Traceability Matrix
6. Technique Rationale (with technique tables)
7. Exploratory Cases
8. Open Questions
9. Coverage Gaps
10. Test Data Requirements
11. Coverage Summary

§11 gives counts only, with **no** quality score.

## Stop Conditions

After writing TestCases.md: **STOP** and present it for review. Do **not**:

- execute any case, open a browser, or use Playwright MCP,
- generate automation (Selenium, SHAFT, TestNG, Playwright or other code),
- report pass/fail results, or create bugs,
- start Manual Execution or Automation.

## Approval Requirements

- The only progression key is the exact, case-sensitive, standalone value:

  ```
  TEST_DESIGN_APPROVED
  ```

- These are **not** approval: `approved`, `looks good`, `continue`, `proceed`,
  `LGTM`, `TEST_DESIGN_APPROVED please continue`, any message containing the key
  with other text, silence, or another stage's key.
- **Revisions:**
  - update the same TestCases.md (never `-v2` or `-final`),
  - keep the existing case IDs,
  - bump the minor version,
  - record the reason, the changed sections, and the added, removed and
    modified cases,
  - STOP, and require `TEST_DESIGN_APPROVED` again.

  Changing an approved TestCases.md voids its approval.
