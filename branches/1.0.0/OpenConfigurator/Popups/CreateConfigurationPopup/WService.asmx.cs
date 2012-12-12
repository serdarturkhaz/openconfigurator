using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.IO;
using System.Reflection;
using Newtonsoft.Json;
using BLL.Services;
using PresentationLayer.Common;

namespace PresentationLayer.Popups.CreateConfigurationPopup
{
    /// <summary>
    /// Summary description for WService
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class WService : System.Web.Services.WebService
    {

        [WebMethod(EnableSession = true)]
        public string GetModels()
        {
            //Retreive Models belonging to the current User
            ModelService _modelService = new ModelService(SessionData.LoggedInUser.ID);
            List<BLL.BusinessObjects.Model> models = _modelService.GetByUserID_Shallow(SessionData.LoggedInUser.ID);

            //
            return JsonConvert.SerializeObject(models);
        }

        [WebMethod(EnableSession = true)]
        public string GetUITemplates()
        {
            //Retreive UITemplates belonging to the current User
            UITemplateService _uiTemplatesService = new UITemplateService(SessionData.LoggedInUser.ID);
            List<BLL.BusinessObjects.UITemplate> uitemplates = _uiTemplatesService.GetByUserID(SessionData.LoggedInUser.ID, true);

            //
            return JsonConvert.SerializeObject(uitemplates);
        }

        [WebMethod(EnableSession = true)]
        public int AddNewConfiguration(int modelID, int uiTemplateID)
        {
            //Add a new Configuration
            ConfigurationService configurationService = new ConfigurationService(SessionData.LoggedInUser.ID);
            BLL.BusinessObjects.Configuration newConfiguration = (BLL.BusinessObjects.Configuration)configurationService.CreateDefault(modelID, uiTemplateID);
            configurationService.Add(newConfiguration);

            //Return its ID
            return newConfiguration.ID;
        }

        //Generic stuff
        [WebMethod(EnableSession = true)]
        public string GetModuleContent()
        {
            Stream st;
            StreamReader sr;

            //Script
            string Script = "";
            st = Assembly.GetExecutingAssembly().GetManifestResourceStream(GetType(), "script.js");
            if (st != null)
            {
                sr = new StreamReader(st);
                Script = sr.ReadToEnd();
            }

            //HTML
            string HTML = "";
            st = Assembly.GetExecutingAssembly().GetManifestResourceStream(GetType(), "content.htm");
            if (st != null)
            {
                sr = new StreamReader(st);
                HTML = sr.ReadToEnd();
            }

            //Serialize the (JSON) object
            ModuleContent JsonObject = new ModuleContent();
            JsonObject.Script = Script;
            JsonObject.HTML = HTML;

            return JsonConvert.SerializeObject(JsonObject);
        }
        public class ModuleContent
        {
            public string Script;
            public string HTML;
        }
    }
}
