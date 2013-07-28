// after ideas from
// http://javascript.crockford.com/inheritance.html
// and
// http://javascript.crockford.com/prototypal.html

Object.clone = function(parent){
    function Constr(){}
    Constr.prototype = parent;
    var clone = new Constr();
    clone.getParent = function(){return parent;};
    return clone;
};

function make_paranizor(value){
    var _value = value;
    return { setValue: function(value){_value = value; return this;},
             getValue: function(){return _value;},
             toString: function(){return "(" + this.getValue() + ")";} };
}

function make_zero_paranizor(value){
    var zp = Object.clone(make_paranizor(value));
    zp.toString = function(){
        if(this.getValue())
            return this.getParent().toString();
        else
            return "-" + this.getValue() + "-";
    };
    return zp;
}

function run(){
    var p = make_zero_paranizor(42);
    console.log(p.toString());
    p.setValue(0);
    console.log(p.toString());
    delete(p.toString);
    console.log(p.toString());
}

run();