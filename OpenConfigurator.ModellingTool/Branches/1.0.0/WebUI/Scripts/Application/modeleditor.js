//Settings and defaults
var Settings = {

}
var UIStyles = {
    Common: {
        Glow: {
            attr: {
                width: 10,
                opacity: 0.5,
                color: "black"
            }
        },
        Connection: {
            States: {
                Unselected: {
                    Line: {
                        attr: {
                            fill: "none",
                            stroke: "#CDCDCD",
                            "stroke-width": 1.5,
                            "stroke-linejoin": "round"
                        }
                    }
                },
                Selected: {
                    Line: {
                        attr: {
                            stroke: "Black",
                            fill: "none",
                            "stroke-width": 2
                        }
                    }
                }
            }
        },
        OuterElement: {
            attr: {
                stroke: "black",
                fill: "black",
                "stroke-width": 15,
                opacity: 0,
                cursor: "default"
            }
        }
    },
    Feature: {
        General: {
            Box: {
                Dimensions: {
                    width: 90,
                    height: 20,
                    maxWidth: 150,
                    paddingLeftRight: 3
                }
            },
            Text: {
                "font-size": 10
            }
        },
        States: {
            Unselected: {
                Box: {
                    attr: {
                        fill: "#F0FBBD",
                        stroke: "#A6C70C",
                        "stroke-width": 0.5,
                        opacity: 1
                    }
                },
                Line: {
                    attr: {
                        fill: "#E1E9FF",
                        stroke: "#CECECE",
                        "stroke-width": 1,
                        opacity: 1
                    }
                },
                Text: {
                    attr: {
                        cursor: "default"
                    }
                }
            },
            Selected: {
                Box: {
                    attr: {
                        fill: "#BCEA51",
                        stroke: "black",
                        "stroke-width": 1,
                        opacity: 1
                    }
                },
                Text: {
                    attr: {
                        cursor: "default",
                        fill: "red"
                    }
                }
            },
            Wireframe: {
                Box: {
                    attr: {
                        fill: "#E4E4E4",
                        stroke: "Gray",
                        "stroke-width": 1.2,
                        opacity: 0.5
                    }
                },
                Text: {
                    attr: {
                        opacity: 0
                    }
                }
            }
        }
    }
}
var Enums = {
    UIElementStates: {
        Selected: "Selected",
        Unselected: "Unselected",
        Wireframe: "Wireframe"
    }
}

// CLOs
var CLOTypes = {
    Model: "Model",
    Feature: "Feature",
    Attribute: "Attribute",
    Relation: "Relation",
    GroupRelation: "GroupRelation",
    CompositionRule: "CompositionRule",
    CustomRule: "CustomRule",
    CustomFunction: "CustomFunction"
}
var ModelCLO = function (clientID, blo) {

    // Fields
    var _clientID = clientID, _innerBLO = blo;
    var _this = this;

    // Properties
    this.GetClientID = function () {
        return _clientID;
    };
    this.GetType = function () {
        return CLOTypes.Model;
    }
    this.Features = new ObservableCollection();
    this.CompositionRules = new ObservableCollection();


    // Private methods
    function getNewIdentifier(cloType, collection) {
        var identifier = cloType + "_" + collection.GetLength();
        var name = cloType + " " + collection.GetLength();

        return {
            identifier: identifier,
            name: name
        };
    }

    // Init
    this.Initialize = function () {

        // Bind to collections
        _this.Features.Adding.AddHandler(new EventHandler(onCLOAdding));
        //_compositionRulesCollection.CLOAdding.AddHandler(new EventHandler(onCLOAdding));
    }

    // Event handlers
    var onCLOAdding = function (clo, eventRaiseDetails) {

        // If the clo to be added doesnt have an identifier (it is new), provide it with one
        if (clo.Identifier() === null) {
            var collection = _this[clo.GetType() + "s"]; // get the collection corresponding to the type of the given CLO 
            var identity = getNewIdentifier(clo.GetType(), collection);

            clo.Identifier(identity.identifier);
            clo.Name(identity.name);
        }

        //
        if (_this.Features.GetLength() > 0) {

            _this.Features.GetAt(0).Name("Newname");
        }
    }
}
var FeatureCLO = function (clientID, blo) {

    // Fields
    var _clientID = clientID, _innerBLO = blo;
    var _attributes = [];
    var _this = this;

    // Properties
    this.GetClientID = function () {
        return _clientID;
    };
    this.GetType = function () {
        return CLOTypes.Feature;
    }
    this.Attributes = new ObservableCollection();
    this.Identifier = ko.observable(_innerBLO.Identifier);
    //this.Name = ko.observable(_innerBLO.Name);
    this.Name = new ObservableField(_innerBLO, "Name");
    this.XPos = ko.observable(_innerBLO.XPos);
    this.YPos = ko.observable(_innerBLO.YPos);

    // Init
    this.Initialize = function () {

    }
}
var CompositionRuleCLO = function (clientID, blo) {

    // Fields
    var _clientID = clientID, _innerBLO = blo;
    var _attributes = [];
    var _this = this;

    // Properties
    this.GetClientID = function () {
        return _clientID;
    };
    this.GetType = function () {
        return CLOTypes.CompositionRule;
    }

    // Init
    this.Initialize = function () {

    }
}
var CustomRuleCLO = function (clientID, blo) {

    // Fields
    var _clientID = clientID, _innerBLO = blo;
    var _attributes = [];
    var _this = this;

    // Properties
    this.GetClientID = function () {
        return _clientID;
    };
    this.GetType = function () {
        return CLOTypes.CustomRule;
    }

    // Init
    this.Initialize = function () {

    }
}
var CustomFunctionCLO = function (clientID, blo) {

    // Fields
    var _clientID = clientID, _innerBLO = blo;
    var _attributes = [];
    var _this = this;

    // Properties
    this.GetClientID = function () {
        return _clientID;
    };
    this.GetType = function () {
        return CLOTypes.CustomFunction;
    }

    // Init
    this.Initialize = function () {

    }
}

