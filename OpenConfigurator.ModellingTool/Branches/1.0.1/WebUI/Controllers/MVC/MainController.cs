using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using OpenConfigurator.ModellingTool.WebUI.Common;
using System.Xml.Serialization;
using System.IO;
using System.Xml;
using System.Reflection;
using System.Net;

namespace OpenConfigurator.ModellingTool.WebUI.Controllers
{
    public class MainController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }


        [HttpPost]
        public string GetUIComponent(string UIComponentFullName)
        {
            // Get the view path
            var parsedUIComponentFullName = UIComponentFullName.Replace(".", "/");
            var shortName = parsedUIComponentFullName.Split('/').Last();
            string uiComponentNameAndPath = "~/" + parsedUIComponentFullName + "/" + shortName;

            // Parse js
            string htmlContent = Helpers.RenderViewToString(uiComponentNameAndPath + ".cshtml", this.ControllerContext);
            string jsScript = Helpers.GetJSFileAsString(Server.MapPath(uiComponentNameAndPath + ".js"));
            if (htmlContent != null)
            {
                jsScript = jsScript.Replace("#HTMLCONTENT#", HttpUtility.JavaScriptStringEncode(htmlContent, false));
            }

            //
            return jsScript;
        }


    }
}
