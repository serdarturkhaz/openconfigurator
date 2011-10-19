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


        public JsonNetResult Submit(string Email, string Password)
        {
            //
            UserService _userService = new UserService();
            DAL.DataEntities.User loginUser = _userService.GetByEmailAndPassword(Email, Password);
            
            //EntitiesContainer container = new EntitiesContainer();
            //User sampleUser1 = new User
            //{
            //    Email = "Radu",
            //    Password = "hej123!"
            //};

            //container.Users.AddObject(sampleUser1);
            //container.SaveChanges();

            JsonNetResult result = new JsonNetResult();
            result.Data = (loginUser!=null);

            //
            return result;
        }

    }
}
