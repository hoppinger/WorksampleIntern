import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"
import * as Models from '../generated_models'
import * as Api from '../generated_api'
import * as i18next from 'i18next'

export type AuthenticationMenuProps = { 
     
    
  }
export type AuthenticationMenuState = 
    { kind:"menu" }
  | { kind:"choose-login-register" }
  | { kind:"choose-logout-changepassword" }
  | { kind:"logging-in", action:(username:string, password:string) => void, reset_action:(username:string) => void }
  | { kind:"registering", action:(username:string, email:string, email_confirmation:string) => void }
  | { kind:"changing-password", action:(password:string, new_password:string, new_password_confirmation:string) => void }
  | { kind:"resetting-password", action:(username:string) => void }
  | { kind:"error", message:string, action:() => void }
export class AuthenticationMenu extends React.Component<AuthenticationMenuProps, AuthenticationMenuState> {
  constructor(props:PaginatorProps, context:any) { 
    super(props, context)
    this.state = { kind:"menu" } 
  }

  render() {
    let current_logged_in_entity =  null
    let current_state = this.state
    let restore_state = () => this.setState(current_state)
    let error = (message:string) => () => this.setState({...this.state, kind:"error", message:message, action:restore_state})
    let authentication_menu_style = {position:"fixed", background:"white", padding:"10px", zIndex:10000, top:"0px", right:"0px"}
    if (this.state.kind == "menu") {
      return <div className="authentication-menu" style={authentication_menu_style}>
        <a className="button-open-authentication" style={{display:"block", margin:"15px"}}
                onClick={() => {
                    if (current_logged_in_entity)
                      this.setState({kind:"choose-logout-changepassword"})
                    else
                      this.setState({kind:"choose-login-register"})
                      
                  }
                }>
          <div>
            {
              current_logged_in_entity ?
                <img className="control__icon" src="/images/icon-user-list.svg" alt="Authentication options" height="40" width="40" />
              :
                <img className="control__icon" src="/images/icon-user.svg" alt="Login or register" height="40" width="40" />
            }
            {/*current_logged_in_entity.Username*/}
          </div>
        </a>
        {
          current_logged_in_entity ?
            <LanguageSelector 
                               />
          :
            null
        }
      </div> 
    } else if (this.state.kind == "choose-login-register") {
      return <div className="authentication-menu" style={authentication_menu_style}>
        
        
      </div>
    } else if (this.state.kind == "choose-logout-changepassword") {
      return <div className="authentication-menu" style={authentication_menu_style}>
            <a className="button-change-password" style={{display:"block", margin:"5px"}}
                      onClick={() => {
                        let action = (password:string, new_password:string, new_password_confirmation:string) => 
                                      new_password_confirmation != new_password ? 
                                        error("Password and password confirmation do not match.")()
                                      :
                                      
                                      null

                        this.setState({...this.state, 
                          kind:"changing-password", 
                          action:action
                        })
                      }
                      }>
              {i18next.t('Change password')}
            </a>
            <a className="button-logout" style={{display:"block", margin:"5px"}}
                    onClick={() =>
                      
                      null
                    }>
              {i18next.t('Logout')}
            </a>
            <a className="button-back" style={{display:"block", margin:"5px"}}
                    onClick={() =>
                        this.setState({kind:"menu"})
                    }>
              {i18next.t('Back')}
            </a>
          </div>
    } else if (this.state.kind == "logging-in") {
      return <div className="authentication-menu" style={authentication_menu_style}>
        {
          <div>
            <label>{i18next.t('Username or email')}</label>
            <input type="text" ref={u => this.username = u} />
            <label>{i18next.t('Password')}</label>
            <input type="password" ref={p => this.password = p} />
            <div style={{margin:"5px"}}>
              <button className="button button-submit"
                      onClick={() => {
                        this.state.kind == "logging-in" && this.state.action(this.username.value, this.password.value)
                      }
                    }>
                {i18next.t('Submit')}
              </button>
              <button className="button button-cancel"
                      onClick={() => {
                        this.setState({...this.state, kind:"menu"})
                      }
                    }>
                {i18next.t('Cancel')}
              </button>
              <a className="button-forgotten-password" style={{display:"block", margin:"5px"}}
                        onClick={() => {
                          this.state.kind == "logging-in" &&
                          this.setState({...this.state, 
                            kind:"resetting-password", 
                            action:this.state.reset_action
                          })
                        }
                        }>
                {i18next.t('Forgotten password')}
              </a>
            </div>
          </div>
        }
      </div>
    } else if (this.state.kind == "registering") {
      return <div className="authentication-menu" style={authentication_menu_style}>
        {
          <div>
            <label>{i18next.t('Username')}</label>
            <input type="text" ref={u => this.username = u} />
            <label>{i18next.t('Email')}</label>
            <input type="text" ref={u => this.email = u} />
            <label>{i18next.t('Email confirmation')}</label>
            <input type="text" ref={u => this.email_confirmation = u} />
            <div style={{margin:"5px"}}>
              <button className="button button-submit"
                      onClick={() => {
                        this.state.kind == "registering" && this.state.action(this.username.value, this.email.value, this.email_confirmation.value)
                      }
                    }>
                {i18next.t('Submit')}
              </button>
              <button className="button button-cancel"
                      onClick={() => {
                        this.setState({...this.state, kind:"menu"})
                      }
                    }>
                {i18next.t('Cancel')}
              </button>
            </div>
          </div>
        }
      </div>      
    } else if (this.state.kind == "changing-password") {
      return <div className="authentication-menu" style={authentication_menu_style}>
        {
          <div>
            <label>{i18next.t('Old password')}</label>
            <input type="password" ref={p => this.password = p} />
            <label>{i18next.t('New password')}</label>
            <input type="password" ref={p => this.new_password = p} />
            <label>{i18next.t('New password confirmation')}</label>
            <input type="password" ref={p => this.new_password_confirmation = p} />
            <div>
              <button className="button button-submit"
                      onClick={() => {
                        this.state.kind == "changing-password" && this.state.action(this.password.value, this.new_password.value, this.new_password_confirmation.value)
                      }
                    }>
                {i18next.t('Submit')}
              </button>
              <button className="button button-cancel"
                      onClick={() => {
                        this.setState({...this.state, kind:"menu"})
                      }
                    }>
                {i18next.t('Cancel')}
              </button>
            </div>
          </div>
        }
      </div>      
    } else if (this.state.kind == "resetting-password") {
      return <div className="authentication-menu" style={authentication_menu_style}>
        {
          <div>
            <label>{i18next.t('Username or email')}</label>
            <input type="text" ref={u => this.username = u} />
            <div>
              <button className="button button-submit"
                      onClick={() => {
                        this.state.kind == "resetting-password" && this.state.action(this.username.value)
                      }
                    }>
                {i18next.t('Submit')}
              </button>
              <button className="button button-cancel"
                      onClick={() => {
                        this.setState({...this.state, kind:"menu"})
                      }
                    }>
                {i18next.t('Cancel')}
              </button>
            </div>
          </div>
        }
      </div>
    } else if (this.state.kind == "error") {
      return <div className="authentication-menu" style={authentication_menu_style}>
          <div className="error message">
            {this.state.message}
          </div>
          <button className="button button-ok"
                    onClick={() =>
                      this.state.kind == "error" && this.state.action()
                    }>
              {i18next.t('Ok')}
          </button>
        </div>
    }
  }
  username:HTMLInputElement = null
  email:HTMLInputElement = null
  email_confirmation:HTMLInputElement = null
  password:HTMLInputElement = null
  new_password:HTMLInputElement = null
  new_password_confirmation:HTMLInputElement = null
}

