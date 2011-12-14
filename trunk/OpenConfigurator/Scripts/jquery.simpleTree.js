(function ($) {
    //JQuery constructor method
    $.fn.simpleTree = function (opts) {

        //Initialize the options
        var options = $.extend({}, $.fn.simpleTree.defaults, opts);

        //Initialize the treeTable
        return this.each(function () {
            var tree = $(this);
            var treeId = tree.attr("id");
        });

    }

    //Default settings
    $.fn.simpleTree.defaults = {
        data: null,
        types: {}
    };

    //Private functions****************************************************************************************************************
    var createNodeHtml = function () {

    }
    //*********************************************************************************************************************************
    //Public functions*****************************************************************************************************************
    $.fn.simpleTree.addNode = function () {

    }
    //*********************************************************************************************************************************
})(jQuery);
