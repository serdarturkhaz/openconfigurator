using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DAL.Repositories;
using BLL.BusinessObjects;

namespace BLL.Services
{
    public class CompositionRuleService : IService<BLL.BusinessObjects.CompositionRule>
    {
        //Fields
        private IRepository<DAL.DataEntities.CompositionRule> _CompositionRuleRepository;
        private int _LoggedInUserID;
        
        //Constructors
        public CompositionRuleService(int loggedInUserID)
        {
            _LoggedInUserID = loggedInUserID;
        }

        //Methods
        public IBusinessObject CreateDefault()
        {
            BLL.BusinessObjects.CompositionRule defaultCompositionRule = BLL.BusinessObjects.CompositionRule.CreateDefault();
            return defaultCompositionRule;
        }



        //Interface members
        #region IService<Feature> Members

        public BusinessObjects.CompositionRule GetByID(int id)
        {
            DAL.DataEntities.CompositionRule feature;
            using (_CompositionRuleRepository = new GenericRepository<DAL.DataEntities.CompositionRule>())
            {
                feature = _CompositionRuleRepository.SingleOrDefault(m => m.ID == id);
            }
            //
            return new BLL.BusinessObjects.CompositionRule(feature);
        }

        public IList<BusinessObjects.CompositionRule> GetAll()
        {
            throw new NotImplementedException();
        }

        public void Update(BusinessObjects.CompositionRule entity)
        {
            using (_CompositionRuleRepository = new GenericRepository<DAL.DataEntities.CompositionRule>())
            {
                //
                _CompositionRuleRepository.Attach((DAL.DataEntities.CompositionRule)entity.InnerEntity);
                _CompositionRuleRepository.SaveChanges();
            }
        }

        public void Delete(BusinessObjects.CompositionRule entity)
        {
            throw new NotImplementedException();
        }
        public void Delete(int id)
        {
            DAL.DataEntities.CompositionRule feature;
            using (_CompositionRuleRepository = new GenericRepository<DAL.DataEntities.CompositionRule>())
            {
                feature = _CompositionRuleRepository.SingleOrDefault(m => m.ID == id);
                _CompositionRuleRepository.Delete(feature);
                _CompositionRuleRepository.SaveChanges();
            }
        }
        public void Add(BusinessObjects.CompositionRule entity)
        {
            using (_CompositionRuleRepository = new GenericRepository<DAL.DataEntities.CompositionRule>())
            {
                _CompositionRuleRepository.Add((DAL.DataEntities.CompositionRule)entity.InnerEntity);
                _CompositionRuleRepository.SaveChanges();
            }
        }


        #endregion


    }
}
