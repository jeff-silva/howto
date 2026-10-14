/** @odoo-module **/

import { SearchModel } from "@web/search/search_model";
import { SearchBar } from "@web/search/search_bar/search_bar";
import { patch } from "@web/core/utils/patch";
import { Domain } from "@web/core/domain";
import { useService } from "@web/core/utils/hooks";
import { onWillStart } from "@odoo/owl";

// 1. Patch SearchModel to inject our department into the domain
patch(SearchModel.prototype, {
    cappSelectedDepartment: null,
    isCappProductionView: false,

    async load(config) {
        if (config.resModel === "capp.badge.order") {
            this.isCappProductionView = !!(config.context && config.context.capp_production_view);
        } else {
            this.isCappProductionView = false;
        }

        if (this.isCappProductionView && !this.cappSelectedDepartment) {
            try {
                const depts = await this.orm.searchRead("capp.department", [], ["id"], { limit: 1, order: "id" });
                if (depts && depts.length > 0) {
                    this.cappSelectedDepartment = depts[0].id;
                }
            } catch (e) {
                console.error(e);
            }
        }
        return super.load(...arguments);
    },

    _getDomain(params = {}) {
        let domain = super._getDomain(...arguments);
        if (this.isCappProductionView && this.cappSelectedDepartment) {
            const extraDomain = new Domain([["department_id", "=", this.cappSelectedDepartment]]);
            if (params.raw) {
                return Domain.and([domain, extraDomain]);
            } else {
                return Domain.and([new Domain(domain), extraDomain]).toList(this.domainEvalContext);
            }
        }
        return domain;
    }
});

// 2. Patch SearchBar to load and handle the department dropdown
patch(SearchBar.prototype, {
    setup() {
        super.setup(...arguments);
        this.orm = useService("orm");
        this.cappDepartments = [];

        onWillStart(async () => {
            if (this.env.searchModel.isCappProductionView) {
                const depts = await this.orm.searchRead("capp.department", [], ["id", "display_name"], { order: "id" });
                this.cappDepartments = depts;
                
                // Select first by default if nothing is selected
                if (depts.length > 0 && !this.env.searchModel.cappSelectedDepartment) {
                    this.env.searchModel.cappSelectedDepartment = depts[0].id;
                }
            }
        });
    },

    onCappDepartmentChange(ev) {
        const deptId = parseInt(ev.target.value, 10);
        this.env.searchModel.cappSelectedDepartment = deptId;
        // Trigger a reload of the view!
        this.env.searchModel._notify();
    }
});
