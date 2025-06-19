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
