//Settings/initializations****************************************************************************************

//Ajax settings
$(document).ready(function () {
    $.ajaxSetup({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        cache: false,
        error: function (response) {
            alert('error');
        }
    });
});

//Pines notify defaults
$.pnotify.defaults.pnotify_mouse_reset = true;
$.pnotify.defaults.pnotify_width = "220px";
$.pnotify.defaults.pnotify_animate_speed = 800;
$.pnotify.defaults.pnotify_hide = true;
$.pnotify.defaults.pnotify_hide = true;
$.pnotify.defaults.pnotify_animation = "fade";
$.pnotify.defaults.pnotify_delay = 2000;
$.pnotify.defaults.pnotify_closer = true;
$.pnotify.defaults.pnotify_notice_icon = "pnotifyNoticeIcon";
$.pnotify.defaults.pnotify_error_icon = "pnotifyErrorIcon";
$.pnotify.defaults.pnotify_history = false;
$.pnotify.defaults.pnotify_opacity = 1;
//****************************************************************************************************************
//Special objects/classes*****************************************************************************************

//Events
var Event = function () {

    //Fields
    var _Handlers = new Array();

    //Methods
    this.Add = function (handler) {
        _Handlers.push(handler);
    }
    this.RaiseEvent = function (args) {
        for (var i = 0; i < _Handlers.length; i++) {
            _Handlers[i].NotifyEventRaised(args);
        }
    }
}
var EventHandler = function (func) {

    //Methods
    this.NotifyEventRaised = function (args) {

        //Setup args
        var argumentsArray = null;
        if (isArray(args) == true) {
            argumentsArray = args;
        } else {
            argumentsArray = [args];
        }

        //Call function
        func.apply(this, argumentsArray);
    }
}

//Grid methods
function createRow(headerColumns, tbody, dataObj, firstColumnURL, deleteHandler, additionalButton) {
    var tr = $("<tr></tr>").attr("objectid", dataObj.ID);

    //Create TD's for each HeaderColumn
    for (var j = 0; j < headerColumns.length - 1; j++) {
        var field = $(headerColumns[j]).children("span[columnname]").attr("columnname");
        var td = $("<td></td>").attr("style", $(headerColumns[j]).attr("style"));
        var innerElem = $("<span>" + dataObj[field] + "</span>");

        //Special if first Column
        if (j == 0) {
            $(td).addClass("FirstColumn");
            $(td).prepend("<img src='../../Content/themes/base/images/Icons/Model.png' />");
            innerElem = $("<a href='" + firstColumnURL + "" + dataObj.ID + "'>" + dataObj[field] + "</a>");
        }

        $(td).append(innerElem);
        $(tr).append(td);
    }

    //Add Actions TD
    var actionstd = $("<td class='ActionsTD'></td>");
    var wrapper = $("<div ></div>").appendTo(actionstd);
    var deleteButton = $("<div class='IconButton-Normal'></div>").append("<img src='../../Content/themes/base/images/Icons/Delete.png' />").append("<span>Delete</span>").appendTo(wrapper);
    deleteButton.bind("click", function () {
        deleteHandler(dataObj.ID);
    });
    actionstd.attr("style", $(headerColumns[headerColumns.length - 1]).attr("style"));

    //Additional action button
    if (additionalButton != undefined) {
        $(additionalButton).appendTo(wrapper);
        $(wrapper).addClass("MultiWrapper");
    }
    else {
        $(wrapper).addClass("SingleWrapper");
    }
    

    //
    $(tr).append(actionstd);
    $(tbody).append(tr);
    return tr;

}
function deleteRow(objectid, tbody) {
    $(tbody).children("tr[objectid=" + objectid + "]").children("td").effect("highlight", { color: "red", mode: "hide" }, 1000);
    $.timer(700, function () {
        $(tbody).children("tr[objectid=" + objectid + "]").remove();
    });
}
//****************************************************************************************************************
//Helper methods/small plugins************************************************************************************
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function getEnumEntryByID(collection, id) {
    for (var key in collection) {
        var enumEntry = collection[key];
        if (enumEntry.id == id) {
            return enumEntry;
        }
    }
}
function paramsToString(collection) {
    var returnString = "";
    for (var key in collection) {
        var collectionEntry = collection[key];
        returnString += "," + collectionEntry;
    }
    return returnString;
}
function sortUnique(array) {
    return $.grep(array, function (el, index) {
        return index == $.inArray(el, array);
    });
}
var readyToPress = true;
$.ctrl = function (key, callback, args) {
    $(document).keydown(function (e) {
        if (e.keyCode == key.charCodeAt(0) && e.ctrlKey) {
            if (readyToPress) {
                readyToPress = false;

                if (!args) args = []; // IE barks when args is null
                callback.apply(this, args);

                $.timer(500, function () {
                    readyToPress = true;
                });
            }
            return false;
        }
    });
};
Object.size = function (obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
function isArray(a) {
    return Object.prototype.toString.apply(a) === '[object Array]';
}
(function ($) {

    $.fn.disableSelection = function () {
        return this.each(function () {
            $(this).attr('unselectable', 'on')
               .css({
                   '-moz-user-select': 'none',
                   '-webkit-user-select': 'none',
                   'user-select': 'none'
               })
               .each(function () {
                   this.onselectstart = function () { return false; };
               });
        });
    };

})(jQuery);
//****************************************************************************************************************

