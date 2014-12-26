UIComponents.VisualView = function (container, dataModel, cloSelectionManager) {

    // Fields
    var _container = container, _dataModel = dataModel, _cloSelectionManager = cloSelectionManager;
    var _canvasContainer = null, _canvas = null;
    var _innerHtmlElem;
    var _innerElems = {
        headerLabel: null,
        infoMsgOverlay: null
    };
    var _wireframes = {
        featureWireframe: null
    };
    var _innerStateManager = null;
    var _visualUIElems = {};
    var _this = this;

    // Private methods
    function addFeatureElem(featureCLO) {

        // Create a new feature
        var newFeatureElem = UIComponentProvider.CreateInstance("UIComponents.VisualView.FeatureElem", [featureCLO, _canvas]);
        newFeatureElem.Initialize();
        _visualUIElems[featureCLO.GetClientID()] = newFeatureElem;

        // Bind to it
        newFeatureElem.Clicked.AddHandler(new EventHandler(function (ctrlKey) {
            featureElemHandlers.onClicked(newFeatureElem, ctrlKey);
        }));
        newFeatureElem.DragStarted.AddHandler(new EventHandler(function () {
            featureElemHandlers.onFeatureDragStarted(newFeatureElem);
        }));
        newFeatureElem.Dragging.AddHandler(new EventHandler(function (dx, dy) {
            featureElemHandlers.onFeatureDragging(newFeatureElem, dx, dy);
        }));
    }
    function addRelationElem(relationCLO) {

        // Create a new relation
        var newRelationElem = UIComponentProvider.CreateInstance("UIComponents.VisualView.RelationElem", [relationCLO, 
            _visualUIElems[relationCLO.ParentFeature.GetClientID()], _visualUIElems[relationCLO.ChildFeature.GetClientID()], _canvas]);
        newRelationElem.Initialize();
        _visualUIElems[relationCLO.GetClientID()] = newRelationElem;

        // Bind to it
        newRelationElem.Clicked.AddHandler(new EventHandler(function (ctrlKey) {
            onElemClicked(newRelationElem, ctrlKey);
        }));
    }
    function addGroupRelationElem(groupRelationCLO) {

        //
        var childFeatureElems = [];
        for (var i = 0; i < groupRelationCLO.ChildFeatures.GetLength() ; i++) {
            childFeatureElems.push(_visualUIElems[groupRelationCLO.ChildFeatures.GetAt(i).GetClientID()]);
        }

        // Create a new group relation
        var newGroupRelationElem = UIComponentProvider.CreateInstance("UIComponents.VisualView.GroupRelationElem", [groupRelationCLO,
            _visualUIElems[groupRelationCLO.ParentFeature.GetClientID()], childFeatureElems, _canvas]);
        newGroupRelationElem.Initialize();
        _visualUIElems[groupRelationCLO.GetClientID()] = newGroupRelationElem;

        // Bind to it
        newGroupRelationElem.Clicked.AddHandler(new EventHandler(function (ctrlKey) {
            onElemClicked(newGroupRelationElem, ctrlKey);
        }));
    }
    function addCompositionRuleElem(compositionRuleCLO) {

        // Create a new composition rule
        var newCompositionRuleElem = UIComponentProvider.CreateInstance("UIComponents.VisualView.CompositionRuleElem", [compositionRuleCLO, _visualUIElems[compositionRuleCLO.FirstFeature.GetClientID()],
            _visualUIElems[compositionRuleCLO.SecondFeature.GetClientID()], _canvas]);
        newCompositionRuleElem.Initialize();
        _visualUIElems[compositionRuleCLO.GetClientID()] = newCompositionRuleElem;

        // Bind to it
        newCompositionRuleElem.Clicked.AddHandler(new EventHandler(function (ctrlKey) {
            onElemClicked(newCompositionRuleElem, ctrlKey);
        }));
    }
    function selectElementsInArea(targetBbox) {

        // Loop through all selected UI elements and select them if they are within the targetBox bounds
        for (var clientid in _visualUIElems) {
            var elem = _visualUIElems[clientid];

            if (elem.IsWithinBounds(targetBbox)) {
                _cloSelectionManager.ForceCLOSelection(elem.GetCLO());
            }
        }
    }
    function refreshGraphicalReprOfAllUIElems() {
        for (var clientID in _visualUIElems) {
            var elem = _visualUIElems[clientID];
            if (elem !== undefined)
                elem.RefreshGraphicalRepresentation();
        }
    }

    // Init
    this.Initialize = function () {

        // Parse html markup
        var markup = "#HTMLCONTENT#";
        _innerHtmlElem = $($.parseHTML(markup));
        _innerHtmlElem.appendTo(_container);

        // Get references to dom elements
        _canvasContainer = $(_innerHtmlElem).find("#SVGCanvasWrapper");
        _innerElems.headerLabel = $(_innerHtmlElem).find(".headerLabel");
        _innerElems.infoMsgOverlay = $(_innerHtmlElem).find(".infoMsgOverlay");
        _canvas = Raphael($(_canvasContainer).children("#SVGCanvas")[0], "100%", "100%");
        _innerStateManager = new InnerStateManager(UIComponents.VisualView.InnerStates, UIComponents.VisualView.InnerStates.Default.Name, _this.StateChanged);
        _innerStateManager.Initialize(); // setup mode manager and enter initial mode

        // Handler for onFocus
        $(_innerHtmlElem).mousedown(function (e) {
            _this.Focus.RaiseEvent();
        });

        // Handler for ESC key - should always revert to default State
        $(document).bind("keydown.escape", function (e) {
            if (e.which == 27) { //esc key
                _innerStateManager.SwitchToState(Enums.VisualView.StateNames.Default);
            }
        });
    };

    // Public methods
    this.StartCreateFeature = function () {
        _innerStateManager.SwitchToState(UIComponents.VisualView.InnerStates.CreatingNewFeature.Name);
    }
    this.StartCreateRelation = function () {
        _innerStateManager.SwitchToState(UIComponents.VisualView.InnerStates.CreatingNewRelation.Name);
    }
    this.StartCreateGroupRelation = function () {
        _innerStateManager.SwitchToState(UIComponents.VisualView.InnerStates.CreatingNewGroupRelation.Name);
    }
    this.StartCreateCompositionRule = function () {
        _innerStateManager.SwitchToState(UIComponents.VisualView.InnerStates.CreatingNewCompositionRule.Name);
    }
    this.ZoomIn = function () {

        // Modify scale
        if (Settings.ScaleModifier < 2) {
            Settings.ScaleModifier += 0.25;
        }

        // Redraw all internal ui elems
        refreshGraphicalReprOfAllUIElems()
    }
    this.ZoomOut = function () {

        // Modify scale
        if (Settings.ScaleModifier >= 0.50) {
            Settings.ScaleModifier -= 0.25;
        }

        // Redraw all internal ui elems
        refreshGraphicalReprOfAllUIElems();
    }
    this.ToggleOrientation = function () {

        // Change orientation setting
        if (Settings.UIOrientation === Enums.UIOrientationTypes.Vertical) {
            Settings.UIOrientation = Enums.UIOrientationTypes.Horizontal;
        } else {
            Settings.UIOrientation = Enums.UIOrientationTypes.Vertical;
        }

        // Reverse coordinates for all Features
        for (var clientID in _visualUIElems) {
            var elem = _visualUIElems[clientID];
            if (elem !== undefined) {

                if (elem.GetType() === Enums.VisualView.ElemTypes.FeatureElem) {
                    elem.ReverseCoordinates();
                }
                elem.RefreshGraphicalRepresentation();

            }
        }
    }

    // Events
    this.Focus = new Event();
    this.StateChanged = new Event();

    // Event handlers
    this.OnModelLoaded = function (modelCLO) {

        // On Added handlers
        modelCLO.Features.Added.AddHandler(new EventHandler(modelHandlers.onFeatureAdded));
        modelCLO.Relations.Added.AddHandler(new EventHandler(modelHandlers.onRelationAdded));
        modelCLO.GroupRelations.Added.AddHandler(new EventHandler(modelHandlers.onGroupRelationAdded));
        modelCLO.CompositionRules.Added.AddHandler(new EventHandler(modelHandlers.onCompositionRuleAdded));

        // On Removed handlers
        modelCLO.Features.Removed.AddHandler(new EventHandler(modelHandlers.onCLORemoved));
        modelCLO.Relations.Removed.AddHandler(new EventHandler(modelHandlers.onCLORemoved));
        modelCLO.GroupRelations.Removed.AddHandler(new EventHandler(modelHandlers.onCLORemoved));
        modelCLO.CompositionRules.Removed.AddHandler(new EventHandler(modelHandlers.onCLORemoved));
    }
    var modelHandlers = {
        onFeatureAdded: function (featureCLO) {
            addFeatureElem(featureCLO);
        },
        onRelationAdded: function (relationCLO) {
            addRelationElem(relationCLO);
        },
        onGroupRelationAdded: function (groupRelationCLO) {
            addGroupRelationElem(groupRelationCLO);
        },
        onCompositionRuleAdded: function (compositionRuleCLO) {
            addCompositionRuleElem(compositionRuleCLO);
        },
        onCLORemoved: function (clo) {
            var elem = _visualUIElems[clo.GetClientID()];
            if (elem !== undefined) {
                delete _visualUIElems[clo.GetClientID()];
                elem.RemoveSelf();
            }
        }
    }
    var featureElemHandlers = {
        onClicked: function (elem, ctrlKey) {
            _cloSelectionManager.ToggleCLOSelection(elem.GetCLO(), ctrlKey);
        },
        onFeatureDragStarted: function (featureElem) {
            if (featureElem.IsSelected() === true) {
                // Start move for all the selected featureElems
                var selectedFeatureCLOs = _cloSelectionManager.GetAllSelectedCLOs(CLOTypes.Feature);
                for (var i = 0; i < selectedFeatureCLOs.length; i++) {
                    _visualUIElems[selectedFeatureCLOs[i].GetClientID()].StartMove();
                }
            }
        },
        onFeatureDragging: function (featureElem, dx, dy) {
            if (featureElem.IsSelected() === true) {
                // Move all the selected featureElems
                var selectedFeatureCLOs = _cloSelectionManager.GetAllSelectedCLOs(CLOTypes.Feature);
                for (var i = 0; i < selectedFeatureCLOs.length; i++) {
                    _visualUIElems[selectedFeatureCLOs[i].GetClientID()].MoveXYBy(dx, dy);
                }
            }
        }
    }
    var onElemClicked = function (elem, ctrlKey) {
        _cloSelectionManager.ToggleCLOSelection(elem.GetCLO(), ctrlKey);
    }

    // Inner modes
    UIComponents.VisualView.InnerStates = {};
    UIComponents.VisualView.InnerStates[Enums.VisualView.StateNames.Default] = {
        Name: "Default",
        EnterState: function () {
            // Variables
            var selectionRectangle = null, mouseDownPoint = null;

            // Handlers for selection rectangle functionality
            $(_canvasContainer).bind("mousedown.canvas", function (e) {

                if (e.target.nodeName === "svg") {
                    var initialX = e.pageX - $(_canvasContainer).offset().left + 0.5;
                    var initialY = e.pageY - $(_canvasContainer).offset().top + 0.5;
                    mouseDownPoint = { x: initialX, y: initialY };
                    selectionRectangle = _canvas.rect(mouseDownPoint.x, mouseDownPoint.y, 0, 0, 0).attr(UIStyles.Common.SelectionRectangle.Box.attr);
                }
            });
            $(_canvasContainer).bind("mousemove.canvas", function (e) {
                if (mouseDownPoint !== null) {
                    var screenPosX = (e.pageX - $(_canvasContainer).offset().left + 0.5);
                    var screenPosY = (e.pageY - $(_canvasContainer).offset().top + 0.5);
                    var dx = screenPosX - mouseDownPoint.x;
                    var dy = screenPosY - mouseDownPoint.y;

                    var xOffset = (dx < 0) ? dx : 0;
                    var yOffset = (dy < 0) ? dy : 0;
                    selectionRectangle.transform("T" + xOffset + "," + yOffset);
                    selectionRectangle.attr({ "width": Math.abs(dx), "height": Math.abs(dy) });
                }
            });
            $(_canvasContainer).bind("mouseup.canvas", function (e) {
                if (mouseDownPoint !== null) {

                    // Select elements lying within the selectionRectangle
                    if (e.ctrlKey !== true)
                        _cloSelectionManager.ClearCLOSelection(); // clear selection ONLY if ctrl is not pressed
                    selectElementsInArea(selectionRectangle.getBBox());

                    // Clear variables and remove selection rectangle
                    mouseDownPoint = null;
                    selectionRectangle.remove();
                }
            });
        },
        LeaveState: function () {
            $(_canvasContainer).unbind("click.canvas");
            $(_canvasContainer).unbind("mousedown.canvas");
            $(_canvasContainer).unbind("mouseup.canvas");
            $(_canvasContainer).unbind("mousemove.canvas");
        }
    };
    UIComponents.VisualView.InnerStates[Enums.VisualView.StateNames.CreatingNewFeature] = {
        Name: "CreatingNewFeature",
        EnterState: function () {
            _cloSelectionManager.ClearCLOSelection();
            _innerElems.infoMsgOverlay.html("Click to add a new Feature...").visible();

            // Create a wireframe
            var boxWidth = UIStyles.Feature.General.Box.Dimensions.width * Settings.ScaleModifier;
            var boxHeight = UIStyles.Feature.General.Box.Dimensions.height * Settings.ScaleModifier;
            _wireframes.featureWireframe = _canvas.rect(-100, -100, boxWidth, boxHeight, 0).attr(UIStyles.Feature.States.Wireframe.Box.attr);
            // Attach a mouse move handler for the wireframe
            $(_canvasContainer).bind("mousemove.moveWireframeFeature", function (e) {
                var screenPosX = (e.pageX - $(_canvasContainer).offset().left + 0.5 - boxWidth / 2);
                var screenPosY = (e.pageY - $(_canvasContainer).offset().top + 0.5 - boxHeight / 2);
                _wireframes.featureWireframe.attr({ x: screenPosX, y: screenPosY });
            });
            // Attach click handler to create the actual Feature when clicked
            $(_canvasContainer).bind("click.createFeature", function (e) {

                // Get the position
                var absolutePosX = (e.pageX - $(_canvasContainer).offset().left + 0.5 - boxWidth / 2) / Settings.ScaleModifier;
                var absolutePosY = (e.pageY - $(_canvasContainer).offset().top + 0.5 - boxHeight / 2) / Settings.ScaleModifier;

                // Create a new clientObject in the diagramDataModel
                var newFeatureCLO = _dataModel.CreateNewCLO(CLOTypes.Feature);
                newFeatureCLO.XPos(absolutePosX);
                newFeatureCLO.YPos(absolutePosY);
                _dataModel.GetCurrentFeatureModelCLO().Features.Add(newFeatureCLO);

                // Go back to default state
                _innerStateManager.SwitchToState(UIComponents.VisualView.InnerStates.Default.Name);
            });

        },
        LeaveState: function () {
            _innerElems.infoMsgOverlay.html("").hidden();

            // Clear handlers
            $(_canvasContainer).unbind("click.createFeature");
            $(_canvasContainer).unbind("mousemove.moveWireframeFeature");
            _wireframes.featureWireframe.remove();
        }
    };
    UIComponents.VisualView.InnerStates[Enums.VisualView.StateNames.CreatingNewRelation] = {
        Name: "CreatingNewRelation",
        EnterState: function () {
            _cloSelectionManager.ClearCLOSelection();
            _innerElems.infoMsgOverlay.html("Select the parent feature for the Relation...").visible();

            // Variables
            var parentFeatureElem, childFeatureElem;

            // First step handlers (let user select parent feature)
            this.normalFeatureElemOnclick = featureElemHandlers.onClicked; // store the usual feature onclick handler
            featureElemHandlers.onClicked = firstStepClickHandler;
            function firstStepClickHandler(featureElem) {
                parentFeatureElem = featureElem;
                _cloSelectionManager.ForceCLOSelection(parentFeatureElem.GetCLO());

                // Prepare for the second step
                featureElemHandlers.onClicked = secondStepClickHandler;
                _innerElems.infoMsgOverlay.html("Now select the child Feature for the Relation...").visible();
            }

            // Second step handlers (let user select child feature)
            function secondStepClickHandler(featureElem) {
                if (featureElem === parentFeatureElem) { // check whether the user is trying to select the same feature twice
                    _innerElems.infoMsgOverlay.html("Select a different child feature...");
                } else {
                    childFeatureElem = featureElem;
                    _cloSelectionManager.ForceCLOSelection(childFeatureElem.GetCLO());

                    // Create a new CLO
                    var newRelationCLO = _dataModel.CreateNewCLO(CLOTypes.Relation);
                    newRelationCLO.ParentFeature = parentFeatureElem.GetCLO();
                    newRelationCLO.ChildFeature = childFeatureElem.GetCLO();
                    parentFeatureElem.GetCLO().RelatedCLOS.Add(newRelationCLO);
                    childFeatureElem.GetCLO().RelatedCLOS.Add(newRelationCLO);

                    // Add it to the FeatureModel and then switch to default state
                    _dataModel.GetCurrentFeatureModelCLO().Relations.Add(newRelationCLO);
                    _innerStateManager.SwitchToState(UIComponents.VisualView.InnerStates.Default.Name);
                }
            }
        },
        LeaveState: function () {
            _innerElems.infoMsgOverlay.html("").hidden();

            // Restore the old feature onclick handler
            featureElemHandlers.onClicked = this.normalFeatureElemOnclick;
            delete this.normalFeatureElemOnclick;
        }
    }
    UIComponents.VisualView.InnerStates[Enums.VisualView.StateNames.CreatingNewGroupRelation] = {
        Name: "CreatingNewGroupRelation",
        EnterState: function () {
            _cloSelectionManager.ClearCLOSelection();
            _innerElems.infoMsgOverlay.html("Select the parent feature for the Group Relation...").visible();

            // Variables
            var parentFeatureElem, childFeatureElems = [];

            // First step handlers (let user select parent feature)
            this.normalFeatureElemOnclick = featureElemHandlers.onClicked; // store the usual feature onclick handler
            featureElemHandlers.onClicked = firstStepClickHandler;
            function firstStepClickHandler(featureElem) {
                parentFeatureElem = featureElem;
                _cloSelectionManager.ForceCLOSelection(parentFeatureElem.GetCLO());

                // Prepare for the second step
                featureElemHandlers.onClicked = secondStepClickHandler;
                _innerElems.infoMsgOverlay.html("Now select the child Features and double click to finish...").visible();
            }

            // Second step handlers (let user select child features)
            function secondStepClickHandler(featureElem) {
                if (featureElem === parentFeatureElem) { // check whether the user is trying to select the same feature twice
                    _innerElems.infoMsgOverlay.html("Select a different child feature...");
                } else {

                    childFeatureElems.push(featureElem);
                    _cloSelectionManager.ForceCLOSelection(featureElem.GetCLO());
                }
            }

            // Handler when enter is pressed
            $(_innerHtmlElem).bind("dblclick.groupRelation", function (e) {
                if (parentFeatureElem && childFeatureElems.length > 1) { // there should be at least 2 child features

                    // Create a new CLO
                    var newGroupRelationCLO = _dataModel.CreateNewCLO(CLOTypes.GroupRelation);
                    newGroupRelationCLO.ParentFeature = parentFeatureElem.GetCLO();
                    for (var i = 0; i < childFeatureElems.length; i++) {
                        newGroupRelationCLO.ChildFeatures.Add(childFeatureElems[i].GetCLO());
                        childFeatureElems[i].GetCLO().RelatedCLOS.Add(newGroupRelationCLO);
                    }
                    parentFeatureElem.GetCLO().RelatedCLOS.Add(newGroupRelationCLO);


                    // Add it to the FeatureModel and then switch to default state
                    _dataModel.GetCurrentFeatureModelCLO().GroupRelations.Add(newGroupRelationCLO);
                    _innerStateManager.SwitchToState(UIComponents.VisualView.InnerStates.Default.Name);

                    document.getSelection().removeAllRanges();
                } else {
                    _innerElems.infoMsgOverlay.html("Select at least 1 parent Feature and 2 children Features...");
                    document.getSelection().removeAllRanges();
                }

            });
        },
        LeaveState: function () {
            _innerElems.infoMsgOverlay.html("").hidden();

            // Restore the old feature onclick handler
            featureElemHandlers.onClicked = this.normalFeatureElemOnclick;
            delete this.normalFeatureElemOnclick;

            // Remove other handlers
            $(_innerHtmlElem).unbind("dblclick.groupRelation");
        }
    }
    UIComponents.VisualView.InnerStates[Enums.VisualView.StateNames.CreatingNewCompositionRule] = {
        Name: "CreatingNewCompositionRule",
        EnterState: function () {
            _cloSelectionManager.ClearCLOSelection();
            _innerElems.infoMsgOverlay.html("Select the first feature for the Composition Rule...").visible();

            // Variables
            var firstFeatureElem, secondFeatureElem;

            // First step handlers (let user select parent feature)
            this.normalFeatureElemOnclick = featureElemHandlers.onClicked; // store the usual feature onclick handler
            featureElemHandlers.onClicked = firstStepClickHandler;
            function firstStepClickHandler(featureElem) {
                firstFeatureElem = featureElem;
                _cloSelectionManager.ForceCLOSelection(firstFeatureElem.GetCLO());

                // Prepare for the second step
                featureElemHandlers.onClicked = secondStepClickHandler;
                _innerElems.infoMsgOverlay.html("Now select the second Feature...").visible();
            }

            // Second step handlers (let user select child feature)
            function secondStepClickHandler(featureElem) {
                if (featureElem === firstFeatureElem) { // check whether the user is trying to select the same feature twice
                    _innerElems.infoMsgOverlay.html("Select a different Feature...");
                } else {
                    secondFeatureElem = featureElem;
                    _cloSelectionManager.ForceCLOSelection(secondFeatureElem.GetCLO());

                    // Create a new CLO
                    var newCompositionRuleCLO = _dataModel.CreateNewCLO(CLOTypes.CompositionRule);
                    newCompositionRuleCLO.FirstFeature = firstFeatureElem.GetCLO();
                    newCompositionRuleCLO.SecondFeature = secondFeatureElem.GetCLO();
                    firstFeatureElem.GetCLO().RelatedCLOS.Add(newCompositionRuleCLO);
                    secondFeatureElem.GetCLO().RelatedCLOS.Add(newCompositionRuleCLO);

                    // Add it to the FeatureModel and then switch to default state
                    _dataModel.GetCurrentFeatureModelCLO().CompositionRules.Add(newCompositionRuleCLO);
                    _innerStateManager.SwitchToState(UIComponents.VisualView.InnerStates.Default.Name);
                }
            }
        },
        LeaveState: function () {
            _innerElems.infoMsgOverlay.html("").hidden();

            // Restore the old feature onclick handler
            featureElemHandlers.onClicked = this.normalFeatureElemOnclick;
            delete this.normalFeatureElemOnclick;
        }
    }
}