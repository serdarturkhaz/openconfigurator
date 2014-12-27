UIComponents.PropertyEditor.FeatureInnerEditor = function (container, featureCLO) {

    // Fields
    var _container = container, _featureCLO = featureCLO;
    var _innerHtmlElem;
    var _innerElems = {
        attributesContainer: null,
        focusElem: null
    };
    var _this = this;
    var _vm = {
        Name: _featureCLO.Name.extend({
            required: true
        }),
        Identifier: _featureCLO.Identifier
    }
    _vm.Name.OriginalValue = _featureCLO.Name();

    // Init
    this.Initialize = function () {

        // Parse html markup
        var markup = "#HTMLCONTENT#";
        _innerHtmlElem = $($.parseHTML(markup));
        _innerHtmlElem.appendTo(_container);

        // Get references to html elems
        _innerElems.focusElem = $(_innerHtmlElem).find("#NameTextbox");

        // Apply bindings
        ko.applyBindings(_vm, _innerHtmlElem[0]);

        // Select default elem
        setTimeout(function () {
            _innerElems.focusElem.select();
        }, 0);
    }

    // Public methods
    this.RemoveSelf = function () {
        // Revert if invalid
        if (!_featureCLO.Name.isValid())
            _featureCLO.Name(_vm.Name.OriginalValue);

        // Clean up CLO from validation
        _featureCLO.Name.extend({ validatable: false });

        // Clean up bindings
        ko.cleanNode(_innerHtmlElem[0]);
        _innerHtmlElem.remove();
    }
}
