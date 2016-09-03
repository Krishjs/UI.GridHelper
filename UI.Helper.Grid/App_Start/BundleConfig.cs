namespace UI.Helper.Grid
{
    using System.Web.Optimization;

    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            if (bundles != null)
            {
                bundles.Add(new StyleBundle("~/Content/css/default/bootstrap").Include(
                                            "~/Content/vendors/bootstrap/bootstrap.css"));

                bundles.Add(new StyleBundle("~/Content/kendo/styles").Include(
                                            "~/Content/vendors/kendo/kendo.common.min.css",
                                            "~/Content/vendors/kendo/kendo.bootstrap.min.css",
                                            "~/Content/vendors/kendo/kendo.common-bootstrap.min.css"
                                            ));

                bundles.Add(new StyleBundle("~/Content/css/custom/styles").Include(
                                            "~/Content/css/custom/iconset.css",
                                            "~/Content/css/custom/Navigation.css",
                                            "~/Content/css/custom/styles.css",
                                            "~/Content/css/custom/k-icons.css"));

                bundles.Add(new StyleBundle("~/css/ChooseOU").Include(
                                            "~/Content/css/custom/iconset.css",
                                             "~/Content/CSS/chooseou.css"));

                bundles.Add(new ScriptBundle("~/bundles/scripts/page").Include(
                                            "~/Scripts/mschelper.lib.js",
                                            "~/Scripts/msclib.pivotgrid.js",
                                            "~/Scripts/msclib.tabdetail.js",
                                            "~/Scripts/Page/transaction-toolbar.js"));

                bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                                            "~/Scripts/jquery-2.1.4.js", //specific version for kendo + routing ui component
                                            "~/Scripts/jquery-ui-{version}.js",
                                            "~/Scripts/jquery.dropdown.js",
                                            "~/Scripts/jquery.autocomplete.js"));

                bundles.Add(new ScriptBundle("~/bundles/scripts/bootstrap").Include(
                                            "~/Scripts/bootstrap.min.js"));

                bundles.Add(new ScriptBundle("~/bundles/scripts/kendo").Include(
                                            "~/Scripts/kendo/jszip.min.js",
                                            "~/Scripts/Kendo/kendo.all.min.js",
                                            "~/Scripts/Kendo/kendo.timezones.min.js",
                                            "~/Scripts/Kendo/kendo.aspnetmvc.min.js"));

                bundles.Add(new ScriptBundle("~/bundles/scripts/application").Include(
                                            "~/Scripts/application_blank.js"));

                // script bundle for rounting UI
                bundles.Add(new ScriptBundle("~/bundles/routingscript").Include(
                    // lodash part used only by routechart
                    "~/Scripts/lodash.js",
                    // backbone part used only by routechart
                    "~/Scripts/backbone.js",
                    // kendo with backbone used only by routechart
                    "~/Scripts/kendo.backbone.js",
                    // backbone fetch cache used only by routechart
                    "~/Scripts/backbone.fetch-cache.min.js",
                    // jointjs used only by routechart
                    "~/Scripts/joint.js",
                    // routechart part
                    "~/Scripts/routechart/routechart.js",
                    "~/Scripts/routechart/api/routechart.dwelltime.js",
                    "~/Scripts/routechart/api/routechart.ports.js",
                    "~/Scripts/routechart/api/routechart.legtime.js",
                    "~/Scripts/routechart/api/routechart.services.js",
                    "~/Scripts/routechart/routers/joint.shapes.routechart.ortodoxrouter.js",
                    "~/Scripts/routechart/views/joint.shapes.routechart.carditem.js",
                    "~/Scripts/routechart/views/joint.shapes.routechart.chartitemview.js",
                    "~/Scripts/routechart/views/joint.shapes.routechart.serviceitemview.js",
                    "~/Scripts/routechart/views/joint.shapes.routechart.tspitemview.js",
                    "~/Scripts/routechart/views/joint.shapes.routechart.linkview.js",
                    "~/Scripts/routechart/views/joint.shapes.routechart.legitemview.js",
                    "~/Scripts/routechart/views/kendo.backbone.confirmationview.js",
                    "~/Scripts/routechart/elements/joint.shapes.routechart.chartitem.js",
                    "~/Scripts/routechart/elements/joint.shapes.routechart.serviceitem.js",
                    "~/Scripts/routechart/elements/joint.shapes.routechart.tspitem.js",
                    "~/Scripts/routechart/elements/joint.shapes.routechart.legitem.js",
                    "~/Scripts/routechart/elements/joint.shapes.routechart.linkitem.js",
                    "~/Scripts/routechart/elements/joint.shapes.routechart.leglinkitem.js",
                    "~/Scripts/routechart/elements/joint.shapes.routechart.graph.js"));

                bundles.Add(new StyleBundle("~/bundles/routingstyles").Include("~/Content/joint.css",
                                                   "~/Content/routechart/main.css"));
            }

            BundleTable.EnableOptimizations = false;
        }
    }
}