// Logical components
var Controller = function () {

    // Fields
    var _dataModel = null;
    var _visualView = null, _commandToolbar = null, _modelExplorer = null;
    var _currentControlFocus = null; //variable to keep track of where the user executed the last action (clicking)
    var _this = this;

    // Init
    this.Initialize = function () {

        // Init children
        _dataModel = new DataModel();
        _dataModel.Initialize();
        _visualView = new UIControls.VisualView($("#modelDiagramBox"), _dataModel);
        _visualView.Initialize();
        _modelExplorer = new UIControls.ModelExplorer($("#modelExplorerTree"), _dataModel);
        _modelExplorer.Initialize();
        _commandToolbar = new UIControls.CommandToolbar($("#toolBar"), _this);
        _commandToolbar.Initialize();

        // Setup events and handlers
        _dataModel.ModelLoaded.AddHandler(new EventHandler(_visualView.OnModelLoaded));
        _dataModel.ModelLoaded.AddHandler(new EventHandler(_modelExplorer.OnModelLoaded));
        _visualView.ElementSelectToggled.AddHandler(new EventHandler(_modelExplorer.OnRelatedViewElementSelectToggled));
        _visualView.SelectionCleared.AddHandler(new EventHandler(_modelExplorer.OnRelatedViewSelectionCleared));
        _modelExplorer.ElementSelectToggled.AddHandler(new EventHandler(_visualView.OnRelatedViewElementSelectToggled));

        // Key handlers
        $(document).keydown(function (e) {
            if (e.which == 46) { //del key
                _this.Delete();
            }
            $.ctrl('F', function () { //create Feature
                _this.AddNewFeature();
            });
        });

        // Focus handlers
        _visualView.Focus.AddHandler(new EventHandler(function () {
            onViewFocused(_visualView);

        }));
        _modelExplorer.Focus.AddHandler(new EventHandler(function () {
            onViewFocused(_modelExplorer);
        }));
    }

    // Public methods
    this.NewModel = function () {
        _dataModel.LoadNewModel();
    }
    this.AddNewFeature = function () {
        _visualView.StartCreateFeature();
    }
    this.AddNewCompositionRule = function () {
        var newCompRuleCLO = _dataModel.CreateNewCLO(CLOTypes.CompositionRule);
        _dataModel.GetCurrentModelCLO().CompositionRules.Add(newCompRuleCLO);
    }
    this.Delete = function () {
        if (_currentControlFocus === _visualView) {
            alert("delete within visual view!");
        } else if (_currentControlFocus === _modelExplorer) {
            alert("delete within model explorer view!");
        }
    }

    // Event handlers
    var onViewFocused = function (viewInFocus) {
        if (_currentControlFocus !== viewInFocus) {
            _currentControlFocus = viewInFocus;
        }
    }
}
var DataModel = function (bloService, cloFactory) {

    // Fields
    var _bloService = bloService, _cloFactory = cloFactory;
    var _currentModelCLO = null;
    var _this = this;

    // Properties
    this.GetCurrentModelCLO = function () {
        return _currentModelCLO;
    }

    // Init
    this.Initialize = function () {

        // Instantiate inner classes
        if (_bloService === null || _bloService === undefined) {
            _bloService = new DataModel.BLOService();
            _bloService.Initialize();
        }
        if (_cloFactory === null || _cloFactory === undefined) {
            _cloFactory = new DataModel.CLOFactory(_bloService);
            _cloFactory.Initialize();
        }
    }

    // Public methods
    this.CreateNewCLO = function (cloType) {
        return _cloFactory.CreateNewCLO(cloType);
    }
    this.GetByClientID = function (clientID) {
        return _cloFactory.GetByClientID(clientID);
    }
    this.LoadNewModel = function () {

        // Init a new ModelCLO
        _currentModelCLO = _cloFactory.CreateNewCLO(CLOTypes.Model);
        _this.ModelLoaded.RaiseEvent(_currentModelCLO);
    }

    // Events
    this.ModelLoaded = new Event();
}
DataModel.CLOFactory = function (bloService) {

    var FromBLO = {
        Model: function (blo) {

            //
            var newClientID = getNewClientID();
            var newCLO = new ModelCLO(newClientID, blo);
            newCLO.Initialize();

            //
            return newCLO;
        },
        Feature: function (blo) {

            //
            var newClientID = getNewClientID();
            var newCLO = new FeatureCLO(newClientID, blo);
            newCLO.Initialize();

            //
            return newCLO;
        },
        CompositionRule: function (blo) {

            //
            var newClientID = getNewClientID();
            var newCLO = new CompositionRuleCLO(newClientID, blo);
            newCLO.Initialize();

            //
            return newCLO;
        }
    }

    // Fields
    var _bloService = bloService;
    var _clientIDCounter = 0, _factoryCLORegister = {};
    var _this = this;

    // Private methods
    function getNewClientID() {
        _clientIDCounter += 1;
        return _clientIDCounter;
    }

    // Init
    this.Initialize = function () {
    }

    // Public methods
    this.GetByClientID = function (clientID) {
        return _factoryCLORegister[clientID];
    }
    this.CreateCLOFromBLO = function (cloType, blo) {

        // Create the CLO
        var newCLO = FromBLO[cloType](blo);

        // Register and return it
        _factoryCLORegister[newCLO.GetClientID()] = newCLO;
        return newCLO;
    }
    this.CreateNewCLO = function (cloType) {

        // Create the CLO
        var defaultBLO = _bloService.GetDefaultBLO(cloType);
        var newDefaultCLO = FromBLO[cloType](defaultBLO);

        // Register and return it
        _factoryCLORegister[newDefaultCLO.GetClientID()] = newDefaultCLO;
        return newDefaultCLO;
    }
}
DataModel.BLOService = function () {

    // Fields
    var _this = this;

    // Init
    this.Initialize = function () {

    }

    // Public methods
    this.GetDefaultBLO = function (bloTypeName) {

        var newDefaultBLO = null;
        $.ajax({
            type: "Get",
            url: "api/GlobalAPI/CreateDefaultBLO",
            data: { bloName: bloTypeName },
            async: false,
            success: function (response) {
                newDefaultBLO = response;
            }
        });

        return newDefaultBLO;
    }
}

