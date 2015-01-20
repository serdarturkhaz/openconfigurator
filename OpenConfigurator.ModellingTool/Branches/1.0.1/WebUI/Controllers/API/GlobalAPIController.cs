using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Web;
using System.Web.Hosting;
using System.Web.Http;
using OpenConfigurator.ModellingTool.BLL;
using OpenConfigurator.ModellingTool.BLL.BLOManagers;
using OpenConfigurator.ModellingTool.BLL.BLOs;
using OpenConfigurator.ModellingTool.WebUI.Common;

namespace OpenConfigurator.ModellingTool.WebUI.Controllers
{
    public class GlobalAPIController : ApiController
    {
        [HttpGet]
        public iBLO CreateDefaultBLO(string bloType)
        {
            // Create a new BLO
            return GenericBLOFactory.GetInstance().CreateBLOInstance(bloType);
        }

        [HttpPost]
        public FeatureModel SaveChanges(FeatureModel featureModel)
        {
            FeatureModelManager manager = new FeatureModelManager();
            manager.SaveChanges(featureModel);
            return null;
        }

        [HttpGet]
        public FeatureModel GetFeatureModel(string featureModelName)
        {
            FeatureModelManager manager = new FeatureModelManager();
            return manager.GetFeatureModel(featureModelName);
        }

        [HttpGet]
        public List<ModelFile> GetAllModelFiles()
        {
            FeatureModelManager manager = new FeatureModelManager();
            return manager.GetAllModelFiles();
        }
    }
}
