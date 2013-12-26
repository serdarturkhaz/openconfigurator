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
    public class FeatureSelectionService: IDataService
    {
        //Fields
        private IRepository<DAL.DataEntities.FeatureSelection> _FeatureSelectionRepository;
        private IRepository<DAL.DataEntities.AttributeValue> _AttributeValuesRepository;
        private int _LoggedInUserID;

        //Constructors
        public FeatureSelectionService(int loggedInUserID)
        {
            _LoggedInUserID = loggedInUserID;
        }

        //Methods
        public IBusinessObject CreateDefault()
        {
            BLL.BusinessObjects.FeatureSelection defaultFeatureSelection = BLL.BusinessObjects.FeatureSelection.CreateDefault();
            return defaultFeatureSelection;
        }
        public IBusinessObject CreateDefaultAttributeValue()
        {
            BLL.BusinessObjects.AttributeValue defaultAttrValue = BLL.BusinessObjects.AttributeValue.CreateDefault();
            return defaultAttrValue;
        }
        public void Update(BusinessObjects.FeatureSelection entity)
        {
            using (_FeatureSelectionRepository = new GenericRepository<DAL.DataEntities.FeatureSelection>())
            {
                //Update the FeatureSelection
                _FeatureSelectionRepository.Attach((DAL.DataEntities.FeatureSelection)entity.InnerEntity);
                _FeatureSelectionRepository.SaveChanges();

                //Update AttributeValues
                using (_AttributeValuesRepository = new GenericRepository<DAL.DataEntities.AttributeValue>())
                {
                    for (int i = entity.AttributeValues.Count - 1; i >= 0; i--)
                    {
                        BLL.BusinessObjects.AttributeValue BLLAttributeValue = entity.AttributeValues[i];
                        BLLAttributeValue.FeatureSelectionID = entity.ID;

                        //Add
                        if (BLLAttributeValue.ToBeDeleted == false && BLLAttributeValue.ID == 0)
                        {
                            _AttributeValuesRepository.Add((DAL.DataEntities.AttributeValue)BLLAttributeValue.InnerEntity);
                        }
                        //Update
                        else if (BLLAttributeValue.ToBeDeleted == false && BLLAttributeValue.ID != 0)
                        {
                            _AttributeValuesRepository.Attach((DAL.DataEntities.AttributeValue)BLLAttributeValue.InnerEntity);
                        }
                        
                    }
                    _AttributeValuesRepository.SaveChanges();
                }
            }
        }
        public void Delete(int id)
        {
            DAL.DataEntities.FeatureSelection feature;
            using (_FeatureSelectionRepository = new GenericRepository<DAL.DataEntities.FeatureSelection>())
            {
                feature = _FeatureSelectionRepository.SingleOrDefault(m => m.ID == id);
                _FeatureSelectionRepository.Delete(feature);
                _FeatureSelectionRepository.SaveChanges();
            }
        }
        public void Add(BusinessObjects.FeatureSelection entity)
        {
            using (_FeatureSelectionRepository = new GenericRepository<DAL.DataEntities.FeatureSelection>())
            {
                //Add the FeatureSelection
                _FeatureSelectionRepository.Add((DAL.DataEntities.FeatureSelection)entity.InnerEntity);
                _FeatureSelectionRepository.SaveChanges();

                //Add AttributeValues
                using (_AttributeValuesRepository = new GenericRepository<DAL.DataEntities.AttributeValue>())
                {
                    for (int i = entity.AttributeValues.Count - 1; i >= 0; i--)
                    {
                        BLL.BusinessObjects.AttributeValue BLLAttributeValue = entity.AttributeValues[i];
                        BLLAttributeValue.FeatureSelectionID = entity.ID;

                        //Add
                        if (BLLAttributeValue.ToBeDeleted == false && BLLAttributeValue.ID == 0)
                        {
                            _AttributeValuesRepository.Add((DAL.DataEntities.AttributeValue)BLLAttributeValue.InnerEntity);
                        }
                    }
                    _AttributeValuesRepository.SaveChanges();
                }
            }
        }

        //IDataService
        public void Add(IBusinessObject obj)
        {
            Add((BLL.BusinessObjects.FeatureSelection)obj);
        }
        public void Delete(IBusinessObject obj)
        {
            Delete((BLL.BusinessObjects.FeatureSelection)obj);
        }
        public void Update(IBusinessObject obj)
        {
            Update((BLL.BusinessObjects.FeatureSelection)obj);
        }
    }
}
