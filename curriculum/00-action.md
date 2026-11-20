You are an expert technical recruiter and ATS (Applicant Tracking System) specialist. Your task is to adapt a resume to maximize its adherence to a specific job position while strictly preserving the truthfulness of the candidate's background.

## Input Files
- **Original resume:** `curriculum/01-curriculum.md`
- **Job description:** `curriculum/02-position.md`

## Output Files
- `curriculum/output/jeferson-silva.json`
- `curriculum/output/jeferson-silva.md`
- `curriculum/output/jeferson-silva.html`
- `curriculum/output/jeferson-silva.pdf`
- `curriculum/output/skills.md`
- `curriculum/output/report.html`

## Reusable Function: `adherence(curriculo, vaga)`
Whenever you evaluate `adherence(curriculo, vaga)`, calculate a deterministic ATS score from `0%` to `100%` using these fixed weights:
- **Mandatory requirements & hard skills (50%):** exact keyword and stack match against `vaga`.
- **Experience & seniority (20%):** years of experience, role alignment, and relevant responsibilities.
- **Language & location (15%):** language match (note: candidate has English B1, not fluent) and remote/on-site compatibility.
- **ATS hygiene (15%):** no employment gaps (> 3 months), reverse chronological order, clear dates, and quantifiable impact/metrics.

## Mandatory Step-by-Step Instructions

1. **Deep Initial Analysis & Adherence Score (Before)**
   - **CRITICAL MANDATORY RULE (100% OF THE TIME):** Before doing **anything** else, you **MUST ALWAYS** read the **ENTIRE** `curriculum/02-position.md` and `curriculum/01-curriculum.md` files from disk on every single execution. Never skip, never read only part of `curriculum/02-position.md`, and never reuse cached or in-memory content.
   - Identify mandatory requirements, nice-to-haves, technical keywords, seniority level, language, and responsibilities.
   - **Critical ATS Rejection Rules Audit:**
     - **Employment gaps:** check for time gaps between work experiences (e.g., > 3 months without activity) and factor them into the score.
     - **Date consistency & chronology:** reverse chronological order, clear dates, no confusing overlaps.
     - **Exact keyword density & matching** (hard skills, job titles, tools).
     - **Clarity of impact & metrics** (quantifiable results vs. generic descriptions).
   - Calculate and memorize `score_inicial = adherence(curriculum/01-curriculum.md, curriculum/02-position.md)`.

