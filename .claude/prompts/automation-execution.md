---
prompt_id: automation-execution
prompt_version: 1.0.0
skill: automation-execution
stage_id: automation-execution
approval_key: null
variables: [task_name, task_path, workflow_run_id, binding_ids, test_case_ids, run_ids, credential_env_vars]
changelog:
  - "1.0.0: Initial version."
---

# Prompt — Automation Execution

> Versioning rule: any change to the text of this file requires a
> `prompt_version` bump. The journal identifies the prompt used for each run by
> `prompt_id` + `prompt_version`. One verbatim snapshot of each version, with its
> SHA-256, is stored in the task's `journal/prompts.json`.

## Purpose

Run the generated automation of task `{{task_name}}` (`{{task_path}}`) for bindings
`{{binding_ids}}` and cases `{{test_case_ids}}`, each binding independently, and record
exactly what happened: outcomes, durations, evidence and the cause of every
non-passing run.

```
per binding: preflight → one run (retries 0, env vars only) → collect evidence → metrics
  → classify → secret scan → automation-report.html → journal → STOP / hand off to self-healing
```

## Prerequisites

Skill `automation-execution`, §Prerequisites (AE-E01 – AE-E06). A failing
prerequisite blocks only that binding: journal it as `blocked`, continue with the others.
`journal/workflow-run.json` must have an active run (`{{workflow_run_id}}`); never create one.

## Instructions

1. **Preflight.** Check the binding's generation event, project directory, current
   approvals, toolchain (record versions) and that `{{credential_env_vars}}` are set
   (names only). Run discovery with a reporter that writes nothing.
2. **Run.** Use the binding's own command from the skill's Binding Runners table, from
   its own directory, with `QA_RUN_ID` set to the run ID (`{{run_ids}}` if given).
   Time the command. Save the console output in the run folder. Retries 0.
3. **Collect.** Copy runner outputs into `automation-execution/results/<run-id>/<project-dir>/`.
   Never modify an earlier run folder.
4. **Measure.** Extract test duration and runner total from the machine-readable
   outputs; wall-clock from the timer. Unknown values are null. Update
   `automation-execution/execution-metrics.json` and validate it against its schema.
5. **Classify.** Outcome `passed` / `failed` / `not_run` / `harness_failed`; failure
   class with cited evidence. A run whose tests passed but whose command failed is
   `harness_failed`, never a pass.
6. **Secrets.** Scan the new outputs (including zip members) for the credential
   values; never print them.
7. **Report.** Write `automation-execution/<project-dir>/automation-report.html` per
   the structure reference. Numbers only from the run outputs.
8. **Journal.** One `stage_execution` per binding with `automation_runs`,
   `test_results`, `environment`, `browser`, `evidence`, `validation`.

## Rules (never break)

- Never edit test code, configuration, assertions, approved artifacts or evidence.
- Never claim a result the runner output does not show; never rerun to get a pass.
- Never obtain credentials from anywhere but the environment; never store or print them.
- Never mix bindings: separate directories, commands, toolchains and outputs.
- Failures of class `application` are reported, not healed; never create bugs here.

## Output

Per binding: runs with outcome, durations, failure class and evidence paths; report
path; validation results; hand-offs to `self-healing` (run IDs). Then STOP.
