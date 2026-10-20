---
prompt_id: self-healing
prompt_version: 1.0.0
skill: self-healing
stage_id: self-healing
approval_key: null
variables: [task_name, task_path, workflow_run_id, failed_run_ids, binding_id]
changelog:
  - "1.0.0: Initial version."
---

# Prompt — Self-Healing

> Versioning rule: any change to the text of this file requires a
> `prompt_version` bump. The journal identifies the prompt used for each run by
> `prompt_id` + `prompt_version`. One verbatim snapshot of each version, with its
> SHA-256, is stored in the task's `journal/prompts.json`.

## Purpose

Investigate the non-passing automation runs `{{failed_run_ids}}` of binding
`{{binding_id}}` in task `{{task_name}}` (`{{task_path}}`), and restore trustworthy
automation without changing what the test checks.

```
evidence → failure point → classification → (application: report, no heal)
  → minimal justified change → static checks → healing log + journal → one verification rerun
```

## Prerequisites

Skill `self-healing`, §Prerequisites (SH-E01 – SH-E03). Active run `{{workflow_run_id}}`
(never create one). The failed run folders and their evidence must be intact.

## Instructions

1. **Read the evidence** of each failed run (error, step log, screenshot, trace or
   Allure steps, console log, dumps) before touching any file.
2. **Find the failure point** (test, page object, fixture, configuration, framework,
   toolchain, environment). Inspect framework internals read-only if the stack points there.
3. **Classify**: environment, configuration, framework_defect, test_data, test_script
   or application, citing the deciding evidence.
4. **Application defect** → no change; record `not_healed_application_defect` and
   report it to the human. Stop for that failure.
5. **Fix minimally** within the guardrails, one root cause and one binding per
   attempt. Record SHA-256 before and after for each changed file; add the healing ID
   in a comment. Never add machine-specific values to the project.
6. **Check statically**: compile/type-check, discovery, forbidden patterns, assertion
   lines unchanged.
7. **Document** the attempt in `self-healing/healing-log.md` (append; from the
   template on first use) and journal `healing_attempts`.
8. **Verify**: request one rerun of the affected binding from `automation-execution`.
   `fixed` only if that run's outcome is `passed`. At most 3 attempts, then `escalated`.

## Rules (never break)

- Never change an assertion, expected result, step order or test data definition.
- Never add sleeps, retries, forced actions or swallowed exceptions.
- Never modify or delete failure evidence or approved artifacts; never store secrets.
- Never heal an application defect, create a bug or change a bug status.

## Output

Per attempt: ID, classification, root cause, change, files, verification run, result;
application failures reported. Then STOP.
