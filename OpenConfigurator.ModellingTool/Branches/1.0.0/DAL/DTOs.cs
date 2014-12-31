using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace DAL.DTOs
{
    // DataObjects
    public class FeatureModel : iDTO
    {
        public virtual string Name
        {
            get;
            set;
        }
        public virtual IEnumerable<Feature> Features
        {
            get;
            set;
        }
    }
    public class Feature : iDTO
    {
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
    }
    public class Attribute : iDTO
    {
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
        public virtual string Description
        {
            get;
            set;
        }
        public virtual int AttributeTypeID
        {
            get;
            set;
        }
        public virtual int AttributeDataTypeID
        {
            get;
            set;
        }

    }
    public class Relation : iDTO
    {
        public virtual int RelationTypeID
        {
            get;
            set;
        }
        public virtual string Identifier
        {
            get;
            set;
        }
        public virtual Feature ParentFeature
        {
            get;
            set;
        }
        public virtual Feature ChildFeature
        {
            get;
            set;
        }
        public virtual int? UpperBound
        {
            get;
            set;
        }
        public virtual int? LowerBound
        {
            get;
            set;
        }
    }
    public class GroupRelation : iDTO
    {
        public virtual string Identifier
        {
            get;
            set;
        }

        public virtual int GroupRelationTypeID
        {
            get;
            set;
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

        public virtual int? LowerBound
        {
            get;
            set;
        }
        public virtual int? UpperBound
        {
            get;
            set;
        }
    }
    public class CompositionRule : iDTO
    {
        public virtual string Identifier
        {
            get;
            set;
        }
        public virtual int CompositionRuleTypeID
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
    }
    public class CustomRule : iDTO
    {
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
    }
    public class CustomFunction : iDTO
    {
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
    }

    // Interfaces
    public interface iDTO
    {

    }
}
