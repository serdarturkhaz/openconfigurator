// Developed by OpenConfigurator Core Team
// 
// Distributed under the MIT license
// ===========================================================
// Copyright (c) 2012 - Radu Mitache
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
using DAL.Repositories;
using BLL.BusinessObjects;

namespace BLL.Services
{
    public class CustomFunctionService : IDataService
    {
        //Fields
        private IRepository<DAL.DataEntities.CustomFunction> _CustomFunctionRepository;
        private int _LoggedInUserID;
        
        //Constructors
        public CustomFunctionService(int loggedInUserID)
        {
            _LoggedInUserID = loggedInUserID;
        }

        //Methods
        public IBusinessObject CreateDefault()
        {
            BLL.BusinessObjects.CustomFunction defaultCustomFunction = BLL.BusinessObjects.CustomFunction.CreateDefault();
            return defaultCustomFunction;
        }

        public List<BLL.BusinessObjects.CustomFunction> GetByModelID(int ModelID)
        {
            //
            List<BLL.BusinessObjects.CustomFunction> BCustomFunctions;
            using (_CustomFunctionRepository = new GenericRepository<DAL.DataEntities.CustomFunction>())
            {
                IEnumerable<DAL.DataEntities.CustomFunction> customRules = _CustomFunctionRepository.Find(m => m.ModelID == ModelID);

                //Create Business objects for each DAL object
                BCustomFunctions = new List<BusinessObjects.CustomFunction>();
                foreach (DAL.DataEntities.CustomFunction customRule in customRules)
                {
                    BCustomFunctions.Add((BLL.BusinessObjects.CustomFunction)BLL.BusinessObjects.CustomFunction.CreateInstance(customRule));
                }
            }
            return BCustomFunctions;
        }
        public BusinessObjects.CustomFunction GetByID(int id)
        {
            DAL.DataEntities.CustomFunction customRule;
            using (_CustomFunctionRepository = new GenericRepository<DAL.DataEntities.CustomFunction>())
            {
                customRule = _CustomFunctionRepository.SingleOrDefault(m => m.ID == id);
            }
            //
            return new BLL.BusinessObjects.CustomFunction(customRule);
        }
        public IList<BusinessObjects.CustomFunction> GetAll()
        {
            throw new NotImplementedException();
        }
        public void Update(BusinessObjects.CustomFunction entity)
        {
            using (_CustomFunctionRepository = new GenericRepository<DAL.DataEntities.CustomFunction>())
            {
                //
                _CustomFunctionRepository.Attach((DAL.DataEntities.CustomFunction)entity.InnerEntity);
                _CustomFunctionRepository.SaveChanges();
            }
        }
        public void Delete(BusinessObjects.CustomFunction entity)
        {
            Delete(entity.ID);
        }
        public void Delete(int id)
        {
            DAL.DataEntities.CustomFunction customRule;
            using (_CustomFunctionRepository = new GenericRepository<DAL.DataEntities.CustomFunction>())
            {
                customRule = _CustomFunctionRepository.SingleOrDefault(m => m.ID == id);
                _CustomFunctionRepository.Delete(customRule);
                _CustomFunctionRepository.SaveChanges();
            }
        }
        public void Add(BusinessObjects.CustomFunction entity)
        {
            using (_CustomFunctionRepository = new GenericRepository<DAL.DataEntities.CustomFunction>())
            {
                _CustomFunctionRepository.Add((DAL.DataEntities.CustomFunction)entity.InnerEntity);
                _CustomFunctionRepository.SaveChanges();
            }
        }

        //IDataService
        public void Add(IBusinessObject obj)
        {
            Add((BLL.BusinessObjects.CustomFunction)obj);
        }
        public void Delete(IBusinessObject obj)
        {
            Delete((BLL.BusinessObjects.CustomFunction)obj);
        }
        public void Update(IBusinessObject obj)
        {
            Update((BLL.BusinessObjects.CustomFunction)obj);
        }
    }
}
