using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BLL.BusinessObjects;
using System.Data.Objects;
using Microsoft.Z3;

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

        //SessionModels
        public static Dictionary<int, Context> SolverContexts //One SolverContext per ModelID
        {
            get
            {
                if (HttpContext.Current.Session["SolverContexts"] == null)
                    HttpContext.Current.Session["SolverContexts"] = new Dictionary<int, Context>();

                return (Dictionary<int, Context>)HttpContext.Current.Session["SolverContexts"];

            }

        }


    }
}