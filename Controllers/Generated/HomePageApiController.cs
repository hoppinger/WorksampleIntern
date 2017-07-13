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


  [Route("api/v1/HomePage")]
  public class HomePageApiController : Controller
  {
    private readonly MailOptions _mailOptions;
    public readonly CourseAndLecturesContext _context;

    public HomePageApiController(CourseAndLecturesContext context, IOptions<MailOptions> mailOptionsAccessor)
    {
      _context = context;
      _mailOptions = mailOptionsAccessor.Value;
    }

    
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{HomePage_id}/HomePage_Courses")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<Course> GetHomePage_Courses(int HomePage_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_sources = _context.HomePage;
      var source = allowed_sources.FirstOrDefault(s => s.Id == HomePage_id);
      var allowed_targets = _context.Course;
      var editable_targets = _context.Course;
      return (from target in allowed_targets
              select target)
              .Select(CourseAndLectures.Models.Course.FilterViewableAttributes())
              .Select(t => Tuple.Create(t, editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(page_index, page_size, CourseAndLectures.Models.Course.WithoutImages, item => item);
    }

    
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public HomePage GetById(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_items = _context.HomePage;
      var item = CourseAndLectures.Models.HomePage.FilterViewableAttributesLocal()(allowed_items.FirstOrDefault(e => e.Id == id));
      item = CourseAndLectures.Models.HomePage.WithoutImages(item);
      return item;
    }
    

    [RestrictToUserType(new string[] {})]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public HomePage Create()
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var item = new HomePage() { CreatedDate = DateTime.Now, Id = _context.HomePage.Max(i => i.Id) + 1 };
      _context.HomePage.Add(CourseAndLectures.Models.HomePage.FilterViewableAttributesLocal()(item));
      _context.SaveChanges();
      item = CourseAndLectures.Models.HomePage.WithoutImages(item);
      return item;
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpPut]
    [ValidateAntiForgeryToken]
    public void Update([FromBody] HomePage item)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_items = _context.HomePage;
      if (!allowed_items.Any(i => i.Id == item.Id)) return;
      var new_item = item;
      
      _context.Update(new_item);
      _context.SaveChanges();
    }

    [RestrictToUserType(new string[] {})]
    [HttpDelete("{id}")]
    [ValidateAntiForgeryToken]
    public void Delete(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_items = _context.HomePage;
      var item = _context.HomePage.FirstOrDefault(e => e.Id == id);
      if (!allowed_items.Any(a => a.Id == item.Id)) throw new Exception("Unauthorized delete attempt");
      _context.HomePage.Remove(item);
      _context.SaveChanges();
    }
    
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<HomePage> GetAll([FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      var allowed_items = _context.HomePage;
      var editable_items = _context.HomePage;
      return allowed_items
        .Select(CourseAndLectures.Models.HomePage.FilterViewableAttributes())
        .Select(s => Tuple.Create(s, editable_items.Any(es => es.Id == s.Id)))
        .Paginate(page_index, page_size, CourseAndLectures.Models.HomePage.WithoutImages, item => item);
    }
    
    
  }

  