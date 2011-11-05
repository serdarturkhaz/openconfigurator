//Raphael stuff
Raphael.fn.connection = function (obj1, obj2, line, bg) {
    if (obj1.line && obj1.from && obj1.to) {
        line = obj1;
        obj1 = line.from;
        obj2 = line.to;
    }
    var bb1 = obj1.getBBox(),
        bb2 = obj2.getBBox(),
        p = [{ x: bb1.x + bb1.width / 2, y: bb1.y - 1 },
        { x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1 },
        { x: bb1.x - 1, y: bb1.y + bb1.height / 2 },
        { x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2 },
        { x: bb2.x + bb2.width / 2, y: bb2.y - 1 },
        { x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1 },
        { x: bb2.x - 1, y: bb2.y + bb2.height / 2 },
        { x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2}],
        d = {}, dis = [];
    for (var i = 0; i < 4; i++) {
        for (var j = 4; j < 8; j++) {
            var dx = Math.abs(p[i].x - p[j].x),
                dy = Math.abs(p[i].y - p[j].y);
            if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
                dis.push(dx + dy);
                d[dis[dis.length - 1]] = [i, j];
            }
        }
    }
    if (dis.length == 0) {
        var res = [0, 4];
    } else {
        res = d[Math.min.apply(Math, dis)];
    }
    var x1 = p[res[0]].x,
        y1 = p[res[0]].y,
        x4 = p[res[1]].x,
        y4 = p[res[1]].y;
    dx = Math.max(Math.abs(x1 - x4) / 2, 10);
    dy = Math.max(Math.abs(y1 - y4) / 2, 10);
    var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
        y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
        x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
        y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
    var path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(",");
    if (line && line.line) {
        line.bg && line.bg.attr({ path: path });
        line.line.attr({ path: path });
    } else {
        var color = typeof line == "string" ? line : "#000";
        return {
            bg: bg && bg.split && this.path(path).attr({ stroke: bg.split("|")[0], fill: "none", "stroke-width": bg.split("|")[1] || 3 }),
            line: this.path(path).attr({ stroke: color, fill: "none" }),
            from: obj1,
            to: obj2
        };
    }
};

//Settings and defaults
var defaults = {
    selectedFeatureStyle: {
        fill: "#ffe784",
        stroke: "black",
        "stroke-width": 1.2,
        opacity: 1
    },
    hoverGlowStyle: {
        width: 10,
        opacity: 0.5,
        color: "blue"
    },
    defaultFeatureStyle: {
        fill: "#ffe784",
        stroke: "#CECECE",
        "stroke-width": 1,
        opacity: 1
    },
    featureTextStyle: {
        cursor: "default"
    }
}

