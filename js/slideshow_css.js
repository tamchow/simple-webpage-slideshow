function updateAnimate(slideshowIndex, currentImage, newImage, newFromRight, slideOutDistances, duration, scale) {
    const currentImageAnimateProperties = {
        left: newFromRight ? slideOutDistances[1] : slideOutDistances[0]
    };
    currentImage
        .stop()
        .removeClass("curr")
        .animate(currentImageAnimateProperties, {
            duration: duration,
            complete: function() {
                currentImage
                    .css({
                        left: 0
                    });
            }
        });
    const newImageAnimateProperties = {
        left: 0
    };
    newImage
        .css({
            left: newFromRight ? slideOutDistances[0] : slideOutDistances[1]
        })
        .stop()
        .addClass("curr")
        .animate(newImageAnimateProperties, {
            duration: duration,
            complete: function() {
                isAnimating[slideshowIndex] = false;
            }
        });

}