export type LanguageSelectorProps = { 
  
   }
export type LanguageSelectorState = { changing_language:boolean }
class LanguageSelector extends React.Component<LanguageSelectorProps,LanguageSelectorState> {
  constructor(props:LanguageSelectorProps, context:any) { 
    super(props, context)
    this.state = { changing_language:false }  
  }

  render() {
    return null
  }
}

export type EntityComponentProps<T> = {
  
  entity:T,
  pages_count:number
  set_page:(new_page:Page, callback?:()=>void)=>void
  push:(new_page:Page, callback?:()=>void)=>void
  pop:(callback?:()=>void)=>void,
  shown_relation:string
  set_shown_relation:(new_shown_relation:string, callback?:()=>void)=>void
  size:EntitySize
  mode:EntityMode
  is_breadcrumb:boolean
  is_animating:boolean
  allow_maximisation:boolean
  allow_fullscreen:boolean
  always_maximised:boolean
  nesting_depth:number
  set_entity:(new_entity:T, callback?:()=>void, force_update_count_increment?:boolean) => void
  set_size?:(new_size:EntitySize, callback?:()=>void) => void
  unlink?:()=>Promise<void>,
  delete?:()=>Promise<void>,
  authentication_menu:() => JSX.Element,
  breadcrumbs:() => JSX.Element,
  toggle_button:() => JSX.Element,
}

