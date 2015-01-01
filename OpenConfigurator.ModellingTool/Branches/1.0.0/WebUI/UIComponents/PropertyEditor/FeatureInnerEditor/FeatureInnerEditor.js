UIComponents.PropertyEditor.FeatureInnerEditor = function (container, featureCLO, specializedDataModel) {

    // Fields
    var _container = container, _featureCLO = featureCLO, _specializedDataModel = specializedDataModel;
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
        Identifier: _featureCLO.Identifier.extend({
            required: true
        }),
        Attributes: _featureCLO.Attributes,
        AddAttribute: function () {
            var newAttributeCLO = _specializedDataModel.CreateNewCLO(CLOTypes.Attribute);
            _featureCLO.Attributes.Add(newAttributeCLO);
        },
        RemoveAttribute: function (attributeCLO) {
            _specializedDataModel.DeleteByClientID(attributeCLO.GetClientID());
        }
    }
    _vm.Name.OriginalValue = _featureCLO.Name();
    _vm.Identifier.OriginalValue = _featureCLO.Identifier();

    // Init
    this.Initialize = function () {

        // Parse html markup
        var markup = "#HTMLCONTENT#";
        _innerHtmlElem = $($.parseHTML(markup));
        _innerHtmlElem.appendTo(_container);

        // Get references to html elems
        _innerElems.focusElem = $(_innerHtmlElem).find("#NameTextbox");
        _innerElems.attributesContainer = $(_innerHtmlElem).find("#AttributeListContainer");

        // Apply bindings
        ko.applyBindings(_vm, _innerHtmlElem[0]);

        // Select default elem
        setTimeout(function () {
            _innerElems.focusElem.select();
        }, 0);

        //
        $(_innerHtmlElem).find(".iconButton-small").tipTip();
    }

    // Public methods
    this.RemoveSelf = function () {
        // Revert if invalid
        if (!_featureCLO.Name.isValid() || !_featureCLO.Identifier.isValid()) {
            _featureCLO.Name(_vm.Name.OriginalValue);
            _featureCLO.Identifier(_vm.Identifier.OriginalValue);
        }

        // Clean up CLO from validation
        _featureCLO.Name.extend({ validatable: false });
        _featureCLO.Identifier.extend({ validatable: false });

        // Clean up bindings
        ko.cleanNode(_innerHtmlElem[0]);
        _innerHtmlElem.remove();
    }
}
