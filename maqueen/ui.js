var debug = false;

window.onload = function() {
	NOTIFY.error = function(error) {
		device_log("Error: " + error);
	};
	NOTIFY.log = function(text) {
		device_log(text);
	};
	NOTIFY.closed = function() {
		device_closed();
	};
	NOTIFY.mortor_left = function(val) {
		setTimeout(function() {
			selector("#mortor_left").innerHTML = "" + val;
			selector("#mortor_left2").innerHTML = "" + val;
			selector("#img_tire_left1").style.visibility = (val > 0)? "visible" : "hidden";
			selector("#img_tire_left2").style.visibility = (val < 0)? "visible" : "hidden";
		}, 1);
	};
	NOTIFY.mortor_right = function(val) {
		setTimeout(function() {
			selector("#mortor_right").innerHTML = "" + val;
			selector("#mortor_right2").innerHTML = "" + val;
			selector("#img_tire_right1").style.visibility = (val > 0)? "visible" : "hidden";
			selector("#img_tire_right2").style.visibility = (val < 0)? "visible" : "hidden";
		}, 1);
	};
	NOTIFY.led_left = function(val) {
		setTimeout(function() {
			selector("#led_left").style.background = (val > 0)? "#f88" : "#888";
			selector("#img_led_left1").style.visibility = (val >  0)? "visible" : "hidden";
			selector("#img_led_left0").style.visibility = (val <= 0)? "visible" : "hidden";
		}, 1);
	};
	NOTIFY.led_right = function(val) {
		setTimeout(function() {
			selector("#led_right").style.background = (val > 0)? "#f88" : "#888";
			selector("#img_led_right1").style.visibility = (val >  0)? "visible" : "hidden";
			selector("#img_led_right0").style.visibility = (val <= 0)? "visible" : "hidden";
		}, 1);
	};
	NOTIFY.sensor_left = function(val) {
		setTimeout(function() {
			selector("#sensor_left").style.background = (val > 0)? "white" : "black";
			selector("#sensor_left2").style.background = (val > 0)? "white" : "black";
		}, 1);
	};
	NOTIFY.sensor_right = function(val) {
		setTimeout(function() {
			selector("#sensor_right").style.background = (val > 0)? "white" : "black";
			selector("#sensor_right2").style.background = (val > 0)? "white" : "black";
		}, 1);
	};
	NOTIFY.sonic_notify = function(val) {
		setTimeout(function() {
			selector("#sonic").innerHTML = "" + val;
			selector("#sonic2").innerHTML = "" + val;
		}, 1);
	};
	device_init();
	var ee = ["button_forward", "button_turn_left", "button_backward", "button_turn_right"];
	for(let i=0; i<ee.length; i++) {
		let e = selector("#" + ee[i]);
		e.addEventListener("mousedown", device_mousedown);
		e.addEventListener("mouseup", device_mouseup);
		e.addEventListener("touchstart", device_mousedown);
		e.addEventListener("touchend", device_mouseup);
	}
	let v;
	ee = ["","",""];
	let e2 = ["","",""];
	for(let j=0; j<SOUND.label.length; j++) {
		for(let i=0; i<SOUND.label[0].length; i++) {
			v = "<span class='sound' onclick='device_sound(this)' id="
					+ j + i + "><b>" + SOUND.label[j][i] + "</b></span>";
			if(SOUND.label[j][i].indexOf("#") >= 0) {
				e2[j] += v.replace("#", "");
			} else {
				if(SOUND.label[j][i].indexOf("ミ") >= 0
				//|| SOUND.label[j][i].indexOf("シ") >= 0
				) {
					e2[j] += "<span class='sound null'> </span>";
				}
				ee[j] += v;	
			}
		}
	}
	v = "<div><div class=sound1>" + e2[2] + "</div><div class=sound2>" + ee[2] + "</div></div>";
	v += "<div><div class=sound1>" + e2[1] + "</div><div class=sound2>" + ee[1] + "</div></div>";
	v += "<div><div class=sound1>" + e2[0] + "</div><div class=sound2>" + ee[0] + "</div></div>";
	selector("#sound").innerHTML = v;;
};

function device_prev(l) {
	_device_shift.e = selector("#page");
	_device_shift.v = parseInt(_device_shift.e.style.marginLeft.replace("px",""));
	_device_shift.c = 340 / 5;
	_device_shift.a = 5;
	if(document.body.clientWidth >= 720) {
		if(_device_shift.v > -340)
			return;
	}
	if(_device_shift.v >= 0)
		_device_shift.a = 0 - _device_shift.a;
	setTimeout(device_shift, 1);
}
function device_next(val) {
	_device_shift.e = selector("#page");
	_device_shift.v = parseInt(_device_shift.e.style.marginLeft.replace("px",""));
	_device_shift.c = 340 / 5;
	_device_shift.a = 5;
	if(document.body.clientWidth >= 720) {
		if(_device_shift.v <= -340)
			return;
	}
	if(_device_shift.v >= -340)
		_device_shift.a = 0 - _device_shift.a;
	setTimeout(device_shift, 1);
}
var _device_shift = { e:null, v:0, c:0, a:0 };
function device_shift() {
	_device_shift.c --;
	_device_shift.v += _device_shift.a;
	_device_shift.e.style.marginLeft = _device_shift.v + "px";
	if(_device_shift.c > 0)
		setTimeout(device_shift, 1);
}

async function device_led(e) {
	e.style.background = "rgba(0,255,0,0.2)";
	if(e.id == "button_led_left") {
		await MAQUEEN.led_left((NOTIFY._led_left)? 0 : 1);
	}
	if(e.id == "button_led_right") {
		await MAQUEEN.led_right((NOTIFY._led_right)? 0 : 1);
	}
	setTimeout(function() {
		e.style.background = null;
	}, 500);
}
	
