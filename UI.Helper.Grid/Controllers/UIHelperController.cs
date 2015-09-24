using CityDataSource;
using Msc.Framework.UI.Helper;
using Msc.Template.UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace UI.Helper.Grid.Controllers
{
    public class UIHelperController : BaseController
    {
        public override long FunctionId
        {
            get
            {
                return 1;
            }
        }

        // GET: UIHelper
        public ActionResult Index()
        {
            return View();
        }

        public CustomDataSource GetCitys()
        {
            int pageSize = Convert.ToInt32(Request.Params["PageSize"]);
            int page = Convert.ToInt32(Request.Params["page"]);

            List<City> citys = CityDataSource.CityDataSource.GetCitys().Skip(page * pageSize).Take(pageSize).ToList();
            return new CustomDataSource() { Data = citys, Count = CityDataSource.CityDataSource.GetCitys().Count };
        }
    }
}