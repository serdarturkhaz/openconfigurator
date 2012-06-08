using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BLL.Services;
using System.Web.Security;

namespace PresentationLayer.Common
{
    public static class WebSecurity
    {
        public static bool AuthenticateUser(string email, string password)
        {
            //Attempt to retreive the User with the given credentials
            UserService _userService = new UserService();
            BLL.BusinessObjects.User loginUser = _userService.GetByEmailAndPassword(email, password);
            
            //
            if (loginUser != null)
            {
                FormsAuthentication.SetAuthCookie(email,false); 
                SessionData.LoggedInUser = loginUser;
                return true;
            }
            else
            {
                return false;
            }
        }

        public static void Logout()
        {
            SessionData.LoggedInUser = null;
            FormsAuthentication.SignOut();
        }
    }
}