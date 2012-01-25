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
        attributeTypes: {
            constant: {
                name: "constant",
                label: "Constant",
                id: 1
            },
            dynamic: {
                name: "dynamic",
                label: "Dynamic",
                id: 2
            },
            userInput: {
                name: "userInput",
                label: "UserInput",
                id: 3
            }
        },
        attributeDataTypes: {
            integer: {
                name: "integer",
                label: "Integer",
                id: 1
            },
            boolean: {
                name: "boolean",
                label: "Boolean",
                id: 2
            },
            string: {
                name: "string",
                label: "String",
                id: 3
            }
        }
    }
}

//ClientObjects***************************************************************************************************
var ClientObjects = {
    Feature: null,
    Group: null,
    FeatureSelection: null,
    Attribute: null,
    AttributeValue: null
}

ClientObjects.Feature = function (businessObject) {

    //Fields
    var _guid = null;
    var _businessObject = businessObject;
    var _featureSelection = {}, _childFeatures = [], _childGroups = [], _parent = {};

    //Properties
    this.GUID = _guid;
    this.GetType = function () {
        return "feature";
    }
    this.FeatureSelection = _featureSelection;
    this.ChildFeatures = _childFeatures;
    this.ChildGroups = _childGroups;
    this.Parent = _parent;

    //Methods
    this.GetBusinessObjectCopy = function () {
        var copy = jQuery.extend(true, {}, _businessObject);
        return copy;
    }
    this.UpdateBusinessObject = function (modifiedBusinessObject) {
        _businessObject = modifiedBusinessObject;
    }
    this.GetField = function (fieldName) {
        return _businessObject[fieldName];
    }
    this.SetField = function (fieldName, value) {
        _businessObject[fieldName] = value;
    }
}
ClientObjects.Group = function (businessObject) {

    //Fields
    var _guid = null;
    var _businessObject = businessObject;
    var _childFeatures = [], _parent = {};

    //Properties
    this.GUID = _guid;
    this.GetType = function () {
        return "group";
    }
    this.ChildFeatures = _childFeatures;
    this.Parent = _parent;

    //Methods
    this.GetBusinessObjectCopy = function () {
        var copy = jQuery.extend(true, {}, _businessObject);
        return copy;
    }
    this.UpdateBusinessObject = function (modifiedBusinessObject) {
        _businessObject = modifiedBusinessObject;
    }
    this.GetField = function (fieldName) {
        return _businessObject[fieldName];
    }
    this.SetField = function (fieldName, value) {
        _businessObject[fieldName] = value;
    }
}
ClientObjects.FeatureSelection = function (businessObject) {

    //Fields
    var _guid = null;
    var _businessObject = businessObject;
    var _feature = {};

    //Properties
    this.GUID = _guid;
    this.GetType = function () {
        return "featureSelection";
    }
    this.Feature = _feature;

    //Methods
    this.GetBusinessObjectCopy = function () {
        var copy = jQuery.extend(true, {}, _businessObject);
        return copy;
    }
    this.UpdateBusinessObject = function (modifiedBusinessObject) {
        _businessObject = modifiedBusinessObject;
    }
    this.GetField = function (fieldName) {
        return _businessObject[fieldName];
    }
    this.SetField = function (fieldName, value) {
        _businessObject[fieldName] = value;
    }
}
//****************************************************************************************************************

