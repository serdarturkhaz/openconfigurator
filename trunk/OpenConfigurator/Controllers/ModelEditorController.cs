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


        //Methods for default Entities
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
        [Authorize]
        public JsonNetResult NewDefaultGroupRelation()
        {
            //Default return variable
            JsonNetResult result = new JsonNetResult() { Data = null };

            //Get a new default Feature
            GroupRelationService _groupRelationService = new GroupRelationService(SessionData.LoggedInUser.ID);
            BLL.BusinessObjects.GroupRelation newGroupRelation = (BLL.BusinessObjects.GroupRelation)_groupRelationService.CreateDefault();
            result.Data = newGroupRelation;

            //
            return result;
        }
        [Authorize]
        public JsonNetResult NewDefaultAttribute()
        {
            //Default return variable
            JsonNetResult result = new JsonNetResult() { Data = null };

            //Get a new default Attribute
            FeatureService _featureService = new FeatureService(SessionData.LoggedInUser.ID);
            BLL.BusinessObjects.Attribute newAttribute = (BLL.BusinessObjects.Attribute)_featureService.CreateDefaultAttribute();
            result.Data = newAttribute;

            //
            return result;
        }
        [Authorize]
        public JsonNetResult NewDefaultCompositionRule()
        {
            //Default return variable
            JsonNetResult result = new JsonNetResult() { Data = null };

            //Get a new default CompositionRule
            CompositionRuleService _compositionRuleService = new CompositionRuleService(SessionData.LoggedInUser.ID);
            BLL.BusinessObjects.CompositionRule newCompositionRule = (BLL.BusinessObjects.CompositionRule)_compositionRuleService.CreateDefault();
            result.Data = newCompositionRule;

            //
            return result;
        }
        [Authorize]
        public JsonNetResult NewDefaultCustomRule()
        {
            //Default return variable
            JsonNetResult result = new JsonNetResult() { Data = null };

            //Get a new default CustomRule
            CustomRuleService _customRuleService = new CustomRuleService(SessionData.LoggedInUser.ID);
            BLL.BusinessObjects.CustomRule newCustomRule = (BLL.BusinessObjects.CustomRule)_customRuleService.CreateDefault();
            result.Data = newCustomRule;

            //
            return result;
        }
    
        [Authorize]
        public JsonNetResult GetRelationTypes()
        {
            //Default return variable
            JsonNetResult result = new JsonNetResult() { Data = null };

            //Get a dictionary of standard RelationTypes
            RelationService _relationService = new RelationService(SessionData.LoggedInUser.ID);
            Dictionary<int, string> relationTypes = _relationService.GetRelationTypes();
            result.Data = relationTypes;

            //
            return result;
        }
    }
}
