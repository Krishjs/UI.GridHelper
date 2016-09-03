using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace UI.Helper.Models
{
    [Serializable]
    public class ChargeCodeTreeViewModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public bool HasChildren { get; set; }
        public string Icon { get; set; }
        public string Level { get; set; }
        public List<ChargeCodeTreeViewModel> ChildNode { get; set; }
    }
}