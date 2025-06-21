// Assertion Message Format:
// For assert.strictEqual(NumberFormatter.format(inputValue), expectedValue, message),
// the 'message' (3rd argument) should follow the format:
// "InputType: InputValueAsCode => ExpectedValue (Description)"
// Examples:
// "Number: 0 => 0 (zero input)"
// "BigInt: 10n**15n => 1Qa (Qa suffix boundary)"
// "String: \"-1000\" => -1,000 (comma grouping)"
// "Number: 1.2345e16 => 12.3Qa (truncate rule)"
// "BigInt: 10n**18n - 1000n => 999Qa (999-rule)"
// "String: \"-1237500000000000000\" => -1.23e18 (exp, truncate 2 dec)"

// tests/numberFormatter.test.js

QUnit.module("NumberFormatter", function() {
    QUnit.module("format - standard", function(hooks) {
        hooks.beforeEach(function() {
            NumberFormatter.setSelectedFormat('standard');
        });

        QUnit.test("zero", function(assert) {
            assert.strictEqual(NumberFormatter.format(0), "0", "Number: 0 => 0 (zero input)");
        });

        QUnit.test("small numbers (integers)", function(assert) {
            assert.strictEqual(NumberFormatter.format(1), "1", "Number: 1 => 1 (integer)");
            assert.strictEqual(NumberFormatter.format(12), "12", "Number: 12 => 12 (integer)");
            assert.strictEqual(NumberFormatter.format(123), "123", "Number: 123 => 123 (integer)");
            assert.strictEqual(NumberFormatter.format(999), "999", "Number: 999 => 999 (integer)");
        });

        QUnit.test("small numbers (decimals, rounding)", function(assert) {
            assert.strictEqual(NumberFormatter.format(0.1), "0.1", "Number: 0.1 => 0.1 (decimal)");
            assert.strictEqual(NumberFormatter.format(0.12), "0.12", "Number: 0.12 => 0.12 (decimal)");
            assert.strictEqual(NumberFormatter.format(0.123), "0.123", "Number: 0.123 => 0.123 (decimal)");
            assert.strictEqual(NumberFormatter.format(0.1234), "0.123", "Number: 0.1234 => 0.123 (decimal rounding)");
            assert.strictEqual(NumberFormatter.format(1.2), "1.2", "Number: 1.2 => 1.2 (decimal)");
            assert.strictEqual(NumberFormatter.format(1.23), "1.23", "Number: 1.23 => 1.23 (decimal)");
            assert.strictEqual(NumberFormatter.format(1.234), "1.23", "Number: 1.234 => 1.23 (decimal rounding)");
            assert.strictEqual(NumberFormatter.format(12.3), "12.3", "Number: 12.3 => 12.3 (decimal)");
            assert.strictEqual(NumberFormatter.format(12.34), "12.3", "Number: 12.34 => 12.3 (decimal rounding)");
            assert.strictEqual(NumberFormatter.format(123.4), "123", "Number: 123.4 => 123 (decimal rounding)");
        });

        QUnit.test("very small positive numbers", function(assert) {
            assert.strictEqual(NumberFormatter.format(0.000001), "0", "Number: 0.000001 => 0 (very small)");
            assert.strictEqual(NumberFormatter.format(0.0000001), "0", "Number: 0.0000001 => 0 (very small)");
        });

        QUnit.test("thousands (locale string, no suffix)", function(assert) {
            assert.strictEqual(NumberFormatter.format(1000), "1,000", "Number: 1000 => 1,000 (comma grouping)");
            assert.strictEqual(NumberFormatter.format(12345), "12,345", "Number: 12345 => 12,345 (comma grouping)");
            assert.strictEqual(NumberFormatter.format(123456), "123,456", "Number: 123456 => 123,456 (comma grouping)");
            assert.strictEqual(NumberFormatter.format(999999), "999,999", "Number: 999999 => 999,999 (comma grouping)");
        });

        QUnit.test("millions (B suffix)", function(assert) {
            assert.strictEqual(NumberFormatter.format(1000000), "1,000,000", "Number: 1000000 => 1,000,000 (comma grouping)");
            assert.strictEqual(NumberFormatter.format(999999999), "999,999,999", "Number: 999999999 => 999,999,999 (comma grouping)");
            assert.strictEqual(NumberFormatter.format(1000000000), "1B", "Number: 1000000000 => 1B (B suffix)");
            assert.strictEqual(NumberFormatter.format(1.23456789e9), "1.23B", "Number: 1.23456789e9 => 1.23B (B suffix, truncate rule)");
            assert.strictEqual(NumberFormatter.format(12.3456789e9), "12.3B", "Number: 12.3456789e9 => 12.3B (B suffix, truncate rule)");
            assert.strictEqual(NumberFormatter.format(123.456789e9), "123B", "Number: 123.456789e9 => 123B (B suffix, truncate rule)");
        });

        QUnit.test("trillions (T suffix)", function(assert) {
            assert.strictEqual(NumberFormatter.format(1e12), "1T", "Number: 1e12 => 1T (T suffix)");
            assert.strictEqual(NumberFormatter.format(1.234e12), "1.23T", "Number: 1.234e12 => 1.23T (T suffix, truncate rule)");
            assert.strictEqual(NumberFormatter.format(12.34e12), "12.3T", "Number: 12.34e12 => 12.3T (T suffix, truncate rule)");
            assert.strictEqual(NumberFormatter.format(123.4e12), "123T", "Number: 123.4e12 => 123T (T suffix, truncate rule)");
        });

        QUnit.test("quadrillions (Qa suffix)", function(assert) {
            assert.strictEqual(NumberFormatter.format(1e15), "1Qa", "Number: 1e15 => 1Qa (Qa suffix)");
            assert.strictEqual(NumberFormatter.format(1.234e15), "1.23Qa", "Number: 1.234e15 => 1.23Qa (Qa suffix, truncate rule)");
            assert.strictEqual(NumberFormatter.format(12.34e15), "12.3Qa", "Number: 12.34e15 => 12.3Qa (Qa suffix, truncate rule)");
            assert.strictEqual(NumberFormatter.format(123.4e15), "123Qa", "Number: 123.4e15 => 123Qa (Qa suffix, truncate rule)");
        });

        QUnit.test("large numbers (scientific fallback for >= 1e18)", function(assert) {
            assert.strictEqual(NumberFormatter.format(1e18), "1.00e18", "Number: 1e18 => 1.00e18 (exponential)");
            assert.strictEqual(NumberFormatter.format(1.23e19), "1.23e19", "Number: 1.23e19 => 1.23e19 (exponential)");
        });

        QUnit.test("negative numbers", function(assert) {
            assert.strictEqual(NumberFormatter.format(-123), "-123", "Number: -123 => -123 (negative integer)");
            assert.strictEqual(NumberFormatter.format(Number(-12345)), "-12,345", "Number: Number(-12345) => -12,345 (negative, comma grouping)");
            assert.strictEqual(NumberFormatter.format(BigInt(-1234567)), "-1,234,567", "BigInt: BigInt(-1234567) => -1,234,567 (negative, comma grouping)");
            assert.strictEqual(NumberFormatter.format(-1.234e9), "-1.23B", "Number: -1.234e9 => -1.23B (negative, B suffix)");
            assert.strictEqual(NumberFormatter.format(-1e15), "-1Qa", "Number: -1e15 => -1Qa (negative, Qa suffix)");
        });

    QUnit.test("standard format - more small numbers and boundaries", function(assert) {
        assert.strictEqual(NumberFormatter.format(0.0000099), "0", "Number: 0.0000099 => 0 (very small positive)");
        assert.strictEqual(NumberFormatter.format(0.00001), "0", "Number: 0.00001 => 0 (very small positive)");
        assert.strictEqual(NumberFormatter.format(0.0099), "0.0099", "Number: 0.0099 => 0.0099 (decimal, toFixed(4))");
        assert.strictEqual(NumberFormatter.format(0.001), "0.001", "Number: 0.001 => 0.001 (decimal, toFixed(3))");

        assert.strictEqual(NumberFormatter.format(0.999), "0.999", "Number: 0.999 => 0.999 (decimal, toFixed(3))");
        assert.strictEqual(NumberFormatter.format(0.01), "0.01", "Number: 0.01 => 0.01 (decimal, toFixed(2))");
        assert.strictEqual(NumberFormatter.format(0.9999), "1", "Number: 0.9999 => 1 (decimal rounding)");

        assert.strictEqual(NumberFormatter.format(9.99), "9.99", "Number: 9.99 => 9.99 (decimal, toFixed(2))");
        assert.strictEqual(NumberFormatter.format(1), "1", "Number: 1 => 1 (integer)");
        assert.strictEqual(NumberFormatter.format(9.999), "10", "Number: 9.999 => 10 (decimal rounding)");

        assert.strictEqual(NumberFormatter.format(99.9), "99.9", "Number: 99.9 => 99.9 (decimal, toFixed(1))");
        assert.strictEqual(NumberFormatter.format(10), "10", "Number: 10 => 10 (integer)");
        assert.strictEqual(NumberFormatter.format(99.99), "100", "Number: 99.99 => 100 (decimal rounding)");
    });

    QUnit.test("standard format - toLocaleString boundaries and suffixes", function(assert) {
        assert.strictEqual(NumberFormatter.format(100), "100", "Number: 100 => 100 (integer, no suffix)");
        assert.strictEqual(NumberFormatter.format(999999999), "999,999,999", "Number: 999999999 => 999,999,999 (comma grouping, no suffix)");
        assert.strictEqual(NumberFormatter.format(1e9 - 1), "999,999,999", "Number: 1e9 - 1 => 999,999,999 (boundary, comma grouping)");

        // Suffix boundaries
        assert.strictEqual(NumberFormatter.format(1e9), "1B", "Number: 1e9 => 1B (B suffix boundary)");
        assert.strictEqual(NumberFormatter.format(1e12 - 1), "999B", "Number: 1e12 - 1 => 999B (B suffix boundary, truncate rule)");
        assert.strictEqual(NumberFormatter.format(1e12), "1T", "Number: 1e12 => 1T (T suffix boundary)");
        assert.strictEqual(NumberFormatter.format(1e15 - 1), "999T", "Number: 1e15 - 1 => 999T (T suffix boundary, truncate rule)");
        assert.strictEqual(NumberFormatter.format(1e15), "1Qa", "Number: 1e15 => 1Qa (Qa suffix boundary)");

        // 1e18 - 1 cases
        const val1e18minus1Num = 1e18 - 1;
        assert.strictEqual(NumberFormatter.format(val1e18minus1Num), Number(val1e18minus1Num).toExponential(2).replace('e+', 'e'), "Number: val1e18minus1Num => " + Number(val1e18minus1Num).toExponential(2).replace('e+', 'e') + " (Number precision limit, exponential)");
        assert.strictEqual(NumberFormatter.format(10n**18n - 1n), "999Qa", "BigInt: 10n**18n - 1n => 999Qa (999-rule)");
        assert.strictEqual(NumberFormatter.format("999999999999999999"), "999Qa", "String: \"999999999999999999\" => 999Qa (999-rule)");

        assert.strictEqual(NumberFormatter.format(1e18), "1.00e18", "Number: 1e18 => 1.00e18 (exponential boundary)");
        assert.strictEqual(NumberFormatter.format(10n**18n), "1.00e18", "BigInt: 10n**18n => 1.00e18 (exponential boundary)");

        // Suffix value < 10 and < 100 boundaries
        assert.strictEqual(NumberFormatter.format(9.999e9), "9.99B", "Number: 9.999e9 => 9.99B (B suffix, truncate rule)");
        assert.strictEqual(NumberFormatter.format(10e9), "10B", "Number: 10e9 => 10B (B suffix)");
        assert.strictEqual(NumberFormatter.format(99.99e9), "99.9B", "Number: 99.99e9 => 99.9B (B suffix, truncate rule)");
        assert.strictEqual(NumberFormatter.format(100e9), "100B", "Number: 100e9 => 100B (B suffix)");
        assert.strictEqual(NumberFormatter.format(9.999e12), "9.99T", "Number: 9.999e12 => 9.99T (T suffix, truncate rule)");
        assert.strictEqual(NumberFormatter.format(99.99e12), "99.9T", "Number: 99.99e12 => 99.9T (T suffix, truncate rule)");
        assert.strictEqual(NumberFormatter.format(9.999e15), "9.99Qa", "Number: 9.999e15 => 9.99Qa (Qa suffix, truncate rule)");
        assert.strictEqual(NumberFormatter.format(99.99e15), "99.9Qa", "Number: 99.99e15 => 99.9Qa (Qa suffix, truncate rule)");
    });

    QUnit.test("quadrillions (Qa suffix - BigInt handling)", function(assert) {
        NumberFormatter.setSelectedFormat('standard');

        assert.strictEqual(NumberFormatter.format(1e15), "1Qa", "Number: 1e15 => 1Qa (Qa suffix boundary)");
        assert.strictEqual(NumberFormatter.format(1.23e15), "1.23Qa", "Number: 1.23e15 => 1.23Qa (Qa suffix)");
        assert.strictEqual(NumberFormatter.format(9.99e15), "9.99Qa", "Number: 9.99e15 => 9.99Qa (Qa suffix)");

        assert.strictEqual(NumberFormatter.format(10e15), "10Qa", "Number: 10e15 => 10Qa (Qa suffix)");
        assert.strictEqual(NumberFormatter.format(12.3e15), "12.3Qa", "Number: 12.3e15 => 12.3Qa (Qa suffix)");
        assert.strictEqual(NumberFormatter.format(99.9e15), "99.9Qa", "Number: 99.9e15 => 99.9Qa (Qa suffix)");

        assert.strictEqual(NumberFormatter.format(100e15), "100Qa", "Number: 100e15 => 100Qa (Qa suffix)");
        assert.strictEqual(NumberFormatter.format(123e15), "123Qa", "Number: 123e15 => 123Qa (Qa suffix)");
        assert.strictEqual(NumberFormatter.format(999e15), "999Qa", "Number: 999e15 => 999Qa (Qa suffix)");

        assert.strictEqual(NumberFormatter.format(1.2345e16), "12.3Qa", "Number: 1.2345e16 => 12.3Qa (truncate rule)");
        assert.strictEqual(NumberFormatter.format(12345n * (10n**12n)), "12.3Qa", "BigInt: 12345n * (10n**12n) => 12.3Qa (truncate rule)");
        assert.strictEqual(NumberFormatter.format("12345000000000000"), "12.3Qa", "String: \"12345000000000000\" => 12.3Qa (truncate rule)");

        assert.strictEqual(NumberFormatter.format(1.2344e16), "12.3Qa", "Number: 1.2344e16 => 12.3Qa (truncate rule)");

        assert.strictEqual(NumberFormatter.format(9.8765e17), "987Qa", "Number: 9.8765e17 => 987Qa (truncate rule)");

        assert.strictEqual(NumberFormatter.format(10n**18n - 1000n), "999Qa", "BigInt: 10n**18n - 1000n => 999Qa (999-rule)");
        assert.strictEqual(NumberFormatter.format("999999999999999000"), "999Qa", "String: \"999999999999999000\" => 999Qa (999-rule)");

        assert.strictEqual(NumberFormatter.format(999n * (10n**15n) - 1n), "998Qa", "BigInt: 999n * (10n**15n) - 1n => 998Qa (truncate rule)");
        assert.strictEqual(NumberFormatter.format("998999999999999999"), "998Qa", "String: \"998999999999999999\" => 998Qa (truncate rule)");

        assert.strictEqual(NumberFormatter.format(123n * (10n**13n)), "1.23Qa", "BigInt: 123n * (10n**13n) => 1.23Qa (truncate rule)");
        assert.strictEqual(NumberFormatter.format(1237n * (10n**12n)), "1.23Qa", "BigInt: 1237n * (10n**12n) => 1.23Qa (truncate rule)");

        assert.strictEqual(NumberFormatter.format(1234n * (10n**13n)), "12.3Qa", "BigInt: 1234n * (10n**13n) => 12.3Qa (truncate rule)");
        assert.strictEqual(NumberFormatter.format(1237n * (10n**13n)), "12.3Qa", "BigInt: 1237n * (10n**13n) => 12.3Qa (truncate rule)");
        assert.strictEqual(NumberFormatter.format(1234n * (10n**14n)), "123Qa", "BigInt: 1234n * (10n**14n) => 123Qa (truncate rule)");
        assert.strictEqual(NumberFormatter.format(1237n * (10n**14n)), "123Qa", "BigInt: 1237n * (10n**14n) => 123Qa (truncate rule)");
        assert.strictEqual(NumberFormatter.format(999n * (10n**15n)), "999Qa", "BigInt: 999n * (10n**15n) => 999Qa (integer)");
        assert.strictEqual(NumberFormatter.format(9998n * (10n**14n)), "999Qa", "BigInt: 9998n * (10n**14n) => 999Qa (truncate rule)");

        assert.strictEqual(NumberFormatter.format(1e15 - 1), "999T", "Number: 1e15 - 1 => 999T (T suffix boundary)");
    });

    QUnit.test("standard format - BigInt T and B suffixes", function(assert) {
        NumberFormatter.setSelectedFormat('standard');
        // Trillion (T)
        assert.strictEqual(NumberFormatter.format(10n**12n), "1T", "BigInt: 10n**12n => 1T (T suffix boundary)");
        assert.strictEqual(NumberFormatter.format(1234n * (10n**9n)), "1.23T", "BigInt: 1234n * (10n**9n) => 1.23T (T suffix, truncate rule)");
        assert.strictEqual(NumberFormatter.format(1237n * (10n**9n)), "1.23T", "BigInt: 1237n * (10n**9n) => 1.23T (T suffix, truncate rule)");
        assert.strictEqual(NumberFormatter.format(9876n * (10n**11n)), "987T", "BigInt: 9876n * (10n**11n) => 987T (T suffix, truncate rule)");
        assert.strictEqual(NumberFormatter.format(9998n * (10n**11n)), "999T", "BigInt: 9998n * (10n**11n) => 999T (T suffix, 999-rule)");
        // Billion (B)
        assert.strictEqual(NumberFormatter.format(10n**9n), "1B", "BigInt: 10n**9n => 1B (B suffix boundary)");
        assert.strictEqual(NumberFormatter.format(1234n * (10n**6n)), "1.23B", "BigInt: 1234n * (10n**6n) => 1.23B (B suffix, truncate rule)");
        assert.strictEqual(NumberFormatter.format(1237n * (10n**6n)), "1.23B", "BigInt: 1237n * (10n**6n) => 1.23B (B suffix, truncate rule)");
        assert.strictEqual(NumberFormatter.format(9998n * (10n**8n)), "999B", "BigInt: 9998n * (10n**8n) => 999B (B suffix, 999-rule)");
    });

    QUnit.test("standard format - BigInt exponential notation", function(assert) {
        NumberFormatter.setSelectedFormat('standard');
        assert.strictEqual(NumberFormatter.format(10n**18n), "1.00e18", "BigInt: 10n**18n => 1.00e18 (exp, truncate 2 dec)");
        assert.strictEqual(NumberFormatter.format(10000n * (10n**14n)), "1.00e18", "BigInt: 10000n * (10n**14n) => 1.00e18 (exp, truncate 2 dec)");

        assert.strictEqual(NumberFormatter.format(1234n * (10n**15n)), "1.23e18", "BigInt: 1234n * (10n**15n) => 1.23e18 (exp, truncate 2 dec)");
        assert.strictEqual(NumberFormatter.format(1237n * (10n**15n)), "1.23e18", "BigInt: 1237n * (10n**15n) => 1.23e18 (exp, truncate 2 dec)");
        assert.strictEqual(NumberFormatter.format(12345n * (10n**14n)), "1.23e18", "BigInt: 12345n * (10n**14n) => 1.23e18 (exp, truncate 2 dec)");
        assert.strictEqual(NumberFormatter.format(BigInt("1237500000000000000")), "1.23e18", "BigInt: BigInt(\"1237500000000000000\") => 1.23e18 (exp, truncate 2 dec)");

        assert.strictEqual(NumberFormatter.format(12000n * (10n**14n)), "1.20e18", "BigInt: 12000n * (10n**14n) => 1.20e18 (exp, truncate 2 dec)");

        assert.strictEqual(NumberFormatter.format(10n**20n), "1.00e20", "BigInt: 10n**20n => 1.00e20 (exp, truncate 2 dec)");
        assert.strictEqual(NumberFormatter.format(BigInt("-1237500000000000000")), "-1.23e18", "BigInt: BigInt(\"-1237500000000000000\") => -1.23e18 (exp, truncate 2 dec)");
    });

    QUnit.test("standard format - String inputs", function(assert) {
        NumberFormatter.setSelectedFormat('standard');
        assert.strictEqual(NumberFormatter.format("0"), "0", "String: \"0\" => 0 (zero input)");
        assert.strictEqual(NumberFormatter.format("123"), "123", "String: \"123\" => 123 (integer)");
        assert.strictEqual(NumberFormatter.format("-1000"), "-1,000", "String: \"-1000\" => -1,000 (negative, comma grouping)");
        assert.strictEqual(NumberFormatter.format("-12345"), "-12,345", "String: \"-12345\" => -12,345 (negative, comma grouping)");
        assert.strictEqual(NumberFormatter.format("1234567890"), "1.23B", "String: \"1234567890\" => 1.23B (B suffix, truncate rule)");
        assert.strictEqual(NumberFormatter.format("123456789012345678"), "123Qa", "String: \"123456789012345678\" => 123Qa (Qa suffix, truncate rule)");
        assert.strictEqual(NumberFormatter.format("-1234567890123456789"), "-1.23e18", "String: \"-1234567890123456789\" => -1.23e18 (exp, truncate 2 dec)");
    });

    });

    QUnit.module("format - hex", function(hooks) {
        hooks.beforeEach(function() {
            NumberFormatter.setSelectedFormat('hex');
        });

        QUnit.test("integers", function(assert) {
            assert.strictEqual(NumberFormatter.format(0), "0", "Number: 0 => 0 (hex)");
            assert.strictEqual(NumberFormatter.format(10), "a", "Number: 10 => a (hex)");
            assert.strictEqual(NumberFormatter.format(255), "ff", "Number: 255 => ff (hex)");
            assert.strictEqual(NumberFormatter.format(4096), "1000", "Number: 4096 => 1000 (hex)");
            assert.strictEqual(NumberFormatter.format(65535), "ffff", "Number: 65535 => ffff (hex)");
        });

        QUnit.test("decimals (limited precision, for small numbers)", function(assert) {
            assert.strictEqual(NumberFormatter.format(10.5), "a.8", "Number: 10.5 => a.8 (hex decimal)");
            assert.strictEqual(NumberFormatter.format(255.75), "ff.c", "Number: 255.75 => ff.c (hex decimal)");
            assert.strictEqual(NumberFormatter.format(0.0625), "0.1", "Number: 0.0625 => 0.1 (hex decimal)");
            assert.strictEqual(NumberFormatter.format(1000.000001), "3e8", "Number: 1000.000001 => 3e8 (hex, no fractional)"); // No fractional for large numbers
        });

        QUnit.test("negative numbers (hex)", function(assert) {
            assert.strictEqual(NumberFormatter.format(-10), "-a", "Number: -10 => -a (negative hex)");
            assert.strictEqual(NumberFormatter.format(-255.75), "-ff.c", "Number: -255.75 => -ff.c (negative hex decimal)");
        });

        QUnit.test("BigInt inputs (direct hex conversion)", function(assert) {
            NumberFormatter.setSelectedFormat('hex');
            assert.strictEqual(NumberFormatter.format(0n), "0", "BigInt: 0n => 0 (hex)");
            assert.strictEqual(NumberFormatter.format(10n**15n), "38d7 ea4c 68000", "BigInt: 10n**15n => 38d7 ea4c 68000 (hex, direct BigInt)");
            assert.strictEqual(NumberFormatter.format(-(10n**15n)), "-38d7 ea4c 68000", "BigInt: -(10n**15n) => -38d7 ea4c 68000 (hex, direct BigInt)");
            assert.strictEqual(NumberFormatter.format(10n**18n - 1n), "de0b 6b3a 763f ffff", "BigInt: 10n**18n - 1n => de0b 6b3a 763f ffff (hex, direct BigInt)");
            assert.strictEqual(NumberFormatter.format(10n**21n), "36 35c9 adc5 dea0 0000", "BigInt: 10n**21n => 36 35c9 adc5 dea0 0000 (hex, direct BigInt)");
            // The following two are very long, ensure they don't cause issues, actual value check might be too much for here
            // For 10n**30n, the full string is "c9f2c9cd046750000000000000000", which gets formatted.
            assert.strictEqual(NumberFormatter.format(10n**30n), "c9f2 c9cd 0467 5000 0000 0000", "BigInt: 10n**30n => c9f2 c9cd 0467 5000 0000 0000 (hex, direct BigInt, might be truncated by Number in old version)");
            assert.ok(NumberFormatter.format(10n**309n).length > 50, "BigInt: 10n**309n produces a long hex string (direct BigInt)");
        });
    });

    QUnit.module("format - scientific", function(hooks) {
        hooks.beforeEach(function() {
            NumberFormatter.setSelectedFormat('scientific');
        });

        QUnit.test("small numbers (uses standard formatting)", function(assert) {
            assert.strictEqual(NumberFormatter.format(0), "0", "Number: 0 => 0 (scientific via standard)");
            assert.strictEqual(NumberFormatter.format(5), "5", "Number: 5 => 5 (scientific via standard)");
            assert.strictEqual(NumberFormatter.format(9.99), "9.99", "Number: 9.99 => 9.99 (scientific via standard)");
        });

        QUnit.test("large numbers", function(assert) {
            assert.strictEqual(NumberFormatter.format(10), "1.00e1", "Number: 10 => 1.00e1 (scientific)");
            assert.strictEqual(NumberFormatter.format(12345), "1.23e4", "Number: 12345 => 1.23e4 (scientific)");
            assert.strictEqual(NumberFormatter.format(1.2345e9), "1.23e9", "Number: 1.2345e9 => 1.23e9 (scientific)");
        });

        QUnit.test("negative numbers (scientific)", function(assert) {
            assert.strictEqual(NumberFormatter.format(-12345), "-1.23e4", "Number: -12345 => -1.23e4 (negative scientific)");
        });

        QUnit.test("BigInt inputs (converted to Number for scientific)", function(assert) {
            NumberFormatter.setSelectedFormat('scientific');
            assert.strictEqual(NumberFormatter.format(0n), "0", "BigInt: 0n => 0 (scientific, via standard)");
            assert.strictEqual(NumberFormatter.format(5n), "5", "BigInt: 5n => 5 (scientific, via standard)");
            assert.strictEqual(NumberFormatter.format(10n**15n), "1.00e15", "BigInt: 10n**15n => 1.00e15 (scientific, Number.toExponential(2))");
            assert.strictEqual(NumberFormatter.format(12345n * (10n**14n)), "1.23e18", "BigInt: 1.2345e18 => 1.23e18 (scientific, Number.toExponential(2), truncate 4)");
            assert.strictEqual(NumberFormatter.format(12375n * (10n**14n)), "1.24e18", "BigInt: 1.2375e18 => 1.24e18 (scientific, Number.toExponential(2), round up 75)");
            assert.strictEqual(NumberFormatter.format(-(10n**18n)), "-1.00e18", "BigInt: -(10n**18n) => -1.00e18 (scientific, Number.toExponential(2))");
            assert.strictEqual(NumberFormatter.format(10n**30n), "1.00e30", "BigInt: 10n**30n => 1.00e30 (scientific, Number.toExponential(2))");
            assert.strictEqual(NumberFormatter.format(10n**309n), "Infinity", "BigInt: 10n**309n => Infinity (scientific, Number.toExponential(2))");
        });
    });
});
