using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DAL.Repositories;
using BLL.BusinessObjects;

namespace BLL.Services
{
    public class ConfigurationService
    {
        //Fields
        private IRepository<DAL.DataEntities.Configuration> _ConfigurationRepository;
        private int _LoggedInUserID;

        //Constructors
        public ConfigurationService(int loggedInUserID)
        {
            _LoggedInUserID = loggedInUserID;
        }

        //Methods
        public IBusinessObject CreateDefault(int modelID)
        {
            BLL.BusinessObjects.Configuration defaultConfiguration = (BLL.BusinessObjects.Configuration)BLL.BusinessObjects.Configuration.CreateDefault(modelID);
            return defaultConfiguration;
        }

        public List<BLL.BusinessObjects.Configuration> GetByModelID(int modelID)
        {
            //
            List<BLL.BusinessObjects.Configuration> BLLConfigurations = new List<BusinessObjects.Configuration>();
            using (_ConfigurationRepository = new GenericRepository<DAL.DataEntities.Configuration>())
            {
                List<DAL.DataEntities.Configuration> DALConfigurations = _ConfigurationRepository.Find(m => m.ModelID == modelID).ToList<DAL.DataEntities.Configuration>();
                DALConfigurations.ForEach(DALentity => BLLConfigurations.Add(BLL.BusinessObjects.Configuration.FromDataEntity(DALentity)));
            }
            return BLLConfigurations;
        }
        public List<BLL.BusinessObjects.Configuration> GetByUserID(int userID)
        {
            //
            List<BLL.BusinessObjects.Configuration> BLLConfigurations = new List<Configuration>();
            using (_ConfigurationRepository = new GenericRepository<DAL.DataEntities.Configuration>())
            {
                List<DAL.DataEntities.Configuration> DALConfigurations = _ConfigurationRepository.Find(m => m.Model.UserID == userID).ToList<DAL.DataEntities.Configuration>();
                DALConfigurations.ForEach(DALentity => BLLConfigurations.Add(BLL.BusinessObjects.Configuration.FromDataEntity(DALentity)));
            }
            return BLLConfigurations;
        }
        public void UpdateName(int configurationID, string newName)
        {
            using (_ConfigurationRepository = new GenericRepository<DAL.DataEntities.Configuration>())
            {
                DAL.DataEntities.Configuration model = _ConfigurationRepository.SingleOrDefault(m => m.ID == configurationID);
                model.LastModifiedDate = DateTime.Now;
                model.Name = newName;

                _ConfigurationRepository.SaveChanges();
            }
        }
        public BusinessObjects.Configuration GetByID(int id)
        {
            BLL.BusinessObjects.Configuration BLLConfiguration;
            using (_ConfigurationRepository = new GenericRepository<DAL.DataEntities.Configuration>())
            {
                DAL.DataEntities.Configuration DALConfiguration = _ConfigurationRepository.SingleOrDefault(m => m.ID == id);
                BLLConfiguration = BLL.BusinessObjects.Configuration.FromDataEntity(DALConfiguration);
            }
            //
            return BLLConfiguration;
        }
        public void Update(BusinessObjects.Configuration entity)
        {
            using (_ConfigurationRepository = new GenericRepository<DAL.DataEntities.Configuration>())
            {
                entity.LastModifiedDate = DateTime.Now;
                //
                _ConfigurationRepository.Attach((DAL.DataEntities.Configuration)entity.InnerEntity);
                _ConfigurationRepository.SaveChanges();
            }
        }
        public void Delete(BusinessObjects.Configuration entity)
        {
            Delete(entity.ID);
        }
        public void Delete(int id)
        {
            DAL.DataEntities.Configuration DALConfiguration;
            using (_ConfigurationRepository = new GenericRepository<DAL.DataEntities.Configuration>())
            {
                DALConfiguration = _ConfigurationRepository.SingleOrDefault(m => m.ID == id);
                _ConfigurationRepository.Delete(DALConfiguration);
                _ConfigurationRepository.SaveChanges();
            }
        }
        public void Add(BusinessObjects.Configuration entity)
        {
            using (_ConfigurationRepository = new GenericRepository<DAL.DataEntities.Configuration>())
            {
                _ConfigurationRepository.Add((DAL.DataEntities.Configuration)entity.InnerEntity);
                _ConfigurationRepository.SaveChanges();
            }
        }
    }
}
