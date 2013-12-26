//Namespace declaration
var UIControlTypes = {
    Controls: {}
};

//API-like interface  (handles retreival of UIControl resources and creation of instances)
UIControlTypes.API = {};
UIControlTypes.CommonResources = {
    Loaded: false
};
(function () {

    //Private methods
    function initControlResources(controltype) {
        loadCommonResources();
        registerUIControl(controltype);
    }
    function registerUIControl(controltype) {

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
    function loadControlScript(controltype) {

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
    function loadCommonResources() {

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
    function getRecursiveStyles(controltype, stylesCollection) {

        //Variables
        var stylesList = stylesCollection!= undefined ? stylesCollection : {};

        //Add the css to the styles collection
        var css = UIControlTypes.Controls[controltype].Resources.CSS;
        stylesList[controltype] = css;

        //Recursively load the styles for the dependencies
        var dependencies = UIControlTypes.Controls[controltype].Dependencies;
        if (dependencies != undefined && dependencies.length > 0) {
            for(var i=0;i<dependencies.length;i++) {
                getRecursiveStyles(dependencies[i], stylesList); 
            }
        }

        //
        return stylesList;
    }

    //Global methods
    UIControlTypes.API.CreateControlTagElem = function (controltype, databindingExp) {

        //Init control resources
        initControlResources(controltype);

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
    UIControlTypes.API.RegisterControlCSS = function (controltype, headElem) {

        //Init control resources
        initControlResources(controltype);

        //Load the CSS for the control (and for its dependencies)
        var stylesCollection = getRecursiveStyles(controltype);

        //Loop through styles 
        for(var type in stylesCollection) {

            //If the styleElem for the controltype doesnt exist
            var styleElem = $(headElem).find("#" + type + "_style");
            if(styleElem.length == 0) 
            {
                //Create it
                styleElem = $("<style type='text/css'></style>").attr("id", type +"_style").appendTo(headElem);
            } 

            //Set the content for the styleElem
            $(styleElem).text(stylesCollection[type]);
        }
    }
    UIControlTypes.API.CreateInstanceFromTag = function (controlTagElem) {

        //Init API for the UIControlType specified in the control tag
        var controltype = $(controlTagElem).attr("controltype");
        initControlResources(controltype);

        //Create an instance of the specific control type
        var controlInstance = new UIControlTypes.Controls[controltype].Class(controlTagElem);

        //
        return controlInstance;
    }
} ()); 
