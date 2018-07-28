({
    resizeFrame : function(component) {
        var vfFrameComponent = component.find("vfFrame");
        if(!vfFrameComponent) return;
        var vfFrame = vfFrameComponent.getElement();
        vfFrame.width = vfFrame.parentElement.offsetWidth;
        vfFrame.height = vfFrame.width * 0.8;
    }
})
