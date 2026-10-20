# Healing / Fixing Log — <scope>

<!--
OUTPUT STRUCTURE for the self-healing skill. This file is a structure reference, not
an artifact. The skill writes platform/tasks/<task-name>/self-healing/healing-log.md
from it on first use and then appends: earlier attempts are never rewritten.
Every section is always present; an empty section says "None."
No secrets. Evidence is cited by task-relative path or EVD-###.
IDs: E-### environment actions (no code change), H-### code/configuration changes.
-->

| Field | Value |
|---|---|
| Task | |
| Workflow run | |
| Scope | <cases, bindings> |
| Approved requirement | <TestCases version, approval events> — **not modified** |
| Evidence root | `automation-execution/results/<run-id>/<project-dir>/` (original failure evidence kept unchanged) |

## 1. Rules applied

- Only locators, waits, setup, configuration and test plumbing may change.
- Steps, expected results and assertions are never changed.
- Each failure is classified from evidence before any change; application defects are reported, never healed.
- Original failure evidence is preserved; every change is verified by a new run.
- Retries stay 0.

## 2. Summary

| ID | Binding | Run with the failure | Classification | Root cause | Change | Verified by | Result |
|---|---|---|---|---|---|---|---|

Totals: <n> attempts (by class). Application defects found: <n>. Assertions changed: **0**.

## 3. Details

### <ID> — <short title> (<classification>)

| Item | Value |
|---|---|
| Original failure | <verbatim error, secrets redacted> |
| Evidence | <paths / EVD-###> |
| What the evidence shows | |
| Diagnosis | <how the root cause was established> |
| Classification | |
| Change | <file(s) and change; or "none (environment action)"> |
| Files (SHA-256 before → after) | |
| Not changed | <assertions / steps confirmed unchanged> |
| Rejected alternatives | |
| Verification run | <run ID and outcome> |
| Result | fixed / not_fixed / not_healed_application_defect / escalated |

## 4. Items reviewed and not healed

| Item | Decision |
|---|---|

## 5. Result

| Binding | Final state | Passing runs after fixes |
|---|---|---|
