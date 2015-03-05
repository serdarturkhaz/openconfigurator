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
        public iBLO CreateDefaultBLO(string bloType)
        {
            // Create a new BLO
            return GenericBLOFactory.GetInstance().CreateBLOInstance(bloType);
        }

        [HttpPost]
        public FeatureModel SaveChanges(FeatureModel featureModel)
        {
            FeatureModelManager manager = new FeatureModelManager(modelFolderPath);
            manager.SaveChanges(featureModel);
            return null;
        }

        [HttpGet]
        public FeatureModel GetFeatureModel(string featureModelName)
        {
            FeatureModelManager manager = new FeatureModelManager(modelFolderPath);
            return manager.GetFeatureModel(featureModelName);
        }

        [HttpGet]
        public List<ModelFile> GetAllModelFiles()
        {
            FeatureModelManager manager = new FeatureModelManager(modelFolderPath);
            return manager.GetAllModelFiles();
        }
    }
}
