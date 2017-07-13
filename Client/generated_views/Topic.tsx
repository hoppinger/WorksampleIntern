import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"
import * as Models from '../generated_models'
import * as Api from '../generated_api'
import * as List from '../containers/list'
import * as RichText from '../containers/rich_text'
import * as LazyImage from '../containers/lazy_image'
import * as Buttons from '../containers/button_utils'
import * as Permissions from './permissions'
import * as Utils from './view_utils'
import * as Draft from 'draft-js'
import * as i18next from 'i18next'

import * as HomePageViews from './HomePage'
import * as LectureViews from './Lecture'
import * as CustomViews from '../custom_views'
  

export function existing_Topic_Lecture_Topic_page_index(self:TopicContext) { 
  return !self.state.existing_Lecture || self.state.existing_Lecture == "saving" ? 0 : self.state.existing_Lecture.PageIndex 
}
export function existing_Topic_Lecture_Topic_page_size(self:TopicContext) { 
  return !self.state.existing_Lecture || self.state.existing_Lecture == "saving" ? 25 : self.state.existing_Lecture.PageSize 
}
export function existing_Topic_Lecture_Topic_num_pages(self:TopicContext) { 
  return !self.state.existing_Lecture || self.state.existing_Lecture == "saving" ? 1 : self.state.existing_Lecture.NumPages 
}

export function Topic_Lecture_Topic_page_index(self:TopicContext) { 
  return self.state.Lecture == "loading" ? 0 : self.state.Lecture.PageIndex 
}
export function Topic_Lecture_Topic_page_size(self:TopicContext) { 
  return self.state.Lecture == "loading" ? 25 : self.state.Lecture.PageSize 
}
export function Topic_Lecture_Topic_num_pages(self:TopicContext) { 
  return self.state.Lecture == "loading" ? 1 : self.state.Lecture.NumPages 
}
 
export function load_relations_Topic(self:TopicContext, callback?:()=>void) {
  Permissions.can_view_Lecture() && Api.get_Topic_Lecture_Topics(self.props.entity, Topic_Lecture_Topic_page_index(self), Topic_Lecture_Topic_page_size(self)).then(Lectures => 
    self.setState({...self.state, update_count:self.state.update_count+1,
        Lecture:Utils.raw_page_to_paginated_items<Models.Lecture, Utils.EntityAndSize<Models.Lecture> & { shown_relation:string }>(i => { 
          return {
            element:i, 
            size: self.state.Lecture != "loading" && self.state.Lecture.Items.has(i.Id) ? self.state.Lecture.Items.get(i.Id).size : "preview", 
            shown_relation:"all"}}, Lectures)
        }), callback)
}

export function set_size_Topic(self:TopicContext, new_size:Utils.EntitySize) {
  self.props.set_size(new_size, () => {
    if (new_size == "fullscreen")
      self.props.push(Topic_to_page(self.props.entity.Id))
    else if (new_size != "preview")
      load_relations_Topic(self, )
  })
}

export function render_Topic_Name_editable(self:TopicContext) {
  return !Permissions.can_view_Topic_Name() ? <div /> : 
         <div className="model__attribute name">
  <label className="attribute-label attribute-label-name">{i18next.t('Topic:Name')}</label>
  <h1><input disabled={!Permissions.can_edit_Topic_Name()} type="text"
                  defaultValue={self.props.entity.Name} 
                  onChange={(e) => {
                    let new_value = (e.target as HTMLInputElement).value
                    self.props.set_entity({...self.props.entity, Name: new_value})
                  } }/></h1>
</div>
}


export function render_editable_attributes_minimised_Topic(self:TopicContext) { 
  let attributes = (<div>
      {render_Topic_Name_editable(self)}
    </div>)
  return attributes
}

export function render_editable_attributes_maximised_Topic(self:TopicContext) { 
    let attributes = (<div>
        {render_Topic_Name_editable(self)}
      </div>)
    return attributes
  }

export function render_breadcrumb_Topic(self:TopicContext) {
  return <div className="breadcrumb-topic">"Topic"</div>
}

