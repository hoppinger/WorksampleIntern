"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const draft_js_1 = require("draft-js");
const Draft = require("draft-js");
class RichTextEditor extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.editor = null;
        this.state = { editor_state: this.props.initial_state };
    }
    static serialize_state(editor_state) {
        return JSON.stringify(Draft.convertToRaw(editor_state.getCurrentContent()));
    }
    static deserialize_state(raw_content) {
        try {
            return draft_js_1.EditorState.createWithContent(Draft.convertFromRaw(JSON.parse(raw_content)));
        }
        catch (e) {
            return RichTextEditor.empty_state();
        }
    }
    static empty_state() {
        return draft_js_1.EditorState.createEmpty();
    }
    onChange(new_editor_state, on_success) {
        this.setState(Object.assign({}, this.state, { editor_state: new_editor_state }), () => {
            if (on_success)
                on_success();
            this.props.set_state(new_editor_state);
        });
    }
    toggle_block_type(block_type) {
        this.onChange(draft_js_1.RichUtils.toggleBlockType(this.state.editor_state, block_type), () => this.editor.focus());
    }
    toggle_style(command) {
        this.handleKeyCommand(command);
    }
    handleKeyCommand(command) {
        let new_state = draft_js_1.RichUtils.handleKeyCommand(this.state.editor_state, command);
        if (new_state) {
            this.onChange(new_state, () => {
                this.editor.focus();
            });
            return "handled";
        }
        return "not-handled";
    }
    insert_media(url, url_type) {
        let entity_key = draft_js_1.Entity.create(url_type, 'IMMUTABLE', { src: url });
        let new_editor_state = draft_js_1.AtomicBlockUtils.insertAtomicBlock(this.state.editor_state, entity_key, ' ');
        this.setState(Object.assign({}, this.state, { editor_state: new_editor_state }), () => {
            this.props.set_state(new_editor_state);
        });
    }
    render() {
        return (React.createElement("div", { className: "editor__inner" },
            this.props.editable ?
                React.createElement(SlideEditorButtonsBar, { toggle_style: (s) => this.toggle_style(s), toggle_block_type: (s) => this.toggle_block_type(s), insert_media: (url, url_type) => this.insert_media(url, url_type) })
                :
                    null,
            React.createElement("div", { className: "slide__text__editor", style: this.props.editable ? { border: "gray 2px solid", width: "75%" } : { width: "75%" } },
                React.createElement(draft_js_1.Editor, { editorState: this.state.editor_state, onBlur: () => { }, onChange: es => this.onChange(es), handleKeyCommand: (c) => this.handleKeyCommand(c), readOnly: !this.props.editable, blockRendererFn: mediaBlockRenderer, ref: (editor) => this.editor = editor, spellCheck: true }))));
    }
}
exports.RichTextEditor = RichTextEditor;
let styles = {
    media: {},
};
function mediaBlockRenderer(block) {
    if (block.getType() === 'atomic') {
        return {
            component: Media,
            editable: false,
        };
    }
    return null;
}
const Image = (props) => {
    return React.createElement("img", { src: props.src, style: styles.media });
};
const Video = (props) => {
    return React.createElement("video", { controls: true, src: props.src, style: styles.media });
};
const YouTube = (props) => {
    return (React.createElement("iframe", { width: "420", height: "315", src: props.src }));
};
let Media = (props) => {
    let entity = draft_js_1.Entity.get(props.block.getEntityAt(0));
    const { src } = entity.getData();
    const type = entity.getType();
    if (type === 'image') {
        return React.createElement(Image, { src: src });
    }
    else if (type === 'video') {
        return React.createElement(Video, { src: src });
    }
    else if (type === 'youtube') {
        return React.createElement(YouTube, { src: src });
    }
    return null;
};
class SlideEditorButtonsBar extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        let button_style = { display: "inline-flex", float: "left" };
        return (React.createElement("div", { style: { display: "inline-block" }, className: "text__editor__menu__bar" },
            React.createElement("button", { style: button_style, className: `button button--secondary button--text button--small`, onClick: () => this.props.toggle_style('bold') },
                React.createElement("img", { className: "control__icon", src: "/images/draftjs/bold-text-option.svg", alt: "Make bold" })),
            React.createElement("button", { style: button_style, className: `button button--secondary button--text button--small`, onClick: () => this.props.toggle_style('italic') },
                React.createElement("img", { className: "control__icon", src: "/images/draftjs/italicize-text.svg", alt: "Make italic" })),
            React.createElement("button", { style: button_style, className: `button button--secondary button--text button--small`, onClick: () => this.props.toggle_style('underline') },
                React.createElement("img", { className: "control__icon", src: "/images/draftjs/underline-text-option.svg", alt: "Make underlined" })),
            React.createElement("button", { style: button_style, className: `button button--secondary button--text button--small`, onClick: () => this.props.toggle_block_type('header-one') },
                React.createElement("img", { className: "control__icon", src: "/images/draftjs/header.svg", alt: "Make header 1" })),
            React.createElement("button", { style: button_style, className: `button button--secondary button--text button--small`, onClick: () => this.props.toggle_block_type('header-two') },
                React.createElement("img", { className: "control__icon", style: { width: "55%" }, src: "/images/draftjs/header.svg", alt: "Make header 2" })),
            React.createElement("button", { style: button_style, className: `button button--secondary button--text button--small`, onClick: () => this.props.toggle_block_type('header-three') },
                React.createElement("img", { className: "control__icon", style: { width: "45%" }, src: "/images/draftjs/header.svg", alt: "Make header 1" })),
            React.createElement("button", { style: button_style, className: `button button--secondary button--text button--small`, onClick: () => this.props.toggle_block_type('unordered-list-item') },
                React.createElement("img", { className: "control__icon", src: "/images/draftjs/bullets.svg", alt: "Add list" })),
            React.createElement("button", { style: button_style, className: `button button--secondary button--text button--small`, onClick: () => this.props.toggle_block_type('ordered-list-item') },
                React.createElement("img", { className: "control__icon", src: "/images/draftjs/numbers.svg", alt: "Add numbered list" })),
            React.createElement("button", { style: button_style, className: `button button--secondary button--text button--small`, onClick: () => this.props.toggle_block_type('code-block') },
                React.createElement("img", { className: "control__icon", src: "/images/draftjs/code.svg", alt: "Add code listing" })),
            React.createElement("button", { style: button_style, className: `button button--secondary button--text button--small`, onClick: () => this.props.toggle_block_type('blockquote') },
                React.createElement("img", { className: "control__icon", src: "/images/draftjs/quotes.svg", alt: "Add quotation" })),
            React.createElement("button", { style: button_style, className: `button button--secondary button--text button--small`, onClick: () => this.file_input.click() },
                React.createElement("img", { className: "control__icon", src: "/images/draftjs/picture.svg", alt: "Add image" })),
            React.createElement("input", { type: "file", onChange: (e) => {
                    let file = e.target.files[0];
                    if (!file)
                        return;
                    let reader = new FileReader();
                    reader.onload = (e) => {
                        let contents = e.target.result;
                        this.props.insert_media(contents, "image");
                    };
                    reader.readAsDataURL(file);
                }, ref: (file_input) => this.file_input = file_input, style: { display: "none" } })));
    }
}
//# sourceMappingURL=rich_text.js.map