// Settings and defaults
var Enums = {
    CLODataStates: {
        Unchanged: "Unchanged",
        Modified: "Modified",
        Deleted: "Deleted",
        New: "New"
    },
    UIElementStates: {
        Selected: "Selected",
        Unselected: "Unselected",
        Wireframe: "Wireframe"
    },
    VisualView: {
        ElemTypes: {
            FeatureElem: "FeatureElem",
            RelationElem: "RelationElem",
            GroupRelationElem: "GroupRelationElem",
            CompositionRuleElem: "CompositionRuleElem"
        },
        StateNames: {
            Default: "Default",
            CreatingNewFeature: "CreatingNewFeature",
            CreatingNewRelation: "CreatingNewRelation",
            CreatingNewGroupRelation: "CreatingNewGroupRelation",
            CreatingNewCompositionRule: "CreatingNewCompositionRule"
        }
    },
    RelationTypes: {
        Mandatory: 0,
        Optional: 1,
        Cloneable: 2
    },
    GroupRelationTypes: {
        OR: 0,
        XOR: 1,
        Cardinal: 2
    },
    CompositionRuleTypes: {
        Dependency: 0,
        MutualDependency: 1,
        MutualExclusion: 2
    },
    ConnectorPositionTypes: {
        EndPoint: "EndPoint",
        StartPoint: "StartPoint"
    },
    UIOrientationTypes: {
        Vertical: "Vertical",
        Horizontal: "Horizontal"
    }
}
var EnumExtraInfo = {
    "RelationTypes_Info": {}
}
EnumExtraInfo.RelationTypes_Info[Enums.RelationTypes.Mandatory] = {
    FixedLowerBound: 1,
    FixedUpperBound: 1
}
EnumExtraInfo.RelationTypes_Info[Enums.RelationTypes.Optional] = {
    FixedLowerBound: 0,
    FixedUpperBound: 1
}
EnumExtraInfo.RelationTypes_Info[Enums.RelationTypes.Cloneable] = {
    FixedLowerBound: null,
    FixedUpperBound: null
}

