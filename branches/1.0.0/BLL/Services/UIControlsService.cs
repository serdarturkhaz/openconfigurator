// Developed by OpenConfigurator Core Team
// 
// Distributed under the MIT license
// ===========================================================
// Copyright (c) 2012 - Radu Mitache
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, 
// publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR 
// OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR 
// OTHER DEALINGS IN THE SOFTWARE.
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using BLL.BusinessObjects;
using DAL.Repositories;
using System.IO;
using System.Reflection;

namespace BLL.Services
{
    public class UIControlsService
    {
        //Methods
        public static UIControlResourceHolder GetUIControlResources(BusinessObjects.UIControlTypes controltype)
        {
            //Variables
            string resourcePath = "BLL.UIControls." + controltype.ToString() + "." + controltype.ToString();
            string controlTagElem = "", script = "", innerHtml = "", css = "";
            string controlTagPath = "BLL.UIControls.ControlTag.htm";

            //Get the innerHtml content and script
            innerHtml = GetEmbeddedUIControlResource(resourcePath + ".htm");
            css = GetEmbeddedUIControlResource(resourcePath + ".css");
            script = GetEmbeddedUIControlResource(resourcePath + ".js");

            //
            UIControlResourceHolder holder = new UIControlResourceHolder(controltype, innerHtml, css, script);
            return holder;
        }
        public static string GetGenericControlTag()
        {
            string controlTag = GetEmbeddedUIControlResource("BLL.UIControls.GenericControlTag.htm");
            return controlTag;
        }
        private static string GetEmbeddedUIControlResource(string path)
        {
            //
            string result = "";

            //
            Stream st = Assembly.GetExecutingAssembly().GetManifestResourceStream(path);
            if (st != null)
            {
                result = new StreamReader(st).ReadToEnd();
            }

            //
            return result;
        }
    }
}
