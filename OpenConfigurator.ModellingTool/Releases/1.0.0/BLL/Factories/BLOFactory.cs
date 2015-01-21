﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using BLL.BLOs;
using DAL.DataEntities;

namespace BLL
{
    public class GenericBLOFactory
    {

        // Constructor
        internal GenericBLOFactory()
        {

        }
        public static GenericBLOFactory GetInstance()
        {
            return new GenericBLOFactory();
        }

        // Public methods
        public iBLO CreateBLOInstance(string bloName)
        {
            Assembly assembly = Assembly.GetAssembly(typeof(BLL.BLOs.FeatureModel));
            Type bloType = assembly.GetType("BLL.BLOs." + bloName);
            return CreateBLOInstance(bloType);
        }
        public iBLO CreateBLOInstance(Type bloType)
        {
            iBLO instance = (iBLO)bloType.GetMethod("CreateDefault", BindingFlags.NonPublic | BindingFlags.Static).Invoke(null, null);
            return instance;
        }
        public iBLO FromDataEntity(iDataEntity dto)
        {
            return null;
        }
    }
}