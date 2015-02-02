using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using OpenConfigurator.Core.XmlDAL.DataEntities;

namespace OpenConfigurator.Core.XmlDAL
{
    public class XMLDataEntityManager
    {
        // Fields
        string modelFolderPath;

        // Constructor
        public XMLDataEntityManager(string modelFolderPath)
        {
            this.modelFolderPath = modelFolderPath;
        }

        // Public methods
        public void SaveChanges(FeatureModel model)
        {
            // Write the file
            using (FileStream writer = new FileStream(this.modelFolderPath + model.Name + ".xml", FileMode.Create, FileAccess.Write))
            {
                DataContractSerializer ser = new DataContractSerializer(typeof(FeatureModel));
                ser.WriteObject(writer, model);
            }
        }
        public FeatureModel GetFeatureModel(string featureModelName)
        {
            // Read file
            FeatureModel dataEntity;
            using (FileStream reader = new FileStream(this.modelFolderPath + featureModelName + ".xml", FileMode.Open, FileAccess.Read))
            {
                DataContractSerializer ser = new DataContractSerializer(typeof(FeatureModel));
                dataEntity = (FeatureModel)ser.ReadObject(reader);
            }

            return dataEntity;
        }
        public List<ModelFile> GetAllModelFiles()
        {
            // Read files and create DataEntities
            List<ModelFile> modelFiles = new List<ModelFile>(Directory.GetFiles(this.modelFolderPath, "*.xml")
                                    .Select(path => new ModelFile() { Name = Path.GetFileNameWithoutExtension(path) }));

            // 
            return modelFiles;
        }
    }
}
