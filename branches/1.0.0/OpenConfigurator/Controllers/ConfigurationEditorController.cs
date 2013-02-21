// Developed by OpenConfigurator Core Team
// 
// Distributed under the MIT license
// ===========================================================
// Copyright (c) 2012 - Radu Mitache
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), 
// to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, 
// publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR 
// OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR 
// OTHER DEALINGS IN THE SOFTWARE.
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BLL.Services;
using PresentationLayer.Common;
using Newtonsoft.Json.Linq;
using BLL.SolverEngines;
using BLL.BusinessObjects;

namespace PresentationLayer.Controllers
{
    public class ConfigurationEditorController : Controller
    {
        
        //Controller methods
        [Authorize]
        public ActionResult ConfigurationEditor(int configurationID)
        {
            //Store variables
            ViewBag.ConfigurationID = configurationID;

            return View();
        }
        [Authorize]
        public JsonNetResult LoadData(int configurationID)
        {
            //Data return controlTagElem
            object[] innerJObj = new object[3];
            JsonNetResult result = new JsonNetResult() { Data = innerJObj };

            //Load Configuration
            ConfigurationService _configurationService = new ConfigurationService(SessionData.LoggedInUser.ID);
            BLL.BusinessObjects.Configuration configuration = _configurationService.GetByID(configurationID);
            innerJObj[0] = configuration;

            //Load Model
            ModelService _modelService = new ModelService(SessionData.LoggedInUser.ID);
            BLL.BusinessObjects.Model model = _modelService.GetByID(configuration.ModelID);
            innerJObj[1] = model;

            //Load UITemplate
            UITemplateService _uiTemplatesService = new UITemplateService(SessionData.LoggedInUser.ID);
            BLL.BusinessObjects.UITemplate template = _uiTemplatesService.GetByID(configuration.UITemplateID);
            innerJObj[2] = template;


            //Setup the ConfigurationSession
            ConfiguratorSession newSession = new ConfiguratorSession(model, configuration, SolverService.CreateNewContext(model));
            SetupFeatureSelections(ref newSession);
            SessionData.ConfiguratorSessions[configurationID] = newSession;


            //
            return result;
        }
        [Authorize]
        public JsonNetResult SaveConfiguration(int configurationID, string configurationName, string featureSelectionsString)
        {
            //Data return controlTagElem
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


        //Solver / interactive configuration methods 
        [Authorize]
        public JsonNetResult ToggleFeature(int configurationID, int FeatureID, int newState)
        {
            //Data return controlTagElem
            JsonNetResult result = new JsonNetResult();

            //Get the ConfiguratorSession
            ConfiguratorSession configSession = SessionData.ConfiguratorSessions[configurationID];
            SolverService solverService = new SolverService();

            //Get the implicit selections for the other features
            BLL.BusinessObjects.FeatureSelectionStates selectionState = (BLL.BusinessObjects.FeatureSelectionStates)newState;
            bool selectionValid = solverService.UserToggleSelection(ref configSession, FeatureID, selectionState);


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
        public JsonNetResult EvalDatabindExpression(int configurationID, string expression)
        {
            //Data return controlTagElem
            JsonNetResult result = new JsonNetResult();

            //Get the ConfiguratorSession
            ConfiguratorSession configSession = SessionData.ConfiguratorSessions[configurationID];
            SolverService solverService = new SolverService();

            //Get the implicit selections for the other features
            result.Data = solverService.EvalExpression(ref configSession, expression);

            return result;
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
