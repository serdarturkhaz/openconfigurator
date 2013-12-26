//Settings and defaults
var settings = {
    diagramContext: {
        drawCurves: true, //determines whether curves should be used for drawing relations - options: true / false
        dynamicRefresh: true, //determines whether refresh (redraw) operations are executed real-time or after a move event is completed
        displayCardinalities: "partial" //determines how many cardinalities to display - options : none / partial (only cloneable and cardinal groups) / all (all relations and groupRelations)
    }
};
var commonStyles = {
    glow: {
        attr: {
            width: 10,
            opacity: 0.5,
            color: "black"
        }
    },
    connection: {
        states: {
            unselected: {
                line: {
                    attr: {
                        fill: "none",
                        stroke: "#CDCDCD",
                        "stroke-width": 1.5,
                        "stroke-linejoin": "round"
                    }
                }
            },
            selected: {
                line: {
                    attr: {
                        stroke: "Black",
                        fill: "none",
                        "stroke-width": 2
                    }
                }
            }
        }
    },
    cardinalityLabel: {
        text: {
            attr: {
                "font-size": 12
            }
        },
        box: {
            dimensions: {
                width: 40,
                height: 20
            },
            attr: {
                opacity: 1,
                fill: "#FFFFC6",
                "stroke-width": 1,
                stroke: "#CECECE"
            }
        }
    }
}
var UIObjectStyles = {
    feature: {
        general: {
            box: {
                dimensions: {
                    width: 120,
                    height: 30,
                    maxWidth: 150,
                    paddingLeftRight: 3
                }
            },
            text: {
                "font-size": 12
            }
        },
        states: {
            unselected: {
                box: {
                    attr: {
                        fill: "#F0FBBD",
                        stroke: "#A6C70C",
                        "stroke-width": 0.5,
                        opacity: 1
                    }
                },
                line: {
                    attr: {
                        fill: "#E1E9FF",
                        stroke: "#CECECE",
                        "stroke-width": 1,
                        opacity: 1
                    }
                },
                "secondary-line": {
                    attr: {
                        stroke: "#CECECE",
                        "stroke-width": 1,
                        "text-anchor": "start",
                        "stroke-dasharray": ["- "]
                    }
                },
                text: {
                    attr: {
                        cursor: "default"
                    }
                }
            },
            selected: {
                box: {
                    attr: {
                        fill: "#BCEA51",
                        stroke: "black",
                        "stroke-width": 1,
                        opacity: 1
                    }
                },
                text: {
                    attr: {
                        cursor: "default",
                        fill: "red"
                    }
                }
            },
            wireframe: {
                box: {
                    attr: {
                        fill: "#E4E4E4",
                        stroke: "Gray",
                        "stroke-width": 1.2,
                        opacity: 0.5
                    }
                },
                text: {
                    attr: {
                        opacity: 0
                    }
                }
            }
        }
    },
    relation: {
        general: {
            connection: {
                connectors: {
                    endConnector: {
                        raphaelType: "circle",
                        dimensionModifier: 0,
                        dimensions: {
                            r: 7 //radius
                        }
                    }
                }
            }
        },
        subTypes: {
            mandatory: {
                connection: {
                    connectors: {
                        endConnector: {
                            attr: {
                                fill: "black",
                                opacity: 1
                            }
                        }
                    }
                }
            },
            optional: {
                connection: {
                    connectors: {
                        endConnector: {
                            attr: {
                                fill: "#fff7d7",
                                opacity: 1
                            }
                        }
                    }
                }
            },
            cloneable: {
                connection: {
                    connectors: {
                        endConnector: {
                            attr: {
                                fill: "#fff7d7",
                                opacity: 0
                            }
                        }
                    }
                }
            }
        }
    },
    groupRelation: {
        general: {
            rootArc: {
                attr: {
                    stroke: "Black",
                    "stroke-width": 1
                },
                dimensions: {
                    length: 35
                }
            },
            connection: {
                connectors: {
                    endConnector: {
                        raphaelType: "rect",
                        dimensionModifier: 5, //used to center rect
                        dimensions: {
                            width: 11,
                            height: 11
                        }
                    }
                }
            }
        },
        subTypes: {
            or: {
                rootArc: {
                    attr: {
                        fill: "Black",
                        opacity: 1
                    }
                },
                connection: {
                    connectors: {
                        endConnector: {
                            attr: {
                                fill: "black",
                                opacity: 1
                            }
                        }
                    }
                }

            },
            xor: {
                rootArc: {
                    attr: {
                        fill: "#ffffff",
                        opacity: 1
                    }
                },
                connection: {
                    connectors: {
                        endConnector: {
                            attr: {

                                fill: "#fff7d7",
                                opacity: 1
                            }
                        }
                    }
                }
            },
            cardinal: {
                rootArc: {
                    attr: {
                        fill: "#ffffff",
                        opacity: 0
                    }
                },
                connection: {
                    connectors: {
                        endConnector: {
                            attr: {
                                fill: "#fff7d7",
                                opacity: 0
                            }
                        }
                    }
                }
            }
        }
    },
    compositionRule: {
        general: {
            connection: {
                line: {
                    attr: {
                        "stroke-dasharray": ["- "],
                        opacity: 0.5
                    }
                },
                connectors: {
                    endConnector: {
                        raphaelType: "circle",
                        dimensionModifier: 0,
                        dimensions: {
                            r: 4 //radius
                        }
                    },
                    startConnector: {
                        raphaelType: "circle",
                        dimensionModifier: 0,
                        dimensions: {
                            r: 4 //radius
                        }
                    }
                }
            }
        },
        subTypes: {
            dependency: {
                connection: {
                    line: {
                        attr: {
                            stroke: "green"
                        }
                    },
                    connectors: {
                        startConnector: {
                            attr: {
                                fill: "red",
                                stroke: "red",
                                opacity: 0
                            }
                        },
                        endConnector: {
                            attr: {
                                fill: "green",
                                stroke: "green"
                            }
                        }
                    }
                }
            },
            mutualDependency: {
                connection: {
                    line: {
                        attr: {
                            stroke: "green"
                        }
                    },
                    connectors: {
                        startConnector: {
                            attr: {
                                fill: "green",
                                stroke: "green",
                                opacity: 1
                            }
                        },
                        endConnector: {
                            attr: {
                                fill: "green",
                                stroke: "green"
                            }
                        }
                    }
                }
            },
            mutualExclusion: {
                connection: {
                    line: {
                        attr: {
                            stroke: "red"
                        }
                    },
                    connectors: {
                        startConnector: {
                            attr: {
                                fill: "red",
                                stroke: "red",
                                opacity: 1
                            }
                        },
                        endConnector: {
                            attr: {
                                fill: "red",
                                stroke: "red"
                            }
                        }
                    }
                }
            }
        }
    }
}
var systemDefaults = {
    common: {
        outerElement: {
            attr: {
                stroke: "black",
                fill: "black",
                "stroke-width": 15,
                opacity: 0,
                cursor: "default"
            }
        }
    },
    uiElementStates: {
        selected: "selected",
        unselected: "unselected",
        wireframe: "wireframe"
    },
    enums: {
        relationTypes: {
            mandatory: {
                name: "mandatory",
                label: "Mandatory",
                id: 1,
                bounds: {
                    defaultLowerBound: 1,
                    defaultUpperBound: 1
                }
            },
            optional: {
                name: "optional",
                label: "Optional",
                id: 2,
                bounds: {
                    defaultLowerBound: 0,
                    defaultUpperBound: 1

                }
            },
            cloneable: {
                name: "cloneable",
                label: "Cloneable",
                id: 3,
                bounds: {
                    editable: true,
                    defaultLowerBound: 0,
                    defaultUpperBound: 0
                }
            }
        },
        groupRelationTypes: {
            or: {
                name: "or",
                label: "OR",
                id: 1,
                bounds: {
                    defaultLowerBound: 1,
                    defaultUpperBound: function (clientObject) {
                        return clientObject.ChildFeatures.length;
                    }
                }
            },
            xor: {
                name: "xor",
                label: "XOR",
                id: 2,
                bounds: {
                    defaultLowerBound: 1,
                    defaultUpperBound: 1
                }
            },
            cardinal: {
                name: "cardinal",
                label: "Cardinal",
                id: 3,
                bounds: {
                    editable: true,
                    defaultLowerBound: 0,
                    defaultUpperBound: function (clientObject) {
                        return clientObject.ChildFeatures.length;
                    }
                }
            }
        },
        attributeTypes: {
            constant: {
                name: "constant",
                label: "Constant Value",
                id: 1
            },
            dynamic: {
                name: "dynamic",
                label: "Dynamic Value",
                id: 2
            },
            userInput: {
                name: "userInput",
                label: "User Input",
                id: 3
            }
        },
        attributeDataTypes: {
            integer: {
                name: "integer",
                label: "Integer",
                id: 1
            },
            boolean: {
                name: "boolean",
                label: "Boolean",
                id: 2
            },
            string: {
                name: "string",
                label: "String",
                id: 3
            }
        },
        compositionRuleTypes: {
            dependency: {
                name: "dependency",
                label: "Dependency",
                id: 1
            },
            mutualDependency: {
                name: "mutualDependency",
                label: "Mutual Dependency",
                id: 2
            },
            mutualExclusion: {
                name: "mutualExclusion",
                label: "Mutual Exclusion",
                id: 3
            }
        }
    },
    orientations: {
        horizontal: {
            name: "horizontal",
            opposite: "vertical",
            cardinalityDistances: {
                groupRelation: 45,
                relation: 30
            },
            arcModifiers: { rx: 6, ry: 12 },
            arcDirection: {
                leftToRight: {
                    check: function (rootPoint, pointA) {
                        if (rootPoint.x < pointA.x) {
                            return true;
                        }
                    },
                    arcSweep: 0
                },
                rightToLeft: {
                    check: function (rootPoint, pointA) {
                        if (rootPoint.x > pointA.x) {
                            return true;
                        }
                    },
                    arcSweep: 1
                }
            },
            connections: [["left", "right"], ["right", "left"]],
            curveModifiers: [{ x: -40, y: 0 }, { x: +40, y: 0 }],
            angleIntervals: [{ min: 0, max: 45 }, { min: 136, max: 224 }, { min: 316, max: 359 }]
        },
        vertical: {
            name: "vertical",
            opposite: "horizontal",
            cardinalityDistances: {
                groupRelation: 45,
                relation: 30
            },
            arcModifiers: { rx: 12, ry: 6 },
            arcDirection: {
                upToDown: {
                    check: function (rootPoint, pointA) {
                        if (rootPoint.y < pointA.y) {
                            return true;
                        }
                    },
                    arcSweep: 0
                },
                downToUp: {
                    check: function (rootPoint, pointA) {
                        if (rootPoint.y > pointA.y) {
                            return true;
                        }
                    },
                    arcSweep: 1
                }
            },
            connections: [["top", "bottom"], ["bottom", "top"]],
            curveModifiers: [{ x: 0, y: -40 }, { x: 0, y: +40 }],
            angleIntervals: [{ min: 46, max: 135 }, { min: 225, max: 315 }]
        }
    },
    validationExpressions: {
        required: "\w+",
        numeric: {
            naturalNumbers: "^[0-9]\\d*\\.?[0]*$"
        },
        text: {
            variableName: "^[A-Za-z\_][A-Za-z0-9\_]*$"
        }
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
    var _featuresCollection = new CLOCollection();
    var _compositionRulesCollection = new CLOCollection();
    var _this = this;

    // Properties
    this.GetClientID = function () {
        return _clientID;
    };
    this.GetType = function () {
        return CLOTypes.Model;
    }
    this.Features = _featuresCollection;
    this.CompositionRules = _compositionRulesCollection;

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
        _featuresCollection.CLOAdding.AddHandler(new EventHandler(onCLOAdding));
        _compositionRulesCollection.CLOAdding.AddHandler(new EventHandler(onCLOAdding));
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
        if (_featuresCollection.GetLength() > 0) {

            _featuresCollection.GetByIndex(0).Name("Newname");
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
    this.AttributeCLOs = new CLOCollection();
    this.Identifier = ko.observable(_innerBLO.Identifier);
    this.Name = ko.observable(_innerBLO.Name);
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
var CLOCollection = function () {

    // Fields
    var _innerCLOCollection = {}, _length = 0;
    var _this = this;

    // Properties
    this.GetLength = function () {
        return _length;
    }

    // Init
    this.Initialize = function () {

    }

    // Public methods
    this.Add = function (clo) {

        // Raise pre-event
        var eventRaiseDetails = _this.CLOAdding.RaiseEvent(clo);

        // If no handlers cancelled the pre-event
        if (eventRaiseDetails.CancelTriggered() === false) {
            _innerCLOCollection[clo.GetClientID()] = clo;
            _length++;

            // Raise post-event
            _this.CLOAdded.RaiseEvent(clo);
        }
    }
    this.Remove = function (clientID) {
        var deletedCLO = _innerCLOCollection[clientID]
        delete _innerCLOCollection[clientID];
        _length--;

        //
        _this.CLORemoved.RaiseEvent(deletedCLO);
    }
    this.GetByIndex = function (index) {
        var counter = 0;
        for (var clientID in _innerCLOCollection) {
            if (counter === index) {
                return _innerCLOCollection[clientID];
            }
            counter++;
        }
    }
    this.GetByClientID = function (clientID) {
        return _innerCLOCollection[clientID];
    }
    this.GetInnerCollection = function () {
        return _innerCLOCollection;
    }

    // Events
    this.CLOAdding = new Event();
    this.CLOAdded = new Event();
    this.CLORemoved = new Event();
}



//var ObservableField = function (sourceField) {
//    // Fields
//    var _sourceField = sourceField;
//    var _currentValue = null;
//    var _this = this;
//    // Private methods
//    var setValue = function (newValue) {
//        // Update the source
//    }
//    // Events
//    var valueChanged = new Event();
//    //*Special *******************************************************************
//    return function (newValue) {
//        this.ValueChanged = valueChanged;
//    }
//    //*****************************************************************************
//}

// this.Name() - get
// this.Name("xxx") - set
// this.Name.Changed.AddHandler() -

// Logical components
var Controller = function () {

    // Fields
    var _dataModel = null;
    var _visualView = null, _commandToolbar = null, _modelExplorer = null;
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
    }

    // Public methods
    this.NewModel = function () {
        _dataModel.LoadModel();
    }
    this.AddNewFeature = function () {
        _visualView.StartCreateFeature();
    }
    this.AddNewCompositionRule = function () {
        var newCompRuleCLO = _dataModel.CreateNewCLO(CLOTypes.CompositionRule);
        _dataModel.GetCurrentModelCLO().CompositionRules.Add(newCompRuleCLO);
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
    this.LoadModel = function () {

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
            alert("node clicked!");
        }
    };
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
        clo.Name.subscribe(function (newValue) {
            $(newNode).updateNodeName(newValue);
        });

        //
        return newNode;
    }

    // Init
    this.Initialize = function () {

        // Create simpleTree
        _tree = $(_container).simpleTree(_treeOptions);
    }

    // Event handlers
    this.OnModelLoaded = function (modelCLO) {

        // Bind to it
        modelCLO.Features.CLOAdded.AddHandler(new EventHandler(modelHandlers.onFeatureAdded));
        modelCLO.CompositionRules.CLOAdded.AddHandler(new EventHandler(modelHandlers.onCompositionRuleAdded));
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
    var _innerElems = {
        headerLabel: null
    };
    var _canvasContainer = null, _canvas = null;
    var _scaleModifier = 0.75, _fixedOrientation = "vertical";
    var _currentModelCLO = null;
    var _visualUIElems = {};
    var _selectedElements = [];
    var _this = this;

    // Private methods
    function addFeatureElem(featureCLO) {

        // Create a new feature
        var newFeatureElem = new UIControls.VisualView.FeatureElem(featureCLO, _scaleModifier, _canvas);
        newFeatureElem.Initialize();
        _visualUIElems[featureCLO.GetClientID()] = newFeatureElem;

        // Bind to it
        newFeatureElem.Clicked.AddHandler(new EventHandler(function (ctrlKey) {
            featureElemHandlers.onClicked(newFeatureElem, ctrlKey);
        }));
        newFeatureElem.Moving.AddHandler(new EventHandler(function (dx,dy) {
            featureElemHandlers.onFeatureMoved(newFeatureElem, dx, dy);
        }));
    }
    function setElementSelected(uiElem) {
        if (uiElem.IsSelected() != true) {
            _selectedElements.push(uiElem); // add it to the local collection
            uiElem.SetSelectedState(systemDefaults.uiElementStates.selected);
        }
    }
    function deselectElement(uiElem) {
        if (uiElem.IsSelected() == true) {
            var index = $(_selectedElements).index(uiElem);
            _selectedElements.splice(index, 1); // remove it from the local collection
            uiElem.SetSelectedState(systemDefaults.uiElementStates.unselected);
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

        //Handler for canvas click
        $(_canvasContainer).bind("click.canvas", function (e) {
            if (e.target.nodeName === "svg" && e.ctrlKey !== true) {
                clearSelection();
            }
        });
    };

    // Public methods
    this.StartCreateFeature = function () {

        // Setup wireframe
        var boxWidth = UIObjectStyles.feature.general.box.dimensions.width * _scaleModifier;
        var boxHeight = UIObjectStyles.feature.general.box.dimensions.height * _scaleModifier;
        var wireframe = _canvas.rect(-100, -100, boxWidth, boxHeight, 0).attr(UIObjectStyles.feature.states.wireframe.box.attr);

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
    this.ElementSelectToggled = new Event();

    // Event handlers
    this.OnModelLoaded = function (modelCLO) {

        // Bind to it
        _currentModelCLO = modelCLO;
        modelCLO.Features.CLOAdded.AddHandler(new EventHandler(modelHandlers.onFeatureAdded));
    }
    var modelHandlers = {
        onFeatureAdded: function (featureCLO) {
            addFeatureElem(featureCLO);
        }
    }
    var featureElemHandlers = {
        onClicked: function (uiElem, ctrlKey) {
            if (ctrlKey !== true) {
                clearSelection(); // if control isnt used, clear out any currently selected elements, before selecting the new one
            }

            // Select or deselect the uiElem
            var newState = null;
            if (uiElem.IsSelected()) { // deselect it, if it's already selected
                deselectElement(uiElem);
                newState = systemDefaults.uiElementStates.unselected;
            } else { // select it, if its unselected
                setElementSelected(uiElem);
                newState = systemDefaults.uiElementStates.selected;
            }

            // Raise events
            _this.ElementSelectToggled.RaiseEvent(uiElem.GetCLO().GetClientID(), ctrlKey, newState);
        },
        onFeatureMoved: function (uiElem, dx, dy) {
            _innerElems.headerLabel.text(dx + " , " + dy);
        }
    }
}
UIControls.VisualView.FeatureElem = function (featureCLO, initialScaleModifier, parentCanvasInstance) {

    // Fields
    var _featureCLO = featureCLO, _canvasInstance = parentCanvasInstance;
    var _currentState = systemDefaults.uiElementStates.unselected;
    var _scaleModifier = initialScaleModifier;
    var _outerElement = null, _glow = null;
    var _innerElements = {
        box: null,
        text: null
    };
    var _screenPos = {
        x: null,
        y: null
    };
    var _boxDimensions = {
        width: null,
        height: null
    }
    var _this = this;

    // Properties
    this.GetCLO = function () {
        return _featureCLO;
    }
    this.IsSelected = function () {
        return _currentState === systemDefaults.uiElementStates.selected;
    }

    // Private methods
    function makeSelectable() {
        _outerElement.mouseover(function (e) {
            if (_glow === null) {
                _glow = _innerElements.box.glow(commonStyles.glow.attr);
            }
        }).mouseout(function (e) {

            if (_glow != null) {
                _glow.remove();
                _glow = null;
            }
        });

        _outerElement.click(function (e) {
            _this.Clicked.RaiseEvent(e.ctrlKey);

            // Prevent dom propagation
            e.stopPropagation();
        });
    }
    function makeDraggable () {
        var wasMoved = false;

        // Drag and droppable
        var start = function () {

            // Store original coordinates for self and inner elements
            _outerElement.originalx = _outerElement.attr("x");
            _outerElement.originaly = _outerElement.attr("y");
            for (var innerElemKey in _innerElements) {
                var innerElem = _innerElements[innerElemKey];
                innerElem.originalx = innerElem.attr("x");
                innerElem.originaly = innerElem.attr("y");
            }
        };
        move = function (dx, dy) {
            wasMoved = true;
            if (_glow !== null) {
                _glow.remove();
                _glow = null;
            }

            // Update position 
            _screenPos.x = (_outerElement.originalx + dx);
            _screenPos.y = (_outerElement.originaly + dy);
            _outerElement.attr({ x: _screenPos.x, y: _screenPos.y });
            for (var innerElemKey in _innerElements) { // update position of inner elems
                var innerElem = _innerElements[innerElemKey];
                innerElem.attr({ x: innerElem.originalx + dx, y: innerElem.originaly + dy });
            }

            // Raise events
            _this.Moving.RaiseEvent(dx, dy);
        };
        up = function () {

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

            //    wasMoved = false;
            //}
        };
        _outerElement.drag(move, start, up);
    }

    // Init
    this.Initialize = function () {

        // Setup position and dimensions
        var originalBoxWidth = UIObjectStyles.feature.general.box.dimensions.width;
        var originalBoxHeight = UIObjectStyles.feature.general.box.dimensions.height;
        _screenPos.x = featureCLO.XPos() * _scaleModifier;
        _screenPos.y = featureCLO.YPos() * _scaleModifier;
        _boxDimensions.width = originalBoxWidth * _scaleModifier;
        _boxDimensions.height = originalBoxHeight * _scaleModifier;

        // Create elements            
        _innerElements.box = _canvasInstance.rect(_screenPos.x, _screenPos.y, _boxDimensions.width, _boxDimensions.height, 0).attr(UIObjectStyles.feature.states[_currentState].box.attr);
        _innerElements.text = _canvasInstance.text(_boxDimensions.width / 2 + _screenPos.x, _boxDimensions.height / 2 + _screenPos.y, _featureCLO.Name()).attr(UIObjectStyles.feature.states[_currentState].text.attr);
        _innerElements.text.attr({ "font-size": parseFloat(UIObjectStyles.feature.general.text["font-size"]) * _scaleModifier });
        _outerElement = _canvasInstance.rect(_screenPos.x, _screenPos.y, _boxDimensions.width, _boxDimensions.height).attr(systemDefaults.common.outerElement.attr);

        // Setup special handlers for interactions
        makeSelectable();
        makeDraggable();

        // Bind to the featureCLO
        _featureCLO.Name.subscribe(function (newName) {
            _innerElements.text.attr({ text: newName });
        });
    }

    // Public methods
    this.SetSelectedState = function (state) {
        _currentState = state;
        _innerElements.box.attr(UIObjectStyles.feature.states[state].box.attr);
    }

    // Events
    this.Clicked = new Event();
    this.Moving = new Event();
}