export function render_menu_Topic(self:TopicContext) {
  return <div style={{float:"left", position:"fixed", top:"0", left:"0", width:"15%", height:"100%", backgroundColor:"lightgray"}} className="menu">
        <div className="logo" style={{textAlign:"center"}}>
         <img className="logo" style={{display:"inline-block", width:"50%"}} src={"/images/logo.png"} alt="Logo"/>
       </div>
        <div className="pages">
           <div className={`menu_entry page_link active`}>
                <a onClick={() => 
                  self.props.set_shown_relation("none")
                }>
                  {i18next.t('Topic')}
                </a>
            </div>
            <div className="menu_entries">
              
              
            </div>
          {!Permissions.can_view_HomePage() ? null :
              <div className={`menu_entry page_link`}>
                <a onClick={() => 
                  Api.get_HomePages(0, 1).then(e => 
                    e.Items.length > 0 && self.props.set_page(HomePageViews.HomePage_to_page(e.Items[0].Item.Id))
                  )
                }>
                  {i18next.t('HomePage')}
                </a>
              </div>
            }
            
            
        </div>
      </div>
}

export function render_controls_Topic(self:TopicContext) {
  return <div className="control">
    {self.props.allow_maximisation && self.props.set_size ? <a className="topic control__button toggle-size" 
          onClick={() => {
            set_size_Topic(self, self.props.size == "preview" ? "large" : "preview")}
          }>
        <img className="control__icon" src={self.props.size == "preview" ? "/images/icon-menu-down.svg" : "/images/icon-menu-up.svg"} alt="Toggle size"/>
      </a> : null}
    
    {Permissions.can_delete_Topic() && self.props.size == "fullscreen" ? <a className="topic control__button delete" 
      onClick={() => confirm(i18next.t('Are you sure?')) && 
        Api.delete_Topic(self.props.entity).then(() => self.props.pop())
      }>
      <img className="control__icon" src={"/images/icon-remove.svg"} alt="Delete"/>
    </a> : null}
    {self.props.size == "fullscreen" && self.props.pages_count > 0 ? <a className="topic control__button cancel" 
        onClick={() => self.props.pop()}>
      <img className="control__icon" src={"/images/icon-cancel.svg"} alt="Delete"/>
    </a> : null}
    
    {self.props.toggle_button ? self.props.toggle_button() : null}
    {self.props.unlink && self.props.mode != "view" ? 
      <a className="topic control__button unlink" 
          onClick={() => self.props.unlink()}>
        <img className="control__icon" src="/images/icon-unlink.svg" alt="Unlink"/>
      </a>
      :
      null
    }
    {self.props.delete && self.props.mode != "view" ? 
      <a className="topic control__button remove" 
          onClick={() => self.props.delete()}>
        <img className="control__icon" src="/images/icon-remove.svg" alt="Remove"/>
      </a>
      :
      null
    }
  </div>
}

export function render_content_Topic(self:TopicContext) {
  return <div className="model-content">
    {Permissions.can_view_Topic() ?
      self.props.size == "preview" ? 
        render_preview_Topic(self)
      : self.props.size == "large" ? 
        render_large_Topic(self)
      : self.props.size == "fullscreen" ? 
        render_large_Topic(self)
      : "Error: unauthorised access to entity."
    : "Error: unauthorised access to entity."
    }  
  </div>
}

export function render_Topic_Name(self:TopicContext) {
  return !Permissions.can_view_Topic_Name() ? "" : <div className="model__attribute name">
    <label className="attribute-label attribute-label-name">{i18next.t('Topic:Name')}</label>
    {self.props.entity.Name}
  </div>
}

export function render_preview_Topic(self:TopicContext) {
  let attributes:JSX.Element = null
  if (self.props.mode == "view" || !Permissions.can_edit_Topic())
    attributes = (<div className="model__attributes">
      { render_Topic_Name(self) }
    </div>)
  else
    attributes = render_editable_attributes_minimised_Topic(self)
  return (<div className="block">
      {attributes}
    </div>)
}

export function render_large_Topic(self:TopicContext) {
  let attributes:JSX.Element = null
  if (self.props.mode == "view" || !Permissions.can_edit_Topic())
    attributes = (<div className="model__attributes">
      { render_Topic_Name(self) }
    </div>)
  else
    attributes = render_editable_attributes_maximised_Topic(self)
  return (<div className="block">
      {attributes}
      {render_relations_Topic(self)}
    </div>)
}

export function render_relations_Topic(self:TopicContext) {
  return <div className="relations">    
    </div>
}

