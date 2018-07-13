({
    onInit: function(component, event, helper){
        helper.initializeData(component);
    },
    onUploadFinished : function(component, event, helper) {
        var file = event.getParam("files")[0];
        helper.getImageInfo(component, file.documentId);
    },
    onImageInfoChange: function(component, event, helper){
        helper.drawNewImage(component);
    },
    onClickAnimalCheck: function(component, event, helper){
        var animalImageModelId = "2SFKI4S7VUSJBRN2354ANJNMG4";
        helper.callEinsteinAPI(component, animalImageModelId);
    }
})
