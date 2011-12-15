(function ($) {
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
        //
        var rootUl = $("<ul></ul>").appendTo(tree);
        for (var i = 0; i < opts.data.length; i++) {
            //Variables
            var typeName = opts.data[i].typeName;
            var type = opts.types[typeName];

            //Row and expander
            var rowLi = $("<li class='row'></li>").appendTo(rootUl);
            var expander = $("<div class='expander'></div>").addClass("collapsed").appendTo(rowLi);

            //Node 
            var node = $("<div class='node'></div>").addClass(typeName).appendTo(rowLi);
            var icon = $("<div class='icon'></div>").addClass(typeName).appendTo(node);
            var nameNode = $("<div class='nameNode'>" + opts.data[i][type.labelField] + "</div>").appendTo(node);


            //Create children
            for (var j = 0; j < opts.data[i].children.length; j++) {

            }

        }
    }
    var createNode = function (opts) {

    }
    //*********************************************************************************************************************************
    //Public functions*****************************************************************************************************************
    $.fn.simpleTree.addNode = function () {

    }
    //*********************************************************************************************************************************
})(jQuery);
