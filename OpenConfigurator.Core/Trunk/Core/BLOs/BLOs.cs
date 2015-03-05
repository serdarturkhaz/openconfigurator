using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;

namespace OpenConfigurator.Core.BLOs
{
    // Enums
    public enum RelationTypes
    {
        Mandatory = 0,
        Optional = 1,
        Cloneable = 2
    };
    public enum GroupRelationTypes
    {
        OR = 0,
        XOR = 1,
        Cardinal = 2
    };
    public enum CompositionRuleTypes
    {
        Dependency = 0,
        MutualDependency = 1,
        MutualExclusion = 2
    };
    public enum AttributeTypes
    {
        Constant = 0,
        Dynamic = 1,
        UserInput = 2
    }
    public enum AttributeDataTypes
    {
        Integer = 0,
        Boolean = 1,
        String = 2
    }
    public enum UIOrientationTypes
    {
        Vertical = 0,
        Horizontal = 1
    }

    // Extra information for enums (was previously stored in the SQL db)
    public static class RelationTypes_Info
    {
        public static class Mandatory
        {
            public static readonly int? FixedLowerBound = 1;
            public static readonly int? FixedUpperBound = 1;
        }
        public static class Optional
        {
            public static readonly int? FixedLowerBound = 0;
            public static readonly int? FixedUpperBound = 1;
        }
        public static class Cloneable
        {
            public static readonly int? FixedLowerBound = null;
            public static readonly int? FixedUpperBound = null;
        }
    }
    public static class GroupRelationTypes_Info
    {
        public static class OR
        {
            public static readonly int? FixedLowerBound = 1;
            public static readonly int? FixedUpperBound = -1; // not editable & set to nr of child features
        }
        public static class XOR
        {
            public static readonly int? FixedLowerBound = 1;
            public static readonly int? FixedUpperBound = 1;
        }
        public static class CustomOR
        {
            public static readonly int? FixedLowerBound = null;
            public static readonly int? FixedUpperBound = null; // editable and set to nr of child features
        }
    }

    // Core FeatureModel BLOs
    public class FeatureModel : iBLO
    {
        // Fields
        protected List<Feature> features = new List<Feature>();
        protected List<Relation> relations = new List<Relation>();
        protected List<GroupRelation> groupRelations = new List<GroupRelation>();
        protected List<CompositionRule> compositionRules = new List<CompositionRule>();
        protected List<CustomRule> customRules = new List<CustomRule>();
        protected List<CustomFunction> customFunctions = new List<CustomFunction>();

        // Properties
        public string Type
        {
            get
            {
                return "FeatureModel";
            }
        }
        public string Name
        {
            get;
            set;
        }
        public UIOrientationTypes UIOrientation
        {
            get;
            set;
        }
        public decimal ScaleModifier
        {
            get;
            set;
        }
        public List<Feature> Features
        {
            get
            {
                return features;
            }
        }
        public List<Relation> Relations
        {
            get
            {
                return relations;
            }
        }
        public List<GroupRelation> GroupRelations
        {
            get
            {
                return groupRelations;
            }
        }
        public List<CompositionRule> CompositionRules
        {
            get
            {
                return compositionRules;
            }
        }
        public List<CustomRule> CustomRules
        {
            get
            {
                return customRules;
            }
        }
        public List<CustomFunction> CustomFunctions
        {
            get
            {
                return customFunctions;
            }
        }

        // Constructors
        public FeatureModel()
        {
        }

        // Special static methods
        internal static FeatureModel CreateDefault()
        {
            FeatureModel newBLO = new FeatureModel()
            {
                Name = "Unnamed Model",
                UIOrientation= UIOrientationTypes.Vertical,
                ScaleModifier = 1
            };
            return newBLO;
        }

    }
    public class Feature : iBLO
    {
        // Fields
        protected List<Attribute> attributes = new List<Attribute>();

        // Properties
        public string Type
        {
            get
            {
                return "Feature";
            }
        }
        public string Identifier
        {
            get;
            set;
        }
        public string Name
        {
            get;
            set;
        }
        public List<Attribute> Attributes
        {
            get
            {
                return attributes;
            }
        }
        public virtual Nullable<double> XPos
        {
            get;
            set;
        }
        public virtual Nullable<double> YPos
        {
            get;
            set;
        }

        // Constructors
        public Feature()
        {
        }

        // Static instance creator
        internal static Feature CreateDefault()
        {
            Feature newBLO = new Feature()
            {
                Name = "Test name"
            };

            return newBLO;
        }
    }
    public class Attribute : iBLO
    {
        // Properties
        public string Type
        {
            get
            {
                return "Attribute";
            }
        }
        public string Identifier
        {
            get;
            set;
        }
        public AttributeTypes AttributeType
        {
            get;
            set;
        }
        public AttributeDataTypes AttributeDataType
        {
            get;
            set;
        }
        public string ConstantValue
        {
            get;
            set;
        }
        public string Name
        {
            get;
            set;
        }
        public Feature ParentFeature
        {
            get;
            set;
        }

