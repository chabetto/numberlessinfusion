/*
to be done:
generators work in background
*/

// original player stats (do not save)

const OGREPEATABLE = {
    upgradeAlphaTime: {
        id: "upgradeAlphaTime",
        cost: "Alpha",
        amountBought: 0,
        total: 20,
    },
};

let newRepeatable = {};

const ogPlayer = {
    NAMES: [
        "Alpha",
        "Beta",
        "Gamma",
        "Delta",
        "AlphaBeta",
        "BetaDelta",
        "AlphaGamma",
        "GammaDelta",
    ],
    TIMES: [5, 50, 500, 3600, 30, 30, 30, 30],
    VERTICAL: [true, true, true, true, true, false, false, true],
    INFUSION: [false, false, false, false, true, true, true, true],
    percentage: [0, 0, 0, 0, 0, 0, 0, 0],
    UNLOCKED: [true, false, false, false, false, false, false, false],
    bought: [],
    permanent: [],
    update: 0.05,
    stopTime: false,
};

// what will prob be the original save
let player = {};

class repeatUpgrade {
    constructor(id, cost, amountBought, total) {
        this.id = id;
        this.button = document.querySelector(`#${id}`);
        this.bar = document.querySelector(`#${id}Bar`);
        this.cost = cost;
        this.percentage = (amountBought / total) * 100;
        this.showPercentage();
    }
    showPercentage() {
        this.bar.style.width = `${this.percentage}%`;
        if (this.percentage === 100) {
            this.button.classList.add("bought");
            removeButtonClick(this.id);
        }
    }
    buyOnce() {
        if (resources[cost].spend()) {
            this.percentage += 100 / total;
            this.showPercentage();
            return true;
        } else {
            return false;
        }
    }
}

class resource {
    constructor(name, time, vertical, infusion, percentage, unlocked) {
        this.name = name;
        this.bar = document.querySelector(`#bar${name}`);
        this.container = infusion
            ? document.querySelector(`#infusion${name}`)
            : document.querySelector(`#generator${name}`);
        this.point = Boolean(percentage === 100);
        this.vertical = vertical; // 1 means bar progresses vertically
        this.time = time;
        this.unlocked = unlocked;
        this.percentage = percentage;
        this.index = player.NAMES.indexOf(this.name);
        if (unlocked) {
            this.unlock();
        } else {
            this.hide();
        }
        this.showPercentage();
    }
    unlock() {
        showClass(this.name);
        this.unlocked = true;
    }
    hide() {
        hideClass(this.name);
        this.unlocked = false;
    }
    showPercentage() {
        this.vertical
            ? (this.bar.style.height = `${this.percentage}%`)
            : (this.bar.style.width = `${this.percentage}%`);
        player.percentage[this.index] = this.percentage;
    }
    updateBar() {
        if (this.percentage < 100) {
            this.percentage =
                this.percentage + (player.update * 100) / this.time;
            if (this.percentage >= 100) {
                this.percentage = 100;
                this.point = true;
            }
            this.showPercentage();
        } else if (this.percentage === NaN) {
            this.reset();
        }
    }
    spend() {
        if (this.point) {
            this.reset();
            return true;
        } else {
            return false;
        }
    }
    reset() {
        this.point = false;
        this.percentage = 0;
        this.showPercentage();
    }
}

let resources = {};

function createResources() {
    for (i in player.NAMES) {
        resources[player.NAMES[i]] = new resource(
            player.NAMES[i],
            player.TIMES[i],
            player.VERTICAL[i],
            player.INFUSION[i],
            player.percentage[i],
            player.UNLOCKED[i]
        );
    }
}

let repeatables = {};

function createRepeatable() {
    let buttons = document.querySelectorAll(".repeat");
    buttons.forEach((button) => {
        let id = button.id;
        let info = newRepeatable[id];
        repeatables[id] = new repeatUpgrade(
            info.id,
            info.cost,
            info.amountBought,
            info.total
        );
    });
}

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
    button.removeEventListener("click", buttonFunction);
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
    // tabbing
    else if (id.slice(0, 6) === "unlock") unlockFunction(id); // unlock tab
}

function unlockFunction(idButton) {
    let id = idButton.slice(6);
    if (player.NAMES.includes(id)) {
        toSpend = player.NAMES[player.NAMES.indexOf(id) - 1];
        if (resources[toSpend].spend()) {
            unlockThing(idButton);
            player.bought.push(idButton);
        }
    }
}

function unlockThing(idButton) {
    let id = idButton.slice(6);
    resources[id].unlock();
    removeButtonClick(idButton);
}

function incrementBars() {
    for (item in resources) {
        if (resources[item].unlocked) {
            resources[item].updateBar();
        }
    }
}

function startTime() {
    player.stopTime = false;
    let gameTime = window.setInterval(() => {
        incrementBars();
        if (player.stopTime) clearInterval(gameTime);
    }, player.update * 1000);
}

function loadBought() {
    for (item in player.bought) {
        let id = player.bought[item];
        if (id.slice(0, 6) === "unlock") unlockThing(id);
    }
}

function loadPlayer() {
    if (localStorage.getItem("player") === null) {
        player = ogPlayer;
        newRepeatable = OGREPEATABLE;
    } else {
        player = JSON.parse(localStorage.getItem("player"));
        newRepeatable = JSON.parse(localStorage.getItem("newRepeatable"));
    }
}

function startSaves() {
    let saveTime = window.setInterval(() => {
        saving();
        if (player.stopTime) clearInterval(saveTime);
    }, 10000);
}

function saving() {
    localStorage.setItem("player", JSON.stringify(player));
    localStorage.setItem("newRepeatable", JSON.stringify(newRepeatable));
    console.log("saved");
}

function restartGame() {
    player.stopTime = true;
    window.localStorage.clear();
    loadPlayer();
    addButtonListeners(false);
    createResources();
    startTime();
    createRepeatable();
    startSaves();
    loadBought();
}

window.onload = function () {
    loadPlayer();
    addButtonListeners(false);
    createResources();
    startTime();
    createRepeatable();
    startSaves();
    loadBought();
    //restartGame();
};