async function device_sound(e) {
	e.style.background = "rgba(0,255,0,0.2)";
	var j = parseInt(e.id.charAt(0));
	var i = parseInt(e.id.substr(1));
	j = SOUND.value[j][i];
	await MAQUEEN.sound(j);
	setTimeout(function() {
		e.style.background = null;
	}, 500);
}

async function device_mouseup() {
	event.preventDefault();
	event.stopPropagation();
	let e = event.currentTarget;
	e.style.background = null;
	await MAQUEEN.mortor(0);
}

async function device_mousedown() {
	event.preventDefault();
	event.stopPropagation();
	let e = event.currentTarget;
	e.style.background = "rgba(0,255,0,0.2)";
	if(e.id == "button_forward") {
		await MAQUEEN.forward();
		return;
	}
	if(e.id == "button_turn_right") {
		await MAQUEEN.turn_right(0);
		return;
	}
	if(e.id == "button_turn_left") {
		await MAQUEEN.turn_left(0);
		return;
	}
	if(e.id == "button_backward") {
		await MAQUEEN.backward();
		return;
	}
}

function device_init() {
	MAQUEEN.init();
	selector("#led_left").style.background = "#888";
	selector("#led_right").style.background = "#888";
	selector("#mortor_speed").innerHTML = "" + MAQUEEN._speed;
}
function device_closed() {
	device_log("切断されました");
	device_init();
	selector("#conn").innerHTML = "接続";
	selector("#page").className = "";
}

async function device_connect() {
	if(MICROBIT._device != null) {
		//device_log("disconnect");
		await MAQUEEN.disconnect();
		device_init();
		selector("#conn").innerHTML = "接続";
		selector("#page").className = "";
		return;
	}
	selector("#log").innerHTML = "";
	device_init();
	await MAQUEEN.connect();
	await MAQUEEN.sensor(true);
	await MAQUEEN.sonic(10);
	if(MICROBIT._device != null) {
		selector("#conn").innerHTML = "切断";
		selector("#page").className = "connect";
	}
}
async function device_auto() {
	if(MAQUEEN._auto) {
		await MAQUEEN.auto(false);
		selector("#page").className = "connect";
		selector("#auto").innerHTML = "自動";
		return;
	}
	await MAQUEEN.auto(true);
	if(MAQUEEN._auto) {
		selector("#page").className = "auto";
		selector("#auto").innerHTML = "手動";
	}
}
	
async function device_send() {
	let text = selector("#in").value;
	if(text.length > 0) {
		if(debug) device_log("Send: " + text);
		await MAQUEEN.send(text);
	}
}

function device_cls() {
	selector("#log").innerHTML = "";
}
function device_log(text) {
	let height = selector("#logx").clientHeight - 10;
	if(debug) height *= 10;
	let element = selector("#log");
	let html = element.innerHTML;
	html += "<div>" + time() + ": " + text + "</div>";
	element.innerHTML = html;
	while(element.scrollHeight >= height) {
		let pos = html.indexOf("</div>");
		html = html.substring(pos+1+1+3+1);
		element.innerHTML = html;
	}
}

var _device_play = null;
function device_play(e) {
	e = e.innerHTML;
	_device_play = SOUND.play_data(SOUND[e]);
	_device_play.i = 0;
	_device_play.j = 0;
	setTimeout(device_play_,1);
}
async function device_play_() {
	if(_device_play.i>=_device_play.val.length) return;
	if(_device_play.j>=_device_play.val[_device_play.i].length) {
		_device_play.j = 0;
		_device_play.i ++;
		setTimeout(device_play_,1);
		return;
	}
	let len = _device_play.len[_device_play.i][_device_play.j];
	let val = _device_play.val[_device_play.i][_device_play.j];
	let key = _device_play.key[_device_play.i][_device_play.j];
	if(len == 0) {
		_device_play.j ++;
		setTimeout(device_play_,1);
		return;
	}
	if(val == 0) {
		_device_play.j ++;
		setTimeout(device_play_, parseInt(1000/4));
		return;
	}
	_device_play.j ++;
	let e = document.getElementById("" + key);
	let f = function() { e.style.background = null;	};
	if(e != undefined)
		e.style.background = "rgba(0,255,0,0.2)";
	if(len == 2) {
		await MAQUEEN.sound2(val);
		if(e != undefined)
			setTimeout(f, parseInt(1000/2));
		setTimeout(device_play_, parseInt(1000/2));
		return;
	}
	if(len == 3) {
		await MAQUEEN.sound1(val);
		if(e != undefined)
			setTimeout(f, 1000);
		setTimeout(device_play_, 1000);
		return;
	}
	await MAQUEEN.sound(val);
	if(e != undefined)
		setTimeout(f, parseInt(1000/16));
	setTimeout(device_play_, parseInt(1000/4));
}

function device_speed(val) {
	MAQUEEN.speed(val);
	selector("#mortor_speed").innerHTML = "" + MAQUEEN._speed;
}

function time() {
	let date = new Date();
	let hour = "0" + date.getHours();
	let min = "0" + date.getMinutes();
	let sec = "0" + date.getSeconds();
	let msec = "000" + date.getMilliseconds();
	hour = hour.substring(hour.length - 2);
	min = min.substring(min.length - 2);
	sec = sec.substring(sec.length - 2);
	msec = msec.substring(msec.length - 3);
	return hour + ":" + min + ":" + sec + "." + msec;
}
function selector(val) {
	return document.querySelector(val);
}
