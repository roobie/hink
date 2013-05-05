(function () {
    'use strict';

    var shift = Array.prototype.shift;
    var unshift = Array.prototype.unshift;
    var pop = Array.prototype.pop;
    var push = Array.prototype.push;

    var ds = {};

    var isArray = function(a) {
        if (Object.prototype.toString.call(a) === '[object Array]') {
            return true;
        }
        return false;
    };

    var kvp = ds.KeyValuePair = function(key, value) {
        // =====================================================================
        // Represents a key/value pair.
        // =====================================================================
        if (key && value) {
            // user supplied a key and value
            this.key = key;
            this.value = value;
        } else if (key && !value) {
            // user supplied an object as first and only arg
            // which should contain the key and value.
            var map = key;
            this.key = map.key;
            this.value = map.value;
        }

        this.equal = function(other) {
            if (other instanceof kvp) {
                return this.key === other.key && this.value === other.value;
            }
            return false;
        }
    };

    var dict = ds.Dictionary = function() {
        // =====================================================================
        // Represents a dictionary (a map of key/value pairs).
        // =====================================================================
        var kvpairs = [];

        var find = function(key, callback) {
            var f = function() {
                for (var i = 0, max = kvpairs.length; i < max; i++) {
                    if (kvpairs[i].key === key) {
                        return [kvpairs[i], i];
                    }
                }
            }
            var result = f();
            if (result) {
                if (callback && typeof callback == 'function') {
                    callback(result[0], result[1]);
                } else {
                    return result[0];
                }
            }
        };

        this.get = function(key) {
            var result = find(key);
            if (result) {
                return result.value;
            }
        };

        this.set = function(key, newValue) {
            var result = find(key);
            if (result) {
                result.value = newValue;
                return true;
            }
            return false;
        };

        this.add = function (kvpair) {
            if (kvpair instanceof kvp) {
                if (!this.get(kvpair.key)) {
                    kvpairs.push(kvpair);
                } else {
                    throw Error("The key: `" + item.key + "` already exists in this Dictionary");
                }
            } else {
                throw TypeError("Parameter is not of type ds.KeyValuePair.")
            }
        }

        this.remove = function(key, callback) {
            find(key, function(kvpair, index) {
                kvpairs.splice(index, 1);
                if (callback && typeof callback == 'function') {
                    callback(kvpair);
                }
            });
        }

        this.count = function () {
            return kvpairs.length;
        };

        this.keys = function() {
            return kvpairs.map(function(e) {
                return e.key;
            });
        };

        this.values = function() {
            return kvpairs.map(function(e) {
                return e.value;
            });
        };

        this.pairs = function() {
            return kvpairs.splice(0);
        };

        this.toString = function() {
            return JSON.stringify(kvpairs);
        };

        for (var i = 0, max = arguments.length; i < max; i++) {
            var kvpair = arguments[i];
            this.add(kvpair);
        }
    };

    var tuple = ds.Tuple = function(limit /* &rest*/) {
        // =====================================================================
        // Represents a fixed size array.
        // =====================================================================
        if (typeof limit !== 'number' && limit < 1) {
            throw Error("Limit must be a number above 0.");
        }

        var data = [];

        this.add = function(element) {
            if (data.length < limit) {
                data.push(element);
            } else {
                throw Error("this Tuple has reached it's limit.'");
            }
        };

        this.get = function(index) {
            if (index < limit) {
                return data[index];
            } else {
                throw Error("index is out of bounds: " + index + " > " + limit + ".");
            }
        };

        this.limit = function() {
            return limit;
        };

        arguments.shift();
        if (arguments.length > limit) {
            throw Error("More items than allowed by limit.");
        }
        for (var i = 0, max = arguments.length; i < max; i++) {
            data.push(arguments[i]);
        }
    };

    var stack = ds.Stack = function() {
        var data = [];

        if (isArray(arguments[0])) {
            data = arguments[0];
        }

        this.push = function(element) {
            data.push(element);
        };

        this.pop = function() {
            return data.pop();
        };

        this.peek = function() {
            return data[data.length - 1];
        };
    };

    var queue = ds.Queue = function() {
        var data = [];

        this.enq = function(element) {
            data.push(element);
        };

        this.deq = function() {
            return data.shift();
        };

        this.peek = function() {
            return data[0];
        };
    };

    // =*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=
    // EXPOSING MODULE
    // =*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=

    // CommonJS module is defined
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = ds;
    }
    /*global ender:false */
    if (typeof ender === 'undefined') {
        // here, `this` means `window` in the browser, or `global` on the server
        // add `moment` as a global object via a string identifier,
        // for Closure Compiler "advanced" mode
        this['ds'] = ds;
    }
    /*global define:false */
    if (typeof define === "function" && define.amd) {
        define("ds", [], function () {
            return ds;
        });
    }

}).call(this);

