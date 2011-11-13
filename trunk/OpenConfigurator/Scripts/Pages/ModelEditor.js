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
    common: {
        outerContainer: {
            stroke: "black",
            fill: "black",
            "stroke-width": 10,
            opacity: 0,
            cursor: "default"
        }
    },
    types: {
        feature: {
            typeName: "feature",
            subTypes: {
                standard: {
                    subTypeName: "standard"
                }
            }
        },
        relation: {
            typeName: "relation",
            subTypes: {
                mandatory: {
                    subTypeName: "mandatory",
                    typeID : 1,
                    circleAttr: {
                        fill: "black",
                        opacity: 1
                    }
                },
                optional: {
                    subTypeName: "optional",
                    typeID : 2,
                    circleAttr: {
                        fill: "#fff7d7",
                        opacity: 1
                    }

                },
                cloneable: {
                    subTypeName: "cloneable",
                    typeID : 3,
                    circleAttr: {
                        fill: "#fff7d7",
                        opacity: 0
                    }

                }
            }

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

    //Fields and variables
    var _container = container;
    var _diagramContext = diagramContext;
    var _innerTBody = $(container).find("tbody");
    var _headerLabel = $(container).find("#SetTypeLabel");
    var _currentSet = null;
    var _controls = {};

    //Private fields and methods
    var modes = {
        feature: {
            createUIControls: function () {

                //Create controls
                createControlWithRow("Root Feature", "IsRoot", "checkbox", true);
                createControlWithRow("Name", "Name", "textbox", false);
                createControlWithRow("Description", "Description", "textarea", false);

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
            },
            loadData: function () {
                var dataObj = _currentSet.items[0].data("dataObj");
                _controls["IsRoot"].attr("checked", dataObj.IsRoot);
                _controls["Name"].val(dataObj.Name);
                _controls["Description"].val(dataObj.Description);

            },
            updateData: function () {
                var name = _controls["Name"].val();
                var description = _controls["Description"].val();
                _diagramContext.UpdateFeature(_currentSet, name, description);
            }
        },
        relation: {
            createUIControls: function () {

                //Create controls
                var relationTypeDropdown = createControlWithRow("Type", "RelationType", "dropdown", false);
                var options = [{ val: 1, label: "Mandatory" }, { val: 2, label: "Optional" }, { val: 3, label: "Cloneable"}];
                for (var i = 0; i < options.length; i++) {
                    var optionCtrl = $("<option value='" + options[i].val + "'>" + options[i].label + "</option>").appendTo(relationTypeDropdown);
                }

                relationTypeDropdown.bind("change", function () {
                    modes.relation.updateData();
                })

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
    };
    var createControlWithRow = function (label, fieldName, controlType, disabled) {

        //Standard html
        var row = $("<tr></tr>");
        var labelTD = $("<td></td>").appendTo(row);
        var label = $("<span class='Label-Small'>" + label + "</span>").appendTo(labelTD);

        //Control specific html
        var controlTD = $("<td></td>").appendTo(row);
        var control = null;
        switch (controlType) {
            case "textbox":
                control = $("<input class='Textbox' type='text' />");
                break;
            case "textarea":
                control = $("<textarea class='Textarea'></textarea>");
                break;
            case "checkbox":
                control = $("<input class='Checkbox' type='checkbox' />");
                break;
            case "dropdown":
                control = $("<select class='Dropdown' />");
                break;

        }
        control.attr("fieldName", fieldName).attr("id", fieldName + "Control");
        if (disabled)
            control.attr("disabled", "disabled");
        _controls[fieldName] = control;
        control.appendTo(controlTD);
        row.appendTo(_innerTBody);

        //
        return control;
    }
    var clearUI = function () {
        for (var key in _controls) {
            var ctrl = _controls[key];
            $(ctrl).remove();
            delete _controls[key];
        }
        $(_innerTBody).html("");
        $(_headerLabel).text("");
    }

    //Public methods
    this.LoadProperties = function (set) {

        //Variables
        _currentSet = set;
        var type = _currentSet.items[0].data("type");

        //Setup UI
        clearUI();
        modes[type].createUIControls();

        //Load data
        $(_headerLabel).text("(" + type + ")");
        modes[type].loadData();
    }
    this.Clear = function () {

        clearUI();
    }

}
var DiagramContext = function (canvasContainer) {

    //Fields
    var _this = this;
    var _canvas = null, _canvasContainer = canvasContainer;
    var _selectedElements = new Array();
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
    var _fixedOrientation = orientations.horizontal.name;

    //Properties
    this.SelectedElements = _selectedElements;

    //Constructor/Initalizers
    this.Initialize = function () {
        _canvas = Raphael(canvasContainer, "100%", "100%");

        //Handlers
        $(_canvasContainer).click(function () {
        })

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
        if (_fixedOrientation != false) {
            currentOrientation = _fixedOrientation; //use default fixed orientation without calculating angle
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
    function deselect(set) {
        var isSelected = set.items[0].data("selected");
        if (isSelected) {
            var outerContainer = set.items[0];
            var type = outerContainer.data("type");

            outerContainer.data("children")[0].attr(styles.types[type].unselected.primaryElement);
            outerContainer.data("selected", false);

            //Remove from selectedElements collection
            var index = $(_selectedElements).index(outerContainer);
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
            var outerContainer = set.items[0];
            var type = outerContainer.data("type");

            outerContainer.data("children")[0].attr(styles.types[type].selected.primaryElement);
            outerContainer.data("selected", true);

            if (shift != true) {
                //Deselect everything else and save element into selectedElements collection
                for (var i = 0; i < _selectedElements.length; i++) {
                    var selElem = _selectedElements[i];
                    deselect(selElem);
                }
            }

            //Raise event
            _selectedElements.push(set);
            _this.OnElementSelected.RaiseEvent(set);
        }
    }
    function setSelectable(set) {
        var outerContainer = set.items[0];
        outerContainer.click(function (e) {
            toggleSelect(set, e.shiftKey);
        })
    }

    //Private methods
    function toggleSelect(set, shift) {
        var isSelected = set.items[0].data("selected");
        if (!isSelected) {
            select(set, shift);
        }
        else if (isSelected) {
            deselect(set);
        }
    }
    function updateRaphaelFeature(set, name, description) {
        var dataObj = set.items[0].data("dataObj");
        if (name != undefined)
            dataObj.Name = name;
        if (description != undefined)
            dataObj.Description = description;

        //
        set.items[0].data("children")[1].attr({ text: dataObj.Name }); //text
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
        outerContainer = _canvas.rect(x, y, boxWidth, boxHeight, 0).attr(settings.common.outerContainer);
        outerContainer
            .data("type", settings.types.feature.typeName)
            .data("dataObj", dataObj)
            .data("selected", false)
            .data("children", [box, text])
            .data("relations", new Array());
        set.push(outerContainer);

        //Selectable + Editable
        var glow = null;
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
                _this.select
                _this.UpdateFeature(set, newName);
                $(this).remove();
            }).bind("keypress", function (e) {
                if (e.which == 13) {
                    var newName = $(this).val();
                    _this.UpdateFeature(set, newName);
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

        //Hover effect
        outerContainer.mouseover(function (e) {
            if (glow != null)
                glow.remove();
            glow = box.glow(styles.types.common.hoverGlow);
        }).mouseout(function (e) {
            glow.remove();
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

            if (glow != null)
                glow.remove();
        };
        up = function () {
            if (glow != null)
                glow.remove();
            glow = box.glow(styles.types.common.hoverGlow);
        };
        outerContainer.drag(move, start, up);

        return set;
    }
    function updateRaphaelRelation(set, relationType) {
        var dataObj = set.items[0].data("dataObj");
        if (relationType != undefined)
            dataObj.RelationType = settings.types.relation.subTypes[relationType].typeID;

        //
        set.items[0].data("children")[1].attr(settings.types.relation.subTypes[relationType].circleAttr); //circle
    }
    function createRaphaelRelation(setA, setB, dataObj, relationType) {

        //Variables/initializations
        var set = _canvas.set();
        var outerContainer = null;
        var pathInfo = getPath(setA, setB);

        //Create inner elements
        var line = _canvas.path(pathInfo.path).attr(styles.types.relation.unselected.primaryElement);
        var circle = _canvas.circle(pathInfo.endPoint.x, pathInfo.endPoint.y, 6).attr(styles.types.relation.unselected.circle);
        circle.attr(settings.types.relation.subTypes[relationType].circleAttr);

        //Create outerContainer
        outerContainer = _canvas.path(pathInfo.path).attr(settings.common.outerContainer);
        outerContainer
            .data("type", settings.types.relation.typeName)
            .data("dataObj", dataObj)
            .data("selected", false)
            .data("children", [line, circle])
            .data("pathInfo", pathInfo);
        set.push(outerContainer);

        //Add reference to setA and setB
        setA.items[0].data("relations").push(set);
        setB.items[0].data("relations").push(set);

        //Selectable
        var glow = null;
        outerContainer.mouseover(function (e) {
            if (glow != null)
                glow.remove();
            glow = line.glow(styles.types.common.hoverGlow);
        }).mouseout(function (e) {
            if (glow != null)
                glow.remove();
        });

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
    function deselectAll() {
        for (var i = 0; i < _selectedElements.length; i++) {
            var selElem = _selectedElements[i];
            deselect(selElem);
        }

        _this.OnAllElementsDeselected.RaiseEvent();
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
            setSelectable(set);

            //
            $(_canvasContainer).unbind();
            $(_canvasContainer).css("cursor", "default");
            wireframebox.remove();

            //Raise event
            _this.OnFeatureAdded.RaiseEvent(set);
        };
        $(_canvasContainer).bind("click", clickHandler);
    }
    this.AddRelation = function (setA, setB, dataObj) {
    this.UpdateFeature = function (set, name, description) {
        updateRaphaelFeature(set, name, description);

        //Raise event
        _this.OnFeatureUpdated.RaiseEvent(set);
    }
    this.UpdateRelation = function (set, relationType) {
        updateRaphaelRelation(set, relationType);

        //Raise event
        _this.OnFeatureUpdated.RaiseEvent(set);
    }
        var set = createRaphaelRelation(setA, setB, dataObj, "mandatory");
        setSelectable(set);
    }

    //Events
    this.OnFeatureAdded = new Event();
    this.OnFeatureUpdated = new Event();
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
