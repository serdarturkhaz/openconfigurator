(function ($) {
    //Global variables
    var internalNodeIDCounter = 0;

    var treeDefaultSettings = {
        nodeSystemTypes: {
            parent: "parent",
            leaf: "leaf"
        },
        nodeDisplayStates: {
            expanded: "expanded",
            collapsed: "collapsed"
        },
        nodeSelectedStates: {
            selected: "selected",
            unselected: "unselected"
        }
    }

    //JQuery constructor method
    $.fn.simpleTree = function (opts) {

        //Initialize the options
        var options = $.extend({}, $.fn.simpleTree.defaults, opts);

        //Initialize the treeTable
        return this.each(function () {
            var tree = $(this);
            var treeId = tree.attr("id");

            createTreeStructure(tree, options);
        });

    }

    //Default settings
    $.fn.simpleTree.defaults = {
        data: null,
        types: null,
        onNodeSelected: function (node, shift) {
        }
    };

    //Private functions****************************************************************************************************************
    var createTreeStructure = function (tree, opts) {
        $(tree).addClass("simpleTree");
        $(tree).data("options", opts);
        //
        var rootUl = $("<ul class='root'></ul>").appendTo(tree);
        for (var i = 0; i < opts.data.length; i++) {

            //Row
            var dataRow = opts.data[i];
            var hasChildren = (opts.data[i].children != undefined);
            var row = createRow(dataRow, opts.types[dataRow.typeName], dataRow.typeName, opts.onNodeSelected);
            row.appendTo(rootUl);

            //Create children
            if (hasChildren) {
                for (var j = 0; j < opts.data[i].children.length; j++) {
                    var childDataRow = opts.data[i].children[j];
                    var childRow = createRow(childDataRow, opts.types[childDataRow.typeName], childDataRow.typeName, opts.onNodeSelected);
                    appendChildRow(childRow, row);
                }
            }
        }
    }
    var createRow = function (dataObj, type, typeName, onSelected) {

        //Row
        var row = $("<li class='row'></li>");
        row.attr("id", "node-" + internalNodeIDCounter++);
        row.attr("dataID", dataObj[type.idField]);

        //Node and expander
        var node = $("<div class='node'></div>").addClass(typeName).appendTo(row);
        var expander = $("<div class='expander'></div>").appendTo(node);

        //InnerNode 
        var innerNode = $("<div class='innerNode'></div>").appendTo(node);
        var icon = $("<div class='icon'></div>").appendTo(innerNode);
        var nameNode = $("<div class='name'>" + dataObj[type.labelField] + "</div>").appendTo(innerNode);

        //Initialize
        node.attr("nodeSystemType", treeDefaultSettings.nodeSystemTypes.leaf);
        expander.css("visibility", "hidden");

        //Event handlers
        expander.bind("click", function (e) {
            toggleExpandCollapseState(node);
        });
        if (type.selectable) {
            node.bind("click", function (e) {
                selectNode(node, e.shiftKey);
                onSelected.call({}, node, e.shiftKey);
            });
        }
        //Disable
        $(node).disableSelection();

        return row;
    }

    var appendChildRow = function (childRow, destinationRow) {

        //Variables
        var destinationNode = $(destinationRow).children(".node");
        var destinationNodeSystemType = $(destinationNode).attr("nodeSystemType");
        var childrenContainer = null;

        //Add attribute to keep track of parent
        $(childRow).attr("parentDataID", destinationRow.attr("dataID"));

        //Reinitialize destinationRow
        switch (destinationNodeSystemType) {
            //Parent                                                
            case treeDefaultSettings.nodeSystemTypes.parent:
                childrenContainer = $(destinationRow).children(".childrenContainer");

                childRow.appendTo(childrenContainer);
                break;
            //Leaf                                                
            case treeDefaultSettings.nodeSystemTypes.leaf:
                $(destinationNode).attr("nodeSystemType", treeDefaultSettings.nodeSystemTypes.parent);
                $(destinationNode).attr("nodeDisplayState", treeDefaultSettings.nodeDisplayStates.collapsed);

                childrenContainer = $("<ul class='childrenContainer level0'></ul>").appendTo(destinationRow);

                //Show expander & collapse
                var expander = $(destinationNode).children(".expander");
                expander.css("visibility", "visible");
                childrenContainer.hide();

                childRow.appendTo(childrenContainer);
                break;
        }
    }
    var getParentNode = function (node) {
        var row = $(node).parent();
        var tree = $(node).parents(".simpleTree");
        var parentNode = getNode(tree, row.attr("parentDataID"));
        return parentNode;
    }
    var getNode = function (tree, dataId) {
        var node = $(tree).find(".row[dataId='" + dataId + "']").children(".node");
        if (node.length == 1)
            return node;
        else
            return null;
    }
    var getDataID = function (node) {
        return $(node).parent().attr("dataID");
    }
    var expandRow = function (row) {

        //Set expanded state 
        var node = $(row).children(".node");
        node.attr("nodeDisplayState", "expanded");

        //Show children
        var childrenContainer = $(row).children(".childrenContainer");
        childrenContainer.show();
    }
    var collapseRow = function (row) {

        //Set collapsed state
        var node = $(row).children(".node");
        node.attr("nodeDisplayState", "collapsed");

        //Hide children
        var childrenContainer = $(row).children(".childrenContainer");
        childrenContainer.hide();
    }
    var toggleExpandCollapseState = function (node) {
        var row = $(node).parent();
        var currentState = $(node).attr("nodeDisplayState");
        switch (currentState) {
            case treeDefaultSettings.nodeDisplayStates.expanded:
                collapseRow(row);
                break;
            case treeDefaultSettings.nodeDisplayStates.collapsed:
                expandRow(row);
                break;
        }
    }

    var selectNode = function (node, shift) {
        var tree = $(node).parents(".simpleTree");
        var isSelected = $(node).attr("selected");
        if (!isSelected) {
            if (shift == false)
                deselectAll(tree);
            $(node).attr("selected", "true");
        }

    }
    var deselectAll = function (tree) {
        $(tree).find(".node[selected=true]").removeAttr("selected");
    }

    var updateNodeName = function (node, newName) {
        $(node).children(".innerNode").children(".name").text(newName);
    }
    var deleteNode = function (node) {
        //Variables
        var row = $(node).parent();
        var hasSiblings = ($(row).siblings().length > 0);
        var childrenContainer = $(row).parent();
        var parentNode = getParentNode(node);
        var parentNodeExpander = parentNode.children(".expander");

        //Delete the row containing the node
        row.remove();

        //Reset the parent if there were no other siblings left
        if (!hasSiblings) {
            $(parentNode).attr("nodeSystemType", treeDefaultSettings.nodeSystemTypes.leaf);
            $(parentNode).removeAttr("nodeDisplayState");
            childrenContainer.remove();
            parentNodeExpander.css("visibility", "hidden");
        }
    }
    //*********************************************************************************************************************************
    //Public functions*****************************************************************************************************************
    $.fn.getNode = function (dataId) {
        var tree = $(this);
        var node = getNode(tree, dataId);
        return node;
    }
    $.fn.addChildNode = function (dataRow) {
        //Variables
        var destinationRow = $(this).parent();
        var opts = $(destinationRow).parents(".simpleTree").data("options");

        //
        var newRow = createRow(dataRow, opts.types[dataRow.typeName], dataRow.typeName, opts.onNodeSelected);
        appendChildRow(newRow, destinationRow);
    }
    $.fn.selectNode = function (shift) {
        selectNode($(this), shift);
    }
    $.fn.deselectAll = function () {
        var tree = $(this);
        deselectAll(tree);
    }
    $.fn.updateNodeName = function (newName) {
        var node = $(this);
        updateNodeName(node, newName);
    }
    $.fn.deleteNode = function () {
        var node = $(this);
        deleteNode(node);
    }
    $.fn.getNodeDataID = function () {
        var node = $(this);
        return getDataID(node);
    }
    $.fn.getSelectedNodes = function () {
        var tree = $(this);
        var selectedNodes = $(tree).find(".node[selected=true]");
        if (selectedNodes.length > 0)
            return selectedNodes;
        else
            return null;

    }
    //*********************************************************************************************************************************
})(jQuery);
