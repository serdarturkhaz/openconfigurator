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
    public partial class Rule_Type : IDataEntity
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

        #endregion
        #region Navigation Properties
    
        public virtual ICollection<Rule> Rules
        {
            get
            {
                if (_rules == null)
                {
                    var newCollection = new FixupCollection<Rule>();
                    newCollection.CollectionChanged += FixupRules;
                    _rules = newCollection;
                }
                return _rules;
            }
            set
            {
                if (!ReferenceEquals(_rules, value))
                {
                    var previousValue = _rules as FixupCollection<Rule>;
                    if (previousValue != null)
                    {
                        previousValue.CollectionChanged -= FixupRules;
                    }
                    _rules = value;
                    var newValue = value as FixupCollection<Rule>;
                    if (newValue != null)
                    {
                        newValue.CollectionChanged += FixupRules;
                    }
                }
            }
        }
        private ICollection<Rule> _rules;

        #endregion
        #region Association Fixup
    
        private void FixupRules(object sender, NotifyCollectionChangedEventArgs e)
        {
            if (e.NewItems != null)
            {
                foreach (Rule item in e.NewItems)
                {
                    item.Rule_Type = this;
                }
            }
    
            if (e.OldItems != null)
            {
                foreach (Rule item in e.OldItems)
                {
                    if (ReferenceEquals(item.Rule_Type, this))
                    {
                        item.Rule_Type = null;
                    }
                }
            }
        }

        #endregion
    }
}