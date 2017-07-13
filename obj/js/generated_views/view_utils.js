"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const Immutable = require("immutable");
const i18next = require("i18next");
class AuthenticationMenu extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.username = null;
        this.email = null;
        this.email_confirmation = null;
        this.password = null;
        this.new_password = null;
        this.new_password_confirmation = null;
        this.state = { kind: "menu" };
    }
    render() {
        let current_logged_in_entity = null;
        let current_state = this.state;
        let restore_state = () => this.setState(current_state);
        let error = (message) => () => this.setState(Object.assign({}, this.state, { kind: "error", message: message, action: restore_state }));
        let authentication_menu_style = { position: "fixed", background: "white", padding: "10px", zIndex: 10000, top: "0px", right: "0px" };
        if (this.state.kind == "menu") {
            return React.createElement("div", { className: "authentication-menu", style: authentication_menu_style },
                React.createElement("a", { className: "button-open-authentication", style: { display: "block", margin: "15px" }, onClick: () => {
                        if (current_logged_in_entity)
                            this.setState({ kind: "choose-logout-changepassword" });
                        else
                            this.setState({ kind: "choose-login-register" });
                    } },
                    React.createElement("div", null, current_logged_in_entity ?
                        React.createElement("img", { className: "control__icon", src: "/images/icon-user-list.svg", alt: "Authentication options", height: "40", width: "40" })
                        :
                            React.createElement("img", { className: "control__icon", src: "/images/icon-user.svg", alt: "Login or register", height: "40", width: "40" }))),
                current_logged_in_entity ?
                    React.createElement(LanguageSelector, null)
                    :
                        null);
        }
        else if (this.state.kind == "choose-login-register") {
            return React.createElement("div", { className: "authentication-menu", style: authentication_menu_style });
        }
        else if (this.state.kind == "choose-logout-changepassword") {
            return React.createElement("div", { className: "authentication-menu", style: authentication_menu_style },
                React.createElement("a", { className: "button-change-password", style: { display: "block", margin: "5px" }, onClick: () => {
                        let action = (password, new_password, new_password_confirmation) => new_password_confirmation != new_password ?
                            error("Password and password confirmation do not match.")()
                            :
                                null;
                        this.setState(Object.assign({}, this.state, { kind: "changing-password", action: action }));
                    } }, i18next.t('Change password')),
                React.createElement("a", { className: "button-logout", style: { display: "block", margin: "5px" }, onClick: () => null }, i18next.t('Logout')),
                React.createElement("a", { className: "button-back", style: { display: "block", margin: "5px" }, onClick: () => this.setState({ kind: "menu" }) }, i18next.t('Back')));
        }
        else if (this.state.kind == "logging-in") {
            return React.createElement("div", { className: "authentication-menu", style: authentication_menu_style }, React.createElement("div", null,
                React.createElement("label", null, i18next.t('Username or email')),
                React.createElement("input", { type: "text", ref: u => this.username = u }),
                React.createElement("label", null, i18next.t('Password')),
                React.createElement("input", { type: "password", ref: p => this.password = p }),
                React.createElement("div", { style: { margin: "5px" } },
                    React.createElement("button", { className: "button button-submit", onClick: () => {
                            this.state.kind == "logging-in" && this.state.action(this.username.value, this.password.value);
                        } }, i18next.t('Submit')),
                    React.createElement("button", { className: "button button-cancel", onClick: () => {
                            this.setState(Object.assign({}, this.state, { kind: "menu" }));
                        } }, i18next.t('Cancel')),
                    React.createElement("a", { className: "button-forgotten-password", style: { display: "block", margin: "5px" }, onClick: () => {
                            this.state.kind == "logging-in" &&
                                this.setState(Object.assign({}, this.state, { kind: "resetting-password", action: this.state.reset_action }));
                        } }, i18next.t('Forgotten password')))));
        }
        else if (this.state.kind == "registering") {
            return React.createElement("div", { className: "authentication-menu", style: authentication_menu_style }, React.createElement("div", null,
                React.createElement("label", null, i18next.t('Username')),
                React.createElement("input", { type: "text", ref: u => this.username = u }),
                React.createElement("label", null, i18next.t('Email')),
                React.createElement("input", { type: "text", ref: u => this.email = u }),
                React.createElement("label", null, i18next.t('Email confirmation')),
                React.createElement("input", { type: "text", ref: u => this.email_confirmation = u }),
                React.createElement("div", { style: { margin: "5px" } },
                    React.createElement("button", { className: "button button-submit", onClick: () => {
                            this.state.kind == "registering" && this.state.action(this.username.value, this.email.value, this.email_confirmation.value);
                        } }, i18next.t('Submit')),
                    React.createElement("button", { className: "button button-cancel", onClick: () => {
                            this.setState(Object.assign({}, this.state, { kind: "menu" }));
                        } }, i18next.t('Cancel')))));
        }
        else if (this.state.kind == "changing-password") {
            return React.createElement("div", { className: "authentication-menu", style: authentication_menu_style }, React.createElement("div", null,
                React.createElement("label", null, i18next.t('Old password')),
                React.createElement("input", { type: "password", ref: p => this.password = p }),
                React.createElement("label", null, i18next.t('New password')),
                React.createElement("input", { type: "password", ref: p => this.new_password = p }),
                React.createElement("label", null, i18next.t('New password confirmation')),
                React.createElement("input", { type: "password", ref: p => this.new_password_confirmation = p }),
                React.createElement("div", null,
                    React.createElement("button", { className: "button button-submit", onClick: () => {
                            this.state.kind == "changing-password" && this.state.action(this.password.value, this.new_password.value, this.new_password_confirmation.value);
                        } }, i18next.t('Submit')),
                    React.createElement("button", { className: "button button-cancel", onClick: () => {
                            this.setState(Object.assign({}, this.state, { kind: "menu" }));
                        } }, i18next.t('Cancel')))));
        }
        else if (this.state.kind == "resetting-password") {
            return React.createElement("div", { className: "authentication-menu", style: authentication_menu_style }, React.createElement("div", null,
                React.createElement("label", null, i18next.t('Username or email')),
                React.createElement("input", { type: "text", ref: u => this.username = u }),
                React.createElement("div", null,
                    React.createElement("button", { className: "button button-submit", onClick: () => {
                            this.state.kind == "resetting-password" && this.state.action(this.username.value);
                        } }, i18next.t('Submit')),
                    React.createElement("button", { className: "button button-cancel", onClick: () => {
                            this.setState(Object.assign({}, this.state, { kind: "menu" }));
                        } }, i18next.t('Cancel')))));
        }
        else if (this.state.kind == "error") {
            return React.createElement("div", { className: "authentication-menu", style: authentication_menu_style },
                React.createElement("div", { className: "error message" }, this.state.message),
                React.createElement("button", { className: "button button-ok", onClick: () => this.state.kind == "error" && this.state.action() }, i18next.t('Ok')));
        }
    }
}
exports.AuthenticationMenu = AuthenticationMenu;
class LanguageSelector extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { changing_language: false };
    }
    render() {
        return null;
    }
}
function raw_page_to_paginated_items(f, x) {
    return {
        Items: Immutable.Map(x.Items.map(e => [e.Item.Id, f(e.Item)])),
        Editable: Immutable.Map(x.Items.map(e => [e.Item.Id, e.Editable])),
        PageIndex: x.PageIndex,
        PageSize: x.PageSize,
        NumPages: x.NumPages
    };
}
exports.raw_page_to_paginated_items = raw_page_to_paginated_items;
class Paginator extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }
    render() {
        if (this.props.NumPages <= 1)
            return null;
        return React.createElement("div", { className: "paginator", style: { margin: "auto", width: "25%" } },
            this.props.NumPages > 3 ? React.createElement("a", { className: "page", style: { margin: "5px" }, onClick: () => this.props.page_selected(0) }, i18next.t('First')) : null,
            this.props.PageIndex > 2 ? "..." : null,
            this.props.PageIndex > 0 ?
                React.createElement("a", { className: "page", style: { margin: "5px" }, onClick: () => this.props.page_selected(this.props.PageIndex - 1) }, i18next.t('Prev')) : null,
            React.createElement("span", { className: "page", style: { margin: "5px" } }, this.props.PageIndex + 1),
            this.props.PageIndex < this.props.NumPages - 1 ?
                React.createElement("a", { className: "page", style: { margin: "5px" }, onClick: () => this.props.page_selected(this.props.PageIndex + 1) }, i18next.t('Next')) : null,
            this.props.PageIndex < this.props.NumPages - 2 ? "..." : null,
            this.props.NumPages > 3 ?
                React.createElement("a", { className: "page", style: { margin: "5px" }, onClick: () => this.props.page_selected(this.props.NumPages - 1) }, i18next.t('Last')) : null);
    }
}
exports.Paginator = Paginator;
// the scene will be responsible for most of the animations and transitions, but also 
// managing the stack of renderers for navigation and url rewrites
class Scene extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.thread = null;
        this.state = { current_renderer: props.initial_renderer, is_dirty: false, size: props.is_breadcrumb ? "breadcrumb" : "fullscreen", mode: "view" };
    }
    componentDidMount() {
        this.props.get_element.then(e => this.setState(Object.assign({}, this.state, { element: e })));
    }
    componentWillMount() {
        this.thread = setInterval(() => {
            if (this.state.is_dirty && this.state.element) {
                this.props.save_element(this.state.element).then(() => this.setState(Object.assign({}, this.state, { is_dirty: false }))).catch(() => console.log(`Update failed.`));
            }
        }, 500);
    }
    componentWillUnmount() {
        clearInterval(this.thread);
    }
    render() {
        let toggle_button = () => this.props.can_edit ?
            React.createElement("a", { className: "control__button toggle-mode", onClick: () => this.setState(Object.assign({}, this.state, { mode: this.state.mode == "view" ? "edit" : "view" })) },
                React.createElement("img", { className: "control__icon", src: this.state.mode == "view" ? "/images/icon-edit.svg" : "/images/icon-view.svg", alt: "View", height: "40", width: "40" }))
            :
                null;
        return this.state.element ?
            React.createElement("div", { className: "scene" },
                this.state.is_dirty ?
                    React.createElement("div", { style: { position: "fixed", top: 0, left: 0, zIndex: 1000, width: "20px", height: "20px", backgroundColor: "red" }, className: "saving" })
                    :
                        React.createElement("div", { style: { position: "fixed", top: 0, left: 0, zIndex: 1000, width: "20px", height: "20px", backgroundColor: "cornflowerblue" }, className: "saved" }),
                this.state.current_renderer({
                    shown_relation: this.props.shown_relation,
                    set_shown_relation: this.props.set_shown_relation,
                    is_animating: this.props.is_animating,
                    is_breadcrumb: this.props.is_breadcrumb,
                    pages_count: this.props.pages_count,
                    set_page: this.props.set_page,
                    push: this.props.push,
                    pop: this.props.pop,
                    always_maximised: this.props.always_maximised,
                    allow_fullscreen: this.props.allow_fullscreen,
                    allow_maximisation: this.props.allow_maximisation,
                    entity: this.state.element,
                    authentication_menu: this.props.authentication_menu,
                    breadcrumbs: this.props.breadcrumbs,
                    toggle_button: toggle_button,
                    nesting_depth: 0,
                    size: this.state.size,
                    mode: this.state.mode,
                    set_entity: (new_entity, callback, force_update_count_increment) => {
                        this.setState(Object.assign({}, this.state, { is_dirty: true, element: new_entity }), callback);
                    },
                    set_size: undefined
                }))
            : React.createElement("div", { className: "loading" }, "Loading...");
    }
}
function scene_to_page(can_edit, renderer, get_element, save_element, title, url) {
    let SceneT = Scene;
    return {
        render: (is_breadcrumb) => (is_animating) => (pages_count) => () => (shown_relation, set_shown_relation) => (authentication_menu, breadcrumbs) => (set_page, push, pop) => React.createElement(SceneT, { is_breadcrumb: is_breadcrumb, is_animating: is_animating, pages_count: pages_count, set_page: set_page, push: push, pop: pop, initial_renderer: renderer, get_element: get_element, shown_relation: shown_relation, set_shown_relation: set_shown_relation, authentication_menu: authentication_menu, breadcrumbs: breadcrumbs, allow_fullscreen: true, allow_maximisation: true, always_maximised: true, save_element: e => save_element(e), can_edit: can_edit() && !is_breadcrumb }),
        url: url,
        title: title
    };
}
exports.scene_to_page = scene_to_page;
class PageManager extends React.Component {
    constructor(props, context) {
        super();
        this.state = {
            pages: Immutable.Stack([Object.assign({}, props.initial_page, { shown_relation: "none" })]),
        };
    }
    componentWillMount() {
        this.onpopstate = window.addEventListener("popstate", (e) => {
            e.stopPropagation();
            this.pop();
        });
    }
    componentWillUnmount() {
        window.removeEventListener("popstate", this.onpopstate);
    }
    set_page(new_page, callback) {
        window.history.replaceState(null, new_page.title, new_page.url);
        this.setState(Object.assign({}, this.state, { pages: this.state.pages.push(Object.assign({}, new_page, { shown_relation: "none" })) }), () => this.setState(Object.assign({}, this.state, { pages: Immutable.Stack([Object.assign({}, new_page, { shown_relation: "none" })]) }), callback));
    }
    push(new_page, callback) {
        window.history.replaceState(null, new_page.title, new_page.url);
        this.setState(Object.assign({}, this.state, { pages: this.state.pages.push(Object.assign({}, new_page, { shown_relation: "none" })) }), callback);
    }
    pop(callback) {
        let new_pages = this.state.pages.pop();
        let new_page = new_pages.peek();
        window.history.replaceState(null, new_page.title, new_page.url);
        this.setState(Object.assign({}, this.state, { pages: new_pages }), callback);
    }
    render() {
        let authentication_menu = () => null;
        let breadcrumbs = () => React.createElement("div", { className: "breadcrumbs", style: { position: "fixed", zIndex: 10, top: "5px", left: "15%" } }, this.state.pages.count() == 1 ?
            null
            :
                this.state.pages.map((p, i) => React.createElement("a", { key: `${i}`, className: "breadcrumbs__item", style: Object.assign({}, (i == this.state.pages.count() - 1 ?
                        { pointerEvents: "none", border: "none" } : {}), (i == 0 ? { marginLeft: "5px" } : {})), onClick: () => {
                        let new_pages = Immutable.Stack(this.state.pages.reverse().take(i + 1).reverse());
                        let new_page = new_pages.peek();
                        window.history.replaceState(null, new_page.title, new_page.url);
                        this.setState(Object.assign({}, this.state, { pages: new_pages }));
                    } }, p.render(true)(false)(this.state.pages.count())()(p.shown_relation, np => { })(authentication_menu, breadcrumbs)((np, c) => { }, (np, c) => { }, c => { }))).reverse());
        return React.createElement("div", { id: "curr", key: `${this.state.pages.peek().url}_${this.state.pages.count()}` }, this.state.pages.peek().render(false)(false)(this.state.pages.count())()(this.state.pages.peek().shown_relation, (np, c) => this.setState(Object.assign({}, this.state, { pages: this.state.pages.pop().push(Object.assign({}, this.state.pages.peek(), { shown_relation: np })) }), c))(authentication_menu, breadcrumbs)((np, c) => this.set_page(np, c), (np, c) => this.push(np, c), c => this.pop(c)));
    }
}
exports.PageManager = PageManager;
function render_page_manager(target_element_id, initial_page) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/translations.json`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        let resources = yield res.json();
        i18next.init({
            lng: "en",
            fallbackLng: "en",
            ns: ["common", "HomePage", "Course", "Lecture", "Topic"],
            resources: resources
        }, (err, t) => {
            ReactDOM.render(React.createElement(PageManager, { initial_page: initial_page }), document.getElementById(target_element_id));
        });
    });
}
exports.render_page_manager = render_page_manager;
//# sourceMappingURL=view_utils.js.map