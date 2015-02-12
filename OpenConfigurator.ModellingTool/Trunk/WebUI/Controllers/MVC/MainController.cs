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
            // Get the UIComponent path
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

        ///// <summary>
        ///// Matches define(/*PLACEHOLDER_MODULE_ID*/["dependency1","dependency2"],function(dep1,dep2){ ...
        ///// </summary>
        //public static readonly Regex DependenciesRegex =
        //    new Regex(
        //        @"define\s*\(\s*" +
        //        Regex.Escape(PlaceholderModuleID) +
        //        @"\s*\[([^]]+)",
        //        RegexOptions.Compiled | RegexOptions.CultureInvariant);


        //private static IEnumerable<string> ParseDependencies(string UIComponentName, string script)
        //{
        //    var match = RegularExpressions.DependenciesRegex.Match(script);
        //    if (!match.Success)
        //    {
        //        yield break;
        //    }
        //    var depsStringArray = match.Groups[1].Value;
        //    // Convert e.g. ["dep1", "dep2"] into sequence of dep1 and dep2
        //    var depIDs = depsStringArray.Split(',').Select(depID => depID.Trim().Trim('"', '\''));
        //    foreach (var depID in depIDs)
        //    {
        //        string absDepID;
        //        // Module ID format: https://github.com/amdjs/amdjs-api/wiki/AMD
        //        if (depID.StartsWith(".."))
        //        {
        //            throw new NotSupportedException("../ relative module deps are currently not supported");
        //        }
        //        else if (depID.StartsWith("."))
        //        {
        //            absDepID = name.ParentPath + depID.Substring(1);
        //        }
        //        else
        //        {
        //            absDepID = depID;
        //        }
        //        yield return UIComponentName.CreateFromModuleID(absDepID);
        //    }
        //}

    }
}
