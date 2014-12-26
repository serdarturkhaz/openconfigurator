UIComponents.PropertyEditor = function (container, dataModel, cloSelectionManager) {

    // Fields
    var _container = container, _dataModel = dataModel, _cloSelectionManager = cloSelectionManager;
    var _innerHtmlElem;
    var _innerElems = {
        
    };
    var _this = this;

    // Private methods
    

    // Init
    this.Initialize = function () {

        // Parse html markup
        var markup = "#HTMLCONTENT#";
        _innerHtmlElem = $($.parseHTML(markup));
        _innerHtmlElem.appendTo(_container);

        // Get references to html elems
        //_innerElems.modelManipulationItems.newFeatureItem = $(_innerHtmlElem).find("#newFeatureItem");
       
        // Make draggable
        $(_innerHtmlElem).draggable({
            handle: ".boxHeader",
            containment: "window"
        });

        // Hide initially
        //_innerHtmlElem.hide();
    }

    // Event handlers
    this.OnCLOSelectionToggled = function () {
        var selectedCLOArray = _cloSelectionManager.GetAllSelectedCLOs();
        if (selectedCLOArray.length === 0 || selectedCLOArray.length > 1) {
            _innerHtmlElem.hide();
        } else if (selectedCLOArray.length === 1) {
            _innerHtmlElem.show();
        }
    }
   
}