        // Constructors
        public Attribute()
        {
        }

        // Static instance creator
        internal static Attribute CreateDefault()
        {
            Attribute newBLO = new Attribute()
            {
                Name = "Default attribute"
            };
            newBLO.AttributeType = AttributeTypes.UserInput;
            newBLO.AttributeDataType = AttributeDataTypes.Integer;
            return newBLO;
        }
    }
    public class Relation : iBLO
    {
        // Properties
        public string Type
        {
            get
            {
                return "Relation";
            }
        }
        public string Identifier
        {
            get;
            set;
        }
        public RelationTypes RelationType
        {
            get;
            set;
        }
        public Feature ParentFeature
        {
            get;
            set;
        }
        public Feature ChildFeature
        {
            get;
            set;
        }
        public int? LowerBound
        {
            get;
            set;
        }
        public int? UpperBound
        {
            get;
            set;
        }
        public int? FixedLowerBound
        {
            get;
            set;
        }
        public int? FixedUpperBound
        {
            get;
            set;
        }

        // Constructors
        public Relation()
        {
        }

        // Static instance creator
        internal static Relation CreateDefault()
        {
            // Create new BLO
            Relation newBLO = new Relation()
            {
                RelationType = RelationTypes.Mandatory
            };
            newBLO.FixedLowerBound = (int?)typeof(RelationTypes_Info).GetNestedType(newBLO.RelationType.ToString()).GetField("FixedLowerBound").GetValue(null);
            newBLO.FixedUpperBound = (int?)typeof(RelationTypes_Info).GetNestedType(newBLO.RelationType.ToString()).GetField("FixedUpperBound").GetValue(null);

            // Set default initial bounds
            newBLO.LowerBound = (newBLO.FixedLowerBound == null) ? 1 : newBLO.FixedLowerBound;
            newBLO.UpperBound = (newBLO.FixedUpperBound == null) ? 2 : newBLO.FixedUpperBound;

            return newBLO;
        }
    }
    public class GroupRelation : iBLO
    {
        // Fields
        protected List<Feature> childFeatures = new List<Feature>();

        // Properties
        public string Type
        {
            get
            {
                return "GroupRelation";
            }
        }
        public string Identifier
        {
            get;
            set;
        }
        public GroupRelationTypes GroupRelationType
        {
            get;
            set;
        }
        public Feature ParentFeature
        {
            get;
            set;
        }
        public List<Feature> ChildFeatures
        {
            get
            {
                return childFeatures;
            }
        }
        public int? UpperBound
        {
            get;
            set;
        }
        public int? LowerBound
        {
            get;
            set;
        }
        public int? FixedLowerBound
        {
            get;
            set;
        }
        public int? FixedUpperBound
        {
            get;
            set;
        }

        // Constructors
        public GroupRelation()
        {
        }

        // Static instance creator
        internal static GroupRelation CreateDefault()
        {

            // Create new BLO
            GroupRelation newBLO = new GroupRelation()
            {
                GroupRelationType = GroupRelationTypes.XOR
            };
            newBLO.FixedLowerBound = (int?)typeof(GroupRelationTypes_Info).GetNestedType(newBLO.GroupRelationType.ToString()).GetField("FixedLowerBound").GetValue(null);
            newBLO.FixedUpperBound = (int?)typeof(GroupRelationTypes_Info).GetNestedType(newBLO.GroupRelationType.ToString()).GetField("FixedUpperBound").GetValue(null);

            // Set default initial bounds
            newBLO.LowerBound = (newBLO.FixedLowerBound == null) ? 0 : newBLO.FixedLowerBound;
            newBLO.UpperBound = (newBLO.FixedUpperBound == null) ? 1 : newBLO.FixedUpperBound;

            return newBLO;
        }

    }
    public class CompositionRule : iBLO
    {
        // Properties
        public string Type
        {
            get
            {
                return "CompositionRule";
            }
        }
        public string Identifier
        {
            get;
            set;
        }
        public CompositionRuleTypes CompositionRuleType
        {
            get;
            set;
        }
        public virtual Feature FirstFeature
        {
            get;
            set;
        }
        public virtual Feature SecondFeature
        {
            get;
            set;
        }
        public virtual string Name
        {
            get;
            set;
        }
        public virtual string Description
        {
            get;
            set;
        }

        // Constructors
        public CompositionRule()
        {
        }

        // Static instance creator
        internal static CompositionRule CreateDefault()
        {
            // Create new BLO
            CompositionRule newBLO = new CompositionRule()
            {
                CompositionRuleType = CompositionRuleTypes.Dependency
            };
            return newBLO;
        }

    }
    public class CustomRule : iBLO
    {
        // Properties
        public string Type
        {
            get
            {
                return "CustomRule";
            }
        }
        public virtual string Identifier
        {
            get;
            set;
        }
        public virtual string Name
        {
            get;
            set;
        }
        public virtual string Expression
        {
            get;
            set;
        }
        public virtual string Description
        {
            get;
            set;
        }

        // Constructors
        public CustomRule()
        {
        }

