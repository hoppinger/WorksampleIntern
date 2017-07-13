import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Immutable from 'immutable';
import {Editor, Entity, EditorState, RichUtils, AtomicBlockUtils} from 'draft-js';
import * as Draft from 'draft-js';

export type DraftEditorCommand =
    "undo" |
    "redo" |
    "delete" |
    "delete-word" |
    "backspace" |
    "backspace-word" |
    "backspace-to-start-of-line" |
    "bold" |
    "italic" |
    "underline" |
    "code" |
    "split-block" |
    "transpose-characters" |
    "move-selection-to-start-of-block" |
    "move-selection-to-end-of-block" |
    "secondary-cut" |
    "secondary-paste"

export type DraftBlockType =
    "unstyled" |
    "paragraph" |
    "header-one" |
    "header-two" |
    "header-three" |
    "header-four" |
    "header-five" |
    "header-six" |
    "unordered-list-item" |
    "ordered-list-item" |
    "blockquote" |
    "code-block" |
    "atomic"


export type RichTextState = {
  editor_state: EditorState
}

export type RichTextEditorProps = { 
    initial_state: EditorState,
    set_state: (s:EditorState, on_success?: () => void) => void,
    editable: boolean }

export class RichTextEditor extends React.Component<RichTextEditorProps, RichTextState> {
  constructor(props:RichTextEditorProps, context) {
    super(props, context)

    this.state = { editor_state: this.props.initial_state }
  }

  static serialize_state(editor_state:EditorState) : any {
    return JSON.stringify(Draft.convertToRaw(editor_state.getCurrentContent()))
  }

  static deserialize_state(raw_content:any) : EditorState {
    try {
      return EditorState.createWithContent(Draft.convertFromRaw(JSON.parse(raw_content)))
    } catch (e) {
      return RichTextEditor.empty_state()
    }
  }

  static empty_state() : EditorState {
    return EditorState.createEmpty()
  }

  onChange(new_editor_state:EditorState, on_success?: () => void) {
    this.setState({...this.state, editor_state: new_editor_state}, () => {
      if (on_success) on_success()
      this.props.set_state(new_editor_state)
    })
  }

  toggle_block_type(block_type:DraftBlockType) {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editor_state,
        block_type
      ), () => this.editor.focus()
    )
  }

  toggle_style(command:DraftEditorCommand) {
    this.handleKeyCommand(command)
  }

  handleKeyCommand(command:DraftEditorCommand) {
    let new_state = RichUtils.handleKeyCommand(this.state.editor_state, command);
    if (new_state) {
      this.onChange(new_state, () => {
        this.editor.focus()
      })
      return "handled"
    }
    return "not-handled"
  }

  insert_media(url:string, url_type:MediaType) {
    let entity_key = Entity.create(url_type, 'IMMUTABLE', {src: url})

    let new_editor_state = 
      AtomicBlockUtils.insertAtomicBlock(this.state.editor_state, entity_key, ' ')
    this.setState({...this.state, editor_state: new_editor_state}, () => {
      this.props.set_state(new_editor_state)
    })
  }

  editor: Editor = null
  render() {
    return (
      <div className="editor__inner">
        {this.props.editable ? 
          <SlideEditorButtonsBar toggle_style={(s:DraftEditorCommand) => this.toggle_style(s)}
                                 toggle_block_type={(s:DraftBlockType) => this.toggle_block_type(s)}
                                 insert_media={(url:string, url_type:MediaType) => this.insert_media(url, url_type)}
                                  />
           : 
          null}
        <div className="slide__text__editor" style={this.props.editable ? {border:"gray 2px solid", width:"75%"} : {width:"75%"}}>
          <Editor editorState={this.state.editor_state} 
                  onBlur={() => {}}
                  onChange={es => this.onChange(es)}
                  handleKeyCommand={(c:DraftEditorCommand) => this.handleKeyCommand(c)}
                  readOnly={!this.props.editable}
                  blockRendererFn={mediaBlockRenderer}                  
                  ref={(editor) => this.editor = editor }
                  spellCheck={true} />      
        </div>
      </div>
    )
  }
}

let styles = {
  media: {
  },
}

function mediaBlockRenderer(block:any) {
  if (block.getType() === 'atomic') {
    return {
      component: Media,
      editable: false,
    };
  }

  return null;
}

const Image = (props:{src:string}) => {
  return <img src={props.src} style={styles.media} />;
};

const Video = (props:{src:string}) => {
  return <video controls src={props.src} style={styles.media} />;
};

