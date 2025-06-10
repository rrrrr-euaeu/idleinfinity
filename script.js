// Game logic for Idle Infinity Game will go here.
// Basic structure and initial values

let cash = 10;
let gen1Count = 0;
let gen1Cost = 10;
let gen2Count = 0;
let gen2Cost = 100;

const cashDisplay = document.getElementById('cash');
const gen1CountDisplay = document.getElementById('gen1-count');
const gen1CostDisplay = document.getElementById('gen1-cost');
const gen2CountDisplay = document.getElementById('gen2-count');
const gen2CostDisplay = document.getElementById('gen2-cost');

const buyGen1Button = document.getElementById('buy-gen1');
const buyGen2Button = document.getElementById('buy-gen2');
const winMessage = document.getElementById('win-message');

function updateDisplay() {
    cashDisplay.textContent = cash;
    gen1CountDisplay.textContent = gen1Count;
    gen1CostDisplay.textContent = gen1Cost;
    gen2CountDisplay.textContent = gen2Count;
    gen2CostDisplay.textContent = gen2Cost;
}

buyGen1Button.addEventListener('click', () => {
    if (cash >= gen1Cost) {
        cash -= gen1Cost;
        gen1Count++;
        gen1Cost = Math.ceil(gen1Cost * 1.15); // Increase cost by 15%
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

    // Win condition (example: reach 1,000,000 cash)
    if (cash >= Math.pow(2, 32)) { // Updated win condition
        winMessage.style.display = 'block';
        // Potentially disable buttons or stop game updates here
    }

    updateDisplay();
}, 1000);

// Initial display update
updateDisplay();
