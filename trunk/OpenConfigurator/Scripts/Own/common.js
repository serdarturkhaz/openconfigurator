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

//


//Ajax
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


//Helper methods/small plugins***********************************************************************************
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

//**************************************************************************************************************