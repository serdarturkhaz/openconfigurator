UIComponents.FileExplorer = function (container, dataModel) {

    // Fields
    var _container = container, _dataModel = dataModel;
    var _innerHtmlElem;
    var _innerElems = {
        closeIcon: null
    };
    var _this = this;
    var _vm = {
        ModelFilesCollection : null
    };

    // Init
    this.Initialize = function () {

        // Parse html markup
        var markup = "#HTMLCONTENT#";
        _innerHtmlElem = $($.parseHTML(markup));
        _innerHtmlElem.appendTo(_container);

        // Get references to html elems
        _innerElems.closeIcon = $(_innerHtmlElem).find("#closeIcon");
    }

    // Public methods
    this.Show = function () {

        // Load list of existing model files
        var modelFiles = _dataModel.GetAllModelFileNames();

    }

    // Event handlers
    
}
