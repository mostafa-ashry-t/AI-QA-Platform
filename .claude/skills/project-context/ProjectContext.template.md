# Project Context

<!--
OUTPUT STRUCTURE for the project-context skill. This file is a structure
reference, not an artifact. The skill writes the filled version to
platform/tasks/<task-name>/context/ProjectContext.md. Never copy placeholder
rows into the artifact as if they were content. Empty sections say
"None documented in the PRD." and, where that matters, have a matching GAP.

ID conventions: SA-001 scope area · BR-001 business rule · EB-001 expected
behavior · DEP-001 dependency · AS-001 assumption · RK-001 risk ·
GAP-001 gap · OQ-001 open question.
Source format: `<file path>` §<section> — "<short quote>" (quote optional but preferred).
PRD item IDs are always qualified: `PRD FR-003`, `PRD BR-002`, never bare,
so they are not confused with this artifact's own BR-/AS-/GAP- IDs.
-->

> Produced by the `project-context` skill (skill vX.Y.Z, prompt `project-context` vX.Y.Z)
> from this task's PRD. Documented intent only; the live application was not consulted.
>
> `PRD (PRD_APPROVED) → Project Context → HARD STOP → PROJECT_CONTEXT_APPROVED → Exploration`

## 1. Task Information

| Field | Value |
|---|---|
| Task ID | <task folder name, unless a source states an ID> |
| Task Name | |
| Task Type | <as stated in TaskContext.md or PRD, else "not stated"> |
| Project Name | |
| Status | Draft (revision N) — awaiting `PROJECT_CONTEXT_APPROVED` \| Approved |
| Sources read | <list of input file paths> |

## 2. Scope Decomposition

| ID | Name | Description | Contains | Why distinct | Source |
|---|---|---|---|---|---|
| SA-001 | | | | | |

## 3. Task Scope

### In Scope

_Documented scope only. Reference SA IDs._

- 

### Explicitly Out of Scope

_Only items the sources explicitly exclude. Do not infer exclusions._

- 

### Scope Boundaries

_Where this task meets other functionality, and which side of the line each belongs to._

- 

## 4. Roles and Permissions

| Role | Allowed actions | Restricted actions | Source |
|---|---|---|---|
| | | | |

## 5. Business Rules

_One verifiable assertion per rule._

### BR-001

- **Description:** 
- **Source:** 
- **Scope area:** SA-

## 6. Expected Behaviors

| ID | Expected behavior (as documented) | Source | Scope area |
|---|---|---|---|
| EB-001 | | | SA- |

## 7. Dependencies

| ID | Type | Dependency | Why it is needed | Source |
|---|---|---|---|---|
| DEP-001 | Other task \| Module \| External system \| API \| Data \| Business | | | |

## 8. Assumptions

| ID | Assumption | Status | Basis / Source |
|---|---|---|---|
| AS-001 | | Confirmed \| Unconfirmed | |

## 9. Risks

| ID | Description | Why it matters | Related requirement / area | Basis | Source |
|---|---|---|---|---|---|
| RK-001 | | | | Documented \| Derived | |

## 10. Gaps and Open Questions

### Gaps

| ID | Gap (missing / unclear / contradictory / untestable) | Related requirement / area | Impact (if known) | Owner |
|---|---|---|---|---|
| GAP-001 | | | | not stated |

### Open Questions

| ID | Question | Related requirement / area | Impact (if known) | Owner |
|---|---|---|---|---|
| OQ-001 | | | | not stated |

## 11. Traceability

| PRD Section | Requirement (PRD ID, or quote) | Business Rule / Expected Behavior | Scope Area |
|---|---|---|---|
| | | | |

**PRD sections with no derived item:** _list them, or "None"._

**Items without a PRD source:** _must be "None". Any such item is removed or moved to Gaps._

## 12. QA Scope Preparation

> Preparation for downstream stages only. No exploration has been performed.

### Areas requiring exploration

| Scope area | What needs to be observed | Related BR / EB / GAP / OQ |
|---|---|---|
| | | |

### UI areas requiring exploration

- 

### API areas requiring exploration

- 

### Business rules requiring validation

- 

### Data requiring validation

- 
