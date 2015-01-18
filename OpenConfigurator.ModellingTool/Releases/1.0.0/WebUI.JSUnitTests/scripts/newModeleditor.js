// ClientObjects
var ClientObjects = {};
ClientObjects.Types = {
    Model: "model",
    Feature: "feature",
    Attribute: "attribute",
    Relation: "relation",
    GroupRelation: "groupRelation",
    CompositionRule: "compositionRule",
    CustomRule: "customRule",
    CustomFunction: "customFunction"
}
ClientObjects.ClientObjectFactory = function () {

    // Fields
    var _clientIDCounter = 0;
    var _this = this;

    // Init
    this.Initialize = function () {
    }

    // Public methods
    this.CreateInstance = function (typeName, businessObj) {

    }
}
ClientObjects.Feature = function (businessObject) {

    // Fields
    var _guid = null;
    var _businessObject = businessObject;
    var _attributes = [];

    // Properties
    this.GUID = _guid;
    this.GetType = function () {
        return "feature";
    }
    this.Attributes = _attributes;

    // Methods
    this.GetBusinessObjectCopy = function () {
        var copy = jQuery.extend(true, {}, _businessObject);
        return copy;
    }
    this.GetField = function (fieldName) {
        return _businessObject[fieldName];
    }
    this.SetField = function (fieldName, value) {
        _businessObject[fieldName] = value;
    }

    //
}

// DataModel responsibilities : 
// - ajax calls to server to retreive businessObjects (delegated to a _dataService)
// - works internally with businessobjects
// - publicly, has ONLY methods which work with client objects

var DataModel = function (dataService) {

    // Fields
    var _dataService = dataService;
    var _this = this;

    // Init
    this.Initialize = function () {
        if (_dataService === null || _dataService === undefined) {
            _dataService = new DataService();
        }
    }

    // Public methods
    this.GetByClientID = function (type, clientID) {

    }
}


// DataService responsibilities : 
// - API for ajax calls to server to retreive businessObjects 
// - called ONLY by DataModel
// - works with business objects
var DataService = function () {

    // Fields
    var _this = this;
}