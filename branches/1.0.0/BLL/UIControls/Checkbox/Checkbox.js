_UIControlTypes.CheckboxControl = function (wrapperElement, tempID) {

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
    var _wrapperElement = wrapperElement, _innerControl = null;
    var _tempID = tempID, _dataBindingExpression = "";
    var _currentSelectionState = selectionStates.unselected, _disabled = false;
    var _boundClientFeature;
    var _thisCheckboxControl = this;

    //Properties
    this.GetTempID = function () {
        return _tempID;
    }
    this.GetDatabindExpression = function () {
        return _dataBindingExpression;
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
                    internalCheckboxClicked.RaiseEvent();
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
        if (dataCollection.length == 1 && dataCollection[0].Type == "Feature") {

            //Get the feature
            var boundFeatureID = dataCollection[0].Object.ID;
            _boundClientFeature = InternalMethods.GetFeature(boundFeatureID);

            //Load initial details from the feature selection
            var initialState = InternalMethods.GetFeatureSelectionState(_boundClientFeature.FeatureSelection);
            setSelectionState(initialState);
            setDisabled(_boundClientFeature.FeatureSelection.GetField("Disabled"));

            //Listen to data for changes
            InternalMethods.RegisterClientObjectListener("feature", boundFeatureID, _thisCheckboxControl);
        }
    }

    //Constructor/Initalizers
    this.Initialize = function () {

        //Get fields
        _dataBindingExpression = $(wrapperElement).attr("databinding");
        _innerControl = $(wrapperElement).find(".CheckboxControl");

        //Setup eventhandlers
        internalCheckboxClicked.Add(new EventHandler(onInternalCheckboxClicked));
    }

    //Public methods
    this.Databind = function (clientObjects) {
        databind(clientObjects);
    }
    this.ReloadData = function (modifiedClientObjects) {

        //Update variables
        _boundClientFeature = modifiedClientObjects[0];

        //Update state
        var newState = InternalMethods.GetFeatureSelectionState(_boundClientFeature.FeatureSelection);
        setSelectionState(newState);
        setDisabled(_boundClientFeature.FeatureSelection.GetField("Disabled"));
    }

    //Events
    var internalCheckboxClicked = new Event();

    //Eventhandlers
    var onInternalCheckboxClicked = function () {
        InternalMethods.ToggleFeatureSelectionState(_boundClientFeature.FeatureSelection.GUID);
    }
}