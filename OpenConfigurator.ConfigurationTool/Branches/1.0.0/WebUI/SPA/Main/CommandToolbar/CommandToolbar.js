define("Main/CommandToolbar/CommandToolbar",
    [
        "text!Main/CommandToolbar/CommandToolbar.html" // html markup
    ],
    function (HTMLmarkup) {

        var CommandToolbar = function (container, dataModel, controller) {

            // Fields
            var _container = container, _dataModel = dataModel, _controller = controller;
            var _innerHtmlElem;
            var _innerElems = {
                modelNameTextbox: null,
                fileCommandItems: {
                    newModelItem: null,
                    openModelItem: null,
                    saveModelItem: null
                },
                modelManipulationItems: {
                    newFeatureItem: null,
                    newRelationItem: null,
                    newGroupRelationItem: null,
                    newCompositionRuleItem: null,
                    newCustomRuleItem: null,
                    newCustomFunctionItem: null
                },
                visualOptionsItems: {
                    toggleOrientationItem: null,
                    zoomInItem: null,
                    zoomOutItem: null
                }
            };
            var _this = this;

            // Private methods
            function removeAllToggleEffects() {
                for (var itemKey in _innerElems.modelManipulationItems) {
                    var item = _innerElems.modelManipulationItems[itemKey];
                    $(item).removeClass("iconButton-active");
                }
            }
            function addToggleEffect(item) {
                $(item).addClass("iconButton-active");
            }
            function bindToModelHasChanges(modelCLO) {
                modelCLO.HasChanges.Changed.AddHandler(new EventHandler(onModelHasChangesChanged, "toolbarSaveItem"));
                onModelHasChangesChanged(modelCLO.HasChanges()); // trigger change to load initial value

            }
            function unbindFromModelHasChanges(modelCLO) {
                modelCLO.HasChanges.Changed.RemoveHandler("toolbarSaveItem");
            }

            // Init
            this.Initialize = function () {

                // Parse html markup
                _innerHtmlElem = $($.parseHTML(HTMLmarkup));
                _innerHtmlElem.appendTo(_container);

                // Get references to html elems
                _innerElems.modelNameTextbox = $(_innerHtmlElem).find("#modelNameTextbox");
                _innerElems.fileCommandItems.openModelItem = $(_innerHtmlElem).find("#openModelItem");

                // Set event handlers
                $(_innerElems.fileCommandItems.openModelItem).bind("click", toolbarItemHandlers.openModelItemTriggered);
                

                // Setup tooltips
                $(_innerHtmlElem).find(".Textbox").tipTip();
                $(_innerHtmlElem).find(".iconButton").tipTip();
            }

            // Event handlers
            var toolbarItemHandlers = {
                openModelItemTriggered: function () {
                    _controller.OpenFile();
                }
            };

        }
        return CommandToolbar;
    });