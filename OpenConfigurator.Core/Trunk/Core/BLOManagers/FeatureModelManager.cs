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
    public class FeatureModelManager
    {
        // Fields
        string modelFolderPath;

        // Constructor
        public FeatureModelManager(string modelFolderPath)
        {
            this.modelFolderPath = modelFolderPath;
        }

        // Public methods
        public void SaveChanges(FeatureModel model)
        {
            // Get the DataEntity
            XmlDAL.DataEntities.FeatureModel dataEntity = Mapper.Map<XmlDAL.DataEntities.FeatureModel>(model);

            // Save it
            new XmlDAL.XMLDataEntityManager(this.modelFolderPath).SaveChanges(dataEntity);
        }
        public OpenConfigurator.Core.BLOs.FeatureModel GetFeatureModel(string featureModelName)
        {
            // Get DataEntity and convert to BLO
            XmlDAL.DataEntities.FeatureModel dataEntity = new XmlDAL.XMLDataEntityManager(this.modelFolderPath).GetFeatureModel(featureModelName);
            BLOs.FeatureModel featureModelBLO = Mapper.Map<BLOs.FeatureModel>(dataEntity);
            return featureModelBLO;
        }
        public List<BLOs.ModelFile> GetAllModelFiles()
        {
            // Read files and create BLOs
            List<BLOs.ModelFile> modelFiles = new XmlDAL.XMLDataEntityManager(this.modelFolderPath).GetAllModelFiles()
                                    .Select(dataEntity => new BLOs.ModelFile() { Name = dataEntity.Name }).ToList();

            // 
            return modelFiles;
        }
    }
}
