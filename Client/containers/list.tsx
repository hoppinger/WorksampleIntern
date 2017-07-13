import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from 'immutable'
import * as ModelCache from './model_cache'

export type ItemSize = "maximised"|"minimised"

let cache:any = {}

type ItemProps<T> = { mode:ListMode,
                      item:T & {Id:number},
                      singleton:boolean,
                      model_name:string,
                      models_path:Immutable.Map<string, Immutable.Set<number>>,
                      maximised:boolean,
                      allow_maximisation?:boolean,
                      fullscreen_when_maximised?:boolean,
                      maximise:() => void,
                      minimise:() => void,
                      set_item_with_notification:(i:T, callback?:()=>void) => void,
                      set_item_without_notification:(i:T, callback?:()=>void) => void,
                      render_item_editable:(item:T, set_item:(i:T) => void, mode:ItemSize, on_change:() => void) => JSX.Element
                      render_item_minimised:(item:T) => JSX.Element
                      render_item_maximised:(item:T) => JSX.Element }
type ItemState = { loading:boolean }

export class Item<T> extends React.Component<ItemProps<T>, ItemState> {
  constructor(props:ItemProps<T>,context) {
    super(props, context)

    this.state = { loading:false }
  }

  item_events:number
  componentWillMount() {
    if (!cache[this.props.model_name]) cache[this.props.model_name] = {}
    if (!cache[this.props.model_name][this.props.item.Id]) cache[this.props.model_name][this.props.item.Id] = {}
    this.item_events = Math.max(0,...Object.keys(cache[this.props.model_name][this.props.item.Id]).map(n => parseInt(n))) + 1
    cache[this.props.model_name][this.props.item.Id][this.item_events] = ((new_item:any) => {
      this.props.set_item_without_notification(new_item as T)
    })
  }

  componentWillUnmount() {
    delete cache[this.props.model_name][this.props.item.Id][this.item_events]
  }

  componentWillReceiveProps(new_props:ItemProps<T>) {
    this.setState({...this.state})
  }

  size() {
    return (this.props.singleton && this.props.models_path.count() < 2) || this.props.maximised ? "maximised" : "minimised"
  }

  render() {
    if (!this.props.models_path.has(this.props.model_name)) {
      let item:JSX.Element =
        (this.props.mode == "view" ?
          (this.size() == "minimised" || (!this.props.singleton && !this.props.allow_maximisation) ?
            this.props.render_item_minimised(this.props.item)
              : this.props.render_item_maximised(this.props.item))
            : this.props.render_item_editable(this.props.item, this.props.set_item_with_notification, this.size(), () => {}))
      let size_button:JSX.Element = this.props.allow_maximisation ?
        (<button className={`${this.size()} model__button--44w`}
                onClick={() =>
                  this.props.maximised ? this.props.minimise() : this.props.maximise() }>
            {this.size() == "minimised" ? 
              <img className="control__icon--44w" src={this.props.fullscreen_when_maximised ? "/images/icon-enlarge.svg" : "/images/icon-menu-down.svg"} alt="Toggle out" height="40" width="44" /> 
            : <img className="control__icon--44w" src={this.props.fullscreen_when_maximised ? "/images/icon-shrink.svg" : "/images/icon-menu-up.svg"} alt="Toggle in" height="40" width="44" />}
          </button>) : null

      return (
        <div>
          {/*{already_seen(this.props.models_path, this.props.item, this.props.model_name) ||
           Object.keys(cache[this.props.model_name][this.props.item.Id]).length > 1 ? 
            <div className="warning">
              <img className="control__icon--44w" style={{width:"15px", height:"15px"}} src="/images/icon-danger.svg" alt="Warning" height="20" width="22" /> 
              <span>{this.props.item.Id}</span>
            </div> : null}*/}
          {size_button}
          {item}
        </div>)
    } else {
      return this.props.render_item_minimised(this.props.item)
    }
  }
}

export type ListMode = "view"|"edit"

export type ListProps<T> = {
    mode:ListMode
    removal_type:"delete"|"unlink",
    singleton: boolean,
    model_name:string,
    list_style?:"cards"|"gallery"|"table",
    allow_maximisation?:boolean,
    fullscreen_when_maximised?:boolean,
    models_path:Immutable.Map<string, Immutable.Set<number>>,
    is_root?:boolean,
    side_menu_label?:(item:T) => string,
    max_items?:number,
    get_add_items:()=>Promise<T[]>,
    add_item?:(item:T)=>Promise<void>,
    get_items:()=>Promise<T[]>,
    sort_by:(item:T) => number,
    delete_item?:(item:T)=>Promise<void>,
    create_item?:{label:string, create:()=>Promise<T>}[],
    render_titles:() => JSX.Element,
    render_item_editable?:(mode:ListMode) => (item:T, set_item:(i:T) => void, mode:ItemSize, on_change:() => void) => JSX.Element
    render_item_minimised:(mode:ListMode) => (item:T) => JSX.Element
    render_item_maximised:(mode:ListMode) => (item:T) => JSX.Element
 }
