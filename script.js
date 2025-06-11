// Game logic for Idle Infinity Game will go here.
// Basic structure and initial values

let selectedBuyAmount = 1; // Default buy amount
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
const buyAmountRadios = document.querySelectorAll('input[name="buyAmount"]');

buyAmountRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        if (radio.value === 'MAX') {
            selectedBuyAmount = 'MAX';
        } else {
            selectedBuyAmount = parseInt(radio.value);
        }
        updateDisplay(); // Call updateDisplay to refresh UI based on new selection
    });
});

function formatNumber(num) {
    if (num === undefined || num === null) {
        return '0'; // Or handle as an error/default
    }
    return num.toLocaleString('en-US');
}

// Calculates the total cost for buying a specific amount of a generator
// and the cost of the very next single purchase after these 'amount' purchases.
function calculateTotalCostForAmount(currentGeneratorCost, numberOfItems, costIncreaseRate) {
    let calculatedTotalCost = 0;
    let nextCostAfterLoop = currentGeneratorCost;

    if (numberOfItems <= 0) {
        return { totalCost: 0, costForNextSingleItem: currentGeneratorCost };
    }

    for (let i = 0; i < numberOfItems; i++) {
        calculatedTotalCost += nextCostAfterLoop;
        nextCostAfterLoop = Math.ceil(nextCostAfterLoop * costIncreaseRate);
    }
    // nextCostAfterLoop now holds the cost for the item AFTER the 'numberOfItems' have been purchased.
    return { totalCost: calculatedTotalCost, costForNextSingleItem: nextCostAfterLoop };
}

// Calculates the maximum number of items that can be bought with currentCash,
// considering the increasing cost, and the total cost for that maximum number.
function calculateMaxBuyableAmount(currentCash, currentGeneratorCost, costIncreaseRate) {
    let itemsBought = 0;
    let totalSpent = 0;
    let costOfNextItem = currentGeneratorCost;

    while (currentCash >= totalSpent + costOfNextItem) {
        totalSpent += costOfNextItem;
        itemsBought++;
        costOfNextItem = Math.ceil(costOfNextItem * costIncreaseRate);
        if (itemsBought >= 10000) { // Safety break for very large MAX buys, adjust if needed
            break;
        }
    }
    return { count: itemsBought, totalCost: totalSpent, costForNextSingleItemAfterMax: costOfNextItem };
}

