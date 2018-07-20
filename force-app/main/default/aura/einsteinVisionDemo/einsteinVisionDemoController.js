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
    handleEinsteinClick: function(component, event, helper){
        var target = event.target;
        if(event.target === event.currentTarget) return;
        var modelId, datasetIndex = null;
        while(target && (!modelId || !datasetIndex)){
            if(target.dataset && target.dataset.modelid){
                modelId = target.dataset.modelid;
            }
            if(target.dataset && target.dataset.datasetindex){
                datasetIndex = target.dataset.datasetindex;
            }
            target = target.parentElement;
        }
        if(modelId && datasetIndex){
            helper.callEinsteinAPI(component, component.get("v.imageInfo.contentVersionId"), modelId, datasetIndex);
        }
    },
    handleClickTabList: function(component, event, helper){
        var target = event.target;
        if(event.target === event.currentTarget) return;
        var tabindex = null;
        while(target && !tabindex){
            if(!tabindex && target.dataset && target.dataset.tabindex)
                tabindex = target.dataset.tabindex;
            target = target.parentElement;
        }
        if(tabindex){
            helper.setCurrentTab(component, Number(tabindex));
        }
    }
})
