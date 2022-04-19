let verticalResizers = document.querySelectorAll(".resize-v");
let dragged = null;



for (resizer of verticalResizers) {
    resizer.addEventListener("mousedown", (event) => {
        dragged = resizer;

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

    let totalWidth = prev.getBoundingClientRect().width + next.getBoundingClientRect().width;
    let leftWidth = clamp(event.clientX - this.prev.getBoundingClientRect().x, 0, totalWidth);
    let rightWidth = totalWidth - leftWidth;

    // 2px for resizer
    prev.style.width = leftWidth - 1;
    next.style.width = rightWidth - 1;

});

document.addEventListener("mouseup", () => {
    dragged = null;
    window.removeEventListener("selectstart", disableSelect);
});


function disableSelect(event) {
    event.preventDefault();
}

function initalizeResize(resizer) {
    let prev = resizer.previousElementSibling;
    let next = resizer.nextElementSibling;

    resizer.addEventListener("mousedown", (event) => {
        resizer.dragging = true;

        window.addEventListener("selectstart", disableSelect);
    });

    document.addEventListener("mousemove", (event) => {
        if (!this.dragging) {
            return false;
        }

        if (this.config.type == "vertical") {
            let totalWidth = this.wrapper.getBoundingClientRect().width;

            let leftWidth = event.clientX - this.prev.getBoundingClientRect().x;
            let rightWidth = totalWidth - leftWidth;

            this.prev.style.width = Math.max(0, leftWidth) + "px";
            this.prev.style.flexGrow = 0;

            this.next.style.width = Math.max(0, rightWidth) + "px";
            this.next.style.flexGrow = 0;
        } else if (this.config.type == "horizontal") {
            let totalHeight = this.wrapper.getBoundingClientRect().height;

            let upperHeight = event.clientY - this.prev.getBoundingClientRect().y;
            let lowerHeight = totalHeight - upperHeight;

            this.prev.style.height = Math.max(0, upperHeight) + "px";
            this.prev.style.flexGrow = 0;

            this.next.style.height = Math.max(0, lowerHeight) + "px";
            this.next.style.flexGrow = 0;
        }
    });

    document.addEventListener("mouseup", () => {
        this.dragging = false;
        window.removeEventListener("selectstart", disableSelect);
    });
}

/**
 * 
 * 
 * 
 */

class ResizeJS {
    config = {
        type: "vertical",
    };

    constructor(selector, config = {}) {
        this.config = Object.assign({}, this.config, config);
        this.wrapper = document.querySelector(selector);

        this.resizer = this.wrapper.querySelector(".resizer");

        if (this.config.type == "vertical") {
            this.resizer.classList.add("resizer-v");
        } else if (this.config.type == "horizontal") {
            this.resizer.classList.add("resizer-h");
        }

        this.prev = this.resizer.previousElementSibling;
        this.next = this.resizer.nextElementSibling;

        // this.prev.style.overflow = "hidden";
        // this.next.style.overflow = "hidden";

        this.dragging = false;

        this.resizer.addEventListener("mousedown", (event) => {
            this.dragging = true;

            window.addEventListener("selectstart", disableSelect);
        });

        document.addEventListener("mousemove", (event) => {
            if (!this.dragging) {
                return false;
            }

            if (this.config.type == "vertical") {
                let totalWidth = this.wrapper.getBoundingClientRect().width;

                let leftWidth = event.clientX - this.prev.getBoundingClientRect().x;
                let rightWidth = totalWidth - leftWidth;

                this.prev.style.width = Math.max(0, leftWidth) + "px";
                this.prev.style.flexGrow = 0;

                this.next.style.width = Math.max(0, rightWidth) + "px";
                this.next.style.flexGrow = 0;
            } else if (this.config.type == "horizontal") {
                let totalHeight = this.wrapper.getBoundingClientRect().height;

                let upperHeight = event.clientY - this.prev.getBoundingClientRect().y;
                let lowerHeight = totalHeight - upperHeight;

                this.prev.style.height = Math.max(0, upperHeight) + "px";
                this.prev.style.flexGrow = 0;

                this.next.style.height = Math.max(0, lowerHeight) + "px";
                this.next.style.flexGrow = 0;
            }
        });

        document.addEventListener("mouseup", () => {
            this.dragging = false;
            window.removeEventListener("selectstart", disableSelect);
        });
    }
}