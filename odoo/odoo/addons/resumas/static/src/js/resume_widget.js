/** @odoo-module **/

import { registry } from "@web/core/registry";
import { standardFieldProps } from "@web/views/fields/standard_field_props";
import { useSortable } from "@web/core/utils/sortable_owl";
import { Component, proxy, onWillUpdateProps, useProps, signal } from "@odoo/owl";

export const resumeWidgetProps = {
    ...standardFieldProps,
};

export class ResumeWidget extends Component {
    static template = "resumas.ResumeWidget";
    props = useProps(resumeWidgetProps);

    setup() {
        this.modelState = proxy({
            resume: this.parseValue(this.props.record.data[this.props.name])
        });

        onWillUpdateProps((nextProps) => {
            if (nextProps.record.data[this.props.name] !== this.props.record.data[this.props.name]) {
                this.modelState.resume = this.parseValue(nextProps.record.data[nextProps.name]);
            }
        });

        const sections = ['profiles', 'work', 'education', 'skills', 'languages', 'projects'];
        this.listRefs = {};
        for (const sec of sections) {
            this.listRefs[sec] = signal.ref();
            useSortable({
                ref: this.listRefs[sec],
                handle: ".drag-handle",
                elements: ".drag-item",
                cursor: "grabbing",
                onDrop: ({ element, previous }) => {
                    const fromIdx = parseInt(element.dataset.index, 10);
                    const toIdx = previous ? parseInt(previous.dataset.index, 10) : -1;
                    this.moveItem(sec, fromIdx, toIdx);
                }
            });
        }
    }

    getDefaultResume() {
        return {
            basics: { location: {}, profiles: [] },
            work: [],
            volunteer: [],
            education: [],
            awards: [],
            certificates: [],
            publications: [],
            skills: [],
            languages: [],
            interests: [],
            references: [],
            projects: []
        };
    }

    mergeWithDefault(parsed) {
        const def = this.getDefaultResume();
        if (parsed.basics) {
            def.basics = { ...def.basics, ...parsed.basics };
            if (!def.basics.location) def.basics.location = {};
            if (!def.basics.profiles) def.basics.profiles = [];
        }
        for (const key of ['work', 'volunteer', 'education', 'awards', 'certificates', 'publications', 'skills', 'languages', 'interests', 'references', 'projects']) {
            if (parsed[key] && Array.isArray(parsed[key])) {
                def[key] = parsed[key];
            }
        }
        return def;
    }

    parseValue(val) {
        if (!val) return this.getDefaultResume();
        try {
            const parsed = typeof val === 'string' ? JSON.parse(val) : val;
            return this.mergeWithDefault(parsed);
        } catch (e) {
            return this.getDefaultResume();
        }
    }

    updateJson() {
        // Enforce the object back to the field as a formatted string
        // so the Monaco Code Editor widget can display it correctly without showing [object Object]
        this.props.record.update({ [this.props.name]: JSON.stringify(this.modelState.resume, null, 2) });
    }

    addItem(section) {
        let newItem = {};
        switch(section) {
            case 'profiles': newItem = { network: '', username: '', url: '' }; break;
            case 'work': newItem = { name: '', position: '', url: '', startDate: '', endDate: '', summary: '', highlights: [] }; break;
            case 'volunteer': newItem = { organization: '', position: '', url: '', startDate: '', endDate: '', summary: '', highlights: [] }; break;
            case 'education': newItem = { institution: '', url: '', area: '', studyType: '', startDate: '', endDate: '', score: '', courses: [] }; break;
            case 'awards': newItem = { title: '', date: '', awarder: '', summary: '' }; break;
            case 'certificates': newItem = { name: '', date: '', issuer: '', url: '' }; break;
            case 'publications': newItem = { name: '', publisher: '', releaseDate: '', url: '', summary: '' }; break;
            case 'skills': newItem = { name: '', level: '', keywords: [] }; break;
            case 'languages': newItem = { language: '', fluency: '' }; break;
            case 'interests': newItem = { name: '', keywords: [] }; break;
            case 'references': newItem = { name: '', reference: '' }; break;
            case 'projects': newItem = { name: '', startDate: '', endDate: '', description: '', url: '', highlights: [] }; break;
        }

        if (section === 'profiles') {
            this.modelState.resume.basics.profiles.push(newItem);
        } else {
            this.modelState.resume[section].push(newItem);
        }
        this.updateJson();
    }

    removeItem(section, index) {
        if (section === 'profiles') {
            this.modelState.resume.basics.profiles.splice(index, 1);
        } else {
            this.modelState.resume[section].splice(index, 1);
        }
        this.updateJson();
    }

    cloneItem(section, index) {
        let list = section === 'profiles' ? this.modelState.resume.basics.profiles : this.modelState.resume[section];
        let cloned = JSON.parse(JSON.stringify(list[index]));
        list.splice(index + 1, 0, cloned);
        this.updateJson();
    }

    moveItem(section, fromIndex, toIndex) {
        let list = section === 'profiles' ? this.modelState.resume.basics.profiles : this.modelState.resume[section];
        if (toIndex === -1) {
            // Moved to the very top
            const item = list.splice(fromIndex, 1)[0];
            list.unshift(item);
        } else {
            const item = list.splice(fromIndex, 1)[0];
            // If fromIndex < toIndex, moving down means we insert at toIndex because the array shrunk by 1
            const adjustedToIndex = fromIndex < toIndex ? toIndex : toIndex + 1;
            list.splice(adjustedToIndex, 0, item);
        }
        this.updateJson();
    }
    
    // Helper to stringify/parse arrays like highlights, courses, keywords
    getArrayAsString(arr) {
        if (!arr || !Array.isArray(arr)) return "";
        return arr.join("\n");
    }
    
    setArrayFromString(obj, key, val) {
        if (!val) {
            obj[key] = [];
        } else {
            obj[key] = val.split("\n").map(s => s.trim()).filter(s => s);
        }
        this.updateJson();
    }
}

registry.category("fields").add("json_resume_builder", {
    component: ResumeWidget,
    supportedTypes: ["json", "text", "char"],
});
