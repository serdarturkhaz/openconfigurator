// Settings and defaults
var Settings = {
    UIOrientation: "Vertical", //determines orientation of diagram - options: Horizontal / Vertical / false (automatic - needs bug fixing to work properly),
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
var Enums = {
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
    ConnectorPositionType: {
        EndPoint: "EndPoint",
        StartPoint: "StartPoint"
    },
    CLODataStates: {
        Unchanged: "Unchanged",
        Modified: "Modified",
        Deleted: "Deleted",
        New: "New"
    }
}
var SystemDefaults = {
    Orientations: {
        Horizontal: {
            Name: "Horizontal",
            Opposite: "Vertical",
            CardinalityDistances: {
                GroupRelation: 35,
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
                    check: function (rootPoint, pointA) {
                        if (rootPoint.x > pointA.x) {
                            return true;
                        }
                    },
                    arcSweep: 1
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
                GroupRelation: 35,
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


        // Knockout test///////////////////////////
        if (_this.Features.GetLength() > 0) {
            _this.Features.GetAt(0).Name("Newname");
        }
        ////////////////////////////////////////////
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
    this.Identifier = new ObservableField(_innerBLO, "Identifier");
    this.ParentFeature = null;
    this.ChildFeature = null;
    this.RelationType = new ObservableField(_innerBLO, "RelationType");
    this.UpperBound = new ObservableField(_innerBLO, "UpperBound");
    this.LowerBound = new ObservableField(_innerBLO, "LowerBound");

    // Init
    this.Initialize = function () {

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
        _visualView.StateChanged.AddHandler(new EventHandler(_commandToolbar.OnVisualViewStateChanged));
        _visualView.UIElementSelected.AddHandler(new EventHandler(_modelExplorer.OnRelatedViewUIElementSelected));
        _visualView.UIElementDeselected.AddHandler(new EventHandler(_modelExplorer.OnRelatedViewUIElementDeselected));
        _modelExplorer.UIElementSelected.AddHandler(new EventHandler(_visualView.OnRelatedViewUIElementSelected));
        _modelExplorer.UIElementDeselected.AddHandler(new EventHandler(_visualView.OnRelatedViewUIElementDeselected));

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
        _currentControlFocus.DeleteSelection();
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

        }
    }
    this.LoadNewModel = function () {

        // Init a new FeatureModelCLO
        _currentFeatureModelCLO = _cloFactory.CreateNewCLO(CLOTypes.FeatureModel);
        _this.ModelLoaded.RaiseEvent(_currentFeatureModelCLO);
    }

    // Events
    this.ModelLoaded = new Event();
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

        // Get references to html elems
        _container = container;
        _innerElems.modelManipulationItems.newFeatureItem = $(_container).find("#newFeatureItem");
        _innerElems.modelManipulationItems.newRelationItem = $(_container).find("#newRelationItem");
        _innerElems.modelManipulationItems.newGroupRelationItem = $(_container).find("#newGroupRelationItem");
        _innerElems.modelManipulationItems.newCompositionRuleItem = $(_container).find("#newCompositionRuleItem");
        _innerElems.modelManipulationItems.newCustomRuleItem = $(_container).find("#newCustomRuleItem");
        _innerElems.modelManipulationItems.newCustomFunctionItem = $(_container).find("#newCustomFunctionItem");

        // Set event handlers
        $(_innerElems.modelManipulationItems.newFeatureItem).bind("click", toolbarItemHandlers.newFeatureItemTriggered);
        $(_innerElems.modelManipulationItems.newRelationItem).bind("click", toolbarItemHandlers.newRelationItemTriggered);
        $(_innerElems.modelManipulationItems.newGroupRelationItem).bind("click", toolbarItemHandlers.newGroupRelationItemTriggered);
        $(_innerElems.modelManipulationItems.newCompositionRuleItem).bind("click", toolbarItemHandlers.newCompositionRuleItemTriggered);
        $(_innerElems.modelManipulationItems.newCustomRuleItem).bind("click", toolbarItemHandlers.newCustomRuleItemTriggered);
        $(_innerElems.modelManipulationItems.newCustomFunctionItem).bind("click", toolbarItemHandlers.newCustomFunctionItemTriggered);

        // Key shortcut handlers
        $(document).keydown(function (e) {
            $.ctrl('F', toolbarItemHandlers.newFeatureItemTriggered);
            $.ctrl('R', toolbarItemHandlers.newRelationItemTriggered);
            $.ctrl('G', toolbarItemHandlers.newGroupRelationItemTriggered);
            $.ctrl('M', toolbarItemHandlers.newCompositionRuleItemTriggered);
            $.ctrl('U', toolbarItemHandlers.newCustomRuleItemTriggered);
            $.ctrl('N', toolbarItemHandlers.newCustomFunctionItemTriggered);
        });

    }

    // Event handlers
    this.OnVisualViewStateChanged = function (oldStateName, newStateName) {

        // Mappings from VisualView states to item buttons in command bar
        var itemToVisualViewStateMappings = {};
        itemToVisualViewStateMappings[Enums.VisualView.StateNames.CreatingNewFeature] = _innerElems.modelManipulationItems.newFeatureItem;
        itemToVisualViewStateMappings[Enums.VisualView.StateNames.CreatingNewRelation] = _innerElems.modelManipulationItems.newRelationItem;

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
        }

    };
}
UIControls.ModelExplorer = function (container, dataModel) {

    // Fields
    var _container = container, _dataModel = dataModel;
    var _tree = null, _treeOptions = {
        data: [
                {
                    ID: "CompositionRulesNode",
                    Name: "Composition Rules",
                    typeName: "Folder"
                },
                {
                    ID: "CustomRulesNode",
                    Name: "Custom Rules",
                    typeName: "Folder"
                },
                {
                    ID: "CustomFunctionsNode",
                    Name: "Custom Functions",
                    typeName: "Folder"
                },
                {
                    ID: "FeaturesNode",
                    Name: "Features",
                    typeName: "Folder"
                }
        ],
        types: {
            Folder: {
                idField: "ID",
                labelField: "Name",
                selectable: false
            },
            Feature: {
                idField: "ID",
                labelField: "Name",
                selectable: true
            },
            CompositionRule: {
                idField: "ID",
                labelField: "Name",
                selectable: true
            },
            CustomRule: {
                idField: "ID",
                labelField: "Name",
                selectable: true
            },
            CustomFunction: {
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
    function removeElement(node) {
        $(node).deleteNode();
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

    // Public methods
    this.DeleteSelection = function () {
        var oldSelectedElements = _selectedElements.slice();
        for (var i = 0; i < oldSelectedElements.length ; i++) {
            _dataModel.DeleteByClientID(oldSelectedElements[i].getNodeDataID());
        }
    }

    // Events
    this.Focus = new Event();
    this.UIElementSelected = new Event();
    this.UIElementDeselected = new Event();

    // Event handlers
    this.OnModelLoaded = function (modelCLO) {

        // Bind to it
        modelCLO.Features.Added.AddHandler(new EventHandler(modelHandlers.onCLOAdded));
        modelCLO.Features.Removed.AddHandler(new EventHandler(modelHandlers.onCLORemoved));
        modelCLO.CompositionRules.Added.AddHandler(new EventHandler(modelHandlers.onCLOAdded));
        modelCLO.CompositionRules.Removed.AddHandler(new EventHandler(modelHandlers.onCLORemoved));
        modelCLO.CustomRules.Added.AddHandler(new EventHandler(modelHandlers.onCLOAdded));
        modelCLO.CustomRules.Removed.AddHandler(new EventHandler(modelHandlers.onCLORemoved));
        modelCLO.CustomFunctions.Added.AddHandler(new EventHandler(modelHandlers.onCLOAdded));
        modelCLO.CustomFunctions.Removed.AddHandler(new EventHandler(modelHandlers.onCLORemoved));

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
        onCLOAdded: function (clo) {
            addElement(clo, clo.GetType());
        },
        onCLORemoved: function (clo) {
            var nodeElem = $(_tree).getNode(clo.GetClientID());
            deselectElement(nodeElem, false);
            removeElement(nodeElem);
        }
    }
}
UIControls.VisualView = function (container, dataModel) {

    // Fields
    var _container = container, _dataModel = dataModel;
    var _canvasContainer = null, _canvas = null;
    var _innerElems = {
        headerLabel: null,
        infoMsgOverlay: null
    };
    var _wireframes = {
        featureWireframe: null
    };
    var _innerStateManager = null, _currentFeatureModelCLO = null;;
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
        newFeatureElem.DragStarted.AddHandler(new EventHandler(function () {
            featureElemHandlers.onFeatureDragStarted(newFeatureElem);
        }));
        newFeatureElem.Dragging.AddHandler(new EventHandler(function (dx, dy) {
            featureElemHandlers.onFeatureDragging(newFeatureElem, dx, dy);
        }));
    }
    function addRelationElem(relationCLO) {

        // Create a new relation
        var newRelationElem = new UIControls.VisualView.RelationElem(relationCLO, _visualUIElems[relationCLO.ParentFeature.GetClientID()], _visualUIElems[relationCLO.ChildFeature.GetClientID()], _canvas);
        newRelationElem.Initialize();
        _visualUIElems[relationCLO.GetClientID()] = newRelationElem;

        // Bind to it
        newRelationElem.Clicked.AddHandler(new EventHandler(function (ctrlKey) {
            standardOnElemClicked(newRelationElem, ctrlKey);
        }));
    }
    function addGroupRelationElem(groupRelationCLO) {

        //
        var childFeatureElems = [];
        for (var i = 0; i < groupRelationCLO.ChildFeatures.GetLength() ; i++) {
            childFeatureElems.push(_visualUIElems[groupRelationCLO.ChildFeatures.GetAt(i).GetClientID()]);
        }

        // Create a new group relation
        var newGroupRelationElem = new UIControls.VisualView.GroupRelationElem(groupRelationCLO, _visualUIElems[groupRelationCLO.ParentFeature.GetClientID()], childFeatureElems, _canvas);
        newGroupRelationElem.Initialize();
        _visualUIElems[groupRelationCLO.GetClientID()] = newGroupRelationElem;

        // Bind to it
        newGroupRelationElem.Clicked.AddHandler(new EventHandler(function (ctrlKey) {
            standardOnElemClicked(newGroupRelationElem, ctrlKey);
        }));
    }
    function addCompositionRuleElem(compositionRuleCLO) {

        // Create a new composition rule
        var newCompositionRuleElem = new UIControls.VisualView.CompositionRuleElem(compositionRuleCLO, _visualUIElems[compositionRuleCLO.FirstFeature.GetClientID()],
            _visualUIElems[compositionRuleCLO.SecondFeature.GetClientID()], _canvas);
        newCompositionRuleElem.Initialize();
        _visualUIElems[compositionRuleCLO.GetClientID()] = newCompositionRuleElem;

        // Bind to it
        newCompositionRuleElem.Clicked.AddHandler(new EventHandler(function (ctrlKey) {
            standardOnElemClicked(newCompositionRuleElem, ctrlKey);
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

        // Get references to dom elements
        _canvasContainer = $(_container).find("#SVGCanvasWrapper");
        _innerElems.headerLabel = $(_container).find(".headerLabel");
        _innerElems.infoMsgOverlay = $(_container).find(".infoMsgOverlay");
        _canvas = Raphael($(_canvasContainer).children("#SVGCanvas")[0], "100%", "100%");
        _innerStateManager = new InnerStateManager(UIControls.VisualView.InnerStates, UIControls.VisualView.InnerStates.Default.Name, _this.StateChanged);
        _innerStateManager.Initialize(); // setup mode manager and enter initial mode

        // Handler for onFocus
        $(_container).mousedown(function (e) {
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
        _innerStateManager.SwitchToState(UIControls.VisualView.InnerStates.CreatingNewFeature.Name);
    }
    this.StartCreateRelation = function () {
        _innerStateManager.SwitchToState(UIControls.VisualView.InnerStates.CreatingNewRelation.Name);
    }
    this.StartCreateGroupRelation = function () {
        _innerStateManager.SwitchToState(UIControls.VisualView.InnerStates.CreatingNewGroupRelation.Name);
    }
    this.StartCreateCompositionRule = function () {
        _innerStateManager.SwitchToState(UIControls.VisualView.InnerStates.CreatingNewCompositionRule.Name);
    }
    this.DeleteSelection = function () {
        var oldSelectedElements = _selectedElements.slice();
        for (var i = 0; i < oldSelectedElements.length ; i++) {
            _dataModel.DeleteByClientID(oldSelectedElements[i].GetCLO().GetClientID());
        }
    }

    // Events
    this.Focus = new Event();
    this.StateChanged = new Event();
    this.UIElementSelected = new Event();
    this.UIElementDeselected = new Event();

    // Event handlers
    this.OnModelLoaded = function (modelCLO) {

        // On Added handlers
        _currentFeatureModelCLO = modelCLO;
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
                deselectElement(elem, false);
                delete _visualUIElems[clo.GetClientID()];
                elem.RemoveSelf();
            }
        }
    }
    var featureElemHandlers = {
        onClicked: function (featureElem, ctrlKey) {
            // Control key down
            if (ctrlKey === true) {
                if (featureElem.IsSelected()) {
                    deselectElement(featureElem, true); // deselect
                }
                else {
                    selectElement(featureElem, true); // add to selection
                }
            }
            else {
                // No control key
                clearSelection();
                if (!featureElem.IsSelected()) {
                    selectElement(featureElem, true); // add to selection
                }
            }
        },
        onFeatureDragStarted: function (featureElem) {
            if (featureElem.IsSelected() === true) {

                // Start move for all the selected featureElems
                for (var i = 0; i < _selectedElements.length; i++) {
                    if (_selectedElements[i].GetType() === Enums.VisualView.ElemTypes.FeatureElem) {
                        _selectedElements[i].StartMove();
                    }
                }
            }
        },
        onFeatureDragging: function (featureElem, dx, dy) {
            if (featureElem.IsSelected() === true) {
                // Move all the selected featureElems
                for (var i = 0; i < _selectedElements.length; i++) {
                    if (_selectedElements[i].GetType() === Enums.VisualView.ElemTypes.FeatureElem) {
                        _selectedElements[i].MoveXYBy(dx, dy);
                    }
                }
            }
        }
    }
    var standardOnElemClicked = function (elem, ctrlKey) {
        // If control key isnt used, clear out any currently selected elements
        if (ctrlKey !== true) {
            clearSelection();
        }

        // Select or deselect the uiElem
        if (elem.IsSelected() === true) {
            deselectElement(elem, true);
        } else {
            selectElement(elem, true);
        }
    }


    // Inner modes
    UIControls.VisualView.InnerStates = {};
    UIControls.VisualView.InnerStates[Enums.VisualView.StateNames.Default] = {
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
                        clearSelection(); // clear selection ONLY if ctrl is not pressed
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
    UIControls.VisualView.InnerStates[Enums.VisualView.StateNames.CreatingNewFeature] = {
        Name: "CreatingNewFeature",
        EnterState: function () {
            clearSelection();
            _innerElems.infoMsgOverlay.html("Click to add a new Feature...").show();

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
                _innerStateManager.SwitchToState(UIControls.VisualView.InnerStates.Default.Name);
            });

        },
        LeaveState: function () {
            _innerElems.infoMsgOverlay.html("").hide();

            // Clear handlers
            $(_canvasContainer).unbind("click.createFeature");
            $(_canvasContainer).unbind("mousemove.moveWireframeFeature");
            _wireframes.featureWireframe.remove();
        }
    };
    UIControls.VisualView.InnerStates[Enums.VisualView.StateNames.CreatingNewRelation] = {
        Name: "CreatingNewRelation",
        EnterState: function () {
            clearSelection();
            _innerElems.infoMsgOverlay.html("Select the parent feature for the Relation...").show();

            // Variables
            var parentFeatureElem, childFeatureElem;

            // First step handlers (let user select parent feature)
            this.normalFeatureElemOnclick = featureElemHandlers.onClicked; // store the usual feature onclick handler
            featureElemHandlers.onClicked = firstStepClickHandler;
            function firstStepClickHandler(featureElem) {
                parentFeatureElem = featureElem;
                selectElement(parentFeatureElem, true);

                // Prepare for the second step
                featureElemHandlers.onClicked = secondStepClickHandler;
                _innerElems.infoMsgOverlay.html("Now select the child Feature for the Relation...").show();
            }

            // Second step handlers (let user select child feature)
            function secondStepClickHandler(featureElem) {
                if (featureElem === parentFeatureElem) { // check whether the user is trying to select the same feature twice
                    _innerElems.infoMsgOverlay.html("Select a different child feature...");
                } else {
                    childFeatureElem = featureElem;
                    selectElement(featureElem, true);

                    // Create a new CLO
                    var newRelationCLO = _dataModel.CreateNewCLO(CLOTypes.Relation);
                    newRelationCLO.ParentFeature = parentFeatureElem.GetCLO();
                    newRelationCLO.ChildFeature = childFeatureElem.GetCLO();
                    parentFeatureElem.GetCLO().RelatedCLOS.Add(newRelationCLO);
                    childFeatureElem.GetCLO().RelatedCLOS.Add(newRelationCLO);

                    // Add it to the FeatureModel and then switch to default state
                    _dataModel.GetCurrentFeatureModelCLO().Relations.Add(newRelationCLO);
                    _innerStateManager.SwitchToState(UIControls.VisualView.InnerStates.Default.Name);
                }
            }
        },
        LeaveState: function () {
            _innerElems.infoMsgOverlay.html("").hide();

            // Restore the old feature onclick handler
            featureElemHandlers.onClicked = this.normalFeatureElemOnclick;
            delete this.normalFeatureElemOnclick;
        }
    }
    UIControls.VisualView.InnerStates[Enums.VisualView.StateNames.CreatingNewGroupRelation] = {
        Name: "CreatingNewGroupRelation",
        EnterState: function () {
            clearSelection();
            _innerElems.infoMsgOverlay.html("Select the parent feature for the Group Relation...").show();

            // Variables
            var parentFeatureElem, childFeatureElems = [];

            // First step handlers (let user select parent feature)
            this.normalFeatureElemOnclick = featureElemHandlers.onClicked; // store the usual feature onclick handler
            featureElemHandlers.onClicked = firstStepClickHandler;
            function firstStepClickHandler(featureElem) {
                parentFeatureElem = featureElem;
                selectElement(parentFeatureElem, true);

                // Prepare for the second step
                featureElemHandlers.onClicked = secondStepClickHandler;
                _innerElems.infoMsgOverlay.html("Now select the child Features and press ENTER when done...").show();
            }

            // Second step handlers (let user select child features)
            function secondStepClickHandler(featureElem) {
                if (featureElem === parentFeatureElem) { // check whether the user is trying to select the same feature twice
                    _innerElems.infoMsgOverlay.html("Select a different child feature...");
                } else {

                    childFeatureElems.push(featureElem);
                    selectElement(featureElem, true);
                }
            }

            // Handler when enter is pressed
            $(document).bind("keydown.enter", function (e) {
                if (e.which === 13) { //enter key
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
                        _innerStateManager.SwitchToState(UIControls.VisualView.InnerStates.Default.Name);
                    }
                }
            });
        },
        LeaveState: function () {
            _innerElems.infoMsgOverlay.html("").hide();

            // Restore the old feature onclick handler
            featureElemHandlers.onClicked = this.normalFeatureElemOnclick;
            delete this.normalFeatureElemOnclick;

            // Remove other handlers
            $(document).unbind("keydown.enter");
        }
    }
    UIControls.VisualView.InnerStates[Enums.VisualView.StateNames.CreatingNewCompositionRule] = {
        Name: "CreatingNewCompositionRule",
        EnterState: function () {
            clearSelection();
            _innerElems.infoMsgOverlay.html("Select the first feature for the Composition Rule...").show();

            // Variables
            var firstFeatureElem, secondFeatureElem;

            // First step handlers (let user select parent feature)
            this.normalFeatureElemOnclick = featureElemHandlers.onClicked; // store the usual feature onclick handler
            featureElemHandlers.onClicked = firstStepClickHandler;
            function firstStepClickHandler(featureElem) {
                firstFeatureElem = featureElem;
                selectElement(firstFeatureElem, true);

                // Prepare for the second step
                featureElemHandlers.onClicked = secondStepClickHandler;
                _innerElems.infoMsgOverlay.html("Now select the second Feature...").show();
            }

            // Second step handlers (let user select child feature)
            function secondStepClickHandler(featureElem) {
                if (featureElem === firstFeatureElem) { // check whether the user is trying to select the same feature twice
                    _innerElems.infoMsgOverlay.html("Select a different Feature...");
                } else {
                    secondFeatureElem = featureElem;
                    selectElement(secondFeatureElem, true);

                    // Create a new CLO
                    var newCompositionRuleCLO = _dataModel.CreateNewCLO(CLOTypes.CompositionRule);
                    newCompositionRuleCLO.FirstFeature = firstFeatureElem.GetCLO();
                    newCompositionRuleCLO.SecondFeature = secondFeatureElem.GetCLO();
                    firstFeatureElem.GetCLO().RelatedCLOS.Add(newCompositionRuleCLO);
                    secondFeatureElem.GetCLO().RelatedCLOS.Add(newCompositionRuleCLO);

                    // Add it to the FeatureModel and then switch to default state
                    _dataModel.GetCurrentFeatureModelCLO().CompositionRules.Add(newCompositionRuleCLO);
                    _innerStateManager.SwitchToState(UIControls.VisualView.InnerStates.Default.Name);
                }
            }
        },
        LeaveState: function () {
            _innerElems.infoMsgOverlay.html("").hide();

            // Restore the old feature onclick handler
            featureElemHandlers.onClicked = this.normalFeatureElemOnclick;
            delete this.normalFeatureElemOnclick;
        }
    }

}
UIControls.VisualView.FeatureElem = function (featureCLO, parentCanvasInstance) {

    // Fields
    var _featureCLO = featureCLO, _canvasInstance = parentCanvasInstance;
    var _currentState = Enums.UIElementStates.Unselected;
    var _outerElement = null, _glow = null;
    var _dontTriggerClickOnMouseUp = false; // special variable to avoid click being triggered on mouseup after a selected feature has been dragged (which would result in all the other selected ones being deselected)
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
    this.GetType = function () {
        return Enums.VisualView.ElemTypes.FeatureElem;
    }
    this.GetCLO = function () {
        return _featureCLO;
    }
    this.IsSelected = function () {
        return _currentState === Enums.UIElementStates.Selected;
    }
    this.GetBox = function () {
        return _outerElement;
    };

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
            if (_dontTriggerClickOnMouseUp === false) {
                // Raise events
                _this.Clicked.RaiseEvent(e.ctrlKey);
            }
            else {
                _dontTriggerClickOnMouseUp = false;
            }
        });
    }
    function makeDraggable() {

        // Drag and droppable
        var start = function () {
            _this.DragStarted.RaiseEvent();
        };
        move = function (dx, dy) {
            if (_glow !== null) {
                _glow.remove();
                _glow = null;
            }

            if (dx !== 0 && _this.IsSelected()) {
                _dontTriggerClickOnMouseUp = true;
            }

            _this.Dragging.RaiseEvent(dx, dy);
        };
        up = function () {

        };
        _outerElement.drag(move, start, up);
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
    this.RemoveSelf = function () {

        // Remove elements
        _outerElement.remove();
        _innerElements.box.remove();
        _innerElements.text.remove();
        if (_glow !== null)
            _glow.remove();
    }
    this.SetSelectedState = function (state) {
        _currentState = state;
        _innerElements.box.attr(UIStyles.Feature.States[state].Box.attr);
    }
    this.StartMove = function () {

        // Store original coordinates for self and inner elements
        _outerElement.originalx = _outerElement.attr("x");
        _outerElement.originaly = _outerElement.attr("y");
        for (var innerElemKey in _innerElements) {
            var innerElem = _innerElements[innerElemKey];
            innerElem.originalx = innerElem.attr("x");
            innerElem.originaly = innerElem.attr("y");
        }
    }
    this.MoveXYBy = function (dx, dy) {

        // Update pos of outerElement and all innerElems
        _outerElement.attr({ x: _outerElement.originalx + dx, y: _outerElement.originaly + dy });
        for (var innerElemKey in _innerElements) {
            var innerElem = _innerElements[innerElemKey];
            innerElem.attr({ x: innerElem.originalx + dx, y: innerElem.originaly + dy });
        }

        // Raise events
        _this.Moving.RaiseEvent(dx, dy);
    }

    // Events
    this.Clicked = new Event();
    this.DragStarted = new Event();
    this.Dragging = new Event();
    this.Moving = new Event();
}
UIControls.VisualView.RelationElem = function (relationCLO, parentFeatureElem, childFeatureElem, parentCanvasInstance) {

    // Fields
    var _relationCLO = relationCLO, _canvasInstance = parentCanvasInstance;
    var _currentState = Enums.UIElementStates.Unselected;
    var _innerElements = {
        cardinalityElement: null,
        connection: null
    };
    var _this = this;

    // Properties
    this.GetType = function () {
        return Enums.VisualView.ElemTypes.RelationElem;
    }
    this.GetCLO = function () {
        return _relationCLO;
    }
    this.IsSelected = function () {
        return _currentState === Enums.UIElementStates.Selected;
    }

    // Private methods
    function makeSelectable() {
        //
        var handlers = {
            onClick: function (e) {
                _this.Clicked.RaiseEvent(e.ctrlKey);

                // Prevent dom propagation - so VisualView canvas click bind doesnt get triggered
                e.stopPropagation();
            },
            onMouseOver: function (e) {
                _innerElements.connection.ShowGlow();
            },
            onMouseOut: function (e) {
                _innerElements.connection.HideGlow();
            }
        }
        _innerElements.connection.MakeSelectable(handlers);
    }
    function refresh() {
        _innerElements.connection.RefreshGraphicalRepresentation();
        if (_innerElements.cardinalityElement != null)
            _innerElements.cardinalityElement.RefreshGraphicalRepresentation();
    }
    function getCardinalityElemPosition() {
        var cardinalityDistance = SystemDefaults.Orientations[Settings.UIOrientation].CardinalityDistances.Relation;
        var line = _innerElements.connection.InnerElements.line;
        var labelPoint = line.getPointAtLength(line.getTotalLength() - cardinalityDistance);
        return labelPoint;
    }
    function toggleCardinalityElement() {

        //
        switch (Settings.DisplayCardinalities) {
            // Full
            case "Full": // show for everything
                if (_innerElements.cardinalityElement === null) {
                    _innerElements.cardinalityElement = new UIControls.VisualView.CardinalityLabel(_relationCLO.LowerBound(), _relationCLO.UpperBound(), getCardinalityElemPosition, _canvasInstance);
                    _innerElements.cardinalityElement.Initialize();
                }
                _innerElements.cardinalityElement.Update(_relationCLO.LowerBound(), _relationCLO.UpperBound());
                break;

                // Partial
            case "Partial": // only show for cloneable Relations
                if (_relationCLO.RelationType() === Enums.RelationTypes.Cloneable) {
                    if (_innerElements.cardinalityElement == null) {
                        _innerElements.cardinalityElement = new UIControls.VisualView.CardinalityLabel(_relationCLO.LowerBound(), _relationCLO.UpperBound(), getCardinalityElemPosition, _canvasInstance);
                        _innerElements.cardinalityElement.Initialize();
                    }
                    _innerElements.cardinalityElement.Update(_relationCLO.LowerBound(), _relationCLO.UpperBound());
                } else {
                    if (_innerElements.cardinalityElement !== null) {
                        _innerElements.cardinalityElement.Delete();
                        _innerElements.cardinalityElement = null;
                    }
                }
                break;

                // None
            case "None": // hide all
                if (_innerElements.cardinalityElement != null) {
                    _innerElements.cardinalityElement.Delete();
                    _innerElements.cardinalityElement = null;
                }
                break;
        }
    }

    // Init
    this.Initialize = function () {

        // Create a new UIConnection
        var relationType = getEnumEntryNameByID(Enums.RelationTypes, _relationCLO.RelationType());
        _innerElements.connection = new UIControls.VisualView.ConnectionElem(parentFeatureElem.GetBox(), childFeatureElem.GetBox(), _relationCLO.GetType(), relationType, _canvasInstance);
        _innerElements.connection.Initialize();

        // Add handlers when parent/child feature elems are moving
        parentFeatureElem.Moving.AddHandler(new EventHandler(onRelatedFeatureMoving, "Relation_" + _relationCLO.GetClientID() + "_OnMoving"));
        childFeatureElem.Moving.AddHandler(new EventHandler(onRelatedFeatureMoving, "Relation_" + _relationCLO.GetClientID() + "_OnMoving"));

        // Setup other characteristics and elements
        toggleCardinalityElement();
        makeSelectable();
    }

    // Public methods
    this.SetSelectedState = function (state) {
        _currentState = state;
        _innerElements.connection.SetSelectedState(state);
    }
    this.IsWithinBounds = function (targetBbox) {
        return _innerElements.connection.IsWithinBounds(targetBbox);
    }
    this.RemoveSelf = function () {

        // Remove elements
        _innerElements.connection.RemoveSelf();
        if (_innerElements.cardinalityElement !== null)
            _innerElements.cardinalityElement.RemoveSelf();

        // Remove references and bind to them
        parentFeatureElem.Moving.RemoveHandler("Relation_" + _relationCLO.GetClientID() + "_OnMoving");
        childFeatureElem.Moving.RemoveHandler("Relation_" + _relationCLO.GetClientID() + "_OnMoving");
    }

    // Events
    this.Clicked = new Event();

    // Event handlers
    var onRelatedFeatureMoving = function () {
        refresh();
    }
}
UIControls.VisualView.GroupRelationElem = function (groupRelationCLO, parentFeatureElem, childFeatureElems, parentCanvasInstance) {

    // Fields
    var _groupRelationCLO = groupRelationCLO, _canvasInstance = parentCanvasInstance;
    var _currentState = Enums.UIElementStates.Unselected;
    var _innerElements = {
        cardinalityElement: null,
        connections: [],
        rootArc: null
    };
    var _this = this;

    // Properties
    this.GetType = function () {
        return Enums.VisualView.ElemTypes.GroupRelationElem;
    }
    this.GetCLO = function () {
        return _groupRelationCLO;
    }
    this.IsSelected = function () {
        return _currentState === Enums.UIElementStates.Selected;
    }

    // Private methods
    function makeSelectable() {
        //
        var handlers = {
            onClick: function (e) {
                _this.Clicked.RaiseEvent(e.ctrlKey);

                // Prevent dom propagation - so VisualView canvas click bind doesnt get triggered
                e.stopPropagation();
            },
            onMouseOver: function (e) {
                for (var i = 0; i < _innerElements.connections.length; i++) {
                    _innerElements.connections[i].ShowGlow();
                }
            },
            onMouseOut: function (e) {
                for (var i = 0; i < _innerElements.connections.length; i++) {
                    _innerElements.connections[i].HideGlow();
                }
            }
        }
        for (var i = 0; i < _innerElements.connections.length; i++) {
            _innerElements.connections[i].MakeSelectable(handlers);
        }
    }
    function refresh() {
        for (var i = 0; i < _innerElements.connections.length; i++) {
            _innerElements.connections[i].RefreshGraphicalRepresentation();
        }

        if (_innerElements.cardinalityElement != null)
            _innerElements.cardinalityElement.RefreshGraphicalRepresentation();
    }
    function getArcPath(firstConnection, lastConnection) {

        // Get points
        var rootPoint = firstConnection.InnerElements.line.getPointAtLength(0);
        var pointA = firstConnection.InnerElements.line.getPointAtLength(UIStyles.GroupRelation.General.RootArc.Dimensions.Length * Settings.ScaleModifier);
        var pointB = lastConnection.InnerElements.line.getPointAtLength(UIStyles.GroupRelation.General.RootArc.Dimensions.Length * Settings.ScaleModifier);

        // Get arc modifiers
        var rx = SystemDefaults.Orientations[Settings.UIOrientation].ArcModifiers.rx;
        var ry = SystemDefaults.Orientations[Settings.UIOrientation].ArcModifiers.ry;
        var arcSweep = null;

        for (var key in SystemDefaults.Orientations[Settings.UIOrientation].ArcDirection) {
            var arcDirection = SystemDefaults.Orientations[Settings.UIOrientation].ArcDirection[key];
            if (arcDirection.Check(rootPoint, pointA) === true) {
                arcSweep = arcDirection.ArcSweep;
                break;
            }
        }
        // Create the path
        var path = ["M", rootPoint.x.toFixed(3), rootPoint.y.toFixed(3),
                "L", pointA.x.toFixed(3), pointA.y.toFixed(3),
        //"L", pointB.x.toFixed(3), pointB.y.toFixed(3), - straight lines
                "A", rx, ry, 0, 0, arcSweep, pointB.x.toFixed(3), pointB.y.toFixed(3),
                "L", rootPoint.x.toFixed(3), rootPoint.y.toFixed(3)].join(",");
        return path;
    }
    function refreshArc() {

        //Get the new path
        var newPath = getArcPath(_innerElements.connections[0], _innerElements.connections[_innerElements.connections.length - 1]);
        _innerElements.rootArc.attr({ path: newPath });
    }
    function getCardinalityElemPosition() {
        var cardinalityDistance = SystemDefaults.Orientations[Settings.UIOrientation].CardinalityDistances.GroupRelation;
        var line = _innerElements.connections[0].InnerElements.line;
        var labelPoint = line.getPointAtLength(cardinalityDistance);
        return labelPoint;
    }
    function toggleCardinalityElement() {

        //
        switch (Settings.DisplayCardinalities) {
            // Full
            case "Full": // show for everything
                if (_innerElements.cardinalityElement === null) {
                    _innerElements.cardinalityElement = new UIControls.VisualView.CardinalityLabel(_groupRelationCLO.LowerBound(), _groupRelationCLO.UpperBound(), getCardinalityElemPosition, _canvasInstance);
                    _innerElements.cardinalityElement.Initialize();
                }
                _innerElements.cardinalityElement.Update(_groupRelationCLO.LowerBound(), _groupRelationCLO.UpperBound());
                break;

                // Partial
            case "Partial": // only show for cardinal groups
                if (_groupRelationCLO.GroupRelationType() === Enums.GroupRelationTypes.Cardinal) {
                    if (_innerElements.cardinalityElement == null) {
                        _innerElements.cardinalityElement = new UIControls.VisualView.CardinalityLabel(_groupRelationCLO.LowerBound(), _groupRelationCLO.UpperBound(), getCardinalityElemPosition, _canvasInstance);
                        _innerElements.cardinalityElement.Initialize();
                    }
                    _innerElements.cardinalityElement.Update(_groupRelationCLO.LowerBound(), _groupRelationCLO.UpperBound());
                } else {
                    if (_innerElements.cardinalityElement !== null) {
                        _innerElements.cardinalityElement.Delete();
                        _innerElements.cardinalityElement = null;
                    }
                }
                break;

                // None
            case "None": // hide all
                if (_innerElements.cardinalityElement != null) {
                    _innerElements.cardinalityElement.Delete();
                    _innerElements.cardinalityElement = null;
                }
                break;
        }
    }

    // Init
    this.Initialize = function () {

        // Create UIConnections for each child Feature
        var groupRelationType = getEnumEntryNameByID(Enums.GroupRelationTypes, _groupRelationCLO.GroupRelationType());
        for (var i = 0; i < childFeatureElems.length; i++) {
            var newConnection = new UIControls.VisualView.ConnectionElem(parentFeatureElem.GetBox(), childFeatureElems[i].GetBox(), _groupRelationCLO.GetType(), groupRelationType, _canvasInstance);
            newConnection.Initialize();
            _innerElements.connections.push(newConnection);
        }

        // Create Arc
        var arcPath = getArcPath(_innerElements.connections[0], _innerElements.connections[_innerElements.connections.length - 1]);
        _innerElements.rootArc = _canvasInstance.path(arcPath).attr(UIStyles.GroupRelation.General.RootArc.attr);
        _innerElements.rootArc.attr(UIStyles.GroupRelation.SubTypes[groupRelationType].RootArc.attr);

        // Add handlers when parent/child feature elems are moving
        parentFeatureElem.Moving.AddHandler(new EventHandler(onRelatedFeatureMoving, "GroupRelation_" + _groupRelationCLO.GetClientID() + "_OnMoving"));
        for (var i = 0; i < childFeatureElems.length; i++) {
            childFeatureElems[i].Moving.AddHandler(new EventHandler(onRelatedFeatureMoving, "GroupRelation_" + _groupRelationCLO.GetClientID() + "_OnMoving"));
        }

        // Setup other characteristics and elements
        toggleCardinalityElement();
        makeSelectable();
    }

    // Public methods
    this.SetSelectedState = function (state) {
        _currentState = state;
        for (var i = 0; i < _innerElements.connections.length; i++) {
            _innerElements.connections[i].SetSelectedState(state);
        }

    }
    this.IsWithinBounds = function (targetBbox) {
        var allConnectionsAreInBounds = true;
        for (var i = 0; i < _innerElements.connections.length; i++) {
            if (!_innerElements.connections[i].IsWithinBounds(targetBbox)) {
                allConnectionsAreInBounds = false;
                break;
            }
        }

        return allConnectionsAreInBounds;
    }
    this.RemoveSelf = function () {

        // Remove elements
        for (var i = 0; i < _innerElements.connections.length; i++) {
            _innerElements.connections[i].RemoveSelf();
        }
        if (_innerElements.cardinalityElement !== null) {
            _innerElements.cardinalityElement.RemoveSelf();
            _innerElements.cardinalityElement = null
        }

        // Remove handlers when parent/child feature elems are moving
        parentFeatureElem.Moving.RemoveHandler("GroupRelation_" + _groupRelationCLO.GetClientID() + "_OnMoving");
        for (var i = 0; i < childFeatureElems.length; i++) {
            childFeatureElems[i].Moving.RemoveHandler("GroupRelation_" + _groupRelationCLO.GetClientID() + "_OnMoving");
        }

        // Remove Arc
        _innerElements.rootArc.remove();
        _innerElements.rootArc = null;

    }

    // Events
    this.Clicked = new Event();

    // Event handlers
    var onRelatedFeatureMoving = function () {
        refresh();
        refreshArc();
    }
}
UIControls.VisualView.CompositionRuleElem = function (compositionRuleCLO, firstFeatureElem, secondFeatureElem, parentCanvasInstance) {

    // Fields
    var _compositionRuleCLO = compositionRuleCLO, _canvasInstance = parentCanvasInstance;
    var _currentState = Enums.UIElementStates.Unselected;
    var _innerElements = {
        connection: null
    };
    var _this = this;

    // Properties
    this.GetType = function () {
        return Enums.VisualView.ElemTypes.CompositionRuleElem;
    }
    this.GetCLO = function () {
        return _compositionRuleCLO;
    }
    this.IsSelected = function () {
        return _currentState === Enums.UIElementStates.Selected;
    }

    // Private methods
    function makeSelectable() {
        //
        var handlers = {
            onClick: function (e) {
                _this.Clicked.RaiseEvent(e.ctrlKey);

                // Prevent dom propagation - so VisualView canvas click bind doesnt get triggered
                e.stopPropagation();
            },
            onMouseOver: function (e) {
                _innerElements.connection.ShowGlow();
            },
            onMouseOut: function (e) {
                _innerElements.connection.HideGlow();
            }
        }
        _innerElements.connection.MakeSelectable(handlers);
    }
    function refresh() {
        _innerElements.connection.RefreshGraphicalRepresentation();
    }

    // Init
    this.Initialize = function () {

        // Create a new UIConnection
        var compositionRuleType = getEnumEntryNameByID(Enums.CompositionRuleTypes, _compositionRuleCLO.CompositionRuleType());
        _innerElements.connection = new UIControls.VisualView.ConnectionElem(firstFeatureElem.GetBox(), secondFeatureElem.GetBox(), _compositionRuleCLO.GetType(), compositionRuleType, _canvasInstance);
        _innerElements.connection.Initialize();

        // Add handlers when parent/child feature elems are moving
        firstFeatureElem.Moving.AddHandler(new EventHandler(onRelatedFeatureMoving, "CompositionRule_" + _compositionRuleCLO.GetClientID() + "_OnMoving"));
        secondFeatureElem.Moving.AddHandler(new EventHandler(onRelatedFeatureMoving, "CompositionRule_" + _compositionRuleCLO.GetClientID() + "_OnMoving"));

        // Setup other characteristics and elements
        makeSelectable();
    }

    // Public methods
    this.SetSelectedState = function (state) {
        _currentState = state;
        _innerElements.connection.SetSelectedState(state);
    }
    this.IsWithinBounds = function (targetBbox) {
        return _innerElements.connection.IsWithinBounds(targetBbox);
    }
    this.RemoveSelf = function () {

        // Remove elements
        _innerElements.connection.RemoveSelf();

        // Remove references and bind to them
        firstFeatureElem.Moving.RemoveHandler("CompositionRule_" + _compositionRuleCLO.GetClientID() + "_OnMoving");
        secondFeatureElem.Moving.RemoveHandler("CompositionRule_" + _compositionRuleCLO.GetClientID() + "_OnMoving");
    }

    // Events
    this.Clicked = new Event();

    // Event handlers
    var onRelatedFeatureMoving = function () {
        refresh();
    }
}
UIControls.VisualView.ConnectionElem = function (parentBox, childBox, parentElemType, parentElemSubType, parentCanvasInstance) {

    // Fields
    var _canvasInstance = parentCanvasInstance;
    var _innerElements = {
        line: null,
        connectors: {
            startConnector: null,
            endConnector: null
        }
    };
    var _currentPath = null, _handlers = null;
    var _outerElement = null, _glow = null;
    var _parentElemType = parentElemType, _parentElemSubType = parentElemSubType;
    var _currentState = Enums.UIElementStates.Unselected;
    var _this = this;

    // Properties
    this.GetCurrentPath = function () {
        return _currentPath;
    }
    this.InnerElements = _innerElements;

    // Private methods
    function getPath(objA, objB) {

        // Variables
        var bb1 = objA.getBBox();
        var bb2 = objB.getBBox();
        var objAcenter = {
            x: bb1.x + bb1.width / 2,
            y: bb1.y + bb1.height / 2
        };
        var objBcenter = {
            x: bb2.x + bb2.width / 2,
            y: bb2.y + bb2.height / 2
        };
        var connectionPoints = {
            firstObject: {
                top: { x: bb1.x + bb1.width / 2, y: bb1.y - 1 },
                bottom: { x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1 },
                left: { x: bb1.x - 1, y: bb1.y + bb1.height / 2 },
                right: { x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2 }
            },
            secondObject: {
                top: { x: bb2.x + bb2.width / 2, y: bb2.y - 1 },
                bottom: { x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1 },
                left: { x: bb2.x - 1, y: bb2.y + bb2.height / 2 },
                right: { x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2 }
            }
        };

        // Determine the orientation
        var currentOrientation = null;
        if (Settings.UIOrientation !== false) {
            currentOrientation = Settings.UIOrientation; //use default fixed orientation without calculating angle
        }
        else {
            var centerdx = objBcenter.x - objAcenter.x, centerdy = objBcenter.y - objAcenter.y;
            var angle = Math.atan2(-centerdy, centerdx) * 180 / Math.PI;
            angle = parseInt(angle.toFixed());
            if (angle < 0)
                angle += 360;
            for (var key in SystemDefaults.Orientations) {
                var orientation = SystemDefaults.Orientations[key];
                for (var i = 0; i < orientation.angleIntervals.length; i++) {
                    if (angle >= orientation.angleIntervals[i].min && angle <= orientation.angleIntervals[i].max) {
                        currentOrientation = orientation.name;
                        break;
                    }
                }
            }
        }

        // Invert orientation if necessary
        //if (invertOrientation)
        //    currentOrientation = systemDefaults.orientations[currentOrientation].opposite;

        // Determine which connection points in the current orientation make the shortest path
        var distances = [], points = {};
        for (var i = 0; i < SystemDefaults.Orientations[currentOrientation].Connections.length; i++) {
            var con = SystemDefaults.Orientations[currentOrientation].Connections[i];
            var x1 = connectionPoints.firstObject[con[0]].x, y1 = connectionPoints.firstObject[con[0]].y;
            var x2 = connectionPoints.secondObject[con[1]].x, y2 = connectionPoints.secondObject[con[1]].y;

            var dx = Math.abs(x1 - x2);
            var dy = Math.abs(y1 - y2);
            var distance = dx + dy;

            distances[i] = distance;
            points[distance] = {
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2,
                curveModifier: SystemDefaults.Orientations[currentOrientation].CurveModifiers[i]
            };
        }
        var closestConnection = points[Math.min.apply(Math, distances)];

        // Create path
        var path = null;
        if (Settings.DrawCurves === true) {
            path = [["M", closestConnection.x1.toFixed(1), closestConnection.y1.toFixed(1)],
            ["C",
            closestConnection.x1 + closestConnection.curveModifier.x * Settings.ScaleModifier,
            closestConnection.y1 + closestConnection.curveModifier.y * Settings.ScaleModifier,
            closestConnection.x2 - closestConnection.curveModifier.x * Settings.ScaleModifier,
            closestConnection.y2 - closestConnection.curveModifier.y * Settings.ScaleModifier,
            closestConnection.x2.toFixed(1), closestConnection.y2.toFixed(1)]];
        } else {
            path = ["M", closestConnection.x1.toFixed(3), closestConnection.y1.toFixed(3), "L", closestConnection.x2.toFixed(3), closestConnection.y2.toFixed(3)].join(","); //line
        }


        var returnObj = {
            path: path,
            startObj: objA,
            endObj: objB,
            StartPoint: {
                x: closestConnection.x1,
                y: closestConnection.y1
            },
            EndPoint: {
                x: closestConnection.x2,
                y: closestConnection.y2
            }
        };
        return returnObj;

    }
    function makeSelectable() {
        if (_handlers != null) {
            // Selectable
            _outerElement.click(function (e) {
                _handlers.onClick(e);
            });

            // Hoverable
            _outerElement.mouseover(function (e) {
                _handlers.onMouseOver(e);
            }).mouseout(function (e) {
                _handlers.onMouseOut(e);
            });
        }
    }
    function refresh() {

        // Calculate a new path
        _currentPath = getPath(parentBox, childBox);

        // Refresh line 
        var line = _innerElements.line;
        _outerElement.attr({ path: _currentPath.path });
        line.attr({ path: _currentPath.path });

        // Refresh position of connectors
        if (_innerElements.connectors.startConnector !== null) {
            _innerElements.connectors.startConnector.RefreshGraphicalRepresentation();
        }
        if (_innerElements.connectors.endConnector !== null) {
            _innerElements.connectors.endConnector.RefreshGraphicalRepresentation();
        }
    }
    function getCurrentStyle() {
        var commonStyle = UIStyles.Common.Connection.States[_currentState];
        var generalStyle = UIStyles[_parentElemType].General.Connection;
        var subTypeStyle = UIStyles[_parentElemType].SubTypes[_parentElemSubType].Connection;
        var currentStyle = $.extend(true, {}, commonStyle, generalStyle, subTypeStyle);

        return currentStyle;
    }

    // Initialize
    this.Initialize = function () {

        // Create line
        _currentPath = getPath(parentBox, childBox);
        _innerElements.line = _canvasInstance.path(_currentPath.path);
        var currentStyle = getCurrentStyle();
        _innerElements.line.attr(currentStyle.Line.attr);

        // Create startConnector
        if (currentStyle.Connectors.StartConnector !== undefined) {
            _innerElements.connectors.startConnector = new UIControls.VisualView.ConnectorElem(_this, currentStyle.Connectors.StartConnector, currentStyle.Connectors.StartConnector.attr, Enums.ConnectorPositionType.StartPoint, _canvasInstance);
            _innerElements.connectors.startConnector.Initialize();
        }

        // Create endConnector
        if (currentStyle.Connectors.EndConnector !== undefined) {
            _innerElements.connectors.endConnector = new UIControls.VisualView.ConnectorElem(_this, currentStyle.Connectors.EndConnector, currentStyle.Connectors.EndConnector.attr, Enums.ConnectorPositionType.EndPoint, _canvasInstance);
            _innerElements.connectors.endConnector.Initialize();
        }

        // Create the main outer element
        _outerElement = _canvasInstance.path(_currentPath.path).attr(UIStyles.Common.OuterElement.attr);
    }

    // Public functions
    this.RefreshGraphicalRepresentation = function () {
        refresh();
    }
    this.IsWithinBounds = function (targetBbox) {

        // Check whether the points are within the targetBbox
        if (Raphael.isPointInsideBBox(targetBbox, _currentPath.StartPoint.x, _currentPath.StartPoint.y) && Raphael.isPointInsideBBox(targetBbox, _currentPath.EndPoint.x, _currentPath.EndPoint.y)) {
            return true;
        } else {
            return false;
        }
    }
    this.SetSelectedState = function (state) {

        //
        _currentState = state;
        _innerElements.line.attr(UIStyles.Common.Connection.States[_currentState].Line.attr);
        _this.Update(_parentElemSubType); //hack-fix for state style overriding line style in CompositionRule
    }
    this.ShowGlow = function () {
        if (_glow === null) {
            _glow = _innerElements.line.glow(UIStyles.Common.Glow.attr);
        }
    }
    this.HideGlow = function () {
        if (_glow !== null) {
            _glow.remove();
            _glow = null;
        }
    }
    this.MakeSelectable = function (handlers) {
        _handlers = handlers;
        makeSelectable();
    }
    this.RemoveSelf = function () {

        //Remove Raphael objects
        _innerElements.line.remove();
        if (_innerElements.connectors.endConnector != null) {
            _innerElements.connectors.endConnector.RemoveSelf();
            _innerElements.connectors.endConnector = null;
        }
        if (_innerElements.connectors.startConnector != null) {
            _innerElements.connectors.startConnector.RemoveSelf();
            _innerElements.connectors.startConnector = null;
        }
        _outerElement.remove();
        _outerElement = null;
        if (_glow != null) {
            _glow.remove();
            _glow = null;
        }
    }
    this.Update = function (newParentElementSubType) {
        _parentElementSubType = newParentElementSubType;

        // Get the current style
        var currentStyle = getCurrentStyle();

        // Update line
        _innerElements.line.attr(currentStyle.Line.attr);

        // Update Connectors
        if (_innerElements.startConnector != null) {
            _innerElements.startConnector.Update(currentStyle.Connectors.StartConnector.attr);
        }
        if (_innerElements.endConnector != null) {
            _innerElements.endConnector.Update(currentStyle.Connectors.EndConnector.attr);

        }
    }
}
UIControls.VisualView.ConnectorElem = function (parentConnection, raphaelConnectorType, connectorStyle, positionType, parentCanvasInstance) {

    // Fields
    var _canvasInstance = parentCanvasInstance;
    var _innerElements = {
        raphaelElem: null
    };
    var _connectionElement = parentConnection;
    var _this = this;

    // Properties
    this.InnerElements = _innerElements;

    // Private methods
    function refresh() {

        //
        var xPos = _connectionElement.GetCurrentPath()[positionType].x - raphaelConnectorType.DimensionModifier * Settings.ScaleModifier;
        var yPos = _connectionElement.GetCurrentPath()[positionType].y - raphaelConnectorType.DimensionModifier * Settings.ScaleModifier;
        _innerElements.raphaelElem.attr({ cx: xPos, cy: yPos, x: xPos, y: yPos });

        //
        var scaledDimensions = $.extend(true, {}, raphaelConnectorType.Dimensions);
        for (var dimensionKey in scaledDimensions) {
            var originalValue = scaledDimensions[dimensionKey];
            scaledDimensions[dimensionKey] = originalValue * Settings.ScaleModifier;
        }
        _innerElements.raphaelElem.attr(scaledDimensions);
    }

    // Initialize
    this.Initialize = function () {

        //Create raphaelElem
        var scaledDimensions = $.extend(true, {}, raphaelConnectorType.Dimensions);
        for (var dimensionKey in scaledDimensions) {
            var originalValue = scaledDimensions[dimensionKey];
            scaledDimensions[dimensionKey] = originalValue * Settings.ScaleModifier;
        }

        var xPos = _connectionElement.GetCurrentPath()[positionType].x - raphaelConnectorType.DimensionModifier * Settings.ScaleModifier;
        var yPos = _connectionElement.GetCurrentPath()[positionType].y - raphaelConnectorType.DimensionModifier * Settings.ScaleModifier; //position for endConnector
        _innerElements.raphaelElem = eval("_canvasInstance." + raphaelConnectorType.RaphaelType + "(xPos, yPos" + paramsToString(scaledDimensions) + ")");
        _innerElements.raphaelElem.attr(connectorStyle);
    }

    // Public methods
    this.RefreshGraphicalRepresentation = function () {
        refresh();
    }
    this.Delete = function () {
        _innerElements.raphaelElem.remove();
        _innerElements.raphaelElem = null;
    }
    this.Update = function (newConnectorStyle) {
        _innerElements.raphaelElem.attr(newConnectorStyle);
    }
    this.RemoveSelf = function () {
        _innerElements.raphaelElem.remove();
        _innerElements.raphaelElem = null;
    }
}
UIControls.VisualView.CardinalityLabel = function (firstNumber, secondNumber, calculatePositionFunction, parentCanvasInstance) {

    // Fields
    var _canvasInstance = parentCanvasInstance;
    var _innerElements = {
        box: null,
        text: null
    };
    var _outerElement = null;
    var _firstNumber = firstNumber, _secondNumber = secondNumber;
    var _boxWidth = UIStyles.Common.CardinalityLabel.Box.Dimensions.width * Settings.ScaleModifier, _boxHeight = UIStyles.Common.CardinalityLabel.Box.Dimensions.height * Settings.ScaleModifier;
    var _thisUICardinalityLabel = this;

    // Properties
    this.InnerElements = _innerElements;

    // Private methods
    function refresh() {

        //Scale
        _boxWidth = UIStyles.Common.CardinalityLabel.Box.Dimensions.width * Settings.ScaleModifier;
        _boxHeight = UIStyles.Common.CardinalityLabel.Box.Dimensions.height * Settings.ScaleModifier
        _innerElements.box.attr({ width: _boxWidth, height: _boxHeight });
        _innerElements.text.attr({ "font-size": parseFloat(UIStyles.Common.CardinalityLabel.Text.attr["font-size"]) * Settings.ScaleModifier });

        //
        var labelPoint = calculatePositionFunction();
        _innerElements.box.attr({ x: labelPoint.x - _boxWidth / 2, y: labelPoint.y - _boxHeight / 2 });
        _innerElements.text.attr({ x: labelPoint.x, y: labelPoint.y });

    }

    // Public methods
    this.Initialize = function () {

        // Create box and text
        var labelPoint = calculatePositionFunction();
        _innerElements.box = _canvasInstance.rect(labelPoint.x - _boxWidth / 2, labelPoint.y - _boxHeight / 2, _boxWidth, _boxHeight, 0);
        _innerElements.box.attr(UIStyles.Common.CardinalityLabel.Box.attr);
        _innerElements.text = _canvasInstance.text(labelPoint.x, labelPoint.y, "[" + _firstNumber + ".." + _secondNumber + "]");
        _innerElements.text.attr({ "font-size": parseFloat(UIStyles.Common.CardinalityLabel.Text.attr["font-size"]) * Settings.ScaleModifier });
    }
    this.RefreshGraphicalRepresentation = function () {
        refresh();
    }
    this.RemoveSelf = function () {
        _innerElements.text.remove();
        _innerElements.text = null;
        _innerElements.box.remove();
        _innerElements.box = null;
    }
    this.Update = function (newFirstNumber, newSecondNumber) {
        //
        _firstNumber = newFirstNumber;
        _secondNumber = newSecondNumber

        //Update visuals
        _innerElements.text.attr({ text: "[" + _firstNumber + ".." + _secondNumber + "]" });
    }
}