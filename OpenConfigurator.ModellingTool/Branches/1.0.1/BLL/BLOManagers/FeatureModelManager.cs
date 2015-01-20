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
using OpenConfigurator.ModellingTool.BLL.BLOs;

namespace OpenConfigurator.ModellingTool.BLL.BLOManagers
{
    public class FeatureModelManager
    {
        // Constructor
        public FeatureModelManager()
        {
        }

        // Public methods
        public void SaveChanges(BLOs.FeatureModel model)
        {
            // Get the DataEntity
            OpenConfigurator.ModellingTool.DAL.DataEntities.FeatureModel dataEntity = Mapper.Map<OpenConfigurator.ModellingTool.DAL.DataEntities.FeatureModel>(model);

            // Save it
            new OpenConfigurator.ModellingTool.DAL.XMLDataEntityManager().SaveChanges(dataEntity);
        }
        public OpenConfigurator.ModellingTool.BLL.BLOs.FeatureModel GetFeatureModel(string featureModelName)
        {
            // Get DataEntity and convert to BLO
            OpenConfigurator.ModellingTool.DAL.DataEntities.FeatureModel dataEntity = new OpenConfigurator.ModellingTool.DAL.XMLDataEntityManager().GetFeatureModel(featureModelName);
            OpenConfigurator.ModellingTool.BLL.BLOs.FeatureModel featureModelBLO = Mapper.Map<OpenConfigurator.ModellingTool.BLL.BLOs.FeatureModel>(dataEntity);
            return featureModelBLO;
        }
        public List<OpenConfigurator.ModellingTool.BLL.BLOs.ModelFile> GetAllModelFiles()
        {
            // Read files and create BLOs
            List<OpenConfigurator.ModellingTool.BLL.BLOs.ModelFile> modelFiles = new OpenConfigurator.ModellingTool.DAL.XMLDataEntityManager().GetAllModelFiles()
                                    .Select(dataEntity => new OpenConfigurator.ModellingTool.BLL.BLOs.ModelFile() { Name = dataEntity.Name }).ToList();

            // 
            return modelFiles;
        }
    }



}
