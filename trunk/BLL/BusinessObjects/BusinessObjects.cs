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
    public enum GroupRelationTypes
    {
        OR = 1,
        XOR = 2,
        Cardinal = 3
    }
    public enum AttributeTypes
    {
        Constant = 1,
        Dynamic = 2,
        UserInput = 3
    }
    public enum AttributeDataTypes
    {
        Integer = 1,
        Boolean = 2,
        String = 3
    }

    //BusinessObjects
    public class Attribute : IBusinessObject
    {
        //Fields
        private DAL.DataEntities.Attribute _innerEntity;

        //Constructor
        internal Attribute()
        {
        }
        internal Attribute(DAL.DataEntities.Attribute innerEntity)
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
        public AttributeTypes AttributeType
        {
            get
            {
                return (AttributeTypes)Enum.Parse(typeof(AttributeTypes), _innerEntity.AttributeTypeID.ToString());
            }
            set
            {
                _innerEntity.AttributeTypeID = (int)value;
            }
        }
        public AttributeDataTypes AttributeDataType
        {
            get
            {
                return (AttributeDataTypes)Enum.Parse(typeof(AttributeDataTypes), _innerEntity.DataTypeID.ToString());
            }
            set
            {
                _innerEntity.DataTypeID = (int)value;
            }
        }

        //Conversion
        public static BLL.BusinessObjects.Attribute FromDataEntity(DAL.DataEntities.IDataEntity innerEntity)
        {
            BLL.BusinessObjects.Attribute attribute = new BLL.BusinessObjects.Attribute((DAL.DataEntities.Attribute)innerEntity);
            return attribute;
        }
        //Factory
        public static BLL.BusinessObjects.Attribute CreateDefault()
        {
            //Create a new Feature and InnerEntity
            DAL.DataEntities.IDataEntity innerEntity = new DAL.DataEntities.Attribute();
            BLL.BusinessObjects.Attribute attribute = new BLL.BusinessObjects.Attribute((DAL.DataEntities.Attribute)innerEntity);

            //Set default fields
            attribute.Name = "Default Attribute";
            attribute.Description = "Default attribute description";
            attribute.AttributeType = AttributeTypes.UserInput;
            attribute.AttributeDataType = AttributeDataTypes.Integer;

            //Return the object instance
            return attribute;
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
                this._innerEntity = (DAL.DataEntities.Attribute)value;
            }
        }

        #endregion
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
        private List<BLL.BusinessObjects.Attribute> _attributes = new List<Attribute>();

        //Constructor
        internal Feature()
        {
        }
        internal Feature(DAL.DataEntities.Feature innerEntity)
        {
            this._innerEntity = innerEntity;

            //Create BLL attributes from each DAL attribute
            foreach (DAL.DataEntities.Attribute dataAttr in _innerEntity.Attributes)
            {
                BLL.BusinessObjects.Attribute BLLattr = BLL.BusinessObjects.Attribute.FromDataEntity(dataAttr);
                _attributes.Add(BLLattr);
            }
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
        public List<BLL.BusinessObjects.Attribute> Attributes
        {
            get
            {
                return _attributes;
            }
        }
        
        //Conversion
        public static BLL.BusinessObjects.Feature FromDataEntity(DAL.DataEntities.IDataEntity innerEntity)
        {
            BLL.BusinessObjects.Feature feature = new BLL.BusinessObjects.Feature((DAL.DataEntities.Feature)innerEntity);
            return feature;
        }
        //Factory
        public static BLL.BusinessObjects.Feature CreateDefault()
        {
            //Create a new Feature and InnerEntity
            DAL.DataEntities.IDataEntity innerEntity = new DAL.DataEntities.Feature();
            BLL.BusinessObjects.Feature feature = new Feature((DAL.DataEntities.Feature)innerEntity);

            //Set default fields
            feature.Name = "Default Feature";
            feature.Description = "Default description";

            //Return the object instance
            return feature;
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

        //Conversion
        public static BLL.BusinessObjects.Relation FromDataEntity(DAL.DataEntities.IDataEntity innerEntity)
        {
            BLL.BusinessObjects.Relation relation = new BLL.BusinessObjects.Relation((DAL.DataEntities.Relation)innerEntity);
            return relation;
        }
        //Factory
        public static BLL.BusinessObjects.Relation CreateDefault()
        {
            //Create a new Relation and InnerEntity
            DAL.DataEntities.IDataEntity innerEntity = new DAL.DataEntities.Relation();
            BLL.BusinessObjects.Relation relation = new Relation((DAL.DataEntities.Relation)innerEntity);

            //Set default fields
            relation.RelationType = RelationTypes.Mandatory;

            //Return the object instance
            return relation;
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

    public class GroupRelation : IBusinessObject
    {
        //Fields
        private DAL.DataEntities.GroupRelation _innerEntity;

        //Constructor
        internal GroupRelation()
        {
        }
        internal GroupRelation(DAL.DataEntities.GroupRelation innerEntity)
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
        public GroupRelationTypes GroupRelationType
        {
            get
            {
                return (GroupRelationTypes)Enum.Parse(typeof(RelationTypes), _innerEntity.GroupRelationTypeID.ToString());
            }
            set
            {
                _innerEntity.GroupRelationTypeID = (int)value;
            }
        }

        //Conversion
        public static BLL.BusinessObjects.GroupRelation FromDataEntity(DAL.DataEntities.IDataEntity innerEntity)
        {
            BLL.BusinessObjects.GroupRelation groupRelation = new BLL.BusinessObjects.GroupRelation((DAL.DataEntities.GroupRelation)innerEntity);
            return groupRelation;
        }
        //Factory
        public static BLL.BusinessObjects.GroupRelation CreateDefault()
        {
            //Create a new Feature and InnerEntity
            DAL.DataEntities.IDataEntity innerEntity = new DAL.DataEntities.GroupRelation();
            BLL.BusinessObjects.GroupRelation groupRelation = new GroupRelation((DAL.DataEntities.GroupRelation)innerEntity);

            //Set default fields
            groupRelation.GroupRelationType = GroupRelationTypes.OR;

            //Return the object instance
            return groupRelation;
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
                this._innerEntity = (DAL.DataEntities.GroupRelation)value;
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


        //Conversion
        public static BLL.BusinessObjects.Model FromDataEntity(DAL.DataEntities.IDataEntity innerEntity)
        {
            BLL.BusinessObjects.Model model = new BLL.BusinessObjects.Model((DAL.DataEntities.Model)innerEntity);
            return model;
        }
        //Factory
        public static BLL.BusinessObjects.Model CreateDefault(int userId)
        {
            //Create a new Model and InnerEntity
            DAL.DataEntities.IDataEntity innerEntity = new DAL.DataEntities.Model();
            BLL.BusinessObjects.Model model = new Model((DAL.DataEntities.Model)innerEntity);

            //Set default fields
            model.CreatedDate = DateTime.Now;
            model.LastModifiedDate = DateTime.Now;
            model.Name = "Default Model";

            //Set inner entity fields
            ((DAL.DataEntities.Model)model.InnerEntity).UserID = userId;

            //Return the object instance
            return model;
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

        //Conversion
        public static BLL.BusinessObjects.User FromDataEntity(DAL.DataEntities.IDataEntity innerEntity)
        {
            BLL.BusinessObjects.User user = new BLL.BusinessObjects.User((DAL.DataEntities.User)innerEntity);
            return user;
        }
        //Factory
        


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
