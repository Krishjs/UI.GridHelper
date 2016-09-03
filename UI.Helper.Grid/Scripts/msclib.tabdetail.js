(function MSCJSLIB(w) {
    w.TabSetting = (function () {
        var createNewElement = function (tagname, cssclass, attr) {
            var tag = document.createElement(tagname);
            tag = $(tag);

            if (attr) {
                tag.attr(attr);
            }

            if (cssclass && cssclass.length > 0) {
                tag.addClass(cssclass);
            }
            return tag;
        };
        var getvalue = function (text, replacetext) {
            if (text && text.length > 0)
                return text;
            return replacetext;
        };
        return {
            constants: {
                common: {
                    row: "row",
                    colxs2: "col-xs-2",
                    colxs3: "col-xs-3",
                    colxs12: "col-xs-12",
                    colxs10: "col-xs-10",
                },
                tabSetting: {
                    cssclass: {
                        mainwrp: "gt-maintain-inner",
                        maindiv: "col-xs-12 margintop15",
                        mincnt: 'tabControlBkg boxFix',
                        list: 'tabTitlebkg',
                        selected: ' active currenttabheader',
                        ullist: 'nav nav-justified nav-arrowwizard nav-wizard',
                        icn: 'icon-info-outline',
                        icnfont: "font24 ",
                        navwedge: 'nav-wedge',
                        navarrow: 'nav-arrow',
                        title: "wiztitle",
                        step: "step",
                        currenttab: 'currenttab',
                        requesttab: 'requesttab',
                        contentcnt: 'col-xs-12 nopadding'
                    },
                    defaultValue: {
                        step: "Step ",   
                    }
                },
                contentSetting: {},
                footerSetting: {
                    cssclass: {
                        maindiv: "col-xs-12",
                        mainftdiv: "footerbooking",
                        title: "footertitle",
                        center: "centerborder"
                    },
                    leftfooter: {
                        icndivclass: "col-xs-2 margintop19",
                        icnclass: "icon-arrow-back wizarrow",
                        icnlblclass: "control-label footerwiz-label",
                        icnlbl: "PREV",
                        titleclass: "footerwiz-label2 font16 width100per footertitle",
                        lbldivclass: "col-xs-10 footerwiztext",
                        maindivclass: "col-xs-3 tabfooterleft"
                    },
                    rightfooter: {
                        icndivclass: "col-xs-2 margintop19 pull-right",
                        icnclass: "icon-arrow-forward wizarrow",
                        icnlblclass: "footerwiz-label  width100per text-right",
                        icnlbl: "NEXT",
                        titleclass: "footerwiz-label2 font16 text-right width100per footertitle",
                        lbldivclass: "col-xs-10 pull-right footerwiztext",
                        maindivclass: "col-xs-3 pull-right tabfooterright"
                    }
                }
            },
            wedgeTemplate: function () {
                return $("<div />").addClass(TabSetting.constants.tabSetting.cssclass.navwedge)
            },
            cntTemplate: function (name) {
                return $("<div />").addClass(TabSetting.constants.tabSetting.cssclass.mincnt).attr("id", name + "details")
            },
            navarrowTemplate: function () {
                return $("<div />").addClass(TabSetting.constants.tabSetting.cssclass.navarrow)
            },
            linktagTemplate: function () {
                return $("<li />").attr("href", "#").attr("data-toggle", "tab")
            },
            mainultag: function () {
                return $("<ul />").addClass(TabSetting.constants.tabSetting.cssclass.ullist);
            },
            stepTemplate: function (step, i) {
                return $("<div />").html(getvalue(step, TabSetting.constants.tabSetting.defaultValue.step + (i + 1))).addClass(TabSetting.constants.tabSetting.cssclass.step);
            },
            footerTemplate: function (name, isprev, clickAction, label) {
                var detail = isprev ? TabSetting.constants.footerSetting.leftfooter : TabSetting.constants.footerSetting.rightfooter;
                var row = createNewElement("div", detail.rowdivclass);
                var icndiv = createNewElement("div", detail.icndivclass).append(createNewElement("i", detail.icnclass))
                var icnlbl = createNewElement("label", detail.icnlblclass).text(detail.icnlbl);
                var scrname = createNewElement("label", detail.titleclass).text(label);
                var lbldiv = createNewElement("div", detail.lbldivclass).append(icnlbl).append(scrname);
                row.append(icndiv).append(lbldiv);
                //if (v.FooterAttributes) {
                //    $.each(v.FooterAttributes, function (j, k) { lt.attr(j, k); })
                //}
                return createNewElement("div", detail.maindivclass, { onclick: 'TabSetting.TabClick($("#' + clickAction + '"),"' + name + '")' }).append(row);
            },
            headerTemplate: function () {
                return $("<div />").addClass(TabSetting.constants.tabSetting.cssclass.maindiv)
            },
            iconTemplate: function (icn) {
                return createNewElement("i", TabSetting.constants.tabSetting.cssclass.icnfont + getvalue(icn, TabSetting.constants.tabSetting.cssclass.icn)); //$("<i />").addClass("font24 " + getvalue(icn, defaultIcon));
            },
            titleTemplate: function (title) {
                return $("<div />").text(title).addClass(TabSetting.constants.tabSetting.cssclass.title);
            },
            anchorTag: function (CanSelect) {
                return createNewElement("a", "", { "href": "#", "data-toggle": (CanSelect ? "tab" : "") });// $("<a />").attr("href", "#").attr("data-toggle", CanSelect ? "tab" : "");
            },
            linktag: function (i, name, cssclass) {
                var lt = createNewElement("li", getvalue(cssclass, TabSetting.constants.tabSetting.cssclass.list),
                    { "id": name, "data-tab-index": i, "data-tab-name": name });
                return lt;
            },
            HeaderTabDetailAndContainer: function (name, tabsetting) {
                var headerTag = TabSetting.mainultag();
                var contianer = $("<div />").addClass(TabSetting.constants.tabSetting.cssclass.contentcnt);
                tabsetting.forEach(function (v, i) {
                    var lt = TabSetting.linktag(i, v.Name, v.CssClass);
                    if (i > 0) {
                        lt.append(TabSetting.wedgeTemplate());
                    }

                    var anchor = TabSetting.anchorTag(v.CanSelect);
                    anchor.append(TabSetting.stepTemplate(v.StepLabel, i));
                    anchor.append(TabSetting.iconTemplate(v.IconCss));
                    anchor.append(TabSetting.titleTemplate(v.TitleLabel));
                    lt.append(anchor)
                    if (i !== tabsetting.length - 1) {
                        lt.append(TabSetting.navarrowTemplate())
                    }

                    lt.attr("onclick", "TabSetting.TabClick(this,'" + name + "')");
                    var cnt = TabSetting.cntTemplate(v.Name);
                    if (v.Content) {
                        cnt.append(v.Content);
                    }

                    if (v.IsSelected) {
                        lt.addClass(TabSetting.constants.tabSetting.cssclass.selected);
                        cnt.addClass(TabSetting.constants.tabSetting.cssclass.currenttab);
                    }
                    cnt[v.IsSelected ? 'show' : 'hide']();

                    if (v.CanSelect) {
                        lt.addClass(TabSetting.constants.tabSetting.cssclass.requesttab);
                    }

                    if (v.HeaderAttributes) {
                        $.each(v.HeaderAttributes, function (j, k) { lt.attr(j, k); })
                    }

                    headerTag.append(lt);

                    contianer.append(cnt);
                })
                var headerdiv = createNewElement("div", TabSetting.constants.tabSetting.cssclass.maindiv).append(headerTag);
                var data = createNewElement("div", TabSetting.constants.tabSetting.cssclass.mainwrp).append(headerdiv);

                return data.append(contianer);
            },
            CreateFooterTemplate: function (name, lefttabtitle, righttabtitle, lefttabname, righttabname) {
                var footer = createNewElement("div", TabSetting.constants.footerSetting.cssclass.mainftdiv);
                footer.append(TabSetting.footerTemplate(name, true, lefttabname, lefttabtitle)[lefttabname && lefttabname.length > 0 ? "show" : "hide"]());
                footer.append(createNewElement("div", TabSetting.constants.footerSetting.cssclass.center)[lefttabname && lefttabname.length > 0 && righttabname && righttabname.length > 0 ? "show" : "hide"]());
                footer.append(TabSetting.footerTemplate(name, false, righttabname, righttabtitle)[righttabname && righttabname.length > 0 ? "show" : "hide"]());
                return createNewElement("div", TabSetting.constants.footerSetting.cssclass.maindiv).append(footer);
            },
            createTab: function (name, tabsetting) {
                var data = TabSetting.HeaderTabDetailAndContainer(name, tabsetting);
                var s = tabsetting.findIndex(function (v, i) { return v.IsSelected === true });
                data.append(tabsetting.Footer && tabsetting.Footer.length > 0 ? tabsetting.Footer : TabSetting.CreateFooterTemplate(name, s > 0 ? tabsetting[s - 1].TitleLabel : "", s < tabsetting.length - 1 ? tabsetting[s + 1].TitleLabel : "", s > 0 ? tabsetting[s - 1].Name : "", s < tabsetting.length - 1 ? tabsetting[s + 1].Name : ""));
                $(MSCJS.GetId(name)).append(data);
                var sender = { id: name, wrapper: $(MSCJS.GetId(name)) }
                var event = { name: "load", wrapper: $(MSCJS.GetId(tabsetting[s].Name)), id: tabsetting[s].Name, index: s, prev: null }
                MSCJS.Common.Helper.ExecuteMethod(name + "_onLoad", [sender, event]);
            },
            TabClick: function (s, tabname, curtab) {
                var index = TabSetting.getIndex(s);
                var curid = TabSetting.getId(s);
                var prev;
                var ptab = [];
                var isvalid = true;
                var sender = { id: tabname, wrapper: $(MSCJS.GetId(tabname)) };
                ptab = document.getElementsByClassName(TabSetting.constants.tabSetting.cssclass.list + ' ' + TabSetting.constants.tabSetting.cssclass.selected);

                if (ptab.length > 0) {
                    prev = { index: TabSetting.getIndex(ptab[0]), id: TabSetting.getId(ptab[0]), wrapper: ptab[0] };
                }

                if (MSCJS.Common.Helper.CheckIfMethodExistFromName(tabname + "_Validate")) {
                    isvalid = MSCJS.Common.Helper.ExecuteMethod(tabname + "_Validate", [sender, { name: "BeforeClick", wrapper: s, id: curid, index: index, prev: prev, content: { id: curid + "details", wrapper: $(MSCJS.GetId(curid + "details")) } }]);
                }

                if (isvalid) {
                    if (!$(s).hasClass('currenttabheader')) {
                        var allowTab = $(s).hasClass(TabSetting.constants.tabSetting.cssclass.requesttab);
                        if (allowTab && !$(s).hasClass('inactivetab')) {
                            if (ptab.length > 0) {
                                $(ptab[0]).removeClass(TabSetting.constants.tabSetting.cssclass.selected);
                            }

                            $(s).addClass(TabSetting.constants.tabSetting.cssclass.selected);
                            $(MSCJS.GetClass(TabSetting.constants.tabSetting.cssclass.currenttab)).hide();
                            $(MSCJS.GetId(curid + "details")).show();
                            $(MSCJS.GetId(curid + "details")).addClass(TabSetting.constants.tabSetting.cssclass.currenttab);
                            TabSetting.updatedFooter(tabname, $(s).prev().find(MSCJS.GetClass(TabSetting.constants.tabSetting.cssclass.title)).text(), $(s).next().find(MSCJS.GetClass(TabSetting.constants.tabSetting.cssclass.title)).text(), $(s).prev().attr("id"), $(s).next().attr("id"))
                        }
                    }
                    MSCJS.Common.Helper.ExecuteMethod(tabname + "_onClick", [sender, { name: "click", wrapper: s, id: curid, index: index, prev: prev, content: { id: curid + "details", wrapper: $(MSCJS.GetId(curid + "details")) } }]);
                }
            },
            updatedFooter: function (name, lefttabtitle, righttabtitle, lefttabname, righttabname) {
                var rightfooter = $("#" + name + " .tabfooterright");
                var leftfooter = $("#" + name + " .tabfooterleft");
                $("#" + name).find(MSCJS.GetClass(TabSetting.constants.footerSetting.cssclass.center)).hide();
                leftfooter.show();
                rightfooter.show();

                if (righttabname && righttabname.length > 0) {
                    rightfooter.attr("onclick", 'TabSetting.TabClick($("#' + righttabname + '"),"' + name + '")');
                    rightfooter.find(MSCJS.GetClass(TabSetting.constants.footerSetting.cssclass.title)).text(righttabtitle);
                }
                else {
                    rightfooter.hide();
                }

                if (lefttabname && lefttabname.length > 0) {
                    leftfooter.attr("onclick", 'TabSetting.TabClick($("#' + lefttabname + '"),"' + name + '",this)');
                    leftfooter.find(MSCJS.GetClass(TabSetting.constants.footerSetting.cssclass.title)).text(lefttabtitle);
                    if (righttabname && righttabname.length > 0) {
                        $("#" + name).find(MSCJS.GetClass(TabSetting.constants.footerSetting.cssclass.center)).show();
                    }
                }
                else {
                    leftfooter.hide();
                }
            },
            updateStep: function (name, txt) {
                $(MSCJS.GetId(name)).find(MSCJS.GetClass(TabSetting.constants.tabSetting.cssclass.step)).html(txt);
            },
            updateTitle: function (name, txt) {
                $(MSCJS.GetId(name)).find(MSCJS.GetClass(TabSetting.constants.tabSetting.cssclass.title)).html(txt);
            },
            getId: function (s) {
                return $(s).attr("id");
            },
            getIndex: function (s) {
                return parseInt($(s).attr('data-tab-index'));
            },
        };
    })();
})(window);