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

        //Constructors
        public ModelService()
            : this(new GenericRepository<DAL.DataEntities.Model>())
        {
        }
        public ModelService(GenericRepository<DAL.DataEntities.Model> modelRepository)
        {
            _ModelRepository = modelRepository ?? new GenericRepository<DAL.DataEntities.Model>();
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
                BModels.Add((BLL.BusinessObjects.Model)BusinessObjectFactory.CreateBusinessObject(typeof(BLL.BusinessObjects.Model), model));
            }
            return BModels; 
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

        public void Add(BusinessObjects.Model entity)
        {
            throw new NotImplementedException();
        }

        #endregion
    }
}