        // Static instance creator
        internal static CustomRule CreateDefault()
        {
            // Create new BLO
            CustomRule newBLO = new CustomRule()
            {
                Name = "Default Custom rule"
            };
            return newBLO;
        }

    }
    public class CustomFunction : iBLO
    {
        // Properties
        public string Type
        {
            get
            {
                return "CustomFunction";
            }
        }
        public virtual string Identifier
        {
            get;
            set;
        }
        public virtual string Name
        {
            get;
            set;
        }
        public virtual string Expression
        {
            get;
            set;
        }
        public virtual string Description
        {
            get;
            set;
        }

        // Constructors
        public CustomFunction()
        {
        }

        // Static instance creator
        internal static CustomFunction CreateDefault()
        {
            // Create new BLO
            CustomFunction newBLO = new CustomFunction()
            {
                Name = "New CustomFunction"
            };
            return newBLO;
        }

    }
    public class ModelFile : iBLO
    {
        // Properties
        public string Type
        {
            get
            {
                return "ModelFile";
            }
        }
        public string Name
        {
            get;
            set;
        }

        // Constructors
        public ModelFile()
        {
        }

    }

    // Configuration BLOs
    public class Configuration : iBLO
    {
        // Fields
        private List<BLL.BusinessObjects.FeatureSelection> _featureSelections = new List<FeatureSelection>();

        // Constructor
        public Configuration()
        {
        }

        // Properties
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
        public int UITemplateID
        {
            get
            {
                return _innerEntity.UITemplateID;
            }
            set
            {
                _innerEntity.UITemplateID = value;
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
        public string UITemplateName
        {
            get
            {
                return _uiTemplateName;
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

        //Methods
        public BLL.BusinessObjects.FeatureSelection GetFeatureSelectionByFeatureID(int featureID)
        {
            BLL.BusinessObjects.FeatureSelection featureSelection = FeatureSelections.FirstOrDefault(x => x.FeatureID == featureID);
            return featureSelection;
        }
        public BLL.BusinessObjects.AttributeValue GetAttributeValueByAttributeID(int attributeID)
        {
            //Find FeatureSelection which the appropriate AttributeValue
            BLL.BusinessObjects.FeatureSelection featureSelection = FeatureSelections.FirstOrDefault(f => f.AttributeValues.FirstOrDefault(x => x.AttributeID == attributeID) != null);
            BLL.BusinessObjects.AttributeValue attributeValue = featureSelection.AttributeValues.FirstOrDefault(x => x.AttributeID == attributeID);
            return attributeValue;
        }

        //Special methods
        public static BLL.BusinessObjects.Configuration CreateInstance(DAL.DataEntities.IDataEntity innerEntity)
        {
            BLL.BusinessObjects.Configuration configuration = new BLL.BusinessObjects.Configuration((DAL.DataEntities.Configuration)innerEntity);

            //Set fields
            configuration._modelName = ((DAL.DataEntities.Configuration)innerEntity).Model.Name;
            configuration._uiTemplateName = ((DAL.DataEntities.Configuration)innerEntity).UITemplate.Name;

            return configuration;
        }
        public static BLL.BusinessObjects.Configuration CreateDefault(int modelID, int uiTemplateID)
        {
            //Create a new Model and InnerEntity
            DAL.DataEntities.IDataEntity innerEntity = new DAL.DataEntities.Configuration();
            BLL.BusinessObjects.Configuration configuration = new Configuration((DAL.DataEntities.Configuration)innerEntity);

            //Set default fields
            ((DAL.DataEntities.Configuration)configuration.InnerEntity).ModelID = modelID;
            ((DAL.DataEntities.Configuration)configuration.InnerEntity).UITemplateID = uiTemplateID;
            configuration.CreatedDate = DateTime.Now;
            configuration.LastModifiedDate = DateTime.Now;
            configuration.Name = "Configuration00";

            //Return the object instance
            return configuration;
        }
    }
    public class FeatureSelection : iBLO
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
            _innerEntity.AttributeValues.ToList().ForEach(DALentity => AttributeValues.Add(BLL.BusinessObjects.AttributeValue.CreateInstance(DALentity)));
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

        //Special methods
        public static BLL.BusinessObjects.FeatureSelection CreateInstance(DAL.DataEntities.IDataEntity innerEntity)
        {
            BLL.BusinessObjects.FeatureSelection featureSelection = new BLL.BusinessObjects.FeatureSelection((DAL.DataEntities.FeatureSelection)innerEntity);
            return featureSelection;
        }
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
    public class AttributeValue : iBLO
    {

        // Constructors
        public AttributeValue()
        {
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

        //Special methods
        public static BLL.BusinessObjects.AttributeValue CreateInstance(DAL.DataEntities.IDataEntity innerEntity)
        {
            BLL.BusinessObjects.AttributeValue attributeValue = new BLL.BusinessObjects.AttributeValue((DAL.DataEntities.AttributeValue)innerEntity);
            return attributeValue;
        }
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

    //
    public interface iBLO
    {

    }
}
