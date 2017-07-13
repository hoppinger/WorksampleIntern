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
const TopicViews = require("./Topic");
const CourseViews = require("./Course");
function existing_Lecture_Course_Lecture_page_index(self) {
    return !self.state.existing_Course || self.state.existing_Course == "saving" ? 0 : self.state.existing_Course.PageIndex;
}
exports.existing_Lecture_Course_Lecture_page_index = existing_Lecture_Course_Lecture_page_index;
function existing_Lecture_Lecture_Topic_page_index(self) {
    return !self.state.existing_Topic || self.state.existing_Topic == "saving" ? 0 : self.state.existing_Topic.PageIndex;
}
exports.existing_Lecture_Lecture_Topic_page_index = existing_Lecture_Lecture_Topic_page_index;
function existing_Lecture_Course_Lecture_page_size(self) {
    return !self.state.existing_Course || self.state.existing_Course == "saving" ? 25 : self.state.existing_Course.PageSize;
}
exports.existing_Lecture_Course_Lecture_page_size = existing_Lecture_Course_Lecture_page_size;
function existing_Lecture_Lecture_Topic_page_size(self) {
    return !self.state.existing_Topic || self.state.existing_Topic == "saving" ? 25 : self.state.existing_Topic.PageSize;
}
exports.existing_Lecture_Lecture_Topic_page_size = existing_Lecture_Lecture_Topic_page_size;
function existing_Lecture_Course_Lecture_num_pages(self) {
    return !self.state.existing_Course || self.state.existing_Course == "saving" ? 1 : self.state.existing_Course.NumPages;
}
exports.existing_Lecture_Course_Lecture_num_pages = existing_Lecture_Course_Lecture_num_pages;
function existing_Lecture_Lecture_Topic_num_pages(self) {
    return !self.state.existing_Topic || self.state.existing_Topic == "saving" ? 1 : self.state.existing_Topic.NumPages;
}
exports.existing_Lecture_Lecture_Topic_num_pages = existing_Lecture_Lecture_Topic_num_pages;
function Lecture_Course_Lecture_page_index(self) {
    return self.state.Course == "loading" ? 0 : self.state.Course.PageIndex;
}
exports.Lecture_Course_Lecture_page_index = Lecture_Course_Lecture_page_index;
function Lecture_Lecture_Topic_page_index(self) {
    return self.state.Topic == "loading" ? 0 : self.state.Topic.PageIndex;
}
exports.Lecture_Lecture_Topic_page_index = Lecture_Lecture_Topic_page_index;
function Lecture_Course_Lecture_page_size(self) {
    return self.state.Course == "loading" ? 25 : self.state.Course.PageSize;
}
exports.Lecture_Course_Lecture_page_size = Lecture_Course_Lecture_page_size;
function Lecture_Lecture_Topic_page_size(self) {
    return self.state.Topic == "loading" ? 25 : self.state.Topic.PageSize;
}
exports.Lecture_Lecture_Topic_page_size = Lecture_Lecture_Topic_page_size;
function Lecture_Course_Lecture_num_pages(self) {
    return self.state.Course == "loading" ? 1 : self.state.Course.NumPages;
}
exports.Lecture_Course_Lecture_num_pages = Lecture_Course_Lecture_num_pages;
function Lecture_Lecture_Topic_num_pages(self) {
    return self.state.Topic == "loading" ? 1 : self.state.Topic.NumPages;
}
exports.Lecture_Lecture_Topic_num_pages = Lecture_Lecture_Topic_num_pages;
function load_relations_Lecture(self, callback) {
    Permissions.can_view_Course() && Api.get_Lecture_Course_Lectures(self.props.entity, Lecture_Course_Lecture_page_index(self), Lecture_Course_Lecture_page_size(self)).then(Courses => self.setState(Object.assign({}, self.state, { update_count: self.state.update_count + 1, Course: Utils.raw_page_to_paginated_items(i => {
            return {
                element: i,
                size: self.state.Course != "loading" && self.state.Course.Items.has(i.Id) ? self.state.Course.Items.get(i.Id).size : "preview",
                shown_relation: "all"
            };
        }, Courses) })), callback);
    Permissions.can_view_Topic() && Api.get_Lecture_Lecture_Topics(self.props.entity, Lecture_Lecture_Topic_page_index(self), Lecture_Lecture_Topic_page_size(self)).then(Topics => self.setState(Object.assign({}, self.state, { update_count: self.state.update_count + 1, Topic: Utils.raw_page_to_paginated_items(i => {
            return {
                element: i,
                size: self.state.Topic != "loading" && self.state.Topic.Items.has(i.Id) ? self.state.Topic.Items.get(i.Id).size : "preview",
                shown_relation: "all"
            };
        }, Topics) })), callback);
}
exports.load_relations_Lecture = load_relations_Lecture;
function set_size_Lecture(self, new_size) {
    self.props.set_size(new_size, () => {
        if (new_size == "fullscreen")
            self.props.push(exports.Lecture_to_page(self.props.entity.Id));
        else if (new_size != "preview")
            load_relations_Lecture(self);
    });
}
exports.set_size_Lecture = set_size_Lecture;
function render_Lecture_Name_editable(self) {
    return !Permissions.can_view_Lecture_Name() ? React.createElement("div", null) :
        React.createElement("div", { className: "model__attribute name" },
            React.createElement("label", { className: "attribute-label attribute-label-name" }, i18next.t('Lecture:Name')),
            React.createElement("h1", null,
                React.createElement("input", { disabled: !Permissions.can_edit_Lecture_Name(), type: "text", defaultValue: self.props.entity.Name, onChange: (e) => {
                        let new_value = e.target.value;
                        self.props.set_entity(Object.assign({}, self.props.entity, { Name: new_value }));
                    } })));
}
exports.render_Lecture_Name_editable = render_Lecture_Name_editable;
function render_editable_attributes_minimised_Lecture(self) {
    let attributes = (React.createElement("div", null, render_Lecture_Name_editable(self)));
    return attributes;
}
exports.render_editable_attributes_minimised_Lecture = render_editable_attributes_minimised_Lecture;
function render_editable_attributes_maximised_Lecture(self) {
    let attributes = (React.createElement("div", null, render_Lecture_Name_editable(self)));
    return attributes;
}
exports.render_editable_attributes_maximised_Lecture = render_editable_attributes_maximised_Lecture;
function render_breadcrumb_Lecture(self) {
    return React.createElement("div", { className: "breadcrumb-lecture" }, "\"Lecture\"");
}
exports.render_breadcrumb_Lecture = render_breadcrumb_Lecture;
function render_menu_Lecture(self) {
    return React.createElement("div", { style: { float: "left", position: "fixed", top: "0", left: "0", width: "15%", height: "100%", backgroundColor: "lightgray" }, className: "menu" },
        React.createElement("div", { className: "logo", style: { textAlign: "center" } },
            React.createElement("img", { className: "logo", style: { display: "inline-block", width: "50%" }, src: "/images/logo.png", alt: "Logo" })),
        React.createElement("div", { className: "pages" },
            React.createElement("div", { className: `menu_entry page_link active` },
                React.createElement("a", { onClick: () => self.props.set_shown_relation("none") }, i18next.t('Lecture'))),
            React.createElement("div", { className: "menu_entries" }, !Permissions.can_view_Topic() ? null :
                React.createElement("div", { className: `menu_entry${self.props.shown_relation == "Lecture_Topic" ? " active" : ""}` },
                    React.createElement("a", { onClick: () => self.props.set_shown_relation("Lecture_Topic") }, i18next.t('Lecture_Topics')))),
            !Permissions.can_view_HomePage() ? null :
                React.createElement("div", { className: `menu_entry page_link` },
                    React.createElement("a", { onClick: () => Api.get_HomePages(0, 1).then(e => e.Items.length > 0 && self.props.set_page(HomePageViews.HomePage_to_page(e.Items[0].Item.Id))) }, i18next.t('HomePage')))));
}
exports.render_menu_Lecture = render_menu_Lecture;
function render_controls_Lecture(self) {
    return React.createElement("div", { className: "control" },
        self.props.allow_maximisation && self.props.set_size ? React.createElement("a", { className: "lecture control__button toggle-size", onClick: () => {
                set_size_Lecture(self, self.props.size == "preview" ? "large" : "preview");
            } },
            React.createElement("img", { className: "control__icon", src: self.props.size == "preview" ? "/images/icon-menu-down.svg" : "/images/icon-menu-up.svg", alt: "Toggle size" })) : null,
        Permissions.can_delete_Lecture() && self.props.size == "fullscreen" ? React.createElement("a", { className: "lecture control__button delete", onClick: () => confirm(i18next.t('Are you sure?')) &&
                Api.delete_Lecture(self.props.entity).then(() => self.props.pop()) },
            React.createElement("img", { className: "control__icon", src: "/images/icon-remove.svg", alt: "Delete" })) : null,
        self.props.size == "fullscreen" && self.props.pages_count > 0 ? React.createElement("a", { className: "lecture control__button cancel", onClick: () => self.props.pop() },
            React.createElement("img", { className: "control__icon", src: "/images/icon-cancel.svg", alt: "Delete" })) : null,
        self.props.toggle_button ? self.props.toggle_button() : null,
        self.props.unlink && self.props.mode != "view" ?
            React.createElement("a", { className: "lecture control__button unlink", onClick: () => self.props.unlink() },
                React.createElement("img", { className: "control__icon", src: "/images/icon-unlink.svg", alt: "Unlink" }))
            :
                null,
        self.props.delete && self.props.mode != "view" ?
            React.createElement("a", { className: "lecture control__button remove", onClick: () => self.props.delete() },
                React.createElement("img", { className: "control__icon", src: "/images/icon-remove.svg", alt: "Remove" }))
            :
                null);
}
exports.render_controls_Lecture = render_controls_Lecture;
function render_content_Lecture(self) {
    return React.createElement("div", { className: "model-content" }, Permissions.can_view_Lecture() ?
        self.props.size == "preview" ?
            render_preview_Lecture(self)
            : self.props.size == "large" ?
                render_large_Lecture(self)
                : self.props.size == "fullscreen" ?
                    render_large_Lecture(self)
                    : "Error: unauthorised access to entity."
        : "Error: unauthorised access to entity.");
}
exports.render_content_Lecture = render_content_Lecture;
function render_Lecture_Name(self) {
    return !Permissions.can_view_Lecture_Name() ? "" : React.createElement("div", { className: "model__attribute name" },
        React.createElement("label", { className: "attribute-label attribute-label-name" }, i18next.t('Lecture:Name')),
        self.props.entity.Name);
}
exports.render_Lecture_Name = render_Lecture_Name;
function render_preview_Lecture(self) {
    let attributes = null;
    if (self.props.mode == "view" || !Permissions.can_edit_Lecture())
        attributes = (React.createElement("div", { className: "model__attributes" }, render_Lecture_Name(self)));
    else
        attributes = render_editable_attributes_minimised_Lecture(self);
    return (React.createElement("div", { className: "block" }, attributes));
}
exports.render_preview_Lecture = render_preview_Lecture;
function render_large_Lecture(self) {
    let attributes = null;
    if (self.props.mode == "view" || !Permissions.can_edit_Lecture())
        attributes = (React.createElement("div", { className: "model__attributes" }, render_Lecture_Name(self)));
    else
        attributes = render_editable_attributes_maximised_Lecture(self);
    return (React.createElement("div", { className: "block" },
        attributes,
        render_relations_Lecture(self)));
}
exports.render_large_Lecture = render_large_Lecture;
function render_relations_Lecture(self) {
    return React.createElement("div", { className: "relations" }, (self.props.shown_relation != "all" && self.props.shown_relation != "Lecture_Topic") || !Permissions.can_view_Topic() ? null :
        self.state.Topic == "loading" ?
            React.createElement("div", { className: "loading" },
                i18next.t('Loading Topic'),
                ".")
            :
                React.createElement("div", { className: "model-nested topic" },
                    React.createElement("div", { className: "model-nested__head" }, i18next.t('Topics')),
                    React.createElement(Utils.Paginator, { PageIndex: self.state.Topic.PageIndex, NumPages: self.state.Topic.NumPages, page_selected: new_page_index => self.state.Topic != "loading" &&
                            self.setState(Object.assign({}, self.state, { Topic: Object.assign({}, self.state.Topic, { PageIndex: new_page_index }) }), () => load_relations_Lecture(self)) }),
                    self.state.Topic.Items.map((i, i_id) => React.createElement("div", { key: i_id, className: `model-nested__item` }, TopicViews.Topic(Object.assign({}, self.props, { entity: i.element, nesting_depth: self.props.nesting_depth + 1, size: i.size, allow_maximisation: true, allow_fullscreen: true, mode: self.props.mode == "edit" && (Permissions.can_edit_Lecture_Topic()
                            || Permissions.can_create_Lecture_Topic()
                            || Permissions.can_delete_Lecture_Topic())
                            && (self.state.Topic != "loading" && self.state.Topic.Editable.get(i_id)) ?
                            self.props.mode : "view", shown_relation: i.shown_relation, set_shown_relation: (new_shown_relation, callback) => self.state.Topic != "loading" &&
                            self.setState(Object.assign({}, self.state, { Topic: Object.assign({}, self.state.Topic, { Items: self.state.Topic.Items.set(i_id, Object.assign({}, self.state.Topic.Items.get(i_id), { shown_relation: new_shown_relation })) }) }), callback), set_size: (new_size, callback) => {
                            let new_shown_relation = new_size == "large" ? "all" : i.shown_relation;
                            self.state.Topic != "loading" &&
                                self.setState(Object.assign({}, self.state, { Topic: Object.assign({}, self.state.Topic, { Items: self.state.Topic.Items.set(i_id, Object.assign({}, self.state.Topic.Items.get(i_id), { size: new_size, shown_relation: new_shown_relation })) }) }), callback);
                        }, toggle_button: undefined, set_entity: (new_entity, callback, force_update_count_increment) => self.state.Topic != "loading" &&
                            self.setState(Object.assign({}, self.state, { dirty_Topic: self.state.dirty_Topic.set(i_id, new_entity), update_count: force_update_count_increment ? self.state.update_count + 1 : self.state.update_count, Topic: Object.assign({}, self.state.Topic, { Items: self.state.Topic.Items.set(i_id, Object.assign({}, self.state.Topic.Items.get(i_id), { element: new_entity })) }) }), callback), delete: undefined, unlink: !Permissions.can_delete_Lecture_Topic() ?
                            null
                            :
                                () => confirm(i18next.t('Are you sure?')) && Api.unlink_Lecture_Lecture_Topics(self.props.entity, i.element).then(() => load_relations_Lecture(self)) })))).valueSeq(),
                    React.createElement("div", null,
                        Permissions.can_create_Topic() && Permissions.can_create_Lecture_Topic() ? render_new_Lecture_Lecture_Topic(self) : null,
                        Permissions.can_create_Lecture_Topic() ? render_add_existing_Lecture_Lecture_Topic(self) : null)));
}
exports.render_relations_Lecture = render_relations_Lecture;
function render_add_existing_Lecture_Course_Lecture(self) {
    return self.props.mode == "edit" ?
        React.createElement("div", null,
            self.state.existing_Course == "saving" ?
                React.createElement("div", { className: "saving" })
                :
                    self.state.existing_Course ?
                        React.createElement("div", { className: "overlay new-course-background" },
                            React.createElement("div", { className: "overlay__item overlay__item--new add-existing-course" },
                                React.createElement(Utils.Paginator, { PageIndex: self.state.existing_Course.PageIndex, NumPages: self.state.existing_Course.NumPages, page_selected: new_page_index => self.state.existing_Course != "saving" &&
                                        self.setState(Object.assign({}, self.state, { existing_Course: Object.assign({}, self.state.existing_Course, { PageIndex: new_page_index }) }), () => load_relations_Lecture(self)) }),
                                React.createElement("div", { className: "group" }, self.state.existing_Course.Items.map((i, i_id) => React.createElement("div", { key: i_id, className: "group__item" },
                                    React.createElement("a", { className: "group__button button", onClick: () => self.setState(Object.assign({}, self.state, { existing_Course: "saving" }), () => Api.link_Lecture_Course_Lectures(self.props.entity, i).then(() => self.setState(Object.assign({}, self.state, { existing_Course: undefined }), () => load_relations_Lecture(self)))) },
                                        React.createElement("img", { className: "control__icon", src: "/images/icon-plus.svg", alt: "Add existing item" })),
                                    React.createElement("div", { className: "group__title", disabled: true }, CourseViews.Course(Object.assign({}, self.props, { entity: i, nesting_depth: self.props.nesting_depth + 1, size: "preview", mode: "view", set_size: undefined, toggle_button: undefined, set_entity: (new_entity, callback) => { }, unlink: undefined, delete: undefined }))))).valueSeq()),
                                React.createElement(Buttons.Cancel, { onClick: () => self.setState(Object.assign({}, self.state, { existing_Course: undefined })) })))
                        :
                            null,
            React.createElement("div", { className: "existing-course" },
                React.createElement("button", { className: "button button--add", onClick: () => Api.get_unlinked_Lecture_Course_Lectures(self.props.entity, existing_Lecture_Course_Lecture_page_index(self), existing_Lecture_Course_Lecture_page_size(self)).then(es => self.setState(Object.assign({}, self.state, { add_step_Course: "closed", existing_Course: Utils.raw_page_to_paginated_items(e => e, es) }))) }, i18next.t('Add existing Course'))))
        :
            null;
}
exports.render_add_existing_Lecture_Course_Lecture = render_add_existing_Lecture_Course_Lecture;
function render_add_existing_Lecture_Lecture_Topic(self) {
    return self.props.mode == "edit" ?
        React.createElement("div", null,
            self.state.existing_Topic == "saving" ?
                React.createElement("div", { className: "saving" })
                :
                    self.state.existing_Topic ?
                        React.createElement("div", { className: "overlay new-topic-background" },
                            React.createElement("div", { className: "overlay__item overlay__item--new add-existing-topic" },
                                React.createElement(Utils.Paginator, { PageIndex: self.state.existing_Topic.PageIndex, NumPages: self.state.existing_Topic.NumPages, page_selected: new_page_index => self.state.existing_Topic != "saving" &&
                                        self.setState(Object.assign({}, self.state, { existing_Topic: Object.assign({}, self.state.existing_Topic, { PageIndex: new_page_index }) }), () => load_relations_Lecture(self)) }),
                                React.createElement("div", { className: "group" }, self.state.existing_Topic.Items.map((i, i_id) => React.createElement("div", { key: i_id, className: "group__item" },
                                    React.createElement("a", { className: "group__button button", onClick: () => self.setState(Object.assign({}, self.state, { existing_Topic: "saving" }), () => Api.link_Lecture_Lecture_Topics(self.props.entity, i).then(() => self.setState(Object.assign({}, self.state, { existing_Topic: undefined }), () => load_relations_Lecture(self)))) },
                                        React.createElement("img", { className: "control__icon", src: "/images/icon-plus.svg", alt: "Add existing item" })),
                                    React.createElement("div", { className: "group__title", disabled: true }, TopicViews.Topic(Object.assign({}, self.props, { entity: i, nesting_depth: self.props.nesting_depth + 1, size: "preview", mode: "view", set_size: undefined, toggle_button: undefined, set_entity: (new_entity, callback) => { }, unlink: undefined, delete: undefined }))))).valueSeq()),
                                React.createElement(Buttons.Cancel, { onClick: () => self.setState(Object.assign({}, self.state, { existing_Topic: undefined })) })))
                        :
                            null,
            React.createElement("div", { className: "existing-topic" },
                React.createElement("button", { className: "button button--add", onClick: () => Api.get_unlinked_Lecture_Lecture_Topics(self.props.entity, existing_Lecture_Lecture_Topic_page_index(self), existing_Lecture_Lecture_Topic_page_size(self)).then(es => self.setState(Object.assign({}, self.state, { add_step_Topic: "closed", existing_Topic: Utils.raw_page_to_paginated_items(e => e, es) }))) }, i18next.t('Add existing Topic'))))
        :
            null;
}
exports.render_add_existing_Lecture_Lecture_Topic = render_add_existing_Lecture_Lecture_Topic;
function render_new_Lecture_Course_Lecture(self) {
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
                                                self.setState(Object.assign({}, self.state, { new_Course: "saving" }), () => Api.create_linked_Lecture_Course_Lectures_Course(self.props.entity).then(e => {
                                                    e.length > 0 &&
                                                        Api.update_Course(Object.assign({}, new_Course, { CreatedDate: e[0].CreatedDate, Id: e[0].Id })).then(() => load_relations_Lecture(self));
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
exports.render_new_Lecture_Course_Lecture = render_new_Lecture_Course_Lecture;
function render_new_Lecture_Lecture_Topic(self) {
    return self.props.mode == "edit" ?
        React.createElement("div", { className: "button__actions" },
            self.state.new_Topic == "saving" ?
                null
                :
                    self.state.new_Topic ?
                        React.createElement("div", { className: "overlay new-topic-background" },
                            React.createElement("div", { className: "overlay__item overlay__item--new new-topic" },
                                TopicViews.Topic(Object.assign({}, self.props, { entity: self.state.new_Topic, nesting_depth: self.props.nesting_depth + 1, size: "preview", mode: "edit", set_size: undefined, toggle_button: undefined, set_entity: (new_entity, callback, force_update_count_increment) => self.setState(Object.assign({}, self.state, { update_count: force_update_count_increment ? self.state.update_count + 1 : self.state.update_count, new_Topic: new_entity }), callback), unlink: undefined, delete: undefined })),
                                React.createElement("div", { className: "button__actions" },
                                    React.createElement("button", { className: "button button--save button--inline", onClick: () => {
                                            if (self.state.new_Topic && self.state.new_Topic != "saving") {
                                                let new_Topic = self.state.new_Topic;
                                                self.setState(Object.assign({}, self.state, { new_Topic: "saving" }), () => Api.create_linked_Lecture_Lecture_Topics_Topic(self.props.entity).then(e => {
                                                    e.length > 0 &&
                                                        Api.update_Topic(Object.assign({}, new_Topic, { CreatedDate: e[0].CreatedDate, Id: e[0].Id })).then(() => load_relations_Lecture(self));
                                                }));
                                            }
                                        } }, i18next.t('Save and close')),
                                    React.createElement(Buttons.Cancel, { onClick: () => self.setState(Object.assign({}, self.state, { new_Topic: undefined })) }))))
                        :
                            null,
            React.createElement("div", { className: "new-topic" },
                React.createElement("button", { className: "new-topic button button--new", onClick: () => self.setState(Object.assign({}, self.state, { add_step_Topic: "closed", new_Topic: { Id: -1, CreatedDate: null, Name: "" } })) }, "Create new Topic")))
        :
            null;
}
exports.render_new_Lecture_Lecture_Topic = render_new_Lecture_Lecture_Topic;
function render_saving_animations_Lecture(self) {
    return self.state.dirty_Course.count() > 0 ?
        React.createElement("div", { style: { position: "fixed", zIndex: 10000, top: 0, left: 0, width: "20px", height: "20px", backgroundColor: "red" }, className: "saving" }) :
        self.state.dirty_Topic.count() > 0 ?
            React.createElement("div", { style: { position: "fixed", zIndex: 10000, top: 0, left: 0, width: "20px", height: "20px", backgroundColor: "red" }, className: "saving" })
            : React.createElement("div", { style: { position: "fixed", zIndex: 10000, top: 0, left: 0, width: "20px", height: "20px", backgroundColor: "cornflowerblue" }, className: "saved" });
}
exports.render_saving_animations_Lecture = render_saving_animations_Lecture;
class LectureComponent extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.thread = null;
        this.state = { update_count: 0, dirty_Course: Immutable.Map(), Course: "loading", dirty_Topic: Immutable.Map(), Topic: "loading" };
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
            load_relations_Lecture(this);
        }
    }
    componentWillMount() {
        if (this.props.size == "breadcrumb")
            return;
        if (this.props.size != "preview")
            load_relations_Lecture(this);
        this.thread = setInterval(() => {
            if (this.state.dirty_Course.count() > 0) {
                let first = this.state.dirty_Course.first();
                this.setState(Object.assign({}, this.state, { dirty_Course: this.state.dirty_Course.remove(first.Id) }), () => Api.update_Course(first));
            }
            else if (this.state.dirty_Topic.count() > 0) {
                let first = this.state.dirty_Topic.first();
                this.setState(Object.assign({}, this.state, { dirty_Topic: this.state.dirty_Topic.remove(first.Id) }), () => Api.update_Topic(first));
            }
        }, 500);
    }
    componentWillUnmount() {
        clearInterval(this.thread);
    }
    render() {
        if (this.props.size == "breadcrumb") {
            return Permissions.can_view_Lecture() ?
                render_breadcrumb_Lecture(this)
                : null;
        }
        return React.createElement("div", { id: `Lecture_${this.props.entity.Id.toString()}_${this.state.update_count}`, className: `model lecture`, style: { width: "100%" } },
            render_saving_animations_Lecture(this),
            this.props.nesting_depth == 0 ? render_menu_Lecture(this) : null,
            React.createElement("div", { style: this.props.nesting_depth == 0 ? { float: "right", width: "85%" } : {}, className: "content" },
                this.props.nesting_depth == 0 ?
                    React.createElement("div", null,
                        this.props.breadcrumbs(),
                        this.props.authentication_menu())
                    :
                        null,
                render_controls_Lecture(this),
                render_content_Lecture(this)));
    }
}
exports.LectureComponent = LectureComponent;
exports.Lecture = (props) => React.createElement(LectureComponent, Object.assign({}, props));
let any_of = (predicates) => () => predicates.map(p => p()).some(p => p);
exports.Lecture_to_page = (id) => {
    let can_edit = any_of([Permissions.can_edit_Lecture, Permissions.can_edit_Course_Lecture, Permissions.can_edit_Lecture_Topic, Permissions.can_edit_Course, Permissions.can_edit_Topic]);
    return Utils.scene_to_page(can_edit, exports.Lecture, Api.get_Lecture(id), Api.update_Lecture, "Lecture", `/Lectures/${id}`);
};
exports.Lecture_to = (id, target_element_id) => {
    Utils.render_page_manager(target_element_id, exports.Lecture_to_page(id));
};
//# sourceMappingURL=Lecture.js.map