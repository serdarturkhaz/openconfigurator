using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BLL.BusinessObjects;

namespace PresentationLayer.Common
{
    public static class SessionData
    {
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
    }
}