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
    public class ModelEditorController : Controller
    {
        [Authorize]
        public ActionResult ModelEditor(int modelID)
        {
            //Load the ModelID
            ViewBag.ModelId = modelID;

            return View();
        }
        [Authorize]
        public JsonNetResult LoadData(int modelID)
        {   
            //Data return wrapper
            JsonNetResult result = new JsonNetResult();

            //Model
            ModelService _modelService = new ModelService(SessionData.LoggedInUser.ID);
            BLL.BusinessObjects.Model model = _modelService.GetByID(modelID);
            result.Data = model;

            return result;
        }
        [Authorize]
        public JsonNetResult SaveData(int modelID, string modelName, string featuresString, string relationsString, string relationsAdjFeaturesString, string groupRelationsString,
            string groupRelationsAdjFeaturesString, string compositionRulesString, string compositionRulesAdjFeaturesString, string customRulesString)
        {
            //Data return wrapper
            object[] innerJObj = new object[5];
            JsonNetResult result = new JsonNetResult() { Data = innerJObj };

            //Create services
            ModelService _modelService = new ModelService(SessionData.LoggedInUser.ID);
            FeatureService _featureService = new FeatureService(SessionData.LoggedInUser.ID);
            RelationService _relationService = new RelationService(SessionData.LoggedInUser.ID);
            GroupRelationService _groupRelationService = new GroupRelationService(SessionData.LoggedInUser.ID);
            CompositionRuleService _compositionRuleService = new CompositionRuleService(SessionData.LoggedInUser.ID);
            CustomRuleService _customRuleService = new CustomRuleService(SessionData.LoggedInUser.ID);

            //Save changes to Model
            _modelService.UpdateName(modelID, modelName);


            //Changes to Features********************************************************************************************************************************************************
            Dictionary<int, BLL.BusinessObjects.Feature> features = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<int, BLL.BusinessObjects.Feature>>(featuresString);
            foreach (int guid in features.Keys)
            {
                BLL.BusinessObjects.Feature feature = features[guid];
                
                //Delete 
                if (feature.ToBeDeleted == true && feature.ID != 0)
                {
                    _featureService.Delete(feature);
                }
                //Add
                else if (feature.ToBeDeleted == false && feature.ID == 0)
                {
                    ((DAL.DataEntities.Feature)feature.InnerEntity).ModelID = modelID;
                    _featureService.Add(feature);
                }
                //Update
                else if (feature.ToBeDeleted == false && feature.ID != 0)
                {
                    ((DAL.DataEntities.Feature)feature.InnerEntity).ModelID = modelID;
                    _featureService.Update(feature);
                }
            }
            innerJObj[0] = features;
            //***************************************************************************************************************************************************************************


            //Changes to Relations*******************************************************************************************************************************************************
            Dictionary<int, BLL.BusinessObjects.Relation> relations = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<int, BLL.BusinessObjects.Relation>>(relationsString);
            Dictionary<int, JObject> relationsAdjFeatures = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<int, JObject>>(relationsAdjFeaturesString);
            foreach (int guid in relations.Keys)
            {
                BLL.BusinessObjects.Relation relation = relations[guid];
                JObject relAdj = relationsAdjFeatures[guid];

                //Delete 
                if (relation.ToBeDeleted == true && relation.ID != 0)
                {
                    _relationService.Delete(relation);
                }
                //Add
                else if (relation.ToBeDeleted == false && relation.ID == 0)
                {
                    ((DAL.DataEntities.Relation)relation.InnerEntity).ModelID = modelID;
                    int childFeatureGUID = (int)relAdj.SelectToken("childFeatureGUID");
                    int parentFeatureGUID = (int)relAdj.SelectToken("parentFeatureGUID");
                    ((DAL.DataEntities.Relation)relation.InnerEntity).ChildFeatureID = features[childFeatureGUID].ID;
                    ((DAL.DataEntities.Relation)relation.InnerEntity).ParentFeatureID = features[parentFeatureGUID].ID;

                    _relationService.Add(relation);
                }
                //Update
                else if (relation.ToBeDeleted == false && relation.ID != 0)
                {
                    ((DAL.DataEntities.Relation)relation.InnerEntity).ModelID = modelID;
                    _relationService.Update(relation);
                }
            }
            //var filteredRelations = relations.Where(entry => entry.Value.ToBeDeleted == false).ToDictionary(entry => entry.Key, entry => entry.Value);
            innerJObj[1] = relations;
            //***************************************************************************************************************************************************************************

            //Changes to GroupRelations**************************************************************************************************************************************************
            Dictionary<int, BLL.BusinessObjects.GroupRelation> groupRelations = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<int, BLL.BusinessObjects.GroupRelation>>(groupRelationsString);
            Dictionary<int, JObject> groupRelationsAdjFeatures = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<int, JObject>>(groupRelationsAdjFeaturesString);
            foreach (int guid in groupRelations.Keys)
            {
                BLL.BusinessObjects.GroupRelation groupRelation = groupRelations[guid];
                JObject relAdj = groupRelationsAdjFeatures[guid];
                
                //Delete 
                if (groupRelation.ToBeDeleted == true && groupRelation.ID != 0)
                {
                    _groupRelationService.Delete(groupRelation);
                }
                //Add
                else if (groupRelation.ToBeDeleted == false && groupRelation.ID == 0)
                {
                    ((DAL.DataEntities.GroupRelation)groupRelation.InnerEntity).ModelID = modelID;
                    int parentFeatureGUID = (int)relAdj["parentFeatureGUID"];
                    List<int> childFeatureGUIDs = ((JArray)relAdj["childFeatureGUIDs"]).Values<int>().ToList<int>();
                    List<int> childFeatureIDs = childFeatureGUIDs.Select(entry => features[entry].ID).ToList<int>();

                    groupRelation.ParentFeatureID = features[parentFeatureGUID].ID;
                    groupRelation.ChildFeatureIDs = childFeatureIDs;

                    _groupRelationService.Add(groupRelation);
                }
                //Update
                else if (groupRelation.ToBeDeleted == false && groupRelation.ID != 0)
                {
                    ((DAL.DataEntities.GroupRelation)groupRelation.InnerEntity).ModelID = modelID;
                    _groupRelationService.Update(groupRelation);
                }
            }
            innerJObj[2] = groupRelations;
            //***************************************************************************************************************************************************************************

            //Changes to CompositionRules************************************************************************************************************************************************
            Dictionary<int, BLL.BusinessObjects.CompositionRule> compositionRules = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<int, BLL.BusinessObjects.CompositionRule>>(compositionRulesString);
            Dictionary<int, JObject> compositionRulesAdjFeatures = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<int, JObject>>(compositionRulesAdjFeaturesString);
            foreach (int guid in compositionRules.Keys)
            {
                BLL.BusinessObjects.CompositionRule compositionRule = compositionRules[guid];
                JObject relAdj = compositionRulesAdjFeatures[guid];

                //Delete 
                if (compositionRule.ToBeDeleted == true && compositionRule.ID != 0)
                {
                    _compositionRuleService.Delete(compositionRule);
                }
                //Add
                else if (compositionRule.ToBeDeleted == false && compositionRule.ID == 0)
                {
                    ((DAL.DataEntities.CompositionRule)compositionRule.InnerEntity).ModelID = modelID;
                    int firstFeatureGUID = (int)relAdj.SelectToken("firstFeatureGUID");
                    int secondFeatureGUID = (int)relAdj.SelectToken("secondFeatureGUID");
                    ((DAL.DataEntities.CompositionRule)compositionRule.InnerEntity).FirstFeatureID = features[firstFeatureGUID].ID;
                    ((DAL.DataEntities.CompositionRule)compositionRule.InnerEntity).SecondFeatureID = features[secondFeatureGUID].ID;

                    _compositionRuleService.Add(compositionRule);
                }
                //Update
                else if (compositionRule.ToBeDeleted == false && compositionRule.ID != 0)
                {
                    ((DAL.DataEntities.CompositionRule)compositionRule.InnerEntity).ModelID = modelID;
                    _compositionRuleService.Update(compositionRule);
                }
            }
            innerJObj[3] = compositionRules;
            //******************************************************************************************************************************************************************************

            //Changes to CustomRules********************************************************************************************************************************************************
            Dictionary<int, BLL.BusinessObjects.CustomRule> customRules = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<int, BLL.BusinessObjects.CustomRule>>(customRulesString);
            foreach (int guid in customRules.Keys)
            {
                BLL.BusinessObjects.CustomRule customRule = customRules[guid];

                //Delete 
                if (customRule.ToBeDeleted == true && customRule.ID != 0)
                {
                    _customRuleService.Delete(customRule);
                }
                //Add
                else if (customRule.ToBeDeleted == false && customRule.ID == 0)
                {
                    ((DAL.DataEntities.CustomRule)customRule.InnerEntity).ModelID = modelID;
                    _customRuleService.Add(customRule);
                }
                //Update
                else if (customRule.ToBeDeleted == false && customRule.ID != 0)
                {
                    ((DAL.DataEntities.CustomRule)customRule.InnerEntity).ModelID = modelID;
                    _customRuleService.Update(customRule);
                }
            }
            innerJObj[4] = customRules;
            //***************************************************************************************************************************************************************************

            //
            return result;
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
