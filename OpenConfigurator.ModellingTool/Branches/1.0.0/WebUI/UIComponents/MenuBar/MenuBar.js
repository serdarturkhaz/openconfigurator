UIComponents.CommandToolbar = function (container, controller) {

    // Fields
    var _container = container, _dataModel = dataModel, _controller = controller;
    var _innerHtmlElem;
    var _innerElems = {
        fileCommandItems: {
            newModelItem: null,
            openModelItem: null,
            saveModelItem: null
        }
    };
    var _this = this;
    

    var _itemStructure = {
        file: {
            Name: "File",
            Type: "root",
            Children: [{

            }]
        }
    }


    // Private methods
    

    // Init
    this.Initialize = function () {

        // Parse html markup
        var markup = "#HTMLCONTENT#";
        _innerHtmlElem = $($.parseHTML(markup));
        _innerHtmlElem.appendTo(_container);

        // Get references to html elems
        _innerElems.modelNameTextbox = $(_innerHtmlElem).find("#modelNameTextbox");
        _innerElems.fileCommandItems.newModelItem = $(_innerHtmlElem).find("#newModelItem");
        

    }

    // Event handlers


}
