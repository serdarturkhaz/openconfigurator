UIComponents.CommandToolbar = function (container, controller) {

    // Fields
    var _container = container, _controller = controller;
    var _innerHtmlElem;
    var _innerElems = {
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
            $(item).removeClass("toolBar-item-active");
        }
    }
    function addToggleEffect(item) {
        $(item).addClass("toolBar-item-active");
    }

    // Init
    this.Initialize = function () {

        // Parse html markup
        var markup = "#HTMLCONTENT#";
        _innerHtmlElem = $($.parseHTML(markup));
        _innerHtmlElem.appendTo(_container);

        // Get references to html elems
        _innerElems.modelManipulationItems.newFeatureItem = $(_innerHtmlElem).find("#newFeatureItem");
        _innerElems.modelManipulationItems.newRelationItem = $(_innerHtmlElem).find("#newRelationItem");
        _innerElems.modelManipulationItems.newGroupRelationItem = $(_innerHtmlElem).find("#newGroupRelationItem");
        _innerElems.modelManipulationItems.newCompositionRuleItem = $(_innerHtmlElem).find("#newCompositionRuleItem");
        _innerElems.modelManipulationItems.newCustomRuleItem = $(_innerHtmlElem).find("#newCustomRuleItem");
        _innerElems.modelManipulationItems.newCustomFunctionItem = $(_innerHtmlElem).find("#newCustomFunctionItem");
        _innerElems.visualOptionsItems.zoomInItem = $(_innerHtmlElem).find("#zoomInItem");
        _innerElems.visualOptionsItems.zoomOutItem = $(_innerHtmlElem).find("#zoomOutItem");
        _innerElems.visualOptionsItems.toggleOrientationItem = $(_innerHtmlElem).find("#toggleOrientationItem");

        // Set event handlers
        $(_innerElems.modelManipulationItems.newFeatureItem).bind("click", toolbarItemHandlers.newFeatureItemTriggered);
        $(_innerElems.modelManipulationItems.newRelationItem).bind("click", toolbarItemHandlers.newRelationItemTriggered);
        $(_innerElems.modelManipulationItems.newGroupRelationItem).bind("click", toolbarItemHandlers.newGroupRelationItemTriggered);
        $(_innerElems.modelManipulationItems.newCompositionRuleItem).bind("click", toolbarItemHandlers.newCompositionRuleItemTriggered);
        $(_innerElems.modelManipulationItems.newCustomRuleItem).bind("click", toolbarItemHandlers.newCustomRuleItemTriggered);
        $(_innerElems.modelManipulationItems.newCustomFunctionItem).bind("click", toolbarItemHandlers.newCustomFunctionItemTriggered);
        $(_innerElems.visualOptionsItems.zoomInItem).bind("click", toolbarItemHandlers.zoomInItemTriggered);
        $(_innerElems.visualOptionsItems.zoomOutItem).bind("click", toolbarItemHandlers.zoomOutItemTriggered);
        $(_innerElems.visualOptionsItems.toggleOrientationItem).bind("click", toolbarItemHandlers.toggleOrientationItemTriggered);

        // Key shortcut handlers
        $(document).keydown(function (e) {
            $.ctrl('F', toolbarItemHandlers.newFeatureItemTriggered);
            $.ctrl('R', toolbarItemHandlers.newRelationItemTriggered);
            $.ctrl('G', toolbarItemHandlers.newGroupRelationItemTriggered);
            $.ctrl('M', toolbarItemHandlers.newCompositionRuleItemTriggered);
            $.ctrl('U', toolbarItemHandlers.newCustomRuleItemTriggered);
            $.ctrl('N', toolbarItemHandlers.newCustomFunctionItemTriggered);
        });

        // Setup tooltips
        $(_innerHtmlElem).find(".toolBar-item").tipTip();
    }

    // Event handlers
    this.OnVisualViewStateChanged = function (oldStateName, newStateName) {

        // Mappings from VisualView states to item buttons in command bar
        var itemToVisualViewStateMappings = {};
        itemToVisualViewStateMappings[Enums.VisualView.StateNames.CreatingNewFeature] = _innerElems.modelManipulationItems.newFeatureItem;
        itemToVisualViewStateMappings[Enums.VisualView.StateNames.CreatingNewRelation] = _innerElems.modelManipulationItems.newRelationItem;
        itemToVisualViewStateMappings[Enums.VisualView.StateNames.CreatingNewGroupRelation] = _innerElems.modelManipulationItems.newGroupRelationItem;
        itemToVisualViewStateMappings[Enums.VisualView.StateNames.CreatingNewCompositionRule] = _innerElems.modelManipulationItems.newCompositionRuleItem;

        // Handle the states
        if (newStateName === Enums.VisualView.StateNames.Default) {
            removeAllToggleEffects();
        } else {
            addToggleEffect(itemToVisualViewStateMappings[newStateName]);
        }
    }
    var toolbarItemHandlers = {
        newFeatureItemTriggered: function () {
            _controller.AddNewFeature();
        },
        newRelationItemTriggered: function () {
            _controller.AddNewRelation();
        },
        newGroupRelationItemTriggered: function () {
            _controller.AddNewGroupRelation();
        },
        newCompositionRuleItemTriggered: function () {
            _controller.AddNewCompositionRule();
        },
        newCustomRuleItemTriggered: function () {
            _controller.AddNewCustomRule();
        },
        newCustomFunctionItemTriggered: function () {
            _controller.AddNewCustomFunction();
        },
        zoomInItemTriggered: function () {
            _controller.ZoomIn();
        },
        zoomOutItemTriggered: function () {
            _controller.ZoomOut();
        },
        toggleOrientationItemTriggered: function () {
            _controller.ToggleOrientation();
        }

    };
}
