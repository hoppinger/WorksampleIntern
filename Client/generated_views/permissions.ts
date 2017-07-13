import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"
import * as Models from '../generated_models'
import * as Api from '../generated_api'
import * as List from '../containers/list'

export let can_view_HomePage = () => true

export let can_create_HomePage = () => false

export let can_edit_HomePage = () => true

export let can_delete_HomePage = () => false
  



export let can_view_Course = () => true

export let can_create_Course = () => true

export let can_edit_Course = () => true

export let can_delete_Course = () => true
  
export let can_view_Course_Name = () => true

export let can_edit_Course_Name = () => true

export let can_view_Course_Description = () => true

export let can_edit_Course_Description = () => true

export let can_view_Course_StudyPoints = () => true

export let can_edit_Course_StudyPoints = () => true

export let can_view_Course_Published = () => true

export let can_edit_Course_Published = () => true



export let can_view_Lecture = () => true

export let can_create_Lecture = () => true

export let can_edit_Lecture = () => true

export let can_delete_Lecture = () => true
  
export let can_view_Lecture_Name = () => true

export let can_edit_Lecture_Name = () => true

export let can_view_Lecture_Description = () => true

export let can_edit_Lecture_Description = () => true

export let can_view_Lecture_IsPracticum = () => true

export let can_edit_Lecture_IsPracticum = () => true



export let can_view_Topic = () => true

export let can_create_Topic = () => true

export let can_edit_Topic = () => true

export let can_delete_Topic = () => true
  
export let can_view_Topic_Name = () => true

export let can_edit_Topic_Name = () => true




export let can_view_HomePage_Course = () => true

export let can_create_HomePage_Course = () => true

export let can_edit_HomePage_Course = () => true

export let can_delete_HomePage_Course = () => true
  

export let can_view_Course_Lecture = () => true

export let can_create_Course_Lecture = () => true

export let can_edit_Course_Lecture = () => true

export let can_delete_Course_Lecture = () => true
  

export let can_view_Lecture_Topic = () => true

export let can_create_Lecture_Topic = () => true

export let can_edit_Lecture_Topic = () => true

export let can_delete_Lecture_Topic = () => true
  


