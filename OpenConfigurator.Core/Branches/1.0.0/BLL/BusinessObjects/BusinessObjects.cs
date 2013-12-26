// Developed by OpenConfigurator Core Team
// 
// Distributed under the MIT license
// ===========================================================
// Copyright (c) 2012 - Radu Mitache
// Edited by: Josef A. Habdank
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, 
// publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR 
// OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR 
// OTHER DEALINGS IN THE SOFTWARE.
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Xml.Serialization;

namespace BLL.BusinessObjects
{
    // Enums
    public enum RelationTypes
    {
        Mandatory = 1,
        Optional = 2,
        Cloneable = 3
    }
    public enum GroupRelationTypes
    {
        OR = 1,
        XOR = 2,
        Cardinal = 3
    }
    public enum AttributeTypes
    {
        Constant = 1,
        Dynamic = 2,
        UserInput = 3
    }
    public enum AttributeDataTypes
    {
        Integer = 1,
        Boolean = 2,
        String = 3
    }
    public enum CompositionRuleTypes
    {
        Dependency = 1,
        MutualDependency = 2,
        MutualExclusion = 3
    }

    // Model stuff
    public class Model : IBusinessObject
    {
        //Fields
        private DAL.DataEntities.Model _innerEntity;
        private List<BLL.BusinessObjects.Feature> _features = new List<Feature>();
        private List<BLL.BusinessObjects.Relation> _relations = new List<Relation>();
        private List<BLL.BusinessObjects.GroupRelation> _groupRelations = new List<GroupRelation>();
        private List<BLL.BusinessObjects.CompositionRule> _compositionRules = new List<CompositionRule>();
        private List<BLL.BusinessObjects.CustomRule> _customRules = new List<CustomRule>();
        private List<BLL.BusinessObjects.CustomFunction> _customFunctions = new List<CustomFunction>();
        private bool _toBeDeleted = false;

