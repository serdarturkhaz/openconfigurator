_UIControlTypes.DropdownControl = function (wrapperElement, tempID) {

    //Fields
    var _wrapperElement = wrapperElement, _innerControl = null;
    var _tempID = tempID;
    var _controlID, _dataBindingExpression;
    var _currentSelection = null; //ID of currently selected feature
    var _boundFeatureIDs = [];
    var _thisDropdownControl = this;

    //Properties
    this.GetTempID = function () {
        return _tempID;
    }

    //Private methods
    var createHTMLOption = function (featureDataObject, selected, disabled) {

        //Create the basic option element
        var optionElem = $("<option></option>").attr({
            "value": featureDataObject.ID
        }).text(featureDataObject.Name);

        //Set selected
        if (selected == true) {
            $(optionElem).attr("selected", "selected");
        }

        //Set disabled - keep selected option enabled
        if (disabled == true && selected == false) {
            $(optionElem).attr("disabled", "disabled");
        }

        //
        return optionElem;
    }
    var resetHTMLOptions = function () {

        //Clear any existing unbound options
        $(_innerControl).html("");

        //Add a disabled default option
//        var defaultOption = $("<option></option>").attr({
//            "class": "defaultOption",
//            "selected": "selected",
//            "value": "default"
//        }).text("Nothing selected");
//        $(_innerControl).append(defaultOption);
    }
    var updateHTMLOption = function (featureID, selected, disabled) {

        //Get the option
        var optionElem = $(_innerControl).find("option[value='" + featureID + "']");

        //Update selected state
        if (selected == true) {
            $(optionElem).attr("selected", "selected");
        } else {
            $(optionElem).removeAttr("selected");
        }

        //Update disabled state
        if (disabled == true && selected == false) {
            $(optionElem).attr("disabled", "disabled");
        } else {
            $(optionElem).removeAttr("disabled");
        }
    }
    var databind = function (dataCollection) {

        //Bind to the Features
        if (dataCollection.length > 1 && dataCollection[0].Type == "Feature") {

            //Loop through bound features
            for (var i = 0; i < dataCollection.length; i++) {
                _boundFeatureIDs.push(dataCollection[i].Object.ID);

                //Create html option
                var featureSelection = getFeatureSelection(dataCollection[i].Object.ID);
                var isSelected = getFeatureSelectionState(featureSelection) == "selected";
                var isDisabled = featureSelection.GetField("Disabled");
                var newOption = createHTMLOption(dataCollection[i].Object, isSelected, isDisabled);
                $(_innerControl).append(newOption);

                //Listen to data for changes
                registerClientObjectListener(dataCollection[i].Object.ID, _thisDropdownControl);
            }
        }
    }

    //Constructor/Initalizers
    this.Initialize = function () {

        //Get fields
        _controlID = $(wrapperElement).attr("id");
        _dataBindingExpression = $(wrapperElement).attr("databinding");
        _innerControl = $(wrapperElement).find(".DropdownControl");

        //Setup html eventhandlers
        $(_innerControl).bind("change", function () {
            internalDropdownChanged.RaiseEvent();
        });

        //Setup databinding
        var boundDataCollection = evalDatabindExpression(_dataBindingExpression);
        if (boundDataCollection != null) {
            resetHTMLOptions();
            databind(boundDataCollection);
        }

        //Setup eventhandlers
        internalDropdownChanged.Add(new EventHandler(onInternalDropdownChanged));
    }

    //Events
    var internalDropdownChanged = new Event();

    //Eventhandlers
    this.OnBoundClientObjectUpdated = function (featureClientObject) {

        //Update html option
        var featureSelection = getFeatureSelection(featureClientObject.GetField("ID"));
        var isSelected = getFeatureSelectionState(featureSelection) == "selected";
        var isDisabled = featureSelection.GetField("Disabled");
        updateHTMLOption(featureClientObject.GetField("ID"), isSelected, isDisabled);
    }
    var onInternalDropdownChanged = function () {

        //Variables
        var oldSelection = _currentSelection;
        _currentSelection = $(_innerControl).find("option:selected").val();

        //Deselect oldSelection feature - (if something WAS selected)
        if (oldSelection != null && oldSelection != "default")
            setFeatureSelection(oldSelection, "unselected");

        //Select the new _currentSelection feature - (if something IS selected)
        if (_currentSelection != "default")
            setFeatureSelection(_currentSelection, "selected");
    }
}