function updateDisplay() {
    cashDisplay.textContent = formatNumber(cash); // Keep this

    // --- Visibility Logic (from previous step, unchanged) ---
    if (buyGen1Button && buyGen1Button.closest('.generator-action-row')) {
        buyGen1Button.closest('.generator-action-row').style.visibility = 'visible';
    }
    if (buyGen2Button && buyGen2Button.closest('.generator-action-row')) {
        if (gen1TotalCount >= 5) { buyGen2Button.closest('.generator-action-row').style.visibility = 'visible'; }
        else { buyGen2Button.closest('.generator-action-row').style.visibility = 'hidden'; }
    }
    if (buyGen3Button && buyGen3Button.closest('.generator-action-row')) {
        if (gen2TotalCount >= 5) { buyGen3Button.closest('.generator-action-row').style.visibility = 'visible'; }
        else { buyGen3Button.closest('.generator-action-row').style.visibility = 'hidden'; }
    }
    if (buyGen4Button && buyGen4Button.closest('.generator-action-row')) {
        if (gen3TotalCount >= 5) { buyGen4Button.closest('.generator-action-row').style.visibility = 'visible'; }
        else { buyGen4Button.closest('.generator-action-row').style.visibility = 'hidden'; }
    }
    if (buyGen5Button && buyGen5Button.closest('.generator-action-row')) {
        if (gen4TotalCount >= 5) { buyGen5Button.closest('.generator-action-row').style.visibility = 'visible'; }
        else { buyGen5Button.closest('.generator-action-row').style.visibility = 'hidden'; }
    }
    if (buyGen6Button && buyGen6Button.closest('.generator-action-row')) {
        if (gen5TotalCount >= 5) { buyGen6Button.closest('.generator-action-row').style.visibility = 'visible'; }
        else { buyGen6Button.closest('.generator-action-row').style.visibility = 'hidden'; }
    }
    if (buyGen7Button && buyGen7Button.closest('.generator-action-row')) {
        if (gen6TotalCount >= 5) { buyGen7Button.closest('.generator-action-row').style.visibility = 'visible'; }
        else { buyGen7Button.closest('.generator-action-row').style.visibility = 'hidden'; }
    }
    if (buyGen8Button && buyGen8Button.closest('.generator-action-row')) {
        if (gen7TotalCount >= 5) { buyGen8Button.closest('.generator-action-row').style.visibility = 'visible'; }
        else { buyGen8Button.closest('.generator-action-row').style.visibility = 'hidden'; }
    }
    if (buyGen9Button && buyGen9Button.closest('.generator-action-row')) {
        if (gen8TotalCount >= 5) { buyGen9Button.closest('.generator-action-row').style.visibility = 'visible'; }
        else { buyGen9Button.closest('.generator-action-row').style.visibility = 'hidden'; }
    }
    // --- End of Visibility Logic ---

    // --- Generator 1 ---
    gen1NameDisplay.textContent = "Generator1";
    let producedCount1 = gen1TotalCount - gen1PurchasedCount;
    if (producedCount1 <= 0) { gen1LevelDisplay.textContent = "lv " + formatNumber(gen1PurchasedCount); }
    else { gen1LevelDisplay.textContent = "lv " + formatNumber(gen1PurchasedCount) + " + " + formatNumber(producedCount1); }
    let displayAmount1, currentTotalCost1;
    const costIncreaseRate1 = 1.15;
    if (selectedBuyAmount === 'MAX') {
        const maxInfo = calculateMaxBuyableAmount(cash, gen1Cost, costIncreaseRate1);
        displayAmount1 = maxInfo.count;
        currentTotalCost1 = maxInfo.totalCost;
    } else {
        displayAmount1 = selectedBuyAmount;
        const costInfo = calculateTotalCostForAmount(gen1Cost, displayAmount1, costIncreaseRate1);
        currentTotalCost1 = costInfo.totalCost;
    }
    if (buyGen1Button) {
        buyGen1Button.innerHTML = "Buy " + formatNumber(displayAmount1) + "<br>Cost: " + formatNumber(currentTotalCost1);
        buyGen1Button.classList.toggle('can-buy', cash >= currentTotalCost1 && displayAmount1 > 0);
    }

    // --- Generator 2 ---
    gen2NameDisplay.textContent = "Generator2";
    let producedCount2 = gen2TotalCount - gen2PurchasedCount;
    if (producedCount2 <= 0) { gen2LevelDisplay.textContent = "lv " + formatNumber(gen2PurchasedCount); }
    else { gen2LevelDisplay.textContent = "lv " + formatNumber(gen2PurchasedCount) + " + " + formatNumber(producedCount2); }
    let displayAmount2, currentTotalCost2;
    const costIncreaseRate2 = 1.20;
    if (selectedBuyAmount === 'MAX') {
        const maxInfo = calculateMaxBuyableAmount(cash, gen2Cost, costIncreaseRate2);
        displayAmount2 = maxInfo.count;
        currentTotalCost2 = maxInfo.totalCost;
    } else {
        displayAmount2 = selectedBuyAmount;
        const costInfo = calculateTotalCostForAmount(gen2Cost, displayAmount2, costIncreaseRate2);
        currentTotalCost2 = costInfo.totalCost;
    }
    if (buyGen2Button) {
        buyGen2Button.innerHTML = "Buy " + formatNumber(displayAmount2) + "<br>Cost: " + formatNumber(currentTotalCost2);
        buyGen2Button.classList.toggle('can-buy', cash >= currentTotalCost2 && displayAmount2 > 0);
    }

    // --- Generator 3 ---
    gen3NameDisplay.textContent = "Generator3";
    let producedCount3 = gen3TotalCount - gen3PurchasedCount;
    if (producedCount3 <= 0) { gen3LevelDisplay.textContent = "lv " + formatNumber(gen3PurchasedCount); }
    else { gen3LevelDisplay.textContent = "lv " + formatNumber(gen3PurchasedCount) + " + " + formatNumber(producedCount3); }
    let displayAmount3, currentTotalCost3;
    const costIncreaseRate3 = 1.20;
    if (selectedBuyAmount === 'MAX') {
        const maxInfo = calculateMaxBuyableAmount(cash, gen3Cost, costIncreaseRate3);
        displayAmount3 = maxInfo.count;
        currentTotalCost3 = maxInfo.totalCost;
    } else {
        displayAmount3 = selectedBuyAmount;
        const costInfo = calculateTotalCostForAmount(gen3Cost, displayAmount3, costIncreaseRate3);
        currentTotalCost3 = costInfo.totalCost;
    }
    if (buyGen3Button) {
        buyGen3Button.innerHTML = "Buy " + formatNumber(displayAmount3) + "<br>Cost: " + formatNumber(currentTotalCost3);
        buyGen3Button.classList.toggle('can-buy', cash >= currentTotalCost3 && displayAmount3 > 0);
    }

    // --- Generator 4 ---
    gen4NameDisplay.textContent = "Generator4";
    let producedCount4 = gen4TotalCount - gen4PurchasedCount;
    if (producedCount4 <= 0) { gen4LevelDisplay.textContent = "lv " + formatNumber(gen4PurchasedCount); }
    else { gen4LevelDisplay.textContent = "lv " + formatNumber(gen4PurchasedCount) + " + " + formatNumber(producedCount4); }
    let displayAmount4, currentTotalCost4;
    const costIncreaseRate4 = 1.20;
    if (selectedBuyAmount === 'MAX') {
        const maxInfo = calculateMaxBuyableAmount(cash, gen4Cost, costIncreaseRate4);
        displayAmount4 = maxInfo.count;
        currentTotalCost4 = maxInfo.totalCost;
    } else {
        displayAmount4 = selectedBuyAmount;
        const costInfo = calculateTotalCostForAmount(gen4Cost, displayAmount4, costIncreaseRate4);
        currentTotalCost4 = costInfo.totalCost;
    }
    if (buyGen4Button) {
        buyGen4Button.innerHTML = "Buy " + formatNumber(displayAmount4) + "<br>Cost: " + formatNumber(currentTotalCost4);
        buyGen4Button.classList.toggle('can-buy', cash >= currentTotalCost4 && displayAmount4 > 0);
    }

    // --- Generator 5 ---
    gen5NameDisplay.textContent = "Generator5";
    let producedCount5 = gen5TotalCount - gen5PurchasedCount;
    if (producedCount5 <= 0) { gen5LevelDisplay.textContent = "lv " + formatNumber(gen5PurchasedCount); }
    else { gen5LevelDisplay.textContent = "lv " + formatNumber(gen5PurchasedCount) + " + " + formatNumber(producedCount5); }
    let displayAmount5, currentTotalCost5;
    const costIncreaseRate5 = 1.20;
    if (selectedBuyAmount === 'MAX') {
        const maxInfo = calculateMaxBuyableAmount(cash, gen5Cost, costIncreaseRate5);
        displayAmount5 = maxInfo.count;
        currentTotalCost5 = maxInfo.totalCost;
    } else {
        displayAmount5 = selectedBuyAmount;
        const costInfo = calculateTotalCostForAmount(gen5Cost, displayAmount5, costIncreaseRate5);
        currentTotalCost5 = costInfo.totalCost;
    }
    if (buyGen5Button) {
        buyGen5Button.innerHTML = "Buy " + formatNumber(displayAmount5) + "<br>Cost: " + formatNumber(currentTotalCost5);
        buyGen5Button.classList.toggle('can-buy', cash >= currentTotalCost5 && displayAmount5 > 0);
    }

    // --- Generator 6 ---
    gen6NameDisplay.textContent = "Generator6";
    let producedCount6 = gen6TotalCount - gen6PurchasedCount;
    if (producedCount6 <= 0) { gen6LevelDisplay.textContent = "lv " + formatNumber(gen6PurchasedCount); }
    else { gen6LevelDisplay.textContent = "lv " + formatNumber(gen6PurchasedCount) + " + " + formatNumber(producedCount6); }
    let displayAmount6, currentTotalCost6;
    const costIncreaseRate6 = 1.20;
    if (selectedBuyAmount === 'MAX') {
        const maxInfo = calculateMaxBuyableAmount(cash, gen6Cost, costIncreaseRate6);
        displayAmount6 = maxInfo.count;
        currentTotalCost6 = maxInfo.totalCost;
    } else {
        displayAmount6 = selectedBuyAmount;
        const costInfo = calculateTotalCostForAmount(gen6Cost, displayAmount6, costIncreaseRate6);
        currentTotalCost6 = costInfo.totalCost;
    }
    if (buyGen6Button) {
        buyGen6Button.innerHTML = "Buy " + formatNumber(displayAmount6) + "<br>Cost: " + formatNumber(currentTotalCost6);
        buyGen6Button.classList.toggle('can-buy', cash >= currentTotalCost6 && displayAmount6 > 0);
    }

    // --- Generator 7 ---
    gen7NameDisplay.textContent = "Generator7";
    let producedCount7 = gen7TotalCount - gen7PurchasedCount;
    if (producedCount7 <= 0) { gen7LevelDisplay.textContent = "lv " + formatNumber(gen7PurchasedCount); }
    else { gen7LevelDisplay.textContent = "lv " + formatNumber(gen7PurchasedCount) + " + " + formatNumber(producedCount7); }
    let displayAmount7, currentTotalCost7;
    const costIncreaseRate7 = 1.20;
    if (selectedBuyAmount === 'MAX') {
        const maxInfo = calculateMaxBuyableAmount(cash, gen7Cost, costIncreaseRate7);
        displayAmount7 = maxInfo.count;
        currentTotalCost7 = maxInfo.totalCost;
    } else {
        displayAmount7 = selectedBuyAmount;
        const costInfo = calculateTotalCostForAmount(gen7Cost, displayAmount7, costIncreaseRate7);
        currentTotalCost7 = costInfo.totalCost;
    }
    if (buyGen7Button) {
        buyGen7Button.innerHTML = "Buy " + formatNumber(displayAmount7) + "<br>Cost: " + formatNumber(currentTotalCost7);
        buyGen7Button.classList.toggle('can-buy', cash >= currentTotalCost7 && displayAmount7 > 0);
    }

    // --- Generator 8 ---
    gen8NameDisplay.textContent = "Generator8";
    let producedCount8 = gen8TotalCount - gen8PurchasedCount;
    if (producedCount8 <= 0) { gen8LevelDisplay.textContent = "lv " + formatNumber(gen8PurchasedCount); }
    else { gen8LevelDisplay.textContent = "lv " + formatNumber(gen8PurchasedCount) + " + " + formatNumber(producedCount8); }
    let displayAmount8, currentTotalCost8;
    const costIncreaseRate8 = 1.20;
    if (selectedBuyAmount === 'MAX') {
        const maxInfo = calculateMaxBuyableAmount(cash, gen8Cost, costIncreaseRate8);
        displayAmount8 = maxInfo.count;
        currentTotalCost8 = maxInfo.totalCost;
    } else {
        displayAmount8 = selectedBuyAmount;
        const costInfo = calculateTotalCostForAmount(gen8Cost, displayAmount8, costIncreaseRate8);
        currentTotalCost8 = costInfo.totalCost;
    }
    if (buyGen8Button) {
        buyGen8Button.innerHTML = "Buy " + formatNumber(displayAmount8) + "<br>Cost: " + formatNumber(currentTotalCost8);
        buyGen8Button.classList.toggle('can-buy', cash >= currentTotalCost8 && displayAmount8 > 0);
    }

    // --- Generator 9 ---
    gen9NameDisplay.textContent = "Generator9";
    let producedCount9 = gen9TotalCount - gen9PurchasedCount;
    if (producedCount9 <= 0) { gen9LevelDisplay.textContent = "lv " + formatNumber(gen9PurchasedCount); }
    else { gen9LevelDisplay.textContent = "lv " + formatNumber(gen9PurchasedCount) + " + " + formatNumber(producedCount9); }
    let displayAmount9, currentTotalCost9;
    const costIncreaseRate9 = 1.20;
    if (selectedBuyAmount === 'MAX') {
        const maxInfo = calculateMaxBuyableAmount(cash, gen9Cost, costIncreaseRate9);
        displayAmount9 = maxInfo.count;
        currentTotalCost9 = maxInfo.totalCost;
    } else {
        displayAmount9 = selectedBuyAmount;
        const costInfo = calculateTotalCostForAmount(gen9Cost, displayAmount9, costIncreaseRate9);
        currentTotalCost9 = costInfo.totalCost;
    }
    if (buyGen9Button) {
        buyGen9Button.innerHTML = "Buy " + formatNumber(displayAmount9) + "<br>Cost: " + formatNumber(currentTotalCost9);
        buyGen9Button.classList.toggle('can-buy', cash >= currentTotalCost9 && displayAmount9 > 0);
    }
}

