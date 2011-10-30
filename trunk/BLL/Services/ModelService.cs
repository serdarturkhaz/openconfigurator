using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DAL.Repositories;
using BLL.BusinessObjects;

namespace BLL.Services
{
    public class ModelService : IService<BLL.BusinessObjects.Model>
    {
        //Fields
        private IRepository<DAL.DataEntities.Model> _ModelRepository;
        private int _LoggedInUserID;
        private BusinessObjectFactory _BusinessObjectFactory;

        //Constructors
        public ModelService(int loggedInUserID)           
        {
            _LoggedInUserID = loggedInUserID;
            _ModelRepository = new GenericRepository<DAL.DataEntities.Model>();
            _BusinessObjectFactory = new ModelFactory();
        }

        //Methods
        public IList<BLL.BusinessObjects.Model> GetByUserID(int userid)
        {
            IEnumerable<DAL.DataEntities.Model> models = _ModelRepository.Find(m =>
                m.UserID == userid);

            //Create Business objects for each DAL object
            List<BLL.BusinessObjects.Model> BModels = new List<BusinessObjects.Model>();
            foreach(DAL.DataEntities.Model model in models)
            {
                BModels.Add((BLL.BusinessObjects.Model)_BusinessObjectFactory.CreateBusinessObject(typeof(BLL.BusinessObjects.Model), model));
            }
            return BModels; 
        }
        public IBusinessObject CreateDefault()
        {
            BLL.BusinessObjects.Model defaultModel = (BLL.BusinessObjects.Model)_BusinessObjectFactory.CreateDefault(_LoggedInUserID);
            return defaultModel;
        }

        //Interface members
        #region IService<Model> Members

        public BusinessObjects.Model GetByID(int ID)
        {
            throw new NotImplementedException();
        }

        public IList<BusinessObjects.Model> GetAll()
        {
            throw new NotImplementedException();
        }

        public void Update(BusinessObjects.Model entity)
        {
            throw new NotImplementedException();
        }

        public void Delete(BusinessObjects.Model entity)
        {
            throw new NotImplementedException();
        }
        public void Delete(int id)
        {
            DAL.DataEntities.Model model = _ModelRepository.SingleOrDefault(m => m.ID == id);
            _ModelRepository.Delete(model);
            _ModelRepository.SaveChanges();
        }
        public void Add(BusinessObjects.Model entity)
        {
            _ModelRepository.Add((DAL.DataEntities.Model) entity.InnerEntity);
            _ModelRepository.SaveChanges();
        }


        #endregion
    }
}
