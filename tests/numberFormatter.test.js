// tests/numberFormatter.test.js

QUnit.module("NumberFormatter", function() {
    QUnit.module("format - standard", function(hooks) {
        hooks.beforeEach(function() {
            NumberFormatter.setSelectedFormat('standard');
        });

        QUnit.test("zero", function(assert) {
            assert.strictEqual(NumberFormatter.format(0), "0", "NumberFormatter.format(0) => '0'");
        });

        QUnit.test("small numbers (integers)", function(assert) {
            assert.strictEqual(NumberFormatter.format(1), "1", "NumberFormatter.format(1) => '1'");
            assert.strictEqual(NumberFormatter.format(12), "12", "NumberFormatter.format(12) => '12'");
            assert.strictEqual(NumberFormatter.format(123), "123", "NumberFormatter.format(123) => '123'");
            assert.strictEqual(NumberFormatter.format(999), "999", "NumberFormatter.format(999) => '999'");
        });

        QUnit.test("small numbers (decimals, rounding)", function(assert) {
            assert.strictEqual(NumberFormatter.format(0.1), "0.1", "NumberFormatter.format(0.1) => '0.1'");
            assert.strictEqual(NumberFormatter.format(0.12), "0.12", "NumberFormatter.format(0.12) => '0.12'");
            assert.strictEqual(NumberFormatter.format(0.123), "0.123", "NumberFormatter.format(0.123) => '0.123'");
            assert.strictEqual(NumberFormatter.format(0.1234), "0.123", "NumberFormatter.format(0.1234) => '0.123'");
            assert.strictEqual(NumberFormatter.format(1.2), "1.2", "NumberFormatter.format(1.2) => '1.2'");
            assert.strictEqual(NumberFormatter.format(1.23), "1.23", "NumberFormatter.format(1.23) => '1.23'");
            assert.strictEqual(NumberFormatter.format(1.234), "1.23", "NumberFormatter.format(1.234) => '1.23'");
            assert.strictEqual(NumberFormatter.format(12.3), "12.3", "NumberFormatter.format(12.3) => '12.3'");
            assert.strictEqual(NumberFormatter.format(12.34), "12.3", "NumberFormatter.format(12.34) => '12.3'");
            assert.strictEqual(NumberFormatter.format(123.4), "123", "NumberFormatter.format(123.4) => '123'");
        });

        QUnit.test("very small positive numbers", function(assert) {
            assert.strictEqual(NumberFormatter.format(0.000001), "0", "NumberFormatter.format(0.000001) => '0'");
            // Based on current NumberFormatter.standard: if (num < 0.01) return parseFloat(num.toFixed(4)).toString();
            assert.strictEqual(NumberFormatter.format(0.0000001), "0", "NumberFormatter.format(0.0000001) => '0'");
        });

        QUnit.test("thousands (locale string, no suffix)", function(assert) {
            assert.strictEqual(NumberFormatter.format(1000), "1,000", "NumberFormatter.format(1000) => '1,000'");
            assert.strictEqual(NumberFormatter.format(12345), "12,345", "NumberFormatter.format(12345) => '12,345'");
            assert.strictEqual(NumberFormatter.format(123456), "123,456", "NumberFormatter.format(123456) => '123,456'");
            assert.strictEqual(NumberFormatter.format(999999), "999,999", "NumberFormatter.format(999999) => '999,999'");
        });

        QUnit.test("millions (B suffix)", function(assert) {
            assert.strictEqual(NumberFormatter.format(1000000), "1,000,000", "NumberFormatter.format(1000000) => '1,000,000'");
            assert.strictEqual(NumberFormatter.format(999999999), "999,999,999", "NumberFormatter.format(999999999) => '999,999,999'");
            assert.strictEqual(NumberFormatter.format(1000000000), "1B", "NumberFormatter.format(1000000000) => '1B'");
            assert.strictEqual(NumberFormatter.format(1.23456789e9), "1.23B", "NumberFormatter.format(1.23456789e9) => '1.23B'");
            assert.strictEqual(NumberFormatter.format(12.3456789e9), "12.3B", "NumberFormatter.format(12.3456789e9) => '12.3B'");
            assert.strictEqual(NumberFormatter.format(123.456789e9), "123B", "NumberFormatter.format(123.456789e9) => '123B'");
        });

        QUnit.test("trillions (T suffix)", function(assert) {
            assert.strictEqual(NumberFormatter.format(1e12), "1T", "NumberFormatter.format(1e12) => '1T'");
            assert.strictEqual(NumberFormatter.format(1.234e12), "1.23T", "NumberFormatter.format(1.234e12) => '1.23T'");
            assert.strictEqual(NumberFormatter.format(12.34e12), "12.3T", "NumberFormatter.format(12.34e12) => '12.3T'");
            assert.strictEqual(NumberFormatter.format(123.4e12), "123T", "NumberFormatter.format(123.4e12) => '123T'");
        });

        QUnit.test("quadrillions (Qa suffix)", function(assert) {
            assert.strictEqual(NumberFormatter.format(1e15), "1Qa", "NumberFormatter.format(1e15) => '1Qa'");
            assert.strictEqual(NumberFormatter.format(1.234e15), "1.23Qa", "NumberFormatter.format(1.234e15) => '1.23Qa'");
            assert.strictEqual(NumberFormatter.format(12.34e15), "12.3Qa", "NumberFormatter.format(12.34e15) => '12.3Qa'");
            assert.strictEqual(NumberFormatter.format(123.4e15), "123Qa", "NumberFormatter.format(123.4e15) => '123Qa'");
        });

        QUnit.test("large numbers (scientific fallback for >= 1e18)", function(assert) {
            assert.strictEqual(NumberFormatter.format(1e18), "1.00e18", "NumberFormatter.format(1e18) => '1.00e18'");
            assert.strictEqual(NumberFormatter.format(1.23e19), "1.23e19", "NumberFormatter.format(1.23e19) => '1.23e19'");
        });

        QUnit.test("negative numbers", function(assert) {
            assert.strictEqual(NumberFormatter.format(-123), "-123", "NumberFormatter.format(-123) => '-123'");
            assert.strictEqual(NumberFormatter.format(-1.234e9), "-1.23B", "NumberFormatter.format(-1.234e9) => '-1.23B'");
            assert.strictEqual(NumberFormatter.format(-1e15), "-1Qa", "NumberFormatter.format(-1e15) => '-1Qa'");
        });

    QUnit.test("standard format - more small numbers and boundaries", function(assert) {
        // Note: NumberFormatter.setSelectedFormat('standard'); is already in beforeEach for this module
        assert.strictEqual(NumberFormatter.format(0.0000099), "0", "NumberFormatter.format(0.0000099) => '0'");
        assert.strictEqual(NumberFormatter.format(0.00001), "0", "NumberFormatter.format(0.00001) => '0'");
        assert.strictEqual(NumberFormatter.format(0.0099), "0.0099", "NumberFormatter.format(0.0099) => '0.0099'");
        assert.strictEqual(NumberFormatter.format(0.001), "0.001", "NumberFormatter.format(0.001) => '0.001'");

        assert.strictEqual(NumberFormatter.format(0.999), "0.999", "NumberFormatter.format(0.999) => '0.999'");
        assert.strictEqual(NumberFormatter.format(0.01), "0.01", "NumberFormatter.format(0.01) => '0.01'");
        assert.strictEqual(NumberFormatter.format(0.9999), "1", "NumberFormatter.format(0.9999) => '1'");

        assert.strictEqual(NumberFormatter.format(9.99), "9.99", "NumberFormatter.format(9.99) => '9.99'");
        assert.strictEqual(NumberFormatter.format(1), "1", "NumberFormatter.format(1) => '1'");
        assert.strictEqual(NumberFormatter.format(9.999), "10", "NumberFormatter.format(9.999) => '10'");

        assert.strictEqual(NumberFormatter.format(99.9), "99.9", "NumberFormatter.format(99.9) => '99.9'");
        assert.strictEqual(NumberFormatter.format(10), "10", "NumberFormatter.format(10) => '10'");
        assert.strictEqual(NumberFormatter.format(99.99), "100", "NumberFormatter.format(99.99) => '100'");
    });

    QUnit.test("standard format - toLocaleString boundaries and suffixes", function(assert) {
        // Note: NumberFormatter.setSelectedFormat('standard'); is already in beforeEach for this module
        assert.strictEqual(NumberFormatter.format(100), "100", "NumberFormatter.format(100) => '100'");
        assert.strictEqual(NumberFormatter.format(999999999), "999,999,999", "NumberFormatter.format(999999999) => '999,999,999'");
        assert.strictEqual(NumberFormatter.format(1e9 - 1), "999,999,999", "NumberFormatter.format(1e9 - 1) => '999,999,999'");

        // Suffix boundaries
        assert.strictEqual(NumberFormatter.format(1e9), "1B", "NumberFormatter.format(1e9) => '1B'");
        assert.strictEqual(NumberFormatter.format(1e12 - 1), "999B", "NumberFormatter.format(1e12 - 1) => '999B'");
        assert.strictEqual(NumberFormatter.format(1e12), "1T", "NumberFormatter.format(1e12) => '1T'");
        assert.strictEqual(NumberFormatter.format(1e15 - 1), "999T", "NumberFormatter.format(1e15 - 1) => '999T'"); // This should remain as is, handled by non-BigInt path
        assert.strictEqual(NumberFormatter.format(1e15), "1Qa", "NumberFormatter.format(1e15) => '1Qa'");
        // Due to Number precision, 1e18 - 1 is often treated as 1e18, thus formatted as exponential.
        const val1e18minus1 = 1e18 - 1;
        assert.strictEqual(NumberFormatter.format(val1e18minus1), Number(val1e18minus1).toExponential(2).replace('e+', 'e'), "NumberFormatter.format(1e18 - 1) should now return exponential form due to Number precision");
        assert.strictEqual(NumberFormatter.format(1e18), "1.00e18", "NumberFormatter.format(1e18) => '1.00e18'");

        // Suffix value < 10 and < 100 boundaries (based on current toFixed rounding)
        // Billion
        assert.strictEqual(NumberFormatter.format(9.999e9), "10B", "NumberFormatter.format(9.999e9) => '10B'");
        assert.strictEqual(NumberFormatter.format(10e9), "10B", "NumberFormatter.format(10e9) => '10B'");
        assert.strictEqual(NumberFormatter.format(99.99e9), "100B", "NumberFormatter.format(99.99e9) => '100B'");
        assert.strictEqual(NumberFormatter.format(100e9), "100B", "NumberFormatter.format(100e9) => '100B'");
        // Trillion
        assert.strictEqual(NumberFormatter.format(9.999e12), "10T", "NumberFormatter.format(9.999e12) => '10T'");
        assert.strictEqual(NumberFormatter.format(99.99e12), "100T", "NumberFormatter.format(99.99e12) => '100T'");
        // Quadrillion
        assert.strictEqual(NumberFormatter.format(9.999e15), "10Qa", "NumberFormatter.format(9.999e15) => '10Qa'"); // Standard rounding in JS for suffixes. Qa logic might differ for BigInt.
        assert.strictEqual(NumberFormatter.format(99.99e15), "100Qa", "NumberFormatter.format(99.99e15) => '100Qa'"); // Standard rounding.
    });

    QUnit.test("quadrillions (Qa suffix - BigInt handling)", function(assert) {
        NumberFormatter.setSelectedFormat('standard'); // Ensure standard format

        assert.strictEqual(NumberFormatter.format(1e15), "1Qa", "1e15 => 1Qa");
        assert.strictEqual(NumberFormatter.format(1.23e15), "1.23Qa", "1.23e15 => 1.23Qa");
        assert.strictEqual(NumberFormatter.format(9.99e15), "9.99Qa", "9.99e15 => 9.99Qa");

        assert.strictEqual(NumberFormatter.format(10e15), "10Qa", "10e15 => 10Qa");
        assert.strictEqual(NumberFormatter.format(12.3e15), "12.3Qa", "12.3e15 => 12.3Qa");
        assert.strictEqual(NumberFormatter.format(99.9e15), "99.9Qa", "99.9e15 => 99.9Qa");

        assert.strictEqual(NumberFormatter.format(100e15), "100Qa", "100e15 => 100Qa");
        assert.strictEqual(NumberFormatter.format(123e15), "123Qa", "123e15 => 123Qa");
        assert.strictEqual(NumberFormatter.format(999e15), "999Qa", "999e15 => 999Qa");

        // Test rounding with BigInt logic
        // 1.2345e16 is 12.345e15. integerPartOfValue = 12n. finalPrecision = 1. tempStr = "12.345". digitAfter = 5. Should round to "12.4Qa".
        assert.strictEqual(NumberFormatter.format(1.2345e16), "12.4Qa", "1.2345e16 (12.345e15) => 12.4Qa (rounds up)");
        // 1.2344e16 is 12.344e15. integerPartOfValue = 12n. finalPrecision = 1. tempStr = "12.344". digitAfter = 4. Should truncate to "12.3Qa".
        assert.strictEqual(NumberFormatter.format(1.2344e16), "12.3Qa", "1.2344e16 (12.344e15) => 12.3Qa (truncates)");

        // 9.8765e17 is 987.65e15. integerPartOfValue = 987n. finalPrecision = 0. resultStr = "987".
        assert.strictEqual(NumberFormatter.format(9.8765e17), "987Qa", "9.8765e17 (987.65e15) => 987Qa (finalPrecision 0)");

        // Test near 1e18
        // Math.floor(1e18-1000) = 999999999999999000. BigInt(...) / 1e15n = 999999n. finalPrecision = 0.
        assert.strictEqual(NumberFormatter.format(1e18 - 1000), "999999Qa", "NumberFormatter.format(1e18 - 1000) => 999999Qa");

        // Test 999e15 - 1. Math.floor(999e15 - 1) depends on Number precision.
        // If 999e15 - 1 is 998999999999999999, then BigInt / 1e15n = 998n. finalPrecision = 0.
        const val999e15minus1 = 999e15 - 1; // May be 998.999...e15 in effect
        // Expected: BigInt(Math.floor(val999e15minus1)) / BInt1e15 .toString() + "Qa"
        // Math.floor(999000000000000000 - 1) = 998999999999999999
        // BigInt("998999999999999999") / BigInt("1000000000000000") = 998n
        assert.strictEqual(NumberFormatter.format(val999e15minus1), "998Qa", "NumberFormatter.format(999e15 - 1) => 998Qa");

        // Check if 1e15 - 1 is still "999T"
        assert.strictEqual(NumberFormatter.format(1e15 - 1), "999T", "NumberFormatter.format(1e15 - 1) remains 999T");
    });
    });

    QUnit.module("format - hex", function(hooks) {
        hooks.beforeEach(function() {
            NumberFormatter.setSelectedFormat('hex');
        });

        QUnit.test("integers", function(assert) {
            assert.strictEqual(NumberFormatter.format(0), "0", "NumberFormatter.format(0) => '0'");
            assert.strictEqual(NumberFormatter.format(10), "a", "NumberFormatter.format(10) => 'a'");
            assert.strictEqual(NumberFormatter.format(255), "ff", "NumberFormatter.format(255) => 'ff'");
            assert.strictEqual(NumberFormatter.format(4096), "1000", "NumberFormatter.format(4096) => '1000'");
            assert.strictEqual(NumberFormatter.format(65535), "ffff", "NumberFormatter.format(65535) => 'ffff'");
        });

        QUnit.test("decimals (limited precision, for small numbers)", function(assert) {
            // Note: hex fractional part is complex and has specific rules in the code
            assert.strictEqual(NumberFormatter.format(10.5), "a.8", "NumberFormatter.format(10.5) => 'a.8'");
            assert.strictEqual(NumberFormatter.format(255.75), "ff.c", "NumberFormatter.format(255.75) => 'ff.c'");
            assert.strictEqual(NumberFormatter.format(0.0625), "0.1", "NumberFormatter.format(0.0625) => '0.1'");
            assert.strictEqual(NumberFormatter.format(1000.000001), "3e8", "NumberFormatter.format(1000.000001) => '3e8'");
        });

        QUnit.test("negative numbers (hex)", function(assert) {
            assert.strictEqual(NumberFormatter.format(-10), "-a", "NumberFormatter.format(-10) => '-a'");
            assert.strictEqual(NumberFormatter.format(-255.75), "-ff.c", "NumberFormatter.format(-255.75) => '-ff.c'");
        });
    });

    QUnit.module("format - scientific", function(hooks) {
        hooks.beforeEach(function() {
            NumberFormatter.setSelectedFormat('scientific');
        });

        QUnit.test("small numbers (uses standard formatting)", function(assert) {
            assert.strictEqual(NumberFormatter.format(0), "0", "NumberFormatter.format(0) => '0'");
            assert.strictEqual(NumberFormatter.format(5), "5", "NumberFormatter.format(5) => '5'");
            assert.strictEqual(NumberFormatter.format(9.99), "9.99", "NumberFormatter.format(9.99) => '9.99'");
        });

        QUnit.test("large numbers", function(assert) {
            assert.strictEqual(NumberFormatter.format(10), "1.00e1", "NumberFormatter.format(10) => '1.00e1'");
            assert.strictEqual(NumberFormatter.format(12345), "1.23e4", "NumberFormatter.format(12345) => '1.23e4'");
            assert.strictEqual(NumberFormatter.format(1.2345e9), "1.23e9", "NumberFormatter.format(1.2345e9) => '1.23e9'");
        });

        QUnit.test("negative numbers (scientific)", function(assert) {
            assert.strictEqual(NumberFormatter.format(-12345), "-1.23e4", "NumberFormatter.format(-12345) => '-1.23e4'");
        });
    });
});
