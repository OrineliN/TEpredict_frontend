define([
    // The dependency list
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/dom',
    'dojo/_base/window',
    'dojo/request/xhr',
    'dojo/text!uiPackage/uiWidgetTemplate.html',

    'dijit/layout/BorderContainer',
    'dijit/layout/ContentPane',
    'dijit/form/Button',
    'dijit/form/CheckBox',
    'dijit/form/MultiSelect',
    'dijit/form/RadioButton',
    'dijit/form/Select',
    'dijit/form/SimpleTextarea',
    'dijit/form/TextBox'

    // Once all dependencies have loaded, this function is called to define new module
    // The first dependencies will be associated with variables, the rest won't
], function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, dom, win, xhr, template){

    // We declare new widget which inherits _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin
    // This returned object becomes the defined value of this module
    return declare("uiWidget", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        dojoDom: dom,
        dojoWin: win,

        // HTML template string
        templateString: template,

        // This method is called after creating all template stuff
        postCreate: function() {
            var self = this;

            // Call of parent method
            this.inherited(arguments);

            // Load data
            var QMsD;
            xhr("uiPackage/QMsD.json", {
                handleAs: "json",
                sync: true
            }).then(function(data){
                QMsD = data;
            });
            var currentAlleleClass;

            // Get all necessary widgets from template
            var MHC_I_RB = dijit.byId("MHC_I_RB");
            var MHC_II_RB = dijit.byId("MHC_II_RB");
            var Matrices_Sel = dijit.byId("Matrices_Sel");
            var Alleles_MSel = dijit.byId("Alleles_MSel");

            // Create actions for widgets
            dojo.connect(MHC_I_RB, "onChange", function(newValue){
                if(newValue) {
                    console.log("MHC_I_RB activated");

                    currentAlleleClass = "MHC-I";
                    self.updateMatrixSelector(Matrices_Sel, Object.getOwnPropertyNames(QMsD[currentAlleleClass]));
                }
            });
            dojo.connect(MHC_II_RB, "onChange", function(newValue){
                if(newValue) {
                    console.log("MHC_II_RB activated");

                    currentAlleleClass = "MHC-II";
                    self.updateMatrixSelector(Matrices_Sel, Object.getOwnPropertyNames(QMsD[currentAlleleClass]));
                }
            });
            dojo.connect(Matrices_Sel, "onChange", function(newValue){
                console.log("Matrices_Sel changed to " + Matrices_Sel.get("value"));

                self.updateAlleleList(Alleles_MSel, QMsD[currentAlleleClass][newValue]);
            });

            // Set default values for widgets
            MHC_I_RB.set("checked", true);
        },

        updateMatrixSelector: function(matrixSelector, newValues) {
            while (matrixSelector.options.length > 0) {
                matrixSelector.removeOption(0);
            }

            newValues.forEach(function(value) {
                matrixSelector.addOption({
                    label: value,
                    value: value
                })
            });

            matrixSelector.set("value", newValues[0]);
        },

        updateAlleleList: function(MSelList, newValues) {
            var self = this;
            var MSel = self.dojoDom.byId(MSelList.get("id"));

            while (MSel.children.length > 0) {
                MSel.remove(MSel.children[0]);
            }

            newValues.forEach(function(value) {
                var option = self.dojoWin.doc.createElement("option");
                option.innerHTML = value;
                option.value = value;
                MSel.appendChild(option);
            });
        },

        validateInput: function() {

        }
    })
});
