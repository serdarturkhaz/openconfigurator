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

            //Setup FeatureSelections for first time
            if (configuration.FeatureSelections.Count == 0)
            {
                //Create one instance for each Feature in the Model
                foreach (BLL.BusinessObjects.Feature feature in model.Features)
                {
                    BLL.BusinessObjects.FeatureSelection newFeatureSelection = BLL.BusinessObjects.FeatureSelection.CreateDefault();
                    newFeatureSelection.FeatureID = feature.ID;
                    configuration.FeatureSelections.Add(newFeatureSelection);
                }
                //Default selection for the first feature
                configuration.FeatureSelections[0].ToggledByUser = true;
                configuration.FeatureSelections[0].Disabled = true;
                configuration.FeatureSelections[0].SelectionState = BLL.BusinessObjects.FeatureSelectionStates.Selected;
            }
            //Create new FeatureSelections for newly created Features
            else if(configuration.FeatureSelections.Count < model.Features.Count) {
                foreach (BLL.BusinessObjects.Feature feature in model.Features)
                {
                    if(configuration.FeatureSelections.FirstOrDefault(k => k.FeatureID== feature.ID) == null) {
                        BLL.BusinessObjects.FeatureSelection newFeatureSelection = BLL.BusinessObjects.FeatureSelection.CreateDefault();
                        newFeatureSelection.FeatureID = feature.ID;
                        configuration.FeatureSelections.Add(newFeatureSelection);
                    }
                }
            }

            //Determine their selection states based on the mathematical representation of the Model
            GetInitialFeedBack(model, configuration.FeatureSelections);

            //
            return result;
        }

        //
        private void GetInitialFeedBack(BLL.BusinessObjects.Model model, List<BLL.BusinessObjects.FeatureSelection> featureSelections)
        {
            //Setup Solver and Context
            ISolverContext context = null;
            SolverService solverService= new SolverService();
            if (SessionData.SolverContexts.ContainsKey(model.ID))
            {
                context = SessionData.SolverContexts[model.ID];
            }
            else
            {
                context = solverService.CreateNewContext(model);
                SessionData.SolverContexts[model.ID] = context;
            }

            //Retreive the default selections
            solverService.GetInitialSelections(context, ref featureSelections);
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
        public void ClearSessionContext(int modelID)
        {
            SessionData.SolverContexts.Remove(modelID);
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
