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
import * as TopicViews from './Topic'
import * as CourseViews from './Course'
import * as CustomViews from '../custom_views'
  

export function existing_Lecture_Course_Lecture_page_index(self:LectureContext) { 
  return !self.state.existing_Course || self.state.existing_Course == "saving" ? 0 : self.state.existing_Course.PageIndex 
}
export function existing_Lecture_Lecture_Topic_page_index(self:LectureContext) { 
  return !self.state.existing_Topic || self.state.existing_Topic == "saving" ? 0 : self.state.existing_Topic.PageIndex 
}
export function existing_Lecture_Course_Lecture_page_size(self:LectureContext) { 
  return !self.state.existing_Course || self.state.existing_Course == "saving" ? 25 : self.state.existing_Course.PageSize 
}
export function existing_Lecture_Lecture_Topic_page_size(self:LectureContext) { 
  return !self.state.existing_Topic || self.state.existing_Topic == "saving" ? 25 : self.state.existing_Topic.PageSize 
}
export function existing_Lecture_Course_Lecture_num_pages(self:LectureContext) { 
  return !self.state.existing_Course || self.state.existing_Course == "saving" ? 1 : self.state.existing_Course.NumPages 
}
export function existing_Lecture_Lecture_Topic_num_pages(self:LectureContext) { 
  return !self.state.existing_Topic || self.state.existing_Topic == "saving" ? 1 : self.state.existing_Topic.NumPages 
}

export function Lecture_Course_Lecture_page_index(self:LectureContext) { 
  return self.state.Course == "loading" ? 0 : self.state.Course.PageIndex 
}
export function Lecture_Lecture_Topic_page_index(self:LectureContext) { 
  return self.state.Topic == "loading" ? 0 : self.state.Topic.PageIndex 
}
export function Lecture_Course_Lecture_page_size(self:LectureContext) { 
  return self.state.Course == "loading" ? 25 : self.state.Course.PageSize 
}
export function Lecture_Lecture_Topic_page_size(self:LectureContext) { 
  return self.state.Topic == "loading" ? 25 : self.state.Topic.PageSize 
}
export function Lecture_Course_Lecture_num_pages(self:LectureContext) { 
  return self.state.Course == "loading" ? 1 : self.state.Course.NumPages 
}
export function Lecture_Lecture_Topic_num_pages(self:LectureContext) { 
  return self.state.Topic == "loading" ? 1 : self.state.Topic.NumPages 
}
 
export function load_relations_Lecture(self:LectureContext, callback?:()=>void) {
  Permissions.can_view_Course() && Api.get_Lecture_Course_Lectures(self.props.entity, Lecture_Course_Lecture_page_index(self), Lecture_Course_Lecture_page_size(self)).then(Courses => 
    self.setState({...self.state, update_count:self.state.update_count+1,
        Course:Utils.raw_page_to_paginated_items<Models.Course, Utils.EntityAndSize<Models.Course> & { shown_relation:string }>(i => { 
          return {
            element:i, 
            size: self.state.Course != "loading" && self.state.Course.Items.has(i.Id) ? self.state.Course.Items.get(i.Id).size : "preview", 
            shown_relation:"all"}}, Courses)
        }), callback)
    Permissions.can_view_Topic() && Api.get_Lecture_Lecture_Topics(self.props.entity, Lecture_Lecture_Topic_page_index(self), Lecture_Lecture_Topic_page_size(self)).then(Topics => 
    self.setState({...self.state, update_count:self.state.update_count+1,
        Topic:Utils.raw_page_to_paginated_items<Models.Topic, Utils.EntityAndSize<Models.Topic> & { shown_relation:string }>(i => { 
          return {
            element:i, 
            size: self.state.Topic != "loading" && self.state.Topic.Items.has(i.Id) ? self.state.Topic.Items.get(i.Id).size : "preview", 
            shown_relation:"all"}}, Topics)
        }), callback)
}

export function set_size_Lecture(self:LectureContext, new_size:Utils.EntitySize) {
  self.props.set_size(new_size, () => {
    if (new_size == "fullscreen")
      self.props.push(Lecture_to_page(self.props.entity.Id))
    else if (new_size != "preview")
      load_relations_Lecture(self, )
  })
}

