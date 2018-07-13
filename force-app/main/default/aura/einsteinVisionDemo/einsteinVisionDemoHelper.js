({
    initializeData : function(component) {
        var action = component.get('c.initializeData');
        action.setCallback(this, function(response){
            var returnObject = JSON.parse(response.getReturnValue());
            console.log('returnObject : ', returnObject);
            component.set('v.userId', returnObject.userId);
        });
        $A.enqueueAction(action);
    },
    getImageInfo: function(component, imageId){
        var action = component.get('c.getImageInfo');
        action.setParam("imageContentDocumentId", imageId);
        action.setCallback(this, function(response){
            console.log('getReturnValue : ', response.getReturnValue());
            console.log(response.getReturnValue().versionData);
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
    callEinsteinAPI: function(component, imageModelId){
        var action = component.get('c.callEinsteinAPI');
        action.setParams({
            "imageModelId": imageModelId,
            "versionData": component.get('v.imageInfo.versionData')
        });
        action.setCallback(this, function(response){
            console.log("response : ", response.getReturnValue());
        });
        $A.enqueueAction(action);
    }
})
