using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using BLL.BusinessObjects;
using DAL.Repositories;

namespace BLL.Services
{
    public class UserService : IService<BLL.BusinessObjects.User>
    {
        //Fields
        private IRepository<DAL.DataEntities.User> _UserRepository;
        public BusinessObjectFactory _BusinessObjectFactory;

        //Constructors
        public UserService()
        {
            _UserRepository = new GenericRepository<DAL.DataEntities.User>();
            _BusinessObjectFactory = new BusinessObjectFactory();
        }


        //Methods
        public BLL.BusinessObjects.User GetByEmailAndPassword(string email, string password)
        {
            DAL.DataEntities.User user = _UserRepository.SingleOrDefault(u =>
                u.Email.Equals(email, StringComparison.InvariantCultureIgnoreCase) && u.Password.Equals(password, StringComparison.InvariantCultureIgnoreCase));

            //
            return (BLL.BusinessObjects.User)_BusinessObjectFactory.CreateBusinessObject(typeof(BLL.BusinessObjects.User), user);
        }

        //IService members
        #region IService<BLL.BusinessObjects.User> Members

        public BLL.BusinessObjects.User GetByID(int id)
        {
            DAL.DataEntities.User user = _UserRepository.SingleOrDefault(u => u.ID == id);

            //
            return new BLL.BusinessObjects.User(user);
        }

        public IList<BLL.BusinessObjects.User> GetAll()
        {
            throw new NotImplementedException();
        }

        public void Update(BLL.BusinessObjects.User entity)
        {
            throw new NotImplementedException();
        }

        public void Delete(BLL.BusinessObjects.User entity)
        {
            throw new NotImplementedException();
        }

        public void Add(BLL.BusinessObjects.User entity)
        {
            throw new NotImplementedException();
        }

        #endregion
    }
}
