using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DAL.Repositories;
using BLL.BusinessObjects;

namespace BLL.Services
{
    public class GroupRelationService : IService<BLL.BusinessObjects.GroupRelation>
    {
        //Fields
        private IRepository<DAL.DataEntities.GroupRelation> _GroupRelationRepository;
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
        public Dictionary<int, string> GetGroupRelationTypes()
        {
            Dictionary<int, string> dict = new Dictionary<int, string>();
            dict = Enum.GetValues(typeof(BLL.BusinessObjects.RelationTypes))
               .Cast<BLL.BusinessObjects.RelationTypes>()
               .ToDictionary(t => (int)t, t => t.ToString());

            return dict;
        }

        //Interface members
        #region IService<Model> Members

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
            throw new NotImplementedException();
        }
        public void Delete(int id)
        {
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
            using (_GroupRelationRepository = new GenericRepository<DAL.DataEntities.GroupRelation>())
            {
                _GroupRelationRepository.Add((DAL.DataEntities.GroupRelation)entity.InnerEntity);
                _GroupRelationRepository.SaveChanges();
            }
        }


        #endregion


    }
}
