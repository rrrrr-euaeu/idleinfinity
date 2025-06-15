// Game logic for Idle Infinity Game will go here.
// Basic structure and initial values

const FIRST_GOAL_CASH = 2147483647; // Math.pow(2, 31) - 1
const GENERATOR_UNLOCK_THRESHOLD = 5;
const INITIAL_CASH = 10;
const MAX_BUY_SAFETY_LIMIT = 10000;
let prestigePoints = 0;
let gameHasReachedFirstGoal = false; // Flag to manage goal state
let selectedNumberFormat = 'standard'; // Default number format
let resetBoostRate = 1.0;

const generatorsData = [
    {
        id: 1,
        namePrefix: "Generator",
        initialCost: 10, // Stays 10 for reset purposes
        currentCost: 12, // Cost for the *next* purchase (effectively the 2nd generator)
        costIncreaseRate: 1.15,
        totalCount: 1,   // Starts with 1 generator
        purchasedCount: 1, // Assumed this one was 'purchased' at start
        boostRate: 1.0,
        themeColor: '#FF6B6B', // Coral Red
        nameDisplayId: 'gen1-name-display',
        levelDisplayId: 'gen1-level-display',
        buttonId: 'buy-gen1',
        nameDisplayElement: null,
        levelDisplayElement: null,
        buttonElement: null,
        actionRowElement: null // To be populated later
    },
    {
        id: 2,
        namePrefix: "Generator",
        initialCost: 100,
        currentCost: 100,
        costIncreaseRate: 1.20,
        totalCount: 0,
        purchasedCount: 0,
        boostRate: 1.0,
        themeColor: '#FFD166', // Sunglow Yellow
        nameDisplayId: 'gen2-name-display',
        levelDisplayId: 'gen2-level-display',
        buttonId: 'buy-gen2',
        nameDisplayElement: null,
        levelDisplayElement: null,
        buttonElement: null,
        actionRowElement: null
    },
    {
        id: 3,
        namePrefix: "Generator",
        initialCost: 1000,
        currentCost: 1000,
        costIncreaseRate: 1.20,
        totalCount: 0,
        purchasedCount: 0,
        boostRate: 1.0,
        themeColor: '#06D6A0', // Caribbean Green
        nameDisplayId: 'gen3-name-display',
        levelDisplayId: 'gen3-level-display',
        buttonId: 'buy-gen3',
        nameDisplayElement: null,
        levelDisplayElement: null,
        buttonElement: null,
        actionRowElement: null
    },
    {
        id: 4,
        namePrefix: "Generator",
        initialCost: 10000,
        currentCost: 10000,
        costIncreaseRate: 1.20,
        totalCount: 0,
        purchasedCount: 0,
        boostRate: 1.0,
        themeColor: '#118AB2', // Blue Sapphire
        nameDisplayId: 'gen4-name-display',
        levelDisplayId: 'gen4-level-display',
        buttonId: 'buy-gen4',
        nameDisplayElement: null,
        levelDisplayElement: null,
        buttonElement: null,
        actionRowElement: null
    },
    {
        id: 5,
        namePrefix: "Generator",
        initialCost: 100000,
        currentCost: 100000,
        costIncreaseRate: 1.20,
        totalCount: 0,
        purchasedCount: 0,
        boostRate: 1.0,
        themeColor: '#073B4C', // Midnight Blue
        nameDisplayId: 'gen5-name-display',
        levelDisplayId: 'gen5-level-display',
        buttonId: 'buy-gen5',
        nameDisplayElement: null,
        levelDisplayElement: null,
        buttonElement: null,
        actionRowElement: null
    },
    {
        id: 6,
        namePrefix: "Generator",
        initialCost: 1000000,
        currentCost: 1000000,
        costIncreaseRate: 1.20,
        totalCount: 0,
        purchasedCount: 0,
        boostRate: 1.0,
        themeColor: '#E76F51', // Burnt Sienna
        nameDisplayId: 'gen6-name-display',
        levelDisplayId: 'gen6-level-display',
        buttonId: 'buy-gen6',
        nameDisplayElement: null,
        levelDisplayElement: null,
        buttonElement: null,
        actionRowElement: null
    },
    {
        id: 7,
        namePrefix: "Generator",
        initialCost: 10000000,
        currentCost: 10000000,
        costIncreaseRate: 1.20,
        totalCount: 0,
        purchasedCount: 0,
        boostRate: 1.0,
        themeColor: '#F4A261', // Sandy Brown
        nameDisplayId: 'gen7-name-display',
        levelDisplayId: 'gen7-level-display',
        buttonId: 'buy-gen7',
        nameDisplayElement: null,
        levelDisplayElement: null,
        buttonElement: null,
        actionRowElement: null
    },
    {
        id: 8,
        namePrefix: "Generator",
        initialCost: 100000000,
        currentCost: 100000000,
        costIncreaseRate: 1.20,
        totalCount: 0,
        purchasedCount: 0,
        boostRate: 1.0,
        themeColor: '#2A9D8F', // Jungle Green
        nameDisplayId: 'gen8-name-display',
        levelDisplayId: 'gen8-level-display',
        buttonId: 'buy-gen8',
        nameDisplayElement: null,
        levelDisplayElement: null,
        buttonElement: null,
        actionRowElement: null
    },
    {
        id: 9,
        namePrefix: "Generator",
        initialCost: 1000000000,
        currentCost: 1000000000,
        costIncreaseRate: 1.20,
        totalCount: 0,
        purchasedCount: 0,
        boostRate: 1.0,
        themeColor: '#9B5DE5', // Lavender Indigo
        nameDisplayId: 'gen9-name-display',
        levelDisplayId: 'gen9-level-display',
        buttonId: 'buy-gen9',
        nameDisplayElement: null,
        levelDisplayElement: null,
        buttonElement: null,
        actionRowElement: null
    }
];