        //Constructor
        public Model()
        {
            _innerEntity = new DAL.DataEntities.Model();
        }
        internal Model(DAL.DataEntities.Model innerEntity)
        {
            this._innerEntity = innerEntity;

            //Create BLL collections
            _innerEntity.Features.ToList().ForEach(DALentity => Features.Add(BLL.BusinessObjects.Feature.CreateInstance(DALentity)));
            _innerEntity.Relations.ToList().ForEach(DALentity => Relations.Add(BLL.BusinessObjects.Relation.CreateInstance(DALentity)));
            _innerEntity.GroupRelations.ToList().ForEach(DALentity => GroupRelations.Add(BLL.BusinessObjects.GroupRelation.CreateInstance(DALentity)));
            _innerEntity.CompositionRules.ToList().ForEach(DALentity => CompositionRules.Add(BLL.BusinessObjects.CompositionRule.CreateInstance(DALentity)));
            _innerEntity.CustomRules.ToList().ForEach(DALentity => CustomRules.Add(BLL.BusinessObjects.CustomRule.CreateInstance(DALentity)));
            _innerEntity.CustomFunctions.ToList().ForEach(DALentity => CustomFunctions.Add(BLL.BusinessObjects.CustomFunction.CreateInstance(DALentity)));
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
        public List<BLL.BusinessObjects.Feature> Features
        {
            get
            {
                return _features;
            }
            set
            {
                _features = value;
            }
        }
        public List<BLL.BusinessObjects.Relation> Relations
        {
            get
            {
                return _relations;
            }
            set
            {
                _relations = value;
            }
        }
        public List<BLL.BusinessObjects.GroupRelation> GroupRelations
        {
            get
            {
                return _groupRelations;
            }
            set
            {
                _groupRelations = value;
            }
        }
        public List<BLL.BusinessObjects.CompositionRule> CompositionRules
        {
            get
            {
                return _compositionRules;
            }
            set
            {
                _compositionRules = value;
            }
        }
        public List<BLL.BusinessObjects.CustomRule> CustomRules
        {
            get
            {
                return _customRules;
            }
            set
            {
                _customRules = value;
            }
        }
        public List<BLL.BusinessObjects.CustomFunction> CustomFunctions
        {
            get
            {
                return _customFunctions;
            }
            set
            {
                _customFunctions = value;
            }
        }

        //Methods
        public List<BLL.BusinessObjects.Feature> GetChildFeatures(BLL.BusinessObjects.Feature targetFeature)
        {
            //Return child Features part of Relations and GroupRelations
            List<BLL.BusinessObjects.Feature> childrenFromRelations = Features.FindAll(f => Relations.FirstOrDefault(r => r.ParentFeatureID == targetFeature.ID && r.ChildFeatureID == f.ID) != null);
            List<BLL.BusinessObjects.Feature> childrenFromGroupRelations = Features.FindAll(f => GroupRelations.FirstOrDefault(r => r.ParentFeatureID == targetFeature.ID && r.ChildFeatureIDs.Contains(f.ID)) != null);

            //
            return childrenFromRelations.Union(childrenFromGroupRelations).ToList();
        }
        public List<BLL.BusinessObjects.Feature> GetDescendantFeatures(BLL.BusinessObjects.Feature targetFeature)
        {
            //Variables
            List<BLL.BusinessObjects.Feature> descendants = new List<Feature>();
            BLL.BusinessObjects.Feature feature = targetFeature;

            //Recursively get children
            List<BLL.BusinessObjects.Feature> children = GetChildFeatures(feature);
            descendants.AddRange(children);
            foreach (BLL.BusinessObjects.Feature childFeature in children)
            {
                descendants.AddRange(GetDescendantFeatures(childFeature));
            }

            return descendants;
        }
        public BLL.BusinessObjects.Feature GetRootFeature()
        {
            BLL.BusinessObjects.Feature rootFeature = Features.FirstOrDefault(f => Relations.FirstOrDefault(r => r.ChildFeatureID == f.ID) == null);
            return rootFeature;
        }
        public BLL.BusinessObjects.Feature GetFeatureByName(string name)
        {
            BLL.BusinessObjects.Feature feature = Features.FirstOrDefault(x => x.Name == name);
            return feature;
        }
        public BLL.BusinessObjects.Feature GetFeatureByID(int id)
        {
            BLL.BusinessObjects.Feature feature = Features.FirstOrDefault(x => x.ID == id);
            return feature;
        }
        public BLL.BusinessObjects.Feature GetFeatureByIdentifier(string identifier)
        {
            BLL.BusinessObjects.Feature feature = Features.FirstOrDefault(x => x.Identifier == identifier);
            return feature;
        }
        public BLL.BusinessObjects.Attribute GetAttributeByName(BLL.BusinessObjects.Feature feature, string name)
        {
            BLL.BusinessObjects.Attribute attribute = feature.Attributes.FirstOrDefault(x => x.Name == name);
            return attribute;
        }
        public BLL.BusinessObjects.Attribute GetAttributeByIdentifier(BLL.BusinessObjects.Feature feature, string identifier)
        {
            BLL.BusinessObjects.Attribute attribute = feature.Attributes.FirstOrDefault(x => x.Identifier == identifier);
            return attribute;
        }

        //Special methods
        public static BLL.BusinessObjects.Model CreateInstance(DAL.DataEntities.IDataEntity innerEntity)
        {
            BLL.BusinessObjects.Model model = new BLL.BusinessObjects.Model((DAL.DataEntities.Model)innerEntity);
            return model;
        }
        public static BLL.BusinessObjects.Model CreateDefault(int userId)
        {
            //Create a new Model and InnerEntity
            DAL.DataEntities.IDataEntity innerEntity = new DAL.DataEntities.Model();
            BLL.BusinessObjects.Model model = new Model((DAL.DataEntities.Model)innerEntity);

            //Set default fields
            model.CreatedDate = DateTime.Now;
            model.LastModifiedDate = DateTime.Now;
            model.Name = "Default Model";

            //Set inner entity fields
            ((DAL.DataEntities.Model)model.InnerEntity).UserID = userId;

            //Return the object instance
            return model;
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
                this._innerEntity = (DAL.DataEntities.Model)value;
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
    public class Attribute : IBusinessObject
    {
        //Fields
        private DAL.DataEntities.Attribute _innerEntity;
        private BLL.BusinessObjects.Feature _parentFeature;
        private bool _toBeDeleted = false;

        //Constructor
        public Attribute()
        {
            _innerEntity = new DAL.DataEntities.Attribute();
        }
        internal Attribute(DAL.DataEntities.Attribute innerEntity)
        {
            this._innerEntity = innerEntity;
        }
        internal Attribute(DAL.DataEntities.Attribute innerEntity, BLL.BusinessObjects.Feature parentFeature)
        {
            this._innerEntity = innerEntity;
            this._parentFeature = parentFeature;
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
        public string Identifier
        {
            get
            {
                return _innerEntity.Identifier;
            }
            set
            {
                _innerEntity.Identifier = value;
            }
        }
        public string Description
        {
            get
            {
                return _innerEntity.Description;
            }
            set
            {
                _innerEntity.Description = value;
            }
        }
        public string ConstantValue
        {
            get
            {
                return _innerEntity.ConstantValue;
            }
            set
            {
                _innerEntity.ConstantValue = value;
            }
        }
        public AttributeTypes AttributeType
        {
            get
            {
                return (AttributeTypes)Enum.Parse(typeof(AttributeTypes), _innerEntity.AttributeTypeID.ToString());
            }
            set
            {
                _innerEntity.AttributeTypeID = (int)value;
            }
        }
        public AttributeDataTypes AttributeDataType
        {
            get
            {
                return (AttributeDataTypes)Enum.Parse(typeof(AttributeDataTypes), _innerEntity.DataTypeID.ToString());
            }
            set
            {
                _innerEntity.DataTypeID = (int)value;
            }
        }
        [JsonIgnore]
        [XmlIgnore]
        public Feature ParentFeature
        {
            get
            {
                return _parentFeature;
            }
            set
            {
                _parentFeature = value;
            }
        }

        //Special methods
        public static BLL.BusinessObjects.Attribute CreateInstance(DAL.DataEntities.IDataEntity innerEntity)
        {
            BLL.BusinessObjects.Attribute attribute = new BLL.BusinessObjects.Attribute((DAL.DataEntities.Attribute)innerEntity);
            return attribute;
        }
        public static BLL.BusinessObjects.Attribute CreateInstance(DAL.DataEntities.IDataEntity innerEntity, BLL.BusinessObjects.Feature parentFeature)
        {
            BLL.BusinessObjects.Attribute attribute = new BLL.BusinessObjects.Attribute((DAL.DataEntities.Attribute)innerEntity, parentFeature);
            return attribute;
        }
        public static BLL.BusinessObjects.Attribute CreateDefault()
        {
            //Create a new Feature and InnerEntity
            DAL.DataEntities.IDataEntity innerEntity = new DAL.DataEntities.Attribute();
            BLL.BusinessObjects.Attribute attribute = new BLL.BusinessObjects.Attribute((DAL.DataEntities.Attribute)innerEntity);

            //Set default fields
            attribute.Name = "New Attribute";
            attribute.AttributeType = AttributeTypes.UserInput;
            attribute.AttributeDataType = AttributeDataTypes.Integer;

            //Return the object instance
            return attribute;
        }

        //Interface members
        #region IBusinessObject Members
        [JsonIgnore]
        [XmlIgnore]
        public DAL.DataEntities.IDataEntity InnerEntity
        {
            get
            {
                return this._innerEntity;
            }
            set
            {
                this._innerEntity = (DAL.DataEntities.Attribute)value;
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

        [JsonIgnore]
        public string SlvMapIdentifier
        {
            get
            {
                return this.ParentFeature.Identifier + "_" + this.Identifier;
            }
        }
        #endregion
    }
    public class Feature : IBusinessObject
    {
        //Fields
        private DAL.DataEntities.Feature _innerEntity;
        private List<BLL.BusinessObjects.Attribute> _attributes = new List<Attribute>();
        private bool _toBeDeleted = false;

        //Constructor
        public Feature()
        {
            this._innerEntity = new DAL.DataEntities.Feature();
        }
        internal Feature(DAL.DataEntities.Feature innerEntity)
        {
            this._innerEntity = innerEntity;

            //Create BLL collections
            _innerEntity.Attributes.ToList().ForEach(DALentity => Attributes.Add(BLL.BusinessObjects.Attribute.CreateInstance(DALentity, this)));
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
        public string Identifier
        {
            get
            {
                return _innerEntity.Identifier;
            }
            set
            {
                _innerEntity.Identifier = value;
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
        public string Description
        {
            get
            {
                return _innerEntity.Description;
            }
            set
            {
                _innerEntity.Description = value;
            }
        }
        public bool? IsRoot
        {
            get
            {
                if (_innerEntity.IsRoot != null)
                    return _innerEntity.IsRoot;
                else
                    return false;
            }
        }
        public Nullable<double> XPos
        {
            get
            {
                return _innerEntity.XPos;
            }
            set
            {
                _innerEntity.XPos = value;
            }
        }
        public Nullable<double> YPos
        {
            get
            {
                return _innerEntity.YPos;
            }
            set
            {
                _innerEntity.YPos = value;
            }
        }
        public List<BLL.BusinessObjects.Attribute> Attributes
        {
            get
            {
                return _attributes;
            }
            set
            {
                _attributes = value;
            }
        }

        //Special methods
        public static BLL.BusinessObjects.Feature CreateInstance(DAL.DataEntities.IDataEntity innerEntity)
        {
            BLL.BusinessObjects.Feature feature = new BLL.BusinessObjects.Feature((DAL.DataEntities.Feature)innerEntity);
            return feature;
        }
        public static BLL.BusinessObjects.Feature CreateDefault()
        {
            //Create a new Feature and InnerEntity
            DAL.DataEntities.IDataEntity innerEntity = new DAL.DataEntities.Feature();
            BLL.BusinessObjects.Feature feature = new Feature((DAL.DataEntities.Feature)innerEntity);

            //Set default fields
            feature.Name = "New Feature";

            //Return the object instance
            return feature;
        }
 
        //Interface members
        #region IBusinessObject Members
        [JsonIgnore]
        [XmlIgnore]
        public DAL.DataEntities.IDataEntity InnerEntity
        {
            get
            {
                return this._innerEntity;
            }
            set
            {
                this._innerEntity = (DAL.DataEntities.Feature)value;
            }
        }
        [XmlIgnore]
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

        [JsonIgnore]
        public string SlvMapIdentifier
        {
            get
            {
                return this.Identifier;
            }
        }
        #endregion
    }
    public class Relation : IBusinessObject
    {
        //Fields
        private DAL.DataEntities.Relation _innerEntity;
        private BLL.BusinessObjects.Feature _parentFeature, _childFeature;
        private bool _toBeDeleted = false;

        //Constructor
        public Relation()
        {
            _innerEntity = new DAL.DataEntities.Relation();
        }
        internal Relation(DAL.DataEntities.Relation innerEntity)
        {
            this._innerEntity = innerEntity;

            //Get ref to parent and child features 
            if (_innerEntity.ChildFeature != null && _innerEntity.ParentFeature != null)
            {
                _parentFeature = BLL.BusinessObjects.Feature.CreateInstance(_innerEntity.ParentFeature);
                _childFeature = BLL.BusinessObjects.Feature.CreateInstance(_innerEntity.ChildFeature);
            }
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
        public RelationTypes RelationType
        {
            get
            {
                return (RelationTypes)Enum.Parse(typeof(RelationTypes), _innerEntity.RelationTypeID.ToString());
            }
            set
            {
                _innerEntity.RelationTypeID = (int)value;
            }
        }
        public int ChildFeatureID
        {
            get
            {
                return _innerEntity.ChildFeatureID;
            }
            set
            {
                _innerEntity.ChildFeatureID = value;
            }
        }
        public int ParentFeatureID
        {
            get
            {
                return _innerEntity.ParentFeatureID;
            }
            set
            {
                _innerEntity.ParentFeatureID = value;
            }
        }
        public Nullable<int> LowerBound
        {
            get { return _innerEntity.LowerBound; }
            set { _innerEntity.LowerBound = value; }
        }
        public Nullable<int> UpperBound
        {
            get { return _innerEntity.UpperBound; }
            set { _innerEntity.UpperBound = value; }
        }
        [JsonIgnore]
        public Feature ParentFeature
        {
            get
            {
                return _parentFeature;
            }
            set
            {
                _parentFeature = value;
            }
        }
        [JsonIgnore]
        public Feature ChildFeature
        {
            get
            {
                return _childFeature;
            }
            set
            {
                _childFeature = value;
            }
        }

        //Special methods
        public static BLL.BusinessObjects.Relation CreateInstance(DAL.DataEntities.IDataEntity innerEntity)
        {
            BLL.BusinessObjects.Relation relation = new BLL.BusinessObjects.Relation((DAL.DataEntities.Relation)innerEntity);
            return relation;
        }
        public static BLL.BusinessObjects.Relation CreateDefault()
        {
            //Create a new Relation and InnerEntity
            DAL.DataEntities.IDataEntity innerEntity = new DAL.DataEntities.Relation();
            BLL.BusinessObjects.Relation relation = new Relation((DAL.DataEntities.Relation)innerEntity);

            //Set default fields
            relation.RelationType = RelationTypes.Mandatory;
            relation.LowerBound = 1;
            relation.UpperBound = 1;

            //Return the object instance
            return relation;
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
                this._innerEntity = (DAL.DataEntities.Relation)value;
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

        [JsonIgnore]
        public string SlvMapIdentifier
        {
            get
            {
                return this.GetType().Name + "_" + this.ID;
            }
        }
        #endregion
    }
    public class GroupRelation : IBusinessObject
    {
        //Fields
        private DAL.DataEntities.GroupRelation _innerEntity;
        private BLL.BusinessObjects.Feature _parentFeature;
        private List<BLL.BusinessObjects.Feature> _childFeatures;
        private bool _toBeDeleted = false;
        private int _parentFeatureID = 0;
        private List<int> _childFeatureIDs;

        //Constructor
        public GroupRelation()
        {
            _innerEntity = new DAL.DataEntities.GroupRelation();
            _childFeatureIDs = new List<int>();
        }
        internal GroupRelation(DAL.DataEntities.GroupRelation innerEntity)
        {
            this._innerEntity = innerEntity;
            _childFeatures = new List<Feature>();
            _childFeatureIDs = new List<int>();

            //Get ref to parent feature
            if (innerEntity.GroupRelations_To_Features != null && innerEntity.GroupRelations_To_Features.Count > 0)
            {
                _parentFeatureID = innerEntity.GroupRelations_To_Features.ToArray()[0].ParentFeatureID;
                _parentFeature = BLL.BusinessObjects.Feature.CreateInstance(innerEntity.GroupRelations_To_Features.ToArray()[0].ParentFeature);
            }
            //Get ref to child features
            foreach (DAL.DataEntities.GroupRelation_To_Feature DALgroupRelationToFeature in innerEntity.GroupRelations_To_Features)
            {
                _childFeatures.Add(BLL.BusinessObjects.Feature.CreateInstance(DALgroupRelationToFeature.ChildFeature));
                _childFeatureIDs.Add(DALgroupRelationToFeature.ChildFeatureID);
            }
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
        public GroupRelationTypes GroupRelationType
        {
            get
            {
                return (GroupRelationTypes)Enum.Parse(typeof(RelationTypes), _innerEntity.GroupRelationTypeID.ToString());
            }
            set
            {
                _innerEntity.GroupRelationTypeID = (int)value;
            }
        }
        public int ParentFeatureID
        {
            get
            {
                return _parentFeatureID;
            }
            set
            {
                _parentFeatureID = value;
            }
        }
        public List<int> ChildFeatureIDs
        {
            get
            {
                return _childFeatureIDs;
            }
            set
            {
                _childFeatureIDs = value;

            }
        }
        public Nullable<int> LowerBound
        {
            get { return _innerEntity.LowerBound; }
            set { _innerEntity.LowerBound = value; }
        }
        public Nullable<int> UpperBound
        {
            get { return _innerEntity.UpperBound; }
            set { _innerEntity.UpperBound = value; }
        }
        [JsonIgnore]
        public BLL.BusinessObjects.Feature ParentFeature
        {
            get { return _parentFeature; }
            set { _parentFeature = value; }
        }
        [JsonIgnore]
        public List<BLL.BusinessObjects.Feature> ChildFeatures
        {
            get { return _childFeatures; }
            set { _childFeatures = value; }
        }

        //Special methods
        public static BLL.BusinessObjects.GroupRelation CreateInstance(DAL.DataEntities.IDataEntity innerEntity)
        {
            BLL.BusinessObjects.GroupRelation groupRelation = new BLL.BusinessObjects.GroupRelation((DAL.DataEntities.GroupRelation)innerEntity);


            return groupRelation;
        }
        public static BLL.BusinessObjects.GroupRelation CreateDefault()
        {
            //Create a new Feature and InnerEntity
            DAL.DataEntities.IDataEntity innerEntity = new DAL.DataEntities.GroupRelation();
            BLL.BusinessObjects.GroupRelation groupRelation = new GroupRelation((DAL.DataEntities.GroupRelation)innerEntity);

            //Set default fields
            groupRelation.GroupRelationType = GroupRelationTypes.XOR;
            groupRelation.LowerBound = 1;
            groupRelation.UpperBound = 1;

            //Return the object instance
            return groupRelation;
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
                this._innerEntity = (DAL.DataEntities.GroupRelation)value;
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

        [JsonIgnore]
        public string SlvMapIdentifier
        {
            get
            {
                return this.GetType().Name + "_" + this.ID;
            }
        }
        #endregion
    }
    public class CompositionRule : IBusinessObject
    {
        //Fields
        private DAL.DataEntities.CompositionRule _innerEntity;
        private BLL.BusinessObjects.Feature _firstFeature, _secondFeature;
        private bool _toBeDeleted = false;

        //Constructor
        public CompositionRule()
        {
            _innerEntity = new DAL.DataEntities.CompositionRule();
        }
        internal CompositionRule(DAL.DataEntities.CompositionRule innerEntity)
        {
            this._innerEntity = innerEntity;

            //Get ref to parent and child features 
            if (_innerEntity.FirstFeature != null && _innerEntity.SecondFeature != null)
            {
                _firstFeature = BLL.BusinessObjects.Feature.CreateInstance(_innerEntity.FirstFeature);
                _secondFeature = BLL.BusinessObjects.Feature.CreateInstance(_innerEntity.SecondFeature);
            }
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
        public CompositionRuleTypes CompositionRuleType
        {
            get
            {
                return (CompositionRuleTypes)Enum.Parse(typeof(CompositionRuleTypes), _innerEntity.CompositionRuleTypeID.ToString());
            }
            set
            {
                _innerEntity.CompositionRuleTypeID = (int)value;
            }
        }
        public int FirstFeatureID
        {
            get
            {
                return _innerEntity.FirstFeatureID;
            }
            set
            {
                _innerEntity.FirstFeatureID = value;
            }
        }
        public int SecondFeatureID
        {
            get
            {
                return _innerEntity.SecondFeatureID;
            }
            set
            {
                _innerEntity.SecondFeatureID = value;
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
        public string Description
        {
            get
            {
                return _innerEntity.Description;
            }
            set
            {
                _innerEntity.Description = value;
            }
        }
        [JsonIgnore]
        public Feature FirstFeature
        {
            get
            {
                return _firstFeature;
            }
            set
            {
                _firstFeature = value;
            }
        }
        [JsonIgnore]
        public Feature SecondFeature
        {
            get
            {
                return _secondFeature;
            }
            set
            {
                _secondFeature = value;
            }
        }

        //Special methods
        public static BLL.BusinessObjects.CompositionRule CreateInstance(DAL.DataEntities.IDataEntity innerEntity)
        {
            BLL.BusinessObjects.CompositionRule compositionRule = new BLL.BusinessObjects.CompositionRule((DAL.DataEntities.CompositionRule)innerEntity);
            return compositionRule;
        }
        public static BLL.BusinessObjects.CompositionRule CreateDefault()
        {
            //Create a new CompositionRule and InnerEntity
            DAL.DataEntities.IDataEntity innerEntity = new DAL.DataEntities.CompositionRule();
            BLL.BusinessObjects.CompositionRule compositionRule = new CompositionRule((DAL.DataEntities.CompositionRule)innerEntity);

            //Set default fields
            compositionRule.CompositionRuleType = CompositionRuleTypes.Dependency;
            compositionRule.Name = "Default rule";

            //Return the object instance
            return compositionRule;
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
                this._innerEntity = (DAL.DataEntities.CompositionRule)value;
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

        [JsonIgnore]
        public string SlvMapIdentifier
        {
            get
            {
                return this.GetType().Name + "_" + this.ID;
            }
        }
        #endregion
    }
    public class CustomRule : IBusinessObject
    {
        //Fields
        private DAL.DataEntities.CustomRule _innerEntity;
        private bool _toBeDeleted = false;

        //Constructor
        public CustomRule()
        {
            _innerEntity = new DAL.DataEntities.CustomRule();
        }
        internal CustomRule(DAL.DataEntities.CustomRule innerEntity)
        {
            this._innerEntity = innerEntity;
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
        public string Identifier
        {
            get
            {
                return _innerEntity.Identifier;
            }
            set
            {
                _innerEntity.Identifier = value;
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
        public string Description
        {
            get
            {
                return _innerEntity.Description;
            }
            set
            {
                _innerEntity.Description = value;
            }
        }
        public string Expression
        {
            get
            {
                return _innerEntity.Expression;
            }
            set
            {
                _innerEntity.Expression = value;
            }
        }

        //Special methods
        public static BLL.BusinessObjects.CustomRule CreateInstance(DAL.DataEntities.IDataEntity innerEntity)
        {
            BLL.BusinessObjects.CustomRule customRule = new BLL.BusinessObjects.CustomRule((DAL.DataEntities.CustomRule)innerEntity);
            return customRule;
        }
        public static BLL.BusinessObjects.CustomRule CreateDefault()
        {
            //Create a new CustomRule and InnerEntity
            DAL.DataEntities.IDataEntity innerEntity = new DAL.DataEntities.CustomRule();
            BLL.BusinessObjects.CustomRule customRule = new CustomRule((DAL.DataEntities.CustomRule)innerEntity);

            //Set default fields
            customRule.Name = "Default rule";

            //Return the object instance
            return customRule;
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
                this._innerEntity = (DAL.DataEntities.CustomRule)value;
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

        [JsonIgnore]
        public string SlvMapIdentifier
        {
            get
            {
                return this.GetType().Name + "_" + this.Identifier;
            }
        }
        #endregion
    }
    public class CustomFunction : IBusinessObject
    {
        //Fields
        private DAL.DataEntities.CustomFunction _innerEntity;
        private bool _toBeDeleted = false;

        //Constructor
        public CustomFunction()
        {
            _innerEntity = new DAL.DataEntities.CustomFunction();
        }
        internal CustomFunction(DAL.DataEntities.CustomFunction innerEntity)
        {
            this._innerEntity = innerEntity;
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
        public string Identifier
        {
            get
            {
                return _innerEntity.Identifier;
            }
            set
            {
                _innerEntity.Identifier = value;
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
        public string Description
        {
            get
            {
                return _innerEntity.Description;
            }
            set
            {
                _innerEntity.Description = value;
            }
        }
        public string Expression
        {
            get
            {
                return _innerEntity.Expression;
            }
            set
            {
                _innerEntity.Expression = value;
            }
        }

        //Special methods
        public static BLL.BusinessObjects.CustomFunction CreateInstance(DAL.DataEntities.IDataEntity innerEntity)
        {
            BLL.BusinessObjects.CustomFunction customFunction = new BLL.BusinessObjects.CustomFunction((DAL.DataEntities.CustomFunction)innerEntity);
            return customFunction;
        }
        public static BLL.BusinessObjects.CustomFunction CreateDefault()
        {
            //Create a new CustomRule and InnerEntity
            DAL.DataEntities.IDataEntity innerEntity = new DAL.DataEntities.CustomFunction();
            BLL.BusinessObjects.CustomFunction customFunction = new CustomFunction((DAL.DataEntities.CustomFunction)innerEntity);

            //Set default fields
            customFunction.Name = "Default customFunction";

            //Return the object instance
            return customFunction;
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
                this._innerEntity = (DAL.DataEntities.CustomFunction)value;
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

        [JsonIgnore]
        public string SlvMapIdentifier
        {
            get
            {
                return this.GetType().Name + "_" + this.Identifier;
            }
        }
        #endregion
    }


    public interface IBusinessObject
    {
        DAL.DataEntities.IDataEntity InnerEntity
        {
            get;
            set;
        }
        bool ToBeDeleted
        {
            get;
            set;
        }
        int ID
        {
            get;
            set;
        }
    }
}
