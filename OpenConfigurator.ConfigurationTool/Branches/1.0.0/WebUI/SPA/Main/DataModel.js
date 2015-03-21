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
                var configInstance = _bloService.GetConfigurationInstance(featureModelName);
                return configInstance;
            }

            // Events
            this.ModelLoading = new Event();
            this.ModelLoaded = new Event();
            this.ModelUnloaded = new Event();
        }
        DataModel.CLOFactory = function (bloService) {

            var FromBLO = {
                FeatureModel: function (blo) {

                    // Strip off all child collections from the blo
                    var strippedOffBLOArrays = stripOffChildArrays(blo); // it is assumed all arrays on BLOs are part of BLO Lists

                    // Create it
                    var newClientID = getNewClientID();
                    var newCLO = new FeatureModelCLO(newClientID, blo);

                    // Child Features
                    for (var i = 0; i < strippedOffBLOArrays.Features.length; i++) {
                        var featureCLO = FromBLO.Feature(strippedOffBLOArrays.Features[i]);
                        newCLO.Features.Add(featureCLO);
                    }
                    // Child Relations
                    for (var i = 0; i < strippedOffBLOArrays.Relations.length; i++) {
                        var relationBLO = strippedOffBLOArrays.Relations[i];
                        var relationCLO = FromBLO.Relation(strippedOffBLOArrays.Relations[i]);

                        // Get references to the CLOs corresponding to the ParentFeature & ChildFeature
                        relationCLO.ParentFeature = newCLO.Features.GetItemWithFieldValue("Identifier", relationBLO.ParentFeature.Identifier);
                        relationCLO.ChildFeature = newCLO.Features.GetItemWithFieldValue("Identifier", relationBLO.ChildFeature.Identifier);
                        delete relationBLO.ParentFeature; delete relationBLO.ChildFeature; // delete them off the BLO afterwards

                        newCLO.Relations.Add(relationCLO);
                    }
                    // Child GroupRelations
                    for (var i = 0; i < strippedOffBLOArrays.GroupRelations.length; i++) {
                        var groupRelationBLO = strippedOffBLOArrays.GroupRelations[i];
                        var groupRelationCLO = FromBLO.GroupRelation(strippedOffBLOArrays.GroupRelations[i]);

                        // Get references to the CLOs corresponding to the ParentFeature & ChildFeature
                        groupRelationCLO.ParentFeature = newCLO.Features.GetItemWithFieldValue("Identifier", groupRelationBLO.ParentFeature.Identifier);
                        for (var j = 0; j < groupRelationBLO.ChildFeatures.length; j++) {
                            var childFeatureIdentifier = groupRelationBLO.ChildFeatures[j].Identifier;
                            groupRelationCLO.ChildFeatures.Add(newCLO.Features.GetItemWithFieldValue("Identifier", childFeatureIdentifier));
                        }
                        delete groupRelationBLO.ParentFeature; delete groupRelationBLO.ChildFeatures; // delete them off the BLO afterwards


                        newCLO.GroupRelations.Add(groupRelationCLO);
                    }
                    // Child CompositionRules
                    for (var i = 0; i < strippedOffBLOArrays.CompositionRules.length; i++) {
                        var compositionRuleBLO = strippedOffBLOArrays.CompositionRules[i];
                        var compositionRuleCLO = FromBLO.CompositionRule(strippedOffBLOArrays.CompositionRules[i]);

                        // Get references to the CLOs corresponding to the ParentFeature & ChildFeature
                        compositionRuleCLO.FirstFeature = newCLO.Features.GetItemWithFieldValue("Identifier", compositionRuleBLO.FirstFeature.Identifier);
                        compositionRuleCLO.SecondFeature = newCLO.Features.GetItemWithFieldValue("Identifier", compositionRuleBLO.SecondFeature.Identifier);
                        delete compositionRuleBLO.FirstFeature; delete compositionRuleBLO.SecondFeature; // delete them off the BLO afterwards

                        newCLO.CompositionRules.Add(compositionRuleCLO);
                    }
                    // Child CustomRules
                    for (var i = 0; i < strippedOffBLOArrays.CustomRules.length; i++) {
                        var customRuleCLO = FromBLO.CustomRule(strippedOffBLOArrays.CustomRules[i]);
                        newCLO.CustomRules.Add(customRuleCLO);
                    }
                    // Child CustomFunctions
                    for (var i = 0; i < strippedOffBLOArrays.CustomFunctions.length; i++) {
                        var customFunctionCLO = FromBLO.CustomFunction(strippedOffBLOArrays.CustomFunctions[i]);
                        newCLO.CustomFunctions.Add(customFunctionCLO);
                    }

                    // Initialize and return
                    newCLO.Initialize();
                    return newCLO;
                }
            }
            var ToBLO = {
                FeatureModel: function (clo) {

                    // Get its BLO
                    var blo = clo.GetBLOCopy();

                    // Child collections
                    var collectionNames = {
                        Features: "Features",
                        Relations: "Relations",
                        GroupRelations: "GroupRelations",
                        CompositionRules: "CompositionRules",
                        CustomRules: "CustomRules",
                        CustomFunctions: "CustomFunctions"
                    }
                    for (var key in collectionNames) {
                        for (var i = 0; i < clo[key].GetLength() ; i++) {
                            if (blo[key] === undefined)
                                blo[key] = [];
                            var childCLO = clo[key].GetAt(i);
                            var childBLO = ToBLO[childCLO.GetType()](childCLO);
                            blo[key].push(childBLO);
                        }
                    }

                    //
                    return blo;
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
            this.CreateNewCLO = function (cloType, extraParamsArrays) {

                // Get a new default BLO
                var newBLO = _bloService.GetDefaultBLO(cloType);

                // Setup parameters to include extra parameters, if any are provided
                var params = (extraParamsArrays !== undefined) ? extraParamsArrays : [];
                params.unshift(newBLO);

                // Create the CLO
                var newCLO = FromBLO[cloType].apply(_this, params);
                return newCLO;
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