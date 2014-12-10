using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Serialization;

namespace BLL.BLOManagers
{
    public class ModelManager
    {
        // Fields


        // Constructors
        public ModelManager()
        {
        }

        // Public methods
        public bool SaveModelToFile(string fileName, BLOs.FeatureModel model)
        {

            //XmlSerializer xsSubmit = new XmlSerializer(typeof(DAL.DataObjects.Model));
            //var subReq = new DAL.DataObjects.Model();

            //DataContractSerializer

            //StringWriter sww = new StringWriter();
            //XmlWriter writer = XmlWriter.Create(sww);
            //xsSubmit.Serialize(writer, subReq);
            //var xml = sww.ToString(); // Your xml

            using (FileStream writer = new FileStream("c:/temp/file.xml", FileMode.Create, FileAccess.Write))
            {
                DataContractSerializer ser = new DataContractSerializer(typeof(DAL.DTOs.FeatureModel));
                ser.WriteObject(writer, new DAL.DTOs.FeatureModel());
            }



            return false;
        }


    }



}
