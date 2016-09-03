//-----------------------------------------------------------------------
// <copyright file="BaseController.cs" company="MSC - iBox">
//     Mediterranean Shipping Company SA - iBox.
//     OneVision Project.
// </copyright>
// <summary>
// Provides all the basic methods need for an Controller.
// </summary>
//-----------------------------------------------------------------------
namespace Msc.Template.UI
{
    using System;
    using System.Collections;
    using System.Web.Mvc;
    using System.Web.Script.Serialization;
    using Framework.UI.Helper;
    using Kendo.Mvc.Extensions;
    using Kendo.Mvc.UI;

    /// <summary>
    /// Provides all the basic methods need for an Controller.
    /// </summary>
    public abstract partial class BaseController : Controller
    {
        /// <summary>
        /// Gets the Process Code.
        /// </summary>
        /// <value>The function code property gets the string value.</value>
        public abstract string FunctionCode { get; }

        /// <summary>
        /// Menu action is used to return or render menu/Menu partial view.
        /// </summary>
        /// <returns>Return MenuPartial view with FunctionUnitView collection from session.</returns>
        public virtual ActionResult Menu()
        {
            this.ViewBag.FunctionCode = this.FunctionCode;

            return this.PartialView(viewName: "MenuPartial", model: this.HttpContext.Session["Menu"]);
        }

        /// <summary>
        /// Redirect to login page and Abandon the session.
        /// </summary>
        /// <returns>Return to login page.</returns>
        public virtual ActionResult LogOff()
        {
            this.Session.Abandon();
            if (Response.Cookies["OVSignedIn"]?.HasKeys == true)
            {
                Response.Cookies.Remove(name: "OVSignedIn");
            }

            return this.RedirectToAction(actionName: "Index", controllerName: "Home");
        }

