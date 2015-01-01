UIComponents.PropertyEditor.FeatureInnerEditor.AttributeInnerEditor = function (container, attributeCLO) {

    // Fields
    var _container = container, _attributeCLO = attributeCLO;
    var _innerHtmlElem;
    var _innerElems = {
        focusElem: null
    };
    var _this = this;
    var _vm = {
        Name: _attributeCLO.Name.extend({
            required: true
        }),
        Identifier: _attributeCLO.Identifier.extend({
            required: true
        }),
        AttributeTypes: createKOObservableArrayFromEnum(Enums.AttributeTypes),
        AttributeType: _attributeCLO.AttributeType,
        ConstantValue: _attributeCLO.ConstantValue,
        AttributeDataTypes: createKOObservableArrayFromEnum(Enums.AttributeDataTypes),
        AttributeDataType: _attributeCLO.AttributeDataType
    }
    _vm.Name.OriginalValue = _attributeCLO.Name();
    _vm.Identifier.OriginalValue = _attributeCLO.Identifier();

    // Init
    this.Initialize = function () {

        // Parse html markup
        var markup = "#HTMLCONTENT#";
        _innerHtmlElem = $($.parseHTML(markup));
        _innerHtmlElem.appendTo(_container);

        // Get references to html elems
        _innerElems.focusElem = $(_innerHtmlElem).find("#AttributeNameTextbox");

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
        if (!_attributeCLO.Name.isValid() || !_attributeCLO.Identifier.isValid()) {
            _attributeCLO.Name(_vm.Name.OriginalValue);
            _attributeCLO.Identifier(_vm.Identifier.OriginalValue);
        }

        // Clean up CLO from validation
        _attributeCLO.Name.extend({ validatable: false });
        _attributeCLO.Identifier.extend({ validatable: false });

        // Clean up bindings
        ko.cleanNode(_innerHtmlElem[0]);
        _innerHtmlElem.remove();
    }
}
