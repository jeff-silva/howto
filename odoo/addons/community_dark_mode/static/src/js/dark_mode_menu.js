/** @odoo-module **/

document.head.appendChild(
  Object.assign(document.createElement("style"), {
    innerHTML: `
      @import url('https://cdn.jsdelivr.net/npm/bootswatch@5.3.8/dist/flatly/bootstrap.min.css');

      .o_web_client, .o_action_manager, .o_content, 
      .o_form_view, .o_list_view, .o_kanban_view, 
      .o_view_controller, .o_cp_controller, .o_control_panel,
      .modal-content, .dropdown-menu, .o_kanban_record,
      table.table {
          background-color: var(--bs-body-bg) !important;
          color: var(--bs-body-color) !important;
          border-color: var(--bs-border-color) !important;
      }
      .o_main_navbar {
          background-color: var(--bs-primary) !important;
      }
      .o_list_view th {
          background-color: var(--bs-dark) !important;
          color: var(--bs-light) !important;
      }

      .o_menu_sections, .o_menu_systray {
        gap: 4px;
      }
    `,
  })
);
