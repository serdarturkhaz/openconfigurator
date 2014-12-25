using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Web.Http;
using BLL;
using BLL.BLOs;

namespace ModellingTool.Controllers
{
    public class GlobalAPIController : ApiController
    {
        [HttpGet]
        public iBLO CreateDefaultBLO(string bloName)
        {
            // Create a new BLO
            return GenericBLOFactory.GetInstance().CreateBLOInstance(bloName);
        }
    }
}
