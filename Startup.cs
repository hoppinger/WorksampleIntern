using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using NLog.Extensions.Logging;
using NLog.Web;
using CourseAndLectures.Data;
using CourseAndLectures.Models;

namespace CourseAndLectures
{
  public class MailOptions
  {
    public MailOptions()
    {
    }
    public string MailApiToken { get; set; }
    public string MailFrom { get; set; }
  }

  public class ApiOptions
  {
    public ApiOptions()
    {
    }
    public string ApiToken { get; set; }
  }

  public class Startup
  {
    public Startup(IHostingEnvironment env)
    {
      var builder = new ConfigurationBuilder()
          .SetBasePath(env.ContentRootPath)
          .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
          .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true);

      builder.AddEnvironmentVariables();
      Configuration = builder.Build();
      if(!env.IsDevelopment())
      {
        env.ConfigureNLog("nlog.config");
      }
    }

    public IConfigurationRoot Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
      services.AddAntiforgery(options => options.HeaderName = "X-XSRF-TOKEN");

      services.AddDbContext<CourseAndLecturesContext>(options =>
      {
        options.UseSqlite(Configuration.GetConnectionString("CourseAndLecturesConnection"));
      });

      Microsoft.Extensions.DependencyInjection.OptionsConfigurationServiceCollectionExtensions.Configure<MailOptions>(services, Configuration);
      Microsoft.Extensions.DependencyInjection.OptionsConfigurationServiceCollectionExtensions.Configure<ApiOptions>(services, Configuration);

      // services.AddIdentity<ApplicationUser, IdentityRole>()
      //     .AddEntityFrameworkStores<ApplicationDbContext>()
      //     .AddDefaultTokenProviders();

      services.AddMvc().AddJsonOptions(options =>
         {
           options.SerializerSettings.ContractResolver = new Newtonsoft.Json.Serialization.DefaultContractResolver();
           options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
         });

      // Adds a default in-memory implementation of IDistributedCache.
      services.AddDistributedMemoryCache();

      services.AddSession(options =>
      {
        options.CookieName = ".CourseAndLectures.Session804";
        options.IdleTimeout = TimeSpan.FromDays(365);
        options.CookieHttpOnly = true;
      });
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IOptions<ApiOptions> apiOptionsAccessor, IHostingEnvironment env, ILoggerFactory loggerFactory, CourseAndLecturesContext dbContext, IAntiforgery antiforgery)
    {
      // loggerFactory.AddConsole(Configuration.GetSection("Logging"));
      loggerFactory.AddConsole(LogLevel.Error);
      loggerFactory.AddDebug(LogLevel.Error);

      Filters.RestrictToUserTypeAttribute.ApiToken = apiOptionsAccessor.Value.ApiToken;

      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
        app.UseDatabaseErrorPage();
        app.UseBrowserLink();
        CourseAndLecturesContextSeeds.Initialize(dbContext);
      }
      else
      {
        app.UseExceptionHandler("/Home/Error");
        loggerFactory.AddNLog();
      }
      CourseAndLecturesContextSeeds.InitializePagesAndSingletons(dbContext);

      app.UseStaticFiles();

      // app.UseIdentity();

      app.UseSession();

      app.UseMvc(routes =>
      {
      });
    }
  }
}