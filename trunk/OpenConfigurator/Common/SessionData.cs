using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BLL.BusinessObjects;
using System.Data.Objects;
using BLL.SolverEngines;

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
        public static Dictionary<int, ISolverContext> SolverContexts //One SolverContext per ConfigurationID
        {
            get
            {
                if (HttpContext.Current.Session["SolverContexts"] == null)
                    HttpContext.Current.Session["SolverContexts"] = new Dictionary<int, ISolverContext>();

                return (Dictionary<int, ISolverContext>)HttpContext.Current.Session["SolverContexts"];
            }
        }

        //FeatureSelection collections
        public static Dictionary<int, List<BLL.BusinessObjects.FeatureSelection>> FeatureSelections //One FeatureSelection list per ConfigurationID
        {
            get
            {
                if (HttpContext.Current.Session["FeatureSelections"] == null)
                    HttpContext.Current.Session["FeatureSelections"] = new Dictionary<int, List<BLL.BusinessObjects.FeatureSelection>>();

                return (Dictionary<int, List<BLL.BusinessObjects.FeatureSelection>>)HttpContext.Current.Session["FeatureSelections"];
            }
        }
    }
}