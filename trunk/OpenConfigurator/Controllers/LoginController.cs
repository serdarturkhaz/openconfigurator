using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;
using PresentationLayer.Common;
using BLL.Services;
using BLL.BusinessObjects;
namespace PresentationLayer.Controllers
{
    public class LoginController : Controller
    {
        public ActionResult Login()
        {
            return View();
        }

        public JsonNetResult CallLogin(string email, string password)
        {
            //Default return variable
            JsonNetResult result = new JsonNetResult() { Data = null };

            //Verify the user credentials
            bool validUser = WebSecurity.AuthenticateUser(email, password);
            if (validUser)
            {
                result.Data = new JObject() { 
                    new JProperty("Redirect", Url.Action("Models", "Models"))
                };

            }

            //
            return result;
        }

        //public JsonNetResult CallLogin(string email, string password)
        //{
        //    bool validUser = WebSecurity.AuthenticateUser(email, password);

        //    //EntitiesContainer container = new EntitiesContainer();
        //    //User sampleUser1 = new User
        //    //{
        //    //    Email = "Radu",
        //    //    Password = "hej123!"
        //    //};

        //    //container.Users.AddObject(sampleUser1);
        //    //container.SaveChanges();

        //    JsonNetResult result = new JsonNetResult();
        //    result.Data = validUser;

        //    //
        //    return result;
        //}

    }
}
