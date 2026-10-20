We are continuing the existing AI-QA-Platform project. Do not rebuild the project from scratch.

## Objective
Record and implement the architecture decision that **Test Review is a mandatory workflow stage** before both Manual Execution and Automation Generation.

## 1. Audit Before Editing
Inspect the existing:
- `CLAUDE.md` and `README.md`
- `platform/workflows/default-qa-workflow.yaml`
- `platform/registry/skills.yaml`
- `platform/schemas/`
- Existing implemented Skills, their prompts, templates, and journal event formats
- Architecture documentation under `docs/architecture/`

Use the actual repository contents as the source of truth. Do not assume paths or schemas exist without checking them.

## 2. Mandatory Workflow
The intended lifecycle is:

Task Creation → PRD Generation → PRD Approval → Project Context → Project Context Approval → Exploration → Exploration Approval → Test Design → Test Review → Manual Execution → Automation Generation → Automation Execution → Self-Healing when needed → Reporting.

Preserve any existing approval gates and run-ID rules. Do not invent approval keys; inspect the current conventions and document any proposed changes.

## 3. Test Review Rules
- Test Review is mandatory for every task before execution can proceed.
- Manual Execution must depend on an approved Test Review.
- Automation Generation must also depend on the same approved Test Review.
- Neither stage may bypass Test Review, even if test cases already exist.
- Test Review must validate the test cases against the approved Project Context and Exploration findings.
- It must identify missing coverage, duplicates, unclear steps, invalid expected results, missing preconditions, and unsupported assumptions.
- Requested changes must be recorded and resolved before approval.
- Approval must be explicit, traceable, and tied to the exact reviewed artifact version or hash.
- Editing the reviewed artifact after approval must invalidate the approval.
- A blocked or unapproved review must prevent downstream execution and automation generation.
- Do not silently modify test cases during review. Record proposed changes and their reasons.

## 4. Dual Automation Frameworks
Preserve support for both:
- Playwright Test with TypeScript.
- SHAFT Engine + Selenium WebDriver + Java 21 + TestNG + Maven.

Do not generate or execute automation code in this task. Do not change the framework-selection architecture unless a verified conflict requires it; report such conflicts separately.

## 5. HTML Journal Requirements
Document this architecture decision so the future bilingual Arabic/English HTML Journal can show:
- The exact user decision and the prompt used to implement it.
- Files inspected, created, or modified.
- The workflow before and after the change.
- Validation checks and their actual results.
- Errors, fixes, assumptions, and unresolved questions.
- The effect of this decision on Manual Execution and Automation Generation.

Do not fabricate journal events or claim that the HTML page already exists. Follow the project's existing journal and prompt-versioning conventions.

## 6. Implementation Scope
Make only the minimum necessary changes to enforce the mandatory Test Review gate and keep the architecture documentation consistent.

Do not implement the orchestration runner, HTML renderer, or new Skills in this task.

Do not run tests against the real application. Use only relevant local structural, schema, and workflow validation.

## 7. Validation
After editing:
- Verify the workflow dependencies and ordering.
- Verify that Manual Execution cannot start without an approved Test Review.
- Verify that Automation Generation cannot start without the same approval.
- Verify stale approvals are rejected after the reviewed artifact changes.
- Verify existing schema, registry, prompt-versioning, and journal conventions remain consistent.
- Report the exact checks executed and their actual outcomes.

## 8. Final Response
Provide:
1. Files inspected.
2. Files created or modified.
3. The final workflow and its mandatory gates.
4. Validation results.
5. Remaining conflicts or decisions requiring my input.
6. A proposed next implementation step.

Stop after this task. Do not proceed to the next stage automatically.
