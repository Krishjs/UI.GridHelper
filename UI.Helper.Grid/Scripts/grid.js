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
            ComboBox: function (p, data) {
                var res = '<select ';
                res += "data-role='combobox' "
                res += "type='text' ";
                res += "url='" + p.url + "' ";
                res += "data-value-primitive='" + p.valuePrimitive + "' ";
                res += "data-text-field='" + p.text + "' ";
                res += "data-value-field='" + p.value + "' ";
                res += "data-bind='defferedValue:" + p.bind + "' ";
                res += "id='" + data[p.key] + "_" + p.suffix + "'";
                res += "class='editor-combobox'/>";
                return res;
            },
            DatePicker: function (p, data) {
                var res = "<input type='text' ";
                res += "data-bind='value: " + p.bind + "'";
                res += "id='" + data[p.key] + "_" + p.suffix + "'";
                res += "class='editor-datepicker'/>";
                return res;
            },
            TextBox: function (p, data) {
                var res = "<input type='text' ";
                res += "data-bind='value: " + p.bind + "' ";
                res += "id='" + data[p.key] + "_" + p.suffix + "' ";
                res += "class='editor-textbox'/>";
                return res;
            },
            Label: function (p) {
                var res = "<span ";
                res += "data-bind='text: " + p.bind + "'";;
                res += "class='editor-inlabel'/>";
                return res;
            },
            MultiSelect: function (p,data) {
                var res = "<select ";                
                res += "url='" + p.url + "' ";
                res += "data-value-primitive='" + p.valuePrimitive + "' ";
                res += "id='" + data[p.key] + "_" + p.suffix + "' ";
                res += "multiple='multiple' ";
                res += "style='display: none;' ";
                res += "data-role='multiselect' ";
                res += "aria-disabled='false' ";
                res += "data-text-field='" + p.text + "' ";
                res += "data-value-field='" + p.value + "' ";
                res += "data-bind='defferedValue:" + p.bind + "' ";
                res += "aria-readonly='false'/>'";
                res += "class='editor-multiselect' ";
                return res;
            }
        };
    }();
})(MSCJS || {});