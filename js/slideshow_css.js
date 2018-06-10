function updateAnimate(slideshowIndex, currentImage, newImage, newFromRight, slideOutDistances, duration, scale) {
    const partDuration = Math.floor(duration / 2);
    if (newFromRight) {
        animateBackward(slideshowIndex, currentImage, newImage, partDuration);
    } else {
        animateForward(slideshowIndex, currentImage, newImage, partDuration);
    }
}

function animateForward(slideshowIndex, currentImage, newImage, partDuration) {
    const origWidth = currentImage.width();
    currentImage
        .stop()
        .css({
            width: origWidth
        })
        .animate({
            width: 0
        }, {
            duration: partDuration,
            complete: function () {
                currentImage
                    .removeClass("curr")
                    .width(origWidth);
            }
        });
    newImage
        .stop()
        .addClass("curr")
        .css({
            left: newImage.width()
        })
        .animate({
            left: 0
        }, {
            duration: partDuration,
            complete: function () {
                isAnimating[slideshowIndex] = false;
            }
        });
}

function animateBackward(slideshowIndex, currentImage, newImage, partDuration) {
    const currentOrigWidth = currentImage.width();
    currentImage
        .stop()
        .css({
            left: 0
        })
        .animate({
            left: currentOrigWidth
        }, {
            duration: partDuration,
            complete: function () {
                currentImage
                    .removeClass("curr");
            }
        });
    const newOrigWidth = newImage.width();
    newImage
        .stop()
        .addClass("curr")
        .css({
            width: 0
        })
        .animate({
            width: newOrigWidth
        }, {
            duration: partDuration,
            complete: function () {
                isAnimating[slideshowIndex] = false;
            }
        });
}