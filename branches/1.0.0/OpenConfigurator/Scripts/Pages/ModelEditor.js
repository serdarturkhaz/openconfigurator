// Developed by OpenConfigurator Core Team
// 
// Distributed under the MIT license
// ===========================================================
// Copyright (c) 2012 - Radu Mitache
// Edited by: Alexander Mantzoukas
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), 
// to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, 
// publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR 
// OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR 
// OTHER DEALINGS IN THE SOFTWARE.

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
                    width: 90,
                    height: 26,
                    maxWidth: 150
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
            curveModifiers: [{ x: -40, y: 0 }, { x: +40, y: 0}],
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
            curveModifiers: [{ x: 0, y: -40 }, { x: 0, y: +40}],
            angleIntervals: [{ min: 46, max: 135 }, { min: 225, max: 315}]
        }
    },
    validationExpressions: {
        required: "\w+",
        numeric: {
            naturalNumbers: "^[0-9]\\d*\\.?[0]*$"
        }
    }
}
var innerState = {
    ready: 0,
    dragging: 1,
    inlineEdit: 2,
    featureLock: 3,
    relationLock: 4,
    groupRelationLock: 5,
    compositionRuleLock: 6
}

//ClientObjects***************************************************************************************************
var ClientObjects = {
    Feature: null,
    Attribute: null,
    Relation: null,
    GroupRelation: null,
    CompositionRule: null,
    CustomRule: null
}

ClientObjects.Feature = function (businessObject) {

    //Fields
    var _guid = null;
    var _businessObject = businessObject;
    var _attributes = [];

    //Properties
    this.GUID = _guid;
    this.GetType = function () {
        return "feature";
    }
    this.Attributes = _attributes;

    //Methods
    this.GetBusinessObject = function () {
        return _businessObject;
    }
    this.GetBusinessObjectCopy = function () {
        var copy = jQuery.extend(true, {}, _businessObject);
        return copy;
    }
    this.UpdateBusinessObject = function (modifiedBusinessObject) {
        _businessObject = modifiedBusinessObject;
    }
    this.GetField = function (fieldName) {
        return _businessObject[fieldName];
    }
    this.SetField = function (fieldName, value) {
        _businessObject[fieldName] = value;
    }
    this.SetDeleteFlag = function () {
        _businessObject["ToBeDeleted"] = true;
    }
    this.IsDeleted = function () {
        return _businessObject["ToBeDeleted"] == true;
    }
    this.SyncBusinessObject = function () {

    }
}
ClientObjects.Attribute = function (businessObject) {

    //Fields
    var _guid = null;
    var _businessObject = businessObject;
    var _feature = {};

    //Properties
    this.GUID = _guid;
    this.GetType = function () {
        return "attribute";
    }
    this.Feature = _feature;

    //Methods
    this.GetBusinessObject = function () {
        return _businessObject;
    }
    this.GetBusinessObjectCopy = function () {
        var copy = jQuery.extend(true, {}, _businessObject);
        return copy;
    }
    this.UpdateBusinessObject = function (modifiedBusinessObject) {
        _businessObject = modifiedBusinessObject;
    }
    this.GetField = function (fieldName) {
        return _businessObject[fieldName];
    }
    this.SetField = function (fieldName, value) {
        _businessObject[fieldName] = value;
    }
    this.SetDeleteFlag = function () {
        _businessObject["ToBeDeleted"] = true;
    }
    this.IsDeleted = function () {
        return _businessObject["ToBeDeleted"] == true;
    }
    this.SyncBusinessObject = function () {
        _businessObject.FeatureID = this.Feature.GetField("ID");
    }

}
ClientObjects.Relation = function (businessObject) {

    //Fields
    var _guid = null;
    var _businessObject = businessObject;
    var _parentFeature = {}, _childFeature = {};

    //Properties
    this.GUID = _guid;
    this.GetType = function () {
        return "relation";
    }
    this.ParentFeature = _parentFeature;
    this.ChildFeature = _childFeature;

    //Methods
    this.GetBusinessObject = function () {
        return _businessObject;
    }
    this.GetBusinessObjectCopy = function () {
        var copy = jQuery.extend(true, {}, _businessObject);
        return copy;
    }
    this.UpdateBusinessObject = function (modifiedBusinessObject) {
        _businessObject = modifiedBusinessObject;
    }
    this.GetField = function (fieldName) {
        return _businessObject[fieldName];
    }
    this.SetField = function (fieldName, value) {
        _businessObject[fieldName] = value;
    }
    this.SetDeleteFlag = function () {
        _businessObject["ToBeDeleted"] = true;
    }
    this.IsDeleted = function () {
        return _businessObject["ToBeDeleted"] == true;
    }
    this.SyncBusinessObject = function () {
        _businessObject.ParentFeatureID = this.ParentFeature.GetField("ID");
        _businessObject.ChildFeatureID = this.ChildFeature.GetField("ID");
    }

}
ClientObjects.GroupRelation = function (businessObject) {

    //Fields
    var _guid = null;
    var _businessObject = businessObject;
    var _parentFeature = {}, _childFeatures = [];

    //Properties
    this.GUID = _guid;
    this.GetType = function () {
        return "groupRelation";
    }
    this.ParentFeature = _parentFeature;
    this.ChildFeatures = _childFeatures;

    //Methods
    this.GetBusinessObject = function () {
        return _businessObject;
    }
    this.GetBusinessObjectCopy = function () {
        var copy = jQuery.extend(true, {}, _businessObject);
        return copy;
    }
    this.UpdateBusinessObject = function (modifiedBusinessObject) {
        _businessObject = modifiedBusinessObject;
    }
    this.GetField = function (fieldName) {
        return _businessObject[fieldName];
    }
    this.SetField = function (fieldName, value) {
        _businessObject[fieldName] = value;
    }
    this.SetDeleteFlag = function () {
        _businessObject["ToBeDeleted"] = true;
    }
    this.IsDeleted = function () {
        return _businessObject["ToBeDeleted"] == true;
    }
    this.SyncBusinessObject = function () {
        _businessObject.ParentFeatureID = this.ParentFeature.GetField("ID");
        for (var i = 0; i < this.ChildFeatures.length; i++) {
            _businessObject.ChildFeatureIDs[i] = this.ChildFeatures[i].GetField("ID");
        }

    }
}
ClientObjects.CompositionRule = function (businessObject) {

    //Fields
    var _guid = null;
    var _businessObject = businessObject;
    var _firstFeature = {}, _secondFeature = {};

    //Properties
    this.GUID = _guid;
    this.GetType = function () {
        return "compositionRule";
    }
    this.FirstFeature = _firstFeature;
    this.SecondFeature = _secondFeature;

    //Methods
    this.GetBusinessObject = function () {
        return _businessObject;
    }
    this.GetBusinessObjectCopy = function () {
        var copy = jQuery.extend(true, {}, _businessObject);
        return copy;
    }
    this.UpdateBusinessObject = function (modifiedBusinessObject) {
        _businessObject = modifiedBusinessObject;
    }
    this.GetField = function (fieldName) {
        return _businessObject[fieldName];
    }
    this.SetField = function (fieldName, value) {
        _businessObject[fieldName] = value;
    }
    this.SetDeleteFlag = function () {
        _businessObject["ToBeDeleted"] = true;
    }
    this.IsDeleted = function () {
        return _businessObject["ToBeDeleted"] == true;
    }
    this.SyncBusinessObject = function () {
        _businessObject.FirstFeatureID = this.FirstFeature.GetField("ID");
        _businessObject.SecondFeatureID = this.SecondFeature.GetField("ID");
    }
}
ClientObjects.CustomRule = function (businessObject) {

    //Fields
    var _guid = null;
    var _businessObject = businessObject;

    //Properties
    this.GUID = _guid;
    this.GetType = function () {
        return "customRule";
    }

    //Methods
    this.GetBusinessObject = function () {
        return _businessObject;
    }
    this.GetBusinessObjectCopy = function () {
        var copy = jQuery.extend(true, {}, _businessObject);
        return copy;
    }
    this.UpdateBusinessObject = function (modifiedBusinessObject) {
        _businessObject = modifiedBusinessObject;
    }
    this.GetField = function (fieldName) {
        return _businessObject[fieldName];
    }
    this.SetField = function (fieldName, value) {
        _businessObject[fieldName] = value;
    }
    this.SetDeleteFlag = function () {
        _businessObject["ToBeDeleted"] = true;
    }
    this.IsDeleted = function () {
        return _businessObject["ToBeDeleted"] == true;
    }
    this.SyncBusinessObject = function () {
    }
}
//****************************************************************************************************************
//Operations******************************************************************************************************
var Operation = function (operationType, guid, clientObjectType, data) {

    //Fields
    var _operationType = operationType;
    var _guid = guid;
    var _clientObjectType = clientObjectType;
    var _data = data;

    //Properties
    this.OperationType = _operationType;
    this.GUID = _guid;
    this.ClientObjectType = _clientObjectType;
    this.Data = _data;

}
var OperationTypes = {
    Create: null,
    Update: null,
    Delete: null
}
//****************************************************************************************************************

