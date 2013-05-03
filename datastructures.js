(function (root) {
    'use strict';

    var ds = {};

    var kvp = ds.KeyValuePair = function(key, value) {
        this.key = key;
        this.value = value;
    }

    var dict = ds.Dictionary = function() {
        var kvpairs = [];

        this.get = function(key) {
            var result = kvpairs.filter(function(kvp) {
                if (kvp.key === key) {
                    return kvp.value;
                }
            });
            if (result.length > 1) {
                throw Error("More than one result in result set");
            }
            if (result.length == 1) {
                return result[0].value;
            }
        }

        this.set = function(key, newValue) {
            var result = kvpairs.filter(function(kvp) {
                if (kvp.key === key) {
                    return kvp.value;
                }
            });
            if (result.length > 1) {
                throw Error("More than one result in result set");
            }
            if (result.length == 1) {
                result[0].value = newValue;
            }
        }

        this.count = function () {
            return kvpairs.length;
        }

        this.keys = function() {
            return kvpairs.map(function(e) {
                return e.key;
            });
        }

        this.values = function() {
            return kvpairs.map(function(e) {
                return e.value;
            });
        }

        for (var i = 0, max = arguments.length; i < max; i++) {
            var item = arguments[i];
            if (item instanceof kvp) {
                if (!this.get(item.key)) {
                    kvpairs.push(item);
                } else {
                    throw Error("The key: `" + item.key + "` already exists in this Dictionary");
                }
            } else {
                throw TypeError("Parameter is not an instance of `asd.KeyValuePair`");
            }
        }
    }

    if (root.require && typeof root.define == 'function') {
        root.define([], ds);
    } else {
        root.ds = ds;
    }

}(global || window));


