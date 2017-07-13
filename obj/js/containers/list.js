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
let cache = {};
class Item extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { loading: false };
    }
    componentWillMount() {
        if (!cache[this.props.model_name])
            cache[this.props.model_name] = {};
        if (!cache[this.props.model_name][this.props.item.Id])
            cache[this.props.model_name][this.props.item.Id] = {};
        this.item_events = Math.max(0, ...Object.keys(cache[this.props.model_name][this.props.item.Id]).map(n => parseInt(n))) + 1;
        cache[this.props.model_name][this.props.item.Id][this.item_events] = ((new_item) => {
            this.props.set_item_without_notification(new_item);
        });
    }
    componentWillUnmount() {
        delete cache[this.props.model_name][this.props.item.Id][this.item_events];
    }
    componentWillReceiveProps(new_props) {
        this.setState(Object.assign({}, this.state));
    }
    size() {
        return (this.props.singleton && this.props.models_path.count() < 2) || this.props.maximised ? "maximised" : "minimised";
    }
    render() {
        if (!this.props.models_path.has(this.props.model_name)) {
            let item = (this.props.mode == "view" ?
                (this.size() == "minimised" || (!this.props.singleton && !this.props.allow_maximisation) ?
                    this.props.render_item_minimised(this.props.item)
                    : this.props.render_item_maximised(this.props.item))
                : this.props.render_item_editable(this.props.item, this.props.set_item_with_notification, this.size(), () => { }));
            let size_button = this.props.allow_maximisation ?
                (React.createElement("button", { className: `${this.size()} model__button--44w`, onClick: () => this.props.maximised ? this.props.minimise() : this.props.maximise() }, this.size() == "minimised" ?
                    React.createElement("img", { className: "control__icon--44w", src: this.props.fullscreen_when_maximised ? "/images/icon-enlarge.svg" : "/images/icon-menu-down.svg", alt: "Toggle out", height: "40", width: "44" })
                    : React.createElement("img", { className: "control__icon--44w", src: this.props.fullscreen_when_maximised ? "/images/icon-shrink.svg" : "/images/icon-menu-up.svg", alt: "Toggle in", height: "40", width: "44" }))) : null;
            return (React.createElement("div", null,
                size_button,
                item));
        }
        else {
            return this.props.render_item_minimised(this.props.item);
        }
    }
}
exports.Item = Item;
class SideMenu extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { scroll_alpha: 0.0 };
    }
    componentWillMount() {
        if (this.props.is_root && this.props.side_menu_label) {
            // this.thread = setInterval(() => {
            //   this.setState({...this.state, scroll_alpha:window.scrollY/(document.body.scrollHeight - window.innerHeight)})
            // }, 1000.0 / 60.0)
            this.on_scroll = window.onscroll = () => {
                let element = document.getElementById(`side_menu_${this.props.model_name}`);
                let element_offset_top = element.offsetTop;
                let element_rect = element.getBoundingClientRect();
                if (window.scrollY > 150) {
                    element.style.setProperty("top", `${(window.scrollY - 150)}px`);
                }
                else {
                    element.style.setProperty("top", `0px`);
                }
            };
        }
    }
    componentWillUnmount() {
        if (this.props.is_root && this.props.side_menu_label) {
            window.removeEventListener("scroll", this.on_scroll);
        }
    }
    render() {
        return (React.createElement("div", { id: `side_menu_${this.props.model_name}`, className: "side-menu", style: this.props.is_root ? { position: "absolute", top: `0px`, float: "left", left: "10px" } : {} }, this.props.items.sortBy(this.props.sort_by).map((item, i) => React.createElement("div", { className: `tab__link side-menu-item ${item == this.props.selection ? "active" : ""}`, onClick: this.props.select_item(item, i) }, this.props.side_menu_label(item)))));
    }
}
exports.SideMenu = SideMenu;
class List extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { scroll_alpha: 0.0, refresh_token: 0, page: 1, items: Immutable.List(), add_items_open: false, add_items: Immutable.List(), loading: true };
    }
    refresh_all_items() {
        return __awaiter(this, void 0, void 0, function* () {
            let items = this.props.get_items ? yield this.props.get_items() : [];
            let add_items = this.props.get_add_items ? yield this.props.get_add_items() : [];
            return this.setState(Object.assign({}, this.state, { refresh_token: this.state.refresh_token + 1, items: Immutable.List(items), add_items: Immutable.List(add_items), loading: false }));
        });
    }
    refresh_items() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.props.get_items)
                return;
            let items = yield this.props.get_items();
            return this.setState(Object.assign({}, this.state, { refresh_token: this.state.refresh_token + 1, items: Immutable.List(items), loading: false }));
        });
    }
    alert(message) {
        this.setState(Object.assign({}, this.state, { alert: message }));
    }
    unalert() {
        this.setState(Object.assign({}, this.state, { alert: undefined }));
    }
    refresh_add_items() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.props.get_add_items)
                return;
            let items = yield this.props.get_add_items();
            return this.setState(Object.assign({}, this.state, { refresh_token: this.state.refresh_token + 1, add_items: Immutable.List(items), loading: false }));
        });
    }
    componentWillMount() {
        this.refresh_items().then(() => this.refresh_add_items()).then(() => this.unalert()).catch(() => this.alert(`Error: cannot refresh list of ${this.props.model_name}.`));
    }
    render() {
        let ItemT = Item;
        let add_existing = (!this.props.singleton || this.state.items.count() < 1) && (!this.props.max_items || this.state.items.count() < this.props.max_items) && (this.props.is_root || this.props.mode != "view") && this.props.add_item ?
            (React.createElement("div", { className: `dropdown` },
                React.createElement("div", { className: "dropdown__label" }, "Select an item to add"),
                React.createElement("button", { className: `dropdown-toggle ${this.state.add_items_open ? "open" : "closed"}`, onClick: () => this.refresh_add_items().then(() => this.setState(Object.assign({}, this.state, { add_items_open: !this.state.add_items_open }))) }, "Toggle dropdown"),
                (this.state.add_items_open ?
                    (React.createElement("div", { className: `dropdown__options add-items ${this.props.model_name}` }, this.state.add_items.map((item, i) => React.createElement("div", { className: `dropdown__option add-item-button ${this.props.model_name}`, onClick: () => this.setState(Object.assign({}, this.state, { add_items_open: !this.state.add_items_open }), () => {
                            this.props.add_item(item).then(() => this.refresh_items().then(() => this.refresh_add_items())).catch(() => alert(`Creation of [${this.props.model_name}] failed.`));
                        }) }, this.props.render_item_minimised(this.props.mode)(item))))) : (React.createElement("div", null)))))
            : null;
        let create_button = (!this.props.singleton || this.state.items.count() < 1) && (!this.props.max_items || this.state.items.count() < this.props.max_items) && (this.props.is_root || this.props.mode != "view") && this.props.create_item ?
            (React.createElement("div", { className: "main__actions cf" }, this.props.create_item.map(c => React.createElement("button", { className: `button button--inline ${this.props.model_name}`, onClick: () => c.create().then(() => this.refresh_all_items().then(() => {
                    setTimeout(() => {
                        let new_item = document.getElementById(`${this.props.model_name}-item-${this.state.items.count() - 1}`);
                        if (new_item)
                            new_item.scrollIntoView({ behavior: "smooth" });
                    }, 50);
                    this.unalert();
                })).catch(() => this.alert(`Creation of [${this.props.model_name}] failed.`)) }, `${c.label}`))))
            : null;
        let select_item = (item, i) => () => this.setState(Object.assign({}, this.state, { selection: item }), () => document.getElementById(`${this.props.model_name}-item-${i}`).scrollIntoView({ behavior: "smooth" }));
        let SideMenuT = SideMenu;
        let side_menu = (!this.props.singleton && this.props.side_menu_label ?
            React.createElement(SideMenuT, Object.assign({}, this.props, { selection: this.state.selection, select_item: select_item, items: this.state.items }))
            : null);
        return (React.createElement("div", { className: `model__list-container ${this.props.list_style ? `list--${this.props.list_style}` : ""}` },
            side_menu,
            React.createElement("div", { id: `${this.props.model_name}-model-list`, key: this.state.refresh_token, className: ` model__list ${this.props.model_name}` },
                this.state.alert ? React.createElement("div", { className: "alert" }, this.state.alert) : null,
                this.props.list_style == "table" ? this.props.render_titles() : null,
                this.state.items.sortBy(this.props.sort_by).map((item, i) => {
                    let remove_button = (this.props.is_root || this.props.mode != "view") && this.props.delete_item ?
                        (React.createElement("button", { className: `model__button ${this.props.removal_type}`, onClick: () => this.props.delete_item(item).then(() => this.refresh_all_items().catch(() => this.alert(`Refresh of [${this.props.model_name}] failed.`))).then(() => {
                                setTimeout(() => {
                                    if (this.state.items.count() > 0 && this.props.list_style) {
                                        let next_item = document.getElementById(`${this.props.model_name}-item-${i == 0 ? 1 : i - 1}`);
                                        if (next_item)
                                            next_item.scrollIntoView({ behavior: "smooth" });
                                    }
                                }, 50);
                                this.unalert();
                            }).catch(() => this.alert(`Deletion of [${this.props.model_name}] failed.`)) }, this.props.removal_type)) : null;
                    let maximised_style = this.props.fullscreen_when_maximised && item == this.state.selection ?
                        { position: "fixed", top: "0", left: "0", width: "100%", height: "100%", zIndex: "100" }
                        : {};
                    let next_prev_buttons = this.props.fullscreen_when_maximised && item == this.state.selection ?
                        React.createElement("div", { style: { zIndex: 200 } },
                            React.createElement("button", { style: { position: "absolute", left: "15px", bottom: "15px" }, disabled: i <= 0, className: `model__button`, onClick: () => {
                                    this.setState(Object.assign({}, this.state, { selection: this.state.items.get(i - 1) }));
                                } },
                                React.createElement("img", { className: "control__icon", src: "/images/icon-left.svg", alt: "Previous", height: "40", width: "40" })),
                            React.createElement("button", { style: { position: "absolute", left: "70px", bottom: "15px" }, disabled: i >= this.state.items.count() - 1, className: `model__button`, onClick: () => {
                                    this.setState(Object.assign({}, this.state, { selection: this.state.items.get(i + 1) }));
                                } },
                                React.createElement("img", { className: "control__icon", src: "/images/icon-right.svg", alt: "Next", height: "40", width: "40" }))) : null;
                    let gallery_item_size = this.props.models_path.count() > 0 ? "250px" : "500px";
                    let set_item_with_notification = (new_item, callback) => {
                        for (let c in cache[this.props.model_name][item.Id])
                            cache[this.props.model_name][item.Id][c](new_item);
                        this.setState(Object.assign({}, this.state, { items: this.state.items.set(i, new_item) }), callback);
                    };
                    let set_item_without_notification = (new_item, callback) => {
                        this.setState(Object.assign({}, this.state, { refresh_token: this.state.refresh_token + 1, items: this.state.items.set(i, new_item) }), callback);
                    };
                    return (React.createElement("div", { className: `${this.props.model_name} model-item${this.props.fullscreen_when_maximised && item == this.state.selection ? " model-fullscreen" : ""}`, id: `${this.props.model_name}-item-${i}` },
                        React.createElement("div", { className: `cf` },
                            remove_button,
                            React.createElement(ItemT, { item: item, singleton: this.props.singleton, allow_maximisation: this.props.allow_maximisation, fullscreen_when_maximised: this.props.fullscreen_when_maximised, maximised: this.state.selection == item, maximise: select_item(item, i), minimise: () => this.setState(Object.assign({}, this.state, { selection: undefined })), mode: this.props.mode, model_name: this.props.model_name, models_path: this.props.models_path, set_item_with_notification: set_item_with_notification, set_item_without_notification: set_item_without_notification, render_item_editable: this.props.render_item_editable ? this.props.render_item_editable(this.props.mode) : this.props.render_item_minimised(this.props.mode), render_item_maximised: this.props.render_item_maximised(this.props.mode), render_item_minimised: this.props.render_item_minimised(this.props.mode) }),
                            next_prev_buttons)));
                })),
            add_existing,
            create_button));
    }
}
exports.List = List;
class CachedRenderer extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { cache: { models: Immutable.Map() } };
    }
    ensure_model_name(models) {
        if (models.has(this.props.model_name))
            return models;
        else
            return models.set(this.props.model_name, Immutable.Map());
    }
    render() {
        let ListT = List;
        let props = Object.assign({}, this.props);
        return (React.createElement(ListT, Object.assign({}, props)));
    }
}
function render_list(props) {
    let CachedRendererT = CachedRenderer;
    return (React.createElement(CachedRendererT, Object.assign({}, props)));
}
exports.render_list = render_list;
function render_list_to(props, target_id) {
    let CachedRendererT = CachedRenderer;
    ReactDOM.render(React.createElement(CachedRendererT, Object.assign({}, props)), document.getElementById(target_id));
}
exports.render_list_to = render_list_to;
exports.already_seen = (models_path, item, model_name) => models_path.has(model_name) && models_path.get(model_name).has(item.Id);
exports.visit = (models_path, item, model_name) => models_path.has(model_name) ?
    models_path.set(model_name, models_path.get(model_name).add(item.Id)) :
    models_path.set(model_name, Immutable.Set().add(item.Id));
//# sourceMappingURL=list.js.map