export type ListState<T> = { alert?:string, scroll_alpha:number, refresh_token:number, page:number, add_items_open:boolean, items:Immutable.List<T>, add_items:Immutable.List<T>, loading:boolean, selection?:T }

export type SideMenuProps<T> = ListProps<T> & { selection:T, select_item:(item:T,i:number) => () => void, items:Immutable.List<T> }
export type SideMenuState<T> = { scroll_alpha:number }

export class SideMenu<T> extends React.Component<SideMenuProps<T>, SideMenuState<T>> {
  constructor(props:ListProps<T>,context) {
    super(props, context)

    this.state = { scroll_alpha:0.0 }
  }

  on_scroll:any
  componentWillMount() {
    if (this.props.is_root && this.props.side_menu_label) {
      // this.thread = setInterval(() => {
      //   this.setState({...this.state, scroll_alpha:window.scrollY/(document.body.scrollHeight - window.innerHeight)})
      // }, 1000.0 / 60.0)
      this.on_scroll = window.onscroll = () => {
        let element = document.getElementById(`side_menu_${this.props.model_name}`)
        let element_offset_top = element.offsetTop
        
        let element_rect = element.getBoundingClientRect()
        if (window.scrollY > 150) {
          element.style.setProperty("top", `${(window.scrollY - 150)}px`);
        } else {
          element.style.setProperty("top", `0px`);
        }
      }
    }
  }

  componentWillUnmount() {
    if (this.props.is_root && this.props.side_menu_label) {
      window.removeEventListener("scroll", this.on_scroll)
    }
  }

  render() {
    return (<div id={`side_menu_${this.props.model_name}`} className="side-menu"
           style={this.props.is_root ? {position: "absolute", top:`0px`, float: "left", left:"10px" } : {}}>
        {
          this.props.items.sortBy(this.props.sort_by).map((item,i) =>
            <div className={`tab__link side-menu-item ${item == this.props.selection ? "active" : ""}`}
                 onClick={this.props.select_item(item,i)} >
                {this.props.side_menu_label(item)}
            </div>
          )
        }
      </div>)
  }
}

export class List<T> extends React.Component<ListProps<T>, ListState<T>> {
  constructor(props:ListProps<T>,context) {
    super(props, context)

    this.state = { scroll_alpha:0.0, refresh_token:0, page:1, items:Immutable.List<T>(), add_items_open:false, add_items:Immutable.List<T>(), loading:true }
  }

  async refresh_all_items() : Promise<void> {
    let items = this.props.get_items ? await this.props.get_items() : []
    let add_items = this.props.get_add_items ? await this.props.get_add_items() : []
    return this.setState({...this.state, refresh_token:this.state.refresh_token+1, items:Immutable.List<T>(items), add_items:Immutable.List<T>(add_items), loading:false})
  }

  async refresh_items() : Promise<void> {
    if (!this.props.get_items) return
    let items = await this.props.get_items()
    return this.setState({...this.state, refresh_token:this.state.refresh_token+1, items:Immutable.List<T>(items), loading:false})
  }

  alert(message:string) {
    this.setState({...this.state, alert:message})
  }

  unalert() {
    this.setState({...this.state, alert:undefined})
  }

  async refresh_add_items() : Promise<void> {
    if (!this.props.get_add_items) return
    let items = await this.props.get_add_items()
    return this.setState({...this.state, refresh_token:this.state.refresh_token+1, add_items:Immutable.List<T>(items), loading:false})
  }

  componentWillMount() {
    this.refresh_items().then(() =>
      this.refresh_add_items()).then(() => this.unalert()).catch(() => this.alert(`Error: cannot refresh list of ${this.props.model_name}.`))
  }