buyGen1Button.addEventListener('click', () => {
    const costIncreaseRate = 1.15;
    let purchaseDetails;
    let effectiveBuyAmount;

    if (selectedBuyAmount === 'MAX') {
        purchaseDetails = calculateMaxBuyableAmount(cash, gen1Cost, costIncreaseRate);
        effectiveBuyAmount = purchaseDetails.count;
    } else {
        effectiveBuyAmount = selectedBuyAmount;
        purchaseDetails = calculateTotalCostForAmount(gen1Cost, effectiveBuyAmount, costIncreaseRate);
    }

    if (cash >= purchaseDetails.totalCost && effectiveBuyAmount > 0) {
        cash -= purchaseDetails.totalCost;

        for (let i = 0; i < effectiveBuyAmount; i++) {
            gen1TotalCount++;
            gen1PurchasedCount++;
        }

        if (selectedBuyAmount === 'MAX') {
            gen1Cost = purchaseDetails.costForNextSingleItemAfterMax;
        } else {
            gen1Cost = purchaseDetails.costForNextSingleItem;
        }
        updateDisplay();
    }
});

buyGen3Button.addEventListener('click', () => {
    const costIncreaseRate = 1.20;
    let purchaseDetails;
    let effectiveBuyAmount;

    if (selectedBuyAmount === 'MAX') {
        purchaseDetails = calculateMaxBuyableAmount(cash, gen3Cost, costIncreaseRate);
        effectiveBuyAmount = purchaseDetails.count;
    } else {
        effectiveBuyAmount = selectedBuyAmount;
        purchaseDetails = calculateTotalCostForAmount(gen3Cost, effectiveBuyAmount, costIncreaseRate);
    }

    if (cash >= purchaseDetails.totalCost && effectiveBuyAmount > 0) {
        cash -= purchaseDetails.totalCost;

        for (let i = 0; i < effectiveBuyAmount; i++) {
            gen3TotalCount++;
            gen3PurchasedCount++;
        }

        if (selectedBuyAmount === 'MAX') {
            gen3Cost = purchaseDetails.costForNextSingleItemAfterMax;
        } else {
            gen3Cost = purchaseDetails.costForNextSingleItem;
        }
        updateDisplay();
    }
});

