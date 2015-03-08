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
    this.Name = new ObservableField(_innerBLO, "Name");
    this.FeatureSelections = new ObservableCollection();

    // Init
    this.Initialize = function () {

        // Bind to collections
        _this.Features.Adding.AddHandler(new EventHandler(onCLOAdding));
        _this.Relations.Adding.AddHandler(new EventHandler(onCLOAdding));
        _this.GroupRelations.Adding.AddHandler(new EventHandler(onCLOAdding));
        _this.CompositionRules.Adding.AddHandler(new EventHandler(onCLOAdding));
        _this.CustomRules.Adding.AddHandler(new EventHandler(onCLOAdding));
        _this.CustomFunctions.Adding.AddHandler(new EventHandler(onCLOAdding));

        // Setup change tracking
        _changeTrackingManager.Initialize();
    }

    // Event handlers
    var onCLOAdding = function (clo, eventRaiseDetails) {
        IdentifierProvider.SetupIdentifier(clo, _this);
    }
}