export function render_Lecture_Name_editable(self:LectureContext) {
  return !Permissions.can_view_Lecture_Name() ? <div /> : 
         <div className="model__attribute name">
  <label className="attribute-label attribute-label-name">{i18next.t('Lecture:Name')}</label>
  <h1><input disabled={!Permissions.can_edit_Lecture_Name()} type="text"
                  defaultValue={self.props.entity.Name} 
                  onChange={(e) => {
                    let new_value = (e.target as HTMLInputElement).value
                    self.props.set_entity({...self.props.entity, Name: new_value})
                  } }/></h1>
</div>
}

export function render_Lecture_Description_editable(self:LectureContext) {
  return !Permissions.can_view_Lecture_Description() ? <div /> : 
         <div className="model__attribute description">
  <label className="attribute-label attribute-label-description">{i18next.t('Lecture:Description')}</label>
  <h1><input disabled={!Permissions.can_edit_Lecture_Description()} type="text"
                  defaultValue={self.props.entity.Description} 
                  onChange={(e) => {
                    let new_value = (e.target as HTMLInputElement).value
                    self.props.set_entity({...self.props.entity, Description: new_value})
                  } }/></h1>
</div>
}

export function render_Lecture_IsPracticum_editable(self:LectureContext) {
  return !Permissions.can_view_Lecture_IsPracticum() ? <div /> : 
         <div className="model__attribute ispracticum">
  <label className="attribute-label attribute-label-ispracticum">{i18next.t('Lecture:IsPracticum')}</label>
  <div>
            <input 
              disabled={!Permissions.can_edit_Lecture_IsPracticum()} 
              type="checkbox"
              checked={self.props.entity.IsPracticum} 
              onChange={(e) => {
                let new_value = (e.target as HTMLInputElement).checked
                self.props.set_entity({...self.props.entity, IsPracticum: new_value})
              } }
            />
          </div>
</div>
}


export function render_editable_attributes_minimised_Lecture(self:LectureContext) { 
  let attributes = (<div>
      {render_Lecture_Name_editable(self)}
        {render_Lecture_Description_editable(self)}
        {render_Lecture_IsPracticum_editable(self)}
        
        
    </div>)
  return attributes
}

export function render_editable_attributes_maximised_Lecture(self:LectureContext) { 
    let attributes = (<div>
        {render_Lecture_Name_editable(self)}
        {render_Lecture_Description_editable(self)}
        {render_Lecture_IsPracticum_editable(self)}
        
        
      </div>)
    return attributes
  }

export function render_breadcrumb_Lecture(self:LectureContext) {
  return <div className="breadcrumb-lecture">"Lecture"</div>
}

