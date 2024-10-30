let pathCache = [];
let pathNodes = document.querySelector("#path_nodes");
let pathLength = document.querySelector("#path_length");
let clearPath = document.querySelector("#clear_path");

clearPath.addEventListener("click", () => {
    let selectedPathLayer = getLayer(selectedLayerId); 
    selectedPathLayer.pathCache = [];
    renderLayers();
})

let pathProperties = document.querySelector("#path_property");
let layersControls = document.querySelector(".layers");

const DOT_RADIUS = 10;

class PathLayer extends Layer {
    constructor(params) {
        super("path", params);
        this.pathCache = [];
    }

    render() {
        let length = 0;
        this.pathCache.forEach((point, index) => {
            if (index != 0) {
                let pervPoint = this.pathCache[index - 1];

                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(getX(point.x), getY(point.y));
                ctx.lineTo(getX(pervPoint.x), getY(pervPoint.y));
                ctx.stroke();
    
                length += Math.sqrt(Math.pow(point.x - pervPoint.x, 2) + Math.pow(point.y - pervPoint.y, 2));
            }
        })
        this.pathCache.forEach(point => {
            ctx.beginPath();
            ctx.arc(getX(point.x), getY(point.y), DOT_RADIUS, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'gray';
            ctx.fill();
            ctx.lineWidth = Math.min(Math.max(2, 1 / scale), 3);
            ctx.strokeStyle = 'black';
            ctx.stroke();
        })
    
        pathNodes.innerHTML = this.pathCache.length;
        pathLength.innerHTML = pxToMeters(length);
    }

    draw = (event) => {
        if (event.target.id !== "canvas") return;
        if (event.button === 0) {
            event.preventDefault();
            let realX = event.clientX / scale + dragVector.x;
            let realY = event.clientY / scale + dragVector.y;
    
            this.pathCache.push({ x: realX, y: realY });
    
            renderLayers();
        } else if (event.button === 2) {
            let point = this.pathCache.toReversed().findIndex(point => ((getX(point.x) + DOT_RADIUS) >= event.clientX) && (event.clientX >= (getX(point.x) - DOT_RADIUS)) && ((getY(point.y) + DOT_RADIUS) >= event.clientY) && (event.clientY >= (getY(point.y) - DOT_RADIUS)));
    
            if (point != -1) this.pathCache.splice(pathCache.length - point - 1, 1);

            renderLayers();
        }
    }

    toolSet() {
        modeField.innerHTML = "путь"
        pathProperties.classList.add("active");
        layersControls.classList.add("hidden")
        layersControls.classList.add("closed");
        document.addEventListener("mousedown", this.draw);
    }

    toolReset() {
        pathProperties.classList.remove("active");
        layersControls.classList.remove("hidden");
        document.removeEventListener("mousedown", this.draw);
    }
}