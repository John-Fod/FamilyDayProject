({
    scalingFactor:null,
    initializeData : function(component) {
        var action = component.get('c.initializeData');
        action.setCallback(this, function(response){
            var returnObject = JSON.parse(response.getReturnValue());
            component.set('v.userId', returnObject.userId);
            component.set('v.datasets', returnObject.einsteinDatasets);
        });
        $A.enqueueAction(action);
    },
    getImageInfo: function(component, imageId){
        var self = this;
        var action = component.get('c.getImageInfo');
        action.setParam("imageContentDocumentId", imageId);
        action.setCallback(this, function(response){
            component.set("v.imageInfo", response.getReturnValue());
            var selectedDatasetIndex = component.get('v.selectedDatasetIndex');
            if(selectedDatasetIndex){
                var imageModelId = component.get('v.datasets[' + selectedDatasetIndex + '].Image_Models__r.records[0].ModelId__c');
                var imageContentVersionId = response.getReturnValue().contentVersionId;
                self.callEinsteinAPI(component, imageContentVersionId, imageModelId, selectedDatasetIndex);
            }
        });
        $A.enqueueAction(action);
    },
    drawNewImage: function(component){
        var self = this;
        var imageCanvas = component.find("imageCanvas");
        var ctx = imageCanvas.getElement().getContext('2d');
        var img = new Image();
        img.src = "data:image/jpg;base64," + component.get('v.imageInfo.versionData');
        img.onload = function(){
            var scalingFactor = self.resizeCanvas(component, ctx, img);
            ctx.drawImage(img, 0, 0, img.width * scalingFactor, img.height * scalingFactor);
        }
    },
    callEinsteinAPI: function(component, contentVersionId, imageModelId, datasetIndex){
        if(!component.get('v.imageInfo')) return;
        var action = component.get('c.callEinsteinAPI');
        action.setParams({
            "imageModelId": imageModelId,
            "contentVersionId": contentVersionId
        });
        action.setCallback(this, function(response){
            console.log("response : ", response.getReturnValue());
            var einsteinResponse = response.getReturnValue();
            einsteinResponse.forEach(function(curLabel){
                curLabel.percent = Math.floor(curLabel.probability * 10000) / 100;
            })
            component.set('v.einsteinResponse', einsteinResponse);
            component.set('v.datasets[' + datasetIndex + '].einsteinResults', einsteinResponse);
            component.set('v.isLoading', false);
        });
        component.set('v.isLoading', true);
        action.setStorable();
        $A.enqueueAction(action);
    },
    /* Resize Canvas
    DESC: Resize the canvas and save the results in the helper.scalingFactor attribute */
    resizeCanvas: function(component, ctx, img){
        var self = this;
        var horizontalScalingFactor = ctx.canvas.parentElement.offsetWidth / img.width;
        var verticalScalingFactor = ctx.canvas.parentElement.offsetHeight / img.height;
        var scalingFactor = Math.max(horizontalScalingFactor, verticalScalingFactor);
        ctx.canvas.width = img.width * scalingFactor;
        ctx.canvas.height = img.height * scalingFactor;
        return scalingFactor;
    },
    setCurrentTab: function(component, tabIndex){
        var self = this;
        var tabs = component.find("tab");
        var tabsContents = component.find("tabsContent");
        tabs.forEach(function(curTab, curTabIndex){
            if(curTabIndex != tabIndex){
                $A.util.removeClass(curTab, "slds-is-active");
                curTab.getElement().setAttribute('arai-selected', 'false');
                curTab.getElement().tabIndex = -1;
            } else {
                $A.util.addClass(curTab, "slds-is-active");
                curTab.getElement().setAttribute('arai-selected', 'false');
                curTab.getElement().tabIndex = 0;
            }
        })

        tabsContents.forEach(function(curTabsContent, curTabsContentIndex){
            if(curTabsContentIndex != tabIndex){
                $A.util.removeClass(curTabsContent, "slds-show");
                $A.util.addClass(curTabsContent, "slds-hide");
            } else {
                $A.util.removeClass(curTabsContent, "slds-hide");
                $A.util.addClass(curTabsContent, "slds-show");
            }
        })
        component.set('v.selectedDatasetIndex', tabIndex);
    }
})
