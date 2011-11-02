using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BLL.BusinessObjects;
using System.Data.Objects;

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
        public static Dictionary<int,BLL.BusinessObjects.Model> SessionModels
        {
            get
            {
                if (HttpContext.Current.Session["SessionModels"] == null)
                    HttpContext.Current.Session["SessionModels"] = new Dictionary<int,BLL.BusinessObjects.Model>();

                return (Dictionary<int, BLL.BusinessObjects.Model>)HttpContext.Current.Session["SessionModels"];

            }

        }

        //DataContexts
        public static List<ObjectContext> DataContexts
        {
            get
            {
                if (HttpContext.Current.Session["DataContexts"] == null)
                    HttpContext.Current.Session["DataContexts"] = new List<ObjectContext>();

                return (List<ObjectContext>)HttpContext.Current.Session["DataContexts"];

            }
        }
    }
}