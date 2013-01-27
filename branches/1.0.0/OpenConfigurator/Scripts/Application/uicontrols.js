//Namespace declaration
var UIControlTypes = {
    Controls: {}
};

//API-like interface
UIControlTypes.API = {};
UIControlTypes.CommonResources = {
    Loaded: false
};
(function () {

    //Private methods
    var initControlAPI = function (controltype) {
        loadCommonResources();
        registerUIControl(controltype);
    }
    var registerUIControl = function (controltype) {

        //If control hasn't already been registered
        if (UIControlTypes.Controls[controltype] == undefined) {

            //Register control namespace
            UIControlTypes.Controls[controltype] = {};

            //Load resources
            var resourceObj;
            $.ajax({
                url: "/Common/GetControlResources",
                data: JSON.stringify({ ControlType: controltype }),
                async: false,
                success: function (dataObj) {
                    resourceObj = dataObj;
                    UIControlTypes.Controls[controltype].Resources = resourceObj;
                }
            });

            //Eval script
            loadControlScript(controltype);
        }
    }
    var loadControlScript = function (controltype) {

        //Eval script - if not already done
        if (UIControlTypes.Controls[controltype].Class == undefined) {

            //Load control script
            var controlScript = UIControlTypes.Controls[controltype].Resources.Script;
            eval(controlScript);

            //Register dependencies
            var controlTypeDependencies = UIControlTypes.Controls[controltype].Dependencies;
            if (controlTypeDependencies != undefined && controlTypeDependencies.length > 0) {
                for (var i = 0; i < controlTypeDependencies.length; i++) {
                    registerUIControl(controlTypeDependencies[i]);
                }
            }
        }
    }
    var loadCommonResources = function () {

        //Load 
        if (UIControlTypes.CommonResources.Loaded == false) {
            $.ajax({
                url: "/Common/GetCommonResources",
                data: "{}",
                async: false,
                success: function (dataObj) {
                    UIControlTypes.CommonResources.GenericControlTag = dataObj.GenericControlTag;
                }
            });

            //
            UIControlTypes.CommonResources.Loaded = true;
        }
    }

    //Global methods
    UIControlTypes.API.CreateControlTagElem = function (controltype, databindingExp) {

        //Init API for current control
        initControlAPI(controltype);

        //Setup databinding expression
        if (databindingExp == undefined || databindingExp == null) {
            databindingExp = "none";
        }

        //Create the outer and inner controls
        var controlResources = UIControlTypes.Controls[controltype].Resources;
        var outerControl = $(UIControlTypes.CommonResources.GenericControlTag);
        $(outerControl).attr({
            controltype: controlResources.ControlType,
            databinding: databindingExp
        });
        var innerElem = $(controlResources.InnerHTML).appendTo(outerControl);

        //
        return outerControl;
    }
    UIControlTypes.API.GetControlCSS = function (controltype) {

        //Init API for current control
        initControlAPI(controltype);

        //Retreive the CSS for the control
        var css = UIControlTypes.Controls[controltype].Resources.CSS;
        return css;
    }
    UIControlTypes.API.CreateInstanceFromControlTag = function (controlTagElem, instanceID, internalMethodCollection) {

        //Init API for current control
        var controltype = $(controlTagElem).attr("controltype");
        initControlAPI(controltype);

        //Create a control instance
        var controlInstance = new UIControlTypes.Controls[controltype].Class(instanceID, internalMethodCollection);
        controlInstance.SetControlTagElem(controlTagElem);

        //
        return controlInstance;
    }
} ()); 
