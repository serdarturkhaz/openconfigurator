using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PresentationLayer.Common;
using Newtonsoft.Json.Linq;
using BLL.Services;

namespace PresentationLayer.Controllers
{
    public class ConfigurationsController : Controller
    {
        [Authorize]
        public ActionResult Configurations()
        {
            return View();
        }

        [Authorize]
        public JsonNetResult GetConfigurations()
        {
            //Default return variable
            JsonNetResult result = new JsonNetResult() { Data = null };

            //Retreive Models belonging to the current User
            ConfigurationService _configurationsService = new ConfigurationService(SessionData.LoggedInUser.ID);
            List<BLL.BusinessObjects.Configuration> configurations = _configurationsService.GetByUserID(SessionData.LoggedInUser.ID);
            result.Data = configurations;

            //
            return result;
        }


        [Authorize]
        public void DeleteConfiguration(int ID)
        {
            //Delete the Model
            ConfigurationService _configurationsService = new ConfigurationService(SessionData.LoggedInUser.ID);
            _configurationsService.Delete(ID);
        }
    }
}
