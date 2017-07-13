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

import * as CourseViews from './Course'
import * as CustomViews from '../custom_views'
  

export function existing_HomePage_HomePage_Course_page_index(self:HomePageContext) { 
  return !self.state.existing_Course || self.state.existing_Course == "saving" ? 0 : self.state.existing_Course.PageIndex 
}
export function existing_HomePage_HomePage_Course_page_size(self:HomePageContext) { 
  return !self.state.existing_Course || self.state.existing_Course == "saving" ? 25 : self.state.existing_Course.PageSize 
}
export function existing_HomePage_HomePage_Course_num_pages(self:HomePageContext) { 
  return !self.state.existing_Course || self.state.existing_Course == "saving" ? 1 : self.state.existing_Course.NumPages 
}

export function HomePage_HomePage_Course_page_index(self:HomePageContext) { 
  return self.state.Course == "loading" ? 0 : self.state.Course.PageIndex 
}
export function HomePage_HomePage_Course_page_size(self:HomePageContext) { 
  return self.state.Course == "loading" ? 25 : self.state.Course.PageSize 
}
export function HomePage_HomePage_Course_num_pages(self:HomePageContext) { 
  return self.state.Course == "loading" ? 1 : self.state.Course.NumPages 
}
 
export function load_relations_HomePage(self:HomePageContext, callback?:()=>void) {
  Permissions.can_view_Course() && Api.get_HomePage_HomePage_Courses(self.props.entity, HomePage_HomePage_Course_page_index(self), HomePage_HomePage_Course_page_size(self)).then(Courses => 
    self.setState({...self.state, update_count:self.state.update_count+1,
        Course:Utils.raw_page_to_paginated_items<Models.Course, Utils.EntityAndSize<Models.Course> & { shown_relation:string }>(i => { 
          return {
            element:i, 
            size: self.state.Course != "loading" && self.state.Course.Items.has(i.Id) ? self.state.Course.Items.get(i.Id).size : "preview", 
            shown_relation:"all"}}, Courses)
        }), callback)
}

export function set_size_HomePage(self:HomePageContext, new_size:Utils.EntitySize) {
  self.props.set_size(new_size, () => {
    if (new_size == "fullscreen")
      self.props.push(HomePage_to_page(self.props.entity.Id))
    else if (new_size != "preview")
      load_relations_HomePage(self, )
  })
}



export function render_editable_attributes_minimised_HomePage(self:HomePageContext) { 
  let attributes = (<div>
      
    </div>)
  return attributes
}

export function render_editable_attributes_maximised_HomePage(self:HomePageContext) { 
    let attributes = (<div>
        
      </div>)
    return attributes
  }

export function render_breadcrumb_HomePage(self:HomePageContext) {
  return <div className="breadcrumb-homepage">"HomePage"</div>
}

export function render_menu_HomePage(self:HomePageContext) {
  return <div style={{float:"left", position:"fixed", top:"0", left:"0", width:"15%", height:"100%", backgroundColor:"lightgray"}} className="menu">
        <div className="logo" style={{textAlign:"center"}}>
         <img className="logo" style={{display:"inline-block", width:"50%"}} src={"/images/logo.png"} alt="Logo"/>
       </div>
        <div className="pages">
          
          {!Permissions.can_view_HomePage() ? null :
              <div className={`menu_entry page_link active-page`}>
                <a style={{pointerEvents: "none"}} onClick={() => 
                  Api.get_HomePages(0, 1).then(e => 
                    e.Items.length > 0 && self.props.set_page(HomePage_to_page(e.Items[0].Item.Id))
                  )
                }>
                  {i18next.t('HomePage')}
                </a>
              </div>
            }
             <div className="menu_entries">
              
            {!Permissions.can_view_Course() ? null :
                  <div className={`menu_entry${self.props.shown_relation == "HomePage_Course" ? " active" : ""}`}>
                    <a onClick={() => 
                      self.props.set_shown_relation("HomePage_Course")
                    }>
                      {i18next.t('HomePage_Courses')}
                    </a>
                  </div>
                }  
              </div>
            
        </div>
      </div>
}

