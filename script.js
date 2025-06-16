// Game logic for Idle Infinity Game will go here.
// Basic structure and initial values

// const FIRST_GOAL_CASH = 2147483647; // Replaced by gameSettings
// const GENERATOR_UNLOCK_THRESHOLD = 5; // Replaced by gameSettings
// const MAX_BUY_SAFETY_LIMIT = 10000; // Replaced by gameSettings

const gameSettings = {
    firstGoalCash: 2147483647,       // Math.pow(2, 31) - 1
    generatorUnlockThreshold: 5,
    initialCash: 0,
    maxBuySafetyLimit: 10000,
    resetBoostIncrement: 1.0,
    baseBoostIncrementPerSecond: 0.01
};

let prestigePoints = 0;
let gameHasReachedFirstGoal = false;
let resetBoostRate = 1.0;

const initialGeneratorsData = [
    {
        id: 1, namePrefix: "Generator", initialCost: 10, currentCost: 12, costIncreaseRate: 1.15,
        totalCount: 1, purchasedCount: 1, boostRate: 1.0,
        nameDisplayId: 'gen1-name-display', levelDisplayId: 'gen1-level-display', buttonId: 'buy-gen1',
        themeColor: '#E63946' // Red
    },
    {
        id: 2, namePrefix: "Generator", initialCost: 100, currentCost: 100, costIncreaseRate: 1.20,
        totalCount: 0, purchasedCount: 0, boostRate: 1.0,
        nameDisplayId: 'gen2-name-display', levelDisplayId: 'gen2-level-display', buttonId: 'buy-gen2',
        themeColor: '#F4A261' // Orange
    },
    {
        id: 3, namePrefix: "Generator", initialCost: 1000, currentCost: 1000, costIncreaseRate: 1.20,
        totalCount: 0, purchasedCount: 0, boostRate: 1.0,
        nameDisplayId: 'gen3-name-display', levelDisplayId: 'gen3-level-display', buttonId: 'buy-gen3',
        themeColor: '#E9C46A' // Yellow
    },
    {
        id: 4, namePrefix: "Generator", initialCost: 10000, currentCost: 10000, costIncreaseRate: 1.20,
        totalCount: 0, purchasedCount: 0, boostRate: 1.0,
        nameDisplayId: 'gen4-name-display', levelDisplayId: 'gen4-level-display', buttonId: 'buy-gen4',
        themeColor: '#A7C957' // Yellow-Green
    },
    {
        id: 5, namePrefix: "Generator", initialCost: 100000, currentCost: 100000, costIncreaseRate: 1.20,
        totalCount: 0, purchasedCount: 0, boostRate: 1.0,
        nameDisplayId: 'gen5-name-display', levelDisplayId: 'gen5-level-display', buttonId: 'buy-gen5',
        themeColor: '#2A9D8F' // Green/Teal
    },
    {
        id: 6, namePrefix: "Generator", initialCost: 1000000, currentCost: 1000000, costIncreaseRate: 1.20,
        totalCount: 0, purchasedCount: 0, boostRate: 1.0,
        nameDisplayId: 'gen6-name-display', levelDisplayId: 'gen6-level-display', buttonId: 'buy-gen6',
        themeColor: '#57A7C9' // Light Blue
    },
    {
        id: 7, namePrefix: "Generator", initialCost: 10000000, currentCost: 10000000, costIncreaseRate: 1.20,
        totalCount: 0, purchasedCount: 0, boostRate: 1.0,
        nameDisplayId: 'gen7-name-display', levelDisplayId: 'gen7-level-display', buttonId: 'buy-gen7',
        themeColor: '#118AB2' // Blue
    },
    {
        id: 8, namePrefix: "Generator", initialCost: 100000000, currentCost: 100000000, costIncreaseRate: 1.20,
        totalCount: 0, purchasedCount: 0, boostRate: 1.0,
        nameDisplayId: 'gen8-name-display', levelDisplayId: 'gen8-level-display', buttonId: 'buy-gen8',
        themeColor: '#9B5DE5' // Purple
    },
    {
        id: 9, namePrefix: "Generator", initialCost: 1000000000, currentCost: 1000000000, costIncreaseRate: 1.20,
        totalCount: 0, purchasedCount: 0, boostRate: 1.0,
        nameDisplayId: 'gen9-name-display', levelDisplayId: 'gen9-level-display', buttonId: 'buy-gen9',
        themeColor: '#F789A8' // Pink
    }
];

