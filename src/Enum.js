(function(definition) {
    this.Enum = definition();
})(function() {
    return function Enum(flags) {
        var num = 0;
        var getNextBits = function() {
            return (num *= 2) || (num = 1);
        };

        for(var i = 0; i < flags.length; i++) {
            this[flags[i]] = getNextBits();
        }
    };
});
