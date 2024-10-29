let modes = document.querySelectorAll(".controls__mode");

let selectedMode = false; 

modes.forEach(mode => {
    mode.addEventListener("click", (e) => {
        changeMode(mode.childNodes[1].id);
    })
})

let modeField = document.querySelector("#selected_mode");

let labelProperties = document.querySelector("#label_property");
let textProperties = document.querySelector("#text_property");

function changeMode(mode) {
    selectedMode = mode;

    modes.forEach(m => m.classList.remove("active"));
    document.querySelector(`#${mode}`).parentElement.classList.add("active");

    let layerId = getLastLayerByType(mode);

    if (!layerId) {
        switch (mode) {
            case "path":
                layerId = addLayer(new PathLayer({ hidden: true, disabled: true, name: "Пути" }));
                break;
            case "draw":
                layerId = addLayer(new DrawLayer());
                break;
            default:
                break;
        }
    }

    selectLayer(layerId);
}

changeMode("path");