// const INITIAL_CASH = 0; // Replaced by gameSettings.initialCash
let selectedBuyAmount = 1;
let cash = gameSettings.initialCash;

// --- GeneratorManager Object ---
const GeneratorManager = {
    generators: JSON.parse(JSON.stringify(initialGeneratorsData)),

    initDOMReferences: function() {
        // console.log("GeneratorManager: Initializing DOM references for its generators...");
        if (!this.generators || this.generators.length === 0) {
            // console.error("GeneratorManager: 'this.generators' is empty or not initialized. Cannot set DOM references.");
            return;
        }
        this.generators.forEach(gen => {
            // DOM element references are null in initialGeneratorsData, set them here
            gen.nameDisplayElement = document.getElementById(gen.nameDisplayId);
            gen.levelDisplayElement = document.getElementById(gen.levelDisplayId);
            gen.buttonElement = document.getElementById(gen.buttonId);

            if (gen.buttonElement) {
                gen.buttonElement.style.setProperty('--gen-button-bg-color', gen.themeColor);
                gen.actionRowElement = gen.buttonElement.closest('.generator-action-row');
                if (!gen.actionRowElement) {
                    // console.warn(`GeneratorManager: Action row not found for generator id: ${gen.id} via button ${gen.buttonId}`);
                }
            } else {
                // console.warn(`GeneratorManager: Button element not found for generator id: ${gen.id} with buttonId: ${gen.buttonId}`);
                gen.actionRowElement = null;
            }
            // if (!gen.nameDisplayElement) console.warn(`GeneratorManager: Name display element not found for gen id: ${gen.id} using ID ${gen.nameDisplayId}`);
            // if (!gen.levelDisplayElement) console.warn(`GeneratorManager: Level display element not found for gen id: ${gen.id} using ID ${gen.levelDisplayId}`);
        });
        // console.log("GeneratorManager: DOM references initialization attempt complete.");
    },

    getAllGenerators: function() {
        return this.generators;
    },

    getGenerator: function(id) {
        return this.generators.find(gen => gen.id === id);
    },

    calculateCostForAmount: function(gen, amountToBuy) {
        let calculatedTotalCost = 0;
        let nextCostAfterLoop = gen.currentCost;
        if (amountToBuy <= 0) {
            return { totalCost: 0, costForNextSingleItem: gen.currentCost };
        }
        for (let i = 0; i < amountToBuy; i++) {
            calculatedTotalCost += nextCostAfterLoop;
            nextCostAfterLoop = Math.ceil(nextCostAfterLoop * gen.costIncreaseRate);
        }
        return { totalCost: calculatedTotalCost, costForNextSingleItem: nextCostAfterLoop };
    },

    calculateMaxBuyableAmount: function(gen, currentCash) {
        let itemsBought = 0;
        let totalSpent = 0;
        let costOfNextItem = gen.currentCost;
        while (currentCash >= totalSpent + costOfNextItem) {
            totalSpent += costOfNextItem;
            itemsBought++;
            costOfNextItem = Math.ceil(costOfNextItem * gen.costIncreaseRate);
            if (itemsBought >= gameSettings.maxBuySafetyLimit) {
                break;
            }
        }
        return { count: itemsBought, totalCost: totalSpent, costForNextSingleItemAfterMax: costOfNextItem };
    },

    purchaseGenerator: function(genId, amountEffectivelyBought, newCurrentCost) {
        const gen = this.getGenerator(genId);
        if (gen) {
            gen.totalCount += amountEffectivelyBought;
            gen.purchasedCount += amountEffectivelyBought;
            gen.currentCost = newCurrentCost;
        }
    },

    updateBoostRates: function() {
        this.generators.forEach(gen => {
            if (gen.totalCount > 0) {
                gen.boostRate += gameSettings.baseBoostIncrementPerSecond;
            }
        });
    },

    produceLowerTierGenerators: function() {
        const gens = this.getAllGenerators();
        for (let i = gens.length - 1; i > 0; i--) {
            if (gens[i].totalCount > 0) {
                gens[i-1].totalCount += gens[i].totalCount;
            }
        }
    },

    resetGeneratorStates: function() {
        this.generators.forEach(gen => {
            const pristineGen = initialGeneratorsData.find(pGen => pGen.id === gen.id);

            if (pristineGen) { // Check if pristineGen was found
                gen.totalCount = pristineGen.totalCount;
                gen.purchasedCount = pristineGen.purchasedCount;
                gen.currentCost = pristineGen.currentCost;
                gen.boostRate = pristineGen.boostRate;
            } else {
                // Fallback or error if pristine data for a gen is missing (should not happen)
                gen.totalCount = (gen.id === 1) ? 1 : 0;
                gen.purchasedCount = (gen.id === 1) ? 1 : 0;
                gen.currentCost = gen.initialCost; // May not be accurate if initialCost was not on pristineGen
                if (gen.id === 1) { // Recalculate Gen1 currentCost based on its own initialCost and rate
                    gen.currentCost = Math.ceil(gen.initialCost * gen.costIncreaseRate);
                }
                gen.boostRate = 1.0;
            }
        });
    }
};
// --- End of GeneratorManager Object ---

