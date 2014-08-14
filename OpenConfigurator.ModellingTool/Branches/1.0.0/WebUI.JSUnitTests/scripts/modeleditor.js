// Settings and defaults
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
        },
        SelectionRectangle: {
            Box: {
                attr: {
                    stroke: "#D8D7D6",
                    "stroke-dasharray": "-"
                }
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
    this.Name = new ObservableField(_innerBLO, "Name");
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
var RelationCLO = function (clientID, blo) {

    // Fields
    var _clientID = clientID, _innerBLO = blo;
    var _parentFeatureCLO = null, _childFeatureCLO = null;

    var _this = this;

    // Properties
    this.GetClientID = function () {
        return _clientID;
    };
    this.GetType = function() {
        return CLOTypes.Relation;
    };
    this.ParentFeature = _parentFeatureCLO;
    this.ChildFeature = _childFeatureCLO;
    this.Name = new ObservableField(_innerBLO, "Name");
    this.Features = new ObservableCollection();
    this.CompositionRules = new ObservableCollection();

    // Init
    this.Initialize = function () {

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
    this.Identifier = new ObservableField(_innerBLO, "Identifier");
    this.Name = new ObservableField(_innerBLO, "Name");
    this.XPos = new ObservableField(_innerBLO, "XPos");
    this.YPos = new ObservableField(_innerBLO, "YPos");

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
        _visualView.UIElementSelected.AddHandler(new EventHandler(_modelExplorer.OnRelatedViewUIElementSelected));
        _visualView.UIElementDeselected.AddHandler(new EventHandler(_modelExplorer.OnRelatedViewUIElementDeselected));
        _modelExplorer.UIElementSelected.AddHandler(new EventHandler(_visualView.OnRelatedViewUIElementSelected));
        _modelExplorer.UIElementDeselected.AddHandler(new EventHandler(_visualView.OnRelatedViewUIElementDeselected));

        // Key handlers
        $(document).keydown(function (e) {
            if (e.which == 46) { //del key
                _this.Delete();
            }
            $.ctrl('F', function () { // create Feature
                _this.AddNewFeature();
            });
            $.ctrl('R', function () { // create Relation
                _this.AddNewRelation();
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
    this.AddNewRelation = function () {
        _visualView.StartCreateRelation();
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
        Relation: function (blo) {

            //
            var newClientID = getNewClientID();
            var newCLO = new RelationCLO(newClientID, blo);
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
    this.ConvertToCLOFromBLO = function (cloType, blo) {

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
        onNodeClicked: onNodeClicked
    };
    var _selectedElements = [];
    var _this = this;

    // Private methods
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
    function selectElement(node, raiseEvents) {

        // Set the node to be selected
        $(node).setNodeSelected();
        _selectedElements.push(node);

        // Raise events
        if (raiseEvents === true) {
            var clientid = $(node).getNodeDataID();
            _this.UIElementSelected.RaiseEvent(clientid);
        }
    }
    function deselectElement(node, raiseEvents) {

        // Deselect the node and remove it from the collection
        var index = $(_selectedElements).index(node);
        _selectedElements.splice(index, 1);
        $(node).setNodeUnselected();

        // Raise events
        if (raiseEvents === true) {
            var clientid = $(node).getNodeDataID();
            _this.UIElementDeselected.RaiseEvent(clientid);
        }
    }
    function clearSelection() {
        for (var i = _selectedElements.length - 1; i >= 0; i--) {
            deselectElement(_selectedElements[i], true);
        }
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
    this.Focus = new Event();
    this.UIElementSelected = new Event();
    this.UIElementDeselected = new Event();

    // Event handlers
    this.OnModelLoaded = function (modelCLO) {

        // Bind to it
        modelCLO.Features.Added.AddHandler(new EventHandler(modelHandlers.onFeatureAdded));
        modelCLO.CompositionRules.Added.AddHandler(new EventHandler(modelHandlers.onCompositionRuleAdded));
    }
    this.OnRelatedViewUIElementSelected = function (clientid) {
        var node = $(_tree).getNode(clientid);
        if (node != null) {
            selectElement(node);
        }
    }
    this.OnRelatedViewUIElementDeselected = function (clientid) {
        var node = $(_tree).getNode(clientid);
        if (node != null) {
            deselectElement(node);
        }
    }
    function onNodeClicked(node, ctrlKey) {

        // If control key isnt used, clear out any currently selected elements
        if (ctrlKey !== true) {
            clearSelection();
        }

        // Select or deselect the uiElem
        if ($(node).isNodeSelected() === true) {
            deselectElement(node, true);
        } else {
            selectElement(node, true);
        }
    };
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
    var _innerModeManager = null;
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
    function selectElement(uiElem, raiseEvents) {

        // Add it to the local collection and set its selectionState
        _selectedElements.push(uiElem);
        uiElem.SetSelectedState(Enums.UIElementStates.Selected);

        // Raise events
        if (raiseEvents === true) {
            _this.UIElementSelected.RaiseEvent(uiElem.GetCLO().GetClientID());
        }
    }
    function deselectElement(uiElem, raiseEvents) {

        // Remove it from the local collection and sets its selectionState
        if (uiElem.IsSelected() == true) {
            var index = $(_selectedElements).index(uiElem);
            _selectedElements.splice(index, 1);
            uiElem.SetSelectedState(Enums.UIElementStates.Unselected);
        }

        // Raise events
        if (raiseEvents === true) {
            _this.UIElementDeselected.RaiseEvent(uiElem.GetCLO().GetClientID());
        }
    }
    function clearSelection() {
        for (var i = _selectedElements.length - 1; i >= 0; i--) {
            deselectElement(_selectedElements[i], true);
        }
    }
    function selectElementsInArea(targetBbox) {

        // Loop through all selected UI elements and select them if they are within the targetBox bounds
        for (var clientid in _visualUIElems) {
            var elem = _visualUIElems[clientid];

            if (elem.IsWithinBounds(targetBbox)) {
                selectElement(elem, true);
            }
        }
    }

    // Init
    this.Initialize = function () {

        // Setup
        _canvasContainer = $(_container).find("#SVGCanvasWrapper");
        _innerElems.headerLabel = $(_container).find(".headerLabel");
        _canvas = Raphael($(_canvasContainer).children("#SVGCanvas")[0], "100%", "100%");
        _innerModeManager = new InnerStateManager(UIControls.VisualView.InnerStates, UIControls.VisualView.InnerStates.Default.Name);
        _innerModeManager.Initialize(); // setup mode manager and enter initial mode

        // Handler for onFocus
        $(_container).bind("click", function (e) {
            _this.Focus.RaiseEvent();
        });
    };

    // Public methods
    this.StartCreateFeature = function () {
        _innerModeManager.SwitchToMode(UIControls.VisualView.InnerStates.CreatingNewFeature.Name);
    }
    this.StartCreateRelation = function () {
        _innerModeManager.SwitchToMode(UIControls.VisualView.InnerStates.CreatingNewRelation.Name);
    }

    // Events
    this.Focus = new Event();
    this.UIElementSelected = new Event();
    this.UIElementDeselected = new Event();

    // Event handlers
    this.OnModelLoaded = function (modelCLO) {

        // Bind to it
        _currentModelCLO = modelCLO;
        modelCLO.Features.Added.AddHandler(new EventHandler(modelHandlers.onFeatureAdded));
    }
    this.OnRelatedViewUIElementSelected = function (clientid) {
        
        // Find the uiElem and sync its selectionState
        var uiElem = _visualUIElems[clientid];
        if (uiElem !== undefined) {
            selectElement(uiElem);
        }
    }
    this.OnRelatedViewUIElementDeselected = function (clientid) {

        // Find the uiElem and sync its selectionState
        var uiElem = _visualUIElems[clientid];
        if (uiElem !== undefined) {
            deselectElement(uiElem);
        }
    }
    var modelHandlers = {
        onFeatureAdded: function (featureCLO) {
            addFeatureElem(featureCLO);
        }
    }
    var featureElemHandlers = {
        onClicked: function (uiElem, ctrlKey) {
            // If control key isnt used, clear out any currently selected elements
            if (ctrlKey !== true) {
                clearSelection();
            }

            // Select or deselect the uiElem
            if (uiElem.IsSelected() === true) {
                deselectElement(uiElem, true);
            } else {
                selectElement(uiElem, true);
            }
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

    // Inner modes
    UIControls.VisualView.InnerStates = {
        Default: {
            Name: "Default",
            EnterMode: function () {

                // Variables
                var selectionRectangle = null, mouseDownPoint = null;

                // Mousedown handler
                $(_canvasContainer).bind("mousedown.canvas", function (e) {
                    if (e.target.nodeName === "svg" && e.ctrlKey !== true) {
                        var initialX = e.pageX - $(_canvasContainer).offset().left + 0.5;
                        var initialY = e.pageY - $(_canvasContainer).offset().top + 0.5;
                        mouseDownPoint = { x: initialX, y: initialY };
                        selectionRectangle = _canvas.rect(mouseDownPoint.x, mouseDownPoint.y, 0, 0, 0).attr(UIStyles.Common.SelectionRectangle.Box.attr);
                    }
                });

                // Mouseup handler
                $(_canvasContainer).bind("mouseup.canvas", function (e) {
                    if (mouseDownPoint !== null) {

                        // Clear any previously selected elements and try to select elements lying within the selectionRectangle
                        clearSelection(true);
                        selectElementsInArea(selectionRectangle.getBBox());

                        //
                        mouseDownPoint = null;
                        selectionRectangle.remove();
                    }
                });

                // Mousemove handler
                $(_canvasContainer).bind("mousemove.canvas", function (e) {
                    // Mouse move
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
            },
            LeaveMode: function () {
                $(_canvasContainer).unbind("click.canvas");
                $(_canvasContainer).unbind("mousedown.canvas");
                $(_canvasContainer).unbind("mouseup.canvas");
                $(_canvasContainer).unbind("mousemove.canvas");
            }
        },
        CreatingNewFeature: {
            Name: "CreatingNewFeature",
            EnterMode: function () {

                // Create a wireframe
                var boxWidth = UIStyles.Feature.General.Box.Dimensions.width * _scaleModifier;
                var boxHeight = UIStyles.Feature.General.Box.Dimensions.height * _scaleModifier;
                var wireframe = _canvas.rect(-100, -100, boxWidth, boxHeight, 0).attr(UIStyles.Feature.States.Wireframe.Box.attr);

                // Attach a mouse move handler for the wireframe
                $(_canvasContainer).bind("mousemove", function (e) {
                    var screenPosX = (e.pageX - $(_canvasContainer).offset().left + 0.5 - boxWidth / 2);
                    var screenPosY = (e.pageY - $(_canvasContainer).offset().top + 0.5 - boxHeight / 2);
                    wireframe.attr({ x: screenPosX, y: screenPosY });
                });

                // Attach click handler to create the actual Feature when clicked
                $(_canvasContainer).bind("click.createFeature", function (e) {

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
                    _innerModeManager.SwitchToMode(UIControls.VisualView.InnerStates.Default.Name);
                });
            },
            LeaveMode: function () {
                $(_canvasContainer).unbind("click.createFeature");
            }
        },
        CreatingNewRelation: {
            Name: "CreatingNewRelation",
            EnterMode: function () {
                alert("create relation !");
                
            },
            LeaveMode: function () {
                
            }
        }
    }
}
UIControls.VisualView.ElemTypes = {
    FeatureElem: "FeatureElem",
    RelationElem : "RelationElem"
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
    this.IsWithinBounds = function (targetBbox) {

        // Check whether the points are within the targetBbox
        var ownBbox = _outerElement.getBBox();
        if (Raphael.isPointInsideBBox(targetBbox, ownBbox.x, ownBbox.y) && Raphael.isPointInsideBBox(targetBbox, ownBbox.x2, ownBbox.y2)) {
            return true;
        } else {
            return false;
        }
    }
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
UIControls.VisualView.RelationElem = function(relationCLO, parentCanvasInstance) {

}