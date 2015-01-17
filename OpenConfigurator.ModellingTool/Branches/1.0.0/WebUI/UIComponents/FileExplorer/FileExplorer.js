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
        CurrentlySelectedModelFile: new ObservableField(null),
        SelectModelFile: function (modelFileCLO) {
            _vm.CurrentlySelectedModelFile(modelFileCLO);
        },
        OpenModelFile: function () {
            _this.FileOpenTriggered.RaiseEvent(_vm.CurrentlySelectedModelFile());
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
        _vm.CurrentlySelectedModelFile(null);

        // Load list of existing model files
        var modelFiles = _dataModel.GetAllModelFiles();
        for (var i = 0; i < modelFiles.length; i++) {
            _vm.ModelFilesCollection.Add(modelFiles[i]);
        }
    }

    // Events
    this.FileOpenTriggered = new Event();
}
