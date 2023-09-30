const track = document.getElementById("image-track");

window.onmousedown = e => {
    track.dataset.mouseDownAt = e.clientX;
}

window.onmouseup = () => {
    track.dataset.mouseDownAt = "0";
    track.dataset.prevPercentage = track.dataset.percent;
}

window.onmousemove = e => {
    const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX, 
          maxDelta = window.innerWidth / 2;

    const percent = (mouseDelta / maxDelta) * -100,    /* multiply by -100 instead of 100 to scroll the right way */
          nextPercent = parseFloat(track.dataset.prevPercentage) + percent;

    Math.min(nextPercent, 0);    /* set minimum and maximum of page scrolling */
    Math.max(nextPercent, -100);

    track.dataset.percent = nextPercent;

    // use animate property instead of updating the CSS directly
    // set duration and fill to 'forward' so the animation stays consistent and does not reset to default
    track.animate({
        transform: `translate(${nextPercent}%, -50%)`
    }, { duration: 1200, fill: "forwards" });

    for (const image of track.getElementsByClassName("image")) {
        // image.style.objectPosition = `${nextPercent + 100} 50%`;    /* add 100 to horizontal orientation to emulate -100 to 0 and 0 to 100 */
        image.animate({
            objectPosition: `${100 + nextPercentage}% center`
        }, { duration: 1200, fill: "forwards" });
    }
}