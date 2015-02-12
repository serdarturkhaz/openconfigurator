define("Main/PropertyEditor/CustomFunctionInnerEditor/CustomFunctionInnerEditor",
    [
        "text!Main/PropertyEditor/CustomFunctionInnerEditor/CustomFunctionInnerEditor.html" // html markup
    ],
    function (HTMLmarkup) {
        var CustomFunctionInnerEditor = function (container, customFunctionCLO) {

            // Fields
            var _container = container, _customFunctionCLO = customFunctionCLO;
            var _innerHtmlElem;
            var _innerElems = {
                attributesContainer: null,
                focusElem: null
            };
            var _this = this;
            var _vm = {
                Name: _customFunctionCLO.Name.extend({
                    required: true
                }),
                Identifier: _customFunctionCLO.Identifier.extend({
                    required: true
                }),
                Expression: _customFunctionCLO.Expression
            }
            _vm.Name.OriginalValue = _customFunctionCLO.Name();
            _vm.Identifier.OriginalValue = _customFunctionCLO.Identifier();

            // Init
            this.Initialize = function () {

                // Parse html markup
                _innerHtmlElem = $($.parseHTML(HTMLmarkup));
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
                if (!_customFunctionCLO.Name.isValid() || !_customFunctionCLO.Identifier.isValid()) {
                    _customFunctionCLO.Name(_vm.Name.OriginalValue);
                    _customFunctionCLO.Identifier(_vm.Identifier.OriginalValue);
                }

                // Clean up CLO from validation
                _customFunctionCLO.Name.extend({ validatable: false });
                _customFunctionCLO.Identifier.extend({ validatable: false });

                // Clean up bindings
                ko.cleanNode(_innerHtmlElem[0]);
                _innerHtmlElem.remove();
            }
        }
        return CustomFunctionInnerEditor;
    });