export function render_menu_Lecture(self:LectureContext) {
  return <div style={{float:"left", position:"fixed", top:"0", left:"0", width:"15%", height:"100%", backgroundColor:"lightgray"}} className="menu">
        <div className="logo" style={{textAlign:"center"}}>
         <img className="logo" style={{display:"inline-block", width:"50%"}} src={"/images/logo.png"} alt="Logo"/>
       </div>
        <div className="pages">
           <div className={`menu_entry page_link active`}>
                <a onClick={() => 
                  self.props.set_shown_relation("none")
                }>
                  {i18next.t('Lecture')}
                </a>
            </div>
            <div className="menu_entries">
              
            {!Permissions.can_view_Topic() ? null :
                  <div className={`menu_entry${self.props.shown_relation == "Lecture_Topic" ? " active" : ""}`}>
                    <a onClick={() => 
                      self.props.set_shown_relation("Lecture_Topic")
                    }>
                      {i18next.t('Lecture_Topics')}
                    </a>
                  </div>
                }  
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

export function render_controls_Lecture(self:LectureContext) {
  return <div className="control">
    {self.props.allow_maximisation && self.props.set_size ? <a className="lecture control__button toggle-size" 
          onClick={() => {
            set_size_Lecture(self, self.props.size == "preview" ? "large" : "preview")}
          }>
        <img className="control__icon" src={self.props.size == "preview" ? "/images/icon-menu-down.svg" : "/images/icon-menu-up.svg"} alt="Toggle size"/>
      </a> : null}
    
    {Permissions.can_delete_Lecture() && self.props.size == "fullscreen" ? <a className="lecture control__button delete" 
      onClick={() => confirm(i18next.t('Are you sure?')) && 
        Api.delete_Lecture(self.props.entity).then(() => self.props.pop())
      }>
      <img className="control__icon" src={"/images/icon-remove.svg"} alt="Delete"/>
    </a> : null}
    {self.props.size == "fullscreen" && self.props.pages_count > 0 ? <a className="lecture control__button cancel" 
        onClick={() => self.props.pop()}>
      <img className="control__icon" src={"/images/icon-cancel.svg"} alt="Delete"/>
    </a> : null}
    
    {self.props.toggle_button ? self.props.toggle_button() : null}
    {self.props.unlink && self.props.mode != "view" ? 
      <a className="lecture control__button unlink" 
          onClick={() => self.props.unlink()}>
        <img className="control__icon" src="/images/icon-unlink.svg" alt="Unlink"/>
      </a>
      :
      null
    }
    {self.props.delete && self.props.mode != "view" ? 
      <a className="lecture control__button remove" 
          onClick={() => self.props.delete()}>
        <img className="control__icon" src="/images/icon-remove.svg" alt="Remove"/>
      </a>
      :
      null
    }
  </div>
}

export function render_content_Lecture(self:LectureContext) {
  return <div className="model-content">
    {Permissions.can_view_Lecture() ?
      self.props.size == "preview" ? 
        render_preview_Lecture(self)
      : self.props.size == "large" ? 
        render_large_Lecture(self)
      : self.props.size == "fullscreen" ? 
        render_large_Lecture(self)
      : "Error: unauthorised access to entity."
    : "Error: unauthorised access to entity."
    }  
  </div>
}

export function render_Lecture_Name(self:LectureContext) {
  return !Permissions.can_view_Lecture_Name() ? "" : <div className="model__attribute name">
    <label className="attribute-label attribute-label-name">{i18next.t('Lecture:Name')}</label>
    {self.props.entity.Name}
  </div>
}
        export function render_Lecture_Description(self:LectureContext) {
  return !Permissions.can_view_Lecture_Description() ? "" : <div className="model__attribute description">
    <label className="attribute-label attribute-label-description">{i18next.t('Lecture:Description')}</label>
    {self.props.entity.Description}
  </div>
}
        export function render_Lecture_IsPracticum(self:LectureContext) {
  return !Permissions.can_view_Lecture_IsPracticum() ? "" : <div className="model__attribute ispracticum">
    <label className="attribute-label attribute-label-ispracticum">{i18next.t('Lecture:IsPracticum')}</label>
    {self.props.entity.IsPracticum}
  </div>
}

export function render_preview_Lecture(self:LectureContext) {
  let attributes:JSX.Element = null
  if (self.props.mode == "view" || !Permissions.can_edit_Lecture())
    attributes = (<div className="model__attributes">
      { render_Lecture_Name(self) }
        { render_Lecture_Description(self) }
        { render_Lecture_IsPracticum(self) }
    </div>)
  else
    attributes = render_editable_attributes_minimised_Lecture(self)
  return (<div className="block">
      {attributes}
    </div>)
}

export function render_large_Lecture(self:LectureContext) {
  let attributes:JSX.Element = null
  if (self.props.mode == "view" || !Permissions.can_edit_Lecture())
    attributes = (<div className="model__attributes">
      { render_Lecture_Name(self) }
        { render_Lecture_Description(self) }
        { render_Lecture_IsPracticum(self) }
    </div>)
  else
    attributes = render_editable_attributes_maximised_Lecture(self)
  return (<div className="block">
      {attributes}
      {render_relations_Lecture(self)}
    </div>)
}

export function render_relations_Lecture(self:LectureContext) {
  return <div className="relations">{
      (self.props.shown_relation != "all" && self.props.shown_relation != "Lecture_Topic") || !Permissions.can_view_Topic() ? null :
      self.state.Topic == "loading" ? 
        <div className="loading">{i18next.t('Loading Topic')}.</div>
        : 
        <div className="model-nested topic">
          <div className="model-nested__head">{i18next.t('Topics')}</div>
          <Utils.Paginator PageIndex={self.state.Topic.PageIndex} NumPages={self.state.Topic.NumPages}
                page_selected={new_page_index => 
                  self.state.Topic != "loading" &&
                  self.setState({...self.state, 
                    Topic: {
                      ...self.state.Topic,
                      PageIndex:new_page_index
                    }
                  }, () =>  load_relations_Lecture(self, ))
                } />
          {
            self.state.Topic.Items.map((i,i_id) => 
              <div key={i_id} className={`model-nested__item`} 
                     >
                {
                  TopicViews.Topic({
                    ...self.props,
                    entity:i.element,
                    nesting_depth:self.props.nesting_depth+1,
                    size: i.size,
                    allow_maximisation:true,
                    allow_fullscreen:true,
                    mode:self.props.mode == "edit" && (Permissions.can_edit_Lecture_Topic()
                          || Permissions.can_create_Lecture_Topic()
                          || Permissions.can_delete_Lecture_Topic())
                          && (self.state.Topic != "loading" && self.state.Topic.Editable.get(i_id)) ? 
                      self.props.mode : "view",
                    shown_relation:i.shown_relation,
                    set_shown_relation:(new_shown_relation:string, callback) => 
                      self.state.Topic != "loading" && 
                      self.setState({...self.state, 
                        Topic:
                          {
                            ...self.state.Topic,
                            Items:self.state.Topic.Items.set(i_id,{...self.state.Topic.Items.get(i_id), shown_relation:new_shown_relation})
                          }
                      }, callback),
                    set_size:(new_size:Utils.EntitySize, callback) => {
                      let new_shown_relation = new_size == "large" ? "all" : i.shown_relation
                      self.state.Topic != "loading" && 
                      self.setState({...self.state, 
                        Topic:
                          {
                            ...self.state.Topic,
                            Items:self.state.Topic.Items.set(i_id,
                              {...self.state.Topic.Items.get(i_id), 
                                size:new_size, shown_relation:new_shown_relation})
                          }
                      }, callback)
                    },
                    toggle_button:undefined,
                    set_entity:(new_entity:Models.Topic, callback?:()=>void, force_update_count_increment?:boolean) => 
                      self.state.Topic != "loading" && 
                      self.setState({...self.state, 
                        dirty_Topic:self.state.dirty_Topic.set(i_id, new_entity), 
                        update_count:force_update_count_increment ? self.state.update_count+1 : self.state.update_count, 
                        Topic:
                          {
                            ...self.state.Topic,
                            Items:self.state.Topic.Items.set(i_id,{...self.state.Topic.Items.get(i_id), element:new_entity})
                          }
                      }, callback),
                    delete: undefined, 
                      unlink: !Permissions.can_delete_Lecture_Topic() ?
                      null
                      :
                      () => confirm(i18next.t('Are you sure?')) && Api.unlink_Lecture_Lecture_Topics(self.props.entity, i.element).then(() =>
                        load_relations_Lecture(self, ))
                  })
                }
                
              </div>
            ).valueSeq()
          }
          <div >
            {Permissions.can_create_Topic() && Permissions.can_create_Lecture_Topic() ? render_new_Lecture_Lecture_Topic(self) : null}
            {Permissions.can_create_Lecture_Topic() ? render_add_existing_Lecture_Lecture_Topic(self) : null}
          </div>
        </div>
      }    
    </div>
}

export function render_add_existing_Lecture_Course_Lecture(self:LectureContext) {
    return self.props.mode == "edit" ?
      <div>
        {
          self.state.existing_Course == "saving" ?
            <div className="saving"></div>
            :
            self.state.existing_Course ?
              <div className="overlay new-course-background">
                <div className="overlay__item overlay__item--new add-existing-course">
                <Utils.Paginator PageIndex={self.state.existing_Course.PageIndex} NumPages={self.state.existing_Course.NumPages}
                      page_selected={new_page_index => 
                        self.state.existing_Course != "saving" &&
                        self.setState({...self.state, 
                          existing_Course: {
                            ...self.state.existing_Course,
                            PageIndex:new_page_index
                          }
                        }, () =>  load_relations_Lecture(self, ))
                      } />
                  <div className="group">
                    {
                      self.state.existing_Course.Items.map((i,i_id) => 
                        <div key={i_id} className="group__item">
                          <a className="group__button button"
                            onClick={() => 
                                self.setState({...self.state, existing_Course:"saving"}, () => 
                                  Api.link_Lecture_Course_Lectures(self.props.entity, i).then(() => 
                                    self.setState({...self.state, existing_Course:undefined}, () =>
                                      load_relations_Lecture(self, ))))
                              }>
                            <img className="control__icon" src="/images/icon-plus.svg" alt="Add existing item"/>
                          </a>
                          <div className="group__title" disabled={true}>
                            {
                              CourseViews.Course({
                                ...self.props,
                                entity:i,
                                nesting_depth:self.props.nesting_depth+1,
                                size:"preview",
                                mode:"view",
                                set_size:undefined,
                                toggle_button:undefined,
                                set_entity:(new_entity:Models.Course, callback?:()=>void) => {},
                                unlink: undefined,
                                delete: undefined 
                              })
                            }
                          </div>
                        </div>
                      ).valueSeq()
                    }
                  </div>
                  <Buttons.Cancel onClick={() => self.setState({...self.state, existing_Course:undefined})} />
                </div>
              </div>
              :
              null
          }
          
        <div className="existing-course">
          <button 
                  className="button button--add" 
                  onClick={() => 
                    Api.get_unlinked_Lecture_Course_Lectures(self.props.entity, existing_Lecture_Course_Lecture_page_index(self), existing_Lecture_Course_Lecture_page_size(self)).then(es =>
                      self.setState({...self.state, 
                        add_step_Course:"closed", 
                        existing_Course:Utils.raw_page_to_paginated_items(e => e, es)
                      })
                    )
                  }>
              {i18next.t('Add existing Course')}
          </button>
        </div>
        
        </div>
      : 
      null
    }
  
export function render_add_existing_Lecture_Lecture_Topic(self:LectureContext) {
    return self.props.mode == "edit" ?
      <div>
        {
          self.state.existing_Topic == "saving" ?
            <div className="saving"></div>
            :
            self.state.existing_Topic ?
              <div className="overlay new-topic-background">
                <div className="overlay__item overlay__item--new add-existing-topic">
                <Utils.Paginator PageIndex={self.state.existing_Topic.PageIndex} NumPages={self.state.existing_Topic.NumPages}
                      page_selected={new_page_index => 
                        self.state.existing_Topic != "saving" &&
                        self.setState({...self.state, 
                          existing_Topic: {
                            ...self.state.existing_Topic,
                            PageIndex:new_page_index
                          }
                        }, () =>  load_relations_Lecture(self, ))
                      } />
                  <div className="group">
                    {
                      self.state.existing_Topic.Items.map((i,i_id) => 
                        <div key={i_id} className="group__item">
                          <a className="group__button button"
                            onClick={() => 
                                self.setState({...self.state, existing_Topic:"saving"}, () => 
                                  Api.link_Lecture_Lecture_Topics(self.props.entity, i).then(() => 
                                    self.setState({...self.state, existing_Topic:undefined}, () =>
                                      load_relations_Lecture(self, ))))
                              }>
                            <img className="control__icon" src="/images/icon-plus.svg" alt="Add existing item"/>
                          </a>
                          <div className="group__title" disabled={true}>
                            {
                              TopicViews.Topic({
                                ...self.props,
                                entity:i,
                                nesting_depth:self.props.nesting_depth+1,
                                size:"preview",
                                mode:"view",
                                set_size:undefined,
                                toggle_button:undefined,
                                set_entity:(new_entity:Models.Topic, callback?:()=>void) => {},
                                unlink: undefined,
                                delete: undefined 
                              })
                            }
                          </div>
                        </div>
                      ).valueSeq()
                    }
                  </div>
                  <Buttons.Cancel onClick={() => self.setState({...self.state, existing_Topic:undefined})} />
                </div>
              </div>
              :
              null
          }
          
        <div className="existing-topic">
          <button 
                  className="button button--add" 
                  onClick={() => 
                    Api.get_unlinked_Lecture_Lecture_Topics(self.props.entity, existing_Lecture_Lecture_Topic_page_index(self), existing_Lecture_Lecture_Topic_page_size(self)).then(es =>
                      self.setState({...self.state, 
                        add_step_Topic:"closed", 
                        existing_Topic:Utils.raw_page_to_paginated_items(e => e, es)
                      })
                    )
                  }>
              {i18next.t('Add existing Topic')}
          </button>
        </div>
        
        </div>
      : 
      null
    }
  

export function render_new_Lecture_Course_Lecture(self:LectureContext) {
    return self.props.mode == "edit" ?
      <div className="button__actions">
        {
          self.state.new_Course == "saving" ?
            null
            :
            self.state.new_Course ?
              <div className="overlay new-course-background">
                <div className="overlay__item overlay__item--new new-course">
                  {
                    CourseViews.Course({
                      ...self.props,
                      entity:self.state.new_Course,
                      nesting_depth:self.props.nesting_depth+1,
                      size:"preview",
                      mode:"edit",
                      set_size:undefined,
                      toggle_button:undefined,
                      set_entity:(new_entity:Models.Course, callback?:()=>void, force_update_count_increment?:boolean) => 
                        self.setState({...self.state, 
                          update_count:force_update_count_increment ? self.state.update_count+1 : self.state.update_count, 
                          new_Course:new_entity}, callback),
                      unlink: undefined,
                      delete: undefined 
                    })
                  }
                  <div className="button__actions">
                    <button className="button button--save button--inline" 
                            onClick={() => {
                                if (self.state.new_Course && self.state.new_Course != "saving") {
                                  let new_Course = self.state.new_Course
                                  self.setState({...self.state, new_Course:"saving"}, () =>
                                  Api.create_linked_Lecture_Course_Lectures_Course(self.props.entity).then(e => {
                                        e.length > 0 &&
                                        Api.update_Course({...new_Course, CreatedDate:e[0].CreatedDate, Id:e[0].Id}).then(() =>
                                          load_relations_Lecture(self, ))
                                      }
                                    )
                                  )
                                }
                              }
                            }>
                      {i18next.t('Save and close')}
                    </button>
                    <Buttons.Cancel onClick={() => self.setState({...self.state, new_Course:undefined})} />
                  </div>                      
                </div>
              </div>
              :
              null
          }
          <div className="new-course">
              <button 
                      className="new-course button button--new" 
                      onClick={() => 
                        self.setState({...self.state,
                          add_step_Course:"closed", 
                          new_Course:
                            ({ Id:-1, CreatedDate:null,  Name:"", Description:"", StudyPoints:0, Published:false } as Models.Course)
                          }
                        )
                      }>
                  Create new Course
              </button>
            </div>
        </div>
      : 
      null
    }
  
export function render_new_Lecture_Lecture_Topic(self:LectureContext) {
    return self.props.mode == "edit" ?
      <div className="button__actions">
        {
          self.state.new_Topic == "saving" ?
            null
            :
            self.state.new_Topic ?
              <div className="overlay new-topic-background">
                <div className="overlay__item overlay__item--new new-topic">
                  {
                    TopicViews.Topic({
                      ...self.props,
                      entity:self.state.new_Topic,
                      nesting_depth:self.props.nesting_depth+1,
                      size:"preview",
                      mode:"edit",
                      set_size:undefined,
                      toggle_button:undefined,
                      set_entity:(new_entity:Models.Topic, callback?:()=>void, force_update_count_increment?:boolean) => 
                        self.setState({...self.state, 
                          update_count:force_update_count_increment ? self.state.update_count+1 : self.state.update_count, 
                          new_Topic:new_entity}, callback),
                      unlink: undefined,
                      delete: undefined 
                    })
                  }
                  <div className="button__actions">
                    <button className="button button--save button--inline" 
                            onClick={() => {
                                if (self.state.new_Topic && self.state.new_Topic != "saving") {
                                  let new_Topic = self.state.new_Topic
                                  self.setState({...self.state, new_Topic:"saving"}, () =>
                                  Api.create_linked_Lecture_Lecture_Topics_Topic(self.props.entity).then(e => {
                                        e.length > 0 &&
                                        Api.update_Topic({...new_Topic, CreatedDate:e[0].CreatedDate, Id:e[0].Id}).then(() =>
                                          load_relations_Lecture(self, ))
                                      }
                                    )
                                  )
                                }
                              }
                            }>
                      {i18next.t('Save and close')}
                    </button>
                    <Buttons.Cancel onClick={() => self.setState({...self.state, new_Topic:undefined})} />
                  </div>                      
                </div>
              </div>
              :
              null
          }
          <div className="new-topic">
              <button 
                      className="new-topic button button--new" 
                      onClick={() => 
                        self.setState({...self.state,
                          add_step_Topic:"closed", 
                          new_Topic:
                            ({ Id:-1, CreatedDate:null,  Name:"" } as Models.Topic)
                          }
                        )
                      }>
                  Create new Topic
              </button>
            </div>
        </div>
      : 
      null
    }
  

export function render_saving_animations_Lecture(self:LectureContext) {
  return self.state.dirty_Course.count() > 0 ? 
    <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"red"}} className="saving"/> : 
    self.state.dirty_Topic.count() > 0 ? 
    <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"red"}} className="saving"/>
    : <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"cornflowerblue"}} className="saved"/>
}