  render() {
    let ItemT: new() => React.Component<ItemProps<T>, ItemState> = (Item as any) as new() => React.Component<ItemProps<T>, ItemState>;

    let add_existing =
       (!this.props.singleton || this.state.items.count() < 1) && (!this.props.max_items || this.state.items.count() < this.props.max_items) && (this.props.is_root || this.props.mode != "view") && this.props.add_item ?
        (<div className={`dropdown`}>
          <div className="dropdown__label">Select an item to add</div>
          <button className={`dropdown-toggle ${this.state.add_items_open ? "open" : "closed"}`}  onClick={() => 
            this.refresh_add_items().then(() => 
                this.setState({...this.state, add_items_open: !this.state.add_items_open})
              )
            } 
          >Toggle dropdown</button>
          {
            (this.state.add_items_open ?
              (
                <div className={`dropdown__options add-items ${this.props.model_name}`}>
                {
                  this.state.add_items.map((item, i) =>
                    <div className={`dropdown__option add-item-button ${this.props.model_name}`}
                        onClick={() =>
                          this.setState({...this.state, add_items_open: !this.state.add_items_open}, () => {
                            this.props.add_item(item).then(() =>
                              this.refresh_items().then(
                                () => this.refresh_add_items())).catch(() => alert(`Creation of [${this.props.model_name}] failed.`))}
                          )}>
                      { this.props.render_item_minimised(this.props.mode)(item) }
                    </div>)
                }
              </div>) : (<div></div>))
          }
        </div>)
       : null

    let create_button =
        (!this.props.singleton || this.state.items.count() < 1) && (!this.props.max_items || this.state.items.count() < this.props.max_items) && (this.props.is_root || this.props.mode != "view") && this.props.create_item ?
        (
          <div className="main__actions cf">
              {
                this.props.create_item.map(c =>
                  <button className={`button button--inline ${this.props.model_name}`}
                        onClick={() =>
                          c.create().then(() =>
                            this.refresh_all_items().then(() => {
                              setTimeout(() => {
                                let new_item = document.getElementById(`${this.props.model_name}-item-${this.state.items.count()-1}`)
                                if (new_item) new_item.scrollIntoView({behavior:"smooth"})
                              }, 50)
                              this.unalert()
                        })).catch(() => this.alert(`Creation of [${this.props.model_name}] failed.`))}>
                  {`${c.label}`}
                </button>
                )
              }
         </div>
         )
       : null

    let select_item = (item:T,i:number) => () => this.setState({...this.state, selection: item},
                    () => document.getElementById(`${this.props.model_name}-item-${i}`).scrollIntoView({behavior:"smooth"}))

    let SideMenuT: new() => React.Component<SideMenuProps<T>, SideMenuState<T>> = (SideMenu as any) as new() => React.Component<SideMenuProps<T>, SideMenuState<T>>;
    let side_menu = (!this.props.singleton && this.props.side_menu_label ?
      <SideMenuT {...this.props} selection={this.state.selection} select_item={select_item} items={this.state.items} />
      : null)

    return (
      <div className={`model__list-container ${this.props.list_style ? `list--${this.props.list_style}` : ""}`}>
        {side_menu}
        <div id={`${this.props.model_name}-model-list`} key={this.state.refresh_token} className={` model__list ${this.props.model_name}`}>
          {this.state.alert ? <div className="alert">{this.state.alert}</div> : null}
          {this.props.list_style == "table" ? this.props.render_titles() : null}
          {
            this.state.items.sortBy(this.props.sort_by).map((item:T&{Id:number},i) => {
              let remove_button = (this.props.is_root || this.props.mode != "view") && this.props.delete_item ?
                (<button className={`model__button ${this.props.removal_type}`}
                  onClick={() => this.props.delete_item(item).then(() =>
                    this.refresh_all_items().catch(() => this.alert(`Refresh of [${this.props.model_name}] failed.`))).then(() => {
                      setTimeout(() => {
                        if (this.state.items.count() > 0 && this.props.list_style) {
                          let next_item = document.getElementById(`${this.props.model_name}-item-${i == 0 ? 1 : i - 1}`)
                          if (next_item) next_item.scrollIntoView({behavior:"smooth"})
                        }
                      }, 50)
                      this.unalert()
                    }).catch(() => this.alert(`Deletion of [${this.props.model_name}] failed.`))}>
                  {this.props.removal_type}
                </button>) : null
              let maximised_style = this.props.fullscreen_when_maximised && item == this.state.selection ?
                {position:"fixed", top:"0", left:"0", width:"100%", height:"100%", zIndex:"100"}
                : {}
              let next_prev_buttons = this.props.fullscreen_when_maximised && item == this.state.selection ?
                <div style={{zIndex:200}}>
                  <button style={{position:"absolute", left:"15px", bottom:"15px"}} disabled={i <= 0} className={`model__button`}
                    onClick={() => {
                      this.setState({...this.state, selection: this.state.items.get(i - 1)})}}>
                    <img className="control__icon" src="/images/icon-left.svg" alt="Previous" height="40" width="40" />
                  </button>
                  <button style={{position:"absolute", left:"70px", bottom:"15px"}} disabled={i >= this.state.items.count() - 1} className={`model__button`}
                    onClick={() => {
                      this.setState({...this.state, selection: this.state.items.get(i + 1)})}}>
                    <img className="control__icon" src="/images/icon-right.svg" alt="Next" height="40" width="40" />
                  </button>
                </div> : null
              let gallery_item_size = this.props.models_path.count() > 0 ? "250px" : "500px"
              let set_item_with_notification = (new_item:T&{Id:number}, callback?:()=>void) => {
                for (let c in cache[this.props.model_name][item.Id])
                  cache[this.props.model_name][item.Id][c](new_item)
                this.setState({...this.state, items:this.state.items.set(i, new_item)}, 
                  callback)
              }
              let set_item_without_notification = (new_item:T&{Id:number}, callback?:()=>void) => {
                this.setState({...this.state, refresh_token:this.state.refresh_token+1, items:this.state.items.set(i, new_item)}, 
                  callback)
              }
              return (
                <div className={`${this.props.model_name} model-item${this.props.fullscreen_when_maximised && item == this.state.selection ? " model-fullscreen" : ""}`}
                     id={`${this.props.model_name}-item-${i}`}>
                  <div className={`cf`}>
                    {remove_button}
                    <ItemT item={item}
                          singleton={this.props.singleton}
                          allow_maximisation={this.props.allow_maximisation}
                          fullscreen_when_maximised={this.props.fullscreen_when_maximised}
                          maximised={this.state.selection == item}
                          maximise={select_item(item,i)}
                          minimise={() => this.setState({...this.state, selection: undefined})}
                          mode={this.props.mode}
                          model_name={this.props.model_name}
                          models_path={this.props.models_path}
                          set_item_with_notification={set_item_with_notification}
                          set_item_without_notification={set_item_without_notification}
                          render_item_editable={this.props.render_item_editable ? this.props.render_item_editable(this.props.mode) : this.props.render_item_minimised(this.props.mode)}
                          render_item_maximised={this.props.render_item_maximised(this.props.mode)}
                          render_item_minimised={this.props.render_item_minimised(this.props.mode)} />
                    {next_prev_buttons}
                  </div>
                </div>)
            })
          }
      </div>
      {add_existing}
      {create_button}
    </div>
    );
  }
}

