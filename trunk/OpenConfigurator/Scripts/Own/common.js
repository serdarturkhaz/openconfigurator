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


Object.size = function (obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};