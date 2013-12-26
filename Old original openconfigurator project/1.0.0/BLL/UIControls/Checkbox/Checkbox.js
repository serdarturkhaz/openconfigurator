UIControlTypes.Controls.Checkbox.Dependencies = [];
UIControlTypes.Controls.Checkbox.Class = function (controlTag) {

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
    var _controlTagElem = (controlTag != undefined) ? controlTag : null, _innerControl = null, _label = null;
    var _currentSelectionState = selectionStates.unselected, _disabled = false;
    var _boundClientFeature = null, _iConfigurationView = null, _instanceID = null, _initialized = false; ;
    var _thisCheckboxControl = this;

    //Properties
    this.GetInstanceID = function () {
        return _instanceID;
    }
    this.GetControlTagElem = function () {
        return _controlTagElem;
    }
    this.SetLabel = function (text) {
        $(_label).text(text);
    }

    //Private methods
    function setSelectionState(state) {
        _currentSelectionState = state;
        refreshGraphicalRepresentation();
    }
    function setDisabled(disabledBool) {

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
    function refreshGraphicalRepresentation() {
        var disabledSuffix = (_disabled == true) ? "-disabled" : "";
        $(_innerControl).find(".CheckElement").css("background", "url('/content/themes/base/images/Controls/check-" + _currentSelectionState + disabledSuffix + ".png') no-repeat center center");
    }
    function databind(dataCollection) {

        //Bind to the Feature
        if (dataCollection.length == 1 && dataCollection[0].GetType() == "feature") {

            //Get the feature
            _boundClientFeature = dataCollection[0];
            var boundFeatureID = _boundClientFeature.GetField("ID");

            //Load initial details from the feature selection
            var initialState = _iConfigurationView.GetFeatureSelectionState(_boundClientFeature.FeatureSelection);
            setSelectionState(initialState);
            setDisabled(_boundClientFeature.FeatureSelection.GetField("Disabled"));

            //Register a listener
            _iConfigurationView.RegisterClientObjectListener("feature", boundFeatureID, _thisCheckboxControl);
        }
    }

    //Constructor/Initalizers
    this.Initialize = function (view, instanceID) {

        //Set important fields
        _iConfigurationView = view;
        _instanceID = instanceID;
        _initialized = true;

        //Get data from controltag
        _innerControl = $(_controlTagElem).find(".CheckboxControl");
        _label = $(_innerControl).find(".NameLabel");

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
        var newState = _iConfigurationView.GetFeatureSelectionState(_boundClientFeature.FeatureSelection);
        setSelectionState(newState);
        setDisabled(_boundClientFeature.FeatureSelection.GetField("Disabled"));
    }

    //Events
    var internalCheckboxToggled = new Event();

    //Eventhandlers
    var onInternalCheckboxToggled = function () {
        _iConfigurationView.ToggleFeatureSelectionState(_boundClientFeature.FeatureSelection.GUID);
    }
}