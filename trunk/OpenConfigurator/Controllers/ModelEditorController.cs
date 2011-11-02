using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BLL.Services;
using PresentationLayer.Common;

namespace PresentationLayer.Controllers
{
    public class ModelEditorController : Controller
    {
        [Authorize]
        public ActionResult ModelEditor(int modelId)
        {
            //Load the Model into the Session
            ModelService _modelService = new ModelService(SessionData.LoggedInUser.ID);
            BLL.BusinessObjects.Model model = _modelService.GetByID(modelId);
            SessionData.SessionModels[modelId] = model;

            //Load simple fields into ViewBag
            ViewBag.ModelName = model.Name;
            ViewBag.ModelId = model.ID;

            return View();
        }

        [Authorize]
        public void SaveModel(int modelId, string name)
        {
            //Set the Name
            ModelService _modelService = new ModelService(SessionData.LoggedInUser.ID);
            SessionData.SessionModels[modelId].Name = name;
            _modelService.Update(SessionData.SessionModels[modelId]);
        }
    }
}
