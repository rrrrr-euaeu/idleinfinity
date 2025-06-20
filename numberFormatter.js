// --- Number Formatter Object ---
const NumberFormatter = {
    selectedFormat: 'standard', // Default format

    setSelectedFormat: function(formatType) {
        this.selectedFormat = formatType;
    },

    standard: function(num) {
        if (num === undefined || num === null) return '0';
        if (num === 0) return "0";
        if (num < 0) return '-' + this.standard(Math.abs(num));

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

        if (num < 0.00001 && num > 0) return "0"; // Avoid extremely small fractions like e-6
        if (num < 0.01) return parseFloat(num.toFixed(4)).toString();
        if (num < 1) return parseFloat(num.toFixed(3)).toString();
        if (num < 10) return parseFloat(num.toFixed(2)).toString();
        if (num < 100) return parseFloat(num.toFixed(1)).toString();

        // Standard suffixes up to Billion, then custom for Trillion, Quadrillion
        if (num < 1e9) { // Less than 1 Billion
            return num.toLocaleString('en-US', { maximumFractionDigits: 0, minimumFractionDigits: 0 });
        }

        // Handle large numbers with suffixes
        // Note: 1e18 - 1 in JavaScript Number type is often indistinguishable from 1e18.
        // So, num >= 1e18 will likely be true for 1e18 - 1.
        if (num >= 1e18) { // For 1e18 and above (including 1e18-1 due to Number precision)
            return num.toExponential(2).replace('e+', 'e');
        } else if (num >= 1e15) { // For [1e15, 1e18)
            // At this point, num < 1e18 (as Number).
            // We use Math.floor to ensure that if num is extremely close to 1e18 (e.g. 1e18 - epsilon),
            // its BigInt representation is less than 10^18.
            const currentNumBigInt = BigInt(Math.floor(num));
            const BInt1e15 = BigInt("1000000000000000");   // 10n**15n
            const divisor = BInt1e15;

            // baseScaleFactorPrecision needs to be defined within this block or passed.
            // It was defined outside in some previous versions.
            const baseScaleFactorPrecision = 3; // For 3 decimal places precision initially
            const scaleFactorBigInt = BigInt(10**baseScaleFactorPrecision);

            const integerPartOfValue = currentNumBigInt / divisor;

            let finalPrecision = 0;
            if (integerPartOfValue < BigInt(10)) { // e.g., 1.23Qa, 9.99Qa
                finalPrecision = 2;
            } else if (integerPartOfValue < BigInt(100)) { // e.g., 12.3Qa, 99.9Qa
                finalPrecision = 1;
            }
            // else finalPrecision remains 0 for numbers like 123Qa, 999Qa

            let resultStr;
            if (finalPrecision === 0) {
                resultStr = integerPartOfValue.toString();
            } else {
                // Calculate scaled value: (currentNumBigInt / divisor) * scaleFactorBigInt
                // To maintain precision for rounding, calculate (currentNumBigInt * scaleFactorBigInt) / divisor
                let valueScaledBigInt = currentNumBigInt * scaleFactorBigInt / divisor;
                let valueScaledStr = valueScaledBigInt.toString();

                // String representing the number with baseScaleFactorPrecision decimals
                let tempStr;
                if (valueScaledStr.length > baseScaleFactorPrecision) {
                    tempStr = valueScaledStr.slice(0, -baseScaleFactorPrecision) + "." + valueScaledStr.slice(-baseScaleFactorPrecision);
                } else {
                    tempStr = "0." + "0".repeat(baseScaleFactorPrecision - valueScaledStr.length) + valueScaledStr;
                }

                // tempStr is like "1.234" if num=1.2345e15, scaleFactor=1000
                // finalPrecision is 2, so we need "1.23" (after rounding 4) or "1.24" (after rounding 5)

                let parts = tempStr.split('.');
                let currentIntegerPartStr = parts[0];
                let currentFractionalPartStr = parts[1] || "";

                if (currentFractionalPartStr.length > finalPrecision) {
                    let digitAfterFinalPrecision = parseInt(currentFractionalPartStr[finalPrecision]);

                    if (digitAfterFinalPrecision >= 5) {
                        // Need to round up. Add 1 at the (finalPrecision)-th decimal place.
                        // This is equivalent to adding 1 to the number scaled by 10^finalPrecision
                        let scaledFractional = BigInt(currentFractionalPartStr.substring(0, finalPrecision)) + BigInt(1);
                        let roundedFractionalStr = scaledFractional.toString().padStart(finalPrecision, '0');

                        if (roundedFractionalStr.length > finalPrecision) { // Carry-over to integer part
                            currentIntegerPartStr = (BigInt(currentIntegerPartStr) + BigInt(1)).toString();
                            // The fractional part after carry-over would be the remainder, but for fixed precision, it's just zeros
                            // However, we've already rounded, so we take the rightmost 'finalPrecision' digits.
                            // e.g. 0.99 + 0.01 -> 1.00. scaledFractional = 100. finalPrecision = 2.
                            // roundedFractionalStr = "100". If finalPrecision is 2, we need "00".
                            // This means currentIntegerPartStr became "1", roundedFractionalStr should be "00".
                             roundedFractionalStr = roundedFractionalStr.substring(roundedFractionalStr.length - finalPrecision);
                        }
                        resultStr = currentIntegerPartStr + "." + roundedFractionalStr;
                    } else {
                        // Truncate
                        resultStr = currentIntegerPartStr + "." + currentFractionalPartStr.substring(0, finalPrecision);
                    }
                } else {
                    // Pad with trailing zeros if current fractional part is shorter than finalPrecision
                    resultStr = currentIntegerPartStr + "." + currentFractionalPartStr.padEnd(finalPrecision, '0');
                }
            }
            return formatSuffixedValue(resultStr) + 'Qa';
        } else if (num >= 1e12) { // For [1e12, 1e15)
            let value = num / 1e12;
            if (value < 10) return formatSuffixedValue(value.toFixed(2)) + 'T';
            if (value < 100) return formatSuffixedValue(value.toFixed(1)) + 'T';
            return formatSuffixedValue(Math.floor(value).toString()) + 'T';
        } else { // For [1e9, 1e12) - num >= 1e9 is implied
            let value = num / 1e9;
            if (value < 10) return formatSuffixedValue(value.toFixed(2)) + 'B';
            if (value < 100) return formatSuffixedValue(value.toFixed(1)) + 'B';
            return formatSuffixedValue(Math.floor(value).toString()) + 'B';
        }
    },

    hex: function(num) {
        if (num === undefined || num === null) return "0";
        if (num === 0) return "0";

        const sign = num < 0 ? "-" : "";
        const absNum = Math.abs(num);

        const integerPart = Math.floor(absNum);
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

    format: function(num) {
        if (num === undefined || num === null) return "0"; // Default for undefined or null inputs

        switch (this.selectedFormat) {
            case 'standard':
                return this.standard(num);
            case 'hex':
                return this.hex(num);
            case 'scientific':
                return this.scientific(num);
            default:
                return this.standard(num); // Fallback to standard
        }
    }
};
// No explicit global export (e.g. window.NumberFormatter = NumberFormatter) needed
// if scripts are loaded directly in HTML.
