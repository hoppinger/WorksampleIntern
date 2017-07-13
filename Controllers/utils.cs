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

namespace CourseAndLectures
{
  public class ItemWithEditable<T> {
    public T Item {get;set;}
    public bool Editable {get;set;}
  }

  public class Container<T> { 
    public T Content {get;set;}
  }


  static public class QueryableExtensions {
    static public Page<T> Paginate<T, U>(this IQueryable<Tuple<U, bool>> self, int page_index, int page_size, Func<U,U> g, Func<U,T> f) {
      var count = self.Count();
      var num_pages = count / page_size + (count % page_size > 0 ? 1 : 0);
      var items = self.Skip(page_index * page_size).Take(page_size).Select(u => Tuple.Create(g(u.Item1), u.Item2)).Select(u => new ItemWithEditable<T>(){ Item = f(u.Item1), Editable = u.Item2}).ToList();
      return new Page<T>() {
        Items = items,
        PageIndex = page_index,
        NumPages = num_pages,
        PageSize = page_size
      };
    }  
  }

  public class Page<T> {
    public IEnumerable<ItemWithEditable<T>> Items {get;set;}
    public int PageIndex {get;set;}
    public int NumPages {get;set;}
    public int PageSize {get;set;}
  }
}