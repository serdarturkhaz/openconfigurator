using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using BLL.BusinessObjects;
using DAL.Repositories;

namespace BLL.Services
{
    public class UserService: IService<BUser>
    {
        //Fields
        private IRepository<BUser> _UserRepository;

        //Constructors
        public UserService()
            : this(new GenericRepository<BUser>())
        {
        }
        public UserService(GenericRepository<BUser> userRepository)
        {
            _UserRepository = userRepository ?? new GenericRepository<BUser>();
        }


        //Methods
        public DAL.DataEntities.User GetByEmailAndPassword(string Email, string Password)
        {
            return _UserRepository.First(user =>
                (String.Compare(user.Email, Email, true) == 1) && user.Password == Password);
        }

        //IService members
        #region IService<User> Members

        public BUser GetByID(int ID)
        {
            return _UserRepository.First(user => user.ID == ID);
        }

        public IList<BUser> GetAll()
        {
            throw new NotImplementedException();
        }

        public void Update(BUser entity)
        {
            throw new NotImplementedException();
        }

        public void Delete(BUser entity)
        {
            throw new NotImplementedException();
        }

        public void Add(BUser entity)
        {
            throw new NotImplementedException();
        }

        #endregion
    }
}
