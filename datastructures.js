(function () {
    'use strict';

    var ds = {};

    var isFunction = function(f) {
        return !!f && typeof(f) === 'function' && Object.prototype.toString.call(f) === '[object Function]';
    };

    var isArray = function(a) {
        return !!a && Object.prototype.toString.call(a) === '[object Array]';
    };

    ds.KeyValuePair = function(key, value) {
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
        } else {
            throw Error('Invalid parameters.');
        }
    };

    ds.KeyValuePair.prototype.equal = function(other) { // by value
        if (other instanceof ds.KeyValuePair) {
            return this.key === other.key && this.value === other.value;
        }
        return false;
    };

    ds.Dictionary = function() {
        // =====================================================================
        // Represents a dictionary (a map of key/value pairs).
        // =====================================================================
        this.data = [];

        for (var i = 0, max = arguments.length; i < max; i++) {
            var kvpair = arguments[i];
            this.add(kvpair);
        }
    };

    ds.Dictionary.prototype.find = function(key, callback) {
        var result = (function() {
            for (var i = 0, max = this.data.length; i < max; i++) {
                if (this.data[i].key === key) {
                    return [this.data[i], i];
                }
            }
        }).call(this); // pass in the right context
        if (result) {
            if (isFunction(callback)) {
                callback.call(this, result[0], result[1]);
            } else {
                return result[0];
            }
        }
    };

    ds.Dictionary.prototype.getKVPair = function(args) {
        var kvpair;
        if (args.length == 1 && args[0] instanceof ds.KeyValuePair) {
            kvpair = args[0];
        } else if (args[0] && args[1]) {
            kvpair = new ds.KeyValuePair(args[0], args[1]);
        } else {
            throw Error('Wrong arguments passed to getKVPair. Pass either one KeyValuePair XOR (one key AND one value)');
        }
        return kvpair;
    };

    ds.Dictionary.prototype.get = function(key) {
        var result = this.find(key);
        if (result) {
            return result.value;
        }
    };

    ds.Dictionary.prototype.set = function(key, newValue) {
        var kvpair = this.getKVPair(arguments),
        result = this.find(kvpair.key);
        if (result) {
            result.value = kvpair.value;
            return true;
        }
        return false;
    };

    ds.Dictionary.prototype.put = function(key, value) {
        var kvpair = this.getKVPair(arguments);
        if (this.get(kvpair.key)) {
            this.set(kvpair.key, kvpair.value);
        } else {
            this.add(kvpair);
        }
    };

    ds.Dictionary.prototype.add = function (kvpair) {
        if (kvpair instanceof ds.KeyValuePair) {
            if (!this.get(kvpair.key)) {
                this.data.push(kvpair);
            } else {
                throw Error("The key: `" + kvpair.key + "` already exists in this Dictionary");
            }
        } else {
            throw TypeError("Parameter is not of type ds.KeyValuePair.")
        }
    }

    ds.Dictionary.prototype.remove = function(key, callback) {
        this.find(key, function(kvpair, index) {
            this.data.splice(index, 1);
            if (isFunction(callback)) {
                callback.call(this, kvpair);
            }
        });
    }

    ds.Dictionary.prototype.count = function () {
        return this.data.length;
    };

    ds.Dictionary.prototype.keys = function() {
        return this.data.map(function(e) {
            return e.key;
        });
    };

    ds.Dictionary.prototype.values = function() {
        return this.data.map(function(e) {
            return e.value;
        });
    };

    ds.Dictionary.prototype.toString = function() {
        return JSON.stringify(this.data);
    };

    var atoa = function(args) {
        var data = [];
        if (args.length > 1) {
            data = Array.prototype.slice.call(args, 0);
        } else if (args.length == 1) {
            if (isArray(args[0])) {
                data = args[0].slice(0);
            } else {
                data = [args[0]];
            }
        }
        return data;
    }

    var tuple = ds.Tuple = function(limit /* &rest*/) {
        // =====================================================================
        // Represents a fixed size array.
        // =====================================================================
        if (!limit) {
            throw Error("Invalid arguments");
        }

        if (typeof limit !== 'number' || limit < 1) {
            throw Error("Limit must be a number above 0.");
        }

        var data = [];

        this.add = function(element) {
            if (data.length < limit) {
                data.push(element);
            } else {
                throw Error("This Tuple has reached it's limit [" + limit + "].");
            }
        };

        this.get = function(index) {
            if (index < limit) {
                return data[index];
            } else {
                throw Error("Index is out of bounds: " + index + " > " + limit + ".");
            }
        };

        this.put = function(index, element) {
            if (index < limit) {
                data[index] = element;
            } else {
                throw Error("Index is out of bounds: " + index + " > " + limit + ".");
            }
        };

        this.limit = function() {
            return limit;
        };

        this.count = function() {
            return data.length;
        };

        Array.prototype.shift.call(arguments);
        var d = atoa(arguments);

        if (d.length > limit) {
            throw Error(["Too many objects! Number supplied: [", d.length, "], limit: [", limit, "]."].join(''));
        }
        data = d;
    };

    var stack = ds.Stack = function() {
        var data = atoa(arguments);

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
        var data = atoa(arguments);

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

