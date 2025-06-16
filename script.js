// Game logic for Idle Infinity Game will go here.
// Basic structure and initial values

const FIRST_GOAL_CASH = 2147483647; // Math.pow(2, 31) - 1
const GENERATOR_UNLOCK_THRESHOLD = 5;
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
        themeColor: '#E63946', // New Red
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
        themeColor: '#F4A261', // New Orange
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
        themeColor: '#E9C46A', // New Yellow
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
        themeColor: '#A7C957', // New Yellow-Green
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
        themeColor: '#2A9D8F', // New Green/Teal
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
        themeColor: '#57A7C9', // New Light Blue/Sky Blue
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
        themeColor: '#118AB2', // New Blue
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
        themeColor: '#9B5DE5', // New Purple/Lavender
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
        themeColor: '#F789A8', // New Pink/Rose
        nameDisplayId: 'gen9-name-display',
        levelDisplayId: 'gen9-level-display',
        buttonId: 'buy-gen9',
        nameDisplayElement: null,
        levelDisplayElement: null,
        buttonElement: null,
        actionRowElement: null
    }
];

const INITIAL_CASH = 0; // Game starts with 0 cash.
let selectedBuyAmount = 1; // Default buy amount
let cash = INITIAL_CASH;

const cashDisplay = document.getElementById('cash');
const winMessage = document.getElementById('win-message');
const buyAmountRadios = document.querySelectorAll('input[name="buyAmount"]');
const prestigePointsDisplay = document.getElementById('prestige-points-display');
const resetContainer = document.getElementById('reset-container');
const milestoneMessage = document.getElementById('milestone-message');
const resetButton = document.getElementById('reset-button');
const prestigeInfoContainer = document.getElementById('prestige-info-container');
const optionsButton = document.getElementById('options-button');
const optionsPanel = document.getElementById('options-panel');
const numberFormatRadios = document.querySelectorAll('input[name="numberFormat"]');
// const incomePerSecondDisplay = document.getElementById('income-per-second-display'); // Element removed from HTML
// const resetBoostInfoContainer = document.getElementById('reset-boost-info-container'); // Element removed from HTML
// const resetBoostDisplay = document.getElementById('reset-boost-display'); // Element removed from HTML
const totalBoostFormulaDisplay = document.getElementById('total-boost-formula-display');


generatorsData.forEach(gen => {
    gen.nameDisplayElement = document.getElementById(gen.nameDisplayId);
    gen.levelDisplayElement = document.getElementById(gen.levelDisplayId);
    gen.buttonElement = document.getElementById(gen.buttonId);
    if (gen.buttonElement) {
        gen.buttonElement.style.setProperty('--gen-button-bg-color', gen.themeColor);
        gen.actionRowElement = gen.buttonElement.closest('.generator-action-row');
        if (gen.actionRowElement) {
            gen.boostDisplayElement = gen.actionRowElement.querySelector('.generator-boost-display'); // This will be null as span was removed
        } else {
            gen.boostDisplayElement = null;
        }
    } else {
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
        updateDisplay();
    });
});

if (resetButton) {
    resetButton.addEventListener('click', () => {
        prestigePoints++;
        resetBoostRate += 1.0;
        cash = 0;

        generatorsData.forEach(gen => {
            if (gen.id === 1) {
                gen.totalCount = 1;
                gen.purchasedCount = 1;
                gen.currentCost = Math.ceil(gen.initialCost * gen.costIncreaseRate);
            } else {
                gen.totalCount = 0;
                gen.purchasedCount = 0;
                gen.currentCost = gen.initialCost;
            }
            gen.boostRate = 1.0;
        });

        if (resetContainer) {
            resetContainer.style.height = '0px';
            resetContainer.style.marginTop = '0px';
            resetContainer.style.marginBottom = '0px';
        }
        gameHasReachedFirstGoal = false;
        updateDisplay();
    });
}

if (optionsButton && optionsPanel) {
    optionsButton.addEventListener('click', () => {
        optionsPanel.classList.toggle('open');
        if (optionsPanel.classList.contains('open')) {
            optionsButton.textContent = '✖️';
        } else {
            optionsButton.textContent = '⚙️';
        }
    });
}

