# Skill: LinkedIn Easy Apply Automation

Automates the end-to-end LinkedIn Easy Apply workflow using `/browser` and `curriculum/00-action.md`, while strictly preserving truthfulness and pausing for user review before submitting.

## Prerequisites
- Chrome running in WSL2/Linux (`google-chrome &`) with remote debugging enabled (`chrome://inspect/#remote-debugging`) and an active LinkedIn session.
- Base resume at `curriculum/01-curriculum.json` (including `meta.info` for personal defaults).

## Step-by-Step Workflow

1. **Load Candidate Profile**
   - Read `curriculum/01-curriculum.json` completely, including `basics`, `work` (check the latest `endDate` to know if currently employed), `skills`, `languages`, and `meta.info` (e.g., PCD status, salary expectations).

2. **Analyze Open Job Listings**
   - Use `/browser` on the currently open LinkedIn jobs tab. If not already open, navigate to:
     `https://www.linkedin.com/jobs/search/?keywords=full%20stack&f_TPR=r86400&f_AL=true`
   - List visible Easy Apply jobs and recommend the best-matching job(s) based on tech stack, remote/location compatibility, and English level (`B1`).

3. **Tailor Resume for Selected Job**
   - On the LinkedIn search split-pane, click the job card in the left list (do **not** navigate away to `/jobs/view/...` so the job list stays visible), click **See more** / **Ver mais** in the right pane, extract the full description, and save it to `curriculum/02-position.md`.
   - Execute `curriculum/00-action.md` to generate the tailored `curriculum/output/jeferson-silva.pdf`.

4. **Fill Easy Apply Form**
   - Click **Easy Apply** on the job page.
   - Fill contact info from `basics` and upload `curriculum/output/jeferson-silva.pdf`.
   - Ensure form inputs trigger `input`, `change`, and `blur` events (or type directly) so LinkedIn validation registers all filled fields.
   - Answer form questions using `01-curriculum.json` and `meta.info`, acting as an HR & ATS specialist to maximize adherence (e.g., update pre-filled `0` values to the candidate's real years of experience when present in the resume):
     - **Referral:** Default to **No** unless the user explicitly specifies a referrer.
     - **Current company:** If the latest `work` entry has an `endDate` in the past, fill `"Não estou trabalhando no momento"` (or equivalent).
     - **Unknown personal questions:** Pause and ask the user; offer to save reusable answers in `meta.info` inside `curriculum/01-curriculum.json`.

5. **Review & Submit**
   - At the **Review your application** screen, verify all filled fields and click `Submit application` automatically (do not pause for confirmation unless there is an unanswered question or CAPTCHA).
   - After submitting, click **"Not now"** on the follow-up dialog that appears, return to the last job search list URL (`https://www.linkedin.com/jobs/search/?keywords=full%20stack&f_TPR=r86400&f_AL=true` or the previous list URL), and report a concise summary of the submitted application.
