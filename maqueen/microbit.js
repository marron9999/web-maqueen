var MICROBIT = {
	UART_SERVICE:      "6E400001B5A3F393E0A9E50E24DCCA9E",
	TX_Characteristic: "6E400002B5A3F393E0A9E50E24DCCA9E",
	RX_Characteristic: "6E400003B5A3F393E0A9E50E24DCCA9E",
	connect: async function(notify) {
		this._RX_Characteristic = null;
		this._TX_notify = notify;
		await this.device("BBC micro:bit", this.UART_SERVICE);
		if(this._primary == null) {
			this.disconnect();
			return;
		}
		this._RX_Characteristic =
		await this.characteristic(this.RX_Characteristic);
		await this.characteristic(this.TX_Characteristic, this.TX_notify);
	},
	_RX_Characteristic: null,
	_TX_notify: null,
	send: async function(text) {
		if(this._RX_Characteristic != null) {
			//this.log("Send: " + text);
			let buffer = this._encoder.encode(text + "\n");
			await this._RX_Characteristic.writeValue(buffer);
		}
	},
	TX_notify: function(event) {
		if(MICROBIT._TX_notify != null) {
			let text= MICROBIT._decoder.decode(event.target.value);
			setTimeout(function() {
				MICROBIT._TX_notify(text);
			}, 1);
		}
	},
	_encoder: new TextEncoder('utf-8'),
	_decoder: new TextDecoder('utf-8'),
	format: function(val) {
		val = val.toLowerCase();
		let v =		val.substr(0, 8);	val = val.substr(8);
		v += "-" +	val.substr(0, 4);	val = val.substr(4);
		v += "-" +	val.substr(0, 4);	val = val.substr(4);
		v += "-" +	val.substr(0, 4);	val = val.substr(4);
		v += "-" +	val;
		return v;
	},
	log: function(text) {
		
	},
	error: function(error) {
		
	},
	closed: function() {
		
	},
	_device: null,
	_server: null,
	_primary: null,
	disconnect: async function() {
		if(this._device != null) {
			await this._server.disconnect();
			this._device = null;
			this._server = null;
			this._primary = null;
		}
	},
	characteristic: async function(uuid, callback) {
		let characteristic 	=
		 await this._primary.getCharacteristic(this.format(uuid))
		.then(characteristic => {
			this.log(characteristic);
			return characteristic;
		}).catch(this.error);
		if(callback != undefined
		&& callback != null) {
			await characteristic.addEventListener("characteristicvaluechanged", callback);
			await characteristic.startNotifications();
		}
		return characteristic;
	},
	device: async function(prefix, uuid) {
		this._device = null;
		this._server = null;
		this._primary = null;
		let option = {
			acceptAllDevices: false,
			filters: [
				{ services: [ this.format(uuid) ] }, // <- 重要
				{ namePrefix: prefix},
			]
		};
		this._device = 
		await navigator.bluetooth.requestDevice(option)
		.then(device => { 
			this.log(device);
			return device;
		}).catch(this.error);
		if(this._device == null) return null;
		this._server = 
		await this._device.gatt.connect()
		.then(server => {
			this.log(server);
			return server;
		}).catch(this.error);
		this._primary =
		await this._server.getPrimaryService(this.format(uuid))
		.then(service => {
			this.log(service);
			return service;
		}).catch(this.error);
		this._device.addEventListener("gattserverdisconnected", this.closed);
	},
};
