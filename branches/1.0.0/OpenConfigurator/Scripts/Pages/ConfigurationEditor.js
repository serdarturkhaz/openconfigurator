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
    var _configurationID = configurationID, _configuration = null, _model = null, _uiTemplate = null;
    var _rootFeatureGUID = null, _configurationName = configurationName;
    var _thisConfigurationDataModel = this;

    //Private methods
    function getDefaultBusinessObject(type) {
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
    function evalDatabindExpression(expression) {

        //The return result is returned as a collection of the below objects
        /*var expressionResultObject = {
        BusinessObject: null,
        Type: ""
        };*/

        //Get the special objects
        var resultObjectsCollection = null;
        $.ajax({
            url: "/ConfigurationEditor/EvalDatabindExpression",
            data: JSON.stringify({ configurationID: configurationID, expression: expression }),
            async: false,
            success: function (dataObj) {
                resultObjectsCollection = dataObj;
            }
        });

        //Convert the special objects to client objects
        var clientObjectsCollection = [];
        for (var i = 0; i < resultObjectsCollection.length; i++) {

            //Get the client object
            var resultObject = resultObjectsCollection[i];
            var objectTypeName = resultObject.Type.toLowerCase();
            var clientObject = _thisConfigurationDataModel.GetByID(resultObject.BusinessObject.ID, objectTypeName);

            //Add to the  collection
            clientObjectsCollection.push(clientObject);
        }

        //Return result
        return clientObjectsCollection;
    }
    function fSelectionsEqual(firstBusinessObj, secondBusinessObj) {

        //Compare selectedState and disabled
        var selectionStateEqual = firstBusinessObj.SelectionState == secondBusinessObj.SelectionState;
        var disabledEqual = firstBusinessObj.Disabled == secondBusinessObj.Disabled;

        //
        var equal = selectionStateEqual && disabledEqual;
        return equal;
    }
    function toggleSolverFSelection(featureSelectionGUID, featureID, newSelectionStateID) {
        $.ajax({
            url: "/ConfigurationEditor/ToggleFeature",
            data: JSON.stringify({ configurationID: _configuration.ID, featureID: featureID, newStateID: newSelectionStateID }),
            async: false,
            success: function (response) {
                var featureSelections = response;
                if (featureSelections != false) {

                    //Update FeatureSelections
                    for (var guidkey in featureSelections) {

                        //Get the FeatureSelection returned from the server and the existing FeatureSelection
                        var updatedFSelBusinessObj = featureSelections[guidkey]; //Get the updated business object

                        //Get the FeatureSelection which already exists on the client
                        var existingClientFSelectionGUID = _lookupTables.featureIDsToFeatureSelections[updatedFSelBusinessObj.FeatureID];
                        var existingFSelection = _thisConfigurationDataModel.GetByGUID(existingClientFSelectionGUID);

                        //Update the existing FeatureSelection, if it has changed
                        var fSelectionsDif = !fSelectionsEqual(updatedFSelBusinessObj, existingFSelection.GetBusinessObjectCopy());
                        if (fSelectionsDif) {
                            _thisConfigurationDataModel.UpdateClientObject(existingClientFSelectionGUID, updatedFSelBusinessObj);
                        }

                        ////Update AttributeValues
                        //for (var i = 0; i < updatedFeatureSelectionBusinessObj.AttributeValues.length; i++) {
                        //    var existingClientAttributeValueGUID = _lookupTables.attributeIDsToAttributeValues[updatedFeatureSelectionBusinessObj.AttributeValues[i].AttributeID];
                        //    _thisConfigurationDataModel.UpdateClientObjectField(existingClientAttributeValueGUID, "Value", updatedFeatureSelectionBusinessObj.AttributeValues[i].Value);
                        //}
                    }

                    //Raise event to notify Update operation has completed
                    _thisConfigurationDataModel.SolverFeedbackUpdatesComplete.RaiseEvent();
                }
            }
        });
    }

    //Constructor/Initalizers
    this.Initialize = function () {
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
                _configuration = response.ConfigurationObj;
                _model = response.ModelObj;
                _uiTemplate = response.TemplateObj;

                //Register Configuration elements
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
                for (var i = 0; i < _model.Relations.length; i++) {

                    //Set references-----------------------------------------------------------------------------------------
                    var parentFeatureClientObject = _thisConfigurationDataModel.GetByID(_model.Relations[i].ParentFeatureID, "feature");
                    var childFeatureClientObject = _thisConfigurationDataModel.GetByID(_model.Relations[i].ChildFeatureID, "feature");

                    //Set childFeatures, parent references
                    parentFeatureClientObject.ChildFeatures.push(childFeatureClientObject);
                    childFeatureClientObject.Parent = parentFeatureClientObject;
                    //-------------------------------------------------------------------------------------------------------

                }
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
        _thisConfigurationDataModel.UITemplateLoaded.RaiseEvent();

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
    this.SetFeatureSelectionState = function (featureSelectionGuid, newSelectionStateID) {

        //Get the featureSelection
        var featureSelection = _thisConfigurationDataModel.GetByGUID(featureSelectionGuid);
        var featureID = featureSelection.Feature.GetField("ID");

        //Modify it using the server-side Solver
        toggleSolverFSelection(featureSelectionGuid, featureID, newSelectionStateID);
    }
    this.GetTemplateField = function (fieldName) {
        var fieldValue = _uiTemplate[fieldName]
        return fieldValue;
    }
    this.EvalDatabindExpression = function (expression) {
        return evalDatabindExpression(expression);
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
    this.UITemplateLoaded = new Event();
    this.ClientObjectUpdated = new Event();
    this.SolverFeedbackUpdatesComplete = new Event();
}
var ClientController = function (interactiveViewContainer, configurationNameTextbox, headerLabel, configurationDataModelInstance) {

    //Fields and variables
    var _configurationDataModel = configurationDataModelInstance;
    var _interactiveView;
    var _configurationNameTextbox = configurationNameTextbox, _headerLabel = headerLabel;
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
        $("#InteractiveViewBox").block({ message: "Loading diagram...", fadeIn: 300 });
        $.timer(300, function () {

            //Instantiate/Initialize controls
            _interactiveView = new InteractiveView($(interactiveViewContainer)[0], _configurationDataModel);
            _interactiveView.Initialize();

            //Eventhandlers for InteractiveView
            _configurationDataModel.UITemplateLoaded.Add(new EventHandler(_interactiveView.OnUITemplateLoaded));
            _configurationDataModel.ClientObjectUpdated.Add(new EventHandler(_interactiveView.OnClientObjectUpdated));
            _configurationDataModel.SolverFeedbackUpdatesComplete.Add(new EventHandler(_interactiveView.OnSolverFeedbackUpdatesComplete));

            //Load the data - delay to make sure iframe has finished loading
            $.timer(300, function () {
                _configurationDataModel.LoadData(function (configuration) {
                    $(_configurationNameTextbox).val(configuration.Name);

                    //Header label
                    var string = "Configure - {0} ({1})";
                    var headerText = string.replace("{0}", configuration.ModelName).replace("{1}", configuration.UITemplateName);
                    $(_headerLabel).text(headerText);

                    $("#InteractiveViewBox").unblock();
                });
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
var InteractiveView = function (container, configurationDataModelInstance) {

    //Fields
    var _configurationDataModel = configurationDataModelInstance;
    var _container = container;
    var _UIControlInstances = {}; //dictionary to hold all UIControl instances (instanceID, UIControl instance)
    var _uiControlTypesUsed = {}; //keeps track of which css has been registered
    var _clientObjectListeners = { //collection mapping (ID - feature or attribute, instanceID)
        features: {},
        attributes: {}
    };
    var _modifiedBoundDataControls = {}; //keeps track of controls which have had their data changed - (controlInstance, array of clientObjects)
    var _iframeInstance = null, _body = null, _head = null;
    var _controlInstanceIDcounter = 0;
    var _thisInteractiveView = this;

    //Collection of methods accessible by UIControls
    var ViewInterface = {};
    ViewInterface.GetFeatureSelectionState = function (featureSelectionClientObject) {
        //
        var selectionState = getEnumEntryByID(systemDefaults.enums.featureSelectionStates, featureSelectionClientObject.GetField("SelectionState")).name;
        return selectionState;
    }
    ViewInterface.SetFeatureSelectionState = function (featureSelectionGUID, newState) {
        
        //Get the related FeatureSelection
        var featureSelectionClientObject = _configurationDataModel.GetByGUID(featureSelectionGUID);
        var featureClientObject = featureSelectionClientObject.Feature;

        //Set the new state
        var newStateID = systemDefaults.enums.featureSelectionStates[newState].id;
        _configurationDataModel.SetFeatureSelectionState(featureSelectionClientObject.GUID, newStateID);
    }
    ViewInterface.ToggleFeatureSelectionState = function (featureSelectionGUID) {
        
        //Get the related FeatureSelection
        var featureSelectionClientObject = _configurationDataModel.GetByGUID(featureSelectionGUID);
        var featureClientObject = featureSelectionClientObject.Feature;

        //Determine its SelectionState and ToggledByUser fields
        var currentSelectionState = getEnumEntryByID(systemDefaults.enums.featureSelectionStates, featureSelectionClientObject.GetField("SelectionState")).name;
        var newSelectionState = null;
        switch (currentSelectionState) {

            //Unselected -> becomes Selected                                                                                                                                                                                                                                                                                                                                              
            case systemDefaults.enums.featureSelectionStates.unselected.name:
                newSelectionState = systemDefaults.enums.featureSelectionStates.selected;
                break;

            //Selected -> becomes Deselected                                                                                                                                                                        
            case systemDefaults.enums.featureSelectionStates.selected.name:
                newSelectionState = systemDefaults.enums.featureSelectionStates.deselected;
                break;

            //Deselected -> becomes Unselected                                                                                                                                                                         
            case systemDefaults.enums.featureSelectionStates.deselected.name:
                newSelectionState = systemDefaults.enums.featureSelectionStates.unselected;
                break;
        }

        //Toggle the new state
        _configurationDataModel.SetFeatureSelectionState(featureSelectionClientObject.GUID, newSelectionState.id);
    }
    ViewInterface.RegisterClientObjectListener = function (clientObjType, dataObjectID, instanceID) {
        if (_clientObjectListeners[clientObjType + "s"][dataObjectID] == undefined)
            _clientObjectListeners[clientObjType + "s"][dataObjectID] = [];
        _clientObjectListeners[clientObjType + "s"][dataObjectID].push(instanceID);
    }
    ViewInterface.RegisterControl = registerControl;
    ViewInterface.DatabindControl = databindControl;

    //Private methods
    function evalDatabindExpression(expression) {
        return _configurationDataModel.EvalDatabindExpression(expression);
    }
    function loadStaticContent() {

        //Load the CSS
        var templateCSS = _configurationDataModel.GetTemplateField("Stylesheet");
        var style = $("<style id='styleElem' type='text/css'></style>").text(templateCSS);
        $(_head).append(style);

        //Load the HTML
        var templateHTML = _configurationDataModel.GetTemplateField("Content");
        $(_body).html(templateHTML);

        //Adjust the height of the Iframe
        var calculatedHeight = $(_body).contents().height() + 20;
        $(_iframeInstance).height(Math.max(calculatedHeight, 670));
    }
    function registerControl(controlInstance) {

        //Keep track of it, using its instanceID
        var newID = _controlInstanceIDcounter++;
        _UIControlInstances[newID] = controlInstance;

        //Initialize it
        controlInstance.Initialize(ViewInterface, newID);
    }
    function databindControl(controlInstance, boundDataCollection) {

        //Use the databindExpression from the controlTag, if no specific bound data collection is provided
        var collectionToUse = boundDataCollection;
        if (collectionToUse == undefined) {
            var databindExpression = $(controlInstance.GetControlTagElem()).attr("databinding");
            collectionToUse = evalDatabindExpression(databindExpression);
        }

        //Databind the control
        if (collectionToUse != null) {
            controlInstance.Databind(collectionToUse);
        }
    }
    function initControls() {

        //Find controltags and register control types 
        var controltags = $(_body).find(".controltag");
        $(controltags).each(function (index, value) {
            var controltag = $(value);
            var controltype = $(controltag).attr("controltype");
            if (controltype == "Checkbox" || controltype == "CheckboxList" || controltype == "Dropdown" || controltype == "RadiobuttonList") {

                //Load the CSS for the control
                if (_uiControlTypesUsed[controltype] == undefined) {
                    UIControlTypes.API.RegisterControlCSS(controltype, _head);
                    _uiControlTypesUsed[controltype] = true;
                }

                //Create a new UIControl instance and databind it
                var newControlInstance = UIControlTypes.API.CreateInstanceFromTag(controltag);
                registerControl(newControlInstance);
                databindControl(newControlInstance);
            }
        });
    }

    //Constructor/Initalizers
    this.Initialize = function () {

        //Create the iframe
        _iframeInstance = $("<iframe id='InnerIframe' ></iframe>");
        $(container).append(_iframeInstance);

        //Special fix for iframe when it first loads
        setTimeout(function () {

            //Get iframe sections
            _body = $(_iframeInstance).contents().find("body");
            _head = $(_iframeInstance).contents().find("head");
        }, 1);
    }

    //Eventhandlers
    this.OnUITemplateLoaded = function () {

        //Load CSS and static HTML
        loadStaticContent();

        //Initialize and databind UIControl instances
        initControls();
    }
    this.OnClientObjectUpdated = function (guid) {

        //Get the clientObject
        var clientObject = _configurationDataModel.GetByGUID(guid);
        var clientObjectType = clientObject.GetType();

        //Get the corresponding clientObject (feature or attribute) 
        var boundClientObject = null;
        switch (clientObjectType) {
            case "featureSelection":
                boundClientObject = clientObject.Feature;
                break;

            case "attributeValue":
                boundClientObject = clientObject.Attribute;
                break;
        }

        //Keep track of data which was modified, for each control since last feedback from solver
        var boundType = boundClientObject.GetType();
        var listenerControlInstances = _clientObjectListeners[boundType + "s"][boundClientObject.GetField("ID")];
        if (listenerControlInstances != undefined) {
            for (var i = 0; i < listenerControlInstances.length; i++) {

                //Get the control instance
                var controlInstance = listenerControlInstances[i];
                var controlID = controlInstance.GetInstanceID();

                //Get the collection where modified bound clientobjects are kept
                if (_modifiedBoundDataControls[controlID] == undefined) {
                    _modifiedBoundDataControls[controlID] = [];
                }

                //Add the modified clientobject to the collection
                _modifiedBoundDataControls[controlID].push(boundClientObject);
            }
        }
    }
    this.OnSolverFeedbackUpdatesComplete = function () {

        //Loop through controls which have had their data updated
        for (var controlID in _modifiedBoundDataControls) {
            var modifiedBoundData = _modifiedBoundDataControls[controlID];

            //Call their ReloadData method

            var controlInstance = _UIControlInstances[controlID];
            controlInstance.ReloadData(modifiedBoundData);
        }

        _modifiedBoundDataControls = {};
    }
}