export function render_controls_HomePage(self:HomePageContext) {
  return <div className="control">
    {self.props.allow_maximisation && self.props.set_size ? <a className="homepage control__button toggle-size" 
          onClick={() => {
            set_size_HomePage(self, self.props.size == "preview" ? "large" : "preview")}
          }>
        <img className="control__icon" src={self.props.size == "preview" ? "/images/icon-menu-down.svg" : "/images/icon-menu-up.svg"} alt="Toggle size"/>
      </a> : null}
    
    {Permissions.can_delete_HomePage() && self.props.size == "fullscreen" ? <a className="homepage control__button delete" 
      onClick={() => confirm(i18next.t('Are you sure?')) && 
        Api.delete_HomePage(self.props.entity).then(() => self.props.pop())
      }>
      <img className="control__icon" src={"/images/icon-remove.svg"} alt="Delete"/>
    </a> : null}
    
    {self.props.toggle_button ? self.props.toggle_button() : null}
    {self.props.unlink && self.props.mode != "view" ? 
      <a className="homepage control__button unlink" 
          onClick={() => self.props.unlink()}>
        <img className="control__icon" src="/images/icon-unlink.svg" alt="Unlink"/>
      </a>
      :
      null
    }
    {self.props.delete && self.props.mode != "view" ? 
      <a className="homepage control__button remove" 
          onClick={() => self.props.delete()}>
        <img className="control__icon" src="/images/icon-remove.svg" alt="Remove"/>
      </a>
      :
      null
    }
  </div>
}

export function render_content_HomePage(self:HomePageContext) {
  return <div className="model-content">
    {Permissions.can_view_HomePage() ?
      self.props.size == "preview" ? 
        render_preview_HomePage(self)
      : self.props.size == "large" ? 
        render_large_HomePage(self)
      : self.props.size == "fullscreen" ? 
        render_large_HomePage(self)
      : "Error: unauthorised access to entity."
    : "Error: unauthorised access to entity."
    }  
  </div>
}



export function render_preview_HomePage(self:HomePageContext) {
  let attributes:JSX.Element = null
  if (self.props.mode == "view" || !Permissions.can_edit_HomePage())
    attributes = (<div className="model__attributes">
      
    </div>)
  else
    attributes = render_editable_attributes_minimised_HomePage(self)
  return (<div className="block">
      {attributes}
    </div>)
}

export function render_large_HomePage(self:HomePageContext) {
  let attributes:JSX.Element = null
  if (self.props.mode == "view" || !Permissions.can_edit_HomePage())
    attributes = (<div className="model__attributes">
      
    </div>)
  else
    attributes = render_editable_attributes_maximised_HomePage(self)
  return (<div className="block">
      {attributes}
      {render_relations_HomePage(self)}
    </div>)
}

export function render_relations_HomePage(self:HomePageContext) {
  return <div className="relations">{
      (self.props.shown_relation != "all" && self.props.shown_relation != "HomePage_Course") || !Permissions.can_view_Course() ? null :
      self.state.Course == "loading" ? 
        <div className="loading">{i18next.t('Loading Course')}.</div>
        : 
        <div className="model-nested course">
          <div className="model-nested__head">{i18next.t('Courses')}</div>
          <Utils.Paginator PageIndex={self.state.Course.PageIndex} NumPages={self.state.Course.NumPages}
                page_selected={new_page_index => 
                  self.state.Course != "loading" &&
                  self.setState({...self.state, 
                    Course: {
                      ...self.state.Course,
                      PageIndex:new_page_index
                    }
                  }, () =>  load_relations_HomePage(self, ))
                } />
          {
            self.state.Course.Items.map((i,i_id) => 
              <div key={i_id} className={`model-nested__item`} 
                     >
                {
                  CourseViews.Course({
                    ...self.props,
                    entity:i.element,
                    nesting_depth:self.props.nesting_depth+1,
                    size: i.size,
                    allow_maximisation:true,
                    allow_fullscreen:true,
                    mode:self.props.mode == "edit" && (Permissions.can_edit_HomePage_Course()
                          || Permissions.can_create_HomePage_Course()
                          || Permissions.can_delete_HomePage_Course())
                          && (self.state.Course != "loading" && self.state.Course.Editable.get(i_id)) ? 
                      self.props.mode : "view",
                    shown_relation:i.shown_relation,
                    set_shown_relation:(new_shown_relation:string, callback) => 
                      self.state.Course != "loading" && 
                      self.setState({...self.state, 
                        Course:
                          {
                            ...self.state.Course,
                            Items:self.state.Course.Items.set(i_id,{...self.state.Course.Items.get(i_id), shown_relation:new_shown_relation})
                          }
                      }, callback),
                    set_size:(new_size:Utils.EntitySize, callback) => {
                      let new_shown_relation = new_size == "large" ? "all" : i.shown_relation
                      self.state.Course != "loading" && 
                      self.setState({...self.state, 
                        Course:
                          {
                            ...self.state.Course,
                            Items:self.state.Course.Items.set(i_id,
                              {...self.state.Course.Items.get(i_id), 
                                size:new_size, shown_relation:new_shown_relation})
                          }
                      }, callback)
                    },
                    toggle_button:undefined,
                    set_entity:(new_entity:Models.Course, callback?:()=>void, force_update_count_increment?:boolean) => 
                      self.state.Course != "loading" && 
                      self.setState({...self.state, 
                        dirty_Course:self.state.dirty_Course.set(i_id, new_entity), 
                        update_count:force_update_count_increment ? self.state.update_count+1 : self.state.update_count, 
                        Course:
                          {
                            ...self.state.Course,
                            Items:self.state.Course.Items.set(i_id,{...self.state.Course.Items.get(i_id), element:new_entity})
                          }
                      }, callback),
                    unlink: undefined, 
                      delete: !Permissions.can_delete_Course() ?
                      null
                      :
                      () => confirm(i18next.t('Are you sure?')) && Api.delete_Course(i.element).then(() =>
                        load_relations_HomePage(self, ))
                  })
                }
                
              </div>
            ).valueSeq()
          }
          <div >
            {Permissions.can_create_Course() && Permissions.can_create_HomePage_Course() ? render_new_HomePage_HomePage_Course(self) : null}
            
          </div>
        </div>
      }    
    </div>
}



