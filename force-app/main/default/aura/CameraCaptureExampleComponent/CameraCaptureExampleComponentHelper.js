({
    resizeFrame : function(component) {
        var vfFrame = component.find("vfFrame").getElement();
        vfFrame.width = vfFrame.parentElement.offsetWidth;
        vfFrame.height = vfFrame.width * 0.75;
    }
})
