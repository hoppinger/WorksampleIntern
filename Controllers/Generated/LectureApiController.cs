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


  [Route("api/v1/Lecture")]
  public class LectureApiController : Controller
  {
    private readonly MailOptions _mailOptions;
    public readonly CourseAndLecturesContext _context;

    public LectureApiController(CourseAndLecturesContext context, IOptions<MailOptions> mailOptionsAccessor)
    {
      _context = context;
      _mailOptions = mailOptionsAccessor.Value;
    }

    
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Lecture_id}/Course_Lectures")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Course> GetCourse_Lectures(int Lecture_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_sources = _context.Lecture;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Lecture_id);
      var allowed_targets = _context.Course;
      var editable_targets = _context.Course;
      return (from link in _context.Course_Lecture
              where link.LectureId == source.Id
              from target in allowed_targets
              where link.CourseId == target.Id
              select target)
              .Select(CourseAndLectures.Models.Course.FilterViewableAttributes())
              .Select(t => Tuple.Create(t, editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(page_index, page_size, CourseAndLectures.Models.Course.WithoutImages, item => item);
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Lecture_id}/unlinked/Course_Lectures")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Course> GetUnlinkedCourse_Lectures(int Lecture_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_sources = _context.Lecture;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Lecture_id);
      var allowed_targets = _context.Course;
      var editable_targets = _context.Course;
      return (from target in allowed_targets
              where !_context.Course_Lecture.Any(link => link.LectureId == source.Id && link.CourseId == target.Id) &&
              true
              select target)
              .Select(CourseAndLectures.Models.Course.FilterViewableAttributes())
              .Select(t => Tuple.Create(t, editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(page_index, page_size, CourseAndLectures.Models.Course.WithoutImages, item => item);
    }

    bool CanAdd_Lecture_Course_Lectures(Lecture source) {
      return true;
    }

    bool CanAdd_Course_Course_Lectures(Course target) {
      return true;
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPost("{Lecture_id}/Course_Lectures_Course")]
    public IEnumerable<Course> CreateNewCourse_Lecture_Course(int Lecture_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_sources = _context.Lecture;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Lecture_id);
      if (!CanAdd_Lecture_Course_Lectures(source))
        throw new Exception("Cannot add item to relation Course_Lectures");
      var new_target = new Course() { CreatedDate = DateTime.Now, Id = _context.Course.Max(i => i.Id) + 1 };
      _context.Course.Add(new_target);
      _context.SaveChanges();
      var link = new Course_Lecture() { LectureId = source.Id, CourseId = new_target.Id };
      _context.Course_Lecture.Add(link);
      _context.SaveChanges();
      return new Course[] { new_target };
    }
    
    [RestrictToUserType(new string[] {"*"})]
    [HttpPost("{Lecture_id}/Course_Lectures/{Course_id}")]
    public void LinkWithCourse_Lecture(int Lecture_id, int Course_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_sources = _context.Lecture;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Lecture_id);
      var allowed_targets = _context.Course;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Course_id);
      if (!CanAdd_Lecture_Course_Lectures(source))
        throw new Exception("Cannot add item to relation Course_Lectures");
      if (!CanAdd_Course_Course_Lectures(target))
        throw new Exception("Cannot add item to relation Course_Lectures");
      var link = new Course_Lecture() { LectureId = source.Id, CourseId = target.Id };
      _context.Course_Lecture.Add(link);
      _context.SaveChanges();
    }
    [RestrictToUserType(new string[] {"*"})]
    [HttpDelete("{Lecture_id}/Course_Lectures/{Course_id}")]
    public void UnlinkFromCourse_Lecture(int Lecture_id, int Course_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_sources = _context.Lecture;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Lecture_id);
      var allowed_targets = _context.Course;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Course_id);
      var link = _context.Course_Lecture.FirstOrDefault(l => l.LectureId == source.Id && l.CourseId == target.Id);

      _context.Course_Lecture.Remove(link);
      _context.SaveChanges();
    }
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Lecture_id}/Lecture_Topics")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Topic> GetLecture_Topics(int Lecture_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_sources = _context.Lecture;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Lecture_id);
      var allowed_targets = _context.Topic;
      var editable_targets = _context.Topic;
      return (from link in _context.Lecture_Topic
              where link.LectureId == source.Id
              from target in allowed_targets
              where link.TopicId == target.Id
              select target)
              .Select(CourseAndLectures.Models.Topic.FilterViewableAttributes())
              .Select(t => Tuple.Create(t, editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(page_index, page_size, CourseAndLectures.Models.Topic.WithoutImages, item => item);
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Lecture_id}/unlinked/Lecture_Topics")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Topic> GetUnlinkedLecture_Topics(int Lecture_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_sources = _context.Lecture;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Lecture_id);
      var allowed_targets = _context.Topic;
      var editable_targets = _context.Topic;
      return (from target in allowed_targets
              where !_context.Lecture_Topic.Any(link => link.LectureId == source.Id && link.TopicId == target.Id) &&
              true
              select target)
              .Select(CourseAndLectures.Models.Topic.FilterViewableAttributes())
              .Select(t => Tuple.Create(t, editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(page_index, page_size, CourseAndLectures.Models.Topic.WithoutImages, item => item);
    }

    bool CanAdd_Lecture_Lecture_Topics(Lecture source) {
      return true;
    }

    bool CanAdd_Topic_Lecture_Topics(Topic target) {
      return true;
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPost("{Lecture_id}/Lecture_Topics_Topic")]
    public IEnumerable<Topic> CreateNewLecture_Topic_Topic(int Lecture_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_sources = _context.Lecture;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Lecture_id);
      if (!CanAdd_Lecture_Lecture_Topics(source))
        throw new Exception("Cannot add item to relation Lecture_Topics");
      var new_target = new Topic() { CreatedDate = DateTime.Now, Id = _context.Topic.Max(i => i.Id) + 1 };
      _context.Topic.Add(new_target);
      _context.SaveChanges();
      var link = new Lecture_Topic() { LectureId = source.Id, TopicId = new_target.Id };
      _context.Lecture_Topic.Add(link);
      _context.SaveChanges();
      return new Topic[] { new_target };
    }
    
    [RestrictToUserType(new string[] {"*"})]
    [HttpPost("{Lecture_id}/Lecture_Topics/{Topic_id}")]
    public void LinkWithLecture_Topic(int Lecture_id, int Topic_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_sources = _context.Lecture;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Lecture_id);
      var allowed_targets = _context.Topic;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Topic_id);
      if (!CanAdd_Lecture_Lecture_Topics(source))
        throw new Exception("Cannot add item to relation Lecture_Topics");
      if (!CanAdd_Topic_Lecture_Topics(target))
        throw new Exception("Cannot add item to relation Lecture_Topics");
      var link = new Lecture_Topic() { LectureId = source.Id, TopicId = target.Id };
      _context.Lecture_Topic.Add(link);
      _context.SaveChanges();
    }
    [RestrictToUserType(new string[] {"*"})]
    [HttpDelete("{Lecture_id}/Lecture_Topics/{Topic_id}")]
    public void UnlinkFromLecture_Topic(int Lecture_id, int Topic_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_sources = _context.Lecture;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Lecture_id);
      var allowed_targets = _context.Topic;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Topic_id);
      var link = _context.Lecture_Topic.FirstOrDefault(l => l.LectureId == source.Id && l.TopicId == target.Id);

      _context.Lecture_Topic.Remove(link);
      _context.SaveChanges();
    }
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Lecture GetById(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_items = _context.Lecture;
      var item = CourseAndLectures.Models.Lecture.FilterViewableAttributesLocal()(allowed_items.FirstOrDefault(e => e.Id == id));
      item = CourseAndLectures.Models.Lecture.WithoutImages(item);
      return item;
    }
    

    [RestrictToUserType(new string[] {"*"})]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public Lecture Create()
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var item = new Lecture() { CreatedDate = DateTime.Now, Id = _context.Lecture.Max(i => i.Id) + 1 };
      _context.Lecture.Add(CourseAndLectures.Models.Lecture.FilterViewableAttributesLocal()(item));
      _context.SaveChanges();
      item = CourseAndLectures.Models.Lecture.WithoutImages(item);
      return item;
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPut]
    [ValidateAntiForgeryToken]
    public void Update([FromBody] Lecture item)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_items = _context.Lecture;
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

      var allowed_items = _context.Lecture;
      var item = _context.Lecture.FirstOrDefault(e => e.Id == id);
      if (!allowed_items.Any(a => a.Id == item.Id)) throw new Exception("Unauthorized delete attempt");
      _context.Lecture.Remove(item);
      _context.SaveChanges();
    }
    
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Lecture> GetAll([FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_items = _context.Lecture;
      var editable_items = _context.Lecture;
      return allowed_items
        .Select(CourseAndLectures.Models.Lecture.FilterViewableAttributes())
        .Select(s => Tuple.Create(s, editable_items.Any(es => es.Id == s.Id)))
        .Paginate(page_index, page_size, CourseAndLectures.Models.Lecture.WithoutImages, item => item);
    }
    
    
  }

  