buyGen4Button.addEventListener('click', () => {
    const costIncreaseRate = 1.20;
    let purchaseDetails;
    let effectiveBuyAmount;

    if (selectedBuyAmount === 'MAX') {
        purchaseDetails = calculateMaxBuyableAmount(cash, gen4Cost, costIncreaseRate);
        effectiveBuyAmount = purchaseDetails.count;
    } else {
        effectiveBuyAmount = selectedBuyAmount;
        purchaseDetails = calculateTotalCostForAmount(gen4Cost, effectiveBuyAmount, costIncreaseRate);
    }

    if (cash >= purchaseDetails.totalCost && effectiveBuyAmount > 0) {
        cash -= purchaseDetails.totalCost;

        for (let i = 0; i < effectiveBuyAmount; i++) {
            gen4TotalCount++;
            gen4PurchasedCount++;
        }

        if (selectedBuyAmount === 'MAX') {
            gen4Cost = purchaseDetails.costForNextSingleItemAfterMax;
        } else {
            gen4Cost = purchaseDetails.costForNextSingleItem;
        }
        updateDisplay();
    }
});

buyGen5Button.addEventListener('click', () => {
    const costIncreaseRate = 1.20;
    let purchaseDetails;
    let effectiveBuyAmount;

    if (selectedBuyAmount === 'MAX') {
        purchaseDetails = calculateMaxBuyableAmount(cash, gen5Cost, costIncreaseRate);
        effectiveBuyAmount = purchaseDetails.count;
    } else {
        effectiveBuyAmount = selectedBuyAmount;
        purchaseDetails = calculateTotalCostForAmount(gen5Cost, effectiveBuyAmount, costIncreaseRate);
    }

    if (cash >= purchaseDetails.totalCost && effectiveBuyAmount > 0) {
        cash -= purchaseDetails.totalCost;

        for (let i = 0; i < effectiveBuyAmount; i++) {
            gen5TotalCount++;
            gen5PurchasedCount++;
        }

        if (selectedBuyAmount === 'MAX') {
            gen5Cost = purchaseDetails.costForNextSingleItemAfterMax;
        } else {
            gen5Cost = purchaseDetails.costForNextSingleItem;
        }
        updateDisplay();
    }
});

