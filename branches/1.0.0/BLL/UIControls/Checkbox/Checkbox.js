UIControlTypes.Controls.Checkbox.Dependencies = [];
UIControlTypes.Controls.Checkbox.Class = function (instanceID, internalMethodsCollection) {

    //Selection states
    var selectionStates = {
        selected: {
            name: "selected"
        },
        deselected: {
            name: "deselected"
        },
        unselected: {
            name: "unselected"
        }
    }

    //Fields
    var _controlTagElem = null, _innerControl = null;
    var _instanceID = instanceID;
    var _currentSelectionState = selectionStates.unselected, _disabled = false;
    var _boundClientFeature = null;
    var _thisCheckboxControl = this;

    //Properties
    this.GetInstanceID = function () {
        return _instanceID;
    }
    this.SetControlTagElem = function (controlTagElem) {
        _controlTagElem = controlTagElem;
    }

    //Private methods
    var setSelectionState = function (state) {
        _currentSelectionState = state;
        refreshGraphicalRepresentation();
    }
    var setDisabled = function (disabledBool) {

        //Disable
        if (disabledBool == true) {

            //Remove click event
            $(_innerControl).unbind("click");
            $(_innerControl).removeAttr("toggleable");
        }
        //Enable
        else if (disabledBool == false) {

            //Bind click event, if not already bound
            if (!$(_innerControl).is("[toggleable]")) {
                $(_innerControl).attr("toggleable", "toggleable");
                $(_innerControl).bind("click", function () {
                    internalCheckboxToggled.RaiseEvent();
                });
            }
        }

        //
        _disabled = disabledBool;
        refreshGraphicalRepresentation();
    }
    var refreshGraphicalRepresentation = function () {
        var disabledSuffix = (_disabled == true) ? "-disabled" : "";
        $(_innerControl).find(".CheckElement").css("background", "url('/content/themes/base/images/Controls/check-" + _currentSelectionState + disabledSuffix + ".png') no-repeat center center");
    }
    var databind = function (dataCollection) {

        //Bind to the Feature
        if (dataCollection.length == 1 && dataCollection[0].GetType() == "feature") {

            //Get the feature
            _boundClientFeature = dataCollection[0];
            var boundFeatureID = _boundClientFeature.GetField("ID");

            //Load initial details from the feature selection
            var initialState = internalMethodsCollection.GetFeatureSelectionState(_boundClientFeature.FeatureSelection);
            setSelectionState(initialState);
            setDisabled(_boundClientFeature.FeatureSelection.GetField("Disabled"));

            //Listen to data for changes
            internalMethodsCollection.RegisterClientObjectListener("feature", boundFeatureID, _thisCheckboxControl);
        }
    }

    //Constructor/Initalizers
    this.Initialize = function () {

        //Get fields
        _innerControl = $(_controlTagElem).find(".CheckboxControl");

        //Setup eventhandlers
        internalCheckboxToggled.Add(new EventHandler(onInternalCheckboxToggled));
    }

    //Public methods
    this.Databind = function (clientObjects) {
        databind(clientObjects);
    }
    this.ReloadData = function (modifiedClientObjects) {

        //Update variables
        _boundClientFeature = modifiedClientObjects[0];

        //Update state
        var newState = internalMethodsCollection.GetFeatureSelectionState(_boundClientFeature.FeatureSelection);
        setSelectionState(newState);
        setDisabled(_boundClientFeature.FeatureSelection.GetField("Disabled"));
    }

    //Events
    var internalCheckboxToggled = new Event();

    //Eventhandlers
    var onInternalCheckboxToggled = function () {
        internalMethodsCollection.ToggleFeatureSelectionState(_boundClientFeature.FeatureSelection.GUID);
    }
}