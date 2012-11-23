using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace PresentationLayer
{

    public class MvcApplication : System.Web.HttpApplication
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }

        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            //Default route - login page
            routes.MapRoute(
                "Default", 
                "{controller}/{action}", 
                new { controller = "Login", action = "Login" } 
            );

            
            //
            routes.MapRoute(
                "ConfigurationEditor", // Route name
                "ConfigurationEditor/{action}/{configurationID}", // URL with parameters
                new { controller = "ConfigurationEditor", action = "ConfigurationEditor", configurationID = "" } // Parameter defaults
            );
            routes.MapRoute(
                "UITemplateEditor", // Route name
                "UITemplateEditor/{action}/{uiTemplateID}", // URL with parameters
                new { controller = "UITemplateEditor", action = "UITemplateEditor", uiTemplateID = "" } // Parameter defaults
            );
            routes.MapRoute(
                "ModelEditor", // Route name
                "ModelEditor/{action}/{modelID}", // URL with parameters
                new { controller = "ModelEditor", action = "ModelEditor", modelID = "" } // Parameter defaults
            );
        }

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            RegisterGlobalFilters(GlobalFilters.Filters);
            RegisterRoutes(RouteTable.Routes);
        }
    }
}