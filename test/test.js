var assert = require('assert');
var ds = require("../datastructures");

var Dictionary = ds.Dictionary;
describe('Dictionary', function() {
    var testKvp1, testKvp2, testKvp3, dict

    var init = function() {
        testKvp1 = new ds.KeyValuePair("testKey1", "testValue1");
        testKvp2 = new ds.KeyValuePair("testKey2", "testValue2");
        testKvp3 = new ds.KeyValuePair("testKey3", "testValue3");
        dict = new ds.Dictionary(testKvp1, testKvp2, testKvp3);
    }

    beforeEach(init);

    describe('#ctor', function() {
        it('should not accept object that are not instances of KeyValuePair', function() {
            assert.throws(function() {
                var asd = new Dictionary("");
            });
        });
    });

    describe('#get', function() {
        it('should return the KeyValuePair which corresponds to a certain key', function() {
            assert.equal(dict.get(testKvp1.key), testKvp1.value);
        });
    });

    describe('#set', function() {
        it('should set the value of the kvp to the new value', function() {
            var nv = "NEWVAL";
            dict.set(testKvp2.key, nv);
            assert.equal(dict.get(testKvp2.key), nv);
        });
    });

    describe('#add', function() {
        it('should add the key value pair', function() {
            var nkvp = new ds.KeyValuePair("NEWKEY", "NEWVAL");
            dict.add(nkvp);
            assert.equal(dict.get(nkvp.key), nkvp.value);
        });
    });

    describe('#remove', function() {
        it('should remove the key value pair based on key', function() {
            dict.remove(testKvp2.key);
            setTimeout(function() {
                assert.equal(dict.get(testKvp2.key), undefined);
            }, 2);
        });
    });
});

