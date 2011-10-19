using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BLL.BusinessObjects
{
    public class BAttribute : DAL.DataEntities.Attribute
    {
        
    }

    public class BAttributeDataType : DAL.DataEntities.Attribute_DataType
    {

    }

    public class BAttributeType : DAL.DataEntities.Attribute_Type
    {

    }

    public class BFeature : DAL.DataEntities.Feature
    {

    }

    public class BFeatureType : DAL.DataEntities.Feature_Type
    {

    }

    public class BFeatureGroup : DAL.DataEntities.FeatureGroup
    {

    }

    public class BFeatureGroupType : DAL.DataEntities.FeatureGroup_Type
    {

    }

    public class BModel : DAL.DataEntities.Model
    {
    
    }

    public class BRule : DAL.DataEntities.Rule
    {

    }

    public class BRuleType : DAL.DataEntities.Rule_Type
    {

    }

    public class User
    {
        //Fields
        DAL.DataEntities.User InnerEntity;

        //
        public User(DAL.DataEntities.User innerEntity)
        {
            this.InnerEntity = innerEntity;
        }

        //Properties
        public string Email
        {
            get{
                return InnerEntity.Email;
            }
            set {
                InnerEntity.Email = value;
            }
        }

        public string Password
        {
            get
            {
                return InnerEntity.Password;
            }
            set
            {
                InnerEntity.Password = value;
            }
        }
    }
}
