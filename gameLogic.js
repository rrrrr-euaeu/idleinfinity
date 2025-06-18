// --- Game Logic ---
// This file will be populated with core game state variables
// (e.g., cash, prestigePoints, gameSettings) and the main game loop.

// --- Game State Variables ---
const gameSettings = {
    firstGoalCash: 2147483647,       // Math.pow(2, 31) - 1
    generatorUnlockThreshold: 5,
    initialCash: 0,
    maxBuySafetyLimit: 10000, // Used by GeneratorManager, but defined here as a core game setting
    resetBoostIncrement: 1.0,
    baseBoostIncrementPerSecond: 0.01 // Used by GeneratorManager, but defined here
};

let prestigePoints = 0;
let gameHasReachedFirstGoal = false;
let resetBoostRate = 1.0;
let gameSpeed = 1;
let gameLoopIntervalId = null;
let gameTimeInSeconds = 0;
let isAutobuyActive = false;
let selectedBuyAmount = 1; // Moved from script.js, potentially also belongs to UIManager if purely UI state
let cash = gameSettings.initialCash;

// --- State Modifier Functions ---
function setSelectedBuyAmount(value) {
    if (value === 'MAX') {
        selectedBuyAmount = 'MAX';
    } else {
        selectedBuyAmount = parseInt(value);
        if (isNaN(selectedBuyAmount)) {
            selectedBuyAmount = 1; // Default to 1 if parsing fails
            console.warn("Invalid value passed to setSelectedBuyAmount, defaulting to 1:", value);
        }
    }
}

function setIsAutobuyActive(value) {
    isAutobuyActive = !!value; // Ensure boolean
}

// --- Utility Functions ---
// Moved here as it's primarily used by simulateTimeToReachFirstGoal
function deepCopy(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj; // Basic types or null are returned as is
    }

    if (Array.isArray(obj)) {
        return obj.map(deepCopy);
    }

    const newObj = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            newObj[key] = deepCopy(obj[key]);
        }
    }
    return newObj;
}
// --- End Utility Functions ---

// --- Game Loop Functions ---
function mainGameLoop() {
    // Assumes isAutobuyActive, GeneratorManager, gameSettings, cash, gameTimeInSeconds, updateDisplay, resetBoostRate are global

    // C. Cash Production
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

    // A. Autobuy logic
    if (isAutobuyActive) {
        let purchasedInThisCycle;
        do {
            purchasedInThisCycle = false;
            let purchasableGenerators = [];

            for (const gen of GeneratorManager.getAllGenerators()) {
                let isUnlocked = false;
                if (gen.id === 1) {
                    isUnlocked = true;
                } else {
                    const prevGen = GeneratorManager.getGenerator(gen.id - 1);
                    if (prevGen && prevGen.totalCount >= gameSettings.generatorUnlockThreshold) {
                        isUnlocked = true;
                    }
                }

                if (isUnlocked && cash >= gen.currentCost) { // Check against current cash AFTER production
                    purchasableGenerators.push(gen);
                }
            }

            if (purchasableGenerators.length > 0) {
                purchasableGenerators.sort((a, b) => {
                    if (a.currentCost !== b.currentCost) {
                        return a.currentCost - b.currentCost;
                    }
                    return a.id - b.id;
                });

                const genToBuy = purchasableGenerators[0];

                // Double check affordability before buying, as cash might have been spent on another generator in the same tick
                if (cash >= genToBuy.currentCost) {
                    const costOfBoughtItem = genToBuy.currentCost;
                    cash -= costOfBoughtItem;

                    genToBuy.purchasedCount++;
                    genToBuy.totalCount++;

                    genToBuy.currentCost = Math.ceil(costOfBoughtItem * genToBuy.costIncreaseRate);
                    purchasedInThisCycle = true;
                }
            }
        } while (purchasedInThisCycle);
    }

    // B. Boost Update
    GeneratorManager.updateBoostRates();

    // D. Lower-tier Generator Production
    GeneratorManager.produceLowerTierGenerators();

    // E. UI Update
    updateDisplay();

    // F. Time Increment
    gameTimeInSeconds++;
}

