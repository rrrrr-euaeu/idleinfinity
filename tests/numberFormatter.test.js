// tests/numberFormatter.test.js

QUnit.module("NumberFormatter", function() {
    QUnit.module("format - standard", function(hooks) {
        hooks.beforeEach(function() {
            NumberFormatter.setSelectedFormat('standard');
        });

        QUnit.test("zero", function(assert) {
            assert.strictEqual(NumberFormatter.format(0), "0", "Zero should be '0'");
        });

        QUnit.test("small numbers (integers)", function(assert) {
            assert.strictEqual(NumberFormatter.format(1), "1", "Formatting 1");
            assert.strictEqual(NumberFormatter.format(12), "12", "Formatting 12");
            assert.strictEqual(NumberFormatter.format(123), "123", "Formatting 123");
            assert.strictEqual(NumberFormatter.format(999), "999", "Formatting 999");
        });

        QUnit.test("small numbers (decimals, rounding)", function(assert) {
            assert.strictEqual(NumberFormatter.format(0.1), "0.1", "Formatting 0.1 (no trailing zeros)");
            assert.strictEqual(NumberFormatter.format(0.12), "0.12", "Formatting 0.12 (no trailing zeros)");
            assert.strictEqual(NumberFormatter.format(0.123), "0.123", "Formatting 0.123");
            assert.strictEqual(NumberFormatter.format(0.1234), "0.123", "Formatting 0.1234 (round to 3 dp)");
            assert.strictEqual(NumberFormatter.format(1.2), "1.2", "Formatting 1.2 (no trailing zeros)");
            assert.strictEqual(NumberFormatter.format(1.23), "1.23", "Formatting 1.23");
            assert.strictEqual(NumberFormatter.format(1.234), "1.23", "Formatting 1.234 (round to 2 dp)");
            assert.strictEqual(NumberFormatter.format(12.3), "12.3", "Formatting 12.3");
            assert.strictEqual(NumberFormatter.format(12.34), "12.3", "Formatting 12.34 (round to 1 dp)");
            assert.strictEqual(NumberFormatter.format(123.4), "123", "Formatting 123.4 (round to 0 dp)");
        });

        QUnit.test("very small positive numbers", function(assert) {
            assert.strictEqual(NumberFormatter.format(0.000001), "0", "Formatting 0.000001 (custom rule, should be 0 due to toFixed(4) resulting in 0 after parseFloat)");
            // Based on current NumberFormatter.standard: if (num < 0.01) return parseFloat(num.toFixed(4)).toString();
            assert.strictEqual(NumberFormatter.format(0.0000001), "0", "Formatting 0.0000001 (custom rule, should be 0)");
        });

        QUnit.test("thousands (locale string, no suffix)", function(assert) {
            assert.strictEqual(NumberFormatter.format(1000), "1,000", "Formatting 1000");
            assert.strictEqual(NumberFormatter.format(12345), "12,345", "Formatting 12345");
            assert.strictEqual(NumberFormatter.format(123456), "123,456", "Formatting 123456");
            assert.strictEqual(NumberFormatter.format(999999), "999,999", "Formatting 999999");
        });

        QUnit.test("millions (B suffix)", function(assert) {
            assert.strictEqual(NumberFormatter.format(1000000), "1,000,000", "Formatting 1,000,000 (still uses toLocaleString)");
            assert.strictEqual(NumberFormatter.format(999999999), "999,999,999", "Formatting 999,999,999");
            assert.strictEqual(NumberFormatter.format(1000000000), "1B", "Formatting 1,000,000,000 (Billion)");
            assert.strictEqual(NumberFormatter.format(1.23456789e9), "1.23B", "Formatting 1.234... Billion");
            assert.strictEqual(NumberFormatter.format(12.3456789e9), "12.3B", "Formatting 12.345... Billion");
            assert.strictEqual(NumberFormatter.format(123.456789e9), "123B", "Formatting 123.456... Billion");
        });

        QUnit.test("trillions (T suffix)", function(assert) {
            assert.strictEqual(NumberFormatter.format(1e12), "1T", "Formatting 1 Trillion");
            assert.strictEqual(NumberFormatter.format(1.234e12), "1.23T", "Formatting 1.234 Trillion");
            assert.strictEqual(NumberFormatter.format(12.34e12), "12.3T", "Formatting 12.34 Trillion");
            assert.strictEqual(NumberFormatter.format(123.4e12), "123T", "Formatting 123.4 Trillion");
        });

        QUnit.test("quadrillions (Qa suffix)", function(assert) {
            assert.strictEqual(NumberFormatter.format(1e15), "1Qa", "Formatting 1 Quadrillion");
            assert.strictEqual(NumberFormatter.format(1.234e15), "1.23Qa", "Formatting 1.234 Quadrillion");
            assert.strictEqual(NumberFormatter.format(12.34e15), "12.3Qa", "Formatting 12.34 Quadrillion");
            assert.strictEqual(NumberFormatter.format(123.4e15), "123Qa", "Formatting 123.4 Quadrillion");
        });

        QUnit.test("large numbers (scientific fallback for >= 1e18)", function(assert) {
            assert.strictEqual(NumberFormatter.format(1e18), "1.00e18", "Formatting 1e18 (Quintillion)");
            assert.strictEqual(NumberFormatter.format(1.23e19), "1.23e19", "Formatting 1.23e19");
        });

        QUnit.test("negative numbers", function(assert) {
            assert.strictEqual(NumberFormatter.format(-123), "-123", "Formatting -123");
            assert.strictEqual(NumberFormatter.format(-1.234e9), "-1.23B", "Formatting -1.234 Billion");
            assert.strictEqual(NumberFormatter.format(-1e15), "-1Qa", "Formatting -1 Quadrillion");
        });
    });

    QUnit.module("format - hex", function(hooks) {
        hooks.beforeEach(function() {
            NumberFormatter.setSelectedFormat('hex');
        });

        QUnit.test("integers", function(assert) {
            assert.strictEqual(NumberFormatter.format(0), "0", "Hex 0");
            assert.strictEqual(NumberFormatter.format(10), "a", "Hex 10");
            assert.strictEqual(NumberFormatter.format(255), "ff", "Hex 255");
            assert.strictEqual(NumberFormatter.format(4096), "1000", "Hex 4096 without space");
            assert.strictEqual(NumberFormatter.format(65535), "ffff", "Hex 65535 without space");
        });

        QUnit.test("decimals (limited precision, for small numbers)", function(assert) {
            // Note: hex fractional part is complex and has specific rules in the code
            assert.strictEqual(NumberFormatter.format(10.5), "a.8", "Hex 10.5 (0.5 is 8/16)");
            assert.strictEqual(NumberFormatter.format(255.75), "ff.c", "Hex 255.75 (0.75 is c/16)");
            assert.strictEqual(NumberFormatter.format(0.0625), "0.1", "Hex 0.0625 (1/16)");
            assert.strictEqual(NumberFormatter.format(1000.000001), "3e8", "Hex 1000 (fractional ignored for large numbers)");
        });

        QUnit.test("negative numbers (hex)", function(assert) {
            assert.strictEqual(NumberFormatter.format(-10), "-a", "Hex -10");
            assert.strictEqual(NumberFormatter.format(-255.75), "-ff.c", "Hex -255.75");
        });
    });

    QUnit.module("format - scientific", function(hooks) {
        hooks.beforeEach(function() {
            NumberFormatter.setSelectedFormat('scientific');
        });

        QUnit.test("small numbers (uses standard formatting)", function(assert) {
            assert.strictEqual(NumberFormatter.format(0), "0", "Scientific 0");
            assert.strictEqual(NumberFormatter.format(5), "5", "Scientific 5 (uses standard)");
            assert.strictEqual(NumberFormatter.format(9.99), "9.99", "Scientific 9.99 (uses standard)");
        });

        QUnit.test("large numbers", function(assert) {
            assert.strictEqual(NumberFormatter.format(10), "1.00e1", "Scientific 10");
            assert.strictEqual(NumberFormatter.format(12345), "1.23e4", "Scientific 12345");
            assert.strictEqual(NumberFormatter.format(1.2345e9), "1.23e9", "Scientific 1.2345e9");
        });

        QUnit.test("negative numbers (scientific)", function(assert) {
            assert.strictEqual(NumberFormatter.format(-12345), "-1.23e4", "Scientific -12345");
        });
    });
});
