//-----------------------------------------------------------------------
// <copyright file="BaseTransactionController.cs" company="MSC - iBox">
//     Mediterranean Shipping Company SA - iBox.
//     OneVision Project.
// </copyright>
// <summary>
// Provides all the basic methods need for an Controller.
// </summary>
//-----------------------------------------------------------------------
namespace Msc.Template.UI
{
    using System.Web.Mvc;

    /// <summary>
    /// Provides all the basic methods need for an Controller.
    /// </summary>
    public abstract class BaseTransactionController : BaseController
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="BaseTransactionController" /> class.
        /// </summary>
        protected BaseTransactionController()
            : base()
        {
        }

        /// <summary>
        /// Clears the data.
        /// </summary>
        /// <returns> Returns a correct type of ActionResult. </returns>
        public abstract ActionResult Clear();

        /// <summary>
        /// Close the current screen abandon the Session removes all the user data.
        /// </summary>
        /// <returns> Returns a correct type of ActionResult. </returns>
        public abstract ActionResult Close();

        /// <summary>
        /// Loads the Filter screen.
        /// </summary>
        /// <returns> Returns a correct type of ActionResult. </returns>
        public abstract ActionResult DataFilters();
                
        /// <summary>
        /// Edit option retrieves the record to be edited.
        /// </summary>
        /// <returns> Returns a correct type of ActionResult. </returns>
        public abstract ActionResult Edit();

        /// <summary>
        /// Initialize Method will be invoked on start of the screen.
        /// </summary>
        /// <returns> Returns the ViewResult with layout page. </returns>
        public abstract ActionResult Initialize();

        /// <summary>
        /// Returns the UI client side validation results as JavaScript Object Notation.
        /// </summary>
        /// <param name="groupId"> Parameter Group Id. </param>
        /// <returns> Returns a correct type of ActionResult. </returns>
        public abstract ActionResult LoadUIValidationRules(long groupId);
        
        /// <summary>
        /// Draft option saves the data without any validations which will be used in future to save
        /// the data.
        /// </summary>
        /// <returns> Returns a correct type of ActionResult. </returns>
        public abstract ActionResult Search();
    }
}