export type PaginatedItems<T> = {
  Items:Immutable.Map<number,T>
  Editable:Immutable.Map<number,boolean>
  PageIndex:number
  PageSize:number
  NumPages:number
}

export function raw_page_to_paginated_items<T,U>(f:(x:T)=>U,x:{Items:Array<{Item:T&{Id:number}, Editable:boolean}>,PageIndex:number,PageSize:number,NumPages:number}) : PaginatedItems<U&{Id:number}> {
  return {
    Items:Immutable.Map<number,U&{Id:number}>(x.Items.map(e => [e.Item.Id, f(e.Item)])),
    Editable:Immutable.Map<number,boolean>(x.Items.map(e => [e.Item.Id, e.Editable])),
    PageIndex:x.PageIndex,
    PageSize:x.PageSize,
    NumPages:x.NumPages
  }
}

export type PaginatorProps = { PageIndex:number, NumPages:number, page_selected:(new_page_index:number)=>void }
export type PaginatorState = {}
export class Paginator extends React.Component<PaginatorProps, PaginatorState> {
  constructor(props:PaginatorProps, context:any) { 
    super(props, context)
    this.state = {} 
  }

  render() {
    if (this.props.NumPages <= 1) return null
    return <div className="paginator" style={{margin:"auto", width:"25%"}}>
      { this.props.NumPages > 3 ? <a className="page" style={{margin:"5px"}} onClick={() => this.props.page_selected(0)}>{i18next.t('First')}</a> : null}
      {
        this.props.PageIndex > 2 ? "..." : null
      }      
      {this.props.PageIndex > 0 ? 
        <a className="page" style={{margin:"5px"}} onClick={() => this.props.page_selected(this.props.PageIndex - 1)}>{i18next.t('Prev')}</a> : null}
      <span className="page" style={{margin:"5px"}}>{this.props.PageIndex + 1}</span>
      {this.props.PageIndex < this.props.NumPages - 1 ? 
        <a className="page" style={{margin:"5px"}} onClick={() => this.props.page_selected(this.props.PageIndex + 1)}>{i18next.t('Next')}</a> : null}
      {
        this.props.PageIndex < this.props.NumPages - 2 ? "..." : null
      }      
      { this.props.NumPages > 3 ? 
        <a className="page" style={{margin:"5px"}} onClick={() => this.props.page_selected(this.props.NumPages - 1)}>{i18next.t('Last')}</a> : null}
    </div>
  }
}

export type EntitySize = "breadcrumb"|"preview"|"large"|"fullscreen"
export type EntityMode = "view"|"edit"
export type EntityAndSize<T> = { element:T, size:EntitySize }

type Renderer<T> = (props:EntityComponentProps<T>) => JSX.Element
type SceneProps<T> = { initial_renderer : Renderer<T>, get_element:Promise<T>, save_element:(new_element:T)=>Promise<void>, can_edit:boolean, 
                       allow_maximisation:boolean, allow_fullscreen:boolean, always_maximised:boolean,
                       shown_relation:string, set_shown_relation:(new_shown_relation:string, callback?:()=>void)=>void,
                       authentication_menu:() => JSX.Element, breadcrumbs:() => JSX.Element,
                       is_breadcrumb:boolean, is_animating:boolean, pages_count:number, set_page:(new_page:Page, callback?:()=>void)=>void, push:(new_page:Page, callback?:()=>void)=>void, pop:(callback?:()=>void)=>void
                        }
type SceneState<T> = { current_renderer : Renderer<T>, element?:T, is_dirty:boolean, size:EntitySize, mode:EntityMode }
  
// the scene will be responsible for most of the animations and transitions, but also 
// managing the stack of renderers for navigation and url rewrites
class Scene<T> extends React.Component<SceneProps<T>, SceneState<T>> {
  constructor(props:SceneProps<T>, context:any) { 
    super(props, context)
    this.state = { current_renderer: props.initial_renderer, is_dirty:false, size:props.is_breadcrumb ? "breadcrumb" : "fullscreen", mode:"view" } 
  }