function stopGameLoop() {
    if (gameLoopIntervalId) {
        clearInterval(gameLoopIntervalId);
        gameLoopIntervalId = null;
    }
}

function startGameLoop() {
    stopGameLoop(); // Ensure no multiple loops are running
    if (gameSpeed > 0) {
        gameLoopIntervalId = setInterval(mainGameLoop, 1000 / gameSpeed);
    }
}

function setGameSpeed(newSpeedInput) {
    // Assumes gameSpeed, domElements (global from uiManager), stopGameLoop, startGameLoop, updateDisplay are accessible
    const newSpeed = parseInt(newSpeedInput, 10);
    if (isNaN(newSpeed) || newSpeed < 0 || newSpeed > 10) {
        if (domElements.gameSpeedSlider) { // domElements might not be initialized if called too early
            domElements.gameSpeedSlider.value = gameSpeed;
        }
        return;
    }

    gameSpeed = newSpeed;

    if (domElements.gameSpeedDisplay) { // domElements might not be initialized
        domElements.gameSpeedDisplay.textContent = gameSpeed + 'x';
    }

    stopGameLoop();
    if (gameSpeed > 0) {
        startGameLoop();
    } else {
        updateDisplay(); // Update display if paused
    }
}

// --- Simulation Function ---
function simulateTimeToReachFirstGoal() {
    // Assumes gameSettings (local), NumberFormatter (global), deepCopy (local)
    // Accesses initialGeneratorsData via GeneratorManager.initialData
    const simSettings = deepCopy(gameSettings);
    if (!GeneratorManager || !GeneratorManager.initialData) {
        console.error("simulateTimeToReachFirstGoal: GeneratorManager.initialData is not available!");
        return { error: "GeneratorManager.initialData not available" };
    }
    const simInitialGeneratorsData = deepCopy(GeneratorManager.initialData);

    let currentTimeInSeconds = 0;
    let currentCash = simSettings.initialCash;
    const targetCash = simSettings.firstGoalCash;
    const resetBoost = 1.0;

    // Correctly initialize simGenerators from GeneratorManager.initialData
    let simGenerators = simInitialGeneratorsData.map(genData => ({
        id: genData.id,
        namePrefix: genData.namePrefix, // Keep for logging if necessary
        initialCost: genData.initialCost,
        currentCost: genData.initialCost, // Will be adjusted for Gen1 below
        costIncreaseRate: genData.costIncreaseRate,
        totalCount: 0, // Will be set below
        purchasedCount: 0, // Will be set below
        boostRate: 1.0 // Default starting boostRate
    }));

    // Set the correct initial state for each generator
    simGenerators.forEach(sg => {
        if (sg.id === 1) {
            sg.purchasedCount = 1;
            sg.totalCount = 1;
            // Correctly set currentCost for Gen1 as if it's been bought once
            sg.currentCost = Math.ceil(sg.initialCost * sg.costIncreaseRate);
        } else {
            // For other generators, currentCost is initialCost as they haven't been bought
            sg.currentCost = sg.initialCost;
            sg.purchasedCount = 0;
            sg.totalCount = 0;
        }
        sg.boostRate = 1.0; // Ensure all start with 1.0 boostRate
    });

    // The old console.warn about adapted structure can be removed as this is the new correct mapping.
    // console.warn("SimulateTimeToReachFirstGoal is using an adapted generator structure and may not be accurate.");


    const purchaseLog = {};
    simGenerators.forEach(gen => {
        purchaseLog['gen' + gen.id] = {
            count: gen.totalCount, // Reflects initial count
            first: (gen.id === 1 && gen.purchasedCount >= 1) ? 0 : null, // Gen1 first purchase at t=0
            fifth: null // No one has 5 purchases at t=0
        };
    });

    const MAX_SIMULATION_SECONDS = 60 * 60 * 24 * 365 * 10; // Approx 10 years

    while (currentCash < targetCash) {
        if (currentTimeInSeconds > MAX_SIMULATION_SECONDS) {
            console.warn("Simulation exceeded max seconds. Terminating.", { currentTimeInSeconds, currentCash });
            return { error: "Max simulation time exceeded", time: currentTimeInSeconds, log: purchaseLog, cash: currentCash };
        }

        let canStillBuySomething;
        do {
            canStillBuySomething = false;
            let purchasableGeneratorsDetails = [];

            for (const gen of simGenerators) {
                let isUnlocked = false;
                if (gen.id === 1) {
                    isUnlocked = true;
                } else {
                    const prevGen = simGenerators.find(g => g.id === gen.id - 1);
                    if (prevGen && prevGen.totalCount >= simSettings.generatorUnlockThreshold) {
                        isUnlocked = true;
                    }
                }
                // Original sim used gen.currentCost. Mapped to currentCost from initialCost
                if (isUnlocked && currentCash >= gen.currentCost) {
                    purchasableGeneratorsDetails.push(gen);
                }
            }

            if (purchasableGeneratorsDetails.length > 0) {
                purchasableGeneratorsDetails.sort((a, b) => {
                    if (a.currentCost !== b.currentCost) return a.currentCost - b.currentCost;
                    return a.id - b.id;
                });

                const genToBuy = purchasableGeneratorsDetails[0];
                currentCash -= genToBuy.currentCost;
                const costOfThisPurchase = genToBuy.currentCost;

                genToBuy.purchasedCount++;
                genToBuy.totalCount++;
                // Original sim updated currentCost like this:
                genToBuy.currentCost = Math.ceil(costOfThisPurchase * genToBuy.costIncreaseRate);


                const logEntry = purchaseLog['gen' + genToBuy.id];
                logEntry.count = genToBuy.totalCount; // Update total count in log
                if (genToBuy.purchasedCount === 1 && logEntry.first === null) { // Check purchasedCount for milestone
                    logEntry.first = currentTimeInSeconds;
                }
                if (genToBuy.purchasedCount === 5 && logEntry.fifth === null) { // Check purchasedCount for milestone
                    logEntry.fifth = currentTimeInSeconds;
                }

                canStillBuySomething = true;
            }
        } while (canStillBuySomething);

        // B. Cash Production Phase (Moved before Purchase Phase as per new logic) - Actually, this was already after purchase. Let's re-verify the original structure.
        // Original structure was Purchase (A), then Cash Production (B), then Boost Update (C), then Lower-tier (D).
        // New requested order: B, A, C, D.

        // B. Cash Production Phase
        let cashProducedThisSecond = 0;
        const firstGen = simGenerators.find(g => g.id === 1);
        if (firstGen && firstGen.totalCount > 0) {
            let combinedBoost = resetBoost; // Sim used its own boost concept
            simGenerators.forEach(gen => {
                if (gen.totalCount > 0) combinedBoost *= gen.boostRate;
            });
            cashProducedThisSecond = firstGen.totalCount * combinedBoost;
        }
        currentCash += cashProducedThisSecond;

        // A. Generator Purchase Phase (Now after cash production)
        // This block was originally at the top of the loop. Now it's here.
        // The do...while loop for purchasing:
        // (The `canStillBuySomething` and `purchasableGeneratorsDetails` are defined inside it correctly)
        // This re-paste is to ensure its placement is correct relative to cash production.
        // The internal logic of this block was already confirmed.
        do { // Copied from above, placed after cash production
            canStillBuySomething = false;
            let purchasableGeneratorsDetails = [];

            for (const gen of simGenerators) {
                let isUnlocked = false;
                if (gen.id === 1) {
                    isUnlocked = true;
                } else {
                    const prevGen = simGenerators.find(g => g.id === gen.id - 1);
                    if (prevGen && prevGen.totalCount >= simSettings.generatorUnlockThreshold) {
                        isUnlocked = true;
                    }
                }
                if (isUnlocked && currentCash >= gen.currentCost) {
                    purchasableGeneratorsDetails.push(gen);
                }
            }

            if (purchasableGeneratorsDetails.length > 0) {
                purchasableGeneratorsDetails.sort((a, b) => {
                    if (a.currentCost !== b.currentCost) return a.currentCost - b.currentCost;
                    return a.id - b.id;
                });

                const genToBuy = purchasableGeneratorsDetails[0];
                // Check affordability again, as cash might have been spent if multiple purchases were allowed in a more complex scenario (not the case here, but good practice)
                if (currentCash >= genToBuy.currentCost) {
                    const costOfThisPurchase = genToBuy.currentCost;
                    currentCash -= costOfThisPurchase;

                    genToBuy.purchasedCount++;
                    genToBuy.totalCount++;
                    genToBuy.currentCost = Math.ceil(costOfThisPurchase * genToBuy.costIncreaseRate);

                    const logEntry = purchaseLog['gen' + genToBuy.id];
                    logEntry.count = genToBuy.totalCount;
                    if (genToBuy.purchasedCount === 1 && logEntry.first === null) {
                        logEntry.first = currentTimeInSeconds;
                    }
                    if (genToBuy.purchasedCount === 5 && logEntry.fifth === null) {
                        logEntry.fifth = currentTimeInSeconds;
                    }
                    canStillBuySomething = true;
                } else {
                    canStillBuySomething = false; // Cannot afford this one, stop trying for this tick's purchase phase
                }
            }
        } while (canStillBuySomething);


        // C. Generator Boost Rate Update Phase
        simGenerators.forEach(gen => {
            if (gen.totalCount > 0) {
                gen.boostRate += simSettings.baseBoostIncrementPerSecond;
            }
        });

        // D. Lower-tier Generator Production Phase
        for (let i = simGenerators.length - 1; i > 0; i--) {
            if (simGenerators[i].totalCount > 0) {
                const prevGen = simGenerators[i-1];
                if (prevGen) {
                    prevGen.totalCount += simGenerators[i].totalCount;
                }
            }
        }

        if (currentCash >= targetCash) break;
        currentTimeInSeconds++;
    }

    console.log("--- Simulation Results ---");
    console.log(`Time to reach 1st critical point (${NumberFormatter.format(targetCash)} cash): ${currentTimeInSeconds} seconds`);
    console.log("Generator purchase timings (seconds):");
    let tableOutput = {};
    for (const genKey in purchaseLog) {
        if (Object.prototype.hasOwnProperty.call(purchaseLog, genKey)) {
            const log = purchaseLog[genKey];
            tableOutput[genKey] = {
                '1st_Purchase_Time': log.first !== null ? log.first : "N/A",
                '5th_Purchase_Time': log.fifth !== null ? log.fifth : "N/A",
                'Final_Count': log.count
            };
        }
    }
    console.table(tableOutput);
    if (currentCash < targetCash && currentTimeInSeconds >= MAX_SIMULATION_SECONDS) {
        console.warn(`Note: Target cash not reached due to max simulation time (${MAX_SIMULATION_SECONDS}s). Final cash: ${NumberFormatter.format(currentCash)}`);
    } else if (currentCash < targetCash) {
        console.warn(`Note: Target cash not reached (unexpected termination). Final cash: ${NumberFormatter.format(currentCash)}`);
    }
    console.log("--------------------------");

    return {
        totalTimeInSeconds: currentTimeInSeconds,
        finalCash: currentCash,
        purchaseLog: purchaseLog
    };
}

// Expose to window if needed, or handle modularly later
// window.runFirstGoalSimulation = simulateTimeToReachFirstGoal;
// For now, keeping it callable globally if script.js or console needs it.
if (typeof window !== 'undefined') {
    window.runFirstGoalSimulation = simulateTimeToReachFirstGoal;
}
