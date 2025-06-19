// --- UI Manager ---
// This file will be populated with UI-related functions like
// DOM element selections, event handlers, and display update logic.

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

    domElements.gameSpeedSlider = document.getElementById('game-speed-slider');
    domElements.gameSpeedDisplay = document.getElementById('game-speed-display');
    domElements.autobuyCheckbox = document.getElementById('autobuy-checkbox');
}

// --- Event Handler Functions ---
function handleBuyAmountChange(event) {
    setSelectedBuyAmount(event.target.value); // Uses function from gameLogic.js
    updateDisplay(); // Assume updateDisplay is global
}

function handleNumberFormatChange(event) {
    if (event.target.checked) {
        NumberFormatter.setSelectedFormat(event.target.value); // Assume NumberFormatter is global
        updateDisplay(); // Assume updateDisplay is global
    }
}

// Options panel specific body click handler
function handleBodyClickForOptions(event) {
    if (domElements.optionsPanel && domElements.optionsButton) {
        // Check if the click is outside the options panel and not on the options button
        if (!domElements.optionsPanel.contains(event.target) && event.target !== domElements.optionsButton) {
            // If the panel is open, close it
            if (domElements.optionsPanel.classList.contains('open')) {
                handleOptionsButtonClick(); // Call the original toggle function
            }
        }
    }
}

function handleOptionsButtonClick() {
    if (domElements.optionsPanel && domElements.optionsButton) {
        domElements.optionsPanel.classList.toggle('open');
        if (domElements.optionsPanel.classList.contains('open')) {
            domElements.optionsButton.textContent = '✖️';
            document.documentElement.addEventListener('mousedown', handleBodyClickForOptions);
        } else {
            domElements.optionsButton.textContent = '⚙️';
            document.documentElement.removeEventListener('mousedown', handleBodyClickForOptions);
        }
    }
}

function handleResetButtonClick() {
    prestigePoints++; // Assume prestigePoints is global
    resetBoostRate += gameSettings.resetBoostIncrement; // Assume resetBoostRate & gameSettings are global
    cash = gameSettings.initialCash; // Assume cash & gameSettings are global

    GeneratorManager.resetGeneratorStates(); // Assume GeneratorManager is global

    if (domElements.resetContainer) {
        domElements.resetContainer.style.height = '0px';
        domElements.resetContainer.style.marginTop = '0px';
        domElements.resetContainer.style.marginBottom = '0px';
    }
    gameHasReachedFirstGoal = false; // Assume gameHasReachedFirstGoal is global
    updateDisplay(); // Assume updateDisplay is global
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

    if (domElements.gameSpeedSlider) {
        domElements.gameSpeedSlider.addEventListener('input', (event) => {
            setGameSpeed(event.target.value); // Assume setGameSpeed is global
        });
    }

    if (domElements.autobuyCheckbox) {
        domElements.autobuyCheckbox.addEventListener('change', () => {
            setIsAutobuyActive(domElements.autobuyCheckbox.checked); // Uses function from gameLogic.js
        });
    }

    // Setup listeners for generator buy buttons
    if (GeneratorManager && typeof GeneratorManager.getAllGenerators === 'function') {
        GeneratorManager.getAllGenerators().forEach(gen => {
            if (gen.buttonElement) {
                gen.buttonElement.addEventListener('click', () => {
                    let effectiveBuyAmount;
                    let purchaseDetails;

                    // Access global 'selectedBuyAmount' and 'cash'
                    if (selectedBuyAmount === 'MAX') { // selectedBuyAmount from gameLogic.js
                        purchaseDetails = GeneratorManager.calculateMaxBuyableAmount(gen, cash); // cash from gameLogic.js
                        effectiveBuyAmount = purchaseDetails.count;
                    } else {
                        effectiveBuyAmount = selectedBuyAmount; // selectedBuyAmount from gameLogic.js
                        purchaseDetails = GeneratorManager.calculateCostForAmount(gen, effectiveBuyAmount);
                    }

                    if (!purchaseDetails) {
                        console.error("Error calculating purchase details for gen " + gen.id);
                        return;
                    }

                    if (cash >= purchaseDetails.totalCost && effectiveBuyAmount > 0) { // cash from gameLogic.js
                        cash -= purchaseDetails.totalCost; // cash from gameLogic.js

                        let nextCost = (selectedBuyAmount === 'MAX') ? // selectedBuyAmount from gameLogic.js
                                       purchaseDetails.costForNextSingleItemAfterMax :
                                       purchaseDetails.costForNextSingleItem;

                        GeneratorManager.purchaseGenerator(
                            gen.id,
                            effectiveBuyAmount,
                            nextCost
                        );
                        updateDisplay(); // updateDisplay from uiManager.js (this file)
                    }
                });
            } else {
                console.warn(`UI Manager: Button element not found for generator id: ${gen.id} during listener setup.`);
            }
        });
    } else {
        console.error("CRITICAL: GeneratorManager or GeneratorManager.getAllGenerators() is not available. Generator buy buttons will not work.");
    }
}
// --- End of Centralized Event Listener Initialization ---

// --- UI Update Helper Functions ---
function updateGlobalStatsDisplay(currentCash, currentPrestigePoints, currentResetBoostRate, currentActualCashPerSecond) {
    // Assumes domElements, NumberFormatter, GeneratorManager are global
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
    // Assumes GeneratorManager, gameSettings, NumberFormatter, formatTimeToBuy are global
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
    // Assumes gameHasReachedFirstGoal, gameSettings, domElements are global
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

function updateDisplay() {
    // Assumes GeneratorManager, resetBoostRate, cash, prestigePoints, selectedBuyAmount are global
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

// Note: The function formatNumber(num) which was just a wrapper for NumberFormatter.format(num)
// can be replaced by direct calls to NumberFormatter.format(num) where needed, or kept if preferred.
// For this refactoring, it's removed from uiManager.js as it's trivial.
// If it was more complex, it would be moved here.
