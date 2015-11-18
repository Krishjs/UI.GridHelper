/*global window,alert*/
/*Modification History
Modified By,      Modified On,    Version No,     Reason
==========================================================
S.Vignesh         03/08/2015        080315       Created
*/

(function MSCJSLIB(w) {
    w.MSCJS = (function () {
        var clfn = function () {
            return (function (e, fn) { if (fn) { return MSCJS.Common.Helper.ExecuteMethod(fn, [e]); } });
        };
        return {
            Constants: {
                FileUpload: {
                    FileExtenstion: {
                        None: 'None',
                        All: 'all',
                        // PDF: 'pdf',
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
                },
                WindowHelper: {
                    Css: {
                        Overlay: "k-overlay"
                    }
                },
                Message: {
                    Css: {
                        Warning: 'icon-warning',
                        Error: 'icon-cross',
                        Information: 'icon-error',
                        LeftCtr: 'ovmessageleft icon',
                        RightCtr: 'ovmessageright',
                        ContentCtr: 'ovmessagecontent',
                        MessageCtr: 'message dialogDetailContent',
                        AdditonalCtr: 'additonal dialogDetailContent',
                        InnerCtr: 'inner dialogDetailContent',
                        dialog: 'dialog effect1',
                        ButtonCtr: 'window-footer buttonctr pull-right',
                        OkButtonClass: 'k-button mar10',
                        CancelButtonClass: 'k-button cancel mar10',
                        MailButtonClass: 'k-button hidden mar10',
                        IcnText: 'blue'
                    }
                }
            },
            InvokeClient: function (entity, event, args, scope) {
                var s = scope ? scope : window;
                this.HTMLHelpers.ClientEvents[entity][event].apply(s, args);
            },
            InvokeDetailclientFn: function (entity, event, args, scope) {
                var s = scope ? scope : window;
                this.HTMLHelpers.DetailGrid[entity][event].apply(s, args);
            },
            Common: {
                Helper: {
                    GetMethod: function (method) {
                        if (typeof method === 'string') { return w[method]; }
                        return method;
                    },
                    CheckIfMethodExist: function (m) {
                        return (typeof m === 'function');
                    },
                    ExecuteMethod: function (method, args, scope, ou) {
                        if (!ou) { ou = []; }
                        var fn = this.GetMethod(method);
                        if (this.CheckIfMethodExist(fn)) {
                            if (scope) { return fn.apply(scope, args); }
                            ou["isExecuted"] = true;
                            return fn.apply(w, args);
                        }
                        else { ou["isExecuted"] = false; }
                    }
                }
            },
            Message: {
                ShowError: function (title, msg, innerMessage, additionalMessage) {
                    this.ShowDialog(MSCJS.Constants.Message.Css.Error, title, msg, innerMessage, additionalMessage);
                },
                ShowInformation: function (title, msg, innerMessage, additionalMessage, innerMessage, additionalMessage) {
                    this.ShowDialog(MSCJS.Constants.Message.Css.Information, title, msg);
                },
                ShowWarning: function (title, msg, innerMessage, additionalMessage, innerMessage, additionalMessage) {
                    this.ShowDialog(MSCJS.Constants.Message.Css.Warning, title, msg);
                },
                ShowDialog: function (cssclass, title, msg, innerMessage, additionalMessage) {
                    this.Intialize();
                    var win = $("#dialog").data("kendoWindow");
                    win.wrapper.addClass(MSCJS.Constants.Message.Css.dialog);
                    win.content(this.MessageDiv(cssclass, msg, innerMessage, additionalMessage));
                    this.AdditionalMessage();
                    this.InnerMessage();
                    win.title(title);
                    win.open().center();
                },
                Intialize: function () {
                    if (!$("#dialog").data("kendoWindow")) {
                        var data = $("#dialog").kendoWindow({
                            draggable: true,
                            modal: true,
                            resizable: false,
                            visible: false,
                            title: "",
                            width: "",
                        }).data("kendoWindow");
                    }
                },
                ShowMessage: function (type, title, msg, innerMessage, additionalMessage) {
                    if (type === 'W') {
                        if (!title) title = "Warning";
                        this.ShowDialog(MSCJS.Constants.Message.Css.Warning, title, msg, innerMessage, additionalMessage);
                    }
                    else if (type === 'E') {
                        if (!title) title = "Error";
                        this.ShowDialog(MSCJS.Constants.Message.Css.Error, title, msg, innerMessage, additionalMessage);
                    }
                    else if (type === 'I') {
                        if (!title) title = "Information";
                        this.ShowDialog(MSCJS.Constants.Message.Css.Information, title, msg, innerMessage, additionalMessage);
                    }
                },
                AdditionalMessage: function () {
                    var icon = $("#additionalIcon");
                    if ($("#additionalInfo").length > 0) {
                        $("#additionalInfo").slideToggle();
                        icon[0].innerHTML = icon[0].innerHTML.indexOf("-") > -1 ? "+ View More" : "- View More";
                    }
                },
                InnerMessage: function () {
                    var icon = $("#viewDetailsIcon");
                    if ($("#viewDetail").length > 0) {
                        $("#viewDetail").slideToggle();
                        icon[0].innerHTML = icon[0].innerHTML.indexOf("-") > -1 ? "+ View Details" : "- View Details";
                    }
                },
                MessageDiv: function (typecss, msg, innerMessage, additionalMessage) {
                    var newLine = "<div class=\"clearfix\" />";
                    var additionalDetail, additionalIcn, MessageDiv, msgCntTag, msgCntTagClose, msgTextTag, msgTextTagClose, buttonDiv;
                    MessageDiv = "<div class=\"" + MSCJS.Constants.Message.Css.MessageCtr + "\">";
                    MessageDiv += "<i class=\"" + MSCJS.Constants.Message.Css.LeftCtr + " " + typecss + "\" >&nbsp</i>";
                    MessageDiv += "<div class=\"" + MSCJS.Constants.Message.Css.RightCtr + "\">";

                    buttonDiv = "<div class=\"" + MSCJS.Constants.Message.Css.ButtonCtr + "\">";
                    buttonDiv += "<input type='button' value='Ok' onclick='MSCJS.Message.DialogOk()' class=\"" + MSCJS.Constants.Message.Css.OkButtonClass + " \" />";
                    buttonDiv += "<input type='button' value='Mail' onclick='MSCJS.Message.DialogMail()' class=\"" + MSCJS.Constants.Message.Css.MailButtonClass + " \" />";
                    buttonDiv += "<input type='button' value='Cancel' onclick='MSCJS.Message.DialogCancel()' class=\"" + MSCJS.Constants.Message.Css.CancelButtonClass + " \" />";
                    buttonDiv += "</div>"

                    msgCntTag = "<div id='messageContent'>";
                    msgCntTagClose = "</div>";

                    msgTextTag = "<div id='msgIcon' /><div id='messageText' class=\"" + MSCJS.Constants.Message.Css.ContentCtr + "\">" + msg;
                    msgTextTagClose = "</div>";

                    if (additionalMessage) {
                        additionalIcn = "<div id='additionalIcon' class=\"" + MSCJS.Constants.Message.Css.IcnText + "\" onclick='MSCJS.Message.AdditionalMessage()'>- View More</div>";
                        additionalDetail = "<div id='additionalInfo' class=\"" + MSCJS.Constants.Message.Css.AdditonalCtr + "\">" + additionalMessage + "</div>";
                        msgTextTag += additionalIcn + additionalDetail;
                    }
                    msgCntTag += newLine + msgTextTag + msgTextTagClose;

                    if (innerMessage) {
                        viewDetail = "<div id='viewDetail' class=\"" + MSCJS.Constants.Message.Css.InnerCtr + "\">" + innerMessage + "</div>";
                        viewIcon = "<div id='viewIcon' /><div  id='viewDetailsIcon' class=\"" + MSCJS.Constants.Message.Css.IcnText + "\"  onclick='MSCJS.Message.InnerMessage()'>- View Details</div>";
                        msgCntTag += newLine + viewIcon + viewDetail;
                    }

                    MessageDiv += newLine + msgCntTag + msgCntTagClose;

                    MessageDiv += "</div>" + buttonDiv + "</div>";
                    return MessageDiv;
                },
                DialogOk: function () {
                    $("#dialog").data("kendoWindow").close();
                    if ($("#dialogctr").hasClass(MSCJS.Constants.WindowHelper.Css.Overlay)) {
                        $("#dialogctr").removeClass(MSCJS.Constants.WindowHelper.Css.Overlay);
                    }
                },
                DialogCancel: function () {
                    $("#dialog").data("kendoWindow").close();
                    if ($("#dialogctr").hasClass(MSCJS.Constants.WindowHelper.Css.Overlay)) {
                        $("#dialogctr").removeClass(MSCJS.Constants.WindowHelper.Css.Overlay);
                    }
                },
                DialogMail: function () {
                },
                Format: function () {
                    var s = arguments[0], i = 1;
                    for (; i < arguments.length; i += 1) {
                        var reg = new RegExp("\\{" + (i - 1) + "\\}", "gm");
                        //  var reg = new RegExp("\\{" + i + "\\}", "gm");
                        s = s.replace(reg, arguments[i]);
                    }
                    return s;
                },
            },
            Resources: {
                WrongFileFormat: function () {
                    return 'Please select a file with {0} file format. The selected ext is ';
                },
                AcceptWordFileFormat: function () {
                    return MSCJS.Message.Format(this.WrongFileFormat(), 'Word');
                },
                AcceptExcelFileFormat: function () {
                    return MSCJS.Message.Format(this.WrongFileFormat(), 'Excel');
                },
                AcceptImageFileFormat: function () {
                    return MSCJS.Message.Format(this.WrongFileFormat(), 'Image');
                },
                AcceptPDFFileFormat: function () {
                    return MSCJS.Message.Format(this.WrongFileFormat(), 'PDF');
                },
                Authorization: function () {
                    return 'Authorization required for this action!';
                },
            },
            HTMLHelpers: {
                ClientEvents: {
                    FileUpload: {
                        OnFileSelect: (function (e, clientFn, fileExt) {
                            var cns = MSCJS.Constants.FileUpload.FileExtenstion;

                            //Converts string to lower case and checks with rhs
                            var ctlnv = function ConvertToLowerCaseAndValidate(f, rhs) { return f.toLowerCase() === rhs; };

                            if (MSCJS.Common.Helper.CheckIfMethodExist(clientFn)) {
                                MSCJS.Common.Helper.ExecuteMethod(clientFn, [s, fileExt]);
                            }
                            else if (fileExt && fileExt !== cns.None) {
                                var extension = e.files[0].extension; // To get Extension of select Files.
                                extension = extension.substring(1); // Remove the (.) from Extension.

                                if (ctlnv(fileExt, cns.All)) {
                                    return true;
                                }
                                else if (cns.hasOwnProperty(fileExt.capitalizeFirstLetter())) {
                                    if (!cns[fileExt.capitalizeFirstLetter()].hasOwnProperty(extension.toUpperCase())) {
                                        MSCJS.Message.ShowError(MSCJS.Message.Format(MSCJS.Resources.WrongFileFormat() + extension, fileExt.capitalizeFirstLetter()));
                                        e.preventDefault();
                                        return false;
                                    }
                                }
                                else if (fileExt.toLowerCase() !== extension) {
                                    alert("Please Select " + fileExt + " File only. The selected ext is " + extension);
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
                        OnComboBoxChange: function (s, clientFn, prefix, displayname) {
                            if (s.sender.selectedIndex && s.sender.selectedIndex > -1) {
                                var displayFields = displayname ? displayname.split("|").trim() : [];
                                // displayFields = displayFields.trim();
                                var selectedItems = s.sender.dataSource._data[s.sender.selectedIndex];
                                var currentId, currentName, html = "", currentHtml;
                                if (displayFields.indexOf(s.sender.options.dataTextField) < 0) {
                                    displayFields.push(s.sender.options.dataTextField);
                                }

                                if (displayFields) {
                                    var model = {};
                                    for (var i = 0; i < displayFields.length; i++) {
                                        if (s.sender.options.dataValueField.trim() != displayFields[i].trim()) {
                                            currentId = prefix + "." + displayFields[i].trim();
                                            currentId = currentId.replace(/\./g, '_');
                                            currentHtml = $("#" + currentId);
                                            if (currentHtml.length) {
                                                currentHtml.val(selectedItems["" + displayFields[i] + ""]);
                                            }
                                            else {
                                                html += "<input type=\"hidden\" name=\"" + currentId.replace(/\_/g, '.') + "\" value=\"" + selectedItems["" + displayFields[i] + ""] + "\" >";
                                            }
                                        }
                                    }
                                    if ($("#" + s.sender.element[0].id + "spn").length > 0 && html) {
                                        $("#" + s.sender.element[0].id + "spn")[0].innerHTML = html;
                                    };
                                }
                            }
                            MSCJS.Common.Helper.ExecuteMethod(clientFn, [s]);
                        },
                        OnSelect: clfn(),
                        OnOpen: (function (s, clientFn, dropdownvalue) {
                            //Used to set the dropdown Width of Combobox
                            if (dropdownvalue) {
                                s.sender.list.width(dropdownvalue);
                            }
                            MSCJS.Common.Helper.ExecuteMethod(clientFn, [s]);
                        }),
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
                        FilterToggle: (function (s) {
                            $('#' + s + '.k-filter-row').toggle();
                        }),
                        OnGridDataBind: function (s, clientFn) {
                            var gridName = s.sender.element[0].id;
                            $('#' + gridName + '.k-filter-row').hide();
                            MSCJS.HTMLHelpers.ClientEvents.Grid.InitSelectionMode(s.sender);
                            if ($("#" + gridName + "Toolbar").length > 0) {
                                gridProperties.EnableQueryView(gridName, gridProperties.isQuery);
                            }
                            MSCJS.Common.Helper.ExecuteMethod(clientFn, [s]);
                        },
                        OnGridDataBound: function (s, clientfn) {
                            var gn = s.sender.element[0].id;
                            MSCJS.HTMLHelpers.ClientEvents.Grid.HandleSelection(s.sender, gn);
                            MSCJS.Common.Helper.ExecuteMethod(clientfn, [s]);
                        },
                        OnGridChangeEvent: function (s, clientFn) {
                            var out = [];
                            MSCJS.Common.Helper.ExecuteMethod(clientFn, [s], undefined, out);
                            if (!out.isExecuted) {
                                var gridName = s.sender.element[0].id;
                                if ($("#" + gridName + "Toolbar").length === 0) {
                                    var item = s.sender.dataItem(s.sender.select());
                                    if (item) {
                                        $.ajax({
                                            url: UrlHelper.Action('GetData') + '?id=' + item.Id,
                                            type: "GET",
                                            cache: false,
                                            success: function (data) {
                                                $('#partial').html(data);
                                                // gridProperties.isQuery = true;
                                            },
                                            error: function (data) {
                                                // gridProperties.isQuery = false;
                                            }
                                        });
                                    }
                                }
                            }
                        },
                        ColumnFormat: function (value, data, format) {
                            return kendo.toString(data[value], format);
                        },
                        InitSelectionMode: function (g) {
                            if (!g.Selection) {
                                g.Selection = function () {
                                    var selectedRows = [];
                                    return {
                                        Select: function (v) {
                                            selectedRows.push(v);
                                        },
                                        Deselect: function (v) {
                                            var index = selectedRows.indexOf(v);
                                            if (index > -1) { selectedRows.slice(index, 1); }
                                        },
                                        GetSelectedKeys: function () {
                                            return selectedRows;
                                        },
                                        IsSelected: function (r) {
                                            return selectedRows.indexOf(r) > -1;
                                        },
                                        Reset: function () {
                                            selectedRows = [];
                                        }
                                    }
                                }();
                            }
                        },
                        HandleSelection: function (s, gn) {
                            var cbAll = document.getElementById(gn + '_SelectAll');
                            if (s.Selection) {
                                $.each($('.' + gn + '_cb'), function (i, v) {
                                    var key = v.id.split('_')[2];
                                    v.checked = s.Selection.IsSelected(key);
                                });
                            }
                            if (cbAll) { if (cbAll.checked) { MSCJS.HTMLHelpers.ClientEvents.Grid.OnSelectAll($(cbAll), gn); } else { s.Selection.Reset(); } }
                        },
                        SelectCheckBox: function (scb, gn, v) {
                            var grid = $('#' + gn).data('kendoGrid');
                            grid.Selection[scb.checked ? 'Select' : 'DeSelect'](v);
                        },
                        OnSelectAll: function (me, gn) {
                            $.each($('.' + gn + '_cb'), function (i, v) {
                                v.checked = me.checked;
                            });
                        }
                    },
                    DetailGrid: {
                        AddDetail: function (gname) {
                            gridProperties.ShowGridContainer(gname);
                            Ajax.RequestManager().Enqueue({
                                url: UrlHelper.Action('AddDetail') + '?key=' + gname + '&id=' + 0,
                                type: "GET",
                                cache: false,
                                success: function (partialData) {
                                    $('#' + gname + 'ctr').html(partialData);
                                    gridProperties.GridButtonEnable(gname, false, true, false, false, true, true);
                                    Validation.Load({
                                        ValidationSettings: {
                                            Url: UrlHelper.Action('LoadUIValidationRules'),
                                            Category: gname,
                                            Success: function (rules) {
                                                ValidationHandler.AddRules(gname, rules);
                                            }
                                        }
                                    })
                                }
                            });
                        },
                        CloseDetail: function (gname) {
                            gridProperties.HideGridContainer(gname);
                            gridProperties.GridButtonEnable(gname, true, false, true, true, false, false);
                        },
                        EditDetail: function (gname, IdProperty) {
                            var grid = $("#" + gname).data("kendoGrid");
                            var item = grid.dataItem(grid.select());
                            if (item && item[IdProperty]) {
                                //var Id = $("#" + gname + "ctr #" + IdProperty).val();
                                Ajax.RequestManager().Enqueue({
                                    url: UrlHelper.Action('AddDetail') + '?key=' + gname + '&id=' + item[IdProperty],
                                    type: "GET",
                                    cache: false,
                                    success: function (partialData) {
                                        $('#' + gname + 'ctr').html(partialData);
                                        gridProperties.GridButtonEnable(gname, false, true, false, false, true, true);
                                        gridProperties.ShowGridContainer(gname);
                                        Validation.Load({
                                            ValidationSettings: {
                                                Url: UrlHelper.Action('LoadUIValidationRules'),
                                                Category: gname,
                                                Success: function (rules) {
                                                    ValidationHandler.AddRules(gname, rules);
                                                }
                                            }
                                        })
                                    },
                                    error: function (data) {
                                    }
                                });
                            }
                        },
                        SaveDetail: function (gname) {
                            var grid = $("#" + gname).data("kendoGrid");
                            Validation.IsValid({ ContainerId: (gname + "ctr") });
                            //Ajax.RequestManager().Enqueue({
                            $.ajax({
                                url: UrlHelper.Action('SaveDetail') + '?key=' + gname,
                                type: "POST",
                                cache: false,
                                data: $('#' + gname + 'ctr *').serialize(),
                                success: function (data) {
                                    if (data.success) {
                                        grid.dataSource.read();
                                        gridProperties.HideGridContainer(gname);
                                        if (!data.title) data.title = "Save";
                                    }
                                    MSCJS.Message.ShowMessage(data.type, data.title, data.message);
                                },
                                error: function (data) {
                                    if (e.responseText.indexOf("\"type\":\"E\"") > 0) {
                                        var error = $.parseJSON(e.responseText);
                                        MSCJS.Message.ShowMessage(error.type, error.title, error.message, error.innerMessage, error.stackTrace);//TODO SHOW ERROR WITH INNER MESSAGE
                                    }
                                }
                            });
                        },
                        DeleteDetail: function (gname, IdProperty) {
                            var grid = $("#" + gname).data("kendoGrid");
                            //var Id = $("#" + gs.Name + "ctr #" + gs.IdProperty).val();
                            var item = grid.dataItem(grid.select());
                            if (item && item[IdProperty])
                                Ajax.RequestManager().Enqueue({
                                    //  $.ajax({
                                    url: UrlHelper.Action('DeleteDetail') + '?key=' + gname + '&id=' + item[IdProperty],
                                    type: "POST",
                                    cache: false,
                                    success: function (data) {
                                        if (data.success) {
                                            Validation.Load({
                                                ValidationSettings: {
                                                    Url: UrlHelper.Action('LoadUIValidationRules'),
                                                    Category: gname,
                                                    Success: function (rules) {
                                                        ValidationHandler.AddRules(gname, rules);
                                                    }
                                                }
                                            });
                                            grid.dataSource.read();
                                            if (!data.title) data.title = "Delete";
                                            gridProperties.GridButtonEnable(gname, true, false, true, true, false, false);
                                        }
                                        MSCJS.Message.ShowMessage(data.type, data.title, data.message);
                                    },
                                    error: function (data) {
                                    }
                                });
                        },
                        QueryDetail: function (gname, IdProperty) {
                            var grid = $("#" + gname).data("kendoGrid");
                            var item = grid.dataItem(grid.select());
                            if (item[IdProperty]) {
                                Ajax.RequestManager().Enqueue({
                                    url: UrlHelper.Action('QueryDetail') + '?key=' + gname + '&id=' + item[IdProperty],
                                    type: "GET",
                                    cache: false,
                                    success: function (partialData) {
                                        $('#' + gname + 'ctr').html(partialData);
                                        gridProperties.ShowGridContainer(gname);
                                    },
                                    error: function (data) {
                                    }
                                });
                            }
                        },
                    },
                    Slider: {
                        OnSliderChange: clfn(),
                        OnSliderSlide: clfn()
                    },
                    Window: {
                        OnClose: function (e, clientFn) {
                            var id = e.sender.element[0].id;
                            if ($("#" + id + "ctr").hasClass(MSCJS.Constants.WindowHelper.Css.Overlay)) {
                                $("#" + id + "ctr").removeClass(MSCJS.Constants.WindowHelper.Css.Overlay);
                            }
                            MSCJS.Common.Helper.ExecuteMethod(clientFn, [e]);
                        },
                        OnError: clfn(),
                        OnDeactivate: clfn(),
                        OnOpen: function (e, clientFn) {
                            var id = e.sender.element[0].id;
                            if (!$("#" + id + "ctr").hasClass(MSCJS.Constants.WindowHelper.Css.Overlay)) {
                                $("#" + id + "ctr").addClass(MSCJS.Constants.WindowHelper.Css.Overlay);
                            }
                            MSCJS.Common.Helper.ExecuteMethod(clientFn, [e]);
                        },
                        OnActivate: clfn(),
                        OnDragStart: clfn(),
                        OnDragEnd: clfn(),
                        OnRefresh: clfn(),
                        OnResize: clfn()
                    }
                },
            },
        };
    })();
})(window);

Ajax = (function () {
    var requestManager;
    function Init() {
        function Start(request, $this) {
            if (request) {
                if (typeof (request) == 'object' && !request['notAjax']) {
                    $.ajax({
                        url: request.url,
                        type: request.type,
                        contentType: request.contentType,
                        cache: request.cache,
                        data: request.data,
                        success: function (o) {
                            if (request.success) request.success(o);
                            status = 0;
                            if ($this.RequestQueue.length > 0) {
                                var nextRequest = $this.Dequeue(request.url);
                                $this.LoadingPanel(nextRequest['message']).Show();
                                Start(nextRequest, $this);
                            }
                            else {
                                $this.LoadingPanel().Hide();
                                Overlay.Stop();
                            }
                        },
                        error: function (e) {
                            status = 0;
                            var errorHandled = false;
                            if (request.onError) {
                                request.onError(e);
                                errorHandled = true;
                            }
                            if (e.status == HttpStatus.Forbidden) {
                                MSCJS.Message.ShowInformation(MSCJS.Resources.Authorization());
                            }
                            if (e.responseText.indexOf("\"type\":\"E\"") > 0) {
                                var error = $.parseJSON(e.responseText);
                                MSCJS.Message.ShowMessage(error.type, error.title, error.message, error.innerMessage, error.stackTrace);//TODO SHOW ERROR WITH INNER MESSAGE
                            }
                            else {
                                var reg = /<title>(.*?)<\/title>/;
                                var title = e.responseText.match(reg), txtTitle = "";
                                if (title && title.length > 1) { txtTitle = title[1] }
                                else if (title && title[0]) { txtTitle = title[0]; }
                                MSCJS.Message.ShowError(txtTitle, e.responseText);//TODO SHOW ERROR WITH INNER MESSAGE
                            }
                            // $this.LoadingPanel().Hide();
                            //  Overlay.Stop();
                        },
                        complete: function (result) {
                            if (request.onComplete) {
                                request.onComplete(result);
                            }
                        }
                    });
                }
                else if (typeof (request) == 'object' && request['notAjax']) {
                    if (request) request.method();
                    status = 0;
                    if ($this.RequestQueue.length > 0) Start($this.Dequeue(request.url), $this);
                }
            }
            var HttpStatus = {
                Forbidden: 403
            };
        }
        var Overlay = (function () {
            return {
                GetLoadingPanelAndContent: (function () {
                    //TODO Get the Loading panel from the Outer Layout
                    return {
                        Show: function () {
                            $("<div id='loading' class='loading'><img src='Content/images/loader.gif'/><span id='loadingMessage'>Please wait ...  </span></div>")
                                .insertAfter("body");
                        },
                        Hide: function () {
                            $("#loading").remove();
                        }
                    };
                }),
                Start: (function () {
                    var panel = this.GetLoadingPanelAndContent();
                    panel.Show();
                }),
                Stop: (function () {
                    var panel = this.GetLoadingPanelAndContent();
                    panel.Hide();
                })
            }
        })();
        return {
            RequestQueue: null,
            status: null,
            //TODO Loading Panel with Show/Hide
            LoadingPanel: function (msg) {
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
            SetMessage: (function (msg) {
                var msgContent = document.getElementById('loadingMessage');
                msgContent.innerHTML = msg ? msg : 'Please wait ...';
            }),
            StopOverlay: (function () {
                Overlay.Stop();
            }),
            Enqueue: function (request) {
                if (!this.RequestQueue)
                    this.RequestQueue = [];
                this.RequestQueue.push(request);
                this.Logger(request.url + ' added!');
                if ((!status) || (status == "0") || this.RequestQueue.length <= 1) {
                    status = 1;
                    if (this.RequestQueue.length > 0) {
                        Overlay.Start();
                        this.LoadingPanel(request['message']).Show();
                        Start(this.Dequeue(request.url), this);
                    };
                }
            },
            Dequeue: function (url) {
                if (this.RequestQueue) {
                    this.Logger(url + ' is pending...');
                    return this.RequestQueue.shift();
                }
                return null;
            },
            Counts: function () {
                return !this.RequestQueue ? 0 : this.RequestQueue.length;
            },
            Logger: function (message) {
                //if (console!='undefined') {
                // console.log(message);
                // }
            }
        };
    }
    return {
        RequestManager: function () {
            if (!requestManager)
                requestManager = Init();
            return requestManager;
        }
    };
})();
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
    ShowGridContainer: function (gname) {
        if ($('#' + gname + 'partial').hasClass(gridProperties.Hide())) {
            $('#' + gname + 'partial').toggleClass(gridProperties.Hide() + ' ' + gridProperties.Show());
            $("#" + gname + "grid").toggleClass(gridProperties.Show() + ' ' + gridProperties.Hide());
        }
    },
    HideGridContainer: function (gname) {
        if ($('#' + gname + 'partial').hasClass(gridProperties.Show())) {
            $('#' + gname + 'grid').toggleClass(gridProperties.Hide() + ' ' + gridProperties.Show());
            $("#" + gname + "partial").toggleClass(gridProperties.Show() + ' ' + gridProperties.Hide());
        }
    },
    GridButtonEnable: function (gridname, isNew, isSave, isEdit, isDelete, isClear, isClose) {
        this.GridToolbarAddorRemoveDisableClass(gridname, isNew, this.Newcss);
        this.GridToolbarAddorRemoveDisableClass(gridname, isSave, this.Savecss);
        this.GridToolbarAddorRemoveDisableClass(gridname, isEdit, this.Editcss);
        this.GridToolbarAddorRemoveDisableClass(gridname, isDelete, this.Deletecss);
        this.GridToolbarAddorRemoveDisableClass(gridname, isClear, this.Clearcss);
        this.GridToolbarAddorRemoveDisableClass(gridname, isClose, this.Closecss);
    },
    GridToolbarAddorRemoveDisableClass: function (gridname, enable, cssClass) {
        var currentToolbar = $('#' + gridname + 'Toolbar .' + cssClass());
        if (!enable && !currentToolbar.hasClass(this.Disablecss())) {
            currentToolbar.addClass(this.Disablecss());
        }
        else if (currentToolbar.hasClass(this.Disablecss())) {
            $('#' + gridname + 'Toolbar .' + cssClass()).removeClass(this.Disablecss());
        }
        currentToolbar.prop("disabled", !enable);
    },
    EnableQueryView: function (gname, isEnable) {
        if (isEnable === true) {
            $("#" + gname + "Toolbar ." + this.Querycss()).show();
            gridProperties.GridButtonEnable(gname, false, false, false, false, false, true);
        }
        else {
            $("#" + gname + "Toolbar ." + this.Querycss()).hide();
            gridProperties.GridButtonEnable(gname, true, false, true, true, false, false);
        }
    }
};

(function MSCExtensions() {
    String.prototype.In = (function (set) {
        var value = this, has = false;
        if (typeof (set) === 'string')
            set = set.split(/,/g);
        for (var i = 0; i < set.length; i++)
            if (!has && set[i] === value)
                has = true;
        return has;
    });
    String.prototype.NotIn = (function (set) {
        return !this.In(set);
    });
    String.prototype.capitalizeFirstLetter = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    },
    Array.prototype.trim = function () {
        i = 0;
        var L = this.length;
        while (i < L) {
            this[i] = this[i].trim();
            i++;
        }
        return this;
    };
})();

function TextAreaPopUpInit(s) {
} //todo

UrlHelper = function () {
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

var Validation = (function () {
    return {
        Load: (function (s) {
            this.Category = s.ValidationSettings.Category || "Header";
            var self = this;
            $.ajax({
                url: UrlHelper.Action("LoadUIValidationRules"),
                type: 'POST',
                data: { groupId: ValidationHandler.Category.GetRulesetID(this.Category) },
                success: function (Result) {
                    $.each(Result.Rule, function (i, e) {
                        var rule = self.Json.Decode(e);
                        self.Rules.GetRules(self.Category).push(rule);
                        self.Register(rule);
                    });
                }
            });
        }),
        Json: (function () {
            return {
                Decode: (function (r) {
                    r[1] = r[1].replace(/\t/g, '');
                    r[2] = r[2].replace(/\t/g, '');
                    return {
                        Id: r[0],
                        Label: document.getElementById("spn" + r[1]) ? document.getElementById("spn" + r[1]) : { id: "spn" + r[1] },
                        Entity: document.getElementById(r[1]) ? document.getElementById(r[1]) : { id: r[1] },
                        EntityType: r[3],
                        DataType: r[4],
                        MinLength: r[5],
                        MaxLength: r[6],
                        MinDecimal: r[7],
                        MaxDecimal: r[8],
                        IsUpper: r[9],
                        RegularExpression: r[1],
                        MessageType: r[11],
                        CompareExpression: r[12],
                        CompareEntity: document.getElementById(r[13]) ? document.getElementById(r[13]) : { id: r[13] },
                        MinLengthMessage: r[14],
                        MaxLengthMessage: r[15],
                        MinDecimalMessage: r[16],
                        MaxDecimalMessage: r[17],
                        MinDateMessage: r[18],
                        MaxDateMessage: r[19],
                        IsUpperMessage: r[20],
                        CompareMessage: r[21],
                    };
                })
            };
        })(),
        CompareExpressions: (function () {
            return {
                LessThan: "<",
                GreaterThan: ">",
                LessThanOrEquals: "<=",
                GreaterThanOrEquals: ">=",
                Equals: "==",
                NotEquals: "!="
            };
        })(),
        EntityType: (function () {
            return {
                Label: 1,
                TextBox: 2,
                ListSingle: 3,
                ListMulti: 4,
                Checkbox: 5,
                Radiobutton: 6,
                Webcombo: 7,
                AutoComplete: 8,
                DateControl: 9,
                ComboBox: 10
            };
        })(),
        DataType: (function () {
            return {
                Anything: 0,
                RejectNegativeandDecimalDot: 1,//integers
                RejectNegativeButNotDecimalDot: 2,//double >0
                AcceptNegativeButNotDecimalDot: 3,//whole numbers
                AcceptNegativeAndDecimalDot: 4,//dobule with minus
                AcceptLetterAndDigitOnly: 10,//alphanumeric
                AcceptNamingLetters: 11,//valid naming strings
                AnythingButNotSpecial: 12,
                AcceptDate: 20,//dates
                Email: 30,//valid emails
                CreditCard: 40,
                PhycalPath: 50,
                RelativePath: 51,
                RegularExpression: 52,
                Temperature: 5
            };
        })(),
        Register: (function (r) {
            this.RequiredFieldValidator(r);
            if (r.IsUpper) {
                $(r.Entity).css('text-transform', 'uppercase').change(function () {
                    this.value = this.value.toUpperCase()
                });
            }
            $(r.Entity).bind('keypress', this.EventHandler.OnKeyPress);
            $(r.Entity).bind('change', this.EventHandler.OnChange);
        }),
        RequiredFieldValidator: (function (r) {
            if (r.MinLength === 1 && r.Label && r.Label.innerHTML) {
                r.Label.innerHTML = r.Label.innerHTML.replace(/\<(.+)\>/g, '');
                if (r.Entity.value !== '' && r.Entity.value != undefined) {
                    r.Label.innerHTML = '<span>*</span>' + r.Label.innerHTML;
                }
                else if (r.Entity.value === '' || r.Entity.value == undefined) {
                    r.Label.innerHTML = '<span title="' + r.MinLengthMessage + '" class="ValidationSummary">*</span>' + r.Label.innerHTML;
                }
            } else if (r.CompareExpression) {
                $(r.Label).attr('data-cmp-val', r.CompareMessage);
                $(r.Label).addClass('CompareSummary');
            }
        }),
        CompareValidator: (function (r) {
            if (r.CompareExpression) {
                switch (r.DataType) {
                    case this.DataType.AcceptDate:
                        var d1 = this.DateFormat(r.Entity.value);
                        var d2 = this.DateFormat(r.CompareEntity.value);
                        this.Compare(d1, d2, r.CompareExpression, r.Label, r.CompareMessage);
                        break;
                    case this.DataType.Anything:
                        this.Compare(r.Entity.value, r.CompareEntity.value, r.CompareExpression, r.Label, r.CompareMessage);
                        break;
                }
            }
        }),
        Compare: (function (v1, v2, op, lbl, msg) {
            switch (op) {
                case this.CompareExpressions.LessThan:
                    if (v1 < v2) {
                        $(lbl).attr('data-cmp-val', '');
                        $(lbl).removeClass('CompareSummary');
                    } else {
                        $(lbl).attr('data-cmp-val', msg);
                        $(lbl).addClass('CompareSummary');
                    }
                    break;
                case this.CompareExpressions.LessThanOrEquals:
                    if (v1 <= v2) {
                        $(lbl).attr('data-cmp-val', '');
                        $(lbl).removeClass('CompareSummary');
                    } else {
                        $(lbl).attr('data-cmp-val', msg);
                        $(lbl).addClass('CompareSummary');
                    }
                    break;
                case this.CompareExpressions.Equals:
                    if (v1 == v2) {
                        $(lbl).attr('data-cmp-val', '');
                        $(lbl).removeClass('CompareSummary');
                    } else {
                        $(lbl).attr('data-cmp-val', msg);
                        $(lbl).addClass('CompareSummary');
                    }
                    break;
                case this.CompareExpressions.NotEquals:
                    if (v1 != v2) {
                        $(lbl).attr('data-cmp-val', '');
                        $(lbl).removeClass('CompareSummary');
                    } else {
                        $(lbl).attr('data-cmp-val', msg);
                        $(lbl).addClass('CompareSummary');
                    }
                    break;
                case this.CompareExpressions.GreaterThanOrEquals:
                    if (v1 >= v2) {
                        $(lbl).attr('data-cmp-val', '');
                        $(lbl).removeClass('CompareSummary');
                    } else {
                        $(lbl).attr('data-cmp-val', msg);
                        $(lbl).addClass('CompareSummary');
                    }
                    break;
                case this.CompareExpressions.GreaterThan:
                    if (v1 > v2) {
                        $(lbl).attr('data-cmp-val', '');
                        $(lbl).removeClass('CompareSummary');
                    } else {
                        $(lbl).attr('data-cmp-val', msg);
                        $(lbl).addClass('CompareSummary');
                    }
                    break;
            }
        }),
        DateFormat: (function (d) {
            var dsplit = d.replace("-", " ");
            return d = new Date(dsplit);
        }),
        IsValid: (function (s) {
            var Message = '';
            var summary = $('#' + s.ContainerId).find('.ValidationSummary');
            var controls = this.GetHtmlControls();
            controls = controls.split(',');
            $(controls).each(function (i, c) {
                var self = Validation;
                if (c) {
                    var rule = self.GetRuleById(c);
                    if (rule == null) {
                        return true;
                    }
                    else {
                        self.CompareValidator(rule);
                    }
                }
            });
            var cmpsummary = $('#' + s.ContainerId).find('.CompareSummary');
            $.each(cmpsummary, function (i, e) {
                Message += e.getAttribute("data-cmp-val") + "\n";
            });
            $.each(summary, function (i, e) {
                Message += e.title + "\n";
            });
            return Message;
        }),
        EventHandler: (function () {
            var getTextBoxValue = (function (event) {
                var currentTarget = event.target || window.event.target;
                return currentTarget.value.slice(0, currentTarget.selectionStart)
                            + String.fromCharCode(event.which)
                            + currentTarget.value.slice(currentTarget.selectionStart, currentTarget.value.length);
            });
            return {
                /// <summary>
                /// Validates the entity when the key is pressed
                /// </summary>
                OnKeyPress: (function (e) {
                    if (!window.event
                        && e.key !== "Spacebar"
                        && e.key !== "MozPrintableKey"
                        && (e.which === 0 || e.which == 8)
                        && e.charCode === 0) { return true; }
                    var v = getTextBoxValue(e);
                    var self = Validation, value = getTextBoxValue(e), r = self.GetRuleById(e.target.id);
                    if (r == null) {
                        return true;
                    }
                    switch (r.DataType) {
                        case self.DataType.AcceptNegativeAndDecimalDot:
                            return value.match(self.GetExpressionByRule(r)) != null;
                            break;
                        case self.DataType.AcceptNegativeButNotDecimalDot:
                            if (e.key === self.Constants.Minus && value === '') return true;
                            else if (e.key === self.Constants.Zero) return false;
                            return self.GetExpressionByRule(r).test(value);
                            break;
                        case self.DataType.RejectNegativeandDecimalDot:
                            return value.match(self.GetExpressionByRule(r)) != null;
                            break;
                        case self.DataType.RejectNegativeButNotDecimalDot:
                            return value.match(self.GetExpressionByRule(r)) != null;
                            break;
                        case self.DataType.AcceptNamingLetters:
                            return self.GetExpressionByRule(r).test(value);
                            break;
                        case self.DataType.AcceptLetterAndDigitOnly:
                            return self.GetExpressionByRule(r).test(value);
                            break;
                        case self.DataType.RegularExpression:
                            return self.GetExpressionByRule(r).test(value);
                            break;
                        case self.DataType.Anything:
                            return self.GetExpressionByRule(r).test(value);
                            break;
                        case self.DataType.Temperature:
                            return value.match(self.GetExpressionByRule(r)) != null;
                            break;
                    }
                }),
                OnChange: (function (e) {
                    var self = Validation;
                    var rule = self.GetRuleById(e.target.id);
                    if (rule == null) {
                        return true;
                    }
                    else {
                        self.RequiredFieldValidator(rule);
                        if (rule.DataType == self.DataType.Email && rule.Entity.value !== '') {
                            return self.GetExpressionByRule(rule).test(rule.Entity.value) ? true : alert("Invalid Email");
                        }
                    }
                })
            };
        })(),
        GetRuleById: (function (entityId) {
            var self = this, rule = null, getRuleById = (function (rules, isdefaultCatagoryCall) {
                for (var i = 0; i < rules.length; i++) {
                    if (rules[i].Entity.id === entityId) {
                        return rules[i];
                    }
                }
                if (!isdefaultCatagoryCall) { value = getRuleById(self.Rules.GetRules("Header"), true); }
                else { value = null; }
                return value;
            });
            var category = entityId.replace(/_/g, '.');
            return getRuleById(this.Rules.GetRules(category.split('.')[0]), false);
        }),
        GetExpressionByRule: (function (r) {
            var expression = null;
            switch (r.DataType) {
                case this.DataType.AcceptLetterAndDigitOnly:
                    if (r.MinLength >= 0 && r.MaxLength > 0)
                        expression = new RegExp('^\\w{' + r.MinLength + ',' + r.MaxLength + '}$');
                    else if (r.MinLength > 0 && r.MaxLength == 0)
                        expression = new RegExp('^\\w{' + r.MinLength + ',}$');
                    else expression = new RegExp('^\\w+$');
                    return expression;
                    break;
                case this.DataType.AcceptNamingLetters:
                    if (r.MinLength > 0 && r.MaxLength > 0)
                        expression = new RegExp('^[a-zA-Z ._]{' + r.MinLength + ',' + r.MaxLength + '}$');
                    else if (r.MinLength == 0 && r.MaxLength > 0)
                        expression = new RegExp('^[a-zA-Z ._]{1,' + r.MaxLength + '}$');
                    else expression = new RegExp('^[a-zA-Z ._]+$');
                    return expression;
                    break;
                case this.DataType.AcceptNegativeAndDecimalDot:
                    if (r.MinLength == 0 && r.MaxLength > 0)
                        expression = new RegExp('^-?(\\d{1,' + r.MaxLength + '})?(\\.?|(\\.\\d{' + r.MinDecimal + ',' + r.MaxDecimal + '})?)$');
                    if (r.MinLength > 0 && r.MaxLength == 0 && r.MinDecimal == 0 && r.MaxDecimal == 0)
                        expression = new RegExp('^-?\\d+$');
                    if (r.MinLength > 0 && r.MaxLength == 0 && r.MinDecimal > 0 && r.MaxDecimal > 0)
                        expression = new RegExp('^-?(\\d+)?(\\.?|\\.\\d{' + r.MinDecimal + ',' + r.MaxDecimal + '})?)$');
                    expression = RegExp('^-?(\\d{' + r.MinLength + ',' + r.MaxLength + '})?(\\.?|(\\.\\d{' + r.MinDecimal + ',' + r.MaxDecimal + '})?)$');
                    return expression;
                    break;
                case this.DataType.AcceptNegativeButNotDecimalDot:
                    if (r.MinLength > 0 && r.MaxLength > 0)
                        expression = new RegExp('^-?\\d{' + r.MinLength + ',' + r.MaxLength + '}$');
                    else if (r.MinLength == 0 && r.MaxLength > 0)
                        expression = new RegExp('^-?\\d{1,' + r.MaxLength + '}$');
                    else expression = new RegExp('^-?\\d+$');
                    return expression;
                    break;
                case this.DataType.Email:
                    expression = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+$/;
                    return expression;
                    break;
                case this.DataType.RejectNegativeandDecimalDot:
                    if (r.MinLength > 0 && r.MaxLength > 0)
                        expression = new RegExp('^\\d{' + r.MinLength + ',' + r.MaxLength + '}$');
                    else if (r.MinLength == 0 && r.MaxLength > 0)
                        expression = new RegExp('^\\d{1,' + r.MaxLength + '}$');
                    else expression = new RegExp('^\\d+$');
                    return expression;
                    break;
                case this.DataType.RejectNegativeButNotDecimalDot:
                    if (r.MinLength == 0 && r.MaxLength > 0)
                        expression = new RegExp('^(\\d{1,' + r.MaxLength + '})?(\\.?|(\\.\\d{' + r.MinDecimal + ',' + r.MaxDecimal + '})?)$');
                    if (r.MinLength > 0 && r.MaxLength == 0 && r.MinDecimal == 0 && r.MaxDecimal == 0)
                        expression = new RegExp('^\\d+$');
                    if (r.MinLength > 0 && r.MaxLength == 0 && r.MinDecimal > 0 && r.MaxDecimal > 0)
                        expression = new RegExp('^(\\d+)?(\\.?|(\\.\\d{' + r.MinDecimal + ',' + r.MaxDecimal + '})?)$');
                    expression = RegExp('^(\\d{' + r.MinLength + ',' + r.MaxLength + '})?(\\.?|(\\.\\d{' + r.MinDecimal + ',' + r.MaxDecimal + '})?)$');
                    return expression;
                    break;
                case this.DataType.AnythingButNotSpecial:
                    return new RegExp(/^([a-zA-Z0-9_\s\-]*)$/);
                    break;
                case this.DataType.RegularExpression:
                    return new RegExp(r.RegularExpression);
                    break;
                case this.DataType.Anything:
                    if (r.MinLength > 0 && r.MaxLength > 0)
                        expression = new RegExp('^(.|\\s){' + r.MinLength + ',' + r.MaxLength + '}$');
                    else if (r.MinLength == 0 && r.MaxLength > 0)
                        expression = new RegExp('^(.|\\s){1,' + r.MaxLength + '}$');
                    else expression = new RegExp('^.|\\s*$');
                    return expression;
                    break;
                case this.DataType.Temperature:
                    if (r.MinLength == 0 && r.MaxLength > 0)
                        expression = new RegExp('^-?(\\d{1,' + r.MaxLength + '})?(\\.?|(\\.\\d{' + r.MinDecimal + ',' + r.MaxDecimal + '})?)$');
                    if (r.MinLength > 0 && r.MaxLength == 0 && r.MinDecimal == 0 && r.MaxDecimal == 0)
                        expression = new RegExp('^-?\\d+$');
                    if (r.MinLength > 0 && r.MaxLength == 0 && r.MinDecimal > 0 && r.MaxDecimal > 0)
                        expression = new RegExp('^-?(\\d+)?(\\.?|\\.\\d{' + r.MinDecimal + ',' + r.MaxDecimal + '})?)$');
                    expression = RegExp('^-?(\\d{' + r.MinLength + ',' + r.MaxLength + '})?(\\.?|(\\.\\d{' + r.MinDecimal + ',' + r.MaxDecimal + '})?)$');
                    return expression;
                    break;
            }
            return expression;
        }),
        Rules: (function () {
            var container = {};
            return {
                GetRules: (function (category) {
                    if (category) {
                        if (!container[category])
                            container[category] = [];
                        return container[category];
                    }
                })
            }
        })(),
        GetHtmlControls: (function () {
            var HtmlControls = $('#form1').find('input[type="text"],textarea,select,input[type="radio"]'), Controls = '';
            if (HtmlControls != null && HtmlControls != 'undefined') {
                $.each(HtmlControls, function (index, obj) {
                    Controls += obj.id + ',';
                });
                Controls = Controls.slice(0, Controls.length - 1);
            }
            return Controls;
        })
    };
})();

var ValidationHandler = (function () {
    var handlers = {};
    var getHtmlControls = (function () {
        var HtmlControls = $('#form1').find('input[type="text"],textarea,select,input[type="radio"]'), Controls = '';
        if (HtmlControls != null && HtmlControls != 'undefined') {
            $.each(HtmlControls, function (index, obj) {
                Controls += obj.id + ',';
            });
            Controls = Controls.slice(0, Controls.length - 1);
        }
        return Controls;
    });

    var exception = {
        tracker: null,
        handlerName: null
    };
    return {
        /// <summary>
        /// Act as a container for holding all the handlers
        /// </summary>
        Handler: (function () {
            return {
                Add: (function (key, value) {
                    this[key] = value;
                    return this;
                }),
                Get: (function (key) {
                    return this[key];
                })
            };
        })(),
        /// <summary>
        /// Validation Handlers are isolated by the category
        /// </summary>
        Category: (function () {
            var containers = {};
            var ruleset = {};
            var customRulesetAccessHandlers = {};
            return {
                Add: (function (key, value, container, rulesetID) {
                    this[key] = value;
                    if (container) {
                        containers[key] = '#' + container.replace(/#/g, '');
                    }
                    if (rulesetID) {
                        ruleset[key] = rulesetID;
                    }
                }),
                Serialize: (function (category) {
                    return $(containers[category] + ' *').serializeArray();
                }),
                GetRulesetID: (function (category) {
                    return ruleset[category];
                }),
                AddCustomRulesetAccessHandler: (function (category, handler) {
                    if (typeof (handler) === 'function') {
                        if (!customRulesetAccessHandlers[category]) {
                            customRulesetAccessHandlers[category] = handler;
                        }
                    }
                    else throw Error('Custom ruleset access handler should be function');
                }),
                GetCustomRulesetAccessHandler: (function (category) {
                    return (customRulesetAccessHandlers[category]) ? customRulesetAccessHandlers[category] : null;
                })
            };
        })(),
        /// <summary>
        /// Contains the messages isolated by category
        /// </summary>
        MessageStore: (function () {
            var key = 'Message';
            return {
                Add: (function (handler, category, msg) {
                    if (!handlers[category][key]) handlers[category][key] = {};
                    if (!handlers[category][key][handler]) handlers[category][key][handler] = {};
                    if (typeof (msg) == 'string') handlers[category][key][handler] = '<li>' + msg + '</li>';
                    else handlers[category][key][handler] = msg;
                }),
                GetMessage: (function (category) {
                    if (!handlers[category][key]) return null;
                    return handlers[category][key];
                }),
                GetMessageById: (function (category, id) {
                    var message = "";
                    if (!handlers[category][key]) return null;
                    $.each(handlers[category].Rules, function (i, rule) {
                        if (rule[0] == id && message == "") {
                            message = rule[1];
                        }
                    });
                    return message;
                }),
                FormatMessage: (function (category, handlerName, arg1, arg2, arg3, arg4, arg5) {
                    var message = handlers[category][key][handlerName];
                    if (arg1) message = message.format(arg1);
                    if (arg2) message = message.format(arg2);
                    if (arg3) message = message.format(arg3);
                    if (arg4) message = message.format(arg4);
                    if (arg5) message = message.format(arg5);
                    handlers[category][key][handlerName] = message;
                })
            };
        })(),
        /// <summary>
        /// Used to add the validation handler
        /// </summary>
        Add: (function (handler, category, fn, errorMsg) {
            var h = 'Handlers', r = 'Rules', results = 'Results';
            handler = handler.toString();
            if (!handlers[category]) handlers[category] = {};
            if (!handlers[category][h]) handlers[category][h] = {};
            if (handlers[category][h][handler])
                throw Error('The handler (' + handler + ') has been already  added!');
            else handlers[category][h][handler] = fn;
            if (!handlers[category][r]) handlers[category][r] = [];
            if (!handlers[category][results]) handlers[category][results] = {};
            this.MessageStore.Add(handler, category, errorMsg);
        }),
        /// <summary>
        /// Used to load the validation rules for the perticular category
        /// </summary>
        Load: (function (category, url) {
            if (handlers[category].Rules.length == 0) {
                Ajax.RequestManager().Enqueue({
                    url: url,
                    type: 'POST',
                    data: { htmlControls: getHtmlControls() },
                    success: function (Result) {
                        handlers[category].Rules = Result.Rule;
                    },
                    message: 'Loading validation rules ...'
                });
            }
        }),
        /// <summary>
        /// Used to clears the rules of the category
        /// </summary>
        ClearRules: (function (category) {
            if (handlers[category])
                handlers[category].Rules = [];
        }),
        /// <summary>
        /// Used to re - load the validation rules for the perticular category
        /// </summary>
        Reload: (function (category, url) {
            if (IboxV5.UI.Toolbar.GetMode().Equals(IboxV5.UI.Toolbar.Edit) || IboxV5.UI.Toolbar.GetMode().Equals(IboxV5.UI.Toolbar.Clear)) {
                if (handlers[category].Rules.length == 0 || category === 'Header') {
                    Ajax.RequestManager().Enqueue({
                        url: url,
                        type: 'POST',
                        data: { htmlControls: getHtmlControls() },
                        success: function (Result) {
                            handlers[category].Rules = Result.Conditional;
                        },
                        message: 'Loading validation rules ...'
                    });
                }
            }
        }),
        /// <summary>
        /// Used to append the rules of the particular category
        /// </summary>
        AddRules: (function (category, rules) {
            IboxV5.TryCatch(function () {
                if (rules.length > 0) {
                    if (!handlers[category])
                        throw Error('The category ' + category + ' is not found!');
                    handlers[category].Rules = rules;
                }
            });
        }),
        /// <summary>
        /// Serializes the form fields, and converts it into the actual client side model
        /// </summary>
        GetModel: (function (formCollection, excludeProperties) {
            formCollection = formCollection || $('#form1').serializeArray();
            var serialize = function () {
                var duplication = {};
                formCollection = formCollection
                    .filter(function (e, i, a) {
                        var canInclude = true;
                        if (e.name === '__RequestVerificationToken') canInclude = false;
                        else if (e.name.match(/_DDDWS/g)
                            || e.name.match(/_DDD_LDeletedItems/g)
                            || e.name.match(/_DDD_LInsertedItems/g)
                            || e.name.match(/_DDD_LCustomCallback/g)
                            || e.name.match(/_VI/g)
                            || e.name.match(/\$DXFREditorcol/g)
                            || e.name.match(/_DXHFPWS/g)
                            || e.name.match(/_DXPagerBottom_PSPSI/g)
                            || e.name.match(/\$DXSelInput/g)
                            || e.name.match(/\$DXKVInput/g)
                            || e.name.match(/\$CallbackState/g)
                            || e.name.match(/\$DXSyncInput/g)
                            || e.name.match(/_DXFilterRowMenuCI/g)
                            || e.name.match(/_ListWS/g)
                            || e.name.match(/DXScript/g)
                            || e.name.match(/DXMVCEditorsValues/g)
                            || e.name.match(/_Raw/g)
                            || e.name.match(/_DDD_C_FNPWS/g)
                            || e.name.match(/\$DDD\$C/g)
                            ) canInclude = false;
                        else if (e.name.match(/\$DDD\$L/g)) {
                            e.name = e.name.replace(/\$DDD\$L/g, '');
                            duplication[e.name] = e.value;
                            canInclude = false;
                        }
                        else if (e.value === 'false') {
                            if (duplication[e.name] === 'true') {
                                canInclude = false;
                            }
                            else duplication[e.name] = e.value;
                        }
                        else if (e.value === 'true') {
                            if (duplication[e.name] === 'false') {
                                duplication[e.name] = e.value;
                                canInclude = false;
                            }
                            else duplication[e.name] = e.value;
                        }
                        return canInclude;
                    });
                formCollection = formCollection.filter(function (e, i, a) {
                    if (duplication[e.name] && duplication[e.name] !== 'false') {
                        e.value = duplication[e.name];
                    }
                    return true;
                });
                duplication = null;
                var model = {};
                convertToObject(formCollection, model);
                return model;
            },
                convertToObject = function (arr, model) {
                    for (var i = 0; i < arr.length; i++) {
                        var properties;
                        if (excludeProperties) {
                            if (arr[i].name.indexOf(excludeProperties) == -1) {
                                properties = arr[i].name.split('.');
                                bind(model, properties, arr[i].value);
                            }
                        }
                        else {
                            properties = arr[i].name.split('.');
                            bind(model, properties, arr[i].value);
                        }
                    }
                },
                bind = function (model, propArr, value) {
                    for (var i = 0; i < propArr.length; i++) {
                        if (i == propArr.length - 1) {
                            model[propArr[i]] = value;
                        }
                        else {
                            if (!model[propArr[i]]) model[propArr[i]] = {};
                            var arr = propArr.splice(0, 1);
                            bind(model[arr[0]], propArr, value);
                        }
                    }
                };
            return serialize();
        }),
        /// <summary>
        /// Executes all the handlers of the particular category and returns the error message
        /// </summary>
        Execute: (function (category, vType) {
            var model = this.GetModel($('#form1').serializeArray(), category);
            //if (!vType) { if (console) { console.log("No Validation Type Found:" + category + "\nCallee:" + arguments.callee.toString()) } }
            model['Details'] = model['Details'] || {};
            model['Details'][category] = model['Details'][category] || this.GetModel(this.Category.Serialize(category))[category];
            var key = 'Message';
            this.Message = '';
            var handler = handlers[category];
            if (handler) {
                var rules = null;
                if (vType) { rules = handler.Rules.filter(function (r) { return IboxV5.Validator.GetMessageType(r[2]) === vType; }); }
                else { rules = handler.Rules; }
                var self = this;
                $.each(handler.Handlers, function (fnName, h) {
                    self.ExceptionTraker().SetHandler(fnName);
                    var msg = null;
                    var has = rules.some(function (e, index, a) {
                        var f = e[0] == fnName;
                        if (f) {
                            if (e[1] === '')
                                handler[key][fnName] = '<li>No message is defined for the rule \'' + fnName + '\'</li>';
                            else
                                handler[key][fnName] = '<li title="' + fnName + '">' + e[1] + '</li>';
                        }
                        return f;
                    });
                    if (has) {
                        if (h(model, self, handlers[category]['Results']) == false) {
                            if (typeof (handler[key][fnName]) === 'string')
                                self.Message += handler[key][fnName];
                            handlers[category]['Results'][fnName] = false;
                        }
                        else handlers[category]['Results'][fnName] = true;
                    }
                    self.ExceptionTraker().ReleaseHandler();
                });
            }
            return this.Message;
        }),
        /// <summary>
        /// Used to check whether the form fiedls is valid or not
        /// </summary>
        IsValid: (function (category) {
            return this.Message == null;
        }),
        /// <summary>
        /// Used to hold the validation failure message
        /// </summary>
        Message: null,
        /// <summary>
        /// Used to track the last handler that causing the exception
        /// </summary>
        ExceptionTraker: (function () {
            var initTracker = (function () {
                return {
                    SetHandler: (function (name) {
                        exception.handlerName = name;
                    }),
                    ReleaseHandler: (function () {
                        exception.handlerName = null;
                    }),
                    GetHandler: (function () {
                        return exception.handlerName;
                    }),
                    IsExceptionTracked: (function () {
                        return exception.handlerName != null;
                    })
                };
            });
            if (!exception.tracker) exception.tracker = initTracker();
            return exception.tracker;
        })
    };
})();