const YouTube = (props:{src:string}) => {
  return (<iframe width="420" height="315"
            src={props.src}>
          </iframe>)
};

export type MediaType = 'image' | 'video' | 'youtube'

let Media = (props) => {
  let entity = Entity.get(props.block.getEntityAt(0))
  const {src} = entity.getData()
  const type = entity.getType()

  if (type === 'image') {
    return <Image src={src} />
  } else if (type === 'video') {
    return <Video src={src} />;
  } else if (type === 'youtube') {
    return <YouTube src={src} />
  }

  return null
}

type SlideEditorButtonsBarProps = { 
  toggle_style: (c:DraftEditorCommand) => void,
  toggle_block_type: (c:DraftBlockType) => void,
  insert_media: (url:string, media_type:MediaType) => void }
class SlideEditorButtonsBar extends React.Component<
  SlideEditorButtonsBarProps, 
  void > {
  constructor(props:SlideEditorButtonsBarProps, context) {
    super(props, context)
  }
  
  render() {
    let button_style = {display:"inline-flex", float:"left"}
    return (
        <div style={{display:"inline-block"}} className="text__editor__menu__bar">
          <button style={button_style} className={`button button--secondary button--text button--small`} 
                  onClick={() => this.props.toggle_style('bold')}>
            <img className="control__icon" src="/images/draftjs/bold-text-option.svg" alt="Make bold"/>
          </button>
          <button style={button_style} className={`button button--secondary button--text button--small`} 
                  onClick={() => this.props.toggle_style('italic')}>
            <img className="control__icon" src="/images/draftjs/italicize-text.svg" alt="Make italic"/>
          </button>
          <button style={button_style} className={`button button--secondary button--text button--small`} 
                  onClick={() => this.props.toggle_style('underline')}>
            <img className="control__icon" src="/images/draftjs/underline-text-option.svg" alt="Make underlined"/>
          </button>

          <button style={button_style} className={`button button--secondary button--text button--small`} 
                  onClick={() => this.props.toggle_block_type('header-one')}>
            <img className="control__icon" src="/images/draftjs/header.svg" alt="Make header 1"/>
          </button>
          <button style={button_style} className={`button button--secondary button--text button--small`} 
                  onClick={() => this.props.toggle_block_type('header-two')}>
            <img className="control__icon" style={{width:"55%"}} src="/images/draftjs/header.svg" alt="Make header 2"/>
          </button>
          <button style={button_style} className={`button button--secondary button--text button--small`} 
                  onClick={() => this.props.toggle_block_type('header-three')}>
            <img className="control__icon" style={{width:"45%"}} src="/images/draftjs/header.svg" alt="Make header 1"/>
          </button>                  

          <button style={button_style} className={`button button--secondary button--text button--small`} 
                  onClick={() => this.props.toggle_block_type('unordered-list-item')}>
            <img className="control__icon" src="/images/draftjs/bullets.svg" alt="Add list"/>
          </button>
          <button style={button_style} className={`button button--secondary button--text button--small`} 
                  onClick={() => this.props.toggle_block_type('ordered-list-item')}>
            <img className="control__icon" src="/images/draftjs/numbers.svg" alt="Add numbered list"/>
          </button>
          <button style={button_style} className={`button button--secondary button--text button--small`} 
                  onClick={() => this.props.toggle_block_type('code-block')}>
            <img className="control__icon" src="/images/draftjs/code.svg" alt="Add code listing"/>
          </button>
          <button style={button_style} className={`button button--secondary button--text button--small`} 
                  onClick={() => this.props.toggle_block_type('blockquote')}>
            <img className="control__icon" src="/images/draftjs/quotes.svg" alt="Add quotation"/>
          </button>
          <button style={button_style} className={`button button--secondary button--text button--small`} 
                  onClick={() => this.file_input.click()}>
            <img className="control__icon" src="/images/draftjs/picture.svg" alt="Add image"/>
          </button>
          <input type="file" onChange={(e:React.FormEvent<HTMLInputElement>) => {
              let file = (e.target as any).files[0]
              if (!file) return
              let reader = new FileReader()
              reader.onload = (e:Event) => {
                let contents = (e.target as any).result
                this.props.insert_media(contents, "image")
              }
              reader.readAsDataURL(file)
          } } ref={(file_input) => this.file_input = file_input} style={{display: "none"}}/>
        </div>
    )
  }
  file_input:HTMLInputElement
}