var DiagramDataModel = function (modelID, modelName) {

    //Variables
    var _GUIDCounter = 0;
    var _clientObjects = {
        all: {},
        features: {},
        attributes: {},
        relations: {},
        groupRelations: {},
        compositionRules: {},
        customRules: {}
    }
    var _modelID = modelID, _model = null, _modelName = modelName;
    var _operationsQueue = [];
    var _unsavedData = {
        features: {},
        attributes: {},
        relations: {},
        groupRelations: {},
        compositionRules: {},
        customRules: {}
    };
    var _thisDiagramDataModel = this;

    //Properties
    this.ClientObjects = _clientObjects;
    this.ModelID = _modelID;

    //Private methods
    var getDefaultBusinessObject = function (type) {
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
    var registerOperation = function (operation) {

        //
        _operationsQueue.push(operation);
        registerUnsavedData(operation.GUID);
    }
    var registerUnsavedData = function (guid) {

        //
        var clientObject = _clientObjects.all[guid];
        var type = clientObject.GetType();

        //ClientObject hasn't been modified before
        if (_unsavedData[type + "s"][guid] == undefined) {
            _unsavedData[type + "s"][guid] = 1;
        }
        //ClientObject already been modified by other operations
        else {
            _unsavedData[type + "s"][guid]++;
        }

    }

    //Constructor/Initalizers
    this.Initialize = function () {

        //Set internal eventhandlers
        _thisDiagramDataModel.ClientObjectCreated.Add(new EventHandler(onInternalClientObjectCreated));
        _thisDiagramDataModel.ClientObjectUpdated.Add(new EventHandler(onInternalClientObjectUpdated));
        _thisDiagramDataModel.ClientObjectDeleted.Add(new EventHandler(onInternalClientObjectDeleted));
    }

    //Public methods
    this.LoadData = function (onFinished) {
        $.ajax({
            type: "POST",
            url: "/ModelEditor/LoadData",
            data: JSON.stringify({ modelID: _modelID }),
            async: false,
            success: function (response) {

                _model = response;

                //Load Features
                for (var i = 0; i < _model.Features.length; i++) {

                    //Variables
                    var feature = _model.Features[i];

                    //Create a new ClientDataObject
                    var featureClientObject = new ClientObjects.Feature(feature);
                    _thisDiagramDataModel.RegisterClientObject(featureClientObject);

                    //Load Attributes----------------------------------------------------------------------------------------
                    for (var j = 0; j < feature.Attributes.length; j++) {
                        var attribute = feature.Attributes[j];
                        var attributeClientObject = new ClientObjects.Attribute(attribute);
                        _thisDiagramDataModel.RegisterClientObject(attributeClientObject);

                        //Set references
                        featureClientObject.Attributes.push(attributeClientObject);
                        attributeClientObject.Feature = featureClientObject;
                    }
                    //-------------------------------------------------------------------------------------------------------
                }

                //Load Relations
                for (var i = 0; i < _model.Relations.length; i++) {

                    //Variables
                    var relation = _model.Relations[i];

                    //Create a new ClientDataObject
                    var relationClientObject = new ClientObjects.Relation(relation);
                    _thisDiagramDataModel.RegisterClientObject(relationClientObject);

                    //Set references-----------------------------------------------------------------------------------------
                    relationClientObject.ParentFeature = _thisDiagramDataModel.GetByID(relation.ParentFeatureID, "feature");
                    relationClientObject.ChildFeature = _thisDiagramDataModel.GetByID(relation.ChildFeatureID, "feature");
                    //-------------------------------------------------------------------------------------------------------
                }

                //Load GroupRelations
                for (var i = 0; i < _model.GroupRelations.length; i++) {

                    //Variables
                    var groupRelation = _model.GroupRelations[i];

                    //Create a new ClientDataObject
                    var groupRelationClientObject = new ClientObjects.GroupRelation(groupRelation);
                    _thisDiagramDataModel.RegisterClientObject(groupRelationClientObject);

                    //Set references-----------------------------------------------------------------------------------------
                    groupRelationClientObject.ParentFeature = _thisDiagramDataModel.GetByID(groupRelation.ParentFeatureID, "feature");
                    for (var j = 0; j < groupRelation.ChildFeatureIDs.length; j++) {
                        groupRelationClientObject.ChildFeatures.push(_thisDiagramDataModel.GetByID(groupRelation.ChildFeatureIDs[j], "feature"));
                    }
                    //-------------------------------------------------------------------------------------------------------
                }

                //Load CompositionRules
                for (var i = 0; i < _model.CompositionRules.length; i++) {

                    //Variables
                    var compositionRule = _model.CompositionRules[i];

                    //Create a new ClientDataObject
                    var compositionRuleClientObject = new ClientObjects.CompositionRule(compositionRule);
                    _thisDiagramDataModel.RegisterClientObject(compositionRuleClientObject);

                    //Set references-----------------------------------------------------------------------------------------
                    compositionRuleClientObject.FirstFeature = _thisDiagramDataModel.GetByID(compositionRule.FirstFeatureID, "feature");
                    compositionRuleClientObject.SecondFeature = _thisDiagramDataModel.GetByID(compositionRule.SecondFeatureID, "feature");
                    //-------------------------------------------------------------------------------------------------------
                }

                //Load CustomRules
                for (var i = 0; i < _model.CustomRules.length; i++) {

                    //Variables
                    var customRule = _model.CustomRules[i];

                    //Create a new ClientDataObject
                    var customRuleClientObject = new ClientObjects.CustomRule(customRule);
                    _thisDiagramDataModel.RegisterClientObject(customRuleClientObject);
                }


            },
            error: function (req, status, error) {
                alert("error");
            }
        });

        //Raise events
        _thisDiagramDataModel.ClientObjectsLoaded.RaiseEvent();

        //CallBack
        onFinished(_model);
    }
    this.SaveData = function (newName, beforeSend, onSuccess, onError) {

        beforeSend();
        $.timer(300, function () {

            //Variables
            var error = false, success = true;
            _modelName = newName;

            //Save the name
            $.ajax({
                type: "POST",
                url: "/ModelEditor/SaveModel",
                data: JSON.stringify({ modelID: _modelID, modelName: newName }),
                async: true
            });

            //Go through all of the clientObjects in _unsavedData
            for (var objectType in _unsavedData) {
                var guidCollection = _unsavedData[objectType];
                var businessObjectsCollection = {};

                //Collect the businessObjects
                for (var guid in guidCollection) {
                    var clientObject = _clientObjects.all[guid];
                    clientObject.SyncBusinessObject();
                    businessObjectsCollection[guid] = clientObject.GetBusinessObjectCopy();
                }

                //Send data to WebService method
                if (Object.size(businessObjectsCollection) > 0) {
                    $.ajax({
                        type: "POST",
                        url: "/ModelEditor/SaveBusinessObjects",
                        data: JSON.stringify({ modelID: _modelID, businessObjectsString: JSON.stringify(businessObjectsCollection), businessObjectsType: objectType.substring(0, objectType.length - 1) }),
                        async: false,
                        success: function (response) {

                            //Get the list with updated business objects 
                            var updatedBusinessObjects = response;

                            //Loop through list
                            for (var guidKey in updatedBusinessObjects) {
                                var clientObject = _clientObjects.all[guidKey];

                                //Remove deleted items
                                if (clientObject.IsDeleted()) {
                                    delete _clientObjects.all[guidKey];
                                    delete _clientObjects[objectType][guidKey];
                                }
                                //Update others
                                else {
                                    clientObject.UpdateBusinessObject(updatedBusinessObjects[guidKey]);
                                }
                            }

                            //Clear _unsavedData collection
                            _unsavedData[objectType] = {};
                            success = true;
                        },
                        error: function (req, status, error) {
                            error = true;
                        }
                    });
                }
            }


            //Callbacks
            if (error) {
                onError();
            } else if (success) {
                onSuccess();
            }

        });
    }

    this.AddNewClientObject = function (type, initialBusinessValues, initialClientValues) {

        //Setup inner business object
        var newBusinessObject = getDefaultBusinessObject(type);
        if (initialBusinessValues != undefined && initialBusinessValues != null) {
            for (var fieldName in initialBusinessValues) {
                var fieldValue = initialBusinessValues[fieldName];
                newBusinessObject[fieldName] = fieldValue;
            }
        }

        //Setup client object
        var newClientObject = null;
        switch (type) {
            case "feature":
                newClientObject = new ClientObjects.Feature(newBusinessObject);
                break;
            case "attribute":
                newClientObject = new ClientObjects.Attribute(newBusinessObject);
                break;
            case "relation":
                newClientObject = new ClientObjects.Relation(newBusinessObject);
                break;
            case "groupRelation":
                newClientObject = new ClientObjects.GroupRelation(newBusinessObject);
                break;
            case "compositionRule":
                newClientObject = new ClientObjects.CompositionRule(newBusinessObject);
                break;
            case "customRule":
                newClientObject = new ClientObjects.CustomRule(newBusinessObject);
                break;
        }
        if (initialClientValues != undefined && initialClientValues != null) {
            for (var fieldName in initialClientValues) {
                var fieldValue = initialClientValues[fieldName];
                newClientObject[fieldName] = fieldValue;
            }
        }

        //Register the object
        _thisDiagramDataModel.RegisterClientObject(newClientObject);

        //Raise events
        _thisDiagramDataModel.ClientObjectCreated.RaiseEvent(newClientObject.GUID);

        return newClientObject;
    }
    this.RegisterClientObject = function (clientObject) {
        if (clientObject.GUID == null) {

            //Create a new GUID
            var guid = _GUIDCounter++;
            var type = clientObject.GetType();
            clientObject.GUID = guid;

            //Save references to it
            _clientObjects.all[clientObject.GUID] = clientObject;
            _clientObjects[type + "s"][clientObject.GUID] = clientObject;

            //
            return guid;
        } else {
            //If the clientObject already has a GUID, return it
            return clientObject.GUID;
        }
    }
    this.DeleteClientObject = function (guid) {
        if (_clientObjects.all[guid].IsDeleted() == false) {

            //Set delete flag
            _clientObjects.all[guid].SetDeleteFlag();

            //Raise events
            _thisDiagramDataModel.ClientObjectDeleted.RaiseEvent(guid);
        }
    }
    this.UpdateClientObject = function (guid, modifiedBusinessObject) {

        //Update the whole businessObject
        _clientObjects.all[guid].UpdateBusinessObject(modifiedBusinessObject);

        //Raise events
        _thisDiagramDataModel.ClientObjectUpdated.RaiseEvent(guid);
    }
    this.UpdateClientObjectFields = function (guid, fieldNames, values) {

        //
        for (var i = 0; i < fieldNames.length; i++) {
            _clientObjects.all[guid].SetField(fieldNames[i], values[i]);
        }

        //Raise events
        _thisDiagramDataModel.ClientObjectUpdated.RaiseEvent(guid);
    }

    this.GetByGUID = function (guid) {
        return _clientObjects.all[guid];
    }
    this.GetByID = function (ID, type) {
        for (var guidKey in _clientObjects[type + "s"]) {
            var clientObject = _clientObjects[type + "s"][guidKey];
            if (ID == clientObject.GetField("ID")) {
                return clientObject;
            }
        }
    }
    this.GetClientObjectField = function (guid, fieldName) {
        return _clientObjects.all[guid].GetField(fieldName);
    }
    this.GetDefaultObject = function (type) {
        return getDefaultBusinessObject(type);
    }

    //Events
    this.ClientObjectsLoaded = new Event();
    this.ClientObjectCreated = new Event();
    this.ClientObjectUpdated = new Event();
    this.ClientObjectDeleted = new Event();

    //Internal handlers
    var onInternalClientObjectCreated = function (guid) {

        //Variables
        var clientObject = _clientObjects.all[guid];
        var data = clientObject.GetBusinessObjectCopy();

        //Register a new operation
        var operation = new Operation(OperationTypes.Create, guid, clientObject.GetType(), data);
        registerOperation(operation);
    }
    var onInternalClientObjectUpdated = function (guid) {

        //Variables
        var clientObject = _clientObjects.all[guid];
        var data = clientObject.GetBusinessObjectCopy();

        //Register a new operation
        var operation = new Operation(OperationTypes.Update, guid, clientObject.GetType(), data);
        registerOperation(operation);
    }
    var onInternalClientObjectDeleted = function (guid) {

        //Variables
        var clientObject = _clientObjects.all[guid];
        clientObject.SetDeleteFlag();

        //Register a new operation
        var operation = new Operation(OperationTypes.Delete, guid, clientObject.GetType());
        registerOperation(operation);
    }
}
var ClientController = function (diagramContainer, propertiesContainer, explorerContainer, modelNameTextbox, zoomLevelIndicator, diagramDataModelInstance) {

    //Fields and variables
    var _diagramDataModel = diagramDataModelInstance;
    var _diagramContext, _propertiesComponent, _modelExplorer;
    var _modelNameTextbox = modelNameTextbox, _scaleModifierIndicator = zoomLevelIndicator;
    var _thisClientController = this;
    var _currentControlFocus = null; //variable to keep track of where the user executed the last action (clicking)

    //Constructor/Initalizers
    this.Initialize = function () {

        $("#ModelDiagramBox").block({ message: "Loading diagram...", fadeIn: 300 });
        $.timer(300, function () {

            //Instantiate/Initialize controls
            _diagramContext = new DiagramContext(diagramContainer, _diagramDataModel);
            _diagramContext.Initialize();
            _propertiesComponent = new PropertiesComponent(propertiesContainer, _diagramDataModel);
            _propertiesComponent.Initialize();
            _modelExplorer = new ModelExplorer(explorerContainer, _diagramDataModel);
            _modelExplorer.Initialize();

            //Modelexplorer eventhandlers
            _diagramContext.ElementSelectToggled.Add(new EventHandler(_modelExplorer.OnRelatedViewElementSelectToggled));
            _diagramContext.SelectionCleared.Add(new EventHandler(_modelExplorer.OnRelatedViewSelectionCleared));
            _diagramDataModel.ClientObjectsLoaded.Add(new EventHandler(_modelExplorer.OnClientObjectsLoaded));
            _diagramDataModel.ClientObjectCreated.Add(new EventHandler(_modelExplorer.OnClientObjectCreated));
            _diagramDataModel.ClientObjectUpdated.Add(new EventHandler(_modelExplorer.OnClientObjectUpdated));
            _diagramDataModel.ClientObjectDeleted.Add(new EventHandler(_modelExplorer.OnClientObjectDeleted));

            //DiagramContext eventhandlers
            _modelExplorer.ElementSelectToggled.Add(new EventHandler(_diagramContext.OnRelatedViewElementSelectToggled));
            _modelExplorer.SelectionCleared.Add(new EventHandler(_diagramContext.OnRelatedViewSelectionCleared));
            _diagramDataModel.ClientObjectsLoaded.Add(new EventHandler(_diagramContext.OnClientObjectsLoaded));
            _diagramDataModel.ClientObjectCreated.Add(new EventHandler(_diagramContext.OnClientObjectCreated));
            _diagramDataModel.ClientObjectUpdated.Add(new EventHandler(_diagramContext.OnClientObjectUpdated));
            _diagramDataModel.ClientObjectDeleted.Add(new EventHandler(_diagramContext.OnClientObjectDeleted));

            //PropertiesComponent eventhandlers
            _diagramContext.ElementSelectToggled.Add(new EventHandler(_propertiesComponent.OnRelatedViewElementSelectToggled));
            _modelExplorer.ElementSelectToggled.Add(new EventHandler(_propertiesComponent.OnRelatedViewElementSelectToggled));
            _modelExplorer.SelectionCleared.Add(new EventHandler(_propertiesComponent.OnRelatedViewSelectionCleared));
            _diagramContext.SelectionCleared.Add(new EventHandler(_propertiesComponent.OnRelatedViewSelectionCleared));
            _diagramDataModel.ClientObjectUpdated.Add(new EventHandler(_propertiesComponent.OnClientObjectUpdated));
            _diagramDataModel.ClientObjectDeleted.Add(new EventHandler(_propertiesComponent.OnClientObjectDeleted));

            // Button change handlers
            _diagramContext.InnerModeChange.Add(new EventHandler(function (mode) {
                // Reset states
                $("#NewRelationButton").removeClass('Button-Normal-Focus');
                $("#NewGroupRelationButton").removeClass('Button-Normal-Focus');
                $("#NewCompositionRuleButton").removeClass('Button-Normal-Focus');
                $("#SVGCanvas").css("cursor", "auto");
                switch (mode) {
                    case innerState.featureLock:
                        $("#SVGCanvas").css("cursor", "crosshair");
                        break;
                    case innerState.relationLock:
                        $("#SVGCanvas").css("cursor", "crosshair");
                        $("#NewRelationButton").addClass('Button-Normal-Focus');
                        break;
                    case innerState.groupRelationLock:
                        $("#SVGCanvas").css("cursor", "crosshair");
                        $("#NewGroupRelationButton").addClass('Button-Normal-Focus');
                        break;
                    case innerState.compositionRuleLock:
                        $("#SVGCanvas").css("cursor", "crosshair");
                        $("#NewCompositionRuleButton").addClass('Button-Normal-Focus');
                        break;
                }
            }));

            // Key handlers
            $("body").bind("keyup", function (e) {
                if (e.which === 27) {
                    _diagramContext.ResetInnerState();
                }
            });

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
            _propertiesComponent.Focus.Add(new EventHandler(function () {
                if (_currentControlFocus != _propertiesComponent) {
                    _currentControlFocus = _propertiesComponent;
                }
            }));
            $(_modelNameTextbox).bind("focus", function () {
                if (_currentControlFocus != _modelNameTextbox) {
                    _currentControlFocus = _modelNameTextbox;
                }
            });

            //Load the model
            _diagramDataModel.LoadData(function (model) {
                $(_modelNameTextbox).val(model.Name);
                $("#ModelDiagramBox").unblock();
            });
        });
    }

    //Public methods
    this.SaveData = function () {
        var newName = $(_modelNameTextbox).val();
        _diagramDataModel.SaveData(newName, function () {
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
        var initialValues = {
            ModelID: _diagramDataModel.ModelID
        }
        var clientCustomRuleObject = _diagramDataModel.AddNewClientObject("customRule", initialValues);
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
    this.ZoomOut = function () {
        var newZoomLevel = _diagramContext.ZoomOut();
        $(_scaleModifierIndicator).text(newZoomLevel * 100 + "%");
    }
    this.ZoomIn = function () {
        var newZoomLevel = _diagramContext.ZoomIn();
        $(_scaleModifierIndicator).text(newZoomLevel * 100 + "%");
    }
    this.ToggleOrientation = function () {
        _diagramContext.ToggleOrientation();
    }
}
var PropertiesComponent = function (container, diagramDataModelInstance) {

    //Defaults and settings
    var Controls = {
        Textbox: null,
        Textarea: null,
        Checkbox: null,
        Dropdown: null,
        CompositeList: null
    }
    Controls.Textbox = function (fieldParent, settingsField, saveDataFunction) {

        //Fields
        var _control = null;
        var _fieldParent = fieldParent;
        var _fieldName = settingsField.dataName, _changedCallback = settingsField.onDataFieldChanged, _loadedCallback = settingsField.onDataFieldLoaded;
        var _settingsField = settingsField;

        //Public methods
        this.CreateHTML = function () {

            //Create control
            _control = $("<input class='Textbox' type='text' />");
            _control.bind("change", onChanged).bind("keypress", onEnterPressed);
            _control.attr("fieldName", _fieldName);

            //Disabled
            if (_settingsField.disabled)
                _control.attr("disabled", "disabled");

            //
            return _control;
        }
        this.LoadData = function () {
            var value = _fieldParent[_fieldName];
            _control.val(value);
        }
        this.CallOnDataFieldLoaded = function () {
            if (_loadedCallback != undefined) {
                _loadedCallback(_fieldParent[_fieldName], _control);
            }
        }

        //Event handlers
        var onChanged = function () {

            //Variables
            var newVal = _control.val();
            var oldVal = _fieldParent[_fieldName];

            //Perform validation
            var valid = true;
            if (settingsField.validation != undefined) {

                //Loop through validations
                for (var i = 0; i < settingsField.validation.length; i++) {
                    var validationEntry = settingsField.validation[i];
                    if (typeof (validationEntry) == "function") {
                        valid = validationEntry(newVal, oldVal, _control); //call custom validation function
                    } else if (typeof (validationEntry) == "string") {
                        valid = new RegExp(validationEntry).test(newVal);
                    }
                    if (valid == false)
                        break;
                }
            }

            //Validation ok
            if (valid == true) {

                //Set value and call handlers
                _control.removeAttr("invalid");
                _fieldParent[_fieldName] = newVal;
                if (_changedCallback != undefined) {
                    _changedCallback(newVal, oldVal, _control);
                }
                saveDataFunction(_fieldName);
            }
            //Validation failed
            else {
                _control.attr("invalid", "true");
            }
        }
        var onEnterPressed = function (e) {
            if (e.which == 13) {
                onChanged();
            }
        }
    }
    Controls.Textarea = function (fieldParent, settingsField, saveDataFunction) {

        //Fields
        var _control = null;
        var _fieldParent = fieldParent;
        var _fieldName = settingsField.dataName, _changedCallback = settingsField.onDataFieldChanged, _loadedCallback = settingsField.onDataFieldLoaded;
        var _settingsField = settingsField;

        //Public methods
        this.CreateHTML = function () {

            //Create control
            _control = $("<textarea class='Textarea'></textarea>");
            _control.bind("change", onChanged);
            _control.attr("fieldName", _fieldName);

            //Disabled
            if (_settingsField.disabled)
                _control.attr("disabled", "disabled");

            //
            return _control;
        }
        this.LoadData = function () {
            var value = _fieldParent[_fieldName];
            _control.val(value);

            $(_control).autoGrow();
        }
        this.CallOnDataFieldLoaded = function () {
            if (_loadedCallback != undefined) {
                _loadedCallback(_fieldParent[_fieldName], _control);
            }
        }

        //Event handlers
        var onChanged = function () {

            //Variables
            var newVal = _control.val();
            var oldVal = _fieldParent[_fieldName];

            //Perform validation
            var valid = true;
            if (settingsField.validation != undefined) {

                //Loop through validations
                for (var i = 0; i < settingsField.validation.length; i++) {
                    var validationEntry = settingsField.validation[i];
                    if (typeof (validationEntry) == "function") {
                        valid = validationEntry(newVal, oldVal, _control); //call custom validation function
                    } else if (typeof (validationEntry) == "string") {
                        valid = new RegExp(validationEntry).test(newVal);
                    }
                    if (valid == false)
                        break;
                }
            }

            //Validation ok
            if (valid == true) {

                //Set value and call handlers
                _control.removeAttr("invalid");
                _fieldParent[_fieldName] = newVal;
                if (_changedCallback != undefined) {
                    _changedCallback(newVal, oldVal, _control);
                }
                saveDataFunction(_fieldName);
            }
            //Validation failed
            else {
                _control.attr("invalid", "true");
            }
        }
    }
    Controls.Checkbox = function (fieldParent, settingsField, saveDataFunction) {

        //Fields
        var _control = null;
        var _fieldParent = fieldParent;
        var _fieldName = settingsField.dataName, _changedCallback = settingsField.onDataFieldChanged, _loadedCallback = settingsField.onDataFieldLoaded;
        var _settingsField = settingsField;

        //Public methods
        this.CreateHTML = function () {

            //Create control
            _control = $("<input class='Checkbox' type='checkbox' />");
            _control.bind("change", onChanged);
            _control.attr("fieldName", _fieldName);

            //Disabled
            if (_settingsField.disabled)
                _control.attr("disabled", "disabled");

            //
            return _control;
        }
        this.LoadData = function () {
            var value = _fieldParent[_fieldName];
            _control.attr("checked", value);
        }
        this.CallOnDataFieldLoaded = function () {
            if (_loadedCallback != undefined) {
                _loadedCallback(_fieldParent[_fieldName], _control);
            }
        }

        //Event handlers
        var onChanged = function () {
            //
            var newVal = _control.attr("checked");
            var oldVal = _fieldParent[_fieldName];
            _fieldParent[_fieldName] = newVal;

            //Call handlers
            if (_changedCallback != undefined) {
                _changedCallback(newVal, oldVal, _control);
            }
            saveDataFunction(_fieldName);
        }
    }
    Controls.Dropdown = function (fieldParent, settingsField, saveDataFunction) {

        //Fields
        var _control = null;
        var _fieldParent = fieldParent;
        var _fieldName = settingsField.dataName, _changedCallback = settingsField.onDataFieldChanged, _loadedCallback = settingsField.onDataFieldLoaded;
        var _settingsField = settingsField;

        //Public methods
        this.CreateHTML = function () {

            //Create control
            _control = $("<select class='Dropdown' />");
            _control.bind("change", onChanged);
            _control.attr("fieldName", _fieldName);

            //Disabled
            if (_settingsField.disabled)
                _control.attr("disabled", "disabled");

            //
            return _control;
        }
        this.LoadData = function () {

            //Create default options
            if (settingsField.defaultOptions != undefined) {
                for (var key in settingsField.defaultOptions) {
                    var enumEntry = settingsField.defaultOptions[key];
                    var option = $("<option value='" + enumEntry.id + "'>" + enumEntry.label + "</option>").appendTo(_control);
                }
            }

            //
            var value = _fieldParent[_fieldName];
            _control.val(value);
        }
        this.CallOnDataFieldLoaded = function () {
            if (_loadedCallback != undefined) {
                _loadedCallback(_fieldParent[_fieldName], _control);
            }
        }

        //Event handlers
        var onChanged = function () {
            //
            var newVal = $(_control).find("option:selected").attr("value");
            var oldVal = _fieldParent[_fieldName];
            _fieldParent[_fieldName] = newVal;

            //Call handlers
            if (_changedCallback != undefined) {
                _changedCallback(newVal, oldVal, _control);
            }
            saveDataFunction(_fieldName);
        }
    }
    Controls.CompositeList = function (fieldParent, settingsField, saveDataFunction) {

        //Inner classes
        var ListElement = function (clientObject, onListElementDeleted, onListElementClicked) {

            //Fields
            var _innerControl = null, _controlLabel = null;
            var _businessObject = clientObject.GetBusinessObject();
            var _clientObject = clientObject;
            var _selected = false;
            var _thisListElement = this;

            //Methods
            this.CreateHTML = function () {

                _innerControl = $("<div class='ListElement'></div>");
                _innerControl.bind("click", function () {
                    onListElementClicked(_thisListElement.GetIndex());

                });
                _controlLabel = $("<span class='Label-Small'>" + _businessObject.Name + "</span>").appendTo(_innerControl);
                var deleteButton = $("<div id='DeleteButton' class='IconButton-Simple'></div>").append("<img src='../../Content/themes/base/images/Icons/Delete.png' />").appendTo(_innerControl);
                deleteButton.bind("click", function () {
                    var index = _thisListElement.GetIndex();
                    onListElementDeleted($(_innerControl), index);
                });

                return _innerControl;
            }
            this.RefreshLabel = function () {
                _controlLabel.text(_businessObject.Name);
            }
            this.GetClientObject = function () {
                return _clientObject;
            }
            this.GetControl = function () {
                return _innerControl;
            }
            this.GetIndex = function () {
                var index = $(_listContainer).find(".ListElement").index($(_innerControl));
                return index;
            }
            this.SetSelectedState = function (newState) {
                _selected = newState;
                if (newState == true && !_innerControl.hasClass("Selected")) {
                    _innerControl.addClass("Selected");
                } else {
                    _innerControl.removeClass("Selected");
                }
            }
            this.IsSelected = function () {
                return _selected == true;
            }
        }

        //Fields
        var _control = null;
        var _listElements = [];
        var _fieldParent = fieldParent;
        var _fieldName = settingsField.dataName, _changedCallback = settingsField.onDataFieldChanged, _loadedCallback = settingsField.onDataFieldLoaded;
        var _settingsField = settingsField;
        var _listContainer = null, _detailsContainer = null;

        //Private methods
        var addListElement = function (clientObject) {

            //Create the ListElement
            var listElement = new ListElement(clientObject, onListElementDeleted, onListElementClicked);
            _listElements.push(listElement);

            //Create the HTML
            var listElementControl = listElement.CreateHTML();
            $(listElementControl).appendTo(_listContainer);

            //
            return listElement;
        }
        var deselectAll = function () {
            for (var i = 0; i < _listElements.length; i++) {
                _listElements[i].SetSelectedState(false);
            }
        }
        var toggleSelected = function (listElement) {

            //Deselect if already selected
            if (listElement.IsSelected()) {
                deselectAll();
                clearListElementData();
                return false;
            }
            //Select if not selected
            else {
                deselectAll();
                listElement.SetSelectedState(true);
                return true;
            }
        }
        var loadListElementData = function (index) {

            //Variables
            var subControlInstances = []
            var clientObject = _listElements[index].GetClientObject();
            var businessObject = clientObject.GetBusinessObject();

            //Clear and show the detailsContainer
            $(_detailsContainer).find("tbody").html("");
            $(_detailsContainer).css("display", "block")

            //Loop through subFields
            for (var subFieldKey in settingsField.subFields) {
                var settingsSubField = settingsField.subFields[subFieldKey];

                //Create a subControl
                var onListElementDataChanged = function (fieldName) {
                    _diagramDataModel.UpdateClientObject(clientObject.GUID, businessObject);
                    _listElements[index].RefreshLabel();
                }
                var subControlInstance = new settingsSubField.controlType(businessObject, settingsSubField, onListElementDataChanged);
                var htmlSubControl = subControlInstance.CreateHTML();
                subControlInstance.LoadData();
                subControlInstances.push(subControlInstance);

                //Create a row
                var row = createControlTableRow(settingsSubField.label, htmlSubControl);
                row.appendTo($(_detailsContainer).find("tbody"));
            }

            //Rego through subControlInstances and call _loadedCallback handler
            for (var i = 0; i < subControlInstances.length; i++) {
                subControlInstances[i].CallOnDataFieldLoaded();
            }
        }
        var clearListElementData = function () {

            //Clear and hide the detailsContainer
            $(_detailsContainer).find("tbody").html("");
            $(_detailsContainer).css("display", "none");
        }

        //Public methods
        this.CreateHTML = function () {

            //Outer control
            var _control = $("<div class='CompositeList''></div>");
            _control.attr("fieldName", _fieldName);

            //List
            var listDiv = $("<div class='ListDiv'></div>").appendTo(_control);
            var listActionsDiv = $("<div class='ListActionsDiv'></div>").appendTo(listDiv);
            _listContainer = $("<div class='ListInnerContainer'></div>").appendTo(listDiv);

            //Add button
            var addButton = $("<div class='Button-Thin'></div>").append("<img src='../../Content/themes/base/images/Icons/Add.png' />").append("<span>Add new</span>").appendTo(listActionsDiv);
            addButton.bind("click", onAddButtonClick);

            //Details
            _detailsContainer = $("<div class='DetailsDiv'></div>").css("display", "none").appendTo(_control);
            var detailsInnerTableTbody = $("<table><tbody></tbody></table>").appendTo(_detailsContainer).find("tbody");

            //
            return _control;
        }
        this.LoadData = function () {

            //Create list elements
            var clientObjectCollection = _fieldParent[_fieldName];
            for (var i = 0; i < clientObjectCollection.length; i++) {
                addListElement(clientObjectCollection[i]);
            }
        }

        //Event handlers
        this.CallOnDataFieldLoaded = function () {
            if (_loadedCallback != undefined) {
                _loadedCallback(_fieldParent[_fieldName], _control);
            }
        }
        var onAddButtonClick = function () {

            //Create a new clientObject in the DataModel
            var initialClientValues = {};
            initialClientValues[settingsField.parentClientRefField] = fieldParent;
            var newClientObject = diagramDataModelInstance.AddNewClientObject(settingsField.clientObjectType, null, initialClientValues);
            fieldParent[_fieldName].push(newClientObject);

            //Create and add a new ListElement
            addListElement(newClientObject);
        }
        var onListElementDeleted = function (control, index) {

            //
            var guid = fieldParent[_fieldName][index].GUID;
            $(control).remove();
            if (_listElements[index].IsSelected())
                clearListElementData();
            _listElements.splice(index, 1);

            //Delete from DataModel and parent collection
            fieldParent[_fieldName].splice(index, 1);
            _diagramDataModel.DeleteClientObject(guid);

        }
        var onListElementClicked = function (index) {
            var newState = toggleSelected(_listElements[index]);
            if (newState == true) {
                loadListElementData(index);
                $(_detailsContainer).find("[fieldName='Name']").focus().select();
            }
        }

    }
    var supportedClientObjects = {
        feature: {
            areas: {
                basicArea: {
                    displayTitle: false,
                    tableLayout: true,
                    fields: {
                        /*rootFeature: {
                            label: "Root Feature",
                            dataName: "IsRoot",
                            controlType: Controls.Checkbox,
                            disabled: true
                        },*/ //Commented out, not necessary for now
                        identifier: {
                            label: "Identifier",
                            dataName: "Identifier",
                            controlType: Controls.Textbox
                        },
                        name: {
                            label: "Name",
                            dataName: "Name",
                            controlType: Controls.Textbox
                        },
                        description: {
                            label: "Description",
                            dataName: "Description",
                            controlType: Controls.Textarea
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
                            useClientObject: true,
                            clientObjectType: "attribute",
                            parentClientRefField: "Feature",
                            controlType: Controls.CompositeList,
                            subFields: {
                                identifier: {
                                    label: "Identifier",
                                    dataName: "Identifier",
                                    controlType: Controls.Textbox
                                },
                                name: {
                                    label: "Name",
                                    dataName: "Name",
                                    controlType: Controls.Textbox,
                                    defaultSelect: true
                                },
                                description: {
                                    label: "Description",
                                    dataName: "Description",
                                    controlType: Controls.Textarea
                                },
                                datatype: {
                                    label: "Data Type",
                                    dataName: "AttributeDataType",
                                    controlType: Controls.Dropdown,
                                    defaultOptions: systemDefaults.enums.attributeDataTypes
                                },
                                type: {
                                    label: "Attribute Type",
                                    dataName: "AttributeType",
                                    controlType: Controls.Dropdown,
                                    defaultOptions: systemDefaults.enums.attributeTypes,
                                    onDataFieldChanged: function (newVal, oldVal, control) {

                                        var constantValueField = $(control).parents(".DetailsDiv").find("[fieldName='ConstantValue']");
                                        var attributeType = getEnumEntryByID(systemDefaults.enums.attributeTypes, parseFloat(newVal));

                                        if (attributeType == systemDefaults.enums.attributeTypes.constant) {
                                            constantValueField.removeAttr("disabled");
                                            constantValueField.parent().parent().show();
                                        }
                                        else {
                                            constantValueField.attr("disabled", true);
                                            constantValueField.parent().parent().hide();
                                        }

                                    },
                                    onDataFieldLoaded: function (val, control) {
                                        var constantValueField = $(control).parents(".DetailsDiv").find("[fieldName='ConstantValue']");
                                        var attributeType = getEnumEntryByID(systemDefaults.enums.attributeTypes, parseFloat(val));

                                        if (attributeType != systemDefaults.enums.attributeTypes.constant) {
                                            constantValueField.attr("disabled", true);
                                            constantValueField.parent().parent().hide();
                                        }
                                    }
                                },
                                constantValue: {
                                    label: "ConstantVal",
                                    dataName: "ConstantValue",
                                    controlType: Controls.Textbox
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
                            controlType: Controls.Dropdown,
                            defaultOptions: systemDefaults.enums.relationTypes,
                            onDataFieldChanged: function (newVal, oldVal, control) {
                                var lowerBoundControl = $(control).parents(".AreaDiv").find("[fieldName='LowerBound']");
                                var upperBoundControl = $(control).parents(".AreaDiv").find("[fieldName='UpperBound']");
                                var relationType = getEnumEntryByID(systemDefaults.enums.relationTypes, parseFloat(newVal));

                                //
                                lowerBoundControl.val(relationType.bounds.defaultLowerBound).trigger("change");
                                upperBoundControl.val(relationType.bounds.defaultUpperBound).trigger("change");

                                if (relationType.bounds.editable == true) {
                                    lowerBoundControl.removeAttr("disabled");
                                    upperBoundControl.removeAttr("disabled");
                                }
                                else {
                                    lowerBoundControl.attr("disabled", "disabled");
                                    upperBoundControl.attr("disabled", "disabled");
                                }

                            },
                            onDataFieldLoaded: function (val, control) {
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
                            controlType: Controls.Textbox,
                            disabled: true
                        },
                        upperBound: {
                            label: "Upper bound",
                            dataName: "UpperBound",
                            controlType: Controls.Textbox,
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
                            controlType: Controls.Dropdown,
                            defaultOptions: systemDefaults.enums.groupRelationTypes,
                            onDataFieldChanged: function (newVal, oldVal, control) {

                                //Variables
                                var lowerBoundControl = $(control).parents(".AreaDiv").find("[fieldName='LowerBound']");
                                var upperBoundControl = $(control).parents(".AreaDiv").find("[fieldName='UpperBound']");
                                var groupRelationType = getEnumEntryByID(systemDefaults.enums.groupRelationTypes, parseFloat(newVal));
                                var lowerBound, upperBound;

                                //Get lower and upper bounds
                                lowerBound = groupRelationType.bounds.defaultLowerBound;
                                upperBound = groupRelationType.bounds.defaultUpperBound;
                                if (typeof upperBound === 'function') {
                                    upperBound = upperBound(_mainClientObject);
                                }

                                //Trigger onchange for controls so the BusinessObject is updated accordingly
                                lowerBoundControl.val(lowerBound).trigger("change");
                                upperBoundControl.val(upperBound).trigger("change");

                                //Disable
                                if (groupRelationType.bounds.editable == true) {
                                    lowerBoundControl.removeAttr("disabled");
                                    upperBoundControl.removeAttr("disabled");
                                }
                                else {
                                    lowerBoundControl.attr("disabled", "disabled");
                                    upperBoundControl.attr("disabled", "disabled");
                                }

                            },
                            onDataFieldLoaded: function (val, control) {

                                //Variables
                                var lowerBoundControl = $(control).parents(".AreaDiv").find("[fieldName='LowerBound']");
                                var upperBoundControl = $(control).parents(".AreaDiv").find("[fieldName='UpperBound']");
                                var groupRelationType = getEnumEntryByID(systemDefaults.enums.groupRelationTypes, parseFloat(val));
                                var lowerBound, upperBound;

                                //Get lower and upper bounds
                                lowerBound = groupRelationType.bounds.defaultLowerBound;
                                upperBound = groupRelationType.bounds.defaultUpperBound;
                                if (typeof upperBound === 'function') {
                                    upperBound = upperBound(_mainClientObject);
                                }

                                //Disable
                                if (groupRelationType.bounds.editable == true) {
                                    lowerBoundControl.removeAttr("disabled");
                                    upperBoundControl.removeAttr("disabled");

                                } else {
                                    lowerBoundControl.val(lowerBound);
                                    upperBoundControl.val(upperBound);
                                }
                            }
                        },
                        lowerBound: {
                            label: "Lower bound",
                            dataName: "LowerBound",
                            controlType: Controls.Textbox,
                            disabled: true,
                            validation: [systemDefaults.validationExpressions.numeric.naturalNumbers,
                                            function (newVal, oldVal, control) {

                                                //Variables 
                                                var isValid = true;
                                                var upperBoundControl = $(control).parents(".AreaDiv").find("[fieldName='UpperBound']");

                                                //Lowerbound cannot be greater than upperBound
                                                var upperBoundVal = $(upperBoundControl).val();
                                                if (newVal > upperBoundVal) {
                                                    return false;
                                                }

                                                //
                                                return isValid;

                                            } ]
                        },
                        upperBound: {
                            label: "Upper bound",
                            dataName: "UpperBound",
                            controlType: Controls.Textbox,
                            disabled: true,
                            validation: [systemDefaults.validationExpressions.numeric.naturalNumbers,
                                            function (newVal, oldVal, control) {

                                                //Variables 
                                                var isValid = true;
                                                var lowerBoundControl = $(control).parents(".AreaDiv").find("[fieldName='LowerBound']");
                                                var groupRelationTypeControl = $(control).parents(".AreaDiv").find("[fieldName='GroupRelationType']");
                                                var groupRelationType = getEnumEntryByID(systemDefaults.enums.groupRelationTypes, parseFloat(groupRelationTypeControl.val()));

                                                //Upperbound cannot be less than lowerBound
                                                var lowerBoundVal = $(lowerBoundControl).val();
                                                if (newVal < lowerBoundVal) {
                                                    return false;
                                                }

                                                //Upperbound cannot be greater than the defaultUpperBound
                                                var defaultUpperBound = groupRelationType.bounds.defaultUpperBound;
                                                if (typeof defaultUpperBound === 'function') {
                                                    defaultUpperBound = defaultUpperBound(_mainClientObject);
                                                }
                                                if (newVal > defaultUpperBound) {
                                                    return false;
                                                }

                                                //Upperbound cannot be 0
                                                if (newVal == 0) {
                                                    return false;
                                                }

                                                //
                                                return isValid;

                                            } ]
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
                            controlType: Controls.Textbox
                        },
                        description: {
                            label: "Description",
                            dataName: "Description",
                            controlType: Controls.Textarea
                        },
                        compositionRuleType: {
                            label: "Composition type",
                            dataName: "CompositionRuleType",
                            controlType: Controls.Dropdown,
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
                        identifier: {
                            label: "Identifier",
                            dataName: "Identifier",
                            controlType: Controls.Textbox
                        },
                        name: {
                            label: "Name",
                            dataName: "Name",
                            controlType: Controls.Textbox
                        },
                        description: {
                            label: "Description",
                            dataName: "Description",
                            controlType: Controls.Textarea
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
                            controlType: Controls.Textarea
                        }
                    }
                }
            }
        }
    };

    //Fields and variables
    var _container = container;
    var _diagramDataModel = diagramDataModelInstance;
    var _mainGUID = null, _mainClientObject = null, _mainClientObjectType = null, _mainBusinessObject = null;
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
    var loadData = function (guid) {

        //Variables
        clear();
        _mainGUID = guid;
        _mainClientObject = _diagramDataModel.GetByGUID(guid);
        _mainClientObjectType = _mainClientObject.GetType();
        _mainBusinessObject = _mainClientObject.GetBusinessObjectCopy();

        //Setup UI
        loadUI();
        $(_headerLabel).text("(" + _mainClientObjectType + ")");
    }
    var loadUI = function () {

        //Go through each Area
        var controlInstances = [];
        for (var areaKey in supportedClientObjects[_mainClientObjectType].areas) {

            //Create an html area
            var area = supportedClientObjects[_mainClientObjectType].areas[areaKey];
            var areaInnerContainer = createSectionArea(area.displayTitle, area.tableLayout);

            //Go through each field in the Area
            for (var fieldKey in area.fields) {
                var settingsField = area.fields[fieldKey];

                //Create a controlInstance
                var controlInstance = null;
                if (settingsField.useClientObject != true) {
                    controlInstance = new settingsField.controlType(_mainBusinessObject, settingsField, saveChangesToMainObject);
                } else {
                    controlInstance = new settingsField.controlType(_mainClientObject, settingsField, null);
                }
                var htmlControl = controlInstance.CreateHTML();
                controlInstance.LoadData();
                controlInstances.push(controlInstance);

                //Create the htmlControl and add it to the container
                if (area.tableLayout == true) {
                    var row = createControlTableRow(settingsField.label, htmlControl);
                    row.appendTo(areaInnerContainer);
                } else {
                    htmlControl.appendTo(areaInnerContainer);
                }
            }

            //Rego through controlInstances and call onDataFieldLoaded handler
            for (var i = 0; i < controlInstances.length; i++) {
                controlInstances[i].CallOnDataFieldLoaded();
            }
        }

        //Special hack
        $(_mainContainer).children(".AreaDiv:gt(0)").css("margin-top", "10px");
    }
    var clear = function () {

        //Reset variables
        _mainGUID = null;
        _mainBusinessObject = null;
        _currentClientObjectType = null;

        //Clear UI elements
        $(_mainContainer).html("");
        $(_headerLabel).text("");
    }

    //Events
    this.Focus = new Event();

    //Eventhandlers
    this.OnClientObjectUpdated = function (guid) {
        var type = _diagramDataModel.GetByGUID(guid).GetType();
        if (type == "feature") {
            loadData(guid);
        }
    }
    this.OnClientObjectDeleted = function (guid) {
        var type = _diagramDataModel.GetByGUID(guid).GetType();
        if (supportedClientObjects[type] != undefined) {
            clear();
        }
    }
    this.OnRelatedViewElementSelectToggled = function (guid, shift, newState) {
        if (newState == systemDefaults.uiElementStates.selected && shift == false) {
            loadData(guid);
        } else {
            clear();
        }
    }
    this.OnRelatedViewSelectionCleared = function () {
        clear();
    }
    var saveChangesToMainObject = function (fieldName) {
        _diagramDataModel.UpdateClientObject(_mainGUID, _mainBusinessObject);
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
    var addNewElement = function (guid) {

        //Variables
        var clientObject = _diagramDataModel.GetByGUID(guid);
        var name = clientObject.GetField("Name");
        var type = clientObject.GetType();

        //Add a new element to the tree
        var newDataRow = {
            ID: guid,
            Name: name,
            typeName: type
        };
        var parentNode = $(_tree).getNode(type + "sNode");
        var newNode = $(parentNode).addChildNode(newDataRow, true);
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
                _diagramDataModel.DeleteClientObject(nodeGuid);
            }
        }
    }

    //Sync with dataModel methods
    var addElement = function (guid) {

        //Variables
        var clientObject = _diagramDataModel.GetByGUID(guid);
        var name = clientObject.GetField("Name");
        var type = clientObject.GetType();

        //Add a new element to the tree
        var newDataRow = {
            ID: guid,
            Name: name,
            typeName: type
        };
        var parentNode = $(_tree).getNode(type + "sNode");
        var newNode = $(parentNode).addChildNode(newDataRow);

        return newNode;
    }
    var updateElement = function (guid) {
        //Variables
        var clientObject = _diagramDataModel.GetByGUID(guid);
        var name = clientObject.GetField("Name");

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
    this.OnClientObjectsLoaded = function () {
        for (var supportedType in _supportedTypes) {

            //Get clientObjects and sort them
            var sortedObjects = [];
            for (var guidKey in _diagramDataModel.ClientObjects[supportedType + "s"]) {
                var clientObject = _diagramDataModel.GetByGUID(guidKey);
                sortedObjects.push(clientObject);
            }
            sortedObjects.sort(function (a, b) {
                var aName = a.GetField("Name").toLowerCase();
                var bName = b.GetField("Name").toLowerCase();
                return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));

            });

            //Add client objects to tree
            for (var i = 0; i < sortedObjects.length; i++) {
                addElement(sortedObjects[i].GUID);
            }
        }
    }
    this.OnClientObjectCreated = function (guid) {
        var clientObject = _diagramDataModel.GetByGUID(guid);
        var type = clientObject.GetType();

        //
        if (_supportedTypes[type] != undefined) {
            var newNode = addNewElement(guid);
        }
    }
    this.OnClientObjectUpdated = function (guid) {
        var clientObject = _diagramDataModel.GetByGUID(guid);
        var type = clientObject.GetType();

        //
        if (_supportedTypes[type] != undefined) {
            updateElement(guid);
        }

    }
    this.OnClientObjectDeleted = function (guid) {
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
    var _innerMode = innerState.ready;
    var _scaleModifier = 1.00, _fixedOrientation = "vertical"; //determines orientation of diagram - options: horizontal / vertical / false (automatic - needs bug fixing to work properly)
    var _UIElements = {}; //dictionary to hold all UIElements (guid, UIElement)
    var _thisDiagramContext = this;
    var _supportedTypes = {
        feature: true,
        relation: true,
        groupRelation: true,
        compositionRule: true
    }
    // Keeps the generated events references
    var _wireframebox = null, _bulletWireframe = null;
    var _mousemoveHandler = null;
    var _clickHandler = null;
    var _hoverElement = null;

    //UIObjects & Defaults/Settings
    var UIFeature = function (clientObjectGUID, name, absoluteX, absoluteY) {

        //Fields
        var _outerElement = null, _glow = null;
        var _innerElements = {
            box: null,
            text: null
        };
        var _currentState = systemDefaults.uiElementStates.unselected;
        var _name = name;
        var _absolutePos = {
            x: absoluteX, y: absoluteY
        }
        var _screenPos = {
            x: absoluteX * _scaleModifier, y: absoluteY * _scaleModifier
        }
        var _originalBoxWidth = UIObjectStyles.feature.general.box.dimensions.width, _originalBoxHeight = UIObjectStyles.feature.general.box.dimensions.height;
        var _boxWidth = UIObjectStyles.feature.general.box.dimensions.width * _scaleModifier, _boxHeight = UIObjectStyles.feature.general.box.dimensions.height * _scaleModifier;
        var _relatedCompositeElements = [];
        var _thisUIFeature = this;

        //Properties
        this.GUID = clientObjectGUID;
        this.IsSelected = function () {
            return _currentState == systemDefaults.uiElementStates.selected;
        }
        this.GetType = function () {
            return "feature";
        }
        this.GetPos = function () {
            return { x: _absolutePos.x, y: _absolutePos.y };
        }
        this.InnerElements = _innerElements;
        this.RelatedCompositeElements = _relatedCompositeElements;

        //Private methods
        var makeSelectable = function () {

            //Selectable
            _outerElement.click(function (e) {
                if (_innerMode == innerState.relationLock) {
                    toggleElementSelect(_thisUIFeature, true, true);
                    createRelation();
                }
                else if (_innerMode == innerState.groupRelationLock) {
                    //                    toggleElementSelect(_thisUIFeature, true, true);
                    //                    createGroupRelation();
                }
                else if (_innerMode == innerState.compositionRuleLock) {
                    toggleElementSelect(_thisUIFeature, true, true);
                    createCompositionRule();
                }
                else {
                    toggleElementSelect(_thisUIFeature, e.shiftKey, true);
                }

            });

            //Hoverable
            _outerElement.mouseover(function (e) {
                if (_innerMode != innerState.dragging) {
                    if (_innerMode == innerState.relationLock ||
                        _innerMode == innerState.groupRelationLock ||
                        _innerMode == innerState.compositionRuleLock) {
                        _hoverElement = _thisUIFeature;
                    }

                    if (_glow == null) {
                        _innerElements.box.getBBox(); //hack fix for weird RaphaelJS bug
                        _glow = _innerElements.box.glow(commonStyles.glow.attr);
                    }
                }
            }).mouseout(function (e) {
                if (_innerMode != innerState.dragging) {
                    if ((_innerMode == innerState.relationLock ||
                        _innerMode == innerState.groupRelationLock ||
                        _innerMode == innerState.compositionRuleLock) &&
                        _hoverElement == _thisUIFeature) {
                        _hoverElement = null;
                    }

                    if (_innerMode != innerState.dragging) {
                        if (_glow != null) {
                            _glow.remove();
                            _glow = null;
                        }
                    }
                }
            });
        }
        var makeDraggable = function () {

            var wasMoved = false;

            //Drag and droppable
            var start = function () {
                // When in another mode, do not drag and drop
                if (_innerMode != innerState.ready && _innerMode != innerState.dragging)
                    return;

                _outerElement.originalx = _outerElement.attr("x");
                _outerElement.originaly = _outerElement.attr("y");

                for (var innerElemKey in _innerElements) {
                    var innerElem = _innerElements[innerElemKey];
                    innerElem.originalx = innerElem.attr("x");
                    innerElem.originaly = innerElem.attr("y");
                }
            };
            move = function (dx, dy) {
                // When in create-relation mode, do not drag and drop
                if (_innerMode != innerState.ready && _innerMode != innerState.dragging)
                    return;

                //Variables
                wasMoved = true;
                _innerMode = innerState.dragging;
                if (_glow != null) {
                    _glow.remove();
                    _glow = null;
                }

                //Update position
                _screenPos.x = (_outerElement.originalx + dx);
                _screenPos.y = (_outerElement.originaly + dy);
                _absolutePos.x = _screenPos.x / _scaleModifier;
                _absolutePos.y = _screenPos.y / _scaleModifier;
                _outerElement.attr({ x: _screenPos.x, y: _screenPos.y });

                //Move child elements
                for (var innerElemKey in _innerElements) {
                    var innerElem = _innerElements[innerElemKey];
                    innerElem.attr({ x: innerElem.originalx + dx, y: innerElem.originaly + dy });
                }

                //Notify related CompositeElements
                if (settings.diagramContext.dynamicRefresh == true) {
                    for (var j = 0; j < _relatedCompositeElements.length; j++) {
                        _relatedCompositeElements[j].OnAdjacentFeatureMoved(_thisUIFeature);
                    }
                }
            };
            up = function () {
                if (_innerMode != innerState.dragging)
                    return;

                if (wasMoved == true) {
                    //Variables
                    resetInnerMode();

                    //Update X and Y variables
                    internalUIFeatureMoved.RaiseEvent(_thisUIFeature);

                    //Notify related CompositeElements
                    if (settings.diagramContext.dynamicRefresh == false) {
                        for (var j = 0; j < _relatedCompositeElements.length; j++) {
                            _relatedCompositeElements[j].OnAdjacentFeatureMoved(_thisUIFeature);
                        }
                    }

                    // _thisUIFeature.RefreshGraphicalRepresentation();
                    wasMoved = false;
                }
            };
            _outerElement.drag(move, start, up);
        }
        var makeEditable = function () {
            _outerElement.dblclick(function (e) {
                _innerMode = innerState.inlineEdit;
                var bb1 = this.getBBox();
                var textinput = $("<input class='Inputbox' type='text' />").prependTo("#SVGCanvasWrapper").css({
                    position: "relative",
                    left: bb1.x + 3,
                    top: bb1.y + _boxHeight + 3,
                    width: _boxWidth - 10,
                    height: _boxHeight - 10,
                    float: "left",
                    marginTop: -_boxHeight,
                    zIndex: 999
                }).bind("change", function () {
                    //
                    var newName = $(this).val();
                    $(this).remove();
                    resetInnerMode();

                    //Update dataModel
                    _diagramDataModel.UpdateClientObjectFields(_thisUIFeature.GUID, ["Name"], [newName]);
                    _thisUIFeature.RefreshGraphicalRepresentation();
                }).bind("keypress", function (e) {
                    if (e.which == 13) { //Enter
                        //
                        var newName = $(this).val();
                        $(this).remove();
                        resetInnerMode();

                        //Update dataModel
                        _diagramDataModel.UpdateClientObjectFields(_thisUIFeature.GUID, ["Name"], [newName]);
                        _thisUIFeature.RefreshGraphicalRepresentation();
                    }
                    else if (e.which == 27) { //Escape
                        $(this).remove();
                        resetInnerMode();
                    }
                }).bind("blur", function (e) {
                    $(this).remove();
                    resetInnerMode();
                });
                $(textinput).val(_name).select();

                //Default select
                toggleElementSelect(_thisUIFeature, e.shiftKey, true);
            });
        }
        var refresh = function () {

            //
            _innerElements.box.attr({
                x: _screenPos.x,
                y: _screenPos.y,
                width: _boxWidth,
                height: _boxHeight
            });
            //
            _outerElement.attr({
                x: _screenPos.x,
                y: _screenPos.y,
                width: _boxWidth,
                height: _boxHeight
            });

            //
            _innerElements.text.attr({
                x: _boxWidth / 2 + _screenPos.x,
                y: _boxHeight / 2 + _screenPos.y,
                "font-size": parseFloat(UIObjectStyles.feature.general.text["font-size"]) * _scaleModifier
            });
        }
        var calculateVisibleText = function () {
            var textBBox = _innerElements.text.getBBox();
            if (textBBox.width > UIObjectStyles.feature.general.box.dimensions.maxWidth) {
                var txt = _name;
                while (textBBox.width > UIObjectStyles.feature.general.box.dimensions.maxWidth) {
                    txt = txt.replace(/\s*[a-z0-9]+(\.\.\.)?\s*$/gi, "...");
                    _innerElements.text.attr({
                        text: txt
                    });
                    textBBox = _innerElements.text.getBBox();
                }
            }
        }

        //Public methods
        this.CreateGraphicalRepresentation = function () {

            //Create inner elements            
            _innerElements.box = _canvas.rect(_screenPos.x, _screenPos.y, _boxWidth, _boxHeight, 0).attr(UIObjectStyles.feature.states[_currentState].box.attr);
            _innerElements.text = _canvas.text(_boxWidth / 2 + _screenPos.x, _boxHeight / 2 + _screenPos.y, _name).attr(UIObjectStyles.feature.states[_currentState].text.attr);
            _innerElements.text.attr({ "font-size": parseFloat(UIObjectStyles.feature.general.text["font-size"]) * _scaleModifier });

            // Fit the textbox
            var textBBox = _innerElements.text.getBBox();
            if (textBBox.width > UIObjectStyles.feature.general.box.dimensions.width) {
                calculateVisibleText();

                textBBox = _innerElements.text.getBBox();
                _absolutePos.x = textBBox.x;
                _originalBoxWidth = textBBox.width;
                _screenPos.x = _absolutePos.x * _scaleModifier;
                _screenPos.y = _absolutePos.y * _scaleModifier;
                _boxWidth = _originalBoxWidth * _scaleModifier;
                _boxHeight = _originalBoxHeight * _scaleModifier;

                _innerElements.box.attr({
                    x: _screenPos.x,
                    y: _screenPos.y,
                    width: _boxWidth,
                    height: _boxHeight
                });
            }

            //Create the main outer element
            _outerElement = _canvas.rect(_screenPos.x, _screenPos.y, _boxWidth, _boxHeight).attr(systemDefaults.common.outerElement.attr);

            //Setup 
            makeSelectable();
            makeDraggable();
            makeEditable();
        }
        this.RefreshGraphicalRepresentation = function () {

            // Fit the textbox
            var textBBox = _innerElements.text.getBBox();
            if (textBBox.width > UIObjectStyles.feature.general.box.dimensions.width) {
                // Check for text truncation
                calculateVisibleText();

                textBBox = _innerElements.text.getBBox();
                _absolutePos.x = textBBox.x;
                _originalBoxWidth = textBBox.width;
            }
            else {
                // Has to fix the x using the old width
                _absolutePos.x += (_originalBoxWidth - UIObjectStyles.feature.general.box.dimensions.width) / 2;
                _originalBoxWidth = UIObjectStyles.feature.general.box.dimensions.width;
            }

            // Rescale variables
            _screenPos.x = _absolutePos.x * _scaleModifier;
            _screenPos.y = _absolutePos.y * _scaleModifier;
            _boxWidth = _originalBoxWidth * _scaleModifier;
            _boxHeight = _originalBoxHeight * _scaleModifier;

            // Refresh the canvas
            refresh();
        }
        this.ReverseCoordinates = function () {

            //Reverse absolute position
            var holder = _absolutePos.x;
            _absolutePos.x = _absolutePos.y;
            _absolutePos.y = holder;

            //
            holder = _screenPos.x;
            _screenPos.x = _screenPos.y;
            _screenPos.y = holder;
        }
        this.ChangeState = function (state) {
            _currentState = state;
            _innerElements.box.attr(UIObjectStyles.feature.states[state].box.attr);
        }
        this.Update = function (newName) {
            // Set new name of feature
            _name = newName;

            _innerElements.text.attr({ text: newName });
            calculateVisibleText();
        }
        this.Delete = function () {
            if (_innerMode != innerState.inlineEdit) {

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
    var UIRelation = function (clientObjectGUID, relationType, lowerBound, upperBound, parentFeature, childFeature) { //CompositeElement

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
        this.GUID = clientObjectGUID;
        this.IsSelected = function () {
            return _currentState == systemDefaults.uiElementStates.selected;
        }
        this.GetDataObj = function () {
            return _dataObj;
        }
        this.GetType = function () {
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
                    if (_innerMode != innerState.dragging) {
                        _innerElements.connection.ShowGlow();
                    }
                },
                onMouseOut: function (e) {
                    if (_innerMode != innerState.dragging) {
                        _innerElements.connection.HideGlow();
                    }
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
            var cardinalityDistance = systemDefaults.orientations[_fixedOrientation].cardinalityDistances.relation;
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
            _innerElements.connection = new UIConnection(_thisUIRelation.GetType(), _thisUIRelation.GetSubTypeName(), parentFeature.InnerElements.box, childFeature.InnerElements.box);
            _innerElements.connection.CreateGraphicalRepresentation();

            //Add references
            parentFeature.RelatedCompositeElements.push(_thisUIRelation);
            childFeature.RelatedCompositeElements.push(_thisUIRelation);

            //Setup cardinality element
            toggleCardinalityElement();

            //Setup
            makeSelectable();
        }
        this.RefreshGraphicalRepresentation = function () {
            refresh();
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
    var UIGroupRelation = function (clientObjectGUID, groupRelationType, lowerBound, upperBound, parentFeature, childFeatures) { //CompositeElement

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
        this.GUID = clientObjectGUID;
        this.IsSelected = function () {
            return _currentState == systemDefaults.uiElementStates.selected;
        }
        this.GetType = function () {
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
                    if (_innerMode != innerState.dragging) {
                        for (var i = 0; i < _innerElements.connections.length; i++) {
                            _innerElements.connections[i].ShowGlow();
                        }
                    }
                },
                onMouseOut: function (e) {
                    if (_innerMode != innerState.dragging) {
                        for (var i = 0; i < _innerElements.connections.length; i++) {
                            _innerElements.connections[i].HideGlow();
                        }
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
            var pointA = firstConnection.InnerElements.line.getPointAtLength(UIObjectStyles.groupRelation.general.rootArc.dimensions.length * _scaleModifier);
            var pointB = lastConnection.InnerElements.line.getPointAtLength(UIObjectStyles.groupRelation.general.rootArc.dimensions.length * _scaleModifier);

            //Get arc modifiers
            var currentOrientation = _fixedOrientation;
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
            var cardinalityDistance = systemDefaults.orientations[_fixedOrientation].cardinalityDistances.groupRelation * _scaleModifier;
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
                    //only show for cardinal groups
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
                var newUIConnection = new UIConnection(_thisUIGroupRelation.GetType(), _thisUIGroupRelation.GetSubTypeName(), parentFeature.InnerElements.box, childFeatures[i].InnerElements.box);
                newUIConnection.CreateGraphicalRepresentation();
                _innerElements.connections.push(newUIConnection);

                //Add references
                childFeatures[i].RelatedCompositeElements.push(_thisUIGroupRelation);
                _featuresToConnections[childFeatures[i].GUID] = newUIConnection;
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
        this.RefreshGraphicalRepresentation = function () {
            refresh();
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
                var connection = _featuresToConnections[UIFeature.GUID];
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
            var connection = _featuresToConnections[UIFeature.GUID];
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
    var UICompositionRule = function (clientObjectGUID, compositionRuleType, firstFeature, secondFeature) {

        //Fields
        var _innerElements = {
            connection: null
        };
        var _currentState = systemDefaults.uiElementStates.unselected;
        var _compositionRuleType = compositionRuleType;
        var _thisUICompositionRule = this;

        //Properties
        this.GUID = clientObjectGUID;
        this.IsSelected = function () {
            return _currentState == systemDefaults.uiElementStates.selected;
        }
        this.GetType = function () {
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
                    if (_innerMode != innerState.dragging) {
                        _innerElements.connection.ShowGlow();
                    }
                },
                onMouseOut: function (e) {
                    if (_innerMode != innerState.dragging) {
                        _innerElements.connection.HideGlow();
                    }
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
            _innerElements.connection = new UIConnection(_thisUICompositionRule.GetType(), _thisUICompositionRule.GetSubTypeName(), firstFeature.InnerElements.box, secondFeature.InnerElements.box, true, true);
            _innerElements.connection.CreateGraphicalRepresentation();

            //Add references
            firstFeature.RelatedCompositeElements.push(_thisUICompositionRule);
            secondFeature.RelatedCompositeElements.push(_thisUICompositionRule);

            //Setup
            makeSelectable();
        }
        this.RefreshGraphicalRepresentation = function () {
            refresh();
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
            if (_fixedOrientation != false) {
                currentOrientation = _fixedOrientation; //use default fixed orientation without calculating angle
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
                closestConnection.x1 + closestConnection.curveModifier.x * _scaleModifier,
                closestConnection.y1 + closestConnection.curveModifier.y * _scaleModifier,
                closestConnection.x2 - closestConnection.curveModifier.x * _scaleModifier,
                closestConnection.y2 - closestConnection.curveModifier.y * _scaleModifier,
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

            //
            var xPos = _connectionElement.GetCurrentPath()[positionType].x - raphaelConnectorType.dimensionModifier * _scaleModifier, yPos = _connectionElement.GetCurrentPath()[positionType].y - raphaelConnectorType.dimensionModifier * _scaleModifier;
            _innerElements.raphaelElem.attr({ cx: xPos, cy: yPos, x: xPos, y: yPos });

            //
            var scaledDimensions = $.extend(true, {}, raphaelConnectorType.dimensions);
            for (var dimensionKey in scaledDimensions) {
                var originalValue = scaledDimensions[dimensionKey];
                scaledDimensions[dimensionKey] = originalValue * _scaleModifier;
            }
            _innerElements.raphaelElem.attr(scaledDimensions);
        }

        //Public methods
        this.CreateGraphicalRepresentation = function () {

            //Create raphaelElem
            var scaledDimensions = $.extend(true, {}, raphaelConnectorType.dimensions);
            for (var dimensionKey in scaledDimensions) {
                var originalValue = scaledDimensions[dimensionKey];
                scaledDimensions[dimensionKey] = originalValue * _scaleModifier;
            }

            var xPos = _connectionElement.GetCurrentPath()[positionType].x - raphaelConnectorType.dimensionModifier * _scaleModifier, yPos = _connectionElement.GetCurrentPath()[positionType].y - raphaelConnectorType.dimensionModifier * _scaleModifier; //position for endConnector
            _innerElements.raphaelElem = eval("_canvas." + raphaelConnectorType.raphaelType + "(xPos, yPos" + paramsToString(scaledDimensions) + ")");
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
        var _boxWidth = commonStyles.cardinalityLabel.box.dimensions.width * _scaleModifier, _boxHeight = commonStyles.cardinalityLabel.box.dimensions.height * _scaleModifier;
        var _thisUICardinalityLabel = this;

        //Properties
        this.InnerElements = _innerElements;

        //Private methods
        function refresh() {

            //Scale
            _boxWidth = commonStyles.cardinalityLabel.box.dimensions.width * _scaleModifier;
            _boxHeight = commonStyles.cardinalityLabel.box.dimensions.height * _scaleModifier
            _innerElements.box.attr({ width: _boxWidth, height: _boxHeight });
            _innerElements.text.attr({ "font-size": parseFloat(commonStyles.cardinalityLabel.text.attr["font-size"]) * _scaleModifier });

            //
            var labelPoint = calculatePositionFunction();
            _innerElements.box.attr({ x: labelPoint.x - _boxWidth / 2, y: labelPoint.y - _boxHeight / 2 });
            _innerElements.text.attr({ x: labelPoint.x, y: labelPoint.y });

        }

        //Public methods
        this.CreateGraphicalRepresentation = function () {

            //Create box and text
            var labelPoint = calculatePositionFunction();
            _innerElements.box = _canvas.rect(labelPoint.x - _boxWidth / 2, labelPoint.y - _boxHeight / 2, _boxWidth, _boxHeight, 0);
            _innerElements.box.attr(commonStyles.cardinalityLabel.box.attr);
            _innerElements.text = _canvas.text(labelPoint.x, labelPoint.y, "[" + _firstNumber + ".." + _secondNumber + "]");
            _innerElements.text.attr({ "font-size": parseFloat(commonStyles.cardinalityLabel.text.attr["font-size"]) * _scaleModifier });
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

    // Utilities
    // Reuse getPath method (copied from UIConnection methods)
    var getPathFromFeatureToPoint = function (objA, x, y) {

        //Variables
        var bb1 = objA.getBBox();
        var bb2 = { x: x, y: y, width: 0, height: 0 };
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
        if (_fixedOrientation != false) {
            currentOrientation = _fixedOrientation; //use default fixed orientation without calculating angle
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
                            closestConnection.x1 + closestConnection.curveModifier.x * _scaleModifier,
                            closestConnection.y1 + closestConnection.curveModifier.y * _scaleModifier,
                            closestConnection.x2 - closestConnection.curveModifier.x * _scaleModifier,
                            closestConnection.y2 - closestConnection.curveModifier.y * _scaleModifier,
                            closestConnection.x2.toFixed(1), closestConnection.y2.toFixed(1)]];
        } else {
            path = ["M", closestConnection.x1.toFixed(3), closestConnection.y1.toFixed(3), "L", closestConnection.x2.toFixed(3), closestConnection.y2.toFixed(3)].join(","); //line
        }

        var returnObj = {
            path: path,
            startObj: objA,
            //endObj: objB,
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
    var getPathBetweenFeatures = function (objA, objB) {

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
        if (_fixedOrientation != false) {
            currentOrientation = _fixedOrientation; //use default fixed orientation without calculating angle
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
                closestConnection.x1 + closestConnection.curveModifier.x * _scaleModifier,
                closestConnection.y1 + closestConnection.curveModifier.y * _scaleModifier,
                closestConnection.x2 - closestConnection.curveModifier.x * _scaleModifier,
                closestConnection.y2 - closestConnection.curveModifier.y * _scaleModifier,
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
    var resetInnerMode = function () {
        if (_clickHandler)
            $(_canvasContainer).unbind("click", _clickHandler);
        if (_mousemoveHandler)
            $(_canvasContainer).unbind("mousemove", _mousemoveHandler);
        if (_wireframebox)
            _wireframebox.remove();
        if (_bulletWireframe)
            _bulletWireframe.remove();

        _hoverElement = null;
        _innerMode = innerState.ready;
        _thisDiagramContext.InnerModeChange.RaiseEvent(_innerMode);
    }
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
            _thisDiagramContext.ElementSelectToggled.RaiseEvent([UIElement.GUID, shift, newState]);
        }
    }
    var deleteElement = function (UIElement) {
        setElementUnselected(UIElement);
        UIElement.Delete();
        _UIElements[UIElement.GUID] = null;
    }
    var createFeature = function () {
        if (_innerMode != innerState.featureLock) {
            resetInnerMode();
            _innerMode = innerState.featureLock;
            _thisDiagramContext.InnerModeChange.RaiseEvent(_innerMode);

            //Create wireframe
            var boxWidth = UIObjectStyles.feature.general.box.dimensions.width * _scaleModifier;
            var boxHeight = UIObjectStyles.feature.general.box.dimensions.height * _scaleModifier;
            _wireframebox = _canvas.rect(-100, -100, boxWidth, boxHeight, 0).attr(UIObjectStyles.feature.states.wireframe.box.attr);

            //Setup mouse move handler
            _mousemoveHandler = function (e) {
                if (_innerMode != innerState.featureLock) {
                    resetInnerMode();
                    return;
                }

                //Mouse move
                var screenPosX = (e.pageX - $(_canvasContainer).offset().left + 0.5 - boxWidth / 2);
                var screenPosY = (e.pageY - $(_canvasContainer).offset().top + 0.5 - boxHeight / 2);
                if (_wireframebox == null) {
                    _wireframebox = _canvas.rect(screenPosX, screenPosY, boxWidth, boxHeight, 0).attr(styles.feature.states.wireframe.box);
                }
                else {
                    _wireframebox.attr({ x: screenPosX, y: screenPosY });
                }
            };
            $(_canvasContainer).bind("mousemove", _mousemoveHandler);

            //Create actual Feature on click
            _clickHandler = function (e) {

                //Get the position
                var absolutePosX = (e.pageX - $(_canvasContainer).offset().left + 0.5 - boxWidth / 2) / _scaleModifier;
                var absolutePosY = (e.pageY - $(_canvasContainer).offset().top + 0.5 - boxHeight / 2) / _scaleModifier;

                //Create a new clientObject in the diagramDataModel
                var initialValues = {
                    ModelID: _diagramDataModel.ModelID,
                    XPos: absolutePosX,
                    YPos: absolutePosY
                }
                var clientFeatureObject = _diagramDataModel.AddNewClientObject("feature", initialValues);

                resetInnerMode();
            };
            $(_canvasContainer).bind("click", _clickHandler);
        }
    }
    var createRelation = function () {
        if (_selectedElements.length == 2) {
            //Create a new clientObject in the diagramDataModel
            var parentFeature = _diagramDataModel.GetByGUID(_selectedElements[0].GUID);
            var childFeature = _diagramDataModel.GetByGUID(_selectedElements[1].GUID);
            var initialValues = {
                ModelID: _diagramDataModel.ModelID
            }
            var initialClientValues = {
                ParentFeature: parentFeature,
                ChildFeature: childFeature
            }
            var clientRelationObject = _diagramDataModel.AddNewClientObject("relation", initialValues, initialClientValues);
            resetInnerMode();
        }
        else if (_selectedElements.length < 2) {
            if (_innerMode != innerState.relationLock) {
                // Lock the relation element and allow the user to drag and drop selections to relation
                resetInnerMode();
                _innerMode = innerState.relationLock;
                _thisDiagramContext.InnerModeChange.RaiseEvent(_innerMode);

                // Drag and drop for the selected element
                _mousemoveHandler = function (e) {
                    if (_selectedElements.length === 0) {
                        if (_wireframebox)
                            _wireframebox.remove();
                        if (_bulletWireframe)
                            _bulletWireframe.remove();
                    }
                    else if (_selectedElements.length === 1) {
                        //Mouse move
                        var screenPosX = (e.pageX - $(_canvasContainer).offset().left + 0.5);
                        var screenPosY = (e.pageY - $(_canvasContainer).offset().top + 0.5);
                        if (_wireframebox)
                            _wireframebox.remove();
                        if (_bulletWireframe)
                            _bulletWireframe.remove();

                        var style = (function getStyle() {
                            var commonStyle = commonStyles.connection.states.unselected;
                            var generalStyle = UIObjectStyles.relation.general.connection;
                            var subTypeStyle = UIObjectStyles.relation.subTypes.mandatory.connection;
                            var currentStyle = $.extend(true, {}, commonStyle, generalStyle, subTypeStyle);
                            return currentStyle;
                        })();

                        if (_hoverElement !== null && _selectedElements[0] !== _hoverElement)
                            _currentPath = getPathBetweenFeatures(_selectedElements[0].InnerElements.box, _hoverElement.InnerElements.box);
                        else
                            _currentPath = getPathFromFeatureToPoint(_selectedElements[0].InnerElements.box, screenPosX, screenPosY);

                        _wireframebox = _canvas.path(_currentPath.path);
                        _wireframebox.attr(style.line.attr);

                        var rct = style.connectors.endConnector;
                        var scaledDimensions = $.extend(true, {}, rct.dimensions);
                        for (var dimensionKey in scaledDimensions) {
                            var originalValue = scaledDimensions[dimensionKey];
                            scaledDimensions[dimensionKey] = originalValue * _scaleModifier;
                        }
                        var xPos = _currentPath.endPoint.x - rct.dimensionModifier * _scaleModifier, yPos = _currentPath.endPoint.y - rct.dimensionModifier * _scaleModifier; //position for endConnector
                        _bulletWireframe = eval("_canvas." + rct.raphaelType + "(xPos, yPos" + paramsToString(scaledDimensions) + ")");
                        _bulletWireframe.attr(rct.attr);
                    }
                };

                $(_canvasContainer).bind("mousemove", _mousemoveHandler);

                _clickHandler = function (e) {
                    if (_selectedElements.length === 0) {
                        resetInnerMode();
                    }
                };
                $(_canvasContainer).bind("click", _clickHandler);
            }
        }
        else {
            resetInnerMode();
        }
    }
    var createGroupRelation = function () {
        if (_selectedElements.length > 2) {
            resetInnerMode();
            _innerMode = innerState.groupRelationLock;
            _thisDiagramContext.InnerModeChange.RaiseEvent(_innerMode);
            //Create a new clientObject in the diagramDataModel
            var parentFeature = _diagramDataModel.GetByGUID(_selectedElements[0].GUID);
            var childFeatures = [];
            var childUIFeatures = _selectedElements.slice(1);
            for (var i = 0; i < childUIFeatures.length; i++) {
                childFeatures.push(_diagramDataModel.GetByGUID(childUIFeatures[i].GUID));
            }
            var initialValues = {
                ModelID: _diagramDataModel.ModelID
            }
            var initialClientValues = {
                ParentFeature: parentFeature,
                ChildFeatures: childFeatures
            }
            var clientGroupRelationObject = _diagramDataModel.AddNewClientObject("groupRelation", initialValues, initialClientValues);
            resetInnerMode();
        }
        else {
            resetInnerMode();
        }
    }
    var createCompositionRule = function () {
        if (_selectedElements.length == 2) {
            resetInnerMode();
            _innerMode = innerState.compositionRuleLock;
            _thisDiagramContext.InnerModeChange.RaiseEvent(_innerMode);
            //Create a new clientObject in the diagramDataModel
            var firstFeature = _diagramDataModel.GetByGUID(_selectedElements[0].GUID);
            var secondFeature = _diagramDataModel.GetByGUID(_selectedElements[1].GUID);
            var initialValues = {
                ModelID: _diagramDataModel.ModelID
            }
            var initialClientValues = {
                FirstFeature: firstFeature,
                SecondFeature: secondFeature
            }
            var clientRelationObject = _diagramDataModel.AddNewClientObject("compositionRule", initialValues, initialClientValues);
            resetInnerMode();
        }
        else if (_selectedElements.length < 2) {
            if (_innerMode != innerState.compositionRuleLock) {
                // Lock the composition element and allow the user to drag and drop selections to relation
                resetInnerMode();
                _innerMode = innerState.compositionRuleLock;
                _thisDiagramContext.InnerModeChange.RaiseEvent(_innerMode);

                // Drag and drop for the selected element
                _mousemoveHandler = function (e) {
                    if (_selectedElements.length === 0) {
                        if (_wireframebox)
                            _wireframebox.remove();
                        if (_bulletWireframe)
                            _bulletWireframe.remove();
                    }
                    else if (_selectedElements.length === 1) {
                        //Mouse move
                        var screenPosX = (e.pageX - $(_canvasContainer).offset().left + 0.5);
                        var screenPosY = (e.pageY - $(_canvasContainer).offset().top + 0.5);

                        if (_wireframebox)
                            _wireframebox.remove();
                        if (_bulletWireframe)
                            _bulletWireframe.remove();

                        var style = (function getStyle() {
                            var commonStyle = commonStyles.connection.states.unselected;
                            var generalStyle = UIObjectStyles.compositionRule.general.connection;
                            var subTypeStyle = UIObjectStyles.compositionRule.subTypes.dependency.connection;
                            var currentStyle = $.extend(true, {}, commonStyle, generalStyle, subTypeStyle);
                            return currentStyle;
                        })();

                        if (_hoverElement !== null && _selectedElements[0] !== _hoverElement)
                            _currentPath = getPathBetweenFeatures(_selectedElements[0].InnerElements.box, _hoverElement.InnerElements.box);
                        else
                            _currentPath = getPathFromFeatureToPoint(_selectedElements[0].InnerElements.box, screenPosX, screenPosY);

                        _wireframebox = _canvas.path(_currentPath.path);
                        _wireframebox.attr(style.line.attr);

                        var rct = style.connectors.endConnector;
                        var scaledDimensions = $.extend(true, {}, rct.dimensions);
                        for (var dimensionKey in scaledDimensions) {
                            var originalValue = scaledDimensions[dimensionKey];
                            scaledDimensions[dimensionKey] = originalValue * _scaleModifier;
                        }
                        var xPos = _currentPath.endPoint.x - rct.dimensionModifier * _scaleModifier, yPos = _currentPath.endPoint.y - rct.dimensionModifier * _scaleModifier; //position for endConnector
                        _bulletWireframe = eval("_canvas." + rct.raphaelType + "(xPos, yPos" + paramsToString(scaledDimensions) + ")");
                        _bulletWireframe.attr(rct.attr);
                    }
                };

                $(_canvasContainer).bind("mousemove", _mousemoveHandler);

                _clickHandler = function (e) {
                    if (_selectedElements.length === 0) {
                        resetInnerMode();
                    }
                };
                $(_canvasContainer).bind("click", _clickHandler);
            }
        }
        else {
            resetInnerMode();
        }
    }

    //Sync with dataModel methods
    addElement = function (guid) {

        //Variables
        var clientObject = _diagramDataModel.GetByGUID(guid);
        var clientObjectType = clientObject.GetType();

        //Perform update according to type
        switch (clientObjectType) {
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
        var clientObject = _diagramDataModel.GetByGUID(guid);
        var clientObjectType = clientObject.GetType();

        //Perform update according to type
        switch (clientObjectType) {
            case "feature":
                UIElement.Update(clientObject.GetField("Name"));
                break;
            case "relation":
                UIElement.Update(clientObject.GetField("RelationType"), clientObject.GetField("LowerBound"), clientObject.GetField("UpperBound"));
                break;
            case "groupRelation":
                UIElement.Update(clientObject.GetField("GroupRelationType"), clientObject.GetField("LowerBound"), clientObject.GetField("UpperBound"));
                break;
            case "compositionRule":
                UIElement.Update(clientObject.GetField("CompositionRuleType"));
                break;
        }
    }
    var addFeature = function (guid) {
        //
        var featureClientObject = _diagramDataModel.GetByGUID(guid);

        //
        var posx = featureClientObject.GetField("XPos");
        var posy = featureClientObject.GetField("YPos");
        var name = featureClientObject.GetField("Name");
        var newUIFeature = new UIFeature(guid, name, posx, posy);
        newUIFeature.CreateGraphicalRepresentation();

        //
        _UIElements[guid] = newUIFeature;
    }
    var addRelation = function (guid) {

        //Variables
        var clientObject = _diagramDataModel.GetByGUID(guid);
        var UIparentFeature = _UIElements[clientObject.ParentFeature.GUID];
        var UIchildFeature = _UIElements[clientObject.ChildFeature.GUID];
        var relationType = clientObject.GetField("RelationType");
        var lowerBound = clientObject.GetField("LowerBound");
        var upperBound = clientObject.GetField("UpperBound");

        //Create a new UIRelation
        var newUIRelation = new UIRelation(guid, relationType, lowerBound, upperBound, UIparentFeature, UIchildFeature);
        newUIRelation.CreateGraphicalRepresentation();

        //Add to collection
        _UIElements[guid] = newUIRelation;
    }
    var addGroupRelation = function (guid) {

        //Variables
        var clientObject = _diagramDataModel.GetByGUID(guid);
        var parentUIFeature = _UIElements[clientObject.ParentFeature.GUID];
        var childUIFeatures = [];
        for (var i = 0; i < clientObject.ChildFeatures.length; i++) {
            childUIFeatures.push(_UIElements[clientObject.ChildFeatures[i].GUID]);
        }
        var groupRelationType = clientObject.GetField("GroupRelationType");
        var lowerBound = clientObject.GetField("LowerBound");
        var upperBound = clientObject.GetField("UpperBound");

        //Create
        var newUIGroupRelation = new UIGroupRelation(guid, groupRelationType, lowerBound, upperBound, parentUIFeature, childUIFeatures);
        newUIGroupRelation.CreateGraphicalRepresentation();

        //Raise events/etc
        _UIElements[guid] = newUIGroupRelation;
    }
    var addCompositionRule = function (guid) {

        //Variables
        var clientObject = _diagramDataModel.GetByGUID(guid);
        var firstFeature = _UIElements[clientObject.FirstFeature.GUID];
        var secondFeature = _UIElements[clientObject.SecondFeature.GUID];
        var compositionRuleType = clientObject.GetField("CompositionRuleType");

        //Create
        var newUICompositionRule = new UICompositionRule(guid, compositionRuleType, firstFeature, secondFeature);
        newUICompositionRule.CreateGraphicalRepresentation();

        //Raise events/etc
        _UIElements[guid] = newUICompositionRule;
    }

    //Public methods (triggered by ModelController)
    this.DeleteSelectedElements = function () {
        if (_innerMode != innerState.inlineEdit) {
            var elementsToBeDeleted = _selectedElements.slice(0);
            for (var i = 0; i < elementsToBeDeleted.length; i++) {
                _diagramDataModel.DeleteClientObject(elementsToBeDeleted[i].GUID);
            }
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
    this.ZoomIn = function () {

        //Modify scale
        if (_scaleModifier < 2) {
            _scaleModifier += 0.25;

            //Refresh features
            for (var guidKey in _diagramDataModel.ClientObjects.features) {
                var UIFeature = _UIElements[guidKey];
                if (UIFeature != undefined)
                    UIFeature.RefreshGraphicalRepresentation();
            }

            //Refresh relations, groupRelations and compositionRules
            for (var guidKey in _diagramDataModel.ClientObjects.relations) {
                var UIElement = _UIElements[guidKey];
                if (UIElement != undefined)
                    UIElement.RefreshGraphicalRepresentation();
            }
            for (var guidKey in _diagramDataModel.ClientObjects.groupRelations) {
                var UIElement = _UIElements[guidKey];
                if (UIElement != undefined)
                    UIElement.RefreshGraphicalRepresentation();
            }
            for (var guidKey in _diagramDataModel.ClientObjects.compositionRules) {
                var UIElement = _UIElements[guidKey];
                if (UIElement != undefined)
                    UIElement.RefreshGraphicalRepresentation();
            }
        }

        //
        return _scaleModifier;
    }
    this.ZoomOut = function () {

        //Modify scale
        if (_scaleModifier >= 0.50) {
            _scaleModifier -= 0.25;

            //Refresh features
            for (var guidKey in _diagramDataModel.ClientObjects.features) {
                var UIFeature = _UIElements[guidKey];
                if (UIFeature != undefined)
                    UIFeature.RefreshGraphicalRepresentation();
            }

            //Refresh relations, groupRelations and compositionRules
            for (var guidKey in _diagramDataModel.ClientObjects.relations) {
                var UIElement = _UIElements[guidKey];
                if (UIElement != undefined)
                    UIElement.RefreshGraphicalRepresentation();
            }
            for (var guidKey in _diagramDataModel.ClientObjects.groupRelations) {
                var UIElement = _UIElements[guidKey];
                if (UIElement != undefined)
                    UIElement.RefreshGraphicalRepresentation();
            }
            for (var guidKey in _diagramDataModel.ClientObjects.compositionRules) {
                var UIElement = _UIElements[guidKey];
                if (UIElement != undefined)
                    UIElement.RefreshGraphicalRepresentation();
            }
        }

        //
        return _scaleModifier;
    }
    this.ToggleOrientation = function () {

        //Toggle orientation
        if (_fixedOrientation == "vertical") {
            _fixedOrientation = "horizontal";
        } else {
            _fixedOrientation = "vertical";
        }

        //Refresh features
        for (var guidKey in _diagramDataModel.ClientObjects.features) {
            var UIFeature = _UIElements[guidKey];
            if (UIFeature != undefined) {
                UIFeature.ReverseCoordinates();
                UIFeature.RefreshGraphicalRepresentation();
            }

        }

        //Refresh relations, groupRelations and compositionRules
        for (var guidKey in _diagramDataModel.ClientObjects.relations) {
            var UIElement = _UIElements[guidKey];
            if (UIElement != undefined)
                UIElement.RefreshGraphicalRepresentation();
        }
        for (var guidKey in _diagramDataModel.ClientObjects.groupRelations) {
            var UIElement = _UIElements[guidKey];
            if (UIElement != undefined)
                UIElement.RefreshGraphicalRepresentation();
        }
        for (var guidKey in _diagramDataModel.ClientObjects.compositionRules) {
            var UIElement = _UIElements[guidKey];
            if (UIElement != undefined)
                UIElement.RefreshGraphicalRepresentation();
        }
    }
    this.ResetInnerState = function () {
        resetInnerMode();
    }
    this.GetInnerState = function () {
        return _innerMode;
    }

    //Events
    this.ElementSelectToggled = new Event();
    this.SelectionCleared = new Event();
    this.Focus = new Event();
    this.InnerModeChange = new Event();

    // Private events
    var internalUIElementCascadedDelete = new Event();
    var internalUIFeatureMoved = new Event();

    //Eventhandlers
    this.OnClientObjectsLoaded = function () {
        for (var guidKey in _diagramDataModel.ClientObjects.all) {
            addElement(guidKey);
        }
    }
    this.OnClientObjectCreated = function (guid) {
        var clientObject = _diagramDataModel.GetByGUID(guid);
        var type = clientObject.GetType();

        if (_supportedTypes[type] != undefined) {
            addElement(guid);
        }
    }
    this.OnClientObjectUpdated = function (guid) {
        var UIElement = _UIElements[guid];
        if (UIElement != undefined) {
            updateElement(guid);
        }
    }
    this.OnClientObjectDeleted = function (guid) {
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
        _diagramDataModel.DeleteClientObject(UIElement.GUID);
    }
    var onInternalUIFeatureMoved = function (UIFeature) {
        _diagramDataModel.UpdateClientObjectFields(UIFeature.GUID, ["XPos", "YPos"], [UIFeature.GetPos().x, UIFeature.GetPos().y]);
    }
}



