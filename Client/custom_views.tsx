import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"
import * as List from './containers/list'
import * as Models from './generated_models'
import * as Api from './generated_api'
import * as Utils from './generated_views/view_utils'

let Lecture = (props:Models.Lecture) => 
    <div>
        {props.Name + props.Id}
    </div>


export let CourseRendering = (props:Utils.EntityComponentProps<Models.Course>) =>
    <h1> Hello World </h1>