let selectedBuyAmount = 1; // Default buy amount
let cash = 0; // Changed initial cash to 0
// Old individual generator state variables (genXTotalCount, genXPurchasedCount, genXCost) removed.
// This data is now managed within the objects in the generatorsData array.

const cashDisplay = document.getElementById('cash');
// Obsolete generator-specific DOM constants removed.
// Their references are now populated within generatorsData array.
const winMessage = document.getElementById('win-message'); // This is actually milestoneMessage, but keeping as-is if not specified to change this specific line. The HTML has milestone-message.
const buyAmountRadios = document.querySelectorAll('input[name="buyAmount"]');
const prestigePointsDisplay = document.getElementById('prestige-points-display');
const resetContainer = document.getElementById('reset-container');
const milestoneMessage = document.getElementById('milestone-message'); // This was #win-message
const resetButton = document.getElementById('reset-button');
const prestigeInfoContainer = document.getElementById('prestige-info-container');
const optionsButton = document.getElementById('options-button');
const optionsPanel = document.getElementById('options-panel');
// const closeOptionsButton = document.getElementById('close-options-button'); // Removed
const numberFormatRadios = document.querySelectorAll('input[name="numberFormat"]');
const incomePerSecondDisplay = document.getElementById('income-per-second-display');
const resetBoostInfoContainer = document.getElementById('reset-boost-info-container'); // Already exists, but good to confirm
const resetBoostDisplay = document.getElementById('reset-boost-display');
const totalBoostFormulaDisplay = document.getElementById('total-boost-formula-display');


generatorsData.forEach(gen => {
    gen.nameDisplayElement = document.getElementById(gen.nameDisplayId);
    gen.levelDisplayElement = document.getElementById(gen.levelDisplayId);
    gen.buttonElement = document.getElementById(gen.buttonId);
    if (gen.buttonElement) { // Ensure buttonElement was found before trying to use it
        gen.buttonElement.style.setProperty('--gen-button-bg-color', gen.themeColor); // Set CSS custom property
        gen.actionRowElement = gen.buttonElement.closest('.generator-action-row');
        if (gen.actionRowElement) { // Ensure actionRowElement exists before querying inside it
            gen.boostDisplayElement = gen.actionRowElement.querySelector('.generator-boost-display');
        } else {
            gen.boostDisplayElement = null;
        }
    } else {
        // console.error("Button not found for generator:", gen.id); // Optional error logging
        gen.actionRowElement = null;
        gen.boostDisplayElement = null;
    }
});

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

