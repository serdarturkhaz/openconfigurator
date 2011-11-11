using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;
using System.Globalization;

namespace BLL.BusinessObjects
{
    public class ModelFactory : BusinessObjectFactory
    {
        public override IBusinessObject CreateDefault(int userID)
        {
            //Create a new Model and InnerEntity
            DAL.DataEntities.IDataEntity innerEntity = new DAL.DataEntities.Model();
            BLL.BusinessObjects.Model model = new Model((DAL.DataEntities.Model) innerEntity);

            //Set default fields
            model.CreatedDate = DateTime.Now;
            model.LastModifiedDate = DateTime.Now;
            model.Name = "Default Model";
            ((DAL.DataEntities.Model)model.InnerEntity).UserID = userID;
            

            //Return the object instance
            return (IBusinessObject) model;
        }
    }

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

    public class RelationFactory : BusinessObjectFactory
    {
        public override IBusinessObject CreateDefault(int userID)
        {
            //Create a new Feature and InnerEntity
            DAL.DataEntities.IDataEntity innerEntity = new DAL.DataEntities.Relation();
            BLL.BusinessObjects.Relation relation = new Relation((DAL.DataEntities.Relation)innerEntity);

            //Set default fields
            relation.RelationType = RelationTypes.Mandatory;

            //Return the object instance
            return (IBusinessObject)relation;
        }
    }
}
