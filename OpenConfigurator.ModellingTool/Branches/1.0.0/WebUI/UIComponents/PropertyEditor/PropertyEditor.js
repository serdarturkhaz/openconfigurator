UIComponents.PropertyEditor = function (container, dataModel, cloSelectionManager) {

    // Fields
    var _container = container, _dataModel = dataModel, _cloSelectionManager = cloSelectionManager;
    var _innerHtmlElem;
    var _currentInnerEditorInstance = null, _currentCLO = null;
    var _innerElems = {
        headerLabel: null,
        innerContainer: null
    };
    var _this = this;

    // Private methods
    function loadInnerEditor(clo) {

        if (_currentInnerEditorInstance) {
            _currentInnerEditorInstance.RemoveSelf();
            _currentInnerEditorInstance = null;
        }

        _currentInnerEditorInstance = UIComponentProvider.CreateInstance("UIComponents.PropertyEditor." + clo.GetType() + "InnerEditor", [_innerElems.innerContainer, clo]);
        _currentInnerEditorInstance.Initialize();
    }

    // Init
    this.Initialize = function () {

        // Parse html markup
        var markup = "#HTMLCONTENT#";
        _innerHtmlElem = $($.parseHTML(markup));
        _innerHtmlElem.appendTo(_container);

        // Get references to html elems
        _innerElems.headerLabel = $(_innerHtmlElem).find(".headerLabel");
        _innerElems.innerContainer = $(_innerHtmlElem).find(".boxContent");

        // Make draggable
        $(_innerHtmlElem).draggable({
            handle: ".boxHeader",
            containment: "window"
        });

        // Hide initially
        _innerHtmlElem.hide();
    }

    // Public methods
    this.Close = function () {
        if (_currentInnerEditorInstance) {
            _currentInnerEditorInstance.RemoveSelf();
            _currentInnerEditorInstance = null;
        }
        _innerHtmlElem.hide();
    }
    this.OpenAndEdit = function (CLOArray) {

        // Load the CLO 
        loadInnerEditor(CLOArray[0]);
        _innerHtmlElem.show();
    }
}