type CachedRendererProps<T> = ListProps<T>
type CachedRendererState<T> = { cache:ModelCache.Cache }
class CachedRenderer<T> extends React.Component<CachedRendererProps<T>, CachedRendererState<T>> {
  constructor(props:CachedRendererProps<T>,context) {
    super(props, context)

    this.state = { cache:{ models: Immutable.Map<string,ModelCache.Instances>() } }
  }

  ensure_model_name(models: Immutable.Map<string,ModelCache.Instances>) {
    if (models.has(this.props.model_name)) return models
    else return models.set(this.props.model_name, Immutable.Map<ModelCache.Id, { item: {Id:ModelCache.Id}, callbacks: Immutable.Map<ModelCache.Handle,ModelCache.NotifyNewItem> } >())
  }

  render() {
    let ListT: new() => React.Component<ListProps<T>, ListState<T>> = (List as any) as new() => React.Component<ListProps<T>, ListState<T>>;
    let props:ListProps<T> = {...this.props }
    return (<ListT {...props} />)
  }
}

export function render_list<T>(props:ListProps<T>) {
  let CachedRendererT: new() => React.Component<CachedRendererProps<T>, CachedRendererState<T>> = (CachedRenderer as any) as new() => React.Component<CachedRendererProps<T>, CachedRendererState<T>>;
  return (<CachedRendererT {...props} />)
}

export function render_list_to<T>(props:ListProps<T>, target_id:string) {
  let CachedRendererT: new() => React.Component<CachedRendererProps<T>, CachedRendererState<T>> = (CachedRenderer as any) as new() => React.Component<CachedRendererProps<T>, CachedRendererState<T>>;
  ReactDOM.render(
      <CachedRendererT {...props} />,
      document.getElementById(target_id)
  );
}

export let already_seen = (models_path:Immutable.Map<string, Immutable.Set<number>>, item:{Id:number}, model_name:string) => 
  models_path.has(model_name) && models_path.get(model_name).has(item.Id)

export let visit = (models_path:Immutable.Map<string, Immutable.Set<number>>, item:{Id:number}, model_name:string) => 
  models_path.has(model_name) ? 
    models_path.set(model_name, models_path.get(model_name).add(item.Id)) : 
    models_path.set(model_name, Immutable.Set<number>().add(item.Id))
