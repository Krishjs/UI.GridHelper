using CityDataSource;
using Kendo.Mvc;
using Kendo.Mvc.Extensions;
using Msc.Framework.UI.Helper;
using Msc.Template.UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using System.Web.SessionState;
using Newtonsoft.Json;
using UI.Helper.Models;

namespace UI.Helper.Grid.Controllers
{
    public class UIHelperController : BaseController
    {
        public override string FunctionCode
        {
            get
            {
                return "GU";
            }
        }

        // GET: UIHelper
        public ActionResult Index()
        {
            this.CityGridRegistration();
            return View();
        }

        public ActionResult MultiSelect()
        {
            var city = new CityDataSource.City();
            city.ZipCodes.Add(new CityZipCode() { Id = 1, CityId = 1, CityZip = "62735250" });
            return View(city);
        }


        public ActionResult ComboBoxGroup()
        {
            return View();
        }

        [Callback]
        public ActionResult GetZipList(CallbackRequestData request)
        {
            var zips = new List<CityZipCode>();
            zips.Add(new CityZipCode() { Id = 1, CityZip = "627354" });
            zips.Add(new CityZipCode() { Id = 2, CityZip = "627355" });
            zips.Add(new CityZipCode() { Id = 3, CityZip = "627356" });
            zips.Add(new CityZipCode() { Id = 4, CityZip = "627357" });
            for (int i = 5; i <= 500; i++)
            {
                zips.Add(new CityZipCode() { Id = i, CityZip = "62735" + i });
            }
            return Data(zips, request);
        }

        private void CityGridRegistration()
        {
            var cityDetail = new DetailTransaction<City>(CityDataSource.CityDataSource.GetCitys().Take(100).ToList());
            this.DetailContainer["PagingCityGrid"] = cityDetail;

        }

        [Callback]
        public ActionResult GetStates(Kendo.Mvc.UI.DataSourceRequest request)
        {
            IEnumerable<State> states = CityDataSource.CityDataSource.GetCitys().Where(p => !string.IsNullOrEmpty(p.StateInfo.Name)).Select(p => p.StateInfo);
            return Json(states.ToDataSourceResult(request));
        }

        [Callback]
        public ActionResult GetCountries(CallbackRequestData request)
        {
            IEnumerable<Country> countries = CityDataSource.CityDataSource.GetCitys().Where(p => !string.IsNullOrEmpty(p.StateInfo.Name)).Select(p => p.StateInfo).Take(1000).Select(p => p.CountryInfo);
            return CustomData(countries, countries.Count());
        }

        [Callback]
        public ActionResult GetCitys(CallbackRequestData request)
        {
            var filters = request.FilterOptions;
            List<City> citys = CityDataSource.CityDataSource.GetCitys().Skip(request.Page * request.PageSize).Take(request.PageSize).ToList();
            citys.ForEach(p => { if (p.Id % 2 == 0) { p.ZipCodes.Add(new CityZipCode() { Id = 1, CityZip = "627354" }); } });
            return CustomData(citys, CityDataSource.CityDataSource.GetCitys().Count);
        }

        public ActionResult BasicGrid()
        {
            List<City> citys = CityDataSource.CityDataSource.GetCitys().Take(400).ToList();
            return View(citys);
        }

        static readonly int total = 5;

        public ActionResult FormView()
        {
            ViewData.TemplateInfo.HtmlFieldPrefix = "City";
            var cities = new List<City>();
            cities = CityDataSource.CityDataSource.GetCitys().Take(total).ToList();
            cities.ForEach(p => { p.ZipCodes.Add(new CityZipCode() { Id = 1, CityZip = "627354" }); });
            return View(cities);
        }

        public ActionResult TreeView()
        {
            return View();
        }

