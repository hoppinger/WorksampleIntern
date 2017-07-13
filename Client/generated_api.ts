import * as Models from './generated_models'
import * as Immutable from 'immutable'

type RawPage<T> = {
  Items:{Item:T, Editable:boolean}[]
  PageIndex:number
  NumPages:number
  PageSize:number
}

export let parse_date = <T>(e:any) : T&{CreatedDate:Date} => { return { ...e, CreatedDate: Date.parse(e.CreatedDate) }}

export let make_page = <T>(res:any, parse_other_args:(e:any) => T) : RawPage<T> => { return {
  Items: res.Items.map((i:any) => { return{ ...i, Item:parse_date(i.Item)} }).map((i:any) => { return{ ...i, Item:parse_other_args(i.Item)} }),  
  PageIndex: res.PageIndex,
  NumPages: res.NumPages,
  PageSize: res.PageSize
}}

export async function get_HomePage_HomePage_Courses(source:Models.HomePage, page_index:number, page_size:number) : Promise<RawPage<Models.Course>> {
  let res = await fetch(`/api/v1/HomePage/${source.Id}/HomePage_Courses?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Course>(json, e => { return {...e, }})
}




export async function create_HomePage() : Promise<Models.HomePage> {
  let res = await fetch(`/api/v1/HomePage/`, 
    { method: 'post', credentials: 'include', headers:{'content-type': 'application/json', 
      'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: new Date(json.CreatedDate),  } as Models.HomePage
}

export async function update_HomePage(item:Models.HomePage) : Promise<void> {
  let res = await fetch(`/api/v1/HomePage/`, { method: 'put', body: JSON.stringify({...item, CreatedDate: undefined}), credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function delete_HomePage(source:Models.HomePage) : Promise<void> {
  let res = await fetch(`/api/v1/HomePage/${source.Id}`, { method: 'delete', credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value} })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function get_HomePage(id:number) : Promise<Models.HomePage> {
  let res = await fetch(`/api/v1/HomePage/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: new Date(json.CreatedDate),  } as Models.HomePage
}

