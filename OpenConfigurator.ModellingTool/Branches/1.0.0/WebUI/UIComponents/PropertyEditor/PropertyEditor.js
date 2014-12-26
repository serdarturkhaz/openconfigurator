UIComponents.PropertyEditor = function (container, dataModel, cloSelectionManager) {

    // Fields
    var _container = container, _dataModel = dataModel, _cloSelectionManager = cloSelectionManager;
    var _innerHtmlElem;
    var _innerElems = {
        headerLabel: null,
        innerContainer: null
    };
    var _this = this;


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
        _innerHtmlElem.hide();
    }
    this.OpenAndEdit = function (CLOArray) {
        _innerHtmlElem.show();
        _innerElems.headerLabel.text(CLOArray[0].GetType());
    }
}