buyGen6Button.addEventListener('click', () => {
    const costIncreaseRate = 1.20;
    let purchaseDetails;
    let effectiveBuyAmount;

    if (selectedBuyAmount === 'MAX') {
        purchaseDetails = calculateMaxBuyableAmount(cash, gen6Cost, costIncreaseRate);
        effectiveBuyAmount = purchaseDetails.count;
    } else {
        effectiveBuyAmount = selectedBuyAmount;
        purchaseDetails = calculateTotalCostForAmount(gen6Cost, effectiveBuyAmount, costIncreaseRate);
    }

    if (cash >= purchaseDetails.totalCost && effectiveBuyAmount > 0) {
        cash -= purchaseDetails.totalCost;

        for (let i = 0; i < effectiveBuyAmount; i++) {
            gen6TotalCount++;
            gen6PurchasedCount++;
        }

        if (selectedBuyAmount === 'MAX') {
            gen6Cost = purchaseDetails.costForNextSingleItemAfterMax;
        } else {
            gen6Cost = purchaseDetails.costForNextSingleItem;
        }
        updateDisplay();
    }
});

buyGen7Button.addEventListener('click', () => {
    const costIncreaseRate = 1.20;
    let purchaseDetails;
    let effectiveBuyAmount;

    if (selectedBuyAmount === 'MAX') {
        purchaseDetails = calculateMaxBuyableAmount(cash, gen7Cost, costIncreaseRate);
        effectiveBuyAmount = purchaseDetails.count;
    } else {
        effectiveBuyAmount = selectedBuyAmount;
        purchaseDetails = calculateTotalCostForAmount(gen7Cost, effectiveBuyAmount, costIncreaseRate);
    }

    if (cash >= purchaseDetails.totalCost && effectiveBuyAmount > 0) {
        cash -= purchaseDetails.totalCost;

        for (let i = 0; i < effectiveBuyAmount; i++) {
            gen7TotalCount++;
            gen7PurchasedCount++;
        }

        if (selectedBuyAmount === 'MAX') {
            gen7Cost = purchaseDetails.costForNextSingleItemAfterMax;
        } else {
            gen7Cost = purchaseDetails.costForNextSingleItem;
        }
        updateDisplay();
    }
});

