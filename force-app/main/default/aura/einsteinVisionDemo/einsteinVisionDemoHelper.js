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
        var action = component.get('c.getImageInfo');
        action.setParam("imageContentDocumentId", imageId);
        action.setCallback(this, function(response){
            component.set("v.imageInfo", response.getReturnValue());
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
    callEinsteinAPI: function(component, contentVersionId, imageModelId){
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
            component.set('v.isLoading', false);
        });
        component.set('v.isLoading', true);
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
    }
})
