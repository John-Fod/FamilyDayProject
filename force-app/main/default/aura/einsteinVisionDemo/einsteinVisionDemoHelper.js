({
    elephant:null,
    lion:null,
    bear:null,
    giraffe:null,
    tiger:null,
    dog:null,
    cat:null,
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
    drawCameraImage: function(component){
        var self = this;
        var imageCanvas = component.find("imageCanvas");
        var ctx = imageCanvas.getElement().getContext('2d');
        var img = new Image();
        img.src = component.get('v.imageData');
        img.onload = function(){
            var scalingFactor = self.resizeCanvas(component, ctx, img);
            ctx.drawImage(img, 0, 0, img.width * scalingFactor, img.height * scalingFactor);
        }
    },
    drawSelectedRectangle: function(component, updateCroppedCanvas){
        var self = this;
        var imageCanvas = component.find('imageCanvas');
        var ctx = imageCanvas.getElement().getContext('2d');
        var img = new Image();
        img.src = component.get("v.imageData");
        img.onload = function(){
            var dE = component.get('v.dragEvent');
            var lineWidth = 2;
            var sF = self.resizeCanvas(component, ctx, img);
            ctx.drawImage(img, 0, 0, img.width * sF, img.height * sF);
            ctx.strokeStyle = 'rgba(255,0,0,0.6)';
            ctx.lineWidth = lineWidth;
            var rect = {};
            rect.x = dE.startX;
            rect.y = dE.startY;
            rect.width = (dE.endX - dE.startX);
            rect.height = (dE.endY- dE.startY);

            var minDimension = 2;
            if(Math.abs(rect.width) > minDimension && Math.abs(rect.height) > minDimension){
                if(updateCroppedCanvas){
                    self.updateCroppedCanvas(component, ctx, rect);
                }
                ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
            }
        }
    },
    updateCroppedCanvas: function(component, ctx, rect){
        var imageData = ctx.getImageData(rect.x, rect.y, rect.width, rect.height);
        var croppedCanvas = component.find("croppedCanvas").getElement();
        croppedCanvas.width = imageData.width;
        croppedCanvas.height = imageData.height;
        var croppedCtx = croppedCanvas.getContext("2d")
        croppedCtx.putImageData(imageData,0,0);
        var imageData64 = croppedCanvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/,'');
        component.set('v.croppedImageData64', imageData64);
    },
    callEinsteinAPI: function(component, contentVersionId, imageModelId, datasetIndex){
        var self = this;
        if(!component.get('v.imageInfo') && !component.get("v.imageData")) return;
        var action = component.get('c.callEinsteinAPI');
        var imageData64;
        if(component.find("croppedCanvas") && component.find("croppedCanvas").getElement().height > 0){
            imageData64 = component.find("croppedCanvas").getElement().toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/,'');
        } else {
            imageData64 = component.find("imageCanvas").getElement().toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/,'');
        }
        action.setParams({
            "imageModelId": imageModelId,
            "contentVersionId": contentVersionId,
            "imageData64":imageData64
        });
        action.setCallback(this, function(response){
            console.log("response : ", response.getReturnValue());
            var einsteinResponse = response.getReturnValue();
            var resultAnimations = [];
            self.generateResultAnimations(component, einsteinResponse, function(resultAnimations){
                component.set("v.resultAnimations", resultAnimations);
                component.set("v.bouncing", true);
                var interval = window.setInterval(
                    $A.getCallback(function(){
                        self.updateResultAnimations(component);
                    }), 50
                );
                component.set("v.animationIntervalId", interval);
            });
            window.setTimeout(
                $A.getCallback(function(){
                    component.set("v.bouncing", false);
                }), 3000
            );
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
    getScalingFactor: function(component, ctx, img){
        var self = this;
        var horizontalScalingFactor = ctx.canvas.parentElement.offsetWidth / img.width;
        var verticalScalingFactor = ctx.canvas.parentElement.offsetHeight / img.height;
        var scalingFactor = Math.max(horizontalScalingFactor, verticalScalingFactor);
        return scalingFactor;
    },
    // setCurrentTab: function(component, tabIndex){
    //     var self = this;
    //     var tabs = component.find("tab");
    //     var tabsContents = component.find("tabsContent");
    //     if(Array.isArray(tabs)){
    //         tabs.forEach(function(curTab, curTabIndex){
    //             if(curTabIndex != tabIndex){
    //                 $A.util.removeClass(curTab, "slds-is-active");
    //                 curTab.getElement().setAttribute('arai-selected', 'false');
    //                 curTab.getElement().tabIndex = -1;
    //             } else {
    //                 $A.util.addClass(curTab, "slds-is-active");
    //                 curTab.getElement().setAttribute('arai-selected', 'false');
    //                 curTab.getElement().tabIndex = 0;
    //             }
    //         })
    //     } else {
    //         $A.util.removeClass(tabs, "slds-is-active");
    //         tabs.getElement().setAttribute('arai-selected', 'false');
    //         tabs.getElement().tabIndex = -1;
    //     }

    //     if(Array.isArray(tabsContents)){
    //         tabsContents.forEach(function(curTabsContent, curTabsContentIndex){
    //             if(curTabsContentIndex != tabIndex){
    //                 $A.util.removeClass(curTabsContent, "slds-show");
    //                 $A.util.addClass(curTabsContent, "slds-hide");
    //             } else {
    //                 $A.util.removeClass(curTabsContent, "slds-hide");
    //                 $A.util.addClass(curTabsContent, "slds-show");
    //             }
    //         })
    //     } else {
    //         $A.util.removeClass(tabsContents, "slds-hide");
    //         $A.util.addClass(tabsContents, "slds-show");
    //     }
    //     component.set('v.selectedDatasetIndex', tabIndex);
    // },
    generateResultAnimations: function(component, einsteinResults, callback){
        var self = this;
        var resultAnimations = [];
        if(!component.find('imageCanvas')) return;
        var canvas = component.find("imageCanvas").getElement();
        einsteinResults.forEach(function(curEinsteinResult, curEinsteinResultIndex){
            resultAnimations.push(self.generateResultAnimation(component, curEinsteinResult, curEinsteinResultIndex, canvas));
        });
        callback(resultAnimations);
    },
    generateResultAnimation: function(component, result, rank, canvas){
        var self = this;
        var maxXVelocity = 25;
        var maxYVelocity = 25;
        var minXVelocity = 10;
        var minYVelocity = 10;
        var yStartPosition = -40;
        var negativeXVelocity = Math.random() < 0.5 ? -1 : 1;
        var negativeYVelocity = Math.random() < 0.5 ? -1 : 1;
        var image = null;
        if($A.get("$Resource." + result.label)){
            var image = new Image();
            image.src = $A.get("$Resource." + result.label);
        }
        var resultAnimation = {
            "label":result.label,
            "probability":result.probability,
            "rank":rank,
            "x":Math.random() * canvas.offsetWidth,
            "y":Math.random() * canvas.offsetHeight,
            "xVelocity": Math.random() * (maxXVelocity - minXVelocity) + minXVelocity,
            "yVelocity": Math.random() * (maxYVelocity - minYVelocity) + minYVelocity,
            "image":image
        }
        return resultAnimation;
    },
    updateResultAnimations: function(component){
        var self = this;
        var resultAnimations = component.get("v.resultAnimations");
        var gravity = component.get("v.gravity");
        var canvasComponent = component.find("imageCanvas");
        resultAnimations.forEach(function(curResultAnimation){
            self.updateResultAnimation(component, curResultAnimation, canvasComponent.getElement());
        });
        var img = new Image();
        img.src = component.get("v.imageData");;
        img.onload = function(){
            var imageCanvas = component.find("imageCanvas");
            if(!imageCanvas) return;
            var ctx = imageCanvas.getElement().getContext('2d');
            var scalingFactor = self.resizeCanvas(component, ctx, img);
            ctx.drawImage(img, 0, 0, img.width * scalingFactor, img.height * scalingFactor);
            self.renderResultAnimations(component, resultAnimations);
            component.set("v.resultAnimations", resultAnimations);
        }
    },
    updateResultAnimation: function(component, resultAnimation, canvas){
        //Get the width of what is being rendered
        var renderedWidth = null;
        var renderedHeight = null;
        if(resultAnimation.image == null || resultAnimation.image.src == null){
            var ctx = canvas.getContext("2d");
            var textMeasure = ctx.measureText(resultAnimation.label);
            renderedWidth = textMeasure.width;
            //renderedHeight = textMeasure.emHeightAscent + textMeasure.emHeightDescent;
            renderedHeight = 30;
        } else {
            if(resultAnimation.image.complete){
                renderedWidth = resultAnimation.image.width;
                renderedHeight = resultAnimation.image.height;
            }
        }
        if(component.get("v.bouncing")){
            if((resultAnimation.x + renderedWidth >= canvas.width && resultAnimation.xVelocity > 0) || (resultAnimation.x < 0 && resultAnimation.xVelocity < 0)){
                resultAnimation.xVelocity = resultAnimation.xVelocity * -1;
            }
            if((resultAnimation.y + renderedHeight >= canvas.height && resultAnimation.yVelocity > 0) || (resultAnimation.y < 0 && resultAnimation.yVelocity < 0)){
                resultAnimation.yVelocity = resultAnimation.yVelocity * -1;
            }
        } else if(resultAnimation.rank <= 3){
            var targetX = 40;
            var targetY = 200 * resultAnimation.rank + 20;
            var xDistance = targetX - resultAnimation.x;
            var yDistance = targetY - resultAnimation.y;
            var maxSpeed = 40;
            var innerBox = 10;
            var speedMultiplier = 0.08;
            var innerBoxSpeedMultiplier = 0.2
            if(Math.abs(xDistance) < innerBox){
                resultAnimation.xVelocity = innerBoxSpeedMultiplier * xDistance;
            } else {
                if(resultAnimation.x < targetX){
                    resultAnimation.xVelocity = Math.min(maxSpeed, resultAnimation.xVelocity + speedMultiplier * xDistance);
                } else {
                    resultAnimation.xVelocity = Math.max(maxSpeed * -1, resultAnimation.xVelocity + speedMultiplier * xDistance);
                }
            }
            if(Math.abs(yDistance) < innerBox){
                resultAnimation.yVelocity = innerBoxSpeedMultiplier * yDistance;
            } else {
                if(resultAnimation.y < targetY){
                    resultAnimation.yVelocity = Math.min(maxSpeed, resultAnimation.yVelocity + speedMultiplier * yDistance);
                } else {
                    resultAnimation.yVelocity = Math.max(maxSpeed * -1, resultAnimation.yVelocity + speedMultiplier * yDistance);
                }
            }
        }
        resultAnimation.y = resultAnimation.y + resultAnimation.yVelocity;
        resultAnimation.x = resultAnimation.x + resultAnimation.xVelocity;
    },
    renderResultAnimations: function(component, resultAnimations){
        var self = this;
        var imageCanvas = component.find("imageCanvas");
        var ctx = imageCanvas.getElement().getContext('2d');
        for(var i = 0; i < resultAnimations.length; i++){
            if(!resultAnimations[i].image){
                ctx.font = "30px Arial";
                ctx.fillText(resultAnimations[i].label, resultAnimations[i].x, resultAnimations[i].y);
            } else {
                if(resultAnimations[i].image.complete){
                    ctx.drawImage(resultAnimations[i].image,resultAnimations[i].x,resultAnimations[i].y);
                }
            }
        }
    },
    renderResultAnimation: function(component, resultAnimation){
    },
    stopAnimation: function(component){
        if(component.get("v.animationIntervalId")){
            clearInterval(component.get("v.animationIntervalId"));
        }
    }
})
