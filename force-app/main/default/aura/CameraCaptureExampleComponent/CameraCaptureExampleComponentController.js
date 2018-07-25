({
    doInit : function(component) {
        var vfOrigin = "https://" + component.get("v.vfHost");
        window.addEventListener("message", function(event) {
            if (event.origin !== vfOrigin) {
                // Not the expected origin: Reject the message!
                return;
            }
            // imageData属性にセットした上で、デバッグのためにConsoleにも出力
            component.set("v.imageData", event.data);
            console.log('eventData : ', event.data);
        }, false);
    }

})