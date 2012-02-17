using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BLL.Services;
using PresentationLayer.Common;
using Newtonsoft.Json.Linq;
using BLL.SolverEngines;

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
        public JsonNetResult LoadData(int configurationID)
        {
            //Data return wrapper
            object[] innerJObj = new object[2];
            JsonNetResult result = new JsonNetResult() { Data = innerJObj };

            //Load Configuration
            ConfigurationService _configurationService = new ConfigurationService(SessionData.LoggedInUser.ID);
            BLL.BusinessObjects.Configuration configuration = _configurationService.GetByID(configurationID);
            innerJObj[0] = configuration;

            //Load Model
            ModelService _modelService = new ModelService(SessionData.LoggedInUser.ID);
            BLL.BusinessObjects.Model model = _modelService.GetByID(configuration.ModelID);
            innerJObj[1] = model;

            //Setup FeatureSelections----------------------------------------------------------------------------------------------------------------------------------
            //Create FeatureSelections for the first time
            if (configuration.FeatureSelections.Count == 0)
            {
                //Create one instance for each Feature in the Model
                foreach (BLL.BusinessObjects.Feature feature in model.Features)
                {
                    BLL.BusinessObjects.FeatureSelection newFeatureSelection = BLL.BusinessObjects.FeatureSelection.CreateDefault();
                    newFeatureSelection.FeatureID = feature.ID;
                    configuration.FeatureSelections.Add(newFeatureSelection);

                    //Create default AttributeValues
                    foreach (BLL.BusinessObjects.Attribute attribute in feature.Attributes)
                    {
                        BLL.BusinessObjects.AttributeValue attrValue = BLL.BusinessObjects.AttributeValue.CreateDefault();
                        attrValue.Value = GetDefaultAttrVal(attribute.AttributeDataType);
                        attrValue.AttributeID = attribute.ID;
                        newFeatureSelection.AttributeValues.Add(attrValue);
                    }
                }

                //Toggle the root Feature and get the initial Configuration state of all the other Features
                InitRootSelection(configuration.ID, model, configuration.FeatureSelections, model.Features[0].ID, BLL.BusinessObjects.FeatureSelectionStates.Selected);
            }
            //Create new FeatureSelections ONLY for newly created Features
            else if (configuration.FeatureSelections.Count < model.Features.Count)
            {
                //Create one instance for each Feature that is missing a FeatureSelection
                foreach (BLL.BusinessObjects.Feature feature in model.Features)
                {
                    if (configuration.FeatureSelections.FirstOrDefault(k => k.FeatureID == feature.ID) == null) //If the Feature has no corresponding FeatureSelection
                    {
                        BLL.BusinessObjects.FeatureSelection newFeatureSelection = BLL.BusinessObjects.FeatureSelection.CreateDefault();
                        newFeatureSelection.FeatureID = feature.ID;
                        configuration.FeatureSelections.Add(newFeatureSelection);

                        //Create default AttributeValues
                        foreach (BLL.BusinessObjects.Attribute attribute in feature.Attributes)
                        {
                            BLL.BusinessObjects.AttributeValue attrValue = BLL.BusinessObjects.AttributeValue.CreateDefault();
                            attrValue.Value = GetDefaultAttrVal(attribute.AttributeDataType);
                            attrValue.AttributeID = attribute.ID;
                            newFeatureSelection.AttributeValues.Add(attrValue);
                        }
                    }
                }
            }
            //---------------------------------------------------------------------------------------------------------------------------------------------------------
            
            return result;
        }
        [Authorize]
        public JsonNetResult SaveConfiguration(int configurationID, string configurationName, string featureSelectionsString)
        {
            //Data return wrapper
            object[] innerJObj = new object[2];
            JsonNetResult result = new JsonNetResult() { Data = innerJObj };

            //Create services
            ConfigurationService _configurationService = new ConfigurationService(SessionData.LoggedInUser.ID);
            FeatureSelectionService _featureSelectionService = new FeatureSelectionService(SessionData.LoggedInUser.ID);

            //Save changes to Model
            _configurationService.UpdateName(configurationID, configurationName);

            //Changes to FeatureSelections***********************************************************************************************************************************************
            Dictionary<int, BLL.BusinessObjects.FeatureSelection> featureSelections = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<int, BLL.BusinessObjects.FeatureSelection>>(featureSelectionsString);
            foreach (int guid in featureSelections.Keys)
            {
                BLL.BusinessObjects.FeatureSelection featureSelection = featureSelections[guid];

                //Add
                if (featureSelection.ToBeDeleted == false && featureSelection.ID == 0)
                {
                    ((DAL.DataEntities.FeatureSelection)featureSelection.InnerEntity).ConfigurationID = configurationID;
                    _featureSelectionService.Add(featureSelection);
                }
                //Update
                else if (featureSelection.ToBeDeleted == false && featureSelection.ID != 0)
                {
                    ((DAL.DataEntities.FeatureSelection)featureSelection.InnerEntity).ConfigurationID = configurationID;
                    _featureSelectionService.Update(featureSelection);
                }
            }
            innerJObj[0] = featureSelections;
            //***************************************************************************************************************************************************************************

            //
            return result;
        }

        [Authorize]
        public JsonNetResult ToggleFeature(int configurationID, int FeatureID, int newState)
        {
            //Data return wrapper
            JsonNetResult result = new JsonNetResult();

            //Setup Solver and Context
            ISolverContext context = context = SessionData.SolverContexts[configurationID];
            List<BLL.BusinessObjects.FeatureSelection> featureSelections = SessionData.FeatureSelections[configurationID];
            SolverService solverService = new SolverService();

            //Get the implicit selections for the other features
            BLL.BusinessObjects.FeatureSelectionStates selectionState = (BLL.BusinessObjects.FeatureSelectionStates)newState;
            bool selectionValid = solverService.UserToggleSelection(context, ref featureSelections, FeatureID, selectionState);

            string testRule = "#Root.TotalPrice=25";
            solverService.ExecuteCustomRule(context, testRule);

            //Return
            if (selectionValid)
            {
                result.Data = featureSelections.ToDictionary(g => g.FeatureID, k => k);
            }
            else
            {
                result.Data = selectionValid;
            }

            return result;
        }
        [Authorize]
        public void ClearSessionContext(int configurationID)
        {
            SessionData.SolverContexts.Remove(configurationID);
            SessionData.FeatureSelections.Remove(configurationID);
        }

        //Private methods
        private void InitRootSelection(int configurationID, BLL.BusinessObjects.Model model, List<BLL.BusinessObjects.FeatureSelection> featureSelections, int FeatureID, BLL.BusinessObjects.FeatureSelectionStates newState)
        {
            //Setup Solver and Context
            ISolverContext context = null;
            SolverService solverService = new SolverService();
            context = solverService.CreateNewContext(model);
            SessionData.SolverContexts[configurationID] = context;
            SessionData.FeatureSelections[configurationID] = featureSelections;

            //Get the implicit selections for the other features
            bool selectionValid = solverService.UserToggleSelection(context, ref featureSelections, FeatureID, newState);
        }
        private string GetDefaultAttrVal(BLL.BusinessObjects.AttributeDataTypes type)
        {
            string returnVal = "";
            switch (type)
            {
                case BLL.BusinessObjects.AttributeDataTypes.Boolean:
                    returnVal = "False";
                    break;
                case BLL.BusinessObjects.AttributeDataTypes.Integer:
                    returnVal = "0";
                    break;
                case BLL.BusinessObjects.AttributeDataTypes.String:
                    returnVal = "";
                    break;
            }

            return returnVal;
        }

        //Methods for default Entities
        [Authorize]
        public JsonNetResult NewDefaultFeatureSelection()
        {
            //Default return variable
            JsonNetResult result = new JsonNetResult() { Data = null };

            //Get a new default FeatureSelection
            FeatureSelectionService _featureSelectionService = new FeatureSelectionService(SessionData.LoggedInUser.ID);
            BLL.BusinessObjects.FeatureSelection BLLEntity = (BLL.BusinessObjects.FeatureSelection)_featureSelectionService.CreateDefault();
            result.Data = BLLEntity;

            //
            return result;
        }
        [Authorize]
        public JsonNetResult NewDefaultAttributeValue()
        {
            //Default return variable
            JsonNetResult result = new JsonNetResult() { Data = null };

            //Get a new default AttributeValue
            FeatureSelectionService _featureSelectionService = new FeatureSelectionService(SessionData.LoggedInUser.ID);
            BLL.BusinessObjects.AttributeValue BLLEntity = (BLL.BusinessObjects.AttributeValue)_featureSelectionService.CreateDefaultAttributeValue();
            result.Data = BLLEntity;

            //
            return result;
        }

    }
}
