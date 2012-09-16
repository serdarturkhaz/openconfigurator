// Developed by OpenConfigurator Core Team
// 
// Distributed under the MIT license
// ===========================================================
// Copyright (c) 2012 - Radu Mitache
// Edited by: Josef A. Habdank
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), 
// to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, 
// publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR 
// OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR 
// OTHER DEALINGS IN THE SOFTWARE.

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
                id: 1,
                defaultValue: 0
            },
            boolean: {
                name: "boolean",
                label: "Boolean",
                id: 2,
                defaultValue: false
            },
            string: {
                name: "string",
                label: "String",
                id: 3,
                defaultValue: ""
            }
        }
    }
};

//ClientObjects***************************************************************************************************
var ClientObjects = {
    Feature: null,
    Group: null,
    FeatureSelection: null,
    Attribute: null,
    AttributeValue: null
};

ClientObjects.Feature = function (businessObject) {

    //Fields
    var _guid = null;
    var _businessObject = businessObject;
    var _featureSelection = {}, _childFeatures = [], _childGroups = [], _parent = {}, _attributes = [];

    //Properties
    this.GUID = _guid;
    this.GetType = function () {
        return "feature";
    }
    this.FeatureSelection = _featureSelection;
    this.ChildFeatures = _childFeatures;
    this.ChildGroups = _childGroups;
    this.Attributes = _attributes;
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
    var _feature = {}, _attributeValues = [];

    //Properties
    this.GUID = _guid;
    this.GetType = function () {
        return "featureSelection";
    }
    this.Feature = _feature;
    this.AttributeValues = _attributeValues;

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
ClientObjects.Attribute = function (businessObject) {

    //Fields
    var _guid = null;
    var _businessObject = businessObject;
    var _feature = {}, _attributeValue = {};

    //Properties
    this.GUID = _guid;
    this.GetType = function () {
        return "attribute";
    }
    this.Feature = _feature;
    this.AttributeValue = _attributeValue;

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
ClientObjects.AttributeValue = function (businessObject) {

    //Fields
    var _guid = null;
    var _businessObject = businessObject;
    var _featureSelection = {}, _attribute = {};

    //Properties
    this.GUID = _guid;
    this.GetType = function () {
        return "attributeValue";
    }
    this.FeatureSelection = _featureSelection;
    this.Attribute = _attribute;

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
        featureSelections: {},
        attributes: {},
        attributeValues: {}
    }
    var _lookupTables = {
        featureIDsToFeatureSelections: {},
        attributeIDsToAttributeValues: {}
    }
    var _configurationID = configurationID, _configuration = null, _model = null, _rootFeatureGUID = null, _configurationName = configurationName;
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
        internalFeatureSelectionToggled.Add(new EventHandler(onInternalFeatureSelectionToggled));
    }
    this.GetRootGUID = function () {
        return _rootFeatureGUID;
    }

    //Public methods
    this.LoadData = function (onFinished) {

        //Load data
        $.ajax({
            url: "/ConfigurationEditor/LoadData",
            data: JSON.stringify({ configurationID: _configurationID }),
            async: false,
            success: function (response) {
                _configuration = response[0];
                _model = response[1];

                //Load FeatureSelections
                for (var i = 0; i < _configuration.FeatureSelections.length; i++) {

                    //Create a new ClientDataObject
                    var featureSelection = _configuration.FeatureSelections[i];
                    var featureSelectionClientObject = new ClientObjects.FeatureSelection(featureSelection);
                    _thisConfigurationDataModel.RegisterClientObject(featureSelectionClientObject);

                    //Place the featureSelection in a lookup table, with its FeatureID as key
                    var featureID = featureSelectionClientObject.GetField("FeatureID");
                    _lookupTables.featureIDsToFeatureSelections[featureID] = featureSelectionClientObject.GUID;

                    //Load AttributeValues-----------------------------------------------------------------------
                    for (var j = 0; j < featureSelection.AttributeValues.length; j++) {
                        var attributeValue = featureSelection.AttributeValues[j];
                        var attributeValueClientObject = new ClientObjects.AttributeValue(attributeValue);
                        _thisConfigurationDataModel.RegisterClientObject(attributeValueClientObject);

                        //Set references
                        featureSelectionClientObject.AttributeValues.push(attributeValueClientObject);
                        attributeValueClientObject.FeatureSelection = featureSelectionClientObject;

                        //Place the attributeValue in a lookup table, with its AttributeID as key
                        var attributeID = attributeValueClientObject.GetField("AttributeID");
                        _lookupTables.attributeIDsToAttributeValues[attributeID] = attributeValueClientObject.GUID;
                    }
                    //-------------------------------------------------------------------------------------------
                }

                //Load Features
                for (var i = 0; i < _model.Features.length; i++) {

                    //Variables
                    var feature = _model.Features[i];
                    var childRelationsGUIDs, childGroupRelationsGUIDs;
                    var parentRelationsGUIDs, parentGroupRelationsGUIDs;

                    //Create a new ClientDataObject
                    var featureClientObject = new ClientObjects.Feature(feature);
                    _thisConfigurationDataModel.RegisterClientObject(featureClientObject);

                    //Set references-----------------------------------------------------------------------------------------
                    var featureSelectionClientObject = null;
                    var featureSelectionGUID = _lookupTables.featureIDsToFeatureSelections[feature.ID];
                    featureSelectionClientObject = _thisConfigurationDataModel.GetByGUID(featureSelectionGUID);

                    //Set Feature and FeatureSelection references
                    featureClientObject.FeatureSelection = featureSelectionClientObject;
                    featureSelectionClientObject.Feature = featureClientObject;
                    //-------------------------------------------------------------------------------------------------------

                    //Load Attributes----------------------------------------------------------------------------------------
                    for (var j = 0; j < feature.Attributes.length; j++) {
                        var attribute = feature.Attributes[j];
                        var attributeClientObject = new ClientObjects.Attribute(attribute);
                        _thisConfigurationDataModel.RegisterClientObject(attributeClientObject);

                        //Get the related AttributeValue
                        var attributeValueClientObject = null;
                        var attributeValueGUID = _lookupTables.attributeIDsToAttributeValues[attribute.ID];
                        attributeValueClientObject = _thisConfigurationDataModel.GetByGUID(attributeValueGUID);

                        //Set references
                        featureClientObject.Attributes.push(attributeClientObject);
                        attributeClientObject.Feature = featureClientObject;
                        attributeValueClientObject.Attribute = attributeClientObject;
                        attributeValueClientObject.FeatureSelection = featureSelectionClientObject;
                        attributeClientObject.AttributeValue = attributeValueClientObject;
                    }
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

            //Attach new BusinessObjects -> AttributeValues to FeatureSelection
            for (var i = 0; i < clientObject.AttributeValues.length; i++) {
                if (clientObject.AttributeValues[i].GetField("ID") == 0) { //add
                    var BLLfeatureSelection = clientObject.GetBusinessObjectCopy();
                    var BLLattributeValue = clientObject.AttributeValues[i].GetBusinessObjectCopy();
                    BLLfeatureSelection.AttributeValues.push(BLLattributeValue);
                    clientObject.UpdateBusinessObject(BLLfeatureSelection);
                }
                else { //update
                    var BLLfeatureSelection = clientObject.GetBusinessObjectCopy();
                    var BLLattributeValue = clientObject.AttributeValues[i].GetBusinessObjectCopy();
                    BLLfeatureSelection.AttributeValues[i] = BLLattributeValue;
                }
            }

            //
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
            case "featureSelection":
                newClientObject = new ClientObjects.FeatureSelection(newBusinessObject);
                break;
            case "attributeValue":
                newClientObject = new ClientObjects.AttributeValue(newBusinessObject);
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
    this.UpdateClientObject = function (guid, modifiedBusinessObject) {

        //Update the whole businessDataObject
        _clientObjects.all[guid].UpdateBusinessObject(modifiedBusinessObject);

        //Raise events
        _thisConfigurationDataModel.ClientObjectUpdated.RaiseEvent(guid);
    }
    this.UpdateClientObjectField = function (guid, fieldName, value) {

        //Raise events
        var clientObject = _clientObjects.all[guid];
        var type = clientObject.GetType();
        if (type == "featureSelection" && fieldName == "SelectionState") {
            //Event when a FeatureSelection was toggled
            var featureID = _clientObjects.all[guid].GetField("FeatureID");
            internalFeatureSelectionToggled.RaiseEvent([guid, featureID, value]);
        }
        else {
            //Normal event
            _clientObjects.all[guid].SetField(fieldName, value);
            _thisConfigurationDataModel.ClientObjectUpdated.RaiseEvent(guid);
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
    this.GetModelID = function () {
        return _model.ID;
    }
    this.GetConfigurationID = function () {
        return _configuration.ID;
    }

    //Events
    this.ClientObjectsLoaded = new Event();
    this.ClientObjectUpdated = new Event();
    var internalFeatureSelectionToggled = new Event();

    //Eventhandlers
    var onInternalFeatureSelectionToggled = function (featureSelectionGUID, featureID, selectionState) {
        $.ajax({
            url: "/ConfigurationEditor/ToggleFeature",
            data: JSON.stringify({ configurationID: _configuration.ID, FeatureID: featureID, newState: selectionState }),
            async: false,
            success: function (response) {
                var featureSelections = response;
                if (featureSelections != false) {

                    //Update FeatureSelections
                    for (var guidkey in featureSelections) {
                        var updatedFeatureSelectionBusinessObj = featureSelections[guidkey]; //Get the updated business object

                        //Find the corresponding featureSelection ClientObject
                        var existingClientFeatureSelectionGUID = _lookupTables.featureIDsToFeatureSelections[updatedFeatureSelectionBusinessObj.FeatureID];
                        _thisConfigurationDataModel.UpdateClientObject(existingClientFeatureSelectionGUID, updatedFeatureSelectionBusinessObj);

                        //Update AttributeValues
                        for (var i = 0; i < updatedFeatureSelectionBusinessObj.AttributeValues.length; i++) {

                            //Find the corresponding featureSelection ClientObject
                            var existingClientAttributeValueGUID = _lookupTables.attributeIDsToAttributeValues[updatedFeatureSelectionBusinessObj.AttributeValues[i].AttributeID];
                            _thisConfigurationDataModel.UpdateClientObjectField(existingClientAttributeValueGUID, "Value", updatedFeatureSelectionBusinessObj.AttributeValues[i].Value);
                        }

                    }
                }
            }
        });
    }
}
var ClientController = function (standardViewContainer, configurationNameTextbox, configurationDataModelInstance) {

    //Fields and variables
    var _configurationDataModel = configurationDataModelInstance;
    var _standardView;
    var _configurationNameTextbox = configurationNameTextbox;
    var _thisClientController = this;

    //Constructor/Initalizers
    this.Initialize = function () {


        //Clear the ISolverContext residing in the Session when the Page is unloaded
        $(window).unload(function () {
            $.ajax({
                url: "/ConfigurationEditor/ClearSessionContext",
                data: JSON.stringify({ configurationID: _configurationDataModel.GetConfigurationID() }),
                async: false,
                success: function (response) {

                }
            });
        });

        //Load stuff
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
    var UIFeature = function (clientObjectGUID, isRoot, initialState, name, description, disabled) {

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
        var _disabled = disabled;
        var _parent = null, _children = [], _UIAttributes = [];
        var _name = name, _description = description == null ? "" : description, _isRoot = isRoot;
        var _thisUIConfigurationFeature = this;

        //Properties
        this.ClientObjectGUID = clientObjectGUID;
        this.GetTypeName = function () {
            return "feature";
        }
        this.GetChildrenContainer = function () {
            return _innerElements.childFeaturesArea;
        }
        this.GetAttributesContainer = function () {
            return _innerElements.attributesArea;
        }
        this.InnerElements = _innerElements;

        //Private methods
        function makeToggleable() {
            _innerElements.innerFeatureArea.bind("click", function () {
                toggleFeatureSelection(_thisUIConfigurationFeature);
            });
        }
        function makeUnToggleable() {
            _innerElements.innerFeatureArea.unbind("click");
        }
        function changeState(state) {
            _currentState = state;
            _innerElements.entry.attr("featureSelectionState", _currentState);
        }
        function setDisabled(disabledBool) {
            if (disabledBool == true) { //Disable
                makeUnToggleable();
                _innerElements.entry.attr("isdisabled", true);
            } else if (disabledBool == false && _disabled == true) { //Enable
                makeToggleable();
                _innerElements.entry.removeAttr("isdisabled");
            }

            _disabled = disabledBool;
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
                        $(innerControl).val(attributeValue.GetField("Value"));
                    }
                    break;
                case systemDefaults.enums.attributeDataTypes.boolean.name:
                    innerControl = $("<input type='checkbox' class='InnerCheckbox' />").appendTo(outerControl);
                    if (attributeValue != null) {
                        $(innerControl).val(attributeValue.GetField("Value"));
                    }
                    break;
                case systemDefaults.enums.attributeDataTypes.string.name:
                    innerControl = $("<input type='text' class='Textbox' style='text-align:right' value='0'/>").appendTo(outerControl);
                    if (attributeValue != null) {
                        $(innerControl).val(attributeValue.GetField("Value"));
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
            _innerElements.innerFeatureArea = $("<div class='InnerFeatureArea' title='" + _description + "' ></div>").appendTo(_outerElement);
            _innerElements.headerDiv = $("<div class='HeaderDiv'></div>").appendTo(_innerElements.innerFeatureArea);
            _innerElements.nameLabel = $("<div class='NameLabel'>" + _name + "</div>").appendTo(_innerElements.headerDiv);
            _innerElements.checkbox = $("<div class='Checkbox' ></div>").appendTo(_innerElements.headerDiv);

            //AttributesArea
            _innerElements.attributesArea = $("<div style='display:none' class='AttributesArea'></div>").appendTo(_outerElement);

            //ChildFeaturesArea
            _innerElements.childFeaturesArea = $("<div class='ChildFeaturesArea'></div>").appendTo(_outerElement);

            //Setup 
            if (_parent != null)
                _parent.RefreshGraphicalRepresentation();
            makeToggleable();
            if (_disabled == true) {
                setDisabled(true);
            }
        }
        this.RefreshGraphicalRepresentation = function () {
            _innerElements.childFeaturesArea.children(".Entry").removeAttr("last");
            _innerElements.childFeaturesArea.children(".Entry:last").attr("last", "last");
        }
        this.Update = function (newSelectionState, newDisabledState) {
            changeState(newSelectionState);
            setDisabled(newDisabledState);
        }
        this.AddChild = function (UIConfigurationElement) {
            _children.push(UIConfigurationElement);
            UIConfigurationElement.SetParent(_thisUIConfigurationFeature);

        }
        this.AddAttribute = function (UIConfigurationElement) {
            _UIAttributes.push(UIConfigurationElement);
            UIConfigurationElement.SetParentUIFeature(_thisUIConfigurationFeature);
            _innerElements.attributesArea.css("display", "block");
        }
        this.SetParent = function (parentUIConfigurationElement) {
            _parent = parentUIConfigurationElement;
        }
    }
    var UIAttribute = function (clientObjectGUID, attributeType, attributeDataType, name, description, value) {

        //Fields
        var _outerElement = null;
        var _innerElements = {
            innerControl: null
        }
        var _parentUIFeature = null, _name = name, _description = description == null ? "" : description, _attributeType = attributeType, _attributeDataType = attributeDataType;

        //Properties
        this.ClientObjectGUID = clientObjectGUID;

        //Public methods
        this.CreateGraphicalRepresentation = function () {

            //Variables
            var parentContainer = _parentUIFeature.GetAttributesContainer();
            var attributeTypeName = getEnumEntryByID(systemDefaults.enums.attributeTypes, attributeType).name;
            var dataTypeName = getEnumEntryByID(systemDefaults.enums.attributeDataTypes, _attributeDataType).name;
            var getValue = function (control) {
                return $(control).val();
            };

            //Create HTML
            _outerElement = $("<div class='Attribute' title='" + _description + "'>" + _name + "</div>").appendTo(parentContainer);
            switch (dataTypeName) {
                //Integer   
                case systemDefaults.enums.attributeDataTypes.integer.name:
                    _innerElements.innerControl = $("<input type='text' class='Textbox' style='text-align:right' value='0'/>").appendTo(_outerElement);
                    $(_innerElements.innerControl).val(value);
                    break;
                //Boolean   
                case systemDefaults.enums.attributeDataTypes.boolean.name:
                    _innerElements.innerControl = $("<input type='checkbox' class='InnerCheckbox' />").appendTo(_outerElement);
                    if (value == true || value == "True") {
                        $(_innerElements.innerControl).attr("checked", true);
                    }

                    //
                    getValue = function (control) {
                        return $(control).is(':checked');
                    }
                    break;
                //String   
                case systemDefaults.enums.attributeDataTypes.string.name:
                    _innerElements.innerControl = $("<input type='text' class='Textbox' style='text-align:right' value='0'/>").appendTo(_outerElement);
                    $(_innerElements.innerControl).val(value);
                    break;
            }

            //Make the control editable/disabled
            switch (attributeTypeName) {
                case systemDefaults.enums.attributeTypes.constant.name:
                    _innerElements.innerControl.attr("disabled", true);
                    break;
                case systemDefaults.enums.attributeTypes.dynamic.name:
                    _innerElements.innerControl.attr("disabled", true);
                    break;
                case systemDefaults.enums.attributeTypes.userInput.name:
                    _innerElements.innerControl.bind("change", function (e) {
                        var newValue = getValue($(this));
                        InternalAttributeValueChanged.RaiseEvent([clientObjectGUID, newValue]);
                    });

                    break;
            }
        }
        this.Update = function (newValue) {
            _innerElements.innerControl.val(newValue);
        }
        this.SetParentUIFeature = function (parentUIConfigurationElement) {
            _parentUIFeature = parentUIConfigurationElement;
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

        //Set internal eventhandlers
        InternalAttributeValueChanged.Add(new EventHandler(onInternalAttributeValueChanged));
    };

    //Private methods
    var toggleFeatureSelection = function (UIFeature) {

        //Get the related FeatureSelection
        var featureClientObject = _configurationDataModel.GetByGUID(UIFeature.ClientObjectGUID);
        var featureSelectionClientObject = featureClientObject.FeatureSelection;

        //Set its SelectionState and ToggledByUser fields
        _configurationDataModel.UpdateClientObjectField(featureSelectionClientObject.GUID, "ToggledByUser", true);
        var currentSelectionState = getEnumEntryByID(systemDefaults.enums.featureSelectionStates, featureSelectionClientObject.GetField("SelectionState")).name;
        switch (currentSelectionState) {

            //Unselected -> Selected                                                                                                                                                                                                
            case systemDefaults.enums.featureSelectionStates.unselected.name:
                _configurationDataModel.UpdateClientObjectField(featureSelectionClientObject.GUID, "SelectionState", systemDefaults.enums.featureSelectionStates.selected.id);
                break;

            //Selected -> Deselected                           
            case systemDefaults.enums.featureSelectionStates.selected.name:
                _configurationDataModel.UpdateClientObjectField(featureSelectionClientObject.GUID, "SelectionState", systemDefaults.enums.featureSelectionStates.deselected.id);
                break;

            //Deselected -> Unselected                            
            case systemDefaults.enums.featureSelectionStates.deselected.name:
                _configurationDataModel.UpdateClientObjectField(featureSelectionClientObject.GUID, "SelectionState", systemDefaults.enums.featureSelectionStates.unselected.id);
                break;
        }
    }

    //Sync with data model
    var updateElement = function (guid) {

        //Variables
        var clientObject = _configurationDataModel.GetByGUID(guid);
        var type = clientObject.GetType();

        //Perform update according to type
        switch (type) {
            case "featureSelection":
                var featureGUID = clientObject.Feature.GUID;
                var UIElement = _UIElements[featureGUID];
                var newSelectionState = getEnumEntryByID(systemDefaults.enums.featureSelectionStates, clientObject.GetField("SelectionState")).name;
                var disabledState = clientObject.GetField("Disabled");

                UIElement.Update(newSelectionState, disabledState);
                break;
            case "attributeValue":
                var attributeGUID = clientObject.Attribute.GUID;
                var UIElement = _UIElements[attributeGUID];
                var newValue = clientObject.GetField("Value");

                UIElement.Update(newValue);
                break;
        }
    }
    var createFeature = function (clientObject, parentUIConfigurationElement) {

        //Determine if it is the root
        var isRoot = (parentUIConfigurationElement == undefined);

        //Get the associated FeatureSelection object
        var featureSelectionClientObject = _configurationDataModel.GetByGUID(clientObject.FeatureSelection.GUID);
        var selectionState = getEnumEntryByID(systemDefaults.enums.featureSelectionStates, featureSelectionClientObject.GetField("SelectionState")).name;
        var attributeValues = featureSelectionClientObject.AttributeValues;
        var attributes = clientObject.Attributes;

        //Create the Feature --------------------------------------------------------------------------
        var UIfeature = new UIFeature(clientObject.GUID, isRoot, selectionState, clientObject.GetField("Name"), clientObject.GetField("Description"), featureSelectionClientObject.GetField("Disabled"));
        if (!isRoot) {
            parentUIConfigurationElement.AddChild(UIfeature); //add to parent if it has one
        }
        UIfeature.CreateGraphicalRepresentation();
        _UIElements[clientObject.GUID] = UIfeature;

        //Create its Attributes
        for (var i = 0; i < attributes.length; i++) {
            var attributeType = attributes[i].GetField("AttributeType"), attributeDataType = attributes[i].GetField("AttributeDataType"), name = attributes[i].GetField("Name");
            var value = attributes[i].AttributeValue.GetField("Value");
            var description = attributes[i].GetField("Description");
            var UIattribute = new UIAttribute(attributes[i].GUID, attributeType, attributeDataType, name, description, value);
            UIfeature.AddAttribute(UIattribute);
            UIattribute.CreateGraphicalRepresentation();

            _UIElements[attributes[i].GUID] = UIattribute;
        }
        //---------------------------------------------------------------------------------------------

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

    //Events
    var InternalAttributeValueChanged = new Event();

    //Eventhandlers
    this.OnClientObjectsLoaded = function () {

        //Create features/featureGroups recursively starting from the root
        var rootFeatureClientObject = _configurationDataModel.GetByGUID(_configurationDataModel.GetRootGUID());
        createFeature(rootFeatureClientObject);
    }
    this.OnClientObjectUpdated = function (guid) {
        updateElement(guid);
    }
    var onInternalAttributeValueChanged = function (attributeGUID, newValue) {
        var attributeClientObject = _configurationDataModel.GetByGUID(attributeGUID);
        _configurationDataModel.UpdateClientObjectField(attributeClientObject.AttributeValue.GUID, "Value", newValue);
    }
}


