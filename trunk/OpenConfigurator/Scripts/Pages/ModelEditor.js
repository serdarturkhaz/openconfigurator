//Settings and defaults
var styles = {
    types: {
        common: {
            hoverGlow: {
                width: 10,
                opacity: 0.5,
                color: "blue"
            }
        },
        feature: {
            unselected: {
                primaryElement: {
                    fill: "#ffe784",
                    stroke: "#CECECE",
                    "stroke-width": 1,
                    opacity: 1
                },
                text: {
                    cursor: "default"
                }
            },
            selected: {
                primaryElement: {
                    fill: "#ffe784",
                    stroke: "black",
                    "stroke-width": 1.2,
                    opacity: 1
                },
                text: {
                    cursor: "default"
                }
            },
            wireframe: {
                fill: "#E4E4E4",
                stroke: "Gray",
                "stroke-width": 1.2,
                opacity: 0.5
            }
        },
        relation: {
            unselected: {
                primaryElement: {
                    stroke: "#666666",
                    fill: "none",
                    "stroke-width": 1
                },
                circle: {
                    stroke: "#666666"
                }
            },
            selected: {
                primaryElement: {
                    stroke: "black",
                    fill: "none",
                    "stroke-width": 2
                },
                circle: {
                    stroke: "black"
                }
            }
        }
    }
};
var settings = {
    diagramContext: {
        fixedOrientation: "horizontal"
    }
};

//Global helper methods
function getSubTypeByID(collection, id) {
    for (var key in collection) {
        var subType = collection[key];
        if (subType.typeID == id) {
            return subType;
        }
    }
}

