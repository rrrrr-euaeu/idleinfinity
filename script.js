// Game logic for Idle Infinity Game will go here.
// Basic structure and initial values

let cash = 10;
let gen1TotalCount = 0;
let gen1PurchasedCount = 0;
let gen1Cost = 10;
let gen2TotalCount = 0;
let gen2PurchasedCount = 0;
let gen2Cost = 100;
let gen3TotalCount = 0;
let gen3PurchasedCount = 0;
let gen3Cost = 1000;
let gen4TotalCount = 0;
let gen4PurchasedCount = 0;
let gen4Cost = 10000;
let gen5TotalCount = 0;
let gen5PurchasedCount = 0;
let gen5Cost = 100000;
let gen6TotalCount = 0;
let gen6PurchasedCount = 0;
let gen6Cost = 1000000;
let gen7TotalCount = 0;
let gen7PurchasedCount = 0;
let gen7Cost = 10000000;
let gen8TotalCount = 0;
let gen8PurchasedCount = 0;
let gen8Cost = 100000000;
let gen9TotalCount = 0;
let gen9PurchasedCount = 0;
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

const gen1NameDisplay = document.getElementById('gen1-name-display');
const gen1LevelDisplay = document.getElementById('gen1-level-display');
const gen2NameDisplay = document.getElementById('gen2-name-display');
const gen2LevelDisplay = document.getElementById('gen2-level-display');
const gen3NameDisplay = document.getElementById('gen3-name-display');
const gen3LevelDisplay = document.getElementById('gen3-level-display');
const gen4NameDisplay = document.getElementById('gen4-name-display');
const gen4LevelDisplay = document.getElementById('gen4-level-display');
const gen5NameDisplay = document.getElementById('gen5-name-display');
const gen5LevelDisplay = document.getElementById('gen5-level-display');
const gen6NameDisplay = document.getElementById('gen6-name-display');
const gen6LevelDisplay = document.getElementById('gen6-level-display');
const gen7NameDisplay = document.getElementById('gen7-name-display');
const gen7LevelDisplay = document.getElementById('gen7-level-display');
const gen8NameDisplay = document.getElementById('gen8-name-display');
const gen8LevelDisplay = document.getElementById('gen8-level-display');
const gen9NameDisplay = document.getElementById('gen9-name-display');
const gen9LevelDisplay = document.getElementById('gen9-level-display');

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

function formatNumber(num) {
    if (num === undefined || num === null) {
        return '0'; // Or handle as an error/default
    }
    return num.toLocaleString('en-US');
}

