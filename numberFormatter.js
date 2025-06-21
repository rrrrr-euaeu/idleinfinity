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
                numDecimalPlaces = 2;
            } else {
                 numDecimalPlaces = 2;
            }

            if (integerPart === 0n && overallBigInt > 0n) {
                let tempVal = overallBigInt * 10000n / divisorBigInt;
                if (tempVal === 0n) {
                    numDecimalPlaces = 2;
                } else {
                     if (overallBigInt * (10n ** BigInt(2 + 1)) / divisorBigInt < 1n ) {
                         numDecimalPlaces = 2;
                     }
                }
            }

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
                    if (originalValueType === 'number') {
                        // For numbers >= 1e18, scientific notation is clearer than Qa, etc.
                        // This aligns with the new scientific function's BigInt path for very large numbers
                        let tempStr = numAsBigInt.toString();
                        let decPart = tempStr.length > 1 ? tempStr.substring(1,3) : "00";
                        decPart = decPart.padEnd(2, '0');
                        formattedResult = tempStr.charAt(0) + '.' + decPart + 'e' + (tempStr.length - 1);
                    } else { // Should ideally not be reached if original type was 'bigint'
                        let tempStr = numAsBigInt.toString();
                        formattedResult = tempStr.charAt(0) + '.' + tempStr.substring(1, 3) + 'e' + (tempStr.length - 1);
                    }
                } else if (numAsBigInt >= BI_1E15) {
                    formattedResult = formatBigIntSuffixed(numAsBigInt, BI_1E15, 'Qa');
                } else if (numAsBigInt >= BI_1E12) {
                    formattedResult = formatBigIntSuffixed(numAsBigInt, BI_1E12, 'T');
                } else if (numAsBigInt >= BI_1E9) {
                    formattedResult = formatBigIntSuffixed(numAsBigInt, BI_1E9, 'B');
                }
            }
        } else if (typeof workingValue === 'bigint') { // workingValue was originally BigInt or String parsed to BigInt
            const numAsBigInt = workingValue; // Already a BigInt
            if (numAsBigInt >= BI_1E18) { // For BigInts >= 10^18 (Quintillion)
                let tempStr = numAsBigInt.toString();
                let decPart = tempStr.length > 1 ? tempStr.substring(1,3) : "00"; // Get next two digits
                decPart = decPart.padEnd(2, '0'); // Pad with '0' if less than two digits
                formattedResult = tempStr.charAt(0) + '.' + decPart + 'e' + (tempStr.length - 1);
            } else if (numAsBigInt >= BI_1E15) {
                formattedResult = formatBigIntSuffixed(numAsBigInt, BI_1E15, 'Qa');
            } else if (numAsBigInt >= BI_1E12) {
                formattedResult = formatBigIntSuffixed(numAsBigInt, BI_1E12, 'T');
            } else if (numAsBigInt >= BI_1E9) {
                formattedResult = formatBigIntSuffixed(numAsBigInt, BI_1E9, 'B');
            } else { // BigInts less than 1 Billion
                formattedResult = workingValue.toLocaleString('en-US', { maximumFractionDigits: 0, minimumFractionDigits: 0 });
            }
        } else {
             formattedResult = "0"; // Should not be reached
        }

        return (isNegative ? '-' : '') + formattedResult;
    },

    hex: function(inputValue) {
        if (inputValue === undefined || inputValue === null) return "0";

        let isNegative = false;
        let integerHex = ""; // Only the integer part for spacing
        let fractionalHex = ""; // Fractional part, if any

        if (typeof inputValue === 'bigint') {
            if (inputValue === 0n) return "0";
            if (inputValue < 0n) {
                isNegative = true;
                inputValue = -inputValue;
            }
            integerHex = inputValue.toString(16);
            // No fractional part for BigInt
        } else {
            // Attempt to convert to Number if not BigInt (could be Number or String)
            let num = Number(inputValue);

            // Check for invalid or null after conversion (String might become NaN)
            if (isNaN(num) || inputValue === null) { // inputValue === null check is redundant due to the top check, but safe.
                // If original inputValue was a string that couldn't be parsed to a valid number
                if (typeof inputValue === 'string' && inputValue.trim() !== "" && !isFinite(Number(inputValue))) {
                     // Allow specific string "Infinity" to pass through, else return "0"
                    if (inputValue.toLowerCase() === "infinity" || inputValue.toLowerCase() === "-infinity") {
                        // Fall through to let standard Infinity handling take place, if any, or just let it be "infinity"
                         integerHex = inputValue.toLowerCase(); // "infinity"
                    } else {
                        return "0"; // Invalid string that's not "Infinity"
                    }
                } else if (inputValue !== null && typeof inputValue !== 'string') { // Non-string, non-BigInt, non-Number that became NaN
                     return "0";
                }
                 // else if null or empty string, it's already handled or will be by num === 0
            }


            if (num === 0) return "0"; // Handles Number 0 and strings like "0", "0.0"

            if (num < 0) {
                isNegative = true;
                num = -num;
            }

            if (!isFinite(num)) { // Handle Infinity and -Infinity that passed through or were converted
                integerHex = "infinity"; // Standard representation for Infinity in hex output
                // No fractional part for Infinity
            } else {
                const integerNumPart = Math.floor(num);
                integerHex = integerNumPart.toString(16).toLowerCase();

                let fractionalNumPart = num - integerNumPart;
                if (Math.abs(num) < 1000 && fractionalNumPart > 1e-7) {
                    for (let i = 0; i < 3; i++) {
                        fractionalNumPart *= 16;
                        const digit = Math.floor(fractionalNumPart);
                        fractionalHex += digit.toString(16).toLowerCase(); // ensure lowercase
                        fractionalNumPart -= digit;
                        if (fractionalNumPart < 1e-7) break;
                    }
                    while (fractionalHex.length > 0 && fractionalHex.endsWith('0')) {
                        fractionalHex = fractionalHex.slice(0, -1);
                    }
                }
                if (integerNumPart === 0 && fractionalHex === "" && num !== 0) return "0";
            }
        }

        if ((integerHex === "" || integerHex === "0") && fractionalHex === "") {
            return "0";
        }
        if (integerHex === "0" && fractionalHex !== "") {
            // For cases like 0.5 -> "0.8", ensure integer part is "0" not empty.
        } else if (integerHex === "") { // Should not happen if handled above
            integerHex = "0";
        }


        let formattedIntegerHex = "";
        if (integerHex === "infinity") { // Don't add spaces to "infinity"
            formattedIntegerHex = integerHex;
        } else {
            for (let i = 0; i < integerHex.length; i++) {
                if (i > 0 && (integerHex.length - i) % 4 === 0) {
                    formattedIntegerHex += ' ';
                }
                formattedIntegerHex += integerHex[i];
            }
        }

        let finalResult = formattedIntegerHex;
        if (fractionalHex !== "") {
            finalResult += "." + fractionalHex;
        }

        return (isNegative ? '-' : '') + finalResult;
    },

    scientific: function(num) {
        if (num === undefined || num === null) {
            return "0";
        }

        const valueType = typeof num;
        let isNegative = false;
        let workingValueStr;

        if (valueType === 'bigint') {
            // Assumed to be >= 1e15, but the logic will handle any BigInt.
            // No, the requirement is that BigInts are >= 1e15.
            // The problem is that standard formatter already handles BigInts < 1e18 with suffixes.
            // This scientific function should primarily kick in for BigInts that would otherwise be 'Qa' or larger,
            // or if explicitly called.
            // For now, let's stick to the ">= 1e15" assumption for BigInts *passed directly to scientific*.
            // If a BigInt < 1e15 is passed, it will still be formatted, but the assumption is it's >= 1e15.

            if (num < 0n) {
                isNegative = true;
                workingValueStr = (-num).toString();
            } else {
                workingValueStr = num.toString();
            }

            if (workingValueStr === "0") return "0"; // Handles 0n

            let integerPart = workingValueStr.charAt(0);
            let fractionalPart = "";
            if (workingValueStr.length > 1) {
                fractionalPart = workingValueStr.substring(1, 3); // Next two characters
            }
            fractionalPart = fractionalPart.padEnd(2, '0'); // Pad with '0' if needed

            const exponent = workingValueStr.length - 1;
            return (isNegative ? '-' : '') + integerPart + '.' + fractionalPart + 'e' + exponent;

        } else if (valueType === 'number') {
            if (isNaN(num) || !isFinite(num)) return this.standard(num); // Let standard handle NaN/Infinity

            const absNum = Math.abs(num);
            if (absNum === 0) return "0"; // Handle 0 explicitly

            // If its absolute value is less than 10, call this.standard(num)
            if (absNum < 10) {
                return this.standard(num);
            } else {
                // Otherwise, use num.toExponential(2).replace('e+', 'e')
                return num.toExponential(2).replace('e+', 'e');
            }
        } else if (valueType === 'string') {
            // Attempt to parse as BigInt first, then Number, then default to standard.
            try {
                const bigIntValue = BigInt(num);
                // If it parses as BigInt, treat it as such.
                // Re-call scientific with the BigInt value to use the BigInt logic.
                return this.scientific(bigIntValue);
            } catch (e) {
                // Not a BigInt string, try as Number.
                const numberValue = Number(num);
                if (isNaN(numberValue) || !isFinite(numberValue)) {
                    // If it's not a valid number string (e.g., "abc", "1.2.3")
                    // or if it's a string like "Infinity"
                    return this.standard(num); // Fallback to standard for unparseable or special strings
                }
                // Re-call scientific with the Number value to use the Number logic.
                return this.scientific(numberValue);
            }
        } else {
            // For any other types, or if somehow missed, return "0" or delegate to standard.
            return "0";
        }
    },

    format: function(value) {
        if (value === undefined || value === null) return '0';

        switch (this.selectedFormat) {
            case 'standard':
                return this.standard(value);
            case 'hex':
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
