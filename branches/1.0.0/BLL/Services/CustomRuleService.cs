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
    public class CustomRuleService : IDataService
    {
        //Fields
        private IRepository<DAL.DataEntities.CustomRule> _CustomRuleRepository;
        private int _LoggedInUserID;
        
        //Constructors
        public CustomRuleService(int loggedInUserID)
        {
            _LoggedInUserID = loggedInUserID;
        }

        //Methods
        public IBusinessObject CreateDefault()
        {
            BLL.BusinessObjects.CustomRule defaultCustomRule = BLL.BusinessObjects.CustomRule.CreateDefault();
            return defaultCustomRule;
        }

        public List<BLL.BusinessObjects.CustomRule> GetByModelID(int ModelID)
        {
            //
            List<BLL.BusinessObjects.CustomRule> BCustomRules;
            using (_CustomRuleRepository = new GenericRepository<DAL.DataEntities.CustomRule>())
            {
                IEnumerable<DAL.DataEntities.CustomRule> customRules = _CustomRuleRepository.Find(m => m.ModelID == ModelID);

                //Create Business objects for each DAL object
                BCustomRules = new List<BusinessObjects.CustomRule>();
                foreach (DAL.DataEntities.CustomRule customRule in customRules)
                {
                    BCustomRules.Add((BLL.BusinessObjects.CustomRule)BLL.BusinessObjects.CustomRule.FromDataEntity(customRule));
                }
            }
            return BCustomRules;
        }
        public BusinessObjects.CustomRule GetByID(int id)
        {
            DAL.DataEntities.CustomRule customRule;
            using (_CustomRuleRepository = new GenericRepository<DAL.DataEntities.CustomRule>())
            {
                customRule = _CustomRuleRepository.SingleOrDefault(m => m.ID == id);
            }
            //
            return new BLL.BusinessObjects.CustomRule(customRule);
        }
        public IList<BusinessObjects.CustomRule> GetAll()
        {
            throw new NotImplementedException();
        }
        public void Update(BusinessObjects.CustomRule entity)
        {
            using (_CustomRuleRepository = new GenericRepository<DAL.DataEntities.CustomRule>())
            {
                //
                _CustomRuleRepository.Attach((DAL.DataEntities.CustomRule)entity.InnerEntity);
                _CustomRuleRepository.SaveChanges();
            }
        }
        public void Delete(BusinessObjects.CustomRule entity)
        {
            Delete(entity.ID);
        }
        public void Delete(int id)
        {
            DAL.DataEntities.CustomRule customRule;
            using (_CustomRuleRepository = new GenericRepository<DAL.DataEntities.CustomRule>())
            {
                customRule = _CustomRuleRepository.SingleOrDefault(m => m.ID == id);
                _CustomRuleRepository.Delete(customRule);
                _CustomRuleRepository.SaveChanges();
            }
        }
        public void Add(BusinessObjects.CustomRule entity)
        {
            using (_CustomRuleRepository = new GenericRepository<DAL.DataEntities.CustomRule>())
            {
                _CustomRuleRepository.Add((DAL.DataEntities.CustomRule)entity.InnerEntity);
                _CustomRuleRepository.SaveChanges();
            }
        }

        //IDataService
        public void Add(IBusinessObject obj)
        {
            Add((BLL.BusinessObjects.CustomRule)obj);
        }
        public void Delete(IBusinessObject obj)
        {
            Delete((BLL.BusinessObjects.CustomRule)obj);
        }
        public void Update(IBusinessObject obj)
        {
            Update((BLL.BusinessObjects.CustomRule)obj);
        }
    }
}
