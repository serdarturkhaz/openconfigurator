// Developed by OpenConfigurator Core Team
// 
// Distributed under the MIT license
// ===========================================================
// Copyright (c) 2012 - Radu Mitache
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, 
// publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR 
// OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR 
// OTHER DEALINGS IN THE SOFTWARE.
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
        public IBusinessObject CreateDefault()
        {
            BLL.BusinessObjects.Model defaultModel = (BLL.BusinessObjects.Model)BLL.BusinessObjects.Model.CreateDefault(_LoggedInUserID);
            return defaultModel;
        }
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
                    BModels.Add((BLL.BusinessObjects.Model)BLL.BusinessObjects.Model.CreateInstance(model));
                }
            }
            return BModels;
        }
        public List<BLL.BusinessObjects.Model> GetByUserID_Shallow(int userid)
        {
            //
            List<BLL.BusinessObjects.Model> BModels;
            using (_ModelRepository = new GenericRepository<DAL.DataEntities.Model>())
            {
                //Shallow retreival
                _ModelRepository.GetContext().ContextOptions.LazyLoadingEnabled = false;


                //
                List<DAL.DataEntities.Model> models = _ModelRepository.Find(m => m.UserID == userid).ToList<DAL.DataEntities.Model>();

                //Create Business objects for each DAL object
                BModels = new List<BusinessObjects.Model>();
                foreach (DAL.DataEntities.Model model in models)
                {
                    BModels.Add((BLL.BusinessObjects.Model)BLL.BusinessObjects.Model.CreateInstance(model));
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
        public BusinessObjects.Model GetByID(int id)
        {
            BLL.BusinessObjects.Model BLLmodel;
            using (_ModelRepository = new GenericRepository<DAL.DataEntities.Model>())
            {
                DAL.DataEntities.Model DALmodel = _ModelRepository.SingleOrDefault(m => m.ID == id);
                BLLmodel = BLL.BusinessObjects.Model.CreateInstance(DALmodel);
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
    }
}
