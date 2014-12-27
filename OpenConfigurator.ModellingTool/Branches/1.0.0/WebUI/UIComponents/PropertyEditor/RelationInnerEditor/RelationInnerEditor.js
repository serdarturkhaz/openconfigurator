UIComponents.PropertyEditor.RelationInnerEditor = function (container, relationCLO) {

    // Fields
    var _container = container, _relationCLO = relationCLO;
    var _innerHtmlElem;
    var _innerElems = {
        
    };
    var _this = this;
    var _vm = {

    };

    // Init
    this.Initialize = function () {

        // Parse html markup
        var markup = "#HTMLCONTENT#";
        _innerHtmlElem = $($.parseHTML(markup));
        _innerHtmlElem.appendTo(_container);

        // Get references to html elems
        //_innerElems.focusElem = $(_innerHtmlElem).find("#NameTextbox");

        // Apply bindings
        ko.applyBindings(relationCLO, _innerHtmlElem[0]);
        
    }

    // Public methods
    this.RemoveSelf = function () {
        ko.cleanNode(_innerHtmlElem[0]);
        _innerHtmlElem.remove();
    }
}
