using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using PresentationLayer.Common;

namespace PresentationLayer.Controllers
{
    public class GeneralController : Controller
    {

        public void Logout()
        {
            WebSecurity.Logout();
            FormsAuthentication.RedirectToLoginPage();
        }

    }
}
