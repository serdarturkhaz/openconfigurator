using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using BLL.BusinessObjects;
using DAL.Repositories;

namespace BLL.Services
{
    public class UserService
    {
        //Fields
        private IRepository<DAL.DataEntities.User> _UserRepository;

        //Constructors
        public UserService()
        {
        }

        //Methods
        public BLL.BusinessObjects.User GetByEmailAndPassword(string email, string password)
        {
            DAL.DataEntities.User user;
            using (_UserRepository = new GenericRepository<DAL.DataEntities.User>())
            {
                user = _UserRepository.SingleOrDefault(u =>
                    u.Email.Equals(email, StringComparison.InvariantCultureIgnoreCase) && u.Password.Equals(password, StringComparison.InvariantCultureIgnoreCase));
            }
            //
            return (BLL.BusinessObjects.User)BLL.BusinessObjects.User.FromDataEntity(user);
        }
        public BLL.BusinessObjects.User GetByID(int id)
        {
            DAL.DataEntities.User user;
            using (_UserRepository = new GenericRepository<DAL.DataEntities.User>())
            {
                user = _UserRepository.SingleOrDefault(u => u.ID == id);
            }
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
    }
}
