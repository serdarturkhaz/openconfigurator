﻿UIComponents.Shared.Dialog = function (title, content, settings) {

    // Fields
    var _title = title, _content = content;
    var _dialog = null;
    var _innerHtmlElem;
    var _innerElems = {
        headerLabel: null,
        innerContainer: null,
        closeIcon: null
    };
    var _options = {
        modal: false,
        showCloseIcon: true
    }
    var _widgetOptions = {
        modal:true
    };
    var _this = this;

    // Init
    this.Initialize = function () {

        // Parse html markup
        var markup = "#HTMLCONTENT#";
        _innerHtmlElem = $($.parseHTML(markup));
        _innerHtmlElem.appendTo("body");

        // Get references to html elems
        _innerElems.closeIcon = $(_innerHtmlElem).find(".closeIcon");
        _innerElems.innerContainer = $(_innerHtmlElem).find(".boxContent");
        _innerElems.headerLabel = $(_innerHtmlElem).find(".headerLabel");
        
        // Setup based on options
        settings = (settings !== undefined) ? settings : {};
        _options = $.extend({}, _options, settings);
        _innerElems.closeIcon.bind("click", function () {
            _dialog.dialog("close");
        });
        $(_innerHtmlElem).draggable({
            handle: ".boxHeader",
            containment: "window"
        });

        _innerElems.innerContainer.append(content);
        _innerElems.headerLabel.text(_title);
    }

    // Public methods
    this.Show = function () {
        _dialog = $(_innerHtmlElem).dialog(_widgetOptions);
    }

    // Event handlers

}