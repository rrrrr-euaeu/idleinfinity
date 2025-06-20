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
        function formatSuffixedValue(value, precision) {
            let s = value.toFixed(precision);
            // Only process if there's a decimal point and it's not an integer already
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
        if (num >= 1e18) { // For 1e18 and above
            return num.toExponential(2).replace('e+', 'e');
        } else if (num >= 1e15) { // For [1e15, 1e18)
            let value = num / 1e15;
            if (value < 10) return formatSuffixedValue(value, 2) + 'Qa';
            if (value < 100) return formatSuffixedValue(value, 1) + 'Qa';
            return Math.floor(value).toString() + 'Qa';
        } else if (num >= 1e12) { // For [1e12, 1e15)
            let value = num / 1e12;
            if (value < 10) return formatSuffixedValue(value, 2) + 'T';
            if (value < 100) return formatSuffixedValue(value, 1) + 'T';
            return Math.floor(value).toString() + 'T';
        } else { // For [1e9, 1e12) - num >= 1e9 is implied
            let value = num / 1e9;
            if (value < 10) return formatSuffixedValue(value, 2) + 'B';
            if (value < 100) return formatSuffixedValue(value, 1) + 'B';
            return Math.floor(value).toString() + 'B';
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
