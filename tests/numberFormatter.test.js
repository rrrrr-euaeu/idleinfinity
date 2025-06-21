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
        assert.strictEqual(NumberFormatter.format(1e15 - 1), "999T", "NumberFormatter.format(1e15 - 1) => '999T'");
        assert.strictEqual(NumberFormatter.format(1e15), "1Qa", "NumberFormatter.format(1e15) => '1Qa'");

        // 1e18 - 1 cases
        const val1e18minus1Num = 1e18 - 1;
        assert.strictEqual(NumberFormatter.format(val1e18minus1Num), Number(val1e18minus1Num).toExponential(2).replace('e+', 'e'), "NumberFormatter.format(Number: 1e18 - 1) returns exponential form");
        assert.strictEqual(NumberFormatter.format(10n**18n - 1n), "999Qa", "NumberFormatter.format(BigInt: 10e18 - 1) => '999Qa'");
        assert.strictEqual(NumberFormatter.format("999999999999999999"), "999Qa", "NumberFormatter.format(String: \"999...\") => '999Qa'");

        assert.strictEqual(NumberFormatter.format(1e18), "1.00e18", "NumberFormatter.format(1e18) => '1.00e18'");
        assert.strictEqual(NumberFormatter.format(10n**18n), "1.00e18", "NumberFormatter.format(BigInt: 10e18) => '1.00e18'"); // Based on current BigInt to exponential logic

        // Suffix value < 10 and < 100 boundaries (based on current toFixed rounding for Number inputs)
        // Updated to reflect truncation rule for numbers >= 1e9
        assert.strictEqual(NumberFormatter.format(9.999e9), "9.99B", "NumberFormatter.format(9.999e9) => '9.99B' (truncate)");
        assert.strictEqual(NumberFormatter.format(10e9), "10B", "NumberFormatter.format(10e9) => '10B'");
        assert.strictEqual(NumberFormatter.format(99.99e9), "99.9B", "NumberFormatter.format(99.99e9) => '9.9B' (truncate)");
        assert.strictEqual(NumberFormatter.format(100e9), "100B", "NumberFormatter.format(100e9) => '100B'");
        // Trillion
        assert.strictEqual(NumberFormatter.format(9.999e12), "9.99T", "NumberFormatter.format(9.999e12) => '9.99T' (truncate)");
        assert.strictEqual(NumberFormatter.format(99.99e12), "99.9T", "NumberFormatter.format(99.99e12) => '99.9T' (truncate)");
        // Quadrillion (Number input via BigInt path)
        assert.strictEqual(NumberFormatter.format(9.999e15), "9.99Qa", "NumberFormatter.format(9.999e15) => '9.99Qa' (truncate)");
        assert.strictEqual(NumberFormatter.format(99.99e15), "99.9Qa", "NumberFormatter.format(99.99e15) => '99.9Qa' (truncate)");
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
        // 1.2345e16 is 12.345e15.
        // 1.2345e16 (12.345e15)
        assert.strictEqual(NumberFormatter.format(1.2345e16), "12.3Qa", "NumberFormatter.format(Number: 1.2345e16) => 12.3Qa (Math.floor then valid 3 sig fig)");
        assert.strictEqual(NumberFormatter.format(12345n * (10n**12n)), "12.3Qa", "NumberFormatter.format(BigInt: 12.345e15) => 12.3Qa (valid 3 sig fig)");
        assert.strictEqual(NumberFormatter.format("12345000000000000"), "12.3Qa", "NumberFormatter.format(String: 12.345e15) => 12.3Qa");

        assert.strictEqual(NumberFormatter.format(1.2344e16), "12.3Qa", "NumberFormatter.format(1.2344e16) => 12.3Qa (truncates)");

        assert.strictEqual(NumberFormatter.format(9.8765e17), "987Qa", "NumberFormatter.format(9.8765e17) => 987Qa (Math.floor then truncate)");

        // Test near 1e18 (BigInt and String inputs)
        assert.strictEqual(NumberFormatter.format(10n**18n - 1000n), "999Qa", "NumberFormatter.format(BigInt: 1e18 - 1000) => '999Qa' (999 rule)");
        assert.strictEqual(NumberFormatter.format("999999999999999000"), "999Qa", "NumberFormatter.format(String: \"999...9000\") => '999Qa' (999 rule)");

        // 999e15 - 1
        const val999e15minus1Num = 999e15 - 1;
        assert.strictEqual(NumberFormatter.format(val999e15minus1Num), "998Qa", "NumberFormatter.format(Number: 999e15 - 1) => 998Qa (Math.floor then truncate)");
        assert.strictEqual(NumberFormatter.format(999n * (10n**15n) - 1n), "998Qa", "NumberFormatter.format(BigInt: 999e15 - 1) => 998Qa (truncate)");
        assert.strictEqual(NumberFormatter.format("998999999999999999"), "998Qa", "NumberFormatter.format(String: \"998999...\") => 998Qa (truncate)");

        // Additional BigInt cases for Qa
        assert.strictEqual(NumberFormatter.format(123n * (10n**13n)), "1.23Qa", "NumberFormatter.format(BigInt: 1.23e15) => 1.23Qa");
        assert.strictEqual(NumberFormatter.format(1237n * (10n**12n)), "1.23Qa", "NumberFormatter.format(BigInt: 1.237e15) => 1.23Qa (truncate)");

        // Value 9876n * (10n**11n) (0.9876e15 or 987.6e12) is tested in "standard format - BigInt T and B suffixes" suite
        // assert.strictEqual(NumberFormatter.format(9876n * (10n**11n)), "987T", "NumberFormatter.format(BigInt: 0.9876e15 or 987.6e12) => 987T (truncate)");

        assert.strictEqual(NumberFormatter.format(1234n * (10n**13n)), "12.3Qa", "NumberFormatter.format(BigInt: 12.34e15) => 12.3Qa");
        assert.strictEqual(NumberFormatter.format(1237n * (10n**13n)), "12.3Qa", "NumberFormatter.format(BigInt: 12.37e15) => 12.3Qa (truncate)");
        assert.strictEqual(NumberFormatter.format(1234n * (10n**14n)), "123Qa", "NumberFormatter.format(BigInt: 123.4e15) => 123Qa");
        assert.strictEqual(NumberFormatter.format(1237n * (10n**14n)), "123Qa", "NumberFormatter.format(BigInt: 123.7e15) => 123Qa (truncate)");
        assert.strictEqual(NumberFormatter.format(999n * (10n**15n)), "999Qa", "NumberFormatter.format(BigInt: 999e15) => 999Qa");
        assert.strictEqual(NumberFormatter.format(9998n * (10n**14n)), "999Qa", "NumberFormatter.format(BigInt: 999.8e15) => 999Qa (truncate, not 999 rule)");

        // Check if 1e15 - 1 is still "999T"
        assert.strictEqual(NumberFormatter.format(1e15 - 1), "999T", "NumberFormatter.format(1e15 - 1) remains 999T");
    });

    QUnit.test("standard format - BigInt T and B suffixes", function(assert) {
        NumberFormatter.setSelectedFormat('standard');
        // Trillion (T)
        assert.strictEqual(NumberFormatter.format(10n**12n), "1T", "NumberFormatter.format(BigInt: 1e12) => 1T");
        assert.strictEqual(NumberFormatter.format(1234n * (10n**9n)), "1.23T", "NumberFormatter.format(BigInt: 1.234e12) => 1.23T (truncate)");
        assert.strictEqual(NumberFormatter.format(1237n * (10n**9n)), "1.23T", "NumberFormatter.format(BigInt: 1.237e12) => 1.23T (truncate)");
        assert.strictEqual(NumberFormatter.format(9876n * (10n**11n)), "987T", "NumberFormatter.format(BigInt: 0.9876e15 or 987.6e12) => 987T (truncate)");
        assert.strictEqual(NumberFormatter.format(9998n * (10n**11n)), "999T", "NumberFormatter.format(BigInt: 999.8e12) => 999T (truncate, then 999 rule)");
        // Billion (B)
        assert.strictEqual(NumberFormatter.format(10n**9n), "1B", "NumberFormatter.format(BigInt: 1e9) => 1B");
        assert.strictEqual(NumberFormatter.format(1234n * (10n**6n)), "1.23B", "NumberFormatter.format(BigInt: 1.234e9) => 1.23B (truncate)");
        assert.strictEqual(NumberFormatter.format(1237n * (10n**6n)), "1.23B", "NumberFormatter.format(BigInt: 1.237e9) => 1.23B (truncate)");
        assert.strictEqual(NumberFormatter.format(9998n * (10n**8n)), "999B", "NumberFormatter.format(BigInt: 999.8e9) => 999B (truncate, then 999 rule)");
    });

    QUnit.test("standard format - BigInt exponential notation", function(assert) {
        NumberFormatter.setSelectedFormat('standard');
        // Verifying "truncate to 2 decimal places for mantissa"
        assert.strictEqual(NumberFormatter.format(10n**18n), "1.00e18", "BigInt 10^18 should be 1.00e18");
        assert.strictEqual(NumberFormatter.format(10000n * (10n**14n)), "1.00e18", "BigInt 1.0000e18 should be 1.00e18"); // Same as 10n**18n

        assert.strictEqual(NumberFormatter.format(1234n * (10n**15n)), "1.23e18", "BigInt 1.234e18 should be 1.23e18 (truncated)");
        assert.strictEqual(NumberFormatter.format(1237n * (10n**15n)), "1.23e18", "BigInt 1.237e18 should be 1.23e18 (truncated)");
        assert.strictEqual(NumberFormatter.format(12345n * (10n**14n)), "1.23e18", "BigInt 1.2345e18 should be 1.23e18 (truncated)");
        assert.strictEqual(NumberFormatter.format(BigInt("1237500000000000000")), "1.23e18", "BigInt 1.2375e18 should be 1.23e18 (truncated)");

        assert.strictEqual(NumberFormatter.format(12000n * (10n**14n)), "1.20e18", "BigInt 1.2000e18 should be 1.20e18");

        assert.strictEqual(NumberFormatter.format(10n**20n), "1.00e20", "BigInt 1e20 should be 1.00e20");
        assert.strictEqual(NumberFormatter.format(BigInt("-1237500000000000000")), "-1.23e18", "BigInt -1.2375e18 should be -1.23e18 (truncated)");
    });

    QUnit.test("standard format - String inputs", function(assert) {
        NumberFormatter.setSelectedFormat('standard');
        assert.strictEqual(NumberFormatter.format("0"), "0", "NumberFormatter.format(String: \"0\")");
        assert.strictEqual(NumberFormatter.format("123"), "123", "NumberFormatter.format(String: \"123\")");
        assert.strictEqual(NumberFormatter.format("-1000"), "-1,000", "NumberFormatter.format(String: \"-1000\")");
        assert.strictEqual(NumberFormatter.format("1234567890"), "1.23B", "NumberFormatter.format(String: \"1.23...e9\") => 1.23B");
        assert.strictEqual(NumberFormatter.format("123456789012345678"), "123Qa", "NumberFormatter.format(String: \"1.23...e17\") => 123Qa");
        // The string "-1234567890123456789" is parsed as a BigInt.
        // Its absolute value is 1234567890123456789n, which is > 10n**18n.
        // Thus, it should be formatted in exponential notation.
        // Current BigInt to exponential logic: 1st digit, '.', next 2 digits (truncated), 'e', exponent.
        // "1234567890123456789" -> "1.23e18"
        assert.strictEqual(NumberFormatter.format("-1234567890123456789"), "-1.23e18", "NumberFormatter.format(String: \"-1234567890123456789\") => -1.23e18");
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
