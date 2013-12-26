using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.BLOs
{
    public class Model : OpenConfigurator.Core.BLOs.Model
    {
        // Constructors
        public Model()
        {

        }
        public Model(DAL.DTOs.Model dataObj)
            : base((OpenConfigurator.Core.DTOs.Model)dataObj)
        {
        }

        // Factory
        internal static Model CreateDefault()
        {
            DAL.DTOs.Model dataObj = new DAL.DTOs.Model();
            Model newBLO = new Model(dataObj);
            newBLO.Name = "Unnamed model";

            return newBLO;
        }

    }
    public class Feature : OpenConfigurator.Core.BLOs.Feature
    {
        // Properties
        public virtual Nullable<double> XPos
        {
            get
            {
                return ((DAL.DTOs.Feature)this.innerDTO).XPos;
            }
            set
            {
                ((DAL.DTOs.Feature)this.innerDTO).XPos = value;
            }
        }
        public virtual Nullable<double> YPos
        {
            get
            {
                return ((DAL.DTOs.Feature)this.innerDTO).YPos;
            }
            set
            {
                ((DAL.DTOs.Feature)this.innerDTO).YPos = value;
            }

        }

        // Constructors
        public Feature()
        {

        }
        public Feature(DAL.DTOs.Feature dataObj)
            : base((OpenConfigurator.Core.DTOs.Feature)dataObj)
        {
            this.Name = "Default feature";
        }

        // Factory
        internal static Feature CreateDefault()
        {
            DAL.DTOs.Feature dataObj = new DAL.DTOs.Feature();
            Feature newBLO = new Feature(dataObj);

            return newBLO;
        }
    }
    public class Relation : OpenConfigurator.Core.BLOs.Relation
    {
        // Constructors
        public Relation()
        {

        }
        public Relation(DAL.DTOs.Relation dataObj)
            : base((OpenConfigurator.Core.DTOs.Relation)dataObj)
        {
        }

        // Factory
        internal static Relation CreateDefault()
        {
            DAL.DTOs.Relation dataObj = new DAL.DTOs.Relation();
            Relation newBLO = new Relation(dataObj);

            return newBLO;
        }
    }
    public class GroupRelation : OpenConfigurator.Core.BLOs.GroupRelation
    {
        // Constructors
        public GroupRelation()
        {

        }
        public GroupRelation(DAL.DTOs.GroupRelation dataObj)
            : base((OpenConfigurator.Core.DTOs.GroupRelation)dataObj)
        {
        }

        // Factory
        internal static GroupRelation CreateDefault()
        {
            DAL.DTOs.GroupRelation dataObj = new DAL.DTOs.GroupRelation();
            GroupRelation newBLO = new GroupRelation(dataObj);

            return newBLO;
        }
    }
    public class CompositionRule : OpenConfigurator.Core.BLOs.CompositionRule
    {
        public CompositionRule()
        {

        }
        public CompositionRule(DAL.DTOs.CompositionRule dataObj)
            : base((OpenConfigurator.Core.DTOs.CompositionRule)dataObj)
        {
            
        }

        // Factory
        internal static CompositionRule CreateDefault()
        {
            DAL.DTOs.CompositionRule dataObj = new DAL.DTOs.CompositionRule();
            CompositionRule newBLO = new CompositionRule(dataObj);
            newBLO.Name = "default comp rule";

            return newBLO;
        }
    }
    public class CustomRule : OpenConfigurator.Core.BLOs.CustomRule
    {
        public CustomRule()
        {

        }
        public CustomRule(DAL.DTOs.CustomRule dataObj)
            : base((OpenConfigurator.Core.DTOs.CustomRule)dataObj)
        {

        }

        // Factory
        internal static CustomRule CreateDefault()
        {
            DAL.DTOs.CustomRule dataObj = new DAL.DTOs.CustomRule();
            CustomRule newBLO = new CustomRule(dataObj);
            newBLO.Name = "default custom function";

            return newBLO;
        }
    }
    public class CustomFunction : OpenConfigurator.Core.BLOs.CustomFunction
    {
        public CustomFunction()
        {

        }
        public CustomFunction(DAL.DTOs.CustomFunction dataObj)
            : base((OpenConfigurator.Core.DTOs.CustomFunction)dataObj)
        {

        }

        // Factory
        internal static CustomFunction CreateDefault()
        {
            DAL.DTOs.CustomFunction dataObj = new DAL.DTOs.CustomFunction();
            CustomFunction newBLO = new CustomFunction(dataObj);
            newBLO.Name = "default custom function";

            return newBLO;
        }
    }
}
