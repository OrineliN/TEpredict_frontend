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

            // Get all necessary widgets from template
            var MHC_I_RB = dijit.byId("MHC_I_RB");
            var MHC_II_RB = dijit.byId("MHC_II_RB");
            var Matrices_Sel = dijit.byId("Matrices_Sel");
            var Alleles_MSel = dijit.byId("Alleles_MSel");
            var Pred_thr_TB = dijit.byId("Pred_thr_TB");

            var ImProt_filter_CB = dijit.byId("ImProt_filter_CB");
            var ImProt_thr_Sel = dijit.byId("ImProt_thr_Sel");
            var Prot_filter_CB = dijit.byId("Prot_filter_CB");
            var Prot_thr_Sel = dijit.byId("Prot_thr_Sel");

            var Tap_filter_CB = dijit.byId("Tap_filter_CB");
            var Tap_thr_TB = dijit.byId("Tap_thr_TB");
            var Tap_filter_type1_RB = dijit.byId("Tap_filter_type1_RB");
            var Tap_filter_type2_RB = dijit.byId("Tap_filter_type2_RB");
            var Tap_filter_method1_RB = dijit.byId("Tap_filter_method1_RB");
            var Tap_filter_method2_RB = dijit.byId("Tap_filter_method2_RB");
            var Precursor_len_TB = dijit.byId("Precursor_len_TB");
            var Precursor_downw_TB = dijit.byId("Precursor_downw_TB");

            var Seq_editor_TA = dijit.byId("Seq_editor_TA");
            var Output_map_RB = dijit.byId("Output_map_RB");

            // Create actions for widgets
            dojo.connect(MHC_I_RB, "onChange", function(newValue){
                if(newValue) {
                    currentAlleleClass = "MHC-I";
                    self.updateSelector(Matrices_Sel, Object.getOwnPropertyNames(QMsD[currentAlleleClass]));
                }
            });
            dojo.connect(MHC_II_RB, "onChange", function(newValue){
                if(newValue) {
                    currentAlleleClass = "MHC-II";
                    self.updateSelector(Matrices_Sel, Object.getOwnPropertyNames(QMsD[currentAlleleClass]));
                }
            });
            dojo.connect(Matrices_Sel, "onChange", function(newValue){
                self.updateMultiSelector(Alleles_MSel, QMsD[currentAlleleClass][newValue]);

                if (highThresholdMatricies.indexOf(newValue) >= 0) {
                    Pred_thr_TB.set("value", "6.3");
                }

                if (lowThresholdMatricies.indexOf(newValue) >= 0) {
                    Pred_thr_TB.set("value", "3.0");
                }
            });
            dojo.connect(ImProt_filter_CB, "onChange", function(newValue){
                if (newValue) {
                    ImProt_thr_Sel.set("disabled", false);
                } else {
                    ImProt_thr_Sel.set("disabled", true);
                }
            });
            dojo.connect(Prot_filter_CB, "onChange", function(newValue){
                if (newValue) {
                    Prot_thr_Sel.set("disabled", false);
                } else {
                    Prot_thr_Sel.set("disabled", true);
                }
            });
            dojo.connect(Tap_filter_CB, "onChange", function(newValue){
                if (newValue) {
                    Tap_thr_TB.set("disabled", false);
                    Tap_filter_type1_RB.set("disabled", false);
                    Tap_filter_type2_RB.set("disabled", false);
                    Tap_filter_method1_RB.set("disabled", false);
                    Tap_filter_method2_RB.set("disabled", false);
                    Precursor_len_TB.set("disabled", false);
                    Precursor_downw_TB.set("disabled", false);

                    Tap_filter_type1_RB.set("checked", false);
                    Tap_filter_type1_RB.set("checked", true);
                } else {
                    Tap_thr_TB.set("disabled", true);
                    Tap_filter_type1_RB.set("disabled", true);
                    Tap_filter_type2_RB.set("disabled", true);
                    Tap_filter_method1_RB.set("disabled", true);
                    Tap_filter_method2_RB.set("disabled", true);
                    Precursor_len_TB.set("disabled", true);
                    Precursor_downw_TB.set("disabled", true);
                }
            });
            dojo.connect(Tap_filter_type1_RB, "onChange", function(newValue){
                if (newValue) {
                    Tap_thr_TB.set("value", "3.0");
                    Tap_filter_method2_RB.set("checked", false);
                    Tap_filter_method2_RB.set("checked", true);
                    Tap_filter_method1_RB.set("disabled", true);
                }
            });
            dojo.connect(Tap_filter_type2_RB, "onChange", function(newValue){
                if (newValue) {
                    Tap_thr_TB.set("value", "1.0");
                    Tap_filter_method1_RB.set("disabled", false);
                }
            });
            dojo.connect(Tap_filter_method1_RB, "onChange", function(newValue){
                if (newValue) {
                    Precursor_len_TB.set("disabled", false);
                    Precursor_downw_TB.set("disabled", false);
                }
            });
            dojo.connect(Tap_filter_method2_RB, "onChange", function(newValue){
                if (newValue) {
                    Precursor_len_TB.set("disabled", true);
                    Precursor_downw_TB.set("disabled", true);
                }
            });
            dojo.connect(Seq_editor_TA, "onFocus", function(){
                if (Seq_editor_TA.get("value") == defaultTextAreaMessage) {
                    Seq_editor_TA.set("value", "");
                }
            });
            dojo.connect(Seq_editor_TA, "onBlur", function(){
                if (Seq_editor_TA.get("value") == "") {
                    Seq_editor_TA.set("value", defaultTextAreaMessage);
                }
            });

            // Set default values for widgets
            MHC_I_RB.set("checked", true);

            ImProt_filter_CB.set("checked", true);
            ImProt_filter_CB.set("checked", false);
            this.updateSelector(ImProt_thr_Sel, defaultThresholds);
            Prot_filter_CB.set("checked", true);
            Prot_filter_CB.set("checked", false);
            this.updateSelector(Prot_thr_Sel, defaultThresholds);

            Precursor_len_TB.set("value", "10");
            Precursor_downw_TB.set("value", "0.2");
            Tap_filter_CB.set("checked", true);
            Tap_filter_CB.set("checked", false);

            Seq_editor_TA.set("value", defaultTextAreaMessage);
            Output_map_RB.set("checked", true);
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

        }
    })
});
