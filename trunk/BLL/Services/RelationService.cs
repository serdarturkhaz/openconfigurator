using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DAL.Repositories;
using BLL.BusinessObjects;

namespace BLL.Services
{
    public class RelationService : IService<BLL.BusinessObjects.Relation>
    {
        //Fields
        private IRepository<DAL.DataEntities.Relation> _RelationRepository;
        private int _LoggedInUserID;

        //Constructors
        public RelationService(int loggedInUserID)
        {
            _LoggedInUserID = loggedInUserID;

        }

        //Methods
        public IBusinessObject CreateDefault()
        {
            BLL.BusinessObjects.Relation defaultRelation = (BLL.BusinessObjects.Relation)BLL.BusinessObjects.Relation.CreateDefault();
            return defaultRelation;
        }


        //Interface members
        #region IService<Model> Members

        public BusinessObjects.Relation GetByID(int id)
        {
            DAL.DataEntities.Relation relation;
            using (_RelationRepository = new GenericRepository<DAL.DataEntities.Relation>())
            {
                relation = _RelationRepository.SingleOrDefault(r => r.ID == id);
            }
            //
            return new BLL.BusinessObjects.Relation(relation);
        }

        public IList<BusinessObjects.Relation> GetAll()
        {
            throw new NotImplementedException();
        }

        public void Update(BusinessObjects.Relation entity)
        {
            using (_RelationRepository = new GenericRepository<DAL.DataEntities.Relation>())
            {
                //
                _RelationRepository.Attach((DAL.DataEntities.Relation)entity.InnerEntity);
                _RelationRepository.SaveChanges();
            }
        }

        public void Delete(BusinessObjects.Relation entity)
        {
            throw new NotImplementedException();
        }
        public void Delete(int id)
        {
            DAL.DataEntities.Relation relation;
            using (_RelationRepository = new GenericRepository<DAL.DataEntities.Relation>())
            {
                relation = _RelationRepository.SingleOrDefault(m => m.ID == id);
                _RelationRepository.Delete(relation);
                _RelationRepository.SaveChanges();
            }
        }
        public void Add(BusinessObjects.Relation entity)
        {
            using (_RelationRepository = new GenericRepository<DAL.DataEntities.Relation>())
            {
                _RelationRepository.Add((DAL.DataEntities.Relation)entity.InnerEntity);
                _RelationRepository.SaveChanges();
            }
        }


        #endregion


    }
}
