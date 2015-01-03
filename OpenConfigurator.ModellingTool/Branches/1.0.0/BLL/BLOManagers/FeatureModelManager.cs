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
            using (FileStream writer = new FileStream(HttpContext.Current.Server.MapPath("~/FeatureModelFiles/test.xml"), FileMode.Create, FileAccess.Write)) // " + dataEntity.Name + "
            {
                DataContractSerializer ser = new DataContractSerializer(typeof(DAL.DataEntities.FeatureModel));
                ser.WriteObject(writer, dataEntity);
            }
        }
        public BLL.BLOs.FeatureModel GetFeatureModel(string featureModelName)
        {
            // Read file
            DAL.DataEntities.FeatureModel dataEntity;
            using (FileStream reader = new FileStream(HttpContext.Current.Server.MapPath("~/FeatureModelFiles/test.xml"), FileMode.Open, FileAccess.Read)) // " + featureModelName + "
            {
                DataContractSerializer ser = new DataContractSerializer(typeof(DAL.DataEntities.FeatureModel));
                dataEntity = (DAL.DataEntities.FeatureModel)ser.ReadObject(reader);
            } 

            // Convert to BLO
            BLL.BLOs.FeatureModel featureModelBLO = Mapper.Map<BLL.BLOs.FeatureModel>(dataEntity);
            return featureModelBLO;
        }

    }



}
