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
  

export function existing_Course_HomePage_Course_page_index(self:CourseContext) { 
  return !self.state.existing_HomePage || self.state.existing_HomePage == "saving" ? 0 : self.state.existing_HomePage.PageIndex 
}
export function existing_Course_Course_Lecture_page_index(self:CourseContext) { 
  return !self.state.existing_Lecture || self.state.existing_Lecture == "saving" ? 0 : self.state.existing_Lecture.PageIndex 
}
export function existing_Course_HomePage_Course_page_size(self:CourseContext) { 
  return !self.state.existing_HomePage || self.state.existing_HomePage == "saving" ? 25 : self.state.existing_HomePage.PageSize 
}
export function existing_Course_Course_Lecture_page_size(self:CourseContext) { 
  return !self.state.existing_Lecture || self.state.existing_Lecture == "saving" ? 25 : self.state.existing_Lecture.PageSize 
}
export function existing_Course_HomePage_Course_num_pages(self:CourseContext) { 
  return !self.state.existing_HomePage || self.state.existing_HomePage == "saving" ? 1 : self.state.existing_HomePage.NumPages 
}
export function existing_Course_Course_Lecture_num_pages(self:CourseContext) { 
  return !self.state.existing_Lecture || self.state.existing_Lecture == "saving" ? 1 : self.state.existing_Lecture.NumPages 
}

export function Course_HomePage_Course_page_index(self:CourseContext) { 
  return self.state.HomePage == "loading" ? 0 : self.state.HomePage.PageIndex 
}
export function Course_Course_Lecture_page_index(self:CourseContext) { 
  return self.state.Lecture == "loading" ? 0 : self.state.Lecture.PageIndex 
}
export function Course_HomePage_Course_page_size(self:CourseContext) { 
  return self.state.HomePage == "loading" ? 25 : self.state.HomePage.PageSize 
}
export function Course_Course_Lecture_page_size(self:CourseContext) { 
  return self.state.Lecture == "loading" ? 25 : self.state.Lecture.PageSize 
}
export function Course_HomePage_Course_num_pages(self:CourseContext) { 
  return self.state.HomePage == "loading" ? 1 : self.state.HomePage.NumPages 
}
export function Course_Course_Lecture_num_pages(self:CourseContext) { 
  return self.state.Lecture == "loading" ? 1 : self.state.Lecture.NumPages 
}
 
export function load_relations_Course(self:CourseContext, callback?:()=>void) {
  Permissions.can_view_HomePage() && Api.get_Course_HomePage_Courses(self.props.entity, Course_HomePage_Course_page_index(self), Course_HomePage_Course_page_size(self)).then(HomePages => 
    self.setState({...self.state, update_count:self.state.update_count+1,
        HomePage:Utils.raw_page_to_paginated_items<Models.HomePage, Utils.EntityAndSize<Models.HomePage> & { shown_relation:string }>(i => { 
          return {
            element:i, 
            size: self.state.HomePage != "loading" && self.state.HomePage.Items.has(i.Id) ? self.state.HomePage.Items.get(i.Id).size : "preview", 
            shown_relation:"all"}}, HomePages)
        }), callback)
    Permissions.can_view_Lecture() && Api.get_Course_Course_Lectures(self.props.entity, Course_Course_Lecture_page_index(self), Course_Course_Lecture_page_size(self)).then(Lectures => 
    self.setState({...self.state, update_count:self.state.update_count+1,
        Lecture:Utils.raw_page_to_paginated_items<Models.Lecture, Utils.EntityAndSize<Models.Lecture> & { shown_relation:string }>(i => { 
          return {
            element:i, 
            size: self.state.Lecture != "loading" && self.state.Lecture.Items.has(i.Id) ? self.state.Lecture.Items.get(i.Id).size : "preview", 
            shown_relation:"all"}}, Lectures)
        }), callback)
}

export function set_size_Course(self:CourseContext, new_size:Utils.EntitySize) {
  self.props.set_size(new_size, () => {
    if (new_size == "fullscreen")
      self.props.push(Course_to_page(self.props.entity.Id))
    else if (new_size != "preview")
      load_relations_Course(self, )
  })
}

