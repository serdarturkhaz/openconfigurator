using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpenConfigurator.Core.DTOs;

namespace OpenConfigurator.Core.BLOs
{
    // Enums
    public enum RelationTypes
    {
        Mandatory,
        Optional,
        Cloneable
    };
    public enum GroupRelationTypes
    {
        OR,
        XOR,
        Cardinal
    };

    // Core BLOs
    public class FeatureModel : iBLO
    {
        // Fields
        protected DTOs.FeatureModel innerDTO;
        protected List<Feature> features;

        // Properties
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
        public virtual List<Feature> Features
        {
            get
            {
                return features;
            }
            set
            {
                features = value;
            }
        }

        // Constructors
        public FeatureModel()
        {

        }
        public FeatureModel(DTOs.FeatureModel dataObj)
        {
            this.innerDTO = dataObj;
        }
    }
    public class Feature : iBLO
    {
        // Fields
        protected DTOs.Feature innerDTO;

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

        // Constructors
        public Feature()
        {

        }
        public Feature(DTOs.Feature dataObj)
        {
            this.innerDTO = dataObj;
        }
    }
    public class Relation : iBLO
    {
        // Fields
        protected DTOs.Relation innerDTO;

        // Properties
        public virtual RelationTypes RelationType
        {
            get
            {
                return (RelationTypes) Enum.Parse(typeof(RelationTypes), ((OpenConfigurator.Core.DTOs.Relation)innerDTO).RelationTypeID.ToString());
            }
            set
            {
                innerDTO.RelationTypeID = (int)value;
            }
        }
        public virtual Feature ChildFeature
        {
            get;
            set;
        }
        public virtual Feature ParentFeature
        {
            get;
            set;
        }

        // Constructors
        public Relation()
        {

        }
        public Relation(DTOs.Relation dataObj)
        {
            this.innerDTO = dataObj;
        }
    }
    public class GroupRelation : iBLO
    {
        // Fields
        protected DTOs.GroupRelation innerDTO;

        // Constructors
        public GroupRelation()
        {

        }
        public GroupRelation(DTOs.GroupRelation dataObj)
        {
            this.innerDTO = dataObj;
        }

    }
    public class CompositionRule : iBLO
    {
        // Fields
        protected DTOs.CompositionRule innerDTO;

        // Properties
        //public virtual int CompositionRuleTypeID
        //{
        //    get
        //    {
        //        return innerDTO.CompositionRuleTypeID;
        //    }
        //    set
        //    {
        //        innerDTO.CompositionRuleTypeID = value;
        //    }
        //}
        //public virtual int FirstFeature
        //{
        //    get
        //    {
        //        return innerDTO.FirstFeatureID;
        //    }
        //    set
        //    {
        //        innerDTO.FirstFeatureID = value;
        //    }
        //}
        //public virtual int SecondFeature
        //{
        //    get
        //    {
        //        return innerDTO.SecondFeatureID;
        //    }
        //    set
        //    {
        //        innerDTO.SecondFeatureID = value;
        //    }
        //}
        //public virtual string Identifier
        //{
        //    get
        //    {
        //        return innerDTO.Identifier;
        //    }
        //    set
        //    {
        //        innerDTO.Identifier = value;
        //    }
        //}
        //public virtual string Name
        //{
        //    get
        //    {
        //        return innerDTO.Name;
        //    }
        //    set
        //    {
        //        innerDTO.Name = value;
        //    }
        //}
        //public virtual string Description
        //{
        //    get
        //    {
        //        return innerDTO.Description;
        //    }
        //    set
        //    {
        //        innerDTO.Description = value;
        //    }
        //}

        // Constructors
        public CompositionRule()
        {

        }
        public CompositionRule(DTOs.CompositionRule dataObj)
        {
            this.innerDTO = dataObj;
        }
    }

    public class CustomRule : iBLO
    {
        // Fields
        protected DTOs.CustomRule innerDTO;

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

        // Constructors
        public CustomRule()
        {

        }
        public CustomRule(DTOs.CustomRule dataObj)
        {
            this.innerDTO = dataObj;
        }
    }
    public class CustomFunction : iBLO
    {
        // Fields
        protected DTOs.CustomFunction innerDTO;

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

        // Constructors
        public CustomFunction()
        {

        }
        public CustomFunction(DTOs.CustomFunction dataObj)
        {
            this.innerDTO = dataObj;
        }
    }

    //
    public interface iBLO
    {

    }
}
