let canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let dragVector = { x: 0, y: 0 };
let scale = 0.5;
const MAX_SCALE = 500;
const MIN_SCALE = 0.2;

const MAP_HEIGHT = window.innerHeight / scale - 100;

let isDragging = false;
let startDragPosition = false;
let startDragVector = false;

canvas.oncontextmenu = function (e) {
    e.preventDefault();
};

document.addEventListener("mousedown", (e) => {
    if (e.target.id !== "canvas") return;
    if (e.button === 1) {
        e.preventDefault();
        document.querySelector("body").style.cursor = "grabbing";
        isDragging = true;
    }
})

document.addEventListener("mouseup", (e) => {
    if (e.target.id !== "canvas") return;
    if (e.button === 1) {
        document.querySelector("body").style.cursor = "auto";
        isDragging = false;
        startDragPosition = false;
        startDragVector = false;
    }
})

document.addEventListener("mousemove", (e) => {
    if (e.target.id !== "canvas") return;
    if (isDragging) {
        if (!startDragPosition) startDragPosition = { x: e.clientX, y: e.clientY };
        if (!startDragVector) startDragVector = { ...dragVector };
        dragVector.x = startDragVector.x + ((startDragPosition.x - e.clientX) * (1 / scale));
        dragVector.y = startDragVector.y + ((startDragPosition.y - e.clientY) * (1 / scale));

        renderLayers();
    }
})

document.addEventListener("wheel", (e) => {
    if (e.target.id !== "canvas") return;
    let realX = e.clientX / scale + dragVector.x;
    let realY = e.clientY / scale + dragVector.y;
    
    if (e.deltaY < 0) {
        if (scale >= MAX_SCALE) return;
        scale += 0.1 * scale;
    } else if (e.deltaY > 0) {
        if (scale <= MIN_SCALE) return;
        scale -= 0.1 * scale;
    }
    
    dragVector.x = realX - e.clientX / scale;
    dragVector.y = realY - e.clientY / scale;

    renderLayers();
})

function getX(coord) {
    return scale * (coord - dragVector.x);
}

function getY(coord) {
    return scale * (coord - dragVector.y);
}

function pxToMeters(px) {
    const ratio = (MAP_HEIGHT * 3.42249838) / 685;
    return Math.floor((px / ratio) * 1000);
}

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    renderLayers()
})

let mapLayer = new Layer("default", { name: "Карта", disabled: true })

let map = new Image()
map.src = './assets/map.png';

let resolution = map.width / map.height;

let centerY = (window.innerHeight / scale - MAP_HEIGHT) / 2;
let centerX = (window.innerWidth / scale - resolution * MAP_HEIGHT) / 2;

mapLayer.render = () => {
    ctx.fillStyle = "#87C1D7";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    let height = MAP_HEIGHT * scale;
    let width = resolution * height;

    let x = centerX;
    let y = centerY;

    ctx.drawImage(map, getX(x), getY(y), width, height);
}

addLayer(mapLayer)

map.onload = renderLayers;