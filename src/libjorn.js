(function initialiser(definition) {
    "use strict";
    if (typeof module !== "undefined") {
        module.exports = definition();
    } else {
        this.libjorn = definition();
    }
})(function closure() {
    "use strict";

    // PRIVATE
    var array_slice = [].slice;

    // EXPORTED
    var module = Object.create(null);

    /***************************************************************************
     var curried_add = libjorn.curry(function add(a, b) {
         return a + b;
     });
     var addOne = curried_add(1);
     addOne(2) // -> 3
     **************************************************************************/
    var curry = module.curry = function  libjorn_curry(fn) {
        var args = [],
            expected_args_count = fn.length;
        return function curried() {
            var c_args = array_slice.call(arguments, 0);
            args = args.concat(c_args);
            if (expected_args_count <= args.length) {
                return fn.apply(this, args);
            } else {
                return curried;
            }
        };
    };

    return module;
});
(function TEST() {
    "use strict";
    if (typeof module === "undefined") {
        return;
    }
    var m = module.exports;

    (function test_curry() {
        var add = function (a, b) {
            return a + b;
        };

        var curriedAdd = m.curry(add),
            addOne = curriedAdd(1);

        if (typeof addOne !== "function") {
            throw new Error("curry did not return a function");
        }
        var three = addOne(2);
        if (three !== 3) {
            throw new Error("addOne(2) did not return 3");
        }
    })();
})();
