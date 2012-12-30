//Variables and controls
var modelsDropdown = $("#CreateConfigurationPopup").find("#ModelsDropdown");
var uiTemplatesDropdown = $("#CreateConfigurationPopup").find("#UITemplatesDropdown");

//Methods
function addNewConfiguration(modelID, uiTemplateID) {

    //Create new Configuration in DB
    var id = null;
    $.ajax({
        url: "/Popups/CreateConfigurationPopup/WService.asmx/AddNewConfiguration",
        data: JSON.stringify({ modelID: modelID, uiTemplateID: uiTemplateID }),
        async: false,
        success: function (response) {
            id = response.d;
        }
    });
    return id;
}

//Dialog - prompt user to choose a UITemplate
$("#CreateConfigurationPopup").dialog({
    width: 450,
    height: 230,
    autoOpen: false,
    open: function (event, ui) {

        //
        $("#CreateConfigurationPopup").parent(".ui-dialog").block({ message: "Loading data...", fadeIn: 0 });

        //Load available Models
        $(modelsDropdown).html("");
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: "/Popups/CreateConfigurationPopup/WService.asmx/GetModels",
            data: {},
            async: false,
            success: function (response) {
                var models = JSON.parse(response.d);

                //
                $.each(models, function (index, value) {
                    var model = models[index];
                    var option = $("<option value='" + model.ID + "'>" + model.Name + " </option>");
                    $(modelsDropdown).append(option);
                });
            }
        });

        //Load available UITemplates
        $(uiTemplatesDropdown).html("");
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: "/Popups/CreateConfigurationPopup/WService.asmx/GetUITemplates",
            data: {},
            async: false,
            success: function (response) {
                var uiTemplates = JSON.parse(response.d);

                //
                $.each(uiTemplates, function (index, value) {
                    var uiTemplate = uiTemplates[index];
                    var option = $("<option value='" + uiTemplate.ID + "'>" + uiTemplate.Name + " </option>");
                    $(uiTemplatesDropdown).append(option);
                });
            }
        });

        //Load the currently selected Model
        var modelID = $("#CreateConfigurationPopup").data("modelID");
        $(modelsDropdown).attr("disabled", "disabled");
        $(modelsDropdown).find("option[selected]").removeAttr("selected");
        $(modelsDropdown).find("option[value='" + modelID + "']").attr("selected", "selected");

        //
        $("#CreateConfigurationPopup").parent(".ui-dialog").unblock();
    },
    create: function (event, ui) {
    },
    modal: true,
    resizable: false,
    closeOnEscape: true,
    closeText: "",
    buttons:
            [{
                //Cancel button
                text: "Cancel",
                click: function () {
                    $(this).dialog("close");
                }
            },
            {
                //OK button
                text: "Create configuration",
                class: "OkButton",
                click: function () {

                    //Get the chosen Model and UITemplate ids
                    var modelID = $(modelsDropdown).find("option:selected").val();
                    var uiTemplateID = $(uiTemplatesDropdown).find("option:selected").val();

                    //Create a new configuration and redirect to it
                    var newConfigID = addNewConfiguration(modelID, uiTemplateID);
                    window.location.href = "/ConfigurationEditor/ConfigurationEditor/" + newConfigID;


                    //
                    //$(this).dialog("close");
                }
            }]
});


