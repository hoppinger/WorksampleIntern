using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace CourseAndLectures.Models{
  public partial class CourseAndLecturesContext : DbContext {

      public CourseAndLecturesContext(DbContextOptions<CourseAndLecturesContext> options) : base(options){}
  }
}
