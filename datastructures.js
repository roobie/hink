(function () {
    'use strict';

    var ds = {};

    var isFunction = function(f) {
        return !!f && typeof f === 'function' && Object.prototype.toString.call(f) === '[object Function]';
    };

    var isArray = function(a) {
        return !!a && Object.prototype.toString.call(a) === '[object Array]';
    };

    var isArguments = function(a) {
        return !!a && Object.prototype.toString.call(a) === '[object Arguments]';
    };

    var getKeyValuePair = function(args) {
        if (isArguments(args)) {
            if (args[0] && args[1]) {
                return new ds.KeyValuePair(args[0], args[1]);
            }
        }

        if (isArguments(args) || isArray(args)) {
            if (args.length === 1 && args[0] instanceof ds.KeyValuePair) {
                return args[0];
            }
            if (!!args[0] && args[0].key && args[0].value) {
                return new ds.KeyValuePair(args[0].key, args[0].value);
            }
        }

        if (!!args && args.key && args.value) {
            return new ds.KeyValuePair(args.key, args.value);
        }

        throw new Error('Wrong arguments passed to getKeyValuePair. Pass either one KeyValuePair XOR (one key AND one value) XOR {key, value}. Data passed: ' + JSON.stringify(args));
    };

    var atoa = function(args) {
        var data = [];
        if (args.length > 1) {
            data = Array.prototype.slice.call(args, 0);
        } else if (args.length === 1) {
            if (isArray(args[0])) {
                data = args[0].slice(0);
            } else {
                data = [args[0]];
            }
        }
        return data;
    };

    var deplete = function(depleteFn, forEachCallback) {
        var current = depleteFn.call(this);

        if (!isFunction(forEachCallback)) {
            throw new TypeError("The supplied callback is not a function.");
        }

        while (current) {
            forEachCallback.call(this, current);
            current = depleteFn.call(this);
        }
    };

    ds.KeyValuePair = function(key, value) {
        // =====================================================================
        // Represents a key/value pair.
        // =====================================================================
        var temp = Object.create(null);

        if (key && value) {
            temp.key = key;
            temp.value = value;
        } else if (key && !value) {
            temp = key;
        } else {
            throw new Error("ds.KeyValuePair :: ctor -> Invalid arguments.");
        }

        this.key = temp.key;
        this.value = temp.value;

        // enable new-less
        if (!(this instanceof ds.KeyValuePair)) {
            return new ds.KeyValuePair(key, value);
        }
    };

    ds.KeyValuePair.prototype = Object.create(null, {
        equal: {
            value: function(other) { // by value
                if (other instanceof ds.KeyValuePair) {
                    return this.key === other.key && this.value === other.value;
                }
                return false;
            },
            enumerable: false,
            writable: false,
            configurable: false
        }
    });

    ds.Dictionary = function() {
        // =====================================================================
        // Represents a dictionary (a map of key/value pairs).
        // =====================================================================
        var i, max, kvpair, dictionary;
        this.data = [];

        for (i = 0, max = arguments.length; i < max; i++) {
            kvpair = arguments[i];
            this.add(getKeyValuePair(kvpair));
        }

        // enable new-less
        if (!(this instanceof ds.Dictionary)) {
            dictionary = Object.create(ds.Dictionary.prototype);
            ds.Dictionary.apply(dictionary, arguments);
            return dictionary;
        }
    };

    ds.Dictionary.prototype = Object.create(null, {
        find: {
            value: function(key, callback) {
                var result, localFind;
                localFind = function() {
                    var i, max;
                    for (i = 0, max = this.data.length; i < max; i++) {
                        if (this.data[i].key === key) {
                            return [this.data[i], i];
                        }
                    }
                };
                result = localFind.call(this);
                if (result) {
                    if (isFunction(callback)) {
                        callback.call(this, result[0], result[1]);
                    } else {
                        return result[0];
                    }
                }
            }
        },
        get: {
            value: function(key) {
                var result = this.find(key);
                if (result) {
                    return result.value;
                }
            }
        },
        set: {
            value: function(key, newValue) {
                var kvpair = getKeyValuePair(arguments),
                    result = this.find(kvpair.key);
                if (result) {
                    result.value = kvpair.value;
                    return result;
                }
            }
        },
        put: {
            value: function(key, value) {
                var kvpair = getKeyValuePair(arguments);
                if (this.get(kvpair.key)) {
                    this.set(kvpair.key, kvpair.value);
                } else {
                    this.add(kvpair);
                }
            }
        },
        add: {
            value: function (kvpair) {
                if (kvpair instanceof ds.KeyValuePair) {
                    if (!this.get(kvpair.key)) {
                        this.data.push(kvpair);
                    } else {
                        throw new Error("The key: `" + kvpair.key + "` already exists in this Dictionary");
                    }
                } else {
                    throw new TypeError("Parameter is not of type ds.KeyValuePair.");
                }
            }
        },
        remove: {
            value: function(key, callback) {
                this.find(key, function(kvpair, index) {
                    this.data.splice(index, 1);
                    if (isFunction(callback)) {
                        callback.call(this, kvpair);
                    }
                });
            }
        },
        keys: {
            get: function() {
                return this.data.map(function(e) {
                    return e.key;
                });
            }
        },
        values: {
            get: function() {
                return this.data.map(function(e) {
                    return e.value;
                });
            }
        },
        each: {
            value: function(callback) {
                var i, max;
                for (i = 0, max = this.data.length; i < max; i++) {
                    callback.call(this, this.data[i]);
                }
            }
        },
        count: {
            get: function() {
                return this.data.length;
            }
        },
        toString: {
            value: function() {
                return JSON.stringify(this.data);
            }
        }
    });

    ds.Tuple = function(limit) {
        // =====================================================================
        // Represents a fixed size array.
        // =====================================================================
        if (!limit) {
            throw new Error("Invalid arguments");
        }

        if (typeof limit !== 'number' || limit < 1) {
            throw new Error("Limit must be a number above 0.");
        }

        this.limit = limit;
        this.data = [];

        var origArgs = Array.prototype.slice.call(arguments, 0);

        Array.prototype.shift.call(arguments);
        var d = atoa(arguments);

        if (d.length > limit) {
            throw new Error(["Too many objects! Number supplied: [", d.length, "], limit: [", limit, "]."].join(''));
        }

        this.data = d;

        // enable new-less
        if (!(this instanceof ds.Tuple)) {
            var tuple = Object.create(ds.Tuple.prototype);
            ds.Tuple.apply(tuple, origArgs);
            return tuple;
        }
    };

    var indexOutOfBoundsError = function(index, limit) {
        return new Error("Index is out of bounds: " + index + " > " + limit + ".");
    };

    ds.Tuple.prototype = Object.create(null, {
        count: {
            get: function() {
                return this.data.length;
            }
        },
        add: {
            value: function(element) {
                if (this.count < this.limit) {
                    this.data.push(element);
                } else {
                    throw new Error("This Tuple has reached it's limit [" + this.limit + "].");
                }
            }
        },
        get: {
            value: function(index) {
                if (index < this.limit) {
                    return this.data[index];
                } else {
                    throw indexOutOfBoundsError(index, this.limit);
                }
            }
        },
        put: {
            value: function(index, element) {
                if (index < this.limit) {
                    this.data[index] = element;
                } else {
                    throw indexOutOfBoundsError(index, this.limit);
                }
            }
        }
    });

    ds.Stack = function() {
        this.data = atoa(arguments);

        // enable new-less
        if (!(this instanceof ds.Stack)) {
            var stack = Object.create(ds.Stack.prototype);
            ds.Stack.apply(stack, arguments);
            return stack;
        }
    };

    ds.Stack.prototype = Object.create(null, {
        push: {
            value: function(element) {
                this.data.push(element);
            }
        },
        pop: {
            value: function() {
                return this.data.pop();
            }
        },
        peek: {
            get: function() {
                return this.data[this.data.length - 1];
            }
        },
        deplete: {
            value: function(callback) {
                deplete.call(this, this.pop, callback);
            }
        }
    });

    ds.Queue = function() {
        this.data = atoa(arguments);

        // enable new-less
        if (!(this instanceof ds.Queue)) {
            var queue = Object.create(ds.Queue.prototype);
            ds.Queue.apply(queue, arguments);
            return queue;
        }
    };

    ds.Queue.prototype = Object.create(null, {
        enq: {
            value: function(element) {
                this.data.push(element);
            }
        },
        deq: {
            value: function() {
                return this.data.shift();
            }
        },
        peek: {
            get: function() {
                return this.data[0];
            }
        },
        deplete: {
            value: function(callback) {
                deplete.call(this, this.deq, callback);
            }
        }
    });

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

