using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using OpenConfigurator.ModellingTool.DAL.DataEntities;

namespace OpenConfigurator.ModellingTool.DAL
{
    public class XMLDataEntityManager
    {
        // Constructor
        public XMLDataEntityManager()
        {
        }

        // Public methods
        public void SaveChanges(FeatureModel model)
        {
            // Write the file
            using (FileStream writer = new FileStream(HttpContext.Current.Server.MapPath("~/FeatureModelFiles/" + model.Name + ".xml"), FileMode.Create, FileAccess.Write))
            {
                DataContractSerializer ser = new DataContractSerializer(typeof(OpenConfigurator.ModellingTool.DAL.DataEntities.FeatureModel));
                ser.WriteObject(writer, model);
            }
        }
        public FeatureModel GetFeatureModel(string featureModelName)
        {
            // Read file
            FeatureModel dataEntity;
            using (FileStream reader = new FileStream(HttpContext.Current.Server.MapPath("~/FeatureModelFiles/" + featureModelName + ".xml"), FileMode.Open, FileAccess.Read))
            {
                DataContractSerializer ser = new DataContractSerializer(typeof(OpenConfigurator.ModellingTool.DAL.DataEntities.FeatureModel));
                dataEntity = (OpenConfigurator.ModellingTool.DAL.DataEntities.FeatureModel)ser.ReadObject(reader);
            }

            return dataEntity;
        }
        public List<ModelFile> GetAllModelFiles()
        {
            // Read files and create DataEntities
            List<ModelFile> modelFiles = new List<ModelFile>(Directory.GetFiles(HttpContext.Current.Server.MapPath("~/FeatureModelFiles"), "*.xml")
                                    .Select(path => new ModelFile() { Name = Path.GetFileNameWithoutExtension(path) }));

            // 
            return modelFiles;
        }
    }
}
