using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DAL.Repositories;
using BLL.BusinessObjects;

namespace BLL.Services
{
    public class CustomRuleService : IService<BLL.BusinessObjects.CustomRule>
    {
        //Fields
        private IRepository<DAL.DataEntities.CustomRule> _CustomRuleRepository;
        private int _LoggedInUserID;
        
        //Constructors
        public CustomRuleService(int loggedInUserID)
        {
            _LoggedInUserID = loggedInUserID;
        }

        //Methods
        public List<BLL.BusinessObjects.CustomRule> GetByModelID(int ModelID)
        {
            //
            List<BLL.BusinessObjects.CustomRule> BCustomRules;
            using (_CustomRuleRepository = new GenericRepository<DAL.DataEntities.CustomRule>())
            {
                IEnumerable<DAL.DataEntities.CustomRule> customRules = _CustomRuleRepository.Find(m => m.ModelID == ModelID);

                //Create Business objects for each DAL object
                BCustomRules = new List<BusinessObjects.CustomRule>();
                foreach (DAL.DataEntities.CustomRule customRule in customRules)
                {
                    BCustomRules.Add((BLL.BusinessObjects.CustomRule)BLL.BusinessObjects.CustomRule.FromDataEntity(customRule));
                }
            }
            return BCustomRules;
        }

        public IBusinessObject CreateDefault()
        {
            BLL.BusinessObjects.CustomRule defaultCustomRule = BLL.BusinessObjects.CustomRule.CreateDefault();
            return defaultCustomRule;
        }



        //Interface members
        #region IService<Feature> Members

        public BusinessObjects.CustomRule GetByID(int id)
        {
            DAL.DataEntities.CustomRule customRule;
            using (_CustomRuleRepository = new GenericRepository<DAL.DataEntities.CustomRule>())
            {
                customRule = _CustomRuleRepository.SingleOrDefault(m => m.ID == id);
            }
            //
            return new BLL.BusinessObjects.CustomRule(customRule);
        }

        public IList<BusinessObjects.CustomRule> GetAll()
        {
            throw new NotImplementedException();
        }

        public void Update(BusinessObjects.CustomRule entity)
        {
            using (_CustomRuleRepository = new GenericRepository<DAL.DataEntities.CustomRule>())
            {
                //
                _CustomRuleRepository.Attach((DAL.DataEntities.CustomRule)entity.InnerEntity);
                _CustomRuleRepository.SaveChanges();
            }
        }

        public void Delete(BusinessObjects.CustomRule entity)
        {
            Delete(entity.ID);
        }
        public void Delete(int id)
        {
            DAL.DataEntities.CustomRule customRule;
            using (_CustomRuleRepository = new GenericRepository<DAL.DataEntities.CustomRule>())
            {
                customRule = _CustomRuleRepository.SingleOrDefault(m => m.ID == id);
                _CustomRuleRepository.Delete(customRule);
                _CustomRuleRepository.SaveChanges();
            }
        }
        public void Add(BusinessObjects.CustomRule entity)
        {
            using (_CustomRuleRepository = new GenericRepository<DAL.DataEntities.CustomRule>())
            {
                _CustomRuleRepository.Add((DAL.DataEntities.CustomRule)entity.InnerEntity);
                _CustomRuleRepository.SaveChanges();
            }
        }


        #endregion
    }
}