function updateDisplay() {
    cashDisplay.textContent = formatNumber(cash); // Keep this

    // Generator 1 (always visible)
    // Ensure buyGen1Button and its parent .generator-action-row exist before trying to set style
    if (buyGen1Button && buyGen1Button.closest('.generator-action-row')) {
        buyGen1Button.closest('.generator-action-row').style.visibility = 'visible';
    }

    // Generator 2 visibility
    if (buyGen2Button && buyGen2Button.closest('.generator-action-row')) {
        if (gen1TotalCount >= 5) {
            buyGen2Button.closest('.generator-action-row').style.visibility = 'visible';
        } else {
            buyGen2Button.closest('.generator-action-row').style.visibility = 'hidden';
        }
    }

    // Generator 3 visibility
    if (buyGen3Button && buyGen3Button.closest('.generator-action-row')) {
        if (gen2TotalCount >= 5) {
            buyGen3Button.closest('.generator-action-row').style.visibility = 'visible';
        } else {
            buyGen3Button.closest('.generator-action-row').style.visibility = 'hidden';
        }
    }

    // Generator 4 visibility
    if (buyGen4Button && buyGen4Button.closest('.generator-action-row')) {
        if (gen3TotalCount >= 5) {
            buyGen4Button.closest('.generator-action-row').style.visibility = 'visible';
        } else {
            buyGen4Button.closest('.generator-action-row').style.visibility = 'hidden';
        }
    }

    // Generator 5 visibility
    if (buyGen5Button && buyGen5Button.closest('.generator-action-row')) {
        if (gen4TotalCount >= 5) {
            buyGen5Button.closest('.generator-action-row').style.visibility = 'visible';
        } else {
            buyGen5Button.closest('.generator-action-row').style.visibility = 'hidden';
        }
    }

    // Generator 6 visibility
    if (buyGen6Button && buyGen6Button.closest('.generator-action-row')) {
        if (gen5TotalCount >= 5) {
            buyGen6Button.closest('.generator-action-row').style.visibility = 'visible';
        } else {
            buyGen6Button.closest('.generator-action-row').style.visibility = 'hidden';
        }
    }

    // Generator 7 visibility
    if (buyGen7Button && buyGen7Button.closest('.generator-action-row')) {
        if (gen6TotalCount >= 5) {
            buyGen7Button.closest('.generator-action-row').style.visibility = 'visible';
        } else {
            buyGen7Button.closest('.generator-action-row').style.visibility = 'hidden';
        }
    }

    // Generator 8 visibility
    if (buyGen8Button && buyGen8Button.closest('.generator-action-row')) {
        if (gen7TotalCount >= 5) {
            buyGen8Button.closest('.generator-action-row').style.visibility = 'visible';
        } else {
            buyGen8Button.closest('.generator-action-row').style.visibility = 'hidden';
        }
    }

    // Generator 9 visibility
    if (buyGen9Button && buyGen9Button.closest('.generator-action-row')) {
        if (gen8TotalCount >= 5) {
            buyGen9Button.closest('.generator-action-row').style.visibility = 'visible';
        } else {
            buyGen9Button.closest('.generator-action-row').style.visibility = 'hidden';
        }
    }

    gen1NameDisplay.textContent = "Generator1";
    let producedCount1 = gen1TotalCount - gen1PurchasedCount;
    if (producedCount1 <= 0) {
        gen1LevelDisplay.textContent = "lv " + formatNumber(gen1PurchasedCount);
    } else {
        gen1LevelDisplay.textContent = "lv " + formatNumber(gen1PurchasedCount) + " + " + formatNumber(producedCount1);
    }
    buyGen1Button.innerHTML = "Buy<br>Cost: " + formatNumber(gen1Cost);

    gen2NameDisplay.textContent = "Generator2";
    let producedCount2 = gen2TotalCount - gen2PurchasedCount;
    if (producedCount2 <= 0) {
        gen2LevelDisplay.textContent = "lv " + formatNumber(gen2PurchasedCount);
    } else {
        gen2LevelDisplay.textContent = "lv " + formatNumber(gen2PurchasedCount) + " + " + formatNumber(producedCount2);
    }
    buyGen2Button.innerHTML = "Buy<br>Cost: " + formatNumber(gen2Cost);

    gen3NameDisplay.textContent = "Generator3";
    let producedCount3 = gen3TotalCount - gen3PurchasedCount;
    if (producedCount3 <= 0) {
        gen3LevelDisplay.textContent = "lv " + formatNumber(gen3PurchasedCount);
    } else {
        gen3LevelDisplay.textContent = "lv " + formatNumber(gen3PurchasedCount) + " + " + formatNumber(producedCount3);
    }
    buyGen3Button.innerHTML = "Buy<br>Cost: " + formatNumber(gen3Cost);

    gen4NameDisplay.textContent = "Generator4";
    let producedCount4 = gen4TotalCount - gen4PurchasedCount;
    if (producedCount4 <= 0) {
        gen4LevelDisplay.textContent = "lv " + formatNumber(gen4PurchasedCount);
    } else {
        gen4LevelDisplay.textContent = "lv " + formatNumber(gen4PurchasedCount) + " + " + formatNumber(producedCount4);
    }
    buyGen4Button.innerHTML = "Buy<br>Cost: " + formatNumber(gen4Cost);

    gen5NameDisplay.textContent = "Generator5";
    let producedCount5 = gen5TotalCount - gen5PurchasedCount;
    if (producedCount5 <= 0) {
        gen5LevelDisplay.textContent = "lv " + formatNumber(gen5PurchasedCount);
    } else {
        gen5LevelDisplay.textContent = "lv " + formatNumber(gen5PurchasedCount) + " + " + formatNumber(producedCount5);
    }
    buyGen5Button.innerHTML = "Buy<br>Cost: " + formatNumber(gen5Cost);

    gen6NameDisplay.textContent = "Generator6";
    let producedCount6 = gen6TotalCount - gen6PurchasedCount;
    if (producedCount6 <= 0) {
        gen6LevelDisplay.textContent = "lv " + formatNumber(gen6PurchasedCount);
    } else {
        gen6LevelDisplay.textContent = "lv " + formatNumber(gen6PurchasedCount) + " + " + formatNumber(producedCount6);
    }
    buyGen6Button.innerHTML = "Buy<br>Cost: " + formatNumber(gen6Cost);

    gen7NameDisplay.textContent = "Generator7";
    let producedCount7 = gen7TotalCount - gen7PurchasedCount;
    if (producedCount7 <= 0) {
        gen7LevelDisplay.textContent = "lv " + formatNumber(gen7PurchasedCount);
    } else {
        gen7LevelDisplay.textContent = "lv " + formatNumber(gen7PurchasedCount) + " + " + formatNumber(producedCount7);
    }
    buyGen7Button.innerHTML = "Buy<br>Cost: " + formatNumber(gen7Cost);

    gen8NameDisplay.textContent = "Generator8";
    let producedCount8 = gen8TotalCount - gen8PurchasedCount;
    if (producedCount8 <= 0) {
        gen8LevelDisplay.textContent = "lv " + formatNumber(gen8PurchasedCount);
    } else {
        gen8LevelDisplay.textContent = "lv " + formatNumber(gen8PurchasedCount) + " + " + formatNumber(producedCount8);
    }
    buyGen8Button.innerHTML = "Buy<br>Cost: " + formatNumber(gen8Cost);

    gen9NameDisplay.textContent = "Generator9";
    let producedCount9 = gen9TotalCount - gen9PurchasedCount;
    if (producedCount9 <= 0) {
        gen9LevelDisplay.textContent = "lv " + formatNumber(gen9PurchasedCount);
    } else {
        gen9LevelDisplay.textContent = "lv " + formatNumber(gen9PurchasedCount) + " + " + formatNumber(producedCount9);
    }
    buyGen9Button.innerHTML = "Buy<br>Cost: " + formatNumber(gen9Cost);
}

