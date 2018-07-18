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
    // onClickAnimalCheck: function(component, event, helper){
    //     var animalImageModelId = "2SFKI4S7VUSJBRN2354ANJNMG4";
    //     var contentVersionId = component.get("v.imageInfo.contentVersionId");
    //     helper.callEinsteinAPI(component, contentVersionId, animalImageModelId);
    // },
    handleEinsteinClick: function(component, event, helper){
        var target = event.target;
        if(event.target === event.currentTarget) return;
        var modelId = null;
        while(target && !modelId){
            if(target.dataset && target.dataset.modelid){
                modelId = target.dataset.modelid;
            }
            target = target.parentElement;
        }
        if(modelId){
            helper.callEinsteinAPI(component, component.get("v.imageInfo.contentVersionId"), modelId);
        }
    }
})
