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
    public class ConfigurationsController : Controller
    {
        [Authorize]
        public ActionResult Configurations()
        {
            return View();
        }

        [Authorize]
        public JsonNetResult GetConfigurations()
        {
            //Default return variable
            JsonNetResult result = new JsonNetResult() { Data = null };

            //Retreive Models belonging to the current User
            ConfigurationService _configurationsService = new ConfigurationService(SessionData.LoggedInUser.ID);
            List<BLL.BusinessObjects.Configuration> configurations = _configurationsService.GetByUserID(SessionData.LoggedInUser.ID);
            result.Data = configurations;

            //
            return result;
        }


        [Authorize]
        public void DeleteConfiguration(int ID)
        {
            //Delete the Model
            ConfigurationService _configurationsService = new ConfigurationService(SessionData.LoggedInUser.ID);
            _configurationsService.Delete(ID);
        }
    }
}
