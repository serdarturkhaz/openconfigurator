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
using System.Threading.Tasks;

namespace OpenConfigurator.ModellingTool.WebUI.Controllers
{
    public class SPAController : Controller
    {
        [HttpGet]
        public async Task<JavaScriptResult> Index(string path)
        {
            string fullPath = Server.MapPath("/SPA/" + path);
            return await Task.Run(() => JavaScript(Helpers.GetJSFileAsString(fullPath)));
        }


        //public string GetUIComponent(string UIComponentFullName)
        //{
        //    // Get the UIComponent path
        //    var parsedUIComponentFullName = UIComponentFullName.Replace(".", "/");
        //    var shortName = parsedUIComponentFullName.Split('/').Last();
        //    string uiComponentNameAndPath = "~/" + parsedUIComponentFullName + "/" + shortName;

        //    // Parse js
        //    string htmlContent = Helpers.RenderViewToString(uiComponentNameAndPath + ".cshtml", this.ControllerContext);

        //    if (htmlContent != null)
        //    {
        //        jsScript = jsScript.Replace("#HTMLCONTENT#", HttpUtility.JavaScriptStringEncode(htmlContent, false));
        //    }

        //    //
        //    return jsScript;
        //}
    }
}
