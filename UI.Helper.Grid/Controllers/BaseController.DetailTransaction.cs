//-----------------------------------------------------------------------
// <copyright file="BaseController.DetailTransaction.cs" company="MSC - iBox">
//     Mediterranean Shipping Company SA - iBox.
//     OneVision Project.
// </copyright>
// <summary>
// Base Controller for Detail Transaction.
// </summary>
//-----------------------------------------------------------------------
namespace Msc.Template.UI
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Reflection;
    using System.Web.Mvc;
    using Framework.UI.Helper;
    using Kendo.Mvc.Extensions;
    using Kendo.Mvc.UI;

    /// <summary>
    /// Base Controller for Detail Transaction.
    /// </summary>
    public abstract partial class BaseController : Controller
    {
        /// <summary>
        /// Gets Detail Container.
        /// </summary>
        /// <value> The detail container property gets the dictionary value. </value>
        public Dictionary<string, IDetailTransaction> DetailContainer
        {
            get
            {
                if (!this.DetailContainerPool.ContainsKey(this.FunctionCode))
                {
                    this.DetailContainerPool.Add(this.FunctionCode, new Dictionary<string, IDetailTransaction>());
                }
                else if (this.DetailContainerPool[this.FunctionCode] == null)
                {
                    this.DetailContainerPool[this.FunctionCode] = new Dictionary<string, IDetailTransaction>();
                }

                return this.DetailContainerPool[this.FunctionCode];
            }
        }

        /// <summary>
        /// Gets Detail Container pool.
        /// </summary>
        private Dictionary<string, Dictionary<string, IDetailTransaction>> DetailContainerPool
        {
            get
            {
                if (this.Session["DetailContainerPool"] == null)
                {
                    this.Session["DetailContainerPool"] = new Dictionary<string, Dictionary<string, IDetailTransaction>>();
                }

                return (Dictionary<string, Dictionary<string, IDetailTransaction>>) this.Session["DetailContainerPool"];
            }
        }

        /// <summary>
        /// Method that receives a HTTP callback request for Custom Grid.
        /// </summary>
        /// <param name="request"> Request model of Kendo. </param>
        /// <param name="gridName"> Method to be invoked in the Controller. </param>
        /// <returns> Returns a JavaScript Object Notation result with only records based. </returns>
        public ActionResult DetailGridCallback([DataSourceRequest]DataSourceRequest request, string gridName)
        {
            IDetailTransaction transcation = this.DetailContainer.GetDetail(gridName);
            return this.Json(transcation.RetrieveList(request));
        }

        /// <summary>
        /// Calls Create View for Detail Grid.
        /// </summary>
        /// <param name="key"> Dictionary Key Value. </param>
        /// <param name="id"> Id Field Value. </param>
        /// <returns> Return Create View for Grid. </returns>
        public ActionResult AddDetail(string key, long id)
        {
            IDetailTransaction transaction = this.DetailContainer.GetDetail(key);
            object model = GetCurrentModel(id, transaction);
            transaction.Init(model, this);
            ViewData.TemplateInfo.HtmlFieldPrefix = transaction.Prefix;
            return this.View(transaction.AddView, model);
        }

        /// <summary>
        /// Calls Query View for Detail Grid.
        /// </summary>
        /// <param name="key"> Dictionary Key Value. </param>
        /// <param name="id"> Id Field Value. </param>
        /// <returns> Return Query View for Grid. </returns>
        public ActionResult QueryDetail(string key, long id)
        {
            IDetailTransaction transaction = this.DetailContainer.GetDetail(key);
            object model = GetCurrentModel(id, transaction);
            transaction.Init(model, this);
            ViewData.TemplateInfo.HtmlFieldPrefix = transaction.Prefix;
            return this.View(transaction.QueryView, model);
        }

        /// <summary>
        /// Calls Save Detail Grid.
        /// </summary>
        /// <param name="key"> Dictionary Key Value. </param>
        /// <returns> Return Save Result. </returns>
        public ActionResult SaveDetail(string key)
        {
            IDetailTransaction transaction = this.DetailContainer.GetDetail(key);
            object updatedModel = this.GetUpdatedModel(transaction);
            DetailState saveState = transaction.Save(updatedModel, this.DetailContainer, this);
            return this.Json(new { success = saveState.IsValidModel, type = saveState.ValidationType, message = saveState.ErrorMessage }, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Delete Detail Grid value.
        /// </summary>
        /// <param name="key"> Dictionary Key Value. </param>
        /// <param name="id"> Id Field Value. </param>
        /// <returns> Return Detail Result. </returns>
        public ActionResult DeleteDetail(string key, long id)
        {
            IDetailTransaction transaction = this.DetailContainer.GetDetail(key);
            DetailState deleteState = transaction.Delete(id, this);
            return this.Json(new { success = deleteState.IsValidModel, type = deleteState.ValidationType, message = deleteState.ErrorMessage }, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Get the Model Detail for binding Create or Query View.
        /// </summary>
        /// <param name="id"> Id Field Value. </param>
        /// <param name="transaction"> Detail Transaction. </param>
        /// <returns> Model object. </returns>
        private static object GetCurrentModel(long id, IDetailTransaction transaction)
        {
            object model;
            if (id > 0)
            {
                model = transaction.RetrieveList().Cast<object>().Where(p => p.GetValue<long>(transaction.IdProperty) == id).FirstOrDefault();
            }
            else
            {
                model = Activator.CreateInstance(transaction.ModelType);
            }

            return model;
        }

        /// <summary>
        /// Get Updated Model Data.
        /// </summary>
        /// <param name="transaction"> Detail Transaction. </param>
        /// <returns> Current Data as Object. </returns>
        private object GetUpdatedModel(IDetailTransaction transaction)
        {
            object model = Activator.CreateInstance(transaction.ModelType);
            MethodInfo tryUpdateModel = typeof(Controller).GetMethods(BindingFlags.NonPublic | BindingFlags.Instance).Where(m => m.Name == "TryUpdateModel" && m.GetParameters().Length == 2 && m.GetParameters().Any(p => p.Name == "prefix")).FirstOrDefault().MakeGenericMethod(transaction.ModelType);
            MethodInfo updateModel = typeof(Controller).GetMethods(BindingFlags.NonPublic | BindingFlags.Instance).Where(m => m.Name == "UpdateModel" && m.GetParameters().Length == 2 && m.GetParameters().Any(p => p.Name == "prefix")).FirstOrDefault().MakeGenericMethod(transaction.ModelType);
            if ((bool) tryUpdateModel.Invoke(this, new object[] { model, transaction.Prefix }))
            {
                updateModel.Invoke(this, new object[] { model, transaction.Prefix });
            }

            return model;
        }
    }
}