buyGen1Button.addEventListener('click', () => {
    if (cash >= gen1Cost) {
        cash -= gen1Cost;
        gen1TotalCount++;
        gen1PurchasedCount++;
        gen1Cost = Math.ceil(gen1Cost * 1.15); // Increase cost by 15%
        updateDisplay();
    }
});

buyGen3Button.addEventListener('click', () => {
    if (cash >= gen3Cost) {
        cash -= gen3Cost;
        gen3TotalCount++;
        gen3PurchasedCount++;
        gen3Cost = Math.ceil(gen3Cost * 1.20); // Increase cost by 20%
        updateDisplay();
    }
});

buyGen4Button.addEventListener('click', () => {
    if (cash >= gen4Cost) {
        cash -= gen4Cost;
        gen4TotalCount++;
        gen4PurchasedCount++;
        gen4Cost = Math.ceil(gen4Cost * 1.20); // Increase cost by 20%
        updateDisplay();
    }
});

buyGen5Button.addEventListener('click', () => {
    if (cash >= gen5Cost) {
        cash -= gen5Cost;
        gen5TotalCount++;
        gen5PurchasedCount++;
        gen5Cost = Math.ceil(gen5Cost * 1.20); // Increase cost by 20%
        updateDisplay();
    }
});

buyGen6Button.addEventListener('click', () => {
    if (cash >= gen6Cost) {
        cash -= gen6Cost;
        gen6TotalCount++;
        gen6PurchasedCount++;
        gen6Cost = Math.ceil(gen6Cost * 1.20); // Increase cost by 20%
        updateDisplay();
    }
});

buyGen7Button.addEventListener('click', () => {
    if (cash >= gen7Cost) {
        cash -= gen7Cost;
        gen7TotalCount++;
        gen7PurchasedCount++;
        gen7Cost = Math.ceil(gen7Cost * 1.20); // Increase cost by 20%
        updateDisplay();
    }
});

buyGen8Button.addEventListener('click', () => {
    if (cash >= gen8Cost) {
        cash -= gen8Cost;
        gen8TotalCount++;
        gen8PurchasedCount++;
        gen8Cost = Math.ceil(gen8Cost * 1.20); // Increase cost by 20%
        updateDisplay();
    }
});

buyGen9Button.addEventListener('click', () => {
    if (cash >= gen9Cost) {
        cash -= gen9Cost;
        gen9TotalCount++;
        gen9PurchasedCount++;
        gen9Cost = Math.ceil(gen9Cost * 1.20); // Increase cost by 20%
        updateDisplay();
    }
});

buyGen2Button.addEventListener('click', () => {
    if (cash >= gen2Cost) {
        cash -= gen2Cost;
        gen2TotalCount++;
        gen2PurchasedCount++;
        gen2Cost = Math.ceil(gen2Cost * 1.20); // Increase cost by 20%
        updateDisplay();
    }
});

// Game loop - called every second
setInterval(() => {
    cash += gen1TotalCount; // Gen1 produces 1 cash per second
    gen1TotalCount += gen2TotalCount; // Gen2 produces 1 Gen1 per second
    gen2TotalCount += gen3TotalCount; // Gen3 produces 1 Gen2 per second
    gen3TotalCount += gen4TotalCount; // Gen4 produces 1 Gen3 per second
    gen4TotalCount += gen5TotalCount; // Gen5 produces 1 Gen4 per second
    gen5TotalCount += gen6TotalCount; // Gen6 produces 1 Gen5 per second
    gen6TotalCount += gen7TotalCount; // Gen7 produces 1 Gen6 per second
    gen7TotalCount += gen8TotalCount; // Gen8 produces 1 Gen7 per second
    gen8TotalCount += gen9TotalCount; // Gen9 produces 1 Gen8 per second

    // Win condition (example: reach 1,000,000 cash)
    if (cash >= Math.pow(2, 32)) { // Updated win condition
        winMessage.style.display = 'block';
        // Potentially disable buttons or stop game updates here
    }

    updateDisplay();
}, 1000);

// Initial display update
updateDisplay();
