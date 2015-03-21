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
            return ConfigurationInstance.CreateFrom(featureModel);
        }
    }
}
