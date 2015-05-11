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
            var highThresholdMatricies = [
                "TEpred",
                "SPLS_ICA11_tuned",
                "SPLS_ICA11",
                "SPLS_PMBEC",
                "SPLS_THDR",
                "PLS_ICA11",
                "PLS_PMBEC"
            ];
            var lowThresholdMatricies = [
                "ProPred1",
                "nHLAPred",
                "ProPred"
            ];
            var defaultThresholds = [
                "1%",
                "2%",
                "3%",
                "4%",
                "5%",
                "6%",
                "7%",
                "8%",
                "9%",
                "10%"
            ];
            var defaultTextAreaMessage = "You may paste here your protein sequence in Fasta or GenPep format";

            // Create actions for widgets
            dojo.connect(this.MHC1, "onChange", function(newValue){
                if(newValue) {
                    currentAlleleClass = "MHC-I";
                    self.updateSelector(self.Matrices, Object.getOwnPropertyNames(QMsD[currentAlleleClass]));
                }
            });

            dojo.connect(this.MHC2, "onChange", function(newValue){
                if(newValue) {
                    currentAlleleClass = "MHC-II";
                    self.updateSelector(self.Matrices, Object.getOwnPropertyNames(QMsD[currentAlleleClass]));
                }
            });

            dojo.connect(this.Matrices, "onChange", function(newValue){
                self.updateMultiSelector(self.Alleles, QMsD[currentAlleleClass][newValue]);

                if (highThresholdMatricies.indexOf(newValue) >= 0) {
                    self.PredictThreshold.set("value", "6.3");
                }

                if (lowThresholdMatricies.indexOf(newValue) >= 0) {
                    self.PredictThreshold.set("value", "3.0");
                }
            });

            dojo.connect(this.ImProtFilter, "onChange", function(newValue){
                if (newValue) {
                    self.ImProtThreshold.set("disabled", false);
                } else {
                    self.ImProtThreshold.set("disabled", true);
                }
            });

            dojo.connect(this.ProtFilter, "onChange", function(newValue){
                if (newValue) {
                    self.ProtThreshold.set("disabled", false);
                } else {
                    self.ProtThreshold.set("disabled", true);
                }
            });

            dojo.connect(this.TapFilter, "onChange", function(newValue){
                if (newValue) {
                    self.TapThreshold.set("disabled", false);
                    self.TapFilterType1.set("disabled", false);
                    self.TapFilterType2.set("disabled", false);
                    self.TapFilterMethod1.set("disabled", false);
                    self.TapFilterMethod2.set("disabled", false);
                    self.PrecursorLength.set("disabled", false);
                    self.PrecursorDownW.set("disabled", false);

                    self.TapFilterType1.set("checked", false);
                    self.TapFilterType1.set("checked", true);
                } else {
                    self.TapThreshold.set("disabled", true);
                    self.TapFilterType1.set("disabled", true);
                    self.TapFilterType2.set("disabled", true);
                    self.TapFilterMethod1.set("disabled", true);
                    self.TapFilterMethod2.set("disabled", true);
                    self.PrecursorLength.set("disabled", true);
                    self.PrecursorDownW.set("disabled", true);
                }
            });

            dojo.connect(this.TapFilterType1, "onChange", function(newValue){
                if (newValue) {
                    self.TapThreshold.set("value", "3.0");
                    self.TapFilterMethod2.set("checked", false);
                    self.TapFilterMethod2.set("checked", true);
                    self.TapFilterMethod1.set("disabled", true);
                }
            });

            dojo.connect(this.TapFilterType2, "onChange", function(newValue){
                if (newValue) {
                    self.TapThreshold.set("value", "1.0");
                    self.TapFilterMethod1.set("disabled", false);
                }
            });

            dojo.connect(this.TapFilterMethod1, "onChange", function(newValue){
                if (newValue) {
                    self.PrecursorLength.set("disabled", false);
                    self.PrecursorDownW.set("disabled", false);
                }
            });

            dojo.connect(this.TapFilterMethod2, "onChange", function(newValue){
                if (newValue) {
                    self.PrecursorLength.set("disabled", true);
                    self.PrecursorDownW.set("disabled", true);
                }
            });

            dojo.connect(this.SequenceEditor, "onFocus", function(){
                if (self.SequenceEditor.get("value") == defaultTextAreaMessage) {
                    self.SequenceEditor.set("value", "");
                }
            });

            dojo.connect(this.SequenceEditor, "onBlur", function(){
                if (self.SequenceEditor.get("value") == "") {
                    self.SequenceEditor.set("value", defaultTextAreaMessage);
                }
            });

            // Set default values for widgets
            this.MHC1.set("checked", true);

            this.ImProtFilter.set("checked", true);
            this.ImProtFilter.set("checked", false);
            this.updateSelector(this.ImProtThreshold, defaultThresholds);
            this.ProtFilter.set("checked", true);
            this.ProtFilter.set("checked", false);
            this.updateSelector(this.ProtThreshold, defaultThresholds);

            this.PrecursorLength.set("value", "10");
            this.PrecursorDownW.set("value", "0.2");
            this.TapFilter.set("checked", true);
            this.TapFilter.set("checked", false);

            this.SequenceEditor.set("value", defaultTextAreaMessage);
            this.OutputMap.set("checked", true);
        },

        updateSelector: function(selector, newValues) {
            while (selector.options.length > 0) {
                selector.removeOption(0);
            }

            newValues.forEach(function(value) {
                selector.addOption({
                    label: value,
                    value: value
                })
            });

            selector.set("value", newValues[0]);
        },

        updateMultiSelector: function(MultiSelector, newValues) {
            var self = this;
            var MultiSelectorNode = self.dojoDom.byId(MultiSelector.get("id"));

            while (MultiSelectorNode.children.length > 0) {
                MultiSelectorNode.remove(MultiSelectorNode.children[0]);
            }

            newValues.forEach(function(value) {
                var option = self.dojoWin.doc.createElement("option");
                option.innerHTML = value;
                option.value = value;
                MultiSelectorNode.appendChild(option);
            });
        },

        validateInput: function() {
            return true;
        }
    })
});