var ConfigurationDataModel = function (configurationID, configurationName) {

    //Variables
    var _GUIDCounter = 0;
    var _clientObjects = {
        all: {},
        features: {},
        groups: {},
        featureSelections: {}
    }
    var _configurationID = configurationID;
    var _configuration = null, _model = null, _rootFeatureGUID = null, _configurationName = configurationName;
    var _thisConfigurationDataModel = this;

    //Private methods
    var getDefaultBusinessObject = function (type) {
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
        return _rootFeatureGUID;
    }

    //Public methods
    this.LoadData = function (onFinished) {

        //Lookup tables
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
                    var featureSelectionClientObject = new ClientObjects.FeatureSelection(_configuration.FeatureSelections[i]);
                    _thisConfigurationDataModel.RegisterClientObject(featureSelectionClientObject);

                    //Place the featureSelection in a lookup table, with its FeatureID as key
                    var featureID = featureSelectionClientObject.GetField("FeatureID");
                    featureIDsToFeatureSelections[featureID] = featureSelectionClientObject.GUID;
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

                //Load Features
                for (var i = 0; i < _model.Features.length; i++) {

                    //Variables
                    var featureID = _model.Features[i].ID;
                    var childRelationsGUIDs, childGroupRelationsGUIDs;
                    var parentRelationsGUIDs, parentGroupRelationsGUIDs;

                    //Create a new ClientDataObject
                    var featureClientObject = new ClientObjects.Feature(_model.Features[i]);
                    _thisConfigurationDataModel.RegisterClientObject(featureClientObject);

                    //Set references-----------------------------------------------------------------------------------------
                    var featureSelectionClientObject = null;
                    var featureSelectionGUID = featureIDsToFeatureSelections[featureID];
                    if (featureSelectionGUID != undefined) {
                        featureSelectionClientObject = _thisConfigurationDataModel.GetByGUID(featureSelectionGUID);
                    } else {
                        //If a featureSelection doesn't already exist, create one
                        featureSelectionClientObject = _thisConfigurationDataModel.CreateDefaultClientObject("featureSelection", { FeatureID: featureID });
                        _thisConfigurationDataModel.RegisterClientObject(featureSelectionClientObject);
                    }

                    //Set Feature and FeatureSelection references
                    featureClientObject.FeatureSelection = featureSelectionClientObject;
                    featureSelectionClientObject.Feature = featureClientObject;
                    //-------------------------------------------------------------------------------------------------------
                }

                //Load Relations
                for (var i = 0; i < _model.Relations.length; i++) {

                    //Set references-----------------------------------------------------------------------------------------
                    var parentFeatureClientObject = _thisConfigurationDataModel.GetByID(_model.Relations[i].ParentFeatureID, "feature");
                    var childFeatureClientObject = _thisConfigurationDataModel.GetByID(_model.Relations[i].ChildFeatureID, "feature");

                    //Set childFeatures, parent references
                    parentFeatureClientObject.ChildFeatures.push(childFeatureClientObject);
                    childFeatureClientObject.Parent = parentFeatureClientObject;
                    //-------------------------------------------------------------------------------------------------------

                }
                
                //Load GroupRelations
                for (var i = 0; i < _model.GroupRelations.length; i++) {
                    
                    //
                    var groupRelation = _model.GroupRelations[i];

                    //Create a new ClientDataObject
                    var groupClientObject = new ClientObjects.Group(groupRelation);
                    _thisConfigurationDataModel.RegisterClientObject(groupClientObject);

                    //Set references-----------------------------------------------------------------------------------------
                    var parentFeatureClientObject = _thisConfigurationDataModel.GetByID(groupRelation.ParentFeatureID, "feature");
                    var childFeaturesClientObjects = [], childFeaturesIDs = groupRelation.ChildFeatureIDs;
                    for (var j = 0; j < groupRelation.ChildFeatureIDs.length; j++) {
                        var childFeatureClientObject = _thisConfigurationDataModel.GetByID(groupRelation.ChildFeatureIDs[j], "feature");
                        childFeaturesClientObjects.push(childFeatureClientObject);
                    }

                    //Set childFeatures, parent references
                    parentFeatureClientObject.ChildGroups.push(groupClientObject);
                    groupClientObject.Parent = parentFeatureClientObject;
                    for (var j = 0; j < childFeaturesClientObjects.length; j++) {
                        groupClientObject.ChildFeatures.push(childFeaturesClientObjects[j]);
                        childFeaturesClientObjects[j].Parent = groupClientObject;
                    }
                    //-------------------------------------------------------------------------------------------------------
                }
                
                //Find the root Feature
                for (var guidKey in _clientObjects.features) {
                    var featureClientObject = _clientObjects.features[guidKey];
                    if (featureClientObject.Parent.GUID == undefined) {
                        _rootFeatureGUID = featureClientObject.GUID;
                        break;
                    }
                }
            }
        });

        //Raise events
        _thisConfigurationDataModel.ClientObjectsLoaded.RaiseEvent();

        //Callback
        onFinished(_configuration);
    }
    this.SaveData = function (newName, beforeSend, onSuccess, onError) {
        _configurationName = newName;

        //Stringify collection of FeatureSelections
        var featureSelectionClientObjects = {};
        for (var guidKey in _clientObjects.featureSelections) {
            var clientObject = _clientObjects.featureSelections[guidKey];
            featureSelectionClientObjects[guidKey] = clientObject.GetBusinessObjectCopy();
        }

        //Setup data parameters
        var dataParameters = {
            configurationID: _configurationID,
            configurationName: _configurationName,
            featureSelectionsString: JSON.stringify(featureSelectionClientObjects)
        }

        //Send data to WebService method
        $.ajax({
            type: "POST",
            url: "/ConfigurationEditor/SaveConfiguration",
            data: JSON.stringify(dataParameters),
            beforeSend: function () {
                beforeSend();
            },
            success: function (response) {

                //Update ID's for FeatureSelections
                var updatedFeatureSelectionBusinessObjects = response[0];
                for (var guidKey in _clientObjects.featureSelections) {
                    var clientObject = _clientObjects.featureSelections[guidKey];
                    clientObject.UpdateBusinessObject(updatedFeatureSelectionBusinessObjects[guidKey]);
                }

                //Callback
                onSuccess();
            },
            error: function (req, status, error) {
                onError();
            }
        });
    }
    this.CreateDefaultClientObject = function (type, initialFieldValues) {

        //Variables
        var newBusinessObject = getDefaultBusinessObject(type);

        //Initial businessObject values
        if (initialFieldValues != undefined && initialFieldValues != null) {
            for (var fieldName in initialFieldValues) {
                var fieldValue = initialFieldValues[fieldName];
                newBusinessObject[fieldName] = fieldValue;
            }
        }

        //Wrap a new default BusinessDataObject into a ClientDataObject
        var newClientObject = null;
        switch (type) {
            case "feature":
                newClientObject = new ClientObjects.Feature(newBusinessObject);
                break;
            case "group":
                newClientObject = new ClientObjects.Group(newBusinessObject);
                break;
            case "featureSelection":
                newClientObject = new ClientObjects.FeatureSelection(newBusinessObject);
                break;
        }


        return newClientObject;
    }
    this.RegisterClientObject = function (clientObject) {
        if (clientObject.GUID == null) {
            var guid = _GUIDCounter++;
            var type = clientObject.GetType();
            clientObject.GUID = guid;

            //Save references to it
            _clientObjects.all[clientObject.GUID] = clientObject;
            _clientObjects[type + "s"][clientObject.GUID] = clientObject;

            //
            return guid;
        } else {
            return clientObject.GUID;
        }
    }

    this.GetByGUID = function (guid) {
        return _clientObjects.all[guid];
    }
    this.GetByID = function (ID, type) {
        for (var guidKey in _clientObjects[type + "s"]) {
            var clientObject = _clientObjects[type + "s"][guidKey];
            if (ID == clientObject.GetField("ID")) {
                return clientObject;
            }
        }
    }
    this.UpdateClientObject = function (guid, modifiedBusinessDataObject) {

        //Update the whole businessDataObject
        _dataClientObjects.all[guid].UpdateBusinessDataObject(modifiedBusinessDataObject);

        //Raise events
        _thisConfigurationDataModel.ClientObjectUpdated.RaiseEvent(guid);
    }
    this.UpdateClientObjectField = function (guid, fieldName, value) {
        _clientObjects.all[guid].SetField(fieldName, value);

        //Raise events
        _thisConfigurationDataModel.ClientObjectUpdated.RaiseEvent(guid);
    }

    //Events
    this.ClientObjectsLoaded = new Event();
    this.ClientObjectUpdated = new Event();
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
            _configurationDataModel.ClientObjectsLoaded.Add(new EventHandler(_standardView.OnClientObjectsLoaded));
            _configurationDataModel.ClientObjectUpdated.Add(new EventHandler(_standardView.OnClientObjectUpdated));

            //Load the data
            _configurationDataModel.LoadData(function (configuration) {
                $(_configurationNameTextbox).val(configuration.Name);
                $("#StandardViewBox").unblock();
            });
        });
    }

    //Public methods
    this.SaveData = function () {
        var newName = $(_configurationNameTextbox).val();
        _configurationDataModel.SaveData(newName, function () {
            $("#StandardViewBox").block({ message: "Saving configuration...", fadeIn: 300 });
        }, function () {
            $.pnotify({
                pnotify_title: "Data saved",
                pnotify_text: "Configuration '" + newName + "' saved successfully !",
                pnotify_type: "notice"
            });
            $("#StandardViewBox").unblock();

        }, function () {
            $.pnotify({
                pnotify_title: "Error!",
                pnotify_text: "Data could not be saved",
                pnotify_type: "error"
            });
            $("#StandardViewBox").unblock();
        });
    }
}
var StandardView = function (container, configurationDataModelInstance) {

    //Fields
    var _configurationDataModel = configurationDataModelInstance;
    var _container = container;
    var _innerContainer = null;
    var _UIElements = {}; //dictionary to hold all UIElements (GUID, UIElement)
    var _thisStandardView = this;

    //UIObjects & Defaults/Settings
    var UIFeature = function (clientObjectGUID, isRoot, initialState, name, attributes, attributeValues) {

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
        var _parent = null, _children = [], _attributes = attributes, _attributeValues = attributeValues;
        var _name = name, _isRoot = isRoot;
        var _thisUIConfigurationFeature = this;

        //Properties
        this.ClientObjectGUID = clientObjectGUID;
        this.GetTypeName = function () {
            return "feature";
        }
        this.GetChildrenContainer = function () {
            return _innerElements.childFeaturesArea;
        }
        this.InnerElements = _innerElements;

        //Private methods
        function makeToggleable() {
            _innerElements.innerFeatureArea.bind("click", function () {
                toggleFeatureSelection(_thisUIConfigurationFeature);
            });
        }
        function changeState(state) {
            _currentState = state;
            _innerElements.entry.attr("featureSelectionState", _currentState);
        }
        function createAttributeHTML(attribute, attributeValue) {

            //Variables
            var attributeTypeName = getEnumEntryByID(systemDefaults.enums.attributeTypes, attribute.AttributeType).name;
            var dataTypeName = getEnumEntryByID(systemDefaults.enums.attributeDataTypes, attribute.AttributeDataType).name;
            var outerControl = null, innerControl = null;

            //Create HTML
            outerControl = $("<div class='Attribute'>" + attribute.Name + "</div>");
            switch (dataTypeName) {
                case systemDefaults.enums.attributeDataTypes.integer.name:
                    innerControl = $("<input type='text' class='Textbox' style='text-align:right' value='0'/>").appendTo(outerControl);
                    if (attributeValue != null) {
                        $(innerControl).val(attributeValue.Value);
                    }
                    break;
                case systemDefaults.enums.attributeDataTypes.boolean.name:
                    innerControl = $("<input type='checkbox' class='InnerCheckbox' />").appendTo(outerControl);
                    if (attributeValue != null) {
                        $(innerControl).val(attributeValue.Value);
                    }
                    break;
                case systemDefaults.enums.attributeDataTypes.string.name:
                    innerControl = $("<input type='text' class='Textbox' style='text-align:right' value='0'/>").appendTo(outerControl);
                    if (attributeValue != null) {
                        $(innerControl).val(attributeValue.Value);
                    }
                    break;
            }

            //Make the control editable/disabled
            switch (attributeTypeName) {
                case systemDefaults.enums.attributeTypes.constant.name:
                    innerControl.attr("disabled", true);
                    break;
                case systemDefaults.enums.attributeTypes.dynamic.name:
                    innerControl.attr("disabled", true);
                    break;
                case systemDefaults.enums.attributeTypes.userInput.name:

                    break;
            }

            //Set defaultValue
            return outerControl;
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
                var attributeVal = null;
                if (attributeValues != null && i < attributeValues.length)
                    attributeVal = attributeValues[i];
                var attrHTML = createAttributeHTML(dataAttr, attributeVal).appendTo(_innerElements.attributesArea);
            }

            //ChildFeaturesArea
            _innerElements.childFeaturesArea = $("<div class='ChildFeaturesArea'></div>").appendTo(_outerElement);

            //Setup 
            if (_parent != null)
                _parent.RefreshGraphicalRepresentation();
            makeToggleable();
        }
        this.RefreshGraphicalRepresentation = function () {
            _innerElements.childFeaturesArea.children(".Entry").removeAttr("last");
            _innerElements.childFeaturesArea.children(".Entry:last").attr("last", "last");
        }
        this.Update = function (newSelectionState) {
            changeState(newSelectionState);
        }
        this.AddChild = function (UIConfigurationElement) {
            _children.push(UIConfigurationElement);
            UIConfigurationElement.SetParent(_thisUIConfigurationFeature);

        }
        this.SetParent = function (parentUIConfigurationElement) {
            _parent = parentUIConfigurationElement;
        }
    }
    var UIGroup = function (clientObjectGUID) {

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
        this.ClientObjectGUID = clientObjectGUID;
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

    //Sync with data model
    var toggleFeatureSelection = function (UIFeature) {

        //Get the related FeatureSelection
        var featureClientObject = _configurationDataModel.GetByGUID(UIFeature.ClientObjectGUID);
        var featureSelectionClientObject = featureClientObject.FeatureSelection;

        //Set its SelectionState field
        var currentSelectionState = getEnumEntryByID(systemDefaults.enums.featureSelectionStates, featureSelectionClientObject.GetField("SelectionState")).name;
        switch (currentSelectionState) {
            //Unselected                                                                                                                             
            case systemDefaults.enums.featureSelectionStates.unselected.name:
                _configurationDataModel.UpdateClientObjectField(featureSelectionClientObject.GUID, "SelectionState", systemDefaults.enums.featureSelectionStates.selected.id);
                break;
            //Selected                                                                                                                              
            case systemDefaults.enums.featureSelectionStates.selected.name:
                _configurationDataModel.UpdateClientObjectField(featureSelectionClientObject.GUID, "SelectionState", systemDefaults.enums.featureSelectionStates.deselected.id);
                break;
            //Deselected                                                                                                                               
            case systemDefaults.enums.featureSelectionStates.deselected.name:
                _configurationDataModel.UpdateClientObjectField(featureSelectionClientObject.GUID, "SelectionState", systemDefaults.enums.featureSelectionStates.unselected.id);
                break;
        }
    }
    updateElement = function (guid) {

        //Variables
        var clientObject = _configurationDataModel.GetByGUID(guid);
        var type = clientObject.GetType();

        //Perform update according to type
        switch (type) {
            case "featureSelection":
                var featureGUID = clientObject.Feature.GUID;
                var UIElement = _UIElements[featureGUID];
                var newSelectionState = getEnumEntryByID(systemDefaults.enums.featureSelectionStates, clientObject.GetField("SelectionState")).name;
                UIElement.Update(newSelectionState);
                break;
        }
    }

    //Sync with dataModel methods
    var createFeature = function (clientObject, parentUIConfigurationElement) {

        //Determine if it is the root
        var isRoot = (parentUIConfigurationElement == undefined);

        //Get the associated FeatureSelection object
        var featureSelectionClientObject = _configurationDataModel.GetByGUID(clientObject.FeatureSelection.GUID);
        var selectionState = getEnumEntryByID(systemDefaults.enums.featureSelectionStates, featureSelectionClientObject.GetField("SelectionState")).name;
        var attributeValues = featureSelectionClientObject.GetField("AttributeValues");

        //Create the Feature 
        var UIfeature = new UIFeature(clientObject.GUID, isRoot, selectionState, clientObject.GetField("Name"), clientObject.GetField("Attributes"), attributeValues);
        if (!isRoot) {
            parentUIConfigurationElement.AddChild(UIfeature); //add to parent if it has one
        }
        UIfeature.CreateGraphicalRepresentation();
        _UIElements[clientObject.GUID] = UIfeature;

        //Create child Features
        for (var i = 0; i < clientObject.ChildFeatures.length; i++) {
            createFeature(clientObject.ChildFeatures[i], UIfeature);
        }

        //Create child Groups
        for (var i = 0; i < clientObject.ChildGroups.length; i++) {
            createGroup(clientObject.ChildGroups[i], UIfeature);
        }
    }
    var createGroup = function (clientObject, parentUIConfigurationElement) {

        //Create the UIConfigurationElement 
        var UIgroup = new UIGroup(clientObject.GUID);
        parentUIConfigurationElement.AddChild(UIgroup);
        UIgroup.CreateGraphicalRepresentation();
        _UIElements[clientObject.GUID] = UIgroup;

        //Create child Features
        for (var i = 0; i < clientObject.ChildFeatures.length; i++) {
            createFeature(clientObject.ChildFeatures[i], UIgroup);
        }
    }

    //Eventhandlers
    this.OnClientObjectsLoaded = function () {

        //Create features/featureGroups recursively starting from the root
        var rootFeatureClientObject = _configurationDataModel.GetByGUID(_configurationDataModel.GetRootGUID());
        createFeature(rootFeatureClientObject);
    }
    this.OnClientObjectUpdated = function (guid) {
        updateElement(guid);
    }
}


