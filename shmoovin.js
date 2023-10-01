document.addEventListener("DOMContentLoaded", function () {
    const track = document.getElementById("image-track");
    let nextPercentage = 0;
    let sharedPercentage = 0;    // store this percentage value for consistency

    let isMouseDown = false;

    window.onmousedown = e => {
        isMouseDown = true;
        track.dataset.mouseDownAt = e.clientX;
    }

    window.onmouseup = () => {
        isMouseDown = false;
        track.dataset.mouseDownAt = "0";
        track.dataset.prevPercentage = track.dataset.percentage;
        sharedPercentage = nextPercentage;    // update shared percentage when mouse drag ends
    }

    window.onmousemove = e => {
        if (!isMouseDown) return;
        let mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX; 
            const maxDelta = window.innerWidth / 2;

        let percentage = (mouseDelta / maxDelta) * -100;    /* multiply by -100 instead of 100 to scroll the right way */
        if (isNaN(percentage)) {
            return;    // avoid NaN values
        }
            nextPercentage = parseFloat(track.dataset.prevPercentage) + percentage;

        Math.min(nextPercentage, 0);    /* set minimum and maximum of page scrolling */
        Math.max(nextPercentage, -100);

        track.dataset.percentage = nextPercentage;

        // use animate property instead of updating the CSS directly
        // set duration and fill to 'forward' so the animation stays consistent and does not reset to default
        track.animate({
            transform: `translate(${nextPercentage}%, -50%)`
        }, { duration: 1200, fill: "forwards" });

        for (const image of track.getElementsByClassName("image")) {
            // image.style.objectPosition = `${nextPercent + 100} 50%`;    /* add 100 to horizontal orientation to emulate -100 to 0 and 0 to 100 */
            image.animate({
                objectPosition: `${100 + nextPercentage}% center`
            }, { duration: 1200, fill: "forwards" });
        }
    }

    // Add an event listener for more intuitive scrolling
    window.addEventListener("wheel", e => {
        const scrollAmount = e.deltaY;
        // Adjust scroll direction and percentage
        if (scrollAmount > 0) {    // scroll percentages are inverted (negative and positive are flipped)
            sharedPercentage += 1;    // scrolling down moves to right
        } else {
            sharedPercentage -= 1;    // scrolling up moves to left
        }
        Math.min(0, Math.max(-100, sharedPercentage));
        track.dataset.percentage = sharedPercentage;
        track.animate({    // update CSS within animation
            transform: `translate(${sharedPercentage}%, -50%)`
        }, { duration: 1200, fill: "forwards" });
        // same way of updating images as dragging mouse
        for (const image of track.getElementsByClassName("image")) {
            image.animate({
                objectPosition: `${100 + sharedPercentage}% center`
            }, { duration: 1200, fill: "forwards" });
        }
    });
});