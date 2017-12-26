"use strict";
const slideshows = $(".slideshow");
const slideshowIndicators = $(".slideshow-indicator");
const slideshowContainers = $(".slideshow-container");

var advanceDuration_ms = 5000;
var animationParameters = {
    animationDuration_ms: 600,
    animationSizeScale: 0.4,
    animationSlideOutDistanceRatio: 0.2
}

var isAnimating = (new Array(slideshows.length)).fill(false);

function getCurrentImageInSlideshow(slideshow) {
    return slideshow
        .find("img.curr")
        .eq(0);
}

function getCurrentImage(slideshowIndex) {
    return getCurrentImageInSlideshow(slideshows
        .eq(slideshowIndex));
}

function getCurrentIndicator(slideshow) {
    return slideshow
        .next(".slideshow-indicator")
        .find("div.curr");
}

function getIndicator(currentImage) {
    const currentSlideshow = $(currentImage).parent();
    const indicators = currentSlideshow
        .next(".slideshow-indicator")
        .find("div");
    return indicators
        .eq(currentSlideshow
            .find("img")
            .index(currentImage));
}

function getImages(slideshowIndex) {
    return slideshows.eq(slideshowIndex).find("img");
}

function update(slideshowIndex, currentImage, newImage, newFromRight) {
    if (newFromRight === undefined) {
        newFromRight = true;
    }
    if (currentImage.is(newImage)) {
        return;
    }
    if (!isAnimating[slideshowIndex]) {
        isAnimating[slideshowIndex] = true;
        const slideOutRatio = Math.max(animationParameters.animationSlideOutDistanceRatio, 0);
        const slideOutDistances = [
            (100 * (1 - slideOutRatio)) + '%',
            (-100 * slideOutRatio) + '%'
        ];
        const duration = Math.max(animationParameters.animationDuration_ms, 0);
        const scale = Math.max(animationParameters.animationSizeScale, 0);
        getIndicator(currentImage)
            .add(getCurrentIndicator(slideshows.eq(slideshowIndex)))
            .removeClass("curr");
        getIndicator(newImage).addClass("curr");
        updateAnimate(slideshowIndex, currentImage, newImage, newFromRight, slideOutDistances, duration, scale);
    }
}

function updateAnimate(slideshowIndex, currentImage, newImage, newFromRight, slideOutDistances, duration, scale) {
    const currentImageDimensions = [currentImage.width(), currentImage.height()];
    const currentImageAnimateProperties = {
        left: newFromRight ? slideOutDistances[1] : slideOutDistances[0],
        opacity: 0,
        width: scale * currentImageDimensions[0],
        height: scale * currentImageDimensions[1]
    };
    currentImage
        .stop()
        .removeClass("curr")
        .animate(currentImageAnimateProperties, {
            duration: duration,
            complete: function() {
                currentImage
                    .css("left", "0%")
                    .width(currentImageDimensions[0])
                    .height(currentImageDimensions[1]);
            }
        });
    const newImageDimensions = [newImage.width(), newImage.height()];
    const newImageAnimateProperties = {
        left: 0,
        opacity: 1,
        width: newImageDimensions[0],
        height: newImageDimensions[1]
    };
    newImage
        .css("opacity", "0")
        .css("left", newFromRight ? slideOutDistances[0] : slideOutDistances[1])
        .width(scale * newImageDimensions[0])
        .height(scale * newImageDimensions[1])
        .stop()
        .addClass("curr")
        .animate(newImageAnimateProperties, {
            duration: duration,
            complete: function() {
                isAnimating[slideshowIndex] = false;
            }
        });
}

function previous(slideshowIndex) {
    const currentImage = getCurrentImage(slideshowIndex);
    const newImage = currentImage.prev("img");
    if (newImage.length === 0) {
        goToEnd(slideshowIndex, false);
    } else {
        update(
            slideshowIndex,
            currentImage,
            newImage,
            false);
    }
}

function next(slideshowIndex) {
    const currentImage = getCurrentImage(slideshowIndex);
    const newImage = currentImage.next("img");
    if (newImage.length === 0) {
        goToStart(slideshowIndex, true);
    } else {
        update(
            slideshowIndex,
            currentImage,
            newImage,
            true);
    }
}

function goToEnd(slideshowIndex, newImageFromRight) {
    if (newImageFromRight === undefined) {
        newImageFromRight = true;
    }
    update(
        slideshowIndex,
        getCurrentImage(slideshowIndex),
        getImages(slideshowIndex).eq(-1),
        newImageFromRight);
}


function goToStart(slideshowIndex, newImageFromRight) {
    if (newImageFromRight === undefined) {
        newImageFromRight = false;
    }
    update(
        slideshowIndex,
        getCurrentImage(slideshowIndex),
        getImages(slideshowIndex).eq(0),
        newImageFromRight);

}

$(document).ready(function() {
    slideshowIndicators.each(function(index, element) {
        const slideshow = $(this).prev(".slideshow");
        const imagesInSlideshow = slideshow.find("img").length;
        $(this).html("<div />\n".repeat(imagesInSlideshow));
        $(this).css("margin-left", "calc(50% - " + ($(this).width() / 2) + "px)");
        const currentImage = getCurrentImageInSlideshow(slideshow);
        getIndicator(currentImage).addClass("curr");
    });
    if (advanceDuration_ms >= 0) {
        setInterval(function() {
            for (var i = 0; i < slideshows.length; ++i) {
                next(i);
            }
        }, advanceDuration_ms);
    }
});

slideshowIndicators.on("click", "div", function() {
    const slideshow = $(this).parent().prev(".slideshow");
    const slideshowIndex = slideshows.index(slideshow);
    const imageIndex = $(this).parent().find("div").index($(this));
    const nextImage = slideshow.find("img").eq(imageIndex);
    const currentImage = getCurrentImage(slideshowIndex);
    update(slideshowIndex, currentImage, nextImage);
});

slideshowContainers.each(function(index, element) {
    const previousButton = $(this).find("button.previous");
    previousButton.click(function() { previous(index) });
    previousButton.contextmenu(function() { goToStart(index) });
    const nextButton = $(this).find("button.next");
    nextButton.click(function() { next(index) });
    nextButton.contextmenu(function() { goToEnd(index) });
});