        public ActionResult GetCityForTreeView()
        {
            var cities = new List<City>();
            cities = CityDataSource.CityDataSource.GetCitys().Take(total).ToList();
            long id = 0;
            cities.ForEach(p => { p.ZipCodes.Add(new CityZipCode() { Id = ++id, CityZip = "627354" }); });            
            //return Json(cities.Select(cr => new ChargeCodeTreeViewModel
            //{
            //    Id = cr.Id.ToString(),
            //    Name = cr.Name,
            //    HasChildren = cr.ZipCodes.Count > 0,
            //    Level = "1",
            //    Icon = "folder",
            //    ChildNode = cr.ZipCodes.Select(child => new ChargeCodeTreeViewModel
            //    {
            //        Id = child.CityId.ToString(),
            //        Name = child.CityZip,
            //        HasChildren = false,
            //        Level = "2",
            //        Icon = "folder"
            //    }).ToList()
            //}), JsonRequestBehavior.AllowGet);
            string json = "[{\"Id\":\"-1\",\"Name\":\"ALL CHARGE CODES\",\"HasChildren\":true,\"Icon\":\"folder\",\"Level\":\"1\",\"ChildNode\":[{\"Id\":\"OTEH\",\"Name\":\"OTEH\",\"HasChildren\":true,\"Icon\":\"folder\",\"Level\":\"2\",\"ChildNode\":[{\"Id\":\"155\",\"Name\":\"TRD - TRANSIT DOCUMENTS\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"182\",\"Name\":\"COU - COURIER\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"181\",\"Name\":\"COS - CONTAINER SALE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"157\",\"Name\":\"TRW - WASTED TRIP\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"4003\",\"Name\":\"AFI - ATTENDANCE FEE INCOME\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"242\",\"Name\":\"NCR - NON CARGO CLAIM RECOVERY\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"172\",\"Name\":\"CCR - CARGO CLAIM RECOVERY\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"203\",\"Name\":\"EMR - REPAIR FEE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"233\",\"Name\":\"LPF - LATE PICK UP FEE1\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"238\",\"Name\":\"MCT - MANIFEST CORRECTOR FEE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"148\",\"Name\":\"STC - STATUS CHANGE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"173\",\"Name\":\"CDD - CARGO DATA DECLARATION\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"220\",\"Name\":\"GNA - NON OPERATION REVENUES\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"184\",\"Name\":\"CTS - COLD TREATMENT SURCHARGE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"227\",\"Name\":\"IML - IMO LABEL\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"171\",\"Name\":\"CCL - CONTAINER CLEANING\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"141\",\"Name\":\"SEL - SEAL FEE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"187\",\"Name\":\"CUS - CUSTOMS DUTY\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"170\",\"Name\":\"CAH - HAULAGE FEE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"194\",\"Name\":\"DOF - DELIVERY ORDER FEE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"162\",\"Name\":\"WDE - WARRANTY DEPOSITS\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"198\",\"Name\":\"DTT - DETENTION\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"158\",\"Name\":\"TXR - TELEX RELEASE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"236\",\"Name\":\"LSF - LATE SUBMISSION FEE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"239\",\"Name\":\"MDF - MISDECLARATION FEE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"154\",\"Name\":\"TRB - TRANSIT BOND\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"160\",\"Name\":\"WAI - TRUCKING WAITING TIME OR DETENTION\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"176\",\"Name\":\"CIF - CONTAINER INSPECTION FEE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"165\",\"Name\":\"ADM - ADMINISTRATION FEES\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"191\",\"Name\":\"DIS - DISBURSEMENTS\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"217\",\"Name\":\"FUM - FUMIGATION \u0026 SANITARY\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"166\",\"Name\":\"BOK - BOOKING FEE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"186\",\"Name\":\"CUI - CUSTOMS INSPECTIONS\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"152\",\"Name\":\"SUR - SURVEY FEE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"228\",\"Name\":\"INT - VARIOUS INTERMODAL\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"177\",\"Name\":\"CLU - CONTAINER LINING OR UPGRADING\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"127\",\"Name\":\"PRM - PRIMAGE (TURKISH FEES)\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"133\",\"Name\":\"REN - RENTAL FEES\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"169\",\"Name\":\"CAG - CARGO HANDLING\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null}]},{\"Id\":\"FRT\",\"Name\":\"FRT\",\"HasChildren\":true,\"Icon\":\"folder\",\"Level\":\"2\",\"ChildNode\":[{\"Id\":\"195\",\"Name\":\"DRC - DEMOCRATIC REPUBLIC OF CONGO SURCHARGE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"168\",\"Name\":\"CAF - CURRENCY ADJUSTMENT FACTOR\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"180\",\"Name\":\"COM - COMMODITY SURCHARGE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"175\",\"Name\":\"CGS - CONGESTION SURCHARGE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"174\",\"Name\":\"CFS - FINE SURCHARGE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"138\",\"Name\":\"RSC - REEFER SURCHARGE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"193\",\"Name\":\"DOC - BILL OF LADING FEE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"145\",\"Name\":\"SOC - SHIPPER OWNED CONTAINER\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"147\",\"Name\":\"SSC - SPECIAL STOWAGE CHARGE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"164\",\"Name\":\"ACS - ATMOSPHERE CONTROL SURCHARGE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"230\",\"Name\":\"LAS - LASHING AND UNLASHING\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"128\",\"Name\":\"PRS - PIRACY RISK SURCHARGE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"222\",\"Name\":\"HCS - HOLDING COST SURCHARGE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"132\",\"Name\":\"RCP - REEFER CONTAINER PLUGGING AND MONITORING\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"159\",\"Name\":\"USC - SECURITY MANIFEST DOCUMENTATION FEE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"124\",\"Name\":\"PAD - PORT SURCHARGE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"223\",\"Name\":\"HGT - HANGTAINER CONVERSION CHARGE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"188\",\"Name\":\"CVT - CHINA VAT\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"129\",\"Name\":\"PSS - PEAK SEASON SURCHARGE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"201\",\"Name\":\"EHF - ELSEWHERE HANDLING FEE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"179\",\"Name\":\"COL - COLLECTION FEE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"143\",\"Name\":\"SHI - SHIFTING AND RESTOW\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"204\",\"Name\":\"ERC - EQUIPMENT REPOSITIONING CHARGE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"142\",\"Name\":\"SEQ - SPECIAL EQUIPMENT SURCHARGES\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"183\",\"Name\":\"CSF - CARRIER SECURITY FEE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"209\",\"Name\":\"FEE - FEEDER FREIGHT\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"211\",\"Name\":\"FQS - FOOD QUALITY CONTAINER SURCHARGE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"224\",\"Name\":\"HVP - HIGH VALUE PREMIUM\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"241\",\"Name\":\"MVA - MOTOR VEHICLE ADDITIONAL\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"134\",\"Name\":\"REP - REPOSITIONING FEE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"216\",\"Name\":\"FTS - FLEXITANK SURCHARGE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"221\",\"Name\":\"HAZ - HAZARDOUS\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"161\",\"Name\":\"WAR - WAR RISK PREMIUM\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"163\",\"Name\":\"WHA - WHARFAGE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"234\",\"Name\":\"LRF - LATE EARLY RECEIVAL FEE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"140\",\"Name\":\"SCT - CONTAINER SECURITY CHARGE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"135\",\"Name\":\"RNT - ROUND TRIP\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"199\",\"Name\":\"EBS - EQUIPMENT IMBALANCE SURCHARGE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"225\",\"Name\":\"IBF - ICE BREAK FEE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"178\",\"Name\":\"COD - CHANGE OF DESTINATION FEE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"202\",\"Name\":\"EIS - EXTRA INSURANCE SURCHARGE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"231\",\"Name\":\"LIA - LINE INLAND ARBITRARIES\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"144\",\"Name\":\"SMA - SECURITY MANIFEST AMENDMENT FEE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"192\",\"Name\":\"DMG - DEMURRAGE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"243\",\"Name\":\"OFS - OVER FREIGHT SURCHARGE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"125\",\"Name\":\"PCS - PANAMA CANAL SURCHARGE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"139\",\"Name\":\"SCS - SUEZ CANAL SURCHARGE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"123\",\"Name\":\"OVW - OVERWEIGHT\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"136\",\"Name\":\"ROL - ROLLOVER FEE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"190\",\"Name\":\"DHF - DOCUMENTATION HANDLING FEE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"218\",\"Name\":\"GEN - GENSET SURCHARGE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"130\",\"Name\":\"PTA - PORT TAX\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"205\",\"Name\":\"ERF - INLAND REPOSITIONING FEE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"189\",\"Name\":\"CWS - CONTAINER WEIGHING SURCHARGE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"232\",\"Name\":\"LOF - LOGISTIC FEE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"214\",\"Name\":\"FRT - SEAFREIGHT\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"206\",\"Name\":\"ETR - EMPTY TANK RETURN\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"185\",\"Name\":\"CUC - CHASSIS USAGE CHARGE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"137\",\"Name\":\"RPT - RIVER PLATE FEE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"215\",\"Name\":\"FSF - FORWARDING SERVICE FEE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"237\",\"Name\":\"LWS - LOW WATER SURCHARGE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null}]},{\"Id\":\"BCAF\",\"Name\":\"BCAF\",\"HasChildren\":true,\"Icon\":\"folder\",\"Level\":\"2\",\"ChildNode\":[{\"Id\":\"235\",\"Name\":\"LSC - LOW SULPHUR FUEL CONTRIBUTION\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"229\",\"Name\":\"IRB - REBATE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"208\",\"Name\":\"FAS - FUEL ADDITIONAL SURCHARGE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"4002\",\"Name\":\"UAC - UNCLEARED \u0026 ABANDONNED CARGO RECOVERY\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null}]},{\"Id\":\"THC\",\"Name\":\"THC\",\"HasChildren\":true,\"Icon\":\"folder\",\"Level\":\"2\",\"ChildNode\":[{\"Id\":\"149\",\"Name\":\"STF - (UN)/STUFFING CHARGES\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"146\",\"Name\":\"SPS - ISPS - INTERN. SHIP AND PORT SECURITY CHARGE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"150\",\"Name\":\"STO - STORAGE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"226\",\"Name\":\"IHC - INDIAN STATUTORY SERVICE TAX\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"151\",\"Name\":\"STR - STRIPPING CONTAINER\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"213\",\"Name\":\"FRO - FREE OUT CHARGES\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"212\",\"Name\":\"FRI - FREE IN\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"200\",\"Name\":\"EHC - EQUIPMENT HANDOVER CHARGE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"219\",\"Name\":\"GIO - GATE IN OUT OR LIFT ON OFF\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"153\",\"Name\":\"THC - TERMINAL HANDLING CHARGE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"197\",\"Name\":\"DRT - DREDGING TAX\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null}]},{\"Id\":\"ONCA\",\"Name\":\"ONCA\",\"HasChildren\":true,\"Icon\":\"folder\",\"Level\":\"2\",\"ChildNode\":[{\"Id\":\"122\",\"Name\":\"OPS - ONCARRIAGE PEAK SURCHARGE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"156\",\"Name\":\"TRI - TRI-AXLE SURCHARGE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"196\",\"Name\":\"DRO - DROP OFF CHARGES\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"244\",\"Name\":\"ONC - ONCARRIAGE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null}]},{\"Id\":\"FAC1\",\"Name\":\"FAC1\",\"HasChildren\":true,\"Icon\":\"folder\",\"Level\":\"2\",\"ChildNode\":[{\"Id\":\"207\",\"Name\":\"FAC - FREIGHT FORWARDER COMMISSION\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null}]},{\"Id\":\"PRECA\",\"Name\":\"PRECA\",\"HasChildren\":true,\"Icon\":\"folder\",\"Level\":\"2\",\"ChildNode\":[{\"Id\":\"131\",\"Name\":\"PUP - PICK UP CHARGE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"210\",\"Name\":\"FES - FUEL ESCALATION SURCHARGE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"240\",\"Name\":\"MUL - MULTISTOP ADDITIONAL\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null},{\"Id\":\"126\",\"Name\":\"PRE - PRECARRIAGE\",\"HasChildren\":false,\"Icon\":\"folder\",\"Level\":\"3\",\"ChildNode\":null}]}]}]";
            var chargeCodes = JsonConvert.DeserializeObject<List<ChargeCodeTreeViewModel>>(json);
            return Json(chargeCodes, JsonRequestBehavior.AllowGet);
        }

