
var ConfigurationDataModel = function (configurationID, configurationName) {

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
        customRules: {},
        featureSelections: {},
        attributeValues: {}
    }
    var _configurationID = configurationID;
    var _configuration = null, _model = null;
    var _thisConfigurationDataModel = this;

    //Private methods
    var getDefaultDataObj = function (type) {
        var returnObj;
        $.ajax({
            url: "/ConfigurationEditor/NewDefault" + type,
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
    this.SaveData = function (newName, beforeSend, onSuccess, onError) {

    }
    this.LoadData = function (onFinished) {
        $.ajax({
            url: "/ConfigurationEditor/LoadConfiguration",
            data: JSON.stringify({ configurationID: _configurationID }),
            async:false,
            success: function (response) {
                _configuration = response;

                
            }
        });

//        $.ajax({
//            url: "/ConfigurationEditor/LoadConfiguration",
//            data: JSON.stringify({ modelID: _configuration.ModelID }),
//            async: false,
//            success: function (response) {
//                _model = response;

//                //
//                
//            }
//        });

        onFinished(_configuration);
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
var ClientController = function (standardViewContainer,configurationNameTextbox, configurationDataModelInstance) {

    //Fields and variables
    var _configurationDataModel = configurationDataModelInstance;
    var _standardView;
    var _configurationNameTextbox = configurationNameTextbox;
    var _thisClientController = this;

    //Constructor/Initalizers
    this.Initialize = function () {

        $("#StandardViewBox").block({ message: "Loading diagram...", fadeIn: 300 });
        $.timer(300, function () {
            //Load the model
            _configurationDataModel.LoadData(function (configuration) {
                $(_configurationNameTextbox).val(configuration.Name);
                $("#StandardViewBox").unblock();
            });
        });
    }

    //Public methods
    this.SaveData = function () {
     
    }
   
}

var StandardView = function (container, configurationDataModelInstance) {

    //Fields
    var _configurationDataModel = configurationDataModelInstance;
    var _container = container;
    var _UIElements = {}; //dictionary to hold all UIElements (guid, UIElement)
    var _thisStandardView = this;

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
        if (_inlineEditMode != true) {
            for (var i = _selectedElements.length - 1; i >= 0; i--) {
                _diagramDataModel.DeleteClientDataObject(_selectedElements[i].ClientDataObjectGUID);
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

