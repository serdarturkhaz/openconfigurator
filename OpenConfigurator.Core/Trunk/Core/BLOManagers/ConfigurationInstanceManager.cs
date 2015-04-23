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
        // Private methods
        private FeatureSelection CreateFeatureSelection_Recursive(Feature feature)
        {
            // Create the FeatureSelection
            FeatureSelection featureSelection = new FeatureSelection()
            {
                FeatureIdentifier = feature.Identifier,
                FeatureName = feature.Name
            };


            return featureSelection;
        }

        // Constructor
        public ConfigurationInstanceManager()
        {
        }

        // Public methods
        public ConfigurationInstance CreateConfigurationInstance(FeatureModel featureModel)
        {
            // Create the ConfigurationInstance from the FeatureModel
            ConfigurationInstance configInstance = new ConfigurationInstance(featureModel);

            // Create its RootFeature 

            return configInstance;
        }
    }
}
