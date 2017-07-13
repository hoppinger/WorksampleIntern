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


  [Route("api/v1/Topic")]
  public class TopicApiController : Controller
  {
    private readonly MailOptions _mailOptions;
    public readonly CourseAndLecturesContext _context;

    public TopicApiController(CourseAndLecturesContext context, IOptions<MailOptions> mailOptionsAccessor)
    {
      _context = context;
      _mailOptions = mailOptionsAccessor.Value;
    }

    
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Topic_id}/Lecture_Topics")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Lecture> GetLecture_Topics(int Topic_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_sources = _context.Topic;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Topic_id);
      var allowed_targets = _context.Lecture;
      var editable_targets = _context.Lecture;
      return (from link in _context.Lecture_Topic
              where link.TopicId == source.Id
              from target in allowed_targets
              where link.LectureId == target.Id
              select target)
              .Select(CourseAndLectures.Models.Lecture.FilterViewableAttributes())
              .Select(t => Tuple.Create(t, editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(page_index, page_size, CourseAndLectures.Models.Lecture.WithoutImages, item => item);
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{Topic_id}/unlinked/Lecture_Topics")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Lecture> GetUnlinkedLecture_Topics(int Topic_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_sources = _context.Topic;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Topic_id);
      var allowed_targets = _context.Lecture;
      var editable_targets = _context.Lecture;
      return (from target in allowed_targets
              where !_context.Lecture_Topic.Any(link => link.TopicId == source.Id && link.LectureId == target.Id) &&
              true
              select target)
              .Select(CourseAndLectures.Models.Lecture.FilterViewableAttributes())
              .Select(t => Tuple.Create(t, editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(page_index, page_size, CourseAndLectures.Models.Lecture.WithoutImages, item => item);
    }

    bool CanAdd_Topic_Lecture_Topics(Topic source) {
      return true;
    }

    bool CanAdd_Lecture_Lecture_Topics(Lecture target) {
      return true;
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPost("{Topic_id}/Lecture_Topics_Lecture")]
    public IEnumerable<Lecture> CreateNewLecture_Topic_Lecture(int Topic_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_sources = _context.Topic;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Topic_id);
      if (!CanAdd_Topic_Lecture_Topics(source))
        throw new Exception("Cannot add item to relation Lecture_Topics");
      var new_target = new Lecture() { CreatedDate = DateTime.Now, Id = _context.Lecture.Max(i => i.Id) + 1 };
      _context.Lecture.Add(new_target);
      _context.SaveChanges();
      var link = new Lecture_Topic() { TopicId = source.Id, LectureId = new_target.Id };
      _context.Lecture_Topic.Add(link);
      _context.SaveChanges();
      return new Lecture[] { new_target };
    }
    
    [RestrictToUserType(new string[] {"*"})]
    [HttpPost("{Topic_id}/Lecture_Topics/{Lecture_id}")]
    public void LinkWithLecture_Topic(int Topic_id, int Lecture_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_sources = _context.Topic;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Topic_id);
      var allowed_targets = _context.Lecture;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Lecture_id);
      if (!CanAdd_Topic_Lecture_Topics(source))
        throw new Exception("Cannot add item to relation Lecture_Topics");
      if (!CanAdd_Lecture_Lecture_Topics(target))
        throw new Exception("Cannot add item to relation Lecture_Topics");
      var link = new Lecture_Topic() { TopicId = source.Id, LectureId = target.Id };
      _context.Lecture_Topic.Add(link);
      _context.SaveChanges();
    }
    [RestrictToUserType(new string[] {"*"})]
    [HttpDelete("{Topic_id}/Lecture_Topics/{Lecture_id}")]
    public void UnlinkFromLecture_Topic(int Topic_id, int Lecture_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_sources = _context.Topic;
      var source = allowed_sources.FirstOrDefault(s => s.Id == Topic_id);
      var allowed_targets = _context.Lecture;
      var target = allowed_targets.FirstOrDefault(s => s.Id == Lecture_id);
      var link = _context.Lecture_Topic.FirstOrDefault(l => l.TopicId == source.Id && l.LectureId == target.Id);

      _context.Lecture_Topic.Remove(link);
      _context.SaveChanges();
    }
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Topic GetById(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_items = _context.Topic;
      var item = CourseAndLectures.Models.Topic.FilterViewableAttributesLocal()(allowed_items.FirstOrDefault(e => e.Id == id));
      item = CourseAndLectures.Models.Topic.WithoutImages(item);
      return item;
    }
    

    [RestrictToUserType(new string[] {"*"})]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public Topic Create()
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var item = new Topic() { CreatedDate = DateTime.Now, Id = _context.Topic.Max(i => i.Id) + 1 };
      _context.Topic.Add(CourseAndLectures.Models.Topic.FilterViewableAttributesLocal()(item));
      _context.SaveChanges();
      item = CourseAndLectures.Models.Topic.WithoutImages(item);
      return item;
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPut]
    [ValidateAntiForgeryToken]
    public void Update([FromBody] Topic item)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_items = _context.Topic;
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

      var allowed_items = _context.Topic;
      var item = _context.Topic.FirstOrDefault(e => e.Id == id);
      if (!allowed_items.Any(a => a.Id == item.Id)) throw new Exception("Unauthorized delete attempt");
      _context.Topic.Remove(item);
      _context.SaveChanges();
    }
    
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Topic> GetAll([FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_items = _context.Topic;
      var editable_items = _context.Topic;
      return allowed_items
        .Select(CourseAndLectures.Models.Topic.FilterViewableAttributes())
        .Select(s => Tuple.Create(s, editable_items.Any(es => es.Id == s.Id)))
        .Paginate(page_index, page_size, CourseAndLectures.Models.Topic.WithoutImages, item => item);
    }
    
    
  }

  