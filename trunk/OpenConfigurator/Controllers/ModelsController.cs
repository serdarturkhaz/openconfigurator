using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PresentationLayer.Controllers
{
    public class ModelsController : Controller
    {
        [Authorize]
        public ActionResult Models()
        {
            return View();
        }
    }
}