export function render_add_existing_Topic_Lecture_Topic(self:TopicContext) {
    return self.props.mode == "edit" ?
      <div>
        {
          self.state.existing_Lecture == "saving" ?
            <div className="saving"></div>
            :
            self.state.existing_Lecture ?
              <div className="overlay new-lecture-background">
                <div className="overlay__item overlay__item--new add-existing-lecture">
                <Utils.Paginator PageIndex={self.state.existing_Lecture.PageIndex} NumPages={self.state.existing_Lecture.NumPages}
                      page_selected={new_page_index => 
                        self.state.existing_Lecture != "saving" &&
                        self.setState({...self.state, 
                          existing_Lecture: {
                            ...self.state.existing_Lecture,
                            PageIndex:new_page_index
                          }
                        }, () =>  load_relations_Topic(self, ))
                      } />
                  <div className="group">
                    {
                      self.state.existing_Lecture.Items.map((i,i_id) => 
                        <div key={i_id} className="group__item">
                          <a className="group__button button"
                            onClick={() => 
                                self.setState({...self.state, existing_Lecture:"saving"}, () => 
                                  Api.link_Topic_Lecture_Topics(self.props.entity, i).then(() => 
                                    self.setState({...self.state, existing_Lecture:undefined}, () =>
                                      load_relations_Topic(self, ))))
                              }>
                            <img className="control__icon" src="/images/icon-plus.svg" alt="Add existing item"/>
                          </a>
                          <div className="group__title" disabled={true}>
                            {
                              LectureViews.Lecture({
                                ...self.props,
                                entity:i,
                                nesting_depth:self.props.nesting_depth+1,
                                size:"preview",
                                mode:"view",
                                set_size:undefined,
                                toggle_button:undefined,
                                set_entity:(new_entity:Models.Lecture, callback?:()=>void) => {},
                                unlink: undefined,
                                delete: undefined 
                              })
                            }
                          </div>
                        </div>
                      ).valueSeq()
                    }
                  </div>
                  <Buttons.Cancel onClick={() => self.setState({...self.state, existing_Lecture:undefined})} />
                </div>
              </div>
              :
              null
          }
          
        <div className="existing-lecture">
          <button 
                  className="button button--add" 
                  onClick={() => 
                    Api.get_unlinked_Topic_Lecture_Topics(self.props.entity, existing_Topic_Lecture_Topic_page_index(self), existing_Topic_Lecture_Topic_page_size(self)).then(es =>
                      self.setState({...self.state, 
                        add_step_Lecture:"closed", 
                        existing_Lecture:Utils.raw_page_to_paginated_items(e => e, es)
                      })
                    )
                  }>
              {i18next.t('Add existing Lecture')}
          </button>
        </div>
        
        </div>
      : 
      null
    }
  

export function render_new_Topic_Lecture_Topic(self:TopicContext) {
    return self.props.mode == "edit" ?
      <div className="button__actions">
        {
          self.state.new_Lecture == "saving" ?
            null
            :
            self.state.new_Lecture ?
              <div className="overlay new-lecture-background">
                <div className="overlay__item overlay__item--new new-lecture">
                  {
                    LectureViews.Lecture({
                      ...self.props,
                      entity:self.state.new_Lecture,
                      nesting_depth:self.props.nesting_depth+1,
                      size:"preview",
                      mode:"edit",
                      set_size:undefined,
                      toggle_button:undefined,
                      set_entity:(new_entity:Models.Lecture, callback?:()=>void, force_update_count_increment?:boolean) => 
                        self.setState({...self.state, 
                          update_count:force_update_count_increment ? self.state.update_count+1 : self.state.update_count, 
                          new_Lecture:new_entity}, callback),
                      unlink: undefined,
                      delete: undefined 
                    })
                  }
                  <div className="button__actions">
                    <button className="button button--save button--inline" 
                            onClick={() => {
                                if (self.state.new_Lecture && self.state.new_Lecture != "saving") {
                                  let new_Lecture = self.state.new_Lecture
                                  self.setState({...self.state, new_Lecture:"saving"}, () =>
                                  Api.create_linked_Topic_Lecture_Topics_Lecture(self.props.entity).then(e => {
                                        e.length > 0 &&
                                        Api.update_Lecture({...new_Lecture, CreatedDate:e[0].CreatedDate, Id:e[0].Id}).then(() =>
                                          load_relations_Topic(self, ))
                                      }
                                    )
                                  )
                                }
                              }
                            }>
                      {i18next.t('Save and close')}
                    </button>
                    <Buttons.Cancel onClick={() => self.setState({...self.state, new_Lecture:undefined})} />
                  </div>                      
                </div>
              </div>
              :
              null
          }
          <div className="new-lecture">
              <button 
                      className="new-lecture button button--new" 
                      onClick={() => 
                        self.setState({...self.state,
                          add_step_Lecture:"closed", 
                          new_Lecture:
                            ({ Id:-1, CreatedDate:null,  Name:"", Description:"", IsPracticum:false } as Models.Lecture)
                          }
                        )
                      }>
                  Create new Lecture
              </button>
            </div>
        </div>
      : 
      null
    }
  

