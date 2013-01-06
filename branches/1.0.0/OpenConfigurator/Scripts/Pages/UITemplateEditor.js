// Developed by OpenConfigurator Core Team
// 
// Distributed under the MIT license
// ===========================================================
// Copyright (c) 2012 - Radu Mitache
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), 
// to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, 
// publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR 
// OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR 
// OTHER DEALINGS IN THE SOFTWARE.

//Settings and defaults
var systemDefaults = {
    codeEditorDefaults: {
        tabMode: "indent",
        gutter: true,
        lineNumbers: true
    }
};
var controlDefaults = {
    idPrefix: "control",
    idSeparatorSymbol: "_"
};

var UITemplateDataModel = function (uiTemplateID, uiTemplateName) {

    //Variables
    var _uiTemplateID = uiTemplateID, _uiTemplate = null, _uiTemplateName = uiTemplateName;
    var _thisUITemplateDataModel = this;

    //Properties
    this.UITemplateID = _uiTemplateID;

    //Private methods
    var getUIControlTypeData = function (controltype) {
        var returnObj;
        $.ajax({
            url: "/UITemplateEditor/GetUIControlTypeData",
            data: JSON.stringify({ ControlType: controltype }),
            async: false,
            success: function (dataObj) {
                returnObj = dataObj;
            }
        });

        return returnObj;
    }

    //Constructor/Initalizers
    this.Initialize = function () {

        //Setup internal eventhandlers
        internalTemplateDataLoaded.Add(new EventHandler(onInternalTemplateDataLoaded));
    }

    //Public methods
    this.LoadData = function (onFinished) {
        $.ajax({
            type: "POST",
            url: "/UITemplateEditor/LoadData",
            data: JSON.stringify({ uiTemplateID: _uiTemplateID }),
            async: false,
            success: function (response) {
                _uiTemplate = response;

            },
            error: function (req, status, error) {
                alert("error");
            }
        });

        //Raise events
        internalTemplateDataLoaded.RaiseEvent();
        _thisUITemplateDataModel.TemplateDataLoaded.RaiseEvent();

        //CallBack
        onFinished(_uiTemplate);
    }
    this.SaveData = function (newName, beforeSend, onSuccess, onError) {

        beforeSend();
        $.timer(300, function () {

            //Variables
            var error = false, success = true;

            //Save the template fields
            $.ajax({
                type: "POST",
                url: "/UITemplateEditor/SaveUITemplate",
                data: JSON.stringify({ uiTemplateID: _uiTemplateID, name: newName, content: _uiTemplate.Content, css: _uiTemplate.Stylesheet }),
                async: false
            });

            //Callbacks
            if (error) {
                onError();
            } else if (success) {
                onSuccess();
            }

        });
    }
    this.GetTemplateField = function (fieldName) {
        var fieldValue = _uiTemplate[fieldName]
        return fieldValue;
    }
    this.UpdateTemplateField = function (fieldName, value) {
        _uiTemplate[fieldName] = value;

        //Raise events
        _thisUITemplateDataModel.TemplateDataUpdated.RaiseEvent();
    }
    this.GetUIControlTypeData = function (controltype) {
        var controlObj = getUIControlTypeData(controltype);
        return controlObj;
    }
    this.CreateUIControlInstance = function (controltype) {
        var controlObj = getUIControlTypeData(controltype);

        return controlObj;
    }

    //Events
    this.TemplateDataLoaded = new Event();
    this.TemplateDataUpdated = new Event();
    var internalTemplateDataLoaded = new Event();

    //Eventhandlers
    var onInternalTemplateDataLoaded = function () {
    }
}
var ClientController = function (htmlViewContainer, cssViewContainer, visualViewContainer, uiTemplateNameTextbox, uiTemplateDataModelInstance) {

    //Fields and variables
    var _uiTemplateDataModel = uiTemplateDataModelInstance;
    var _htmlView, _cssView, _visualView;
    var _uiTemplateNameTextbox = uiTemplateNameTextbox;
    var _currentControlFocus = null;
    var _thisClientController = this;

    //Constructor/Initalizers
    this.Initialize = function () {

        $("#UITemplateCodeBox").block({ message: "Loading template...", fadeIn: 300 });
        $.timer(300, function () {

            //Instantiate/Initialize controls
            _htmlView = new HTMLView(htmlViewContainer, uiTemplateDataModelInstance);
            _htmlView.Initialize();
            _cssView = new CSSView(cssViewContainer, uiTemplateDataModelInstance);
            _cssView.Initialize();
            _visualView = new VisualView(visualViewContainer, uiTemplateDataModelInstance);
            _visualView.Initialize();

            //Setup eventhandlers
            _uiTemplateDataModel.TemplateDataLoaded.Add(new EventHandler(_htmlView.OnTemplateDataLoaded));
            _uiTemplateDataModel.TemplateDataLoaded.Add(new EventHandler(_cssView.OnTemplateDataLoaded));
            _uiTemplateDataModel.TemplateDataLoaded.Add(new EventHandler(_visualView.OnTemplateDataLoaded));
            _uiTemplateDataModel.TemplateDataUpdated.Add(new EventHandler(_visualView.OnTemplateDataUpdated));

            //Load the template, use delay to make sure all views have finished initializing
            $.timer(300, function () {
                _uiTemplateDataModel.LoadData(function (template) {
                    $(uiTemplateNameTextbox).val(template.Name);
                    $("#UITemplateCodeBox").unblock();
                });
            });
        });
    }

    //Public methods
    this.SaveData = function () {
        var newName = $(uiTemplateNameTextbox).val();
        _uiTemplateDataModel.SaveData(newName, function () {
            $("#UITemplateCodeBox").block({ message: "Saving template...", fadeIn: 300 });
        }, function () {
            $.pnotify({
                pnotify_title: "Data saved",
                pnotify_text: "Template '" + newName + "' saved successfully !",
                pnotify_type: "notice"
            });
            $("#UITemplateCodeBox").unblock();

        }, function () {
            $.pnotify({
                pnotify_title: "Error!",
                pnotify_text: "Data could not be saved",
                pnotify_type: "error"
            });
            $("#UITemplateCodeBox").unblock();
        });
    }
    this.RefreshCSSEditor = function () { //special fix for problem with CodeMirror and tabs
        _cssView.Refresh();
    }
    this.RefreshHTMLEditor = function () { //special fix for problem with CodeMirror and tabs
        _htmlView.Refresh();
    }
    this.SetControlFocus = function (tabName) {
        switch (tabName) {
            case "CSS":
                _currentControlFocus = _cssView;
                break;
            case "HTML":
                _currentControlFocus = _htmlView;
                break;
            case "Visual":
                _currentControlFocus = _visualView;
                break;
        }
        _currentControlFocus.Focus();

    }
    this.AddUIControl = function (controltype) {
        _htmlView.InsertUIControl(controltype);
    }
    this.AddHTMLControl = function (controltype) {
        _htmlView.InsertHTMLControl(controltype);
    }
}
var HTMLView = function (textArea, uiTemplateDataModelInstance) {

    //Fields
    var _uiTemplateDataModel = uiTemplateDataModelInstance;
    var _textArea = textArea;
    var _editorInstance = null;
    var _thisHTMLView = this;
    var _initialDataLoaded = false;

    //Private methods
    var createControlHTMLstring = function (controlObj) {

        //Create the outer control and set its attributes
        var outerControl = $(controlObj.Wrapper);
        $(outerControl).attr({
            controltype: controlObj.ControlType,
            databinding: "none"
        });

        //Create the inner element
        var innerElem = $(controlObj.HTML);

        //
        var controlString = $($(outerControl).append(innerElem))[0].outerHTML;
        return controlString;
    }
    var getSelectedRange = function () {
        return { from: _editorInstance.getCursor(true), to: _editorInstance.getCursor(false) };
    }

    //Constructor/Initalizers
    this.Initialize = function () {

        //Create the editor
        _editorInstance = CodeMirror.fromTextArea($(_textArea)[0], $.extend({}, systemDefaults.codeEditorDefaults, {
            mode: "text/html",
            onChange: function (instance, changesObj) { //changesObj - {from, to, text, next}
                if (instance === _editorInstance && _initialDataLoaded) {
                    changesObj.newtext = _editorInstance.getValue();
                    internalEditorValueChanged.RaiseEvent(changesObj);
                }
            },
            extraKeys: {
                "'>'": function (instance) {
                    instance.closeTag(instance, '>');
                },
                "'/'": function (instance) {
                    instance.closeTag(instance, '/');
                }
            }
        }));

        //Set internal eventhandlers
        internalEditorValueChanged.Add(new EventHandler(onInternalEditorValueChanged));
    }

    //Public methods
    this.InsertUIControl = function (controltype) {

        //Create a default control string
        var controlObj = _uiTemplateDataModel.CreateUIControlInstance(controltype);
        var controlString = createControlHTMLstring(controlObj);

        //Insert its html into the editor
        _editorInstance.replaceSelection(controlString);
        var range = getSelectedRange();
        _editorInstance.autoFormatRange(range.from, range.to);
    }
    this.InsertHTMLControl = function (controltype) {

        //Get the html string
        var controlString = "";
        switch (controltype) {
            case "table":
                controlString = "<table><thead></thead><tbody></tbody></table>"
                break;
            case "div":
                controlString = "<div></div>"
                break;
            case "span":
                controlString = "<span></span>"
                break;
        }


        //Insert its html into the editor
        _editorInstance.replaceSelection(controlString);
        var range = getSelectedRange();
        _editorInstance.autoFormatRange(range.from, range.to);
    }
    this.Refresh = function () {
        setTimeout(_editorInstance.refresh, 0);
    }
    this.Focus = function () {

    }

    //Events
    var internalEditorValueChanged = new Event();

    //Eventhandlers
    this.OnTemplateDataLoaded = function () {
        var content = _uiTemplateDataModel.GetTemplateField("Content");
        _editorInstance.setValue(content);
        _initialDataLoaded = true;
    }
    var onInternalEditorValueChanged = function (changesObj) {
        _uiTemplateDataModel.UpdateTemplateField("Content", changesObj.newtext);
    }
}
var CSSView = function (textArea, uiTemplateDataModelInstance) {

    //Fields
    var _uiTemplateDataModel = uiTemplateDataModelInstance;
    var _textArea = textArea;
    var _editorInstance = null;
    var _thisCSSView = this;
    var _initialDataLoaded = false;

    //Private methods
    var foldFunc = CodeMirror.newFoldFunction(CodeMirror.braceRangeFinder);

    //Constructor/Initalizers
    this.Initialize = function () {
        _editorInstance = CodeMirror.fromTextArea($(_textArea)[0], $.extend({}, systemDefaults.codeEditorDefaults, {
            mode: "css",
            onChange: function (instance, changesObj) { //changesObj - {from, to, text, next}
                if (instance === _editorInstance && _initialDataLoaded) {
                    changesObj.newtext = _editorInstance.getValue();
                    internalEditorValueChanged.RaiseEvent(changesObj);
                }
            },
            onGutterClick: foldFunc

        }));

        //Set internal eventhandlers
        internalEditorValueChanged.Add(new EventHandler(onInternalEditorValueChanged));
    }

    //Public methods
    this.Refresh = function () {
        setTimeout(_editorInstance.refresh, 0);

    }
    this.Focus = function () {

    }

    //Events
    var internalEditorValueChanged = new Event();

    //Eventhandlers
    this.OnTemplateDataLoaded = function () {
        var stylesheet = _uiTemplateDataModel.GetTemplateField("Stylesheet");
        _editorInstance.setValue(stylesheet);
        _initialDataLoaded = true;
    }
    var onInternalEditorValueChanged = function (changesObj) {
        _uiTemplateDataModel.UpdateTemplateField("Stylesheet", changesObj.newtext);

    }
}
var VisualView = function (containerArea, uiTemplateDataModelInstance) {

    //Fields
    var _uiTemplateDataModel = uiTemplateDataModelInstance;
    var _containerArea = containerArea;
    var _iframeInstance = null, _body = null, _head = null;
    var _templateDataChanged = false; //variable to keep track when template is updated
    var _thisVisualView = this;

    //Constructor/Initalizers
    this.Initialize = function () {

        //Create the iframe
        _iframeInstance = $("<iframe id='VisualViewIframe' ></iframe>");
        $(_containerArea).append(_iframeInstance);

        //Special fix for iframe when it first loads
        setTimeout(function () {

            //Get iframe sections
            _body = $(_iframeInstance).contents().find("body");
            _head = $(_iframeInstance).contents().find("head");
        }, 1);

        //Set internal eventhandlers
        internalControlFocused.Add(new EventHandler(onInternalControlFocused));
    }

    //Private methods
    var reloadData = function () {

        //Update the CSS
        var templateCSS = _uiTemplateDataModel.GetTemplateField("Stylesheet");
        var styleElem = $(_head).find("#styleElem");
        $(styleElem).text(templateCSS);

        //Update the HTML
        var templateHTML = _uiTemplateDataModel.GetTemplateField("Content");
        $(_body).html(templateHTML);
    }

    //Public methods
    this.Focus = function () {
        internalControlFocused.RaiseEvent();
    }

    //Events
    var internalControlFocused = new Event();

    //Eventhandlers
    this.OnTemplateDataLoaded = function () {

        //Load generic CSS for UIControl types
        var checkboxCSS = _uiTemplateDataModel.GetUIControlTypeData("Checkbox").CSS;
        var controlStyles = $("<style id='controlStylesElem' type='text/css'></style>").text(checkboxCSS);
        $(_head).append(controlStyles);

        //Load the template CSS
        var templateCSS = _uiTemplateDataModel.GetTemplateField("Stylesheet");
        var templateStyles = $("<style id='styleElem' type='text/css'></style>").text(templateCSS);
        $(_head).append(templateStyles);

        //Load the template HTML
        var templateHTML = _uiTemplateDataModel.GetTemplateField("Content");
        $(_body).html(templateHTML);
    }
    this.OnTemplateDataUpdated = function () {
        _templateDataChanged = true;
    }
    var onInternalControlFocused = function () {
        if (_templateDataChanged) {
            reloadData();
            _templateDataChanged = false;
        }
    }
}