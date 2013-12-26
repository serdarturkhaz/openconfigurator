//Settings/initializations****************************************************************************************

//Ajax settings
$(document).ready(function () {
    $.ajaxSetup({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        cache: false,
        error: function (response) {
            alert('error');
            debugger;
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

    // Fields
    var _handlers = [];

    // Methods
    this.AddHandler = function (handler) {
        _handlers.push(handler);
    }
    this.RaiseEvent = function () { // can be called with any number of arbitrary arguments (both as an array: [arg1, arg2] or directly as: arg1,arg2)

        // Variables
        var argsArray;
        if (arguments.length === 1 && $.isArray(arguments[0])) {
            argsArray = arguments[0]; // passed as array ([arg1, arg2])
        } else {
           argsArray = Array.prototype.slice.call(arguments, 0); // passed directly (arg1,arg2)
        }
        var eventRaiseObj = new EventRaiseDetails();

        // Call each of the handlers
        for (var i = 0; i < _handlers.length; i++) {
            _handlers[i].NotifyEventRaised.call(undefined, argsArray, eventRaiseObj);
        }

        // Return the eventRaiseDetails object associated with this event raise
        return eventRaiseObj;
    }
}
var EventHandler = function (func) {

    // Fields
    var _func = func;

    // Methods
    this.NotifyEventRaised = function (argsArray, eventRaiseObj) {

        // Variables
        var mergedArgs = argsArray.slice(0);
        mergedArgs.push(eventRaiseObj);

        // Call function
        _func.apply(this, mergedArgs);
    }
}
var EventRaiseDetails = function () {

    // Fields
    var _cancelled = false;

    // Propertes
    this.CancelTriggered = function () {
        return _cancelled;
    }

    // Methods
    this.TriggerCancel = function () {
        _cancelled = true;
    }
}
//****************************************************************************************************************
//Helper methods/small plugins************************************************************************************

//Key press plugin method
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

//
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

