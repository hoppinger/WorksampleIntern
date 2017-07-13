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


[Route("/[controller]")]
  public class HomePagesController : Controller
  {
    private readonly MailOptions _mailOptions;
    public readonly CourseAndLecturesContext _context;

    public HomePagesController(CourseAndLecturesContext context, IOptions<MailOptions> mailOptionsAccessor)
    {
      _context = context;
      _mailOptions = mailOptionsAccessor.Value;
    }

    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{id}")]
    public IActionResult View(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);

      

      ViewData["id"] = id;
      ViewData["Page"] = "HomePages/View";
      return View();
    }
  }

  