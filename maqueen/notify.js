var NOTIFY = {
	error : function(error) { },
	log: function(log) { },
	closed: function() { },
/*
[NOTIFY]
S	L	0/1	左ラインセンサーの値
S	R	0/1	左ラインセンサーの値
U	-	整数	距離センサーの丸め後の値
M	L	-255～255	左モーターの値
M	R	-255～255	右モーターの値
M	B	-255～255	左と右モーターの値
L	L	0/1	左LEDの値
L	R	0/1	右LEDの値
L	B	0/1	左と右LEDの値
*/
	sensor_left: function(val) { },
	sensor_right: function(val) { },
	sonic_notify: function(val) { },
	mortor_left: function(val) { },
	mortor_right: function(val) { },
	led_left: function(val) { },
	led_right: function(val) { },
	_sensor_left: 0,
	_sensor_right: 0,
	_mortor_left: 0,
	_mortor_right: 0,
	_led_left: 0,
	_led_right: 0,
	_sonic: 0,
	parse: async function(vals) {
		//NOTIFY.log("Notify: " + vals);
		vals = vals.split(",");
		for(let i=0; i<vals.length; i++) {

		let str = vals[i];
		let c0 = str.charAt(0);
		let c1 = str.charAt(1);
		let val = parseInt(str.substring(2));
		if(c0 == 'S') {
			//NOTIFY.log("Notify: " + c0 + c1 + val);
			if(c1 == 'L') {
				NOTIFY._sensor_left = val;
				NOTIFY.sensor_left(val);
			} else if(c1 == 'R') {
				NOTIFY._sensor_right = val;
				NOTIFY.sensor_right(val);
			} else if(c1 == 'B') {
				NOTIFY._sensor_left = val;
				NOTIFY._sensor_right = val;
				NOTIFY.sensor_left(val);
				NOTIFY.sensor_right(val);
			}
			if(MAQUEEN._auto) {
				if(NOTIFY._sensor_left == 0
				&& NOTIFY._sensor_right == 0) {
					await MAQUEEN.mortor(MAQUEEN._speed);
				}
			}
			continue;
		}
		if(c0 == 'U') {
			NOTIFY._sonic = val;
			NOTIFY.sonic_notify(val);
			if(MAQUEEN._auto) {
				MAQUEEN.auto_sonic_notify(val);
			}
			continue;
		}
		if(c0 == 'M') {
			if(debug) NOTIFY.log("Notify: " + c0 + c1 + val);
			if(c1 == 'L') {
				NOTIFY._mortor_left = val;
				NOTIFY.mortor_left(val);
				continue;
			}
			if(c1 == 'R') {
				NOTIFY._mortor_left = val;
				NOTIFY.mortor_right(val);
				continue;
			}
			if(c1 == 'B') {
				NOTIFY._mortor_left = val;
				NOTIFY._mortor_right = val;
				NOTIFY.mortor_left(val);
				NOTIFY.mortor_right(val);
				continue;
			}
			continue;
		}
		if(c0 == 'L') {
			//NOTIFY.log("Notify: " + c0 + c1 + val);
			if(c1 == 'L') {
				NOTIFY._led_left = val;
				NOTIFY.led_left(val);
				continue;
			}
			if(c1 == 'R') {
				NOTIFY._led_right = val;
				NOTIFY.led_right(val);
				continue;
			}
			if(c1 == 'B') {
				NOTIFY._led_left = val;
				NOTIFY._led_right = val;
				NOTIFY.led_left(val);
				NOTIFY.led_right(val);
				continue;
			}
			continue;
		}
		NOTIFY.log("?: " + str);

		}
	},
};
