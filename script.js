/*
to be done:

*/

let player = {
    NAMES: ["alpha", "beta", "gamma", "delta"],
    INFUSIONS: ["AlphaBeta", "BetaGamma", "AlphaGamma", "GammaDelta"],
    bought: [],
    permanent: [],
    unlockedGen: [true, false, false, false],
    unlockedInf: [false, false, false, false],
    barWidth: {
        alpha: 0,
        beta: 0,
        gamma: 0,
        delta: 0,
        AlphaBeta: 0,
        BetaGamma: 0,
        AlphaGamma: 0,
        GammaDelta: 0,
    },
};

// insert class name
function hideClass(classStr) {
    let divs = document.querySelectorAll(`.${classStr}`);
    divs.forEach((div) => {
        div.classList.add("hidden");
    });
}

function showClass(classStr) {
    let divs = document.querySelectorAll(`.${classStr}`);
    divs.forEach((div) => {
        div.classList.remove("hidden");
    });
}

function hideID(idstr) {
    let div = document.querySelector(`#${idstr}`);
    div.classList.add("hidden");
}

function showID(idstr) {
    let div = document.querySelector(`#${idstr}`);
    div.classList.remove("hidden");
}

function removeButtonClick(id) {
    let button = document.querySelector(`#${id}`);
    button.removeEventListener("click", buttonClickListener);
    button.classList.add("bought");
}

function showTab(id) {
    tab = id.slice(0, -3);
    hideClass("page");
    showID(`${tab}Page`);
    let buttons = document.querySelectorAll(".tabButton");
    buttons.forEach((button) => {
        button.classList.remove("toggle");
    });
    let button = document.querySelector(`#${id}`);
    button.classList.add("toggle");
}

// will prob need to not add it to perm bought stuff :)
function addButtonListeners(reset) {
    let buttons = document.querySelectorAll("button");
    buttons.forEach((button) => {
        if (
            (!player.bought.includes(button.id) & reset) |
            !player.permanent.includes(button.id)
        ) {
            button.addEventListener("click", buttonFunction);
            button.classList.remove("bought");
        }
    });
}

function buttonFunction(e) {
    let id = e.target.id;
    console.log(id);
    if (id.slice(id.length - 3) === "Tab") showTab(id);
    else if (id.slice(id.length - 6) === "Unlock") unlockFunction(id);
}

function unlockFunction(id) {}

window.onload = function () {
    addButtonListeners(false);
};
