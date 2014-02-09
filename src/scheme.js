var regex = {
	open_bracket: /\(/g,
	close_bracket: /\)/g,
	no_space: /\S+/g,
	nonneg_int: /^\d$|^[1-9]\d+$/
};

var tokenize = function (str) {
	return str.replace(regex.open_bracket, " ( ").
	replace(regex.close_bracket, " ) ").
	match(regex.no_space);
};

var read_int = function (token) {	 
	return token.match(regex.nonneg_int) ? Number.parseInt(token) : null;	 
};

var read_atom = function (token) {
	var int = read_int(token);
	return int === null ? token : int;
};

var read = function (list, level, tokens) {
	var sublist, is_err;
	var token = tokens.shift();	
	
	if (token === undefined && level === 0) { return list; } 
	if (token === undefined && level > 0) { return "unexpected eof"; }
	
	if (token === ")" && level === 0) { return "unmatched )"; }
	if (token === ")" && level > 0) { return list; }
	
	if (token === "(") { 
		sublist = read([], level + 1, tokens);
		
		is_err = typeof sublist === "string";
		if (is_err) { return sublist; } 
		
		list.push(sublist);
		return read(list, level, tokens);		
	}
	
	list.push(read_atom(token));	
	return read(list, level, tokens);
};

var parse = function (str) {
	return read([], 0, tokenize(str));
};

var eval_cond = function (expr, env) {
	var first = expr.shift();
	var test, conseq;
	if (first === undefined) { return null; }
	test = eval(first[0], env);
	conseq = eval(first[1], env);
	return test ? conseq : eval_cond(expr, env);
};

var eval = function (expr, env) {	 
	var symb, f;
	
	if (typeof expr === "object") {
		f = expr.shift();		 
		
		if (f === "cond") { return eval_cond(expr, env); }
		
		f = eval(f, env);
		expr = expr.map(function (x) { return eval(x, env); });		   
		return f.apply(null, expr);
	}
	
	if (typeof expr === "number") { return expr; }
	
	symb = env[expr];
	if (symb) { return symb; }
	
	return expr;
};

var env = {
	"add1": function (x) { return x + 1; },
	"sub1": function (x) { return x > 0 ? x - 1 : null; },
	"zero?": function (x)  { return x === 0; }
};

var run = function (str) {
	var ast = parse(str);		
	return eval(ast[0], env);
};