if (resetButton) { // Check if resetButton was successfully found
    resetButton.addEventListener('click', () => {
        // 1. Increment prestige points and reset boost
        prestigePoints++;
        resetBoostRate += 1.0;

        // 2. Reset game progress variables
        cash = 0; // Corrected: Reset cash to 0

        // Reset generator states using generatorsData array
        generatorsData.forEach(gen => {
            if (gen.id === 1) {
                gen.totalCount = 1;
                gen.purchasedCount = 1;
                // gen.initialCost is 10, gen.costIncreaseRate is 1.15
                gen.currentCost = Math.ceil(gen.initialCost * gen.costIncreaseRate); // Should be 12
            } else {
                gen.totalCount = 0;
                gen.purchasedCount = 0;
                gen.currentCost = gen.initialCost;
            }
            gen.boostRate = 1.0; // Reset boost rate for ALL generators
        });

        // Buy amount selector is NOT reset

        // 3. Reset UI states related to goal achievement
        if (resetContainer) {
            resetContainer.style.height = '0px'; // Hide reset container
        }
        gameHasReachedFirstGoal = false; // Reset goal flag

        // 4. Update the display
        updateDisplay();
    });
}

// Listener for the main "Options" button to toggle the panel and change icon
if (optionsButton && optionsPanel) {
    optionsButton.addEventListener('click', () => {
        optionsPanel.classList.toggle('open');
        if (optionsPanel.classList.contains('open')) {
            optionsButton.textContent = '✖️'; // Or '✕', '✖'
        } else {
            optionsButton.textContent = '⚙️';
        }
    });
}

// Listener for the "Close" button inside the options panel - REMOVED

// Listeners for number format radio buttons
if (numberFormatRadios) {
    numberFormatRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) { // Ensure the event is for the selected radio
                selectedNumberFormat = radio.value;
                updateDisplay(); // Update all numbers based on new format
            }
        });
    });
}

