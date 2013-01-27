//Call the WebService and register it
function registerPopup(name) {
    $.ajax({
        url: "/Popups/" + name + "/WService.asmx/GetModuleContent",
        data: "{}",
        async: false,
        success: function (response) {
            var contentObject = JSON.parse(response.d);
            $("body").append(contentObject.HTML);

            //Load the Script for it
            eval(contentObject.Script);
        }
    });
}