export function render_saving_animations_Topic(self:TopicContext) {
  return self.state.dirty_Lecture.count() > 0 ? 
    <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"red"}} className="saving"/>
    : <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"cornflowerblue"}} className="saved"/>
}

export type TopicContext = {state:TopicState, props:Utils.EntityComponentProps<Models.Topic>, setState:(new_state:TopicState, callback?:()=>void) => void}

export type TopicState = { 
    update_count:number
    existing_Lecture?:"saving"|Utils.PaginatedItems<Models.Lecture>, new_Lecture?:"saving"|Models.Lecture, dirty_Lecture:Immutable.Map<number,Models.Lecture>, Lecture:Utils.PaginatedItems<{ shown_relation: string } & Utils.EntityAndSize<Models.Lecture>>|"loading"
  }
export class TopicComponent extends React.Component<Utils.EntityComponentProps<Models.Topic>, TopicState> {
  constructor(props:Utils.EntityComponentProps<Models.Topic>, context:any) { 
    super(props, context) 
    this.state = { update_count:0, dirty_Lecture:Immutable.Map<number,Models.Lecture>(), Lecture:"loading" }
  }

  componentWillReceiveProps(new_props:Utils.EntityComponentProps<Models.Topic>) {
    if (new_props.size == "breadcrumb") return
    let current_logged_in_entity =  null
    let new_logged_in_entity =  null
    if (new_props.mode != this.props.mode || (new_props.size != this.props.size && (new_props.size == "large" || new_props.size == "fullscreen")) ||
        (current_logged_in_entity && !new_logged_in_entity) ||
        (!current_logged_in_entity && new_logged_in_entity) ||
        (current_logged_in_entity && new_logged_in_entity && current_logged_in_entity.Id != new_logged_in_entity.Id)) {
      load_relations_Topic(this, )
    }
  }

  thread:number = null
  componentWillMount() {
    if (this.props.size == "breadcrumb") return
    if (this.props.size != "preview")
      load_relations_Topic(this, )

    this.thread = setInterval(() => {
      if (this.state.dirty_Lecture.count() > 0) {
         let first = this.state.dirty_Lecture.first()
         this.setState({...this.state, dirty_Lecture: this.state.dirty_Lecture.remove(first.Id)}, () => 
           Api.update_Lecture(first)
         )
       }

    }, 500)
  }

  componentWillUnmount() {
    clearInterval(this.thread)
  }

  render() {
    if (this.props.size == "breadcrumb") {
      return Permissions.can_view_Topic() ? 
              render_breadcrumb_Topic(this)
              : null
    }

    return <div id={`Topic_${this.props.entity.Id.toString()}_${this.state.update_count}`} className={`model topic`} style={{width:"100%"}}>
      { render_saving_animations_Topic(this) }
      {this.props.nesting_depth == 0 ? render_menu_Topic(this) : null }
      <div style={this.props.nesting_depth == 0 ? {float:"right", width:"85%"} : {}} className="content">
        {
          this.props.nesting_depth == 0 ?
          <div>
            { this.props.breadcrumbs() }
            { this.props.authentication_menu() }
          </div>
          :
          null
        }
        { render_controls_Topic(this) }
        { render_content_Topic(this) }
      </div>
    </div>
  }
}

export let Topic = (props:Utils.EntityComponentProps<Models.Topic>) : JSX.Element =>
  <TopicComponent {...props} />

let any_of = (predicates:Array<(() => boolean)>) => 
             () => 
             predicates.map(p => p()).some(p => p)

export let Topic_to_page = (id:number) => {
  let can_edit = any_of([Permissions.can_edit_Topic, Permissions.can_edit_Lecture_Topic, Permissions.can_edit_Lecture])
  return Utils.scene_to_page<Models.Topic>(can_edit, Topic, Api.get_Topic(id), Api.update_Topic, "Topic", `/Topics/${id}`)
}

export let Topic_to = (id:number, target_element_id:string, ) => {
  Utils.render_page_manager(target_element_id, 
    Topic_to_page(id),
    
  )
}
