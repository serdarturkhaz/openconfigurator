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


        [Authorize]
        public JsonNetResult NewDefaultFeature()
        {
            //Default return variable
            JsonNetResult result = new JsonNetResult() { Data = null };

            //Get a new default Feature
            FeatureService _featureService = new FeatureService(SessionData.LoggedInUser.ID);
            BLL.BusinessObjects.Feature newFeature = (BLL.BusinessObjects.Feature)_featureService.CreateDefault();
            result.Data = newFeature;

            //
            return result;
        }

        [Authorize]
        public JsonNetResult NewDefaultRelation()
        {
            //Default return variable
            JsonNetResult result = new JsonNetResult() { Data = null };

            //Get a new default Feature
            RelationService _relationService = new RelationService(SessionData.LoggedInUser.ID);
            BLL.BusinessObjects.Relation newRelation = (BLL.BusinessObjects.Relation)_relationService.CreateDefault();
            result.Data = newRelation;

            //
            return result;
        }
    }
}
