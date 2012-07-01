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