function formatStandard(num) {
    if (num === undefined || num === null) return '0';
    if (num === 0) return '0';

    // Scientific notation for numbers >= 1e18 (1京)
    if (num >= 1e18) {
        return num.toExponential(2).replace('e+', 'e');
    }

    // Suffix notation for Qa (1千兆 = 1e15) for numbers in [1e15, 1e18)
    if (num >= 1e15) {
        let value = num / 1e15;
        if (value < 10) return value.toFixed(2) + 'Qa'; // e.g., 1.23Qa
        if (value < 100) return value.toFixed(1) + 'Qa';// e.g., 12.3Qa
        return Math.floor(value).toFixed(0) + 'Qa'; // e.g., 123Qa
    }

    // Suffix notation for T (1兆 = 1e12) for numbers in [1e12, 1e15)
    if (num >= 1e12) {
        let value = num / 1e12;
        if (value < 10) return value.toFixed(2) + 'T';
        if (value < 100) return value.toFixed(1) + 'T';
        return Math.floor(value).toFixed(0) + 'T';
    }

    // Suffix notation for B (10億 = 1e9) for numbers in [1e9, 1e12)
    if (num >= 1e9) {
        let value = num / 1e9;
        if (value < 10) return value.toFixed(2) + 'B';
        if (value < 100) return value.toFixed(1) + 'B';
        return Math.floor(value).toFixed(0) + 'B';
    }

    // Standard comma formatting for numbers < 1e9
    // Ensure no decimal places for these smaller numbers unless they are inherently fractional.
    // Given game context, cash and costs are likely integers until they become very large.
    return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function formatHex(num) {
    if (num === undefined || num === null) return '0';
    if (num === 0) return '0';
    if (num < 0) return '-' + formatHex(Math.abs(num)); // Handle negative numbers if necessary

    let hexString = Math.floor(num).toString(16).toLowerCase(); // Ensure integer, convert to hex, lowercase

    // Add space every 4 characters from the right
    let formattedHexString = '';
    for (let i = 0; i < hexString.length; i++) {
        if (i > 0 && (hexString.length - i) % 4 === 0) {
            formattedHexString += ' ';
        }
        formattedHexString += hexString[i];
    }
    return formattedHexString;
}

function formatScientific(num) {
    if (num === undefined || num === null) return '0';
    if (num === 0) return '0.00e0'; // Or just '0' if preferred for zero

    // toExponential(2) gives two digits after the decimal point.
    // Replace 'e+' with 'e' for a cleaner look if desired, or keep 'e+'.
    return num.toExponential(2).replace('e+', 'e');
}

function formatTimeToBuy(totalSeconds) {
    if (!isFinite(totalSeconds) || totalSeconds < 0) {
        return "way too much"; // Handles Infinity or negative seconds
    }
    // Correctly handle 0 seconds or very small positive numbers that would floor to 0s
    if (totalSeconds < 1 && totalSeconds >= 0) {
        return "0s";
    }
    if (totalSeconds < 60) {
        return Math.floor(totalSeconds) + "s";
    }

    // Check for "way too much" (999 years or more)
    const secondsInDay = 24 * 60 * 60;
    const secondsInYear = 365 * secondsInDay; // Approximate for display
    if (totalSeconds >= 999 * secondsInYear) {
        return "way too much";
    }

    let remainingSeconds = Math.floor(totalSeconds);

    const years = Math.floor(remainingSeconds / secondsInYear);
    remainingSeconds %= secondsInYear;

    const days = Math.floor(remainingSeconds / secondsInDay);
    remainingSeconds %= secondsInDay;

    const hours = Math.floor(remainingSeconds / (60 * 60));
    remainingSeconds %= (60 * 60);

    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    let parts = [];
    if (years > 0) {
        parts.push(years + "y");
    }
    if (days > 0) {
        parts.push(days + "d");
    }

    // Always format HH:MM:SS part since totalSeconds >= 60
    // and we want it even if years/days are 0 but hours/minutes/seconds are not.
    let timeStr =
        hours.toString().padStart(2, '0') + ":" +
        minutes.toString().padStart(2, '0') + ":" +
        seconds.toString().padStart(2, '0');

    parts.push(timeStr);

    return parts.join(" ");
}

function formatNumber(num) {
    switch (selectedNumberFormat) {
        case 'standard':
            return formatStandard(num);
        case 'hex':
            return formatHex(num);
        case 'scientific':
            return formatScientific(num);
        default:
            // Fallback to standard or a simple toString if something goes wrong
            return formatStandard(num); // Or num.toString();
    }
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
        if (itemsBought >= MAX_BUY_SAFETY_LIMIT) { // Safety break for very large MAX buys, adjust if needed
            break;
        }
    }
    return { count: itemsBought, totalCost: totalSpent, costForNextSingleItemAfterMax: costOfNextItem };
}

