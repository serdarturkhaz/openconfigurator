using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BLL.Services;
using PresentationLayer.Common;
using Newtonsoft.Json.Linq;

namespace PresentationLayer.Controllers
{
    public class ConfigurationEditorController : Controller
    {
        [Authorize]
        public ActionResult ConfigurationEditor(int configurationID)
        {
            //Load the ConfigurationID
            ViewBag.ConfigurationID = configurationID;

            return View();
        }

        [Authorize]
        public JsonNetResult LoadModel(int modelID)
        {
            //Data return wrapper
            JsonNetResult result = new JsonNetResult();

            //Model
            //ModelService _modelService = new ModelService(SessionData.LoggedInUser.ID);
            //BLL.BusinessObjects.Model model = _modelService.GetByID(modelID);
            //result.Data = model;

            return result;
        }

        [Authorize]
        public JsonNetResult LoadConfiguration(int configurationID)
        {   
            //Data return wrapper
            JsonNetResult result = new JsonNetResult();

            ConfigurationService _configurationService = new ConfigurationService(SessionData.LoggedInUser.ID);
            BLL.BusinessObjects.Configuration configuration = _configurationService.GetByID(configurationID);
            result.Data = configuration;

            return result;
        }
    }
}