var Settings = {
    UIOrientation: Enums.UIOrientationTypes.Vertical, //determines orientation of diagram - options: Horizontal / Vertical / false (automatic - needs bug fixing to work properly),
    DrawCurves: true,
    ScaleModifier: 1,
    DisplayCardinalities: "Full" //determines how many cardinalities to display - options : "None" (no cardinalities) / "Partial" (only cloneable and cardinal groups) / "All" (all relations and groupRelations)
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
                            "stroke-width": 3
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
        },
        CardinalityLabel: {
            Text: {
                attr: {
                    "font-size": 10
                }
            },
            Box: {
                Dimensions: {
                    width: 30,
                    height: 15
                },
                attr: {
                    opacity: 1,
                    fill: "#FFFFC6",
                    "stroke-width": 1,
                    stroke: "#CECECE"
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
    },
    Relation: {
        General: {
            Connection: {
                Connectors: {
                    EndConnector: {
                        RaphaelType: "circle",
                        DimensionModifier: 0,
                        Dimensions: {
                            r: 5 //radius
                        }
                    }
                }
            }
        },
        SubTypes: {
            Mandatory: {
                Connection: {
                    Connectors: {
                        EndConnector: {
                            attr: {
                                fill: "black",
                                opacity: 1
                            }
                        }
                    }
                }
            },
            Optional: {
                Connection: {
                    Connectors: {
                        EndConnector: {
                            attr: {
                                fill: "#fff7d7",
                                opacity: 1
                            }
                        }
                    }
                }
            },
            Cloneable: {
                Connection: {
                    Connectors: {
                        EndConnector: {
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
    GroupRelation: {
        General: {
            RootArc: {
                attr: {
                    stroke: "Black",
                    "stroke-width": 1
                },
                Dimensions: {
                    Length: 35
                }
            },
            Connection: {
                Connectors: {
                    EndConnector: {
                        RaphaelType: "rect",
                        DimensionModifier: 5, //used to center rect
                        Dimensions: {
                            width: 11,
                            height: 11
                        }
                    }
                }
            }
        },
        SubTypes: {
            OR: {
                RootArc: {
                    attr: {
                        fill: "Black",
                        opacity: 1
                    }
                },
                Connection: {
                    Connectors: {
                        EndConnector: {
                            attr: {
                                fill: "black",
                                opacity: 1
                            }
                        }
                    }
                }
            },
            XOR: {
                RootArc: {
                    attr: {
                        fill: "#ffffff",
                        opacity: 1
                    }
                },
                Connection: {
                    Connectors: {
                        EndConnector: {
                            attr: {

                                fill: "#fff7d7",
                                opacity: 1
                            }
                        }
                    }
                }
            },
            Cardinal: {
                RootArc: {
                    attr: {
                        fill: "#ffffff",
                        opacity: 0
                    }
                },
                Connection: {
                    Connectors: {
                        EndConnector: {
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
    CompositionRule: {
        General: {
            Connection: {
                Line: {
                    attr: {
                        "stroke-dasharray": ["- "],
                        opacity: 0.5
                    }
                },
                Connectors: {
                    EndConnector: {
                        RaphaelType: "circle",
                        DimensionModifier: 0,
                        Dimensions: {
                            r: 4 //radius
                        }
                    },
                    StartConnector: {
                        RaphaelType: "circle",
                        DimensionModifier: 0,
                        Dimensions: {
                            r: 4 //radius
                        }
                    }
                }
            }
        },
        SubTypes: {
            Dependency: {
                Connection: {
                    Line: {
                        attr: {
                            stroke: "green"
                        }
                    },
                    Connectors: {
                        StartConnector: {
                            attr: {
                                fill: "red",
                                stroke: "red",
                                opacity: 0
                            }
                        },
                        EndConnector: {
                            attr: {
                                fill: "green",
                                stroke: "green"
                            }
                        }
                    }
                }
            },
            MutualDependency: {
                Connection: {
                    Line: {
                        attr: {
                            stroke: "green"
                        }
                    },
                    Connectors: {
                        StartConnector: {
                            attr: {
                                fill: "green",
                                stroke: "green",
                                opacity: 1
                            }
                        },
                        EndConnector: {
                            attr: {
                                fill: "green",
                                stroke: "green"
                            }
                        }
                    }
                }
            },
            MutualExclusion: {
                Connection: {
                    Line: {
                        attr: {
                            stroke: "red"
                        }
                    },
                    Connectors: {
                        StartConnector: {
                            attr: {
                                fill: "red",
                                stroke: "red",
                                opacity: 1
                            }
                        },
                        EndConnector: {
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
var SystemDefaults = {
    Orientations: {
        Horizontal: {
            Name: "Horizontal",
            Opposite: "Vertical",
            CardinalityDistances: {
                GroupRelation: 17,
                Relation: 30
            },
            ArcModifiers: { rx: 6, ry: 12 },
            ArcDirection: {
                LeftToRight: {
                    Check: function (rootPoint, pointA) {
                        if (rootPoint.x < pointA.x) {
                            return true;
                        }
                    },
                    ArcSweep: 0
                },
                RightToLeft: {
                    Check: function (rootPoint, pointA) {
                        if (rootPoint.x > pointA.x) {
                            return true;
                        }
                    },
                    ArcSweep: 1
                }
            },
            Connections: [["left", "right"], ["right", "left"]],
            CurveModifiers: [{ x: -40, y: 0 }, { x: +40, y: 0 }],
            AngleIntervals: [{ min: 0, max: 45 }, { min: 136, max: 224 }, { min: 316, max: 359 }]
        },
        Vertical: {
            Name: "Vertical",
            Opposite: "Horizontal",
            CardinalityDistances: {
                GroupRelation: 17,
                Relation: 30
            },
            ArcModifiers: { rx: 12, ry: 6 },
            ArcDirection: {
                UpToDown: {
                    Check: function (rootPoint, pointA) {
                        if (rootPoint.y < pointA.y) {
                            return true;
                        }
                    },
                    ArcSweep: 0
                },
                DownToUp: {
                    Check: function (rootPoint, pointA) {
                        if (rootPoint.y > pointA.y) {
                            return true;
                        }
                    },
                    ArcSweep: 1
                }
            },
            Connections: [["top", "bottom"], ["bottom", "top"]],
            CurveModifiers: [{ x: 0, y: -40 }, { x: 0, y: +40 }],
            AngleIntervals: [{ min: 46, max: 135 }, { min: 225, max: 315 }]
        }
    }
}


// CLOs
var CLOTypes = {
    FeatureModel: "FeatureModel",
    Feature: "Feature",
    Attribute: "Attribute",
    Relation: "Relation",
    GroupRelation: "GroupRelation",
    CompositionRule: "CompositionRule",
    CustomRule: "CustomRule",
    CustomFunction: "CustomFunction"
}
var FeatureModelCLO = function (clientID, blo) {

    // Fields
    var _clientID = clientID, _innerBLO = blo;
    var _this = this;

    // Properties
    this.DataState = null;
    this.GetClientID = function () {
        return _clientID;
    };
    this.GetType = function () {
        return CLOTypes.FeatureModel;
    }
    this.Name = new ObservableField(_innerBLO, "Name");
    this.Features = new ObservableCollection();
    this.Relations = new ObservableCollection();
    this.GroupRelations = new ObservableCollection();
    this.CompositionRules = new ObservableCollection();
    this.CustomRules = new ObservableCollection();
    this.CustomFunctions = new ObservableCollection();

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
        _this.Relations.Adding.AddHandler(new EventHandler(onCLOAdding));
        _this.GroupRelations.Adding.AddHandler(new EventHandler(onCLOAdding));
        _this.CompositionRules.Adding.AddHandler(new EventHandler(onCLOAdding));
        _this.CustomRules.Adding.AddHandler(new EventHandler(onCLOAdding));
        _this.CustomFunctions.Adding.AddHandler(new EventHandler(onCLOAdding));
    }

    // Event handlers
    var onCLOAdding = function (clo, eventRaiseDetails) {

        // If the clo to be added doesnt have an identifier (it is new), provide it with one
        if (clo.Identifier !== undefined && clo.Identifier() === null) {
            var collection = _this[clo.GetType() + "s"]; // get the collection corresponding to the type of the given CLO 
            var identity = getNewIdentifier(clo.GetType(), collection);

            clo.Identifier(identity.identifier);
            if (clo.Name !== undefined)
                clo.Name(identity.name);
        }
    }
}
var FeatureCLO = function (clientID, blo) {

    // Fields
    var _clientID = clientID, _innerBLO = blo;
    var _this = this;

    // Properties
    this.DataState = null;
    this.GetClientID = function () {
        return _clientID;
    };
    this.GetType = function () {
        return CLOTypes.Feature;
    }
    this.Selected = new ObservableField();
    this.Identifier = new ObservableField(_innerBLO, "Identifier");
    this.Name = new ObservableField(_innerBLO, "Name");
    this.Attributes = new ObservableCollection();
    this.XPos = new ObservableField(_innerBLO, "XPos");
    this.YPos = new ObservableField(_innerBLO, "YPos");
    this.RelatedCLOS = new ObservableCollection();

    // Init
    this.Initialize = function () {

    }
}
var AttributeCLO = function (clientID, blo) {

    // Fields
    var _clientID = clientID, _innerBLO = blo;
    var _this = this;

    // Properties
    this.DataState = null;
    this.GetClientID = function () {
        return _clientID;
    };
    this.GetType = function () {
        return CLOTypes.Feature;
    }
    this.Identifier = new ObservableField(_innerBLO, "Identifier");
    this.Name = new ObservableField(_innerBLO, "Name");

    // Init
    this.Initialize = function () {

    }
}
var RelationCLO = function (clientID, blo) {

    // Fields
    var _clientID = clientID, _innerBLO = blo;
    var _this = this;

    // Properties
    this.DataState = null;
    this.GetClientID = function () {
        return _clientID;
    };
    this.GetType = function () {
        return CLOTypes.Relation;
    };
    this.Selected = new ObservableField();
    this.Identifier = new ObservableField(_innerBLO, "Identifier");
    this.ParentFeature = null;
    this.ChildFeature = null;
    this.RelationType = new ObservableField(_innerBLO, "RelationType");

    this.FixedUpperBound = new ObservableField(_innerBLO, "FixedUpperBound");
    this.FixedLowerBound = new ObservableField(_innerBLO, "FixedLowerBound");
    this.UpperBound = new ObservableField(_innerBLO, "UpperBound");
    this.LowerBound = new ObservableField(_innerBLO, "LowerBound");

    // Init
    this.Initialize = function () {
        _this.RelationType.Changed.AddHandler(new EventHandler(function (newValue) {
            _this.FixedUpperBound(EnumExtraInfo.RelationTypes_Info[newValue].FixedUpperBound);
            _this.FixedLowerBound(EnumExtraInfo.RelationTypes_Info[newValue].FixedLowerBound);

            // Set default initial bounds
            _this.LowerBound((_this.FixedLowerBound() == null) ? 1 : _this.FixedLowerBound());
            _this.UpperBound((_this.FixedUpperBound() == null) ? 2 : _this.FixedUpperBound());
        }));
    }
}
var GroupRelationCLO = function (clientID, blo) {

    // Fields
    var _clientID = clientID, _innerBLO = blo;
    var _this = this;

    // Properties
    this.DataState = null;
    this.GetClientID = function () {
        return _clientID;
    };
    this.GetType = function () {
        return CLOTypes.GroupRelation;
    };
    this.Selected = new ObservableField();
    this.Identifier = new ObservableField(_innerBLO, "Identifier");
    this.ParentFeature = null;
    this.ChildFeatures = new ObservableCollection();
    this.GroupRelationType = new ObservableField(_innerBLO, "GroupRelationType");
    this.UpperBound = new ObservableField(_innerBLO, "UpperBound");
    this.LowerBound = new ObservableField(_innerBLO, "LowerBound");

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
    this.DataState = null;
    this.GetClientID = function () {
        return _clientID;
    };
    this.GetType = function () {
        return CLOTypes.CompositionRule;
    }
    this.Selected = new ObservableField();
    this.Name = new ObservableField(_innerBLO, "Identifier");
    this.Identifier = new ObservableField(_innerBLO, "Identifier");
    this.FirstFeature = null;
    this.SecondFeature = null;
    this.CompositionRuleType = new ObservableField(_innerBLO, "CompositionRuleType");

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
    this.DataState = null;
    this.GetClientID = function () {
        return _clientID;
    };
    this.GetType = function () {
        return CLOTypes.CustomRule;
    }
    this.Selected = new ObservableField();
    this.Identifier = new ObservableField(_innerBLO, "Identifier");
    this.Name = new ObservableField(_innerBLO, "Name");
    this.Expression = new ObservableField(_innerBLO, "Expression");
    this.Description = new ObservableField(_innerBLO, "Description");

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
    this.DataState = null;
    this.GetClientID = function () {
        return _clientID;
    };
    this.GetType = function () {
        return CLOTypes.CustomFunction;
    }
    this.Selected = new ObservableField();
    this.Identifier = new ObservableField(_innerBLO, "Identifier");
    this.Name = new ObservableField(_innerBLO, "Name");
    this.Expression = new ObservableField(_innerBLO, "Expression");
    this.Description = new ObservableField(_innerBLO, "Description");

    // Init
    this.Initialize = function () {

    }
}

// Logical components
var Controller = function () {

    // Fields
    var _dataModel = null;
    var _visualView = null, _commandToolbar = null, _modelExplorer = null, _propertyEditor = null, _cloSelectionManager = null;
    var _currentControlFocus = null; // variable to keep track of where the user executed the last action (clicking)
    var _this = this;

    // Init
    this.Initialize = function () {

        // Init children
        _dataModel = new DataModel();
        _dataModel.Initialize();
        _cloSelectionManager = new CLOSelectionManager();
        _cloSelectionManager.Initialize();
        _visualView = UIComponentProvider.CreateInstance("UIComponents.VisualView", [$("#visualViewContainer"), _dataModel, _cloSelectionManager]);
        _visualView.Initialize();
        _modelExplorer = UIComponentProvider.CreateInstance("UIComponents.ModelExplorer", [$("#modelExplorerContainer"), _dataModel, _cloSelectionManager]);
        _modelExplorer.Initialize();
        _commandToolbar = UIComponentProvider.CreateInstance("UIComponents.CommandToolbar", [$("#toolBarContainer"), _this]);
        _commandToolbar.Initialize();
        _propertyEditor = UIComponentProvider.CreateInstance("UIComponents.PropertyEditor", [$("#propertyEditorContainer"), _dataModel, _cloSelectionManager]);
        _propertyEditor.Initialize();

        // Setup events and handlers
        _dataModel.ModelLoaded.AddHandler(new EventHandler(_visualView.OnModelLoaded));
        _dataModel.ModelLoaded.AddHandler(new EventHandler(_modelExplorer.OnModelLoaded));
        _visualView.StateChanged.AddHandler(new EventHandler(_commandToolbar.OnVisualViewStateChanged));
        _dataModel.CLODeleted.AddHandler(new EventHandler(_cloSelectionManager.OnCLODeleted));
        _cloSelectionManager.CLOSelectionChanged.AddHandler(new EventHandler(onCLOSelectionChanged));

        // Global key handlers
        $(document).keydown(function (e) {
            if (e.which == 46) { //del key
                _this.Delete();
            }

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
    this.AddNewGroupRelation = function () {
        _visualView.StartCreateGroupRelation();
    }
    this.AddNewCompositionRule = function () {
        _visualView.StartCreateCompositionRule();
    }
    this.AddNewCustomRule = function () {
        var newCustomRuleCLO = _dataModel.CreateNewCLO(CLOTypes.CustomRule);
        _dataModel.GetCurrentFeatureModelCLO().CustomRules.Add(newCustomRuleCLO);
    }
    this.AddNewCustomFunction = function () {
        var newCustomFunctionCLO = _dataModel.CreateNewCLO(CLOTypes.CustomFunction);
        _dataModel.GetCurrentFeatureModelCLO().CustomFunctions.Add(newCustomFunctionCLO);
    }
    this.Delete = function () {

        var selectedCLOs = _cloSelectionManager.GetAllSelectedCLOs();
        for (var i = 0; i < selectedCLOs.length ; i++) {
            _dataModel.DeleteByClientID(selectedCLOs[i].GetClientID());
        }
    }
    this.ZoomIn = function () {
        _visualView.ZoomIn();
    }
    this.ZoomOut = function () {
        _visualView.ZoomOut();
    }
    this.ToggleOrientation = function () {
        _visualView.ToggleOrientation();
    }

    // Event handlers
    var onViewFocused = function (viewInFocus) {
        if (_currentControlFocus !== viewInFocus) {
            _currentControlFocus = viewInFocus;
        }
    }
    var onCLOSelectionChanged = function () {

        // Open/hide PropertyEditor if VisualView is in default mode
        if (_visualView.GetCurrentState() === Enums.VisualView.StateNames.Default) {
            var selectedCLOArray = _cloSelectionManager.GetAllSelectedCLOs();

            // Nothing selected
            if (selectedCLOArray.length === 0) {
                _propertyEditor.Close();
            }
                // Single selected
            else if (selectedCLOArray.length === 1) {
                _propertyEditor.OpenAndEdit(selectedCLOArray);
            }
                // Multiple selected 
            else if (selectedCLOArray.length > 1) {
                //var allCLOsAreSameType = true; // assumption
                //for (var i = 1; i < selectedCLOArray.length; i++) {
                //    if (selectedCLOArray[i].GetType() !== selectedCLOArray[0].GetType()) {
                //        allCLOsAreSameType = false;
                //        break;
                //    }
                //}

                ////
                //if (allCLOsAreSameType)
                //    _propertyEditor.OpenAndEdit(selectedCLOArray);
                //else
                _propertyEditor.Close();
            }
        }
    }
}
var CLOSelectionManager = function () {

    // Fields
    var _selectedCLOs = {}; // lookup dictionary for all selected CLOs (for efficient retreival)
    var _this = this;

    // Private methods
    function selectCLO(clo) {
        _selectedCLOs[clo.GetClientID()] = clo;
        clo.Selected(true);
    }
    function deselectCLO(clo) {
        delete _selectedCLOs[clo.GetClientID()];
        clo.Selected(false);
    }
    function clearSelection() {
        for (var clientID in _selectedCLOs) {
            deselectCLO(_selectedCLOs[clientID]);
        }
    }

    // Init
    this.Initialize = function () {
    }

    // Public methods
    this.GetAllSelectedCLOs = function (cloType) {
        var selectedCLOArray = [];
        for (var clientID in _selectedCLOs) {
            if (cloType !== undefined && cloType !== null) {
                if (_selectedCLOs[clientID].GetType() === cloType)
                    selectedCLOArray.push(_selectedCLOs[clientID]);
            } else {
                selectedCLOArray.push(_selectedCLOs[clientID]);
            }
        }
        return selectedCLOArray;
    }
    this.ToggleSingleCLO = function (clo, ctrlKey) {
        var raiseEvent = false;

        if (ctrlKey === true) {
            // Control key down
            if (clo.Selected()) {
                deselectCLO(clo); // deselect
                raiseEvent = true;
            }
            else {
                selectCLO(clo); // add to selection
                raiseEvent = true;
            }
        }
        else {
            // No control key
            if (!clo.Selected() || Object.size(_selectedCLOs) > 1) {
                clearSelection();
                selectCLO(clo); // add to selection
                raiseEvent = true;
            }
        }
        if (raiseEvent)
            _this.CLOSelectionChanged.RaiseEvent();
    }
    this.DeselectAllCLOs = function () {
        clearSelection();

        _this.CLOSelectionChanged.RaiseEvent();
    }
    this.ForceSelectSingleCLO = function (clo) {
        if (!clo.Selected()) {
            selectCLO(clo);
            _this.CLOSelectionChanged.RaiseEvent();
        }
    }
    this.ForceSelectMultipleCLOs = function (cloArray) {
        for (var i = 0; i < cloArray.length; i++) {
            selectCLO(cloArray[i]);
        }

        _this.CLOSelectionChanged.RaiseEvent();
    }

    // Events 
    this.CLOSelectionChanged = new Event();

    // Event handlers
    this.OnCLODeleted = function (clo) {
        if (_selectedCLOs[clo.GetClientID()] !== undefined) {
            deselectCLO(clo);
            _this.CLOSelectionChanged.RaiseEvent();
        }
    }
}
var DataModel = function (bloService, cloFactory) {

    // Fields
    var _bloService = bloService, _cloFactory = cloFactory;
    var _currentFeatureModelCLO = null;
    var _dirtyCLOs = {};
    var _this = this;

    // Properties
    this.GetCurrentFeatureModelCLO = function () {
        return _currentFeatureModelCLO;
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
    this.DeleteByClientID = function (clientID) {

        // Get the clo 
        var clo = _this.GetByClientID(clientID);

        // If it is not already deleted
        if (clo.DataState !== Enums.CLODataStates.Deleted) {
            clo.DataState = Enums.CLODataStates.Deleted; // mark it as deleted
            _dirtyCLOs[clientID] = clo; // add it to the dirty clo collection

            // Handle clo type specific delete operation
            switch (clo.GetType()) {
                case CLOTypes.Feature:
                    _currentFeatureModelCLO.Features.Remove(clo);
                    for (var i = clo.RelatedCLOS.GetLength() ; i > 0; i--) {
                        _this.DeleteByClientID(clo.RelatedCLOS.GetAt(i - 1).GetClientID());
                    }
                    break;

                case CLOTypes.Relation:
                    _currentFeatureModelCLO.Relations.Remove(clo);
                    clo.ParentFeature.RelatedCLOS.Remove(clo);
                    clo.ChildFeature.RelatedCLOS.Remove(clo);
                    break;

                case CLOTypes.GroupRelation:
                    _currentFeatureModelCLO.GroupRelations.Remove(clo);
                    clo.ParentFeature.RelatedCLOS.Remove(clo);
                    for (var i = 0; i < clo.ChildFeatures.GetLength() ; i++) {
                        clo.ChildFeatures.GetAt(i).RelatedCLOS.Remove(clo);
                    }
                    break;

                case CLOTypes.CompositionRule:
                    _currentFeatureModelCLO.CompositionRules.Remove(clo);
                    clo.FirstFeature.RelatedCLOS.Remove(clo);
                    clo.SecondFeature.RelatedCLOS.Remove(clo);
                    break;

                case CLOTypes.CustomRule:
                    _currentFeatureModelCLO.CustomRules.Remove(clo);
                    break;

                case CLOTypes.CustomFunction:
                    _currentFeatureModelCLO.CustomFunctions.Remove(clo);
                    break;
            }

            // Raise events
            _this.CLODeleted.RaiseEvent(clo);
        }
    }
    this.LoadNewModel = function () {

        // Init a new FeatureModelCLO
        _currentFeatureModelCLO = _cloFactory.CreateNewCLO(CLOTypes.FeatureModel);
        _this.ModelLoaded.RaiseEvent(_currentFeatureModelCLO);
    }

    // Events
    this.ModelLoaded = new Event();
    this.CLODeleted = new Event();
}
DataModel.CLOFactory = function (bloService) {

    var FromBLO = {
        FeatureModel: function (blo) {

            //
            var newClientID = getNewClientID();
            var newCLO = new FeatureModelCLO(newClientID, blo);
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
        GroupRelation: function (blo) {

            //
            var newClientID = getNewClientID();
            var newCLO = new GroupRelationCLO(newClientID, blo);
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
        },
        CustomRule: function (blo) {

            //
            var newClientID = getNewClientID();
            var newCLO = new CustomRuleCLO(newClientID, blo);
            newCLO.Initialize();

            //
            return newCLO;
        },
        CustomFunction: function (blo) {

            //
            var newClientID = getNewClientID();
            var newCLO = new CustomFunctionCLO(newClientID, blo);
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
        var convertedCLO = FromBLO[cloType](blo);
        convertedCLO.DataState = Enums.CLODataStates.Unchanged;

        // Register and return it
        _factoryCLORegister[convertedCLO.GetClientID()] = convertedCLO;
        return convertedCLO;
    }
    this.CreateNewCLO = function (cloType) {

        // Create the CLO
        var newBLO = _bloService.GetDefaultBLO(cloType);
        var newCLO = FromBLO[cloType](newBLO);
        newCLO.DataState = Enums.CLODataStates.New;

        // Register and return it
        _factoryCLORegister[newCLO.GetClientID()] = newCLO;
        return newCLO;
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

// UIComponents
var UIComponentProvider = (function () { // "static" class

    // Methods
    function construct(constructor, args) {
        function F() {
            return constructor.apply(this, args);
        }
        F.prototype = constructor.prototype;
        return new F();
    }
    function isRegistered(componentFullName) {
        return isFunction(eval(componentFullName));
    }
    function registerUIComponent(componentFullName) {

        $.ajax({
            type: "POST",
            url: "Main/GetUIComponent",
            data: JSON.stringify({ UIComponentFullName: componentFullName }),
            success: function (response) {
                jQuery.globalEval(response)
            }
        });
    }
    function createInstance(componentFullName, args) {
        if (!isRegistered(componentFullName)) {
            registerUIComponent(componentFullName)
        }

        var classReference = eval(componentFullName);
        return construct(classReference, args);
    }

    // Public methods
    return {
        CreateInstance: createInstance
    };
})();
var UIComponents = {};
UIComponents.CommandToolbar = {};
UIComponents.ModelExplorer = {};
UIComponents.PropertyEditor = {};
UIComponents.PropertyEditor.FeatureInnerEditor = {};
UIComponents.PropertyEditor.RelationInnerEditor = {};
UIComponents.VisualView = {};
UIComponents.VisualView.FeatureElem = {};
UIComponents.VisualView.RelationElem = {};
UIComponents.VisualView.GroupRelationElem = {};
UIComponents.VisualView.CompositionRuleElem = {};
UIComponents.VisualView.ConnectionElem = {};
UIComponents.VisualView.ConnectorElem = {};
UIComponents.VisualView.CardinalityLabel = {};