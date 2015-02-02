using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using OpenConfigurator.Core.BLOs;
using OpenConfigurator.Core.XmlDAL.DataEntities;

namespace OpenConfigurator.Core.BLOFactories
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
            Assembly assembly = Assembly.GetAssembly(typeof(OpenConfigurator.Core.BLOs.FeatureModel));
            Type bloType = assembly.GetType("OpenConfigurator.ModellingTool.BLL.BLOs." + bloName);
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
