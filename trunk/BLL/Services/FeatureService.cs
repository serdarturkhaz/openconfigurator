using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DAL.Repositories;
using BLL.BusinessObjects;

namespace BLL.Services
{
    public class FeatureService
    {
        //Fields
        private IRepository<DAL.DataEntities.Feature> _FeatureRepository;
        private IRepository<DAL.DataEntities.Attribute> _AttributeRepository;
        private int _LoggedInUserID;

        //Constructors
        public FeatureService(int loggedInUserID)
        {
            _LoggedInUserID = loggedInUserID;
        }

        //Methods
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
                //Update the Feature
                _FeatureRepository.Attach((DAL.DataEntities.Feature)entity.InnerEntity);
                _FeatureRepository.SaveChanges();

                //Update Attributes
                using (_AttributeRepository = new GenericRepository<DAL.DataEntities.Attribute>())
                {
                    for (int i = entity.Attributes.Count - 1; i >= 0; i--)
                    {
                        BLL.BusinessObjects.Attribute BLLattribute = entity.Attributes[i];
                        BLLattribute.FeatureID = entity.ID;
                       
                        //Delete 
                        if (BLLattribute.ToBeDeleted == true && BLLattribute.ID != 0)
                        {
                            _AttributeRepository.Attach((DAL.DataEntities.Attribute)BLLattribute.InnerEntity);
                            _AttributeRepository.Delete((DAL.DataEntities.Attribute)BLLattribute.InnerEntity);
                            entity.Attributes.Remove(BLLattribute);
                        }
                        //Add
                        else if (BLLattribute.ToBeDeleted == false && BLLattribute.ID == 0)
                        {
                            _AttributeRepository.Add((DAL.DataEntities.Attribute)BLLattribute.InnerEntity);
                        }
                        //Update
                        else if (BLLattribute.ToBeDeleted == false && BLLattribute.ID != 0)
                        {
                            _AttributeRepository.Attach((DAL.DataEntities.Attribute)BLLattribute.InnerEntity);
                        }
                        _AttributeRepository.SaveChanges();
                    }
                }
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

                //Update Attributes
                using (_AttributeRepository = new GenericRepository<DAL.DataEntities.Attribute>())
                {
                    for (int i = entity.Attributes.Count - 1; i >= 0; i--)
                    {
                        BLL.BusinessObjects.Attribute BLLattribute = entity.Attributes[i];
                        BLLattribute.FeatureID = entity.ID;

                        //Add
                        if (BLLattribute.ToBeDeleted == false && BLLattribute.ID == 0)
                        {
                            _AttributeRepository.Add((DAL.DataEntities.Attribute)BLLattribute.InnerEntity);
                        }
                        _AttributeRepository.SaveChanges();
                    }
                }
            }
        }

        #endregion
    }
}