export function render_Course_Name_editable(self:CourseContext) {
  return !Permissions.can_view_Course_Name() ? <div /> : 
         <div className="model__attribute name">
  <label className="attribute-label attribute-label-name">{i18next.t('Course:Name')}</label>
  <h1><input disabled={!Permissions.can_edit_Course_Name()} type="text"
                  defaultValue={self.props.entity.Name} 
                  onChange={(e) => {
                    let new_value = (e.target as HTMLInputElement).value
                    self.props.set_entity({...self.props.entity, Name: new_value})
                  } }/></h1>
</div>
}

export function render_Course_Description_editable(self:CourseContext) {
  return !Permissions.can_view_Course_Description() ? <div /> : 
         <div className="model__attribute description">
  <label className="attribute-label attribute-label-description">{i18next.t('Course:Description')}</label>
  <h1><input disabled={!Permissions.can_edit_Course_Description()} type="text"
                  defaultValue={self.props.entity.Description} 
                  onChange={(e) => {
                    let new_value = (e.target as HTMLInputElement).value
                    self.props.set_entity({...self.props.entity, Description: new_value})
                  } }/></h1>
</div>
}

export function render_Course_StudyPoints_editable(self:CourseContext) {
  return !Permissions.can_view_Course_StudyPoints() ? <div /> : 
         <div className="model__attribute studypoints">
  <label className="attribute-label attribute-label-studypoints">{i18next.t('Course:StudyPoints')}</label>
  <h1><input disabled={!Permissions.can_edit_Course_StudyPoints()} type="number"
                  defaultValue={self.props.entity.StudyPoints.toString()} 
                  onChange={(e) => {
                    let new_value = (e.target as HTMLInputElement).value
                    self.props.set_entity({...self.props.entity, StudyPoints: parseInt(new_value)})
                  } }/></h1>
</div>
}

export function render_Course_Published_editable(self:CourseContext) {
  return !Permissions.can_view_Course_Published() ? <div /> : 
         <div className="model__attribute published">
  <label className="attribute-label attribute-label-published">{i18next.t('Course:Published')}</label>
  <div>
            <input 
              disabled={!Permissions.can_edit_Course_Published()} 
              type="checkbox"
              checked={self.props.entity.Published} 
              onChange={(e) => {
                let new_value = (e.target as HTMLInputElement).checked
                self.props.set_entity({...self.props.entity, Published: new_value})
              } }
            />
          </div>
</div>
}


export function render_editable_attributes_minimised_Course(self:CourseContext) { 
  let attributes = (<div>
      {render_Course_Name_editable(self)}
        {render_Course_Description_editable(self)}
        {render_Course_StudyPoints_editable(self)}
        {render_Course_Published_editable(self)}
        
        
        
    </div>)
  return attributes
}

export function render_editable_attributes_maximised_Course(self:CourseContext) { 
    let attributes = (<div>
        {render_Course_Name_editable(self)}
        {render_Course_Description_editable(self)}
        {render_Course_StudyPoints_editable(self)}
        {render_Course_Published_editable(self)}
        
        
        
      </div>)
    return attributes
  }

export function render_breadcrumb_Course(self:CourseContext) {
  return <div className="breadcrumb-course">"Course"</div>
}

