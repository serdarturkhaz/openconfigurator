using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Xml;
using System.Xml.Serialization;
using AutoMapper;
using OpenConfigurator.Core;
using OpenConfigurator.Core.BLOs;

namespace OpenConfigurator.Core.BLOManagers
{
    public class ConfigurationInstanceManager
    {
        // Constructor
        public ConfigurationInstanceManager()
        {
        }

        // Public methods
        public ConfigurationInstance CreateConfigurationInstance(FeatureModel featureModel)
        {
            // Create the configuration instance
            ConfigurationInstance configInstance = new ConfigurationInstance();

            //XmlDAL.DataEntities.FeatureModel dataEntity = new XmlDAL.XMLDataEntityManager(this.modelFolderPath).GetFeatureModel(featureModelName);
            //BLOs.FeatureModel featureModelBLO = Mapper.Map<BLOs.FeatureModel>(dataEntity);

            return null;
        }
    }
}