export type LectureContext = {state:LectureState, props:Utils.EntityComponentProps<Models.Lecture>, setState:(new_state:LectureState, callback?:()=>void) => void}

export type LectureState = { 
    update_count:number
    existing_Course?:"saving"|Utils.PaginatedItems<Models.Course>, new_Course?:"saving"|Models.Course, dirty_Course:Immutable.Map<number,Models.Course>, Course:Utils.PaginatedItems<{ shown_relation: string } & Utils.EntityAndSize<Models.Course>>|"loading"
  existing_Topic?:"saving"|Utils.PaginatedItems<Models.Topic>, new_Topic?:"saving"|Models.Topic, dirty_Topic:Immutable.Map<number,Models.Topic>, Topic:Utils.PaginatedItems<{ shown_relation: string } & Utils.EntityAndSize<Models.Topic>>|"loading"
  }
export class LectureComponent extends React.Component<Utils.EntityComponentProps<Models.Lecture>, LectureState> {
  constructor(props:Utils.EntityComponentProps<Models.Lecture>, context:any) { 
    super(props, context) 
    this.state = { update_count:0, dirty_Course:Immutable.Map<number,Models.Course>(), Course:"loading", dirty_Topic:Immutable.Map<number,Models.Topic>(), Topic:"loading" }
  }

