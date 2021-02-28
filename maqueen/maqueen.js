var MAQUEEN = {
	send: async function(text) {
		//NOTIFY.log("Send: " + text);
		await MICROBIT.send(text);
	},
	disconnect: async function() {
		//NOTIFY.log("disconnect");
		await MICROBIT.disconnect();
	},
	connect: async function() {
		MICROBIT.error = NOTIFY.error;
		MICROBIT.log = NOTIFY.log;
		MICROBIT.closed = NOTIFY.closed;
		if(MICROBIT._device != null) {
			NOTIFY.log("切断します");
			await MICROBIT.disconnect();
		}
		await MICROBIT.connect(NOTIFY.parse);
		if(MICROBIT._device != null) {
			NOTIFY.log("接続しました");
		}
	},
/*
[REQUEST]
M	L	-255～255	Maqueen 左モーターを動かす
M	R	-255～255	Maqueen 右モーターを動かす
M	B	-255～255	Maqueen 両方のモーターを動かす
L	L	0/1	Maqueen 左LEDを消す/点ける
L	R	0/1	Maqueen 右LEDを消す/点ける
L	B	0/1	Maqueen 両方のLEDを消す/点ける
R	S	0/1	Maqueen	ラインセンサーのNOTIFYしない/する
R	U	0/丸め値	Maqueen	距離センサーのNOTIFYしない/する
R	A	mask	1-黒黒の戻す、2-LED点灯、4-音鳴らす
T	X	音色	Maqueen 音を鳴らす(1/16符)
T	8	音色	Maqueen 音を鳴らす(1/8符)
T	4	音色	Maqueen 音を鳴らす(1/4符)
T	2	音色	Maqueen 音を鳴らす(1/2符)
T	1	音色	Maqueen 音を鳴らす(1符)
*/	
	mortor_left: async function(val) { await this.send("ML" + val); },
	mortor_right: async function(val) { await this.send("MR" + val); },
	mortor:	async function(val) { await this.send("MB" + val); },
	led_left: async function(val) { await this.send("LL" + val); },
	led_right: async function(val) { await this.send("LR" + val); },
	led: async function(val) { await this.send("LB" + val); },
	sensor:	async function(val) { await this.send("RS" + ((val)? 1 : 0));	},
	sonic: async function(val) { await this.send("RU" + val); },
	sound: async function(val) { await this.send("TX" + val); },
	sound8: async function(val) { await this.send("T8" + val); },
	sound4: async function(val) { await this.send("T4" + val); },
	sound2: async function(val) { await this.send("T2" + val); },
	sound1: async function(val) { await this.send("T1" + val); },
	
	_speed: 60,
	_auto: false,
	_sensor_left: 0,
	_sensor_right: 0,
	_sonic: 0,
	init: function() {
		this._speed = 60;
		this._auto = false;
		this._sensor_left = 0;
		this._sensor_right = 0;
		this._sonic = 0;
	},
	auto: async function(val) {
		if(!val) {
			this._auto = false;
			NOTIFY.log("Send: " + "RA0");
			await this.send("RA0");
		} else {
			if(MICROBIT._device == null) return;
			this._auto = true;
			NOTIFY.log("Send: " + "RA7");
			await this.send("RA7");
			await this.forward();
		}
	},
	forward: async function() {
		await MAQUEEN.mortor(MAQUEEN._speed);
	},
	backward: async function() {
		await MAQUEEN.mortor(0 - MAQUEEN._speed);
	},
	turn_left: async function() {
		await MAQUEEN.mortor_left(0);
		await MAQUEEN.mortor_right(MAQUEEN._speed);
	},
	turn_right: async function() {
		await MAQUEEN.mortor_right(0);
		await MAQUEEN.mortor_left(MAQUEEN._speed);
	},
	auto_sensor_left: async function(val) {
		MAQUEEN._sensor_left = val;
		await MAQUEEN.auto_sensor();
	},
	auto_sensor_right: async function(val) {
		MAQUEEN._sensor_right = val;
		await MAQUEEN.auto_sensor();
	},
	auto_sensor: async function(val) {
		if(MAQUEEN._sensor_left == 0
		&& MAQUEEN._sensor_right == 0) {
			await MAQUEEN.forward();
			await MAQUEEN.led(0);
			return;
		}
		if(MAQUEEN._sensor_left == 1
		&& MAQUEEN._sensor_right == 0) {
			await MAQUEEN.turn_right();
			await MAQUEEN.led_left(1);
			await MAQUEEN.sound(SOUND.value[0]);
			return;
		}
		if(MAQUEEN._sensor_left == 0
		&& MAQUEEN._sensor_right == 1) {
			await MAQUEEN.turn_left();
			await MAQUEEN.led_right(1);
			await MAQUEEN.sound(SOUND.value[0]);
			return;
		}
	},
	auto_sonic_notify: function(val) {
		MAQUEEN._sonic = val;
		//
	},
	speed: function(val) {
		val += this._speed;
		if(val < 10) val = 10;
		else if(val > 250) val = 250;
		this._speed = val;
	},
};
