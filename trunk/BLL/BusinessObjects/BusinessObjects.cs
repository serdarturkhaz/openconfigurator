using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel;
using Newtonsoft.Json;

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

    public class Model :IBusinessObject
    {
        //Fields
        private DAL.DataEntities.Model _innerEntity;

        //Constructor
        internal Model()
        {
        }
        internal Model(DAL.DataEntities.Model innerEntity)
        {
            this._innerEntity = innerEntity;
        }

        //Properties
        [ReadOnly(true)]
        public int ID
        {
            get
            {
                return _innerEntity.ID;
            }
        }
        public string Name
        {
            get
            {
                return _innerEntity.Name;
            }
            set
            {
                _innerEntity.Name = value;
            }
        }
        public Nullable<System.DateTime> CreatedDate
        {
            get
            {
                return _innerEntity.CreatedDate;
            }
            set
            {
                _innerEntity.CreatedDate = value;
            }
        }
        public Nullable<System.DateTime> LastModifiedDate
        {
            get
            {
                return _innerEntity.LastModifiedDate;
            }
            set
            {
                _innerEntity.LastModifiedDate = value;
            }
        }
        
        //Interface members
        #region IBusinessObject Members
        [JsonIgnore]
        public DAL.DataEntities.IDataEntity InnerEntity
        {
            get
            {
                return this._innerEntity;
            }
            set
            {
                this._innerEntity = (DAL.DataEntities.Model) value;
            }
        }

        #endregion
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
        [ReadOnly(true)]
        public int ID
        {
            get
            {
                return _innerEntity.ID;
            }
        }
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
        [JsonIgnore]
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
