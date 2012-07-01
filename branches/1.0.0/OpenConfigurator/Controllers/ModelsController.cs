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
using PresentationLayer.Common;
using Newtonsoft.Json.Linq;
using BLL.Services;

namespace PresentationLayer.Controllers
{
    public class ModelsController : Controller
    {
        [Authorize]
        public ActionResult Models()
        {
            return View();
        }

        [Authorize]
        public JsonNetResult GetModels()
        {
            //Default return variable
            JsonNetResult result = new JsonNetResult() { Data = null };

            //Retreive Models belonging to the current User
            ModelService _modelService = new ModelService(SessionData.LoggedInUser.ID);
            List<BLL.BusinessObjects.Model> models = _modelService.GetByUserID(SessionData.LoggedInUser.ID);
            result.Data = models;

            

            //
            return result;
        }

        [Authorize]
        public JsonNetResult AddNewModel()
        {
            //Default return variable
            JsonNetResult result = new JsonNetResult() { Data = null };

            //Add a new Model
            ModelService modelService = new ModelService(SessionData.LoggedInUser.ID);
            BLL.BusinessObjects.Model newModel = (BLL.BusinessObjects.Model) modelService.CreateDefault();
            modelService.Add(newModel);

            //
            result.Data = newModel;
            return result;
        }

        [Authorize]
        public void DeleteModel(int ID)
        {
            //Delete the Model
            ModelService modelService = new ModelService(SessionData.LoggedInUser.ID);
            modelService.Delete(ID);
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
    }
}