  componentDidMount() {
    this.props.get_element.then(e => this.setState({...this.state, element:e }))
  }

  thread:number = null
  componentWillMount() {
    this.thread = setInterval(() => {
      if (this.state.is_dirty && this.state.element) {
        this.props.save_element(this.state.element).then(() =>
          this.setState({...this.state, is_dirty:false })
        ).catch(() => console.log(`Update failed.`))
      }
    }, 500)
  }

  componentWillUnmount() {
    clearInterval(this.thread)
  }

  render() {
    let toggle_button = () : JSX.Element => 
      this.props.can_edit ?
        <a className="control__button toggle-mode" 
            onClick={() => this.setState({...this.state, mode: this.state.mode == "view" ? "edit" : "view"})}>
          <img className="control__icon" src={this.state.mode == "view" ? "/images/icon-edit.svg" : "/images/icon-view.svg"} alt="View" height="40" width="40" />
        </a>
        : 
        null

    return this.state.element ? 
            <div className="scene">
              {this.state.is_dirty ? 
                <div style={{position:"fixed", top:0, left:0, zIndex:1000, width:"20px", height:"20px", backgroundColor:"red"}} className="saving"/> 
                : 
                <div style={{position:"fixed", top:0, left:0, zIndex:1000, width:"20px", height:"20px", backgroundColor:"cornflowerblue"}} className="saved"/>}
                {
                  this.state.current_renderer(
                  {
                    
                    shown_relation:this.props.shown_relation,
                    set_shown_relation:this.props.set_shown_relation,
                    is_animating:this.props.is_animating,
                    is_breadcrumb:this.props.is_breadcrumb,
                    pages_count:this.props.pages_count,
                    set_page:this.props.set_page,
                    push:this.props.push,
                    pop:this.props.pop,
                    always_maximised:this.props.always_maximised,
                    allow_fullscreen:this.props.allow_fullscreen,
                    allow_maximisation:this.props.allow_maximisation,
                    entity:this.state.element,
                    authentication_menu:this.props.authentication_menu,
                    breadcrumbs:this.props.breadcrumbs,
                    toggle_button:toggle_button,
                    nesting_depth:0,
                    size:this.state.size,
                    mode:this.state.mode,
                    set_entity:(new_entity:T, callback?:()=>void, force_update_count_increment?:boolean) => {
                      this.setState({...this.state, is_dirty:true, element: new_entity}, callback)
                    },
                    set_size:undefined
                  })
                } 
            </div>
            : <div className="loading">Loading...</div>
  }
}
  
export function scene_to_page<T>(can_edit:() => boolean, renderer:Renderer<T>, get_element:Promise<T>, 
  save_element:(new_element:T)=>Promise<void>, title: string, url: string) : Page {
  let SceneT: new() => React.Component<SceneProps<T>, SceneState<T>> = (Scene as any) as new() => React.Component<SceneProps<T>, SceneState<T>>;
  return {
    render: (is_breadcrumb:boolean) => (is_animating:boolean) => (pages_count:number) => () =>
        (shown_relation:string, set_shown_relation:(new_shown_relation:string, callback?:()=>void)=>void) =>
        (authentication_menu:() => JSX.Element, breadcrumbs:() => JSX.Element) =>
        (set_page:(new_page:Page, callback?:()=>void)=>void, push:(new_page:Page, callback?:()=>void)=>void, pop:(callback?:()=>void)=>void) => 
      <SceneT is_breadcrumb={is_breadcrumb} is_animating={is_animating} pages_count={pages_count} 
              set_page={set_page} push={push} pop={pop} initial_renderer={renderer} get_element={get_element} 
              shown_relation={shown_relation} set_shown_relation={set_shown_relation}
              authentication_menu={authentication_menu} breadcrumbs={breadcrumbs}
              allow_fullscreen={true} allow_maximisation={true} always_maximised={true}
              save_element={e => save_element(e)} can_edit={can_edit() && !is_breadcrumb}  />,
    url: url,
    title: title
  }
}