const domElements = {};

function initGlobalDOMElements() {
    domElements.cashDisplay = document.getElementById('cash');
    domElements.prestigePointsDisplay = document.getElementById('prestige-points-display');
    domElements.prestigeInfoContainer = document.getElementById('prestige-info-container');
    domElements.totalBoostFormulaDisplay = document.getElementById('total-boost-formula-display');

    domElements.optionsButton = document.getElementById('options-button');
    domElements.optionsPanel = document.getElementById('options-panel');
    domElements.numberFormatRadios = document.querySelectorAll('input[name="numberFormat"]');

    domElements.buyAmountRadios = document.querySelectorAll('input[name="buyAmount"]');

    domElements.resetContainer = document.getElementById('reset-container');
    domElements.milestoneMessage = document.getElementById('milestone-message');
    domElements.milestoneMessageHeader = document.querySelector('#milestone-message h2');

    domElements.resetButton = document.getElementById('reset-button');
}

GeneratorManager.initDOMReferences();
initGlobalDOMElements();

// --- Event Handler Functions ---
function handleBuyAmountChange(event) {
    if (event.target.value === 'MAX') {
        selectedBuyAmount = 'MAX';
    } else {
        selectedBuyAmount = parseInt(event.target.value);
    }
    updateDisplay();
}

function handleNumberFormatChange(event) {
    if (event.target.checked) {
        NumberFormatter.setSelectedFormat(event.target.value);
        updateDisplay();
    }
}

function handleOptionsButtonClick() {
    if (domElements.optionsPanel && domElements.optionsButton) {
        domElements.optionsPanel.classList.toggle('open');
        if (domElements.optionsPanel.classList.contains('open')) {
            domElements.optionsButton.textContent = '✖️';
        } else {
            domElements.optionsButton.textContent = '⚙️';
        }
    }
}

function handleResetButtonClick() {
    prestigePoints++;
    resetBoostRate += gameSettings.resetBoostIncrement;
    cash = gameSettings.initialCash;

    GeneratorManager.resetGeneratorStates();

    if (domElements.resetContainer) {
        domElements.resetContainer.style.height = '0px';
        domElements.resetContainer.style.marginTop = '0px';
        domElements.resetContainer.style.marginBottom = '0px';
    }
    gameHasReachedFirstGoal = false;
    updateDisplay();
}
// --- End of Event Handler Functions ---

// --- Centralized Event Listener Initialization ---
function initializeEventListeners() {
    if (domElements.buyAmountRadios) {
        domElements.buyAmountRadios.forEach(radio => {
            radio.addEventListener('change', handleBuyAmountChange);
        });
    }

    if (domElements.resetButton) {
        domElements.resetButton.addEventListener('click', handleResetButtonClick);
    }

    if (domElements.optionsButton && domElements.optionsPanel) {
        domElements.optionsButton.addEventListener('click', handleOptionsButtonClick);
    }

    if (domElements.numberFormatRadios) {
        domElements.numberFormatRadios.forEach(radio => {
            radio.addEventListener('change', handleNumberFormatChange);
        });
    }

    if (GeneratorManager && typeof GeneratorManager.setupGeneratorButtonListeners === 'function') {
        GeneratorManager.setupGeneratorButtonListeners();
    }
}
// --- End of Centralized Event Listener Initialization ---


