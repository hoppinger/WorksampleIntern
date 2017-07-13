"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Immutable = require("immutable");
const Api = require("../generated_api");
const Buttons = require("../containers/button_utils");
const Permissions = require("./permissions");
const Utils = require("./view_utils");
const i18next = require("i18next");
const HomePageViews = require("./HomePage");
const LectureViews = require("./Lecture");
function existing_Course_HomePage_Course_page_index(self) {
    return !self.state.existing_HomePage || self.state.existing_HomePage == "saving" ? 0 : self.state.existing_HomePage.PageIndex;
}
exports.existing_Course_HomePage_Course_page_index = existing_Course_HomePage_Course_page_index;
function existing_Course_Course_Lecture_page_index(self) {
    return !self.state.existing_Lecture || self.state.existing_Lecture == "saving" ? 0 : self.state.existing_Lecture.PageIndex;
}
exports.existing_Course_Course_Lecture_page_index = existing_Course_Course_Lecture_page_index;
function existing_Course_HomePage_Course_page_size(self) {
    return !self.state.existing_HomePage || self.state.existing_HomePage == "saving" ? 25 : self.state.existing_HomePage.PageSize;
}
exports.existing_Course_HomePage_Course_page_size = existing_Course_HomePage_Course_page_size;
function existing_Course_Course_Lecture_page_size(self) {
    return !self.state.existing_Lecture || self.state.existing_Lecture == "saving" ? 25 : self.state.existing_Lecture.PageSize;
}
exports.existing_Course_Course_Lecture_page_size = existing_Course_Course_Lecture_page_size;
function existing_Course_HomePage_Course_num_pages(self) {
    return !self.state.existing_HomePage || self.state.existing_HomePage == "saving" ? 1 : self.state.existing_HomePage.NumPages;
}
exports.existing_Course_HomePage_Course_num_pages = existing_Course_HomePage_Course_num_pages;
function existing_Course_Course_Lecture_num_pages(self) {
    return !self.state.existing_Lecture || self.state.existing_Lecture == "saving" ? 1 : self.state.existing_Lecture.NumPages;
}
exports.existing_Course_Course_Lecture_num_pages = existing_Course_Course_Lecture_num_pages;
function Course_HomePage_Course_page_index(self) {
    return self.state.HomePage == "loading" ? 0 : self.state.HomePage.PageIndex;
}
exports.Course_HomePage_Course_page_index = Course_HomePage_Course_page_index;
function Course_Course_Lecture_page_index(self) {
    return self.state.Lecture == "loading" ? 0 : self.state.Lecture.PageIndex;
}
exports.Course_Course_Lecture_page_index = Course_Course_Lecture_page_index;
function Course_HomePage_Course_page_size(self) {
    return self.state.HomePage == "loading" ? 25 : self.state.HomePage.PageSize;
}
exports.Course_HomePage_Course_page_size = Course_HomePage_Course_page_size;
function Course_Course_Lecture_page_size(self) {
    return self.state.Lecture == "loading" ? 25 : self.state.Lecture.PageSize;
}
exports.Course_Course_Lecture_page_size = Course_Course_Lecture_page_size;
function Course_HomePage_Course_num_pages(self) {
    return self.state.HomePage == "loading" ? 1 : self.state.HomePage.NumPages;
}
exports.Course_HomePage_Course_num_pages = Course_HomePage_Course_num_pages;
function Course_Course_Lecture_num_pages(self) {
    return self.state.Lecture == "loading" ? 1 : self.state.Lecture.NumPages;
}
exports.Course_Course_Lecture_num_pages = Course_Course_Lecture_num_pages;
function load_relations_Course(self, callback) {
    Permissions.can_view_HomePage() && Api.get_Course_HomePage_Courses(self.props.entity, Course_HomePage_Course_page_index(self), Course_HomePage_Course_page_size(self)).then(HomePages => self.setState(Object.assign({}, self.state, { update_count: self.state.update_count + 1, HomePage: Utils.raw_page_to_paginated_items(i => {
            return {
                element: i,
                size: self.state.HomePage != "loading" && self.state.HomePage.Items.has(i.Id) ? self.state.HomePage.Items.get(i.Id).size : "preview",
                shown_relation: "all"
            };
        }, HomePages) })), callback);
    Permissions.can_view_Lecture() && Api.get_Course_Course_Lectures(self.props.entity, Course_Course_Lecture_page_index(self), Course_Course_Lecture_page_size(self)).then(Lectures => self.setState(Object.assign({}, self.state, { update_count: self.state.update_count + 1, Lecture: Utils.raw_page_to_paginated_items(i => {
            return {
                element: i,
                size: self.state.Lecture != "loading" && self.state.Lecture.Items.has(i.Id) ? self.state.Lecture.Items.get(i.Id).size : "preview",
                shown_relation: "all"
            };
        }, Lectures) })), callback);
}
exports.load_relations_Course = load_relations_Course;
function set_size_Course(self, new_size) {
    self.props.set_size(new_size, () => {
        if (new_size == "fullscreen")
            self.props.push(exports.Course_to_page(self.props.entity.Id));
        else if (new_size != "preview")
            load_relations_Course(self);
    });
}
exports.set_size_Course = set_size_Course;
function render_Course_Name_editable(self) {
    return !Permissions.can_view_Course_Name() ? React.createElement("div", null) :
        React.createElement("div", { className: "model__attribute name" },
            React.createElement("label", { className: "attribute-label attribute-label-name" }, i18next.t('Course:Name')),
            React.createElement("h1", null,
                React.createElement("input", { disabled: !Permissions.can_edit_Course_Name(), type: "text", defaultValue: self.props.entity.Name, onChange: (e) => {
                        let new_value = e.target.value;
                        self.props.set_entity(Object.assign({}, self.props.entity, { Name: new_value }));
                    } })));
}
exports.render_Course_Name_editable = render_Course_Name_editable;
function render_editable_attributes_minimised_Course(self) {
    let attributes = (React.createElement("div", null, render_Course_Name_editable(self)));
    return attributes;
}
exports.render_editable_attributes_minimised_Course = render_editable_attributes_minimised_Course;
function render_editable_attributes_maximised_Course(self) {
    let attributes = (React.createElement("div", null, render_Course_Name_editable(self)));
    return attributes;
}
exports.render_editable_attributes_maximised_Course = render_editable_attributes_maximised_Course;
function render_breadcrumb_Course(self) {
    return React.createElement("div", { className: "breadcrumb-course" }, "\"Course\"");
}
exports.render_breadcrumb_Course = render_breadcrumb_Course;
function render_menu_Course(self) {
    return React.createElement("div", { style: { float: "left", position: "fixed", top: "0", left: "0", width: "15%", height: "100%", backgroundColor: "lightgray" }, className: "menu" },
        React.createElement("div", { className: "logo", style: { textAlign: "center" } },
            React.createElement("img", { className: "logo", style: { display: "inline-block", width: "50%" }, src: "/images/logo.png", alt: "Logo" })),
        React.createElement("div", { className: "pages" },
            React.createElement("div", { className: `menu_entry page_link active` },
                React.createElement("a", { onClick: () => self.props.set_shown_relation("none") }, i18next.t('Course'))),
            React.createElement("div", { className: "menu_entries" }, !Permissions.can_view_Lecture() ? null :
                React.createElement("div", { className: `menu_entry${self.props.shown_relation == "Course_Lecture" ? " active" : ""}` },
                    React.createElement("a", { onClick: () => self.props.set_shown_relation("Course_Lecture") }, i18next.t('Course_Lectures')))),
            !Permissions.can_view_HomePage() ? null :
                React.createElement("div", { className: `menu_entry page_link` },
                    React.createElement("a", { onClick: () => Api.get_HomePages(0, 1).then(e => e.Items.length > 0 && self.props.set_page(HomePageViews.HomePage_to_page(e.Items[0].Item.Id))) }, i18next.t('HomePage')))));
}
exports.render_menu_Course = render_menu_Course;
function render_controls_Course(self) {
    return React.createElement("div", { className: "control" },
        self.props.allow_maximisation && self.props.set_size ? React.createElement("a", { className: "course control__button toggle-size", onClick: () => {
                set_size_Course(self, self.props.size == "preview" ? "large" : "preview");
            } },
            React.createElement("img", { className: "control__icon", src: self.props.size == "preview" ? "/images/icon-menu-down.svg" : "/images/icon-menu-up.svg", alt: "Toggle size" })) : null,
        Permissions.can_delete_Course() && self.props.size == "fullscreen" ? React.createElement("a", { className: "course control__button delete", onClick: () => confirm(i18next.t('Are you sure?')) &&
                Api.delete_Course(self.props.entity).then(() => self.props.pop()) },
            React.createElement("img", { className: "control__icon", src: "/images/icon-remove.svg", alt: "Delete" })) : null,
        self.props.size == "fullscreen" && self.props.pages_count > 0 ? React.createElement("a", { className: "course control__button cancel", onClick: () => self.props.pop() },
            React.createElement("img", { className: "control__icon", src: "/images/icon-cancel.svg", alt: "Delete" })) : null,
        self.props.toggle_button ? self.props.toggle_button() : null,
        self.props.unlink && self.props.mode != "view" ?
            React.createElement("a", { className: "course control__button unlink", onClick: () => self.props.unlink() },
                React.createElement("img", { className: "control__icon", src: "/images/icon-unlink.svg", alt: "Unlink" }))
            :
                null,
        self.props.delete && self.props.mode != "view" ?
            React.createElement("a", { className: "course control__button remove", onClick: () => self.props.delete() },
                React.createElement("img", { className: "control__icon", src: "/images/icon-remove.svg", alt: "Remove" }))
            :
                null);
}
exports.render_controls_Course = render_controls_Course;
function render_content_Course(self) {
    return React.createElement("div", { className: "model-content" }, Permissions.can_view_Course() ?
        self.props.size == "preview" ?
            render_preview_Course(self)
            : self.props.size == "large" ?
                render_large_Course(self)
                : self.props.size == "fullscreen" ?
                    render_large_Course(self)
                    : "Error: unauthorised access to entity."
        : "Error: unauthorised access to entity.");
}
exports.render_content_Course = render_content_Course;
function render_Course_Name(self) {
    return !Permissions.can_view_Course_Name() ? "" : React.createElement("div", { className: "model__attribute name" },
        React.createElement("label", { className: "attribute-label attribute-label-name" }, i18next.t('Course:Name')),
        self.props.entity.Name);
}
exports.render_Course_Name = render_Course_Name;
function render_preview_Course(self) {
    let attributes = null;
    if (self.props.mode == "view" || !Permissions.can_edit_Course())
        attributes = (React.createElement("div", { className: "model__attributes" }, render_Course_Name(self)));
    else
        attributes = render_editable_attributes_minimised_Course(self);
    return (React.createElement("div", { className: "block" }, attributes));
}
exports.render_preview_Course = render_preview_Course;
function render_large_Course(self) {
    let attributes = null;
    if (self.props.mode == "view" || !Permissions.can_edit_Course())
        attributes = (React.createElement("div", { className: "model__attributes" }, render_Course_Name(self)));
    else
        attributes = render_editable_attributes_maximised_Course(self);
    return (React.createElement("div", { className: "block" },
        attributes,
        render_relations_Course(self)));
}
exports.render_large_Course = render_large_Course;
function render_relations_Course(self) {
    return React.createElement("div", { className: "relations" }, (self.props.shown_relation != "all" && self.props.shown_relation != "Course_Lecture") || !Permissions.can_view_Lecture() ? null :
        self.state.Lecture == "loading" ?
            React.createElement("div", { className: "loading" },
                i18next.t('Loading Lecture'),
                ".")
            :
                React.createElement("div", { className: "model-nested lecture" },
                    React.createElement("div", { className: "model-nested__head" }, i18next.t('Lectures')),
                    React.createElement(Utils.Paginator, { PageIndex: self.state.Lecture.PageIndex, NumPages: self.state.Lecture.NumPages, page_selected: new_page_index => self.state.Lecture != "loading" &&
                            self.setState(Object.assign({}, self.state, { Lecture: Object.assign({}, self.state.Lecture, { PageIndex: new_page_index }) }), () => load_relations_Course(self)) }),
                    self.state.Lecture.Items.map((i, i_id) => React.createElement("div", { key: i_id, className: `model-nested__item` }, LectureViews.Lecture(Object.assign({}, self.props, { entity: i.element, nesting_depth: self.props.nesting_depth + 1, size: i.size, allow_maximisation: true, allow_fullscreen: true, mode: self.props.mode == "edit" && (Permissions.can_edit_Course_Lecture()
                            || Permissions.can_create_Course_Lecture()
                            || Permissions.can_delete_Course_Lecture())
                            && (self.state.Lecture != "loading" && self.state.Lecture.Editable.get(i_id)) ?
                            self.props.mode : "view", shown_relation: i.shown_relation, set_shown_relation: (new_shown_relation, callback) => self.state.Lecture != "loading" &&
                            self.setState(Object.assign({}, self.state, { Lecture: Object.assign({}, self.state.Lecture, { Items: self.state.Lecture.Items.set(i_id, Object.assign({}, self.state.Lecture.Items.get(i_id), { shown_relation: new_shown_relation })) }) }), callback), set_size: (new_size, callback) => {
                            let new_shown_relation = new_size == "large" ? "all" : i.shown_relation;
                            self.state.Lecture != "loading" &&
                                self.setState(Object.assign({}, self.state, { Lecture: Object.assign({}, self.state.Lecture, { Items: self.state.Lecture.Items.set(i_id, Object.assign({}, self.state.Lecture.Items.get(i_id), { size: new_size, shown_relation: new_shown_relation })) }) }), callback);
                        }, toggle_button: undefined, set_entity: (new_entity, callback, force_update_count_increment) => self.state.Lecture != "loading" &&
                            self.setState(Object.assign({}, self.state, { dirty_Lecture: self.state.dirty_Lecture.set(i_id, new_entity), update_count: force_update_count_increment ? self.state.update_count + 1 : self.state.update_count, Lecture: Object.assign({}, self.state.Lecture, { Items: self.state.Lecture.Items.set(i_id, Object.assign({}, self.state.Lecture.Items.get(i_id), { element: new_entity })) }) }), callback), delete: undefined, unlink: !Permissions.can_delete_Course_Lecture() ?
                            null
                            :
                                () => confirm(i18next.t('Are you sure?')) && Api.unlink_Course_Course_Lectures(self.props.entity, i.element).then(() => load_relations_Course(self)) })))).valueSeq(),
                    React.createElement("div", null,
                        Permissions.can_create_Lecture() && Permissions.can_create_Course_Lecture() ? render_new_Course_Course_Lecture(self) : null,
                        Permissions.can_create_Course_Lecture() ? render_add_existing_Course_Course_Lecture(self) : null)));
}
exports.render_relations_Course = render_relations_Course;
function render_add_existing_Course_Course_Lecture(self) {
    return self.props.mode == "edit" ?
        React.createElement("div", null,
            self.state.existing_Lecture == "saving" ?
                React.createElement("div", { className: "saving" })
                :
                    self.state.existing_Lecture ?
                        React.createElement("div", { className: "overlay new-lecture-background" },
                            React.createElement("div", { className: "overlay__item overlay__item--new add-existing-lecture" },
                                React.createElement(Utils.Paginator, { PageIndex: self.state.existing_Lecture.PageIndex, NumPages: self.state.existing_Lecture.NumPages, page_selected: new_page_index => self.state.existing_Lecture != "saving" &&
                                        self.setState(Object.assign({}, self.state, { existing_Lecture: Object.assign({}, self.state.existing_Lecture, { PageIndex: new_page_index }) }), () => load_relations_Course(self)) }),
                                React.createElement("div", { className: "group" }, self.state.existing_Lecture.Items.map((i, i_id) => React.createElement("div", { key: i_id, className: "group__item" },
                                    React.createElement("a", { className: "group__button button", onClick: () => self.setState(Object.assign({}, self.state, { existing_Lecture: "saving" }), () => Api.link_Course_Course_Lectures(self.props.entity, i).then(() => self.setState(Object.assign({}, self.state, { existing_Lecture: undefined }), () => load_relations_Course(self)))) },
                                        React.createElement("img", { className: "control__icon", src: "/images/icon-plus.svg", alt: "Add existing item" })),
                                    React.createElement("div", { className: "group__title", disabled: true }, LectureViews.Lecture(Object.assign({}, self.props, { entity: i, nesting_depth: self.props.nesting_depth + 1, size: "preview", mode: "view", set_size: undefined, toggle_button: undefined, set_entity: (new_entity, callback) => { }, unlink: undefined, delete: undefined }))))).valueSeq()),
                                React.createElement(Buttons.Cancel, { onClick: () => self.setState(Object.assign({}, self.state, { existing_Lecture: undefined })) })))
                        :
                            null,
            React.createElement("div", { className: "existing-lecture" },
                React.createElement("button", { className: "button button--add", onClick: () => Api.get_unlinked_Course_Course_Lectures(self.props.entity, existing_Course_Course_Lecture_page_index(self), existing_Course_Course_Lecture_page_size(self)).then(es => self.setState(Object.assign({}, self.state, { add_step_Lecture: "closed", existing_Lecture: Utils.raw_page_to_paginated_items(e => e, es) }))) }, i18next.t('Add existing Lecture'))))
        :
            null;
}
exports.render_add_existing_Course_Course_Lecture = render_add_existing_Course_Course_Lecture;
function render_new_Course_HomePage_Course(self) {
    return self.props.mode == "edit" ?
        React.createElement("div", { className: "button__actions" },
            self.state.new_HomePage == "saving" ?
                null
                :
                    self.state.new_HomePage ?
                        React.createElement("div", { className: "overlay new-homepage-background" },
                            React.createElement("div", { className: "overlay__item overlay__item--new new-homepage" },
                                HomePageViews.HomePage(Object.assign({}, self.props, { entity: self.state.new_HomePage, nesting_depth: self.props.nesting_depth + 1, size: "preview", mode: "edit", set_size: undefined, toggle_button: undefined, set_entity: (new_entity, callback, force_update_count_increment) => self.setState(Object.assign({}, self.state, { update_count: force_update_count_increment ? self.state.update_count + 1 : self.state.update_count, new_HomePage: new_entity }), callback), unlink: undefined, delete: undefined })),
                                React.createElement("div", { className: "button__actions" },
                                    React.createElement("button", { className: "button button--save button--inline", onClick: () => {
                                            if (self.state.new_HomePage && self.state.new_HomePage != "saving") {
                                                let new_HomePage = self.state.new_HomePage;
                                                self.setState(Object.assign({}, self.state, { new_HomePage: "saving" }), () => Api.create_HomePage().then(e => {
                                                    Api.update_HomePage(Object.assign({}, new_HomePage, { CreatedDate: e.CreatedDate, Id: e.Id })).then(() => load_relations_Course(self));
                                                }));
                                            }
                                        } }, i18next.t('Save and close')),
                                    React.createElement(Buttons.Cancel, { onClick: () => self.setState(Object.assign({}, self.state, { new_HomePage: undefined })) }))))
                        :
                            null,
            React.createElement("div", { className: "new-homepage" },
                React.createElement("button", { className: "new-homepage button button--new", onClick: () => self.setState(Object.assign({}, self.state, { add_step_HomePage: "closed", new_HomePage: { Id: -1, CreatedDate: null, } })) }, "Create new HomePage")))
        :
            null;
}
exports.render_new_Course_HomePage_Course = render_new_Course_HomePage_Course;
function render_new_Course_Course_Lecture(self) {
    return self.props.mode == "edit" ?
        React.createElement("div", { className: "button__actions" },
            self.state.new_Lecture == "saving" ?
                null
                :
                    self.state.new_Lecture ?
                        React.createElement("div", { className: "overlay new-lecture-background" },
                            React.createElement("div", { className: "overlay__item overlay__item--new new-lecture" },
                                LectureViews.Lecture(Object.assign({}, self.props, { entity: self.state.new_Lecture, nesting_depth: self.props.nesting_depth + 1, size: "preview", mode: "edit", set_size: undefined, toggle_button: undefined, set_entity: (new_entity, callback, force_update_count_increment) => self.setState(Object.assign({}, self.state, { update_count: force_update_count_increment ? self.state.update_count + 1 : self.state.update_count, new_Lecture: new_entity }), callback), unlink: undefined, delete: undefined })),
                                React.createElement("div", { className: "button__actions" },
                                    React.createElement("button", { className: "button button--save button--inline", onClick: () => {
                                            if (self.state.new_Lecture && self.state.new_Lecture != "saving") {
                                                let new_Lecture = self.state.new_Lecture;
                                                self.setState(Object.assign({}, self.state, { new_Lecture: "saving" }), () => Api.create_linked_Course_Course_Lectures_Lecture(self.props.entity).then(e => {
                                                    e.length > 0 &&
                                                        Api.update_Lecture(Object.assign({}, new_Lecture, { CreatedDate: e[0].CreatedDate, Id: e[0].Id })).then(() => load_relations_Course(self));
                                                }));
                                            }
                                        } }, i18next.t('Save and close')),
                                    React.createElement(Buttons.Cancel, { onClick: () => self.setState(Object.assign({}, self.state, { new_Lecture: undefined })) }))))
                        :
                            null,
            React.createElement("div", { className: "new-lecture" },
                React.createElement("button", { className: "new-lecture button button--new", onClick: () => self.setState(Object.assign({}, self.state, { add_step_Lecture: "closed", new_Lecture: { Id: -1, CreatedDate: null, Name: "" } })) }, "Create new Lecture")))
        :
            null;
}
exports.render_new_Course_Course_Lecture = render_new_Course_Course_Lecture;
function render_saving_animations_Course(self) {
    return self.state.dirty_HomePage.count() > 0 ?
        React.createElement("div", { style: { position: "fixed", zIndex: 10000, top: 0, left: 0, width: "20px", height: "20px", backgroundColor: "red" }, className: "saving" }) :
        self.state.dirty_Lecture.count() > 0 ?
            React.createElement("div", { style: { position: "fixed", zIndex: 10000, top: 0, left: 0, width: "20px", height: "20px", backgroundColor: "red" }, className: "saving" })
            : React.createElement("div", { style: { position: "fixed", zIndex: 10000, top: 0, left: 0, width: "20px", height: "20px", backgroundColor: "cornflowerblue" }, className: "saved" });
}
exports.render_saving_animations_Course = render_saving_animations_Course;
class CourseComponent extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.thread = null;
        this.state = { update_count: 0, dirty_HomePage: Immutable.Map(), HomePage: "loading", dirty_Lecture: Immutable.Map(), Lecture: "loading" };
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
            load_relations_Course(this);
        }
    }
    componentWillMount() {
        if (this.props.size == "breadcrumb")
            return;
        if (this.props.size != "preview")
            load_relations_Course(this);
        this.thread = setInterval(() => {
            if (this.state.dirty_HomePage.count() > 0) {
                let first = this.state.dirty_HomePage.first();
                this.setState(Object.assign({}, this.state, { dirty_HomePage: this.state.dirty_HomePage.remove(first.Id) }), () => Api.update_HomePage(first));
            }
            else if (this.state.dirty_Lecture.count() > 0) {
                let first = this.state.dirty_Lecture.first();
                this.setState(Object.assign({}, this.state, { dirty_Lecture: this.state.dirty_Lecture.remove(first.Id) }), () => Api.update_Lecture(first));
            }
        }, 500);
    }
    componentWillUnmount() {
        clearInterval(this.thread);
    }
    render() {
        if (this.props.size == "breadcrumb") {
            return Permissions.can_view_Course() ?
                render_breadcrumb_Course(this)
                : null;
        }
        return React.createElement("div", { id: `Course_${this.props.entity.Id.toString()}_${this.state.update_count}`, className: `model course`, style: { width: "100%" } },
            render_saving_animations_Course(this),
            this.props.nesting_depth == 0 ? render_menu_Course(this) : null,
            React.createElement("div", { style: this.props.nesting_depth == 0 ? { float: "right", width: "85%" } : {}, className: "content" },
                this.props.nesting_depth == 0 ?
                    React.createElement("div", null,
                        this.props.breadcrumbs(),
                        this.props.authentication_menu())
                    :
                        null,
                render_controls_Course(this),
                render_content_Course(this)));
    }
}
exports.CourseComponent = CourseComponent;
exports.Course = (props) => React.createElement(CourseComponent, Object.assign({}, props));
let any_of = (predicates) => () => predicates.map(p => p()).some(p => p);
exports.Course_to_page = (id) => {
    let can_edit = any_of([Permissions.can_edit_Course, Permissions.can_edit_HomePage_Course, Permissions.can_edit_Course_Lecture, Permissions.can_edit_HomePage, Permissions.can_edit_Lecture]);
    return Utils.scene_to_page(can_edit, exports.Course, Api.get_Course(id), Api.update_Course, "Course", `/Courses/${id}`);
};
exports.Course_to = (id, target_element_id) => {
    Utils.render_page_manager(target_element_id, exports.Course_to_page(id));
};
//# sourceMappingURL=Course.js.map