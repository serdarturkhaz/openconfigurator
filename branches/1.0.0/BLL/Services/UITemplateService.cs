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
    public class UITemplateService
    {
        //Fields
        private IRepository<DAL.DataEntities.UITemplate> _UITemplateRepository;
        private int _LoggedInUserID;

        //Constructors
        public UITemplateService(int loggedInUserID)
        {
            _LoggedInUserID = loggedInUserID;

        }

        //Methods
        public IBusinessObject CreateDefault()
        {
            BLL.BusinessObjects.UITemplate defaultObj = (BLL.BusinessObjects.UITemplate)BLL.BusinessObjects.UITemplate.CreateDefault(_LoggedInUserID);
            return defaultObj;
        }
        public List<BLL.BusinessObjects.UITemplate> GetByUserID(int userid, bool excludeContentAndCSS = false)
        {
            //
            List<BLL.BusinessObjects.UITemplate> BUITemplates;
            using (_UITemplateRepository = new GenericRepository<DAL.DataEntities.UITemplate>())
            {
                List<DAL.DataEntities.UITemplate> templates = _UITemplateRepository.Find(m => m.UserID == userid).ToList<DAL.DataEntities.UITemplate>();

                //Create Business objects for each DAL object
                BUITemplates = new List<BusinessObjects.UITemplate>();
                foreach (DAL.DataEntities.UITemplate template in templates)
                {
                    if (excludeContentAndCSS)
                    {
                        template.Content = "";
                        template.Stylesheet = "";
                    }
                    
                    BUITemplates.Add((BLL.BusinessObjects.UITemplate)BLL.BusinessObjects.UITemplate.FromDataEntity(template));
                }
            }
            return BUITemplates;
        }
        public BLL.BusinessObjects.UITemplate GetByID(int id)
        {
            DAL.DataEntities.UITemplate uiTemplate;
            using (_UITemplateRepository = new GenericRepository<DAL.DataEntities.UITemplate>())
            {
                uiTemplate = _UITemplateRepository.SingleOrDefault(u => u.ID == id);
            }
            //
            return new BLL.BusinessObjects.UITemplate(uiTemplate);
        }
        public IList<BLL.BusinessObjects.UITemplate> GetAll()
        {
            throw new NotImplementedException();
        }
        public void Update(BLL.BusinessObjects.UITemplate entity)
        {
            using (_UITemplateRepository = new GenericRepository<DAL.DataEntities.UITemplate>())
            {
                entity.LastModifiedDate = DateTime.Now;

                //
                _UITemplateRepository.Attach((DAL.DataEntities.UITemplate)entity.InnerEntity);
                _UITemplateRepository.SaveChanges();
            }
        }
        public void Delete(BLL.BusinessObjects.UITemplate entity)
        {
            throw new NotImplementedException();
        }
        public void Delete(int id)
        {
            DAL.DataEntities.UITemplate template;
            using (_UITemplateRepository = new GenericRepository<DAL.DataEntities.UITemplate>())
            {
                template = _UITemplateRepository.SingleOrDefault(m => m.ID == id);
                _UITemplateRepository.Delete(template);
                _UITemplateRepository.SaveChanges();
            }
        }
        public void Add(BLL.BusinessObjects.UITemplate entity)
        {
            using (_UITemplateRepository = new GenericRepository<DAL.DataEntities.UITemplate>())
            {
                _UITemplateRepository.Add((DAL.DataEntities.UITemplate)entity.InnerEntity);
                _UITemplateRepository.SaveChanges();
            }
        }

        //UIControls
        public UIControlDataHolder GetUIControlData(BusinessObjects.UIControlTypes controltype)
        {
            //Variables
            string resourcePath = "BLL.UIControls." + controltype.ToString() + "." + controltype.ToString();
            string wrapper = "", script = "", html = "", css = "";
            string wrapperPath = "BLL.UIControls.GenericWrapper.htm";

            //Get the html content and script
            wrapper = GetEmbeddedUIControlResource(wrapperPath);
            html = GetEmbeddedUIControlResource(resourcePath + ".htm");
            css = GetEmbeddedUIControlResource(resourcePath + ".css");
            script = GetEmbeddedUIControlResource(resourcePath + ".js");

            //
            UIControlDataHolder holder = new UIControlDataHolder(controltype, wrapper, html, css, script);
            return holder;
        }
        private string GetEmbeddedUIControlResource(string path)
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
