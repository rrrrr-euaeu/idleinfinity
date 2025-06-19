// Main initialization script for Idle Infinity Game.
// Assumes the following files have been loaded in order:
// 1. numberFormatter.js
// 2. generatorManager.js (defines initialGeneratorsData and GeneratorManager)
// 3. gameLogic.js        (defines gameSettings, cash, game loop, simulation, etc.)
// 4. uiManager.js        (defines DOM interactions, UI updates, event handlers)

console.log("Starting main game initialization sequence...");

// 1. Initialize GeneratorManager Data
// GeneratorManager.initialize() will now use GeneratorManager.initialData by default.
if (typeof GeneratorManager !== 'undefined') {
    // GeneratorManager is defined. Its properties, including 'generators',
    // are initialized at the point of its definition in generatorManager.js.
    // No explicit .initialize() call is needed with the current design.
    console.log("GeneratorManager is defined and considered initialized.");
} else {
    console.error("CRITICAL ERROR: GeneratorManager is not defined. Check script load order and generatorManager.js");
}

// 2. Initialize DOM Element References
// initGlobalDOMElements (from uiManager.js) populates uiManager.domElements
// GeneratorManager.initDOMReferences (from generatorManager.js) sets up its internal DOM refs.
if (typeof initGlobalDOMElements === 'function') {
    initGlobalDOMElements();
    console.log("Global DOM elements initialized.");
} else {
    console.error("CRITICAL ERROR: initGlobalDOMElements is not defined. Check script load order and uiManager.js");
}

if (typeof GeneratorManager !== 'undefined' && typeof GeneratorManager.initDOMReferences === 'function') {
    GeneratorManager.initDOMReferences();
    console.log("GeneratorManager DOM references initialized.");
} else {
    console.error("CRITICAL ERROR: GeneratorManager.initDOMReferences is not defined. Check script load order and generatorManager.js");
}

// 3. Setup Event Listeners
// initializeEventListeners (from uiManager.js) sets up all event handlers,
// including calling GeneratorManager.setupGeneratorButtonListeners()
if (typeof initializeEventListeners === 'function') {
    initializeEventListeners();
    console.log("Event listeners initialized.");
} else {
    console.error("CRITICAL ERROR: initializeEventListeners is not defined. Check script load order and uiManager.js");
}

// 4. Initial UI Update
// updateDisplay (from uiManager.js) updates all visual aspects of the game.
if (typeof updateDisplay === 'function') {
    updateDisplay();
    console.log("Initial UI display updated.");
} else {
    console.error("CRITICAL ERROR: updateDisplay is not defined. Check script load order and uiManager.js");
}

// 5. Start the Game Loop
// setGameSpeed (from gameLogic.js) sets the initial game speed and starts the loop.
// It uses domElements (from uiManager.js, populated by initGlobalDOMElements)
// to get the initial slider value.
if (typeof setGameSpeed === 'function') {
    if (typeof domElements !== 'undefined' && domElements.gameSpeedSlider && domElements.gameSpeedSlider.value !== undefined) {
        setGameSpeed(domElements.gameSpeedSlider.value);
    } else {
        setGameSpeed(1); // Fallback if slider or its value isn't ready
        console.warn("Game speed slider DOM element not found or value not set at init, defaulting game speed to 1x.");
    }
    console.log("Game loop started.");
} else {
    console.error("CRITICAL ERROR: setGameSpeed is not defined. Check script load order and gameLogic.js");
}

console.log("Main script.js initialization sequence complete.");

// For debugging:
// To run simulation: window.runFirstGoalSimulation() (if gameLogic.js exposed it)
// Access managers: GeneratorManager, NumberFormatter
// Access game state: cash, prestigePoints, gameSettings (all global from gameLogic.js)
// Access UI elements: domElements (global from uiManager.js)
