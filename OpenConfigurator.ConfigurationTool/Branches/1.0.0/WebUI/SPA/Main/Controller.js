define("Main/Controller",
    [
        //"Main/DataModel",
        //"Main/ConfigurationView/ConfigurationView",
        //"Main/MenuBar/MenuBar",
        //"Shared/Dialog/Dialog"

    ],
    function (DataModel, ConfigurationView, MenuBar, Dialog) {
        var Controller = function () {

            // Fields
            var _dataModel = null;
            var _menuBar = null, _configurationView = null
            var _currentControlFocus = null; // variable to keep track of where the user executed the last action (clicking)
            var _this = this;

            // Init
            this.Initialize = function () {

                //// Init UIComponents
                //_dataModel = new DataModel();
                //_dataModel.Initialize();
                //_cloSelectionManager = new Controller.CLOSelectionManager();
                //_cloSelectionManager.Initialize();
                //_visualView = new VisualView($("#visualViewContainer"), _dataModel, _cloSelectionManager);
                //_visualView.Initialize();
                //_modelExplorer = new ModelExplorer($("#modelExplorerContainer"), _dataModel, _cloSelectionManager);
                //_modelExplorer.Initialize();
                //_commandToolbar = new CommandToolbar($("#toolBarContainer"), _dataModel, _this);
                //_commandToolbar.Initialize();
                //_propertyEditor = new PropertyEditor($("#propertyEditorContainer"), _dataModel, _cloSelectionManager);
                //_propertyEditor.Initialize();
                //_menuBar = new MenuBar($("#topMenuContainer"), _dataModel, _this);
                //_menuBar.Initialize();

                //// Setup events and handlers
                //_dataModel.ModelLoaded.AddHandler(new EventHandler(_visualView.OnModelLoaded));
                //_dataModel.ModelLoaded.AddHandler(new EventHandler(_modelExplorer.OnModelLoaded));
                //_dataModel.ModelLoaded.AddHandler(new EventHandler(_commandToolbar.OnModelLoaded));
                //_dataModel.ModelUnloaded.AddHandler(new EventHandler(_visualView.OnModelUnloaded));
                //_dataModel.ModelUnloaded.AddHandler(new EventHandler(_modelExplorer.OnModelUnloaded));
                //_dataModel.ModelUnloaded.AddHandler(new EventHandler(_commandToolbar.OnModelUnloaded));
                //_visualView.StateChanged.AddHandler(new EventHandler(_commandToolbar.OnVisualViewStateChanged));
                //_dataModel.CLODeleted.AddHandler(new EventHandler(_cloSelectionManager.OnCLODeleted));
                //_cloSelectionManager.CLOSelectionChanged.AddHandler(new EventHandler(onCLOSelectionChanged));

            }

            // Public methods
            this.OpenFile = function () {
                
                // Setup fileExplorer and dialog in which it is shown
                if (_fileExplorer === null && _fileExplorerDialog === null) {

                    // Create fileExplorer instance
                    var fileExplorerContainer = $("<div class='contentWrapper'></div>");
                    _fileExplorer = new FileExplorer(fileExplorerContainer, _dataModel);
                    _fileExplorer.Initialize();
                    _fileExplorer.FileOpenTriggered.AddHandler(new EventHandler(onFileSelectedForOpen));

                    // Create dialog instance
                    _fileExplorerDialog = new Dialog("Open existing model", fileExplorerContainer, { modal: true });
                    _fileExplorerDialog.Initialize();
                }

                _fileExplorer.LoadModelFiles();
                _fileExplorerDialog.Show();
            }

            // Event handlers
            var onViewFocused = function (viewInFocus) {
                if (_currentControlFocus !== viewInFocus) {
                    _currentControlFocus = viewInFocus;
                }
            }
        }

        
        // Special global class (currently used by certain CLOs when adding new objects to them)
        window.IdentifierProvider = (function () { // "static" class

            // Methods
            function getNewCLOIdentifier(cloType, collection) {

                // Variables
                var identifier = cloType + "_" + collection.GetAbsoluteItemCounter();
                if (collection.ContainsItemWith("Identifier", identifier)) {
                    var i = collection.GetAbsoluteItemCounter();
                    do {
                        i = i + 1;
                        identifier = cloType + "_" + i;
                    } while (collection.ContainsItemWith("Identifier", identifier));
                }
                return identifier;
            }
            function setupIdentifier(clo, parentCLO) { // parentCLO can be the FeatureModel or the Feature (if an attribute is passed as the clo)

                // If the clo to be added doesnt have an identifier, provide it with one
                if (clo.Identifier !== undefined && clo.Identifier() === null) {

                    var collection = parentCLO[clo.GetType() + "s"]; // get the collection corresponding to the type of the given CLO 
                    var autoGeneratedIdentifier = getNewCLOIdentifier(clo.GetType(), collection);

                    clo.Identifier(autoGeneratedIdentifier);
                    if (clo.Name !== undefined)
                        clo.Name(autoGeneratedIdentifier);

                }
            }

            // Public methods
            return {
                SetupIdentifier: setupIdentifier
            };
        })();


        return Controller;
    });

