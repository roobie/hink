var assert = require('assert');
var ds = require("../datastructures");

var Dictionary = ds.Dictionary;
describe('Dictionary', function() {
    var testKvp1, testKvp2, testKvp3, dict, kvpList

    var init = function() {
        testKvp1 = new ds.KeyValuePair("testKey1", "testValue1");
        testKvp2 = new ds.KeyValuePair("testKey2", "testValue2");
        testKvp3 = new ds.KeyValuePair("testKey3", "testValue3");
        kvpList = [testKvp1, testKvp2, testKvp3];
        dict = new ds.Dictionary(testKvp1, testKvp2, testKvp3);
    }

    beforeEach(init);

    describe('#ctor', function() {
        it('should not accept object that are not instances of KeyValuePair', function() {
            assert.throws(function() {
                var asd = new Dictionary("asd");
            });
            assert.throws(function() {
                var asd = new Dictionary(["asd", 1]);
            });
            assert.throws(function() {
                var asd = new Dictionary(123, "asd");
            });
            assert.equal(dict.count(), kvpList.length);
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
            dict.remove(testKvp2.key, function(r) {
                assert.equal(r.key, testKvp2.key);
                assert.equal(r.value, testKvp2.value);
            });
            assert.equal(dict.get(testKvp2.key), undefined);
        });
    });

    describe('#count', function() {
        it('should return the length of the dictionary', function() {
            var kvp1 = new ds.KeyValuePair("NEWKEY1", "NEWVAL");
            var kvp2 = new ds.KeyValuePair("NEWKEY2", "NEWVAL");
            var ref = [kvp1, kvp2];
            var dict = new ds.Dictionary(kvp1, kvp2);
            assert.equal(dict.count(), ref.length);
        });
    });

    describe('#keys', function() {
        it('should return all keys in the dictionary', function() {
            var keys = dict.keys();
            for (var i = 0, max = keys.length; i < max; i++) {
                assert.notEqual(keys.indexOf(kvpList[i].key), -1);
            }
            for (var i = 0, max = kvpList.length; i < max; i++) {
                assert.notEqual(keys.indexOf(kvpList[i].key), -1);
            }
        });
    });
});

