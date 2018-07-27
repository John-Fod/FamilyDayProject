({
    doInit : function(component, event, helper) {
        var vfOrigin = "https://" + component.get("v.vfHost");
        window.addEventListener("message", function(event) {
            if (event.origin !== vfOrigin) {
                // Not the expected origin: Reject the message!
                return;
            }
            // imageData属性にセットした上で、デバッグのためにConsoleにも出力
            component.set("v.imageData", event.data);
            helper.resizeFrame(component);
        }, false);
    },
    doRender : function(component, event, helper){
        helper.resizeFrame(component);
        /*
        var vfFrame = component.find("vfFrame").getElement();
        var vfParent = vfFrame.parentElement;
        vfParent.height = vfFrame.scrollHeight;
        vfFrame.width = vfFrame.parentElement.offsetWidth;
        vfFrame.height = vfFrame.scrollHeight;
        */
        /*
        var horizontalScalingFactor = ctx.canvas.parentElement.offsetWidth / img.width;
        var verticalScalingFactor = ctx.canvas.parentElement.offsetHeight / img.height;
        var scalingFactor = Math.max(horizontalScalingFactor, verticalScalingFactor);
        ctx.canvas.width = img.width * scalingFactor;
        ctx.canvas.height = img.height * scalingFactor;
        */
    },
    onFrameLoaded : function(component, event, helper){
        helper.resizeFrame(component);
        /*
        var vfFrame = component.find("vfFrame").getElement();
        if(vfFrame){
            vfFrame.height = "";
            vfFrame.height = vfFrame.contentWindow.document.body.scrollHeight + "px";
        }
        */
    }

})