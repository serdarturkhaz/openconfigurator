using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpenConfigurator.Core.DTOs
{

    // DataObjects
    public class Model : iDTO
    {
        public virtual int ID
        {
            get;
            set;
        }
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
        public virtual int ID
        {
            get;
            set;
        }
        public virtual int ModelID
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
    }
    public class Attribute : iDTO
    {
        public virtual int ID
        {
            get;
            set;
        }
        public virtual int FeatureID
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
    public class Relation : iDTO
    {
        public virtual int ID
        {
            get;
            set;
        }
        public virtual int ModelID
        {
            get;
            set;
        }
        public virtual int RelationTypeID
        {
            get;
            set;
        }
        public virtual int ParentFeatureID
        {
            get;
            set;
        }
        public virtual int ChildFeatureID
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
        public virtual int ID
        {
            get;
            set;
        }
        public virtual int ModelID
        {
            get;
            set;
        }
        public virtual int GroupRelationTypeID
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
        public virtual int ID
        {
            get;
            set;
        }
        public virtual int ModelID
        {
            get;
            set;
        }
        public virtual int CompositionRuleTypeID
        {
            get;
            set;
        }
        public virtual int FirstFeatureID
        {
            get;
            set;
        }
        public virtual int SecondFeatureID
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
        public virtual int ID
        {
            get;
            set;
        }
        public virtual int ModelID
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
        public virtual int ID
        {
            get;
            set;
        }
        public virtual int ModelID
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

    // Interface
    public interface iDTO
    {

    }

}
