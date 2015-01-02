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
        // Fields

        // Constructors
        public FeatureModelManager()
        {
        }

        // Public methods
        public bool SaveChanges(BLOs.FeatureModel model)
        {
            // Get the DataEntity
            DAL.DataEntities.FeatureModel dataEntity = Mapper.Map<DAL.DataEntities.FeatureModel>(model);

            // Write the file
            using (FileStream writer = new FileStream(HttpContext.Current.Server.MapPath("~/FeatureModelFiles/" + dataEntity.Name + ".xml"), FileMode.Create, FileAccess.Write))
            {
                DataContractSerializer ser = new DataContractSerializer(typeof(DAL.DataEntities.FeatureModel));
                ser.WriteObject(writer, dataEntity);
            }



            return false;
        }


    }



}
