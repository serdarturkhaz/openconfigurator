(function ($) {
    //Global variables
    var internalNodeIDCounter = 0;

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
        types: null
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
            var row = createRow(dataRow, opts.types[dataRow.typeName], dataRow.typeName, hasChildren);
            row.appendTo(rootUl);

            //Create children
            if (hasChildren) {
                var childrenUl = $("<ul class='childrenContainer level0'></ul>").appendTo(row);
                for (var j = 0; j < opts.data[i].children.length; j++) {

                    //Child row
                    var childDataRow = opts.data[i].children[j];
                    var childRow = createRow(childDataRow, opts.types[childDataRow.typeName], childDataRow.typeName);
                    childRow.appendTo(childrenUl);
                }
            }
        }
    }
    var createRow = function (dataObj, type, typeName, hasChildren) {

        //Row and expander
        var row = $("<li class='row' state='expanded'></li>");
        row.attr("id", "node-" + internalNodeIDCounter++);
        row.attr("dataID", dataObj[type.idField]);
        var expander = $("<div class='expander'></div>").css("visibility", "hidden").appendTo(row);
        if (hasChildren) {
            expander.css("visibility", "visible");
            expander.addClass("expanded");
        }

        //Node 
        var node = $("<div class='node'></div>").addClass(typeName).appendTo(row);
        var icon = $("<div class='icon'></div>").addClass(typeName).appendTo(node);
        var nameNode = $("<div class='nameNode'>" + dataObj[type.labelField] + "</div>").appendTo(node);

        //Event handlers
        expander.bind("click", function () {
            toggleNodeExpander(row);
        });
        if (type.selectable) {
            node.bind("click", function () {
                selectNode(node);
            });
        }

        return row;
    }
    var addChildRow = function (row, destinationRow) {

        //Variables
        var hasChildren = ($(destinationRow).find(".childrenContainer").length == 1);
        var childrenContainer = null;

        //
        if (hasChildren) {
            childrenContainer = $(destinationRow).children(".childrenContainer");
            row.appendTo(childrenContainer);
        } else {
            childrenContainer = $("<ul class='childrenContainer level0'></ul>").appendTo(destinationRow);
            row.appendTo(childrenContainer);
            collapseRow(destinationRow);
        }
    }
    var expandRow = function (row) {

        //Set expanded state 
        $(row).attr("state", "expanded");
        var expander = $(row).children(".expander");
        expander.css("visibility", "visible");
        expander.removeClass("collapsed").addClass("expanded");

        //Show children
        var childrenContainer = $(row).children(".childrenContainer");
        childrenContainer.show();
    }
    var collapseRow = function (row) {

        //Set collapsed state
        $(row).attr("state", "collapsed");
        var expander = $(row).children(".expander");
        expander.css("visibility", "visible");
        expander.removeClass("expanded").addClass("collapsed");

        //Hide children
        var childrenContainer = $(row).children(".childrenContainer");
        childrenContainer.hide();
    }
    var toggleNodeExpander = function (row) {
        var currentState = $(row).attr("state");
        switch (currentState) {
            case "expanded":
                collapseRow(row);
                break;
            case "collapsed":
                expandRow(row);
                break;
        }
    }

    var selectNode = function (node) {
        var tree = $(node).parents(".simpleTree");
        var isSelected = $(node).hasClass("selectedNode");
        if (!isSelected) {
            deselectAll(tree);
            $(node).addClass("selectedNode");
        }
    }
    var deselectAll = function (tree) {
        $(tree).find(".selectedNode").removeClass("selectedNode");
    }
    //*********************************************************************************************************************************
    //Public functions*****************************************************************************************************************
    $.fn.getNode = function (dataId) {
        return $(this).find(".row[dataId='" + dataId + "']");
    }
    $.fn.addNode = function (dataRow) {
        //Variables
        var parent = $(this);
        var opts = $(parent).parents(".simpleTree").data("options");

        //
        var newRow = createRow(dataRow, opts.types[dataRow.typeName], dataRow.typeName, false);
        addChildRow(newRow, parent);
    }
    $.fn.selectNode = function () {
        selectNode($(this).children(".node"));
    }
    $.fn.deselectAll = function () {
        var tree = $(this);
        deselectAll(tree);
    }
    //*********************************************************************************************************************************
})(jQuery);
