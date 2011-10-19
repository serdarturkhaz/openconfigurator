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
    public partial class FeatureGroup_Type : IDataEntity
    {
        #region Primitive Properties
    
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
    
        public virtual Nullable<int> FixedLowerBound
        {
            get;
            set;
        }
    
        public virtual Nullable<int> FixedUpperBound
        {
            get;
            set;
        }

        #endregion
        #region Navigation Properties
    
        public virtual ICollection<FeatureGroup> FeatureGroups
        {
            get
            {
                if (_featureGroups == null)
                {
                    var newCollection = new FixupCollection<FeatureGroup>();
                    newCollection.CollectionChanged += FixupFeatureGroups;
                    _featureGroups = newCollection;
                }
                return _featureGroups;
            }
            set
            {
                if (!ReferenceEquals(_featureGroups, value))
                {
                    var previousValue = _featureGroups as FixupCollection<FeatureGroup>;
                    if (previousValue != null)
                    {
                        previousValue.CollectionChanged -= FixupFeatureGroups;
                    }
                    _featureGroups = value;
                    var newValue = value as FixupCollection<FeatureGroup>;
                    if (newValue != null)
                    {
                        newValue.CollectionChanged += FixupFeatureGroups;
                    }
                }
            }
        }
        private ICollection<FeatureGroup> _featureGroups;

        #endregion
        #region Association Fixup
    
        private void FixupFeatureGroups(object sender, NotifyCollectionChangedEventArgs e)
        {
            if (e.NewItems != null)
            {
                foreach (FeatureGroup item in e.NewItems)
                {
                    item.FeatureGroup_Type = this;
                }
            }
    
            if (e.OldItems != null)
            {
                foreach (FeatureGroup item in e.OldItems)
                {
                    if (ReferenceEquals(item.FeatureGroup_Type, this))
                    {
                        item.FeatureGroup_Type = null;
                    }
                }
            }
        }

        #endregion
    }
}
