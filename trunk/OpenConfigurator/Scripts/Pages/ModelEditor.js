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
                    fill: "#E1E9FF",
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
                    fill: "#E1E9FF",
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
        },
        groupRelation: {
            unselected: {
                primaryElement: {
                    stroke: "#666666",
                    fill: "none",
                    "stroke-width": 1
                },
                box: {
                    stroke: "#666666"
                }
            },
            selected: {
                primaryElement: {
                    stroke: "black",
                    fill: "none",
                    "stroke-width": 2
                },
                box: {
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
var objectTypes = {
    common: {
        wrapper: {
            opacity: 0
        },
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
    },
    groupRelation: {
        typeName: "relation",
        subTypes: {
            or: {
                subTypeName: "or",
                typeID: 1,
                boxAttr: {
                    fill: "black",
                    opacity: 1
                }
            },
            xor: {
                subTypeName: "xor",
                typeID: 2,
                boxAttr: {
                    fill: "black",
                    opacity: 1
                }
            },
            cardinal: {
                subTypeName: "cardinal",
                typeID: 2,
                boxAttr: {
                    fill: "black",
                    opacity: 1
                }
            }
        }
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

//UIObjects
var UIFeature = function (diagramContext, dataObj, x, y) {

    //Fields
    var _diagramContext = diagramContext;
    var _outerElement = null;
    var _innerElements = {}, _connections = [];
    var _selected = false;
    var _dataObj = dataObj;
    var _glow = null;
    var _thisUIFeature = this;

    //Properties
    this.GetDataObj = function () {
        return _dataObj;
    }

    //Private methods
    var makeSelectable = function () {

        //Selectable
        _outerElement.click(function (e) {
            _thisUIFeature.Select();
        });

        //Hoverable
        _outerElement.mouseover(function (e) {
            if (_glow == null) {
                _glow = _innerElements.box.glow(styles.types.common.hoverGlow);
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

            //Refresh connections
            //            for (var j = 0; j < uiElements[0].data("relations").length; j++) {
            //                var rel = uiElements[0].data("relations")[j];
            //                refreshRaphaelRelation(rel);
            //            }
        };
        up = function () {
        };
        _outerElement.drag(move, start, up);
    }
    var makeEditable = function () {
        _outerElement.dblclick(function (e) {
            var bb1 = this.getBBox();
            var xoffset = 13, yoffset = boxHeight + 15;
            var textinput = $("<input class='Inputbox' type='text' />").appendTo(_diagramContext.GetCanvasContainer()).css({
                position: "absolute",
                left: bb1.x + xoffset,
                top: bb1.y + yoffset,
                width: 90,
                height: 20
            }).bind("change", function () {
                var newName = $(this).val();
                _thisUIFeature.Update(newName);
                $(this).remove();
            }).bind("keypress", function (e) {
                if (e.which == 13) { //Enter
                    var newName = $(this).val();
                    _thisUIFeature.Update(newName);
                    $(this).remove();
                }
                else if (e.which == 27) { //Escape
                    $(this).remove();
                }
            }).bind("blur", function (e) {
                $(this).remove();
            });
            $(textinput).val(_dataObj.Name).select();
            _thisUIFeature.Select();
        });
    }

    //Public methods
    this.CreateGraphicalRepresentation = function () {
        //
        var box = null, text = null;
        x = x == undefined ? 40.5 : x;
        y = y == undefined ? 40.5 : y;
        var boxWidth = 100, boxHeight = 30;


        //Create inner elements
        box = _diagramContext.GetCanvas().rect(x, y, boxWidth, boxHeight, 0).attr(styles.types.feature.unselected.primaryElement);
        text = _diagramContext.GetCanvas().text(boxWidth / 2 + x, boxHeight / 2 + y, dataObj.Name).attr(styles.types.feature.unselected.text);
        _innerElements.box = box;
        _innerElements.text = text;

        //Create the main outer element
        _outerElement = _diagramContext.GetCanvas().rect(x, y, boxWidth, boxHeight, 0).attr(objectTypes.common.outerContainer);
        _outerElement
            .data("innerElements", [box, text])
            .data("connections", new Array());

        //Setup 
        makeSelectable();
        makeDraggable();
        makeEditable();
    }
    this.Select = function () {
        _innerElements.box.attr(styles.types.feature.selected.primaryElement);
    }
    this.Update = function (name) {
        _dataObj.Name = name;
        //_dataObj.Description = newDataObj.Description;
        //_dataObj.Attributes = newDataObj.Attributes;

        //Set text
        _innerElements.text.attr({ text: _dataObj.Name });
    }
}
var UIRelation = function (diagramContext, dataObj, parentFeature, childFeature) {
    //Fields
    var _diagramContext = diagramContext;
    var _outerElement = null;
    var _innerElements = {};
    var _selected = false;
    var _dataObj = dataObj;
    var _glow = null;
    var _thisUIRelation = this;

}

//Components
var PropertiesComponent = function (container, diagramContext, getDefaultAttribute) {

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

                    //Call handler
                    onDataChanged();
                    if (onChangedCallBack != undefined) onChangedCallBack(newVal);
                }).bind("keypress", function (e) {
                    if (e.which == 13) {
                        var newVal = control.val();
                        dataObjParent[dataObjFieldName] = newVal;

                        //Call handler
                        onDataChanged();
                        if (onChangedCallBack != undefined) onChangedCallBack(newVal);
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

                    //Call handler
                    onDataChanged();
                    if (onChangedCallBack != undefined) onChangedCallBack(newVal);
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

                    //Call handler
                    onDataChanged();
                    if (onChangedCallBack != undefined) onChangedCallBack(newVal);
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
                    dataObjParent[dataObjFieldName] = newVal;

                    //Call handler
                    onDataChanged();
                    if (onChangedCallBack != undefined) onChangedCallBack(newVal);
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
                var listInnerContainer = $("<div class='ListInnerContainer'></div>").appendTo(listContainer);
                var listActionsDiv = $("<div class='ListActionsDiv'></div>").appendTo(listContainer);
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
                                subFieldControl = controlTypes[subField.controlType].createControlHTML(dataObjParent[dataObjFieldName][index], subField.dataName, subField, function (newVal) {
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
                        for (var subFieldKey in objectTypeField.subFields) {
                            var subField = objectTypeField.subFields[subFieldKey];
                            var subFieldControl = $(detailsContainer).find("[subField='" + subField.dataName + "']");

                            controlTypes[subField.controlType].loadData(subFieldControl, dataObjParent[dataObjFieldName][index], subField.dataName, subField);
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

    //Fields and variables
    var _container = container;
    var _diagramContext = diagramContext;
    var _currentElemWrapper = null, _currentDataObj = null, _currentElemType = null;

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
        for (var areaKey in objectTypes[_currentElemType].areas) {

            //Create an html area
            var area = objectTypes[_currentElemType].areas[areaKey];
            var areaInnerContainer = createSectionArea(area.displayTitle, area.tableLayout);

            //Go through each field in the Area
            for (var fieldKey in area.fields) {

                //Create a control
                var field = area.fields[fieldKey];
                var control = controlTypes[field.controlType].createControlHTML(_currentDataObj, field.dataName, field, onDataChanged);
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
                controlTypes[field.controlType].loadData(control, _currentDataObj, field.dataName, field, onDataChanged);
            }
        }

        //Special hack
        $(_mainContainer).children(".AreaDiv:gt(0)").css("margin-top", "10px");
    }
    var onDataChanged = function () {
        _diagramContext.UpdateElement(_currentElemWrapper, _currentDataObj);
    }
    var clearUI = function () {
        $(_mainContainer).html("");
        $(_headerLabel).text("");
    }

    //Public methods
    this.LoadProperties = function (elemWrapper) {

        //Variables
        _currentElemWrapper = elemWrapper;
        _currentElemType = elemWrapper.data("type");
        _currentDataObj = jQuery.extend(true, {}, elemWrapper.data("dataObj"));

        //Setup UI
        clearUI();
        loadUI();
        $(_headerLabel).text("(" + _currentElemType + ")");
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

    //Fields
    var _this = this;
    var _canvas = null, _canvasContainer = canvasContainer;
    var _selectedElements = new Array();

    //Properties
    this.SelectedElements = _selectedElements;
    this.GetCanvas = function () {
        return _canvas;
    }
    this.GetCanvasContainer = function () {
        return _canvasContainer;
    }

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
    function deselect(elemWrapper) {
        var isSelected = elemWrapper.data("selected");
        if (isSelected) {
            elemWrapper.data("selected", false);
            var type = elemWrapper.data("type");

            //Select innerElements uiElementWrapper
            var uiElements = elemWrapper.data("uiElements");
            for (var i = 0; i < uiElements.length; i++) {
                var uiElement = uiElements[i];
                uiElement.data("innerElements")[0].attr(styles.types[type].unselected.primaryElement);
            }

            //Remove from selectedElements collection
            var index = $(_selectedElements).index(elemWrapper);
            _selectedElements.splice(index, 1);
            if (_selectedElements.length == 0) {
                _this.OnAllElementsDeselected.RaiseEvent(elemWrapper);
            }

            //Raise event
            _this.OnElementDeselected.RaiseEvent(elemWrapper);
        }
    }
    function select(UIObject, shift) {
        if (!UIObject.selected) {
            UIObject.selected = false;

            //Deselect everything
            if (shift == false) {
                deselectAll();
            }

            //Select current uiElementWrapper
            var uiElements = elemWrapper.data("uiElements");
            for (var i = 0; i < uiElements.length; i++) {
                var uiElement = uiElements[i];
                uiElement.data("innerElements")[0].attr(styles.types[type].selected.primaryElement);
            }

            //Raise event
            _selectedElements.push(elemWrapper);
            _this.OnElementSelected.RaiseEvent(elemWrapper);
        }
    }
    function setSelectable(elemWrapper) {

        //Go through all outerContainers in the set
        var uiElements = elemWrapper.data("uiElements");
        for (var i = 0; i < uiElements.length; i++) {

            //Selectable
            uiElements[i].click(function (e) {
                select(elemWrapper, e.shiftKey);
            });

            //Hoverable
            var primaryElement = uiElements[i].data("innerElements")[0];
            var glow = null;
            uiElements[i].mouseover(function (e) {
                if (glow == null) {
                    glow = primaryElement.glow(styles.types.common.hoverGlow);
                    uiElements[0].data("glow", glow);
                }
            }).mouseout(function (e) {
                if (glow != null) {
                    glow.remove();
                    glow = null;
                }
            });
        }
    }

    //Feature methods
    function updateRaphaelFeature(elemWrapper, name, description, attributes) {
        var dataObj = elemWrapper.data("dataObj");
        if (name != undefined)
            dataObj.Name = name;
        if (description != undefined)
            dataObj.Description = description;
        if (attributes != undefined)
            dataObj.Attributes = attributes;

        //Set text
        elemWrapper.data("uiElements")[0].data("innerElements")[1].attr({ text: dataObj.Name });
    }
    function createRaphaelFeature(dataObj, x, y) {

        //Variables/initializations
        var uiElementWrapper = _canvas.rect(x, y, 1, 1, 0).attr(objectTypes.common.wrapper);
        var uiElements = [];
        x = x == undefined ? 40.5 : x;
        y = y == undefined ? 40.5 : y;
        var boxWidth = 100, boxHeight = 30;

        //Create wrapper
        uiElementWrapper
            .data("type", objectTypes.feature.typeName)
            .data("uiElements", uiElements)
            .data("dataObj", dataObj)
            .data("selected", false);

        //Create inner elements
        var box = _canvas.rect(x, y, boxWidth, boxHeight, 0).attr(styles.types.feature.unselected.primaryElement);
        var text = _canvas.text(boxWidth / 2 + x, boxHeight / 2 + y, dataObj.Name).attr(styles.types.feature.unselected.text);

        //Create uiElement(s)
        uiElements[0] = _canvas.rect(x, y, boxWidth, boxHeight, 0).attr(objectTypes.common.outerContainer);
        uiElements[0]
            .data("innerElements", [box, text])
            .data("relations", new Array());

        //Selectable & Editable
        setSelectable(uiElementWrapper);
        uiElements[0].dblclick(function (e) {
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
                _this.UpdateElement(uiElementWrapper, dataObj);
                $(this).remove();
            }).bind("keypress", function (e) {
                if (e.which == 13) {
                    var newName = $(this).val();
                    dataObj.Name = newName;
                    _this.UpdateElement(uiElementWrapper, dataObj);
                    $(this).remove();
                }
                else if (e.which == 27) {
                    $(this).remove();
                }
            }).bind("blur", function (e) {
                $(this).remove();
            });
            $(textinput).val(dataObj.Name).select();

            select(uiElementWrapper);
        });

        //Drag and droppable
        var start = function () {
            uiElements[0].originalx = uiElements[0].attr("x");
            uiElements[0].originaly = uiElements[0].attr("y");

            for (var i = 0; i < uiElements[0].data("innerElements").length; i++) {
                var childElem = uiElements[0].data("innerElements")[i];
                childElem.originalx = childElem.attr("x");
                childElem.originaly = childElem.attr("y");
            }
        };
        move = function (dx, dy) {
            var glow = uiElements[0].data("glow");
            if (glow != null) {
                glow.remove();
                uiElements[0].data("glow", null);
            }
            uiElements[0].attr({ x: uiElements[0].originalx + dx, y: uiElements[0].originaly + dy });

            //Move child elements
            for (var i = 0; i < uiElements[0].data("innerElements").length; i++) {
                var childElem = uiElements[0].data("innerElements")[i];
                childElem.attr({ x: childElem.originalx + dx, y: childElem.originaly + dy });
            }

            //Refresh relations
            for (var j = 0; j < uiElements[0].data("relations").length; j++) {
                var rel = uiElements[0].data("relations")[j];
                refreshRaphaelRelation(rel);
            }
        };
        up = function () {
        };
        uiElements[0].drag(move, start, up);

        return uiElementWrapper;
    }

    //Relation methods
    function updateRaphaelRelation(elemWrapper, relationType) {
        //
        var dataObj = elemWrapper.data("dataObj");
        var relationSubType = getSubTypeByID(objectTypes.relation.subTypes, relationType);

        //Update relationType data
        dataObj.RelationType = relationType;

        //Update visuals
        elemWrapper.data("uiElements")[0].data("innerElements")[1].attr(relationSubType.circleAttr); //circle
    }
    function createRaphaelRelation(parentFeatureElem, childFeatureElem, dataObj, relationType) {

        //Variables/initializations
        var uiElementWrapper = _canvas.rect(0, 0, 1, 1, 0).attr(objectTypes.common.wrapper);
        var uiElements = [];

        //Create wrapper
        uiElementWrapper
            .data("type", objectTypes.relation.typeName)
            .data("uiElements", uiElements)
            .data("dataObj", dataObj)
            .data("selected", false);

        //Create inner elements
        var pathInfo = getPath(parentFeatureElem.data("uiElements")[0], childFeatureElem.data("uiElements")[0]);
        var line = _canvas.path(pathInfo.path).attr(styles.types.relation.unselected.primaryElement);
        var circle = _canvas.circle(pathInfo.endPoint.x, pathInfo.endPoint.y, 6).attr(styles.types.relation.unselected.circle);
        circle.attr(objectTypes.relation.subTypes[relationType].circleAttr);

        //Create uiElement(s)
        uiElements[0] = _canvas.path(pathInfo.path).attr(objectTypes.common.outerContainer);
        uiElements[0]
            .data("innerElements", [line, circle])
            .data("pathInfo", pathInfo);

        //Selectable
        setSelectable(uiElementWrapper);

        //Add reference to setA and setB
        parentFeatureElem.data("uiElements")[0].data("relations").push(uiElementWrapper);
        childFeatureElem.data("uiElements")[0].data("relations").push(uiElementWrapper);

        return uiElementWrapper;
    }
    function refreshRaphaelRelation(relElemWrapper) {

        //
        var uiElement = relElemWrapper.data("uiElements")[0];
        var originalPathInfo = uiElement.data("pathInfo");

        //
        var newPath = getPath(originalPathInfo.startObj, originalPathInfo.endObj);
        var line = uiElement.data("innerElements")[0];
        var circle = uiElement.data("innerElements")[1];

        //Refresh 
        uiElement.attr({ path: newPath.path });
        line.attr({ path: newPath.path });
        circle.attr({ cx: newPath.endPoint.x, cy: newPath.endPoint.y });
    }

    //RelationGroup methods
    function createRaphaelGroupRelation(parentFeatureElem, childFeatureElements, dataObj, groupRelationType) {

        //Variables/initializations
        var uiElementWrapper = _canvas.rect(0, 0, 1, 1, 0).attr(objectTypes.common.wrapper);
        var uiElements = [];

        //Create wrapper
        uiElementWrapper
            .data("type", objectTypes.groupRelation.typeName)
            .data("uiElements", uiElements)
            .data("dataObj", dataObj)
            .data("selected", false);

        //Create connections for each child feature
        for (var i = 0; i < childFeatureElements.length; i++) {
            var pathInfo = getPath(parentFeatureElem.data("uiElements")[0], childFeatureElements[i].data("uiElements")[0]);
            var line = _canvas.path(pathInfo.path).attr(styles.types.groupRelation.unselected.primaryElement);
            childFeatureElements[i].data("uiElements")[0].data("relations").push(uiElementWrapper);
        }

        //Add reference to parentSet
        parentFeatureElem.data("uiElements")[0].data("relations").push(uiElementWrapper);

        //
        return uiElementWrapper;
    }

    //Public methods
    this.AddFeature = function (dataObj) {
        var _thisContextDiagram = this;

        //Create wireframe
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

        //Create actual Feature on click
        var clickHandler = function (e) {
            var posx = e.pageX - $(document).scrollLeft() - $(_canvasContainer).offset().left + 0.5;
            var posy = e.pageY - $(document).scrollTop() - $(_canvasContainer).offset().top + 0.5;
            var newUIFeature = new UIFeature(_thisContextDiagram, dataObj, posx, posy);
            newUIFeature.CreateGraphicalRepresentation();

            //
            $(_canvasContainer).unbind("click", clickHandler);
            $(_canvasContainer).unbind("mousemove", mousemoveHandler);
            $(_canvasContainer).css("cursor", "default");
            wireframebox.remove();
        };
        $(_canvasContainer).bind("click", clickHandler);
    }
    this.AddRelation = function (parentElemWrapper, childElemWrapper, dataObj) {
        createRaphaelRelation(parentElemWrapper, childElemWrapper, dataObj, "mandatory");
    }
    this.AddGroupRelation = function (parentSet, childSets, dataObj) {
        var set = createRaphaelGroupRelation(parentSet, childSets, dataObj, "or");
    }
    this.UpdateElement = function (elemWrapper, updatedDataObj) {
        var type = elemWrapper.data("type");
        switch (type) {
            case "feature":
                updateRaphaelFeature(elemWrapper, updatedDataObj.Name, updatedDataObj.Description, updatedDataObj.Attributes);
                break;

            case "relation":
                updateRaphaelRelation(elemWrapper, updatedDataObj.RelationType);
                break;
        }

        //Raise event
        _this.OnElementUpdated.RaiseEvent(elemWrapper);
    }

    //Events
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
