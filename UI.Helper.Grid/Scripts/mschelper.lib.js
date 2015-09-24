/*global window,alert*/
/*Modification History
Modified By,      Modified On,    Version No,     Reason
==========================================================
S.Vignesh         03/08/2015        080315       Created
*/
var UrlHelper = function () {
    var cname = '';
    return {
        SetControllerName: function (n) {
            cname = n;
        },
        Action: function (n) {
            return cname + '/' + n;
        }
    }
}();
(function MSCJSLIB(w)
{
    w.MSCJS = (function ()
    {
        var clfn = function ()
        {
            return (function (e, fn) { if (fn) { MSCJS.Common.Helper.ExecuteMethod(fn, [e]); } });
        };
        return {
            Constants: {
                FileUpload: {
                    FileExtenstion: {
                        None: 'None',
                        All: 'all',
                        PDF: 'pdf',
                        Excel: {
                            All: 'excel',
                            XLS: 'xls',
                            XLSX: 'xlsx'
                        },
                        Word: {
                            All: 'word',
                            DOCX: 'docx',
                            DOC: 'doc'
                        },
                        Image: {
                            All: 'image',
                            JPEG: 'jpeg',
                            JPG: 'jpg',
                            GIF: 'gif',
                            PNG: 'png'
                        }
                    }
                }
            },
            InvokeClient: function (entity, event, args, scope)
            {
                var s = scope ? scope : window;
                this.HTMLHelpers.ClientEvents[entity][event].apply(s, args);
            },
            InvokeDetailClientfn: function (entity, event, args, scope)
            {
                var s = scope ? scope : window;
                this.HTMLHelpers.DetailGrid[entity][event].apply(s, args);
            },
            Common: {
                Helper: {
                    GetMethod: function (method)
                    {
                        if (typeof method === 'string') { return w[method]; }
                        return method;
                    },
                    CheckIfMethodExist: function (m)
                    {
                        return (typeof m === 'function');
                    },
                    ExecuteMethod: function (method, args, scope)
                    {
                        var fn = this.GetMethod(method);
                        if (this.CheckIfMethodExist(fn))
                        {
                            if (scope) { return fn.apply(scope, args); }
                            return fn.apply(w, args);
                        }
                    }
                }
            },
            Message: {
                ShowError: function (message)
                {
                    alert(message);
                },
                ShowInformation: function (msg)
                {
                    alert(msg);
                },
                Format: function ()
                {
                    var s = arguments[0], i = 1;
                    for (; i < arguments.length; i += 1)
                    {
                        var reg = new RegExp("\\{" + i + "\\}", "gm");
                        s = s.replace(reg, arguments[i]);
                    }
                    return s;
                },
            },
            Resources: {
                WrongFileFormat: function ()
                {
                    return 'Please select a file with {0} file format. The selected ext is ';
                },
                AcceptWordFileFormat: function ()
                {
                    return MSCJS.Message.Format(this.WrongFileFormat(), 'Word');
                },
                AcceptExcelFileFormat: function ()
                {
                    return MSCJS.Message.Format(this.WrongFileFormat(), 'Excel');
                },
                AcceptPDFFileFormat: function ()
                {
                    return MSCJS.Message.Format(this.WrongFileFormat(), 'PDF');
                },
                Authorization: function ()
                {
                    return 'Authorization required for this action!';
                },
            },
            HTMLHelpers: {
                ClientEvents: {
                    FileUpload: {
                        OnFileSelect: (function (e, clientFn, fileExt)
                        {
                            var cns = MSCJS.Constants.FileUpload.FileExtenstion;

                            //Converts string to lower case and checks with rhs
                            var ctlnv = function ConvertToLowerCaseAndValidate(f, rhs) { return f.toLowerCase() === rhs; };

                            if (clientFn)
                            {
                                MSCJS.Common.Helper.ExecuteMethod(clientFn, [e, fileExt]);
                            } else if (fileExt && fileExt !== cns.None)
                            {
                                var filename = e.files[0].filename;
                                var extension = e.files[0].extension; // To get Extension of select Files.
                                extension = extension.substring(1); // Remove the (.) from Extension.

                                var Validatefunc = function ValidateParentTypeAndWithChildType(parent, childarr, msg)
                                {
                                    if (ctlnv(fileExt, parent))
                                    {
                                        var i = 0;
                                        var isvalid = true;
                                        for (; i < childarr.length;)
                                        {
                                            if (!ctlnv(extension, childarr[i]))
                                                isvalid = false;
                                        }
                                        if (isvalid)
                                        {
                                            MSCJS.Message.ShowError(msg + extension);
                                            e.preventDefault();
                                            return false;
                                        }
                                    }
                                    return true;
                                };

                                if (ctlnv(fileExt, cns.All))
                                {
                                    return true;
                                } else if (!Validatefunc(cns.Word.All, [cns.Word.DOC, cns.Word.DOCX], MSCJS.Resources.AcceptWordFileFormat()))
                                {
                                    return false;
                                } else if (!Validatefunc(cns.Excel.All, [cns.Excel.XLS, cns.Excel.XLSX], MSCJS.Resources.AcceptExcelFileFormat())) { return false; }

                                if (fileExt.toLowerCase() !== extension)
                                {
                                    alert("Please Select " + fileExt + "File only. The selected ext is " + extension);
                                    e.preventDefault();
                                    return false;
                                }
                            }
                        }),
                        OnFileCancel: clfn(),
                        OnFileError: clfn(),
                        OnFileProgress: clfn(),
                        OnFileRemove: clfn(),
                        OnFileComplete: clfn(),
                        OnFileUpload: clfn(),
                        OnFileSuccess: clfn(),
                    },
                    ComboBox: {
                        OnComboBoxChange: function (s, clientfn, prefix, displayname)
                        {
                            var displayFields = displayname ? displayname.split("|") : [];
                            var selectedItems = s.sender.dataSource._data[s.sender.selectedIndex];
                            var currentId, html = "", currentHtml;

                            displayFields.push(s.sender.options.dataTextField);
                            if (displayFields)
                            {
                                var model = {};
                                for (var i = 0; i < displayFields.length; i++)
                                {
                                    if (s.sender.options.dataValueField != displayFields[i])
                                    {
                                        currentId = prefix + "." + displayFields[i];
                                        currentHtml = $("#" + currentId);
                                        if (currentHtml.val())
                                        {
                                            currentHtml.val(selectedItems["" + displayFields[i] + ""]);
                                        }
                                        else
                                        {
                                            html += "<input type=\"hidden\" name=\"" + currentId + "\" value=\"" + selectedItems["" + displayFields[i] + ""] + "\" >";
                                        }
                                    }
                                }
                                // if (s.sender.wrapper[0].parentElement.innerHTML && html)
                                //{
                                //     s.sender.wrapper[0].parentElement.appendChild(html);
                                // };
                            }
                            MSCJS.Common.Helper.ExecuteMethod(clientfn, [s]);
                        },
                        OnSelect: clfn(),
                        OnOpen: clfn(),
                        OnClose: clfn(),
                        OnDataBound: clfn(),
                        OnFiltering: clfn()
                    },
                    DatePicker: {
                        open: clfn(),
                        close: clfn(),
                        change: clfn()
                    },
                    Grid: {
                        OnGridDataBind: function (s, clientfn)
                        {
                            var gridName = s.sender.element[0].id;
                            if ($("#" + gridName + "Toolbar").length > 0)
                            {
                                gridProperties.EnableQueryView(gridName, gridProperties.isQuery);
                            }
                            MSCJS.Common.Helper.ExecuteMethod(clientfn, [s]);
                        },
                        OnGridDataBound: clfn(),
                        OnGridChangeEvent: function (s, clientfn)
                        {
                            MSCJS.Common.Helper.ExecuteMethod(clientfn, [s]);                                                       
                        },
                        ColumnFormat: function (value, format)
                        {
                            return kendo.toString(data, format);
                        }
                    },
                    DetailGrid: {
                        AddDetail: function (gname)
                        {
                            gridProperties.ShowGridContainer(gname);
                            Ajax.RequestManager().Enqueue({
                                url: UrlHelper.Action('AddDetail') + '?key=' + gname + '&id=' + 0,
                                type: "GET",
                                cache: false,
                                success: function (partialData)
                                {
                                    $('#' + gname + 'ctr').html(partialData);
                                    gridProperties.GridButtonEnable(gname, false, true, false, false, true, true);
                                }
                            });
                        },
                        CloseDetail: function (gname)
                        {
                            gridProperties.HideGridContainer(gname);
                            gridProperties.GridButtonEnable(gname, true, false, true, true, false, false);
                        },
                        EditDetail: function (gname, IdProperty)
                        {
                            var grid = $("#" + gname).data("kendoGrid");
                            var item = grid.dataItem(grid.select());

                            //var Id = $("#" + gname + "ctr #" + IdProperty).val();
                            Ajax.RequestManager().Enqueue({
                                url: UrlHelper.Action('AddDetail') + '?key=' + gname + '&id=' + item[IdProperty],
                                type: "GET",
                                cache: false,
                                success: function (partialData)
                                {
                                    $('#' + gname + 'ctr').html(partialData);
                                    gridProperties.GridButtonEnable(gname, false, true, false, false, true, true);
                                    gridProperties.ShowGridContainer(gname);
                                },
                                error: function (data)
                                {
                                }
                            });
                        },

                        SaveDetail: function (gname)
                        {
                            var grid = $("#" + gname).data("kendoGrid");
                            //Ajax.RequestManager().Enqueue({
                            $.ajax({
                                url: UrlHelper.Action('SaveDetail') + '?key=' + gname,
                                type: "POST",
                                cache: false,
                                data: $('#' + gname + 'ctr *').serialize(),
                                success: function (data)
                                {
                                    grid.dataSource.read();
                                    gridProperties.HideGridContainer(gname);
                                    MSCJS.Message.ShowInformation(data.message);
                                    gridProperties.GridButtonEnable(gname, true, false, true, true, false, false);
                                },
                            });
                        },

                        DeleteDetail: function (gname, IdProperty)
                        {
                            var grid = $("#" + gname).data("kendoGrid");
                            //var Id = $("#" + gs.Name + "ctr #" + gs.IdProperty).val();
                            var item = grid.dataItem(grid.select());
                            if (item[IdProperty])
                                //  Ajax.RequestManager().Enqueue({
                                $.ajax({
                                    url: UrlHelper.Action('DeleteDetail') + '?key=' + gname + '&id=' + item[IdProperty],
                                    type: "POST",
                                    cache: false,
                                    success: function (data)
                                    {
                                        grid.dataSource.read();
                                        //gridProperties.HideGridContainer(gs.Name);
                                        gridProperties.GridButtonEnable(gname, true, false, true, false, true, false);
                                        alert(data.message);
                                    },
                                    error: function (data)
                                    {
                                    }
                                });
                        },
                        QueryDetail: function (gname, IdProperty)
                        {
                            //var grid = $("#" + gname).data("kendoGrid");
                            //var gridData = grid.dataSource.view();
                            //var currentUid = e.id.replace('edit', '');
                            //for (var i = 0; i < gridData.length; i++) {
                            //    if (grid.dataSource._data[i].uid == currentUid) {
                            //        currentId = grid.dataSource._data[i].Id;
                            //        break;
                            //    }
                            //}
                            var grid = $("#" + gname).data("kendoGrid");
                            //var Id = $("#" + gs.Name + "ctr #" + gs.IdProperty).val();
                            var item = grid.dataItem(grid.select());
                            if (item[IdProperty])
                            {
                                Ajax.RequestManager().Enqueue({
                                    // $.ajax({
                                    url: UrlHelper.Action('QueryDetail') + '?key=' + gname + '&id=' + item[IdProperty],
                                    type: "GET",
                                    // data: { key: gname, id: currentId },
                                    cache: false,
                                    success: function (partialData)
                                    {
                                        $('#' + gname + 'ctr').html(partialData);
                                        gridProperties.ShowGridContainer(gname);
                                    },
                                    error: function (data)
                                    {
                                    }
                                });
                            }
                        },
                    },
                    Slider: {
                        OnSliderChange: clfn(),
                        OnSliderSlide: clfn()
                    }
                },
            },
        };
    })();

    var Ajax = (function ()
    {
        var requestManager;
        function Init()
        {
            function Start(request, $this)
            {
                if (request)
                {
                    if (typeof (request) == 'object' && !request['notAjax'])
                    {
                        $.ajax({
                            url: request.url,
                            type: request.type,
                            contentType: request.contentType,
                            cache: request.cache,
                            //  data: request.data,
                            success: function (o)
                            {
                                if (request.success) request.success(o);
                                status = 0;
                                if ($this.RequestQueue.length > 0)
                                {
                                    var nextRequest = $this.Dequeue(request.url);
                                    $this.LoadingPanel(nextRequest['message']).Show();
                                    Start(nextRequest, $this);
                                }
                                else
                                {
                                    $this.LoadingPanel().Hide();
                                    Overlay.Stop();
                                }
                            },
                            error: function (e)
                            {
                                status = 0;
                                var errorHandled = false;
                                if (request.onError)
                                {
                                    request.onError(e);
                                    errorHandled = true;
                                }
                                if (e.status == HttpStatus.Forbidden)
                                {
                                    MSCJS.Message.ShowInformation(MSCJS.Resources.Authorization());
                                }
                                if (e.responseText.indexOf("\"type\":\"E\"") > 0)
                                {
                                    var error = $.parseJSON(e.responseText);
                                    MSCJS.Message.ShowError(error.message, error.innerMessage, error);//TODO SHOW ERROR WITH INNER MESSAGE
                                }
                                else
                                {
                                    var reg = /<title>(.*?)<\/title>/;
                                    var title = e.responseText.match(reg), txtTitle = "";
                                    if (title && title.length > 1) { txtTitle = title[1] }
                                    else if (title && title[0]) { txtTitle = title[0]; }
                                    MSCJS.Message.ShowError(txtTitle, e.responseText);//TODO SHOW ERROR WITH INNER MESSAGE
                                }
                                $this.LoadingPanel().Hide();
                                Overlay.Stop();
                            },
                            complete: function (result)
                            {
                                if (request.onComplete)
                                {
                                    request.onComplete(result);
                                }
                            }
                        });
                    }
                    else if (typeof (request) == 'object' && request['notAjax'])
                    {
                        if (request) request.method();
                        status = 0;
                        if ($this.RequestQueue.length > 0) Start($this.Dequeue(request.url), $this);
                    }
                }
                var HttpStatus = {
                    Forbidden: 403
                };
            }
            var Overlay = (function ()
            {
                return {
                    GetLoadingPanelAndContent: (function ()
                    {
                        //TODO Get the Loading panel from the Outer Layout
                        return {
                            Show: function ()
                            {
                                $("<div id='loading' class='loading'><img src='Content/images/loader.gif'/><span id='loadingMessage'>Please wait ...  </span></div>")
                                    .insertAfter("body");
                            },
                            Hide: function ()
                            {
                                $("#loading").remove();
                            }
                        };
                    }),
                    Start: (function ()
                    {
                        var panel = this.GetLoadingPanelAndContent();
                        panel.Show();
                    }),
                    Stop: (function ()
                    {
                        var panel = this.GetLoadingPanelAndContent();
                        panel.Hide();
                    })
                }
            })();
            return {
                RequestQueue: null,
                status: null,
                //TODO Loading Panel with Show/Hide
                LoadingPanel: function (msg)
                {
                    /*
                    .loading {
                        background-color: rgba(17, 17, 17, 0.15);
                        top: 0;
                        height: 100%;
                        width: 100%;
                        z-index: 9999999999;
                        position: absolute;
                    }

                    .loading img {
                        top: 50%;
                        left: 50%;
                        position: absolute;
                    }*/
                    var loadingPanel = Overlay.GetLoadingPanelAndContent();
                    this.SetMessage(msg);
                    return loadingPanel;
                },
                SetMessage: (function (msg)
                {
                    var msgContent = document.getElementById('loadingMessage');
                    msgContent.innerHTML = msg ? msg : 'Please wait ...';
                }),
                StopOverlay: (function ()
                {
                    Overlay.Stop();
                }),
                Enqueue: function (request)
                {
                    if (!this.RequestQueue)
                        this.RequestQueue = [];
                    this.RequestQueue.push(request);
                    this.Logger(request.url + ' added!');
                    if ((!status) || (status == "0") || this.RequestQueue.length <= 1)
                    {
                        status = 1;
                        if (this.RequestQueue.length > 0)
                        {
                            Overlay.Start();
                            this.LoadingPanel(request['message']).Show();
                            Start(this.Dequeue(request.url), this);
                        };
                    }
                },
                Dequeue: function (url)
                {
                    if (this.RequestQueue)
                    {
                        this.Logger(url + ' is pending...');
                        return this.RequestQueue.shift();
                    }
                    return null;
                },
                Counts: function ()
                {
                    return !this.RequestQueue ? 0 : this.RequestQueue.length;
                },
                Logger: function (message)
                {
                    //if (console!='undefined') {
                    // console.log(message);
                    // }
                }
            };
        }
        return {
            RequestManager: function ()
            {
                if (!requestManager)
                    requestManager = Init();
                return requestManager;
            }
        };
    })();
})(window);

