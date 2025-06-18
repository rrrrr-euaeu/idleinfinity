console.log("generatorManager.js: START parsing");
// initialGeneratorsData and GeneratorManager definition
// from the original script.js

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

const GeneratorManager = {
    initialData: initialGeneratorsData, // Keep this for simulateTimeToReachFirstGoal if it needs pristine initial data
    generators: JSON.parse(JSON.stringify(initialGeneratorsData)), // Operates on a deep copy

    initDOMReferences: function() {
        if (!this.generators || this.generators.length === 0) {
            return;
        }
        this.generators.forEach(gen => {
            gen.nameDisplayElement = document.getElementById(gen.nameDisplayId);
            gen.levelDisplayElement = document.getElementById(gen.levelDisplayId);
            gen.buttonElement = document.getElementById(gen.buttonId);

            if (gen.buttonElement) {
                gen.buttonElement.style.setProperty('--gen-button-bg-color', gen.themeColor);
                gen.actionRowElement = gen.buttonElement.closest('.generator-action-row');
                if (!gen.actionRowElement) {
                }
            } else {
                gen.actionRowElement = null;
            }
        });
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

    calculateMaxBuyableAmount: function(gen, currentCash) { // currentCash is passed from gameLogic
        let itemsBought = 0;
        let totalSpent = 0;
        let costOfNextItem = gen.currentCost;
        // Assumes gameSettings is global or passed appropriately if needed for maxBuySafetyLimit
        while (currentCash >= totalSpent + costOfNextItem) {
            totalSpent += costOfNextItem;
            itemsBought++;
            costOfNextItem = Math.ceil(costOfNextItem * gen.costIncreaseRate);
            if (itemsBought >= gameSettings.maxBuySafetyLimit) { // Uses global gameSettings
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

    updateBoostRates: function() { // Uses global gameSettings
        this.generators.forEach(gen => {
            if (gen.totalCount > 0) {
                gen.boostRate += gameSettings.baseBoostIncrementPerSecond;
            }
        });
    },

    produceLowerTierGenerators: function() {
        const gens = this.getAllGenerators(); // gets this.generators
        for (let i = gens.length - 1; i > 0; i--) {
            if (gens[i].totalCount > 0) { // If current tier generator is owned
                const prevGen = gens[i-1]; // The next lower tier generator
                if (prevGen) {
                    prevGen.totalCount += gens[i].totalCount; // Add this tier's count to the lower tier's count
                }
            }
        }
    },

    resetGeneratorStates: function() {
        // initialGeneratorsData here refers to the const defined at the top of this file.
        // This is the pristine, original data.
        this.generators.forEach(gen => {
            const pristineGen = initialGeneratorsData.find(pGen => pGen.id === gen.id);

            if (pristineGen) {
                gen.totalCount = pristineGen.totalCount;
                gen.purchasedCount = pristineGen.purchasedCount;
                gen.currentCost = pristineGen.currentCost;
                gen.boostRate = pristineGen.boostRate;
            } else {
                // Fallback, though ideally all generators should be in initialGeneratorsData
                gen.totalCount = (gen.id === 1) ? 1 : 0;
                gen.purchasedCount = (gen.id === 1) ? 1 : 0;
                gen.currentCost = gen.initialCost; // Assumes gen.initialCost exists
                if (gen.id === 1 && gen.initialCost) {
                     // Recalculate currentCost for Gen1 if it was purchased once
                    gen.currentCost = Math.ceil(gen.initialCost * gen.costIncreaseRate);
                }
                gen.boostRate = 1.0;
            }
        });
    },

    // setupGeneratorButtonListeners is now part of uiManager.js (within initializeEventListeners)
    // It will call GeneratorManager.calculateMaxBuyableAmount, GeneratorManager.calculateCostForAmount,
    // and GeneratorManager.purchaseGenerator.
    // It needs access to global selectedBuyAmount, cash, and uiManager's updateDisplay.
    // This means GeneratorManager methods like purchaseGenerator, calculateMaxBuyableAmount, etc.,
    // need to correctly use passed-in cash or global cash.
    // calculateMaxBuyableAmount already takes currentCash.
    // purchaseGenerator doesn't directly deal with cash, the calling context does.
};

// Make initialData available for simulateTimeToReachFirstGoal in gameLogic.js
// This was already requested to be GeneratorManager.initialData
// The 'initialData' property on the object is fine.
// The const initialGeneratorsData is also file-scoped (effectively global if not using modules).
console.log("generatorManager.js: GeneratorManager object DEFINED", typeof GeneratorManager, GeneratorManager);
