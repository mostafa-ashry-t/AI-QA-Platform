# Bug Reports

<!--
OUTPUT STRUCTURE for the manual-execution skill's bug reports. This file is a
structure reference, not an artifact. The skill writes the filled version to
platform/tasks/<task-name>/bugs/BugReports.md ONLY when at least one supported
APPLICATION_DEFECT exists. Otherwise the task keeps its placeholder.

One report per DISTINCT DEFECT / ROOT CAUSE, not per failing case. Several cases
failing on one root cause is ONE bug that lists all of them.
Steps to reproduce must stand alone: a developer needs nothing beyond the entry.
Severity (impact) and priority (urgency) are assessed independently.
Never include secrets. Redact as [REDACTED: <kind>].
Bug IDs are stable. A withdrawn bug stays listed as withdrawn, and its ID is never reused.
-->

| Field | Value |
|---|---|
| Task ID | |
| Workflow Run ID | |
| Source report | `execution/ExecutionReport.md` v<x.y.z> |
| Document version | 1.0.0 |
| Status | Draft — awaiting `MANUAL_EXECUTION_APPROVED` \| Approved |

### Revision History

| Version | Date (UTC) | Reason | Bugs added | Bugs modified | Bugs withdrawn |
|---|---|---|---|---|---|
| 1.0.0 | | Initial | BUG-001… | — | — |

### Severity model

Severity follows <project-defined model, source>. If no project model exists, the
platform default applies:

- **Critical**: core function unusable, data loss or corruption, or a security
  exposure, with no workaround.
- **High**: a major function fails, or the workaround is impractical.
- **Medium**: a function is partially impaired and a workaround exists.
- **Low**: cosmetic or minor.

---

## BUG-001

### Title

<clear, concise defect title>

### Severity

<Critical | High | Medium | Low>. Rationale: <impact-based reasoning>

### Priority

<High | Medium | Low | Not established>. Basis: <documented business importance / PC RK-### / workflow impact / affected case priority / project rule>

### Environment

<environment · application URL · build/version · browser>

### Preconditions

<the state required before reproduction>

### Steps to Reproduce

1. 
2. 
3. 

### Expected Result

<verbatim from approved TC-###> (basis: PC BR-### / PC EB-###)

### Actual Result

<observed behavior only>

### Evidence

- EVD-### — <type> — `execution/evidence/EVD-###-<slug>.<ext>`

### Affected Test Cases

- TC-### (step N)
- TC-### (step N)

_Grouping rationale: <why these failures share one defect>. Possibly related: BUG-### / none_

### Root Cause Assessment

<only what the evidence supports, or "Not established — observed symptom only.">

### Traceability

<PC BR-### → TC-### → FAIL → EVD-### → BUG-001> · related exploration: <FND-### / OBS-### / none>

### Status

Open
