define("Main/ConfigurationEditor/ConfigurationEditor",
    [
        "text!Main/ConfigurationEditor/ConfigurationEditor.html" // html markup
    ],
    function (HTMLmarkup) {

        var ConfigurationEditor = function (container, dataModel) {

            // Fields
            var _container = container, _dataModel = dataModel;
            var _innerHtmlElem;
            var _innerElems = {
                headerLabel: null,
                infoMsgOverlay: null
            };
            var _visualUIElems = {};
            var _this = this;

            // Private methods
            

            // Init
            this.Initialize = function () {

                // Parse html markup
                _innerHtmlElem = $($.parseHTML(HTMLmarkup));
                _innerHtmlElem.appendTo(_container);

                // Get references to dom elements
                //_canvasContainer = $(_innerHtmlElem).find("#SVGCanvasWrapper");
                //_innerElems.headerLabel = $(_innerHtmlElem).find(".headerLabel");
                //_innerElems.infoMsgOverlay = $(_innerHtmlElem).find(".infoMsgOverlay");
                //_canvas = Raphael($(_canvasContainer).children("#SVGCanvas")[0], "100%", "100%");
                //_innerStateManager = new InnerStateManager(VisualView.InnerStates, VisualView.InnerStates.Default.Name, _this.StateChanged);
                //_innerStateManager.Initialize(); // setup mode manager and enter initial mode

                
            };

            // Public methods
           

            // Events

            // Event handlers

            // Inner modes

        }
        return ConfigurationEditor;
    });