var formatString = (function () {
    /**
     formatString

     Expected arguments:
     format[0]: <String> The format. It uses a specific interpolation notation.
     data[1]: <Object|Array<Object>> The data to interpolate

     Throws:
     TypeError: If format is null or undefined

     Returns:
     <String> The result.
     | data when data === (null|undefined)  -> unformatted `format`.
     | _ -> `format` formatted with `data`

     Examples:
     formatString("Hi, my name is %name", {name: "Björn"}) // => "Hi, my name is Björn"
     formatString("Hi, my name is %0", ["Björn"]) // => "Hi, my name is Björn"
     **/

    var isNullOrUndefined = function(p) {
        return p === void 0 || p === null;
    };

    var getReForKey = function(key) {
        return new RegExp("%" + key, "g");
    };

    var foreach = function(coll, callback) {
        var i, k, max;
        if (coll.constructor === ({}).constructor) {
            for (k in coll) {
                if (coll.hasOwnProperty(k)) {
                    callback(coll[k], k, coll);
                }
            }
        } else if (coll.constructor === ([]).constructor) {
            max = coll.length;
            for (i = 0; i < max; i++) {
                callback(coll[i], i, coll);
            }
        }
    };

    return function (format, data) {
        if (isNullOrUndefined(format)) {
            throw new TypeError("Parameter cannot be null or undefined.");
        }

        if (typeof format !== "string" && !(format instanceof String)) {
            return;
        }

        if (isNullOrUndefined(data)) {
            return format;
        }

        var result = format;
        foreach(data, function(val, index) {
            result = result.replace(getReForKey(index), val);
        });

        return result;
    };
})();