var gridProperties = {
    Show: function () { return "dgshow"; },
    Hide: function () { return "dghide"; },
    Savecss: function () { return 'dgsave'; },
    Editcss: function () { return 'dgedit'; },
    Deletecss: function () { return 'dgdelete'; },
    Clearcss: function () { return 'dgclear'; },
    Closecss: function () { return 'dgclose'; },
    Newcss: function () { return 'dgnew'; },
    Querycss: function () { return 'dgquery' },
    isQuery: false,
    Disablecss: function () { return 'dgdisable' },
    ShowGridContainer: function (gname)
    {
        $('#' + gname + 'partial').toggleClass(gridProperties.Hide() + ' ' + gridProperties.Show());
        $("#" + gname + "grid").toggleClass(gridProperties.Show() + ' ' + gridProperties.Hide());
    },
    HideGridContainer: function (gname)
    {
        $('#' + gname + 'grid').toggleClass(gridProperties.Hide() + ' ' + gridProperties.Show());
        $("#" + gname + "partial").toggleClass(gridProperties.Show() + ' ' + gridProperties.Hide());
    },
    GridButtonEnable: function (gridname, isNew, isSave, isEdit, isDelete, isClear, isClose)
    {
        this.GridToolbarAddorRemoveDisableClass(gridname, isNew, this.Newcss);
        this.GridToolbarAddorRemoveDisableClass(gridname, isSave, this.Savecss);
        this.GridToolbarAddorRemoveDisableClass(gridname, isEdit, this.Editcss);
        this.GridToolbarAddorRemoveDisableClass(gridname, isDelete, this.Deletecss);
        this.GridToolbarAddorRemoveDisableClass(gridname, isClear, this.Clearcss);
        this.GridToolbarAddorRemoveDisableClass(gridname, isClose, this.Closecss);
        //$('#' + gridname + 'Toolbar .' + this.Savecss()).prop("disabled", !isSave);
        //$('#' + gridname + 'Toolbar .' + this.Editcss()).prop("disabled", !isEdit);
        //$('#' + gridname + 'Toolbar .' + this.Deletecss()).prop("disabled", !isDelete);
        //$('#' + gridname + 'Toolbar .' + this.Clearcss()).prop("disabled", !isClear);
        //$('#' + gridname + 'Toolbar .' + this.Closecss()).prop("disabled", !isClose);
    },
    GridToolbarAddorRemoveDisableClass: function (gridname, enable, cssClass)
    {
        var currentToolbar = $('#' + gridname + 'Toolbar .' + cssClass());
        if (!enable && !currentToolbar.hasClass(this.Disablecss()))
        {
            currentToolbar.addClass(this.Disablecss());
        }
        else if (currentToolbar.hasClass(this.Disablecss()))
        {
            $('#' + gridname + 'Toolbar .' + cssClass()).removeClass(this.Disablecss());
        }
        currentToolbar.prop("disabled", !enable);
    },
    EnableQueryView: function (gname, isEnable)
    {
        if (isEnable === true)
        {
            $("#" + gname + "Toolbar ." + this.Querycss()).show();
            gridProperties.GridButtonEnable(gname, false, false, false, false, false, true);
        }
        else
        {
            $("#" + gname + "Toolbar ." + this.Querycss()).hide();
            gridProperties.GridButtonEnable(gname, true, false, true, true, false, false);
        }
    }
};

(function MSCExtensions()
{
    String.prototype.In = (function (set)
    {
        var value = this, has = false;
        if (typeof (set) === 'string')
            set = set.split(/,/g);
        for (var i = 0; i < set.length; i++)
            if (!has && set[i] === value)
                has = true;
        return has;
    });
    String.prototype.NotIn = (function (set)
    {
        return !this.In(set);
    });
})();

function TextAreaPopUpInit(s) {

} //todo