//Components
var ActionsComponent = function (newFeatureElem, newGroupElem) {
    //Fields
    var newFeatureButton = null;
    var newGroupButton = null;

    //Methods

    //Events

}
var PropertiesComponent = function (container) {

    //Fields
    var _container = container;
    var _currentSet = null;
    var typeLabel = null, nameTextbox = null, featureTypeDropdown = null, descriptionTextbox = null;

    //Constructor/Initalizers
    this.Initialize = function () {

        //Find controls
        typeLabel = $(_container).find("#SetTypeLabel");
        nameTextbox = $(_container).find("#ElementNameTextbox");
        featureTypeDropdown = $(_container).find("#FeatureTypeDropdown");
        descriptionTextbox = $(_container).find("#DescriptionTextbox");

        //Event handlers
        nameTextbox.bind("change", function () {
            var newVal = $(this).val();
            _currentSet.items[0].data("dataObj").Name = newVal;
            _currentSet.items[1].attr({ text: newVal });
        }).bind("keypress", function (event) {
            if (event.which == 13) {
                var newVal = $(this).val();
                _currentSet.items[0].data("dataObj").Name = newVal;
                _currentSet.items[1].attr({ text: newVal });
            }
        });
    };

    //Public methods
    this.LoadProperties = function (set, type) {
        typeLabel.text("");
        nameTextbox.attr("disabled", "");
        featureTypeDropdown.attr("disabled", "");
        descriptionTextbox.attr("disabled", "");

        //
        var dataObj = set.items[0].data("dataObj");
        typeLabel.text("(" + type + ")");
        nameTextbox.val(dataObj.Name);
        featureTypeDropdown.val(dataObj.FeatureType);
        descriptionTextbox.val(dataObj.Description);

        //
        _currentSet = set;
    }
    this.Clear = function () {
        typeLabel.text("");
        nameTextbox.val("").attr("disabled", "disabled");
        featureTypeDropdown.val("").attr("disabled", "disabled");
        descriptionTextbox.val("").attr("disabled", "disabled");
    }
}
var DiagramContext = function (canvasContainer) {
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
        $(_canvasContainer).click(function () {
        })

    };

    //Private methods
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
        var elem = set.items[0];
        elem.attr(defaults.defaultFeatureStyle);
        elem.data("selected", false);

        //Remove from selectedElements collection
        var index = $(_selectedElements).index(elem);
        _selectedElements.splice(index, 1);
        if (_selectedElements.length == 0) {
            _this.OnAllElementsDeselected.RaiseEvent();
        }
    }
    function select(set) {
        var elem = set.items[0];
        elem.attr(defaults.selectedFeatureStyle);
        elem.data("selected", true);

        //Deselect everything else and save element into selectedElements collection
        //        for (var i = 0; i < _selectedElements.length; i++) {
        //            var selElem = _selectedElements[i];
        //            deselect(selElem);
        //        }

        //Raise event
        _selectedElements.push(set);
        _this.OnElementSelected.RaiseEvent(set);
    }
    function createRaphaelSet(dataObj, type) {
        //Define set
        var set = _canvas.set();

        //Define inner elements
        switch (type) {
            case "feature":
                var box = _canvas.rect(40.5, 40.5, 100, 30, 0).attr(defaults.defaultFeatureStyle)
                        .data("dataObj", dataObj)
                        .data("selected", false)
                        .data("children", new Array())
                        .data("parent", null);
                var text = _canvas.text(90, 55, dataObj.Name).attr(defaults.featureTextStyle)
                        .data("parent", box);
                box.data("children").push(text);
                set.push(box);
                set.push(text);

                //Selectable with hover effect
                var glow = null;
                box.click(function () {
                    toggleSelect(set);
                }).mouseover(function (e) {
                    if (glow != null)
                        glow.remove();
                    glow = box.glow(defaults.hoverGlowStyle);
                }).mouseout(function (e) {
                    glow.remove();
                });
                text.click(function () {
                    toggleSelect(set);
                }).mouseover(function (e) {
                    if (glow != null)
                        glow.remove();
                    glow = box.glow(defaults.hoverGlowStyle);
                }).mouseout(function (e) {
                    glow.remove();
                });

                //Drag and droppable
                var start = function () {
                    var rootContainer = set.items[0];
                    rootContainer.originalx = rootContainer.attr("x");
                    rootContainer.originaly = rootContainer.attr("y");

                    for (var i = 0; i < rootContainer.data("children").length; i++) {
                        var childElem = rootContainer.data("children")[i];
                        childElem.originalx = childElem.attr("x");
                        childElem.originaly = childElem.attr("y");
                    }

                };
                move = function (dx, dy) {
                    var rootContainer = set.items[0];
                    rootContainer.attr({ x: rootContainer.originalx + dx, y: rootContainer.originaly + dy });

                    for (var i = 0; i < rootContainer.data("children").length; i++) {
                        var childElem = rootContainer.data("children")[i];
                        childElem.attr({ x: childElem.originalx + dx, y: childElem.originaly + dy });
                    }
                };
                up = function () {
                    glow.remove();
                    glow = box.glow(defaults.hoverGlowStyle);
                };
                box.drag(move, start, up);
                text.drag(move, start, up);
                break;
        }

        return set;
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

                var set = createRaphaelSet(featureObj, "feature");

                //Raise event
                _this.OnFeatureAdded.RaiseEvent(set);
            },
            error: function (req, status, error) {
                alert('error');
            }
        });
    }
    this.CreateRelation = function (setA, setB) {
        _canvas.connection(setA, setB, "black")
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
