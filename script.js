/*
to be done:
game loool
*/

// original player stats (do not save)
let ogPlayer = {
    times: {
        Alpha: 5,
    },
    names: [
        "Alpha",
        "Beta",
        "Gamma",
        "Delta",
        "AlphaBeta",
        "BetaDelta",
        "AlphaGamma",
        "GammaDelta",
    ],
};

// what will prob be the original save
let player = {
    bars: {
        Alpha: {
            name: "Alpha",
            time: 5,
            vertical: true,
            infusion: false,
            percentage: 0,
            unlocked: true,
        },
    },
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
    PERCENTAGE: [0, 0, 0, 0, 0, 0, 0, 0],
    UNLOCKED: [true, false, false, false, false, false, false, false],
    bought: [],
    permanent: [],
    unlockedGen: [true, false, false, false],
    unlockedInf: [false, false, false, false],
    update: 0.05,
    stopTime: false,
};

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
        if (unlocked) {
            this.unlock();
        }
        this.showPercentage();
    }
    unlock() {
        showClass(this.name);
        this.unlocked = true;
    }
    showPercentage() {
        this.vertical
            ? (this.bar.style.height = `${this.percentage}%`)
            : (this.bar.style.width = `${this.percentage}%`);
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
}

let resources = {};

function createResources() {
    for (i in player.NAMES) {
        resources[player.NAMES[i]] = new resource(
            player.NAMES[i],
            player.TIMES[i],
            player.VERTICAL[i],
            player.INFUSION[i],
            player.PERCENTAGE[i],
            player.UNLOCKED[i]
        );
    }
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
    else if (id.slice(0, 6) === "unlock") unlockFunction(id);
}

function unlockFunction(id) {
    //console.log('hello')
}

function incrementBars() {
    for (item in resources) {
        if (resources[item].unlocked) {
            resources[item].updateBar();
        }
    }
}

function startTime() {
    let gameTime = window.setInterval(() => {
        incrementBars();
        if (player.stopTime) clearInterval(gameTime);
    }, player.update * 1000);
}

window.onload = function () {
    addButtonListeners(false);
    createResources();
    startTime();
};
