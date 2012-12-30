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
    var _tempID = tempID;
    var _controlID, _dataBindingExpression;
    var _currentState = selectionStates.unselected, _disabled = false;
    var _boundFeature;
    var _thisCheckboxControl = this;

    //Properties
    this.GetTempID = function () {
        return _tempID;
    }

    //Private methods
    var setState = function (state) {
        _currentState = state;
        refreshGraphicalRepresentation();
    }
    var setDisabled = function (disabledBool) {

        //Disable
        if (disabledBool == true) {
            $(_innerControl).unbind("click");
        }
        //Enable
        else if (disabledBool == false && _disabled == true) {
            $(_innerControl).bind("click", function () {
                internalCheckboxClicked.RaiseEvent();
            });
        }
        _disabled = disabledBool;

        //
        refreshGraphicalRepresentation();
    }
    var refreshGraphicalRepresentation = function () {
        var disabledSuffix = (_disabled == true) ? "-disabled" : "";
        $(_innerControl).find(".CheckElement").css("background", "url('/content/themes/base/images/Controls/check-" + _currentState + disabledSuffix + ".png') no-repeat center center");
    }
    var databind = function (dataCollection) {

        //Bind to the Feature
        if (dataCollection.length == 1 && dataCollection[0].Type == "Feature") {

            //Get the feature
            var boundFeatureID = dataCollection[0].Object.ID;
            _boundFeature = InternalMethods.GetFeature(boundFeatureID);

            //Load initial details from the feature selection
            var initialState = InternalMethods.GetFeatureSelectionState(_boundFeature.FeatureSelection);
            setState(initialState);
            setDisabled(_boundFeature.FeatureSelection.GetField("Disabled"));

            //Listen to data for changes
            InternalMethods.RegisterClientObjectListener(boundFeatureID, _thisCheckboxControl);
        }
    }

    //Constructor/Initalizers
    this.Initialize = function () {

        //Get fields
        _controlID = $(wrapperElement).attr("id");
        _dataBindingExpression = $(wrapperElement).attr("databinding");
        _innerControl = $(wrapperElement).find(".CheckboxControl");

        //Setup html eventhandlers
        $(_innerControl).bind("click", function () {
            internalCheckboxClicked.RaiseEvent();
        });

        //Setup databinding
        var boundDataCollection = InternalMethods.EvalDatabindExpression(_dataBindingExpression);
        if (boundDataCollection != null) {
            databind(boundDataCollection);
        }

        //Setup eventhandlers
        internalCheckboxClicked.Add(new EventHandler(onInternalCheckboxClicked));
    }

    //Events
    var internalCheckboxClicked = new Event();

    //Eventhandlers
    this.OnBoundClientObjectUpdated = function (featureClientObject) {

        //Update
        var newState = InternalMethods.GetFeatureSelectionState(featureClientObject.FeatureSelection);
        setState(newState);
        setDisabled(featureClientObject.FeatureSelection.GetField("Disabled"));
    }
    var onInternalCheckboxClicked = function () {
        InternalMethods.ToggleFeatureSelection(_boundFeature.GetField("ID"));
    }
}