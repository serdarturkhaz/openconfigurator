using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpenConfigurator.Core.DTOs
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
    }
    public class Relation : iDTO
    {
        public virtual int RelationTypeID
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
        public virtual string Identifier
        {
            get;
            set;
        }
        public virtual Nullable<int> LowerBound
        {
            get;
            set;
        }
        public virtual Nullable<int> UpperBound
        {
            get;
            set;
        }
    }
    public class GroupRelation : iDTO
    {
        public virtual int GroupRelationType
        {
            get;
            set;
        }
        public virtual string Identifier
        {
            get;
            set;
        }
        public virtual Nullable<int> LowerBound
        {
            get;
            set;
        }
        public virtual Nullable<int> UpperBound
        {
            get;
            set;
        }
    }
    public class CompositionRule : iDTO
    {
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
        public virtual Feature SecondFeatureID
        {
            get;
            set;
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
