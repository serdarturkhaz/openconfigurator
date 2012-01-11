var systemDefaults = {
    enums: {
        featureSelectionStates: {
            selected: {
                name: "selected",
                label: "Selected",
                id: 1
            },
            deselected: {
                name: "deselected",
                label: "Deselected",
                id: 2
            },
            unselected: {
                name: "unselected",
                label: "Unselected",
                id: 3
            }
        },
        relationTypes: {
            mandatory: {
                name: "mandatory",
                label: "Mandatory",
                id: 1
            },
            optional: {
                name: "optional",
                label: "Optional",
                id: 2
            },
            cloneable: {
                name: "cloneable",
                label: "Cloneable",
                id: 3
            }
        }
    }
}

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

                //Load Features
                for (var i = 0; i < _model.Features.length; i++) {
                    _thisConfigurationDataModel.AddClientDataObject("feature", _model.Features[i]);
                }
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
        _thisConfigurationDataModel.ClientDataObjectCreated.RaiseEvent(guid);

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
        _thisConfigurationDataModel.ClientDataObjectCreated.RaiseEvent(guid);
    }
    this.DeleteClientDataObject = function (guid) {

        //Set delete flag
        _dataClientObjects.all[guid].SetDeleted();

        //Raise events
        _thisConfigurationDataModel.ClientDataObjectDeleted.RaiseEvent(guid);
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
        _thisConfigurationDataModel.ClientDataObjectUpdated.RaiseEvent(guid);
    }
    this.UpdateClientDataObjectField = function (guid, fieldName, value) {
        _dataClientObjects.all[guid].SetPropertyValue(fieldName, value);

        //Raise events
        _thisConfigurationDataModel.ClientDataObjectUpdated.RaiseEvent(guid);
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
    this.ClientDataObjectCreated = new Event();
}
var ClientController = function (standardViewContainer, configurationNameTextbox, configurationDataModelInstance) {

    //Fields and variables
    var _configurationDataModel = configurationDataModelInstance;
    var _standardView;
    var _configurationNameTextbox = configurationNameTextbox;
    var _thisClientController = this;

    //Constructor/Initalizers
    this.Initialize = function () {

        $("#StandardViewBox").block({ message: "Loading diagram...", fadeIn: 300 });
        $.timer(300, function () {

            //Instantiate/Initialize controls
            _standardView = new StandardView($(standardViewContainer)[0], _configurationDataModel);
            _standardView.Initialize();

            //Eventhandlers for StandardView
            _configurationDataModel.ClientDataObjectCreated.Add(new EventHandler(_standardView.OnClientDataObjectCreated));

            //Load the data
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
    var _innerContainer = null;
    var _ConfigurationUIElements = {}; //dictionary to hold all UIElements (guid, UIElement)
    var _thisStandardView = this;
    var _supportedTypes = {
        feature: true
    }

    //UIObjects & Defaults/Settings
    var UIConfigurationFeature = function (clientDataObjectGUID, type, subtype, parentContainer, name) {

        //Fields
        var _outerElement = null;
        var _innerElements = {
            nameTextbox: null
        };
        var _currentState = systemDefaults.enums.featureSelectionStates.unselected.name;
        var _type = type; // SingularFeature / GroupFeature
        var _subtype = subtype; // SingularFeature -> Mandatory, Optional, Cloneable / GroupFeature -> OR, XOR, Cardinal
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

        //Public methods
        this.CreateGraphicalRepresentation = function () {

            //Create the main outer element
            _outerElement = $("<div class='FeatureControl'></div>").appendTo(parentContainer);

            //Create inner elements            
        }
        this.ChangeState = function (state) {
            _currentState = state;
            //_innerElements.box.attr(UIObjectStyles.feature.states[state].box.attr);
        }
        this.Update = function (newName) {
            //Set text
            _name = newName;
            //_innerElements.text.attr({ text: newName });
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
        _innerContainer = $("<div class='InnerContainer'></div>").prependTo(container);
    };

    //Sync with dataModel methods
    var addElement = function (guid) {

        //Variables
        var clientDataObject = _configurationDataModel.GetClientDataObject(guid);
        var clientDataObjectType = clientDataObject.GetTypeName();

        //Perform update according to type
        switch (clientDataObjectType) {
            case "feature":
                addFeature(guid);
                break;
        }
    }
    var addFeature = function (guid) {

        var name = _configurationDataModel.GetClientDataObjectField(guid, "Name");
        var feature = new UIConfigurationFeature(guid, "", "", _innerContainer, name);
        feature.CreateGraphicalRepresentation();
    }

    //Eventhandlers
    this.OnClientDataObjectCreated = function (guid) {
        var clientDataObject = _configurationDataModel.GetClientDataObject(guid);
        var type = clientDataObject.GetTypeName();

        if (_supportedTypes[type] != undefined) {
            addElement(guid);
        }
    }
}

