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
            using (FileStream writer = new FileStream(HttpContext.Current.Server.MapPath("~/FeatureModelFiles/test.xml"), FileMode.Create, FileAccess.Write))
            {
                DataContractSerializer ser = new DataContractSerializer(typeof(BLOs.FeatureModel));
                ser.WriteObject(writer, model);
            }



            return false;
        }


    }



}