  componentWillReceiveProps(new_props:Utils.EntityComponentProps<Models.Lecture>) {
    if (new_props.size == "breadcrumb") return
    let current_logged_in_entity =  null
    let new_logged_in_entity =  null
    if (new_props.mode != this.props.mode || (new_props.size != this.props.size && (new_props.size == "large" || new_props.size == "fullscreen")) ||
        (current_logged_in_entity && !new_logged_in_entity) ||
        (!current_logged_in_entity && new_logged_in_entity) ||
        (current_logged_in_entity && new_logged_in_entity && current_logged_in_entity.Id != new_logged_in_entity.Id)) {
      load_relations_Lecture(this, )
    }
  }

  thread:number = null
  componentWillMount() {
    if (this.props.size == "breadcrumb") return
    if (this.props.size != "preview")
      load_relations_Lecture(this, )

    this.thread = setInterval(() => {
      if (this.state.dirty_Course.count() > 0) {
         let first = this.state.dirty_Course.first()
         this.setState({...this.state, dirty_Course: this.state.dirty_Course.remove(first.Id)}, () => 
           Api.update_Course(first)
         )
       } else if (this.state.dirty_Topic.count() > 0) {
         let first = this.state.dirty_Topic.first()
         this.setState({...this.state, dirty_Topic: this.state.dirty_Topic.remove(first.Id)}, () => 
           Api.update_Topic(first)
         )
       }

    }, 500)
  }

