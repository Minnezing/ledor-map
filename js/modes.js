let modes = document.querySelectorAll(".controls__mode");

let selectedMode = "path"; 

modes.forEach(mode => {
    mode.addEventListener("click", (e) => {
        modes.forEach(m => m.classList.remove("active"));
        mode.classList.add("active");
        console.log(mode.childNodes[1])
        selectedMode = mode.childNodes[1].id;
        changeMode();
    })
})

let modeField = document.querySelector("#selected_mode");

let pathProperties = document.querySelector("#path_property");
let labelProperties = document.querySelector("#label_property");
let textProperties = document.querySelector("#text_property");

function changeMode() {
    document.removeEventListener("mousedown", drawPath);
    pathProperties.classList.remove("active");
    labelProperties.classList.remove("active");
    textProperties.classList.remove("active");

    if (selectedMode === "path") {
        modeField.innerHTML = "путь"
        pathProperties.classList.add("active");
        document.addEventListener("mousedown", drawPath);
    } else if (selectedMode === "label") {
        labelProperties.classList.add("active");
        modeField.innerHTML = "метки";
    } else if (selectedMode === "text") {
        textProperties.classList.add("active");
        modeField.innerHTML = "текст";
    }
    renderMap();
}

changeMode();