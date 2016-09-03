﻿/*global window,alert*/
(function MSCJSLIB(w) {
	w.MSCJS = (function () {
		var clfn = function () {
			return (function (e, fn) { if (fn) { return MSCJS.Common.Helper.ExecuteMethod(fn, [e]); } });
		};
		var clwfn = function (fn) {
			return (function (e) { if (fn) { return MSCJS.Common.Helper.ExecuteMethod(e.sender.element.context.id + fn, [e]); } });
		};
		return {
			Element: function (id) {
				if (id) {
					var $id = $(this.MakeSelector(id));
					return $id;
				}
				return !1;
			},
			GetInstance: function (id) {
				if (id) {
					var $id = $(this.MakeSelector(id));
					if ($id && $id.length > 0) { return kendo.widgetInstance($id); }
				}
				return !1;
			},
			MakeSelector: function (id) {
				if (typeof (id) === 'string' && id[0] !== '#')
					id = '#' + id
				return id;
			},
			Grid: function (id) {
				var $g = this.GetGrid(id);
				return {
					Component: function () {
						return $g;
					},
					Data: function () {
						var me = this.Component();
						if (me) { return me.dataSource.data(); }
						return {};
					},
					DataSource: function () {
						var me = this.Component();
						if (me) { return me.dataSource; }
						return {};
					},
					SetDataSource: function (data) {
						var me = this.Component();
						if (me) { me.dataSource.data(data); }
					},
					Refresh: function () {
						var me = this.Component();
						if (me) { me.refresh(); }
					},
					ModifiedRows: function () {
						var records = [];
						if ($g.RemoveItems) { records = records.concat($g.RemoveItems); }
						records = records.concat($g.dataItems().filter(function (v) { return v.dirty; }));
						return records;
					},
					SyncParameter: function (p) {
						var param = {}, pname = 'toUpdateOrDelete';
						if (p) { param = p.params || {}; pname = p.name || 'toUpdateOrDelete'; }
						param[pname] = MSCJS.CreateObject(this.ModifiedRows());
						return param;
					},
					Sync: function (p) {
						grid.Read(this.SyncParameter(p));
					},
					Read: function (p) {
						var me = this.Component();
						if (me) { me.dataSource.read(p); return !0; }
						else { return !1; }
					},
					Filter: function (p) {
						$g.dataSource.filter(p);
					},
					AddDeleted: function (d) {
						if (!$g.RemoveItems) { $g.RemoveItems = []; }
						$g.RemoveItems.push(d);
					},
					IsServer: function () {
						return $g.dataSource.options.serverPaging
						&& $g.dataSource.options.serverSorting
						&& $g.dataSource.options.serverFiltering
						&& $g.dataSource.options.serverAggregates
						&& $g.dataSource.options.serverGrouping;
					}
				};
			},
			GetGrid: function (id) {
				return this.GetInstance(id);
			},
			GetComboBox: function (id) {
				return this.GetInstance(id);
			},
			GetDatePicker: function (id) {
				return this.GetInstance(id);
			},
			GetDateTimePicker: function (id) {
				return this.GetInstance(id);
			},
			GetWindow: function (id) {
				return this.GetInstance(id);
			},
			GetPopUp: function (id) {
				return {
					Component: function () {
						return MSCJS.GetInstance(MSCJS.GetId(id));
					},
					Title: function (t) {
						this.Component().title(t);
					},
					Center: function () {
						this.Component().center();
					},
					ShowCenter: function () {
						var me = this.Component();
						me.open();
						me.center();
					},
					Show: function () {
						this.Component().open();
					},
					Hide: function () {
						this.Component().close();
					}
				}
			},
			GetAutoComplete: function (id) {
				return {
					Component: function () {
						return $(MSCJS.GetId(id)).data('kendoAutoComplete')
					},
					SelectedItem: function () {
						var me = this.Component();
						if (me) { return me.dataItem(me.select()); }
						return {};
					}
				}
			},
			GetNumericTextBox: function (id) {
				return {
					Component: function () {
						return $(MSCJS.GetId(id)).data('kendoNumericTextBox')
					},
					Value: function (v) {
						var me = this.Component();
						if (me) {
							if (v) {
								me.value(v); return v;
							}
							return me.value();
						}
						return 0;
					}
				}
			},
			CustomDatePicker: function (id, name) {
				return {
					Component: function () {
						return $(MSCJS.GetId(id)).data(name)
					},
					Value: function (v) {
						if (v) { this.Component().value(v); }
						return this.Component().value();
					},
					MinDate: function (value) {
						value = value ? value : new Date(1000, 01, 01);
						this.Component() ? this.Component().min(value) : this.Component();
					},
					MaxDate: function (value) {
						value = value ? value : new Date(2099, 12, 31);
						this.Component() ? this.Component().max(value) : this.Component();
					},
				}
			},
			DatePicker: function (id) {
				return MSCJS.CustomDatePicker(id, "kendoDatePicker");
			},
			DateTimePicker: function (id) {
				return MSCJS.CustomDatePicker(id, "kendoDateTimePicker");
			},
			TimePicker: function (id) {
				return MSCJS.CustomDatePicker(id, "kendoTimePicker");
			},
			ComboBox: function (id) {
				return {
					Component: function () {
						return MSCJS.GetInstance(id);
					},
					Clear: function () {
						this.Component().value('');
						this.Component().text('');
						this.Component().dataSource.read();
						this.Component().trigger("change");
					},
					SelectedItem: function () {
						var me = this.Component();
						if (me) {
							if (me.dataItem()) {
								return me.dataItem();
							}
							var dataItem = {};
							dataItem[me.options.dataTextField] = me.text();
							dataItem[me.options.dataValueField] = me.value();
							return dataItem;
						}
						return {};
					},
					Set: function (v, t) {
						var me = this.Component();
						if (me.dataItems().length === 0) {
							var dataItem = {};
							dataItem[me.options.dataTextField] = me.text();
							dataItem[me.options.dataValueField] = me.value();
							me.dataSource.data([dataItem]);
						}
						this.Value(v);
						this.Text(t);
					},
					Value: function (v) {
						var me = this.Component();
						if (me) {
							if (v) { me.value(v); }
							return me.value();
						}
						return 0;
					},
					Enable: function (t) {
						this.Component().enable(t);
					},
					Text: function (v) {
						var me = this.Component();
						if (me) {
							if (v) { me.text(v); }
							return me.text();
						}
						return 0;
					},
					SetSelectedItem: function (item) {
						var me = this.Component();
						if (me) {
							var index = me.dataSource.add(item);
							me.select(index);
							return index;
						}
						return !1;
					},
					SetDataSource: function (data) {
						var me = this.Component();
						if (me) { me.dataSource.data(data); }
					},
				}
			},
			Toggle: function (id) {
				return {
					Checkbox: function () {
						return $("#cmn_toggle_" + id);
					},
					disable: function () {
						this.Checkbox().prop("disabled", true);
					},
					enable: function () {
						this.Checkbox().prop("disabled", false);
					},
					value: function (v) {
						if (v) {
							$(MSCJS.GetId(id)).val(v);
							this.Checkbox().prop("checked", v);
						}
						return $(MSCJS.GetId(id)).val();
					}
				}
			},
			GetId: function (id) {
				if (typeof (id) == 'string' && id[0] != '#')
					id = '#' + id
				return id;
			},
			GetClass: function (classname) {
				if (typeof (classname) == 'string' && classname[0] != '.')
					classname = '.' + classname
				return classname;
			},
			Custombehaviour: {
				canAllow: true,
				NumericTextBox: function () {
					$("[data-role=numerictextbox]").each(function () {
						var value = $(this).val();
						if (value == "0") {
							$(this).data("kendoNumericTextBox").value("")
						}
					})
				},
				DatePicker: function () {
					$("[data-role=datepicker]").not('.nocustombehave').each(function () {
						var value = $(this).val();
						if (value == "01-Jan-0001") {
							$(this).val(" ");
						}
					});
					$("[data-role=datepicker]").not('.nocustombehave').on("change", function (e) {
						var datePicker = $(e.currentTarget).data("kendoDatePicker");
						var currentDate = kendo.parseDate(datePicker.wrapper.context.value.trim(), datePicker.options.format);
						if (!currentDate || currentDate == "Invalid Date" || datePicker.wrapper.context.value.trim().length !== datePicker.options.format.length) {
							datePicker.wrapper.context.value = "";
						}
						else {
							if (datePicker.options.min && datePicker.options.max) {
								if (new Date(datePicker.wrapper.context.value) < new Date(datePicker.options.min).setHours(0, 0, 0, 0, 0) || new Date(datePicker.wrapper.context.value) > datePicker.options.max.setHours(0, 0, 0, 0, 0)) {
									datePicker.wrapper.context.value = "";
								}
							}
						}
					});
				},
				ComboBox: function () {
					$("[data-role=combobox]").not('.nocustombehave').on("focusout", function (e) {
						var combobox = $(e.currentTarget).data("kendoComboBox");
						if (combobox && (combobox.selectedIndex === 'undefined' || combobox.selectedIndex === -1) && combobox.text() !== combobox.options.text) {
							if (combobox.text) { combobox.text(''); }
							if (combobox.value) { combobox.value(''); }
							Validation.EventHandler.OnChange(e);
						}
					});
				},
				AcceptNumber: function () {
					$('.onlynumber [data-role="numerictextbox"]').not('.nocustombehave').each(function () {
						var data = $(this).data("kendoNumericTextBox");
						data.options.decimals = 0;
					});
					$('.onlynumber [data-role="numerictextbox"]').not('.nocustombehave').bind('input', function () {
						this.value = this.value.replace(/[^0-9]/g, '')
					});
				},
				Execute: function () {
					if (this.canAllow) {
						this.All();
					}
				},
				All: function () {
					this.AcceptNumber();
					this.ComboBox();
					this.DatePicker();
					this.NumericTextBox();
				}
			},
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
						dialog: 'windowwidth2',
						ButtonCtr: 'window-footer buttonctr pull-right',
						OkButtonClass: 'k-button mar10',
						CancelButtonClass: 'k-button hidden cancel mar10',
						MailButtonClass: 'k-button hidden mar10',
						IcnText: 'blue'
					}
				}
			},
			InvokeClient: function (entity, event, args, scope) {
				var s = scope ? scope : window;
				var rv = this.HTMLHelpers.ClientEvents[entity][event].apply(s, args);
				if (rv) { return rv; }
			},
			InvokeDetailclientFn: function (entity, event, args, scope) {
				var s = scope ? scope : window;
				var rv = this.HTMLHelpers.DetailGrid[entity][event].apply(s, args);
				if (rv) { return rv; }
			},
			Common: {
				Helper: {
					GetMethod: function (method) {
						if (typeof method === 'string') {
							if (method.indexOf('.') > -1) {
								return method.split(".").reduce(function (o, n) { return o[n]; }, window);
							}
							return w[method];
						}
						return method;
					},
					GetValue: function (d, prop) {
						if (typeof d === 'undefined') { return ''; }
						var _index = prop.indexOf('.');
						if (_index > -1) { return this.GetValue(d[prop.substring(0, _index)], prop.substr(_index + 1)); }
						return d[prop];
					},
					CheckIfMethodExist: function (m) {
						return (typeof m === 'function');
					},
					CheckIfArray: function (m) {
						return (m instanceof Array);
					},
					CheckIfMethodExistFromName: function (m) {
						return (typeof this.GetMethod(m) === 'function');
					},
					ExecuteMethod: function (method, args, scope, ou) {
						var self = this;
						if (!ou) { ou = []; }
						var fn = this.GetMethod(method);
						if (this.CheckIfMethodExist(fn)) {
							if (scope) { return fn.apply(scope, args); }
							ou["isExecuted"] = true;
							return fn.apply(w, args);
						}
						else if (this.CheckIfArray(fn)) {
							var response = {};
							fn.forEach(function (v, i) {
								$.extend(response, self.ExecuteMethod(v, args, scope, ou));
							});
							return response;
						}
						else { ou["isExecuted"] = false; }
					}
				},
				RemoveDate: function (p) {
					for (var k in p) {
						var d = p[k];
						if (p.hasOwnProperty(k)
							&& !(d instanceof Function)) {
							if (d instanceof Date) { p[k] = null; }
							else if (!d instanceof Object) { this.RemoveDate(d); }
						}
					}
				}
			},
			Message: {
				YesNoMessageBox: function (e, message, yesAction) {
					if ($("#msgBox").length !== 0) {
						$("#msgBox").remove();
					}
					var div = document.createElement("DIV");
					div.setAttribute('id', 'msgBox');

					$(div).appendTo("body");

					var ConformWindow = $(div).kendoWindow({
						title: "Confirm",
						resizable: false,
						width: 300,
						height: 100,
						modal: true
					});
					ConformWindow.data("kendoWindow").wrapper.addClass('windowwidth2');
					ConformWindow.data("kendoWindow")
						.content('<p class="clear-message">' + message + '</p>' +
									'<div class="window-footer buttonctr pull-right"><button class="clear-confirm k-button" onclick="' + yesAction + '()">Ok</button>' +
									'<button class="clear-cancel k-button">Cancel</button></div>')
						.center().open();
					ConformWindow.find(".clear-confirm,.clear-cancel")
						.click(function () {
							ConformWindow.data("kendoWindow").close();
						}).end()
				},
				MessageBox: function (title, message) {
					if ($("#msgBox").length !== 0) { $("#msgBox").remove(); }
					var div = document.createElement("DIV");
					div.setAttribute('id', 'msgBox');
					$(div).appendTo("body");
					var ConformWindow = $(div).kendoWindow({
						title: title || 'Message',
						resizable: false,
						width: 300,
						height: 100,
						modal: true
					});
					var binders = [];
					var content = '<p class="clear-message">' + message + '</p><div class="window-footer buttonctr pull-right">', i = 2;
					for (; i < arguments.length; i++) {
						var arg = arguments[i];
						if (arg && typeof (arg) === typeof ({})) {
							var btn = document.createElement("button");
							btn.className = arg.css || (!arg.isClose ? 'clear-confirm' : 'clear-cancel');
							btn.className += ' k-button'
							btn.textContent = arg.text || 'OK';
							btn.type = 'button';
							btn.id = arg.text + '_btn_info';
							content += btn.outerHTML;
							binders.push({
								id: '#' + btn.id,
								fn: function () {
									if (arg.action) {
										arg.isClose = arg.action(ConformWindow);
									}
									if (arg.isClose) {
										ConformWindow.data("kendoWindow").close();
									}
								}
							});
						}
						content += '</div>';
					};
					ConformWindow.data("kendoWindow").wrapper.addClass('windowwidth2');
					ConformWindow.data("kendoWindow")
						.content(content)
						.center().open();
					ConformWindow.find(".clear-confirm,.clear-cancel")
						.click(function () {
							ConformWindow.data("kendoWindow").close();
						}).end()
					binders.forEach(function (v) { $(v.id).click(v.fn); })
				},
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
			CreateObject: function (d) {
				return JSON.parse(JSON.stringify(d));
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
							if (s.sender && s.sender.selectedIndex > -1) {
								var displayFields = displayname ? displayname.split("|").trim() : [];
								// displayFields = displayFields.trim();
								var selectedItems = s.sender.dataSource._data[s.sender.selectedIndex];
								var currentId, currentName, html = "", currentHtml;
								if (displayFields.indexOf(s.sender.options.dataTextField) < 0) {
									displayFields.push(s.sender.options.dataTextField);
								}
								if (selectedItems && displayFields) {
									s.sender.element.parent().find('.k-input').attr('title', MSCJS.Common.Helper.GetValue(selectedItems, s.sender.options.dataTextField));
									var model = {};
									for (var i = 0; i < displayFields.length; i++) {
										if (s.sender.options.dataValueField.trim() != displayFields[i].trim()) {
											currentId = prefix + "." + displayFields[i].trim();
											currentId = currentId.replace(/\./g, '_');
											currentHtml = $("#" + currentId);
											if (currentHtml.length) {
												currentHtml.val(MSCJS.Common.Helper.GetValue(selectedItems, displayFields[i]));
											}
											else {
												html += "<input type=\"hidden\" name=\"" + currentId.replace(/\_/g, '.') + "\" value=\"" + MSCJS.Common.Helper.GetValue(selectedItems, displayFields[i]) + "\" >";
											}
										}
									}
									if ($("#" + s.sender.element[0].id + "spn").length > 0 && html) {
										$("#" + s.sender.element[0].id + "spn")[0].innerHTML = html;
									}
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
							if (s.sender.dataSource && s.sender.dataSource._total <= 0) {
								s.preventDefault();
							}
							if (s.sender.options.minLength > 0) {
								if (s.sender.dataSource.filter() && s.sender.dataSource.filter().filters[0] && s.sender.dataSource.filter().filters[0].value) {
									if (s.sender.options.minLength > s.sender.dataSource.filter().filters[0].value.length) {
										s.preventDefault();
									}
								}
								else {
									s.preventDefault();
								}
							}
							MSCJS.Common.Helper.ExecuteMethod(clientFn, [s]);
						}),
						OnClose: clfn(),
						FormatValue: function (comboxSetting, text) {
						},
						OnDataBound: (function (s, clientFn) {
							if (s.sender.list.children() && s.sender.list.children().length > 1 && s.sender.list.children()[1] && s.sender.list.children()[1].children.length > 1) {
								if (s.sender.dataSource.total() > 5) {
									s.sender.list.height("170px");
									s.sender.list.children()[1].children[1].style.height = "133px";
								}
								else {
									s.sender.list.height("");
									s.sender.list.children()[1].children[1].style.height = "";
								}
							}
							$(s.sender.items()).each(function (index, item) {
								$(item).attr("title", item.textContent);
							});
							$.each($("#" + s.sender.wrapper.context.id + "-list .widgetItem"), function (e) {
								var innerValue = this.innerHTML;
								innerValue = innerValue.replace(/<\/?span[^>]*>/g, "");
								var filterText = "";
								if (s.sender.dataSource.filter() && s.sender.dataSource.filter().filters[0] && s.sender.dataSource.filter().filters[0].value)
									filterText = s.sender.dataSource.filter().filters[0].value;
								var textMatcher = new RegExp(filterText, "ig");
								var innerValue = innerValue.replace(textMatcher, function (match) {
									return '<span class="fontbold">' + match + '</span>';
								});
								this.innerHTML = innerValue
							})
							MSCJS.Common.Helper.ExecuteMethod(clientFn, [s]);
						}),
						OnFiltering: clfn(),
					},
					DatePicker: {
						open: function (e) {
							MSCJS.Common.Helper.ExecuteMethod(e.sender.element.context.id + '_Open', [e]);
						},
						close: function (e) {
							MSCJS.Common.Helper.ExecuteMethod(e.sender.element.context.id + '_Close', [e]);
						},
						change: function (e) {
							MSCJS.Common.Helper.ExecuteMethod(e.sender.element.context.id + '_Change', [e]);
						}
					},
					TimePicker: {
						open: function (e) {
							MSCJS.Common.Helper.ExecuteMethod(e.sender.element.context.id + '_Open', [e]);
						},
						close: function (e) {
							MSCJS.Common.Helper.ExecuteMethod(e.sender.element.context.id + '_Close', [e]);
						},
						change: function (e) {
							MSCJS.Common.Helper.ExecuteMethod(e.sender.element.context.id + '_Change', [e]);
						}
					},
					Grid: {
						Arrow: {
							GetOptions: function (p) {
								return {
									Edit: p.edit || 'icon-arrow-left3',
									Normal: p.normal || 'icon-arrow-right3',
									Slidein: p.slidein || 'col-xs-3 narrow',
									Slideout: p.slideout || 'col-xs-12'
								};
							}
						},
						FilterToggle: (function (s) {
							$('#' + s + ' .k-filter-row').toggle();
							var datepicker = $('#' + s + ' .k-filter-row .k-filtercell .k-datepicker .k-input');
							$.each(datepicker, function (i, v) {
								var dateTimePicker = $(v).data("kendoDatePicker");
								var currentFormat = DefaultFormat.GetDate();
								dateTimePicker.options.format = currentFormat
								dateTimePicker.options.parseFormats.push(currentFormat)
							});
							return false;
						}),
						Init: (function (s, isExcel, b, isReadOnly, hasEditKey, idProperty) {
							$('#' + s + ' .k-filter-row').toggle();
							var datepicker = $('#' + s + ' .k-filter-row .k-filtercell .k-datepicker .k-input');
							$.each(datepicker, function (i, v) {
								var dateTimePicker = $(v).data("kendoDatePicker");
								var currentFormat = DefaultFormat.GetDate();
								dateTimePicker.options.format = currentFormat
								dateTimePicker.options.parseFormats.push(currentFormat)
							});
							if (isExcel) {
								this.ExcelMode.Init(s, b, isReadOnly, hasEditKey, idProperty);
							}
							return false;
						}),
						ExcelMode: {
							Init: (function (s, b, isReadOnly, hasEditKey, idProperty) {
								var self = this;
								window['Excel_' + s + "_OnCallBack"] = function (args, parms) { return self.CallBack(s, b, args, parms); };
								window['Excel_' + s + "_DataBound"] = function (args) { self.Activate(s, b, args, isReadOnly, hasEditKey, idProperty); };
							}),
							Event: function (e, s, id, fn, i) {
								var response = MSCJS.Common.Helper.ExecuteMethod(fn, [{ event: e, grid: s, id: id, index: i }]);
								if (response !== undefined) { return response; }
							},
							AddNewRecord: function (s, param) {
								param['mode'] = 'A';
								var grid = MSCJS.Grid(s);
								if (grid.IsServer()) { grid.Read(param); }
								else {
									var data = grid.DataSource().insert(0, {});
									MSCJS.Common.RemoveDate(data);
									var view = grid.Component().tbody.find(">tr:first");
									data.dirty = !0;
									kendo.bind($(view), data);
									MSCJS.Common.Helper.ExecuteMethod(s + '_OnAddNew', [data]);
								}
							},
							Activate: function (s, b, args, isReadOnly, hasEditKey, idProperty) {
								var self = this;
								if (!args.sender.Excel) {
									args.sender.Excel = new onv.grid.Excel({ grid: s, button: b, hasEditKey: hasEditKey, isReadOnly: isReadOnly, idProperty: idProperty });
								}
								var getAttr = function ($s, at, dv) {
									return $s.is('[' + at + ']') ? $s.attr(at) : dv;
								};
								var getBooleanAttr = function ($s, at, dv) {
									if ($s.is('[' + at + ']')) { return $s.attr(at) === "true" ? !0 : !1; }
									return dv;
								};
								$.each($('#' + s + ' .editor-datepicker'), function (i, v) {
									var id = $(v).attr('id');
									$(v).kendoDatePicker({
										"change": function (e) {
											MSCJS.InvokeClient('DatePicker', 'change', [e, id + '_Change'], undefined);
										},
										"open": function (e) {
											MSCJS.InvokeClient('DatePicker', 'open', [e, id + '_Open'], undefined);
										},
										"close": function (e) { MSCJS.InvokeClient('DatePicker', 'close', [e, id + '_Close'], undefined); },
										"format": "dd-MMM-yyyy",
										"min": new Date(1, 0, 1, 0, 0, 0, 0),
										"max": new Date(9999, 11, 31, 23, 59, 59, 999),
										"depth": "year",
										"start": "month"
									});
								});
								$.each($('#' + s + ' .editor-combobox'), function (i, v) {
									var $v = $(v);
									var id = $v.attr('id');
									var autoBind = getBooleanAttr($v, 'data-auto-bind', false);
									var custom = getBooleanAttr($v, 'data-custom-bind', true);
									var local = getBooleanAttr($v, 'data-local-data', false);
									var settings = {
										"change": function (e) {
											MSCJS.InvokeClient('ComboBox', 'OnComboBoxChange', [e, id + '_Change', '', ''], undefined);
										},
										"select": function (e) {
											MSCJS.InvokeClient('ComboBox', 'OnSelect', [e, id + '_Select'], undefined);
										},
										"open": function (e) {
											MSCJS.InvokeClient('ComboBox', 'OnOpen', [e, id + '_Open', ''], undefined);
										},
										"close": function (e) {
											MSCJS.InvokeClient('ComboBox', 'OnClose', [e, id + '_Close'], undefined);
										},
										"dataBound": function (e) {
											MSCJS.InvokeClient('ComboBox', 'OnDataBound', [e, id + '_DataBound'], undefined);
										},
										"filtering": function (e) {
											MSCJS.InvokeClient('ComboBox', 'OnFiltering', [e, id + '_Filtering'], undefined);
										},
										"dataTextField": $(v).attr('data-text-field'),
										"dataValueField": $(v).attr('data-value-field'),
										"filter": "startswith",
										"height": 187,
										"minLength": 0,
										"virtual": {
											"valueMapper":
												function (options) {
													options.success(-1);
												},
											"itemHeight": 25
										},
										"autoBind": autoBind
									};
									if (!local) {
										settings["dataSource"] = {
											"type": "aspnetmvc-ajax",
											"transport": {
												"read": {
													"url": $(v).attr('url'),
													"data": function (e) { MSCJS.HTMLHelpers.ClientEvents.Grid.ExcelMode.Event(e, s, id, $v.attr('data-callback'), i); }
												}
											},
											"pageSize": 30,
											"page": 0,
											"total": 0,
											"serverPaging": custom,
											"serverFiltering": custom,
											"filter": [],
											"schema": { "data": "Data", "total": "Total" }
										};
									}
									var template = getAttr($v, 'data-template', false);
									if (template) { settings.template = template; };
									$(v).kendoComboBox(settings);
								});
								$.each($('#' + s + ' .editor-multiselect'), function (i, v) {
									var $v = $(v);
									var id = $v.attr('id');
									var autoBind = getBooleanAttr($v, 'data-auto-bind', false);
									var custom = getBooleanAttr($v, 'data-custom-bind', true);
									var local = getBooleanAttr($v, 'data-local-data', false);
									var settings = {
										"change": function (e) { MSCJS.InvokeClient('MultiSelect', 'OnChange', [e, id + '_Change'], ''); },
										"select": function (e) { MSCJS.InvokeClient('MultiSelect', 'OnSelect', [e, id + '_Select'], undefined); },
										"open": function (e) { MSCJS.InvokeClient('MultiSelect', 'OnOpen', [e, id + '_Open', ''], undefined); },
										"close": function (e) { MSCJS.InvokeClient('MultiSelect', 'OnClose', [e, id + '_Close'], undefined); },
										"dataBound": function (e) { MSCJS.InvokeClient('MultiSelect', 'OnDataBound', [e, id + '_DataBound'], undefined); },
										"filtering": function (e) { MSCJS.InvokeClient('MultiSelect', 'OnFiltering', [e, id + '_Filtering'], undefined); },
										"dataTextField": $(v).attr('data-text-field'),
										"dataValueField": $(v).attr('data-value-field'),
										"filter": "startswith",
										"height": 187,
										"headerTemplate": "<div class=\"dropdown-header\" />",
										"minLength": 0,
										"autoBind": autoBind
									};
									if (!local) {
										settings["dataSource"] = {
											"type": "aspnetmvc-ajax",
											"transport": {
												"read": {
													"url": $(v).attr('url'),
													"data": function (e) { MSCJS.HTMLHelpers.ClientEvents.Grid.ExcelMode.Event(e, s, id, $v.attr('data-callback'), i); }
												}
											},
											"pageSize": 30,
											"page": 0,
											"total": 0,
											"serverPaging": custom,
											"serverFiltering": custom,
											"filter": [],
											"schema": { "data": "Data", "total": "Total" }
										};
									}
									var template = getAttr($v, 'data-template', false);
									if (template) { settings.template = template; };
									$(v).kendoMultiSelect(settings);
								});
								$.each($('#' + s + ' .editor-numeric'), function (i, v) {
									var $v = $(v);
									var id = $v.attr('id');
									var spinner = getBooleanAttr($v, 'data-spinner', true);
									var format = getAttr($v, 'data-format', '#');
									var decimals = getAttr($v, 'data-decimals', '0');
									$v.kendoNumericTextBox({
										"change": function (e) {
											MSCJS.InvokeClient('NumericTextBox', 'OnChange', [e, id + '_OnChange'], undefined);
										},
										"spin": function (e) {
											MSCJS.InvokeClient('NumericTextBox', 'OnSpin', [e, id + '_OnSpin'], undefined);
										},
										"format": format,
										"decimals": parseInt(decimals),
										"spinners": spinner
									});
								});
								$('#' + s + ' .non-edit-mode')[(isReadOnly || hasEditKey) ? 'show' : 'hide']();
								$('#' + s + ' .edit-mode')[(!isReadOnly && !hasEditKey) ? 'show' : 'hide']();
								var gridRows = args.sender.tbody.find("tr");
								gridRows.each(function (index, view) {
									var rowData = args.sender.dataItem(view);
									if (rowData.isEdit) {
										$(view).find('.non-edit-mode').hide();
										$(view).find('.edit-mode').show();
										$(view).find('.mode-query').hide();
										$(view).find('.mode-edit').show();
									}
									kendo.bind($(view), rowData);
								});
								var button = MSCJS.GetInstance(b);
								if (button) {
									button.unbind('click').bind('click', function (e) {
										e.preventDefault();
										var param = {};
										var grid = MSCJS.Grid(s);
										param[this.wrapper.attr('data-parameter')] = MSCJS.CreateObject(grid.ModifiedRows());
										grid.Component().Excel.AddNew(param);
									});
								}
							},
							CallBack: function (s, b, args, p) {
								var eg = MSCJS.Grid(s);
								var param = {};
								var button = MSCJS.GetInstance(b);
								if (button && button.wrapper) {
									var nm = button.wrapper.attr('data-parameter');
									if (nm) { param['name'] = button.wrapper.attr('data-parameter'); }
								}
								if (p) { param['params'] = p }
								return eg.SyncParameter(param);
							},
						},
						OnArrow: function (b, p) {
							var opt = this.Arrow.GetOptions(p);
							var $gH = MSCJS.Element(p.gridBox);
							var $pH = MSCJS.Element(p.peek);
							var showView = $(b).hasClass(opt.Edit) || $(b).children().hasClass(opt.Edit);
							$gH[showView ? 'addClass' : 'removeClass'](opt.Slidein);
							if (showView) { $gH.find(opt.Edit).removeClass(opt.Edit).addClass(opt.Normal); }
							$(b).children()[showView ? 'addClass' : 'removeClass'](opt.Edit);
							$(b).children()[!showView ? 'addClass' : 'removeClass'](opt.Normal);
							var i = p.columnIndex;
							var crgrid = MSCJS.GetGrid(p.grid);
							for (; i < crgrid.columns.length - 1;) { crgrid[showView ? 'hideColumn' : 'showColumn'](i++); }
							$pH[showView ? 'show' : 'hide']();
							if (!showView) { $gH.find('table').css('width', '100%'); }
							MSCJS.Common.Helper.ExecuteMethod(P.event, [crgrid.dataSource.getByUid($(b).closest("tr").attr("data-uid")), $pH]);
						},
						DetailIcon: function (gridid, gridcnt, cnt, column, fn) {
							var span = $("<span></span>").addClass("text-center show slideicon");
							var fnname = 'MSCJS.HTMLHelpers.ClientEvents.Grid.DetailIconClick(this,"' + gridid + '","' + gridcnt + '","' + cnt + '","' + column + '","' + fn + '")';
							span.attr("onclick", fnname);
							span.append($("<i></i>").addClass("icon-keyboard-arrow-right arrow-font"));
							return span.get(0).outerHTML;
						},
						DetailIconClick: function (s, gid, gcid, cid, cl, fn) {
							var rightcss = "icon-keyboard-arrow-right";
							var leftcss = "icon-keyboard-arrow-left";
							var grid = MSCJS.GetGrid(gid);
							var column = [];
							var showWrapper;

							gcid = MSCJS.GetId(gcid);
							cid = MSCJS.GetId(cid);

							if (typeof cl !== "undefined") {
								column = cl.split("|");
							}
							if (s) {
								if ($(s.children).hasClass(rightcss)) {
									if (!$(gcid).hasClass("narrow")) {
										showWrapper = true;
									}
									$(gcid + " [role='gridcell'] .slideicon " + MSCJS.GetClass(leftcss)).toggleClass(leftcss + " " + rightcss);
									$(s.children).toggleClass(rightcss + " " + leftcss)
								}
								else {
									showWrapper = false;
									$(s.children).toggleClass(leftcss + " " + rightcss);
								}
							}
							else {
								if (!$(gcid).hasClass("narrow")) {
									showWrapper = true;
								}
							}

							if (typeof showWrapper !== "undefined") {
								$(gcid).toggleClass("narrow");
								$(cid).toggle();
								$(gcid).toggleClass("col-xs-3 nopadding");
								$.each(column, function (i, v) {
									grid[showWrapper ? "hideColumn" : "showColumn"](v);
								})

								if (showWrapper) {
									var container = grid.wrapper.children(".k-grid-content");
									container.scrollLeft(grid.scrollables[0].scrollWidth);
									$(".k-grid-pager .k-label").attr("style", "display: none !important;")
								}
								else {
									$(".k-grid-pager .k-label").removeAttr("style")
									$(MSCJS.GetId(gid) + ' table[role="grid"]').removeAttr("style");
								}
							}
							MSCJS.Common.Helper.ExecuteMethod(fn, [grid.dataSource.getByUid($(s).closest("tr").attr("data-uid")), showWrapper]);
						},
						ExcelExport: (function (e) {
							var sheet = e.workbook.sheets[0];
							for (var rowIndex = 1; rowIndex < sheet.rows.length; rowIndex++) {
								var row = sheet.rows[rowIndex];
								for (var cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
									if ($.type(row.cells[cellIndex].value) === $.type(new Date())) {
										year = row.cells[cellIndex].value.getFullYear();
										if (year != "0001") {
											row.cells[cellIndex].format = "dd-MMM-yyyy"
										}
										else {
											row.cells[cellIndex].value = "";
										}
									}
								}
							}
						}),
						CSVExport: (function (gn) {
							var gridSetting = MSCJS.GetGrid(gn);
							var dataSource = $.extend({}, gridSetting.dataSource);
							dataSource.pageSize(dataSource.total());
							dataSource.fetch(function () {
								var data = dataSource.data();
								var Columns = gridSetting.columns;
								//start with the desired column headers here.
								var result = "";
								$.each(Columns, function (i, v) {
									if (v != null) {
										result += MSCJS.Message.Format("\"{0}\",", v.title);
									}
								})
								//each column will need to be called using the field name in the data source.
								for (var i = 0; i < data.length; i++) {
									result += "\n";
									for (var j = 0; j < Columns.length; j++) {
										var ColumnName = Columns[j].field;
										if (ColumnName != null) {
											var str = "data[i]." + ColumnName;
											var stringTojs = eval(str);
											if ($.type(stringTojs) === $.type(new Date())) {
												year = stringTojs.getFullYear();
												if (year != "0001") {
													result += MSCJS.Message.Format("\"{0}\",", kendo.toString(new Date(stringTojs), Columns[j].format.length > 0 ? Columns[j].format : "dd/MM/yyyy"));
												}
												else {
													result += "\"\",";
												}
											}
											else {
												result += MSCJS.Message.Format("\"{0}\",", stringTojs);
											}
										}
									}
								}
								result = result.substring(0, result.length - 1);

								var FileName = gn + ".csv";
								if (window.navigator.msSaveBlob) { //Internet Explorer
									window.navigator.msSaveBlob(new Blob([result]), FileName);
								}
								else {
									var a = document.createElement('a');
									result = encodeURIComponent(result);
									a.href = 'data:application/csv;charset=UTF-8,' + result;
									a.download = FileName;
									if (window.webkitURL != null) { //Google Chrome and Mozilla Firefox
										a.click();
									}
									else {
										document.body.appendChild(a);
										a.click();
										document.body.removeChild(a);
									}
								}

							})
						}),
						OnGridEdit: (function (e) {
							var cmb = e.container.find('[data-role="combobox"]').data('kendoComboBox');
							if (cmb) {
								cmb.bind("change", function (evt) {
									var property = e.container.find('[asp_property]').attr('asp_property');
									e.model.set(property, cmb.dataItem(this.select()));
								});
							}
						}),
						OnCallBack: function (s, clientfn) {
							var out = {};
							var response = MSCJS.Common.Helper.ExecuteMethod(clientfn, [s], undefined, out);
							if (!out.isExecuted) { return MSCJS.Common.Helper.ExecuteMethod('Excel_' + clientfn, [s, response]); }
							if (response !== undefined) { return response; }
						},
						OnGridDataBind: function (s, clientFn) {
							var gridName = s.sender.element[0].id;
							$('#' + gridName + ' .k-filter-row').hide();
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
							MSCJS.Common.Helper.ExecuteMethod('Excel_' + clientfn, [s]);
							s.sender.tbody.closest("div").css({ overflow: 'auto' });
							if (s.sender.dataSource._total === 0) {
								s.sender.tbody.html("<td class='norecord' colspan='" + s.sender.columns.length + "'>No records found.</td>");
								s.sender.tbody.closest("div").css({ overflow: 'hidden' });
							}
							s.sender.options.pdf.allPages = true;
						},
						OnGridChangeEvent: function (s, clientFn, handle, key) {
							var out = [];
							MSCJS.Common.Helper.ExecuteMethod(clientFn, [s], undefined, out);
							key = key || 'Id';
							if (!out.isExecuted && handle) {
								var gridName = s.sender.element[0].id;
								if ($("#" + gridName + "Toolbar").length === 0) {
									var item = s.sender.dataItem(s.sender.select());
									if (item) {
										Ajax.RequestManager().Enqueue({
											url: UrlHelper.Action('GetData') + '?id=' + item[key],
											type: "GET",
											cache: false,
											success: function (data) {
												TransactionButton(false, false, true, true, false, false);
												gridProperties.isQuery = true;
												$('#container').html(data);
											},
											error: function (data) {
												gridProperties.isQuery = false;
											}
										});
									}
								}
							}
						},
						FormatCell: function (data, length, text, istitle) {
							text = text ? text : "...";
							length = length ? length : 10;
							var value = data.length > length + text.length ? data.substring(0, length) + text : data;
							return MSCJS.Message.Format("<span {0}>{1}</span>", istitle ? "title='" + data + "'" : "", value);
						},
						ColumnFormat: function (value, data, format) {
							var currentValue = kendo.toString(data[value], format);
							if (currentValue == '01-Jan-0001') {
								return '';
							}
							return currentValue;
						},
						InitSelectionMode: function (g) {
							if (!g.Selection) {
								g.Selection = function () {
									var selectedRows = [];
									var selectedItems = [];
									var isSelectAll = false;
									return {
										SetSelectAll: function (f) {
											isSelectAll = f;
											if (g) {
												var id = "Id";
												$.each(g.dataSource.data(), function (i, v) {
													var itemindex = selectedItems.findIndex(function (iv) { return iv[id] == v[id]; });
													if (itemindex == -1 && f) {
														selectedItems.push(v);
														selectedRows.push(v[id]);
													}
													if (itemindex > -1 && !f) {
														selectedItems.splice(itemindex, 1);
														selectedRows.splice(itemindex, 1);
													}
												})
											}
										},
										Select: function (v, d, k) {
											selectedRows.push(v);
											selectedItems.push(d);
										},
										Deselect: function (v, d, k) {
											isSelectAll = false;
											$('#' + g.element[0].id + '_SelectAll').prop('checked', false);
											var index = selectedRows.findIndex(function (r) { return r == v });
											if (index > -1) { selectedRows.splice(index, 1); }
											var itemindex = selectedItems.findIndex(function (iv) { return iv[k] == v; });
											if (itemindex > -1) { selectedItems.splice(itemindex, 1); }
										},
										GetSelected: function () {
											return {
												IsSelectAll: isSelectAll,
												Items: selectedRows
											};
										},
										GetSelectedKeys: function () {
											return selectedRows;
										},
										GetSelectedItems: function () {
											return selectedItems;
										},
										IsSelected: function (r) {
											return selectedRows.findIndex(function (v) { return r == v }) > -1;
										},
										Reset: function () {
											isSelectAll = false;
											selectedRows = [];
											selectedItems = [];
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
									if (!v.checked) { v.checked = s.Selection.IsSelected(key); }
								});
							}
							if (cbAll && cbAll.checked) { MSCJS.HTMLHelpers.ClientEvents.Grid.OnSelectAll(cbAll, gn); }
						},
						SelectCheckBox: function (scb, gn, v, k) {
							var grid = $('#' + gn).data('kendoGrid');
							var items = grid.dataSource.data();
							if (!k) { if (grid.idProperty.length > 0) { k = grid.idProperty; } else { k = 'Id'; } }
							grid.Selection[scb.checked ? 'Select' : 'Deselect'](v, items.find(function (vi) { return vi[k] == v; }), k);
							MSCJS.Common.Helper.ExecuteMethod(gn + '_SelectCheckBox', [scb, grid, v]);
						},
						OnSelectAll: function (me, gn) {
							var grid = $('#' + gn).data('kendoGrid');
							$.each($('.' + gn + '_cb'), function (i, v) { v.checked = me.checked; });
							if (!me.checked) { grid.Selection.Reset(); }
							grid.Selection.SetSelectAll(me.checked);
							MSCJS.Common.Helper.ExecuteMethod(gn + '_SelectAll', [me, grid]);
						}
					},
					MultiSelect: {
						OnChange: clfn(),
						OnSelect: clfn(),
						OnOpen: (function (s, clientFn, dropdownvalue) {
							//Used to set the dropdown Width of Combobox
							if (dropdownvalue) {
								s.sender.list.width(dropdownvalue);
							}
							if (s.sender.dataSource && s.sender.dataSource._total <= 0) {
								s.preventDefault();
							}
							MSCJS.Common.Helper.ExecuteMethod(clientFn, [s]);
						}),
						OnClose: clfn(),
						ValueMapper: clfn(),
						OnDataBound: clfn(),
						OnFiltering: clfn()
					},
					DetailGrid: {
						AddDetail: function (gname) {
							if (!gridProperties.IsButtonEnable(gname, gridProperties.Newcss) || !gridProperties.IsButtonEnable(gname, gridProperties.Clearcss)) {
								Ajax.RequestManager().Enqueue({
									url: UrlHelper.Action('AddDetail') + '?key=' + gname + '&id=' + 0,
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
									}
								});
							}
						},
						CloseDetail: function (gname) {
							if (!gridProperties.IsButtonEnable(gname, gridProperties.Closecss)) {
								gridProperties.HideGridContainer(gname);
								if (gridProperties.isQuery) {
									gridProperties.GridButtonEnable(gname, false, false, false, false, false, false);
								}
								else {
									gridProperties.GridButtonEnable(gname, true, false, true, true, false, false);
								}
							}
						},
						EditDetail: function (gname, IdProperty) {
							if (!gridProperties.IsButtonEnable(gname, gridProperties.Editcss)) {
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
											gridProperties.GridButtonEnable(gname, false, true, false, false, false, true);
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
							}
						},
						ValidateGrid: function (mndv) {
							mndv = MSCJS.GetId(mndv);
							var data = $(mndv + " .DetailGridToolbar");
							var message = "";
							if (data && data.length > 0) {
								$.each(data, function (i, n) {
									var currentId = $(n).attr("id").replace("Toolbar", "");
									if ($("#" + currentId + "ctr").html())
										message += "Save or Cancel the " + currentId + "! <br />";
								})
							}
							return message;
						},
						SaveDetail: function (gname) {
							if (!gridProperties.IsButtonEnable(gname, gridProperties.Savecss)) {
								var grid = MSCJS.GetGrid(gname);
								var message = Validation.IsValid({ ContainerId: (gname + "ctr") });
								checkForValidation = function () {
									var fn = window[gname + '_Validation']
									if (fn && typeof (fn) == 'function') { message += fn(grid); }
									if (message === '') { return true; }
									else { return false; }
								};

								if (checkForValidation()) {
									Ajax.RequestManager().Enqueue({
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
											else {
												MSCJS.Message.ShowError("Error", data.message);
											}
										},
										error: function (data) {
											if (e.responseText.indexOf("\"type\":\"E\"") > 0) {
												var error = $.parseJSON(e.responseText);
												MSCJS.Message.ShowMessage(error.type, error.title, error.message, error.innerMessage, error.stackTrace);//TODO SHOW ERROR WITH INNER MESSAGE
											}
										}
									});
								}
								else {
									MSCJS.Message.ShowError("Error", message);
								};
							}
						},
						DeleteDetail: function (gname, IdProperty) {
							if (!gridProperties.IsButtonEnable(gname, gridProperties.Deletecss)) {
								var grid = $("#" + gname).data("kendoGrid");
								var item = grid.dataItem(grid.select());
								if (item && item[IdProperty])
									Ajax.RequestManager().Enqueue({
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
							}
						},
						QueryDetail: function (gname, IdProperty) {
							if (!gridProperties.IsButtonEnable(gname, gridProperties.Querycss)) {
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
											gridProperties.GridButtonEnable(gname, false, false, false, false, false, true);
										},
										error: function (data) {
										}
									});
								}
							}
						},
					},
					Slider: {
						OnSliderChange: clfn(),
						OnSliderSlide: clfn()
					},
					TabStrip: {
						OnActivate: function (e) {
							MSCJS.Common.Helper.ExecuteMethod(e.sender.element.context.id + '_OnActivate', [e]);
						},
						OnSelect: function (e) {
							MSCJS.Common.Helper.ExecuteMethod(e.sender.element.context.id + '_OnSelect', [e]);
						}
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
					},
					AutoComplete: {
						OnAutoCompleteChange: clfn(),
						OnSelect: clfn(),
						OnOpen: (function (s, clientFn, dropdownvalue) {
							if (dropdownvalue) {
								s.sender.list.width(dropdownvalue);
							}
							MSCJS.Common.Helper.ExecuteMethod(clientFn, [s]);
						}),
						OnClose: clfn(),
						OnDataBound: clfn(),
						OnFiltering: clfn()
					},
					MaskedTextBox: {
						OnChange: function (e) {
							MSCJS.Common.Helper.ExecuteMethod(e.sender.element.context.id + '_OnChange', [e]);
						}
					},
					PivotGrid: {
						onTextChange: function (id, cur) {
							var list = MSCJS.GetGrid(id);
							var idcol = cur.id.split("_");
							item = list.dataSource.getByUid(idcol[0]);
							item.set("dirty", true);
							var colname = idcol.length > 2 ? "_" : "";
							colname += idcol[idcol.length - 1];
							item[colname] = cur.value;
						}
					},
					NumericTextBox: {
						OnSpin: function (e) {
							MSCJS.Common.Helper.ExecuteMethod(e.sender.element.context.id + '_Spin', [e]);
						},
						OnChange: function (e) {
							MSCJS.Common.Helper.ExecuteMethod(e.sender.element.context.id + '_Change', [e]);
						}
					},
					CheckBoxGroup: {
						OnClick: function (c, s) {
							var clientEvent = c + '_OnClick';
							if (MSCJS.Common.Helper.CheckIfMethodExistFromName(clientEvent)) {
								MSCJS.Common.Helper.ExecuteMethod(clientEvent, s);
							}
							else {
								var me = window[c];
								me.UpdateGroup(me.Items.findIndex(function (d) { return d.id === s; }));
							}
						},
						OnLoad: function (d) {
							window[d.id] = new CheckBoxGroup(d.id);
							var cu = window[d.id];
							if (d.items && d.items.length > 0) {
								cu.NewComponentAndSelectItem(d, d.items);
							}
							else {
								$.ajax({
									url: UrlHelper.Action(d.action),
									type: "GET",
									cache: false,
									dataType: 'json',
									success: function (partialData) {
										cu.NewComponentAndSelectItem(d, partialData.Data);
									},
									error: function (data) {
									}
								});
							}
						},
						HiddenFiled: function () {
							var html = "";
							$.each($(".chkgrp"), function (i, s) {
								var cid = s.id.replace("grp", "");
								var chkgrp = window[cid];
								var v = chkgrp.GetSelectedItems();
								$.each(v, function (i, v1) {
									var cuid = cid + "_" + i + "__";
									var cunm = cid + "[" + i + "].";
									html += "<input type='hidden' value='" + v1.item[chkgrp.ValueField] + "' id='" + cuid + chkgrp.ValueField + "' name='" + cunm + chkgrp.ValueField + "' />";
									html += "<input type='hidden' value='" + v1.item[chkgrp.TextField] + "' id='" + cuid + chkgrp.TextField + "' name='" + cunm + chkgrp.TextField + "' />";
								})
							})
						}
					},
					GroupButton: {
						AddWrapper: function (d, item) {
							var wrapper = "";
							$.each(item, function (i, v) {
								wrapper += MSCJS.Message.Format("<button class='btn btn-primary {0}' type='button' onclick='MSCJS.HTMLHelpers.ClientEvents.GroupButton.OnClick(\"{1}\",\"{2}\",this)'>{2}</button>", item && v[d.valueField] === d.defaultValue ? "s" : "", d.id, v[d.valueField], v[d.textField]);
							})
							wrapper += "<input type='hidden' value='" + d.defaultValue + "' id='" + d.id + "' />";
							$("#" + d.id + "_grp").html(wrapper);
							MSCJS.Common.Helper.ExecuteMethod(d.id + "_OnLoad", [d.defaultValue, ]);
						},
						OnLoad: function (d) {
							if (d.listData && d.listData.length > 0) {
								MSCJS.HTMLHelpers.ClientEvents.GroupButton.AddWrapper(d, d.listData);
							}
							else {
								$.ajax({
									url: UrlHelper.Action(d.methodName),
									type: "GET",
									cache: false,
									dataType: 'json',
									success: function (partialData) {
										MSCJS.HTMLHelpers.ClientEvents.GroupButton.AddWrapper(d, partialData.Data);
									},
									error: function (data) {
									}
								});
							}
						},
						OnClick: function (id, v, t) {
							var clientEvent = id + '_OnClick';
							if (MSCJS.Common.Helper.CheckIfMethodExistFromName(clientEvent)) {
								MSCJS.Common.Helper.ExecuteMethod(clientEvent, [v, t]);
							}
							$(MSCJS.GetId(id)).val(v);
							$(MSCJS.GetId(id)).siblings().removeClass('grpbtnselected');
							$(t).addClass('grpbtnselected');
						}
					},
					Menu: {
						OnSelect: (function (s) {
							MSCJS.Common.Helper.ExecuteMethod(s.sender.element.context.id + '_Select', [s]);
						}),
						OnOpen: (function (s) {
							MSCJS.Common.Helper.ExecuteMethod(s.sender.element.context.id + '_Open', [s]);
						}),
						OnClose: (function (s) {
							MSCJS.Common.Helper.ExecuteMethod(s.sender.element.context.id + '_Close', [s]);
						}),
						OnActivate: (function (s) {
							MSCJS.Common.Helper.ExecuteMethod(s.sender.element.context.id + '_Activate', [s]);
						}),
						OnDeactivate: (function () {
							MSCJS.Common.Helper.ExecuteMethod(s.sender.element.context.id + '_Deactivate', [s]);
						}),
						OnEqualed: clfn(),
					},
					Toggle: {
						onChange: function (cb, n, v, l) {
							var values = v ? v.split('|') : [];
							var label = l ? l.split('|') : [];
							var ci = cb.checked ? 0 : 1;
							var cv = values.length > 0 ? values[ci] : "";
							var cl = label.length > 0 ? label[ci] : "";
							var clientEvent = n + "_Click";
							$("#" + n).val(cv);
							$("#lbl_toggle_" + n).html(cl);
							MSCJS.Common.Helper.ExecuteMethod(clientEvent, [n, cv, cl]);
						},
						onLoad: function (n, v, l, d) {
							var value = v ? v.split("|") : [];
							var label = l ? l.split("|") : [];
							var ci = 1; // default false
							if (value && value[0] === d) {
								ci = 0;
								$("#cmn_toggle_" + n).click();
							}
							else {
								$("#lbl_toggle_" + n).html(l && ci ? label[ci] : "");
								$("#" + n).val(value && ci ? value[ci] : "");
							}
						}
					},
					ProgressBar: {
						onChange: clwfn("_Change"),
						onCompleted: clwfn("_Completed"),
					},
					ToolTip: {
						onContentLoad: clwfn("_ContentLoad"),
						onError: clwfn("_Error"),
						onShow: clwfn("_Show"),
						onHide: clwfn("_Hide"),
						onRequestStart: clwfn("_Start")
					},
					TreeView: {
						OnDragStart: function (e) {
							return MSCJS.Common.Helper.ExecuteMethod("On" + e.sender.element.context.id + "OnDragStart", [e]);
						},
						OnDrop: function (e) {
							return MSCJS.Common.Helper.ExecuteMethod("On" + e.sender.element.context.id + "Drop", [e]);
						},
						OnChange: function (e) {
							return MSCJS.Common.Helper.ExecuteMethod("On" + e.sender.element.context.id + "Change", [e]);
						},
						OnDrag: function (e) {
							return MSCJS.Common.Helper.ExecuteMethod("On" + e.sender.element.context.id + "Drag", [e]);
						},
						OnSelect: function (e) {
							return MSCJS.Common.Helper.ExecuteMethod("On" + e.sender.element.context.id + "Select", [e]);
						},
						OnExpand: function (e) {
							return MSCJS.Common.Helper.ExecuteMethod("On" + e.sender.element.context.id + "Expand", [e]);
						},
						OnDataBound: function (e) {
							return MSCJS.Common.Helper.ExecuteMethod("On" + e.sender.element.context.id + "DataBound", [e]);
						},
						OnCallBack: function (e, tn, fn) {
							var output = {};
							var response = MSCJS.Common.Helper.ExecuteMethod("On" + tn + "CallBack", [e], undefined, output);
							if (!output["isExecuted"]) {
								return MSCJS.Common.Helper.ExecuteMethod(fn, [e]);
							}
							return response;
						}
					}
				},
			},
			Logger: function () {
				var active = !0;
				return {
					Enable: function () {
						active = !0;
					},
					Disable: function () {
						active = !1;
					},
					Common: function (e, m, op) {
						if (active) { console[e](m, op || ''); }
					},
					Error: function (m, op) {
						this.Common('error', m, op);
					},
					Warning: function (m, op) {
						console.warn(m, op);
						this.Common('warn', m, op);
					},
					Info: function (m, op) {
						this.Common('info', m, op);
					},
					Debug: function (m, op) {
						this.Common('debug', m, op);
					},
					Log: function (m, op) {
						this.Common('log', m, op);
					},
					Clear: function () {
						this.Common('clear');
					},
				}
			}()
		};
	})();
})(window);
(function (lib) {
	/**
	* Represents a Edit Template of the grid columns.
	* @constructor
	* @param {object}  - A template object that represents the Editor for the column.
	* @param {string} author - The author of the book.
	* @returns {object} 
	**/
	lib['Template'] = function () {
		return {
			Enclose: function (res, p, data) {
				var rp = "<span class='non-edit-mode'";
				if (p.bindText) {
					rp += "data-bind='" + p.bindText;
					rp += "'";
				}
				rp += ">";
				if (p.field) {
					rp += p.field;
				}
				rp += "</span>";
				rp += "<span class='edit-mode'>";
				rp += res;
				rp += "</span>";
				return rp;
			},
			DropDown: function (p, data) {
				p.cls = p.cls || '';
				var res = '<select ';
				res += "data-role='" + p.role + "' "
				res += "type='text' ";
				res += "url='" + p.url + "' ";
				res += "data-value-primitive='" + p.valuePrimitive + "' ";
				res += "data-text-field='" + p.text + "' ";
				res += "data-value-field='" + p.value + "' ";
				res += "id='" + p.prefix + "" + data[p.key] + "_" + p.suffix + "'";
				if (p.autoBind !== undefined) { res += "data-auto-bind='" + p.autoBind + "'"; }
				if (p.custom !== undefined) { res += "data-custom-bind='" + p.custom + "'"; }
				if (p.local !== undefined) { res += "data-local-data='" + p.local + "'"; }
				if (p.attr) { res += p.attr; }
				res += "class='" + p.cls + "'";
				if (p.end) { res += '/>'; }
				if (p.events) { try { p.events(data); } catch (e) { MSCJS.Logger.Error("Event should be a function"); } }
				if (p.bindText) { p.bindText = 'text:' + p.bindText; }
				return res;
			},
			ComboBox: function (p, data) {
				var cls = 'editor-combobox ';
				if (p.cls) { cls = 'editor-combobox ' + p.cls; }
				p.cls = cls;
				p.role = 'combobox';
				p.prefix = 'cbx_';
				var res = this.DropDown(p, data);
				res += "data-bind='defferedValue:" + p.bind + "' ";
				res += '/>';
				return this.Enclose(res, p);
			},
			MultiSelect: function (p, data) {
				var cls = 'editor-multiselect ';
				if (p.cls) { p.cls = cls + p.cls; }
				p.cls = cls;
				p.role = 'multiselect';
				p.prefix = 'multi_';
				var res = this.DropDown(p, data);
				res += "data-bind='value:" + p.bind + "' ";
				res += "multiple='multiple'/>";
				return this.Enclose(res, p);
			},
			DatePicker: function (p, data) {
				p.cls = p.cls || '';
				var res = "<input type='text' ";
				res += "data-bind='value: " + p.bind + "'";
				res += "id='date_" + data[p.key] + "_" + p.suffix + "'";
				if (p.attr) { res += p.attr; }
				res += "class='editor-datepicker " + p.cls + "'/>";
				if (p.events) { try { p.events(data); } catch (e) { MSCJS.Logger.Error("Event should be a function"); } }
				if (p.bindText) { p.bindText = 'date:' + p.bindText; }
				return this.Enclose(res, p);
			},
			TextBox: function (p, data) {
				p.cls = p.cls || '';
				var res = "<input type='text' ";
				res += "data-bind='value: " + p.bind + "' ";
				res += "id='txt_" + data[p.key] + "_" + p.suffix + "' ";
				if (p.attr) { res += p.attr; }
				res += "class='editor-textbox " + p.cls + "'/>";
				if (p.events) { try { p.events(data); } catch (e) { MSCJS.Logger.Error("Event should be a function"); } }
				if (p.bindText) { p.bindText = 'text:' + p.bindText; }
				return this.Enclose(res, p);
			},
			NumericTextBox: function (p, data) {
				p.cls = p.cls || '';
				var res = "<input type='text' ";
				res += "id='ntxt_" + data[p.key] + "_" + p.suffix + "' ";
				if (p.max) { res += "max='" + p.max + "'"; }
				if (p.maxlength) { res += " maxlength='" + p.maxlength + "' "; }
				if (p.min) { res += " min='" + p.min + "' "; }
				if (p.step) { res += " step='" + p.step + "' "; }
				if (p.decimals) { res += " data-decimals='" + p.decimals + "' "; }
				if (p.format) { res += " data-format='" + p.format + "' "; }
				if (p.attr) { res += p.attr; }
				res += "data-bind='value: " + p.bind + "' ";
				res += "class='onlynumber k-input editor-numeric " + p.cls + "'/>";
				if (p.bindText) { p.bindText = 'text:' + p.bindText; }
				if (p.events) { try { p.events(data); } catch (e) { MSCJS.Logger.Error("Event should be a function"); } }
				return this.Enclose(res, p);
			},
			Label: function (p, data) {
				p.cls = p.cls || '';
				var res = "<span ";
				res += "data-bind='text: " + p.bind + "'";
				if (p.attr) { res += p.attr; }
				res += "class='editor-inlabel " + p.cls + "'/>";
				if (p.events) { try { p.events(data); } catch (e) { MSCJS.Logger.Error("Event should be a function"); } }
				return res;
			},
			CheckBox: function (p, data) {
				var res = "<span class='non-edit-mode'>";
				res += '<input type="checkbox"';
				res += 'onclick="return false"';
				if (p.attr) { res += p.attr; }
				res += 'data-bind="checked:' + p.bind + '">';
				res += "</span>";
				res += "<span class='edit-mode'>";
				res += '<input type="checkbox"';
				res += 'id="' + data[p.key] + "_" + p.suffix + '"';
				if (p.attr) { res += p.attr; }
				res += 'data-bind="checked:' + p.bind + '">';
				res += "</span>";
				if (p.events) { try { p.events(data); } catch (e) { MSCJS.Logger.Error("Event should be a function"); } }
				return res;
			},
			Toggle: function (p, data) {
				var res = '';
				var id = 'toggle_' + data[p.key] + "_" + p.suffix;
				res += '<div class="onoffswitch marginbottom15 pull-left">';
				res += '<input id="' + id + '"';
				res += " data-bind='checked:" + p.bind + "' ";
				if (p.attr) { res += p.attr; }
				res += ' class="cmn-toggle cmn-toggle-round" type="checkbox">';
				res += '<label for="' + id + '" class="pull-left"></label></div>';
				if (p.events) { try { p.events(data); } catch (e) { MSCJS.Logger.Error("Event should be a function"); } }
				if (p.bindText) { p.bindText = 'text:' + p.bindText; }
				return this.Enclose(res, p);
			},
			Button: function (p, data) {
				p.cls = p.cls || '';
				var res = "<button data-role='button' role='button'";
				res += "id='btn_" + data[p.key] + "_Delete' ";
				res += "data-bind='events: { click: onDelete }'";
				res += "type='button' ";
				if (p.attr) { res += p.attr; }
				res += "class='editor-button-delete " + p.cls + "'>";
				res += p.text + "</button>";
				data.onDelete = function (bs) {
					bs.data[p.Status] == 'A' ? bs.data[p.Status] = 'AD' : bs.data[p.Status] = 'D';
					bs.data.dirty = true;
					var grid = MSCJS.Grid(p.grid);
					if (grid.IsServer()) {
						var param = {};
						param[p.param] = MSCJS.CreateObject(grid.ModifiedRows());
						grid.Read(param);
					}
					else {
						if (bs.data[p.Status] === 'AD') { grid.DataSource.remove(bs.data); }
						else {
							grid.AddDeleted(bs.data);
							grid.Filter({ field: p.Status, operator: "neq", value: 'D' });
						}
					}
				}
				return res;
			},
			EditOrDelete: function (p, data) {
				this.BindDelete(p, data);
				this.BindEdit(p, data);
				var res = '';
				var both = !p.hasEdit && !p.hasDelete;
				if (p.hasEdit || both) {
					res += '<i data-bind="events: { click: onEdit }"';
					res += "class='mode-query icon-edit2 font18 marginright7 editor-button-edit " + (p.editcls || '') + "'";
					if (p.editattr) { res += p.editattr; }
					res += "></i>";
					res += '<i data-bind="events: { click: onUpdate }"';
					res += "style='display:none' class='mode-edit icon-check2 font18 marginright7 editor-button-check " + (p.savecls || '') + "'";
					if (p.saveattr) { res += p.saveattr; }
					res += "></i>";
					res += '<i data-bind="events: { click: onCancel }"';
					res += "style='display:none' class='mode-edit icon-cancel2 font18 marginright7 editor-button-cancel " + (p.cancelcls || '') + "'";
					if (p.cancelattr) { res += p.cancelattr; }
					res += "></i>";
				}
				if (p.hasDelete || both) {
					res += '<i data-bind="events: { click: onDelete }"';
					res += "class='mode-query icon-delete font18 editor-button-delete " + (p.deletecls || '') + "'";
					if (p.deleteattr) { res += p.deleteattr; }
					res += "></i>";
				}
				return res;
			},
			Cross: function (p, data) {
				this.BindDelete(p, data);
				var res = '<i data-bind="events: { click: onDelete }"';
				res += "class='icon-cross2 editor-button-delete " + (p.cls || '') + "' ";
				res += 'style="font-size: 18px !important; color:#f00;" ';
				if (p.attr) { res += p.attr; }
				res += "></i>";
				return res;
			},
			Arrow: function (p, data) {
				var span = $("<span></span>").addClass("text-center show slideicon");
				var fnname = p.func + '(this,"' + p.grid + '")';
				span.attr("onclick", fnname);
				span.append($("<i></i>").addClass("icon-keyboard-arrow-right arrow-font"));
				return span.get(0).outerHTML;
			},
			BindEdit: function (p, data) {
				data.onEdit = function (bs) {
					data.isEdit = true;
					data.Old = data.toJSON();
					$(bs.target).closest('tr').find('.non-edit-mode').hide();
					$(bs.target).closest('tr').find('.edit-mode').show();
					$(bs.target).hide();
					$(bs.target).siblings('.mode-edit').show();
					$(bs.target).siblings('.mode-query').hide();
				};
				data.onUpdate = function (bs) {
					data.isEdit = false;
					$(bs.target).closest('tr').find('.non-edit-mode').show();
					$(bs.target).closest('tr').find('.edit-mode').hide();
					$(bs.target).hide();
					$(bs.target).siblings('.mode-query').show();
					$(bs.target).siblings('.mode-edit').hide();
				};
				data.onCancel = function (bs) {
					$.extend(data, data.Old);
					data.isEdit = false;
					data.trigger("change");
					$(bs.target).closest('tr').find('.non-edit-mode').show();
					$(bs.target).closest('tr').find('.edit-mode').hide();
					$(bs.target).hide();
					$(bs.target).siblings('.mode-query').show();
					$(bs.target).siblings('.mode-edit').hide()
				};
			},
			BindDelete: function (p, data) {
				data.onDelete = function (bs) {
					bs.data[p.Status] == 'A' ? bs.data[p.Status] = 'AD' : bs.data[p.Status] = 'D';
					bs.data.dirty = true;
					var grid = MSCJS.Grid(p.grid);
					if (grid.IsServer()) {
						var param = {};
						param[p.param] = MSCJS.CreateObject(grid.ModifiedRows());
						grid.Read(param);
					}
					else {
						if (bs.data[p.Status] === 'AD') { grid.DataSource.remove(bs.data); }
						else {
							grid.AddDeleted(bs.data);
							grid.Filter({ field: p.Status, operator: "neq", value: 'D' });
						}
					}
				};
			}
		};
	}();
})(MSCJS || {});

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
						processData: request.processData,
						success: function (o) {
							if (o.type != 'E') {
								if (request.success) request.success(o);
								MSCJS.Custombehaviour.Execute();
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
							}
							else {
								MSCJS.Message.ShowMessage(o.type, o.title, o.message);
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
							$this.LoadingPanel().Hide();
							Overlay.Stop();
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
							$("#loading").remove();
							$("<div id='loading' class='loading'><img src='../images/loader.gif'/><span id='loadingMessage'>Please wait ...  </span></div>")
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
				if (msgContent) { msgContent.innerHTML = msg ? msg : 'Please wait ...'; }
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
	IsButtonEnable: function (gname, cssClass) {
		return $('#' + gname + 'Toolbar .' + cssClass()).prop('disabled');
	},
	HideGridContainer: function (gname) {
		if ($('#' + gname + 'partial').hasClass(gridProperties.Show())) {
			$('#' + gname + 'grid').toggleClass(gridProperties.Hide() + ' ' + gridProperties.Show());
			$("#" + gname + "partial").toggleClass(gridProperties.Show() + ' ' + gridProperties.Hide());
			$("#" + gname + "ctr").html("");
		}
	},
	GridButtonEnable: function (gridname, isNew, isSave, isEdit, isDelete, isClear, isClose) {
		if (this.GetToolbarDetailLength(gridname, this.Newcss) === 0 && this.GetToolbarDetailLength(gridname, this.Savecss) === 0 && this.GetToolbarDetailLength(gridname, this.Editcss) === 0 && this.GetToolbarDetailLength(gridname, this.Deletecss) === 0) {
			$(this.GetToolbarDetail(gridname, this.Querycss)).show();
			this.GridToolbarAddorRemoveDisableClass(gridname, isClose, this.Closecss);
			this.GridToolbarAddorRemoveDisableClass(gridname, !isClose, this.Querycss);
		}
		else {
			this.GridToolbarAddorRemoveDisableClass(gridname, isNew, this.Newcss);
			this.GridToolbarAddorRemoveDisableClass(gridname, isSave, this.Savecss);
			this.GridToolbarAddorRemoveDisableClass(gridname, isEdit, this.Editcss);
			this.GridToolbarAddorRemoveDisableClass(gridname, isDelete, this.Deletecss);
			this.GridToolbarAddorRemoveDisableClass(gridname, isClear, this.Clearcss);
			this.GridToolbarAddorRemoveDisableClass(gridname, isClose, this.Closecss);
		}
	},
	GetToolbarDetail: function (gridname, cssClass) {
		return MSCJS.GetId(gridname + 'Toolbar .' + cssClass());
	},
	GetToolbarDetailLength: function (gridname, cssClass) {
		return $(MSCJS.GetId(gridname + 'Toolbar .' + cssClass())).length;
	},
	GridToolbarAddorRemoveDisableClass: function (gridname, enable, cssClass) {
		var currentToolbar = $('#' + gridname + 'Toolbar .' + cssClass());
		if (!enable && !currentToolbar.hasClass(this.Disablecss())) {
			currentToolbar.addClass(this.Disablecss());
		}
		else if (enable && currentToolbar.hasClass(this.Disablecss())) {
			$('#' + gridname + 'Toolbar .' + cssClass()).removeClass(this.Disablecss());
		}
		currentToolbar.prop("disabled", !enable);
	},
	EnableQueryView: function (gname, isEnable) {
		if (isEnable === true) {
			$("#" + gname + "Toolbar ." + this.Querycss()).show();

			gridProperties.GridButtonEnable(gname, false, false, false, false, false, false);
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
	};
	if (!Array.prototype.trim) {
		Array.prototype.trim = function () {
			i = 0;
			var L = this.length;
			while (i < L) {
				this[i] = this[i].trim();
				i++;
			}
			return this;
		};
	}
	if (!Array.prototype.findIndex) {
		Array.prototype.findIndex = function (predicate) {
			if (this === null) {
				throw new TypeError('Array.prototype.findIndex called on null or undefined');
			}
			if (typeof predicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}
			var list = Object(this);
			var length = list.length >>> 0;
			var thisArg = arguments[1];
			var value;

			for (var i = 0; i < length; i++) {
				value = list[i];
				if (predicate.call(thisArg, value, i, list)) {
					return i;
				}
			}
			return -1;
		};
	}
	$.fn.serializeFormJSON = function () {
		var o = {};
		var $form = this.not('input:checkbox:not(:checked)').not('input:radio:not(:checked)');
		var a = $form.serializeArray();
		$.each(a, function () {
			if (o[this.name]) {
				if (!o[this.name].push) {
					o[this.name] = [o[this.name]];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value || '';
			}
		});
		return o;
	};
})();

DefaultFormat = function () {
	var dateFormat = "dd-MMM-yyyy", dateTimeFormat = "dd-MMM-yyyy hh:mm:tt";
	return {
		SetDate: function (df) {
			dateFormat = df;
		},
		SetDateTime: function (dtf) {
			dateTimeFormat = dtf;
		},
		GetDate: function () {
			return dateFormat;
		},
		GetDateTime: function () {
			return dateTimeFormat;
		}
	}
}();

function TextAreaPopUpInit(s) {
} //todo

UrlHelper = function () {
	var cname = '';
	return {
		SetControllerName: function (n) {
			cname = n;
		},
		Action: function (n) {
			//return cname + '/' + n;
			return n;
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
						RegularExpression: r[10],
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
				Label: 0,
				TextBox: 1,
				ListSingle: 2,
				ListMulti: 3,
				Checkbox: 4,
				Radiobutton: 5,
				Webcombo: 6,
				AutoComplete: 7,
				DateControl: 8,
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
			this.Refresh(r);
			this.RequiredFieldValidator(r);
			if (r.IsUpper) {
				$(r.Entity).css('text-transform', 'uppercase').change(function () {
					this.value = this.value.toUpperCase()
				});
			}
			$(r.Entity).bind('keypress', this.EventHandler.OnKeyPress);
			$(r.Entity).bind('change', this.EventHandler.OnChange);
			$(r.Entity).bind('paste', this.EventHandler.OnPaste);
		}),
		Refresh: (function (rule) {
			if (rule && rule.Label) {
				var entityId = rule.Entity.id || rule.Entity;
				var labelId = rule.Label.id || rule.Label;
				rule.Entity = document.getElementById(entityId) || rule.Entity;
				rule.Label = document.getElementById(labelId) || rule.Label;
			}
		}),
		RequiredFieldValidator: (function (r) {
			if (r && r.MinLength === 1 && r.Label && r.Label.innerHTML) {
				r.Label.innerHTML = r.Label.innerHTML.replace(/\<span(.+)\>/g, '');
				if (r.Entity.value != undefined && r.Entity.value.trim() !== '') {
					r.Label.innerHTML = r.Label.innerHTML.replace(/\<\/label\>/g, '').trim() + '<span>*</span>' + '</label>';
				}
				else if (r.Entity.value == undefined || r.Entity.value.trim() === '') {
					r.Label.innerHTML = r.Label.innerHTML.replace(/\<\/label\>/g, '').trim() + '<span title="' + r.MinLengthMessage + '" class="ValidationSummary" validation_focus="' + r.Entity.id + '">*</span></label>';
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
			return Validation.IsValidAndFocus(s).length > 0 ? Validation.IsValidAndFocus(s)[0].ErrorMessage : "";
		}),
		IsValidAndFocus: (function (s) {
			var DisplayMessage = [];
			var msg = '';
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
				msg += e.getAttribute("data-cmp-val") + " <br> ";
			});
			$.each(summary, function (i, e) {
				msg += e.title + " <br> ";
			});
			msg += MSCJS.HTMLHelpers.ClientEvents.DetailGrid.ValidateGrid(s.ContainerId);
			msg ? DisplayMessage.push({ ErrorMessage: msg, FocusId: summary[0].attributes[2].value }) : DisplayMessage;
			return DisplayMessage;
		}),
		ValidationFocus: (function (id) {
			$("#" + id).focus();
		}),
		EventHandler: (function () {
			var getTextBoxValue = (function (event) {
				var currentTarget = event.target || window.event.target;
				var self = Validation;
				var r = self.GetRuleById(event.target.id);
				if (currentTarget.selectionStart == 0 && currentTarget.selectionEnd == r.MaxLength) {
					return String.fromCharCode(event.which);
				} else {
					return currentTarget.value.slice(0, currentTarget.selectionStart)
								+ String.fromCharCode(event.which)
								+ currentTarget.value.slice(currentTarget.selectionStart, currentTarget.value.length);
				}
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
						case self.DataType.AnythingButNotSpecial:
							return self.GetExpressionByRule(r).test(value);
							break;
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
				//Any changes will have effect in the custombehaviour
				OnChange: (function (e) {
					var self = Validation;
					var rule = self.GetRuleById(e.target.id);
					if (rule == null) {
						return true;
					}
					else {
						self.Refresh(rule);
						self.RequiredFieldValidator(rule);
						if (rule.DataType == self.DataType.Email && rule.Entity.value.trim() !== '') {
							return self.GetExpressionByRule(rule).test(rule.Entity.value) ? true : alert("Invalid Email");
						}
					}
				}),
				/// <summary>
				/// Validates the entity when the value is pasted
				/// </summary>
				OnPaste: (function (e) {
					setTimeout(function () {
						var self = Validation,
						r = self.GetRuleById(e.target.id);
						if (r == null) {
							//console.log("No Element found for " + e.target.id);
						}
						else {
							var expression = self.GetExpressionByRule(r);
							if (r.DataType === self.DataType.AcceptNegativeAndDecimalDot
								|| r.DataType === self.DataType.RejectNegativeButNotDecimalDot
								|| r.DataType === self.DataType.Temperature) {
								expression = self.GetExpressionByRule(r).Second;
								if (self.Constants.PointRegExp.test(e.target.value)) {
									expression = self.GetExpressionByRule(r).First;
								}
							}
							if (!expression.test(r.Entity.value)) {
								if (r.Entity.value.length > r.MaxLength) {
									r.Entity.value = r.Entity.value.substr(0, r.MaxLength);
								}
								self.RequiredFieldValidator(r);
							}
						}
					}, 0);
				}),
			};
		})(),

		// added
		Constants: (function () {
			return {
				EmptyString: '',
				Dot: '.',
				Minus: '-',
				Zero: '0',
				MinusZero: '-0',
				PointZero: '.0',
				PointRegExp: /\./g,
				MinusRegExp: /-/g,
				DotRegExp: /./g,
				ZeroRegExp: /^-?0{1,}$/,
				ConsecutiveZeroRegExp: /^-?0{2,}$/,
				DotWithConsecutiveZeroRegExp: /^\.0{2,}$/,
				MinusOrDotRegExp: /^-\.?$/,
				HeaderCategory: 'form1',
				DefaultCategory: 'Header',
				MessageTypeClass: {
					73: 'clsInformation',
					87: 'clsWarning',
					69: 'clsException'
				},
				MessageType: {
					Information: 73,
					Warning: 87,
					Exception: 69
				}
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
						expression = new RegExp('^[\\S\\s]{' + r.MinLength + ',' + r.MaxLength + '}$');
					else if (r.MinLength == 0 && r.MaxLength > 0)
						expression = new RegExp('^[\\S\\s]{1,' + r.MaxLength + '}$');
					else expression = new RegExp('^[\\S\\s]*$');
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
			if (ONV.UI.Toolbar.GetMode().Equals(ONV.UI.Toolbar.Edit) || ONV.UI.Toolbar.GetMode().Equals(ONV.UI.Toolbar.Clear)) {
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
			ONV.TryCatch(function () {
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
				if (vType) { rules = handler.Rules.filter(function (r) { return ONV.Validator.GetMessageType(r[2]) === vType; }); }
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

function GetStatusDetail(value, desc) {
	var cssClass;
	if (value == 'A')
		cssClass = 'actstat';
	else if (value == 'I')
		cssClass = 'inactstat';
	else if (value == 'PA')
		cssClass = 'penstat';
	else if (value == 'DEL')
		cssClass = "delstat";
	else if (value == "D")
		cssClass = "draftstat";
	else if (value == "R")
		cssClass = "rejstat";
	else if (value == "NI")
		cssClass = "notimportedstat";
	else if (value == "TR")
		cssClass = "toreviewstat";
	return "<div class='" + cssClass + "'>" + desc + "</div>";
}

function CheckBoxGroup(id) {
	var me = this;
	this.TextField = "";
	this.Id = id;
	this.ValueField = "";
	this.DataSource = "";
	this.Holder = "";
	this.isbool = false;
	this.InputElement = "";
	this.Items = [];
	this.Wrapper = [];
	this.PreviousSelectedData = [];
	this.Component = function (id) {
		return this.Components[id];
	};
	this.AddItems = function (data) {
		$.each(data, function (i, v) {
			me.AddItem(v, i);
		})
	};
	this.AddItem = function (data) {
		var i = me.Items.length;
		me.AddItem(data, i);
	};
	this.AddItem = function (v, i) {
		me.Items[i] = {
			item: v,
			index: i,
			isSelected: false,
			id: me.Id + "_" + i,
			wrapper: me.ItemTempalte(me.Id + "_" + i, v[me.ValueField], v[me.TextField])
		}
		me.Wrapper += me.Items[i].wrapper;
	};
	this.SelectedItems = function (data) {
		$.each(data, function (i, v) {
			me.UpdateGroup(me.Items.findIndex(function (d) { return d.item[me.ValueField] === v[me.ValueField]; }));
		})
	};
	this.GetSelectedItems = function () {
		return me.Items.filter(function (v) { return v.isSelected === true; })
	}
	this.ItemTempalte = function (id, val, lbl) {
		return '<div class="form-group"><input class="k-checkbox" data-val="true" id="' + id + '_chk" type="checkbox" onclick="MSCJS.HTMLHelpers.ClientEvents.CheckBoxGroup.OnClick(\'' + me.Id + '\',\'' + id + '\')" value="' + val + '"><label class="k-checkbox-label" for="' + id + '_chk">' + lbl + '</label></div>'
	};
	this.NewComponentAndSelectItem = function (d, i) {
		this.NewComponent(d, i);
		$("#" + d.id + "_grp").html(me.Wrapper);
		this.SelectedItems(d.selectedItems);
	},
	this.NewComponent = function (detail, items) {
		me.id = detail.id;
		me.ValueField = detail.valueField;
		me.TextField = detail.textField;
		me.DataSource = {
			controller: detail.controller,
			actionname: detail.action,
		}
		me.Wrapper = "";
		if (items) {
			me.AddItems(items);
		}
	};
	this.UpdateGroup = function (i) {
		if (i >= 0) {
			if (me.Items[i]) {
				me.Items[i].isSelected = !me.Items[i].isSelected;
				$("#" + me.Items[i].id + "_chk").prop("checked", me.Items[i].isSelected);
			}
		}
	}
}

//under onv namespace
window.onv = window.onv || {};
(function (w) {
	w['grid'] = function () {
		return {
			Excel: function (p) {
				this.grid = p.grid;
				this.AddNew = p.button;
				this.isReadOnly = p.isReadOnly;
				this.hasEditKey = p.hasEditKey;
				this.idProperty = p.idProperty;
			}
		};
	}();
	(function onvExtensions() {
		onv.grid.Excel.prototype.AddNew = function (param) {
			param['mode'] = 'A';
			var jgrid = MSCJS.Grid(this.grid);
			if (jgrid.IsServer()) { jgrid.Read(param); }
			else {
				var data = jgrid.DataSource().insert(0, {});
				MSCJS.Common.RemoveDate(data);
				var view = jgrid.Component().tbody.find(">tr:first");
				data.dirty = !0;
				kendo.bind($(view), data);
				MSCJS.Common.Helper.ExecuteMethod(this.grid + '_OnAddNew', [data]);
			}
		};
		onv.grid.Excel.prototype.SetEditMode = function () {
			$('#' + this.grid + ' .non-edit-mode').hide();
			$('#' + this.grid + ' .edit-mode').show();
			$('#' + this.grid + ' .mode-query').hide();
			$('#' + this.grid + ' .mode-edit').show();
		};
		onv.grid.Excel.prototype.SetQueryMode = function () {
			$('#' + this.grid + ' .non-edit-mode').show();
			$('#' + this.grid + ' .edit-mode').hide();
			$('#' + this.grid + ' .mode-query').hide();
			$('#' + this.grid + ' .mode-edit').hide();
		};
	})();
})(window.onv);

(function KendoExtensions() {
	kendo.data.binders.widget.defferedValue = kendo.data.Binder.extend({
		init: function (widget, bindings, options) {
			kendo.data.Binder.fn.init.call(this, widget.element[0], bindings, options);
			this.widget = widget;
			this._change = $.proxy(this.change, this);
			this.widget.bind("change", this._change);
		},
		refresh: function () {
			if (!this._initChange) {
				var widget = this.widget;
				var value = this.bindings.defferedValue.get();
				if (value) {
					if (widget.options.autoBind === false) {
						//Bind the widget with single item if deffered binding is used
						var fvalue = value[widget.options.dataValueField];
						var ftext = value[widget.options.dataTextField];
						if (fvalue === null || fvalue === 0) { value[widget.options.dataTextField] = ''; }
						else {
							if (ftext === null) { value[widget.options.dataTextField] = ''; }
							widget.dataSource.data([value]);
							widget.value(value[widget.options.dataValueField]);
						}
					} else {
						//set widget value directly
						this.widget.value(value[widget.options.dataValueField]);
					}
				}
			}
		},
		change: function () {
			this._initChange = true;
			this.bindings.defferedValue.set(this.widget.dataItem() || null);
			this._initChange = false;
		},
		destroy: function () {
			this.widget.unbind("change", this._change);
		}
	});
	kendo.data.binders.date = kendo.data.Binder.extend({
		init: function (element, bindings, options) {
			kendo.data.Binder.fn.init.call(this, element, bindings, options);
			this.dateformat = $(element).data("dateformat");
			if (!this.dateformat) {
				this.dateformat = DefaultFormat.GetDate();
			}
		},
		refresh: function () {
			var data = this.bindings["date"].get();
			if (data) {
				var dateObj = new Date(data);
				var strData = kendo.toString(dateObj, this.dateformat);
				var defaultDate = kendo.toString(new Date('0001-01-01'), this.dateformat);
				if (strData !== defaultDate) { $(this.element).text(strData); }
				else { $(this.element).text(''); }
			}
		}
	});
	kendo.data.binders.dateTime = kendo.data.Binder.extend({
		init: function (element, bindings, options) {
			kendo.data.Binder.fn.init.call(this, element, bindings, options);
			this.dateformat = $(element).data("dateformat");
			if (!this.dateformat) {
				this.dateformat = DefaultFormat.GetDateTime();
			}
		},
		refresh: function () {
			var data = this.bindings["date"].get();
			if (data) {
				var dateObj = new Date(data);
				var strData = kendo.toString(dateObj, this.dateformat);
				var defaultDate = kendo.toString(new Date('0001-01-01'), this.dateformat);
				if (strData !== defaultDate) { $(this.element).text(strData); }
				else { $(this.element).text(''); }
			}
		}
	});
})();