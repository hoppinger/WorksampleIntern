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


  [Route("api/v1/Course")]
  public class CourseApiController : Controller
  {
    private readonly MailOptions _mailOptions;
    public readonly CourseAndLecturesContext _context;

    public CourseApiController(CourseAndLecturesContext context, IOptions<MailOptions> mailOptionsAccessor)
    {
      _context = context;
      _mailOptions = mailOptionsAccessor.Value;
    }

    
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Course_id}/HomePage_Courses")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<HomePage> GetHomePage_Courses(int Course_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_sources = _context.Course;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Course_id);
      var allowed_targets = _context.HomePage;
      var editable_targets = _context.HomePage;
      return (from target in allowed_targets
              select target)
              .Select(CourseAndLectures.Models.HomePage.FilterViewableAttributes())
              .Select(t => Tuple.Create(t, editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(page_index, page_size, CourseAndLectures.Models.HomePage.WithoutImages, item => item);
    }

    
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Course_id}/Course_Lectures")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Lecture> GetCourse_Lectures(int Course_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_sources = _context.Course;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Course_id);
      var allowed_targets = _context.Lecture;
      var editable_targets = _context.Lecture;
      return (from link in _context.Course_Lecture
              where link.CourseId == source.Id
              from target in allowed_targets
              where link.LectureId == target.Id
              select target)
              .Select(CourseAndLectures.Models.Lecture.FilterViewableAttributes())
              .Select(t => Tuple.Create(t, editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(page_index, page_size, CourseAndLectures.Models.Lecture.WithoutImages, item => item);
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Course_id}/unlinked/Course_Lectures")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Lecture> GetUnlinkedCourse_Lectures(int Course_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_sources = _context.Course;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Course_id);
      var allowed_targets = _context.Lecture;
      var editable_targets = _context.Lecture;
      return (from target in allowed_targets
              where !_context.Course_Lecture.Any(link => link.CourseId == source.Id && link.LectureId == target.Id) &&
              (from link in _context.Course_Lecture
                where link.LectureId == target.Id
                from s in _context.Course
                where link.CourseId == s.Id
                select s).Count() < 1
              select target)
              .Select(CourseAndLectures.Models.Lecture.FilterViewableAttributes())
              .Select(t => Tuple.Create(t, editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(page_index, page_size, CourseAndLectures.Models.Lecture.WithoutImages, item => item);
    }

    bool CanAdd_Course_Course_Lectures(Course source) {
      return true;
    }

    bool CanAdd_Lecture_Course_Lectures(Lecture target) {
      return (from link in _context.Course_Lecture
           where link.LectureId == target.Id
           from source in _context.Course
           where link.CourseId == source.Id
           select source).Count() < 1;
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPost("{Course_id}/Course_Lectures_Lecture")]
    public IEnumerable<Lecture> CreateNewCourse_Lecture_Lecture(int Course_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_sources = _context.Course;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Course_id);
      if (!CanAdd_Course_Course_Lectures(source))
        throw new Exception("Cannot add item to relation Course_Lectures");
      var new_target = new Lecture() { CreatedDate = DateTime.Now, Id = _context.Lecture.Max(i => i.Id) + 1 };
      _context.Lecture.Add(new_target);
      _context.SaveChanges();
      var link = new Course_Lecture() { CourseId = source.Id, LectureId = new_target.Id };
      _context.Course_Lecture.Add(link);
      _context.SaveChanges();
      return new Lecture[] { new_target };
    }
    
    [RestrictToUserType(new string[] {"*"})]
    [HttpPost("{Course_id}/Course_Lectures/{Lecture_id}")]
    public void LinkWithCourse_Lecture(int Course_id, int Lecture_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_sources = _context.Course;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Course_id);
      var allowed_targets = _context.Lecture;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Lecture_id);
      if (!CanAdd_Course_Course_Lectures(source))
        throw new Exception("Cannot add item to relation Course_Lectures");
      if (!CanAdd_Lecture_Course_Lectures(target))
        throw new Exception("Cannot add item to relation Course_Lectures");
      var link = new Course_Lecture() { CourseId = source.Id, LectureId = target.Id };
      _context.Course_Lecture.Add(link);
      _context.SaveChanges();
    }
    [RestrictToUserType(new string[] {"*"})]
    [HttpDelete("{Course_id}/Course_Lectures/{Lecture_id}")]
    public void UnlinkFromCourse_Lecture(int Course_id, int Lecture_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_sources = _context.Course;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Course_id);
      var allowed_targets = _context.Lecture;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Lecture_id);
      var link = _context.Course_Lecture.FirstOrDefault(l => l.CourseId == source.Id && l.LectureId == target.Id);

      _context.Course_Lecture.Remove(link);
      _context.SaveChanges();
    }
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Course GetById(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_items = _context.Course;
      var item = CourseAndLectures.Models.Course.FilterViewableAttributesLocal()(allowed_items.FirstOrDefault(e => e.Id == id));
      item = CourseAndLectures.Models.Course.WithoutImages(item);
      return item;
    }
    

    [RestrictToUserType(new string[] {"*"})]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public Course Create()
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var item = new Course() { CreatedDate = DateTime.Now, Id = _context.Course.Max(i => i.Id) + 1 };
      _context.Course.Add(CourseAndLectures.Models.Course.FilterViewableAttributesLocal()(item));
      _context.SaveChanges();
      item = CourseAndLectures.Models.Course.WithoutImages(item);
      return item;
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPut]
    [ValidateAntiForgeryToken]
    public void Update([FromBody] Course item)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_items = _context.Course;
      if (!allowed_items.Any(i => i.Id == item.Id)) return;
      var new_item = item;
      
      _context.Update(new_item);
      _context.SaveChanges();
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpDelete("{id}")]
    [ValidateAntiForgeryToken]
    public void Delete(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_items = _context.Course;
      var item = _context.Course.FirstOrDefault(e => e.Id == id);
      if (!allowed_items.Any(a => a.Id == item.Id)) throw new Exception("Unauthorized delete attempt");
      _context.Course.Remove(item);
      _context.SaveChanges();
    }
    
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Course> GetAll([FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_items = _context.Course;
      var editable_items = _context.Course;
      return allowed_items
        .Select(CourseAndLectures.Models.Course.FilterViewableAttributes())
        .Select(s => Tuple.Create(s, editable_items.Any(es => es.Id == s.Id)))
        .Paginate(page_index, page_size, CourseAndLectures.Models.Course.WithoutImages, item => item);
    }
    
    
  }

  