        public ActionResult FormSubmit(List<City> cities)
        {
            bool isvalid = cities.Count == total;
            int invalidCount = total;
            var rc = CityDataSource.CityDataSource.GetCitys().Take(total).ToList();
            if (isvalid)
            {
                int i = 0;
                for (; i < total;)
                {

                    isvalid = cities[i].Name == rc[i].Name;
                    isvalid = cities[i].Code == rc[i].Code;
                    if (isvalid) { --invalidCount; }
                    i++;
                }
            }
            return View(cities);
        }

        string previouseMethod = "MethodWithSessionOne";

        public ActionResult SessionRaceTest()
        {
            return View();
        }


        public ActionResult CitySave([Bind(Prefix = "City")]CityDataSource.City city)
        {
            return View();
        }

        public ActionResult CityForm()
        {
            var city = new CityDataSource.City();
            city.ZipCodes.Add(new CityDataSource.CityZipCode());
            city.ZipCodes.Add(new CityDataSource.CityZipCode());
            city.ZipCodes.Add(new CityDataSource.CityZipCode());
            ViewData.TemplateInfo.HtmlFieldPrefix = "City";
            return View();
        }

        public ActionResult MethodWithSessionOne(int waitTime)
        {
            DateTime requestStart = DateTime.Now;
            Thread.Sleep(TimeSpan.FromMinutes(waitTime));
            DateTime requestEnd = DateTime.Now;
            // Session["SomeValue"] = "SomeValue";
            var result = new { current = "MethodWithSessionOne", prev = previouseMethod, requestStart = GetStringFromData(requestStart), requestEnd = GetStringFromData(requestEnd) };
            previouseMethod = "MethodWithSessionOne";
            return Json(result, JsonRequestBehavior.AllowGet);
        }


