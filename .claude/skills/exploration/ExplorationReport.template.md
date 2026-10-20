# Exploration Report

<!--
OUTPUT STRUCTURE for the exploration skill. This file is a structure reference,
not an artifact. The skill writes the filled version to
platform/tasks/<task-name>/exploration/ExplorationReport.md. Never copy
placeholder rows into the artifact as content. Every section is always present.
When a section is empty, write "None observed."

Record what was actually observed, never what was expected to be observed.
Undocumented behavior is a GAP, not a newly discovered rule.
A difference is a FINDING, not automatically a bug.

ID conventions (this report):
  OBS observation · FND finding · XGAP exploration gap · XQ exploration question ·
  PB potential bug · EVD evidence · LOC candidate locator · XDEP dependency discovered
Upstream references are always qualified:
  PC SA-### / PC BR-### / PC EB-### / PC GAP-### / PC OQ-### (ProjectContext)
  PRD FR-### (PRD)
Evidence files live in exploration/evidence/ as EVD-###-<slug>.<ext>
-->

## 1. Exploration Information

| Field | Value |
|---|---|
| Task ID | |
| Task Name | |
| Project Name | |
| Environment | <from TaskContext/PRD, or "not stated"> |
| Application URL | <UI URL> · <API URL if in scope> |
| Workflow Run ID | <journal/workflow-run.json → active_run_id> |
| Exploration started | <UTC, system clock> |
| Exploration ended | <UTC, system clock> |
| Report version | 1.0.0 |
| Status | Draft — awaiting `EXPLORATION_APPROVED` \| Approved |
| Skill version | exploration vX.Y.Z |
| Prompt version | exploration vX.Y.Z |
| Baseline | `context/ProjectContext.md` (approved, SHA-256 <hash>) |

### Revision History

| Version | Date (UTC) | Reason | Changed sections | Re-exploration performed |
|---|---|---|---|---|
| 1.0.0 | | Initial exploration | All | n/a |

## 2. Exploration Scope

### Exploration plan

| Area (PC SA) | Expected behaviors / rules to compare | Flow to follow | Data needed | Status |
|---|---|---|---|---|
| PC SA-### | PC EB-###, PC BR-### | | | Explored \| Partially explored \| Not explored |

### Areas and flows explored

- 

### Areas intentionally not explored

| Area | Reason |
|---|---|
| | Out of scope per ProjectContext §3 \| … |

### Out-of-scope areas followed as dependencies

| Area | Why it was necessary | Related in-scope flow |
|---|---|---|
| | | |

## 3. Environment

| Item | Value | Source |
|---|---|---|
| Application URL | | TaskContext / PRD SRC-### |
| Environment | | TaskContext / "not stated" |
| Browser / MCP server | <as reported by the tool, or "not recorded"> | tool output |
| Relevant configuration | <only if known> | |
| Exploration date/time | <UTC, system clock> | system clock |

## 4. Exploration Method

- The approved ProjectContext (`PROJECT_CONTEXT_APPROVED`) was the expected-behavior baseline.
- Playwright MCP (`playwright` server) was used for browser access as an exploration tool, not as automation.
- Each planned area was explored and compared expected vs actual. Each observation received exactly one classification.
- Evidence was captured for every non-MATCH observation, or the reason it could not be captured was recorded.
- Deviations from the plan: <none, or list>

## 5. Observations

| ID | Area | Expected | Actual | Classification | Evidence | Source | Notes |
|---|---|---|---|---|---|---|---|
| OBS-001 | PC SA-### | <documented expectation, or "Not documented (ProjectContext silent)"> | <observed> | MATCH \| FINDING \| GAP \| QUESTION \| POTENTIAL BUG | EVD-### | PC EB-### | |

## 6. MATCHES

| Observation | Confirmed documented behavior | Source |
|---|---|---|
| OBS-### | | PC EB-### |

## 7. FINDINGS

> A difference is a FINDING, not automatically a bug. The documentation may be the thing that is wrong.

### FND-001 (OBS-###)

- **Documented expectation:** 
- **Actual behavior:** 
- **Difference:** 
- **Evidence:** EVD-###
- **Source:** PC BR-### / PC EB-###

## 8. GAPS

| ID | Observation | Observed behavior | Missing documented expectation | Impact (if known) | Evidence | Related PC GAP / area |
|---|---|---|---|---|---|---|
| XGAP-001 | OBS-### | | | | EVD-### | |

## 9. QUESTIONS

| ID | Observation | Behavior | Why clarification is required | Evidence | Related PC OQ / rule | Owner |
|---|---|---|---|---|---|---|
| XQ-001 | OBS-### | | | EVD-### | | not stated |

## 10. POTENTIAL BUGS

> Suspected, not confirmed. Formal bug reporting belongs to a later stage.

### PB-001 (OBS-###)

- **Expected behavior:** 
- **Actual behavior:** 
- **Reason for suspicion:** 
- **Evidence:** EVD-###
- **What would confirm it:** 

## 11. Candidate Locators

> For the automation stage. Observed attribute values only: no Playwright locator syntax, no MCP snapshot refs, no automation code.

| ID | Element | Page / URL | Stable `id` | Attribute usable for XPath | Locator notes | Stability observations | Related OBS / EVD |
|---|---|---|---|---|---|---|---|
| LOC-001 | | | `<id value>` or none | `<attr>="<value>"` | | | |

## 12. Dependencies Discovered

_Observed only._

| ID | Dependency observed | How it was observed | Documented? (PC DEP-### or "undocumented → OBS-###") | Evidence |
|---|---|---|---|---|
| XDEP-001 | | | | |

## 13. Coverage Limits

| Type | Item | Reason |
|---|---|---|
| Area not explored | | |
| Flow not completed | | |
| Inaccessible area | | |
| Unavailable data | | |
| Blocked action | | e.g. required human confirmation not given |
| Environment limitation | | |

### Data changed during exploration

| Action | Data created / changed | Left in environment? |
|---|---|---|
| | | |

## 14. Exploration Summary

| Classification | Count |
|---|---|
| MATCH | |
| FINDING | |
| GAP | |
| QUESTION | |
| POTENTIAL BUG | |
| **Total observations** | |

Coverage limitations: <summary referencing §13>

_No overall quality verdict is given. Judgment belongs to the human reviewer._
