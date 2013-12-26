using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using OpenConfigurator.Core.BLOs;

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
        public iBLO CreateInstance(string typeName)
        {
            Type bloType = Type.GetType("");
            return CreateInstance(bloType);
        }
        public iBLO CreateInstance(Type type)
        {
            iBLO instance = (iBLO)type.GetMethod("CreateDefault", BindingFlags.NonPublic | BindingFlags.Static).Invoke(null, null);
            return instance;
        }
    }
}
