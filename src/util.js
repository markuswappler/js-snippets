var make_array_util = function () {    
    var iterate = function (f, arr) {
        var i = 0;
        var len = arr.length;
        var stop;
        while (i < len) {
            cont = f(arr[i], i);
            if (cont) {
                i += 1;
            } else {
                i = len;
            }          
        }        
    };
    
    var range = function (bound) {
        var ret = [];
        var i;
        for (i = 0; i < bound; i += 1) {
            ret.push(i);
        }
        return ret;
    };
    
    var filter = function (f, arr) {
        var ret = [];
        var g = function (x, i) {
            if (f(x, i)) {
                ret.push(x);
            }
            return true;
        };
        iterate(g, arr);
        return ret;
    };
    
    var map = function (f, arr) {
        var ret = [];
        var g = function (x, i) {
            ret.push(f(x, i));
            return true;
        };
        iterate(g, arr);
        return ret;
    };
    
    var doseq = function (f, arr) {
        var g = function (x, i) {
            f(x, i);
            return true;
        };
        iterate(g, arr);
        return arr;
    };
    
    var reduce = function (f, init, arr) {
        var ret = init;
        var g = function (x, i) {
            ret = f(ret, x, i);
            return true;
        };
        iterate(g, arr);
        return ret;
    };
    
    var find = function (f, arr) {
        var ret = null;
        var g = function (x, i) {
            if (f(x, i)) {
                ret = x;
                return false;
            }
            return true;
        };
        iterate(g, arr);
        return ret;
    };
    
    return {
        range: range,
        filter: filter,
        map: map,
        doseq: doseq,
        reduce: reduce,
        find: find
    };    
};

var make_pipe = function () {
    var value;
    
    var init = function (x) {
        value = x;
        return this;
    };
    
    var result = function () {
        return value;
    };
    
    var pipe = function (add) {
        return function () {
            var f = arguments[0];
            var args = Array.prototype.slice.call(arguments, 1);
            value = f.apply(null, add(args, value));
            return this;
        };
    };
    
    return {
        init: init,
        result: result,
        first: pipe(function (args, value) { 
            args.unshift(value);
            return args; 
        }),
        last: pipe(function (args, value) {
            args.push(value);
            return args;
        })
    };
};

var arr = make_array_util();
var pipe = make_pipe();

var res = pipe.init(100).
    last(arr.range).
    last(arr.map, function (x) { return x + 1; }).
    last(arr.reduce, function (x, y) { return x + y; }, 0).
    first(function (x) { return 2 * x + 1; }).
    result();