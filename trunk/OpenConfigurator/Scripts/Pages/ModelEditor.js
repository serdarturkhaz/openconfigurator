//Settings and defaults
var settings = {
    diagramContext: {
        fixedOrientation: "vertical", //determines orientation of diagram - options: horizontal / vertical / false (automatic - needs bug fixing to work properly)
        drawCurves: true, //determines whether curves should be used for drawing relations - options: true / false
        dynamicRefresh: true, //determines whether refresh (redraw) operations are executed real-time or after a move event is completed
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
                        stroke: "#333333",
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

var ClientController = function (diagramContainer, propertiesContainer, explorerContainer) {

    //Settings & defaults
    var supportedTypes = {
        diagramContext: ["relation", "groupRelation"]
    }
    var eventHandlers = {
        diagramEvents: {
            OnElementAdded: function (UIElement) {
                var elemType = UIElement.GetTypeName();
                switch (elemType) {
                    case "feature":
                        _modelExplorer.AddElementToTree(UIElement);
                        break;
                    case "compositionRule":
                        _modelExplorer.AddElementToTree(UIElement);
                        break;
                }
            },
            OnElementSelected: function (UIElement) {
                _propertiesComponent.LoadProperties(UIElement);
                _modelExplorer.SelectNodeInTree(UIElement.GUID);
            },
            OnElementUpdated: function (UIElement) {
                _modelExplorer.UpdateNodeInTree(UIElement.GUID, UIElement.GetDataObj().Name);
            },
            OnElementEdited: function (UIElement) {
                _propertiesComponent.LoadProperties(UIElement);
                _modelExplorer.UpdateNodeInTree(UIElement.GUID, UIElement.GetDataObj().Name);
            },
            OnElementDeselected: function (UIElement) {
                _propertiesComponent.Clear();
                _modelExplorer.DeselectAll();
            },
            OnAllElementsDeselected: function (UIElement) {
                _propertiesComponent.Clear();
                _modelExplorer.DeselectAll();
            },
            OnElementDeleted: function (UIElement) {
                _modelExplorer.DeleteNodeInTree(UIElement.GUID);
            },
            OnFocus: function () {
                if (_currentControlFocus != _diagramContext) {
                    _currentControlFocus = _diagramContext;
                }
            }
        },
        explorerEvents: {
            OnNodeSelected: function (guid, shift) {
                var UIElement = _diagramContext.GetUIElement(guid);
                if (UIElement != null) {
                    _diagramContext.SelectElement(UIElement, shift);
                    _propertiesComponent.LoadProperties(UIElement);
                }
            },
            OnNodeDeleted: function (guid) {
                var UIElement = _diagramContext.GetUIElement(guid);
                if (UIElement != null) {
                    _diagramContext.DeleteElement(UIElement);
                }
            },
            OnFocus: function () {
                if (_currentControlFocus != _modelExplorer) {
                    _currentControlFocus = _modelExplorer;
                }
            }
        },
        propertiesEvents: {
            OnDataChanged: function (UIElement, modifiedDataObj) {
                _diagramContext.UpdateElement(UIElement, modifiedDataObj);
            },
            OnFocus: function () {
                if (_currentControlFocus != _propertiesComponent) {
                    _currentControlFocus = _propertiesComponent;
                }
            }
        }
    }

    //Fields and variables
    var _diagramContext, _propertiesComponent, _modelExplorer;
    var _thisClientController = this;
    var _currentControlFocus = null; //variable to keep track of where the user executed the last action (clicking)
    var _currentSelection = [];

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
    var setEventHandlers = function (eventNamesCollection, eventsSource) {
        for (var eventName in eventNamesCollection) {
            var eventHandler = eventNamesCollection[eventName];
            eventsSource[eventName].Add(new EventHandler(eventHandler));
        }
    }

    //Constructor/Initalizers
    this.Initialize = function () {

        //Instantiate/Initialize controls
        _diagramContext = new DiagramContext($("#SVGCanvas")[0]);
        _diagramContext.Initialize();
        _propertiesComponent = new PropertiesComponent($("#PropertiesBox"));
        _propertiesComponent.Initialize();
        _modelExplorer = new ModelExplorer($("#ModelExplorerTree"));
        _modelExplorer.Initialize();

        //Set event handlers
        setEventHandlers(eventHandlers.diagramEvents, _diagramContext);
        setEventHandlers(eventHandlers.propertiesEvents, _propertiesComponent);
        setEventHandlers(eventHandlers.explorerEvents, _modelExplorer);
    }

    //Public methods
    this.SaveData = function () {

    }
    this.CreateNewFeature = function () {
        var featureObj = getDefaultDataObj("Feature");
        _diagramContext.AddFeature(featureObj);
    }
    this.CreateNewRelation = function () {
        var relationObj = getDefaultDataObj("Relation");
        _diagramContext.AddRelation(relationObj);
    }
    this.CreateNewGroupRelation = function () {
        var groupRelationObj = getDefaultDataObj("GroupRelation");
        _diagramContext.AddGroupRelation(groupRelationObj);
    }
    this.CreateNewCompositionRule = function () {
        var compositionRuleObj = getDefaultDataObj("CompositionRule");
        _diagramContext.AddCompositionRule(compositionRuleObj);
    }
    this.CreateNewCustomRule = function () {

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
var PropertiesComponent = function (container) {

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
                    var attributeDataObj = getDefaultDataObj("Attribute");
                    var newIndex = dataObjParent[dataObjFieldName].length;
                    dataObjParent[dataObjFieldName][newIndex] = attributeDataObj;

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
                    if (dataObjParent[dataObjFieldName][i] != null) {
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
                        dataObjParent[dataObjFieldName][index] = null;
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
                        },
                        mutual: {
                            label: "Mutual",
                            dataName: "Mutual",
                            controlType: controlTypes.checkbox.name
                        }
                    }

                }
            }
        }
    };

    //Fields and variables
    var _container = container;
    var _currentUIElement = null, _currentDataObj = null, _currentElemType = null;
    var _thisPropertiesComponent = this;
    var _mainContainer = $(container).find("#MainContainer");
    var _headerLabel = $(container).find("#SetTypeLabel");

    //Constructor/Initalizers
    this.Initialize = function () {

        //Handler for onFocus
        $(_mainContainer).bind("click", function (e) {
            _thisPropertiesComponent.OnFocus.RaiseEvent();
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
        for (var areaKey in objectTypes[_currentElemType].areas) {

            //Create an html area
            var area = objectTypes[_currentElemType].areas[areaKey];
            var areaInnerContainer = createSectionArea(area.displayTitle, area.tableLayout);

            //Go through each field in the Area
            for (var fieldKey in area.fields) {

                //Create a control
                var field = area.fields[fieldKey];
                var control = controlTypes[field.controlType].createControlHTML(_currentDataObj, field.dataName, field, field.onFieldDataChanged);
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
                controlTypes[field.controlType].loadData(control, _currentDataObj, field.dataName, field, onDataChanged);

            }

            //Rego through fields and all onFieldDataLoaded
            for (var fieldKey in area.fields) {

                //Get the field and control
                var field = area.fields[fieldKey];
                if (field.onFieldDataLoaded != undefined) {
                    field.onFieldDataLoaded(_currentDataObj[field.dataName], control);
                }
            }
        }

        //Special hack
        $(_mainContainer).children(".AreaDiv:gt(0)").css("margin-top", "10px");
    }
    var onDataChanged = function () {
        _thisPropertiesComponent.OnDataChanged.RaiseEvent([_currentUIElement, _currentDataObj]);
    }
    var clearUI = function () {
        $(_mainContainer).html("");
        $(_headerLabel).text("");
    }

    //Public methods
    this.LoadProperties = function (UIElement) {

        //Variables
        _currentUIElement = UIElement;
        _currentElemType = UIElement.GetTypeName();
        _currentDataObj = jQuery.extend(true, {}, UIElement.GetDataObj());

        //Setup UI
        clearUI();
        loadUI();
        $(_headerLabel).text("(" + _currentElemType + ")");
    }
    this.Clear = function () {

        clearUI();
    }

    //Events
    this.OnDataChanged = new Event();
    this.OnFocus = new Event();
}
var ModelExplorer = function (container) {

    //Fields
    var _thisModelExplorer = this;
    var _tree = null;

    //Constructor/Initalizers
    this.Initialize = function () {

        //Handler for onFocus
        $(container).bind("click", function (e) {
            _thisModelExplorer.OnFocus.RaiseEvent();
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
                }
            },
            onNodeSelected: function (node, shift) {
                var guid = $(node).getNodeDataID();
                _thisModelExplorer.OnNodeSelected.RaiseEvent([guid, shift]);
            }
        }
        _tree = $(container).simpleTree(options);
    }

    //Public methods (raise events)
    this.DeleteSelectedElements = function () {
        var selectedNodes = $(_tree).getSelectedNodes();
        if (selectedNodes != null) {
            for (var i = selectedNodes.length - 1; i >= 0; i--) {
                var nodeGuid = $(selectedNodes[i]).getNodeDataID();
                $(selectedNodes[i]).deleteNode();

                //Raise events
                _thisModelExplorer.OnNodeDeleted.RaiseEvent(nodeGuid);
            }
        }
    }

    //Public methods - silent (do not raise events)
    this.AddFeatureToTree = function (UIFeature) {
        var dataObj = UIFeature.GetDataObj();

        //Add a new feature to the tree
        var newDataRow = {
            ID: UIFeature.GUID,
            Name: dataObj.Name,
            typeName: "feature"
        };
        var featuresNode = $(_tree).getNode("featuresNode");
        $(featuresNode).addChildNode(newDataRow);
    }
    this.AddElementToTree = function (UIElement) {
        var dataObj = UIElement.GetDataObj();
        var type = UIElement.GetTypeName();

        //Add a new feature to the tree
        var newDataRow = {
            ID: UIElement.GUID,
            Name: dataObj.Name,
            typeName: type
        };
        var parentNode = $(_tree).getNode(type + "sNode");
        $(parentNode).addChildNode(newDataRow);
    }

    this.SelectNodeInTree = function (guid) {
        var node = $(_tree).getNode(guid);
        if (node != null)
            $(node).selectNode();
    }
    this.DeselectAll = function () {
        $(_tree).deselectAll();
    }
    this.UpdateNodeInTree = function (guid, newName) {
        var node = $(_tree).getNode(guid);
        if (node != null)
            $(node).updateNodeName(newName);
    }
    this.DeleteNodeInTree = function (guid) {
        var node = $(_tree).getNode(guid);
        if (node != null)
            $(node).deleteNode();
    }

    //Events
    this.OnNodeSelected = new Event();
    this.OnNodeDeleted = new Event();
    this.OnFocus = new Event();
}
var DiagramContext = function (canvasContainer) {

    //Fields
    var _thisDiagramContext = this;
    var _canvas = null, _canvasContainer = canvasContainer;
    var _selectedElements = new Array();
    var _createFeatureMode = false, _inlineEditMode = false;
    var _UIElements = {}; //dictionary to hold all UIElements (guid, UIElement)
    var _internalUIObjectIDCounter = 0;

    //UIObjects & Defaults/Settings
    var UIFeature = function (dataObj, x, y) {

        //Fields
        var _guid = _internalUIObjectIDCounter++; //special ui identifier
        var _outerElement = null;
        var _innerElements = {};
        var _currentState = systemDefaults.uiElementStates.unselected;
        var _dataObj = dataObj;
        var _glow = null;
        var boxWidth = UIObjectStyles.feature.general.box.dimensions.width, boxHeight = UIObjectStyles.feature.general.box.dimensions.height;
        var _thisUIFeature = this;
        var _relatedCompositeElements = [];

        //Properties
        this.GUID = _guid;
        this.GetDataObj = function () {
            return _dataObj;
        }
        this.IsSelected = function () {
            return _selected;
        }
        this.GetTypeName = function () {
            return "feature";
        }
        this.InnerElements = _innerElements;
        this.RelatedCompositeElements = _relatedCompositeElements;

        //Private methods
        var makeSelectable = function () {

            //Selectable
            _outerElement.click(function (e) {
                selectElement(_thisUIFeature, e.shiftKey);

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
                if (_glow != null) {
                    _glow.remove();
                    _glow = null;
                }
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

                if (settings.diagramContext.dynamicRefresh == false) {
                    //Notify related CompositeElements
                    for (var j = 0; j < _relatedCompositeElements.length; j++) {
                        _relatedCompositeElements[j].OnAdjacentFeatureMoved(_thisUIFeature);
                    }
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
                    var newName = $(this).val();
                    var newDataObj = jQuery.extend(true, {}, _dataObj);
                    newDataObj.Name = newName;
                    _thisUIFeature.Update(newDataObj);
                    $(this).remove();
                    _inlineEditMode = false;
                    _thisDiagramContext.OnElementEdited.RaiseEvent(_thisUIFeature);
                }).bind("keypress", function (e) {
                    if (e.which == 13) { //Enter
                        var newName = $(this).val();
                        var newDataObj = jQuery.extend(true, {}, _dataObj);
                        newDataObj.Name = newName;
                        _thisUIFeature.Update(newDataObj);
                        $(this).remove();
                        _inlineEditMode = false;
                        _thisDiagramContext.OnElementEdited.RaiseEvent(_thisUIFeature);
                    }
                    else if (e.which == 27) { //Escape
                        $(this).remove();
                        _inlineEditMode = false;
                    }
                }).bind("blur", function (e) {
                    $(this).remove();
                    _inlineEditMode = false;
                });
                $(textinput).val(_dataObj.Name).select();

                //Default select
                selectElement(_thisUIFeature, false);
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
            _innerElements.text = _canvas.text(boxWidth / 2 + x, boxHeight / 2 + y, dataObj.Name).attr(UIObjectStyles.feature.states[_currentState].text.attr);

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
        this.Update = function (newDataObj) {
            _dataObj.Name = newDataObj.Name;
            _dataObj.Description = newDataObj.Description;
            _dataObj.Attributes = newDataObj.Attributes;

            //Set text
            _innerElements.text.attr({ text: _dataObj.Name });
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
    var UIRelation = function (dataObj, parentFeature, childFeature) { //CompositeElement

        //Fields
        var _guid = _internalUIObjectIDCounter++; //special ui identifier
        var _innerElements = {
            cardinalityElement: null,
            connection: null
        };
        var _currentState = systemDefaults.uiElementStates.unselected;
        var _dataObj = dataObj;
        var _thisUIRelation = this;

        //Properties
        this.GUID = _guid;
        this.GetDataObj = function () {
            return _dataObj;
        }
        this.GetTypeName = function () {
            return "relation";
        }
        this.GetSubTypeName = function () {
            var relationSubTypeName = getEnumEntryByID(systemDefaults.enums.relationTypes, _dataObj.RelationType).name;
            return relationSubTypeName;
        }

        //Private methods
        function makeSelectable() {
            //
            var handlers = {
                onClick: function (e) {
                    selectElement(_thisUIRelation, e.shiftKey);
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
                        _innerElements.cardinalityElement = new UICardinalityLabel(_thisUIRelation, getCardinalityElemPosition);
                        _innerElements.cardinalityElement.CreateGraphicalRepresentation();
                    }
                    //
                    _innerElements.cardinalityElement.Update();
                    break;
                case "partial":
                    //only show for cloneable
                    if (_dataObj.RelationType == systemDefaults.enums.relationTypes.cloneable.id) {
                        if (_innerElements.cardinalityElement == null) {
                            _innerElements.cardinalityElement = new UICardinalityLabel(_thisUIRelation, getCardinalityElemPosition);
                            _innerElements.cardinalityElement.CreateGraphicalRepresentation();
                        }

                        //
                        _innerElements.cardinalityElement.Update();
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
            _innerElements.connection = new UIConnection(_thisUIRelation, parentFeature.InnerElements.box, childFeature.InnerElements.box);
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
        this.Update = function (newDataObj) {
            _dataObj.RelationType = newDataObj.RelationType;
            _dataObj.LowerBound = newDataObj.LowerBound;
            _dataObj.UpperBound = newDataObj.UpperBound;

            //Update visuals
            _innerElements.connection.Update();
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
            deleteElement(_thisUIRelation);
        }
        this.OnAdjacentFeatureMoved = function (UIFeature) {
            refresh();
        }
    }
    var UIGroupRelation = function (dataObj, parentFeature, childFeatures) { //CompositeElement

        //Fields
        var _guid = _internalUIObjectIDCounter++; //special ui identifier
        var _innerElements = {
            cardinalityElement: null,
            rootArc: null,
            connections: null
        };
        var _currentState = systemDefaults.uiElementStates.unselected;
        var _dataObj = dataObj;
        var _featuresToConnections = {}; // (UIFeatureGUID, UIConnection) dictionary
        var _thisUIGroupRelation = this;

        //Properties
        this.GUID = _guid;
        this.GetDataObj = function () {
            return _dataObj;
        }
        this.GetTypeName = function () {
            return "groupRelation";
        }
        this.GetSubTypeName = function () {
            var groupRelationSubTypeName = getEnumEntryByID(systemDefaults.enums.groupRelationTypes, _dataObj.GroupRelationType).name;
            return groupRelationSubTypeName;
        }

        //Private methods
        function makeSelectable() {
            //
            var handlers = {
                onClick: function (e) {
                    selectElement(_thisUIGroupRelation, e.shiftKey);
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
                        _innerElements.cardinalityElement = new UICardinalityLabel(_thisUIGroupRelation, getCardinalityElemPosition);
                        _innerElements.cardinalityElement.CreateGraphicalRepresentation();
                    }
                    //
                    _innerElements.cardinalityElement.Update();
                    break;
                case "partial":
                    //only show for cardinal
                    if (_dataObj.GroupRelationType == systemDefaults.enums.groupRelationTypes.cardinal.id) {
                        if (_innerElements.cardinalityElement == null) {
                            _innerElements.cardinalityElement = new UICardinalityLabel(_thisUIGroupRelation, getCardinalityElemPosition);
                            _innerElements.cardinalityElement.CreateGraphicalRepresentation();
                        }

                        //
                        _innerElements.cardinalityElement.Update();
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
                var newUIConnection = new UIConnection(_thisUIGroupRelation, parentFeature.InnerElements.box, childFeatures[i].InnerElements.box);
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
        this.ChangeState = function (state) {
            _currentState = state;
            for (var i = 0; i < _innerElements.connections.length; i++) {
                _innerElements.connections[i].ChangeState(state);
            }
        }
        this.Update = function (newDataObj) {
            _dataObj.GroupRelationType = newDataObj.GroupRelationType;
            _dataObj.LowerBound = newDataObj.LowerBound;
            _dataObj.UpperBound = newDataObj.UpperBound;

            //Update visuals
            for (var i = 0; i < _innerElements.connections.length; i++) {
                _innerElements.connections[i].Update(); //endConnector
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

            //ParentFeature deleted
            if (UIFeature === parentFeature) {
                deleteElement(_thisUIGroupRelation);
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
                    this.Delete();
                }
            }
        }
    }
    var UICompositionRule = function (dataObj, firstFeature, secondFeature) {

        //Fields
        var _guid = _internalUIObjectIDCounter++; //special ui identifier
        var _innerElements = {
            connection: null
        };
        var _currentState = systemDefaults.uiElementStates.unselected;
        var _dataObj = dataObj;
        var _thisUICompositionRule = this;

        //Properties
        this.GUID = _guid;
        this.GetDataObj = function () {
            return _dataObj;
        }
        this.GetTypeName = function () {
            return "compositionRule";
        }
        this.GetSubTypeName = function () {
            var compositionRuleSubTypeName = getEnumEntryByID(systemDefaults.enums.compositionRuleTypes, _dataObj.CompositionRuleType).name;
            return compositionRuleSubTypeName;
        }

        //Private methods
        function makeSelectable() {
            //
            var handlers = {
                onClick: function (e) {
                    selectElement(_thisUICompositionRule, e.shiftKey);
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
            _innerElements.connection = new UIConnection(_thisUICompositionRule, firstFeature.InnerElements.box, secondFeature.InnerElements.box, true, true);
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
        this.Update = function (newDataObj) {
            _dataObj.Name = newDataObj.Name;
            _dataObj.Description = newDataObj.Description;
            _dataObj.CompositionRuleType = newDataObj.CompositionRuleType;
            _dataObj.Mutual = newDataObj.Mutual;

            //Update visuals
            _innerElements.connection.Update();
        }

        //Event handlers
        this.OnAdjacentFeatureDeleted = function (UIFeature) {
            deleteElement(_thisUICompositionRule);
        }
        this.OnAdjacentFeatureMoved = function (UIFeature) {
            refresh();
        }
    }
    var UIConnection = function (compositeElement, parentBox, childBox, invertOrientation, toBack) {

        //Standard fields
        var _guid = _internalUIObjectIDCounter++; //special ui identifier
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
        var _thisUIConnection = this;

        //Special fields
        var _compositeElement = compositeElement;
        var _currentPath = null;
        var _invertOrientation = (invertOrientation != undefined) ? invertOrientation : null; //parameter used to force the path to draw in the opposite orientation
        var _toBack = (toBack != undefined) ? toBack : null; //parameter used to draw connection behind other elements

        //Properties
        this.GUID = _guid;
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
            var generalStyle = UIObjectStyles[_compositeElement.GetTypeName()].general.connection;
            var subTypeStyle = UIObjectStyles[_compositeElement.GetTypeName()].subTypes[_compositeElement.GetSubTypeName()].connection;
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
            _thisUIConnection.Update(); //hack-fix for state style overriding line style in CompositionRule
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
        this.Update = function () {

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
        var _guid = _internalUIObjectIDCounter++; //special ui identifier
        var _innerElements = {
            raphaelElem: null
        };
        var _connectionElement = parentConnection;

        //Properties
        this.GUID = _guid;
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
    var UICardinalityLabel = function (compositeElement, calculatePositionFunction) {

        //Fields
        var _guid = _internalUIObjectIDCounter++; //special ui identifier
        var _innerElements = {
            box: null,
            text: null
        };
        var _outerElement = null;
        var _thisUICardinalityLabel = this;

        //Properties
        this.GUID = _guid;
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
            _innerElements.text = _canvas.text(labelPoint.x, labelPoint.y, "[" + compositeElement.GetDataObj().LowerBound + ".." + compositeElement.GetDataObj().UpperBound + "]");
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
        this.Update = function () {
            _innerElements.text.attr({ text: "[" + compositeElement.GetDataObj().LowerBound + ".." + compositeElement.GetDataObj().UpperBound + "]" });
        }
    }

    //Properties
    this.SelectedElements = _selectedElements;

    //Constructor/Initalizers
    this.Initialize = function () {
        _canvas = Raphael(canvasContainer, "100%", "100%");

        //Handler for canvas click
        $(_canvasContainer).bind("click", function (e) {
            _thisDiagramContext.OnFocus.RaiseEvent();
            if (e.target.nodeName == "svg" && e.shiftKey != true) {
                deselectAll();
            }
        });

        //Handler for selection rectangle
        $(_canvasContainer).bind("mousedown", function (e) {
            if (e.target.nodeName == "svg" && e.shiftKey != true) {
                deselectAll();
            }
        });
    };

    //Private methods
    function deselectAll(suppressEvents) {
        for (var i = _selectedElements.length - 1; i >= 0; i--) {
            var selElem = _selectedElements[i];
            deselectElement(selElem, suppressEvents);
        }
    }
    function deselectElement(UIElement, suppressEvents) {
        //Remove from collection
        var index = $(_selectedElements).index(UIElement);
        _selectedElements.splice(index, 1);

        //Deselect UIElement
        UIElement.ChangeState(systemDefaults.uiElementStates.unselected);

        //Raise events
        if (suppressEvents != true) {
            if (_selectedElements.length == 0) {
                _thisDiagramContext.OnAllElementsDeselected.RaiseEvent();
            }
            _thisDiagramContext.OnElementDeselected.RaiseEvent(UIElement);
        }
    }
    function selectElement(UIElement, shift, suppressEvents) {
        if (shift == false) {
            deselectAll(suppressEvents);
        }

        //Add to collection and change state
        _selectedElements.push(UIElement);
        UIElement.ChangeState(systemDefaults.uiElementStates.selected);

        //Raise events
        if (suppressEvents != true) {
            _thisDiagramContext.OnElementSelected.RaiseEvent(UIElement);
        }
    }
    function deleteElement(UIElement, suppressEvents) {
        deselectElement(UIElement);
        UIElement.Delete();

        //Raise events
        if (suppressEvents != true) {
            _thisDiagramContext.OnElementDeleted.RaiseEvent(UIElement);
        }
    }

    //Public methods (raise events)
    this.AddFeature = function (dataObj) {
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
                var posx = e.pageX - $(document).scrollLeft() - $(_canvasContainer).offset().left + 0.5 - boxWidth / 2;
                var posy = e.pageY - $(document).scrollTop() - $(_canvasContainer).offset().top + 0.5 - boxHeight / 2;
                var newUIFeature = new UIFeature(dataObj, posx, posy);
                newUIFeature.CreateGraphicalRepresentation();

                //
                $(_canvasContainer).unbind("click", clickHandler);
                $(_canvasContainer).unbind("mousemove", mousemoveHandler);
                $(_canvasContainer).css("cursor", "default");
                wireframebox.remove();

                //Raise events/etc
                _createFeatureMode = false;
                _UIElements[newUIFeature.GUID] = newUIFeature;
                _thisDiagramContext.OnElementAdded.RaiseEvent(newUIFeature);
            };
            $(_canvasContainer).bind("click", clickHandler);

        }
    }
    this.AddRelation = function (dataObj) {
        if (_selectedElements.length == 2) {
            var parentFeature = _selectedElements[0];
            var childFeature = _selectedElements[1];
            var newUIRelation = new UIRelation(dataObj, parentFeature, childFeature);
            newUIRelation.CreateGraphicalRepresentation();

            //Raise events/etc
            _UIElements[newUIRelation.GUID] = newUIRelation;
            _thisDiagramContext.OnElementAdded.RaiseEvent(newUIRelation);
        }
    }
    this.AddGroupRelation = function (dataObj) {
        if (_selectedElements.length > 2) {
            var parentFeature = _selectedElements[0];
            var childFeatures = _selectedElements.slice(1);
            var newUIGroupRelation = new UIGroupRelation(dataObj, parentFeature, childFeatures);
            newUIGroupRelation.CreateGraphicalRepresentation();

            //Raise events/etc
            _UIElements[newUIGroupRelation.GUID] = newUIGroupRelation;
            _thisDiagramContext.OnElementAdded.RaiseEvent(newUIGroupRelation);
        }
    }
    this.AddCompositionRule = function (dataObj) {
        if (_selectedElements.length == 2) {
            var firstFeature = _selectedElements[0];
            var secondFeature = _selectedElements[1];
            var newUICompositionRule = new UICompositionRule(dataObj, firstFeature, secondFeature);
            newUICompositionRule.CreateGraphicalRepresentation();

            //Raise events/etc
            _UIElements[newUICompositionRule.GUID] = newUICompositionRule;
            _thisDiagramContext.OnElementAdded.RaiseEvent(newUICompositionRule);
        }
    }
    this.UpdateElement = function (UIElement, updatedDataObj) {
        UIElement.Update(updatedDataObj);

        //Raise event
        _thisDiagramContext.OnElementUpdated.RaiseEvent(UIElement);
    }
    this.DeleteSelectedElements = function () {
        for (var i = _selectedElements.length - 1; i >= 0; i--) {
            var deletedElem = _selectedElements[i];
            deleteElement(_selectedElements[i]);

            //Raise event
            _thisDiagramContext.OnElementDeleted.RaiseEvent(deletedElem);
        }
    }
    this.SelectElement = function (UIElement, shift) {
        selectElement(UIElement, shift, true);
    }

    //Public methods - silent (do not raise events)
    this.GetUIElement = function (guid) {
        return _UIElements[guid];
    }
    this.DeleteElement = function (UIElement) {
        deleteElement(UIElement);
    }

    //Events
    this.OnElementAdded = new Event();
    this.OnElementEdited = new Event();
    this.OnElementUpdated = new Event();
    this.OnElementSelected = new Event();
    this.OnElementDeleted = new Event();
    this.OnElementDeselected = new Event();
    this.OnAllElementsDeselected = new Event();
    this.OnFocus = new Event();
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



