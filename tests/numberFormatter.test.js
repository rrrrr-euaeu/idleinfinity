// tests/numberFormatter.test.js

QUnit.module("NumberFormatter", function() {
    QUnit.module("format - standard", function(hooks) {
        hooks.beforeEach(function() {
            NumberFormatter.setSelectedFormat('standard');
        });

        QUnit.test("zero", function(assert) {
            assert.strictEqual(NumberFormatter.format(0), "0", "Number: 0 => 0");
        });

        QUnit.test("small numbers (integers)", function(assert) {
            assert.strictEqual(NumberFormatter.format(1), "1", "Number: 1 => 1");
            assert.strictEqual(NumberFormatter.format(12), "12", "Number: 12 => 12");
            assert.strictEqual(NumberFormatter.format(123), "123", "Number: 123 => 123");
            assert.strictEqual(NumberFormatter.format(999), "999", "Number: 999 => 999");
        });

        QUnit.test("small numbers (decimals, rounding)", function(assert) {
            assert.strictEqual(NumberFormatter.format(0.1), "0.1", "Number: 0.1 => 0.1");
            assert.strictEqual(NumberFormatter.format(0.12), "0.12", "Number: 0.12 => 0.12");
            assert.strictEqual(NumberFormatter.format(0.123), "0.123", "Number: 0.123 => 0.123");
            assert.strictEqual(NumberFormatter.format(0.1234), "0.123", "Number: 0.1234 => 0.123");
            assert.strictEqual(NumberFormatter.format(1.2), "1.2", "Number: 1.2 => 1.2");
            assert.strictEqual(NumberFormatter.format(1.23), "1.23", "Number: 1.23 => 1.23");
            assert.strictEqual(NumberFormatter.format(1.234), "1.23", "Number: 1.234 => 1.23");
            assert.strictEqual(NumberFormatter.format(12.3), "12.3", "Number: 12.3 => 12.3");
            assert.strictEqual(NumberFormatter.format(12.34), "12.3", "Number: 12.34 => 12.3");
            assert.strictEqual(NumberFormatter.format(123.4), "123", "Number: 123.4 => 123");
        });

        QUnit.test("very small positive numbers", function(assert) {
            assert.strictEqual(NumberFormatter.format(0.000001), "0", "Number: 0.000001 => 0");
            assert.strictEqual(NumberFormatter.format(0.0000001), "0", "Number: 0.0000001 => 0");
        });

        QUnit.test("thousands (locale string, no suffix)", function(assert) {
            assert.strictEqual(NumberFormatter.format(1000), "1,000", "Number: 1000 => 1,000");
            assert.strictEqual(NumberFormatter.format(12345), "12,345", "Number: 12345 => 12,345");
            assert.strictEqual(NumberFormatter.format(123456), "123,456", "Number: 123456 => 123,456");
            assert.strictEqual(NumberFormatter.format(999999), "999,999", "Number: 999999 => 999,999");
        });

        QUnit.test("millions (B suffix)", function(assert) {
            assert.strictEqual(NumberFormatter.format(1000000), "1,000,000", "Number: 1000000 => 1,000,000");
            assert.strictEqual(NumberFormatter.format(999999999), "999,999,999", "Number: 999999999 => 999,999,999");
            assert.strictEqual(NumberFormatter.format(1000000000), "1B", "Number: 1000000000 => 1B");
            assert.strictEqual(NumberFormatter.format(1.23456789e9), "1.23B", "Number: 1.23456789e9 => 1.23B");
            assert.strictEqual(NumberFormatter.format(12.3456789e9), "12.3B", "Number: 12.3456789e9 => 12.3B");
            assert.strictEqual(NumberFormatter.format(123.456789e9), "123B", "Number: 123.456789e9 => 123B");
        });

        QUnit.test("trillions (T suffix)", function(assert) {
            assert.strictEqual(NumberFormatter.format(1e12), "1T", "Number: 1e12 => 1T");
            assert.strictEqual(NumberFormatter.format(1.234e12), "1.23T", "Number: 1.234e12 => 1.23T");
            assert.strictEqual(NumberFormatter.format(12.34e12), "12.3T", "Number: 12.34e12 => 12.3T");
            assert.strictEqual(NumberFormatter.format(123.4e12), "123T", "Number: 123.4e12 => 123T");
        });

        QUnit.test("quadrillions (Qa suffix)", function(assert) {
            assert.strictEqual(NumberFormatter.format(1e15), "1Qa", "Number: 1e15 => 1Qa");
            assert.strictEqual(NumberFormatter.format(1.234e15), "1.23Qa", "Number: 1.234e15 => 1.23Qa");
            assert.strictEqual(NumberFormatter.format(12.34e15), "12.3Qa", "Number: 12.34e15 => 12.3Qa");
            assert.strictEqual(NumberFormatter.format(123.4e15), "123Qa", "Number: 123.4e15 => 123Qa");
        });

        QUnit.test("large numbers (scientific fallback for >= 1e18)", function(assert) {
            assert.strictEqual(NumberFormatter.format(1e18), "1.00e18", "Number: 1e18 => 1.00e18");
            assert.strictEqual(NumberFormatter.format(1.23e19), "1.23e19", "Number: 1.23e19 => 1.23e19");
        });

        QUnit.test("negative numbers", function(assert) {
            assert.strictEqual(NumberFormatter.format(-123), "-123", "Number: -123 => -123");
            assert.strictEqual(NumberFormatter.format(Number(-12345)), "-12,345", "Number: Number(-12345) => -12,345");
            assert.strictEqual(NumberFormatter.format(BigInt(-1234567)), "-1,234,567", "BigInt: BigInt(-1234567) => -1,234,567");
            assert.strictEqual(NumberFormatter.format(-1.234e9), "-1.23B", "Number: -1.234e9 => -1.23B");
            assert.strictEqual(NumberFormatter.format(-1e15), "-1Qa", "Number: -1e15 => -1Qa");
        });

    QUnit.test("standard format - more small numbers and boundaries", function(assert) {
        assert.strictEqual(NumberFormatter.format(0.0000099), "0", "Number: 0.0000099 => 0");
        assert.strictEqual(NumberFormatter.format(0.00001), "0", "Number: 0.00001 => 0");
        assert.strictEqual(NumberFormatter.format(0.0099), "0.0099", "Number: 0.0099 => 0.0099");
        assert.strictEqual(NumberFormatter.format(0.001), "0.001", "Number: 0.001 => 0.001");

        assert.strictEqual(NumberFormatter.format(0.999), "0.999", "Number: 0.999 => 0.999");
        assert.strictEqual(NumberFormatter.format(0.01), "0.01", "Number: 0.01 => 0.01");
        assert.strictEqual(NumberFormatter.format(0.9999), "1", "Number: 0.9999 => 1");

        assert.strictEqual(NumberFormatter.format(9.99), "9.99", "Number: 9.99 => 9.99");
        assert.strictEqual(NumberFormatter.format(1), "1", "Number: 1 => 1");
        assert.strictEqual(NumberFormatter.format(9.999), "10", "Number: 9.999 => 10");

        assert.strictEqual(NumberFormatter.format(99.9), "99.9", "Number: 99.9 => 99.9");
        assert.strictEqual(NumberFormatter.format(10), "10", "Number: 10 => 10");
        assert.strictEqual(NumberFormatter.format(99.99), "100", "Number: 99.99 => 100");
    });

    QUnit.test("standard format - toLocaleString boundaries and suffixes", function(assert) {
        assert.strictEqual(NumberFormatter.format(100), "100", "Number: 100 => 100");
        assert.strictEqual(NumberFormatter.format(999999999), "999,999,999", "Number: 999999999 => 999,999,999");
        assert.strictEqual(NumberFormatter.format(1e9 - 1), "999,999,999", "Number: 1e9 - 1 => 999,999,999");

        // Suffix boundaries
        assert.strictEqual(NumberFormatter.format(1e9), "1B", "Number: 1e9 => 1B");
        assert.strictEqual(NumberFormatter.format(1e12 - 1), "999B", "Number: 1e12 - 1 => 999B");
        assert.strictEqual(NumberFormatter.format(1e12), "1T", "Number: 1e12 => 1T");
        assert.strictEqual(NumberFormatter.format(1e15 - 1), "999T", "Number: 1e15 - 1 => 999T");
        assert.strictEqual(NumberFormatter.format(1e15), "1Qa", "Number: 1e15 => 1Qa");

        // 1e18 - 1 cases
        const val1e18minus1Num = 1e18 - 1;
        assert.strictEqual(NumberFormatter.format(val1e18minus1Num), Number(val1e18minus1Num).toExponential(2).replace('e+', 'e'), "Number: val1e18minus1Num => " + Number(val1e18minus1Num).toExponential(2).replace('e+', 'e'));
        assert.strictEqual(NumberFormatter.format(10n**18n - 1n), "999Qa", "BigInt: 10n**18n - 1n => 999Qa");
        assert.strictEqual(NumberFormatter.format("999999999999999999"), "999Qa", "String: \"999999999999999999\" => 999Qa");

        assert.strictEqual(NumberFormatter.format(1e18), "1.00e18", "Number: 1e18 => 1.00e18");
        assert.strictEqual(NumberFormatter.format(10n**18n), "1.00e18", "BigInt: 10n**18n => 1.00e18");

        // Suffix value < 10 and < 100 boundaries
        assert.strictEqual(NumberFormatter.format(9.999e9), "9.99B", "Number: 9.999e9 => 9.99B");
        assert.strictEqual(NumberFormatter.format(10e9), "10B", "Number: 10e9 => 10B");
        assert.strictEqual(NumberFormatter.format(99.99e9), "99.9B", "Number: 99.99e9 => 99.9B");
        assert.strictEqual(NumberFormatter.format(100e9), "100B", "Number: 100e9 => 100B");
        assert.strictEqual(NumberFormatter.format(9.999e12), "9.99T", "Number: 9.999e12 => 9.99T");
        assert.strictEqual(NumberFormatter.format(99.99e12), "99.9T", "Number: 99.99e12 => 99.9T");
        assert.strictEqual(NumberFormatter.format(9.999e15), "9.99Qa", "Number: 9.999e15 => 9.99Qa");
        assert.strictEqual(NumberFormatter.format(99.99e15), "99.9Qa", "Number: 99.99e15 => 99.9Qa");
    });

    QUnit.test("quadrillions (Qa suffix - BigInt handling)", function(assert) {
        NumberFormatter.setSelectedFormat('standard');

        assert.strictEqual(NumberFormatter.format(1e15), "1Qa", "Number: 1e15 => 1Qa");
        assert.strictEqual(NumberFormatter.format(1.23e15), "1.23Qa", "Number: 1.23e15 => 1.23Qa");
        assert.strictEqual(NumberFormatter.format(9.99e15), "9.99Qa", "Number: 9.99e15 => 9.99Qa");

        assert.strictEqual(NumberFormatter.format(10e15), "10Qa", "Number: 10e15 => 10Qa");
        assert.strictEqual(NumberFormatter.format(12.3e15), "12.3Qa", "Number: 12.3e15 => 12.3Qa");
        assert.strictEqual(NumberFormatter.format(99.9e15), "99.9Qa", "Number: 99.9e15 => 99.9Qa");

        assert.strictEqual(NumberFormatter.format(100e15), "100Qa", "Number: 100e15 => 100Qa");
        assert.strictEqual(NumberFormatter.format(123e15), "123Qa", "Number: 123e15 => 123Qa");
        assert.strictEqual(NumberFormatter.format(999e15), "999Qa", "Number: 999e15 => 999Qa");

        assert.strictEqual(NumberFormatter.format(1.2345e16), "12.3Qa", "Number: 1.2345e16 => 12.3Qa");
        assert.strictEqual(NumberFormatter.format(12345n * (10n**12n)), "12.3Qa", "BigInt: 12345n * (10n**12n) => 12.3Qa");
        assert.strictEqual(NumberFormatter.format("12345000000000000"), "12.3Qa", "String: \"12345000000000000\" => 12.3Qa");

        assert.strictEqual(NumberFormatter.format(1.2344e16), "12.3Qa", "Number: 1.2344e16 => 12.3Qa");

        assert.strictEqual(NumberFormatter.format(9.8765e17), "987Qa", "Number: 9.8765e17 => 987Qa");

        // Test near 1e18 (BigInt and String inputs)
        assert.strictEqual(NumberFormatter.format(10n**18n - 1000n), "999Qa", "BigInt: 10n**18n - 1000n => 999Qa");
        assert.strictEqual(NumberFormatter.format("999999999999999000"), "999Qa", "String: \"999999999999999000\" => 999Qa");

        // 999e15 - 1 (BigInt and String input tests)
        assert.strictEqual(NumberFormatter.format(999n * (10n**15n) - 1n), "998Qa", "BigInt: 999n * (10n**15n) - 1n => 998Qa");
        assert.strictEqual(NumberFormatter.format("998999999999999999"), "998Qa", "String: \"998999999999999999\" => 998Qa");

        // Additional BigInt cases for Qa
        assert.strictEqual(NumberFormatter.format(123n * (10n**13n)), "1.23Qa", "BigInt: 123n * (10n**13n) => 1.23Qa");
        assert.strictEqual(NumberFormatter.format(1237n * (10n**12n)), "1.23Qa", "BigInt: 1237n * (10n**12n) => 1.23Qa");

        assert.strictEqual(NumberFormatter.format(1234n * (10n**13n)), "12.3Qa", "BigInt: 1234n * (10n**13n) => 12.3Qa");
        assert.strictEqual(NumberFormatter.format(1237n * (10n**13n)), "12.3Qa", "BigInt: 1237n * (10n**13n) => 12.3Qa");
        assert.strictEqual(NumberFormatter.format(1234n * (10n**14n)), "123Qa", "BigInt: 1234n * (10n**14n) => 123Qa");
        assert.strictEqual(NumberFormatter.format(1237n * (10n**14n)), "123Qa", "BigInt: 1237n * (10n**14n) => 123Qa");
        assert.strictEqual(NumberFormatter.format(999n * (10n**15n)), "999Qa", "BigInt: 999n * (10n**15n) => 999Qa");
        assert.strictEqual(NumberFormatter.format(9998n * (10n**14n)), "999Qa", "BigInt: 9998n * (10n**14n) => 999Qa");

        assert.strictEqual(NumberFormatter.format(1e15 - 1), "999T", "Number: 1e15 - 1 => 999T");
    });

    QUnit.test("standard format - BigInt T and B suffixes", function(assert) {
        NumberFormatter.setSelectedFormat('standard');
        // Trillion (T)
        assert.strictEqual(NumberFormatter.format(10n**12n), "1T", "BigInt: 10n**12n => 1T");
        assert.strictEqual(NumberFormatter.format(1234n * (10n**9n)), "1.23T", "BigInt: 1234n * (10n**9n) => 1.23T");
        assert.strictEqual(NumberFormatter.format(1237n * (10n**9n)), "1.23T", "BigInt: 1237n * (10n**9n) => 1.23T");
        assert.strictEqual(NumberFormatter.format(9876n * (10n**11n)), "987T", "BigInt: 9876n * (10n**11n) => 987T");
        assert.strictEqual(NumberFormatter.format(9998n * (10n**11n)), "999T", "BigInt: 9998n * (10n**11n) => 999T");
        // Billion (B)
        assert.strictEqual(NumberFormatter.format(10n**9n), "1B", "BigInt: 10n**9n => 1B");
        assert.strictEqual(NumberFormatter.format(1234n * (10n**6n)), "1.23B", "BigInt: 1234n * (10n**6n) => 1.23B");
        assert.strictEqual(NumberFormatter.format(1237n * (10n**6n)), "1.23B", "BigInt: 1237n * (10n**6n) => 1.23B");
        assert.strictEqual(NumberFormatter.format(9998n * (10n**8n)), "999B", "BigInt: 9998n * (10n**8n) => 999B");
    });

    QUnit.test("standard format - BigInt exponential notation", function(assert) {
        NumberFormatter.setSelectedFormat('standard');
        assert.strictEqual(NumberFormatter.format(10n**18n), "1.00e18", "BigInt: 10n**18n => 1.00e18");
        assert.strictEqual(NumberFormatter.format(10000n * (10n**14n)), "1.00e18", "BigInt: 10000n * (10n**14n) => 1.00e18");

        assert.strictEqual(NumberFormatter.format(1234n * (10n**15n)), "1.23e18", "BigInt: 1234n * (10n**15n) => 1.23e18");
        assert.strictEqual(NumberFormatter.format(1237n * (10n**15n)), "1.23e18", "BigInt: 1237n * (10n**15n) => 1.23e18");
        assert.strictEqual(NumberFormatter.format(12345n * (10n**14n)), "1.23e18", "BigInt: 12345n * (10n**14n) => 1.23e18");
        assert.strictEqual(NumberFormatter.format(BigInt("1237500000000000000")), "1.23e18", "BigInt: BigInt(\"1237500000000000000\") => 1.23e18");

        assert.strictEqual(NumberFormatter.format(12000n * (10n**14n)), "1.20e18", "BigInt: 12000n * (10n**14n) => 1.20e18");

        assert.strictEqual(NumberFormatter.format(10n**20n), "1.00e20", "BigInt: 10n**20n => 1.00e20");
        assert.strictEqual(NumberFormatter.format(BigInt("-1237500000000000000")), "-1.23e18", "BigInt: BigInt(\"-1237500000000000000\") => -1.23e18");
    });

    QUnit.test("standard format - String inputs", function(assert) {
        NumberFormatter.setSelectedFormat('standard');
        assert.strictEqual(NumberFormatter.format("0"), "0", "String: \"0\" => 0");
        assert.strictEqual(NumberFormatter.format("123"), "123", "String: \"123\" => 123");
        assert.strictEqual(NumberFormatter.format("-1000"), "-1,000", "String: \"-1000\" => -1,000");
        assert.strictEqual(NumberFormatter.format("-12345"), "-12,345", "String: \"-12345\" => -12,345");
        assert.strictEqual(NumberFormatter.format("1234567890"), "1.23B", "String: \"1234567890\" => 1.23B");
        assert.strictEqual(NumberFormatter.format("123456789012345678"), "123Qa", "String: \"123456789012345678\" => 123Qa");
        assert.strictEqual(NumberFormatter.format("-1234567890123456789"), "-1.23e18", "String: \"-1234567890123456789\" => -1.23e18");
    });

    });

    QUnit.module("format - hex", function(hooks) {
        hooks.beforeEach(function() {
            NumberFormatter.setSelectedFormat('hex');
        });

        QUnit.test("integers", function(assert) {
            assert.strictEqual(NumberFormatter.format(0), "0", "Number: 0 => 0");
            assert.strictEqual(NumberFormatter.format(10), "a", "Number: 10 => a");
            assert.strictEqual(NumberFormatter.format(255), "ff", "Number: 255 => ff");
            assert.strictEqual(NumberFormatter.format(4096), "1000", "Number: 4096 => 1000");
            assert.strictEqual(NumberFormatter.format(65535), "ffff", "Number: 65535 => ffff");
        });

        QUnit.test("decimals (limited precision, for small numbers)", function(assert) {
            assert.strictEqual(NumberFormatter.format(10.5), "a.8", "Number: 10.5 => a.8");
            assert.strictEqual(NumberFormatter.format(255.75), "ff.c", "Number: 255.75 => ff.c");
            assert.strictEqual(NumberFormatter.format(0.0625), "0.1", "Number: 0.0625 => 0.1");
            assert.strictEqual(NumberFormatter.format(1000.000001), "3e8", "Number: 1000.000001 => 3e8");
        });

        QUnit.test("negative numbers (hex)", function(assert) {
            assert.strictEqual(NumberFormatter.format(-10), "-a", "Number: -10 => -a");
            assert.strictEqual(NumberFormatter.format(-255.75), "-ff.c", "Number: -255.75 => -ff.c");
        });
    });

    QUnit.module("format - scientific", function(hooks) {
        hooks.beforeEach(function() {
            NumberFormatter.setSelectedFormat('scientific');
        });

        QUnit.test("small numbers (uses standard formatting)", function(assert) {
            assert.strictEqual(NumberFormatter.format(0), "0", "Number: 0 => 0");
            assert.strictEqual(NumberFormatter.format(5), "5", "Number: 5 => 5");
            assert.strictEqual(NumberFormatter.format(9.99), "9.99", "Number: 9.99 => 9.99");
        });

        QUnit.test("large numbers", function(assert) {
            assert.strictEqual(NumberFormatter.format(10), "1.00e1", "Number: 10 => 1.00e1");
            assert.strictEqual(NumberFormatter.format(12345), "1.23e4", "Number: 12345 => 1.23e4");
            assert.strictEqual(NumberFormatter.format(1.2345e9), "1.23e9", "Number: 1.2345e9 => 1.23e9");
        });

        QUnit.test("negative numbers (scientific)", function(assert) {
            assert.strictEqual(NumberFormatter.format(-12345), "-1.23e4", "Number: -12345 => -1.23e4");
        });
    });
});
