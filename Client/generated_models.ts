import * as Immutable from 'immutable'

export type HomePage = {
    Id : number
    CreatedDate:Date
    
    
  }
  
export type Course = {
    Id : number
    CreatedDate:Date
    Name : string
  Description : string
  StudyPoints : number
  Published : boolean
    
  }
  
export type Lecture = {
    Id : number
    CreatedDate:Date
    Name : string
  Description : string
  IsPracticum : boolean
    
  }
  
export type Topic = {
    Id : number
    CreatedDate:Date
    Name : string
    
  }
  
export type HomePage_Course = {
    Id : number
    CreatedDate:Date
    HomePageId : number
  CourseId : number
    
  }
  

export type Course_Lecture = {
    Id : number
    CreatedDate:Date
    CourseId : number
  LectureId : number
    
  }
  

export type Lecture_Topic = {
    Id : number
    CreatedDate:Date
    LectureId : number
  TopicId : number
    
  }
  

