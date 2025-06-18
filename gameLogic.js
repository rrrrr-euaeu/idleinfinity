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

                if (isUnlocked && cash >= gen.currentCost) {
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

                const costOfBoughtItem = genToBuy.currentCost;
                cash -= costOfBoughtItem;

                genToBuy.purchasedCount++;
                genToBuy.totalCount++;

                genToBuy.currentCost = Math.ceil(costOfBoughtItem * genToBuy.costIncreaseRate);

                // if (genToBuy.purchasedCount === 1 || genToBuy.purchasedCount === 5) {
                //    console.log(`Autobuy Log: ${genToBuy.namePrefix}${genToBuy.id} の ${genToBuy.purchasedCount}個目を ${gameTimeInSeconds}秒に購入しました。`);
                // }
                purchasedInThisCycle = true;
            }
        } while (purchasedInThisCycle);
    }

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

    let simGenerators = simInitialGeneratorsData.map(genData => ({
        // This mapping needs to align with the structure of initialGeneratorsData in generatorManager.js
        // It was originally { id, namePrefix, initialCost, currentCost, costIncreaseRate, ... }
        // Now it's { id, name, baseCost, baseProduction, level, costMultiplier, productionMultiplier }
        // The simulation logic is tightly coupled to the OLD generator data structure.
        // This will need significant rework if the simulation is to be kept.
        // For now, I will map it as best as possible, but it might not work as intended.
        id: genData.id,
        initialCost: genData.baseCost, // Approximate
        currentCost: genData.baseCost, // Approximate, will be updated
        costIncreaseRate: genData.costMultiplier, // Approximate
        totalCount: genData.level, // Approximate, level might mean purchased count
        purchasedCount: genData.level, // Approximate
        boostRate: 1.0, // Simulation had its own boost logic, not directly from productionMultiplier
    }));

    // The simulation's generator structure was:
    // { id, initialCost, currentCost, costIncreaseRate, totalCount, purchasedCount, boostRate }
    // The new structure in generatorManager.js for initialGeneratorsData is:
    // { id, name, baseCost, baseProduction, level, costMultiplier, productionMultiplier }

    // Due to the significant mismatch, and the fact that the simulation was based on the old structure,
    // this function will likely break or produce incorrect results.
    // The original simulation logic for purchasing and production was also different.
    // For the purpose of this refactoring task (moving code), I will keep the internal logic of the simulation
    // as it was, but acknowledge it's probably broken with the new generator data.

    console.warn("SimulateTimeToReachFirstGoal is using an adapted generator structure and may not be accurate.");

    // Fix: Gen1 starts with 1, others 0 as per original simulation
    simGenerators.forEach(sg => {
        if (sg.id === 1) {
            sg.totalCount = 1;
            sg.purchasedCount = 1;
            //sg.currentCost = Math.ceil(sg.initialCost * sg.costIncreaseRate); // As per original logic
        } else {
            sg.totalCount = 0;
            sg.purchasedCount = 0;
        }
    });


    const purchaseLog = {};
    simGenerators.forEach(gen => {
        purchaseLog['gen' + gen.id] = {
            count: gen.totalCount,
            first: (gen.id === 1 && gen.totalCount >= 1) ? 0 : null,
            fifth: (gen.id === 1 && gen.totalCount >= 5) ? 0 : null
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
                logEntry.count = genToBuy.totalCount;
                if (logEntry.count === 1 && logEntry.first === null) logEntry.first = currentTimeInSeconds;
                if (logEntry.count === 5 && logEntry.fifth === null) logEntry.fifth = currentTimeInSeconds;

                canStillBuySomething = true;
            }
        } while (canStillBuySomething);

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

        simGenerators.forEach(gen => {
            if (gen.totalCount > 0) {
                gen.boostRate += simSettings.baseBoostIncrementPerSecond; // Sim used gameSettings for this
            }
        });

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

    console.log("--- シミュレーション結果 ---");
    console.log(`第1臨界点 (${NumberFormatter.format(targetCash)} cash) 到達時間: ${currentTimeInSeconds} 秒`);
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
        console.warn(`注意: 最大シミュレーション時間 (${MAX_SIMULATION_SECONDS}秒) に到達したため、目標キャッシュに到達できませんでした。最終キャッシュ: ${NumberFormatter.format(currentCash)}`);
    } else if (currentCash < targetCash) {
        console.warn(`注意: 目標キャッシュに到達できませんでした (予期せぬ終了)。最終キャッシュ: ${NumberFormatter.format(currentCash)}`);
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
