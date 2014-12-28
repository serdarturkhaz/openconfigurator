using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.BLOs
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

    // Core BLOs
    public class FeatureModel : iBLO
    {
        // Fields
        protected DAL.DTOs.FeatureModel innerDTO;
        protected List<Feature> features = new List<Feature>();
        protected List<Relation> relations = new List<Relation>();
        protected List<CompositionRule> compositionRules = new List<CompositionRule>();

        // Properties
        public string Name
        {
            get
            {
                return innerDTO.Name;
            }
            set
            {
                innerDTO.Name = value;
            }
        }
        public List<Feature> Features
        {
            get
            {
                return features;
            }
        }

        // Constructors
        public FeatureModel()
        {

        }
        public FeatureModel(DAL.DTOs.FeatureModel dataObj)
        {
            this.innerDTO = dataObj;
        }

        // Static instance creator
        internal static FeatureModel CreateDefault()
        {
            DAL.DTOs.FeatureModel newDTO = new DAL.DTOs.FeatureModel()
            {
                Name = "New model"
            };

            FeatureModel newBLO = new FeatureModel(newDTO);
            return newBLO;
        }
    }
    public class Feature : iBLO
    {
        // Fields
        protected DAL.DTOs.Feature innerDTO;

        // Properties
        public string Identifier
        {
            get
            {
                return innerDTO.Identifier;
            }
            set
            {
                innerDTO.Identifier = value;
            }
        }
        public string Name
        {
            get
            {
                return innerDTO.Name;
            }
            set
            {
                innerDTO.Name = value;
            }
        }

        // Constructors
        public Feature()
        {

        }
        public Feature(DAL.DTOs.Feature dataObj)
        {
            this.innerDTO = dataObj;
        }

        // Static instance creator
        internal static Feature CreateDefault()
        {
            DAL.DTOs.Feature newDTO = new DAL.DTOs.Feature()
            {
                Name = "Test name"
            };

            Feature newBLO = new Feature(newDTO);
            return newBLO;
        }
    }
    public class Relation : iBLO
    {
        // Fields
        protected DAL.DTOs.Relation innerDTO;

        // Properties
        public string Identifier
        {
            get
            {
                return innerDTO.Identifier;
            }
            set
            {
                innerDTO.Identifier = value;
            }
        }
        public RelationTypes RelationType
        {
            get
            {
                return (RelationTypes)Enum.Parse(typeof(RelationTypes), ((DAL.DTOs.Relation)innerDTO).RelationTypeID.ToString());
            }
            set
            {
                innerDTO.RelationTypeID = (int)value;
            }
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
            get
            {
                return innerDTO.LowerBound;
            }
            set
            {
                innerDTO.LowerBound = value;
            }
        }
        public int? UpperBound
        {
            get
            {
                return innerDTO.UpperBound;
            }
            set
            {
                innerDTO.UpperBound = value;
            }
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
        public Relation(DAL.DTOs.Relation dataObj)
        {
            this.innerDTO = dataObj;
        }

        // Static instance creator
        internal static Relation CreateDefault()
        {
            // Create underlying DTO
            DAL.DTOs.Relation newDTO = new DAL.DTOs.Relation();

            // Create new BLO
            Relation newBLO = new Relation(newDTO)
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
        protected DAL.DTOs.GroupRelation innerDTO;

        // Properties
        public string Identifier
        {
            get
            {
                return innerDTO.Identifier;
            }
            set
            {
                innerDTO.Identifier = value;
            }
        }
        public virtual GroupRelationTypes GroupRelationType
        {
            get
            {
                return (GroupRelationTypes)Enum.Parse(typeof(GroupRelationTypes), ((DAL.DTOs.GroupRelation)innerDTO).GroupRelationTypeID.ToString());
            }
            set
            {
                innerDTO.GroupRelationTypeID = (int)value;
            }
        }
        public virtual Feature ParentFeature
        {
            get;
            set;
        }
        public virtual List<Feature> ChildFeatures
        {
            get;
            set;
        }
        public int? UpperBound
        {
            get
            {
                return innerDTO.UpperBound;
            }
            set
            {
                innerDTO.UpperBound = value;
            }
        }
        public int? LowerBound
        {
            get
            {
                return innerDTO.LowerBound;
            }
            set
            {
                innerDTO.LowerBound = value;
            }
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
            ChildFeatures = new List<Feature>();
        }
        public GroupRelation(DAL.DTOs.GroupRelation dataObj)
            : this()
        {
            this.innerDTO = dataObj;
        }

        // Static instance creator
        internal static GroupRelation CreateDefault()
        {
            // Create underlying DTO
            DAL.DTOs.GroupRelation newDTO = new DAL.DTOs.GroupRelation();

            // Create new BLO
            GroupRelation newBLO = new GroupRelation(newDTO)
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
        // Fields
        protected DAL.DTOs.CompositionRule innerDTO;

        // Properties
        public string Identifier
        {
            get
            {
                return innerDTO.Identifier;
            }
            set
            {
                innerDTO.Identifier = value;
            }
        }
        public CompositionRuleTypes CompositionRuleType
        {
            get
            {
                return (CompositionRuleTypes)Enum.Parse(typeof(CompositionRuleTypes), ((DAL.DTOs.CompositionRule)innerDTO).CompositionRuleTypeID.ToString());
            }
            set
            {
                innerDTO.CompositionRuleTypeID = (int)value;
            }
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
        public CompositionRule(DAL.DTOs.CompositionRule dataObj)
        {
            this.innerDTO = dataObj;
        }

        // Static instance creator
        internal static CompositionRule CreateDefault()
        {
            // Create underlying DTO
            DAL.DTOs.CompositionRule newDTO = new DAL.DTOs.CompositionRule();

            // Create new BLO
            CompositionRule newBLO = new CompositionRule(newDTO)
            {
                CompositionRuleType = CompositionRuleTypes.Dependency
            };
            return newBLO;
        }

    }
    public class CustomRule : iBLO
    {
        // Fields
        protected DAL.DTOs.CustomRule innerDTO;

        // Properties
        public virtual string Identifier
        {
            get
            {
                return innerDTO.Identifier;
            }
            set
            {
                innerDTO.Identifier = value;
            }
        }
        public virtual string Name
        {
            get
            {
                return innerDTO.Name;
            }
            set
            {
                innerDTO.Name = value;
            }
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
        public CustomRule(DAL.DTOs.CustomRule dataObj)
        {
            this.innerDTO = dataObj;
        }

        // Static instance creator
        internal static CustomRule CreateDefault()
        {
            // Create underlying DTO
            DAL.DTOs.CustomRule newDTO = new DAL.DTOs.CustomRule();

            // Create new BLO
            CustomRule newBLO = new CustomRule(newDTO)
            {

            };
            return newBLO;
        }

    }
    public class CustomFunction : iBLO
    {
        // Fields
        protected DAL.DTOs.CustomFunction innerDTO;

        // Properties
        public virtual string Identifier
        {
            get
            {
                return innerDTO.Identifier;
            }
            set
            {
                innerDTO.Identifier = value;
            }
        }
        public virtual string Name
        {
            get
            {
                return innerDTO.Name;
            }
            set
            {
                innerDTO.Name = value;
            }
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
        public CustomFunction(DAL.DTOs.CustomFunction dataObj)
        {
            this.innerDTO = dataObj;
        }

        // Static instance creator
        internal static CustomFunction CreateDefault()
        {
            // Create underlying DTO
            DAL.DTOs.CustomFunction newDTO = new DAL.DTOs.CustomFunction();

            // Create new BLO
            CustomFunction newBLO = new CustomFunction(newDTO)
            {

            };
            return newBLO;
        }

    }

    //
    public interface iBLO
    {

    }
}
