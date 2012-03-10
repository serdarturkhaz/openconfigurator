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
        //Controller methods
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

            //Setup the ConfigurationSession
            ConfiguratorSession newSession = new ConfiguratorSession(model, configuration, SolverService.CreateNewContext(model));
            SetupFeatureSelections(ref newSession);
            SessionData.ConfiguratorSessions[configurationID] = newSession;

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

            //Get the ConfiguratorSession
            ConfiguratorSession configSession = SessionData.ConfiguratorSessions[configurationID];
            SolverService solverService = new SolverService();

            //Get the implicit selections for the other features
            BLL.BusinessObjects.FeatureSelectionStates selectionState = (BLL.BusinessObjects.FeatureSelectionStates)newState;
            bool selectionValid = solverService.UserToggleSelection(ref configSession, FeatureID, selectionState);

            //string testRule = "#HIS.Total_Price=250";
            //solverService.ExecuteCustomRule(ref configSession, testRule);

            //Return
            if (selectionValid)
            {
                result.Data = configSession.Configuration.FeatureSelections.ToDictionary(g => g.FeatureID, k => k);
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
            SessionData.ConfiguratorSessions.Remove(configurationID);
        }

        //Private methods
        private void SetupFeatureSelections(ref ConfiguratorSession configSession)
        {
            //Setup FeatureSelections----------------------------------------------------------------------------------------------------------------------------------
            //Create FeatureSelections for the first time
            if (configSession.Configuration.FeatureSelections.Count == 0)
            {
                //Create one instance for each Feature in the Model
                foreach (BLL.BusinessObjects.Feature feature in configSession.Model.Features)
                {
                    BLL.BusinessObjects.FeatureSelection newFeatureSelection = BLL.BusinessObjects.FeatureSelection.CreateDefault();
                    newFeatureSelection.FeatureID = feature.ID;
                    configSession.Configuration.FeatureSelections.Add(newFeatureSelection);

                    //Create default AttributeValues
                    foreach (BLL.BusinessObjects.Attribute attribute in feature.Attributes)
                    {
                        BLL.BusinessObjects.AttributeValue attrValue = BLL.BusinessObjects.AttributeValue.CreateDefault();
                        attrValue.Value = GetDefaultAttrVal(attribute.AttributeDataType);
                        attrValue.AttributeID = attribute.ID;
                        if (attribute.AttributeType == BLL.BusinessObjects.AttributeTypes.Constant)
                        {
                            attrValue.Value = attribute.ConstantValue;
                        }
                        newFeatureSelection.AttributeValues.Add(attrValue);
                    }
                }

                //Toggle the root Feature and get the initial Configuration state of all the other Features
                GetInitialFeedback(ref configSession);
            }
            //Create new FeatureSelections ONLY for newly created Features
            else if (configSession.Configuration.FeatureSelections.Count < configSession.Model.Features.Count)
            {
                //Create one instance for each Feature that is missing a FeatureSelection
                foreach (BLL.BusinessObjects.Feature feature in configSession.Model.Features)
                {
                    if (configSession.Configuration.FeatureSelections.FirstOrDefault(k => k.FeatureID == feature.ID) == null) //If the Feature has no corresponding FeatureSelection
                    {
                        BLL.BusinessObjects.FeatureSelection newFeatureSelection = BLL.BusinessObjects.FeatureSelection.CreateDefault();
                        newFeatureSelection.FeatureID = feature.ID;
                        configSession.Configuration.FeatureSelections.Add(newFeatureSelection);

                        //Create default AttributeValues
                        foreach (BLL.BusinessObjects.Attribute attribute in feature.Attributes)
                        {
                            BLL.BusinessObjects.AttributeValue attrValue = BLL.BusinessObjects.AttributeValue.CreateDefault();
                            attrValue.Value = GetDefaultAttrVal(attribute.AttributeDataType);
                            attrValue.AttributeID = attribute.ID;
                            if (attribute.AttributeType == BLL.BusinessObjects.AttributeTypes.Constant)
                            {
                                attrValue.Value = attribute.ConstantValue;
                            }
                            newFeatureSelection.AttributeValues.Add(attrValue);
                        }
                    }
                }
            }
            //---------------------------------------------------------------------------------------------------------------------------------------------------------
        }
        private void GetInitialFeedback(ref ConfiguratorSession configSession)
        {
            //Set the root feature to selected and update the other FeatureSelections
            SolverService solverService = new SolverService();
            bool selectionValid = solverService.UserToggleSelection(ref configSession, configSession.Model.Features[0].ID, BLL.BusinessObjects.FeatureSelectionStates.Selected);
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
