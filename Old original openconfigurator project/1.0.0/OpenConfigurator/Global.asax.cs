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

            
            //Map other routes
            routes.MapRoute(
                "ConfigurationEditor", // Route name
                "ConfigurationEditor/{action}/{configurationID}", // URL with parameters
                new { controller = "ConfigurationEditor", action = "ConfigurationEditor", configurationID = "" } // Parameter defaults
            );
            routes.MapRoute(
                "UITemplateEditor", 
                "UITemplateEditor/{action}/{uiTemplateID}", // 
                new { controller = "UITemplateEditor", action = "UITemplateEditor", uiTemplateID = "" } 
            );
            routes.MapRoute(
                "ModelEditor", 
                "ModelEditor/{action}/{modelID}", 
                new { controller = "ModelEditor", action = "ModelEditor", modelID = "" }
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