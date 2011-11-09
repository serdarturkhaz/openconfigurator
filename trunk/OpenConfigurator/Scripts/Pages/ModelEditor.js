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
            }
        },
        relation: {
            unselected: {
                primaryElement: {
                    stroke: "black",
                    fill: "none",
                    "stroke-width": 1
                },
                circle: {
                    stroke: "black",
                    fill: "black"
                }
            },
            selected: {
                primaryElement: {
                    stroke: "black",
                    fill: "none",
                    "stroke-width": 2
                },
                circle: {
                    stroke: "black",
                    fill: "black"
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
            opacity: 0
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
                    circleAttr: {

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
var PropertiesComponent = function (container) {

    //Fields
    var _container = container;
    var _innerTBody = $(container).find("tbody");
    var _currentSet = null;
    var _controls = {};


    //Private fields and methods
    var modes = {
        feature: {
            fields: {
                Name: {
                    controlType: "text",
                    validation: "",
                    label: "Name"
                }
            },
            createUI: function () {
                //Create controls
                var nameTextboxRow = createControlWithRow("Name", "textInput").appendTo(_innerTBody);
                var descriptionTextAreaRow = createControlWithRow("Description", "textArea").appendTo(_innerTBody);
            },
            loadData: function () {
                var dataObj = _currentSet.items[0].data("dataObj");
                _controls["Name"].val(dataObj.Name);
                _controls["Description"].val(dataObj.Description);
            },
            updateData: function () {
                for (var ctrl in _controls) {

                }
            }
        }
    };
    var createControlWithRow = function (fieldName, type) {
        //Standard html
        var row = $("<tr></tr>");
        var labelTD = $("<td></td>").appendTo(row);
        var label = $("<span class='Label-Small'>" + fieldName + "</span>").appendTo(labelTD);

        //Control specific html
        var controlTD = $("<td></td>").appendTo(row);
        var control = null;
        switch (type) {
            case "textInput":
                control = $("<input disabled='disabled' class='Textbox' type='text' id='" + fieldName + "Textbox' />").attr("fieldName", fieldName);
                control.bind("change", function () {
                    var newVal = $(this).val();
                    //_currentSet.items[0].data("dataObj").Name = newVal;
                    //_currentSet.items[0].data("children")[1].attr({ text: newVal });
                });

                break;
            case "textArea":
                control = $("<textarea disabled='disabled' class='Textbox' id='" + fieldName + "Textarea'> </textarea>").attr("fieldName", fieldName);
                break;
        }
        _controls[fieldName] = control;
        control.appendTo(controlTD);

        //
        return row;
    }
    var clearControls = function () {
        for (var key in _controls) {
            var ctrl = _controls[key];
            $(ctrl).val("");
        }
    }
    var disableControls = function () {
        for (var key in _controls) {
            var ctrl = _controls[key];
            $(ctrl).attr("disabled", "disabled");
        }
    }
    var enableControls = function () {
        for (var key in _controls) {
            var ctrl = _controls[key];
            $(ctrl).removeAttr("disabled");
        }
    }

    //Constructor/Initalizers
    this.Initialize = function () {

        //Find controls
        modes.feature.createUI();


        //        //Event handlers
        //        nameTextbox.bind("change", function () {
        //            var newVal = $(this).val();
        //            _currentSet.items[0].data("dataObj").Name = newVal;
        //            _currentSet.items[0].data("children")[1].attr({ text: newVal });
        //        }).bind("keypress", function (event) {
        //            if (event.which == 13) {
        //                var newVal = $(this).val();
        //                _currentSet.items[0].data("dataObj").Name = newVal;
        //                _currentSet.items[0].data("children")[1].attr({ text: newVal });
        //            }
        //        });
    };

    //Public methods
    this.LoadProperties = function (set) {

        //
        enableControls();
        clearControls();

        //
        _currentSet = set;
        var type = _currentSet.items[0].data("type");
        modes[type].loadData();
    }
    this.Clear = function () {

        //
        disableControls();
        clearControls();
    }
}
var DiagramContext = function (canvasContainer) {

    //Fields
    var _this = this;
    var _canvas = null, _canvasContainer = canvasContainer;
    var _selectedElements = new Array();
    var _relations = new Array();

    //Properties
    this.SelectedElements = _selectedElements;

    //Constructor/Initalizers
    this.Initialize = function () {
        _canvas = Raphael(canvasContainer, "100%", "100%");

        //Handlers
        $(_canvasContainer).click(function () {
        })

    };

    //Private methods
    function getPath(objA, objB) {
        var bb1 = objA.getBBox();
        var bb2 = objB.getBBox();

        //Determine which edges of the Rectangles make the shortest path
        var connectionPoints = {
            firstObject: {
                top: { x: bb1.x + bb1.width / 2, y: bb1.y - 1 },
                left: { x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1 },
                bottom: { x: bb1.x - 1, y: bb1.y + bb1.height / 2 },
                right: { x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2 }
            },
            secondObject: {
                top: { x: bb2.x + bb2.width / 2, y: bb2.y - 1 },
                left: { x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1 },
                bottom: { x: bb2.x - 1, y: bb2.y + bb2.height / 2 },
                right: { x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2 }
            }
        };
        var p = [{ x: connectionPoints.firstObject.top.x, y: connectionPoints.firstObject.top.y },
        { x: connectionPoints.firstObject.left.x, y: connectionPoints.firstObject.left.y },
        { x: connectionPoints.firstObject.bottom.x, y: connectionPoints.firstObject.bottom.y },
        { x: connectionPoints.firstObject.right.x, y: connectionPoints.firstObject.right.y },

        { x: connectionPoints.secondObject.top.x, y: connectionPoints.secondObject.top.y },
        { x: connectionPoints.secondObject.left.x, y: connectionPoints.secondObject.left.y },
        { x: connectionPoints.secondObject.bottom.x, y: connectionPoints.secondObject.bottom.y },
        { x: connectionPoints.secondObject.right.x, y: connectionPoints.secondObject.right.y}];
        var d = {}, dis = [];
        for (var i = 0; i < 4; i++) {
            for (var j = 4; j < 8; j++) {
                var dx = Math.abs(p[i].x - p[j].x);
                var dy = Math.abs(p[i].y - p[j].y);

                if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
                    dis.push(dx + dy);
                    d[dis[dis.length - 1]] = [i, j];
                }
            }
        }

        //Dis - closest position
        if (dis.length == 0) {
            var res = [0, 4];
        } else {
            res = d[Math.min.apply(Math, dis)];
        }

        //Setup path from x1/y1 to x4/y4, with intermediary points in the middle (for curve) x2/y2
        var x1 = p[res[0]].x, y1 = p[res[0]].y;
        var x4 = p[res[1]].x, y4 = p[res[1]].y;
        dx = Math.max(Math.abs(x1 - x4) / 2, 10);
        dy = Math.max(Math.abs(y1 - y4) / 2, 10);
        var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3), y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3);
        var x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3), y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
        var path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(",");

        var returnObj = {
            path: path,
            startObj: objA,
            endObj: objB,
            startPoint: {
                x: x1,
                y: y1
            },
            endPoint: {
                x: x4,
                y: y4
            }
        };
        return returnObj;
    }
    function toggleSelect(set) {
        var isSelected = set.items[0].data("selected");
        if (!isSelected) {
            select(set);
        }
        else if (isSelected) {
            deselect(set);
        }
    }
    function deselect(set) {
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
    }
    function select(set) {
        var outerContainer = set.items[0];
        var type = outerContainer.data("type");

        outerContainer.data("children")[0].attr(styles.types[type].selected.primaryElement);
        outerContainer.data("selected", true);

        //Deselect everything else and save element into selectedElements collection
        //        for (var i = 0; i < _selectedElements.length; i++) {
        //            var selElem = _selectedElements[i];
        //            deselect(selElem);
        //        }

        //Raise event
        _selectedElements.push(set);
        _this.OnElementSelected.RaiseEvent(set);
    }
    function createRaphaelFeature(dataObj, subType) {

        //Variables/initializations
        var set = _canvas.set();
        var outerContainer = null;

        //Create inner elements
        var box = _canvas.rect(40.5, 40.5, 100, 30, 0).attr(styles.types.feature.unselected.primaryElement);
        var text = _canvas.text(90, 55, dataObj.Name).attr(styles.types.feature.unselected.text);

        //Create outerContainer
        outerContainer = _canvas.rect(40.5, 40.5, 100, 30, 0).attr(settings.common.outerContainer);
        outerContainer
            .data("type", settings.types.feature.typeName)
            .data("subType", subType)
            .data("dataObj", dataObj)
            .data("selected", false)
            .data("children", [box, text])
            .data("relations", new Array());
        set.push(outerContainer);

        //Selectable with hover effect
        var glow = null;
        outerContainer.click(function () {
            toggleSelect(set);
        }).mouseover(function (e) {
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
        };
        up = function () {
            glow.remove();
            glow = box.glow(styles.types.common.hoverGlow);
        };
        outerContainer.drag(move, start, up);

        return set;
    }
    function createRaphaelRelation(setA, setB, dataObj) {

        //Variables/initializations
        var set = _canvas.set();
        var outerContainer = null;
        var pathInfo = getPath(setA, setB);

        //Create inner elements
        var line = _canvas.path(pathInfo.path).attr(styles.types.relation.unselected.primaryElement);
        var circle = _canvas.circle(pathInfo.endPoint.x, pathInfo.endPoint.y, 6).attr(styles.types.relation.unselected.circle);

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
        outerContainer.click(function () {
            toggleSelect(set);
        }).mouseover(function (e) {
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
    this.AddFeature = function () {
        $.ajax({
            type: "POST",
            url: "/ModelEditor/NewDefaultFeature",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: {},
            success: function (featureObj) {
                var set = createRaphaelFeature(featureObj);

                //Raise event
                _this.OnFeatureAdded.RaiseEvent(set);
            },
            error: function (req, status, error) {
                alert('error');
            }
        });
    }
    this.AddRelation = function (setA, setB, type) {
        var set = createRaphaelRelation(setA, setB);
        _relations.push(set);
    }

    //Events
    this.OnFeatureAdded = new Event();
    this.OnElementSelected = new Event();
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
