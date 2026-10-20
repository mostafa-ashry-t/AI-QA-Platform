# Assignment text (verbatim source)

> **Source record, not an artifact.** This file holds the assignment text exactly as
> the user supplied it. It was copied programmatically, not retyped.
>
> | Field | Value |
> |---|---|
> | Supplied in | User request of 2026-09-29T09:39:21.446Z (Claude Code session c19aceb8-92d5-47b3-ac42-f64ef63fb6bf, transcript line 3, record f0cc8a12-1ccc-4103-9f64-0afb3b2aba7c) |
> | Extract | The section from "CURRENT ASSIGNMENT" up to, but not including, "REUSABLE TASK MODEL". The rest of that request describes the QA platform itself, not the assignment. |
> | Full request SHA-256 | 566b1f6a1c996d781f093b347bc320cb8ea3bc29358dd58c575737a7104c5c6c |
> | Extract SHA-256 | f288dc9ebb30fde7bdebc155ea9aed5dbc183495c2dd9fc4b892c0c4dd1dc234 (the text between the two markers below) |
> | Copied at | 2026-10-14T09:16:50.257Z |
>
> The user's request of 2026-10-14T09:13:58.080Z referred to an "attached UI and API Task
> assignment". No attachment was received, and no other copy was found. This text
> is therefore the only available statement of the assignment.

<!-- BEGIN VERBATIM -->
==================================================
CURRENT ASSIGNMENT
==================================================

The first project to validate the platform against is OrangeHRM.

UI:
https://opensource-demo.orangehrmlive.com/

API:
https://api.orangehrm.com/

The assignment requires these milestones:

Milestone 1:
Generate PRD using AI.
Input: Project URL
Output: PRD Markdown file.

Milestone 2:
Explore UI and API.
Input:
- Project URL
- PRD
- Selected coverage scope
Output:
- Exploration findings Markdown file.

Milestone 3:
Generate test cases CSV and review the correctness of the test suite.
The test design must contain:
- Valid in Scope
- Needs Automation

Milestone 4:
Execute ONLY test cases where:
Valid in Scope = TRUE

Generate an HTML execution report including bug reporting.

Milestone 5:
Generate Playwright automation ONLY for test cases where:
Needs Automation = TRUE

Run the automation using Claude and IntelliJ.

If automation requires healing/fixing:
- perform controlled healing
- document every healing attempt
- document the reason
- document the change
- document the result

Final deliverables:
- Excel milestone summary
- HTML workflow/sequence diagram
- PRD.md
- Exploration.md
- Test Design CSV
- Agent execution HTML report
- Playwright automation
- Automation execution HTML report
- Healing/fixing documentation
<!-- END VERBATIM -->
