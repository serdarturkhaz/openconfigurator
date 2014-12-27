UIComponents.PropertyEditor.FeatureInnerEditor = function (container, featureCLO) {

    // Fields
    var _container = container, _featureCLO = featureCLO;
    var _innerHtmlElem;
    var _innerElems = {
        attributesContainer: null,
        focusElem: null
    };
    var _this = this;

    // Init
    this.Initialize = function () {

        // Parse html markup
        var markup = "#HTMLCONTENT#";
        _innerHtmlElem = $($.parseHTML(markup));
        _innerHtmlElem.appendTo(_container);

        // Get references to html elems
        _innerElems.focusElem = $(_innerHtmlElem).find("#NameTextbox");

        // Apply bindings
        ko.applyBindings(_featureCLO, _innerHtmlElem[0]);

        // Select default elem
        setTimeout(function () {
            _innerElems.focusElem.select();
        }, 0);
        
    }

    // Public methods
    this.RemoveSelf = function () {
        ko.cleanNode(_innerHtmlElem[0]);
        _innerHtmlElem.remove();
    }
}
