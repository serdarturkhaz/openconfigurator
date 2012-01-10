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
            async: false,
            success: function (response) {
                _configuration = response;
            }
        });
        $.ajax({
            url: "/ConfigurationEditor/LoadModel",
            data: JSON.stringify({ modelID: _configuration.ModelID }),
            async: false,
            success: function (response) {
                _model = response;
            }
        });

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
    this.ModelLoaded = new Event();
    this.ConfigurationLoaded = new Event();
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
    var UIConfigurationFeature = function (clientDataObjectGUID, parentFeature, name) {

        //Fields
        var _outerElement = null;
        var _innerElements = {
            nameTextbox: null,
            text: null
        };
        var _name = name, _parentFeature= parentFeature;
        var _thisUIConfigurationFeature = this;

        //Properties
        this.ClientDataObjectGUID = clientDataObjectGUID;
        this.IsSelected = function () {
            return _currentState == systemDefaults.uiElementStates.selected;
        }
        this.GetTypeName = function () {
            return "feature";
        }
        this.InnerElements = _innerElements;

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

    //Constructor/Initalizers
    this.Initialize = function () {
    };

    //Sync with dataModel methods
    createModelUI = function (model) {

    }

    //Events
    this.ElementSelectToggled = new Event();

    //Eventhandlers
    this.OnModelLoaded = function (guid) {
        var clientDataObject = _diagramDataModel.GetClientDataObject(guid);
        var type = clientDataObject.GetTypeName();

        if (_supportedTypes[type] != undefined) {
            addElement(guid);
        }
    }
    this.OnConfigurationLoaded = function (guid) {
        
    }
}

