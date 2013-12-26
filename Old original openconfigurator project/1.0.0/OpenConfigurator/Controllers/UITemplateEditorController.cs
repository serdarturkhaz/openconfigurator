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
    using BLL.Parsers;

    public class UITemplateEditorController : Controller
    {
        [Authorize]
        public ActionResult UITemplateEditor(int uiTemplateID)
        {
            //Load the UITemplateID
            ViewBag.UITemplateID = uiTemplateID;

            return View();
        }
        [Authorize]
        public JsonNetResult LoadData(int uiTemplateID)
        {
            //Data return controlTagElem
            JsonNetResult result = new JsonNetResult();

            //Get the UITemplate
            UITemplateService _uiTemplatesService = new UITemplateService(SessionData.LoggedInUser.ID);
            BLL.BusinessObjects.UITemplate template = _uiTemplatesService.GetByID(uiTemplateID);
            result.Data = template;

            return result;
        }
        [Authorize]
        public void SaveUITemplate(int uiTemplateID, string name, string content, string css)
        {
            //Create service
            UITemplateService _uiTemplateService = new UITemplateService(SessionData.LoggedInUser.ID);

            //Save changes to template
            UITemplate currentTemplate = _uiTemplateService.GetByID(uiTemplateID);
            currentTemplate.Name = name;
            currentTemplate.Content = content;
            currentTemplate.Stylesheet = css;

            //
            _uiTemplateService.Update(currentTemplate);
        }

        
    }
}
