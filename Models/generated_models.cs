using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace CourseAndLectures.Models
{
    public partial class HomePage {
    public HomePage() {
      
    }
    public int Id {get;set;}
    
    [Newtonsoft.Json.JsonProperty(ItemConverterType = typeof(Newtonsoft.Json.Converters.JavaScriptDateTimeConverter))] public DateTime CreatedDate{ get; set; }
        
    
    static public Expression<Func<HomePage,HomePage>> FilterViewableAttributes() {
      return self => self;
    }
    static public Func<HomePage,HomePage> FilterViewableAttributesLocal() {
      return self => self;
    }
    static public HomePage WithoutImages(HomePage self) {
      
      return self;
    }
  }
  
  public partial class Course {
    public Course() {
      Course_Lectures = new HashSet<Course_Lecture>();
    }
    public int Id {get;set;}
    [Newtonsoft.Json.JsonIgnore] public virtual ICollection<Course_Lecture> Course_Lectures {get;set;}
    [Newtonsoft.Json.JsonProperty(ItemConverterType = typeof(Newtonsoft.Json.Converters.JavaScriptDateTimeConverter))] public DateTime CreatedDate{ get; set; }
        public string Name {get;set;}
    public string Description {get;set;}
    public int StudyPoints {get;set;}
    public bool Published {get;set;}
    
    static public Expression<Func<Course,Course>> FilterViewableAttributes() {
      return self => self;
    }
    static public Func<Course,Course> FilterViewableAttributesLocal() {
      return self => self;
    }
    static public Course WithoutImages(Course self) {
      
      return self;
    }
  }
  
  public partial class Lecture {
    public Lecture() {
      Course_Lectures = new HashSet<Course_Lecture>();
      Lecture_Topics = new HashSet<Lecture_Topic>();
    }
    public int Id {get;set;}
    [Newtonsoft.Json.JsonIgnore] public virtual ICollection<Course_Lecture> Course_Lectures {get;set;}
    [Newtonsoft.Json.JsonIgnore] public virtual ICollection<Lecture_Topic> Lecture_Topics {get;set;}
    [Newtonsoft.Json.JsonProperty(ItemConverterType = typeof(Newtonsoft.Json.Converters.JavaScriptDateTimeConverter))] public DateTime CreatedDate{ get; set; }
        public string Name {get;set;}
    public string Description {get;set;}
    public bool IsPracticum {get;set;}
    
    static public Expression<Func<Lecture,Lecture>> FilterViewableAttributes() {
      return self => self;
    }
    static public Func<Lecture,Lecture> FilterViewableAttributesLocal() {
      return self => self;
    }
    static public Lecture WithoutImages(Lecture self) {
      
      return self;
    }
  }
  
  public partial class Topic {
    public Topic() {
      Lecture_Topics = new HashSet<Lecture_Topic>();
    }
    public int Id {get;set;}
    [Newtonsoft.Json.JsonIgnore] public virtual ICollection<Lecture_Topic> Lecture_Topics {get;set;}
    [Newtonsoft.Json.JsonProperty(ItemConverterType = typeof(Newtonsoft.Json.Converters.JavaScriptDateTimeConverter))] public DateTime CreatedDate{ get; set; }
        public string Name {get;set;}
    
    static public Expression<Func<Topic,Topic>> FilterViewableAttributes() {
      return self => self;
    }
    static public Func<Topic,Topic> FilterViewableAttributesLocal() {
      return self => self;
    }
    static public Topic WithoutImages(Topic self) {
      
      return self;
    }
  }
  
  

  public partial class Course_Lecture {
    public Course_Lecture() {
      
    }
    public int Id {get;set;}
    
    
        [Newtonsoft.Json.JsonIgnore] public virtual Course Course {get;set;}
    public int CourseId {get;set;}
    [Newtonsoft.Json.JsonIgnore] public virtual Lecture Lecture {get;set;}
    public int LectureId {get;set;}
    
    static public Expression<Func<Course_Lecture,Course_Lecture>> FilterViewableAttributes() {
      return self => self;
    }
    static public Func<Course_Lecture,Course_Lecture> FilterViewableAttributesLocal() {
      return self => self;
    }
    
  }
  

  public partial class Lecture_Topic {
    public Lecture_Topic() {
      
    }
    public int Id {get;set;}
    
    
        [Newtonsoft.Json.JsonIgnore] public virtual Lecture Lecture {get;set;}
    public int LectureId {get;set;}
    [Newtonsoft.Json.JsonIgnore] public virtual Topic Topic {get;set;}
    public int TopicId {get;set;}
    
    static public Expression<Func<Lecture_Topic,Lecture_Topic>> FilterViewableAttributes() {
      return self => self;
    }
    static public Func<Lecture_Topic,Lecture_Topic> FilterViewableAttributesLocal() {
      return self => self;
    }
    
  }
  

  public partial class LoggableEntities {
  
}

  public partial class Session {
    public int Id {get;set;}
    public string CookieName {get;set;}
    public string Content {get;set;}
    public DateTime CreatedAt {get;set;}
  }
}
