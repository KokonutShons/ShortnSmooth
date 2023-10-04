document.addEventListener("DOMContentLoaded", function () {
    const track = document.getElementById("image-track");
    let nextPercentage = 0;
    let sharedPercentage = 0;    // store this percentage value for consistency

    let isMouseDown = false;

    window.onmousedown = e => {
        isMouseDown = true;
        track.dataset.mouseDownAt = e.clientX;
        sharedPercentage = nextPercentage;    // update shared percentage for dragging and wheel
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
        if (isNaN(nextPercentage)) {
            return;
        }
        nextPercentage = parseFloat(track.dataset.prevPercentage) + percentage;

        nextPercentage = Math.min(nextPercentage, 0);    /* set minimum and maximum of page scrolling */
        nextPercentage = Math.max(nextPercentage, -100);

        sharedPercentage = nextPercentage;    // upadte shared percentage for consistency

        track.dataset.percentage = nextPercentage;

        // use animate property instead of updating the CSS directly
        // set duration and fill to 'forward' so the animation stays consistent and does not reset to default
        track.animate({
            transform: `translate(${nextPercentage}%, -50%)`
        }, { duration: 3600, fill: "forwards" });

        for (const image of track.getElementsByClassName("image")) {
            // image.style.objectPosition = `${nextPercent + 100} 50%`;    /* add 100 to horizontal orientation to emulate -100 to 0 and 0 to 100 */
            if (isNaN(nextPercentage)) {
                return;
            }
            image.animate({
                objectPosition: `${100 + nextPercentage}% center`
            }, { duration: 3600, fill: "forwards" });
        }
    }
    
    // Image switching stuff
    const initialImageSources = [
        "images/colorful-sunset.jpg",
        "images/ambient-beach.jpg",
        "images/kourin.jpg",
        "images/overhang-waterfall.jpg",
        "images/light-city.jpg",
        "images/ancestral-plane.jpg",
        "images/purple-sky.jpg",
        "images/galaxies.jpg",
        "images/starry.jpg",
        "images/skypink.jpg",
    ];
    const alternativeImageSources = [
        "images/alt/winery.jpg",
        "images/alt/line.JPG",
        "images/alt/angel.jpg",
        "images/alt/kami-higher.jpg",
        "images/alt/megami.jpg",
        "images/alt/duality.JPEG",
        "images/alt/kauai.JPG",
    ];

    let isInitialImages = true;
    // Function to switch images
    function switchImages() {
        const imageTrack = document.getElementById("image-track");
        const currentImages = imageTrack.getElementsByClassName("image");
        
        // Remove all images in the track
        while (imageTrack.firstChild) {
            imageTrack.removeChild(imageTrack.firstChild);
        }
        
        if (isInitialImages) {
            // add alternative images to the track
            alternativeImageSources.forEach((source) => {
                const img = document.createElement("img");
                img.src = source;
                img.classList.add("image");
                img.draggable = false;
                imageTrack.appendChild(img);
            });
            
            isInitialImages = false;    // toggle flag
        } else {    // not initial images
            // Reload initial images
            initialImageSources.forEach((source) => {
                const img = document.createElement("img");
                img.src = source;
                img.classList.add("image");
                img.draggable = false;
                imageTrack.appendChild(img);
            });
            isInitialImages = true;
            
            // Reset shared scrolling percentage to 0
            sharedPercentage = 0;
            
            track.style.transition = "none";    // disable animation during transition
            track.style.transform = `translate(0%, -50%)`;
            setTimeout(() => {
                track.style.transition = "";    // re-enable the animation after transition
            }, 0);
        }
    }

    const moobIcon = document.getElementById("moon");

    moobIcon.addEventListener("click", () => {
        console.log("Moon icon clicked");
        switchImages();    // call function to switch images
    });
});