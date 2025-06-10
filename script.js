// Game logic for Idle Infinity Game will go here.
// Basic structure and initial values

let cash = 10;
let gen1Count = 0;
let gen1Cost = 10;
let gen2Count = 0;
let gen2Cost = 100;
let gen3Count = 0;
let gen3Cost = 1000;
let gen4Count = 0;
let gen4Cost = 10000;
let gen5Count = 0;
let gen5Cost = 100000;
let gen6Count = 0;
let gen6Cost = 1000000;
let gen7Count = 0;
let gen7Cost = 10000000;
let gen8Count = 0;
let gen8Cost = 100000000;
let gen9Count = 0;
let gen9Cost = 1000000000;

const cashDisplay = document.getElementById('cash');
const gen1CountDisplay = document.getElementById('gen1-count');
const gen1CostDisplay = document.getElementById('gen1-cost');
const gen2CountDisplay = document.getElementById('gen2-count');
const gen2CostDisplay = document.getElementById('gen2-cost');
const gen3CountDisplay = document.getElementById('gen3-count');
const gen3CostDisplay = document.getElementById('gen3-cost');
const gen4CountDisplay = document.getElementById('gen4-count');
const gen4CostDisplay = document.getElementById('gen4-cost');
const gen5CountDisplay = document.getElementById('gen5-count');
const gen5CostDisplay = document.getElementById('gen5-cost');
const gen6CountDisplay = document.getElementById('gen6-count');
const gen6CostDisplay = document.getElementById('gen6-cost');
const gen7CountDisplay = document.getElementById('gen7-count');
const gen7CostDisplay = document.getElementById('gen7-cost');
const gen8CountDisplay = document.getElementById('gen8-count');
const gen8CostDisplay = document.getElementById('gen8-cost');
const gen9CountDisplay = document.getElementById('gen9-count');
const gen9CostDisplay = document.getElementById('gen9-cost');

const buyGen1Button = document.getElementById('buy-gen1');
const buyGen2Button = document.getElementById('buy-gen2');
const buyGen3Button = document.getElementById('buy-gen3');
const buyGen4Button = document.getElementById('buy-gen4');
const buyGen5Button = document.getElementById('buy-gen5');
const buyGen6Button = document.getElementById('buy-gen6');
const buyGen7Button = document.getElementById('buy-gen7');
const buyGen8Button = document.getElementById('buy-gen8');
const buyGen9Button = document.getElementById('buy-gen9');
const winMessage = document.getElementById('win-message');

function updateDisplay() {
    cashDisplay.textContent = cash;
    gen1CountDisplay.textContent = "lv" + gen1Count;
    gen1CostDisplay.textContent = gen1Cost;
    gen2CountDisplay.textContent = "lv" + gen2Count;
    gen2CostDisplay.textContent = gen2Cost;
    gen3CountDisplay.textContent = "lv" + gen3Count;
    gen3CostDisplay.textContent = gen3Cost;
    gen4CountDisplay.textContent = "lv" + gen4Count;
    gen4CostDisplay.textContent = gen4Cost;
    gen5CountDisplay.textContent = "lv" + gen5Count;
    gen5CostDisplay.textContent = gen5Cost;
    gen6CountDisplay.textContent = "lv" + gen6Count;
    gen6CostDisplay.textContent = gen6Cost;
    gen7CountDisplay.textContent = "lv" + gen7Count;
    gen7CostDisplay.textContent = gen7Cost;
    gen8CountDisplay.textContent = "lv" + gen8Count;
    gen8CostDisplay.textContent = gen8Cost;
    gen9CountDisplay.textContent = "lv" + gen9Count;
    gen9CostDisplay.textContent = gen9Cost;
}

buyGen1Button.addEventListener('click', () => {
    if (cash >= gen1Cost) {
        cash -= gen1Cost;
        gen1Count++;
        gen1Cost = Math.ceil(gen1Cost * 1.15); // Increase cost by 15%
        updateDisplay();
    }
});

buyGen3Button.addEventListener('click', () => {
    if (cash >= gen3Cost) {
        cash -= gen3Cost;
        gen3Count++;
        gen3Cost = Math.ceil(gen3Cost * 1.20); // Increase cost by 20%
        updateDisplay();
    }
});

buyGen4Button.addEventListener('click', () => {
    if (cash >= gen4Cost) {
        cash -= gen4Cost;
        gen4Count++;
        gen4Cost = Math.ceil(gen4Cost * 1.20); // Increase cost by 20%
        updateDisplay();
    }
});

buyGen5Button.addEventListener('click', () => {
    if (cash >= gen5Cost) {
        cash -= gen5Cost;
        gen5Count++;
        gen5Cost = Math.ceil(gen5Cost * 1.20); // Increase cost by 20%
        updateDisplay();
    }
});

buyGen6Button.addEventListener('click', () => {
    if (cash >= gen6Cost) {
        cash -= gen6Cost;
        gen6Count++;
        gen6Cost = Math.ceil(gen6Cost * 1.20); // Increase cost by 20%
        updateDisplay();
    }
});

buyGen7Button.addEventListener('click', () => {
    if (cash >= gen7Cost) {
        cash -= gen7Cost;
        gen7Count++;
        gen7Cost = Math.ceil(gen7Cost * 1.20); // Increase cost by 20%
        updateDisplay();
    }
});

buyGen8Button.addEventListener('click', () => {
    if (cash >= gen8Cost) {
        cash -= gen8Cost;
        gen8Count++;
        gen8Cost = Math.ceil(gen8Cost * 1.20); // Increase cost by 20%
        updateDisplay();
    }
});

buyGen9Button.addEventListener('click', () => {
    if (cash >= gen9Cost) {
        cash -= gen9Cost;
        gen9Count++;
        gen9Cost = Math.ceil(gen9Cost * 1.20); // Increase cost by 20%
        updateDisplay();
    }
});

buyGen2Button.addEventListener('click', () => {
    if (cash >= gen2Cost) {
        cash -= gen2Cost;
        gen2Count++;
        gen2Cost = Math.ceil(gen2Cost * 1.20); // Increase cost by 20%
        updateDisplay();
    }
});

// Game loop - called every second
setInterval(() => {
    cash += gen1Count; // Gen1 produces 1 cash per second
    gen1Count += gen2Count; // Gen2 produces 1 Gen1 per second
    gen2Count += gen3Count; // Gen3 produces 1 Gen2 per second
    gen3Count += gen4Count; // Gen4 produces 1 Gen3 per second
    gen4Count += gen5Count; // Gen5 produces 1 Gen4 per second
    gen5Count += gen6Count; // Gen6 produces 1 Gen5 per second
    gen6Count += gen7Count; // Gen7 produces 1 Gen6 per second
    gen7Count += gen8Count; // Gen8 produces 1 Gen7 per second
    gen8Count += gen9Count; // Gen9 produces 1 Gen8 per second

    // Win condition (example: reach 1,000,000 cash)
    if (cash >= Math.pow(2, 32)) { // Updated win condition
        winMessage.style.display = 'block';
        // Potentially disable buttons or stop game updates here
    }

    updateDisplay();
}, 1000);

// Initial display update
updateDisplay();
