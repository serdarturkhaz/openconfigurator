_UIControlTypes.DropdownControl = function (wrapperElement, tempID) {

    //Inner classes
    var DropdownOptionControl = function (containerControl, objectID, objectName, initialSelected, initialDisabled) {

        //Fields
        var _containerControl = containerControl;
        var _objectID = objectID, _objectName = objectName;
        var _innerControl = null;
        var _thisDropdownOptionControl = this;

        //Properties
        this.IsSelected = function () {
            return $(_innerControl).is("[selected]");
        }
        this.IsDisabled = function () {
            return $(_innerControl).is("[disabled]");
        }

        //Private methods
        var setSelected = function (selectedBool) {
            if (selectedBool == true) {
                $(_innerControl).attr("selected", "selected");
            } else {
                $(_innerControl).removeAttr("selected");
            }
        }
        var setDisabled = function (disabledBool) {

            if (disabledBool == true) { 
                $(_innerControl).attr("disabled", "disabled");
            } else {
                $(_innerControl).removeAttr("disabled");
            }
        }

        //Constructor/Initializers
        this.Initialize = function () {

            //Create the html option
            _innerControl = $("<option></option>").attr({
                "value": _objectID
            }).text(_objectName);

            //Set initial details
            setSelected(initialSelected);
            setDisabled(initialDisabled);

            //
            $(_innerControl).appendTo(_containerControl);
        }

        //Public methods
        this.Update = function (selectedBool, disabledBool) {
            setSelected(selectedBool);
            setDisabled(disabledBool);
        }
    }

    //Fields
    var _wrapperElement = wrapperElement, _innerControl = null;
    var _tempID = tempID, _dataBindingExpression;
    var _currentSelectionID = null; //ID of currently selected boundFeature
    var _childOptionControls = {}, _defaultOptionControl = null;
    var _boundClientFeatures = {};
    var _thisDropdownControl = this;

    //Properties
    this.GetTempID = function () {
        return _tempID;
    }
    this.GetDatabindExpression = function () {
        return _dataBindingExpression;
    }

    //Private methods
    var resetInnerContent = function () {

        //Clear any existing unbound options
        _childOptionControls = {};
        $(_innerControl).html("");

        //Add a default option
        _defaultOptionControl = new DropdownOptionControl(_innerControl, "default", "", true, false);
        _defaultOptionControl.Initialize();
    }
    var databind = function (dataCollection) {

        //Clear any inner content and setup the default option
        resetInnerContent();

        //Bind to the Features
        if (dataCollection.length > 1 && dataCollection[0].Type == "Feature") {

            //Loop through bound features
            for (var i = 0; i < dataCollection.length; i++) {

                //Get the feature
                var boundFeatureID = dataCollection[i].Object.ID;
                var boundClientFeature = InternalMethods.GetFeature(boundFeatureID);
                _boundClientFeatures[boundFeatureID] = boundClientFeature;

                //Get details for html option element
                var name = boundClientFeature.GetField("Name");
                var isDisabled = boundClientFeature.FeatureSelection.GetField("Disabled");
                var isSelected = InternalMethods.GetFeatureSelectionState(boundClientFeature.FeatureSelection) == "selected";

                //Create html option
                var newOptionControl = new DropdownOptionControl(_innerControl, boundFeatureID, name, isSelected, isDisabled);
                newOptionControl.Initialize();
                _childOptionControls[boundFeatureID] = newOptionControl;

                //Listen to data for changes
                InternalMethods.RegisterClientObjectListener("feature", boundFeatureID, _thisDropdownControl);
            }
        }
    }

    //Constructor/Initalizers
    this.Initialize = function () {

        //Get fields
        _dataBindingExpression = $(wrapperElement).attr("databinding");
        _innerControl = $(wrapperElement).find(".DropdownControl");

        //Setup eventhandlers
        $(_innerControl).bind("change", function () {
            internalDropdownChanged.RaiseEvent();
        });
        internalDropdownChanged.Add(new EventHandler(onInternalDropdownChanged));
    }

    //Public methods
    this.Databind = function (clientObjects) {
        databind(clientObjects);
    }
    this.ReloadData = function (modifiedClientObjects) {

        //Update the _boundClientFeatures which were modified
        for (var i = 0; i < modifiedClientObjects.length; i++) {
            var modifiedClientFeature = modifiedClientObjects[i];
            _boundClientFeatures[modifiedClientFeature.GetField("ID")] = modifiedClientFeature;
        }

        //Loop through all the _boundClientFeatures
        var totalNrFeatures = 0, selectedFeatures = [], disabledFeatures = [];
        for (var id in _boundClientFeatures) {

            //Get the bound feature
            var boundFeature = _boundClientFeatures[id];
            var boundFeatureID = boundFeature.GetField("ID");

            //Update the corresponding OptionControl 
            var selected = InternalMethods.GetFeatureSelectionState(boundFeature.FeatureSelection) == "selected";
            var disabled = boundFeature.FeatureSelection.GetField("Disabled");
            var optionControl = _childOptionControls[boundFeatureID];
            optionControl.Update(selected, disabled);

            //Keep track of selected features and disabled features
            totalNrFeatures++;
            if (selected)
                selectedFeatures.push(boundFeature);
            if (disabled)
                disabledFeatures.push(boundFeature);
        }

        //Set the state for the default OptionControl
        switch (true) {

            //Single feature selected, nothing disabled or only other features disabled  -> enable default                  
            case (selectedFeatures.length == 1 && (disabledFeatures.length == 0 || disabledFeatures.length == (totalNrFeatures - 1))):
                _currentSelectionID = selectedFeatures[0].GetField("ID");
                _defaultOptionControl.Update(false, false);
                break;

            //Single feature selected, everything disabled -> disable default                
            case (selectedFeatures.length == 1 && disabledFeatures.length == totalNrFeatures):
                _currentSelectionID = selectedFeatures[0].GetField("ID");
                _defaultOptionControl.Update(false, true);
                break;

            //Nothing selected, nothing disabled -> set default to selected & enabled                            
            case (selectedFeatures.length == 0 && (disabledFeatures.length == 0 || disabledFeatures.length < (totalNrFeatures - 1))):
                _currentSelectionID = "default";
                _defaultOptionControl.Update(true, false);
                break;

            //Nothing selected, everything disabled -> set default to selected & disabled                             
            case (selectedFeatures.length == 0 && disabledFeatures.length == totalNrFeatures):
                _currentSelectionID = "default";
                _defaultOptionControl.Update(true, true);
                break;

            //More than one feature selected                              
            case (selectedFeatures.length > 0):
                throw {
                    name: "Error",
                    message: "DropDownControl cannot have more than one bound feature selected at the same time."
                }
                break;
        }
    }

    //Events
    var internalDropdownChanged = new Event();

    //Eventhandlers
    var onInternalDropdownChanged = function () {


        //Update the _currentSelectionID variable
        var oldSelectionID = _currentSelectionID;
        _currentSelectionID = $(_innerControl).find("option:selected").val();

        //If default was selected
        if (_currentSelectionID == "default") {

            //Set selectionState to unselected for the previously selected feature
            if (oldSelectionID != null) {
                var oldSelectionFeature = _boundClientFeatures[oldSelectionID];
                InternalMethods.SetFeatureSelectionState(oldSelectionFeature.FeatureSelection.GUID, "unselected");
            }
        }
        //If a boundFeature option was selected
        else if (_currentSelectionID != "default") {

            //Set selectionState to selected for the boundFeature
            var currentSelectionFeature = _boundClientFeatures[_currentSelectionID];
            InternalMethods.SetFeatureSelectionState(currentSelectionFeature.FeatureSelection.GUID, "selected");
        }


    }
}