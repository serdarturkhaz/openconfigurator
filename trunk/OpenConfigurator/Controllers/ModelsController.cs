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
    public class ModelsController : Controller
    {
        [Authorize]
        public ActionResult Models()
        {
            return View();
        }

        [Authorize]
        public JsonNetResult GetModels()
        {
            //Default return variable
            JsonNetResult result = new JsonNetResult() { Data = null };

            //Retreive Models belonging to the current User
            ModelService _modelService = new ModelService();
            IList<BLL.BusinessObjects.Model> models = _modelService.GetByUserID(SessionData.LoggedInUser.ID);
            result.Data = models;

            //
            return result;
        }
    }
}
