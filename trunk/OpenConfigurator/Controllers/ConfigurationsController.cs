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
            ModelService _modelService = new ModelService(SessionData.LoggedInUser.ID);
            List<BLL.BusinessObjects.Model> models = _modelService.GetByUserID(SessionData.LoggedInUser.ID);
            result.Data = models;

            //
            return result;
        }



        [Authorize]
        public void DeleteConfiguration(int ID)
        {
            //Delete the Model
            ModelService modelService = new ModelService(SessionData.LoggedInUser.ID);
            modelService.Delete(ID);
        }
    }
}
