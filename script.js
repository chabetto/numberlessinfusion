/*
to be done:
generators work in background

features:
*/

// original player stats (do not save)

const OGREPEATABLE = {
    upgradeAlphaTime: {
        id: "upgradeAlphaTime",
        cost: "Alpha",
        amountBought: 0,
        total: 6,
    },
    upgradeBetaTime: {
        id: "upgradeBetaTime",
        cost: "Beta",
        amountBought: 0,
        total: 4,
    },
    upgradeGammaTime: {
        id: "upgradeGammaTime",
        cost: "Gamma",
        amountBought: 0,
        total: 3,
    },
    upgradeDeltaTime: {
        id: "upgradeDeltaTime",
        cost: "Delta",
        amountBought: 0,
        total: 2,
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
        this.amountBought = amountBought;
        this.total = total;
        this.showPercentage();
    }
    showPercentage() {
        if (Math.round(this.percentage) >= 100) {
            this.percentage = 100;
            this.button.classList.add("bought");
            removeButtonClick(this.id);
        }
        this.bar.style.width = `${this.percentage}%`;
    }
    updateAmount() {
        this.amountBought += 1;
        newRepeatable[this.id].amountBought += 1;
    }
    buyOnce() {
        if (resources[this.cost].spend()) {
            this.percentage += 100 / this.total;
            this.showPercentage();
            this.updateAmount();
            return true;
        } else {
            return false;
        }
    }
}

class resource {
    constructor(name, time, vertical, infusion, percentage, unlocked) {
        this.name = name;
        this.inHTML = `&${name.toLowerCase()};`;
        this.isdone = document.querySelector(`#${name}IsDone`);
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
                this.isdone.classList.remove("hidden");
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
        this.isdone.classList.add("hidden");
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
function addButtonListeners() {
    let buttons = document.querySelectorAll("button");
    buttons.forEach((button) => {
        if (!player.bought.includes(button.id)) {
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
    else if (id.slice(0, 6) === "unlock") unlockFunction(id);
    // unlock tab
    else if (id.slice(0, 7) === "upgrade") upgradeFunction(id); // upgrade tab
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

function upgradeFunction(idButton) {
    id = idButton.slice(7);
    if (id.includes("Time")) {
        if (repeatables[idButton].buyOnce()) {
            res = repeatables[idButton].cost;
            index = resources[res].index;
            player.TIMES[index] /= 2 ** (1 / repeatables[idButton].total);
            console.log(2 ** (1 / repeatables[idButton].total));
            resources[res].time /= 2 ** (1 / repeatables[idButton].total);
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
    }, 5000);
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
    addButtonListeners();
    createResources();
    startTime();
    createRepeatable();
    startSaves();
    loadBought();
    showTab("generatorTab");
}

function fromStart() {
    player = ogPlayer;
    newRepeatable = OGREPEATABLE;
}

function cheating() {
    player.TIMES = [1, 1, 1, 1, 1, 1, 1, 1];
}

function showDescription(e) {
    let id = e.target.id;
    const tabs = ["generators", "unlock", "upgrades", "skills", "idk"];
    const descriptions = {
        unlockBeta: [
            "unlock the &beta; generator and the upgrades tab",
            "costs &alpha;",
        ],
        unlockGamma: [
            "unlock the &gamma; generator and the skills tab",
            "costs &beta;",
        ],
        unlockDelta: [
            "unlock the &delta; generator and the ??? tab",
            "costs &gamma;",
        ],
    };
    let buttonText = e.target.innerHTML.trim();
    console.log(id, buttonText);
    let div = document.querySelector("#desc");
    let title = document.createElement("p");
    title.innerHTML = tabs.includes(buttonText) ? "" : buttonText;
    let text = document.createElement("p");
    let cost = document.createElement("p");
    if (id in descriptions) {
        text.innerHTML = descriptions[id][0];
        cost.innerHTML = descriptions[id][1];
    } else if (id.includes("upgrade") && id.includes("Time")) {
        let res = buttonText.slice(0, -1);
        text.innerHTML = `reduce the time of the ${res} generator`;
        cost.innerHTML = `costs ${res}`;
    }
    div.innerHTML = "";
    div.appendChild(title);
    div.appendChild(text);
    div.appendChild(cost);
}

function addButtonHover() {
    let buttons = document.querySelectorAll("button");
    buttons.forEach((button) => {
        button.addEventListener("mouseover", showDescription);
    });
}

window.onload = function () {
    //player = ogPlayer;
    //newRepeatable = OGREPEATABLE;
    loadPlayer();
    //fromStart();
    //cheating();
    addButtonListeners();
    addButtonHover();
    createResources();
    startTime();
    createRepeatable();
    startSaves();
    loadBought();
    //restartGame();
};
