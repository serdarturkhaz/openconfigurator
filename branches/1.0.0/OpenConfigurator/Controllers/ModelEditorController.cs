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
using BLL.BusinessObjects;
using System.Globalization;
using System.Reflection;
using System.Collections;

namespace PresentationLayer.Controllers
{
    using BLL.RuleParser;

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
        public void SaveModel(int modelID, string modelName)
        {
            //Create services
            ModelService _modelService = new ModelService(SessionData.LoggedInUser.ID);

            //Save changes to Model
            _modelService.UpdateName(modelID, modelName);
        }
        [Authorize]
        public JsonNetResult SaveBusinessObjects(int modelID, string businessObjectsString, string businessObjectsType)
        {
            //Setup variables & types
            JsonNetResult result = new JsonNetResult();
            Assembly BLLAssembly = Assembly.GetAssembly(typeof(BLL.BusinessObjects.IBusinessObject));
            Type businessObjectType = BLLAssembly.GetType("BLL.BusinessObjects." + businessObjectsType, false, true);

            //Create a corresponding service
            Type specificServiceType = BLLAssembly.GetType("BLL.Services." + businessObjectsType + "Service", false, true);
            IDataService service = (IDataService)Activator.CreateInstance(specificServiceType, (object)SessionData.LoggedInUser.ID);

            //Handle BusinessObjects
            Dictionary<int, JObject> businessObjectsCollection = (Dictionary<int, JObject>)Newtonsoft.Json.JsonConvert.DeserializeObject(businessObjectsString, typeof(Dictionary<int, JObject>));
            Dictionary<int, IBusinessObject> updatedObjects = new Dictionary<int, IBusinessObject>();
            foreach (KeyValuePair<int, JObject> entry in businessObjectsCollection)
            {
                JObject jObj = (JObject)entry.Value;
                IBusinessObject businessObj = (IBusinessObject)Newtonsoft.Json.JsonConvert.DeserializeObject(jObj.ToString(), businessObjectType);

                //Delete 
                if (businessObj.ToBeDeleted == true && businessObj.ID != 0)
                {
                    service.Delete(businessObj);
                }
                //Add
                else if (businessObj.ToBeDeleted == false && businessObj.ID == 0)
                {
                    service.Add(businessObj);
                }
                //Update
                else if (businessObj.ToBeDeleted == false && businessObj.ID != 0)
                {
                    service.Update(businessObj);
                }

                updatedObjects.Add((int)entry.Key, businessObj);
            }

            //Return
            result.Data = updatedObjects;
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
            AttributeService _attributeService = new AttributeService(SessionData.LoggedInUser.ID);
            BLL.BusinessObjects.Attribute newAttribute = (BLL.BusinessObjects.Attribute)_attributeService.CreateDefault();
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
        public JsonNetResult NewDefaultConstraint()
        {
            //Default return variable
            JsonNetResult result = new JsonNetResult() { Data = null };

            //Get a new default CustomRule
            ConstraintService _customRuleService = new ConstraintService(SessionData.LoggedInUser.ID);
            BLL.BusinessObjects.Constraint newCustomRule = (BLL.BusinessObjects.Constraint)_customRuleService.CreateDefault();
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
        [Authorize]
        public JsonNetResult ValidateCustomRuleSyntax(int modelID, string customRule)
        {
            var sp = new StandardParser();
            var cs = new ConfiguratorSession(null, null, null);

            try
            {
                sp.ParseString(ref cs, customRule);
            }
            catch
            {
                return new JsonNetResult { Data = false };
            }

            return new JsonNetResult { Data = true };
        }
    }
}
