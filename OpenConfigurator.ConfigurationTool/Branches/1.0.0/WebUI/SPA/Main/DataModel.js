define("Main/DataModel",
    [],
    function () {
        var DataModel = function () {

            // Fields
            var _bloService = null, _cloFactory = null;
            var _currentConfigurationInstanceCLO = null;
            var _this = this;

            // Properties
            this.GetCurrentConfigurationInstanceCLO = function () {
                return _currentConfigurationInstanceCLO;
            }

            // Init
            this.Initialize = function () {

                // Instantiate inner classes
                if (_bloService === null || _bloService === undefined) {
                    _bloService = new DataModel.BLOService();
                    _bloService.Initialize();
                }
                if (_cloFactory === null || _cloFactory === undefined) {
                    _cloFactory = new DataModel.CLOFactory(_bloService);
                    _cloFactory.Initialize();
                }
            }

            // Public methods
            this.GetByClientID = function (clientID) {
                return _cloFactory.GetByClientID(clientID);
            }
            this.LoadConfigurationInstance = function (featureModelName) {

                // Clean up current configuratioNInstance (if one is present)
                if (_currentConfigurationInstanceCLO !== null) {
                    var configInstanceCLO = _currentConfigurationInstanceCLO;
                    _currentConfigurationInstanceCLO = null;
                    _cloFactory.Reset();
                    _this.ConfigurationInstanceUnloaded.RaiseEvent(configInstanceCLO);
                }

                // Get the configurationInstance for the chosen featureModel
                var configInstanceCLO = _cloFactory.FromBLO(_bloService.GetConfigurationInstance(featureModelName), CLOTypes.ConfigurationInstance);

                // Attempt to load the configurationInstance
                var eventRaiseDetails = _this.ConfigurationInstanceLoading.RaiseEvent(configInstanceCLO);
                if (eventRaiseDetails.CancelTriggered() === false) {
                    _currentConfigurationInstanceCLO = configInstanceCLO;
                    _this.ConfigurationInstanceLoaded.RaiseEvent(_currentConfigurationInstanceCLO);
                }
            }

            // Events
            this.ConfigurationInstanceLoading = new Event(); // not used currently
            this.ConfigurationInstanceLoaded = new Event();
            this.ConfigurationInstanceUnloaded = new Event();
        }
        DataModel.CLOFactory = function (bloService) {

            var FromBLO = {
                ConfigurationInstance: function (blo) {

                    // Strip off all child collections from the blo
                    var strippedOffBLOArrays = stripOffChildArrays(blo); // it is assumed all arrays on BLOs are part of BLO Lists

                    // Create it
                    var newClientID = getNewClientID();
                    var newCLO = new ConfigurationInstanceCLO(newClientID, blo);

                    // Child FeatureSelections
                    for (var i = 0; i < strippedOffBLOArrays.FeatureSelections.length; i++) {
                        var featureSelectionCLO = FromBLO.FeatureSelection(strippedOffBLOArrays.FeatureSelections[i]);
                        newCLO.FeatureSelections.Add(featureSelectionCLO);
                    }

                    // Initialize and return
                    newCLO.Initialize();
                    return newCLO;
                },
                FeatureSelection: function (blo) {

                    // Strip off all child collections from the blo
                    var strippedOffBLOArrays = stripOffChildArrays(blo); // it is assumed all arrays on BLOs are part of BLO Lists

                    // Create it
                    var newClientID = getNewClientID();
                    var newCLO = new FeatureSelectionCLO(newClientID, blo);

                    // Child AttributeValues
                    for (var i = 0; i < strippedOffBLOArrays.AttributeValues.length; i++) {
                        var attrValueCLO = FromBLO.AttributeValue(strippedOffBLOArrays.AttributeValues[i]);
                        newCLO.AttributeValues.Add(attrValueCLO);
                    }

                    // Initialize and return
                    newCLO.Initialize();
                    return newCLO;
                },
                AttributeValue: function (blo) {

                    // Create it
                    var newClientID = getNewClientID();
                    var newCLO = new AttributeValueCLO(newClientID, blo);

                    // Initialize and return
                    newCLO.Initialize();
                    return newCLO;
                }
            }

            // Fields
            var _bloService = bloService;
            var _clientIDCounter = 0, _factoryCLORegister = {};
            var _this = this;

            // Private methods
            function getNewClientID() {
                _clientIDCounter += 1;
                return _clientIDCounter;
            }
            function stripOffChildArrays(blo) {

                // Variables
                var strippedOffArrays = {};

                // Go through all properties on the given blo object and remove them if they are of the Array type
                for (var propertyName in blo) {
                    if ($.isArray(blo[propertyName])) {
                        strippedOffArrays[propertyName] = blo[propertyName];
                        delete blo[propertyName];
                    }
                }

                return strippedOffArrays;
            }

            // Init
            this.Initialize = function () {
            }

            // Public methods
            this.GetByClientID = function (clientID) {
                return _factoryCLORegister[clientID];
            }
            this.ToBLO = function (clo) {

                // Get the BLO
                var blo = ToBLO[clo.GetType()](clo);
                return blo;
            }
            this.FromBLO = function (blo, type) {

                // Create the CLO
                var clo = FromBLO[type](blo);
                return clo;
            }
            this.Reset = function () { // used when loading a new FeatureModel
                _clientIDCounter = 0;
                _factoryCLORegister = {};
            }
        }
        DataModel.BLOService = function () {

            // Fields
            var _this = this;

            // Init
            this.Initialize = function () {

            }

            // Public methods
            this.GetConfigurationInstance = function (featureModelName) {
                var blo = null;
                $.ajax({
                    type: "Get",
                    url: "api/GlobalAPI/GetConfigurationInstance",
                    data: { featureModelName: featureModelName },
                    async: false,
                    success: function (response) {
                        blo = response;
                    }
                });

                return blo;
            }
        }
        return DataModel;

    });