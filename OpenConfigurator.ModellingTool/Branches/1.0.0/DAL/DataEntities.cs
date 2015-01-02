using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace DAL.DataEntities
{
    // DataObjects
    [DataContract]
    public class FeatureModel : iDataEntity
    {
        // Fields
        protected List<Feature> features = new List<Feature>();
        protected List<Relation> relations = new List<Relation>();
        protected List<GroupRelation> groupRelations = new List<GroupRelation>();
        protected List<CompositionRule> compositionRules = new List<CompositionRule>();
        protected List<CustomRule> customRules = new List<CustomRule>();
        protected List<CustomFunction> customFunctions = new List<CustomFunction>();

        // Properties
        [DataMember(Order = 0)]
        public virtual string Name
        {
            get;
            set;
        }
        [DataMember(Order = 1)]
        public List<Feature> Features
        {
            get
            {
                return features;
            }
        }
        [DataMember(Order = 2)]
        public List<Relation> Relations
        {
            get
            {
                return relations;
            }
        }
        [DataMember(Order = 3)]
        public List<GroupRelation> GroupRelations
        {
            get
            {
                return groupRelations;
            }
        }
        [DataMember(Order = 4)]
        public List<CompositionRule> CompositionRules
        {
            get
            {
                return compositionRules;
            }
        }
        [DataMember(Order = 5)]
        public List<CustomRule> CustomRules
        {
            get
            {
                return customRules;
            }
        }
        [DataMember(Order = 6)]
        public List<CustomFunction> CustomFunctions
        {
            get
            {
                return customFunctions;
            }
        }
    }
    [DataContract]
    public class Feature : iDataEntity
    {
        // Fields
        protected List<Attribute> attributes = new List<Attribute>();

        // Properties
        [DataMember(Order = 0)]
        public string Identifier
        {
            get;
            set;
        }
        [DataMember(Order = 1)]
        public string Name
        {
            get;
            set;
        }
        [DataMember(Order = 2)]
        public List<Attribute> Attributes
        {
            get
            {
                return attributes;
            }
        }
        [DataMember(Order = 3)]
        public Nullable<double> XPos
        {
            get;
            set;
        }
        [DataMember(Order = 4)]
        public Nullable<double> YPos
        {
            get;
            set;
        }
    }
    [DataContract]
    public class Attribute : iDataEntity
    {
        [DataMember(Order = 0)]
        public string Identifier
        {
            get;
            set;
        }
        [DataMember(Order = 1)]
        public string Name
        {
            get;
            set;
        }
        [DataMember(Order = 2)]
        public string Description
        {
            get;
            set;
        }
        [DataMember(Order = 3)]
        public int AttributeType
        {
            get;
            set;
        }
        [DataMember(Order = 4)]
        public int AttributeDataType
        {
            get;
            set;
        }
        [DataMember(Order = 5)]
        public string ConstantValue
        {
            get;
            set;
        }
    }
    public class Relation : iDataEntity
    {
        public int RelationType
        {
            get;
            set;
        }
        public string Identifier
        {
            get;
            set;
        }
        public string ParentFeatureIdentifier
        {
            get;
            set;
        }
        public string ChildFeatureIdentifier
        {
            get;
            set;
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
    }
    public class GroupRelation : iDataEntity
    {
        // Fields
        protected List<string> childFeatureIdentifiers = new List<string>();

        // Properties
        public string Identifier
        {
            get;
            set;
        }
        public int GroupRelationType
        {
            get;
            set;
        }
        public Feature ParentFeature
        {
            get;
            set;
        }
        public List<string> ChildFeatureIdentifiers
        {
            get
            {
                return childFeatureIdentifiers;
            }
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
    }
    public class CompositionRule : iDataEntity
    {
        public string Identifier
        {
            get;
            set;
        }
        public int CompositionRuleType
        {
            get;
            set;
        }
        public string FirstFeatureIdentifier
        {
            get;
            set;
        }
        public string SecondFeatureIdentifier
        {
            get;
            set;
        }
        public string Name
        {
            get;
            set;
        }
        public string Description
        {
            get;
            set;
        }
    }
    public class CustomRule : iDataEntity
    {
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
        public string Expression
        {
            get;
            set;
        }
        public string Description
        {
            get;
            set;
        }
    }
    public class CustomFunction : iDataEntity
    {
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
        public string Expression
        {
            get;
            set;
        }
        public string Description
        {
            get;
            set;
        }
    }

    // Interfaces
    public interface iDataEntity
    {

    }
}
