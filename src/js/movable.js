/**
 * --------------------------------------
 * 1.no movable
 * 2.vertical movable
 * 3.horizontal movable
 * 4.vertical & horizontal movable
 * --------------------------------------
 *
 * [image movable]
 * @param  {[Object]} image   [the image element]
 * @param  {[Object]} stage   [the stage element]
 */

var movable = function (image, stage) {

    var self = this;

    var isDragging = false;

    var startX = 0,
        startY = 0,

        left = 0,
        top = 0,

        widthDiff = 0,
        heightDiff = 0,

        δ = 0;

    var dragStart = function (e) {

        var e = e || window.event;

        e.preventDefault();

        var imageWidth = $(image).width(),
            imageHeight = $(image).height(),
            stageWidth = $(stage).width(),
            stageHeight = $(stage).height();

        startX = e.clientX;
        startY = e.clientY;

        // δ is the difference between image width and height
        δ = !self.isRotated ? 0 : (imageWidth - imageHeight) / 2;

        // Width or height difference can be use to limit image right or top position
        widthDiff = !self.isRotated ? (imageWidth - stageWidth) : (imageHeight - stageWidth);
        heightDiff = !self.isRotated ? (imageHeight - stageHeight) : (imageWidth - stageHeight);

        // Modal can be dragging if image is smaller to stage
        isDragging = (widthDiff > 0 || heightDiff > 0) ? true : false;
        isMoving = (widthDiff > 0 || heightDiff > 0) ? true : false;

        // Reclac the element position when mousedown
        // Fixed the issue of stage with a border
        left = $(image).position().left - δ;
        top = $(image).position().top + δ;

    }

    var dragMove = function (e) {

        var e = e || window.event;

        e.preventDefault();

        if (isDragging) {

            var endX = e.clientX,
                endY = e.clientY,

                relativeX = endX - startX,
                relativeY = endY - startY,

                newLeft = relativeX + left,
                newTop = relativeY + top;

            // vertical limit
            if (heightDiff > 0) {

                if ((relativeY + top) > δ) {
                    newTop = δ;
                } else if ((relativeY + top) < -heightDiff + δ) {
                    newTop = -heightDiff + δ;
                }

            } else {
                newTop = top;
            }
            // horizontal limit
            if (widthDiff > 0) {

                if ((relativeX + left) > -δ) {
                    newLeft = -δ;
                } else if ((relativeX + left) < -widthDiff - δ) {
                    newLeft = -widthDiff - δ;
                }

            } else {
                newLeft = left;
            }

            $(image).css({
                left: newLeft + 'px',
                top: newTop + 'px'
            });

            // Update image initial data
            $.extend(self.imageData, {
                left: newLeft,
                top: newTop
            });

        }

        // return false;

    }

    var dragEnd = function (e) {

        isDragging = false;
        isMoving = false;

    }

    $(stage).on('mousedown.magnify', dragStart);

    $D.on('mousemove.magnify', dragMove);

    $D.on('mouseup.magnify', dragEnd);
}

// Add to Magnify Prototype
$.extend(Magnify.prototype, {
    movable: movable
});
