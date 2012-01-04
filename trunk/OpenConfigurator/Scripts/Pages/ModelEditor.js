//Settings and defaults
var settings = {
    diagramContext: {
        fixedOrientation: "vertical", //determines orientation of diagram - options: horizontal / vertical / false (automatic - needs bug fixing to work properly)
        drawCurves: true, //determines whether curves should be used for drawing relations - options: true / false
        dynamicRefresh: false, //determines whether refresh (redraw) operations are executed real-time or after a move event is completed
        displayCardinalities: "full" //determines how many cardinalities to display - options : none / partial(only cloneable and cardinal groups) / all (all relations and groupRelations)
    }
};
var commonStyles = {
    glow: {
        attr: {
            width: 10,
            opacity: 0.5,
            color: "blue"
        }
    },
    connection: {
        states: {
            unselected: {
                line: {
                    attr: {
                        fill: "none",
                        stroke: "#999999",
                        "stroke-width": 1,
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
                "font-size": 9
            }
        },
        box: {
            dimensions: {
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
}
var UIObjectStyles = {
    feature: {
        general: {
            box: {
                dimensions: {
                    width: 100,
                    height: 30
                }
            }
        },
        states: {
            unselected: {
                box: {
                    attr: {
                        fill: "#E1E9FF",
                        stroke: "#CECECE",
                        "stroke-width": 1,
                        opacity: 1
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
                        fill: "#E1E9FF",
                        stroke: "black",
                        "stroke-width": 1.2,
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
                            radius: 6
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
                    length: 30
                }
            },
            connection: {
                connectors: {
                    endConnector: {
                        raphaelType: "rect",
                        dimensionModifier: 5, //used to center rect
                        dimensions: {
                            width: 10,
                            height: 10
                        }
                    }
                }
            }
        },
        subTypes: {
            or: {
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
            xor: {
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
                            radius: 3
                        }
                    },
                    startConnector: {
                        raphaelType: "circle",
                        dimensionModifier: 0,
                        dimensions: {
                            radius: 3
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
                    lowerBound: 1,
                    upperBound: 1
                }
            },
            optional: {
                name: "optional",
                label: "Optional",
                id: 2,
                bounds: {
                    lowerBound: 0,
                    upperBound: 1

                }
            },
            cloneable: {
                name: "cloneable",
                label: "Cloneable",
                id: 3,
                bounds: {
                    editable: true,
                    lowerBound: 0,
                    upperBound: 0
                }
            }
        },
        groupRelationTypes: {
            or: {
                name: "or",
                label: "OR",
                id: 1,
                bounds: {
                    lowerBound: 0,
                    upperBound: 1
                }
            },
            xor: {
                name: "xor",
                label: "XOR",
                id: 2,
                bounds: {
                    lowerBound: 1,
                    upperBound: 1
                }
            },
            cardinal: {
                name: "cardinal",
                label: "Cardinal",
                id: 3,
                bounds: {
                    editable: true,
                    lowerBound: 0,
                    upperBound: 0
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
            curveModifiers: [{ x: -30, y: 0 }, { x: +30, y: 0}],
            angleIntervals: [{ min: 0, max: 45 }, { min: 136, max: 224 }, { min: 316, max: 359}]
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
            curveModifiers: [{ x: 0, y: -30 }, { x: 0, y: +30}],
            angleIntervals: [{ min: 46, max: 135 }, { min: 225, max: 315}]
        }
    }
}

//Global helper methods and variables
function getEnumEntryByID(collection, id) {
    for (var key in collection) {
        var enumEntry = collection[key];
        if (enumEntry.id == id) {
            return enumEntry;
        }
    }
}
function paramsToString(collection) {
    var returnString = "";
    for (var key in collection) {
        var collectionEntry = collection[key];
        returnString += "," + collectionEntry;
    }
    return returnString;
}

var DiagramDataModel = function (modelID, modelName) {

    //Client data object
    var ClientDataObject = function (businessDataObject, guid, type, extraClientData) {

        //Variables
        var _guid = guid;
        var _businessDataObject = businessDataObject;
        var _uiType = type;

        //Properties
        this.GUID = _guid;
        this.GetTypeName = function () {
            return _uiType;
        }
        this.GetBusinessDataObject = function () {
            var copy = jQuery.extend(true, {}, _businessDataObject);
            return copy;
        }
        this.UpdateBusinessDataObject = function (modifiedBusinessDataObject) {
            _businessDataObject = modifiedBusinessDataObject;
        }
        this.GetPropertyValue = function (propertyName) {
            return _businessDataObject[propertyName];
        }
        this.SetPropertyValue = function (propertyName, value) {
            _businessDataObject[propertyName] = value;
        }
        this.SetDeleted = function () {
            _businessDataObject["ToBeDeleted"] = true;
        }
        this.IsDeleted = function () {
            return _businessDataObject["ToBeDeleted"] == true;
        }

        //ExtraClientData
        this.ExtraClientData = (extraClientData != undefined ? extraClientData : null);
    }

    //Variables
    var _dataClientObjectGUIDCounter = 0;
    var _dataClientObjects = {
        all: {},
        features: {},
        relations: {},
        groupRelations: {},
        compositionRules: {},
        customRules: {}
    }
    var _modelID = modelID;
    var _model = null;
    var _thisDiagramDataModel = this;

    //Private methods
    var getDefaultDataObj = function (type) {
        var returnObj;
        $.ajax({
            url: "/ModelEditor/NewDefault" + type,
            data: {},
            async: false,
            success: function (dataObj) {
                returnObj = dataObj;
            }
        });
        return returnObj;
    }

    //Constructor/Initalizers
    this.Initialize = function () {

    }

    //Public methods
    this.SaveModel = function (newName, beforeSend, onSuccess, onError) {
        _modelName = newName;

        //Stringify collection of Features
        var featuresDataObjectCollection = {};
        for (var guidKey in _dataClientObjects.features) {
            var clientDataObject = _dataClientObjects.features[guidKey];

            featuresDataObjectCollection[guidKey] = clientDataObject.GetBusinessDataObject();
        }

        //Stringify collection of Relations
        var relationsDataObjectCollection = {};
        var relationsAdjFeatures = {};
        for (var guidKey in _dataClientObjects.relations) {
            var clientDataObject = _dataClientObjects.relations[guidKey];

            relationsDataObjectCollection[guidKey] = clientDataObject.GetBusinessDataObject();
            relationsAdjFeatures[guidKey] = clientDataObject.ExtraClientData;
        }

        //Stringify collection of GroupRelations
        var groupRelationsDataObjectCollection = {};
        var groupRelationsAdjFeatures = {};
        for (var guidKey in _dataClientObjects.groupRelations) {
            var clientDataObject = _dataClientObjects.groupRelations[guidKey];

            groupRelationsDataObjectCollection[guidKey] = clientDataObject.GetBusinessDataObject();
            groupRelationsAdjFeatures[guidKey] = clientDataObject.ExtraClientData;
        }

        //Stringify collection of CompositionRules
        var compositionRulesDataObjectCollection = {};
        var compositionRulesAdjFeatures = {};
        for (var guidKey in _dataClientObjects.compositionRules) {
            var clientDataObject = _dataClientObjects.compositionRules[guidKey];

            compositionRulesDataObjectCollection[guidKey] = clientDataObject.GetBusinessDataObject();
            compositionRulesAdjFeatures[guidKey] = clientDataObject.ExtraClientData;
        }

        //Stringify collection of CustomRules
        var customRulesDataObjectCollection = {};
        for (var guidKey in _dataClientObjects.customRules) {
            var clientDataObject = _dataClientObjects.customRules[guidKey];

            customRulesDataObjectCollection[guidKey] = clientDataObject.GetBusinessDataObject();
        }

        //Setup data parameters
        var dataParameters = {
            modelID: _modelID,
            modelName: _modelName,
            featuresString: JSON.stringify(featuresDataObjectCollection),
            relationsString: JSON.stringify(relationsDataObjectCollection),
            relationsAdjFeaturesString: JSON.stringify(relationsAdjFeatures),
            groupRelationsString: JSON.stringify(groupRelationsDataObjectCollection),
            groupRelationsAdjFeaturesString: JSON.stringify(groupRelationsAdjFeatures),
            compositionRulesString: JSON.stringify(compositionRulesDataObjectCollection),
            compositionRulesAdjFeaturesString: JSON.stringify(compositionRulesAdjFeatures),
            customRulesString: JSON.stringify(customRulesDataObjectCollection)
        }

        //Send data to WebService method
        $.ajax({
            type: "POST",
            url: "/ModelEditor/SaveModel",
            data: JSON.stringify(dataParameters),
            beforeSend: function () {
                beforeSend();
            },
            success: function (response) {

                //Update ID's for Features
                var updatedFeatureBusinessDataObjects = response[0];
                for (var guidKey in _dataClientObjects.features) {
                    var clientDataObject = _dataClientObjects.features[guidKey];

                    //Remove deleted items
                    if (clientDataObject.IsDeleted()) {
                        delete _dataClientObjects.all[guidKey];
                        delete _dataClientObjects.features[guidKey];
                    }
                    //Update others
                    else {
                        clientDataObject.UpdateBusinessDataObject(updatedFeatureBusinessDataObjects[guidKey]);
                    }
                }

                //Update ID's for Relations
                var updatedRelationBusinessDataObjects = response[1];
                for (var guidKey in _dataClientObjects.relations) {
                    var clientDataObject = _dataClientObjects.relations[guidKey];

                    //Remove deleted items
                    if (clientDataObject.IsDeleted()) {
                        delete _dataClientObjects.all[guidKey];
                        delete _dataClientObjects.relations[guidKey];
                    }
                    //Update others
                    else {
                        clientDataObject.UpdateBusinessDataObject(updatedRelationBusinessDataObjects[guidKey]);
                    }
                }

                //Update ID's for GroupRelations
                var updatedGroupRelationBusinessDataObjects = response[2];
                for (var guidKey in _dataClientObjects.groupRelations) {
                    var clientDataObject = _dataClientObjects.groupRelations[guidKey];

                    //Remove deleted items
                    if (clientDataObject.IsDeleted()) {
                        delete _dataClientObjects.all[guidKey];
                        delete _dataClientObjects.groupRelations[guidKey];
                    }
                    //Update others
                    else {
                        clientDataObject.UpdateBusinessDataObject(updatedGroupRelationBusinessDataObjects[guidKey]);
                    }
                }

                //Callback
                onSuccess();
            },
            error: function (req, status, error) {
                onError();
            }
        });
    }
    this.LoadModel = function (onFinished) {
        $.ajax({
            type: "POST",
            url: "/ModelEditor/LoadModel",
            data: JSON.stringify({ modelID: _modelID }),
            success: function (response) {
                var model = response;

                //Load Features
                for (var i = 0; i < model.Features.length; i++) {
                    _thisDiagramDataModel.AddClientDataObject("feature", model.Features[i]);
                }

                //Load Relations
                for (var i = 0; i < model.Relations.length; i++) {
                    var extraClientData = {
                        parentFeatureGUID: _thisDiagramDataModel.GetGUIDByID(model.Relations[i].ParentFeatureID),
                        childFeatureGUID: _thisDiagramDataModel.GetGUIDByID(model.Relations[i].ChildFeatureID)
                    }
                    _thisDiagramDataModel.AddClientDataObject("relation", model.Relations[i], extraClientData);
                }

                //Load GroupRelations
                for (var i = 0; i < model.GroupRelations.length; i++) {
                    var childFeatureGUIDs = [];
                    var parentFeatureGUID = _thisDiagramDataModel.GetGUIDByID(model.GroupRelations[i].ParentFeatureID);
                    for (var j = 0; j < model.GroupRelations[i].ChildFeatureIDs.length; j++) {
                        childFeatureGUIDs.push(_thisDiagramDataModel.GetGUIDByID(model.GroupRelations[i].ChildFeatureIDs[j]));
                    }
                    var extraClientData = {
                        parentFeatureGUID: parentFeatureGUID,
                        childFeatureGUIDs: childFeatureGUIDs
                    }

                    _thisDiagramDataModel.AddClientDataObject("groupRelation", model.GroupRelations[i], extraClientData);
                }

                //Load CompositionRules
                for (var i = 0; i < model.CompositionRules.length; i++) {
                    var extraClientData = {
                        firstFeatureGUID: _thisDiagramDataModel.GetGUIDByID(model.CompositionRules[i].FirstFeatureID),
                        secondFeatureGUID: _thisDiagramDataModel.GetGUIDByID(model.CompositionRules[i].SecondFeatureID)
                    }
                    _thisDiagramDataModel.AddClientDataObject("compositionRule", model.CompositionRules[i], extraClientData);
                }

                //Load CustomRules
                for (var i = 0; i < model.CustomRules.length; i++) {
                    _thisDiagramDataModel.AddClientDataObject("customRule", model.CustomRules[i]);
                }

                //
                onFinished(model);
            },
            error: function (req, status, error) {
                alert("error");
            }
        });
    }
    this.CreateNewClientDataObject = function (type, initialFieldValues, extraClientData) {

        //Variables
        var newBusinessDataObject = getDefaultDataObj(type);
        var guid = _dataClientObjectGUIDCounter++;

        //Initial values
        if (initialFieldValues != undefined && initialFieldValues != null) {
            for (var fieldName in initialFieldValues) {
                var fieldValue = initialFieldValues[fieldName];
                newBusinessDataObject[fieldName] = fieldValue;
            }
        }

        //Wrap a new default BusinessDataObject into a ClientDataObject
        var newClientDataObject = new ClientDataObject(newBusinessDataObject, guid, type, extraClientData);

        //Save references to it
        _dataClientObjects.all[newClientDataObject.GUID] = newClientDataObject;
        _dataClientObjects[type + "s"][newClientDataObject.GUID] = newClientDataObject;

        //Raise events
        _thisDiagramDataModel.ClientDataObjectCreated.RaiseEvent(guid);

        return newClientDataObject;
    }
    this.AddClientDataObject = function (type, businessDataObject, extraClientData) {

        //Variables
        var guid = _dataClientObjectGUIDCounter++;

        //Wrap the BusinessDataObject into a ClientDataObject
        var newClientDataObject = new ClientDataObject(businessDataObject, guid, type, extraClientData);

        //Save references to it
        _dataClientObjects.all[newClientDataObject.GUID] = newClientDataObject;
        _dataClientObjects[type + "s"][newClientDataObject.GUID] = newClientDataObject;



        //Raise events
        _thisDiagramDataModel.ClientDataObjectCreated.RaiseEvent(guid);
    }
    this.DeleteClientDataObject = function (guid) {

        //Set delete flag
        _dataClientObjects.all[guid].SetDeleted();

        //Raise events
        _thisDiagramDataModel.ClientDataObjectDeleted.RaiseEvent(guid);
    }
    this.GetClientDataObject = function (guid) {
        return _dataClientObjects.all[guid];
    }
    this.GetGUIDByID = function (ID) {
        for (var guidKey in _dataClientObjects.all) {
            var clientDataObject = _dataClientObjects.all[guidKey];
            if (ID == clientDataObject.GetPropertyValue("ID")) {
                return clientDataObject.GUID;
            }
        }
    }
    this.UpdateClientDataObject = function (guid, modifiedBusinessDataObject) {

        //Update the whole businessDataObject
        _dataClientObjects.all[guid].UpdateBusinessDataObject(modifiedBusinessDataObject);

        //Raise events
        _thisDiagramDataModel.ClientDataObjectUpdated.RaiseEvent(guid);
    }
    this.UpdateClientDataObjectField = function (guid, fieldName, value) {
        _dataClientObjects.all[guid].SetPropertyValue(fieldName, value);

        //Raise events
        _thisDiagramDataModel.ClientDataObjectUpdated.RaiseEvent(guid);
    }
    this.GetClientDataObjectField = function (guid, fieldName) {
        return _dataClientObjects.all[guid].GetPropertyValue(fieldName);
    }
    this.GetDefaultDataObject = function (type) {
        return getDefaultDataObj(type);
    }

    //Events
    this.ClientDataObjectCreated = new Event();
    this.ClientDataObjectUpdated = new Event();
    this.ClientDataObjectDeleted = new Event();
}
var ClientController = function (diagramContainer, propertiesContainer, explorerContainer, modelNameTextbox, diagramDataModelInstance) {

    //Fields and variables
    var _diagramDataModel = diagramDataModelInstance;
    var _diagramContext, _propertiesComponent, _modelExplorer;
    var _modelNameTextbox = modelNameTextbox;
    var _thisClientController = this;
    var _currentControlFocus = null; //variable to keep track of where the user executed the last action (clicking)

    //Constructor/Initalizers
    this.Initialize = function () {

        $("#ModelDiagramBox").block({ message: "Loading diagram...", fadeIn: 300 });
        $.timer(300, function () {
            //Instantiate/Initialize controls
            _diagramContext = new DiagramContext($("#SVGCanvas")[0], _diagramDataModel);
            _diagramContext.Initialize();
            _propertiesComponent = new PropertiesComponent($("#PropertiesBox"), _diagramDataModel);
            _propertiesComponent.Initialize();
            _modelExplorer = new ModelExplorer($("#ModelExplorerTree"), _diagramDataModel);
            _modelExplorer.Initialize();

            //Modelexplorer eventhandlers
            _diagramContext.ElementSelectToggled.Add(new EventHandler(_modelExplorer.OnRelatedViewElementSelectToggled));
            _diagramContext.SelectionCleared.Add(new EventHandler(_modelExplorer.OnRelatedViewSelectionCleared));
            _diagramDataModel.ClientDataObjectCreated.Add(new EventHandler(_modelExplorer.OnClientDataObjectCreated));
            _diagramDataModel.ClientDataObjectUpdated.Add(new EventHandler(_modelExplorer.OnClientDataObjectUpdated));
            _diagramDataModel.ClientDataObjectDeleted.Add(new EventHandler(_modelExplorer.OnClientDataObjectDeleted));

            //DiagramContext eventhandlers
            _modelExplorer.ElementSelectToggled.Add(new EventHandler(_diagramContext.OnRelatedViewElementSelectToggled));
            _modelExplorer.SelectionCleared.Add(new EventHandler(_diagramContext.OnRelatedViewSelectionCleared));
            _diagramDataModel.ClientDataObjectCreated.Add(new EventHandler(_diagramContext.OnClientDataObjectCreated));
            _diagramDataModel.ClientDataObjectUpdated.Add(new EventHandler(_diagramContext.OnClientDataObjectUpdated));
            _diagramDataModel.ClientDataObjectDeleted.Add(new EventHandler(_diagramContext.OnClientDataObjectDeleted));

            //PropertiesComponent eventhandlers
            _diagramContext.ElementSelectToggled.Add(new EventHandler(_propertiesComponent.OnRelatedViewElementSelectToggled));
            _modelExplorer.ElementSelectToggled.Add(new EventHandler(_propertiesComponent.OnRelatedViewElementSelectToggled));
            _modelExplorer.SelectionCleared.Add(new EventHandler(_propertiesComponent.OnRelatedViewSelectionCleared));
            _diagramContext.SelectionCleared.Add(new EventHandler(_propertiesComponent.OnRelatedViewSelectionCleared));
            _diagramDataModel.ClientDataObjectUpdated.Add(new EventHandler(_propertiesComponent.OnClientDataObjectUpdated));
            _diagramDataModel.ClientDataObjectDeleted.Add(new EventHandler(_propertiesComponent.OnClientDataObjectDeleted));

            //Focus handlers
            _diagramContext.Focus.Add(new EventHandler(function () {
                if (_currentControlFocus != _diagramContext) {
                    _currentControlFocus = _diagramContext;
                }
            }));
            _modelExplorer.Focus.Add(new EventHandler(function () {
                if (_currentControlFocus != _modelExplorer) {
                    _currentControlFocus = _modelExplorer;
                }
            }));

            //Load the model
            _diagramDataModel.LoadModel(function (model) {
                $(_modelNameTextbox).val(model.Name);
                $("#ModelDiagramBox").unblock();
            });
        });
    }

    //Public methods
    this.SaveData = function () {
        var newName = $(_modelNameTextbox).val();
        _diagramDataModel.SaveModel(newName, function () {
            $("#ModelDiagramBox").block({ message: "Saving diagram...", fadeIn: 300 });
        }, function () {
            $.pnotify({
                pnotify_title: "Data saved",
                pnotify_text: "Model '" + newName + "' saved successfully !",
                pnotify_type: "notice"
            });
            $("#ModelDiagramBox").unblock();

        }, function () {
            $.pnotify({
                pnotify_title: "Error!",
                pnotify_text: "Data could not be saved",
                pnotify_type: "error"
            });
            $("#ModelDiagramBox").unblock();
        });
    }
    this.CreateNewFeature = function () {
        _diagramContext.CreateNewElement("feature");
    }
    this.CreateNewRelation = function () {
        _diagramContext.CreateNewElement("relation");
    }
    this.CreateNewGroupRelation = function () {
        _diagramContext.CreateNewElement("groupRelation");
    }
    this.CreateNewCompositionRule = function () {
        _diagramContext.CreateNewElement("compositionRule");
    }
    this.CreateNewCustomRule = function () {
        var clientCustomRuleDataObject = _diagramDataModel.CreateNewClientDataObject("customRule");
    }
    this.Delete = function () {
        switch (_currentControlFocus) {
            case _diagramContext:
                _diagramContext.DeleteSelectedElements();
                break;
            case _modelExplorer:
                _modelExplorer.DeleteSelectedElements();
                break;
        }
    }
}
var PropertiesComponent = function (container, diagramDataModelInstance) {

    //Defaults and settings
    var controlTypes = {
        textbox: {
            name: "textbox",
            createControlHTML: function (dataObjParent, dataObjFieldName, objectTypeField, onChangedCallBack) {

                //Create control
                var control = $("<input class='Textbox' type='text' />");

                //Event handlers
                var _this = this;
                control.bind("change", function () {
                    var newVal = control.val();
                    dataObjParent[dataObjFieldName] = newVal;

                    //Call handlers
                    if (onChangedCallBack != undefined) onChangedCallBack(newVal, control);
                    onDataChanged();
                }).bind("keypress", function (e) {
                    if (e.which == 13) {
                        var newVal = control.val();
                        dataObjParent[dataObjFieldName] = newVal;

                        //Call handlers
                        if (onChangedCallBack != undefined) onChangedCallBack(newVal, control);
                        onDataChanged();

                    }
                });

                //
                return control;
            },
            loadData: function (control, dataObjParent, dataObjFieldName, objectTypeField, onChangedCallBack) {
                var value = dataObjParent[dataObjFieldName];
                control.val(value);
            }
        },
        textarea: {
            name: "textarea",
            createControlHTML: function (dataObjParent, dataObjFieldName, objectTypeField, onChangedCallBack) {

                //Create control
                var control = $("<textarea class='Textarea'></textarea>");


                //Event handlers
                var _this = this;
                control.bind("change", function () {
                    var newVal = control.val();
                    dataObjParent[dataObjFieldName] = newVal;

                    //Call handlers
                    if (onChangedCallBack != undefined) onChangedCallBack(newVal, control);
                    onDataChanged();

                })

                //
                return control;
            },
            loadData: function (control, dataObjParent, dataObjFieldName, objectTypeField, onChangedCallBack) {
                var value = dataObjParent[dataObjFieldName];
                control.val(value);

                $(control).autoGrow();
            }
        },
        checkbox: {
            name: "checkbox",
            createControlHTML: function (dataObjParent, dataObjFieldName, objectTypeField, onChangedCallBack) {

                //Create control
                var control = $("<input class='Checkbox' type='checkbox' />");

                //Event handlers
                var _this = this;
                control.bind("change", function () {
                    var newVal = control.attr("checked");
                    dataObjParent[dataObjFieldName] = newVal;

                    //Call handlers
                    if (onChangedCallBack != undefined) onChangedCallBack(newVal, control);
                    onDataChanged();

                })

                //
                return control;
            },
            loadData: function (control, dataObjParent, dataObjFieldName, objectTypeField, onChangedCallBack) {
                var value = dataObjParent[dataObjFieldName];
                control.attr("checked", value);
            }
        },
        dropdown: {
            name: "dropdown",
            createControlHTML: function (dataObjParent, dataObjFieldName, objectTypeField, onChangedCallBack) {

                //Create control
                var control = $("<select class='Dropdown' />");

                //Create default options
                if (objectTypeField.defaultOptions != undefined) {
                    for (var key in objectTypeField.defaultOptions) {
                        var enumEntry = objectTypeField.defaultOptions[key];
                        var option = $("<option value='" + enumEntry.id + "'>" + enumEntry.label + "</option>").appendTo(control);
                    }
                }

                //Event handlers
                var _this = this;
                control.bind("change", function () {
                    var newVal = $(control).find("option:selected").attr("value");
                    dataObjParent[dataObjFieldName] = newVal;

                    //Call handlers
                    if (onChangedCallBack != undefined) onChangedCallBack(newVal, control);
                    onDataChanged();

                });

                return control;
            },
            loadData: function (control, dataObjParent, dataObjFieldName, objectTypeField, onChangedCallBack) {
                var value = dataObjParent[dataObjFieldName];
                control.val(value);
            }
        },
        composite: {
            name: "composite",
            createControlHTML: function (dataObjParent, dataObjFieldName, objectTypeField, onChangedCallBack) {

                //Outer control
                var _this = this;
                var control = $("<div class='Composite''></div>");

                //List
                var listContainer = $("<div class='ListDiv'></div>").appendTo(control);
                var listActionsDiv = $("<div class='ListActionsDiv'></div>").appendTo(listContainer);
                var listInnerContainer = $("<div class='ListInnerContainer'></div>").appendTo(listContainer);
                var addButton = $("<div class='Button-Thin'></div>").append("<img src='../../Content/themes/base/images/Icons/Add.png' />").append("<span>Add new</span>").appendTo(listActionsDiv);
                addButton.bind("click", function () {
                    var newDefaultDataObj = diagramDataModelInstance.GetDefaultDataObject(objectTypeField.defaultDataObjectName); 
                    var newIndex = dataObjParent[dataObjFieldName].length;
                    dataObjParent[dataObjFieldName][newIndex] = newDefaultDataObj;

                    //Create a new NestedObjectControl
                    var label = dataObjParent[dataObjFieldName][newIndex].Name;
                    var nestedObjectControl = _this.privateMethods.createNestedObject(label, dataObjParent, dataObjFieldName, newIndex, objectTypeField, listContainer, detailsContainer);
                    nestedObjectControl.appendTo(listInnerContainer);

                    //Call handler
                    onDataChanged();
                });

                //Details
                var detailsContainer = $("<div class='DetailsDiv'></div>").css("display", "none").appendTo(control);
                var detailsInnerTableTbody = $("<table><tbody></tbody></table>").appendTo(detailsContainer).find("tbody");

                //
                return control;
            },
            loadData: function (control, dataObjParent, dataObjFieldName, objectTypeField, onChangedCallBack) {
                //
                var listContainer = $(control).find(".ListDiv");
                var listInnerContainer = $(listContainer).find(".ListInnerContainer");
                var detailsContainer = $(control).find(".DetailsDiv");
                var _this = this;

                //Create nestedControls for nested Objects
                for (var i = 0; i < dataObjParent[dataObjFieldName].length; i++) {
                    if (dataObjParent[dataObjFieldName][i].ToBeDeleted != true) {
                        var label = dataObjParent[dataObjFieldName][i].Name;
                        var nestedObjectControl = this.privateMethods.createNestedObject(label, dataObjParent, dataObjFieldName, i, objectTypeField, listContainer, detailsContainer);
                        nestedObjectControl.appendTo(listInnerContainer);
                    }
                }
            },
            privateMethods: {
                createNestedObject: function (label, dataObjParent, dataObjFieldName, index, objectTypeField, listContainer, detailsContainer) {
                    //Inner methods
                    function deSelectAll() {
                        var selectedNestedObjects = $(listContainer).find(".ListInnerContainer").children(".Selected");
                        $(selectedNestedObjects).removeClass("Selected");
                        $(detailsContainer).find("tbody").html("");
                        $(detailsContainer).css("display", "none")
                    }
                    function toggleSelected(nestedObjectControl) {
                        var selectedNestedObjects = $(listContainer).find(".ListInnerContainer").children(".Selected");

                        //Deselect if already selected
                        if ($(nestedObjectControl).hasClass("Selected")) {
                            deSelectAll();
                        }
                        //Select if not selected
                        else {
                            $(selectedNestedObjects).removeClass("Selected");
                            $(nestedObjectControl).addClass("Selected");
                            $(detailsContainer).css("display", "block")
                            $(detailsContainer).find("tbody").html("");

                            //
                            loadNestedObjectData(nestedObjectControl);
                        }
                    }
                    function loadNestedObjectData(nestedObjectControl) {
                        var nestedObjectIndex = $(listContainer).find(".NestedControl").index(nestedObjectControl);
                        var detailsInnerTableTbody = $(detailsContainer).find("tbody");

                        //Create controls for SubFields in Details area
                        for (var subFieldKey in objectTypeField.subFields) {
                            var subField = objectTypeField.subFields[subFieldKey];

                            var subFieldControl = null;
                            if (subField.dataName == "Name") { //special handler for Name
                                subFieldControl = controlTypes[subField.controlType].createControlHTML(dataObjParent[dataObjFieldName][index], subField.dataName, subField, function (newVal, control) {
                                    nestedObjectControl.find(".Label-Small").text(newVal);
                                });

                            } else {
                                subFieldControl = controlTypes[subField.controlType].createControlHTML(dataObjParent[dataObjFieldName][index], subField.dataName, subField);
                            }
                            subFieldControl.attr("subField", subField.dataName);
                            var row = createControlTableRow(subField.label, subFieldControl);
                            row.appendTo(detailsInnerTableTbody);
                        }

                        //Load data into SubFieldControls
                        var defaultFieldName = null;
                        for (var subFieldKey in objectTypeField.subFields) {
                            var subField = objectTypeField.subFields[subFieldKey];
                            var subFieldControl = $(detailsContainer).find("[subField='" + subField.dataName + "']");
                            controlTypes[subField.controlType].loadData(subFieldControl, dataObjParent[dataObjFieldName][index], subField.dataName, subField);

                            //Default select
                            if (subField.defaultSelect == true)
                                $(subFieldControl).select();
                        }
                    }
                    function deleteNestedObject(nestedObjectControl) {
                        var nestedObjectIndex = $(nestedObjectControl).attr("nestedObjectIndex");
                        dataObjParent[dataObjFieldName][index].ToBeDeleted = true;
                        $(nestedObjectControl).remove();
                        $(detailsContainer).find("tbody").html("");
                        $(detailsContainer).css("display", "none")

                        //
                        onDataChanged();
                    }

                    //Create nestedObject control
                    var nestedObjectControl = $("<div class='NestedControl'></div>").attr("nestedObjectIndex", index);
                    var controlLabel = $("<span class='Label-Small'>" + label + "</span>").appendTo(nestedObjectControl);
                    var deleteButton = $("<div id='DeleteButton' class='IconButton-Simple'></div>").append("<img src='../../Content/themes/base/images/Icons/Delete.png' />").appendTo(nestedObjectControl);
                    deleteButton.bind("click", function () {
                        deleteNestedObject($(this).parents(".NestedControl"));
                        deSelectAll();
                    });

                    //Click handler
                    nestedObjectControl.bind("click", function () {
                        toggleSelected($(this));
                    });

                    return nestedObjectControl;
                }
            }
        }
    };
    var objectTypes = {
        feature: {
            areas: {
                basicArea: {
                    displayTitle: false,
                    tableLayout: true,
                    fields: {
                        rootFeature: {
                            label: "Root Feature",
                            dataName: "IsRoot",
                            controlType: controlTypes.checkbox.name,
                            disabled: true
                        },
                        name: {
                            label: "Name",
                            dataName: "Name",
                            controlType: controlTypes.textbox.name
                        },
                        description: {
                            label: "Description",
                            dataName: "Description",
                            controlType: controlTypes.textarea.name
                        }
                    }
                },
                attributesArea: {
                    displayTitle: "Attributes",
                    tableLayout: false,
                    fields: {
                        attributes: {
                            label: "Attributes",
                            dataName: "Attributes",
                            defaultDataObjectName: "Attribute",
                            controlType: controlTypes.composite.name,
                            subFields: {
                                name: {
                                    label: "Name",
                                    dataName: "Name",
                                    controlType: controlTypes.textbox.name,
                                    defaultSelect: true
                                },
                                description: {
                                    label: "Description",
                                    dataName: "Description",
                                    controlType: controlTypes.textarea.name
                                },
                                type: {
                                    label: "Attribute Type",
                                    dataName: "AttributeType",
                                    controlType: controlTypes.dropdown.name,
                                    defaultOptions: systemDefaults.enums.attributeTypes
                                },
                                datatype: {
                                    label: "Data Type",
                                    dataName: "AttributeDataType",
                                    controlType: controlTypes.dropdown.name,
                                    defaultOptions: systemDefaults.enums.attributeDataTypes
                                }
                            }
                        }
                    }
                }
            }
        },
        relation: {
            areas: {
                basicArea: {
                    displayTitle: false,
                    tableLayout: true,
                    fields: {
                        relationType: {
                            label: "Relation type",
                            dataName: "RelationType",
                            controlType: controlTypes.dropdown.name,
                            defaultOptions: systemDefaults.enums.relationTypes,
                            onFieldDataChanged: function (newVal, control) {
                                var lowerBoundControl = $(control).parents(".AreaDiv").find("[fieldName='LowerBound']");
                                var upperBoundControl = $(control).parents(".AreaDiv").find("[fieldName='UpperBound']");
                                var relationType = getEnumEntryByID(systemDefaults.enums.relationTypes, parseFloat(newVal));

                                //
                                lowerBoundControl.val(relationType.bounds.lowerBound).trigger("change");
                                upperBoundControl.val(relationType.bounds.upperBound).trigger("change");

                                if (relationType.bounds.editable == true) {
                                    lowerBoundControl.removeAttr("disabled");
                                    upperBoundControl.removeAttr("disabled");
                                }
                                else {
                                    lowerBoundControl.attr("disabled", "disabled");
                                    upperBoundControl.attr("disabled", "disabled");
                                }

                            },
                            onFieldDataLoaded: function (val, control) {
                                var lowerBoundControl = $(control).parents(".AreaDiv").find("[fieldName='LowerBound']");
                                var upperBoundControl = $(control).parents(".AreaDiv").find("[fieldName='UpperBound']");
                                var relationType = getEnumEntryByID(systemDefaults.enums.relationTypes, parseFloat(val));

                                if (relationType.bounds.editable == true) {
                                    lowerBoundControl.removeAttr("disabled");
                                    upperBoundControl.removeAttr("disabled");
                                }
                            }
                        },
                        lowerBound: {
                            label: "Lower bound",
                            dataName: "LowerBound",
                            controlType: controlTypes.textbox.name,
                            disabled: true
                        },
                        upperBound: {
                            label: "Upper bound",
                            dataName: "UpperBound",
                            controlType: controlTypes.textbox.name,
                            disabled: true
                        }
                    }
                }
            }
        },
        groupRelation: {
            areas: {
                basicArea: {
                    displayTitle: false,
                    tableLayout: true,
                    fields: {
                        groupRelationType: {
                            label: "GroupRel. type",
                            dataName: "GroupRelationType",
                            controlType: controlTypes.dropdown.name,
                            defaultOptions: systemDefaults.enums.groupRelationTypes,
                            onFieldDataChanged: function (newVal, control) {
                                var lowerBoundControl = $(control).parents(".AreaDiv").find("[fieldName='LowerBound']");
                                var upperBoundControl = $(control).parents(".AreaDiv").find("[fieldName='UpperBound']");
                                var groupRelationType = getEnumEntryByID(systemDefaults.enums.groupRelationTypes, parseFloat(newVal));

                                //
                                lowerBoundControl.val(groupRelationType.bounds.lowerBound).trigger("change");
                                upperBoundControl.val(groupRelationType.bounds.upperBound).trigger("change");

                                if (groupRelationType.bounds.editable == true) {
                                    lowerBoundControl.removeAttr("disabled");
                                    upperBoundControl.removeAttr("disabled");
                                }
                                else {
                                    lowerBoundControl.attr("disabled", "disabled");
                                    upperBoundControl.attr("disabled", "disabled");
                                }

                            },
                            onFieldDataLoaded: function (val, control) {
                                var lowerBoundControl = $(control).parents(".AreaDiv").find("[fieldName='LowerBound']");
                                var upperBoundControl = $(control).parents(".AreaDiv").find("[fieldName='UpperBound']");
                                var groupRelationType = getEnumEntryByID(systemDefaults.enums.groupRelationTypes, parseFloat(val));

                                if (groupRelationType.bounds.editable == true) {
                                    lowerBoundControl.removeAttr("disabled");
                                    upperBoundControl.removeAttr("disabled");
                                }
                            }
                        },
                        lowerBound: {
                            label: "Lower bound",
                            dataName: "LowerBound",
                            controlType: controlTypes.textbox.name,
                            disabled: true
                        },
                        upperBound: {
                            label: "Upper bound",
                            dataName: "UpperBound",
                            controlType: controlTypes.textbox.name,
                            disabled: true
                        }
                    }
                }
            }
        },
        compositionRule: {
            areas: {
                basicArea: {
                    displayTitle: false,
                    tableLayout: true,
                    fields: {
                        name: {
                            label: "Name",
                            dataName: "Name",
                            controlType: controlTypes.textbox.name
                        },
                        description: {
                            label: "Description",
                            dataName: "Description",
                            controlType: controlTypes.textarea.name
                        },
                        compositionRuleType: {
                            label: "Composition type",
                            dataName: "CompositionRuleType",
                            controlType: controlTypes.dropdown.name,
                            defaultOptions: systemDefaults.enums.compositionRuleTypes
                        }
                    }

                }
            }
        },
        customRule: {
            areas: {
                basicArea: {
                    displayTitle: false,
                    tableLayout: true,
                    fields: {
                        name: {
                            label: "Name",
                            dataName: "Name",
                            controlType: controlTypes.textbox.name
                        },
                        description: {
                            label: "Description",
                            dataName: "Description",
                            controlType: controlTypes.textarea.name
                        }
                    }
                },
                expressionArea: {
                    displayTitle: "Expression",
                    tableLayout: false,
                    fields: {
                        description: {
                            label: "Expression",
                            dataName: "Expression",
                            controlType: controlTypes.textarea.name
                        }
                    }
                }
            }
        }
    };

    //Fields and variables
    var _container = container;
    var _diagramDataModel = diagramDataModelInstance;
    var _currentClientDataObjectGUID = null, _currentBusinessDataObject = null, _currentClientDataObjectType = null;
    var _mainContainer = $(container).find("#MainContainer");
    var _headerLabel = $(container).find("#SetTypeLabel");
    var _thisPropertiesComponent = this;

    //Constructor/Initalizers
    this.Initialize = function () {

        //Handler for onFocus
        $(_mainContainer).bind("click", function (e) {
            _thisPropertiesComponent.Focus.RaiseEvent();
        });
    }

    //Helper methods
    var createControlTableRow = function (label, control) {

        //Standard html
        var row = $("<tr></tr>");
        var labelTD = $("<td></td>").appendTo(row);
        var label = $("<span class='Label-Small'>" + label + "</span>").appendTo(labelTD);
        var controlTD = $("<td></td>").appendTo(row);
        control.appendTo(controlTD);

        //
        return row;
    }
    var createSectionArea = function (displayTitle, createTable) {

        //Area html
        var area = $("<div class='AreaDiv'></div>").appendTo(_mainContainer);
        if (displayTitle != false) {
            var titleLabel = $("<span class='Label'>" + displayTitle + "</span>").appendTo(area);
        }
        var innerAreaContainer = $("<div class='InnerContainer'></div>").appendTo(area);
        var clearDiv = $("<div style='clear:both'></div>").appendTo(area);

        //InnerTable
        if (createTable == true) {
            var innerTable = $("<table class='InnerTable'></table>").appendTo(innerAreaContainer);
            var tbody = $("<tbody></tbody>").appendTo(innerTable);
            return tbody;
        } else if (createTable == false) {
            return innerAreaContainer;
        }
    }

    //Private fields and methods
    var loadUI = function () {

        //Go through each Area
        for (var areaKey in objectTypes[_currentClientDataObjectType].areas) {

            //Create an html area
            var area = objectTypes[_currentClientDataObjectType].areas[areaKey];
            var areaInnerContainer = createSectionArea(area.displayTitle, area.tableLayout);

            //Go through each field in the Area
            for (var fieldKey in area.fields) {

                //Create a control
                var field = area.fields[fieldKey];
                var control = controlTypes[field.controlType].createControlHTML(_currentBusinessDataObject, field.dataName, field, field.onFieldDataChanged);
                control.attr("fieldName", field.dataName).attr("id", field.dataName + "Control");

                //Disabled
                if (field.disabled)
                    control.attr("disabled", "disabled");

                //Add it to the Area
                if (area.tableLayout == true) {
                    var row = createControlTableRow(field.label, control);
                    row.appendTo(areaInnerContainer);
                } else {
                    control.appendTo(areaInnerContainer);
                }

                //Load data values
                controlTypes[field.controlType].loadData(control, _currentBusinessDataObject, field.dataName, field, onDataChanged);

            }

            //Rego through fields and all onFieldDataLoaded
            for (var fieldKey in area.fields) {

                //Get the field and control
                var field = area.fields[fieldKey];
                if (field.onFieldDataLoaded != undefined) {
                    field.onFieldDataLoaded(_currentBusinessDataObject[field.dataName], control);
                }
            }
        }

        //Special hack
        $(_mainContainer).children(".AreaDiv:gt(0)").css("margin-top", "10px");
    }
    var onDataChanged = function () {
        //Update DiagramDataModel using the _currentBusinessDataObject
        _diagramDataModel.UpdateClientDataObject(_currentClientDataObjectGUID, _currentBusinessDataObject);
    }
    var clearUI = function () {
        $(_mainContainer).html("");
        $(_headerLabel).text("");
    }
    var loadProperties = function (guid) {

        //Variables
        var clientDataObject = _diagramDataModel.GetClientDataObject(guid);
        _currentClientDataObjectGUID = guid;
        _currentClientDataObjectType = clientDataObject.GetTypeName();
        _currentBusinessDataObject = clientDataObject.GetBusinessDataObject();

        //Setup UI
        clearUI();
        loadUI();
        $(_headerLabel).text("(" + _currentClientDataObjectType + ")");
    }
    clear = function () {

        //Reset variables
        _currentClientDataObjectGUID = null;
        _currentBusinessDataObject = null;
        _currentClientDataObjectType = null;

        //Clear UI elements
        clearUI();
    }

    //Events
    this.Focus = new Event();

    //Eventhandlers
    this.OnClientDataObjectUpdated = function (guid) {
        loadProperties(guid);
    }
    this.OnClientDataObjectDeleted = function (guid) {
        clear();
    }
    this.OnRelatedViewElementSelectToggled = function (guid, shift, newState) {
        if (newState == systemDefaults.uiElementStates.selected && shift == false) {
            loadProperties(guid);
        } else {
            clear();
        }
    }
    this.OnRelatedViewSelectionCleared = function () {
        clear();
    }
}
var ModelExplorer = function (container, diagramDataModelInstance) {

    //Fields
    var _thisModelExplorer = this;
    var _diagramDataModel = diagramDataModelInstance;
    var _tree = null;
    var _supportedTypes = {
        feature: true,
        compositionRule: true,
        customRule: true
    }

    //Private methods
    var setElementSelected = function (node) {
        $(node).setNodeSelected();
    }
    var setElementUnselected = function (node) {
        $(node).setNodeUnselected();
    }
    var clearSelection = function (raiseEvents) {
        $(_tree).deselectAll();

        //Raise events
        if (raiseEvents == true) {
            _thisModelExplorer.SelectionCleared.RaiseEvent();
        }
    }
    var toggleElementSelect = function (node, shift, raiseEvents) {
        if (shift != true) {
            clearSelection();
        }

        //Select and remember the state
        var newState = null;
        var isSelected = $(node).isNodeSelected();
        if (isSelected == true) {
            $(node).setNodeUnselected();
            newState = systemDefaults.uiElementStates.unselected;
        } else {
            $(node).setNodeSelected();
            newState = systemDefaults.uiElementStates.selected;
        }

        //Raise events
        if (raiseEvents == true) {
            var guid = $(node).getNodeDataID();
            _thisModelExplorer.ElementSelectToggled.RaiseEvent([guid, shift, newState]);
        }
    }

    //Constructor/Initalizers
    this.Initialize = function () {

        //Handler for onFocus
        $(container).bind("click", function (e) {
            _thisModelExplorer.Focus.RaiseEvent();
        });

        //Create simpleTree
        options = {
            data: [
                {
                    ID: "featuresNode",
                    Name: "Features",
                    typeName: "folder"
                },
                {
                    ID: "featureTypesNode",
                    Name: "Feature Types",
                    typeName: "folder"
                },
                {
                    ID: "compositionRulesNode",
                    Name: "Composition Rules",
                    typeName: "folder"
                },
                {
                    ID: "customRulesNode",
                    Name: "Custom Rules",
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
                }
            },
            onNodeClicked: function (node, shift) {
                toggleElementSelect(node, shift, true);
            }
        }
        _tree = $(container).simpleTree(options);
    }

    //User interaction methods
    this.DeleteSelectedElements = function () {
        var selectedNodes = $(_tree).getSelectedNodes();
        if (selectedNodes != null) {
            for (var i = selectedNodes.length - 1; i >= 0; i--) {
                var nodeGuid = $(selectedNodes[i]).getNodeDataID();
                _diagramDataModel.DeleteClientDataObject(nodeGuid);
            }
        }
    }

    //Sync with dataModel methods
    var addElement = function (guid) {

        //Variables
        var clientDataObject = _diagramDataModel.GetClientDataObject(guid);
        var name = clientDataObject.GetPropertyValue("Name");
        var type = clientDataObject.GetTypeName();

        //Add a new element to the tree
        var newDataRow = {
            ID: guid,
            Name: name,
            typeName: type
        };
        var parentNode = $(_tree).getNode(type + "sNode");
        $(parentNode).addChildNode(newDataRow);
    }
    var updateElement = function (guid) {
        //Variables
        var clientDataObject = _diagramDataModel.GetClientDataObject(guid);
        var name = clientDataObject.GetPropertyValue("Name");

        //Update
        var node = $(_tree).getNode(guid);
        if (node != null)
            $(node).updateNodeName(name);
    }
    var deleteElement = function (guid) {
        var node = $(_tree).getNode(guid);
        if (node != null)
            $(node).deleteNode();
    }

    //Events
    this.ElementSelectToggled = new Event();
    this.SelectionCleared = new Event();
    this.Focus = new Event();

    //Eventhandlers
    this.OnClientDataObjectCreated = function (guid) {
        var clientDataObject = _diagramDataModel.GetClientDataObject(guid);
        var type = clientDataObject.GetTypeName();

        //
        if (_supportedTypes[type] != undefined) {
            addElement(guid);
        }
    }
    this.OnClientDataObjectUpdated = function (guid) {
        updateElement(guid);
    }
    this.OnClientDataObjectDeleted = function (guid) {
        deleteElement(guid);
    }
    this.OnRelatedViewElementSelectToggled = function (guid, shift, newState) {
        var node = $(_tree).getNode(guid);
        if (node != null) {
            toggleElementSelect(node, shift);
        }
    }
    this.OnRelatedViewSelectionCleared = function () {
        clearSelection();
    }
}
var DiagramContext = function (canvasContainer, diagramDataModelInstance) {

    //Fields
    var _diagramDataModel = diagramDataModelInstance;
    var _canvas = null, _canvasContainer = canvasContainer;
    var _selectedElements = new Array();
    var _createFeatureMode = false, _inlineEditMode = false;
    var _UIElements = {}; //dictionary to hold all UIElements (guid, UIElement)
    var _thisDiagramContext = this;
    var _supportedTypes = {
        feature: true,
        relation: true,
        groupRelation: true,
        compositionRule: true
    }

    //UIObjects & Defaults/Settings
    var UIFeature = function (clientDataObjectGUID, name, x, y) {

        //Fields
        var _outerElement = null;
        var _innerElements = {
            box: null,
            text: null
        };
        var _currentState = systemDefaults.uiElementStates.unselected;
        var _glow = null;
        var _name = name, _x = x, _y = y;
        var boxWidth = UIObjectStyles.feature.general.box.dimensions.width, boxHeight = UIObjectStyles.feature.general.box.dimensions.height;
        var _relatedCompositeElements = [];
        var _thisUIFeature = this;

        //Properties
        this.ClientDataObjectGUID = clientDataObjectGUID;
        this.IsSelected = function () {
            return _currentState == systemDefaults.uiElementStates.selected;
        }
        this.GetTypeName = function () {
            return "feature";
        }
        this.GetPos = function () {
            return { x: _x, y: _y };
        }

        this.InnerElements = _innerElements;
        this.RelatedCompositeElements = _relatedCompositeElements;

        //Private methods
        var makeSelectable = function () {

            //Selectable
            _outerElement.click(function (e) {
                toggleElementSelect(_thisUIFeature, e.shiftKey, true);

            });

            //Hoverable
            _outerElement.mouseover(function (e) {
                if (_glow == null) {
                    _innerElements.box.getBBox(); //hack fix for weird RaphaelJS bug
                    _glow = _innerElements.box.glow(commonStyles.glow.attr);
                }
            }).mouseout(function (e) {
                if (_glow != null) {
                    _glow.remove();
                    _glow = null;
                }
            });
        }
        var makeDraggable = function () {

            var wasMoved = false;
            //Drag and droppable
            var start = function () {

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
                //Remove glow while dragging
                if (_glow != null) {
                    _glow.remove();
                    _glow = null;
                }
                //Update x & y and move outerElement 
                _x = _outerElement.originalx + dx;
                _y = _outerElement.originaly + dy;
                _outerElement.attr({ x: _outerElement.originalx + dx, y: _outerElement.originaly + dy });

                //Move child elements
                for (var innerElemKey in _innerElements) {
                    var innerElem = _innerElements[innerElemKey];
                    innerElem.attr({ x: innerElem.originalx + dx, y: innerElem.originaly + dy });
                }

                if (settings.diagramContext.dynamicRefresh == true) {
                    //Notify related CompositeElements
                    for (var j = 0; j < _relatedCompositeElements.length; j++) {
                        _relatedCompositeElements[j].OnAdjacentFeatureMoved(_thisUIFeature);
                    }
                }
            };
            up = function () {
                if (wasMoved == true) {
                    //Update X and Y variables
                    internalUIFeatureMoved.RaiseEvent(_thisUIFeature);

                    //Notify related CompositeElements
                    if (settings.diagramContext.dynamicRefresh == false) {
                        for (var j = 0; j < _relatedCompositeElements.length; j++) {
                            _relatedCompositeElements[j].OnAdjacentFeatureMoved(_thisUIFeature);
                        }
                    }

                    wasMoved = false;
                }
            };
            _outerElement.drag(move, start, up);
        }
        var makeEditable = function () {
            _outerElement.dblclick(function (e) {
                _inlineEditMode = true;
                var bb1 = this.getBBox();
                var canvasOffsets = $(_canvasContainer).offset();
                var xoffset = canvasOffsets.left + 3, yoffset = canvasOffsets.top + 3;
                var textinput = $("<input class='Inputbox' type='text' />").appendTo("body").css({
                    position: "absolute",
                    left: bb1.x + xoffset,
                    top: bb1.y + yoffset,
                    width: 90,
                    height: 20
                }).bind("change", function () {
                    //
                    var newName = $(this).val();
                    $(this).remove();
                    _inlineEditMode = false;

                    //Update dataModel
                    _diagramDataModel.UpdateClientDataObjectField(_thisUIFeature.ClientDataObjectGUID, "Name", newName);
                }).bind("keypress", function (e) {
                    if (e.which == 13) { //Enter
                        //
                        var newName = $(this).val();
                        $(this).remove();
                        _inlineEditMode = false;

                        //Update dataModel
                        _diagramDataModel.UpdateClientDataObjectField(_thisUIFeature.ClientDataObjectGUID, "Name", newName);
                    }
                    else if (e.which == 27) { //Escape
                        $(this).remove();
                        _inlineEditMode = false;
                    }
                }).bind("blur", function (e) {
                    $(this).remove();
                    _inlineEditMode = false;
                });
                $(textinput).val(_name).select();

                //Default select
                toggleElementSelect(_thisUIFeature, e.shiftKey, true);
            });
        }

        //Public methods
        this.CreateGraphicalRepresentation = function () {
            //Variables
            var box = null, text = null;
            x = x == undefined ? 40.5 : x;
            y = y == undefined ? 40.5 : y;

            //Create inner elements            
            _innerElements.box = _canvas.rect(x, y, boxWidth, boxHeight, 0).attr(UIObjectStyles.feature.states[_currentState].box.attr);
            _innerElements.text = _canvas.text(boxWidth / 2 + x, boxHeight / 2 + y, _name).attr(UIObjectStyles.feature.states[_currentState].text.attr);

            //Create the main outer element
            _outerElement = _canvas.rect(x, y, boxWidth, boxHeight).attr(systemDefaults.common.outerElement.attr);

            //Setup 
            makeSelectable();
            makeDraggable();
            makeEditable();
        }
        this.ChangeState = function (state) {
            _currentState = state;
            _innerElements.box.attr(UIObjectStyles.feature.states[state].box.attr);
        }
        this.Update = function (newName) {
            //Set text
            _name = newName;
            _innerElements.text.attr({ text: newName });
        }
        this.Delete = function () {
            if (!_inlineEditMode) {

                //Remove Raphael objects
                _outerElement.remove();
                _innerElements.box.remove();
                _innerElements.text.remove();
                if (_glow != null)
                    _glow.remove();

                //Notify related CompositeElements
                for (var j = _relatedCompositeElements.length - 1; j >= 0; j--) {
                    _relatedCompositeElements[j].OnAdjacentFeatureDeleted(_thisUIFeature);
                }
            }
        }
    }
    var UIRelation = function (clientDataObjectGUID, relationType, lowerBound, upperBound, parentFeature, childFeature) { //CompositeElement

        //Fields
        var _innerElements = {
            cardinalityElement: null,
            connection: null
        };
        var _currentState = systemDefaults.uiElementStates.unselected;
        var _thisUIRelation = this;
        var _lowerBound = lowerBound, _upperBound = upperBound;
        var _relationType = relationType;

        //Properties
        this.ClientDataObjectGUID = clientDataObjectGUID;
        this.IsSelected = function () {
            return _currentState == systemDefaults.uiElementStates.selected;
        }
        this.GetDataObj = function () {
            return _dataObj;
        }
        this.GetTypeName = function () {
            return "relation";
        }
        this.GetSubTypeName = function () {
            var relationSubTypeName = getEnumEntryByID(systemDefaults.enums.relationTypes, _relationType).name;
            return relationSubTypeName;
        }

        //Private methods
        function makeSelectable() {
            //
            var handlers = {
                onClick: function (e) {
                    toggleElementSelect(_thisUIRelation, e.shiftKey, true);
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
        function removeFromFeature(UIFeature) {
            var index = $(UIFeature.RelatedCompositeElements).index(_thisUIRelation);
            if (index != -1) {
                UIFeature.RelatedCompositeElements.splice(index, 1);
            }
        }
        function getCardinalityElemPosition() {
            var cardinalityDistance = systemDefaults.orientations[settings.diagramContext.fixedOrientation].cardinalityDistances.relation;
            var line = _innerElements.connection.InnerElements.line;
            var labelPoint = line.getPointAtLength(line.getTotalLength() - cardinalityDistance);
            return labelPoint;
        }
        function toggleCardinalityElement() {
            var displayCardinalitiesMode = settings.diagramContext.displayCardinalities;
            switch (displayCardinalitiesMode) {
                case "full":
                    if (_innerElements.cardinalityElement == null) {
                        _innerElements.cardinalityElement = new UICardinalityLabel(_lowerBound, _upperBound, getCardinalityElemPosition);
                        _innerElements.cardinalityElement.CreateGraphicalRepresentation();
                    }
                    //
                    _innerElements.cardinalityElement.Update(_lowerBound, _upperBound);
                    break;
                case "partial":
                    //only show for cloneable
                    if (_relationType == systemDefaults.enums.relationTypes.cloneable.id) {
                        if (_innerElements.cardinalityElement == null) {
                            _innerElements.cardinalityElement = new UICardinalityLabel(_lowerBound, _upperBound, getCardinalityElemPosition);
                            _innerElements.cardinalityElement.CreateGraphicalRepresentation();
                        }

                        //
                        _innerElements.cardinalityElement.Update(_lowerBound, _upperBound);
                    } else
                    //hide for others
                    {
                        if (_innerElements.cardinalityElement != null) {
                            _innerElements.cardinalityElement.Delete();
                            _innerElements.cardinalityElement = null;
                        }
                    }
                    break;
                case false:
                    if (_innerElements.cardinalityElement != null) {
                        _innerElements.cardinalityElement.Delete();
                        _innerElements.cardinalityElement = null;
                    }
                    break;
            }
        }

        //Public methods
        this.CreateGraphicalRepresentation = function () {

            //Create a new UIConnection
            _innerElements.connection = new UIConnection(_thisUIRelation.GetTypeName(), _thisUIRelation.GetSubTypeName(), parentFeature.InnerElements.box, childFeature.InnerElements.box);
            _innerElements.connection.CreateGraphicalRepresentation();

            //Add references
            parentFeature.RelatedCompositeElements.push(_thisUIRelation);
            childFeature.RelatedCompositeElements.push(_thisUIRelation);

            //Setup cardinality element
            toggleCardinalityElement();

            //Setup
            makeSelectable();
        }
        this.ChangeState = function (state) {
            _currentState = state;
            _innerElements.connection.ChangeState(state);
        }
        this.Update = function (newRelationType, newLowerBound, newUpperBound) {
            _relationType = newRelationType;
            _lowerBound = newLowerBound;
            _upperBound = newUpperBound;

            //Update visuals
            _innerElements.connection.Update(_thisUIRelation.GetSubTypeName());
            toggleCardinalityElement(); //cardinalityElement
        }
        this.Delete = function () {
            //Remove connection
            _innerElements.connection.Delete();
            _innerElements.connection = null;

            //Remove cardinality element
            if (_innerElements.cardinalityElement != null) {
                _innerElements.cardinalityElement.Delete();
                _innerElements.cardinalityElement = null;
            }

            //Remove references
            removeFromFeature(parentFeature);
            removeFromFeature(childFeature);
        }

        //Event handlers
        this.OnAdjacentFeatureDeleted = function (UIFeature) {
            internalUIElementCascadedDelete.RaiseEvent(_thisUIRelation);
            //deleteElement(_thisUIRelation);
        }
        this.OnAdjacentFeatureMoved = function (UIFeature) {
            refresh();
        }
    }
    var UIGroupRelation = function (clientDataObjectGUID, groupRelationType, lowerBound, upperBound, parentFeature, childFeatures) { //CompositeElement

        //Fields
        var _innerElements = {
            cardinalityElement: null,
            rootArc: null,
            connections: null
        };
        var _currentState = systemDefaults.uiElementStates.unselected;
        var _lowerBound = lowerBound, _upperBound = upperBound;
        var _groupRelationType = groupRelationType;
        var _featuresToConnections = {}; // (UIFeatureGUID, UIConnection) dictionary
        var _thisUIGroupRelation = this;

        //Properties
        this.ClientDataObjectGUID = clientDataObjectGUID;
        this.IsSelected = function () {
            return _currentState == systemDefaults.uiElementStates.selected;
        }
        this.GetTypeName = function () {
            return "groupRelation";
        }
        this.GetSubTypeName = function () {
            var groupRelationSubTypeName = getEnumEntryByID(systemDefaults.enums.groupRelationTypes, _groupRelationType).name;
            return groupRelationSubTypeName;
        }

        //Private methods
        function makeSelectable() {
            //
            var handlers = {
                onClick: function (e) {
                    toggleElementSelect(_thisUIGroupRelation, e.shiftKey, true);
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
        function removeFromFeature(UIFeature) {
            var index = $(UIFeature.RelatedCompositeElements).index(_thisUIGroupRelation);
            if (index != -1) {
                UIFeature.RelatedCompositeElements.splice(index, 1);
            }
        }
        function getArcPath(firstConnection, lastConnection) {

            //Get points
            var rootPoint = firstConnection.InnerElements.line.getPointAtLength(0);
            var pointA = firstConnection.InnerElements.line.getPointAtLength(UIObjectStyles.groupRelation.general.rootArc.dimensions.length);
            var pointB = lastConnection.InnerElements.line.getPointAtLength(UIObjectStyles.groupRelation.general.rootArc.dimensions.length);

            //Get arc modifiers
            var currentOrientation = settings.diagramContext.fixedOrientation;
            var rx = systemDefaults.orientations[currentOrientation].arcModifiers.rx;
            var ry = systemDefaults.orientations[currentOrientation].arcModifiers.ry;
            var arcSweep = null;

            for (var key in systemDefaults.orientations[currentOrientation].arcDirection) {
                var arcDirection = systemDefaults.orientations[currentOrientation].arcDirection[key];
                if (arcDirection.check(rootPoint, pointA) == true) {
                    arcSweep = arcDirection.arcSweep;
                    break;
                }
            }
            //Create the path
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
        function refresh() {
            for (var i = 0; i < _innerElements.connections.length; i++) {
                _innerElements.connections[i].RefreshGraphicalRepresentation();
            }

            refreshArc();
            if (_innerElements.cardinalityElement != null)
                _innerElements.cardinalityElement.RefreshGraphicalRepresentation();
        }

        function getCardinalityElemPosition() {
            var cardinalityDistance = systemDefaults.orientations[settings.diagramContext.fixedOrientation].cardinalityDistances.groupRelation;
            var line = _innerElements.connections[0].InnerElements.line;
            var labelPoint = line.getPointAtLength(cardinalityDistance);
            return labelPoint;
        }
        function toggleCardinalityElement() {
            var displayCardinalitiesMode = settings.diagramContext.displayCardinalities;
            switch (displayCardinalitiesMode) {
                case "full":
                    if (_innerElements.cardinalityElement == null) {
                        _innerElements.cardinalityElement = new UICardinalityLabel(_lowerBound, _upperBound, getCardinalityElemPosition);
                        _innerElements.cardinalityElement.CreateGraphicalRepresentation();
                    }
                    //
                    _innerElements.cardinalityElement.Update(_lowerBound, _upperBound);
                    break;
                case "partial":
                    //only show for cardinal
                    if (_groupRelationType == systemDefaults.enums.groupRelationTypes.cardinal.id) {
                        if (_innerElements.cardinalityElement == null) {
                            _innerElements.cardinalityElement = new UICardinalityLabel(_lowerBound, _upperBound, getCardinalityElemPosition);
                            _innerElements.cardinalityElement.CreateGraphicalRepresentation();
                        }

                        //
                        _innerElements.cardinalityElement.Update(_lowerBound, _upperBound);
                    } else
                    //hide for others
                    {
                        if (_innerElements.cardinalityElement != null) {
                            _innerElements.cardinalityElement.Delete();
                            _innerElements.cardinalityElement = null;
                        }
                    }
                    break;
                case false:
                    if (_innerElements.cardinalityElement != null) {
                        _innerElements.cardinalityElement.Delete();
                        _innerElements.cardinalityElement = null;
                    }
                    break;
            }
        }

        //Public methods
        this.CreateGraphicalRepresentation = function () {
            _innerElements.connections = [];
            _innerElements.rootArc = null;

            //Create UIConnections for each child Feature
            for (var i = 0; i < childFeatures.length; i++) {
                var newUIConnection = new UIConnection(_thisUIGroupRelation.GetTypeName(), _thisUIGroupRelation.GetSubTypeName(), parentFeature.InnerElements.box, childFeatures[i].InnerElements.box);
                newUIConnection.CreateGraphicalRepresentation();
                _innerElements.connections.push(newUIConnection);

                //Add references
                childFeatures[i].RelatedCompositeElements.push(_thisUIGroupRelation);
                _featuresToConnections[childFeatures[i].ClientDataObjectGUID] = newUIConnection;
            }

            //Add reference to parentFeature
            parentFeature.RelatedCompositeElements.push(_thisUIGroupRelation);

            //Create Arc
            var arcPath = getArcPath(_innerElements.connections[0], _innerElements.connections[_innerElements.connections.length - 1]);
            _innerElements.rootArc = _canvas.path(arcPath).attr(UIObjectStyles.groupRelation.general.rootArc.attr);
            _innerElements.rootArc.attr(UIObjectStyles.groupRelation.subTypes[_thisUIGroupRelation.GetSubTypeName()].rootArc.attr);

            //Setup cardinality element
            toggleCardinalityElement();

            //Setup
            makeSelectable();
        }
        this.ChangeState = function (state) {
            _currentState = state;
            for (var i = 0; i < _innerElements.connections.length; i++) {
                _innerElements.connections[i].ChangeState(state);
            }
        }
        this.Update = function (newRelationType, newLowerBound, newUpperBound) {
            _groupRelationType = newRelationType;
            _lowerBound = newLowerBound;
            _upperBound = newUpperBound;

            //Update visuals
            for (var i = 0; i < _innerElements.connections.length; i++) {
                _innerElements.connections[i].Update(_thisUIGroupRelation.GetSubTypeName()); //endConnector
            }
            _innerElements.rootArc.attr(UIObjectStyles.groupRelation.subTypes[_thisUIGroupRelation.GetSubTypeName()].rootArc.attr);
            toggleCardinalityElement(); //cardinalityElement

        }
        this.Delete = function () {
            //Remove connections
            for (var i = _innerElements.connections.length - 1; i >= 0; i--) {
                _innerElements.connections[i].Delete(true);
                _innerElements.connections.splice(i, 1);
            }

            //Remove references
            removeFromFeature(parentFeature);
            for (var i = 0; i < childFeatures.length; i++) {
                removeFromFeature(childFeatures[i]);
            }

            //Remove Arc
            _innerElements.rootArc.remove();
            _innerElements.rootArc = null;

            //Remove CardinalityText
            if (_innerElements.cardinalityElement != null) {
                _innerElements.cardinalityElement.Delete();
                _innerElements.cardinalityElement = null
            }
        }

        //Event handlers
        this.OnAdjacentFeatureMoved = function (UIFeature) {
            if (UIFeature === parentFeature) {
                refresh();
            }
            else {
                //Refresh connection connected to single child UIFeature
                var connection = _featuresToConnections[UIFeature.ClientDataObjectGUID];
                connection.RefreshGraphicalRepresentation();

                //Refresh arc
                refreshArc();
            }
        }
        this.OnAdjacentFeatureDeleted = function (UIFeature) {

            internalUIElementCascadedDelete.RaiseEvent(_thisUIGroupRelation); //always delete whole groupRelation whenever a Child/Parent Feature is deleted

            /*
            //ParentFeature deleted
            if (UIFeature === parentFeature) {
            internalUIElementCascadedDelete.RaiseEvent(_thisUIGroupRelation);
            }
            //ChildFeature deleted
            else {
            //Delete connection connected to single child UIFeature
            var connection = _featuresToConnections[UIFeature.ClientDataObjectGUID];
            connection.Delete();
            var index = $(_innerElements.connections).index(connection);
            _innerElements.connections.splice(index, 1);

            //Refresh the arc
            refreshArc();

            //Delete whole GroupRelation if less than 2 connections left
            if (_innerElements.connections.length < 2) {
            internalUIElementCascadedDelete.RaiseEvent(_thisUIGroupRelation);
            }
            }*/
        }
    }
    var UICompositionRule = function (clientDataObjectGUID, compositionRuleType, firstFeature, secondFeature) {

        //Fields
        var _innerElements = {
            connection: null
        };
        var _currentState = systemDefaults.uiElementStates.unselected;
        var _compositionRuleType = compositionRuleType;
        var _thisUICompositionRule = this;

        //Properties
        this.ClientDataObjectGUID = clientDataObjectGUID;
        this.IsSelected = function () {
            return _currentState == systemDefaults.uiElementStates.selected;
        }
        this.GetTypeName = function () {
            return "compositionRule";
        }
        this.GetSubTypeName = function () {
            var compositionRuleSubTypeName = getEnumEntryByID(systemDefaults.enums.compositionRuleTypes, _compositionRuleType).name;
            return compositionRuleSubTypeName;
        }

        //Private methods
        function makeSelectable() {
            //
            var handlers = {
                onClick: function (e) {
                    toggleElementSelect(_thisUICompositionRule, e.shiftKey, true);
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
        function removeFromFeature(UIFeature) {
            var index = $(UIFeature.RelatedCompositeElements).index(_thisUICompositionRule);
            if (index != -1) {
                UIFeature.RelatedCompositeElements.splice(index, 1);
            }
        }

        //Public methods
        this.CreateGraphicalRepresentation = function () {
            //Create a new UIConnection
            _innerElements.connection = new UIConnection(_thisUICompositionRule.GetTypeName(), _thisUICompositionRule.GetSubTypeName(), firstFeature.InnerElements.box, secondFeature.InnerElements.box, true, true);
            _innerElements.connection.CreateGraphicalRepresentation();

            //Add references
            firstFeature.RelatedCompositeElements.push(_thisUICompositionRule);
            secondFeature.RelatedCompositeElements.push(_thisUICompositionRule);

            //Setup
            makeSelectable();
        }
        this.ChangeState = function (state) {
            _currentState = state;
            _innerElements.connection.ChangeState(state);
        }
        this.Delete = function () {
            //Remove connection
            _innerElements.connection.Delete();
            _innerElements.connection = null;

            //Remove references
            removeFromFeature(firstFeature);
            removeFromFeature(secondFeature);
        }
        this.Update = function (newCompositionRuleType) {
            _compositionRuleType = newCompositionRuleType;

            //Update visuals
            _innerElements.connection.Update(_thisUICompositionRule.GetSubTypeName());

        }

        //Event handlers
        this.OnAdjacentFeatureDeleted = function (UIFeature) {
            internalUIElementCascadedDelete.RaiseEvent(_thisUICompositionRule);
            //deleteElement(_thisUICompositionRule);
        }
        this.OnAdjacentFeatureMoved = function (UIFeature) {
            refresh();
        }
    }
    var UIConnection = function (parentElementType, parentElementSubType, parentBox, childBox, invertOrientation, toBack) {

        //Standard fields
        var _innerElements = {
            line: null,
            connectors: {
                startConnector: null,
                endConnector: null
            }
        };
        var _glow = null, _handlers = null;
        var _currentState = systemDefaults.uiElementStates.unselected;
        var _outerElement = null;
        var _parentElementType = parentElementType, _parentElementSubType = parentElementSubType;
        var _thisUIConnection = this;

        //Special fields
        var _currentPath = null;
        var _invertOrientation = (invertOrientation != undefined) ? invertOrientation : null; //parameter used to force the path to draw in the opposite orientation
        var _toBack = (toBack != undefined) ? toBack : null; //parameter used to draw connection behind other elements

        //Properties
        this.InnerElements = _innerElements;
        this.GetCurrentPath = function () {
            return _currentPath;
        }

        //Private methods
        var getPath = function (objA, objB) {

            //Variables
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

            //Determine the orientation
            var currentOrientation = null;
            if (settings.diagramContext.fixedOrientation != false) {
                currentOrientation = settings.diagramContext.fixedOrientation; //use default fixed orientation without calculating angle
            }
            else {
                var centerdx = objBcenter.x - objAcenter.x, centerdy = objBcenter.y - objAcenter.y;
                var angle = Math.atan2(-centerdy, centerdx) * 180 / Math.PI;
                angle = parseInt(angle.toFixed());
                if (angle < 0)
                    angle += 360;
                for (var key in systemDefaults.orientations) {
                    var orientation = systemDefaults.orientations[key];
                    for (var i = 0; i < orientation.angleIntervals.length; i++) {
                        if (angle >= orientation.angleIntervals[i].min && angle <= orientation.angleIntervals[i].max) {
                            currentOrientation = orientation.name;
                            break;
                        }
                    }
                }
            }

            //Invert orientation if necessary
            if (invertOrientation)
                currentOrientation = systemDefaults.orientations[currentOrientation].opposite;


            //Determine which connection points in the current orientation make the shortest path
            var distances = [], points = {};
            for (var i = 0; i < systemDefaults.orientations[currentOrientation].connections.length; i++) {
                var con = systemDefaults.orientations[currentOrientation].connections[i];
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
                    curveModifier: systemDefaults.orientations[currentOrientation].curveModifiers[i]
                };
            }
            var closestConnection = points[Math.min.apply(Math, distances)];

            //Create path
            var path = null;
            if (settings.diagramContext.drawCurves == true) {
                path = [["M", closestConnection.x1.toFixed(1), closestConnection.y1.toFixed(1)],
                ["C",
                closestConnection.x1 + closestConnection.curveModifier.x,
                closestConnection.y1 + closestConnection.curveModifier.y,
                closestConnection.x2 - closestConnection.curveModifier.x,
                closestConnection.y2 - closestConnection.curveModifier.y,
                closestConnection.x2.toFixed(1), closestConnection.y2.toFixed(1)]];
            } else {
                path = ["M", closestConnection.x1.toFixed(3), closestConnection.y1.toFixed(3), "L", closestConnection.x2.toFixed(3), closestConnection.y2.toFixed(3)].join(","); //line
            }


            var returnObj = {
                path: path,
                startObj: objA,
                endObj: objB,
                startPoint: {
                    x: closestConnection.x1,
                    y: closestConnection.y1
                },
                endPoint: {
                    x: closestConnection.x2,
                    y: closestConnection.y2
                }
            };
            return returnObj;
        }
        function makeSelectable() {
            if (_handlers != null) {
                //Selectable
                _outerElement.click(function (e) {
                    _handlers.onClick(e);
                });

                //Hoverable
                _outerElement.mouseover(function (e) {
                    _handlers.onMouseOver(e);
                }).mouseout(function (e) {
                    _handlers.onMouseOut(e);
                });
            }
        }
        function refresh() {
            //Calculate a new path
            _currentPath = getPath(parentBox, childBox);

            //Refresh line 
            var line = _innerElements.line;
            _outerElement.attr({ path: _currentPath.path });
            line.attr({ path: _currentPath.path });

            //Refresh position of connectors
            if (_innerElements.startConnector != null) {
                _innerElements.startConnector.RefreshGraphicalRepresentation();
            }
            if (_innerElements.endConnector != null) {
                _innerElements.endConnector.RefreshGraphicalRepresentation();
            }
        }
        function getCurrentStyle() {
            var commonStyle = commonStyles.connection.states[_currentState];
            var generalStyle = UIObjectStyles[_parentElementType].general.connection;
            var subTypeStyle = UIObjectStyles[_parentElementType].subTypes[_parentElementSubType].connection;
            var currentStyle = $.extend(true, {}, commonStyle, generalStyle, subTypeStyle);

            return currentStyle;
        }

        //Public methods
        this.CreateGraphicalRepresentation = function () {

            //Get the current style
            var currentStyle = getCurrentStyle();

            //Create line
            _currentPath = getPath(parentBox, childBox);
            _innerElements.line = _canvas.path(_currentPath.path);
            _innerElements.line.attr(currentStyle.line.attr);

            //Create startConnector
            if (currentStyle.connectors.startConnector != undefined) {
                _innerElements.startConnector = new UIConnectorElement(_thisUIConnection, currentStyle.connectors.startConnector, currentStyle.connectors.startConnector.attr, "startPoint");
                _innerElements.startConnector.CreateGraphicalRepresentation();
            }

            //Create endConnector
            if (currentStyle.connectors.endConnector != undefined) {
                _innerElements.endConnector = new UIConnectorElement(_thisUIConnection, currentStyle.connectors.endConnector, currentStyle.connectors.endConnector.attr, "endPoint");
                _innerElements.endConnector.CreateGraphicalRepresentation();
            }

            //Create the main outer element
            _outerElement = _canvas.path(_currentPath.path).attr(systemDefaults.common.outerElement.attr);

            //
            if (toBack) {
                _outerElement.toBack();
                _innerElements.line.toBack();
            }
        }
        this.RefreshGraphicalRepresentation = function () {
            refresh();
        }
        this.ChangeState = function (state) {
            //
            _currentState = state;
            _innerElements.line.attr(commonStyles.connection.states[_currentState].line.attr);
            _thisUIConnection.Update(_parentElementSubType); //hack-fix for state style overriding line style in CompositionRule
        }
        this.ShowGlow = function () {
            if (_glow == null) {
                _glow = _innerElements.line.glow(commonStyles.glow.attr);
            }
        }
        this.HideGlow = function () {
            if (_glow != null) {
                _glow.remove();
                _glow = null;
            }
        }
        this.MakeSelectable = function (handlers) {
            _handlers = handlers;
            makeSelectable();
        }
        this.Delete = function () {

            //Remove Raphael objects
            _innerElements.line.remove();
            if (_innerElements.endConnector != null) {
                _innerElements.endConnector.Delete();
                _innerElements.endConnector = null;
            }
            if (_innerElements.startConnector != null) {
                _innerElements.startConnector.Delete();
                _innerElements.startConnector = null;
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

            //Get the current style
            var currentStyle = getCurrentStyle();

            //Update line
            _innerElements.line.attr(currentStyle.line.attr);

            //Update Connectors
            if (_innerElements.startConnector != null) {
                _innerElements.startConnector.Update(currentStyle.connectors.startConnector.attr);

            }
            if (_innerElements.endConnector != null) {
                _innerElements.endConnector.Update(currentStyle.connectors.endConnector.attr);

            }
        }
    }
    var UIConnectorElement = function (parentConnection, raphaelConnectorType, connectorStyle, positionType) {

        //Fields
        var _innerElements = {
            raphaelElem: null
        };
        var _connectionElement = parentConnection;

        //Properties
        this.InnerElements = _innerElements;

        //Private methods
        function refresh() {
            var xPos = _connectionElement.GetCurrentPath()[positionType].x - raphaelConnectorType.dimensionModifier, yPos = _connectionElement.GetCurrentPath()[positionType].y - raphaelConnectorType.dimensionModifier;
            _innerElements.raphaelElem.attr({ cx: xPos, cy: yPos, x: xPos, y: yPos });
        }

        //Public methods
        this.CreateGraphicalRepresentation = function () {

            //Create raphaelElem
            var xPos = _connectionElement.GetCurrentPath()[positionType].x - raphaelConnectorType.dimensionModifier, yPos = _connectionElement.GetCurrentPath()[positionType].y - raphaelConnectorType.dimensionModifier; //position for endConnector
            _innerElements.raphaelElem = eval("_canvas." + raphaelConnectorType.raphaelType + "(xPos, yPos" + paramsToString(raphaelConnectorType.dimensions) + ")");
            _innerElements.raphaelElem.attr(connectorStyle);
        }
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
    }
    var UICardinalityLabel = function (firstNumber, secondNumber, calculatePositionFunction) {

        //Fields
        var _innerElements = {
            box: null,
            text: null
        };
        var _outerElement = null;
        var _firstNumber = firstNumber, _secondNumber = secondNumber;
        var _thisUICardinalityLabel = this;

        //Properties
        this.InnerElements = _innerElements;

        //Private methods
        function refresh() {
            //Setup styles
            var commonStyle = commonStyles.cardinalityLabel;
            var currentStyle = commonStyle;

            //
            var labelPoint = calculatePositionFunction();
            _innerElements.box.attr({ x: labelPoint.x - currentStyle.box.dimensions.width / 2, y: labelPoint.y - currentStyle.box.dimensions.height / 2 });
            _innerElements.text.attr({ x: labelPoint.x, y: labelPoint.y });

        }

        //Public methods
        this.CreateGraphicalRepresentation = function () {
            //Setup styles
            var commonStyle = commonStyles.cardinalityLabel;
            var currentStyle = commonStyle;

            //Create box and text
            var labelPoint = calculatePositionFunction();
            _innerElements.box = _canvas.rect(labelPoint.x - currentStyle.box.dimensions.width / 2, labelPoint.y - currentStyle.box.dimensions.height / 2, currentStyle.box.dimensions.width, currentStyle.box.dimensions.height, 0);
            _innerElements.box.attr(currentStyle.box.attr);
            _innerElements.text = _canvas.text(labelPoint.x, labelPoint.y, "[" + _firstNumber + ".." + _secondNumber + "]");
            _innerElements.text.attr(currentStyle.text.attr);
        }
        this.RefreshGraphicalRepresentation = function () {
            refresh();
        }
        this.Delete = function () {
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

    //Properties
    this.SelectedElements = _selectedElements;

    //Constructor/Initalizers
    this.Initialize = function () {
        _canvas = Raphael(canvasContainer, "100%", "100%");

        //Handler for canvas click
        $(_canvasContainer).bind("click", function (e) {
            _thisDiagramContext.Focus.RaiseEvent();
            if (e.target.nodeName == "svg" && e.shiftKey != true) {
                clearSelection(true);
            }
        });

        //Set internal eventhandlers
        internalUIElementCascadedDelete.Add(new EventHandler(onInternalUIElementCascadeDeleted));
        internalUIFeatureMoved.Add(new EventHandler(onInternalUIFeatureMoved));
    };

    //Private methods
    var setElementSelected = function (UIElement) {
        if (UIElement.IsSelected() != true) {
            _selectedElements.push(UIElement);
            UIElement.ChangeState(systemDefaults.uiElementStates.selected);
        }
    }
    var setElementUnselected = function (UIElement) {
        if (UIElement.IsSelected() == true) {
            var index = $(_selectedElements).index(UIElement);
            _selectedElements.splice(index, 1);
            UIElement.ChangeState(systemDefaults.uiElementStates.unselected);
        }
    }
    var clearSelection = function (raiseEvents) {
        for (var i = _selectedElements.length - 1; i >= 0; i--) {
            setElementUnselected(_selectedElements[i]);
        }

        //Raise events
        if (raiseEvents == true) {
            _thisDiagramContext.SelectionCleared.RaiseEvent();
        }
    }
    var toggleElementSelect = function (UIElement, shift, raiseEvents) {
        if (shift != true) {
            clearSelection();
        }

        var newState = null;
        if (UIElement.IsSelected()) {
            setElementUnselected(UIElement);
            newState = systemDefaults.uiElementStates.unselected;
        } else {
            setElementSelected(UIElement);
            newState = systemDefaults.uiElementStates.selected; ;
        }

        //Raise events
        if (raiseEvents == true) {
            _thisDiagramContext.ElementSelectToggled.RaiseEvent([UIElement.ClientDataObjectGUID, shift, newState]);
        }
    }
    var deleteElement = function (UIElement) {
        setElementUnselected(UIElement);
        UIElement.Delete();
        _UIElements[UIElement.ClientDataObjectGUID] = null;
    }

    var addFeature = function (guid) {
        var posx = _diagramDataModel.GetClientDataObjectField(guid, "XPos");
        var posy = _diagramDataModel.GetClientDataObjectField(guid, "YPos");
        var name = _diagramDataModel.GetClientDataObjectField(guid, "Name");
        var newUIFeature = new UIFeature(guid, name, posx, posy);
        newUIFeature.CreateGraphicalRepresentation();

        //
        _UIElements[guid] = newUIFeature;
    }
    var addRelation = function (guid) {

        //Variables
        var clientDataObject = _diagramDataModel.GetClientDataObject(guid);
        var childFeature = _UIElements[clientDataObject.ExtraClientData.childFeatureGUID];
        var parentFeature = _UIElements[clientDataObject.ExtraClientData.parentFeatureGUID];

        var relationType = clientDataObject.GetPropertyValue("RelationType");
        var lowerBound = clientDataObject.GetPropertyValue("LowerBound");
        var upperBound = clientDataObject.GetPropertyValue("UpperBound");

        //Create a new UIRelation
        var newUIRelation = new UIRelation(guid, relationType, lowerBound, upperBound, parentFeature, childFeature);
        newUIRelation.CreateGraphicalRepresentation();

        //Add to collection
        _UIElements[guid] = newUIRelation;
    }
    var addGroupRelation = function (guid) {

        //Variables
        var clientDataObject = _diagramDataModel.GetClientDataObject(guid);
        var parentFeature = _UIElements[clientDataObject.ExtraClientData.parentFeatureGUID];
        var childFeatures = [];
        for (var i = 0; i < clientDataObject.ExtraClientData.childFeatureGUIDs.length; i++) {
            childFeatures.push(_UIElements[clientDataObject.ExtraClientData.childFeatureGUIDs[i]]);
        }

        var groupRelationType = _diagramDataModel.GetClientDataObject(guid).GetPropertyValue("GroupRelationType");
        var lowerBound = _diagramDataModel.GetClientDataObject(guid).GetPropertyValue("LowerBound");
        var upperBound = _diagramDataModel.GetClientDataObject(guid).GetPropertyValue("UpperBound");

        //Create
        var newUIGroupRelation = new UIGroupRelation(guid, groupRelationType, lowerBound, upperBound, parentFeature, childFeatures);
        newUIGroupRelation.CreateGraphicalRepresentation();

        //Raise events/etc
        _UIElements[guid] = newUIGroupRelation;
    }
    var addCompositionRule = function (guid) {

        //Variables
        var clientDataObject = _diagramDataModel.GetClientDataObject(guid);
        var firstFeature = _UIElements[clientDataObject.ExtraClientData.firstFeatureGUID];
        var secondFeature = _UIElements[clientDataObject.ExtraClientData.secondFeatureGUID];

        var compositionRuleType = _diagramDataModel.GetClientDataObject(guid).GetPropertyValue("CompositionRuleType");

        //Create
        var newUICompositionRule = new UICompositionRule(guid, compositionRuleType, firstFeature, secondFeature);
        newUICompositionRule.CreateGraphicalRepresentation();

        //Raise events/etc
        _UIElements[guid] = newUICompositionRule;
    }

    var createFeature = function () {
        if (_createFeatureMode == false) {
            _createFeatureMode = true;

            //Create wireframe
            $(_canvasContainer).css("cursor", "crosshair");
            var boxWidth = UIObjectStyles.feature.general.box.dimensions.width, boxHeight = UIObjectStyles.feature.general.box.dimensions.height;
            var wireframebox = _canvas.rect(-100, -100, boxWidth, boxHeight, 0).attr(UIObjectStyles.feature.states.wireframe.box.attr);
            var mousemoveHandler = function (e) {
                var posx = e.pageX - $(document).scrollLeft() - $(_canvasContainer).offset().left + 0.5 - boxWidth / 2;
                var posy = e.pageY - $(document).scrollTop() - $(_canvasContainer).offset().top + 0.5 - boxHeight / 2;
                if (wireframebox == null) {
                    wireframebox = _canvas.rect(posx, posy, boxWidth, boxHeight, 0).attr(styles.feature.states.wireframe.box);
                }
                else {
                    wireframebox.attr({ x: posx, y: posy });
                }
            };
            $(_canvasContainer).bind("mousemove", mousemoveHandler);

            //Create actual Feature on click
            var clickHandler = function (e) {

                //Get the position
                var posx = e.pageX - $(document).scrollLeft() - $(_canvasContainer).offset().left + 0.5 - boxWidth / 2;
                var posy = e.pageY - $(document).scrollTop() - $(_canvasContainer).offset().top + 0.5 - boxHeight / 2;

                //Remove wireframe
                $(_canvasContainer).unbind("click", clickHandler);
                $(_canvasContainer).unbind("mousemove", mousemoveHandler);
                $(_canvasContainer).css("cursor", "default");
                wireframebox.remove();

                //Create a new clientDataObject in the diagramDataModel
                var initialValues = {
                    XPos: posx,
                    YPos: posy
                }
                var clientFeatureDataObject = _diagramDataModel.CreateNewClientDataObject("feature", initialValues);

                //
                _createFeatureMode = false;
            };
            $(_canvasContainer).bind("click", clickHandler);
        }
    }
    var createRelation = function () {
        if (_selectedElements.length == 2) {

            //Create a new clientDataObject in the diagramDataModel
            var parentFeatureGUID = _selectedElements[0].ClientDataObjectGUID;
            var childFeatureGUID = _selectedElements[1].ClientDataObjectGUID;
            var extraClientData = {
                parentFeatureGUID: parentFeatureGUID,
                childFeatureGUID: childFeatureGUID
            }
            var clientRelationDataObject = _diagramDataModel.CreateNewClientDataObject("relation", null, extraClientData);
        }
    }
    var createGroupRelation = function () {
        if (_selectedElements.length > 2) {

            //Create a new clientDataObject in the diagramDataModel
            var parentFeatureGUID = _selectedElements[0].ClientDataObjectGUID;
            var childFeaturesGUID = [];
            var childFeatures = _selectedElements.slice(1);
            for (var i = 0; i < childFeatures.length; i++) {
                childFeaturesGUID.push(childFeatures[i].ClientDataObjectGUID);
            }
            var extraClientData = {
                parentFeatureGUID: parentFeatureGUID,
                childFeatureGUIDs: childFeaturesGUID
            }
            var clientGroupRelationDataObject = _diagramDataModel.CreateNewClientDataObject("groupRelation", null, extraClientData);
        }
    }
    var createCompositionRule = function () {
        if (_selectedElements.length == 2) {

            //Create a new clientDataObject in the diagramDataModel
            var firstFeatureGUID = _selectedElements[0].ClientDataObjectGUID;
            var secondFeatureGUID = _selectedElements[1].ClientDataObjectGUID;
            var extraClientData = {
                firstFeatureGUID: firstFeatureGUID,
                secondFeatureGUID: secondFeatureGUID
            }
            var clientRelationDataObject = _diagramDataModel.CreateNewClientDataObject("compositionRule", null, extraClientData);
        }
    }

    //Public methods (triggered by ModelController)
    this.DeleteSelectedElements = function () {
        for (var i = _selectedElements.length - 1; i >= 0; i--) {
            _diagramDataModel.DeleteClientDataObject(_selectedElements[i].ClientDataObjectGUID);
        }
    }
    this.CreateNewElement = function (type) {

        switch (type) {
            case "feature":
                createFeature();
                break;
            case "relation":
                createRelation();
                break;
            case "groupRelation":
                createGroupRelation();
                break;
            case "compositionRule":
                createCompositionRule();
                break;
        }
    }

    //Sync with dataModel methods
    addElement = function (guid) {

        //Variables
        var clientDataObject = _diagramDataModel.GetClientDataObject(guid);
        var clientDataObjectType = clientDataObject.GetTypeName();

        //Perform update according to type
        switch (clientDataObjectType) {
            case "feature":
                addFeature(guid);
                break;
            case "relation":
                addRelation(guid);
                break;
            case "groupRelation":
                addGroupRelation(guid);
                break;
            case "compositionRule":
                addCompositionRule(guid);
                break;
        }
    }
    updateElement = function (guid) {
        //Variables
        var UIElement = _UIElements[guid];
        var clientDataObject = _diagramDataModel.GetClientDataObject(guid);
        var clientDataObjectType = clientDataObject.GetTypeName();

        //Perform update according to type
        switch (clientDataObjectType) {
            case "feature":
                UIElement.Update(clientDataObject.GetPropertyValue("Name"));
                break;
            case "relation":
                UIElement.Update(clientDataObject.GetPropertyValue("RelationType"), clientDataObject.GetPropertyValue("LowerBound"), clientDataObject.GetPropertyValue("UpperBound"));
                break;
            case "groupRelation":
                UIElement.Update(clientDataObject.GetPropertyValue("GroupRelationType"), clientDataObject.GetPropertyValue("LowerBound"), clientDataObject.GetPropertyValue("UpperBound"));
                break;
            case "compositionRule":
                UIElement.Update(clientDataObject.GetPropertyValue("CompositionRuleType"));
                break;
        }
    }

    //Events
    this.ElementSelectToggled = new Event();
    this.SelectionCleared = new Event();
    this.Focus = new Event();
    var internalUIElementCascadedDelete = new Event();
    var internalUIFeatureMoved = new Event();

    //Eventhandlers
    this.OnClientDataObjectCreated = function (guid) {
        var clientDataObject = _diagramDataModel.GetClientDataObject(guid);
        var type = clientDataObject.GetTypeName();

        if (_supportedTypes[type] != undefined) {
            addElement(guid);
        }
    }
    this.OnClientDataObjectUpdated = function (guid) {
        var UIElement = _UIElements[guid];
        if (UIElement != undefined) {
            updateElement(guid);
        }
    }
    this.OnClientDataObjectDeleted = function (guid) {
        var UIElement = _UIElements[guid];
        if (UIElement != undefined) {
            deleteElement(UIElement);
        }
    }

    this.OnRelatedViewElementSelectToggled = function (guid, shift, newState) {
        var UIElement = _UIElements[guid];
        if (UIElement != undefined) {
            toggleElementSelect(UIElement, shift);
        } else {
            clearSelection();
        }
    }
    this.OnRelatedViewSelectionCleared = function () {
        clearSelection();
    }

    var onInternalUIElementCascadeDeleted = function (UIElement) {
        _diagramDataModel.DeleteClientDataObject(UIElement.ClientDataObjectGUID);
    }
    var onInternalUIFeatureMoved = function (UIFeature) {
        _diagramDataModel.UpdateClientDataObjectField(UIFeature.ClientDataObjectGUID, "XPos", UIFeature.GetPos().x);
        _diagramDataModel.UpdateClientDataObjectField(UIFeature.ClientDataObjectGUID, "YPos", UIFeature.GetPos().y);
    }
}

//Events
var Event = function () {

    //Fields
    var _Handlers = new Array();

    //Methods
    this.Add = function (handler) {
        _Handlers.push(handler);
    }
    this.RaiseEvent = function (args) {
        for (var i = 0; i < _Handlers.length; i++) {
            _Handlers[i].NotifyEventRaised(args);
        }
    }
}
var EventHandler = function (func) {

    //Methods
    this.NotifyEventRaised = function (args) {

        //Setup args
        var argumentsArray = null;
        if (isArray(args) == true) {
            argumentsArray = args;
        } else {
            argumentsArray = [args];
        }

        //Call function
        func.apply(this, argumentsArray);
    }
}



