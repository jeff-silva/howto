# Skill: ATS Adherence

Calculates the ATS adherence score (0 to 100) between a job position and a resume, returning a structured JSON for reuse by other prompts or steps.

## Input Parameters
- `position_file`: path to the job position file (e.g., `curriculum/02-position.md`)
- `curriculum_file`: path to the resume file (e.g., `curriculum/01-curriculum.json`)
- `output_file` *(optional)*: path to save the resulting JSON (e.g., `curriculum/output/adherence.json`)

## Rules
1. Read `position_file` and `curriculum_file` completely from disk before calculating.
2. Evaluate required skills, nice-to-haves, seniority, tech stack, and language requirements.
3. Return **only** valid JSON (no extra prose or markdown fences when saving to a file) in the format below.

## Output Format (JSON)
```json
{
  "percentage": 0,
  "weak_points": [
    "reason 1 why the resume did not reach 100%",
    "reason 2 why the resume did not reach 100%"
  ]
}
```
