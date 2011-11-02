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
        private BusinessObjectFactory _BusinessObjectFactory;

        //Constructors
        public FeatureService(int loggedInUserID)
        {
            _LoggedInUserID = loggedInUserID;
            _BusinessObjectFactory = new FeatureFactory();

        }

        //Methods
        public IBusinessObject CreateDefault()
        {
            BLL.BusinessObjects.Feature defaultModel = (BLL.BusinessObjects.Feature)_BusinessObjectFactory.CreateDefault(_LoggedInUserID);
            return defaultModel;
        }


        //Interface members
        #region IService<Model> Members

        public BusinessObjects.Feature GetByID(int id)
        {
            DAL.DataEntities.Feature  feature;
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
