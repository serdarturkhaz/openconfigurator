using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;
using OpenConfigurator;

namespace DAL.DTOs
{

    public class Model : OpenConfigurator.Core.DTOs.Model
    {
    }
    public class Feature : OpenConfigurator.Core.DTOs.Feature
    {
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
    public class Attribute : OpenConfigurator.Core.DTOs.Attribute
    {

    }
    public class Relation : OpenConfigurator.Core.DTOs.Relation
    {

    }
    public class GroupRelation : OpenConfigurator.Core.DTOs.GroupRelation
    {

    }
    public class CompositionRule : OpenConfigurator.Core.DTOs.CompositionRule
    {

    }
    public class CustomRule : OpenConfigurator.Core.DTOs.CustomRule
    {

    }
    public class CustomFunction : OpenConfigurator.Core.DTOs.CustomFunction
    {

    }
}