        public string GetStringFromData(DateTime date)
        {
            return date.ToString(format: "dd-MM-yyyy H:mm:ss");
        }

        public ActionResult MethodWithOutSessionOne(int waitTime)
        {
            DateTime requestStart = DateTime.Now;
            Thread.Sleep(TimeSpan.FromMinutes(waitTime));
            DateTime requestEnd = DateTime.Now;
            var result = new { current = "MethodWithOutSessionOne", prev = previouseMethod, requestStart = GetStringFromData(requestStart), requestEnd = GetStringFromData(requestEnd) };
            previouseMethod = "MethodWithSessionOne";
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public ActionResult MethodWithSessionTwo(int waitTime)
        {
            DateTime requestStart = DateTime.Now;
            Thread.Sleep(TimeSpan.FromMinutes(waitTime));
            DateTime requestEnd = DateTime.Now;
            //Session["SomeValue"] = "SomeValue";
            var result = new { current = "MethodWithSessionTwo", prev = previouseMethod, requestStart = GetStringFromData(requestStart), requestEnd = GetStringFromData(requestEnd) };
            previouseMethod = "MethodWithSessionTwo";
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public ActionResult MethodWithOutSessionTwo(int waitTime)
        {
            DateTime requestStart = DateTime.Now;
            Thread.Sleep(TimeSpan.FromMinutes(waitTime));
            DateTime requestEnd = DateTime.Now;
            var result = new { current = "MethodWithOutSessionTwo", prev = previouseMethod, requestStart = GetStringFromData(requestStart), requestEnd = GetStringFromData(requestEnd) };
            previouseMethod = "MethodWithOutSessionTwo";
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public ActionResult CustomComboBoxWithDefaultValue()
        {
            return View();
        }

        public ActionResult CustomComboBoxWithValueFieldAsString()
        {
            return View(CityDataSource.CityDataSource.GetCitys().Take(1).FirstOrDefault());
        }

        public ActionResult ComboBoxWithProperty()
        {
            return View();
        }

        [Callback]
        public ActionResult GetStatesWithPagination(CallbackRequestData request)
        {
            IEnumerable<State> states = CityDataSource.CityDataSource.GetCitys().Where(p => !string.IsNullOrEmpty(p.StateInfo.Name)).Select(p => p.StateInfo);
            return Json(new { Data = states.Skip(request.Page * request.PageSize).Take(request.PageSize), Total = states.Count() }, JsonRequestBehavior.AllowGet);
        }

        [Callback]
        public ActionResult GetStatesWithPaginationCode(CallbackRequestData request)
        {
            IEnumerable<string> states = CityDataSource.CityDataSource.GetCitys().Where(p => !string.IsNullOrEmpty(p.StateInfo.Name)).Select(p => p.StateInfo.Code);
            return Json(states.ToDataSourceResult(request));
        }

        public ActionResult GetFiveCitys()
        {
            var cities = new List<City>();
            cities = CityDataSource.CityDataSource.GetCitys().Where(c => !string.IsNullOrEmpty(c.Name)).Take(5).ToList();
            return Json(cities, JsonRequestBehavior.AllowGet);
        }

        public ActionResult SelectAll()
        {
            return View();
        }

        public ActionResult Timeline()
        {
            return View();
        }

        public ActionResult SendJson(List<City> city)
        {
            return Json(city);
        }

        public ActionResult MVVMRadio()
        {
            return View();
        }
    }
}