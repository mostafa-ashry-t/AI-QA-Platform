# Test Cases

<!--
OUTPUT STRUCTURE for the test-design skill. This file is a structure reference,
not an artifact. The skill writes the filled version to
platform/tasks/<task-name>/test-design/TestCases.md. Never copy placeholder
rows into the artifact as content. Every section is always present. When a
section is empty, write "None."

Never invent an expected result. If approved sources do not establish it, the
Expected Result is exactly "Not established by approved requirements." and the
case is Exploratory and/or linked to an Open Question (TQ-###).

ID conventions (this artifact):
  TC test case · TA technique application · DATA test data requirement ·
  TQ test-design open question · CG coverage gap
Upstream references (reused exactly, never invented):
  PC SA/BR/EB/DEP/RK/GAP/OQ-### (ProjectContext) · PRD FR-### (PRD) ·
  OBS / FND / XGAP / XQ / PB / XDEP-### (ExplorationReport)
Types: Positive | Negative | Boundary | Validation | Business Rule | Dependency |
       Error Handling | Exploratory | End-to-End
Priority: High | Medium | Low | Not established   (with basis)
Expected Result Basis: PC BR-### / PC EB-### [+ OBS-### (MATCH detail)] | Not established
-->

## 1. Test Design Information

| Field | Value |
|---|---|
| Task ID | |
| Task Name | |
| Project Name | |
| Workflow Run ID | <journal/workflow-run.json → active_run_id> |
| ProjectContext version | <status/revision> · SHA-256 <approved hash> · approval journal EVT-NNNN |
| ExplorationReport version | <x.y.z> · SHA-256 <approved hash> · approval journal EVT-NNNN |
| TestCases version | 1.0.0 |
| Status | Draft — awaiting `TEST_DESIGN_APPROVED` \| Approved |
| Test Design skill version | test-design vX.Y.Z |
| Prompt version | test-design vX.Y.Z |
| Designed at | <UTC, system clock> |

### Revision History

| Version | Date (UTC) | Reason | Changed sections | Added | Modified | Withdrawn |
|---|---|---|---|---|---|---|
| 1.0.0 | | Initial design | All | TC-001…TC-### | — | — |

## 2. Scope

### In scope

- PC SA-### — …

### Out of scope

- … (PC §3 Explicitly Out of Scope)

### Assumptions

| ID | Assumption | Status | Source |
|---|---|---|---|
| | | Confirmed \| Unconfirmed | PC AS-### / … |

### Constraints

- Environment, test-data or role constraints, with their source.

## 3. Test Design Strategy

- **Techniques selected:** …, each with a reason (detail in §6)
- **Techniques not applied:** …, each with a reason
- **Coverage approach:** how the coverage types (§11) and sources (§5) are satisfied
- **Expected-result policy:** documented or MATCH-consistent sources only. Everything else is Exploratory or TQ.

## 4. Test Cases

### Index

| ID | Title | Type | Priority | Valid in Scope | Needs Automation | Status |
|---|---|---|---|---|---|---|
| TC-001 | | | | TRUE \| FALSE | TRUE \| FALSE | Active \| Withdrawn |

### TC-001 — <title>

| Field | Value |
|---|---|
| Type | |
| Priority | High \| Medium \| Low \| Not established — basis: <PC RK-### / critical workflow / …> |
| Preconditions | <self-contained; no dependency on other cases> |
| Test Data | DATA-### |
| Steps | 1. …<br>2. … |
| Expected Result | <ONE observable outcome> |
| Expected Result Basis | PC EB-### [+ OBS-### (MATCH detail)] \| Not established |
| Traceability | PC BR-### · PC EB-### · OBS-### · PRD FR-### |
| Technique | TA-### (EP \| BVA \| DT \| ST \| PW \| EG) |
| Valid in Scope | TRUE \| FALSE — <reason> |
| Needs Automation | TRUE \| FALSE — <rationale> |
| Status | Active \| Withdrawn (vX.Y.Z — reason) |
| Notes | e.g. known FINDING FND-### (observed behavior currently differs) |

## 5. Traceability Matrix

### Source → Test Cases

| Source ID | Source Type | Description | Test Cases |
|---|---|---|---|
| PC BR-### | Business Rule | | TC-### |
| PC EB-### | Expected Behavior | | TC-### |
| OBS-### (FND-###) | Exploration Observation (FINDING) | | TC-### |
| PRD FR-### | Documented Requirement | | TC-### |

**Uncovered sources:** | Source ID | Reason | Coverage Gap |

### Exploration observations considered

| Observation | Classification | Test Cases | If none: reason |
|---|---|---|---|
| OBS-### | MATCH \| FINDING \| GAP \| QUESTION \| POTENTIAL BUG | TC-### / — | |

### Test Case → Sources

| Test Case | Sources |
|---|---|
| TC-### | PC BR-###, OBS-### |

## 6. Technique Rationale

| ID | Technique | Area | Reason selected | Resulting Cases |
|---|---|---|---|---|
| TA-001 | Equivalence Partitioning | PC SA-### / field | | TC-### |

**Not applied:** | Technique | Reason |

### 6.1 Equivalence Partitioning

| TA | Input / condition | Partition | Representative value | Expected behavior | Source | Case |
|---|---|---|---|---|---|---|

### 6.2 Boundary Value Analysis

| TA | Limit | Source of limit | Values (below / at / above; min, min+1, max−1, max, max+1) | Cases |
|---|---|---|---|---|

### 6.3 Decision Tables

| TA | Conditions | Condition values | Resulting action | Rule / combination | Cases |
|---|---|---|---|---|---|

_Collapsed combinations and justification:_

### 6.4 State Transition Testing

| TA | From state | Event / action | To state | Valid? | Source | Case |
|---|---|---|---|---|---|---|

### 6.5 Pairwise / Combinatorial

| TA | Dimensions & values | Strategy | Selected combinations | Coverage achieved (not exhaustive) | Cases |
|---|---|---|---|---|---|

### 6.6 Error Guessing (supplementary)

| TA | Error area | Rationale | Expected-result basis | Case |
|---|---|---|---|---|

## 7. Exploratory Cases

| Case | Why exploratory | Observed behavior | What is unknown | Question | Evidence / Source |
|---|---|---|---|---|---|
| TC-### | | OBS-### … | | TQ-### | EVD-### / XGAP-### |

## 8. Open Questions

| ID | Related source | Related test cases | Exact ambiguity | Required clarification | Owner |
|---|---|---|---|---|---|
| TQ-001 | | | | | not stated |

## 9. Coverage Gaps

| ID | Category | Item | Reason | Impact (if known) | Dependency / blocker | Follow-up required |
|---|---|---|---|---|---|---|
| CG-001 | Uncovered business rule \| Uncovered observation \| Inaccessible functionality \| Missing test data \| Unavailable role \| Environment limitation \| Intentional exclusion | | | | | Yes \| No |

## 10. Test Data Requirements

| ID | Data required | Category | Used by | Source / how provided | Notes |
|---|---|---|---|---|---|
| DATA-001 | | User \| Role \| Date \| Numeric range \| Account state \| Dependent record \| Other | TC-### | <configured test-data source; never a secret value> | |

## 11. Coverage Summary

| Metric | Count |
|---|---|
| Total test cases (active) | |
| Positive | |
| Negative | |
| Boundary | |
| Validation | |
| Business Rule | |
| Dependency | |
| Error Handling | |
| Exploratory | |
| End-to-End | |
| Valid in Scope = TRUE | |
| Needs Automation = TRUE | |
| Uncovered sources | |
| Open questions | |
| Coverage gaps | |

_No overall quality score is given. Judgment belongs to the human reviewer._
