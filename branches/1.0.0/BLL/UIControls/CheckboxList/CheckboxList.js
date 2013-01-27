UIControlTypes.Controls.CheckboxList.Dependencies = ["Checkbox"];
UIControlTypes.Controls.CheckboxList.Class = function (instanceID, internalMethodsCollection) {

    //Fields
    var _controlTagElem = null, _innerControl = null;
    var _instanceID = instanceID;
    var _boundClientFeatures = {};
    var _innerCheckBoxTempIDCounter = 0;
    var _thisCheckboxListControl = this;

    //Properties
    this.GetInstanceID = function () {
        return _instanceID;
    }
    this.SetControlTagElem = function (controlTagElem) {
        _controlTagElem = controlTagElem;
    }

    //Private methods
    var resetInnerContent = function () {

        //Clear any existing unbound options
        $(_innerControl).html("");

    }
    var databind = function (dataCollection) {

        //Bind to the Features
        if (dataCollection.length > 1 && dataCollection[0].GetType() == "feature") {
            for (var i = 0; i < dataCollection.length; i++) {

                //Create control tag with html
                var newControlTag = internalMethodsCollection.CreateControlTagElem("Checkbox");
                $(newControlTag).appendTo(_innerControl);

                //Create Checkbox control instance for the tag
                var checkboxInstance = internalMethodsCollection.CreateInstanceFromControlTag(newControlTag, _instanceID + "_" + _innerCheckBoxTempIDCounter++, internalMethodsCollection);
                checkboxInstance.Initialize();

                //Databind it
                checkboxInstance.Databind([dataCollection[i]]);
            }
        }
    }

    //Constructor/Initalizers
    this.Initialize = function () {

        //Get fields
        _innerControl = $(_controlTagElem).find(".CheckboxListControl");

        //Clear any inner content
        resetInnerContent();
    }

    //Public methods
    this.Databind = function (clientObjects) {
        databind(clientObjects);
    }
}