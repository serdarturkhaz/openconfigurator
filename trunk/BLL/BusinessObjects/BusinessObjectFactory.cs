﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;
using System.Globalization;

namespace BLL.BusinessObjects
{
    public class BusinessObjectFactory
    {
        //Fields

        //Methods
        public virtual IBusinessObject CreateBusinessObject(Type businessObjectType , DAL.DataEntities.IDataEntity innerEntity)
        {
            //Default return variable
            IBusinessObject newBusinessObject = null;

            //
            if (innerEntity != null)
            {
                BindingFlags flags = BindingFlags.NonPublic | BindingFlags.Instance;
                CultureInfo culture = CultureInfo.InvariantCulture; 

                newBusinessObject = (IBusinessObject)Activator.CreateInstance(businessObjectType, flags, null, new object[] { innerEntity }, culture);
            }

            //
            return newBusinessObject;
        }

        public virtual IBusinessObject CreateDefault(int userID)
        {
            return null;   
        }
    }
}