function updateDisplay() {
    cashDisplay.textContent = formatNumber(cash);

    // Update Total Boost Formula Display
    if (totalBoostFormulaDisplay) {
        const boostFormulaParts = [];
        generatorsData.forEach(gen => {
            // Always include all generators in the formula display
            const formattedBoostRate = gen.boostRate.toFixed(3);
            boostFormulaParts.push(`<span style="color: ${gen.themeColor}; font-weight: bold;">${formattedBoostRate}</span>`);
        });

        if (prestigePoints > 0) {
            const formattedResetBoost = resetBoostRate.toFixed(1);
            // Style for grey color and bold font weight, similar to other boost numbers.
            const resetBoostSpan = `<span style="color: grey; font-weight: bold;">${formattedResetBoost}</span>`;
            boostFormulaParts.push(resetBoostSpan);
        }

        let formulaString = boostFormulaParts.join(" × ");
        // actualCashPerSecond is calculated before this block in updateDisplay
        let incomeString = `<br><span class="income-display-in-boost-area">Income: ${formatNumber(actualCashPerSecond)} /s</span>`;

        totalBoostFormulaDisplay.innerHTML = formulaString + incomeString;
    }

    // Update Prestige Points and Reset Boost Display
    if (prestigeInfoContainer) {
        if (prestigePoints > 0) {
            prestigeInfoContainer.style.display = 'inline';
            if (prestigePointsDisplay) {
                prestigePointsDisplay.textContent = formatNumber(prestigePoints);
            }
        } else {
            prestigeInfoContainer.style.display = 'none';
        }
    }
    if (resetBoostInfoContainer) {
        if (prestigePoints > 0) {
            resetBoostInfoContainer.style.display = 'inline';
            if (resetBoostDisplay) {
                resetBoostDisplay.textContent = resetBoostRate.toFixed(1);
            }
        } else {
            resetBoostInfoContainer.style.display = 'none';
        }
    }

    // Update Income Per Second Display
    let combinedGeneratorBoostForIncome = 1.0;
    generatorsData.forEach(g => { combinedGeneratorBoostForIncome *= g.boostRate; });
    let actualCashPerSecond = 0;
    if (generatorsData[0] && generatorsData[0].totalCount > 0) {
        actualCashPerSecond = generatorsData[0].totalCount * combinedGeneratorBoostForIncome * resetBoostRate;
    }
    // if (incomePerSecondDisplay) { // Old income display - commented out
    //     incomePerSecondDisplay.textContent = formatNumber(actualCashPerSecond);
    // }

    generatorsData.forEach((gen, index) => {
        // Visibility Control
        if (gen.actionRowElement) {
            if (gen.id === 1) {
                gen.actionRowElement.style.visibility = 'visible';
            } else {
                const prevGen = generatorsData[index - 1];
                if (prevGen && prevGen.totalCount >= GENERATOR_UNLOCK_THRESHOLD) {
                    gen.actionRowElement.style.visibility = 'visible';
                } else {
                    gen.actionRowElement.style.visibility = 'hidden';
                }
            }
        }

        // Update Name Display
        if (gen.nameDisplayElement) {
            gen.nameDisplayElement.textContent = gen.namePrefix + gen.id;
        }

        // Update Level Display
        if (gen.levelDisplayElement) {
            let producedCount = gen.totalCount - gen.purchasedCount;
            if (producedCount < 0) producedCount = 0; // Ensure producedCount isn't negative
            if (producedCount <= 0) {
                gen.levelDisplayElement.textContent = "lv " + formatNumber(gen.purchasedCount);
            } else {
                gen.levelDisplayElement.textContent = "lv " + formatNumber(gen.purchasedCount) + " + " + formatNumber(producedCount);
            }
        }
        // Generator-Specific Boost Display
        if (gen.boostDisplayElement) {
            gen.boostDisplayElement.textContent = "Boost: " + gen.boostRate.toFixed(3);
        }

        // Update Buy Button
        if (gen.buttonElement) {
            let displayAmount;
            let currentTotalCost;

            if (selectedBuyAmount === 'MAX') {
                const maxInfo = calculateMaxBuyableAmount(cash, gen.currentCost, gen.costIncreaseRate);
                if (maxInfo.count === 0) {
                    displayAmount = 1;
                    currentTotalCost = gen.currentCost;
                } else {
                    displayAmount = maxInfo.count;
                    currentTotalCost = maxInfo.totalCost;
                }
            } else {
                displayAmount = selectedBuyAmount;
                const costInfo = calculateTotalCostForAmount(gen.currentCost, displayAmount, gen.costIncreaseRate);
                currentTotalCost = costInfo.totalCost;
            }

            // New logic for timeToBuyString
            let timeToBuyString;
            const cashNeeded = currentTotalCost - cash;
            // Ensure generatorsData[0] exists and its totalCount is valid for cashPerSecond calculation
            const cashPerSecond = (generatorsData[0] && generatorsData[0].totalCount > 0) ? generatorsData[0].totalCount : 0;

            if (cashNeeded <= 0) {
                timeToBuyString = ""; // Affordable or already have enough
            } else if (cashPerSecond === 0) {
                timeToBuyString = "No income"; // Cannot afford if no income and cashNeeded > 0
            } else {
                const secondsToAfford = Math.ceil(cashNeeded / cashPerSecond); // Apply Math.ceil()
                timeToBuyString = formatTimeToBuy(secondsToAfford);
            }

            gen.buttonElement.innerHTML =
                "Buy " + formatNumber(displayAmount) +
                "<br><span class='time-to-buy'>" + timeToBuyString + "</span>" +
                "<br>Cost: " + formatNumber(currentTotalCost);

            let canAfford = cash >= currentTotalCost && displayAmount > 0;
            gen.buttonElement.classList.toggle('can-buy', canAfford);
        }
    });
}

