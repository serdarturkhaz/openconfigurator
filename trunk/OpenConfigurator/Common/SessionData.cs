using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BLL.BusinessObjects;
using System.Data.Objects;
using BLL.SolverEngines;
using BLL.Services;

namespace PresentationLayer.Common
{
    public static class SessionData
    {
        //LoggedInUser
        public static BLL.BusinessObjects.User LoggedInUser
        {
            get
            {
                return (BLL.BusinessObjects.User) HttpContext.Current.Session["CurrentUser"];

            }
            set
            {
                HttpContext.Current.Session["CurrentUser"] = value;
            }
        }

        //SolverContexts
        public static Dictionary<int, ConfiguratorSession> ConfiguratorSessions //One ConfigurationState per ConfigurationID
        {
            get
            {
                if (HttpContext.Current.Session["ConfiguratorSessions"] == null)
                    HttpContext.Current.Session["ConfiguratorSessions"] = new Dictionary<int, ConfiguratorSession>();

                return (Dictionary<int, ConfiguratorSession>)HttpContext.Current.Session["ConfiguratorSessions"];
            }
        }
    }
}