export function render_menu_Course(self:CourseContext) {
  return <div style={{float:"left", position:"fixed", top:"0", left:"0", width:"15%", height:"100%", backgroundColor:"lightgray"}} className="menu">
        <div className="logo" style={{textAlign:"center"}}>
         <img className="logo" style={{display:"inline-block", width:"50%"}} src={"/images/logo.png"} alt="Logo"/>
       </div>
        <div className="pages">
           <div className={`menu_entry page_link active`}>
                <a onClick={() => 
                  self.props.set_shown_relation("none")
                }>
                  {i18next.t('Course')}
                </a>
            </div>
            <div className="menu_entries">
              
            {!Permissions.can_view_Lecture() ? null :
                  <div className={`menu_entry${self.props.shown_relation == "Course_Lecture" ? " active" : ""}`}>
                    <a onClick={() => 
                      self.props.set_shown_relation("Course_Lecture")
                    }>
                      {i18next.t('Course_Lectures')}
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

export function render_controls_Course(self:CourseContext) {
  return <div className="control">
    {self.props.allow_maximisation && self.props.set_size ? <a className="course control__button toggle-size" 
          onClick={() => {
            set_size_Course(self, self.props.size == "preview" ? "large" : "preview")}
          }>
        <img className="control__icon" src={self.props.size == "preview" ? "/images/icon-menu-down.svg" : "/images/icon-menu-up.svg"} alt="Toggle size"/>
      </a> : null}
    
    {Permissions.can_delete_Course() && self.props.size == "fullscreen" ? <a className="course control__button delete" 
      onClick={() => confirm(i18next.t('Are you sure?')) && 
        Api.delete_Course(self.props.entity).then(() => self.props.pop())
      }>
      <img className="control__icon" src={"/images/icon-remove.svg"} alt="Delete"/>
    </a> : null}
    {self.props.size == "fullscreen" && self.props.pages_count > 0 ? <a className="course control__button cancel" 
        onClick={() => self.props.pop()}>
      <img className="control__icon" src={"/images/icon-cancel.svg"} alt="Delete"/>
    </a> : null}
    
    {self.props.toggle_button ? self.props.toggle_button() : null}
    {self.props.unlink && self.props.mode != "view" ? 
      <a className="course control__button unlink" 
          onClick={() => self.props.unlink()}>
        <img className="control__icon" src="/images/icon-unlink.svg" alt="Unlink"/>
      </a>
      :
      null
    }
    {self.props.delete && self.props.mode != "view" ? 
      <a className="course control__button remove" 
          onClick={() => self.props.delete()}>
        <img className="control__icon" src="/images/icon-remove.svg" alt="Remove"/>
      </a>
      :
      null
    }
  </div>
}

export function render_content_Course(self:CourseContext) {
  return <div className="model-content">
    {Permissions.can_view_Course() ?
      self.props.size == "preview" ? 
        CustomViews.CourseRendering(self.props)
      : self.props.size == "large" ? 
        CustomViews.CourseRendering(self.props)
      : self.props.size == "fullscreen" ? 
        CustomViews.CourseRendering(self.props)
      : "Error: unauthorised access to entity."
    : "Error: unauthorised access to entity."
    }  
  </div>
}

export function render_Course_Name(self:CourseContext) {
  return !Permissions.can_view_Course_Name() ? "" : <div className="model__attribute name">
    <label className="attribute-label attribute-label-name">{i18next.t('Course:Name')}</label>
    {self.props.entity.Name}
  </div>
}
        export function render_Course_Description(self:CourseContext) {
  return !Permissions.can_view_Course_Description() ? "" : <div className="model__attribute description">
    <label className="attribute-label attribute-label-description">{i18next.t('Course:Description')}</label>
    {self.props.entity.Description}
  </div>
}
        export function render_Course_StudyPoints(self:CourseContext) {
  return !Permissions.can_view_Course_StudyPoints() ? "" : <div className="model__attribute studypoints">
    <label className="attribute-label attribute-label-studypoints">{i18next.t('Course:StudyPoints')}</label>
    {self.props.entity.StudyPoints}
  </div>
}
        export function render_Course_Published(self:CourseContext) {
  return !Permissions.can_view_Course_Published() ? "" : <div className="model__attribute published">
    <label className="attribute-label attribute-label-published">{i18next.t('Course:Published')}</label>
    {self.props.entity.Published}
  </div>
}

export function render_preview_Course(self:CourseContext) {
  let attributes:JSX.Element = null
  if (self.props.mode == "view" || !Permissions.can_edit_Course())
    attributes = (<div className="model__attributes">
      { render_Course_Name(self) }
        { render_Course_Description(self) }
        { render_Course_StudyPoints(self) }
        { render_Course_Published(self) }
    </div>)
  else
    attributes = render_editable_attributes_minimised_Course(self)
  return (<div className="block">
      {attributes}
    </div>)
}

export function render_large_Course(self:CourseContext) {
  let attributes:JSX.Element = null
  if (self.props.mode == "view" || !Permissions.can_edit_Course())
    attributes = (<div className="model__attributes">
      { render_Course_Name(self) }
        { render_Course_Description(self) }
        { render_Course_StudyPoints(self) }
        { render_Course_Published(self) }
    </div>)
  else
    attributes = render_editable_attributes_maximised_Course(self)
  return (<div className="block">
      {attributes}
      {render_relations_Course(self)}
    </div>)
}

export function render_relations_Course(self:CourseContext) {
  return <div className="relations">{
      (self.props.shown_relation != "all" && self.props.shown_relation != "Course_Lecture") || !Permissions.can_view_Lecture() ? null :
      self.state.Lecture == "loading" ? 
        <div className="loading">{i18next.t('Loading Lecture')}.</div>
        : 
        <div className="model-nested lecture">
          <div className="model-nested__head">{i18next.t('Lectures')}</div>
          <Utils.Paginator PageIndex={self.state.Lecture.PageIndex} NumPages={self.state.Lecture.NumPages}
                page_selected={new_page_index => 
                  self.state.Lecture != "loading" &&
                  self.setState({...self.state, 
                    Lecture: {
                      ...self.state.Lecture,
                      PageIndex:new_page_index
                    }
                  }, () =>  load_relations_Course(self, ))
                } />
          {
            self.state.Lecture.Items.map((i,i_id) => 
              <div key={i_id} className={`model-nested__item`} 
                     >
                {
                  LectureViews.Lecture({
                    ...self.props,
                    entity:i.element,
                    nesting_depth:self.props.nesting_depth+1,
                    size: i.size,
                    allow_maximisation:true,
                    allow_fullscreen:true,
                    mode:self.props.mode == "edit" && (Permissions.can_edit_Course_Lecture()
                          || Permissions.can_create_Course_Lecture()
                          || Permissions.can_delete_Course_Lecture())
                          && (self.state.Lecture != "loading" && self.state.Lecture.Editable.get(i_id)) ? 
                      self.props.mode : "view",
                    shown_relation:i.shown_relation,
                    set_shown_relation:(new_shown_relation:string, callback) => 
                      self.state.Lecture != "loading" && 
                      self.setState({...self.state, 
                        Lecture:
                          {
                            ...self.state.Lecture,
                            Items:self.state.Lecture.Items.set(i_id,{...self.state.Lecture.Items.get(i_id), shown_relation:new_shown_relation})
                          }
                      }, callback),
                    set_size:(new_size:Utils.EntitySize, callback) => {
                      let new_shown_relation = new_size == "large" ? "all" : i.shown_relation
                      self.state.Lecture != "loading" && 
                      self.setState({...self.state, 
                        Lecture:
                          {
                            ...self.state.Lecture,
                            Items:self.state.Lecture.Items.set(i_id,
                              {...self.state.Lecture.Items.get(i_id), 
                                size:new_size, shown_relation:new_shown_relation})
                          }
                      }, callback)
                    },
                    toggle_button:undefined,
                    set_entity:(new_entity:Models.Lecture, callback?:()=>void, force_update_count_increment?:boolean) => 
                      self.state.Lecture != "loading" && 
                      self.setState({...self.state, 
                        dirty_Lecture:self.state.dirty_Lecture.set(i_id, new_entity), 
                        update_count:force_update_count_increment ? self.state.update_count+1 : self.state.update_count, 
                        Lecture:
                          {
                            ...self.state.Lecture,
                            Items:self.state.Lecture.Items.set(i_id,{...self.state.Lecture.Items.get(i_id), element:new_entity})
                          }
                      }, callback),
                    delete: undefined, 
                      unlink: !Permissions.can_delete_Course_Lecture() ?
                      null
                      :
                      () => confirm(i18next.t('Are you sure?')) && Api.unlink_Course_Course_Lectures(self.props.entity, i.element).then(() =>
                        load_relations_Course(self, ))
                  })
                }
                
              </div>
            ).valueSeq()
          }
          <div >
            {Permissions.can_create_Lecture() && Permissions.can_create_Course_Lecture() ? render_new_Course_Course_Lecture(self) : null}
            {Permissions.can_create_Course_Lecture() ? render_add_existing_Course_Course_Lecture(self) : null}
          </div>
        </div>
      }    
    </div>
}

export function render_add_existing_Course_Course_Lecture(self:CourseContext) {
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
                        }, () =>  load_relations_Course(self, ))
                      } />
                  <div className="group">
                    {
                      self.state.existing_Lecture.Items.map((i,i_id) => 
                        <div key={i_id} className="group__item">
                          <a className="group__button button"
                            onClick={() => 
                                self.setState({...self.state, existing_Lecture:"saving"}, () => 
                                  Api.link_Course_Course_Lectures(self.props.entity, i).then(() => 
                                    self.setState({...self.state, existing_Lecture:undefined}, () =>
                                      load_relations_Course(self, ))))
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
                    Api.get_unlinked_Course_Course_Lectures(self.props.entity, existing_Course_Course_Lecture_page_index(self), existing_Course_Course_Lecture_page_size(self)).then(es =>
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
  

export function render_new_Course_HomePage_Course(self:CourseContext) {
    return self.props.mode == "edit" ?
      <div className="button__actions">
        {
          self.state.new_HomePage == "saving" ?
            null
            :
            self.state.new_HomePage ?
              <div className="overlay new-homepage-background">
                <div className="overlay__item overlay__item--new new-homepage">
                  {
                    HomePageViews.HomePage({
                      ...self.props,
                      entity:self.state.new_HomePage,
                      nesting_depth:self.props.nesting_depth+1,
                      size:"preview",
                      mode:"edit",
                      set_size:undefined,
                      toggle_button:undefined,
                      set_entity:(new_entity:Models.HomePage, callback?:()=>void, force_update_count_increment?:boolean) => 
                        self.setState({...self.state, 
                          update_count:force_update_count_increment ? self.state.update_count+1 : self.state.update_count, 
                          new_HomePage:new_entity}, callback),
                      unlink: undefined,
                      delete: undefined 
                    })
                  }
                  <div className="button__actions">
                    <button className="button button--save button--inline" 
                            onClick={() => {
                                if (self.state.new_HomePage && self.state.new_HomePage != "saving") {
                                  let new_HomePage = self.state.new_HomePage
                                  self.setState({...self.state, new_HomePage:"saving"}, () =>
                                  Api.create_HomePage().then(e => {
                                        Api.update_HomePage({...new_HomePage, CreatedDate:e.CreatedDate, Id:e.Id}).then(() =>
                                          load_relations_Course(self, ))
                                      }
                                    )

                                  )
                                }
                              }
                            }>
                      {i18next.t('Save and close')}
                    </button>
                    <Buttons.Cancel onClick={() => self.setState({...self.state, new_HomePage:undefined})} />
                  </div>                      
                </div>
              </div>
              :
              null
          }
          <div className="new-homepage">
              <button 
                      className="new-homepage button button--new" 
                      onClick={() => 
                        self.setState({...self.state,
                          add_step_HomePage:"closed", 
                          new_HomePage:
                            ({ Id:-1, CreatedDate:null,   } as Models.HomePage)
                          }
                        )
                      }>
                  Create new HomePage
              </button>
            </div>
        </div>
      : 
      null
    }
  
export function render_new_Course_Course_Lecture(self:CourseContext) {
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
                                  Api.create_linked_Course_Course_Lectures_Lecture(self.props.entity).then(e => {
                                        e.length > 0 &&
                                        Api.update_Lecture({...new_Lecture, CreatedDate:e[0].CreatedDate, Id:e[0].Id}).then(() =>
                                          load_relations_Course(self, ))
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
  

export function render_saving_animations_Course(self:CourseContext) {
  return self.state.dirty_HomePage.count() > 0 ? 
    <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"red"}} className="saving"/> : 
    self.state.dirty_Lecture.count() > 0 ? 
    <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"red"}} className="saving"/>
    : <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"cornflowerblue"}} className="saved"/>
}

export type CourseContext = {state:CourseState, props:Utils.EntityComponentProps<Models.Course>, setState:(new_state:CourseState, callback?:()=>void) => void}

export type CourseState = { 
    update_count:number
    existing_HomePage?:"saving"|Utils.PaginatedItems<Models.HomePage>, new_HomePage?:"saving"|Models.HomePage, dirty_HomePage:Immutable.Map<number,Models.HomePage>, HomePage:Utils.PaginatedItems<{ shown_relation: string } & Utils.EntityAndSize<Models.HomePage>>|"loading"
  existing_Lecture?:"saving"|Utils.PaginatedItems<Models.Lecture>, new_Lecture?:"saving"|Models.Lecture, dirty_Lecture:Immutable.Map<number,Models.Lecture>, Lecture:Utils.PaginatedItems<{ shown_relation: string } & Utils.EntityAndSize<Models.Lecture>>|"loading"
  }
export class CourseComponent extends React.Component<Utils.EntityComponentProps<Models.Course>, CourseState> {
  constructor(props:Utils.EntityComponentProps<Models.Course>, context:any) { 
    super(props, context) 
    this.state = { update_count:0, dirty_HomePage:Immutable.Map<number,Models.HomePage>(), HomePage:"loading", dirty_Lecture:Immutable.Map<number,Models.Lecture>(), Lecture:"loading" }
  }

  componentWillReceiveProps(new_props:Utils.EntityComponentProps<Models.Course>) {
    if (new_props.size == "breadcrumb") return
    let current_logged_in_entity =  null
    let new_logged_in_entity =  null
    if (new_props.mode != this.props.mode || (new_props.size != this.props.size && (new_props.size == "large" || new_props.size == "fullscreen")) ||
        (current_logged_in_entity && !new_logged_in_entity) ||
        (!current_logged_in_entity && new_logged_in_entity) ||
        (current_logged_in_entity && new_logged_in_entity && current_logged_in_entity.Id != new_logged_in_entity.Id)) {
      load_relations_Course(this, )
    }
  }

  thread:number = null
  componentWillMount() {
    if (this.props.size == "breadcrumb") return
    if (this.props.size != "preview")
      load_relations_Course(this, )

    this.thread = setInterval(() => {
      if (this.state.dirty_HomePage.count() > 0) {
         let first = this.state.dirty_HomePage.first()
         this.setState({...this.state, dirty_HomePage: this.state.dirty_HomePage.remove(first.Id)}, () => 
           Api.update_HomePage(first)
         )
       } else if (this.state.dirty_Lecture.count() > 0) {
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
      return Permissions.can_view_Course() ? 
              CustomViews.CourseRendering(this.props)
              : null
    }

    return <div id={`Course_${this.props.entity.Id.toString()}_${this.state.update_count}`} className={`model course`} style={{width:"100%"}}>
      { render_saving_animations_Course(this) }
      {this.props.nesting_depth == 0 ? render_menu_Course(this) : null }
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
        { render_controls_Course(this) }
        { render_content_Course(this) }
      </div>
    </div>
  }
}

export let Course = (props:Utils.EntityComponentProps<Models.Course>) : JSX.Element =>
  <CourseComponent {...props} />

let any_of = (predicates:Array<(() => boolean)>) => 
             () => 
             predicates.map(p => p()).some(p => p)

export let Course_to_page = (id:number) => {
  let can_edit = any_of([Permissions.can_edit_Course, Permissions.can_edit_HomePage_Course, Permissions.can_edit_Course_Lecture, Permissions.can_edit_HomePage, Permissions.can_edit_Lecture])
  return Utils.scene_to_page<Models.Course>(can_edit, Course, Api.get_Course(id), Api.update_Course, "Course", `/Courses/${id}`)
}

export let Course_to = (id:number, target_element_id:string, ) => {
  Utils.render_page_manager(target_element_id, 
    Course_to_page(id),
    
  )
}