// UIControls
var UIControls = {};
UIControls.CommandToolbar = function (container, controller) {

    // Fields
    var _container = container, _controller = controller;
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

    // Init
    this.Initialize = function () {

        // Get references to html elems
        _container = container;
        _innerElems.modelManipulationItems.newFeatureItem = $(_container).find("#newFeatureItem");
        _innerElems.modelManipulationItems.newRelationItem = $(_container).find("#newRelationItem");
        _innerElems.modelManipulationItems.newGroupRelationItem = $(_container).find("#newGroupRelationItem");
        _innerElems.modelManipulationItems.newCompositionRuleItem = $(_container).find("#newCompositionRuleItem");

        // Set event handlers
        $(_innerElems.modelManipulationItems.newFeatureItem).bind("click", function () {
            _controller.AddNewFeature();
        });
        $(_innerElems.modelManipulationItems.newRelationItem).bind("click", function () {
            _controller.AddNewRelation();
        });
        $(_innerElems.modelManipulationItems.newGroupRelationItem).bind("click", function () {
            _controller.AddNewGroupRelation();
        });
        $(_innerElems.modelManipulationItems.newCompositionRuleItem).bind("click", function () {
            _controller.AddNewCompositionRule();
        });
    }
}
UIControls.ModelExplorer = function (container, dataModel) {

    // Fields
    var _container = container, _dataModel = dataModel;
    var _tree = null, _treeOptions = {
        data: [
                {
                    ID: "compositionRulesNode",
                    Name: "Composition Rules",
                    typeName: "folder"
                },
                {
                    ID: "customRulesNode",
                    Name: "Custom Rules",
                    typeName: "folder"
                },
                {
                    ID: "customFunctionsNode",
                    Name: "Custom Functions",
                    typeName: "folder"
                },
                {
                    ID: "featuresNode",
                    Name: "Features",
                    typeName: "folder"
                }
        ],
        types: {
            folder: {
                idField: "ID",
                labelField: "Name",
                selectable: false
            },
            feature: {
                idField: "ID",
                labelField: "Name",
                selectable: true
            },
            compositionRule: {
                idField: "ID",
                labelField: "Name",
                selectable: true
            },
            customRule: {
                idField: "ID",
                labelField: "Name",
                selectable: true
            },
            customFunction: {
                idField: "ID",
                labelField: "Name",
                selectable: true
            }
        },
        onNodeClicked: function (node, ctrl) {
            toggleElementSelect(node, ctrl, true);
        }
    };
    var _this = this;

    // Private methods
    function setElementSelected(node) {
        $(node).setNodeSelected();
    }
    function setElementUnselected(node) {
        $(node).setNodeUnselected();
    }
    function clearSelection(raiseEvents) {
        $(_tree).deselectAll();

        //Raise events
        if (raiseEvents == true) {
            _this.SelectionCleared.RaiseEvent();
        }
    }
    function toggleElementSelect(node, ctrl, raiseEvents) {
        if (ctrl !== true) {
            clearSelection();
        }

        // Select and remember the state
        var newState = null;
        var isSelected = $(node).isNodeSelected();
        if (isSelected == true) {
            $(node).setNodeUnselected();
            newState = Enums.UIElementStates.Unselected;
        } else {
            $(node).setNodeSelected();
            newState = Enums.UIElementStates.Selected;
        }

        // Raise events
        if (raiseEvents == true) {
            var clientID = $(node).getNodeDataID();
            _this.ElementSelectToggled.RaiseEvent([clientID, ctrl, newState]);
        }
    }
    function addElement(clo, nodeType) {

        // Create a new element 
        var name = clo.Name();
        var newDataRow = {
            ID: clo.GetClientID(),
            Name: name,
            typeName: nodeType
        };

        // Add it to its parent node
        var parentNode = $(_tree).getNode(nodeType + "sNode");
        var newNode = $(parentNode).addNewChildNode(newDataRow);

        // Bind it to the CLO
        clo.Name.Changed.AddHandler(new EventHandler(function (newValue) {
            $(newNode).updateNodeName(newValue);
        }));

        //
        return newNode;
    }

    // Init
    this.Initialize = function () {

        // Create simpleTree
        _tree = $(_container).simpleTree(_treeOptions);

        // Handler for onFocus
        $(_container).bind("click", function (e) {
            _this.Focus.RaiseEvent();
        });
    }

    // Events
    this.ElementSelectToggled = new Event();
    this.Focus = new Event();

    // Event handlers
    this.OnModelLoaded = function (modelCLO) {

        // Bind to it
        modelCLO.Features.Added.AddHandler(new EventHandler(modelHandlers.onFeatureAdded));
        modelCLO.CompositionRules.Added.AddHandler(new EventHandler(modelHandlers.onCompositionRuleAdded));
    }
    this.OnRelatedViewElementSelectToggled = function (clientid, ctrl, newState) {
        var node = $(_tree).getNode(clientid);
        if (node != null) {
            toggleElementSelect(node, ctrl);
        }
    }
    this.OnRelatedViewSelectionCleared = function () {
        clearSelection();
    }
    var modelHandlers = {
        onFeatureAdded: function (featureCLO) {
            addElement(featureCLO, "feature");
        },
        onCompositionRuleAdded: function (compRuleCLO) {
            addElement(compRuleCLO, "compositionRule");
        }
    }
}
UIControls.VisualView = function (container, dataModel) {

    // Fields
    var _container = container, _dataModel = dataModel;
    var _canvasContainer = null, _canvas = null;
    var _innerElems = {
        headerLabel: null
    };
    var _scaleModifier = 1;
    var _currentModelCLO = null;
    var _visualUIElems = {}, _selectedElements = [];
    var _this = this;

    // Private methods
    function addFeatureElem(featureCLO) {

        // Create a new feature
        var newFeatureElem = new UIControls.VisualView.FeatureElem(featureCLO, _canvas);
        newFeatureElem.Initialize();
        _visualUIElems[featureCLO.GetClientID()] = newFeatureElem;

        // Bind to it
        newFeatureElem.Clicked.AddHandler(new EventHandler(function (ctrlKey) {
            featureElemHandlers.onClicked(newFeatureElem, ctrlKey);
        }));
        newFeatureElem.MoveStarted.AddHandler(new EventHandler(function () {
            featureElemHandlers.onFeatureMoveStarted(newFeatureElem);
        }));
        newFeatureElem.Moving.AddHandler(new EventHandler(function (dx, dy) {
            featureElemHandlers.onFeatureMoving(newFeatureElem, dx, dy);
        }));
    }
    function toggleElementSelect(uiElem, ctrl, raiseEvents) {

        if (ctrl !== true) {
            clearSelection(); // if control key isnt used, clear out any currently selected elements, before selecting the new one
        }

        // Select or deselect the uiElem
        var newState = null;
        if (uiElem.IsSelected() === true) { // deselect it, if it's already selected
            deselectElement(uiElem);
            newState = Enums.UIElementStates.Unselected;
        } else { // select it, if its unselected
            setElementSelected(uiElem);
            newState = Enums.UIElementStates.Selected;
        }

        // Raise events
        if (raiseEvents === true) {
            _this.ElementSelectToggled.RaiseEvent(uiElem.GetCLO().GetClientID(), ctrl, newState);
        }
    }
    function setElementSelected(uiElem) {
        _selectedElements.push(uiElem); // add it to the local collection
        uiElem.SetSelectedState(Enums.UIElementStates.Selected);

    }
    function deselectElement(uiElem) {
        if (uiElem.IsSelected() == true) {
            var index = $(_selectedElements).index(uiElem);
            _selectedElements.splice(index, 1); // remove it from the local collection
            uiElem.SetSelectedState(Enums.UIElementStates.Unselected);
        }
    }
    function clearSelection(raiseEvents) {
        for (var i = _selectedElements.length - 1; i >= 0; i--) {
            deselectElement(_selectedElements[i]);
        }

        //Raise events
        if (raiseEvents === true) {
            _this.SelectionCleared.RaiseEvent();
        }
    }

    // Init
    this.Initialize = function () {

        // Setup
        _canvasContainer = $(_container).find("#SVGCanvasWrapper");
        _innerElems.headerLabel = $(_container).find(".headerLabel");
        _canvas = Raphael($(_canvasContainer).children("#SVGCanvas")[0], "100%", "100%");

        // Handler for canvas click
        $(_canvasContainer).bind("click.canvas", function (e) {
            if (e.target.nodeName === "svg" && e.ctrlKey !== true) {
                clearSelection(true);
            }
        });

        // Handler for onFocus
        $(_container).bind("click", function (e) {
            _this.Focus.RaiseEvent();
        });
    };

    // Public methods
    this.StartCreateFeature = function () {

        // Setup wireframe
        var boxWidth = UIStyles.Feature.General.Box.Dimensions.width * _scaleModifier;
        var boxHeight = UIStyles.Feature.General.Box.Dimensions.height * _scaleModifier;
        var wireframe = _canvas.rect(-100, -100, boxWidth, boxHeight, 0).attr(UIStyles.Feature.States.Wireframe.Box.attr);

        // Attach a mouse move handler
        var mousemoveHandler = function (e) {
            var screenPosX = (e.pageX - $(_canvasContainer).offset().left + 0.5 - boxWidth / 2);
            var screenPosY = (e.pageY - $(_canvasContainer).offset().top + 0.5 - boxHeight / 2);
            wireframe.attr({ x: screenPosX, y: screenPosY });
        };
        $(_canvasContainer).bind("mousemove", mousemoveHandler);

        // Attach click handler to create the actual Feature 
        var clickHandler = function (e) {

            // Get the position
            var absolutePosX = (e.pageX - $(_canvasContainer).offset().left + 0.5 - boxWidth / 2) / _scaleModifier;
            var absolutePosY = (e.pageY - $(_canvasContainer).offset().top + 0.5 - boxHeight / 2) / _scaleModifier;

            // Create a new clientObject in the diagramDataModel
            var newFeatureCLO = _dataModel.CreateNewCLO(CLOTypes.Feature);
            newFeatureCLO.XPos(absolutePosX);
            newFeatureCLO.YPos(absolutePosY);
            _dataModel.GetCurrentModelCLO().Features.Add(newFeatureCLO);

            // Remove the wireframe
            wireframe.remove();
            $(_canvasContainer).unbind("click.wireframe");
        };
        $(_canvasContainer).bind("click.wireframe", clickHandler);
    }

    // Events
    this.Focus = new Event();
    this.ElementSelectToggled = new Event();
    this.SelectionCleared = new Event();

    // Event handlers
    this.OnModelLoaded = function (modelCLO) {

        // Bind to it
        _currentModelCLO = modelCLO;
        modelCLO.Features.Added.AddHandler(new EventHandler(modelHandlers.onFeatureAdded));
    }
    this.OnRelatedViewElementSelectToggled = function (clientid, ctrl, newState) {
        var uiElem = _visualUIElems[clientid];
        if (uiElem !== undefined) {
            toggleElementSelect(uiElem, ctrl);
        } else {
            clearSelection();
        }
    }
    var modelHandlers = {
        onFeatureAdded: function (featureCLO) {
            addFeatureElem(featureCLO);
        }
    }
    var featureElemHandlers = {
        onClicked: function (uiElem, ctrlKey) {
            toggleElementSelect(uiElem, ctrlKey, true);
        },
        onFeatureMoveStarted: function (uiElem) {
            if (_selectedElements.length > 1) {

                // Start move for all the other selected featureElems
                for (var i = 0; i < _selectedElements.length; i++) {
                    if (uiElem !== _selectedElements[i] && uiElem.GetType() === UIControls.VisualView.ElemTypes.FeatureElem) {
                        _selectedElements[i].StartMove();
                    }
                }
            }
        },
        onFeatureMoving: function (uiElem, dx, dy) {
            if (_selectedElements.length > 1) {

                // Move  all the other selected featureElems
                for (var i = 0; i < _selectedElements.length; i++) {
                    if (uiElem !== _selectedElements[i] && uiElem.GetType() === UIControls.VisualView.ElemTypes.FeatureElem) {
                        _selectedElements[i].MoveXYBy(dx, dy);
                    }
                }
            }
        }
    }
}
UIControls.VisualView.ElemTypes = {
    FeatureElem: "FeatureElem"
}
UIControls.VisualView.FeatureElem = function (featureCLO, parentCanvasInstance) {

    // Fields
    var _featureCLO = featureCLO, _canvasInstance = parentCanvasInstance;
    var _currentState = Enums.UIElementStates.Unselected;
    var _outerElement = null, _glow = null;
    var _cancelNextClick = false; // special variable used to disable the click event being triggered when dragging an element
    var _innerElements = {
        box: null,
        text: null
    };
    var _boxDimensions = {
        width: UIStyles.Feature.General.Box.Dimensions.width,
        height: UIStyles.Feature.General.Box.Dimensions.height
    }
    var _this = this;

    // Properties
    this.GetCLO = function () {
        return _featureCLO;
    }
    this.GetType = function () {
        return UIControls.VisualView.ElemTypes.FeatureElem;
    }
    this.IsSelected = function () {
        return _currentState === Enums.UIElementStates.Selected;
    }

    // Private methods
    function makeSelectable() {

        // Hover effect to show it is selectable
        _outerElement.mouseover(function (e) {
            if (_glow === null) {
                _glow = _innerElements.box.glow(UIStyles.Common.Glow.attr);
            }
        }).mouseout(function (e) {
            if (_glow != null) {
                _glow.remove();
                _glow = null;
            }
        });

        // Make it clickable 
        _outerElement.click(function (e) {

            // Raise events
            if (_cancelNextClick === false) {
                _this.Clicked.RaiseEvent(e.ctrlKey);
            } else {
                _cancelNextClick = false; // reset the variable so future clicks can be registered
            }

            // Prevent dom propagation - so VisualView canvas click bind doesnt get triggered
            e.stopPropagation();
        });
    }
    function makeDraggable() {

        // Drag and droppable
        var wasMoved = false;
        var start = function () {
            startMove();
        };
        move = function (dx, dy) {
            wasMoved = true;
            if (_glow !== null) {
                _glow.remove();
                _glow = null;
            }

            // Update position 
            moveXYBy(dx, dy);
        };
        up = function () {

            if (wasMoved === true) {
                _cancelNextClick = true;
            }

            //if (wasMoved == true) {

            //    // Notify related CompositeElements
            //    if (settings.diagramContext.dynamicRefresh == false) {
            //        for (var j = 0; j < _relatedCompositeElements.length; j++) {
            //            _relatedCompositeElements[j].OnAdjacentFeatureMoved(_thisUIFeature);
            //        }
            //        for (var j = 0; j < _attributeElements.length; j++) {
            //            _attributeElements[j].OnFeatureMoved(_thisUIFeature);
            //        }
            //    }

            wasMoved = false;
        };
        _outerElement.drag(move, start, up);
    }
    function startMove(supressEvents) {

        // Store original coordinates for self and inner elements
        _outerElement.originalx = _outerElement.attr("x");
        _outerElement.originaly = _outerElement.attr("y");
        for (var innerElemKey in _innerElements) {
            var innerElem = _innerElements[innerElemKey];
            innerElem.originalx = innerElem.attr("x");
            innerElem.originaly = innerElem.attr("y");
        }

        // Raise events
        if (supressEvents !== true) {
            _this.MoveStarted.RaiseEvent();
        }
    }
    function moveXYBy(dx, dy, supressEvents) {

        // Update pos of outerElement and all innerElems
        _outerElement.attr({ x: _outerElement.originalx + dx, y: _outerElement.originaly + dy });
        for (var innerElemKey in _innerElements) {
            var innerElem = _innerElements[innerElemKey];
            innerElem.attr({ x: innerElem.originalx + dx, y: innerElem.originaly + dy });
        }

        // Raise events
        if (supressEvents !== true) {
            _this.Moving.RaiseEvent(dx, dy);
        }
    }

    // Init
    this.Initialize = function () {

        // Create elements            
        _innerElements.box = _canvasInstance.rect(featureCLO.XPos(), featureCLO.YPos(), _boxDimensions.width, _boxDimensions.height, 0);
        _innerElements.box.attr(UIStyles.Feature.States[_currentState].Box.attr);
        _innerElements.text = _canvasInstance.text(_boxDimensions.width / 2 + featureCLO.XPos(), _boxDimensions.height / 2 + featureCLO.YPos(), _featureCLO.Name()).attr(UIStyles.Feature.States[_currentState].Text.attr);
        _innerElements.text.attr({ "font-size": parseFloat(UIStyles.Feature.General.Text["font-size"]) });
        _outerElement = _canvasInstance.rect(featureCLO.XPos(), featureCLO.YPos(), _boxDimensions.width, _boxDimensions.height).attr(UIStyles.Common.OuterElement.attr);

        // Setup special handlers for interactions
        makeSelectable();
        makeDraggable();

        // Bind to the featureCLO
        _featureCLO.Name.Changed.AddHandler(new EventHandler(function (newName) {
            _innerElements.text.attr({ text: newName });
        }));
    }

    // Public methods
    this.Remove = function () {

    }
    this.SetSelectedState = function (state) {
        _currentState = state;
        _innerElements.box.attr(UIStyles.Feature.States[state].Box.attr);
    }
    this.StartMove = function () {
        startMove(true);
    }
    this.MoveXYBy = function (dx, dy) {
        moveXYBy(dx, dy, true);
    }

    // Events
    this.Clicked = new Event();
    this.MoveStarted = new Event();
    this.Moving = new Event();
}