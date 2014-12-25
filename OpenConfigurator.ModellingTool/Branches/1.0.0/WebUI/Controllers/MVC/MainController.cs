using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ModellingTool.Common;
using System.Xml.Serialization;
using System.IO;
using System.Xml;
using BLL;
using System.Reflection;
using BLL.BLOs;

namespace ModellingTool.Controllers
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
            // Get the view path "~/Views/Home/myview.cshtml"
            string uiComponentNameAndPath = "~/UIComponents/CommandToolbar/CommandToolbar";

            // Render the view to a string
            string viewAsString = Helpers.RenderViewToString(uiComponentNameAndPath + ".cshtml", this.ControllerContext);

            // Get the .js file and inject 
            string jsString = Helpers.GetJSFileAsString(uiComponentNameAndPath + ".js");


            return jsString;
        }

        //[HttpPost]
        //public JsonNetResult LoadData(int modelID)
        //{
        //    //Default return variable
        //    JsonNetResult result = new JsonNetResult() { Data = null };

        //    //Retreive Models belonging to the current User
        //    ModelService _modelService = new ModelService(1);
        //    BLL.BusinessObjects.Model model = _modelService.GetByID(44);
        //    result.Data = model;

        //    //
        //    return result;
        //}

        //public void SaveData()
        //{
        //    //Retreive Models belonging to the current User
        //    ModelService _modelService = new ModelService(1);
        //    BLL.BusinessObjects.Model model = _modelService.GetByID(44);

        //    //Save to xml file
        //    XmlSerializer serializer = new XmlSerializer(typeof(List<BLL.BusinessObjects.Feature>));
        //    XmlWriter xmlWriter = XmlWriter.Create(Server.MapPath("~/Files/model.xml"));
        //    serializer.Serialize(xmlWriter, model.Features);
        //    xmlWriter.Close();

        //    //Load from xml file
        //    List<BLL.BusinessObjects.Feature> list = (List<BLL.BusinessObjects.Feature>)new XmlSerializer(typeof(List<BLL.BusinessObjects.Feature>)).Deserialize(XmlReader.Create(Server.MapPath("~/Files/model.xml")));
        //}

        //Methods for creating default objects

    }
}
