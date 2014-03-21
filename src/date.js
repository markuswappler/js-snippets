var make_date_calc = function () {
	
	var div = function (x, y) { 
		return Math.floor(x / y); 
	};
	
	var mod = function (x, y) { 
		var r = x % y; 
		return r >= 0 ? r : r + y; 
	};

	var leap_year = function (y) {
		if (mod(y, 400) === 0) { return true; }
		if (mod(y, 100) === 0) { return false; }
		if (mod(y, 4) === 0) { return true; }
		return false;
	};

	var month_lengths = function (y) {
		return leap_year(y) ?
			[].concat([31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]) :
			[].concat([31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]);	
	};

	var day_of_year = function (d, m, y) {
		var m_lens = month_lengths(y);
		var m_days = 0;
		var i;
		for (i = 0; i < m - 1; i += 1) { 
			m_days += m_lens[i]; 
		}
		return m_days + d;
	};

	var day_anno_domini = function (d, m, y) {
		var leaps = div(y - 1, 4) - div(y - 1, 100) + div(y - 1, 400);
		return 365 * (y - 1) + leaps + day_of_year(d, m);
	};

	var days = function (xd, xm, xy, yd, ym, yy) {
		return day_anno_domini(yd, ym, yy) - day_anno_domini(xd, xm, xy);	 
	};
	
	var day_of_week = function (d, m, y) {
			return mod(days(3, 1, 2000, d, m, y), 7) + 1;
	};	 

	// http://www.smart.net/~mmontes/nature1876.html
	var easter = function (y) {
		var a = mod(y, 19);
		var b = div(y, 100);
		var c = mod(y, 100);
		var d = div(b, 4);
		var e = mod(b, 4);
		var f = div(b + 8, 25);
		var g = div(b - f + 1, 3);
		var h = mod(19 * a + b - d - g + 15, 30);
		var i = div(c, 4);
		var k = mod(c, 4);
		var l = mod(32 + 2 * e + 2 * i - h - k, 7);
		var m = div(a + 11 * h + 22 * l, 451);
		var p = h + l - 7 * m + 114;
		var day = mod(p, 31) + 1;
		var month = div(p, 31);
		return [day, month];
	};
	
	var tomorrow = function (d, m, y) {
		var m_lens = month_lengths(y);
		if (d < m_lens[m - 1]) { return [d + 1, m, y]; }
		if (m < 12) { return [1, m + 1, y]; }
		return [1, 1, y + 1];
	};
	
	return {
		days: days,
		day_of_week: day_of_week,
		easter: easter,
		tomorrow: tomorrow
	};	  
};

var make_calendar = function () {	 
	var dates = [];
	var date = make_date_calc();
	
	return {
		
		entry: function (name, cond) {
			dates.push({ name: name, cond: cond });
			return this;
		},
		
		weekday: function (name, day) {
			return this.entry(name, function (d, m, y) {
				return date.day_of_week(d, m, y) === day;
			});
		},
		
		anniversary: function (name, day, month) {
			return this.entry(name, function (d, m, y) {
				return d === day && m === month;
			});
		},
		
		easter_based: function (name, day) {
			return this.entry(name, function (d, m, y) {
				var easter = date.easter(y);
				return date.days(easter[0], easter[1], y, d, m, y) === day;
			});
		},
		
		look_up: function (d, m, y) {
			var names = [];
			var i;
			for (i = 0; i < dates.length; i += 1) {
				if (dates[i].cond(d, m, y)) {
					names.push(dates[i].name);
				}
			}
			return names;
		}
		
	};
};

var holidays = make_calendar();
holidays.weekday("Saturday", 6);
holidays.weekday("Sunday", 7);
holidays.anniversary("New Years Day", 1, 1);
holidays.anniversary("Epiphany", 6, 1);
holidays.easter_based("Good Friday", -2);
holidays.easter_based("Easter Monday", 1);
holidays.anniversary("Labor Day", 1, 5);
holidays.easter_based("Ascension Day", 39);
holidays.easter_based("Pentecost", 50);
holidays.easter_based("Corpus Christi", 60);
holidays.anniversary("Unity Day", 3, 10);
holidays.anniversary("All Saints Day", 1, 11);
holidays.anniversary("Christmas", 25, 12);
holidays.anniversary("Boxing Day", 26, 12);

// holidays.look_up(20, 4, 2014); => [ 'Sunday' ]
// holidays.look_up(21, 4, 2014); => [ 'Easter Monday' ]