buyGen8Button.addEventListener('click', () => {
    const costIncreaseRate = 1.20;
    let purchaseDetails;
    let effectiveBuyAmount;

    if (selectedBuyAmount === 'MAX') {
        purchaseDetails = calculateMaxBuyableAmount(cash, gen8Cost, costIncreaseRate);
        effectiveBuyAmount = purchaseDetails.count;
    } else {
        effectiveBuyAmount = selectedBuyAmount;
        purchaseDetails = calculateTotalCostForAmount(gen8Cost, effectiveBuyAmount, costIncreaseRate);
    }

    if (cash >= purchaseDetails.totalCost && effectiveBuyAmount > 0) {
        cash -= purchaseDetails.totalCost;

        for (let i = 0; i < effectiveBuyAmount; i++) {
            gen8TotalCount++;
            gen8PurchasedCount++;
        }

        if (selectedBuyAmount === 'MAX') {
            gen8Cost = purchaseDetails.costForNextSingleItemAfterMax;
        } else {
            gen8Cost = purchaseDetails.costForNextSingleItem;
        }
        updateDisplay();
    }
});

buyGen9Button.addEventListener('click', () => {
    const costIncreaseRate = 1.20;
    let purchaseDetails;
    let effectiveBuyAmount;

    if (selectedBuyAmount === 'MAX') {
        purchaseDetails = calculateMaxBuyableAmount(cash, gen9Cost, costIncreaseRate);
        effectiveBuyAmount = purchaseDetails.count;
    } else {
        effectiveBuyAmount = selectedBuyAmount;
        purchaseDetails = calculateTotalCostForAmount(gen9Cost, effectiveBuyAmount, costIncreaseRate);
    }

    if (cash >= purchaseDetails.totalCost && effectiveBuyAmount > 0) {
        cash -= purchaseDetails.totalCost;

        for (let i = 0; i < effectiveBuyAmount; i++) {
            gen9TotalCount++;
            gen9PurchasedCount++;
        }

        if (selectedBuyAmount === 'MAX') {
            gen9Cost = purchaseDetails.costForNextSingleItemAfterMax;
        } else {
            gen9Cost = purchaseDetails.costForNextSingleItem;
        }
        updateDisplay();
    }
});

buyGen2Button.addEventListener('click', () => {
    const costIncreaseRate = 1.20;
    let purchaseDetails;
    let effectiveBuyAmount;

    if (selectedBuyAmount === 'MAX') {
        purchaseDetails = calculateMaxBuyableAmount(cash, gen2Cost, costIncreaseRate);
        effectiveBuyAmount = purchaseDetails.count;
    } else {
        effectiveBuyAmount = selectedBuyAmount;
        purchaseDetails = calculateTotalCostForAmount(gen2Cost, effectiveBuyAmount, costIncreaseRate);
    }

    if (cash >= purchaseDetails.totalCost && effectiveBuyAmount > 0) {
        cash -= purchaseDetails.totalCost;

        for (let i = 0; i < effectiveBuyAmount; i++) {
            gen2TotalCount++;
            gen2PurchasedCount++;
        }

        if (selectedBuyAmount === 'MAX') {
            gen2Cost = purchaseDetails.costForNextSingleItemAfterMax;
        } else {
            gen2Cost = purchaseDetails.costForNextSingleItem;
        }
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
