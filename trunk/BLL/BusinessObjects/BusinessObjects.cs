using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace BLL.BusinessObjects
{
    //Enums
    public enum RelationTypes
    {
        Mandatory = 1,
        Optional = 2,
        Cloneable = 3
    }


    //BusinessObjects
    public class Attribute
    {

    }

    public class AttributeDataType
    {

    }

    public class AttributeType
    {

    }

    public class Feature : IBusinessObject
    {
        //Fields
        private DAL.DataEntities.Feature _innerEntity;

        //Constructor
        internal Feature()
        {
        }
        internal Feature(DAL.DataEntities.Feature innerEntity)
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
        public string Description
        {
            get
            {
                return _innerEntity.Description;
            }
            set
            {
                _innerEntity.Description = value;
            }
        }
        public bool? IsRoot
        {
            get
            {
                if (_innerEntity.IsRoot != null)
                    return _innerEntity.IsRoot;
                else
                    return false;
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
                this._innerEntity = (DAL.DataEntities.Feature)value;
            }
        }

        #endregion
    }

    public class Relation : IBusinessObject
    {
        //Fields
        private DAL.DataEntities.Relation _innerEntity;

        //Constructor
        internal Relation()
        {
        }
        internal Relation(DAL.DataEntities.Relation innerEntity)
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
        public RelationTypes RelationType
        {
            get
            {
                return (RelationTypes)Enum.Parse(typeof(RelationTypes), _innerEntity.RelationTypeID.ToString());
            }
            set
            {
                _innerEntity.RelationTypeID = (int)value;
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
                this._innerEntity = (DAL.DataEntities.Relation)value;
            }
        }

        #endregion
    }

    public class Model : IBusinessObject
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
        [JsonIgnore]
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
        [JsonIgnore]
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
        public string CreatedDateFormatted
        {
            get
            {
                return CreatedDate.Value.ToShortDateString();
            }
        }
        public string LastModifiedDateFormatted
        {
            get
            {
                return LastModifiedDate.Value.ToShortDateString();
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
                this._innerEntity = (DAL.DataEntities.Model)value;
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

    public class User : IBusinessObject
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
            get
            {
                return _innerEntity.Email;
            }
            set
            {
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