if (numberFormatRadios) {
    numberFormatRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                selectedNumberFormat = radio.value;
                updateDisplay();
            }
        });
    });
}

// --- New UI Update Helper Functions ---

function updateGlobalStatsDisplay(currentCash, currentPrestigePoints, currentResetBoostRate, currentActualCashPerSecond) {
    cashDisplay.textContent = formatNumber(currentCash);

    if (totalBoostFormulaDisplay) {
        const boostFormulaParts = [];
        generatorsData.forEach(gen => {
            const formattedBoostRate = formatNumber(gen.boostRate);
            boostFormulaParts.push(`<span style="color: ${gen.themeColor}; font-weight: bold;">${formattedBoostRate}</span>`);
        });

        if (currentPrestigePoints > 0) {
            const formattedResetBoost = formatNumber(currentResetBoostRate);
            const resetBoostSpan = `<span style="color: grey; font-weight: bold;">${formattedResetBoost}</span>`;
            boostFormulaParts.push(resetBoostSpan);
        }

        let formulaString = boostFormulaParts.join(" × ");
        let incomeString = `<br><span class="income-display-in-boost-area">Income: ${formatNumber(currentActualCashPerSecond)} /s</span>`;
        totalBoostFormulaDisplay.innerHTML = formulaString + incomeString;
    }

    if (prestigeInfoContainer) {
        if (currentPrestigePoints > 0) {
            prestigeInfoContainer.style.display = 'inline';
            if (prestigePointsDisplay) {
                prestigePointsDisplay.textContent = formatNumber(currentPrestigePoints);
            }
        } else {
            prestigeInfoContainer.style.display = 'none';
        }
    }
    // Logic for resetBoostInfoContainer and resetBoostDisplay (old stats bar display) was removed previously.
}

