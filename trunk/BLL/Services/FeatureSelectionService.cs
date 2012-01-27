using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DAL.Repositories;
using BLL.BusinessObjects;

namespace BLL.Services
{
    public class FeatureSelectionService
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

    }
}
