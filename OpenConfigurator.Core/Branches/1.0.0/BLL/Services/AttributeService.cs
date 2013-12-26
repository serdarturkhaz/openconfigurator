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
    public class AttributeService : IDataService
    {
        //Fields
        private IRepository<DAL.DataEntities.Attribute> _AttributeRepository;
        private int _LoggedInUserID;

        //Constructors
        public AttributeService(int loggedInUserID)
        {
            _LoggedInUserID = loggedInUserID;
        }

        //Methods
        public List<BLL.BusinessObjects.Attribute> GetByFeatureID(int FeatureID)
        {
            //
            List<BLL.BusinessObjects.Attribute> BLLAttributes;
            using (_AttributeRepository = new GenericRepository<DAL.DataEntities.Attribute>())
            {
                IEnumerable<DAL.DataEntities.Attribute> DALAttributes = _AttributeRepository.Find(m => m.FeatureID == FeatureID);

                //Create Business objects for each DAL object
                BLLAttributes = new List<BusinessObjects.Attribute>();
                foreach (DAL.DataEntities.Attribute DALAttribute in DALAttributes)
                {
                    //Create the BLL object
                    BLL.BusinessObjects.Attribute BLLAttribute = BLL.BusinessObjects.Attribute.CreateInstance(DALAttribute);
                    BLLAttributes.Add(BLLAttribute);
                }
            }
            return BLLAttributes;
        }
        public IBusinessObject CreateDefault()
        {
            BLL.BusinessObjects.Attribute defaultAttribute = BLL.BusinessObjects.Attribute.CreateDefault();
            return defaultAttribute;
        }
        public BusinessObjects.Attribute GetByID(int id)
        {
            DAL.DataEntities.Attribute attribute;
            using (_AttributeRepository = new GenericRepository<DAL.DataEntities.Attribute>())
            {
                attribute = _AttributeRepository.SingleOrDefault(m => m.ID == id);
            }
            //
            return new BLL.BusinessObjects.Attribute(attribute);
        }
        public void Update(BusinessObjects.Attribute entity)
        {
            using (_AttributeRepository = new GenericRepository<DAL.DataEntities.Attribute>())
            {
                //Update the Attribute
                _AttributeRepository.Attach((DAL.DataEntities.Attribute)entity.InnerEntity);
                _AttributeRepository.SaveChanges();
            }
        }
        public void Delete(BusinessObjects.Attribute entity)
        {
            Delete(entity.ID);
        }
        public void Delete(int id)
        {
            DAL.DataEntities.Attribute attribute;
            using (_AttributeRepository = new GenericRepository<DAL.DataEntities.Attribute>())
            {
                attribute = _AttributeRepository.SingleOrDefault(m => m.ID == id);
                _AttributeRepository.Delete(attribute);
                _AttributeRepository.SaveChanges();
            }
        }
        public void Add(BusinessObjects.Attribute entity)
        {
            using (_AttributeRepository = new GenericRepository<DAL.DataEntities.Attribute>())
            {
                //Add the Attribute
                _AttributeRepository.Add((DAL.DataEntities.Attribute)entity.InnerEntity);
                _AttributeRepository.SaveChanges();
            }
        }

        //IDataService
        public void Add(IBusinessObject obj)
        {
            Add((BLL.BusinessObjects.Attribute)obj);
        }
        public void Delete(IBusinessObject obj)
        {
            Delete((BLL.BusinessObjects.Attribute)obj);
        }
        public void Update(IBusinessObject obj)
        {
            Update((BLL.BusinessObjects.Attribute)obj);
        }
    }
}
