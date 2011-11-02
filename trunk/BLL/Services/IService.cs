using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Linq.Expressions;

namespace BLL.Services
{
    public interface IService<T>
    {
        //Retreive
        T GetByID(int ID);
        IList<T> GetAll();

        //Update
        void Update(T entity);

        //Delete
        void Delete(T entity);

        //Create
        void Add(T entity);

    }
}
