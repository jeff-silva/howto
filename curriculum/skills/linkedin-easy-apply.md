# Skill: LinkedIn Easy Apply Automation

Automates the end-to-end LinkedIn Easy Apply workflow using `/browser` and `curriculum/00-action.md`, while strictly preserving truthfulness and pausing for user review before submitting.

## Prerequisites
- Chrome running with remote debugging enabled and LinkedIn job search tab open.
- Base resume at `curriculum/01-curriculum.json` (including `meta.info` for personal defaults).

## Step-by-Step Workflow

1. **Load Candidate Profile**
   - Read `curriculum/01-curriculum.json` completely, including `basics`, `work` (check the latest `endDate` to know if currently employed), `skills`, `languages`, and `meta.info` (e.g., PCD status, salary expectations).

2. **Analyze Open Job Listings**
   - Use `/browser` on the currently open LinkedIn jobs tab. If not already open, navigate to:
     `https://www.linkedin.com/jobs/search/?keywords=full%20stack&f_TPR=r86400&f_AL=true`
   - List visible Easy Apply jobs and recommend the best-matching job(s) based on tech stack, remote/location compatibility, and English level (`B1`).

3. **Tailor Resume for Selected Job**
   - Open the selected job, extract its full description, and save it to `curriculum/02-position.md`.
   - Execute `curriculum/00-action.md` to generate the tailored `curriculum/output/jeferson-silva.pdf`.

4. **Fill Easy Apply Form**
   - Click **Easy Apply** on the job page.
   - Fill contact info from `basics` and upload `curriculum/output/jeferson-silva.pdf`.
   - Answer form questions using `01-curriculum.json` and `meta.info`:
     - **Referral:** Default to **No** unless the user explicitly specifies a referrer.
     - **Current company:** If the latest `work` entry has an `endDate` in the past, fill `"Não estou trabalhando no momento"` (or equivalent).
     - **Unknown personal questions:** Pause and ask the user; offer to save reusable answers in `meta.info` inside `curriculum/01-curriculum.json`.

5. **Review & Submit**
   - Stop at the **Review your application** screen — **never** click `Submit application` without explicit user approval.
   - Present a concise summary of all filled fields to the user.
   - Once approved, click `Submit application`, then click **"Not now"** on the follow-up dialog that appears after submission.
