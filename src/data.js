define(function () {
    "use strict";

    // PRIVATE
    var fluent = function  _fluent(method) {
        return function  fluent_method_wrapper() {
            method.apply(this, arguments);
            return this;
        };
    };

    var module = Object.create(null);

    module.Queue = function Queue(properties) {
        Object.defineProperties(this, {
            data: {
                value: []
            }
        });
    };

    Object.defineProperties(Queue.prototype, {
        enq: {
            value: fluent(function Queue_enq(value) {
                this.data.push(value);
            })
        },
        deq: {
            value: function Queue_deq() {
                return this.data.unshift();
            }
        },
        deplete: {
            value: fluent(function Queue_deplete(deplete_fn) {
                var next;
                while ((next = this.deq())) {
                    deplete_fn.call(this, next);
                }
            })
        }
    });

    return module;
});

