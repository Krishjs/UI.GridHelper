//-----------------------------------------------------------------------
// <copyright file="BaseController.cs" company="MSC - iBox">
//     Mediterranean Shipping Company SA - iBox
//     OneVision Project
// </copyright>
//-----------------------------------------------------------------------
namespace Msc.Template.UI
{
    using System;
    using System.Collections;
    using System.Linq;
    using System.Reflection;
    using System.Web.Mvc;
    using System.Web.Script.Serialization;
    using Kendo.Mvc.Extensions;
    using Kendo.Mvc.UI;
    using Msc.Framework.UI.Helper;    

    /// <summary>
    /// Provides all the basic methods need for an Controller
    /// </summary>
    public abstract partial class BaseController : Controller
    {
        /// <summary>
        /// Gets Process ID
        /// </summary>
        public abstract long FunctionId { get; }

        
        #region Grid

        /// <summary>
        /// Method that receives a HTTP callback for a Grid
        /// </summary>
        /// <param name="request"> Request model of Kendo </param>
        /// <param name="invokeMethod"> Method to be invoked in the Controller </param>
        /// <returns> Returns a JSON result of the List of value </returns>
        public ActionResult GridCallback([DataSourceRequest]DataSourceRequest request, string invokeMethod)
        {
            MethodInfo me = this.GetType().GetMethod(invokeMethod);
            var e = me.Invoke(this, parameters: null) as IEnumerable;

            return this.Json(e.ToDataSourceResult(request));
        }

        /// <summary>
        /// Method that receives a HTTP callback request for Custom Grid
        /// </summary>
        /// <param name="request"> Request model of Kendo </param>
        /// <param name="invokeMethod"> Method to be invoked in the Controller </param>
        /// <returns> Returns a JavaScript Object Notation result with only records based </returns>
        public ActionResult CustomGridCallback([DataSourceRequest]DataSourceRequest request, string invokeMethod)
        {
            if (request == null)
            {
                throw new ArgumentNullException(paramName: "request");
            }

            MethodInfo me = this.GetType().GetMethod(invokeMethod);
            var cgds = me.Invoke(this, parameters: null) as CustomDataSource;
            return this.Json(new DataSourceResult() { Data = cgds.Data, Total = cgds.Count });
        }

        #endregion Grid

        #region Combobox

        /// <summary>
        /// Get Combo Box Data
        /// </summary>
        /// <param name="controllerName"> Controller Name </param>
        /// <param name="methodName"> Method Name </param>
        /// <param name="assemblyName"> Assembly Name </param>
        /// <returns> Content Result</returns>
        public ActionResult GetComboBox(string controllerName, string methodName, string assemblyName)
        {
            string parameters = string.Empty;
            object result = this.Invoke(controllerName, methodName, assemblyName, parameters);
            var serializer = new JavaScriptSerializer();
            var contentResult = new ContentResult();
            serializer.MaxJsonLength = int.MaxValue;
            contentResult.Content = serializer.Serialize(result);
            contentResult.ContentType = "application/json";
            return contentResult;
        }

        /// <summary>
        /// Get the Custom List from Start to End Index
        /// </summary>
        /// <param name="request"> Data Source Request </param>
        /// <param name="controllerName"> Controller Name </param>
        /// <param name="methodName"> Method Name which returns List of Values </param>
        /// <param name="assemblyName"> Assembly Name </param>
        /// <returns> Data Source Result with data as well as Total </returns>
        public ActionResult GetCustomList([DataSourceRequest] DataSourceRequest request, string controllerName, string methodName, string assemblyName)
        {
            Func<string> getParameters = () =>
            {
                string filter = string.Empty;
                if (request.Filters.Count > 0)
                {
                    filter = ((Kendo.Mvc.FilterDescriptor)request.Filters[0]).Value.ToString();
                }

                string parameters = string.Empty;
                int startIndex = request.PageSize * (request.Page - 1);
                if (string.IsNullOrEmpty(parameters))
                {
                    parameters = startIndex + "|" + request.PageSize + "|" + filter;
                }

                return parameters;
            };
            CustomDataSource cds = this.Invoke(controllerName, methodName, assemblyName, getParameters()) as CustomDataSource ?? new CustomDataSource();

            return this.Json(new DataSourceResult() { Data = cds.Data, Total = cds.Count });
        }

        /// <summary>
        /// Get the Parameter Values
        /// </summary>
        /// <param name="value"> String Values </param>
        /// <returns> Parameter String </returns>
        public string GetParameterValue(string value)
        {
            if (this.Request != null)
            {
                return Request.Params[value];
            }

            return System.Web.HttpContext.Current.Request.Params[value];
        }

        /// <summary>
        /// Get Arguments when multiple parameters passed
        /// </summary>
        /// <param name="parameters"> Parameter values </param>
        /// <returns> Multiple Columns Header </returns>
        private static object[] GetArguments(string parameters)
        {
            object[] args = null;
            if (!string.IsNullOrEmpty(parameters))
            {
                string[] paramsArray = parameters.Split(separator: new char[] { '|' });
                args = new object[paramsArray.Length];
                for (int i = 0; i < paramsArray.Length; i++)
                {
                    args[i] = paramsArray[i];
                }
            }

            return args;
        }

        /// <summary>
        /// Method to be invoked for returning list from ControllerName
        /// </summary>
        /// <param name="controllerName"> Controller Name </param>
        /// <param name="methodName"> Method Name </param>
        /// <param name="assemblyName"> Assembly Name </param>
        /// <param name="parameters"> Parameter Values </param>
        /// <returns> List of Value from Database </returns>
        private object Invoke(string controllerName, string methodName, string assemblyName, string parameters)
        {
            MethodInfo methodInfo = null;
            MethodInfo[] methods = null;

            if (string.IsNullOrEmpty(assemblyName))
            {
                methods = this.GetType().GetMethods().Where(m => m.Name == methodName).ToArray();
            }
            else
            {
                Assembly assembly = Assembly.Load(assemblyName);
                Type type = assembly.GetType(assemblyName + "." + "Controllers" + "." + controllerName + "Controller");
                methods = type.GetType().GetMethods().Where(m => m.Name == methodName).ToArray();
            }

            var result = new object();
            foreach (MethodInfo method in methods)
            {
                methodInfo = method;
                result = methodInfo.Invoke(this, GetArguments(parameters));
            }

            return result;
        }

        #endregion Combobox
    }
}