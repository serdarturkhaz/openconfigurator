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

                //Load Relations
                var featuresToParentRelations = {};
                for (var i = 0; i < _model.Relations.length; i++) {

                    //Create a new ClientDataObject
                    var relationClientDataObject = _thisConfigurationDataModel.AddClientDataObject("relation", _model.Relations[i]);

                    //Store the relation using its ChildFeatureID as a key
                    var childFeatureID = relationClientDataObject.GetPropertyValue("ChildFeatureID");
                    featuresToParentRelations[childFeatureID] = relationClientDataObject.GUID;
                }

                //Load GroupRelations
                var featuresToParentGroupRelations = {};
                for (var i = 0; i < _model.GroupRelations.length; i++) {

                    //Create a new ClientDataObject
                    var groupRelationClientDataObject = _thisConfigurationDataModel.AddClientDataObject("groupRelation", _model.GroupRelations[i]);

                    //Store the groupRelation using its ChildFeatureID as a key
                    var childFeatureIDs = groupRelationClientDataObject.GetPropertyValue("ChildFeatureIDs");
                    for (var j = 0; j < childFeatureIDs.length; j++) {
                        featuresToParentGroupRelations[childFeatureIDs[j]] = groupRelationClientDataObject.GUID;
                    }
                }

                //Load Features
                for (var i = 0; i < _model.Features.length; i++) {

                    //Retreive the Relation of which the feature is a child
                    var featureID = _model.Features[i].ID;
                    var parentRelationGUID = (featuresToParentRelations[featureID] != undefined) ? featuresToParentRelations[featureID] : null;
                    var parentGroupRelationGUID = (featuresToParentGroupRelations[featureID] != undefined) ? featuresToParentGroupRelations[featureID] : null;
                    var extraClientData = {
                        ParentRelationGUID: parentRelationGUID,
                        ParentGroupRelationGUID: parentGroupRelationGUID
                    }

                    //Create a new ClientDataObject
                    var featureClientDataObject = _thisConfigurationDataModel.AddClientDataObject("feature", _model.Features[i], extraClientData);
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

        //
        return newClientDataObject;
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
    this.GetGUIDByID = function (ID, type) {
        for (var guidKey in _dataClientObjects[type + "s"]) {
            var clientDataObject = _dataClientObjects[type + "s"][guidKey];
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
    var _ConfigurationUIElements = {}; //dictionary to hold all UIElements (GUID, UIElement)
    var _PendingUIElements = {};
    var _thisStandardView = this;
    var _supportedTypes = {
        feature: true
    }

    //UIObjects & Defaults/Settings
    var UIConfigurationFeature = function (clientDataObjectGUID, isRoot, subtype, parentContainer, name) {

        //Fields
        var _outerElement = null;
        var _innerElements = {
            entry: null,
            connector: null,
            innerFeatureArea: null,
            headerDiv: null,
            nameLabel: null,
            checkbox: null,
            childFeaturesArea: null
        };
        var _currentState = systemDefaults.enums.featureSelectionStates.unselected.name;
        var _childrenFeatures = [];
        var _name = name, _isRoot = isRoot;
        //var _type = type; // SingularFeature / GroupFeature
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

        //Private methods
        function makeSelectable() {
            _innerElements.innerFeatureArea.bind("click", function () {
                switch (_currentState) {
                    //Unselected        
                    case systemDefaults.enums.featureSelectionStates.unselected.name:
                        _thisUIConfigurationFeature.ChangeState(systemDefaults.enums.featureSelectionStates.selected.name);
                        break;
                    //Selected         
                    case systemDefaults.enums.featureSelectionStates.selected.name:
                        _thisUIConfigurationFeature.ChangeState(systemDefaults.enums.featureSelectionStates.deselected.name);
                        break;
                    //Deselected          
                    case systemDefaults.enums.featureSelectionStates.deselected.name:
                        _thisUIConfigurationFeature.ChangeState(systemDefaults.enums.featureSelectionStates.unselected.name);
                        break;
                }
            });
        }

        //Public methods
        this.CreateGraphicalRepresentation = function () {
            //Create the main outer element
            _innerElements.entry = $("<div class='Entry'></div>").attr("featureSelectionState", _currentState).appendTo(parentContainer);
            if (isRoot)
                _innerElements.entry.attr("root", "");
            _innerElements.connector = $("<div class='Connector'></div>").appendTo(_innerElements.entry);
            _outerElement = $("<div class='FeatureControl'></div>").appendTo(_innerElements.entry);

            //Create inner elements   
            _innerElements.innerFeatureArea = $("<div class='InnerFeatureArea' ></div>").appendTo(_outerElement);
            _innerElements.headerDiv = $("<div class='HeaderDiv'></div>").appendTo(_innerElements.innerFeatureArea);
            _innerElements.nameLabel = $("<div class='NameLabel'>" + _name + "</div>").appendTo(_innerElements.headerDiv);
            _innerElements.checkbox = $("<div class='Checkbox' ></div>").appendTo(_innerElements.headerDiv);
            _innerElements.childFeaturesArea = $("<div class='ChildFeaturesArea'></div>").appendTo(_outerElement);

            //Setup 
            makeSelectable();
        }
        this.RefreshGraphicalRepresentation = function () {
            _innerElements.childFeaturesArea.children(".Entry").removeAttr("last");
            _innerElements.childFeaturesArea.children(".Entry:last").attr("last", "last");
        }
        this.GetChildrenContainer = function () {
            return _innerElements.childFeaturesArea;
        }
        this.ChangeState = function (state) {
            _currentState = state;
            _innerElements.entry.attr("featureSelectionState", _currentState);

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
        var elementAdded = false;
        switch (clientDataObjectType) {
            case "feature":
                elementAdded = addFeature(guid);
                break;
        }

        //
        return elementAdded;
    }
    var addFeature = function (guid) {

        //Variables
        var featureClientDataObject = _configurationDataModel.GetClientDataObject(guid);
        var name = featureClientDataObject.GetPropertyValue("Name");
        var isRoot = false;

        //Try to find the parent ----------------------------------------------------
        var parentContainer = _innerContainer;
        var parentRelationGUID = featureClientDataObject.ExtraClientData.ParentRelationGUID;
        var parentGroupRelationGUID = featureClientDataObject.ExtraClientData.ParentGroupRelationGUID;

        //Check if it is part of a Relation
        var relClientDataObject = null;
        if (parentRelationGUID != null) {
            relClientDataObject = _configurationDataModel.GetClientDataObject(parentRelationGUID);
        }
        //Check instead if it is part of a RelationGroup
        else if (parentGroupRelationGUID != null) {
            relClientDataObject = _configurationDataModel.GetClientDataObject(parentGroupRelationGUID);
        }

        //A valid relation or groupRelation exists
        if (relClientDataObject != null) {
            var parentFeatureID = relClientDataObject.GetPropertyValue("ParentFeatureID");
            var parentFeatureGUID = _configurationDataModel.GetGUIDByID(parentFeatureID, "feature");
            var parentUIFeature = _ConfigurationUIElements[parentFeatureGUID];

            //Get the container
            if (parentUIFeature != undefined) {
                parentContainer = parentUIFeature.GetChildrenContainer();
            }
            //Problem with childFeature which comes before its parent
            else {
                _PendingUIElements[guid] = featureClientDataObject;
                return false;
            }
        }
        else {
            isRoot = true;
        }
        //---------------------------------------------------------------------------

        //Create the Feature
        var feature = new UIConfigurationFeature(guid, isRoot, "", parentContainer, name);
        feature.CreateGraphicalRepresentation();
        if (parentUIFeature != null)
            parentUIFeature.RefreshGraphicalRepresentation();

        //
        _ConfigurationUIElements[guid] = feature;
        return true;
    }

    //Eventhandlers
    this.OnClientDataObjectCreated = function (guid) {
        var clientDataObject = _configurationDataModel.GetClientDataObject(guid);
        var type = clientDataObject.GetTypeName();

        if (_supportedTypes[type] != undefined) {
            addElement(guid);
        }

        //Try to clean up Pending elements
        if (Object.size(_PendingUIElements) > 0) {
            if (guid == 47) {
                debugger;
            }
            for (var guidkey in _PendingUIElements) {
                if (guidkey != guid) {
                    var elementAdded = addElement(guidkey);
                    if (elementAdded)
                        delete _PendingUIElements[guidkey];
                }
            }
        }
    }
}