// --- Number Formatter Object ---
const NumberFormatter = {
    selectedFormat: 'standard',

    setSelectedFormat: function(formatType) {
        this.selectedFormat = formatType;
    },

    standard: function(num) {
        if (num === undefined || num === null) return '0';
        if (num === 0) return "0";
        if (num < 0) return '-' + this.standard(Math.abs(num));

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
            if (value < 10) return parseFloat(value.toFixed(2)).toString() + 'Qa';
            if (value < 100) return parseFloat(value.toFixed(1)).toString() + 'Qa';
            return Math.floor(value).toString() + 'Qa';
        }
        if (num >= 1e12) {
            let value = num / 1e12;
            if (value < 10) return parseFloat(value.toFixed(2)).toString() + 'T';
            if (value < 100) return parseFloat(value.toFixed(1)).toString() + 'T';
            return Math.floor(value).toString() + 'T';
        }

        let value = num / 1e9;
        if (value < 10) return parseFloat(value.toFixed(2)).toString() + 'B';
        if (value < 100) return parseFloat(value.toFixed(1)).toString() + 'B';
        return Math.floor(value).toString() + 'B';
    },

    hex: function(num) {
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
    },

    scientific: function(num) {
        if (num === undefined || num === null) {
            return "0";
        }
        const absNum = Math.abs(num);

        if (absNum < 10) {
            return this.standard(num);
        } else {
            return num.toExponential(2).replace('e+', 'e');
        }
    },

    format: function(num) {
        if (num === undefined || num === null) return "0";

        switch (this.selectedFormat) {
            case 'standard':
                return this.standard(num);
            case 'hex':
                return this.hex(num);
            case 'scientific':
                return this.scientific(num);
            default:
                return this.standard(num);
        }
    }
};


// --- New UI Update Helper Functions ---

function updateGlobalStatsDisplay(currentCash, currentPrestigePoints, currentResetBoostRate, currentActualCashPerSecond) {
    if (domElements.cashDisplay) domElements.cashDisplay.textContent = NumberFormatter.format(currentCash);

    if (domElements.totalBoostFormulaDisplay) {
        const boostFormulaParts = [];
        GeneratorManager.getAllGenerators().forEach(gen => {
            const formattedBoostRate = NumberFormatter.format(gen.boostRate);
            boostFormulaParts.push(`<span style="color: ${gen.themeColor}; font-weight: bold;">${formattedBoostRate}</span>`);
        });

        if (currentPrestigePoints > 0) {
            const formattedResetBoost = NumberFormatter.format(currentResetBoostRate);
            const resetBoostSpan = `<span style="color: grey; font-weight: bold;">${formattedResetBoost}</span>`;
            boostFormulaParts.push(resetBoostSpan);
        }

        let formulaString = boostFormulaParts.join(" × ");
        let incomeString = `<br><span class="income-display-in-boost-area">Income: ${NumberFormatter.format(currentActualCashPerSecond)} /s</span>`;
        domElements.totalBoostFormulaDisplay.innerHTML = formulaString + incomeString;
    }

    if (domElements.prestigeInfoContainer) {
        if (currentPrestigePoints > 0) {
            domElements.prestigeInfoContainer.style.display = 'inline';
            if (domElements.prestigePointsDisplay) {
                domElements.prestigePointsDisplay.textContent = NumberFormatter.format(currentPrestigePoints);
            }
        } else {
            domElements.prestigeInfoContainer.style.display = 'none';
        }
    }
}

