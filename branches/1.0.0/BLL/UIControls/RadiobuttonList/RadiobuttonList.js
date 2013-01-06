_UIControlTypes.RadiobuttonListControl = function (wrapperElement, tempID) {

    //Inner classes
    var RadioOptionControl = function (containerControl, objectID, objectName, initialSelected, initialDisabled, groupName) {

        //Fields
        var _containerControl = containerControl;
        var _objectID = objectID, _objectName = objectName, _groupName = groupName;
        var _innerControl = null;
        var _thisRadioOptionControl = this;

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
                $(_innerControl).find("input").attr("selected", "selected");
            } else {
                $(_innerControl).find("input").removeAttr("selected");
            }

        }
        var setDisabled = function (disabledBool) {

            //Disable
            if (disabledBool == true) {

                //Remove click event
                $(_innerControl).unbind("click");
                $(_innerControl).removeAttr("toggleable");
                $(_innerControl).find("input").attr("disabled", "disabled");
            }
            //Enable
            else if (disabledBool == false) {

                //Bind click event, if not already bound
                if (!$(_innerControl).is("[toggleable]")) {
                    $(_innerControl).attr("toggleable", "toggleable");
                    $(_innerControl).bind("click", function () {
                        internalOptionClicked.RaiseEvent();
                    });
                }
            }
        }

        //Constructor/Initializers
        this.Initialize = function () {

            //Create the html option
            _innerControl = $("<div class='RadioOption'></div>");
            var radioInput = $("<input type='radio' />").attr({
                "name": _groupName,
                "value": _objectID
            }).appendTo(_innerControl);
            var nameLabel = $("<label class='NameLabel'></label>").text(_objectName).appendTo(_innerControl);

            //Set initial details
            setSelected(initialSelected);
            setDisabled(initialDisabled);

            //Setup eventhandlers
            internalOptionClicked.Add(new EventHandler(onInternalOptionClicked));


            //Add to container
            $(_innerControl).appendTo(_containerControl);
        }

        //Public methods
        this.Update = function (selected, disabled) {
            setSelected(selected);
            setDisabled(disabled);
        }

        //Events
        var internalOptionClicked = new Event();

        //Event handlers
        var onInternalOptionClicked = function () {
            alert("radio option clicked ! ");
        }
    }

    //Fields
    var _wrapperElement = wrapperElement, _innerControl = null;
    var _tempID = tempID, _dataBindingExpression;
    var _currentSelectionID = null; //ID of currently selected boundFeature
    var _boundClientFeatures = {};
    var _childOptionControls = {}, _defaultOptionControl = null;
    var _thisRadiobuttonListControl = this;

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
        _defaultOptionControl = new RadioOptionControl(_innerControl, "default", "No selection", true, false, "group" + _tempID);
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
                var newOptionControl = new RadioOptionControl(_innerControl, boundFeatureID, name, isSelected, isDisabled, "group" + _tempID);
                newOptionControl.Initialize();
                _childOptionControls[boundFeatureID] = newOptionControl;

                //Listen to data for changes
                InternalMethods.RegisterClientObjectListener("feature", boundFeatureID, _thisRadiobuttonListControl);
            }
        }
    }

    //Constructor/Initalizers
    this.Initialize = function () {

        //Get fields
        _dataBindingExpression = $(wrapperElement).attr("databinding");
        _innerControl = $(wrapperElement).find(".RadiobuttonListControl");

        //Setup eventhandlers
        $(_innerControl).bind("change", function () {
            internalRadiobuttonListChanged.RaiseEvent();
        });
        internalRadiobuttonListChanged.Add(new EventHandler(onInternalRadiobuttonListChanged));
    }

    //Public methods
    this.Databind = function (clientObjects) {
        databind(clientObjects);
    }
    this.ReloadData = function (modifiedClientObjects) {

    }

    //Events
    var internalRadiobuttonListChanged = new Event();

    //Eventhandlers
    var onInternalRadiobuttonListChanged = function () {



    }
}