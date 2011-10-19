using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BLL.BusinessObjects;

namespace PresentationLayer.Common
{
    public static class SessionData
    {
        public static BUser CurrentUser
        {
            get
            {
                return (BUser) HttpContext.Current.Session["CurrentUser"];

            }
            set
            {
                HttpContext.Current.Session["CurrentUser"] = value;
            }
        }
    }
}