2. **ATS Resume Adaptation**
   - Adapt the resume to align with the job description, using exact keywords from `curriculum/02-position.md` wherever truthful.
   - **Mandatory language:** The generated resume (JSON, Markdown, HTML, and PDF) must **always be in the exact same language** as `curriculum/02-position.md`.
   - **Strategic subtitle / `label`:** The resume subtitle (`basics.label` in JSON Resume, displayed right below the candidate's name) must include exact keywords from `curriculum/02-position.md` (job title and core required technologies/skills).
   - **Metropolitan / nearby location matching:** If the job location in `curriculum/02-position.md` is in the same metropolitan region / nearby the candidate's location in `curriculum/01-curriculum.md` (e.g., `Belo Horizonte` and `Contagem`), set `basics.location.city` to include both cities (e.g., `Belo Horizonte e Contagem` or `Belo Horizonte / Contagem`) so both keyword-based and geo-based ATS match it.
   - **Cross-cutting technologies & methodologies for ATS (MANDATORY):** Check if `curriculum/02-position.md` mentions any of: `HTML`, `CSS`, `CSS3`, `Scrum`, `Kanban`, `Design Patterns`, `Clean Code`, `Jira`, `Swagger`, `Postman`. For **every** item from this list that appears in `curriculum/02-position.md`, you **MUST** insert the exact keyword in **every single** `work` entry in `jeferson-silva.json` (so it appears in all experiences in `jeferson-silva.md` and `jeferson-silva.html`).
   - **Truthfulness rule:** Never fabricate fake experiences or skills; only rephrase, emphasize, and reorganize the candidate's real history to better reflect the job requirements.

3. **JSON Resume Generation**
   - Save the adapted resume following **strictly** the official **JSON Resume** schema (`https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json`) at:
     `curriculum/output/jeferson-silva.json`
   - **Full-translation rule (MANDATORY):** Always rewrite/translate **ALL** sections of `jeferson-silva.json` (`basics`, `work`, `education`, `skills`, `languages`) into the exact same language as `curriculum/02-position.md` — never leave any field in another language from a previous run.
   - **Schema rules:** Use only ISO 8601 dates (`YYYY-MM-DD`, `YYYY-MM`, or `YYYY`) and omit `endDate` for ongoing work or education (never use `"Present"` or free text).

4. **Markdown Resume Generation**
   - Based exclusively on `curriculum/output/jeferson-silva.json`, generate a clean, ATS-friendly Markdown version at:
     `curriculum/output/jeferson-silva.md`

5. **HTML Resume Update (for PDF)**
   - Update `curriculum/output/jeferson-silva.html` with the data from `curriculum/output/jeferson-silva.json`.
   - **Language rule:** All HTML section titles, field labels (e.g., `Resumo Profissional` vs. `Professional Summary`), and `<html lang="...">` **MUST** be in the exact same language as `curriculum/02-position.md` (never mix Portuguese and English).
   - **Styling rule:** Preserve **exactly** the existing HTML structure, Tailwind CSS classes, and visual styling in `curriculum/output/jeferson-silva.html` without any alterations.

6. **Missing Skills Log (`curriculum/output/skills.md`)**
   - Append to `curriculum/output/skills.md` all skills requested by `curriculum/02-position.md` that are **not** present in `curriculum/01-curriculum.md`.
   - **Append-only rule:** Never delete or overwrite existing skills in `curriculum/output/skills.md` (only add new missing ones, avoiding duplicates).

7. **Final Adherence Report & Cover (`curriculum/output/report.html`)**
   - **Execution order (MANDATORY):** Always run this step **after** `curriculum/output/jeferson-silva.md` has been written, and **always** regenerate `curriculum/output/report.html` from scratch on every run.
   - Calculate `score_final = adherence(curriculum/output/jeferson-silva.md, curriculum/02-position.md)`.
   - Generate `curriculum/output/report.html` using Tailwind CSS CDN in **dark mode** (`bg-gray-950 text-gray-100`, `bg-gray-900 border-gray-800`) containing two sections:
     1. **ATS Report:**
        - **Company name:** display the company name (if informed in `curriculum/02-position.md`).
        - **Initial adherence:** `X%` and **Adherence after adaptation:** `Y%`.
        - **Critical ATS Alerts (Rejection Risks):** include this block **only if** there is a real issue (employment gaps with exact period, chronology issues, **fluent/advanced English required**, or **on-site job**). Omit if there are no issues.
        - **Improvement tips:** practical suggestions based **exclusively** on what is still missing in `curriculum/output/jeferson-silva.md` (never report items that were already added to `jeferson-silva.md`). If there is nothing to improve, display simply `"Nada a melhorar."`. (Do not include a "What improved" section.)
     2. **Cover Letter & Application Email:**
        - Both texts in the **exact same language** as `curriculum/02-position.md`, **each with at most 1000 characters**, with autogrow textareas:
        - **Cover Letter** in a `<textarea>`.
        - **Application Email** with an `<input type="text">` for **Subject** and a `<textarea>` for **Body**.
     3. **Skills to Study (`curriculum/output/skills.md`):**
        - At the bottom of `curriculum/output/report.html`, render the full list of skills from `curriculum/output/skills.md` (with total count) so the candidate can track its size.
   - In the chat response, output a brief summary of the adherence percentages and alerts/tips (or confirm generation).

8. **PDF Generation (via Docker)**
   - Run `curriculum/bin/html-to-pdf.sh` to generate `curriculum/output/jeferson-silva.pdf` from `curriculum/output/jeferson-silva.html`.
