UIComponents.FileExplorer = function (container, dataModel) {

    // Fields
    var _container = container, _dataModel = dataModel;
    var _innerHtmlElem;
    var _innerElems = {
        
    };
    var _this = this;
    
    // Init
    this.Initialize = function () {

        // Parse html markup
        var markup = "#HTMLCONTENT#";
        _innerHtmlElem = $($.parseHTML(markup));
        _innerHtmlElem.appendTo(_container);

        // Get references to html elems
        //_innerElems.modelNameTextbox = $(_innerHtmlElem).find("#modelNameTextbox");
        
    }

    // Public methods
    this.Show = function () {
        $.modal("<div><h1>SimpleModal</h1></div>");
        //$(_innerHtmlElem).popup();
        //var popup = new $.Popup();
        //popup.open('<div>hi</div>');
    }

    // Event handlers
    
}
