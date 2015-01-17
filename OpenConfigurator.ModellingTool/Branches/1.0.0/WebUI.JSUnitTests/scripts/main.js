// Settings and defaults
var Enums = {
    CLODataStates: {
        Unchanged: "Unchanged",
        Modified: "Modified",
        Deleted: "Deleted",
        New: "New"
    },
    UIOrientationTypes: {
        Vertical: 0,
        Horizontal: 1
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
    AttributeTypes: {
        Constant: 0,
        Dynamic: 1,
        UserInput: 2
    },
    AttributeDataTypes: {
        Integer: 0,
        Boolean: 1,
        String: 2
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
}
var EnumExtraInfo = {
    RelationTypes_Info: {},
    GroupRelationTypes_Info: {}
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
EnumExtraInfo.GroupRelationTypes_Info[Enums.GroupRelationTypes.OR] = {
    FixedLowerBound: 1,
    FixedUpperBound: -1
}
EnumExtraInfo.GroupRelationTypes_Info[Enums.GroupRelationTypes.XOR] = {
    FixedLowerBound: 1,
    FixedUpperBound: 1
}
EnumExtraInfo.GroupRelationTypes_Info[Enums.GroupRelationTypes.Cardinal] = {
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
                }
            }
        },
        SubTypes: {
            Dependency: {
                Connection: {
                    Line: {
                        attr: {
                            stroke: "green",
                            'arrow-end': 'classic-wide-long'
                        }
                    }
                }
            },
            MutualDependency: {
                Connection: {
                    Line: {
                        attr: {
                            stroke: "green",
                            'arrow-end': 'classic-wide-long',
                            'arrow-start': 'classic-wide-long'
                        }
                    }
                }
            },
            MutualExclusion: {
                Connection: {
                    Line: {
                        attr: {
                            stroke: "red",
                            'arrow-end': 'classic-wide-long',
                            'arrow-start': 'classic-wide-long'
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
    var _changeTrackingManager = new InnerChangeTrackingManager(this);
    var _this = this;

    // Properties
    this.GetClientID = function () {
        return _clientID;
    };
    this.GetType = function () {
        return CLOTypes.FeatureModel;
    }
    this.GetBLOCopy = function () {
        return jQuery.extend(true, {}, _innerBLO);
    }
    this.Name = new ObservableField(_innerBLO, "Name");
    this.UIOrientation = new ObservableField(_innerBLO, "UIOrientation");
    this.ScaleModifier = new ObservableField(_innerBLO, "ScaleModifier");
    this.Features = new ObservableCollection();
    this.Relations = new ObservableCollection();
    this.GroupRelations = new ObservableCollection();
    this.CompositionRules = new ObservableCollection();
    this.CustomRules = new ObservableCollection();
    this.CustomFunctions = new ObservableCollection();

    // Init
    this.Initialize = function () {

        // Bind to collections
        _this.Features.Adding.AddHandler(new EventHandler(onCLOAdding));
        _this.Relations.Adding.AddHandler(new EventHandler(onCLOAdding));
        _this.GroupRelations.Adding.AddHandler(new EventHandler(onCLOAdding));
        _this.CompositionRules.Adding.AddHandler(new EventHandler(onCLOAdding));
        _this.CustomRules.Adding.AddHandler(new EventHandler(onCLOAdding));
        _this.CustomFunctions.Adding.AddHandler(new EventHandler(onCLOAdding));

        // Setup change tracking
        _changeTrackingManager.Initialize();
    }

    // Event handlers
    var onCLOAdding = function (clo, eventRaiseDetails) {
        IdentifierProvider.SetupIdentifier(clo, _this);
    }
}
var FeatureCLO = function (clientID, blo) {

    // Fields
    var _clientID = clientID, _innerBLO = blo;
    var _this = this;

    // Properties
    this.GetClientID = function () {
        return _clientID;
    };
    this.GetType = function () {
        return CLOTypes.Feature;
    }
    this.GetBLOCopy = function () {
        return jQuery.extend(true, {}, _innerBLO);
    }
    this.Selected = new ObservableField();
    this.Attributes = new ObservableCollection();
    this.Identifier = new ObservableField(_innerBLO, "Identifier");
    this.Name = new ObservableField(_innerBLO, "Name");
    this.XPos = new ObservableField(_innerBLO, "XPos");
    this.YPos = new ObservableField(_innerBLO, "YPos");
    this.RelatedCLOS = new ObservableCollection();

    // Private methods
    function getNewAttributeCLOIdentifier() {

        // Variables
        var identifier;
        var baseIdentifier = CLOTypes.Attribute + "_";

        // Find a suitable Identifier
        var i = _this.Attributes.GetLength();
        do {
            identifier = baseIdentifier + i;
        }
        while (_this.Attributes.ContainsItemWith("Identifier", baseIdentifier + i++));

        return identifier;
    }

    // Init
    this.Initialize = function () {



        // Bind to attributes collection
        _this.Attributes.Added.AddHandler(new EventHandler(onAttributeCLOAdded));


    }

    // Event handlers
    var onAttributeCLOAdded = function (clo) {
        clo.ParentFeature = _this;
        IdentifierProvider.SetupIdentifier(clo, _this);
    }
}
var AttributeCLO = function (clientID, blo) {

    // Fields
    var _clientID = clientID, _innerBLO = blo;
    var _this = this;

    // Properties
    this.GetClientID = function () {
        return _clientID;
    };
    this.GetType = function () {
        return CLOTypes.Attribute;
    }
    this.GetBLOCopy = function () {
        return jQuery.extend(true, {}, _innerBLO);
    }
    this.Identifier = new ObservableField(_innerBLO, "Identifier");
    this.Name = new ObservableField(_innerBLO, "Name");
    this.Description = new ObservableField(_innerBLO, "Description");
    this.AttributeType = new ObservableField(_innerBLO, "AttributeType");
    this.ConstantValue = new ObservableField(_innerBLO, "ConstantValue");
    this.AttributeDataType = new ObservableField(_innerBLO, "AttributeDataType");
    this.ParentFeature = null;

    // Init
    this.Initialize = function () {

    }
}
var RelationCLO = function (clientID, blo) {

    // Fields
    var _clientID = clientID, _innerBLO = blo;
    var _this = this;

    // Properties
    this.GetClientID = function () {
        return _clientID;
    };
    this.GetType = function () {
        return CLOTypes.Relation;
    };
    this.GetBLOCopy = function () {
        return jQuery.extend(true, {}, _innerBLO);
    }
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
    this.GetClientID = function () {
        return _clientID;
    };
    this.GetType = function () {
        return CLOTypes.GroupRelation;
    };
    this.GetBLOCopy = function () {
        return jQuery.extend(true, {}, _innerBLO);
    }
    this.Selected = new ObservableField();
    this.Identifier = new ObservableField(_innerBLO, "Identifier");
    this.ParentFeature = null;
    this.ChildFeatures = new ObservableCollection();
    this.GroupRelationType = new ObservableField(_innerBLO, "GroupRelationType");
    this.FixedUpperBound = new ObservableField(_innerBLO, "FixedUpperBound");
    this.FixedLowerBound = new ObservableField(_innerBLO, "FixedLowerBound");
    this.UpperBound = new ObservableField(_innerBLO, "UpperBound");
    this.LowerBound = new ObservableField(_innerBLO, "LowerBound");

    // Init
    this.Initialize = function () {
        _this.GroupRelationType.Changed.AddHandler(new EventHandler(function (newValue) {
            _this.FixedLowerBound(EnumExtraInfo.GroupRelationTypes_Info[newValue].FixedLowerBound);
            _this.FixedUpperBound(EnumExtraInfo.GroupRelationTypes_Info[newValue].FixedUpperBound);

            // Set default initial bounds
            _this.LowerBound((_this.FixedLowerBound() == null) ? 0 : _this.FixedLowerBound());
            _this.UpperBound((_this.FixedUpperBound() == null || _this.FixedUpperBound() == -1) ? _this.ChildFeatures.GetLength() : _this.FixedUpperBound());
        }));
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
    this.GetBLOCopy = function () {
        return jQuery.extend(true, {}, _innerBLO);
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
    this.GetClientID = function () {
        return _clientID;
    };
    this.GetType = function () {
        return CLOTypes.CustomRule;
    }
    this.GetBLOCopy = function () {
        return jQuery.extend(true, {}, _innerBLO);
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
    this.GetClientID = function () {
        return _clientID;
    };
    this.GetType = function () {
        return CLOTypes.CustomFunction;
    }
    this.GetBLOCopy = function () {
        return jQuery.extend(true, {}, _innerBLO);
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

// Main logical components
var Controller = function () {

    // Fields
    var _dataModel = null;
    var _visualView = null, _commandToolbar = null, _modelExplorer = null, _propertyEditor = null, _cloSelectionManager = null;
    var _fileExplorer = null;
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
        _commandToolbar = UIComponentProvider.CreateInstance("UIComponents.CommandToolbar", [$("#toolBarContainer"), _dataModel, _this]);
        _commandToolbar.Initialize();
        _propertyEditor = UIComponentProvider.CreateInstance("UIComponents.PropertyEditor", [$("#propertyEditorContainer"), _dataModel, _cloSelectionManager]);
        _propertyEditor.Initialize();

        // Setup events and handlers
        _dataModel.ModelLoaded.AddHandler(new EventHandler(_visualView.OnModelLoaded));
        _dataModel.ModelLoaded.AddHandler(new EventHandler(_modelExplorer.OnModelLoaded));
        _dataModel.ModelLoaded.AddHandler(new EventHandler(_commandToolbar.OnModelLoaded));
        _dataModel.ModelUnloaded.AddHandler(new EventHandler(_visualView.OnModelUnloaded));
        _dataModel.ModelUnloaded.AddHandler(new EventHandler(_modelExplorer.OnModelUnloaded));
        _dataModel.ModelUnloaded.AddHandler(new EventHandler(_commandToolbar.OnModelUnloaded));

        _visualView.StateChanged.AddHandler(new EventHandler(_commandToolbar.OnVisualViewStateChanged));
        _dataModel.CLODeleted.AddHandler(new EventHandler(_cloSelectionManager.OnCLODeleted));
        _cloSelectionManager.CLOSelectionChanged.AddHandler(new EventHandler(onCLOSelectionChanged));

        // Global key handlers
        $(document).keydown(function (e) {
            if (e.which == 46) { //del key
                _this.Delete();
            }

        });

        // Other handlers
        _visualView.Focus.AddHandler(new EventHandler(function () {
            onViewFocused(_visualView);
        }));
        _modelExplorer.Focus.AddHandler(new EventHandler(function () {
            onViewFocused(_modelExplorer);
        }));
    }

    // Public methods
    this.NewModel = function () {
        _cloSelectionManager.DeselectAllCLOs();
        _dataModel.CreateAndLoadNewModel();
    }
    this.LoadModel = function () {
        _cloSelectionManager.DeselectAllCLOs();
        featureModelName = "Test";
        _dataModel.LoadExistingModel(featureModelName);
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
    this.SaveChanges = function () {
        _dataModel.SaveChanges();
    }
    this.OpenFile = function () {

        //
        if (_fileExplorer === null) {
            _fileExplorer = UIComponentProvider.CreateInstance("UIComponents.FileExplorer", [$("body"), _dataModel]);
            _fileExplorer.Initialize();
        }

        _fileExplorer.Show();
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
var DataModel = function (bloService, cloFactory) {

    // Fields
    var _bloService = bloService, _cloFactory = cloFactory;
    var _currentFeatureModelCLO = null;
    var _deletedCLOs = {};
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
    this.CreateNewCLO = function (cloType, extraParams) {
        return _cloFactory.CreateNewCLO(cloType, extraParams);
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
            _deletedCLOs[clientID] = clo; // add it to the deleted clo collection

            // Handle clo type specific delete operation
            switch (clo.GetType()) {
                case CLOTypes.Feature:
                    _currentFeatureModelCLO.Features.Remove(clo);
                    for (var i = clo.Attributes.GetLength() ; i > 0; i--) {// delete attributes
                        _this.DeleteByClientID(clo.Attributes.GetAt(i - 1).GetClientID());
                    }
                    for (var i = clo.RelatedCLOS.GetLength() ; i > 0; i--) { // delete adjacent relations
                        _this.DeleteByClientID(clo.RelatedCLOS.GetAt(i - 1).GetClientID());
                    }

                    break;

                case CLOTypes.Attribute:
                    clo.ParentFeature.Attributes.Remove(clo);
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
    this.CreateAndLoadNewModel = function () {

        // Clean up current FeatureModel (if one is present)
        var currentModel = _currentFeatureModelCLO;
        if (_currentFeatureModelCLO !== null) {
            _currentFeatureModelCLO = null;
            _deletedCLOs = {};
            _cloFactory.Reset();
            _this.ModelUnloaded.RaiseEvent(currentModel);
        }

        // Init a new FeatureModelCLO
        _currentFeatureModelCLO = _cloFactory.CreateNewCLO(CLOTypes.FeatureModel);
        _this.ModelLoaded.RaiseEvent(_currentFeatureModelCLO);
    }
    this.LoadExistingModel = function (featureModelName) {

        // Clean up current FeatureModel (if one is present)
        if (_currentFeatureModelCLO !== null) {
            var modelCLO = _currentFeatureModelCLO;
            _currentFeatureModelCLO = null;
            _deletedCLOs = {};
            _cloFactory.Reset();
            _this.ModelUnloaded.RaiseEvent(modelCLO);
        }

        // Get the existing feature model
        var featureModelBLO = _bloService.GetFeatureModel(featureModelName);
        var loadedModelCLO = _cloFactory.FromBLO(featureModelBLO, CLOTypes.FeatureModel);

        // Attempt to load the model
        var eventRaiseDetails = _this.ModelLoading.RaiseEvent(_currentFeatureModelCLO);
        if (eventRaiseDetails.CancelTriggered() === false) {
            _currentFeatureModelCLO = loadedModelCLO;
            _this.ModelLoaded.RaiseEvent(_currentFeatureModelCLO);
        }
        
    }
    this.GetAllModelFileNames = function () {
        var fileList = [
            { name: "Model1" },
            { name: "Model2" },
            { name: "Model3" }
        ];

        return fileList;
    }
    this.SaveChanges = function () {

        //
        var featureModelBLO = _cloFactory.ToBLO(_currentFeatureModelCLO);
        _bloService.SaveChanges(featureModelBLO);

        // 
        _currentFeatureModelCLO.HasChanges(false);
    }
    

    // Events
    this.ModelLoading = new Event();
    this.ModelLoaded = new Event();
    this.ModelUnloaded = new Event();
    this.CLODeleted = new Event();
}
DataModel.CLOFactory = function (bloService) {

    var FromBLO = {
        FeatureModel: function (blo) {

            // Strip off all child collections from the blo
            var strippedOffBLOArrays = stripOffChildArrays(blo); // it is assumed all arrays on BLOs are part of BLO Lists

            // Create it
            var newClientID = getNewClientID();
            var newCLO = new FeatureModelCLO(newClientID, blo);
            
            // Child Features
            for (var i = 0; i < strippedOffBLOArrays.Features.length; i++) {
                var featureCLO = FromBLO.Feature(strippedOffBLOArrays.Features[i]);
                newCLO.Features.Add(featureCLO);
            }
            // Child Relations
            for (var i = 0; i < strippedOffBLOArrays.Relations.length; i++) {
                var relationBLO = strippedOffBLOArrays.Relations[i];
                var relationCLO = FromBLO.Relation(strippedOffBLOArrays.Relations[i]);

                // Get references to the CLOs corresponding to the ParentFeature & ChildFeature
                relationCLO.ParentFeature = newCLO.Features.GetItemWithFieldValue("Identifier", relationBLO.ParentFeature.Identifier);
                relationCLO.ChildFeature = newCLO.Features.GetItemWithFieldValue("Identifier", relationBLO.ChildFeature.Identifier);
                delete relationBLO.ParentFeature; delete relationBLO.ChildFeature; // delete them off the BLO afterwards

                newCLO.Relations.Add(relationCLO);
            }
            // Child GroupRelations
            for (var i = 0; i < strippedOffBLOArrays.GroupRelations.length; i++) {
                var groupRelationBLO = strippedOffBLOArrays.GroupRelations[i];
                var groupRelationCLO = FromBLO.GroupRelation(strippedOffBLOArrays.GroupRelations[i]);

                // Get references to the CLOs corresponding to the ParentFeature & ChildFeature
                groupRelationCLO.ParentFeature = newCLO.Features.GetItemWithFieldValue("Identifier", groupRelationBLO.ParentFeature.Identifier);
                for (var j = 0; j < groupRelationBLO.ChildFeatures.length; j++) {
                    var childFeatureIdentifier = groupRelationBLO.ChildFeatures[j].Identifier;
                    groupRelationCLO.ChildFeatures.Add(newCLO.Features.GetItemWithFieldValue("Identifier", childFeatureIdentifier));
                }
                delete groupRelationBLO.ParentFeature; delete groupRelationBLO.ChildFeatures; // delete them off the BLO afterwards


                newCLO.GroupRelations.Add(groupRelationCLO);
            }
            // Child CompositionRules
            for (var i = 0; i < strippedOffBLOArrays.CompositionRules.length; i++) {
                var compositionRuleBLO = strippedOffBLOArrays.CompositionRules[i];
                var compositionRuleCLO = FromBLO.CompositionRule(strippedOffBLOArrays.CompositionRules[i]);

                // Get references to the CLOs corresponding to the ParentFeature & ChildFeature
                compositionRuleCLO.FirstFeature = newCLO.Features.GetItemWithFieldValue("Identifier", compositionRuleBLO.FirstFeature.Identifier);
                compositionRuleCLO.SecondFeature = newCLO.Features.GetItemWithFieldValue("Identifier", compositionRuleBLO.SecondFeature.Identifier);
                delete compositionRuleBLO.FirstFeature; delete compositionRuleBLO.SecondFeature; // delete them off the BLO afterwards

                newCLO.CompositionRules.Add(compositionRuleCLO);
            }
            // Child CustomRules
            for (var i = 0; i < strippedOffBLOArrays.CustomRules.length; i++) {
                var customRuleCLO = FromBLO.CustomRule(strippedOffBLOArrays.CustomRules[i]);
                newCLO.CustomRules.Add(customRuleCLO);
            }
            // Child CustomFunctions
            for (var i = 0; i < strippedOffBLOArrays.CustomFunctions.length; i++) {
                var customFunctionCLO = FromBLO.CustomFunction(strippedOffBLOArrays.CustomFunctions[i]);
                newCLO.CustomFunctions.Add(customFunctionCLO);
            }

            // Initialize and return
            newCLO.Initialize();
            return newCLO;
        },
        Feature: function (blo) {

            // Strip off all child collections from the blo
            var strippedOffArrays = stripOffChildArrays(blo);

            // Create it
            var newClientID = getNewClientID();
            var newCLO = new FeatureCLO(newClientID, blo);
            
            // Child Attributes
            for (var i = 0; i < strippedOffArrays.Attributes.length; i++) {
                var attributeCLO = FromBLO.Attribute(strippedOffArrays.Attributes[i]);
                attributeCLO.Initialize();
                newCLO.Attributes.Add(attributeCLO);
            }

            // Register and return it
            newCLO.Initialize();
            _factoryCLORegister[newCLO.GetClientID()] = newCLO;
            return newCLO;
        },
        Attribute: function (blo) {

            // Create the clo
            var newClientID = getNewClientID();
            var newCLO = new AttributeCLO(newClientID, blo);

            // Register and return it
            newCLO.Initialize();
            _factoryCLORegister[newCLO.GetClientID()] = newCLO;
            return newCLO;
        },
        Relation: function (blo, parentFeatureCLO, childFeatureCLO) {

            // Create the clo
            var newClientID = getNewClientID();
            var newCLO = new RelationCLO(newClientID, blo);
            
            // Set parent/child feature CLOs if they are provided as parameters
            if (parentFeatureCLO !== undefined && childFeatureCLO !== undefined) {
                newCLO.ParentFeature = parentFeatureCLO;
                newCLO.ChildFeature = childFeatureCLO;
                parentFeatureCLO.RelatedCLOS.Add(newCLO);
                childFeatureCLO.RelatedCLOS.Add(newCLO);
            }

            // Register and return it
            newCLO.Initialize();
            _factoryCLORegister[newCLO.GetClientID()] = newCLO;
            return newCLO;
        },
        GroupRelation: function (blo, parentFeatureCLO, childFeatureCLOs) {

            // Create the clo
            var newClientID = getNewClientID();
            var newCLO = new GroupRelationCLO(newClientID, blo);

            // Set parent/child feature CLOs if they are provided as parameters
            if (parentFeatureCLO !== undefined && childFeatureCLOs !== undefined) {
                newCLO.ParentFeature = parentFeatureCLO;
                parentFeatureCLO.RelatedCLOS.Add(newCLO);

                // ChildFeatureCLOs
                for (var i = 0; i < childFeatureCLOs.length; i++) {
                    newCLO.ChildFeatures.Add(childFeatureCLOs[i]);
                    childFeatureCLOs[i].RelatedCLOS.Add(newCLO);
                }
                
            }
           
            // Register and return it
            newCLO.Initialize();
            _factoryCLORegister[newCLO.GetClientID()] = newCLO;
            return newCLO;
        },
        CompositionRule: function (blo, firstFeatureCLO, secondFeatureCLO) {

            // Create the clo
            var newClientID = getNewClientID();
            var newCLO = new CompositionRuleCLO(newClientID, blo);

            // Set parent/child feature CLOs if they are provided as parameters
            if (firstFeatureCLO !== undefined && secondFeatureCLO !== undefined) {
                newCLO.FirstFeature = firstFeatureCLO;
                newCLO.SecondFeature = secondFeatureCLO;
                firstFeatureCLO.RelatedCLOS.Add(newCLO);
                secondFeatureCLO.RelatedCLOS.Add(newCLO);
            }

            // Register and return it
            newCLO.Initialize();
            _factoryCLORegister[newCLO.GetClientID()] = newCLO;
            return newCLO;
        },
        CustomRule: function (blo) {

            // Create the clo
            var newClientID = getNewClientID();
            var newCLO = new CustomRuleCLO(newClientID, blo);

            // Register and return it
            newCLO.Initialize();
            _factoryCLORegister[newCLO.GetClientID()] = newCLO;
            return newCLO;
        },
        CustomFunction: function (blo) {

            // Create the clo
            var newClientID = getNewClientID();
            var newCLO = new CustomFunctionCLO(newClientID, blo);
            

            // Register and return it
            newCLO.Initialize();
            _factoryCLORegister[newCLO.GetClientID()] = newCLO;
            return newCLO;
        }
    }
    var ToBLO = {
        FeatureModel: function (clo) {

            // Get its BLO
            var blo = clo.GetBLOCopy();

            // Child collections
            var collectionNames = {
                Features: "Features",
                Relations: "Relations",
                GroupRelations: "GroupRelations",
                CompositionRules: "CompositionRules",
                CustomRules: "CustomRules",
                CustomFunctions: "CustomFunctions"
            }
            for (var key in collectionNames) {
                for (var i = 0; i < clo[key].GetLength() ; i++) {
                    if (blo[key] === undefined)
                        blo[key] = [];
                    var childCLO = clo[key].GetAt(i);
                    var childBLO = ToBLO[childCLO.GetType()](childCLO);
                    blo[key].push(childBLO);
                }
            }

            //
            return blo;
        },
        Feature: function (clo) {

            // Get its BLO
            var blo = clo.GetBLOCopy();

            // Child Attributes
            for (var i = 0; i < clo.Attributes.GetLength() ; i++) {
                var attributeCLO = clo.Attributes.GetAt(i);
                var attributeBLO = ToBLO[CLOTypes.Attribute](attributeCLO);
                if (blo.Attributes === undefined)
                    blo.Attributes = [];
                blo.Attributes.push(attributeBLO);
            }

            //
            return blo;
        },
        Attribute: function (clo) {

            // Get its BLO
            var blo = clo.GetBLOCopy();

            //
            return blo;
        },
        Relation: function (clo) {

            // Get its BLO
            var blo = clo.GetBLOCopy();

            // Get Parent/Child Features
            blo.ParentFeature = ToBLO[CLOTypes.Feature](clo.ParentFeature);
            blo.ChildFeature = ToBLO[CLOTypes.Feature](clo.ChildFeature);

            //
            return blo;
        },
        GroupRelation: function (clo) {

            // Get its BLO
            var blo = clo.GetBLOCopy();

            // Get Parent/Child Features
            blo.ParentFeature = ToBLO[CLOTypes.Feature](clo.ParentFeature);
            for (var i = 0; i < clo.ChildFeatures.GetLength() ; i++) {
                var childFeatureCLO = clo.ChildFeatures.GetAt(i);
                var childFeatureBLO = ToBLO[CLOTypes.Feature](childFeatureCLO);

                if (blo.ChildFeatures === undefined)
                    blo.ChildFeatures = [];
                blo.ChildFeatures.push(childFeatureBLO);
            }

            //
            return blo;
        },
        CompositionRule: function (clo) {

            // Get its BLO
            var blo = clo.GetBLOCopy();

            // Get First/Second Features
            blo.FirstFeature = ToBLO[CLOTypes.Feature](clo.FirstFeature);
            blo.SecondFeature = ToBLO[CLOTypes.Feature](clo.SecondFeature);

            //
            return blo;
        },
        CustomRule: function (clo) {

            //
            var blo = clo.GetBLOCopy();

            //
            return blo;
        },
        CustomFunction: function (clo) {

            //
            var blo = clo.GetBLOCopy();

            //
            return blo;
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
    function stripOffChildArrays(blo) {

        // Variables
        var strippedOffArrays = {};

        // Go through all properties on the given blo object and remove them if they are of the Array type
        for (var propertyName in blo) {
            if ($.isArray(blo[propertyName])) {
                strippedOffArrays[propertyName] = blo[propertyName];
                delete blo[propertyName];
            }
        }

        return strippedOffArrays;
    }

    // Init
    this.Initialize = function () {
    }

    // Public methods
    this.GetByClientID = function (clientID) {
        return _factoryCLORegister[clientID];
    }
    this.ToBLO = function (clo) {

        // Get the BLO
        var blo = ToBLO[clo.GetType()](clo);
        return blo;
    }
    this.FromBLO = function (blo, type) {

        // Create the CLO
        var clo = FromBLO[type](blo);
        return clo;
    }
    this.CreateNewCLO = function (cloType, extraParamsArrays) {

        // Get a new default BLO
        var newBLO = _bloService.GetDefaultBLO(cloType);

        // Setup parameters to include extra parameters, if any are provided
        var params = (extraParamsArrays !== undefined) ? extraParamsArrays : [];
        params.unshift(newBLO);

        // Create the CLO
        var newCLO = FromBLO[cloType].apply(_this, params);
        return newCLO;
    }
    this.Reset = function () { // used when loading a new FeatureModel
        _clientIDCounter = 0;
        _factoryCLORegister = {};
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
            data: { bloType: bloTypeName },
            async: false,
            success: function (response) {
                newDefaultBLO = response;
            }
        });

        return newDefaultBLO;
    }
    this.SaveChanges = function (featureModelBLO) {

        var newDefaultBLO = null;
        $.ajax({
            dataType: "json",
            type: "POST",
            url: "api/GlobalAPI/SaveChanges",
            data: JSON.stringify(featureModelBLO),
            async: false,
            success: function (response) {
                newDefaultBLO = response;
            }
        });

        return newDefaultBLO;
    }
    this.GetFeatureModel = function (featureModelName) {
        var newDefaultBLO = null;
        $.ajax({
            type: "Get",
            url: "api/GlobalAPI/GetFeatureModel",
            data: { featureModelName: featureModelName },
            async: false,
            success: function (response) {
                newDefaultBLO = response;
            }
        });

        return newDefaultBLO;
    }
}

// Special components
var IdentifierProvider = (function () { // "static" class

    // Methods
    function getNewCLOIdentifier(cloType, collection) {

        // Variables
        var identifier = cloType + "_" + collection.GetAbsoluteItemCounter();
        if (collection.ContainsItemWith("Identifier", identifier)) {
            var i = collection.GetAbsoluteItemCounter();
            do {
                i = i + 1;
                identifier = cloType + "_" + i;
            } while (collection.ContainsItemWith("Identifier", identifier));
        }
        return identifier;
    }
    function setupIdentifier(clo, parentCLO) { // parentCLO can be the FeatureModel or the Feature (if an attribute is passed as the clo)

        // If the clo to be added doesnt have an identifier, provide it with one
        if (clo.Identifier !== undefined && clo.Identifier() === null) {

            var collection = parentCLO[clo.GetType() + "s"]; // get the collection corresponding to the type of the given CLO 
            var autoGeneratedIdentifier = getNewCLOIdentifier(clo.GetType(), collection);

            clo.Identifier(autoGeneratedIdentifier);
            if (clo.Name !== undefined)
                clo.Name(autoGeneratedIdentifier);

        }
    }

    // Public methods
    return {
        SetupIdentifier: setupIdentifier
    };
})();
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
UIComponents.PropertyEditor.GroupRelationInnerEditor = {};
UIComponents.PropertyEditor.CompositionRuleInnerEditor = {};
UIComponents.PropertyEditor.CustomRuleInnerEditor = {};
UIComponents.PropertyEditor.CustomFunctionInnerEditor = {};
UIComponents.VisualView = {};
UIComponents.VisualView.FeatureElem = {};
UIComponents.VisualView.RelationElem = {};
UIComponents.VisualView.GroupRelationElem = {};
UIComponents.VisualView.CompositionRuleElem = {};
UIComponents.VisualView.ConnectionElem = {};
UIComponents.VisualView.ConnectorElem = {};
UIComponents.VisualView.CardinalityLabel = {};
UIComponents.Shared = {};