export function render_new_HomePage_HomePage_Course(self:HomePageContext) {
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
                                  Api.create_Course().then(e => {
                                        Api.update_Course({...new_Course, CreatedDate:e.CreatedDate, Id:e.Id}).then(() =>
                                          load_relations_HomePage(self, ))
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
  

export function render_saving_animations_HomePage(self:HomePageContext) {
  return self.state.dirty_Course.count() > 0 ? 
    <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"red"}} className="saving"/>
    : <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"cornflowerblue"}} className="saved"/>
}

export type HomePageContext = {state:HomePageState, props:Utils.EntityComponentProps<Models.HomePage>, setState:(new_state:HomePageState, callback?:()=>void) => void}

export type HomePageState = { 
    update_count:number
    existing_Course?:"saving"|Utils.PaginatedItems<Models.Course>, new_Course?:"saving"|Models.Course, dirty_Course:Immutable.Map<number,Models.Course>, Course:Utils.PaginatedItems<{ shown_relation: string } & Utils.EntityAndSize<Models.Course>>|"loading"
  }
export class HomePageComponent extends React.Component<Utils.EntityComponentProps<Models.HomePage>, HomePageState> {
  constructor(props:Utils.EntityComponentProps<Models.HomePage>, context:any) { 
    super(props, context) 
    this.state = { update_count:0, dirty_Course:Immutable.Map<number,Models.Course>(), Course:"loading" }
  }

  componentWillReceiveProps(new_props:Utils.EntityComponentProps<Models.HomePage>) {
    if (new_props.size == "breadcrumb") return
    let current_logged_in_entity =  null
    let new_logged_in_entity =  null
    if (new_props.mode != this.props.mode || (new_props.size != this.props.size && (new_props.size == "large" || new_props.size == "fullscreen")) ||
        (current_logged_in_entity && !new_logged_in_entity) ||
        (!current_logged_in_entity && new_logged_in_entity) ||
        (current_logged_in_entity && new_logged_in_entity && current_logged_in_entity.Id != new_logged_in_entity.Id)) {
      load_relations_HomePage(this, )
    }
  }

  thread:number = null
  componentWillMount() {
    if (this.props.size == "breadcrumb") return
    if (this.props.size != "preview")
      load_relations_HomePage(this, )

    this.thread = setInterval(() => {
      if (this.state.dirty_Course.count() > 0) {
         let first = this.state.dirty_Course.first()
         this.setState({...this.state, dirty_Course: this.state.dirty_Course.remove(first.Id)}, () => 
           Api.update_Course(first)
         )
       }

    }, 500)
  }

  componentWillUnmount() {
    clearInterval(this.thread)
  }

  render() {
    if (this.props.size == "breadcrumb") {
      return Permissions.can_view_HomePage() ? 
              render_breadcrumb_HomePage(this)
              : null
    }

    return <div id={`HomePage_${this.props.entity.Id.toString()}_${this.state.update_count}`} className={`model homepage`} style={{width:"100%"}}>
      { render_saving_animations_HomePage(this) }
      {this.props.nesting_depth == 0 ? render_menu_HomePage(this) : null }
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
        { render_controls_HomePage(this) }
        { render_content_HomePage(this) }
      </div>
    </div>
  }
}

export let HomePage = (props:Utils.EntityComponentProps<Models.HomePage>) : JSX.Element =>
  <HomePageComponent {...props} />

let any_of = (predicates:Array<(() => boolean)>) => 
             () => 
             predicates.map(p => p()).some(p => p)

export let HomePage_to_page = (id:number) => {
  let can_edit = any_of([Permissions.can_edit_HomePage, Permissions.can_edit_HomePage_Course, Permissions.can_edit_Course])
  return Utils.scene_to_page<Models.HomePage>(can_edit, HomePage, Api.get_HomePage(id), Api.update_HomePage, "HomePage", `/HomePages/${id}`)
}

export let HomePage_to = (id:number, target_element_id:string, ) => {
  Utils.render_page_manager(target_element_id, 
    HomePage_to_page(id),
    
  )
}
