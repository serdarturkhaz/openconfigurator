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
    var _configuration = null, _model = null, _modelRootFeatureGUID = null;
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
    this.GetRootGUID = function () {
        return _modelRootFeatureGUID;
    }

    //Public methods
    this.LoadData = function (onFinished) {

        //Variables
        var featureIDsToFeatureSelections = {};
        var featureIDsToChildRelations = {}, featureIDsToParentRelations = {};
        var featureIDsToChildGroupRelations = {}, featureIDsToParentGroupRelations = {};

        //
        $.ajax({
            url: "/ConfigurationEditor/LoadConfiguration",
            data: JSON.stringify({ configurationID: _configurationID }),
            async: false,
            success: function (response) {
                _configuration = response;

                //Load FeatureSelections
                for (var i = 0; i < _configuration.FeatureSelections.length; i++) {

                    //Create a new ClientDataObject
                    var featureSelectionClientDataObject = _thisConfigurationDataModel.AddClientDataObject("featureSelection", _model.FeatureSelections[i]);

                    //
                    var featureID = featureSelectionClientDataObject.GetPropertyValue("FeatureID");
                    featureIDsToFeatureSelections[featureID] = featureSelectionClientDataObject.GUID;
                }
            }
        });

        //
        $.ajax({
            url: "/ConfigurationEditor/LoadModel",
            data: JSON.stringify({ modelID: _configuration.ModelID }),
            async: false,
            success: function (response) {
                _model = response;

                //Load Relations
                for (var i = 0; i < _model.Relations.length; i++) {

                    //Create a new ClientDataObject
                    var relationClientDataObject = _thisConfigurationDataModel.AddClientDataObject("relation", _model.Relations[i]);

                    //Store the relation using its ParentFeatureID as a key
                    var parentFeatureID = relationClientDataObject.GetPropertyValue("ParentFeatureID");
                    if (featureIDsToChildRelations[parentFeatureID] == undefined) {
                        featureIDsToChildRelations[parentFeatureID] = [];
                    }
                    featureIDsToChildRelations[parentFeatureID].push(relationClientDataObject.GUID);

                    //Store the relation using its ChildFeatureID as a key
                    var childFeatureID = relationClientDataObject.GetPropertyValue("ChildFeatureID");
                    if (featureIDsToParentRelations[childFeatureID] == undefined) {
                        featureIDsToParentRelations[childFeatureID] = [];
                    }
                    featureIDsToParentRelations[childFeatureID].push(relationClientDataObject.GUID);
                }

                //Load GroupRelations
                for (var i = 0; i < _model.GroupRelations.length; i++) {

                    //Create a new ClientDataObject
                    var groupRelationClientDataObject = _thisConfigurationDataModel.AddClientDataObject("groupRelation", _model.GroupRelations[i]);

                    //Store the groupRelation using its ParentFeatureID as a key
                    var parentFeatureID = groupRelationClientDataObject.GetPropertyValue("ParentFeatureID");
                    if (featureIDsToChildGroupRelations[parentFeatureID] == undefined) {
                        featureIDsToChildGroupRelations[parentFeatureID] = [];
                    }
                    featureIDsToChildGroupRelations[parentFeatureID].push(groupRelationClientDataObject.GUID);

                    //Store the relation using its ChildFeatureID as a key
                    var childFeatureIDs = groupRelationClientDataObject.GetPropertyValue("ChildFeatureIDs");
                    for (var j = 0; j < childFeatureIDs.length; j++) {
                        if (featureIDsToParentGroupRelations[childFeatureIDs[j]] == undefined) {
                            featureIDsToParentGroupRelations[childFeatureIDs[j]] = [];
                        }
                        featureIDsToParentGroupRelations[childFeatureIDs[j]].push(groupRelationClientDataObject.GUID);
                    }

                }

                //Load Features
                for (var i = 0; i < _model.Features.length; i++) {

                    //Variables
                    var featureID = _model.Features[i].ID;
                    var childRelationsGUIDs, childGroupRelationsGUIDs;
                    var parentRelationsGUIDs, parentGroupRelationsGUIDs;

                    //Retreive the child/parent Relations/GroupRelations for the Feature
                    childRelationsGUIDs = (featureIDsToChildRelations[featureID] != undefined) ? featureIDsToChildRelations[featureID] : null;
                    childGroupRelationsGUIDs = (featureIDsToChildGroupRelations[featureID] != undefined) ? featureIDsToChildGroupRelations[featureID] : null;
                    parentRelationsGUIDs = (featureIDsToParentRelations[featureID] != undefined) ? featureIDsToParentRelations[featureID] : null;
                    parentGroupRelationsGUIDs = (featureIDsToParentGroupRelations[featureID] != undefined) ? featureIDsToParentGroupRelations[featureID] : null;
                    var initialFeatureSelectionState = featureIDsToFeatureSelections[featureID];

                    //Create a new ClientDataObject
                    var extraClientData = {
                        ChildRelationsGUIDs: childRelationsGUIDs,
                        ChildGroupRelationsGUIDs: childGroupRelationsGUIDs,
                        ParentRelationsGUIDs: parentRelationsGUIDs,
                        ParentGroupRelationsGUIDs: parentGroupRelationsGUIDs,
                        InitialFeatureSelectionState: initialFeatureSelectionState
                    }
                    var featureClientDataObject = _thisConfigurationDataModel.AddClientDataObject("feature", _model.Features[i], extraClientData);


                    //Save a reference to it if it is the ROOT
                    if (parentRelationsGUIDs == null && parentGroupRelationsGUIDs == null) {
                        _modelRootFeatureGUID = featureClientDataObject.GUID;
                    }
                }
            }
        });

        //Raise events
        _thisConfigurationDataModel.ClientDataObjectsLoaded.RaiseEvent();

        //Callback
        onFinished(_configuration);
    }
    this.SaveData = function (newName, beforeSend, onSuccess, onError) {

    }

    this.CreateDefaultClientDataObject = function (type, initialFieldValues, extraClientData) {

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
        //_thisConfigurationDataModel.ClientDataObjectCreated.RaiseEvent(guid);

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
        //_thisConfigurationDataModel.ClientDataObjectCreated.RaiseEvent(guid);

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
    this.ClientDataObjectsLoaded = new Event();
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
            _configurationDataModel.ClientDataObjectsLoaded.Add(new EventHandler(_standardView.OnClientDataObjectsLoaded));
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

    //UIObjects & Defaults/Settings
    var UIConfigurationFeature = function (clientDataObjectGUID, isRoot, initialState, name, attributes) {

        //Fields
        var _outerElement = null;
        var _innerElements = {
            entry: null,
            connector: null,
            innerFeatureArea: null,
            headerDiv: null,
            nameLabel: null,
            checkbox: null,
            attributesArea: null,
            childFeaturesArea: null
        };
        var _currentState = initialState;
        var _parent = null, _children = [], _attributes = attributes;
        var _name = name, _isRoot = isRoot;
        var _thisUIConfigurationFeature = this;

        //Properties
        this.ClientDataObjectGUID = clientDataObjectGUID;
        this.GetTypeName = function () {
            return "feature";
        }
        this.GetChildrenContainer = function () {
            return _innerElements.childFeaturesArea;
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
        function createAttributeHTML(attribute) {
            var attribute = $("<div class='Attribute'>" + attribute.Name + "<input type='text' class='Textbox' style='text-align:right' value='0'/></div>");
            return attribute;
        }
        //Public methods
        this.CreateGraphicalRepresentation = function () {

            //ParentContainer
            var parentContainer = null;
            if (isRoot) {
                parentContainer = _innerContainer;
            } else {
                parentContainer = _parent.GetChildrenContainer();
            }

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

            //Create attributes
            if (_attributes.length > 0)
                _innerElements.attributesArea = $("<div class='AttributesArea' ></div>").appendTo(_outerElement);
            for (var i = 0; i < _attributes.length; i++) {
                var dataAttr = _attributes[i];
                var attrHTML = createAttributeHTML(dataAttr).appendTo(_innerElements.attributesArea);
            }


            //ChildFeaturesArea
            _innerElements.childFeaturesArea = $("<div class='ChildFeaturesArea'></div>").appendTo(_outerElement);

            //Setup 
            if (_parent != null)
                _parent.RefreshGraphicalRepresentation();
            makeSelectable();
        }
        this.RefreshGraphicalRepresentation = function () {
            _innerElements.childFeaturesArea.children(".Entry").removeAttr("last");
            _innerElements.childFeaturesArea.children(".Entry:last").attr("last", "last");
        }
        this.AddChild = function (UIConfigurationElement) {
            _children.push(UIConfigurationElement);
            UIConfigurationElement.SetParent(_thisUIConfigurationFeature);

        }
        this.SetParent = function (parentUIConfigurationElement) {
            _parent = parentUIConfigurationElement;
        }
        this.ChangeState = function (state) {
            _currentState = state;
            _innerElements.entry.attr("featureSelectionState", _currentState);
        }
    }
    var UIConfigurationGroup = function (clientDataObjectGUID) {

        //Fields
        var _outerElement = null;
        var _innerElements = {
            entry: null,
            connector: null,
            childFeaturesArea: null
        };
        var _parent = null, _children = [];
        var _thisUIConfigurationGroup = this;

        //Properties
        this.ClientDataObjectGUID = clientDataObjectGUID;
        this.GetTypeName = function () {
            return "group";
        }
        this.GetChildrenContainer = function () {
            return _innerElements.childFeaturesArea;
        }
        this.InnerElements = _innerElements;

        //Public methods
        this.CreateGraphicalRepresentation = function () {

            //ParentContainer
            var parentContainer = _parent.GetChildrenContainer();

            //Create the main outer element
            _innerElements.entry = $("<div class='Entry'></div>").appendTo(parentContainer);
            _innerElements.connector = $("<div class='Connector'></div>").appendTo(_innerElements.entry);
            _outerElement = $("<div class='GroupControl'></div>").appendTo(_innerElements.entry);

            //Create inner elements   
            _innerElements.childFeaturesArea = $("<div class='ChildFeaturesArea'></div>").appendTo(_outerElement);

            //Setup 
            if (_parent != null)
                _parent.RefreshGraphicalRepresentation();
        }
        this.RefreshGraphicalRepresentation = function () {

        }
        this.AddChild = function (UIConfigurationElement) {
            _children.push(UIConfigurationElement);
            UIConfigurationElement.SetParent(_thisUIConfigurationGroup);
        }
        this.SetParent = function (parentUIConfigurationElement) {
            _parent = parentUIConfigurationElement;
        }
    }

    //Constructor/Initalizers
    this.Initialize = function () {
        _innerContainer = $("<div class='InnerContainer'></div>").prependTo(container);
    };

    //Sync with dataModel methods
    var createFeature = function (clientDataObject, parentUIConfigurationElement) {

        //Variables
        var featureSelectionState = systemDefaults.enums.featureSelectionStates.unselected.name;
        //var featureSelectionState = clientDataObject.ExtraClientData.InitialFeatureSelectionState;

        var isRoot = (parentUIConfigurationElement == undefined);

        //Create the Feature 
        var feature = new UIConfigurationFeature(clientDataObject.GUID, isRoot, featureSelectionState, clientDataObject.GetPropertyValue("Name"), clientDataObject.GetPropertyValue("Attributes"));
        if (!isRoot)
            parentUIConfigurationElement.AddChild(feature); //add to parent if it has one
        feature.CreateGraphicalRepresentation();

        //Create child Features
        for (var guidKey in clientDataObject.ExtraClientData.ChildRelationsGUIDs) {
            var childRelationClientDataObject = _configurationDataModel.GetClientDataObject(clientDataObject.ExtraClientData.ChildRelationsGUIDs[guidKey]);
            var childFeatureClientDataObject = _configurationDataModel.GetClientDataObject(_configurationDataModel.GetGUIDByID(childRelationClientDataObject.GetPropertyValue("ChildFeatureID"), "feature"));

            createFeature(childFeatureClientDataObject, feature);
        }

        //Create child Groups
        for (var guidKey in clientDataObject.ExtraClientData.ChildGroupRelationsGUIDs) {
            var childGroupRelationClientDataObject = _configurationDataModel.GetClientDataObject(clientDataObject.ExtraClientData.ChildGroupRelationsGUIDs[guidKey]);

            createGroup(childGroupRelationClientDataObject, feature);
        }
    }
    var createGroup = function (clientDataObject, parentUIConfigurationElement) {

        //Create the UIConfigurationElement 
        var group = new UIConfigurationGroup(clientDataObject.GUID);
        parentUIConfigurationElement.AddChild(group);
        group.CreateGraphicalRepresentation();


        //Create child Features
        var childFeatureIDs = clientDataObject.GetPropertyValue("ChildFeatureIDs");
        for (var i = 0; i < childFeatureIDs.length; i++) {
            var childFeatureClientDataObject = _configurationDataModel.GetClientDataObject(_configurationDataModel.GetGUIDByID(childFeatureIDs[i], "feature"));

            createFeature(childFeatureClientDataObject, group);
        }
    }

    //Eventhandlers
    this.OnClientDataObjectsLoaded = function () {

        //Create features/featureGroups recursively starting from the root
        var rootFeatureClientDataObject = _configurationDataModel.GetClientDataObject(_configurationDataModel.GetRootGUID());
        createFeature(rootFeatureClientDataObject);

        //Set selections
    }
}


