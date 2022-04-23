function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function disableSelect(event) {
    event.preventDefault();
}

function initalizeResizers() {
    const resizers = document.querySelectorAll(".resizer");
    let dragged = null;

    for (const resizer of resizers) {
        resizer.addEventListener("mousedown", () => {
            dragged = resizer;

            let prev = resizer.previousElementSibling;
            let next = resizer.nextElementSibling;

            prev.style.overflow = "hidden";
            next.style.overflow = "hidden";

            window.addEventListener("selectstart", disableSelect);
        });
    }

    document.addEventListener("mousemove", (event) => {
        if (dragged == null) {
            return false;
        }

        let resizer = dragged;

        let prev = resizer.previousElementSibling;
        let next = resizer.nextElementSibling;

        if (resizer.classList.contains("resize-v")) {
            let parentWidth = resizer.parentElement.getBoundingClientRect().width;

            let totalWidth = prev.getBoundingClientRect().width + next.getBoundingClientRect().width;
            let leftWidth = clamp(event.clientX - prev.getBoundingClientRect().x, 0, totalWidth);
            let rightWidth = totalWidth - leftWidth;

            prev.style.width = `calc(${leftWidth / parentWidth * 100}%)`;
            next.style.width = `calc(${rightWidth / parentWidth * 100}%)`;


        } else if (resizer.classList.contains("resize-h")) {
            let parentHeight = resizer.parentElement.getBoundingClientRect().height;
            let totalHeight = prev.getBoundingClientRect().height + next.getBoundingClientRect().height;
            let upperHeight = clamp(event.clientY - prev.getBoundingClientRect().y, 0, totalHeight);
            let lowerHeight = totalHeight - upperHeight;

            prev.style.height = `calc(${upper / parentHeight * 100}%)`;
            next.style.height = `calc(${lowerHeight / parentHeight * 100}%)`;
        }


    });

    document.addEventListener("mouseup", () => {
        dragged = null;
        window.removeEventListener("selectstart", disableSelect);
    });
}


document.addEventListener("DOMContentLoaded", initalizeResizers);
