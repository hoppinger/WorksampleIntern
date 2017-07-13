"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const i18next = require("i18next");
exports.Cancel = (props) => React.createElement("button", { className: "button button--cancel", onClick: () => props.onClick() }, i18next.t('Cancel'));
exports.Add = (props) => React.createElement("button", { className: "button button--add", onClick: () => props.onClick() }, i18next.t(`Add existing ${props.target_name}`));
exports.Create = (props) => React.createElement("button", { className: "button button--create", onClick: () => props.onClick() }, i18next.t(`Create new ${props.target_name}`));
//# sourceMappingURL=button_utils.js.map