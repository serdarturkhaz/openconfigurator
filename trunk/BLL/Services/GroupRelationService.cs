using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DAL.Repositories;
using BLL.BusinessObjects;

namespace BLL.Services
{
    public class GroupRelationService 
    {
        //Fields
        private IRepository<DAL.DataEntities.GroupRelation> _GroupRelationRepository;
        private IRepository<DAL.DataEntities.GroupRelation_To_Feature> _GroupRelationsToFeaturesRepository;
        private int _LoggedInUserID;

        //Constructors
        public GroupRelationService(int loggedInUserID)
        {
            _LoggedInUserID = loggedInUserID;

        }

        //Methods
        public IBusinessObject CreateDefault()
        {
            BLL.BusinessObjects.GroupRelation defaultGroupRelation = (BLL.BusinessObjects.GroupRelation)BLL.BusinessObjects.GroupRelation.CreateDefault();
            return defaultGroupRelation;
        }

        public List<BLL.BusinessObjects.GroupRelation> GetByModelID(int ModelID)
        {
            //
            List<BLL.BusinessObjects.GroupRelation> BLLGroupRelations;
            using (_GroupRelationRepository = new GenericRepository<DAL.DataEntities.GroupRelation>())
            {
                //Get all DAL groupRelation entities
                IEnumerable<DAL.DataEntities.GroupRelation> DALgroupRelations = _GroupRelationRepository.Find(m => m.ModelID == ModelID);

                //Create Business objects for each DAL object
                BLLGroupRelations = new List<BusinessObjects.GroupRelation>();
                foreach (DAL.DataEntities.GroupRelation DALgroupRelation in DALgroupRelations)
                {
                    //Business object
                    BLL.BusinessObjects.GroupRelation BLLGroupRelation = (BLL.BusinessObjects.GroupRelation)BLL.BusinessObjects.GroupRelation.FromDataEntity(DALgroupRelation);
                    BLLGroupRelations.Add(BLLGroupRelation);
                }
            }
            return BLLGroupRelations;
        }
        public Dictionary<int, string> GetGroupRelationTypes()
        {
            Dictionary<int, string> dict = new Dictionary<int, string>();
            dict = Enum.GetValues(typeof(BLL.BusinessObjects.RelationTypes))
               .Cast<BLL.BusinessObjects.RelationTypes>()
               .ToDictionary(t => (int)t, t => t.ToString());

            return dict;
        }
        public BusinessObjects.GroupRelation GetByID(int id)
        {
            DAL.DataEntities.GroupRelation groupRelation;
            using (_GroupRelationRepository = new GenericRepository<DAL.DataEntities.GroupRelation>())
            {
                groupRelation = _GroupRelationRepository.SingleOrDefault(r => r.ID == id);
            }
            //
            return new BLL.BusinessObjects.GroupRelation(groupRelation);
        }
        public IList<BusinessObjects.GroupRelation> GetAll()
        {
            throw new NotImplementedException();
        }
        public void Update(BusinessObjects.GroupRelation entity)
        {
            using (_GroupRelationRepository = new GenericRepository<DAL.DataEntities.GroupRelation>())
            {
                //
                _GroupRelationRepository.Attach((DAL.DataEntities.GroupRelation)entity.InnerEntity);
                _GroupRelationRepository.SaveChanges();
            }
        }
        public void Delete(BusinessObjects.GroupRelation entity)
        {
            Delete(entity.ID);
        }
        public void Delete(int id)
        {

            //Delete GroupRelation
            DAL.DataEntities.GroupRelation groupRelation;
            using (_GroupRelationRepository = new GenericRepository<DAL.DataEntities.GroupRelation>())
            {
                groupRelation = _GroupRelationRepository.SingleOrDefault(m => m.ID == id);
                _GroupRelationRepository.Delete(groupRelation);
                _GroupRelationRepository.SaveChanges();
            }
        }
        public void Add(BusinessObjects.GroupRelation entity)
        {
            //Add GroupRelation
            using (_GroupRelationRepository = new GenericRepository<DAL.DataEntities.GroupRelation>())
            {
                _GroupRelationRepository.Add((DAL.DataEntities.GroupRelation)entity.InnerEntity);
                _GroupRelationRepository.SaveChanges();
            }

            //Add GroupRelations_To_Features
            using (_GroupRelationsToFeaturesRepository = new GenericRepository<DAL.DataEntities.GroupRelation_To_Feature>())
            {
                
                foreach (int childFeatureID in entity.ChildFeatureIDs)
                {
                    DAL.DataEntities.GroupRelation_To_Feature grToFeature = new DAL.DataEntities.GroupRelation_To_Feature();
                    grToFeature.GroupRelationID = entity.ID;
                    grToFeature.ParentFeatureID = entity.ParentFeatureID;
                    grToFeature.ChildFeatureID = childFeatureID;

                    _GroupRelationsToFeaturesRepository.Add(grToFeature);
                }
                
                _GroupRelationsToFeaturesRepository.SaveChanges();
            }
        }
    }
}
