UIControlTypes.Controls.CheckboxList.Dependencies = ["Checkbox"];
UIControlTypes.Controls.CheckboxList.Class = function (controlTag) {

    //Fields
    var _controlTagElem = (controlTag != undefined) ? controlTag : null, _innerControl = null;
    var _iConfigurationView = null, _instanceID = null, _initialized = false;
    var _boundClientFeatures = {};
    var _thisCheckboxListControl = this;

    //Properties
    this.GetInstanceID = function () {
        return _instanceID;
    }
    this.GetControlTagElem = function () {
        return _controlTagElem;
    }

    //Private methods
    function resetInnerContent() {

        //Clear any existing unbound options
        $(_innerControl).html("");
    }
    function databind(dataCollection) {

        //Bind to the Features
        if (dataCollection.length > 1 && dataCollection[0].GetType() == "feature") {
            for (var i = 0; i < dataCollection.length; i++) {

                //Create control tag with html
                var newControlTag = UIControlTypes.API.CreateControlTagElem("Checkbox");
                $(newControlTag).appendTo(_innerControl);

                //Create Checkbox control instance for the tag
                var newControlInstance = UIControlTypes.API.CreateInstanceFromTag(newControlTag);
                _iConfigurationView.RegisterControl(newControlInstance);
                _iConfigurationView.DatabindControl(newControlInstance, [dataCollection[i]]);
                newControlInstance.SetLabel(dataCollection[i].GetField("Name"));
            }
        }
    }

    //Constructor/Initalizers
    this.Initialize = function (view, instanceID) {

        //Set important fields
        _iConfigurationView = view;
        _instanceID = instanceID;
        _initialized = true;

        //Get data from controltag
        _innerControl = $(_controlTagElem).find(".CheckboxListControl");

        //Clear any inner content
        resetInnerContent();
    }

    //Public methods
    this.Databind = function (clientObjects) {
        databind(clientObjects);
    }
}