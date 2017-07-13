using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace CourseAndLectures.Models{
  public partial class CourseAndLecturesContext {
    public DbSet<HomePage> HomePage { get; set; }
    public DbSet<Course> Course { get; set; }
    public DbSet<Lecture> Lecture { get; set; }
    public DbSet<Topic> Topic { get; set; }
    public DbSet<Course_Lecture> Course_Lecture { get; set; }
    public DbSet<Lecture_Topic> Lecture_Topic { get; set; }
    public DbSet<Session> Session { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder) {



      modelBuilder.Entity<Course>()
        .HasMany(p => p.Course_Lectures)
        .WithOne(i => i.Course)
        .OnDelete(DeleteBehavior.SetNull);
      modelBuilder.Entity<Course_Lecture>()
        .HasOne(p => p.Course)
        .WithMany(i => i.Course_Lectures)
        .OnDelete(DeleteBehavior.SetNull);

      modelBuilder.Entity<Lecture>()
        .HasMany(p => p.Course_Lectures)
        .WithOne(i => i.Lecture)
        .OnDelete(DeleteBehavior.SetNull);
      modelBuilder.Entity<Course_Lecture>()
        .HasOne(p => p.Lecture)
        .WithMany(i => i.Course_Lectures)
        .OnDelete(DeleteBehavior.SetNull);

      modelBuilder.Entity<Lecture>()
        .HasMany(p => p.Lecture_Topics)
        .WithOne(i => i.Lecture)
        .OnDelete(DeleteBehavior.SetNull);
      modelBuilder.Entity<Lecture_Topic>()
        .HasOne(p => p.Lecture)
        .WithMany(i => i.Lecture_Topics)
        .OnDelete(DeleteBehavior.SetNull);

      modelBuilder.Entity<Topic>()
        .HasMany(p => p.Lecture_Topics)
        .WithOne(i => i.Topic)
        .OnDelete(DeleteBehavior.SetNull);
      modelBuilder.Entity<Lecture_Topic>()
        .HasOne(p => p.Topic)
        .WithMany(i => i.Lecture_Topics)
        .OnDelete(DeleteBehavior.SetNull);

  
      modelBuilder.Entity<Session>()
              .HasIndex(b => b.CookieName);
    }
  }
}
    