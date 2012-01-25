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
            ModelService _modelService = new ModelService(SessionData.LoggedInUser.ID);
            List<BLL.BusinessObjects.Model> models = _modelService.GetByUserID(SessionData.LoggedInUser.ID);
            result.Data = models;

            //Z3
            SolverService ss = new SolverService(1);
            ss.TestMethod();

            //
            return result;
        }

        [Authorize]
        public JsonNetResult AddNewModel()
        {
            //Default return variable
            JsonNetResult result = new JsonNetResult() { Data = null };

            //Add a new Model
            ModelService modelService = new ModelService(SessionData.LoggedInUser.ID);
            BLL.BusinessObjects.Model newModel = (BLL.BusinessObjects.Model) modelService.CreateDefault();
            modelService.Add(newModel);

            //
            result.Data = newModel;
            return result;
        }

        [Authorize]
        public void DeleteModel(int ID)
        {
            //Delete the Model
            ModelService modelService = new ModelService(SessionData.LoggedInUser.ID);
            modelService.Delete(ID);
        }

        [Authorize]
        public JsonNetResult AddNewConfiguration(int modelID)
        {
            //Default return variable
            JsonNetResult result = new JsonNetResult() { Data = null };

            //Add a new Configuration
            ConfigurationService configurationService = new ConfigurationService(SessionData.LoggedInUser.ID);
            BLL.BusinessObjects.Configuration newConfiguration = (BLL.BusinessObjects.Configuration)configurationService.CreateDefault(modelID);
            configurationService.Add(newConfiguration);

            //Return its ID
            result.Data = newConfiguration.ID;
            return result;
        }
    }
}
