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
using BLL.BLOs;

namespace BLL.BLOManagers
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
            DAL.DataEntities.FeatureModel dataEntity = Mapper.Map<DAL.DataEntities.FeatureModel>(model);

            // Write the file
            using (FileStream writer = new FileStream(HttpContext.Current.Server.MapPath("~/FeatureModelFiles/" + dataEntity.Name + ".xml"), FileMode.Create, FileAccess.Write))
            {
                DataContractSerializer ser = new DataContractSerializer(typeof(DAL.DataEntities.FeatureModel));
                ser.WriteObject(writer, dataEntity);
            }
        }
        public void GetFeatureModel(string featureModelName)
        {
            // Read file
            //string fileName = Path.Combine(this.path, "Document.xml");
            //DataContractSerializer dcs = new DataContractSerializer(typeof(Games));
            //FileStream fs = new FileStream(fileName, FileMode.Open);
            //XmlDictionaryReader reader = XmlDictionaryReader.CreateTextReader(fs, new XmlDictionaryReaderQuotas());

            //Games games = (Games)dcs.ReadObject(reader);
            //reader.Close();
            //fs.Close();
            DAL.DataEntities.FeatureModel dataEntity;
            using (FileStream reader = new FileStream(HttpContext.Current.Server.MapPath("~/FeatureModelFiles/" + featureModelName + ".xml"), FileMode.Open, FileAccess.Read))
            {
                DataContractSerializer ser = new DataContractSerializer(typeof(DAL.DataEntities.FeatureModel));
                dataEntity = (DAL.DataEntities.FeatureModel)ser.ReadObject(reader);
            } 

            // Convert to BLO
            //DAL.DataEntities.FeatureModel dataEntity = Mapper.Map<DAL.DataEntities.FeatureModel>(model);
        }

    }



}
