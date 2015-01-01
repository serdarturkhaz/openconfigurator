using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Web;
using System.Web.Hosting;
using System.Web.Http;
using BLL;
using BLL.BLOs;
using ModellingTool.Common;

namespace ModellingTool.Controllers
{
    public class GlobalAPIController : ApiController
    {
        [HttpGet]
        public iBLO CreateDefaultBLO(string bloType)
        {
            // Create a new BLO
            return GenericBLOFactory.GetInstance().CreateBLOInstance(bloType);
        }


        [HttpPost]
        public FeatureModel SaveChanges( FeatureModel featureModel)
        {
            string x = "";
            return null;
        }
    }
}
