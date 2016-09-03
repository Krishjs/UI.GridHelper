using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CityDataSource;
using Msc.Framework.UI.Helper;
using Msc.Template.UI;

namespace UI.Helper.Grid.Controllers
{
    public class GridController : BaseController
    {
        public override string FunctionCode
        {
            get
            {
                return "GRID";
            }
        }

        // GET: Grid
        public ActionResult GridView()
        {
            ViewData["Count"] = this.Citys.Count;
            return View(this.Citys.Take(10).ToList());
        }

        // GET: Grid
        public ActionResult GridViewWithNoRecords()
        {            
            return View();
        }

        public ActionResult GridViewWithoutPagination()
        {
            List<City> citys = this.Citys.Take(50).ToList();
            bool makeTrue = false;
            citys.ForEach(c => { makeTrue = !makeTrue; c.HasFlag = makeTrue;  });
            return View(citys);
        }

        private List<City> citys = null;

        public List<City> Citys
        {
            get
            {
                if (this.citys == null)
                {
                    this.citys = CityDataSource.CityDataSource.GetCitys();
                }
                return this.citys;
            }
            set
            {
                this.citys = value;
            }
        }
        public ActionResult NoRecords(CallbackRequestData request, List<City> toUpdateOrDelete, string mode)
        {
            return CustomData(new List<City>(), 0);
        }

        // GET: Grid
        public ActionResult AddUpdateGrid(CallbackRequestData request, List<City> toUpdateOrDelete, string mode)
        {
            if (mode == "A")
            {
                this.Citys.Insert(0, new City() { Id = Citys.Count > 0 ? Citys.Max(c => c.Id) + 1 : 1 });
            }
            if(toUpdateOrDelete != null)
            {
                foreach (City city in toUpdateOrDelete)
                {                    
                    int index =this.Citys.FindIndex(c => c.Id == city.Id);
                    if (index > -1)
                    {
                        this.Citys.RemoveAt(index);
                        this.Citys.Insert(index, city);
                    }
                }
            }            
            List<City> citys = this.Citys.Where(c=>c.Status != "D").Skip((request.Page -  1)  * request.PageSize).Take(request.PageSize).ToList();
            citys.ForEach(p => { if (p.Id % 2 == 0) { p.ZipCodes.Add(new CityZipCode() { Id = 1, CityZip = "627354" }); } });
            return CustomData(citys, this.Citys.Where(c => c.Status != "D").Count());
        }
    }
}