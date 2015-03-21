using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Web;
using System.Web.Hosting;
using System.Web.Http;
using OpenConfigurator.Core.BLOFactories;
using OpenConfigurator.Core.BLOManagers;
using OpenConfigurator.Core.BLOs;
using OpenConfigurator.ConfigurationTool.WebUI.Common;

namespace OpenConfigurator.ConfigurationTool.WebUI.Controllers
{
    public class GlobalAPIController : ApiController
    {
        // Fields
        private string modelFolderPath = HostingEnvironment.MapPath("~/FeatureModelFiles/");

        [HttpGet]
        public ConfigurationInstance GetConfigurationInstance(string featureModelName)
        {
            // Get the FeatureModel
            FeatureModelManager manager = new FeatureModelManager(modelFolderPath);
            FeatureModel targetModel = manager.GetFeatureModel("Hello");

            // Create a ConfigurationInstance from it 
            ConfigurationInstanceManager configManager = new ConfigurationInstanceManager();
            ConfigurationInstance configInstance = configManager.CreateConfigurationInstance(targetModel);

            return null;
        }
    }
}
