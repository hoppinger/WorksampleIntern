using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;
using CourseAndLectures;
using CourseAndLectures.Models;
using CourseAndLectures.Filters;


namespace CourseAndLectures.Models
{
  public static class Permissions {
    static public bool can_view_HomePage() { return true; }

    static public bool can_create_HomePage() { return false; }

    static public bool can_edit_HomePage() { return true; }

    static public bool can_delete_HomePage() { return false; }
      
  

    
static public bool can_view_Course() { return true; }

    static public bool can_create_Course() { return true; }

    static public bool can_edit_Course() { return true; }

    static public bool can_delete_Course() { return true; }
      
    static public bool can_view_Course_Name() { return true; }

    static public bool can_edit_Course_Name() { return true; }
    
  static public bool can_view_Course_Description() { return true; }

    static public bool can_edit_Course_Description() { return true; }
    
  static public bool can_view_Course_StudyPoints() { return true; }

    static public bool can_edit_Course_StudyPoints() { return true; }
    
  static public bool can_view_Course_Published() { return true; }

    static public bool can_edit_Course_Published() { return true; }
    

    
static public bool can_view_Lecture() { return true; }

    static public bool can_create_Lecture() { return true; }

    static public bool can_edit_Lecture() { return true; }

    static public bool can_delete_Lecture() { return true; }
      
    static public bool can_view_Lecture_Name() { return true; }

    static public bool can_edit_Lecture_Name() { return true; }
    
  static public bool can_view_Lecture_Description() { return true; }

    static public bool can_edit_Lecture_Description() { return true; }
    
  static public bool can_view_Lecture_IsPracticum() { return true; }

    static public bool can_edit_Lecture_IsPracticum() { return true; }
    

    
static public bool can_view_Topic() { return true; }

    static public bool can_create_Topic() { return true; }

    static public bool can_edit_Topic() { return true; }

    static public bool can_delete_Topic() { return true; }
      
    static public bool can_view_Topic_Name() { return true; }

    static public bool can_edit_Topic_Name() { return true; }
    

    

    static public bool can_view_HomePage_Course() { return true; }

    static public bool can_create_HomePage_Course() { return true; }

    static public bool can_edit_HomePage_Course() { return true; }

    static public bool can_delete_HomePage_Course() { return true; }
static public bool can_view_Course_Lecture() { return true; }

    static public bool can_create_Course_Lecture() { return true; }

    static public bool can_edit_Course_Lecture() { return true; }

    static public bool can_delete_Course_Lecture() { return true; }
static public bool can_view_Lecture_Topic() { return true; }

    static public bool can_create_Lecture_Topic() { return true; }

    static public bool can_edit_Lecture_Topic() { return true; }

    static public bool can_delete_Lecture_Topic() { return true; }
  }
}