function updateSingleGeneratorRow(gen, index, currentCash, currentSelectedBuyAmount, currentActualCashPerSecond) {
    // Visibility Control
    if (gen.actionRowElement) {
        if (gen.id === 1) {
            gen.actionRowElement.style.visibility = 'visible';
        } else {
            const prevGen = generatorsData[index - 1]; // Assumes generatorsData is accessible globally
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
        if (producedCount < 0) producedCount = 0;
        if (producedCount <= 0) {
            gen.levelDisplayElement.textContent = "lv " + formatNumber(gen.purchasedCount);
        } else {
            gen.levelDisplayElement.textContent = "lv " + formatNumber(gen.purchasedCount) + " + " + formatNumber(producedCount);
        }
    }

    // Individual boost display on row was removed (gen.boostDisplayElement.textContent = ...)

    // Update Buy Button
    if (gen.buttonElement) {
        let displayAmount;
        let currentTotalCost;

        if (currentSelectedBuyAmount === 'MAX') {
            const maxInfo = calculateMaxBuyableAmount(currentCash, gen.currentCost, gen.costIncreaseRate);
            if (maxInfo.count === 0) { // If cannot afford even one, show cost for 1
                displayAmount = 1;
                currentTotalCost = gen.currentCost;
            } else {
                displayAmount = maxInfo.count;
                currentTotalCost = maxInfo.totalCost;
            }
        } else {
            displayAmount = currentSelectedBuyAmount;
            const costInfo = calculateTotalCostForAmount(gen.currentCost, displayAmount, gen.costIncreaseRate);
            currentTotalCost = costInfo.totalCost;
        }

        let timeToBuyString;
        const cashNeeded = currentTotalCost - currentCash;

        if (cashNeeded <= 0) {
            timeToBuyString = "";
        } else if (currentActualCashPerSecond === 0) {
            timeToBuyString = "No income";
        } else {
            const secondsToAfford = Math.ceil(cashNeeded / currentActualCashPerSecond);
            timeToBuyString = formatTimeToBuy(secondsToAfford);
        }

        gen.buttonElement.innerHTML =
            "Buy " + formatNumber(displayAmount) +
            "<br><span class='time-to-buy'>" + timeToBuyString + "</span>" +
            "<br>Cost: " + formatNumber(currentTotalCost);

        let canAfford = currentCash >= currentTotalCost && displayAmount > 0;
        gen.buttonElement.classList.toggle('can-buy', canAfford);
    }
}

function updateResetContainerVisibility(currentCash) {
    if (!gameHasReachedFirstGoal && currentCash >= FIRST_GOAL_CASH) {
        if (milestoneMessage && milestoneMessage.querySelector('h2')) {
            milestoneMessage.querySelector('h2').textContent = 'First Critical Point Reached!';
        }
        if (resetContainer) {
            resetContainer.style.height = '130px';
            resetContainer.style.marginTop = '20px';
            resetContainer.style.marginBottom = '20px';
        }
        gameHasReachedFirstGoal = true;
    }
    // Note: Hiding the reset container (setting height and margins to 0) is handled
    // in the resetButton click event listener, as it's a direct consequence of that action.
}

// --- End of New UI Update Helper Functions ---

function formatStandard(num) {
    if (num === undefined || num === null) return '0';
    if (num === 0) return '0';

    if (num >= 1e18) {
        return num.toExponential(2).replace('e+', 'e');
    }
    if (num >= 1e15) {
        let value = num / 1e15;
        if (value < 10) return value.toFixed(2) + 'Qa';
        if (value < 100) return value.toFixed(1) + 'Qa';
        return Math.floor(value).toFixed(0) + 'Qa';
    }
    if (num >= 1e12) {
        let value = num / 1e12;
        if (value < 10) return value.toFixed(2) + 'T';
        if (value < 100) return value.toFixed(1) + 'T';
        return Math.floor(value).toFixed(0) + 'T';
    }
    if (num >= 1e9) {
        let value = num / 1e9;
        if (value < 10) return value.toFixed(2) + 'B';
        if (value < 100) return value.toFixed(1) + 'B';
        return Math.floor(value).toFixed(0) + 'B';
    }
    return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function formatStandardSignificant(num) {
    if (num === undefined || num === null) return '0';
    if (num === 0) return "0";
    if (num < 0) return '-' + formatStandardSignificant(Math.abs(num));

    if (num < 0.00001 && num > 0) return "0";
    if (num < 0.01) return parseFloat(num.toFixed(4)).toString();
    if (num < 1) return parseFloat(num.toFixed(3)).toString();
    if (num < 10) return parseFloat(num.toFixed(2)).toString();
    if (num < 100) return parseFloat(num.toFixed(1)).toString();

    if (num < 1e9) {
        return num.toLocaleString('en-US', { maximumFractionDigits: 0, minimumFractionDigits: 0 });
    }

    if (num >= 1e18) {
        return num.toExponential(2).replace('e+', 'e');
    }
    if (num >= 1e15) {
        let value = num / 1e15;
        if (value < 10) return value.toFixed(2) + 'Qa';
        if (value < 100) return value.toFixed(1) + 'Qa';
        return Math.floor(value).toFixed(0) + 'Qa';
    }
    if (num >= 1e12) {
        let value = num / 1e12;
        if (value < 10) return value.toFixed(2) + 'T';
        if (value < 100) return value.toFixed(1) + 'T';
        return Math.floor(value).toFixed(0) + 'T';
    }
    let value = num / 1e9;
    if (value < 10) return value.toFixed(2) + 'B';
    if (value < 100) return value.toFixed(1) + 'B';
    return Math.floor(value).toFixed(0) + 'B';
}

function formatNumberSignificant(num, formatType = selectedNumberFormat) {
    switch (formatType) {
        case 'standard':
            return formatStandardSignificant(num);
        case 'hex':
            return formatHex(num);
        case 'scientific':
            return formatScientific(num);
        default:
            return formatStandardSignificant(num);
    }
}

function formatHex(num) {
    if (num === undefined || num === null) return "0";
    if (num === 0) return "0";

    const sign = num < 0 ? "-" : "";
    const absNum = Math.abs(num);

    const integerPart = Math.floor(absNum);
    let fractionalPart = absNum - integerPart;

    let integerHex = integerPart.toString(16).toLowerCase();
    let formattedIntegerHex = '';
    for (let i = 0; i < integerHex.length; i++) {
        if (i > 0 && (integerHex.length - i) % 4 === 0) {
            formattedIntegerHex += ' ';
        }
        formattedIntegerHex += integerHex[i];
    }
    integerHex = formattedIntegerHex || '0';

    let fractionalHex = "";
    if (absNum < 1000 && fractionalPart > 1e-7) {
        for (let i = 0; i < 3; i++) {
            fractionalPart *= 16;
            const digit = Math.floor(fractionalPart);
            fractionalHex += digit.toString(16).toLowerCase();
            fractionalPart -= digit;
            if (fractionalPart < 1e-7) break;
        }
        while (fractionalHex.length > 0 && fractionalHex.endsWith('0')) {
            fractionalHex = fractionalHex.slice(0, -1);
        }
    }

    if (integerPart === 0 && fractionalHex === "") {
        return "0";
    }

    let finalResult = integerHex;
    if (fractionalHex !== "") {
        finalResult += "." + fractionalHex;
    }

    if (finalResult === "0") return "0";

    return sign + finalResult;
}

function formatScientific(num) {
    if (num === undefined || num === null) {
        return "0";
    }
    const absNum = Math.abs(num);

    if (absNum < 10) {
        return formatStandardSignificant(num);
    } else {
        return num.toExponential(2).replace('e+', 'e');
    }
}

function formatTimeToBuy(totalSeconds) {
    if (!isFinite(totalSeconds) || totalSeconds < 0) {
        return "way too much";
    }
    if (totalSeconds < 1 && totalSeconds >= 0) {
        return "0s";
    }
    if (totalSeconds < 60) {
        return Math.floor(totalSeconds) + "s";
    }

    const secondsInDay = 24 * 60 * 60;
    const secondsInYear = 365 * secondsInDay;
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

    let timeStr =
        hours.toString().padStart(2, '0') + ":" +
        minutes.toString().padStart(2, '0') + ":" +
        seconds.toString().padStart(2, '0');

    parts.push(timeStr);

    return parts.join(" ");
}

function formatNumber(num) {
    return formatNumberSignificant(num, selectedNumberFormat);
}

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
    return { totalCost: calculatedTotalCost, costForNextSingleItem: nextCostAfterLoop };
}

function calculateMaxBuyableAmount(currentCash, currentGeneratorCost, costIncreaseRate) {
    let itemsBought = 0;
    let totalSpent = 0;
    let costOfNextItem = currentGeneratorCost;

    while (currentCash >= totalSpent + costOfNextItem) {
        totalSpent += costOfNextItem;
        itemsBought++;
        costOfNextItem = Math.ceil(costOfNextItem * costIncreaseRate);
        if (itemsBought >= MAX_BUY_SAFETY_LIMIT) {
            break;
        }
    }
    return { count: itemsBought, totalCost: totalSpent, costForNextSingleItemAfterMax: costOfNextItem };
}

function updateDisplay() {
    // (A) Calculate actualCashPerSecond FIRST
    let combinedGeneratorBoostForIncome = 1.0;
    generatorsData.forEach(g => { combinedGeneratorBoostForIncome *= g.boostRate; });
    let actualCashPerSecond = 0;
    if (generatorsData[0] && generatorsData[0].totalCount > 0) {
        actualCashPerSecond = generatorsData[0].totalCount * combinedGeneratorBoostForIncome * resetBoostRate;
    }

    // (B) Call Helper Functions
    updateGlobalStatsDisplay(cash, prestigePoints, resetBoostRate, actualCashPerSecond);

    generatorsData.forEach((gen, index) => {
        updateSingleGeneratorRow(gen, index, cash, selectedBuyAmount, actualCashPerSecond);
    });

    updateResetContainerVisibility(cash); // This was previously in setInterval
}


generatorsData.forEach(gen => {
    if (gen.buttonElement) {
        gen.buttonElement.addEventListener('click', () => {
            let effectiveBuyAmount;
            let purchaseDetails;

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
            gen.boostRate += 0.01;
        }
    });

    // Calculate effective total boost from all generators for cash production
    let combinedGeneratorBoost = 1.0; // Renamed to avoid conflict with combinedGeneratorBoostForIncome scope
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
        if (generatorsData[i].totalCount > 0) {
            generatorsData[i-1].totalCount += generatorsData[i].totalCount;
        }
    }

    // First Goal Achievement Check - This logic is now inside updateResetContainerVisibility
    // and will be called as part of updateDisplay.

    updateDisplay();
}, 1000);

// Initial display update
updateDisplay();

[end of script.js]
