using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using BLL.BusinessObjects;

namespace BLL.Services
{
    public interface IDataService
    {
        void Add(IBusinessObject obj);
        void Delete(IBusinessObject obj);
        void Update(IBusinessObject obj);
        
    }
}
