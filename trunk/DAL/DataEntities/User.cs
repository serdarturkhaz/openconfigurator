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
    public partial class User
    {
        #region Primitive Properties
    
        public virtual int ID
        {
            get;
            set;
        }
    
        public virtual string Email
        {
            get;
            set;
        }
    
        public virtual string Password
        {
            get;
            set;
        }

        #endregion
        #region Navigation Properties
    
        public virtual ICollection<Model> Models
        {
            get
            {
                if (_models == null)
                {
                    var newCollection = new FixupCollection<Model>();
                    newCollection.CollectionChanged += FixupModels;
                    _models = newCollection;
                }
                return _models;
            }
            set
            {
                if (!ReferenceEquals(_models, value))
                {
                    var previousValue = _models as FixupCollection<Model>;
                    if (previousValue != null)
                    {
                        previousValue.CollectionChanged -= FixupModels;
                    }
                    _models = value;
                    var newValue = value as FixupCollection<Model>;
                    if (newValue != null)
                    {
                        newValue.CollectionChanged += FixupModels;
                    }
                }
            }
        }
        private ICollection<Model> _models;

        #endregion
        #region Association Fixup
    
        private void FixupModels(object sender, NotifyCollectionChangedEventArgs e)
        {
            if (e.NewItems != null)
            {
                foreach (Model item in e.NewItems)
                {
                    item.User = this;
                }
            }
    
            if (e.OldItems != null)
            {
                foreach (Model item in e.OldItems)
                {
                    if (ReferenceEquals(item.User, this))
                    {
                        item.User = null;
                    }
                }
            }
        }

        #endregion
    }
}
