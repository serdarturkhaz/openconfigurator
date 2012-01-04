//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Collections.Specialized;

namespace DAL.DataEntities
{
    public partial class Configuration : IDataEntity
    {
        #region Primitive Properties
    
        public virtual int ID
        {
            get;
            set;
        }
    
        public virtual int ModelID
        {
            get { return _modelID; }
            set
            {
                if (_modelID != value)
                {
                    if (Model != null && Model.ID != value)
                    {
                        Model = null;
                    }
                    _modelID = value;
                }
            }
        }
        private int _modelID;
    
        public virtual string Name
        {
            get;
            set;
        }
    
        public virtual Nullable<System.DateTime> CreatedDate
        {
            get;
            set;
        }
    
        public virtual Nullable<System.DateTime> LastModifiedDate
        {
            get;
            set;
        }

        #endregion
        #region Navigation Properties
    
        public virtual Model Model
        {
            get { return _model; }
            set
            {
                if (!ReferenceEquals(_model, value))
                {
                    var previousValue = _model;
                    _model = value;
                    FixupModel(previousValue);
                }
            }
        }
        private Model _model;
    
        public virtual ICollection<FeatureSelection> FeatureSelections
        {
            get
            {
                if (_featureSelections == null)
                {
                    var newCollection = new FixupCollection<FeatureSelection>();
                    newCollection.CollectionChanged += FixupFeatureSelections;
                    _featureSelections = newCollection;
                }
                return _featureSelections;
            }
            set
            {
                if (!ReferenceEquals(_featureSelections, value))
                {
                    var previousValue = _featureSelections as FixupCollection<FeatureSelection>;
                    if (previousValue != null)
                    {
                        previousValue.CollectionChanged -= FixupFeatureSelections;
                    }
                    _featureSelections = value;
                    var newValue = value as FixupCollection<FeatureSelection>;
                    if (newValue != null)
                    {
                        newValue.CollectionChanged += FixupFeatureSelections;
                    }
                }
            }
        }
        private ICollection<FeatureSelection> _featureSelections;

        #endregion
        #region Association Fixup
    
        private void FixupModel(Model previousValue)
        {
            if (previousValue != null && previousValue.Configurations.Contains(this))
            {
                previousValue.Configurations.Remove(this);
            }
    
            if (Model != null)
            {
                if (!Model.Configurations.Contains(this))
                {
                    Model.Configurations.Add(this);
                }
                if (ModelID != Model.ID)
                {
                    ModelID = Model.ID;
                }
            }
        }
    
        private void FixupFeatureSelections(object sender, NotifyCollectionChangedEventArgs e)
        {
            if (e.NewItems != null)
            {
                foreach (FeatureSelection item in e.NewItems)
                {
                    item.Configuration = this;
                }
            }
    
            if (e.OldItems != null)
            {
                foreach (FeatureSelection item in e.OldItems)
                {
                    if (ReferenceEquals(item.Configuration, this))
                    {
                        item.Configuration = null;
                    }
                }
            }
        }

        #endregion
    }
}
