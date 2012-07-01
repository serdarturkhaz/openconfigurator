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
using Newtonsoft.Json.Linq;
using PresentationLayer.Common;
using BLL.Services;
using BLL.BusinessObjects;
namespace PresentationLayer.Controllers
{
    public class LoginController : Controller
    {
        public ActionResult Login()
        {
            return View();
        }

        public JsonNetResult CallLogin(string email, string password)
        {
            //Default return variable
            JsonNetResult result = new JsonNetResult() { Data = null };

            //Verify the user credentials
            bool validUser = WebSecurity.AuthenticateUser(email, password);
            if (validUser)
            {
                result.Data = new JObject() { 
                    new JProperty("Redirect", Url.Action("Models", "Models"))
                };

            }

            //
            return result;
        }

    }
}