// New loop-based event listener setup
generatorsData.forEach(gen => {
    if (gen.buttonElement) { // Ensure the button element exists
        gen.buttonElement.addEventListener('click', () => {
            // Purchase logic for 'gen'
            let effectiveBuyAmount;
            let purchaseDetails; // To store result from helper functions

            if (selectedBuyAmount === 'MAX') {
                purchaseDetails = calculateMaxBuyableAmount(cash, gen.currentCost, gen.costIncreaseRate);
                effectiveBuyAmount = purchaseDetails.count;
            } else {
                effectiveBuyAmount = selectedBuyAmount;
                purchaseDetails = calculateTotalCostForAmount(gen.currentCost, effectiveBuyAmount, gen.costIncreaseRate);
            }

            if (cash >= purchaseDetails.totalCost && effectiveBuyAmount > 0) {
                cash -= purchaseDetails.totalCost;

                for (let i = 0; i < effectiveBuyAmount; i++) {
                    gen.totalCount++;
                    gen.purchasedCount++;
                }

                // Update currentCost to the cost of the very next item
                if (selectedBuyAmount === 'MAX') {
                    gen.currentCost = purchaseDetails.costForNextSingleItemAfterMax;
                } else {
                    gen.currentCost = purchaseDetails.costForNextSingleItem;
                }
                updateDisplay();
            }
        });
    }
});

// Game loop - called every second
setInterval(() => {
    // Update generator boost rates
    generatorsData.forEach(gen => {
        if (gen.totalCount > 0) {
            gen.boostRate += 0.001;
            // Optional: Cap boostRate if needed, e.g., gen.boostRate = Math.min(gen.boostRate, MAX_BOOST_RATE);
            // For now, no cap as per current plan.
        }
    });

    // Calculate effective total boost from all generators
    let combinedGeneratorBoost = 1.0;
    generatorsData.forEach(gen => {
        combinedGeneratorBoost *= gen.boostRate;
    });

    // Calculate cash produced this tick
    let cashProducedThisTick = 0;
    if (generatorsData[0] && generatorsData[0].totalCount > 0) {
        cashProducedThisTick = generatorsData[0].totalCount * combinedGeneratorBoost * resetBoostRate;
    }

    cash += cashProducedThisTick;

    // Generator production (e.g., Gen9 produces Gen8, ..., Gen2 produces Gen1)
    for (let i = generatorsData.length - 1; i > 0; i--) {
        // generatorsData[i] is the producing generator (e.g., Gen9 if i=8)
        // generatorsData[i-1] is the generator being produced (e.g., Gen8 if i=8)
        if (generatorsData[i].totalCount > 0) { // Only produce if the producing generator exists
            generatorsData[i-1].totalCount += generatorsData[i].totalCount;
        }
    }

    // First Goal Achievement Check
    if (!gameHasReachedFirstGoal && cash >= FIRST_GOAL_CASH) {
        if (milestoneMessage && milestoneMessage.querySelector('h2')) {
            milestoneMessage.querySelector('h2').textContent = 'First Critical Point Reached!';
        }
        if (resetContainer) {
            // To make the height transition work, the container needs to be block/flex etc.
            // It's currently height:0, overflow:hidden.
            // Setting a specific target height or using scrollHeight.
            // Let's try a fixed estimated height first for simplicity, can be refined.
            // Estimate based on h2 font size (1.8em ~30px) + button padding/size (~50px) + margins.
            // Say, roughly 120px to 150px. Let's use 130px as an example.
            // A more robust way is to temporarily set height to auto, get scrollHeight, then set to that.
            // For this subtask, let's use a fixed height:
            resetContainer.style.height = '130px'; // Example height, adjust based on actual content
        }
        gameHasReachedFirstGoal = true;
        // Optional: Code to disable further generator purchases could go here
        // For example, by adding a class to all buy buttons or setting a global flag.
    }

    updateDisplay();
}, 1000);

// Initial display update
updateDisplay();
