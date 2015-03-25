// CLOs
var ConfigurationInstanceCLO = function (clientID, blo) {

    // Fields
    var _clientID = clientID, _innerBLO = blo;
    var _this = this;

    // Properties
    this.GetClientID = function () {
        return _clientID;
    };
    this.GetType = function () {
        return CLOTypes.ConfigurationInstance;
    }
    this.GetBLOCopy = function () {
        return jQuery.extend(true, {}, _innerBLO);
    }

    this.FeatureModelName = new ObservableField(_innerBLO, "FeatureModelName");
    this.FeatureSelections = new ObservableCollection();

    // Init
    this.Initialize = function () {
    }

}
var FeatureSelectionCLO = function (clientID, blo) {

    // Fields
    var _clientID = clientID, _innerBLO = blo;
    var _this = this;

    // Properties
    this.GetClientID = function () {
        return _clientID;
    };
    this.GetType = function () {
        return CLOTypes.FeatureSelection;
    }
    this.GetBLOCopy = function () {
        return jQuery.extend(true, {}, _innerBLO);
    }

    this.FeatureIdentifier = new ObservableField(_innerBLO, "FeatureIdentifier");
    this.FeatureName = new ObservableField(_innerBLO, "FeatureName");
    this.Disabled = new ObservableField(_innerBLO, "Disabled");
    this.ToggledByUser = new ObservableField(_innerBLO, "ToggledByUser");
    this.AttributeValues = new ObservableCollection();

    // Init
    this.Initialize = function () {
    }

}
var AttributeValueCLO = function (clientID, blo) {

    // Fields
    var _clientID = clientID, _innerBLO = blo;
    var _this = this;

    // Properties
    this.GetClientID = function () {
        return _clientID;
    };
    this.GetType = function () {
        return CLOTypes.AttributeValue;
    }
    this.GetBLOCopy = function () {
        return jQuery.extend(true, {}, _innerBLO);
    }

    this.AttributeIdentifier = new ObservableField(_innerBLO, "AttributeIdentifier");
    this.AttributeName = new ObservableField(_innerBLO, "AttributeName");
    this.Value = new ObservableField(_innerBLO, "Value");

    // Init
    this.Initialize = function () {
    }

}