        /// <summary>
        /// This method returns the collection to the view with JavaScript Object Notation Request Behavior allow get.
        /// </summary>
        /// <param name="collection">Collection of data to send to client.</param>
        /// <returns>JavaScript Object Notation result with collection.</returns>
        public ActionResult Data(IEnumerable collection)
        {
            return this.Json(collection, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// This method returns the collection to the view with JavaScript Object Notation Request Behavior allow get.
        /// </summary>
        /// <param name="collection">Collection of data to send to client.</param>
        /// <param name="request">Callback request content to the client.</param>
        /// <returns>JavaScript Object Notation result with collection.</returns>
        public ActionResult Data(IEnumerable collection, DataSourceRequest request)
        {
            return this.Json(collection.ToDataSourceResult(request), JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// This method returns custom data source for callback.
        /// </summary>
        /// <param name="data">Data collection to return with the specific page.</param>
        /// <param name="count">Data total count.</param>
        /// <returns>JavaScript Object Notation result with collection and the count.</returns>
        public ActionResult CustomData(IEnumerable data, int count)
        {
            return GetResult(data, count);
        }

        /// <summary>
        /// This method returns custom data source for callback.
        /// </summary>
        /// <param name="dataSource">Data collection to return with the specific page with total count.</param>
        /// <returns>JavaScript Object Notation result with collection and the count.</returns>
        public ActionResult CustomData(CustomDataSource dataSource)
        {
            if (dataSource == null)
            {
                throw new ArgumentNullException(paramName: "dataSource");
            }

            return GetResult(dataSource.Data, dataSource.Total);
        }

        /// <summary>
        /// Show Message .
        /// </summary>
        /// <param name="title"> Message Box Title .</param>
        /// <param name="messageType"> Message Type. </param>
        /// <param name="message"> Message Content. </param>
        /// <returns> JavaScript Object Notation Result. </returns>
        public ActionResult ShowMessage(string title, MessageType messageType, string message)
        {
            return this.Json(new { success = true, title = title, type = GetMessageType(messageType), message = message }, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Show Message.
        /// </summary>
        /// <param name="title"> Message Box Title. </param>
        /// <param name="messageType"> Message Type. </param>
        /// <param name="message"> Message Content. </param>
        /// <param name="parameters"> With Parameter. </param>
        /// <returns> JavaScript Object Notation Result. </returns>
        public JsonResult ShowMessage(string title, MessageType messageType, string message, object parameters)
        {
            return this.Json(new { success = true, title = title, type = GetMessageType(messageType), message = message, parameters = parameters }, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Show Message.
        /// </summary>
        /// <param name="title"> Message Box Title. </param>
        /// <param name="messageType">Message Type.</param>
        /// <param name="ex">Exception parameter.</param>
        /// <returns>Return the JavaScript Object Notation result.</returns>
        public ActionResult ShowMessage(string title, MessageType messageType, Exception ex)
        {
            string innerMessage = string.Empty;

            if (ex == null)
            {
                throw new ArgumentNullException(paramName: "ex");
            }

            innerMessage = ex.InnerException?.ToString() ?? string.Empty;

            if (messageType == MessageType.Error)
            {
                if (Request.IsAjaxRequest())
                {
                    Response.TrySkipIisCustomErrors = true;
                    Response.StatusCode = 500;
                }
            }

            string stackTrace = string.Empty;
            if (ex.InnerException != null)
            {
                if (ex.InnerException.StackTrace != null)
                {
                    stackTrace = ex.InnerException.StackTrace.ToString();
                }
            }
            else if (ex.StackTrace != null)
            {
                stackTrace = ex.StackTrace.ToString();
            }

            return this.Json(new { success = false, title = title, type = GetMessageType(messageType), message = ex.Message, innerMessage = innerMessage, stackTrace = stackTrace }, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Show Message.
        /// </summary>
        /// <param name="title"> Message Box Title. </param>
        /// <param name="ex"> Exception to Display. </param>
        /// <returns> JavaScript Object Notation Result With Content. </returns>
        public ActionResult ShowMessage(string title, Exception ex)
        {
            return this.ShowMessage(title, ex, handleException: true);
        }

        /// <summary>
        /// Show Message.
        /// </summary>
        /// <param name="title"> Message Box Title. </param>
        /// <param name="ex"> Exception to Display. </param>
        /// <param name="handleException"> Handle Exception. </param>
        /// <returns> JavaScript Object Notation Result With Content. </returns>
        public ActionResult ShowMessage(string title, Exception ex, bool handleException)
        {
            if (handleException)
            {
                //Exception outException;
                //ExceptionAnalyzer.GetInstance.HandleException(ex, out outException);
                //if (outException != null)
                //{
                //    ex = outException;
                //}
            }

            return this.ShowMessage(title, MessageType.Error, ex.Message);
        }

        /// <summary>
        /// Dispose the Session.
        /// </summary>
        /// <param name="disposing">Can Dispose Session.</param>
        protected override void Dispose(bool disposing)
        {
            //this.session.Dispose();
            base.Dispose(disposing);
        }

        /// <summary>
        /// Convert Message Type to Character.
        /// </summary>
        /// <param name="messageType"> Message Type. </param>
        /// <returns> Character represent Message Type. </returns>
        private static char GetMessageType(MessageType messageType)
        {
            char type = char.MinValue;
            switch (messageType)
            {
                case MessageType.Information:
                    type = 'I';
                    break;

                case MessageType.Error:
                    type = 'E';
                    break;

                case MessageType.Warning:
                    type = 'W';
                    break;

                default:
                    type = 'N';
                    break;
            }
            return type;
        }

        /// <summary>
        /// This method returns custom data source for callback.
        /// </summary>
        /// <param name="data">Data collection to return with the specific page.</param>
        /// <param name="count">Data total count.</param>
        /// <returns>Content result with collection and the count custom serializer.</returns>
        private static ContentResult GetResult(IEnumerable data, int count)
        {
            var serializer = new JavaScriptSerializer();
            var result = new ContentResult();
            serializer.MaxJsonLength = int.MaxValue;
            result.Content = serializer.Serialize(new DataSourceResult() { Data = data, Total = count });
            result.ContentType = "application/json";
            return result;
        }
    }
}