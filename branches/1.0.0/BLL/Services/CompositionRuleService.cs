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
    public class CompositionRuleService : IDataService
    {
        //Fields
        private IRepository<DAL.DataEntities.CompositionRule> _CompositionRuleRepository;
        private int _LoggedInUserID;
        
        //Constructors
        public CompositionRuleService(int loggedInUserID)
        {
            _LoggedInUserID = loggedInUserID;
        }

        //Methods
        public IBusinessObject CreateDefault()
        {
            BLL.BusinessObjects.CompositionRule defaultCompositionRule = BLL.BusinessObjects.CompositionRule.CreateDefault();
            return defaultCompositionRule;
        }

        public List<BLL.BusinessObjects.CompositionRule> GetByModelID(int ModelID)
        {
            //
            List<BLL.BusinessObjects.CompositionRule> BLLCompositionRules;
            using (_CompositionRuleRepository = new GenericRepository<DAL.DataEntities.CompositionRule>())
            {
                IEnumerable<DAL.DataEntities.CompositionRule> DALCompositionRules = _CompositionRuleRepository.Find(m => m.ModelID == ModelID);

                //Create Business objects for each DAL object
                BLLCompositionRules = new List<BusinessObjects.CompositionRule>();
                foreach (DAL.DataEntities.CompositionRule DALCompositionRule in DALCompositionRules)
                {
                    BLLCompositionRules.Add((BLL.BusinessObjects.CompositionRule)BLL.BusinessObjects.CompositionRule.CreateInstance(DALCompositionRule));
                }
            }
            return BLLCompositionRules;
        }
        public BusinessObjects.CompositionRule GetByID(int id)
        {
            DAL.DataEntities.CompositionRule feature;
            using (_CompositionRuleRepository = new GenericRepository<DAL.DataEntities.CompositionRule>())
            {
                feature = _CompositionRuleRepository.SingleOrDefault(m => m.ID == id);
            }
            //
            return new BLL.BusinessObjects.CompositionRule(feature);
        }
        public void Update(BusinessObjects.CompositionRule entity)
        {
            using (_CompositionRuleRepository = new GenericRepository<DAL.DataEntities.CompositionRule>())
            {
                //
                _CompositionRuleRepository.Attach((DAL.DataEntities.CompositionRule)entity.InnerEntity);
                _CompositionRuleRepository.SaveChanges();
            }
        }
        public void Delete(BusinessObjects.CompositionRule entity)
        {
            Delete(entity.ID);
        }
        public void Delete(int id)
        {
            DAL.DataEntities.CompositionRule feature;
            using (_CompositionRuleRepository = new GenericRepository<DAL.DataEntities.CompositionRule>())
            {
                feature = _CompositionRuleRepository.SingleOrDefault(m => m.ID == id);
                _CompositionRuleRepository.Delete(feature);
                _CompositionRuleRepository.SaveChanges();
            }
        }
        public void Add(BusinessObjects.CompositionRule entity)
        {
            using (_CompositionRuleRepository = new GenericRepository<DAL.DataEntities.CompositionRule>())
            {
                _CompositionRuleRepository.Add((DAL.DataEntities.CompositionRule)entity.InnerEntity);
                _CompositionRuleRepository.SaveChanges();
            }
        }

        //IDataService
        public void Add(IBusinessObject obj)
        {
            Add((BLL.BusinessObjects.CompositionRule)obj);
        }
        public void Delete(IBusinessObject obj)
        {
            Delete((BLL.BusinessObjects.CompositionRule)obj);
        }
        public void Update(IBusinessObject obj)
        {
            Update((BLL.BusinessObjects.CompositionRule)obj);
        }
    }
}
