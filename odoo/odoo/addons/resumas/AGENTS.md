# Odoo 20 & OWL 3 Agent Rules

This file serves as a memory/knowledge base for any AI agents working on this project, detailing the critical architectural changes in Odoo 20 and OWL 3 encountered during development.

## 1. XML Views (`<tree>` vs `<list>`)
In Odoo 20, the `<tree>` tag has been deprecated/renamed.
*   **Before:** `<tree string="Resumes">`
*   **Now:** `<list string="Resumes">`
*   The `view_mode` attribute in window actions must also be updated to `view_mode="list,form"` instead of `tree,form`.

## 2. Permissions and Security (`ir.access.csv`)
Odoo 20 abandoned the classic `security/ir.model.access.csv` file format.
*   **New file name:** `security/ir.access.csv`
*   **New header format:** `id,name,model_id,group_id/id,operation,domain`
*   **New values:**
    *   The `model_id` now takes the raw model name (e.g., `resumas.resume`) instead of the previous `model_` prefix syntax.
    *   The 4 boolean permission columns (`perm_read, perm_write, perm_create, perm_unlink`) were merged into a single `operation` string column (e.g., `crud` for full access, `ru` for read/unlink, `cru` for create/read/update).

## 3. OWL 3 Components (Frontend / JS)
Odoo 20 upgraded its frontend framework to **OWL 3**, breaking compatibility with several OWL 2 patterns (Odoo 16/17):

*   **No more Static Props:** Do NOT use `MyWidget.props = {...}`. You must now use the `useProps` hook inside the class definition.
*   **Removal of `useState`:** The `useState` hook was completely removed from the `@odoo/owl` exports in Odoo 20. For reactive state, you MUST use the `proxy` hook:
    ```javascript
    import { Component, proxy } from "@odoo/owl";
    this.modelState = proxy({ count: 0 }); // DO NOT name it `state` (reserved).
    ```
*   **Removal of `useRef`:** `useRef` was completely removed. For DOM references, import `signal` and use `signal.ref()`. Also, the XML binding takes the signal directly via `this`.
    ```javascript
    import { signal } from "@odoo/owl";
    this.myListRef = signal.ref();
    ```
    ```xml
    <div t-ref="this.myListRef">...</div>
    ```
*   **Strict `t-model`:** In OWL 3, `t-model` strictly expects a simple signal or a function with a `set` method. Using `t-model` on deep `proxy` nested object properties throws `OwlError: Invalid t-model expression`.
    *   *Solution:* Use manual two-way binding with `t-att-value` and `t-on-change`:
        ```xml
        <input type="text" t-att-value="skill.name" t-on-change="(ev) => { skill.name = ev.target.value; this.updateJson(); }"/>
        ```

## 4. Sortable.js / Drag and Drop in Odoo 20
Odoo exposes a native OWL hook for Sortable.js via `@web/core/utils/sortable_owl`.
*   **Setup:**
    ```javascript
    import { useSortable } from "@web/core/utils/sortable_owl";
    useSortable({
        ref: this.myListRef, // the signal.ref()
        elements: ".drag-item",
        handle: ".drag-handle",
        onDrop: ({ element, previous }) => { /* ... move logic ... */ }
    });
    ```
*   **XML Requirements:**
    *   Container must have `t-ref="this.myListRef"`.
    *   Iterated items must have `class="... drag-item"` and `t-att-data-index="item_index"`.
    *   The drag icon/trigger must have `class="... drag-handle"`.

## 5. Architectural Patterns
*   **Clean Architecture (Use Cases):** Keep Odoo Controllers strictly for HTTP parsing. Business logic (like rendering complex data or generating formats) belongs in `use_cases/` directory.
    *   Example: `/resumas/resume_render/<id>/html` instantiates `RenderResumeHTMLUseCase(request.env)` and returns the HTML.
*   **PDF Generation:** To generate a PDF programmatically without saving an attachment record, use Odoo's internal engine:
    ```python
    pdf_content, _ = request.env['ir.actions.report'].sudo()._run_pdf_engine(
        engine_name='wkhtmltopdf',
        html=html_string
    )
    ```
*   **Iconify over FontAwesome:** For cleaner widget interfaces independent of Odoo's font-awesome version, use Iconify SVGs directly:
    ```xml
    <img src="https://api.iconify.design/mdi:drag.svg?color=%23adb5bd" width="24" height="24"/>
    ```