export async function get_HomePages(page_index:number, page_size:number) : Promise<RawPage<Models.HomePage>> {
  let res = await fetch(`/api/v1/HomePage?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.HomePage>(json, e => { return {...e, }})
}







  
  
export async function get_Course_HomePage_Courses(source:Models.Course, page_index:number, page_size:number) : Promise<RawPage<Models.HomePage>> {
  let res = await fetch(`/api/v1/Course/${source.Id}/HomePage_Courses?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.HomePage>(json, e => { return {...e, }})
}




export async function get_Course_Course_Lectures(source:Models.Course, page_index:number, page_size:number) : Promise<RawPage<Models.Lecture>> {
  let res = await fetch(`/api/v1/Course/${source.Id}/Course_Lectures?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Lecture>(json, e => { return {...e, }})
}


export async function get_unlinked_Course_Course_Lectures(source:Models.Course, page_index:number, page_size:number) : Promise<RawPage<Models.Lecture>> {
  let res = await fetch(`/api/v1/Course/${source.Id}/unlinked/Course_Lectures?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Lecture>(json, e => { return {...e, }})  
}

    
export async function create_linked_Course_Course_Lectures_Lecture(source:Models.Course) : Promise<Models.Lecture[]> {
  let res = await fetch(`/api/v1/Course/${source.Id}/Course_Lectures_Lecture`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return json.map(e => { return {...e, CreatedDate: new Date(e.CreatedDate),  }}) as Models.Lecture[]
}

export async function link_Course_Course_Lectures(source:Models.Course, target:Models.Lecture) : Promise<void> {
  let res = await fetch(`/api/v1/Course/${source.Id}/Course_Lectures/${target.Id}`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function unlink_Course_Course_Lectures(source:Models.Course, target:Models.Lecture) : Promise<void> {
  let res = await fetch(`/api/v1/Course/${source.Id}/Course_Lectures/${target.Id}`, { method: 'delete', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  return
}


export async function create_Course() : Promise<Models.Course> {
  let res = await fetch(`/api/v1/Course/`, 
    { method: 'post', credentials: 'include', headers:{'content-type': 'application/json', 
      'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: new Date(json.CreatedDate),  } as Models.Course
}

export async function update_Course(item:Models.Course) : Promise<void> {
  let res = await fetch(`/api/v1/Course/`, { method: 'put', body: JSON.stringify({...item, CreatedDate: undefined}), credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function delete_Course(source:Models.Course) : Promise<void> {
  let res = await fetch(`/api/v1/Course/${source.Id}`, { method: 'delete', credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value} })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function get_Course(id:number) : Promise<Models.Course> {
  let res = await fetch(`/api/v1/Course/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: new Date(json.CreatedDate),  } as Models.Course
}

export async function get_Courses(page_index:number, page_size:number) : Promise<RawPage<Models.Course>> {
  let res = await fetch(`/api/v1/Course?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Course>(json, e => { return {...e, }})
}







  
  
export async function get_Lecture_Course_Lectures(source:Models.Lecture, page_index:number, page_size:number) : Promise<RawPage<Models.Course>> {
  let res = await fetch(`/api/v1/Lecture/${source.Id}/Course_Lectures?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Course>(json, e => { return {...e, }})
}


export async function get_unlinked_Lecture_Course_Lectures(source:Models.Lecture, page_index:number, page_size:number) : Promise<RawPage<Models.Course>> {
  let res = await fetch(`/api/v1/Lecture/${source.Id}/unlinked/Course_Lectures?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Course>(json, e => { return {...e, }})  
}

    
export async function create_linked_Lecture_Course_Lectures_Course(source:Models.Lecture) : Promise<Models.Course[]> {
  let res = await fetch(`/api/v1/Lecture/${source.Id}/Course_Lectures_Course`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return json.map(e => { return {...e, CreatedDate: new Date(e.CreatedDate),  }}) as Models.Course[]
}

export async function link_Lecture_Course_Lectures(source:Models.Lecture, target:Models.Course) : Promise<void> {
  let res = await fetch(`/api/v1/Lecture/${source.Id}/Course_Lectures/${target.Id}`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function unlink_Lecture_Course_Lectures(source:Models.Lecture, target:Models.Course) : Promise<void> {
  let res = await fetch(`/api/v1/Lecture/${source.Id}/Course_Lectures/${target.Id}`, { method: 'delete', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  return
}


export async function get_Lecture_Lecture_Topics(source:Models.Lecture, page_index:number, page_size:number) : Promise<RawPage<Models.Topic>> {
  let res = await fetch(`/api/v1/Lecture/${source.Id}/Lecture_Topics?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Topic>(json, e => { return {...e, }})
}


export async function get_unlinked_Lecture_Lecture_Topics(source:Models.Lecture, page_index:number, page_size:number) : Promise<RawPage<Models.Topic>> {
  let res = await fetch(`/api/v1/Lecture/${source.Id}/unlinked/Lecture_Topics?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Topic>(json, e => { return {...e, }})  
}

    
export async function create_linked_Lecture_Lecture_Topics_Topic(source:Models.Lecture) : Promise<Models.Topic[]> {
  let res = await fetch(`/api/v1/Lecture/${source.Id}/Lecture_Topics_Topic`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return json.map(e => { return {...e, CreatedDate: new Date(e.CreatedDate),  }}) as Models.Topic[]
}

export async function link_Lecture_Lecture_Topics(source:Models.Lecture, target:Models.Topic) : Promise<void> {
  let res = await fetch(`/api/v1/Lecture/${source.Id}/Lecture_Topics/${target.Id}`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function unlink_Lecture_Lecture_Topics(source:Models.Lecture, target:Models.Topic) : Promise<void> {
  let res = await fetch(`/api/v1/Lecture/${source.Id}/Lecture_Topics/${target.Id}`, { method: 'delete', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  return
}


export async function create_Lecture() : Promise<Models.Lecture> {
  let res = await fetch(`/api/v1/Lecture/`, 
    { method: 'post', credentials: 'include', headers:{'content-type': 'application/json', 
      'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: new Date(json.CreatedDate),  } as Models.Lecture
}

export async function update_Lecture(item:Models.Lecture) : Promise<void> {
  let res = await fetch(`/api/v1/Lecture/`, { method: 'put', body: JSON.stringify({...item, CreatedDate: undefined}), credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function delete_Lecture(source:Models.Lecture) : Promise<void> {
  let res = await fetch(`/api/v1/Lecture/${source.Id}`, { method: 'delete', credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value} })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function get_Lecture(id:number) : Promise<Models.Lecture> {
  let res = await fetch(`/api/v1/Lecture/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: new Date(json.CreatedDate),  } as Models.Lecture
}

export async function get_Lectures(page_index:number, page_size:number) : Promise<RawPage<Models.Lecture>> {
  let res = await fetch(`/api/v1/Lecture?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Lecture>(json, e => { return {...e, }})
}







  
  
export async function get_Topic_Lecture_Topics(source:Models.Topic, page_index:number, page_size:number) : Promise<RawPage<Models.Lecture>> {
  let res = await fetch(`/api/v1/Topic/${source.Id}/Lecture_Topics?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Lecture>(json, e => { return {...e, }})
}


export async function get_unlinked_Topic_Lecture_Topics(source:Models.Topic, page_index:number, page_size:number) : Promise<RawPage<Models.Lecture>> {
  let res = await fetch(`/api/v1/Topic/${source.Id}/unlinked/Lecture_Topics?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Lecture>(json, e => { return {...e, }})  
}

    
export async function create_linked_Topic_Lecture_Topics_Lecture(source:Models.Topic) : Promise<Models.Lecture[]> {
  let res = await fetch(`/api/v1/Topic/${source.Id}/Lecture_Topics_Lecture`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return json.map(e => { return {...e, CreatedDate: new Date(e.CreatedDate),  }}) as Models.Lecture[]
}

export async function link_Topic_Lecture_Topics(source:Models.Topic, target:Models.Lecture) : Promise<void> {
  let res = await fetch(`/api/v1/Topic/${source.Id}/Lecture_Topics/${target.Id}`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function unlink_Topic_Lecture_Topics(source:Models.Topic, target:Models.Lecture) : Promise<void> {
  let res = await fetch(`/api/v1/Topic/${source.Id}/Lecture_Topics/${target.Id}`, { method: 'delete', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  return
}


export async function create_Topic() : Promise<Models.Topic> {
  let res = await fetch(`/api/v1/Topic/`, 
    { method: 'post', credentials: 'include', headers:{'content-type': 'application/json', 
      'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: new Date(json.CreatedDate),  } as Models.Topic
}

export async function update_Topic(item:Models.Topic) : Promise<void> {
  let res = await fetch(`/api/v1/Topic/`, { method: 'put', body: JSON.stringify({...item, CreatedDate: undefined}), credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function delete_Topic(source:Models.Topic) : Promise<void> {
  let res = await fetch(`/api/v1/Topic/${source.Id}`, { method: 'delete', credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value} })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function get_Topic(id:number) : Promise<Models.Topic> {
  let res = await fetch(`/api/v1/Topic/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: new Date(json.CreatedDate),  } as Models.Topic
}

export async function get_Topics(page_index:number, page_size:number) : Promise<RawPage<Models.Topic>> {
  let res = await fetch(`/api/v1/Topic?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Topic>(json, e => { return {...e, }})
}







  
  
  