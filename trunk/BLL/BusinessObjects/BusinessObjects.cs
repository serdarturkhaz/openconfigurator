using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BLL.BusinessObjects
{
    public class Attribute 
    {
        
    }

    public class AttributeDataType
    {

    }

    public class AttributeType 
    {

    }

    public class Feature 
    {

    }

    public class FeatureType 
    {

    }

    public class FeatureGroup
    {

    }

    public class FeatureGroupType 
    {

    }

    public class Model
    {
    
    }

    public class Rule 
    {

    }

    public class RuleType 
    {

    }

    public class User: IBusinessObject
    {
        //Fields
        private DAL.DataEntities.User _innerEntity;

        //Constructor
        internal User()
        {
        }
        internal User(DAL.DataEntities.User innerEntity)
        {
            this._innerEntity = innerEntity;
        }

        //Properties
        public string Email
        {
            get{
                return _innerEntity.Email;
            }
            set {
                _innerEntity.Email = value;
            }
        }
        public string Password
        {
            get
            {
                return _innerEntity.Password;
            }
            set
            {
                _innerEntity.Password = value;
            }
        }

        //Interface members
        #region IBusinessObject Members
        public DAL.DataEntities.IDataEntity InnerEntity
        {
            get
            {
                return this._innerEntity;
            }
            set
            {
                this._innerEntity = (DAL.DataEntities.User)value;
            }
        }

        #endregion
    }
}
