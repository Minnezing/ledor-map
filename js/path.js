let pathCache = [];
let pathNodes = document.querySelector("#path_nodes");
let pathLength = document.querySelector("#path_length");
let clearPath = document.querySelector("#clear_path");

function drawPath(e) {
    if (e.target.id !== "canvas") return;
    if (e.button === 0) {
        e.preventDefault();
        let realX = e.clientX / scale + dragVector.x;
        let realY = e.clientY / scale + dragVector.y;

        pathCache.push({ x: realX, y: realY });

        renderMap();
    } else if (e.button === 2) {
        let realX = e.clientX / scale + dragVector.x;
        let realY = e.clientY / scale + dragVector.y;

        let point = pathCache.findIndex(point => ((point.x + 10) >= realX) && (realX >= (point.x - 10)) && ((point.y + 10) >= realY) && (realY >= (point.y - 10)));

        console.log(point)

        if (point != -1) pathCache.splice(point, 1);

        renderMap();
    }
}

function renderPath() {
    let length = 0;
    pathCache.forEach((point, index) => {
        if (index != 0) {
            let pervPoint = pathCache[index - 1];
            ctx.beginPath();
            ctx.moveTo(getX(point.x), getY(point.y));
            ctx.lineTo(getX(pervPoint.x), getY(pervPoint.y));
            ctx.stroke();

            length += Math.sqrt(Math.pow(point.x - pervPoint.x, 2) + Math.pow(point.y - pervPoint.y, 2));
        }
    })
    pathCache.forEach(point => {
        let raius = 10;

        ctx.beginPath();
        ctx.arc(getX(point.x), getY(point.y), raius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'gray';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'black';
        ctx.stroke();
    })

    pathNodes.innerHTML = pathCache.length;
    pathLength.innerHTML = pxToKm(length);
}

clearPath.addEventListener("click", () => {
    pathCache = [];
    renderMap();
})