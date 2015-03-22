// CLOs
var ConfigurationInstanceCLO = function (clientID, blo) {

    // Fields
    var _clientID = clientID, _innerBLO = blo;
    var _changeTrackingManager = new InnerChangeTrackingManager(this);
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

        // Setup change tracking
        //_changeTrackingManager.Initialize();
    }

}