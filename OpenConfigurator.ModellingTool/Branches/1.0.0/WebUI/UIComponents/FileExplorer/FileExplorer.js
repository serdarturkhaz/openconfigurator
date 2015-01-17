UIComponents.FileExplorer = function (container, dataModel) {

    // Fields
    var _container = container, _dataModel = dataModel;
    var _innerHtmlElem;
    var _innerElems = {
        openModelButton: null
    };
    var _this = this;
    var _vm = {
        ModelFilesCollection: new ObservableCollection(),
        CurrentlySelectedModelFile: new ObservableField(),
        SelectModelFile: function (attributeCLO) {
        //_vm.CurrentlySelectedAttribute(attributeCLO);
        //loadAttributeEditor(attributeCLO);
    },
    RemoveModelFile: function (attributeCLO) {
        if (attributeCLO === _vm.CurrentlySelectedAttribute()) {
            _vm.SelectAttribute(null);
        }

        _specializedDataModel.DeleteByClientID(attributeCLO.GetClientID());
    }
    };

    // Init
    this.Initialize = function () {

        // Parse html markup
        var markup = "#HTMLCONTENT#";
        _innerHtmlElem = $($.parseHTML(markup));
        _innerHtmlElem.appendTo(_container);

        // Get references to html elems
        _innerElems.openModelButton = $(_innerHtmlElem).find("#openModelButton");

        // Apply bindings
        ko.applyBindings(_vm, _innerHtmlElem[0]);
    }

    // Public methods
    this.LoadModelFiles = function () {

        // Clear current collection 
        _vm.ModelFilesCollection.RemoveAll();

        // Load list of existing model files
        var modelFiles = _dataModel.GetAllModelFiles();
        for (var i = 0; i < modelFiles.length; i++) {
            _vm.ModelFilesCollection.Add(modelFiles[i]);
        }
    }
}
