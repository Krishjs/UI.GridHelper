
function PivotGrid() {
    var me = this;

    this.id = "";
    this.columns = [];
    this.groupFieldName = "";
    this.valueFieldName = "";
    this.headerFieldName = "";
    this.controllerName = "";
    this.template = "";
    this.actionName = "";
    this.additionalField = "";
    this.canGroupableColumnEdit = false;
    this.canFilter = false;
    this.canSort = false;
    this.canExportToExcel = false;
    this.canExportToPdf = false;
    this.canScroll = false;
    this.pageSize = 20;
    this.prevData = [];
    this.data = [];
    this.gridData = [];
    this.prevGridData = [];
    this.changedData = [];
    this.comboBoxSetting = {
        newsetting: "",
        valueField: "",
        textField: "",
        controllerName: "",
        serverFiltering: true,
        serverPaging: true,
        actionName: "",
        headerTemplate: "",
        template: "",
        pageSize: 30,
        minlength: 1,
        iscustom: true,
        data: [],
        id: "",
        visible: false,
        defaultTemplate: function (id, name) {
            var valuefullfield = name + "." + me.comboBoxSetting.valueField;
            var textfullfield = name + "." + me.comboBoxSetting.textField;
            return '<input id="' + id + '" class="k-combobox pivwrp" default-text="#=data.' + textfullfield + '#" default-value="#=data.' + valuefullfield + '#" />';
        },
        template: function (v) {
            var curcombobox = $("#" + v.id).kendoComboBox({
                dataTextField: me.comboBoxSetting.textField,
                dataValueField: me.comboBoxSetting.valueField,
                value: v.attributes["default-value"].value,
                text: v.attributes["default-text"].value,
                virtual: {
                    itemHeight: 26,
                    valueMapper: function (options) {
                        options.success(-1);
                    }
                },
                autoBind: false,
                dataSource: {
                    type: "aspnetmvc-ajax",
                    serverFiltering: me.comboBoxSetting.serverFiltering,
                    pageSize: me.comboBoxSetting.pageSize,
                    serverPaging: me.comboBoxSetting.serverPaging,
                    transport: {
                        read: {
                            url: me.BuildUrl(me.comboBoxSetting.controllerName, me.comboBoxSetting.actionName),
                            dataType: "json",
                            type: "POST"
                        }
                    },
                    schema: {
                        data: "data", // records are returned in the "data" field of the response
                        total: "total" // total number of records is in the "total" field of the response
                    },

                },
                filter: "contains",
                select: function () {
                    MSCJS.Common.Helper.ExecuteMethod(me.id + "_ComboboxSelect", [this]);
                },
                close: function () {
                    MSCJS.Common.Helper.ExecuteMethod(me.id + "_ComboboxClose", [this]);
                },
                open: function () {
                    MSCJS.Common.Helper.ExecuteMethod(me.id + "_ComboboxOpen", [this]);
                },
                filtering: function () {
                    MSCJS.Common.Helper.ExecuteMethod(me.id + "_ComboboxFilter", [this]);
                },
                dataBound: function () {
                    MSCJS.Common.Helper.ExecuteMethod(me.id + "_ComboboxDatabound", [this]);
                },
                change: function () {
                    var list = me.GetGrid();
                    var idcol = this.element.context.id.split("_");
                    var citem = this.dataItem();
                    var item = list.dataSource.getByUid(idcol[0]);
                    item.set("dirty", true);
                    var colname = idcol.length > 1 ? "_" : "";
                    colname += idcol[idcol.length - 1];
                    if (citem && item[colname]) {
                        $.each(item[colname], function (i, v) {
                            if (citem.hasOwnProperty(i))
                                item[colname][i] = citem[i];


                        })
                    }

                    MSCJS.Common.Helper.ExecuteMethod(me.id + "_ComboboxChange", [this]);
                },
            });
            if (me.comboBoxSetting.headerTemplate && me.comboBoxSetting.headerTemplate.length > 0)
                curcombobox.headerTemplate = me.comboBoxSetting.headerTemplate;
            if (me.comboBoxSetting.template && me.comboBoxSetting.template.length > 0)
                curcombobox.template = me.comboBoxSetting.template;


        }
    };

    this.datePickerSetting = {
        dateformat: DefaultFormat.GetDate(),
        datetimeformat: DefaultFormat.GetDateTime(),
        // mindate: null,
        value: null,
        // maxdate: null,
        groupvalue: "",
        colname: "",
        visible: false,
        isdatetime: false,
        defaultTemplate: function (id, name) {
            return '<input id="' + id + '" class="k-datepicker pivwrp" value="#=data.' + name + '#"/>';
        },
        datetemplate: function (id, value) {
            console.log("Date Time Picker Intialize");
            $(MSCJS.GetId(id)).kendoDatePicker({
                format: me.datePickerSetting.dateformat,
                parseformat: me.datePickerSetting.dateformat,
                value: new Date(value),
                change: function () {
                    var list = me.GetGrid();
                    var idcol = this.element.context.id.split("_");
                    item = list.dataSource.getByUid(idcol[0]);
                    item.set("dirty", true);
                    var colname = idcol.length > 1 ? "_" : "";
                    colname += idcol[idcol.length - 1];
                    item[colname] = new Date(this.value());
                    MSCJS.Common.Helper.ExecuteMethod(me.id + "_DateChange", [this]);

                },
                close: function () {
                    MSCJS.Common.Helper.ExecuteMethod(me.id + "_DatePickerClose", [this]);
                },
                open: function () {
                    MSCJS.Common.Helper.ExecuteMethod(me.id + "_DatePickerOpen", [this]);
                },
            });
        },
        datetimetemplate: function (id, value) {
            console.log("Date Time Picker Intialize");
            $(MSCJS.GetId(id)).kendoDateTimePicker({
                format: me.datePickerSetting.datetimeformat,
                parseformat: me.datePickerSetting.datetimeformat,
                // min: me.datePickerSetting.mindate,
                //  max: me.datePickerSetting.maxdate,
                value: new Date(value),
                change: function () {
                    var list = $(MSCJS.GetId(me.id)).data("kendoGrid");
                    var idcol = this.element.context.id.split("_");
                    item = list.dataSource.getByUid(idcol[0]);
                    item.set("dirty", true);
                    var colname = idcol.length > 1 ? "_" : "";
                    colname += idcol[idcol.length - 1];
                    item[colname] = new Date(this.value());
                }
            });
        }
    };

    this.textbox = {
        defaultTemplate: function (id, name) {
            return '<input class="k-textbox" type="textbox" id="' + id + '" value="#=data.' + name + '#" onchange="MSCJS.HTMLHelpers.ClientEvents.PivotGrid.onTextChange(\'' + me.id + '\',this)" />';
        }
    }

    this.NewGrid = function () {
        return $(MSCJS.GetId(me.id)).kendoGrid({
            dataSource: me.NewDataSource(),
            scrollable: me.canScroll,
            filterable: me.canFilter,
            columns: me.columns,
            change: function (e) {
                me.Events().onChange(e);
            },
            dataBound: function (e) {
                var curwrp = MSCJS.GetId(me.id) + " .pivwrp";
                if (me.comboBoxSetting.visible) {
                    $.each($(curwrp), function (i, v) {
                        me.comboBoxSetting.template(v)
                    })
                }
                else if (me.datePickerSetting.visible) {
                    if (me.datePickerSetting.isdatetime) {
                        $.each($(curwrp), function (i, v) {
                            me.datePickerSetting.datetimetemplate(v.id, v.value)
                        })
                    }
                    else {
                        $.each($(curwrp), function (i, v) {
                            me.datePickerSetting.datetemplate(v.id, v.value)
                        })
                    }
                }
                me.Events().onDataBound(e);
            },
            dataBinding: function (e) {
                me.Events().onDataBind(e);
            }
        }).data("kendoGrid");
    };

    this.GetGrid = (function () {
        return MSCJS.GetGrid(me.id);
    });

    this.NewDataSource = (function () {
        return new kendo.data.DataSource({
            data: me.GetGridData(),
            schema: {
                model: {
                    fields: me.columns
                }
            },
            pageSize: me.pageSize
        });
    });

    this.AddPrefixForName = (function (colname) {
        $.each(colname, function (i, v) {
            if (v.hasOwnProperty(me.headerFieldName) && !isNaN(v[me.headerFieldName].charAt(0))) {
                v[me.headerFieldName] = '_' + v[me.headerFieldName];
            }
        })
    });

    this.GridCallBackData = (function () {
        if (me.data.length > 0) {
            me.NewGrid();
        }
        else {
            Ajax.RequestManager().Enqueue({
                url: me.BuildUrl(me.controllerName, me.actionName),
                type: "GET",
                cache: false,
                success: function (data) {
                    me.data = data;
                    me.NewGrid();
                },
                error: function (xhr) {
                    alert('error');
                }
            });
        }
        //  me.data = datas;
        console.log('last log!!');
        console.table(me.data);

    });

    this.GroupData = (function (data) {
        var group = {};
        data.forEach(function (v) {
            if (!group[v[me.groupFieldName]]) {
                group[v[me.groupFieldName]] = [];
            }
            group[v[me.groupFieldName]].push(v);
        });
        return group;
    });

    this.GetGridData = (function () {
        //me.GridCallBackData();
        me.prevData = JSON.parse(JSON.stringify(me.data));
        var data = JSON.parse(JSON.stringify(me.data));
        me.AddPrefixForName(data);

        var transposed = [];
        $.each(me.GroupData(data), function (i, v) {
            if (typeof (i) !== "function") {
                var temp = {};
                temp[me.groupFieldName] = i;
                me.additionalField.split("|").forEach(function (s) {
                    temp[s] = v[0][s];
                });

                v.forEach(function (s) {
                    temp[s[me.headerFieldName]] = s[me.valueFieldName];
                });

                transposed.push(temp);
            }
        })
        me.columns = me.AddColumns(transposed);
        return transposed;
    });

    this.GetTemplate = (function (id, colname) {
        if (me.template && me.template.length > 0)
            return me.template;
        if (me.comboBoxSetting.visible)
            return me.comboBoxSetting.defaultTemplate(id, colname);
        if (me.datePickerSetting.visible)
            return me.datePickerSetting.defaultTemplate(id, colname);
        return me.textbox.defaultTemplate(id, colname);
    });

    this.AddColumns = (function (firstrowvalue) {
        var columns = [];
        var f = firstrowvalue;

        if (f) {

            firstrowvalue.forEach(function (arrayItem) {
                for (var fvcl in arrayItem) {
                    if (fvcl) {  
                        var columnDetail = {};
                        columnDetail["field"] = fvcl;
                        columnDetail["title"] = fvcl[0] === "_" ? fvcl.substring(1) : fvcl;
                        columnDetail["type"] = typeof (f[fvcl]);
                        if (fvcl !== me.groupFieldName && me.additionalField.indexOf(fvcl) < 0) {
                            columnDetail["template"] = me.GetTemplate('#=data.uid#_' + columnDetail["title"], fvcl);
                        }
                        var index = columns.findIndex(function (a) { return a.field === fvcl })

                        if (index < 0) {
                            columns.push(columnDetail);
                        }
                    }
                }
            });
        }
        return columns;
    });

    this.CreateUrl = (function () {
        return "/" + me.controllerName + "/" + me.actionName;
    });

    this.Events = (function () {
        var callfn = function (t, e) {
            MSCJS.Common.Helper.ExecuteMethod(me.id + t, [e]);
        };
        return {
            onChange: (function (e) {
                callfn("_Change", e);
            }),
            onDataBound: (function (e) {
                callfn("_DataBound", e);
            }),
            onDataBind: (function (e) {
                callfn("_DataBind", e);
            })
        }
    });

    this.Initialize = (function () {
        me.GridCallBackData();
    });

    this.BuildUrl = (function (controller, action) {
        return "/" + controller + "/" + action;
    });

    this.updateOrginalDataSource = (function () {
        me.changedData = [];
        me.GetGrid().dataSource.data().filter(function (v) { return v.dirty; }).forEach(function (v) {
            for (var cv in v) {
                if (typeof (v[cv]) !== 'function' && v.hasOwnProperty(cv)) {
                    if (cv !== me.groupFieldName) {
                        var ccv = cv[0] === "_" ? cv.substring(1) : cv;
                        var index = me.data.findIndex(function (flv) { return flv[me.groupFieldName] === v[me.groupFieldName] && flv[me.headerFieldName] === ccv });
                        if (index > -1) {
                            me.data[index][me.valueFieldName] = v[cv];
                            if (v[cv] != me.prevData[index][me.valueFieldName]) {
                                me.changedData.push(me.data[index]);
                            }
                        }
                    }
                }
            }
        });
    });

}
