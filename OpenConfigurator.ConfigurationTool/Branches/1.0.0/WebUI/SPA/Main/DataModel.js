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
                    //for (var i = 0; i < strippedOffBLOArrays.Features.length; i++) {
                    //    var featureCLO = FromBLO.Feature(strippedOffBLOArrays.Features[i]);
                    //    newCLO.Features.Add(featureCLO);
                    //}

                    // Initialize and return
                    newCLO.Initialize();
                    return newCLO;
                }
            }
            //var ToBLO = {
            //    FeatureModel: function (clo) {
            //        // Get its BLO
            //        var blo = clo.GetBLOCopy();
            //        // Child collections
            //        var collectionNames = {
            //            Features: "Features",
            //            Relations: "Relations",
            //            GroupRelations: "GroupRelations",
            //            CompositionRules: "CompositionRules",
            //            CustomRules: "CustomRules",
            //            CustomFunctions: "CustomFunctions"
            //        }
            //        for (var key in collectionNames) {
            //            for (var i = 0; i < clo[key].GetLength() ; i++) {
            //                if (blo[key] === undefined)
            //                    blo[key] = [];
            //                var childCLO = clo[key].GetAt(i);
            //                var childBLO = ToBLO[childCLO.GetType()](childCLO);
            //                blo[key].push(childBLO);
            //            }
            //        }
            //        //
            //        return blo;
            //    }
            //}

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