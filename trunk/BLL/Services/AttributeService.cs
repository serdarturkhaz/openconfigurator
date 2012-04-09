using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DAL.Repositories;
using BLL.BusinessObjects;

namespace BLL.Services
{
    public class AttributeService : IDataService
    {
        //Fields
        private IRepository<DAL.DataEntities.Attribute> _AttributeRepository;
        private int _LoggedInUserID;

        //Constructors
        public AttributeService(int loggedInUserID)
        {
            _LoggedInUserID = loggedInUserID;
        }

        //Methods
        public List<BLL.BusinessObjects.Attribute> GetByFeatureID(int FeatureID)
        {
            //
            List<BLL.BusinessObjects.Attribute> BLLAttributes;
            using (_AttributeRepository = new GenericRepository<DAL.DataEntities.Attribute>())
            {
                IEnumerable<DAL.DataEntities.Attribute> DALAttributes = _AttributeRepository.Find(m => m.FeatureID == FeatureID);

                //Create Business objects for each DAL object
                BLLAttributes = new List<BusinessObjects.Attribute>();
                foreach (DAL.DataEntities.Attribute DALAttribute in DALAttributes)
                {
                    //Create the BLL object
                    BLL.BusinessObjects.Attribute BLLAttribute = BLL.BusinessObjects.Attribute.FromDataEntity(DALAttribute);
                    BLLAttributes.Add(BLLAttribute);
                }
            }
            return BLLAttributes;
        }
        public IBusinessObject CreateDefault()
        {
            BLL.BusinessObjects.Attribute defaultAttribute = BLL.BusinessObjects.Attribute.CreateDefault();
            return defaultAttribute;
        }
        public BusinessObjects.Attribute GetByID(int id)
        {
            DAL.DataEntities.Attribute attribute;
            using (_AttributeRepository = new GenericRepository<DAL.DataEntities.Attribute>())
            {
                attribute = _AttributeRepository.SingleOrDefault(m => m.ID == id);
            }
            //
            return new BLL.BusinessObjects.Attribute(attribute);
        }
        public void Update(BusinessObjects.Attribute entity)
        {
            using (_AttributeRepository = new GenericRepository<DAL.DataEntities.Attribute>())
            {
                //Update the Attribute
                _AttributeRepository.Attach((DAL.DataEntities.Attribute)entity.InnerEntity);
                _AttributeRepository.SaveChanges();
            }
        }
        public void Delete(BusinessObjects.Attribute entity)
        {
            Delete(entity.ID);
        }
        public void Delete(int id)
        {
            DAL.DataEntities.Attribute attribute;
            using (_AttributeRepository = new GenericRepository<DAL.DataEntities.Attribute>())
            {
                attribute = _AttributeRepository.SingleOrDefault(m => m.ID == id);
                _AttributeRepository.Delete(attribute);
                _AttributeRepository.SaveChanges();
            }
        }
        public void Add(BusinessObjects.Attribute entity)
        {
            using (_AttributeRepository = new GenericRepository<DAL.DataEntities.Attribute>())
            {
                //Add the Attribute
                _AttributeRepository.Add((DAL.DataEntities.Attribute)entity.InnerEntity);
                _AttributeRepository.SaveChanges();
            }
        }

        //IDataService
        public void Add(IBusinessObject obj)
        {
            Add((BLL.BusinessObjects.Attribute)obj);
        }
        public void Delete(IBusinessObject obj)
        {
            Delete((BLL.BusinessObjects.Attribute)obj);
        }
        public void Update(IBusinessObject obj)
        {
            Update((BLL.BusinessObjects.Attribute)obj);
        }
    }
}
