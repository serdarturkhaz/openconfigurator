using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Web.Http;
using BLL.BLOs;

namespace ModellingTool.Controllers
{
    public class GlobalAPIController : ApiController
    {
        [HttpGet]
        public OpenConfigurator.Core.BLOs.iBLO CreateDefaultBLO(string bloName)
        {
            // Create a new default BLO
            Assembly assembly = Assembly.GetAssembly(typeof(Model));
            Type type = assembly.GetType("BLL.BLOs." + bloName);
            OpenConfigurator.Core.BLOs.iBLO defaultBLO = (OpenConfigurator.Core.BLOs.iBLO)type.GetMethod("CreateDefault", BindingFlags.Static | BindingFlags.NonPublic).Invoke(null, null);

            //
            return defaultBLO;
        }
    }
}
