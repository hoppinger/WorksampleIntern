"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Immutable = require("immutable");
const Api = require("../generated_api");
const Buttons = require("../containers/button_utils");
const Permissions = require("./permissions");
const Utils = require("./view_utils");
const i18next = require("i18next");
const CourseViews = require("./Course");
function existing_HomePage_HomePage_Course_page_index(self) {
    return !self.state.existing_Course || self.state.existing_Course == "saving" ? 0 : self.state.existing_Course.PageIndex;
}
exports.existing_HomePage_HomePage_Course_page_index = existing_HomePage_HomePage_Course_page_index;
function existing_HomePage_HomePage_Course_page_size(self) {
    return !self.state.existing_Course || self.state.existing_Course == "saving" ? 25 : self.state.existing_Course.PageSize;
}
exports.existing_HomePage_HomePage_Course_page_size = existing_HomePage_HomePage_Course_page_size;
function existing_HomePage_HomePage_Course_num_pages(self) {
    return !self.state.existing_Course || self.state.existing_Course == "saving" ? 1 : self.state.existing_Course.NumPages;
}
exports.existing_HomePage_HomePage_Course_num_pages = existing_HomePage_HomePage_Course_num_pages;
function HomePage_HomePage_Course_page_index(self) {
    return self.state.Course == "loading" ? 0 : self.state.Course.PageIndex;
}
exports.HomePage_HomePage_Course_page_index = HomePage_HomePage_Course_page_index;
function HomePage_HomePage_Course_page_size(self) {
    return self.state.Course == "loading" ? 25 : self.state.Course.PageSize;
}
exports.HomePage_HomePage_Course_page_size = HomePage_HomePage_Course_page_size;
function HomePage_HomePage_Course_num_pages(self) {
    return self.state.Course == "loading" ? 1 : self.state.Course.NumPages;
}
exports.HomePage_HomePage_Course_num_pages = HomePage_HomePage_Course_num_pages;
function load_relations_HomePage(self, callback) {
    Permissions.can_view_Course() && Api.get_HomePage_HomePage_Courses(self.props.entity, HomePage_HomePage_Course_page_index(self), HomePage_HomePage_Course_page_size(self)).then(Courses => self.setState(Object.assign({}, self.state, { update_count: self.state.update_count + 1, Course: Utils.raw_page_to_paginated_items(i => {
            return {
                element: i,
                size: self.state.Course != "loading" && self.state.Course.Items.has(i.Id) ? self.state.Course.Items.get(i.Id).size : "preview",
                shown_relation: "all"
            };
        }, Courses) })), callback);
}
exports.load_relations_HomePage = load_relations_HomePage;
function set_size_HomePage(self, new_size) {
    self.props.set_size(new_size, () => {
        if (new_size == "fullscreen")
            self.props.push(exports.HomePage_to_page(self.props.entity.Id));
        else if (new_size != "preview")
            load_relations_HomePage(self);
    });
}
exports.set_size_HomePage = set_size_HomePage;
function render_editable_attributes_minimised_HomePage(self) {
    let attributes = (React.createElement("div", null));
    return attributes;
}
exports.render_editable_attributes_minimised_HomePage = render_editable_attributes_minimised_HomePage;
function render_editable_attributes_maximised_HomePage(self) {
    let attributes = (React.createElement("div", null));
    return attributes;
}
exports.render_editable_attributes_maximised_HomePage = render_editable_attributes_maximised_HomePage;
function render_breadcrumb_HomePage(self) {
    return React.createElement("div", { className: "breadcrumb-homepage" }, "\"HomePage\"");
}
exports.render_breadcrumb_HomePage = render_breadcrumb_HomePage;
function render_menu_HomePage(self) {
    return React.createElement("div", { style: { float: "left", position: "fixed", top: "0", left: "0", width: "15%", height: "100%", backgroundColor: "lightgray" }, className: "menu" },
        React.createElement("div", { className: "logo", style: { textAlign: "center" } },
            React.createElement("img", { className: "logo", style: { display: "inline-block", width: "50%" }, src: "/images/logo.png", alt: "Logo" })),
        React.createElement("div", { className: "pages" },
            !Permissions.can_view_HomePage() ? null :
                React.createElement("div", { className: `menu_entry page_link active-page` },
                    React.createElement("a", { style: { pointerEvents: "none" }, onClick: () => Api.get_HomePages(0, 1).then(e => e.Items.length > 0 && self.props.set_page(exports.HomePage_to_page(e.Items[0].Item.Id))) }, i18next.t('HomePage'))),
            React.createElement("div", { className: "menu_entries" }, !Permissions.can_view_Course() ? null :
                React.createElement("div", { className: `menu_entry${self.props.shown_relation == "HomePage_Course" ? " active" : ""}` },
                    React.createElement("a", { onClick: () => self.props.set_shown_relation("HomePage_Course") }, i18next.t('HomePage_Courses'))))));
}
exports.render_menu_HomePage = render_menu_HomePage;
function render_controls_HomePage(self) {
    return React.createElement("div", { className: "control" },
        self.props.allow_maximisation && self.props.set_size ? React.createElement("a", { className: "homepage control__button toggle-size", onClick: () => {
                set_size_HomePage(self, self.props.size == "preview" ? "large" : "preview");
            } },
            React.createElement("img", { className: "control__icon", src: self.props.size == "preview" ? "/images/icon-menu-down.svg" : "/images/icon-menu-up.svg", alt: "Toggle size" })) : null,
        Permissions.can_delete_HomePage() && self.props.size == "fullscreen" ? React.createElement("a", { className: "homepage control__button delete", onClick: () => confirm(i18next.t('Are you sure?')) &&
                Api.delete_HomePage(self.props.entity).then(() => self.props.pop()) },
            React.createElement("img", { className: "control__icon", src: "/images/icon-remove.svg", alt: "Delete" })) : null,
        self.props.toggle_button ? self.props.toggle_button() : null,
        self.props.unlink && self.props.mode != "view" ?
            React.createElement("a", { className: "homepage control__button unlink", onClick: () => self.props.unlink() },
                React.createElement("img", { className: "control__icon", src: "/images/icon-unlink.svg", alt: "Unlink" }))
            :
                null,
        self.props.delete && self.props.mode != "view" ?
            React.createElement("a", { className: "homepage control__button remove", onClick: () => self.props.delete() },
                React.createElement("img", { className: "control__icon", src: "/images/icon-remove.svg", alt: "Remove" }))
            :
                null);
}
exports.render_controls_HomePage = render_controls_HomePage;
function render_content_HomePage(self) {
    return React.createElement("div", { className: "model-content" }, Permissions.can_view_HomePage() ?
        self.props.size == "preview" ?
            render_preview_HomePage(self)
            : self.props.size == "large" ?
                render_large_HomePage(self)
                : self.props.size == "fullscreen" ?
                    render_large_HomePage(self)
                    : "Error: unauthorised access to entity."
        : "Error: unauthorised access to entity.");
}
exports.render_content_HomePage = render_content_HomePage;
function render_preview_HomePage(self) {
    let attributes = null;
    if (self.props.mode == "view" || !Permissions.can_edit_HomePage())
        attributes = (React.createElement("div", { className: "model__attributes" }));
    else
        attributes = render_editable_attributes_minimised_HomePage(self);
    return (React.createElement("div", { className: "block" }, attributes));
}
exports.render_preview_HomePage = render_preview_HomePage;
function render_large_HomePage(self) {
    let attributes = null;
    if (self.props.mode == "view" || !Permissions.can_edit_HomePage())
        attributes = (React.createElement("div", { className: "model__attributes" }));
    else
        attributes = render_editable_attributes_maximised_HomePage(self);
    return (React.createElement("div", { className: "block" },
        attributes,
        render_relations_HomePage(self)));
}
exports.render_large_HomePage = render_large_HomePage;
function render_relations_HomePage(self) {
    return React.createElement("div", { className: "relations" }, (self.props.shown_relation != "all" && self.props.shown_relation != "HomePage_Course") || !Permissions.can_view_Course() ? null :
        self.state.Course == "loading" ?
            React.createElement("div", { className: "loading" },
                i18next.t('Loading Course'),
                ".")
            :
                React.createElement("div", { className: "model-nested course" },
                    React.createElement("div", { className: "model-nested__head" }, i18next.t('Courses')),
                    React.createElement(Utils.Paginator, { PageIndex: self.state.Course.PageIndex, NumPages: self.state.Course.NumPages, page_selected: new_page_index => self.state.Course != "loading" &&
                            self.setState(Object.assign({}, self.state, { Course: Object.assign({}, self.state.Course, { PageIndex: new_page_index }) }), () => load_relations_HomePage(self)) }),
                    self.state.Course.Items.map((i, i_id) => React.createElement("div", { key: i_id, className: `model-nested__item` }, CourseViews.Course(Object.assign({}, self.props, { entity: i.element, nesting_depth: self.props.nesting_depth + 1, size: i.size, allow_maximisation: true, allow_fullscreen: true, mode: self.props.mode == "edit" && (Permissions.can_edit_HomePage_Course()
                            || Permissions.can_create_HomePage_Course()
                            || Permissions.can_delete_HomePage_Course())
                            && (self.state.Course != "loading" && self.state.Course.Editable.get(i_id)) ?
                            self.props.mode : "view", shown_relation: i.shown_relation, set_shown_relation: (new_shown_relation, callback) => self.state.Course != "loading" &&
                            self.setState(Object.assign({}, self.state, { Course: Object.assign({}, self.state.Course, { Items: self.state.Course.Items.set(i_id, Object.assign({}, self.state.Course.Items.get(i_id), { shown_relation: new_shown_relation })) }) }), callback), set_size: (new_size, callback) => {
                            let new_shown_relation = new_size == "large" ? "all" : i.shown_relation;
                            self.state.Course != "loading" &&
                                self.setState(Object.assign({}, self.state, { Course: Object.assign({}, self.state.Course, { Items: self.state.Course.Items.set(i_id, Object.assign({}, self.state.Course.Items.get(i_id), { size: new_size, shown_relation: new_shown_relation })) }) }), callback);
                        }, toggle_button: undefined, set_entity: (new_entity, callback, force_update_count_increment) => self.state.Course != "loading" &&
                            self.setState(Object.assign({}, self.state, { dirty_Course: self.state.dirty_Course.set(i_id, new_entity), update_count: force_update_count_increment ? self.state.update_count + 1 : self.state.update_count, Course: Object.assign({}, self.state.Course, { Items: self.state.Course.Items.set(i_id, Object.assign({}, self.state.Course.Items.get(i_id), { element: new_entity })) }) }), callback), unlink: undefined, delete: !Permissions.can_delete_Course() ?
                            null
                            :
                                () => confirm(i18next.t('Are you sure?')) && Api.delete_Course(i.element).then(() => load_relations_HomePage(self)) })))).valueSeq(),
                    React.createElement("div", null, Permissions.can_create_Course() && Permissions.can_create_HomePage_Course() ? render_new_HomePage_HomePage_Course(self) : null)));
}
exports.render_relations_HomePage = render_relations_HomePage;
function render_new_HomePage_HomePage_Course(self) {
    return self.props.mode == "edit" ?
        React.createElement("div", { className: "button__actions" },
            self.state.new_Course == "saving" ?
                null
                :
                    self.state.new_Course ?
                        React.createElement("div", { className: "overlay new-course-background" },
                            React.createElement("div", { className: "overlay__item overlay__item--new new-course" },
                                CourseViews.Course(Object.assign({}, self.props, { entity: self.state.new_Course, nesting_depth: self.props.nesting_depth + 1, size: "preview", mode: "edit", set_size: undefined, toggle_button: undefined, set_entity: (new_entity, callback, force_update_count_increment) => self.setState(Object.assign({}, self.state, { update_count: force_update_count_increment ? self.state.update_count + 1 : self.state.update_count, new_Course: new_entity }), callback), unlink: undefined, delete: undefined })),
                                React.createElement("div", { className: "button__actions" },
                                    React.createElement("button", { className: "button button--save button--inline", onClick: () => {
                                            if (self.state.new_Course && self.state.new_Course != "saving") {
                                                let new_Course = self.state.new_Course;
                                                self.setState(Object.assign({}, self.state, { new_Course: "saving" }), () => Api.create_Course().then(e => {
                                                    Api.update_Course(Object.assign({}, new_Course, { CreatedDate: e.CreatedDate, Id: e.Id })).then(() => load_relations_HomePage(self));
                                                }));
                                            }
                                        } }, i18next.t('Save and close')),
                                    React.createElement(Buttons.Cancel, { onClick: () => self.setState(Object.assign({}, self.state, { new_Course: undefined })) }))))
                        :
                            null,
            React.createElement("div", { className: "new-course" },
                React.createElement("button", { className: "new-course button button--new", onClick: () => self.setState(Object.assign({}, self.state, { add_step_Course: "closed", new_Course: { Id: -1, CreatedDate: null, Name: "" } })) }, "Create new Course")))
        :
            null;
}
exports.render_new_HomePage_HomePage_Course = render_new_HomePage_HomePage_Course;
function render_saving_animations_HomePage(self) {
    return self.state.dirty_Course.count() > 0 ?
        React.createElement("div", { style: { position: "fixed", zIndex: 10000, top: 0, left: 0, width: "20px", height: "20px", backgroundColor: "red" }, className: "saving" })
        : React.createElement("div", { style: { position: "fixed", zIndex: 10000, top: 0, left: 0, width: "20px", height: "20px", backgroundColor: "cornflowerblue" }, className: "saved" });
}
exports.render_saving_animations_HomePage = render_saving_animations_HomePage;
class HomePageComponent extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.thread = null;
        this.state = { update_count: 0, dirty_Course: Immutable.Map(), Course: "loading" };
    }
    componentWillReceiveProps(new_props) {
        if (new_props.size == "breadcrumb")
            return;
        let current_logged_in_entity = null;
        let new_logged_in_entity = null;
        if (new_props.mode != this.props.mode || (new_props.size != this.props.size && (new_props.size == "large" || new_props.size == "fullscreen")) ||
            (current_logged_in_entity && !new_logged_in_entity) ||
            (!current_logged_in_entity && new_logged_in_entity) ||
            (current_logged_in_entity && new_logged_in_entity && current_logged_in_entity.Id != new_logged_in_entity.Id)) {
            load_relations_HomePage(this);
        }
    }
    componentWillMount() {
        if (this.props.size == "breadcrumb")
            return;
        if (this.props.size != "preview")
            load_relations_HomePage(this);
        this.thread = setInterval(() => {
            if (this.state.dirty_Course.count() > 0) {
                let first = this.state.dirty_Course.first();
                this.setState(Object.assign({}, this.state, { dirty_Course: this.state.dirty_Course.remove(first.Id) }), () => Api.update_Course(first));
            }
        }, 500);
    }
    componentWillUnmount() {
        clearInterval(this.thread);
    }
    render() {
        if (this.props.size == "breadcrumb") {
            return Permissions.can_view_HomePage() ?
                render_breadcrumb_HomePage(this)
                : null;
        }
        return React.createElement("div", { id: `HomePage_${this.props.entity.Id.toString()}_${this.state.update_count}`, className: `model homepage`, style: { width: "100%" } },
            render_saving_animations_HomePage(this),
            this.props.nesting_depth == 0 ? render_menu_HomePage(this) : null,
            React.createElement("div", { style: this.props.nesting_depth == 0 ? { float: "right", width: "85%" } : {}, className: "content" },
                this.props.nesting_depth == 0 ?
                    React.createElement("div", null,
                        this.props.breadcrumbs(),
                        this.props.authentication_menu())
                    :
                        null,
                render_controls_HomePage(this),
                render_content_HomePage(this)));
    }
}
exports.HomePageComponent = HomePageComponent;
exports.HomePage = (props) => React.createElement(HomePageComponent, Object.assign({}, props));
let any_of = (predicates) => () => predicates.map(p => p()).some(p => p);
exports.HomePage_to_page = (id) => {
    let can_edit = any_of([Permissions.can_edit_HomePage, Permissions.can_edit_HomePage_Course, Permissions.can_edit_Course]);
    return Utils.scene_to_page(can_edit, exports.HomePage, Api.get_HomePage(id), Api.update_HomePage, "HomePage", `/HomePages/${id}`);
};
exports.HomePage_to = (id, target_element_id) => {
    Utils.render_page_manager(target_element_id, exports.HomePage_to_page(id));
};
//# sourceMappingURL=HomePage.js.map