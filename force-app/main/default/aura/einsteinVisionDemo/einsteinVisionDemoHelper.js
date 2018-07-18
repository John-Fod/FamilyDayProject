({
    initializeData : function(component) {
        var action = component.get('c.initializeData');
        action.setCallback(this, function(response){
            var returnObject = JSON.parse(response.getReturnValue());
            console.log('returnObject : ', returnObject);
            component.set('v.userId', returnObject.userId);
            component.set('v.datasets', returnObject.einsteinDatasets);
            console.log("v.datasets : ", component.get('v.datasets'));
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
        var imageCanvas = component.find("imageCanvas");
        var ctx = imageCanvas.getElement().getContext('2d');
        var img = new Image();
        img.src = "data:image/jpg;base64," + component.get('v.imageInfo.versionData');
        img.onload = function(){
            ctx.drawImage(img,0,0);
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
        });
        $A.enqueueAction(action);
    }
})
