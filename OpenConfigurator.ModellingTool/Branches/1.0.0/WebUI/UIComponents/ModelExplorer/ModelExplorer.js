UIComponents.ModelExplorer = function (container, dataModel, cloSelectionManager) {

    // Fields
    var _container = container, _dataModel = dataModel, _cloSelectionManager = cloSelectionManager;
    var _tree = null, _treeOptions = {
        data: [
                {
                    ID: "CompositionRulesNode",
                    Name: "Composition Rules",
                    typeName: "Folder"
                },
                {
                    ID: "CustomRulesNode",
                    Name: "Custom Rules",
                    typeName: "Folder"
                },
                {
                    ID: "CustomFunctionsNode",
                    Name: "Custom Functions",
                    typeName: "Folder"
                },
                {
                    ID: "FeaturesNode",
                    Name: "Features",
                    typeName: "Folder"
                }
        ],
        types: {
            Folder: {
                idField: "ID",
                labelField: "Name",
                selectable: false
            },
            Feature: {
                idField: "ID",
                labelField: "Name",
                selectable: true
            },
            CompositionRule: {
                idField: "ID",
                labelField: "Name",
                selectable: true
            },
            CustomRule: {
                idField: "ID",
                labelField: "Name",
                selectable: true
            },
            CustomFunction: {
                idField: "ID",
                labelField: "Name",
                selectable: true
            }
        },
        onNodeClicked: onNodeClicked
    };
    var _innerHtmlElem;
    var _this = this;

    // Private methods
    function addElement(clo, nodeType) {

        // Create a new element 
        var name = clo.Name();
        var newDataRow = {
            ID: clo.GetClientID(),
            Name: name,
            typeName: nodeType
        };

        // Add it to its parent node
        var parentNode = $(_tree).getNode(nodeType + "sNode");
        var newNode = $(parentNode).addNewChildNode(newDataRow);

        // Bind it to the CLO
        clo.Name.Changed.AddHandler(new EventHandler(function (newValue) {
            $(newNode).updateNodeName(newValue);
        }));
        clo.Selected.Changed.AddHandler(new EventHandler(function (newValue) {
            if (newValue) {
                $(newNode).setNodeSelected();
            } else {
                $(newNode).setNodeUnselected();
            }
        }));

        //
        return newNode;
    }
    function removeElement(node) {
        $(node).deleteNode();
    }

    // Init
    this.Initialize = function () {

        // Setup innerHtml elem
        _innerHtmlElem = $("<div id='modelExplorerTree'></div>").appendTo(_container);

        // Create simpleTree
        _tree = $(_innerHtmlElem).simpleTree(_treeOptions);

        // Handler for onFocus
        $(_container).bind("click", function (e) {
            _this.Focus.RaiseEvent();
        });
    }

    // Events
    this.Focus = new Event();

    // Event handlers
    this.OnModelLoaded = function (modelCLO) {

        // Bind to it
        modelCLO.Features.Added.AddHandler(new EventHandler(modelHandlers.onCLOAdded));
        modelCLO.Features.Removed.AddHandler(new EventHandler(modelHandlers.onCLORemoved));
        modelCLO.CompositionRules.Added.AddHandler(new EventHandler(modelHandlers.onCLOAdded));
        modelCLO.CompositionRules.Removed.AddHandler(new EventHandler(modelHandlers.onCLORemoved));
        modelCLO.CustomRules.Added.AddHandler(new EventHandler(modelHandlers.onCLOAdded));
        modelCLO.CustomRules.Removed.AddHandler(new EventHandler(modelHandlers.onCLORemoved));
        modelCLO.CustomFunctions.Added.AddHandler(new EventHandler(modelHandlers.onCLOAdded));
        modelCLO.CustomFunctions.Removed.AddHandler(new EventHandler(modelHandlers.onCLORemoved));

    }
    function onNodeClicked(node, ctrlKey) {
        var clo = _dataModel.GetByClientID(node.getNodeDataID());
        _cloSelectionManager.ToggleSingleCLO(clo, ctrlKey);
    };
    var modelHandlers = {
        onCLOAdded: function (clo) {
            addElement(clo, clo.GetType());
        },
        onCLORemoved: function (clo) {
            var nodeElem = $(_tree).getNode(clo.GetClientID());
            removeElement(nodeElem);
        }
    }
}