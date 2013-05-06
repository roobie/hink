var assert = require('assert');
var ds = require("../datastructures");

var KeyValuePair = ds.KeyValuePair;
describe('KeyValuePair', function() {
    var kvp1, kvp2,
    key1 = "KEY1", value1 = "VALUE1",
    key2 = "KEY2", value2 = "VALUE2";

    var init = function() {
        kvp1 = new ds.KeyValuePair(key1, value1);
        kvp2 = new ds.KeyValuePair({key:key2, value:value2});
    };

    beforeEach(init);

    describe('#ctor', function() {
        it('should allow key to be passed as first parameter and value as second', function() {
            assert.equal(kvp1.key, key1);
            assert.equal(kvp1.value, value1);
        });

        it('should allow key and value to be passed in an object as first parameter', function() {
            assert.equal(kvp2.key, key2);
            assert.equal(kvp2.value, value2);
        });
    });

    describe('#equal', function() {
        it('should return true if one kvp is equal by value to another (false otherwise)', function() {
            assert.equal(kvp1.equal(kvp2), false);
            assert.equal(kvp1.equal({}), false);
            assert.equal(kvp1.equal(""), false);
            assert.equal(kvp1.equal(1), false);
            assert.equal(kvp1.equal(kvp1), true);
        });
    });
});


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

        it('should accept a kvp object', function() {
            var nv = "NEWVAL";
            testKvp2.value = nv;
            dict.set(testKvp2);
            assert.equal(dict.get(testKvp2.key), nv);
        });
    });

    describe('#put', function() {
        it('should set the value of the kvp to the new value if it exists', function() {
            var nv = "ASDASDASD";
            var tkvp1 = new ds.KeyValuePair(testKvp1.key, nv);
            dict.put(tkvp1.key, tkvp1.value);
            assert.equal(dict.get(testKvp1.key), nv);
        });

        it('Otherwise add the kvp', function() {
            var nk = "KEYASDASDASD";
            var nv = "VALUEASDASDASD";
            var tkvp1 = new ds.KeyValuePair(nk, nv);
            dict.put(tkvp1.key, tkvp1.value);
            assert.equal(dict.get(tkvp1.key), nv);
        });

        it('should accept a kvp object', function() {
            var nv = "NEWVALFORPUT";
            testKvp2.value = nv;
            dict.put(testKvp2);
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
                assert.equal(r.equal(testKvp2), true);
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

    describe('#values', function() {
        it('should return all values in the dictionary', function() {
            var values = dict.values();
            for (var i = 0, max = values.length; i < max; i++) {
                assert.notEqual(values.indexOf(kvpList[i].value), -1);
            }
            for (var i = 0, max = kvpList.length; i < max; i++) {
                assert.notEqual(values.indexOf(kvpList[i].value), -1);
            }
        });
    });

    describe('#pairs', function() {
        it('should return all pairs in the dictionary', function() {
            var pairs = dict.pairs().sort();
            var ref = kvpList.sort();
            for (var i = 0, max = pairs.length; i < max; i++) {
                assert.equal(pairs[i].equal(ref[i]), true);
            }
        });
    });
});

var Tuple = ds.Tuple;
describe('Tuple', function() {
    var tupl, limit = 2, i1 = {a:123}, i2 = {b:234}, refList = [i1, i2];

    var init = function() {
        tupl = new ds.Tuple(limit, refList);
    }

    beforeEach(init);

    describe('#limit', function() {
        it('should return the limit of the tuple', function() {
            assert.equal(tupl.limit(), limit);
        });
    });

    describe('#count', function() {
        it('should return the current count of items in the tuple', function() {
            assert.equal(tupl.count(), refList.length);
            assert.equal(new ds.Tuple(5, i1).count(), 1);
        });
    });

    describe('#ctor', function() {
        it('should accept the limit as first arg, and objects to add to the data as the rest.', function() {
            var lim = 5;
            var t = new ds.Tuple(lim, 1, 2, 3, 4, 5);
            assert.equal(t.count(), lim);
        });

        it('should accept the limit as first arg, and an array as second with the data', function() {
            var lim = 5;
            var data = (function() {
                var tmp = [];
                for (var i = lim; i--;) {
                    tmp.push(i);
                }
                return tmp;
            }());
            var t = new ds.Tuple(lim, data);
            assert.equal(t.count(), data.length);
        });

        it('should throw if first arg isn\'t a number', function() {
            assert.throws(function() {
                new ds.Tuple("")
            });

            assert.throws(function() {
                new ds.Tuple();
            });
        });

        it('should throw if first arg is zero or negative', function() {
            assert.throws(function() {
                new ds.Tuple(0)
            });
            assert.throws(function() {
                new ds.Tuple(-100)
            });
        });
    });

    describe('#get', function() {
        it('should get the object at the supplied index', function() {
            var t = new ds.Tuple(limit, i1);
            assert.equal(t.get(0), i1);
        });

        it('should throw if index is out of bounds', function() {
            var t = new ds.Tuple(limit);
            assert.throws(function() {
                t.get(100);
            });
        });
    });

    describe('#add', function() {
        it('should add the supplied object to the Tuple if there\'s space left', function() {
            var t = new ds.Tuple(limit, i1);
            t.add(i2);
            assert.equal(t.get(0), i1);
            assert.equal(t.get(1), i2);
        });

        it('should throw if reached limit', function() {
            var t = new ds.Tuple(limit, i1);
            t.add(i2);
            assert.throws(function() {
                t.add({c:345});
            });
        });
    });

    describe('#put', function() {
        it('should update the object at the supplied index with the supplied value if index <= limit', function() {
            var t = new ds.Tuple(limit, i1);
            var i3 = {c:345};
            t.put(0, i3);
            t.put(1, i2);
            assert.equal(t.get(0), i3);
            t.put(0, i1);
            assert.equal(t.get(0), i1);
            assert.equal(t.get(1), i2);
        });

        it('should throw if index > limit', function() {
            var t = new ds.Tuple(limit, i1);
            t.add(i2);
            assert.throws(function() {
                t.put(2, {c:345});
            });
        });
    });
});

var Stack = ds.Stack;
describe('Stack', function() {

    var testData = [1, 2, 3, 'a', 'b', 'c', {a:123}, [3,2,1]];

    var testStack = function(data, stack) {
        for (var i = data.length; i--;) {
            var curr = stack.pop();
            assert.equal(curr, data[i]);
        }
    };

    describe('#ctor', function() {
        it('should accept an array as arg to init the data', function() {
            var s = new ds.Stack(testData);
            testStack(testData, s);
        });
    });
});
