;(function multimethod_closure() {
    "use strict";

    var fluent = function fluent(fn) {
        return function () {
            fn.apply(this, arguments);
            return this;
        };
    };

    var identity = function identity(a) {
        return a;
    };

    var getCtor = function get_constructor(a) {
        if(a === void 0 || a === null) {
            return void 0;
        }

        return a.constructor;
    };

    var types = {
        onValue: 0,
        onType: 1
    };

    var multi = this.multi = function multi() {
        var lookup = function lookup(type, args) {
            // TODO: if dispatching on type, maybe build an algo that checks for most specific.
            // I.e. if we have a constructor `Animal` that another constructor (e.g. `Bear`) whose
            // prototype's [[__proto__]] points to, and user have dispatch on both types,
            // an argument of type `Bear` should always cause the most specific fn to be invoked.
            // It is possible with this impl, only the user have to define the least specific
            // type to dispatch on last, that is:
            // multi().ontypes(Bear)(func...).ontypes(Animal)(func...)
            // otherwise the dispatch on `Animal` would catch all calls.
            var fnTable = multimethod.functionTable,
                argsLen = args.length,
                match = false,
                i, j;

            var comparison;

            if (type === types.onType) {
                comparison = function instance_of_type(instance, type) {
                    if (!type.prototype) { return false; }
                    return getCtor(instance) === type || type.prototype.isPrototypeOf(instance);
                };
            } else if (type === types.onValue) {
                comparison = function strict_equals(a, b) {
                    return a === b;
                };
            } else {
                comparison = function false_func() { return false; };
            }

            for (i = 0; i < fnTable.length; i++) {
                if (fnTable[i].args.length !== argsLen || fnTable[i].type !== type) {
                    continue;
                }
                for (j = 0; j < argsLen; j++) {
                    if (!comparison(args[j], fnTable[i].args[j])) {
                        match = false;
                        break;
                    }
                    match = true;
                }

                if (match) { return fnTable[i].func; }
            }

            return void 0;
        };

        var multimethod = function multimethod() {
            var args = Array.prototype.slice.call(arguments),
                foundFn;

            foundFn = lookup(types.onValue, args) || lookup(types.onType, args);
            if (foundFn) {
                return foundFn.apply(this, args);
            } else if (multimethod._fallback) {
                return multimethod._fallback.apply(this, args);
            } else {
                throw new TypeError("No match!");
            }
        };

        var getOnFunc = function get_on_func(type) {
            return function multi_on() {
                var self = multimethod,
                    args = Array.prototype.slice.call(arguments, 0);
                return function multi_on_callback(fn) {
                    self.functionTable.push({
                        type: type,
                        args: args,
                        func: fn
                    });

                    return self;
                };
            };
        };

        Object.defineProperties(multimethod, {
            _fallback: {
                value: null,
                writable: true
            },
            fallback: {
                value: function set_fallback(value) {
                    this._fallback = value;
                    return this;
                }
            },
            functionTable: {
                value: []
            },
            ontypes: {
                value: getOnFunc(types.onType)
            },
            onvalues: {
                value: getOnFunc(types.onValue)
            }
        });

        return multimethod;
    };

}).call(this);
