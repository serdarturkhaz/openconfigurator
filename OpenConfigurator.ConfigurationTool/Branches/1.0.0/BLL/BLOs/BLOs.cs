using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;

namespace OpenConfigurator.ConfigurationTool.BLL.BLOs
{
    // Enums
    public enum FeatureSelectionStates
    {
        Selected = 1,
        Deselected = 2,
        Unselected = 3
    }

    // BLOs
    public class ConfigurationInstance : iBLO
    {
        // Fields
        protected List<FeatureSelection> featureSelections = new List<FeatureSelection>();

        // Properties
        public List<FeatureSelection> FeatureSelections
        {
            get
            {
                return featureSelections;
            }
        }

        // Constructor
        public ConfigurationInstance()
        {
        }

        // Public Methods
        public FeatureSelection GetFeatureSelectionByFeatureID(int featureID)
        {
            //BLL.BusinessObjects.FeatureSelection featureSelection = FeatureSelections.FirstOrDefault(x => x.FeatureID == featureID);
            //return featureSelection;

            return null;
        }
        public AttributeValue GetAttributeValueByAttributeID(int attributeID)
        {
            ////Find FeatureSelection which the appropriate AttributeValue
            //BLL.BusinessObjects.FeatureSelection featureSelection = FeatureSelections.FirstOrDefault(f => f.AttributeValues.FirstOrDefault(x => x.AttributeID == attributeID) != null);
            //BLL.BusinessObjects.AttributeValue attributeValue = featureSelection.AttributeValues.FirstOrDefault(x => x.AttributeID == attributeID);
            //return attributeValue;

            return null;
        }

        // Static instance creator
        internal static ConfigurationInstance CreateDefault()
        {
            ConfigurationInstance newBLO = new ConfigurationInstance()
            {
                
            };

            return newBLO;
        }

    }
    public class FeatureSelection : iBLO
    {
        // Fields
        protected List<AttributeValue> attributeValues = new List<AttributeValue>();

        // Properties
        public int FeatureID
        {
            get;
            set;
        }
        public FeatureSelectionStates SelectionState
        {
            get;
            set;
        }
        public bool? Disabled
        {
            get;
            set;
        }
        public bool? ToggledByUser
        {
            get;
            set;
        }
        public List<AttributeValue> AttributeValues
        {
            get
            {
                return attributeValues;
            }
        }

        // Constructor
        public FeatureSelection()
        {
        }

        // Static instance creator
        internal static FeatureSelection CreateDefault()
        {
            FeatureSelection newBLO = new FeatureSelection()
            {
                SelectionState = FeatureSelectionStates.Unselected,
                Disabled = false,
                ToggledByUser = false
            };

            return newBLO;
        }
    }
    public class AttributeValue : iBLO
    {

        // Properties
        public int FeatureSelection
        {
            get;
            set;
        }
        public int AttributeID
        {
            get;
            set;
        }
        public string Value
        {
            get;
            set;
        }

        // Constructor
        public AttributeValue()
        {
        }

        // Static instance creator
        internal static AttributeValue CreateDefault()
        {
            AttributeValue newBLO = new AttributeValue()
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
