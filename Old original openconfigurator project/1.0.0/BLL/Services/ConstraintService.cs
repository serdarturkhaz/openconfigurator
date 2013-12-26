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
    public class ConstraintService : IDataService
    {
        //Fields
        private IRepository<DAL.DataEntities.Constraint> _ConstraintRepository;
        private int _LoggedInUserID;
        
        //Constructors
        public ConstraintService(int loggedInUserID)
        {
            _LoggedInUserID = loggedInUserID;
        }

        //Methods
        public IBusinessObject CreateDefault()
        {
            BLL.BusinessObjects.Constraint defaultConstraint = BLL.BusinessObjects.Constraint.CreateDefault();
            return defaultConstraint;
        }

        public List<BLL.BusinessObjects.Constraint> GetByModelID(int ModelID)
        {
            //
            List<BLL.BusinessObjects.Constraint> BConstraints;
            using (_ConstraintRepository = new GenericRepository<DAL.DataEntities.Constraint>())
            {
                IEnumerable<DAL.DataEntities.Constraint> customRules = _ConstraintRepository.Find(m => m.ModelID == ModelID);

                //Create Business objects for each DAL object
                BConstraints = new List<BusinessObjects.Constraint>();
                foreach (DAL.DataEntities.Constraint customRule in customRules)
                {
                    BConstraints.Add((BLL.BusinessObjects.Constraint)BLL.BusinessObjects.Constraint.FromDataEntity(customRule));
                }
            }
            return BConstraints;
        }
        public BusinessObjects.Constraint GetByID(int id)
        {
            DAL.DataEntities.Constraint customRule;
            using (_ConstraintRepository = new GenericRepository<DAL.DataEntities.Constraint>())
            {
                customRule = _ConstraintRepository.SingleOrDefault(m => m.ID == id);
            }
            //
            return new BLL.BusinessObjects.Constraint(customRule);
        }
        public IList<BusinessObjects.Constraint> GetAll()
        {
            throw new NotImplementedException();
        }
        public void Update(BusinessObjects.Constraint entity)
        {
            using (_ConstraintRepository = new GenericRepository<DAL.DataEntities.Constraint>())
            {
                //
                _ConstraintRepository.Attach((DAL.DataEntities.Constraint)entity.InnerEntity);
                _ConstraintRepository.SaveChanges();
            }
        }
        public void Delete(BusinessObjects.Constraint entity)
        {
            Delete(entity.ID);
        }
        public void Delete(int id)
        {
            DAL.DataEntities.Constraint customRule;
            using (_ConstraintRepository = new GenericRepository<DAL.DataEntities.Constraint>())
            {
                customRule = _ConstraintRepository.SingleOrDefault(m => m.ID == id);
                _ConstraintRepository.Delete(customRule);
                _ConstraintRepository.SaveChanges();
            }
        }
        public void Add(BusinessObjects.Constraint entity)
        {
            using (_ConstraintRepository = new GenericRepository<DAL.DataEntities.Constraint>())
            {
                _ConstraintRepository.Add((DAL.DataEntities.Constraint)entity.InnerEntity);
                _ConstraintRepository.SaveChanges();
            }
        }

        //IDataService
        public void Add(IBusinessObject obj)
        {
            Add((BLL.BusinessObjects.Constraint)obj);
        }
        public void Delete(IBusinessObject obj)
        {
            Delete((BLL.BusinessObjects.Constraint)obj);
        }
        public void Update(IBusinessObject obj)
        {
            Update((BLL.BusinessObjects.Constraint)obj);
        }
    }
}
