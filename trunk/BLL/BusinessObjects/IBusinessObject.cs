using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BLL.BusinessObjects
{
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
    }
}