//Components
var ActionsComponent = function (newFeatureElem, newGroupElem) {

    //Fields
    var newFeatureButton = null;
    var newGroupButton = null;
}
var PropertiesComponent = function (container, diagramContext) {

    //Defaults and settings
    var controlTypes = {
        textbox: {
            name: "textbox",
            createControlHTML: function (dataObjFieldName, objectTypeField) {

                //Create control
                var control = $("<input class='Textbox' type='text' />");

                //Event handlers
                var _this = this;
                control.bind("change", function () {
                    var newVal = control.val();
                    _currentDataObj[dataObjFieldName] = newVal;

                    //Call handler
                    onDataChanged();
                }).bind("keypress", function (e) {
                    if (e.which == 13) {
                        var newVal = control.val();
                        _currentDataObj[dataObjFieldName] = newVal;
                    }

                    //Call handler
                    onDataChanged();
                });

                //
                return control;
            },
            loadData: function (control, dataObjField, objectTypeField) {
                control.val(dataObjField);
            }
        },
        textarea: {
            name: "textarea",
            createControlHTML: function (dataObjFieldName, objectTypeField) {

                //Create control
                control = $("<textarea class='Textarea'></textarea>");

                //Event handlers
                var _this = this;
                control.bind("change", function () {
                    var newVal = control.val();
                    _currentDataObj[dataObjFieldName] = newVal;

                    //Call handler
                    onDataChanged();
                })

                //
                return control;
            },
            loadData: function (control, dataObjField, objectTypeField) {
                control.val(dataObjField);
            }
        },
        checkbox: {
            name: "checkbox",
            createControlHTML: function (dataObjFieldName, objectTypeField) {

                //Create control
                control = $("<input class='Checkbox' type='checkbox' />");

                //Event handlers
                var _this = this;
                control.bind("change", function () {
                    var newVal = control.attr("checked");
                    _currentDataObj[dataObjFieldName] = newVal;

                    //Call handler
                    onDataChanged();
                })

                //
                return control;
            },
            loadData: function (control, dataObjField, objectTypeField) {
                control.attr("checked", dataObjField);
            }
        },
        dropdown: {
            name: "dropdown",
            createControlHTML: function (dataObjFieldName, objectTypeField) {

                //Create control
                control = $("<select class='Dropdown' />");

                //Create default options
                var options = objectTypeField.defaultOptions;
                if (options != undefined) {
                    for (var i = 0; i < options.length; i++) {
                        var option = $("<option value='" + options[i].value + "'>" + options[i].text + "</option>").appendTo(control);
                    }
                }

                //Event handlers
                var _this = this;
                control.bind("change", function () {
                    var newVal = $(control).find("option:selected").attr("value");
                    _currentDataObj[dataObjFieldName] = newVal;

                    //Call handler
                    onDataChanged();
                });

                return control;
            },
            loadData: function (control, dataObjField, objectTypeField) {
                control.val(dataObjField);
            }
        },
        composite: {
            name: "composite",
            createControlHTML: function (dataObjFieldName, objectTypeField) {

                //Outer control
                var control = $("<div class='Composite''></div>");

                //List
                var listContainer = $("<div class='ListDiv'></div>").appendTo(control);
                var listActionsDiv = $("<div class='ListActionsDiv'></div>").appendTo(listContainer);
                var addButton = $("<div class='Button-Thin'></div>").append("<img src='../../Content/themes/base/images/Icons/Add.png' />").append("<span>Add new</span>").appendTo(listActionsDiv);

                //Details
                var detailsContainer = $("<div class='DetailsDiv'></div>").css("display", "none").appendTo(control);
                var detailsInnerTableTbody = $("<table><tbody></tbody></table>").appendTo(detailsContainer).find("tbody");

                //Create controls for SubFields in Details area
                for (var subFieldKey in objectTypeField.subFields) {
                    var subField = objectTypeField.subFields[subFieldKey];

                    //var innerDataObjFieldReference = dataObjField[subField.dataName];
                    var subFieldControl = controlTypes[subField.controlType].createControlHTML(_currentDataObj[dataObjFieldName][subField.dataName], subField).attr("subField", subField.dataName);
                    var row = createControlTableRow(subField.label, subFieldControl);
                    row.appendTo(detailsInnerTableTbody);
                }

                return control;
            },
            loadData: function (control, dataObjField, objectTypeField) {
                //
                var listContainer = $(control).find(".ListDiv");
                var _this = this;

                //Create nestedControls for nested Objects
                for (var i = 0; i < dataObjField.length; i++) {
                    var nestedObjectControl = this.privateMethods.createNestedObject(dataObjField[i].Name);
                    nestedObjectControl.attr("nestedObjectIndex", i);
                    nestedObjectControl.prependTo(listContainer);
                    nestedObjectControl.bind("click", function () {
                        _this.privateMethods.toggleSelectNestedObject($(this), control, dataObjField, objectTypeField);
                    });
                }

            },
            privateMethods: {
                //Method for creating HTMl for a nested Object----------------------------------------------------
                createNestedObject: function (label) {
                    var nestedObjectControl = $("<div class='NestedControl'></div>");
                    var controlLabel = $("<span class='Label-Small'>" + label + "</span>").appendTo(nestedObjectControl);
                    var deleteButton = $("<div class='IconButton-Simple'></div>").append("<img src='../../Content/themes/base/images/Icons/Delete.png' />").appendTo(nestedObjectControl);

                    return nestedObjectControl;
                },
                //------------------------------------------------------------------------------------------------
                //Method for selecting/deselecting a nested Object control----------------------------------------
                toggleSelectNestedObject: function (nestedObjectControl, control, dataObjFieldName, objectTypeField) {

                    //Variables and controls
                    var listContainer = $(control).find(".ListDiv");
                    var detailsContainer = $(control).find(".DetailsDiv");
                    var selectedNestedObjects = $(listContainer).children(".Selected");

                    //Deselect if already selected
                    if ($(nestedObjectControl).hasClass("Selected")) {
                        $(nestedObjectControl).removeClass("Selected");

                        //Clear details
                        $(detailsContainer).css("display", "none");
                        $(detailsContainer).find("tbody").html("");
                    }
                    //Select if not selected
                    else {
                        $(selectedNestedObjects).removeClass("Selected");
                        $(nestedObjectControl).addClass("Selected");

                        //Show details and create subField controls
                        $(detailsContainer).css("display", "block");

                        //
                        this.loadNestedObjectData(nestedObjectControl, control, dataObjField, objectTypeField);
                    }
                },
                //------------------------------------------------------------------------------------------------
                //Loads data for a nested Object------------------------------------------------------------------
                loadNestedObjectData: function (nestedObjectControl, control, dataObjField, objectTypeField) {

                    //Variables and controls
                    var detailsContainer = $(control).find(".DetailsDiv");
                    var nestedObjectIndex = parseInt(nestedObjectControl.attr("nestedObjectIndex"));

                    //Create SubFieldControls

                    //Load data into SubFieldControls
                    for (var subFieldKey in objectTypeField.subFields) {
                        var subField = objectTypeField.subFields[subFieldKey];
                        var subFieldControl = $(detailsContainer).find("[subField='" + subField.dataName + "']");

                        controlTypes[subField.controlType].loadData(subFieldControl, dataObjField[nestedObjectIndex][subField.dataName], subField);
                    }
                }
                //------------------------------------------------------------------------------------------------
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
                                    controlType: controlTypes.textbox.name
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
                                    defaultOptions: [
                                    {
                                        value: 1,
                                        text: "Constant"
                                    },
                                    {
                                        value: 2,
                                        text: "Dynamic"
                                    },
                                    {
                                        value: 3,
                                        text: "UserInput"
                                    }
                                    ]
                                },
                                datatype: {
                                    label: "Data Type",
                                    dataName: "AttributeDataType",
                                    controlType: controlTypes.dropdown.name,
                                    defaultOptions: [
                                    {
                                        value: 1,
                                        text: "Integer"
                                    },
                                    {
                                        value: 2,
                                        text: "Boolean"
                                    },
                                    {
                                        value: 3,
                                        text: "String"
                                    }
                                    ]
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
                            defaultOptions: [
                                {
                                    value: 1,
                                    text: "Mandatory"
                                },
                                {
                                    value: 2,
                                    text: "Optional"
                                },
                                {
                                    value: 3,
                                    text: "Cloneable"
                                }
                            ]
                        }
                    },
                    updateData: function () {
                        this.fields
                        var relationType = $(_controls["RelationType"]).find("option:selected").text().toLowerCase();
                        _diagramContext.UpdateRelation(_currentSet, relationType);
                    }
                }
            }
        }
    };

    /*var modes = {
    feature: {
    createUIControls: function () {

    //Create main controls-----------------------------------------------------
    var mainAreaTbody = createSectionArea();
    createControlWithRow(mainAreaTbody, "Root Feature", "IsRoot", "checkbox", true);
    createControlWithRow(mainAreaTbody, "Name", "Name", "textbox", false);
    createControlWithRow(mainAreaTbody, "Description", "Description", "textarea", false);

    //Set event handlers
    for (var key in _controls) {
    var ctrl = _controls[key];
    ctrl.bind("change", function () {
    modes.feature.updateData();
    }).bind("keypress", function (e) {
    if (e.which == 13) {
    modes.feature.updateData();
    }
    });
    }
    //------------------------------------------------------------------------

    //Create Attributes area--------------------------------------------------
    var attributesAreaInnerDiv = createSectionArea("Attributes", true);
    var listContainer = $("<div class='ListDiv'></div>").appendTo(attributesAreaInnerDiv);

    var detailsContainer = $("<div class='DetailsDiv'></div>").css("display", "none").appendTo(attributesAreaInnerDiv);
    var detailsInnerTableTbody = $("<table><tbody></tbody></table>").appendTo(detailsContainer).find("tbody");
    createControlWithRow(detailsInnerTableTbody, "Name", "Attributes.Name", "textbox", false);
    createControlWithRow(detailsInnerTableTbody, "Description", "Attributes.Description", "textarea", false);
    createControlWithRow(detailsInnerTableTbody, "Type", "Attributes.Type", "dropdown", false);
    createControlWithRow(detailsInnerTableTbody, "Data Type", "Attributes.DataType", "dropdown", false);

    $(_mainContainer).children(".AreaDiv:gt(0)").css("margin-top", "10px");
    //------------------------------------------------------------------------
    },
    loadData: function () {
    var dataObj = _currentSet.items[0].data("dataObj");
    _controls["IsRoot"].attr("checked", dataObj.IsRoot);
    _controls["Name"].val(dataObj.Name);
    _controls["Description"].val(dataObj.Description);
    var attributes = dataObj.Attributes;
    for (var i = 0; i < attributes.length; i++) {
    createSubField(_areas["Attributes"], attributes[i].Name, attributes[i].Name);
    }

    },
    updateData: function () {
    var name = _controls["Name"].val();
    var description = _controls["Description"].val();
    _diagramContext.UpdateFeature(_currentSet, name, description);
    }
    },
    relation: {
    createUIControls: function () {
    //Create main controls-----------------------------------------------------
    var mainAreaTbody = createSectionArea();
    var relationTypeDropdown = createControlWithRow(mainAreaTbody, "Type", "RelationType", "dropdown", false);
    var options = [{ val: 1, label: "Mandatory" }, { val: 2, label: "Optional" }, { val: 3, label: "Cloneable"}];
    for (var i = 0; i < options.length; i++) {
    var optionCtrl = $("<option value='" + options[i].val + "'>" + options[i].label + "</option>").appendTo(relationTypeDropdown);
    }

    relationTypeDropdown.bind("change", function () {
    modes.relation.updateData();
    })
    //------------------------------------------------------------------------
    },
    loadData: function () {
    var dataObj = _currentSet.items[0].data("dataObj");
    _controls["RelationType"].val(dataObj.RelationType);
    },
    updateData: function () {
    var relationType = $(_controls["RelationType"]).find("option:selected").text().toLowerCase();
    _diagramContext.UpdateRelation(_currentSet, relationType);
    }
    }
    };*/


    //Fields and variables
    var _container = container;
    var _diagramContext = diagramContext;
    var _currentSet = null, _currentDataObj = null, _currentSetType = null;

    //Controls
    var _mainContainer = $(container).find("#MainContainer");
    var _headerLabel = $(container).find("#SetTypeLabel");

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
        for (var areaKey in objectTypes[_currentSetType].areas) {

            //Create an html area
            var area = objectTypes[_currentSetType].areas[areaKey];
            var areaInnerContainer = createSectionArea(area.displayTitle, area.tableLayout);

            //Go through each field in the Area
            for (var fieldKey in area.fields) {

                //Create a control
                var field = area.fields[fieldKey];
                var dataObjFieldName = field.dataName;

                var control = controlTypes[field.controlType].createControlHTML(dataObjFieldName, field);
                control.attr("fieldName", field.dataName).attr("id", field.dataName + "Control");
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
                controlTypes[field.controlType].loadData(control, _currentDataObj[field.dataName], field);
            }
        }

        //Special hack
        $(_mainContainer).children(".AreaDiv:gt(0)").css("margin-top", "10px");
    }
    var onDataChanged = function () {
        _diagramContext.UpdateElement(_currentSet, _currentDataObj);
    }
    var clearUI = function () {
        //        for (var key in _controls) {
        //            var ctrl = _controls[key];
        //            $(ctrl).remove();
        //            delete _controls[key];
        //        }
        $(_mainContainer).html("");
        $(_headerLabel).text("");
    }

    //Public methods
    this.LoadProperties = function (set) {

        //Variables
        _currentSet = set;
        _currentSetType = set.items[0].data("type");
        _currentDataObj = set.items[0].data("dataObj");

        //Setup UI
        clearUI();
        loadUI();
        $(_headerLabel).text("(" + _currentSetType + ")");
    }
    this.Clear = function () {

        clearUI();
    }
}
var DiagramContext = function (canvasContainer) {

    //Defaults and settings
    var orientations = {
        horizontal: {
            name: "horizontal",
            connections: [["left", "right"], ["right", "left"]],
            curveModifiers: [{ x: -40, y: 0 }, { x: +40, y: 0}],
            angleIntervals: [{ min: 0, max: 45 }, { min: 136, max: 224 }, { min: 316, max: 359}]
        },
        vertical: {
            name: "vertical",
            connections: [["top", "bottom"], ["bottom", "top"]],
            curveModifiers: [{ x: 0, y: -40 }, { x: 0, y: +40}],
            angleIntervals: [{ min: 46, max: 135 }, { min: 225, max: 315}]
        }
    };
    var objectTypes = {
        common: {
            outerContainer: {
                stroke: "black",
                fill: "black",
                "stroke-width": 10,
                opacity: 0,
                cursor: "default"
            }
        },
        feature: {
            typeName: "feature"
        },
        relation: {
            typeName: "relation",
            subTypes: {
                mandatory: {
                    subTypeName: "mandatory",
                    typeID: 1,
                    circleAttr: {
                        fill: "black",
                        opacity: 1
                    }
                },
                optional: {
                    subTypeName: "optional",
                    typeID: 2,
                    circleAttr: {
                        fill: "#fff7d7",
                        opacity: 1
                    }

                },
                cloneable: {
                    subTypeName: "cloneable",
                    typeID: 3,
                    circleAttr: {
                        fill: "#fff7d7",
                        opacity: 0
                    }

                }
            }

        }
    };

    //Fields
    var _this = this;
    var _canvas = null, _canvasContainer = canvasContainer;
    var _selectedElements = new Array();

    //Properties
    this.SelectedElements = _selectedElements;

    //Constructor/Initalizers
    this.Initialize = function () {
        _canvas = Raphael(canvasContainer, "100%", "100%");

        //Handlers
        $(_canvasContainer).bind("click", function (e) {
            if (e.target.nodeName == "svg") {
                deselectAll();
            }
        });

    };

    //Helper methods
    function getPath(objA, objB) {

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
            for (var key in orientations) {
                var orientation = orientations[key];
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
        for (var i = 0; i < orientations[currentOrientation].connections.length; i++) {
            var con = orientations[currentOrientation].connections[i];
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
                curveModifier: orientations[currentOrientation].curveModifiers[i]
            };
        }
        var closestConnection = points[Math.min.apply(Math, distances)];

        //Create path
        var path = [["M", closestConnection.x1.toFixed(1), closestConnection.y1.toFixed(1)],
        ["C",
        closestConnection.x1 + closestConnection.curveModifier.x,
        closestConnection.y1 + closestConnection.curveModifier.y,
        closestConnection.x2 - closestConnection.curveModifier.x,
        closestConnection.y2 - closestConnection.curveModifier.y,
        closestConnection.x2.toFixed(1), closestConnection.y2.toFixed(1)]];
        //var path = ["M", closestConnection.x1.toFixed(1), closestConnection.y1.toFixed(1), "C", extraX1, extraY1, closestConnection.x2.toFixed(1), closestConnection.y2.toFixed(1)].join(","); //curve
        //var path = ["M", closestConnection.x1.toFixed(3), closestConnection.y1.toFixed(3), "L", closestConnection.x2.toFixed(3), closestConnection.y2.toFixed(3)].join(","); //line

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
    function deselectAll() {
        for (var i = _selectedElements.length - 1; i >= 0; i--) {
            var selElem = _selectedElements[i];
            deselect(selElem);
        }
    }
    function deselect(set) {
        var isSelected = set.items[0].data("selected");
        if (isSelected) {

            //Deselect
            var outerContainer = set.items[0];
            var type = outerContainer.data("type");
            outerContainer.data("children")[0].attr(styles.types[type].unselected.primaryElement);
            outerContainer.data("selected", false);

            //Remove from selectedElements collection
            var index = $(_selectedElements).index(set);
            _selectedElements.splice(index, 1);
            if (_selectedElements.length == 0) {
                _this.OnAllElementsDeselected.RaiseEvent();
            }

            //Raise event
            _this.OnElementDeselected.RaiseEvent(set);
        }
    }
    function select(set, shift) {
        var isSelected = set.items[0].data("selected");
        if (!isSelected) {
            //Deselect everything
            if (shift == false) {
                deselectAll();
            }

            //Select current set
            var outerContainer = set.items[0];
            var type = outerContainer.data("type");
            outerContainer.data("children")[0].attr(styles.types[type].selected.primaryElement);
            outerContainer.data("selected", true);

            //Raise event
            _selectedElements.push(set);
            _this.OnElementSelected.RaiseEvent(set);
        }
    }
    function setSelectable(set) {

        //Selectable
        var outerContainer = set.items[0];
        outerContainer.click(function (e) {
            select(set, e.shiftKey);
        });

        //Hoverable
        var primaryElement = outerContainer.data("children")[0];
        var glow = null;
        outerContainer.mouseover(function (e) {
            if (glow == null) {
                glow = primaryElement.glow(styles.types.common.hoverGlow);
                outerContainer.data("glow", glow);
            }
        }).mouseout(function (e) {
            if (glow != null) {
                glow.remove();
                glow = null;
            }
        });
    }

    //Private methods
    function updateRaphaelFeature(set, name, description) {
        var dataObj = set.items[0].data("dataObj");
        if (name != undefined)
            dataObj.Name = name;
        if (description != undefined)
            dataObj.Description = description;

        //Set text
        set.items[0].data("children")[1].attr({ text: dataObj.Name });
    }
    function createRaphaelFeature(dataObj, x, y) {

        //Variables/initializations
        var set = _canvas.set();
        var outerContainer = null;
        x = x == undefined ? 40.5 : x;
        y = y == undefined ? 40.5 : y;
        var boxWidth = 100, boxHeight = 30;

        //Create inner elements
        var box = _canvas.rect(x, y, boxWidth, boxHeight, 0).attr(styles.types.feature.unselected.primaryElement);
        var text = _canvas.text(boxWidth / 2 + x, boxHeight / 2 + y, dataObj.Name).attr(styles.types.feature.unselected.text);

        //Create outerContainer
        outerContainer = _canvas.rect(x, y, boxWidth, boxHeight, 0).attr(objectTypes.common.outerContainer);
        outerContainer
            .data("type", objectTypes.feature.typeName)
            .data("dataObj", dataObj)
            .data("selected", false)
            .data("children", [box, text])
            .data("relations", new Array());
        set.push(outerContainer);

        //Selectable
        setSelectable(set);

        //Editable
        outerContainer.dblclick(function (e) {
            var bb1 = this.getBBox();
            var xoffset = 13, yoffset = boxHeight + 15;
            var textinput = $("<input class='Inputbox' type='text' />").appendTo(_canvasContainer).css({
                position: "absolute",
                left: bb1.x + xoffset,
                top: bb1.y + yoffset,
                width: 90,
                height: 20
            }).bind("change", function () {
                var newName = $(this).val();
                dataObj.Name = newName;
                _this.UpdateElement(set, dataObj);
                $(this).remove();
            }).bind("keypress", function (e) {
                if (e.which == 13) {
                    var newName = $(this).val();
                    dataObj.Name = newName;
                    _this.UpdateElement(set, dataObj);
                    $(this).remove();
                }
                else if (e.which == 27) {
                    $(this).remove();
                }
            }).bind("blur", function (e) {
                $(this).remove();
            });
            $(textinput).val(dataObj.Name).select();

            select(set);
        });

        //Drag and droppable
        var start = function () {
            outerContainer.originalx = outerContainer.attr("x");
            outerContainer.originaly = outerContainer.attr("y");

            for (var i = 0; i < outerContainer.data("children").length; i++) {
                var childElem = outerContainer.data("children")[i];
                childElem.originalx = childElem.attr("x");
                childElem.originaly = childElem.attr("y");
            }
        };
        move = function (dx, dy) {
            var glow = outerContainer.data("glow");
            if (glow != null) {
                glow.remove();
                outerContainer.data("glow", null)
            }
            outerContainer.attr({ x: outerContainer.originalx + dx, y: outerContainer.originaly + dy });

            //Move child elements
            for (var i = 0; i < outerContainer.data("children").length; i++) {
                var childElem = outerContainer.data("children")[i];
                childElem.attr({ x: childElem.originalx + dx, y: childElem.originaly + dy });
            }

            //Refresh relations
            for (var j = 0; j < outerContainer.data("relations").length; j++) {
                var rel = outerContainer.data("relations")[j];
                refreshRaphaelRelation(rel);
            }


        };
        up = function () {
        };
        outerContainer.drag(move, start, up);

        return set;
    }
    function updateRaphaelRelation(set, relationType) {
        //
        var dataObj = set.items[0].data("dataObj");
        var relationSubType = getSubTypeByID(objectTypes.relation.subTypes, relationType);

        //Update relationType data
        dataObj.RelationType = relationType;

        //Update visuals
        set.items[0].data("children")[1].attr(relationSubType.circleAttr); //circle
    }
    function createRaphaelRelation(setA, setB, dataObj, relationType) {

        //Variables/initializations
        var set = _canvas.set();
        var outerContainer = null;
        var pathInfo = getPath(setA, setB);

        //Create inner elements
        var line = _canvas.path(pathInfo.path).attr(styles.types.relation.unselected.primaryElement);
        var circle = _canvas.circle(pathInfo.endPoint.x, pathInfo.endPoint.y, 6).attr(styles.types.relation.unselected.circle);
        circle.attr(objectTypes.relation.subTypes[relationType].circleAttr);

        //Create outerContainer
        outerContainer = _canvas.path(pathInfo.path).attr(objectTypes.common.outerContainer);
        outerContainer
            .data("type", objectTypes.relation.typeName)
            .data("dataObj", dataObj)
            .data("selected", false)
            .data("children", [line, circle])
            .data("pathInfo", pathInfo);
        set.push(outerContainer);

        //Selectable
        setSelectable(set);

        //Add reference to setA and setB
        setA.items[0].data("relations").push(set);
        setB.items[0].data("relations").push(set);

        return set;
    }
    function refreshRaphaelRelation(relationSet) {

        //
        var outerContainer = relationSet.items[0];
        var originalPathInfo = outerContainer.data("pathInfo");

        //
        var newPath = getPath(originalPathInfo.startObj, originalPathInfo.endObj);
        var line = outerContainer.data("children")[0];
        var circle = outerContainer.data("children")[1];

        //Refresh 
        outerContainer.attr({ path: newPath.path });
        line.attr({ path: newPath.path });
        circle.attr({ cx: newPath.endPoint.x, cy: newPath.endPoint.y });

    }

    //Public methods
    this.AddFeature = function (dataObj) {

        //Create and set a mouseover handler
        $(_canvasContainer).css("cursor", "crosshair");
        var wireframebox = null;
        var mousemoveHandler = function (e) {
            var posx = e.pageX - $(document).scrollLeft() - $(_canvasContainer).offset().left + 0.5;
            var posy = e.pageY - $(document).scrollTop() - $(_canvasContainer).offset().top + 0.5;
            if (wireframebox == null) {
                wireframebox = _canvas.rect(posx, posy, 100, 30, 0).attr(styles.types.feature.wireframe);
            }
            else {
                wireframebox.attr({ x: posx, y: posy });
            }
        };
        $(_canvasContainer).bind("mousemove", mousemoveHandler);

        //Create and set a click handler
        var clickHandler = function (e) {
            var posx = e.pageX - $(document).scrollLeft() - $(_canvasContainer).offset().left + 0.5;
            var posy = e.pageY - $(document).scrollTop() - $(_canvasContainer).offset().top + 0.5;
            var set = createRaphaelFeature(dataObj, posx, posy);


            //
            $(_canvasContainer).unbind("click", clickHandler);
            $(_canvasContainer).unbind("mousemove", mousemoveHandler);
            $(_canvasContainer).css("cursor", "default");
            wireframebox.remove();

            //Raise event
            _this.OnFeatureAdded.RaiseEvent(set);
        };
        $(_canvasContainer).bind("click", clickHandler);
    }
    this.AddRelation = function (setA, setB, dataObj) {

        var set = createRaphaelRelation(setA, setB, dataObj, "mandatory");

    }
    this.UpdateElement = function (set, updatedDataObj) {
        var type = set.items[0].data("type");
        switch (type) {
            case "feature":
                updateRaphaelFeature(set, updatedDataObj.Name, updatedDataObj.Description);
                break;

            case "relation":
                updateRaphaelRelation(set, updatedDataObj.RelationType);
                break;
        }

        //Raise event
        _this.OnElementUpdated.RaiseEvent(set);
    }

    //Events
    this.OnFeatureAdded = new Event();
    this.OnElementUpdated = new Event();
    this.OnElementSelected = new Event();
    this.OnElementDeselected = new Event();
    this.OnAllElementsDeselected = new Event();
}

//Events
var Event = function () {

    //Fields
    var _Handlers = new Array();

    //Methods
    this.AddHandler = function (handler) {
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
        func(args);
    }
}
