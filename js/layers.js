let layers = [];
let selectedLayerId = false;

let addLayerButton = document.querySelector("#layer_add");
let layersHeader = document.querySelector(".layers__header");

layersHeader.addEventListener("click", () => {
    layersHeader.parentElement.classList.toggle("closed");
})

addLayerButton.addEventListener("click", () => {
    if (selectedLayerId) {
        let newLayerId;
        switch (selectedMode) {
            case "path":
                newLayerId = addLayer(new PathLayer());
                break;
            case "draw":
                newLayerId = addLayer(new DrawLayer());
                break;
            default:
                break;
        }
        selectLayer(newLayerId);
    }
});

function addLayer(object) {
    layers.push(object);
    renderLayersUi();
    return object.id;
}

function getLayer(id) {
    return layers.find(layer => layer.id == id);
}

function getLastLayerByType(type) {
    let layer = layers.toReversed().find(l => l.type == type);

    return layer?.id;
}

function selectLayer(id) {
    if (selectedLayerId) {
        let prevLayer = getLayer(selectedLayerId);
        prevLayer.toolReset();
        if (!prevLayer.hidden) document.querySelector(`#layer_${selectedLayerId}`).classList.remove("active")
    }
    selectedLayerId = id;
    let layer = getLayer(id);
    layer.toolSet();

    if (!layer.hidden) document.querySelector(`#layer_${selectedLayerId}`).classList.add("active")
}

function renderLayers() {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    layers.filter(layer => layer.visible).forEach(layer => layer.render());
}

let layersList = document.querySelector(".layers__list");

function renderLayersUi() {
    let layersElements = layers.filter(layer => !layer.hidden).toReversed().map(layer => {
        return `
        <div class="layer ${layer.disabled ? "disabled" : ""} ${layer.id === selectedLayerId ? "active" : ""}" id="layer_${layer.id}" onclick="selectLayerUI(event, ${layer.id})">
            <div class="layer__info">
                <p class="layer__title">${layer.name}</p>
                <p class="layer__type">${layer.type}</p>
            </div>
            <div class="layer__actions">
                <div class="layer__move">
                    <img src="./assets/up.svg" id="move_up" class="lb" draggable="false" onclick="getLayer(${layer.id}).moveUp()">
                    <img src="./assets/down.svg" id="move_down" class="lb" draggable="false" onclick="getLayer(${layer.id}).moveDown()">
                </div>
                <img src="./assets/pen.svg" class="lb layer__button" id="layer__edit" draggable="false" onclick="editLayerName(${layer.id})">
                <img src="./assets/${!layer.visible ? "closed_" : ""}eye.svg" class="lb layer__button" id="layer__visible" draggable="false" onclick="getLayer(${layer.id}).edit({ visible: ${!layer.visible} })">
                <img src="./assets/trash.svg" class="lb layer__button" id="layer__delete" draggable="false" onclick="getLayer(${layer.id}).delete()">
            </div>
        </div>
        `
    }).join(`\n`)
    layersList.innerHTML = layersElements;
}

function selectLayerUI(event, id) {
    if (event.target.classList.contains("lb")) return;
    let layer = getLayer(id);
    if (layer.disabled) return;

    if (selectedMode !== layer.type) {
        changeMode(layer.type);
    }

    selectLayer(id);
}

function editLayerName(id) {
    let layer = getLayer(id);
    if (layer.disabled) return;
    let layerTitleElement = document.querySelector(`#layer_${id}`).querySelector(".layer__title");

    layerTitleElement.setAttribute("contenteditable", true);
    layerTitleElement.focus();

    let preventEnter = (e) =>  {
        const isValidKeyCode = [8, 16, 17, 37, 38, 39, 40, 46].includes(e.keyCode);
        if (layerTitleElement.innerHTML.length == 18 && !isValidKeyCode) e.preventDefault();
        if (e.keyCode === 13) {
            e.preventDefault();
            layerTitleElement.blur();
        }
    }

    let onBlur = (e) =>  {
        layerTitleElement.removeEventListener("keydown", preventEnter);
        layerTitleElement.removeEventListener("blur", onBlur);
        layerTitleElement.setAttribute("contenteditable", false);
        layer.edit({ name: layerTitleElement.innerHTML });
    }

    layerTitleElement.addEventListener("keydown", preventEnter);
    layerTitleElement.addEventListener("blur", onBlur)
}

class Layer {
    constructor(type, params) {
        this.type = type;
        this.id = layers.length;
        this.name = params?.name ?? ("Слой " + layers.length);
        this.visible = true;
        this.disabled = params?.disabled ?? false;
        this.hidden = params?.hidden ?? false;
    }

    delete() {
        if (this.disabled) return;
        let index = layers.findIndex(layer => layer.id == this.id);
        layers.splice(index, 1);
        
        if (selectedLayerId === this.id) {
            selectedLayerId = false;
            changeMode(selectedMode);
        }

        renderLayersUi();
        renderLayers();
    }

    edit({ name, visible, disabled, hidden }) {
        if (this.disabled) return;
        if (name != undefined) this.name = name;
        if (visible != undefined) this.visible = visible;
        if (disabled != undefined) this.disabled = disabled;
        if (hidden != undefined) this.hidden = hidden;
        renderLayersUi();
        renderLayers();
    }

    moveUp() {
        if (this.disabled) return;
        let index = layers.findIndex(layer => layer.id == this.id);
        if (index == (layers.length - 1)) return;
        let delLayer = layers.splice(index, 1);
        layers = Array.prototype.concat(layers.slice(0, index + 1), delLayer, layers.slice(index + 1));
        renderLayersUi();
        renderLayers();
    }

    moveDown() {
        if (this.disabled) return;
        let index = layers.findIndex(layer => layer.id == this.id);
        if (index == 0) return;
        if (layers[index - 1].disabled) return;
        let delLayer = layers.splice(index, 1);
        layers = Array.prototype.concat(layers.slice(0, index - 1), delLayer, layers.slice(index - 1));
        renderLayersUi();
        renderLayers();
    }
}