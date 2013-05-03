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
        this.key = key;
        this.value = value;
    };

    var dict = ds.Dictionary = function() {
        // =====================================================================
        // Represents a dictionary (a map of key/value pairs).
        // =====================================================================
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
        };

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
        };

        this.add = function (kvp) {
            if (kvp instanceof kvp) {
                kvpairs.push(kvp);
            } else {
                throw TypeError("Parameter is not of type ds.KeyValuePair.")
            }
        }

        this.remove = function(key) {
            var kvp = this.get(key);
            if (kvp) {
                var index = kvpairs.filter(function(item, index) {
                    if (item.key === key) {
                        return index;
                    }
                });

                if (index.length > 1) {
                    throw Error("More than one element found!");
                } else {
                    index = index[0];
                }
                kvpairs.splice(index, 1);
            }
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


