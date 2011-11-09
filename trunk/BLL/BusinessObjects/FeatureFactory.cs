using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;
using System.Globalization;

namespace BLL.BusinessObjects
{
    public class FeatureFactory : BusinessObjectFactory
    {
        public override IBusinessObject CreateDefault(int userID)
        {
            //Create a new Feature and InnerEntity
            DAL.DataEntities.IDataEntity innerEntity = new DAL.DataEntities.Feature();
            BLL.BusinessObjects.Feature feature = new Feature((DAL.DataEntities.Feature)innerEntity);

            //Set default fields
            feature.Name = "Default Feature";
            feature.Description = "Default description";

            //Return the object instance
            return (IBusinessObject)feature;
        }
    }
}
