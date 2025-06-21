// --- Number Formatter Object ---
const NumberFormatter = {
    selectedFormat: 'standard', // Default format

    setSelectedFormat: function(formatType) {
        this.selectedFormat = formatType;
    },

    standard: function(inputValue) { // Renamed value to inputValue to avoid clashes
        let originalValueType = typeof inputValue;
        let isNegative = false;
        let workingValue; // This variable will store BigInt or Number (absolute value)

        // Type checking and normalization
        if (inputValue === undefined || inputValue === null) return '0';

        if (originalValueType === 'bigint') {
            workingValue = inputValue;
            if (workingValue < 0n) {
                isNegative = true;
                workingValue = -workingValue;
            }
        } else if (originalValueType === 'number') {
            if (inputValue === 0) return '0'; // Zero is handled before sign
            if (inputValue < 0) {
                isNegative = true;
                workingValue = -inputValue; // Use positive value for further processing
            } else {
                workingValue = inputValue;
            }
        } else if (originalValueType === 'string') {
            if (inputValue.trim() === "") return '0';
            // Try parsing as BigInt first (for large integer strings)
            try {
                // Handle potential negative sign in string for BigInt
                let strVal = inputValue.trim();
                if (strVal.startsWith('-')) {
                    isNegative = true;
                    strVal = strVal.substring(1);
                }
                workingValue = BigInt(strVal);
            } catch (e) {
                // If BigInt parsing fails, try parsing as Number
                let tempNum = Number(inputValue); // Number() handles leading/trailing whitespace and sign
                if (isNaN(tempNum) || !isFinite(tempNum)) return '0'; // Handle NaN or Infinity
                if (tempNum === 0) return '0';
                if (tempNum < 0) { // Sign already handled by Number(), re-check for consistency
                    isNegative = true; // Should align with Number's own sign processing
                    workingValue = -tempNum;
                } else {
                    workingValue = tempNum;
                }
            }
        } else {
            return '0'; // Unsupported type
        }

        // At this point, workingValue is a positive Number or BigInt.
        // isNegative stores the sign.

        // Helper function for formatting suffixed values
        function formatSuffixedValue(s) { // Expects a string representation of a number
            // Only process if there's a decimal point
            if (s.indexOf('.') !== -1) {
                s = s.replace(/0+$/, ''); // Remove trailing zeros (e.g., "1.20" -> "1.2", "1.00" -> "1.")
                if (s.endsWith('.')) {      // If it ends with a decimal point, remove it (e.g., "1." -> "1")
                    s = s.slice(0, -1);
                }
            }
            return s;
        }

        // Helper function for BigInt suffix formatting (T, B, Qa)
        // Implements "3 significant digits, round 4th" and special "999" rule.
        function formatBigIntSuffixed(overallBigInt, divisorBigInt, suffix) {
            const integerPart = overallBigInt / divisorBigInt;

            // Special "999" rule: if integer part is 1000 or more, display as "999".
            if (integerPart >= 1000n) {
                return formatSuffixedValue("999") + suffix;
            }

            const numIntegerDigits = integerPart.toString().length;
            let numDecimalPlaces;

            if (numIntegerDigits >= 3) { // e.g., 123, 1234 (becomes 999 by rule above)
                numDecimalPlaces = 0;
            } else if (numIntegerDigits === 2) { // e.g., 12.X
                numDecimalPlaces = 1;
            } else if (numIntegerDigits === 1) { // e.g., 1.XX or 0.XX (if integerPart is 0)
                // If integerPart is 0 (e.g. 0.123Qa), numIntegerDigits will be 1 (for "0").
                // We need to ensure 3 significant digits starting from the first non-zero digit.
                // This simplified numDecimalPlaces logic works correctly for integerPart > 0.
                // For integerPart = 0, this gives numDecimalPlaces = 2, meaning "0.XX"
                numDecimalPlaces = 2;
            } else { // numIntegerDigits is 0 (only if overallBigInt is 0 and divisorBigInt is huge, result 0)
                 numDecimalPlaces = 2; // Default for 0.XX
            }

            // For very small numbers relative to divisor (e.g. 0.0123Qa)
            // The above numDecimalPlaces might not be enough for 3 significant digits.
            // Example: 0.0123Qa. integerPart=0. numIntegerDigits=1. numDecimalPlaces=2 -> "0.01"
            // We need to adjust numDecimalPlaces based on leading zeros in the fractional part.
            if (integerPart === 0n && overallBigInt > 0n) {
                // Estimate magnitude to find first significant digit
                let tempVal = overallBigInt * 10000n / divisorBigInt; // Scale up significantly (e.g. by 10^4)
                if (tempVal === 0n) { // Extremely small, will be 0.00...
                    numDecimalPlaces = 2; // Default to 0.00X or similar, effectively 0 after formatSuffixedValue
                } else {
                    let tempValStr = tempVal.toString();
                    // tempVal represents overallBigInt/divisorBigInt * 10000
                    // e.g., if original is 0.0123, tempVal is 123.
                    // e.g., if original is 0.00123, tempVal is 12.
                    // We want 3 significant digits.
                    // If tempVal is 123 (orig 0.0123), we need 4 decimal places for 0.0123
                    // If tempVal is 12 (orig 0.0012), we need 5 decimal places for 0.0012X
                    // This gets complex. Let's stick to simpler numDecimalPlaces for now and refine if specific cases fail.
                    // The current logic aims for total 3 digits around the decimal point for numbers < 100.
                    // e.g. 1.23, 12.3, 0.12 (if first sig digit is at 0.1)
                    // This means for 0.0123, it would be numDecimalPlaces=4 to get "0.012"
                    // For now, let's use the simpler numDecimalPlaces derived from integerPart.length,
                    // as the "3 significant digits" often implies it for numbers like X.YY, XX.Y.
                    // If overallBigInt * 100n / divisorBigInt < 1n (i.e. < 0.01), format as 0.00X approx.
                     if (overallBigInt * (10n ** BigInt(2 + 1)) / divisorBigInt < 1n ) { // checks if < 0.01, needs more sig figs
                         numDecimalPlaces = 2; // Placeholder, this needs more robust logic for true "3 sig figs after leading zeros"
                     }
                }
            }

            // New logic: Truncate to numDecimalPlaces for "3 significant digits, 4th digit truncated"
            const scaleFactorForDisplay = 10n ** BigInt(numDecimalPlaces);
            const valueToShowScaled = overallBigInt * scaleFactorForDisplay / divisorBigInt;

            let finalStr;
            const valueToShowStr = valueToShowScaled.toString();

            if (numDecimalPlaces === 0) {
                finalStr = valueToShowStr;
            } else {
                if (valueToShowStr.length > numDecimalPlaces) {
                    finalStr = valueToShowStr.slice(0, -numDecimalPlaces) + "." + valueToShowStr.slice(-numDecimalPlaces);
                } else {
                    finalStr = "0." + "0".repeat(numDecimalPlaces - valueToShowStr.length) + valueToShowStr;
                }
            }
            return formatSuffixedValue(finalStr) + suffix;
        }

        let formattedResult = "";

        // Define BigInt constants for comparisons
        const BI_1E9 = 10n**9n;
        const BI_1E12 = 10n**12n;
        const BI_1E15 = 10n**15n;
        const BI_1E18 = 10n**18n;

        if (typeof workingValue === 'number') {
            if (workingValue < 0.00001 && workingValue > 0) formattedResult = "0"; // Avoid e-6
            else if (workingValue < 0.01) formattedResult = parseFloat(workingValue.toFixed(4)).toString();
            else if (workingValue < 1) formattedResult = parseFloat(workingValue.toFixed(3)).toString();
            else if (workingValue < 10) formattedResult = parseFloat(workingValue.toFixed(2)).toString();
            else if (workingValue < 100) formattedResult = parseFloat(workingValue.toFixed(1)).toString();
            else if (workingValue < 1e9) { // Less than 1 Billion (Number path)
                formattedResult = workingValue.toLocaleString('en-US', { maximumFractionDigits: 0, minimumFractionDigits: 0 });
            } else { // Numbers >= 1e9, convert to BigInt and use unified BigInt suffix logic
                const numAsBigInt = BigInt(Math.floor(workingValue));
                if (numAsBigInt >= BI_1E18) {
                    // For original numbers that were >= 1e18, use their toExponential.
                    if (originalValueType === 'number') {
                        formattedResult = inputValue.toExponential(2).replace('e+', 'e');
                    } else { // Should not happen if originalValueType is number, but as a safeguard
                        let tempStr = numAsBigInt.toString();
                        formattedResult = tempStr.charAt(0) + '.' + tempStr.substring(1, 3) + 'e' + (tempStr.length - 1);
                    }
                } else if (numAsBigInt >= BI_1E15) {
                    const currentNumBigInt = numAsBigInt;
                    const divisor = BI_1E15;
                    const baseScaleFactorPrecision = 3;
                    const scaleFactorBigInt = BigInt(10**baseScaleFactorPrecision);
                    formattedResult = formatBigIntSuffixed(numAsBigInt, BI_1E15, 'Qa');
                } else if (numAsBigInt >= BI_1E12) {
                    formattedResult = formatBigIntSuffixed(numAsBigInt, BI_1E12, 'T');
                } else if (numAsBigInt >= BI_1E9) {
                    formattedResult = formatBigIntSuffixed(numAsBigInt, BI_1E9, 'B');
                }
            }
        } else if (typeof workingValue === 'bigint') { // workingValue was originally BigInt or String parsed to BigInt
            const numAsBigInt = workingValue; // Already a BigInt
            if (numAsBigInt >= BI_1E18) {
                let tempStr = numAsBigInt.toString();
                // Ensure there are enough digits for substring(1,3)
                let decPart = tempStr.length > 1 ? tempStr.substring(1,3) : "00";
                decPart = decPart.padEnd(2, '0'); // Ensure two decimal places
                formattedResult = tempStr.charAt(0) + '.' + decPart + 'e' + (tempStr.length - 1);
            } else if (numAsBigInt >= BI_1E15) {
                formattedResult = formatBigIntSuffixed(numAsBigInt, BI_1E15, 'Qa');
            } else if (numAsBigInt >= BI_1E12) {
                formattedResult = formatBigIntSuffixed(numAsBigInt, BI_1E12, 'T');
            } else if (numAsBigInt >= BI_1E9) { // BI_1E9 <= numAsBigInt < BI_1E12
                formattedResult = formatBigIntSuffixed(numAsBigInt, BI_1E9, 'B');
            } else {
                // BigInts less than 1 Billion but handled in this 'bigint' path
                // (e.g. direct BigInt input like 123n)
                // These should ideally be formatted like numbers, e.g. toLocaleString if no suffix.
                // Apply toLocaleString for digit grouping as per new requirement.
                formattedResult = workingValue.toLocaleString('en-US', { maximumFractionDigits: 0, minimumFractionDigits: 0 });
            }
        } else {
             formattedResult = "0"; // Should not be reached
        }

        return (isNegative ? '-' : '') + formattedResult;
    },

    hex: function(inputValue) {
        // TODO: Add type handling for hex similar to standard method
        let num = Number(inputValue); // Basic conversion for now
        if (num === undefined || num === null || isNaN(num)) return "0";
        if (num === 0) return "0";

        const sign = num < 0 ? "-" : "";
        // absNum for Number type. BigInt would need different handling for abs.
        const absNum = Math.abs(num);

        const integerPart = Math.floor(absNum); // Math.floor works for Numbers
        let fractionalPart = absNum - integerPart;

        let integerHex = integerPart.toString(16).toLowerCase();
        // Add spaces for readability if it's long, e.g., every 4 chars
        let formattedIntegerHex = '';
        for (let i = 0; i < integerHex.length; i++) {
            if (i > 0 && (integerHex.length - i) % 4 === 0) {
                formattedIntegerHex += ' ';
            }
            formattedIntegerHex += integerHex[i];
        }
        integerHex = formattedIntegerHex || '0'; // Ensure '0' if integer part was 0

        let fractionalHex = "";
        if (absNum < 1000 && fractionalPart > 1e-7) { // Only show fractional for smaller numbers and if significant
            for (let i = 0; i < 3; i++) { // Max 3 hex digits for fractional part
                fractionalPart *= 16;
                const digit = Math.floor(fractionalPart);
                fractionalHex += digit.toString(16).toLowerCase();
                fractionalPart -= digit;
                if (fractionalPart < 1e-7) break; // Stop if remainder is too small
            }
            // Trim trailing zeros from fractional hex
            while (fractionalHex.length > 0 && fractionalHex.endsWith('0')) {
                fractionalHex = fractionalHex.slice(0, -1);
            }
        }

        if (integerPart === 0 && fractionalHex === "") { // Handles cases like 0.0000001 becoming "0"
            return "0";
        }

        let finalResult = integerHex;
        if (fractionalHex !== "") {
            finalResult += "." + fractionalHex;
        }

        if (finalResult === "0") return "0"; // Safety if somehow it evaluates to "0" string but wasn't caught

        return sign + finalResult;
    },

    scientific: function(num) {
        if (num === undefined || num === null) {
            return "0";
        }
        const absNum = Math.abs(num);

        if (absNum < 10) { // For small numbers, use standard formatting for better readability
            return this.standard(num);
        } else {
            return num.toExponential(2).replace('e+', 'e');
        }
    },

    format: function(value) { // Changed num to value
        // value is already passed to standard, hex, scientific.
        // The undefined/null check can be primarily in the specific formatters like standard.
        // However, a top-level check here is also fine.
        if (value === undefined || value === null) return '0';

        switch (this.selectedFormat) {
            case 'standard':
                return this.standard(value);
            case 'hex':
                // Assuming hex and scientific will also be updated for multi-type input
                return this.hex(value);
            case 'scientific':
                return this.scientific(value);
            default:
                return this.standard(value);
        }
    }
};
// No explicit global export (e.g. window.NumberFormatter = NumberFormatter) needed
// if scripts are loaded directly in HTML.
