using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DAL.Repositories;
using BLL.BusinessObjects;

namespace BLL.Services
{
    public class ModelService 
    {
        //Fields
        private IRepository<DAL.DataEntities.Model> _ModelRepository;
        private int _LoggedInUserID;

        //Constructors
        public ModelService(int loggedInUserID)
        {
            _LoggedInUserID = loggedInUserID;

        }

        //Methods
        public List<BLL.BusinessObjects.Model> GetByUserID(int userid)
        {
            //
            List<BLL.BusinessObjects.Model> BModels;
            using (_ModelRepository = new GenericRepository<DAL.DataEntities.Model>())
            {
                List<DAL.DataEntities.Model> models = _ModelRepository.Find(m => m.UserID == userid).ToList<DAL.DataEntities.Model>();

                //Create Business objects for each DAL object
                BModels = new List<BusinessObjects.Model>();
                foreach (DAL.DataEntities.Model model in models)
                {
                    BModels.Add((BLL.BusinessObjects.Model)BLL.BusinessObjects.Model.FromDataEntity(model));
                }
            }
            return BModels;
        }
        public void UpdateName(int modelID, string newName)
        {
            using (_ModelRepository = new GenericRepository<DAL.DataEntities.Model>())
            {
                DAL.DataEntities.Model model = _ModelRepository.SingleOrDefault(m => m.ID == modelID);
                model.LastModifiedDate = DateTime.Now;
                model.Name = newName;

                //_ModelRepository.Attach(model);
                _ModelRepository.SaveChanges();
            }
        }
        public IBusinessObject CreateDefault()
        {
            BLL.BusinessObjects.Model defaultModel = (BLL.BusinessObjects.Model)BLL.BusinessObjects.Model.CreateDefault(_LoggedInUserID);
            return defaultModel;
        }

        //Interface members
        #region IService<Model> Members

        public BusinessObjects.Model GetByID(int id)
        {
            BLL.BusinessObjects.Model BLLmodel;
            using (_ModelRepository = new GenericRepository<DAL.DataEntities.Model>())
            {
                DAL.DataEntities.Model DALmodel = _ModelRepository.SingleOrDefault(m => m.ID == id);
                BLLmodel = BLL.BusinessObjects.Model.FromDataEntity(DALmodel);
            }
            //
            return BLLmodel;
        }
        public IList<BusinessObjects.Model> GetAll()
        {
            throw new NotImplementedException();
        }
        public void Update(BusinessObjects.Model entity)
        {
            using (_ModelRepository = new GenericRepository<DAL.DataEntities.Model>())
            {
                entity.LastModifiedDate = DateTime.Now;
                //
                _ModelRepository.Attach((DAL.DataEntities.Model)entity.InnerEntity);
                _ModelRepository.SaveChanges();
            }
        }
        public void Delete(BusinessObjects.Model entity)
        {
            throw new NotImplementedException();
        }
        public void Delete(int id)
        {
            DAL.DataEntities.Model model;
            using (_ModelRepository = new GenericRepository<DAL.DataEntities.Model>())
            {
                model = _ModelRepository.SingleOrDefault(m => m.ID == id);
                _ModelRepository.Delete(model);
                _ModelRepository.SaveChanges();
            }
        }
        public void Add(BusinessObjects.Model entity)
        {
            using (_ModelRepository = new GenericRepository<DAL.DataEntities.Model>())
            {
                _ModelRepository.Add((DAL.DataEntities.Model)entity.InnerEntity);
                _ModelRepository.SaveChanges();
            }
        }

        #endregion
    }
}