  componentWillUnmount() {
    clearInterval(this.thread)
  }

  render() {
    if (this.props.size == "breadcrumb") {
      return Permissions.can_view_Lecture() ? 
              render_breadcrumb_Lecture(this)
              : null
    }

    return <div id={`Lecture_${this.props.entity.Id.toString()}_${this.state.update_count}`} className={`model lecture`} style={{width:"100%"}}>
      { render_saving_animations_Lecture(this) }
      {this.props.nesting_depth == 0 ? render_menu_Lecture(this) : null }
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
        { render_controls_Lecture(this) }
        { render_content_Lecture(this) }
      </div>
    </div>
  }
}

export let Lecture = (props:Utils.EntityComponentProps<Models.Lecture>) : JSX.Element =>
  <LectureComponent {...props} />

let any_of = (predicates:Array<(() => boolean)>) => 
             () => 
             predicates.map(p => p()).some(p => p)

export let Lecture_to_page = (id:number) => {
  let can_edit = any_of([Permissions.can_edit_Lecture, Permissions.can_edit_Course_Lecture, Permissions.can_edit_Lecture_Topic, Permissions.can_edit_Course, Permissions.can_edit_Topic])
  return Utils.scene_to_page<Models.Lecture>(can_edit, Lecture, Api.get_Lecture(id), Api.update_Lecture, "Lecture", `/Lectures/${id}`)
}

export let Lecture_to = (id:number, target_element_id:string, ) => {
  Utils.render_page_manager(target_element_id, 
    Lecture_to_page(id),
    
  )
}