export type PageRenderer = (is_breadcrumb:boolean) => (is_animating:boolean) => (pages_count:number) => () =>
  (shown_relation:string, set_shown_relation:(new_shown_relation:string, callback?:()=>void)=>void) =>
  (authentication_menu:() => JSX.Element, breadcrumbs:() => JSX.Element) =>
  (set_page:(new_page:Page, callback?:()=>void)=>void, push:(new_page:Page, callback?:()=>void)=>void, pop:(callback?:()=>void)=>void) => JSX.Element
export type Page = { render: PageRenderer, url: string, title: string }
export type PageManagerProps = { initial_page: Page,  }
export type PageManagerState = { pages: Immutable.Stack<Page & {shown_relation:string}>,  }
export class PageManager extends React.Component<PageManagerProps, PageManagerState> {
  constructor(props:PageManagerProps, context:any) { 
    super()
    this.state = { 
      pages: Immutable.Stack<Page & {shown_relation:string}>([{...props.initial_page, shown_relation:"none"}]),
       } 
  }

  onpopstate:any
  componentWillMount() {
    this.onpopstate = window.addEventListener("popstate", (e) => {
      e.stopPropagation()
      this.pop()
    })
  }
  
  componentWillUnmount() {
    window.removeEventListener("popstate", this.onpopstate)
  }

  set_page(new_page:Page, callback?:() => void) {
    window.history.replaceState(null, new_page.title, new_page.url)
    this.setState({...this.state, pages: this.state.pages.push({...new_page, shown_relation:"none"}) }, () => 
      this.setState({...this.state, pages: Immutable.Stack<Page & {shown_relation:string}>([{...new_page, shown_relation:"none"}])}, callback)
    )
  } 

  push(new_page:Page, callback?:() => void) {
    window.history.replaceState(null, new_page.title, new_page.url)
    this.setState({...this.state, pages: this.state.pages.push({...new_page, shown_relation:"none"})}, callback)
  } 

  pop(callback?:() => void) {
    let new_pages = this.state.pages.pop()
    let new_page = new_pages.peek()
    window.history.replaceState(null, new_page.title, new_page.url)
    this.setState({...this.state, pages: new_pages}, callback)
  } 

  render() {
    let authentication_menu = () => null
    let breadcrumbs = () => <div className="breadcrumbs" style={{position:"fixed", zIndex:10, top:"5px", left:"15%"}}>
        {
          this.state.pages.count() == 1 ? 
          null
          :
          this.state.pages.map((p, i) => <a
              key={`${i}`}
              className="breadcrumbs__item"
              style={
                     {
                      ...(i == this.state.pages.count() - 1 ? 
                        {pointerEvents: "none", border: "none"} : {}),
                      ...(i == 0 ? {marginLeft:"5px"} : {})
                     }
                    }
              onClick={() => { 
                  let new_pages = Immutable.Stack<Page & {shown_relation:string}>(this.state.pages.reverse().take(i+1).reverse())
                  let new_page = new_pages.peek()
                  window.history.replaceState(null, new_page.title, new_page.url)
                  this.setState({...this.state, pages:new_pages}) 
                }
              }>
              {p.render(true)(false)(this.state.pages.count())()
                       (p.shown_relation, np => {})
                       (authentication_menu, breadcrumbs)
                       ((np,c) => {}, (np,c) => {}, c => {})}
            </a>).reverse()
        }
      </div>
    return <div id="curr" key={`${this.state.pages.peek().url}_${this.state.pages.count()}`}>
        {this.state.pages.peek().render(false)(false)(this.state.pages.count())()
          (this.state.pages.peek().shown_relation, (np, c) => 
            this.setState({...this.state, 
              pages:this.state.pages.pop().push({...this.state.pages.peek(), shown_relation: np})
            }, c))
          (authentication_menu, breadcrumbs)
          ((np,c) => this.set_page(np, c), (np,c) => this.push(np, c), c => this.pop(c))}
      </div> 
  }
}

export async function render_page_manager(target_element_id:string, initial_page:Page, ) {
  let res = await fetch(`/translations.json`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  let resources = await res.json()
  i18next.init({
    lng:  "en",
    fallbackLng: "en",
    ns: ["common","HomePage","Course","Lecture","Topic"],
    resources: resources
  }, (err, t) => {
    ReactDOM.render(
      <PageManager initial_page={initial_page}  />,
      document.getElementById(target_element_id)
    )    
  })
}

