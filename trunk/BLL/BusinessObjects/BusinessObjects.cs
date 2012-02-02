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
    public enum CompositionRuleTypes
    {
        Dependency = 1,
        MutualDependency = 2,
        MutualExclusion = 3
    }
    public enum FeatureSelectionStates
    {
        Selected = 1,
        Deselected = 2,
        Unselected = 3
    }

    //Model stuff
    public class Model : IBusinessObject
    {
        //Fields
        private DAL.DataEntities.Model _innerEntity;
        private List<BLL.BusinessObjects.Feature> _features = new List<Feature>();
        private List<BLL.BusinessObjects.Relation> _relations = new List<Relation>();
        private List<BLL.BusinessObjects.GroupRelation> _groupRelations = new List<GroupRelation>();
        private List<BLL.BusinessObjects.CompositionRule> _compositionRules = new List<CompositionRule>();
        private List<BLL.BusinessObjects.CustomRule> _customRules = new List<CustomRule>();
        private bool _toBeDeleted = false;

        //Constructor
        public Model()
        {
            _innerEntity = new DAL.DataEntities.Model();
        }
        internal Model(DAL.DataEntities.Model innerEntity)
        {
            this._innerEntity = innerEntity;

            //Create BLL collections
            _innerEntity.Features.ToList().ForEach(DALentity => Features.Add(BLL.BusinessObjects.Feature.FromDataEntity(DALentity)));
            _innerEntity.Relations.ToList().ForEach(DALentity => Relations.Add(BLL.BusinessObjects.Relation.FromDataEntity(DALentity)));
            _innerEntity.GroupRelations.ToList().ForEach(DALentity => GroupRelations.Add(BLL.BusinessObjects.GroupRelation.FromDataEntity(DALentity)));
            _innerEntity.CompositionRules.ToList().ForEach(DALentity => CompositionRules.Add(BLL.BusinessObjects.CompositionRule.FromDataEntity(DALentity)));
            _innerEntity.CustomRules.ToList().ForEach(DALentity => CustomRules.Add(BLL.BusinessObjects.CustomRule.FromDataEntity(DALentity))); 
        }

        //Properties
        public int ID
        {
            get
            {
                return _innerEntity.ID;
            }
            set
            {
                _innerEntity.ID = value;
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
        
        public List<BLL.BusinessObjects.Feature> Features
        {
            get
            {
                return _features;
            }
            set
            {
                _features = value;
            }
        }
        public List<BLL.BusinessObjects.Relation> Relations
        {
            get
            {
                return _relations;
            }
            set
            {
                _relations = value;
            }
        }
        public List<BLL.BusinessObjects.GroupRelation> GroupRelations
        {
            get
            {
                return _groupRelations;
            }
            set
            {
                _groupRelations = value;
            }
        }
        public List<BLL.BusinessObjects.CompositionRule> CompositionRules
        {
            get
            {
                return _compositionRules;
            }
            set
            {
                _compositionRules = value;
            }
        }
        public List<BLL.BusinessObjects.CustomRule> CustomRules
        {
            get
            {
                return _customRules;
            }
            set
            {
                _customRules = value;
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
        public bool ToBeDeleted
        {
            get
            {
                return this._toBeDeleted;
            }
            set
            {
                this._toBeDeleted = value;
            }
        }



        #endregion
    }
    public class Attribute : IBusinessObject
    {
        //Fields
        private DAL.DataEntities.Attribute _innerEntity;
        private bool _toBeDeleted = false;

        //Constructor
        public Attribute()
        {
            _innerEntity = new DAL.DataEntities.Attribute();
        }
        internal Attribute(DAL.DataEntities.Attribute innerEntity)
        {
            this._innerEntity = innerEntity;
        }

        //Properties
        public int ID
        {
            get
            {
                return _innerEntity.ID;
            }
            set
            {
                _innerEntity.ID = value;
            }
        }
        public int FeatureID
        {
            get
            {
                return _innerEntity.FeatureID;
            }
            set
            {
                _innerEntity.FeatureID = value;
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
            attribute.Name = "New Attribute";
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
        public bool ToBeDeleted
        {
            get
            {
                return this._toBeDeleted;
            }
            set
            {
                this._toBeDeleted = value;
            }
        }
        #endregion
    }
    public class Feature : IBusinessObject
    {
        //Fields
        private DAL.DataEntities.Feature _innerEntity;
        private List<BLL.BusinessObjects.Attribute> _attributes = new List<Attribute>();
        private bool _toBeDeleted = false;

        //Constructor
        public Feature()
        {
            this._innerEntity = new DAL.DataEntities.Feature();
        }
        internal Feature(DAL.DataEntities.Feature innerEntity)
        {
            this._innerEntity = innerEntity;

            //Create BLL collections
            _innerEntity.Attributes.ToList().ForEach(DALentity => Attributes.Add(BLL.BusinessObjects.Attribute.FromDataEntity(DALentity)));
        }

        //Properties
        public int ID
        {
            get
            {
                return _innerEntity.ID;
            }
            set
            {
                _innerEntity.ID = value;
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
        public Nullable<double> XPos
        {
            get
            {
                return _innerEntity.XPos;
            }
            set
            {
                _innerEntity.XPos = value;
            }
        }
        public Nullable<double> YPos
        {
            get
            {
                return _innerEntity.YPos;
            }
            set
            {
                _innerEntity.YPos = value;
            }
        }
        public List<BLL.BusinessObjects.Attribute> Attributes
        {
            get
            {
                return _attributes;
            }
            set
            {
                _attributes = value;
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
            feature.Name = "New Feature";

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
        public bool ToBeDeleted
        {
            get
            {
                return this._toBeDeleted;
            }
            set
            {
                this._toBeDeleted = value;
            }
        }

        #endregion
    }
    public class Relation : IBusinessObject
    {
        //Fields
        private DAL.DataEntities.Relation _innerEntity;
        private bool _toBeDeleted = false;

        //Constructor
        public Relation()
        {
            _innerEntity = new DAL.DataEntities.Relation();
        }
        internal Relation(DAL.DataEntities.Relation innerEntity)
        {
            this._innerEntity = innerEntity;
        }

        //Properties
        public int ID
        {
            get
            {
                return _innerEntity.ID;
            }
            set
            {
                _innerEntity.ID = value;
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
        public int ChildFeatureID
        {
            get
            {
                return _innerEntity.ChildFeatureID;
            }
            set
            {
                _innerEntity.ChildFeatureID = value;
            }
        }
        public int ParentFeatureID
        {
            get
            {
                return _innerEntity.ParentFeatureID;
            }
            set
            {
                _innerEntity.ParentFeatureID = value;
            }
        }
        public Nullable<int> LowerBound
        {
            get { return _innerEntity.LowerBound; }
            set { _innerEntity.LowerBound = value; }
        }
        public Nullable<int> UpperBound
        {
            get { return _innerEntity.UpperBound; }
            set { _innerEntity.UpperBound = value; }
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
            relation.LowerBound = 1;
            relation.UpperBound = 1;

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
        public bool ToBeDeleted
        {
            get
            {
                return this._toBeDeleted;
            }
            set
            {
                this._toBeDeleted = value;
            }
        }

        #endregion
    }
    public class GroupRelation : IBusinessObject
    {
        //Fields
        private DAL.DataEntities.GroupRelation _innerEntity;
        private bool _toBeDeleted = false;
        private int _parentFeatureID = 0;
        private List<int> _childFeatureIDs;

        //Constructor
        public GroupRelation()
        {
            _innerEntity = new DAL.DataEntities.GroupRelation();
            _childFeatureIDs = new List<int>();
        }
        internal GroupRelation(DAL.DataEntities.GroupRelation innerEntity)
        {
            this._innerEntity = innerEntity;
            _childFeatureIDs = new List<int>();

            //Get ParentFeatureID and ChildFeatureID's from GroupRelations_To_Features
            foreach (DAL.DataEntities.GroupRelation_To_Feature DALgroupRelationToFeature in innerEntity.GroupRelations_To_Features)
            {
                ParentFeatureID = DALgroupRelationToFeature.ParentFeatureID;
                ChildFeatureIDs.Add(DALgroupRelationToFeature.ChildFeatureID);

            }
        }

        //Properties
        public int ID
        {
            get
            {
                return _innerEntity.ID;
            }
            set
            {
                _innerEntity.ID = value;
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
        public int ParentFeatureID
        {
            get
            {
                return _parentFeatureID;
            }
            set
            {
                _parentFeatureID = value;
            }
        }
        public List<int> ChildFeatureIDs
        {
            get
            {
                return _childFeatureIDs;
            }
            set
            {
                _childFeatureIDs = value;

            }
        }

        public Nullable<int> LowerBound
        {
            get { return _innerEntity.LowerBound; }
            set { _innerEntity.LowerBound = value; }
        }
        public Nullable<int> UpperBound
        {
            get { return _innerEntity.UpperBound; }
            set { _innerEntity.UpperBound = value; }
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
            groupRelation.GroupRelationType = GroupRelationTypes.XOR;
            groupRelation.LowerBound = 1;
            groupRelation.UpperBound = 1;

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
        public bool ToBeDeleted
        {
            get
            {
                return this._toBeDeleted;
            }
            set
            {
                this._toBeDeleted = value;
            }
        }

        #endregion
    }
    public class CompositionRule : IBusinessObject
    {
        //Fields
        private DAL.DataEntities.CompositionRule _innerEntity;
        private bool _toBeDeleted = false;

        //Constructor
        public CompositionRule()
        {
            _innerEntity = new DAL.DataEntities.CompositionRule();
        }
        internal CompositionRule(DAL.DataEntities.CompositionRule innerEntity)
        {
            this._innerEntity = innerEntity;
        }

        //Properties
        public int ID
        {
            get
            {
                return _innerEntity.ID;
            }
            set
            {
                _innerEntity.ID = value;
            }
        }
        public CompositionRuleTypes CompositionRuleType
        {
            get
            {
                return (CompositionRuleTypes)Enum.Parse(typeof(CompositionRuleTypes), _innerEntity.CompositionRuleTypeID.ToString());
            }
            set
            {
                _innerEntity.CompositionRuleTypeID = (int)value;
            }
        }
        public int FirstFeatureID
        {
            get
            {
                return _innerEntity.FirstFeatureID;
            }
            set
            {
                _innerEntity.FirstFeatureID = value;
            }
        }
        public int SecondFeatureID
        {
            get
            {
                return _innerEntity.SecondFeatureID;
            }
            set
            {
                _innerEntity.SecondFeatureID = value;
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


        //Conversion
        public static BLL.BusinessObjects.CompositionRule FromDataEntity(DAL.DataEntities.IDataEntity innerEntity)
        {
            BLL.BusinessObjects.CompositionRule compositionRule = new BLL.BusinessObjects.CompositionRule((DAL.DataEntities.CompositionRule)innerEntity);
            return compositionRule;
        }
        //Factory
        public static BLL.BusinessObjects.CompositionRule CreateDefault()
        {
            //Create a new CompositionRule and InnerEntity
            DAL.DataEntities.IDataEntity innerEntity = new DAL.DataEntities.CompositionRule();
            BLL.BusinessObjects.CompositionRule compositionRule = new CompositionRule((DAL.DataEntities.CompositionRule)innerEntity);

            //Set default fields
            compositionRule.CompositionRuleType = CompositionRuleTypes.Dependency;
            compositionRule.Name = "Default rule";

            //Return the object instance
            return compositionRule;
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
                this._innerEntity = (DAL.DataEntities.CompositionRule)value;
            }
        }
        public bool ToBeDeleted
        {
            get
            {
                return this._toBeDeleted;
            }
            set
            {
                this._toBeDeleted = value;
            }
        }

        #endregion
    }
    public class CustomRule : IBusinessObject
    {
        //Fields
        private DAL.DataEntities.CustomRule _innerEntity;
        private bool _toBeDeleted = false;

        //Constructor
        public CustomRule()
        {
            _innerEntity = new DAL.DataEntities.CustomRule();
        }
        internal CustomRule(DAL.DataEntities.CustomRule innerEntity)
        {
            this._innerEntity = innerEntity;
        }

        //Properties
        public int ID
        {
            get
            {
                return _innerEntity.ID;
            }
            set
            {
                _innerEntity.ID = value;
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
        public string Expression
        {
            get
            {
                return _innerEntity.Expression;
            }
            set
            {
                _innerEntity.Expression = value;
            }
        }

        //Conversion
        public static BLL.BusinessObjects.CustomRule FromDataEntity(DAL.DataEntities.IDataEntity innerEntity)
        {
            BLL.BusinessObjects.CustomRule customRule = new BLL.BusinessObjects.CustomRule((DAL.DataEntities.CustomRule)innerEntity);
            return customRule;
        }
        //Factory
        public static BLL.BusinessObjects.CustomRule CreateDefault()
        {
            //Create a new CustomRule and InnerEntity
            DAL.DataEntities.IDataEntity innerEntity = new DAL.DataEntities.CustomRule();
            BLL.BusinessObjects.CustomRule customRule = new CustomRule((DAL.DataEntities.CustomRule)innerEntity);

            //Set default fields
            customRule.Name = "Default rule";

            //Return the object instance
            return customRule;
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
                this._innerEntity = (DAL.DataEntities.CustomRule)value;
            }
        }
        public bool ToBeDeleted
        {
            get
            {
                return this._toBeDeleted;
            }
            set
            {
                this._toBeDeleted = value;
            }
        }

        #endregion
    }

    //Users
    public class User : IBusinessObject
    {
        //Fields
        private DAL.DataEntities.User _innerEntity;
        private bool _toBeDeleted = false;

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
        public bool ToBeDeleted
        {
            get
            {
                return this._toBeDeleted;
            }
            set
            {
                this._toBeDeleted = value;
            }
        }

        #endregion
    }

    //Configuration stuff
    public class Configuration : IBusinessObject
    {
        //Fields
        private DAL.DataEntities.Configuration _innerEntity;
        private List<BLL.BusinessObjects.FeatureSelection> _featureSelections = new List<FeatureSelection>();
        private bool _toBeDeleted = false;
        private string _modelName;

        //Constructor
        public Configuration()
        {
            _innerEntity = new DAL.DataEntities.Configuration();
        }
        internal Configuration(DAL.DataEntities.Configuration innerEntity)
        {
            this._innerEntity = innerEntity;

            //Create BLL collections
            _innerEntity.FeatureSelections.ToList().ForEach(DALentity => FeatureSelections.Add(BLL.BusinessObjects.FeatureSelection.FromDataEntity(DALentity)));
        }

        //Properties
        public int ID
        {
            get
            {
                return _innerEntity.ID;
            }
            set
            {
                _innerEntity.ID = value;
            }
        }
        public int ModelID
        {
            get
            {
                return _innerEntity.ModelID;
            }
            set
            {
                _innerEntity.ModelID = value;
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
        public string ModelName
        {
            get
            {
                return _modelName;
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

        public List<BLL.BusinessObjects.FeatureSelection> FeatureSelections
        {
            get
            {
                return _featureSelections;
            }
            set
            {
                _featureSelections = value;
            }
        }


        //Conversion
        public static BLL.BusinessObjects.Configuration FromDataEntity(DAL.DataEntities.IDataEntity innerEntity)
        {
            BLL.BusinessObjects.Configuration configuration = new BLL.BusinessObjects.Configuration((DAL.DataEntities.Configuration)innerEntity);
            
            //Set fields
            configuration._modelName = ((DAL.DataEntities.Configuration)innerEntity).Model.Name;

            return configuration;
        }
        //Factory
        public static BLL.BusinessObjects.Configuration CreateDefault(int modelID)
        {
            //Create a new Model and InnerEntity
            DAL.DataEntities.IDataEntity innerEntity = new DAL.DataEntities.Configuration();
            BLL.BusinessObjects.Configuration configuration = new Configuration((DAL.DataEntities.Configuration)innerEntity);

            //Set default fields
            ((DAL.DataEntities.Configuration)configuration.InnerEntity).ModelID = modelID;
            configuration.CreatedDate = DateTime.Now;
            configuration.LastModifiedDate = DateTime.Now;
            configuration.Name = "Configuration00";

            //Return the object instance
            return configuration;
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
                this._innerEntity = (DAL.DataEntities.Configuration)value;
            }
        }
        public bool ToBeDeleted
        {
            get
            {
                return this._toBeDeleted;
            }
            set
            {
                this._toBeDeleted = value;
            }
        }



        #endregion
    }
    public class FeatureSelection: IBusinessObject
    {
        //Fields
        private DAL.DataEntities.FeatureSelection _innerEntity;
        private List<BLL.BusinessObjects.AttributeValue> _attributeValues = new List<AttributeValue>();
        private bool _toBeDeleted = false;

        //Constructor
        public FeatureSelection()
        {
            this._innerEntity = new DAL.DataEntities.FeatureSelection();
        }
        internal FeatureSelection(DAL.DataEntities.FeatureSelection innerEntity)
        {
            this._innerEntity = innerEntity;

            //Create BLL collections
            _innerEntity.AttributeValues.ToList().ForEach(DALentity => AttributeValues.Add(BLL.BusinessObjects.AttributeValue.FromDataEntity(DALentity)));
        }

        //Properties
        public int ID
        {
            get
            {
                return _innerEntity.ID;
            }
            set
            {
                _innerEntity.ID = value;
            }
        }
        public int FeatureID
        {
            get
            {
                return _innerEntity.FeatureID;
            }
            set
            {
                _innerEntity.FeatureID = value;
            }
        }
        public FeatureSelectionStates SelectionState
        {
            get
            {
                return (FeatureSelectionStates)Enum.Parse(typeof(FeatureSelectionStates), _innerEntity.SelectionStateID.ToString());
            }
            set
            {
                _innerEntity.SelectionStateID = (int)value;
            }
        }
        public bool? Disabled
        {
            get
            {
                if (_innerEntity.Disabled != null)
                    return _innerEntity.Disabled;
                else
                    return false;
            }
            set
            {
                _innerEntity.Disabled = value;
            }
        }
        public bool? ToggledByUser
        {
            get
            {
                if (_innerEntity.ToggledByUser != null)
                    return _innerEntity.ToggledByUser;
                else
                    return false;
            }
            set
            {
                _innerEntity.ToggledByUser = value;
            }
        }
        public List<BLL.BusinessObjects.AttributeValue> AttributeValues
        {
            get
            {
                return _attributeValues;
            }
            set
            {
                _attributeValues = value;
            }
        }

        //Conversion
        public static BLL.BusinessObjects.FeatureSelection FromDataEntity(DAL.DataEntities.IDataEntity innerEntity)
        {
            BLL.BusinessObjects.FeatureSelection featureSelection = new BLL.BusinessObjects.FeatureSelection((DAL.DataEntities.FeatureSelection)innerEntity);
            return featureSelection;
        }
        //Factory
        public static BLL.BusinessObjects.FeatureSelection CreateDefault()
        {
            //Create a new Feature and InnerEntity
            DAL.DataEntities.IDataEntity innerEntity = new DAL.DataEntities.FeatureSelection();
            BLL.BusinessObjects.FeatureSelection featureSelection = new FeatureSelection((DAL.DataEntities.FeatureSelection)innerEntity);

            //
            featureSelection.SelectionState = FeatureSelectionStates.Unselected;
            featureSelection.Disabled = false;
            featureSelection.ToggledByUser = false;

            //Return the object instance
            return featureSelection;
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
                this._innerEntity = (DAL.DataEntities.FeatureSelection)value;
            }
        }
        public bool ToBeDeleted
        {
            get
            {
                return this._toBeDeleted;
            }
            set
            {
                this._toBeDeleted = value;
            }
        }

        #endregion
    }
    public class AttributeValue : IBusinessObject
    {
        //Fields
        private DAL.DataEntities.AttributeValue _innerEntity;
        private bool _toBeDeleted = false;

        //Constructor
        public AttributeValue()
        {
            _innerEntity = new DAL.DataEntities.AttributeValue();
        }
        internal AttributeValue(DAL.DataEntities.AttributeValue innerEntity)
        {
            this._innerEntity = innerEntity;
        }

        //Properties
        public int ID
        {
            get
            {
                return _innerEntity.ID;
            }
            set
            {
                _innerEntity.ID = value;
            }
        }
        public int FeatureSelectionID
        {
            get
            {
                return _innerEntity.FeatureSelectionID;
            }
            set
            {
                _innerEntity.FeatureSelectionID = value;
            }
        }
        public int AttributeID
        {
            get
            {
                return _innerEntity.AttributeID;
            }
            set
            {
                _innerEntity.AttributeID = value;
            }
        }

        public string Value
        {
            get
            {
                return _innerEntity.Value;
            }
            set
            {
                _innerEntity.Value = value;
            }
        }

        //Conversion
        public static BLL.BusinessObjects.AttributeValue FromDataEntity(DAL.DataEntities.IDataEntity innerEntity)
        {
            BLL.BusinessObjects.AttributeValue attributeValue = new BLL.BusinessObjects.AttributeValue((DAL.DataEntities.AttributeValue)innerEntity);
            return attributeValue;
        }
        //Factory
        public static BLL.BusinessObjects.AttributeValue CreateDefault()
        {
            //Create a new Feature and InnerEntity
            DAL.DataEntities.IDataEntity innerEntity = new DAL.DataEntities.AttributeValue();
            BLL.BusinessObjects.AttributeValue attributeValue = new BLL.BusinessObjects.AttributeValue((DAL.DataEntities.AttributeValue)innerEntity);

            //Return the object instance
            return attributeValue;
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
                this._innerEntity = (DAL.DataEntities.AttributeValue)value;
            }
        }
        public bool ToBeDeleted
        {
            get
            {
                return this._toBeDeleted;
            }
            set
            {
                this._toBeDeleted = value;
            }
        }
        #endregion
    }
}
