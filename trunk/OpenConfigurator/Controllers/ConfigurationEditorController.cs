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
        public JsonNetResult LoadConfiguration(int configurationID)
        {
            //Data return wrapper
            JsonNetResult result = new JsonNetResult();

            ConfigurationService _configurationService = new ConfigurationService(SessionData.LoggedInUser.ID);
            BLL.BusinessObjects.Configuration configuration = _configurationService.GetByID(configurationID);
            result.Data = configuration;


            return result;
        }

        [Authorize]
        public JsonNetResult LoadModel(int modelID)
        {
            //Data return wrapper
            JsonNetResult result = new JsonNetResult();

            //Model
            ModelService _modelService = new ModelService(SessionData.LoggedInUser.ID);
            BLL.BusinessObjects.Model model = _modelService.GetByID(modelID);
            result.Data = model;

            return result;
        }

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


        public JsonNetResult LoadConfigurationData()
        {

            //Z3
            SolverService ss = new SolverService(1);
            ss.TestMethod();

            return null;
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
