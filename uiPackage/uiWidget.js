define([
    // The dependency list
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/text!uiPackage/uiWidgetTemplate.html',

    'dijit/layout/BorderContainer',
    'dijit/layout/ContentPane',
    'dijit/form/Button',
    'dijit/form/CheckBox',
    'dijit/form/ComboBox',
    'dijit/form/MultiSelect',
    'dijit/form/RadioButton',
    'dijit/form/SimpleTextarea',
    'dijit/form/TextBox'

    // Once all dependencies have loaded, this function is called to define new module
    // The first dependencies will be associated with variables, the second won't
], function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template){

    // We declare new widget which inherits _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin
    // This returned object becomes the defined value of this module
    return declare("uiWidget", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        // html template string
        templateString: template,

        validateInput: function() {

        }
    })
});
