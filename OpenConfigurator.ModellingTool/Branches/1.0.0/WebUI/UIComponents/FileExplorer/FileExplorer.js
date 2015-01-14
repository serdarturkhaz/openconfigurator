UIComponents.FileExplorer = function (container, dataModel) {

    // Fields
    var _container = container, _dataModel = dataModel;
    var _innerHtmlElem;
    var _innerElems = {
        closeIcon: null
    };
    var _this = this;
    var _modal = null;
    // Init
    this.Initialize = function () {

        // Parse html markup
        var markup = "#HTMLCONTENT#";
        _innerHtmlElem = $($.parseHTML(markup));
        
        // Get references to html elems
        _innerElems.closeIcon = $(_innerHtmlElem).find("#closeIcon");
    }

    // Public methods
    this.Show = function () {
        _modal = $.modal(_innerHtmlElem);

        // Handlers
        _innerElems.closeIcon.bind("click", function () {
            _modal.close();
        });

        // Make draggable
        $(_innerHtmlElem).draggable({
            handle: ".boxHeader",
            containment: "window"
        });
    }

    // Event handlers
    
}
