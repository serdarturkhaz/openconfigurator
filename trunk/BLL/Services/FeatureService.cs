using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DAL.Repositories;
using BLL.BusinessObjects;

namespace BLL.Services
{
    public class FeatureService : IDataService
    {
        //Fields
        private IRepository<DAL.DataEntities.Feature> _FeatureRepository;
        private IRepository<DAL.DataEntities.FeatureSelection> _FeatureSelectionRepository;
        private int _LoggedInUserID;

        //Constructors
        public FeatureService(int loggedInUserID)
        {
            _LoggedInUserID = loggedInUserID;
        }

        //Methods
        public IBusinessObject CreateDefault()
        {
            BLL.BusinessObjects.Feature defaultFeature = BLL.BusinessObjects.Feature.CreateDefault();
            return defaultFeature;
        }
        public List<BLL.BusinessObjects.Feature> GetByModelID(int ModelID)
        {
            //
            List<BLL.BusinessObjects.Feature> BFeatures;
            using (_FeatureRepository = new GenericRepository<DAL.DataEntities.Feature>())
            {
                IEnumerable<DAL.DataEntities.Feature> DALfeatures = _FeatureRepository.Find(m => m.ModelID == ModelID);

                //Create Business objects for each DAL object
                BFeatures = new List<BusinessObjects.Feature>();
                foreach (DAL.DataEntities.Feature DALfeature in DALfeatures)
                {
                    //Create the BLL feature
                    BLL.BusinessObjects.Feature BLLfeature = BLL.BusinessObjects.Feature.FromDataEntity(DALfeature);

                    BFeatures.Add(BLLfeature);
                }
            }
            return BFeatures;
        }

        public BusinessObjects.Feature GetByID(int id)
        {
            DAL.DataEntities.Feature feature;
            using (_FeatureRepository = new GenericRepository<DAL.DataEntities.Feature>())
            {
                feature = _FeatureRepository.SingleOrDefault(m => m.ID == id);
            }
            //
            return new BLL.BusinessObjects.Feature(feature);
        }
        public void Update(BusinessObjects.Feature entity)
        {
            using (_FeatureRepository = new GenericRepository<DAL.DataEntities.Feature>())
            {
                //Update the Feature
                _FeatureRepository.Attach((DAL.DataEntities.Feature)entity.InnerEntity);
                _FeatureRepository.SaveChanges();
            }
        }
        public void Delete(BusinessObjects.Feature entity)
        {
            Delete(entity.ID);
        }
        public void Delete(int id)
        {
            DAL.DataEntities.Feature feature;
            using (_FeatureRepository = new GenericRepository<DAL.DataEntities.Feature>())
            {
                feature = _FeatureRepository.SingleOrDefault(m => m.ID == id);

                //Cascade delete on all related FeatureSelections
                using (_FeatureSelectionRepository = new GenericRepository<DAL.DataEntities.FeatureSelection>())
                {
                    IEnumerable<DAL.DataEntities.FeatureSelection> featureSelections = _FeatureSelectionRepository.Find(k => k.FeatureID == feature.ID);
                    foreach (DAL.DataEntities.FeatureSelection featureSelection in featureSelections)
                    {
                        _FeatureSelectionRepository.Delete(featureSelection);
                    }

                    _FeatureSelectionRepository.SaveChanges();
                }

                //
                _FeatureRepository.Delete(feature);
                _FeatureRepository.SaveChanges();
            }
        }
        public void Add(BusinessObjects.Feature entity)
        {
            using (_FeatureRepository = new GenericRepository<DAL.DataEntities.Feature>())
            {
                //Add the Feature
                _FeatureRepository.Add((DAL.DataEntities.Feature)entity.InnerEntity);
                _FeatureRepository.SaveChanges();
            }
        }


        //IDataService
        public void Add(IBusinessObject obj)
        {
            Add((BLL.BusinessObjects.Feature)obj);
        }
        public void Delete(IBusinessObject obj)
        {
            throw new NotImplementedException();
        }
        public void Update(IBusinessObject obj)
        {
            throw new NotImplementedException();
        }
    }
}
