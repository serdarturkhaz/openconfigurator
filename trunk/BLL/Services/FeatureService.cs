using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DAL.Repositories;
using BLL.BusinessObjects;

namespace BLL.Services
{
    public class FeatureService : IService<BLL.BusinessObjects.Feature>
    {
        //Fields
        private IRepository<DAL.DataEntities.Feature> _FeatureRepository;
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

        public IBusinessObject CreateDefaultAttribute()
        {
            BLL.BusinessObjects.Attribute defaultAttribute = BLL.BusinessObjects.Attribute.CreateDefault();
            return defaultAttribute;
        }


        //Interface members
        #region IService<Feature> Members

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

        public IList<BusinessObjects.Feature> GetAll()
        {
            throw new NotImplementedException();
        }

        public void Update(BusinessObjects.Feature entity)
        {
            using (_FeatureRepository = new GenericRepository<DAL.DataEntities.Feature>())
            {
                //
                _FeatureRepository.Attach((DAL.DataEntities.Feature) entity.InnerEntity);
                _FeatureRepository.SaveChanges();
            }
        }

        public void Delete(BusinessObjects.Feature entity)
        {
            throw new NotImplementedException();
        }
        public void Delete(int id)
        {
            DAL.DataEntities.Feature feature;
            using (_FeatureRepository = new GenericRepository<DAL.DataEntities.Feature>())
            {
                feature = _FeatureRepository.SingleOrDefault(m => m.ID == id);
                _FeatureRepository.Delete(feature);
                _FeatureRepository.SaveChanges();
            }
        }
        public void Add(BusinessObjects.Feature entity)
        {
            using (_FeatureRepository = new GenericRepository<DAL.DataEntities.Feature>())
            {
                _FeatureRepository.Add((DAL.DataEntities.Feature)entity.InnerEntity);
                _FeatureRepository.SaveChanges();
            }
        }


        #endregion


    }
}