function updateSingleGeneratorRow(gen, index, currentCash, currentSelectedBuyAmount, currentActualCashPerSecond) {
    if (gen.actionRowElement) {
        if (gen.id === 1) {
            gen.actionRowElement.style.visibility = 'visible';
        } else {
            const prevGen = GeneratorManager.getAllGenerators()[index - 1];
            if (prevGen && prevGen.totalCount >= gameSettings.generatorUnlockThreshold) {
                gen.actionRowElement.style.visibility = 'visible';
            } else {
                gen.actionRowElement.style.visibility = 'hidden';
            }
        }
    }

    if (gen.nameDisplayElement) {
        gen.nameDisplayElement.textContent = gen.namePrefix + gen.id;
    }

    if (gen.levelDisplayElement) {
        let producedCount = gen.totalCount - gen.purchasedCount;
        if (producedCount < 0) producedCount = 0;
        if (producedCount <= 0) {
            gen.levelDisplayElement.textContent = "lv " + NumberFormatter.format(gen.purchasedCount);
        } else {
            gen.levelDisplayElement.textContent = "lv " + NumberFormatter.format(gen.purchasedCount) + " + " + NumberFormatter.format(producedCount);
        }
    }

    if (gen.buttonElement) {
        let displayAmount;
        let currentTotalCost;

        if (currentSelectedBuyAmount === 'MAX') {
            const maxInfo = GeneratorManager.calculateMaxBuyableAmount(gen, currentCash);
            if (maxInfo.count === 0) {
                displayAmount = 1;
                currentTotalCost = gen.currentCost;
            } else {
                displayAmount = maxInfo.count;
                currentTotalCost = maxInfo.totalCost;
            }
        } else {
            displayAmount = currentSelectedBuyAmount;
            const costInfo = GeneratorManager.calculateCostForAmount(gen, displayAmount);
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
            "Buy " + NumberFormatter.format(displayAmount) +
            "<br><span class='time-to-buy'>" + timeToBuyString + "</span>" +
            "<br>Cost: " + NumberFormatter.format(currentTotalCost);

        let canAfford = currentCash >= currentTotalCost && displayAmount > 0;
        gen.buttonElement.classList.toggle('can-buy', canAfford);
    }
}

function updateResetContainerVisibility(currentCash) {
    if (!gameHasReachedFirstGoal && currentCash >= gameSettings.firstGoalCash) {
        if (domElements.milestoneMessageHeader) {
            domElements.milestoneMessageHeader.textContent = 'First Critical Point Reached!';
        }
        if (domElements.resetContainer) {
            domElements.resetContainer.style.height = '130px';
            domElements.resetContainer.style.marginTop = '20px';
            domElements.resetContainer.style.marginBottom = '20px';
        }
        gameHasReachedFirstGoal = true;
    }
}

// --- End of New UI Update Helper Functions ---

/*
// Old global formatting functions - Commented out
// function formatStandard(num) { ... }
// function formatStandardSignificant(num) { ... }
// function formatNumberSignificant(num, formatType) { ... }
// function formatHex(num) { ... }
// function formatScientific(num) { ... }
*/

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
    return NumberFormatter.format(num);
}

// Old global cost calculation functions - COMMENTED OUT
/*
function calculateTotalCostForAmount(currentGeneratorCost, numberOfItems, costIncreaseRate) {
    // ...
}
function calculateMaxBuyableAmount(currentCash, currentGeneratorCost, costIncreaseRate) {
    // ...
}
*/

function updateDisplay() {
    let combinedGeneratorBoostForIncome = 1.0;
    GeneratorManager.getAllGenerators().forEach(g => { combinedGeneratorBoostForIncome *= g.boostRate; });
    let actualCashPerSecond = 0;
    const firstGen = GeneratorManager.getGenerator(1);
    if (firstGen && firstGen.totalCount > 0) {
        actualCashPerSecond = firstGen.totalCount * combinedGeneratorBoostForIncome * resetBoostRate;
    }

    updateGlobalStatsDisplay(cash, prestigePoints, resetBoostRate, actualCashPerSecond);

    GeneratorManager.getAllGenerators().forEach((gen, index) => {
        updateSingleGeneratorRow(gen, index, cash, selectedBuyAmount, actualCashPerSecond);
    });

    updateResetContainerVisibility(cash);
}

// Event listener setup for generator purchase buttons is now inside GeneratorManager.setupGeneratorButtonListeners

// Game loop - called every second
setInterval(() => {
    GeneratorManager.updateBoostRates();

    let combinedGeneratorBoost = 1.0;
    GeneratorManager.getAllGenerators().forEach(gen => {
        combinedGeneratorBoost *= gen.boostRate;
    });

    let cashProducedThisTick = 0;
    const firstGenForProduction = GeneratorManager.getGenerator(1);
    if (firstGenForProduction && firstGenForProduction.totalCount > 0) {
        cashProducedThisTick = firstGenForProduction.totalCount * combinedGeneratorBoost * resetBoostRate;
    }

    cash += cashProducedThisTick;

    GeneratorManager.produceLowerTierGenerators();

    updateDisplay();
}, 1000);

// Initial display update and listener setup
updateDisplay();
initializeEventListeners();
