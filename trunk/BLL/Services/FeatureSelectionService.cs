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

            }
        }

    }
}
