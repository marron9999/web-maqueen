var SOUND = {
	label: [
		["ド", "ド#", "レ", "レ#", "ミ", "ファ", "ファ#", "ソ","ソ#", "ラ", "ラ#", "シ"],
		["ド", "ド#", "レ", "レ#", "ミ", "ファ", "ファ#", "ソ","ソ#", "ラ", "ラ#", "シ"],
		["ド", "ド#", "レ", "レ#", "ミ", "ファ", "ファ#", "ソ","ソ#", "ラ", "ラ#", "シ"],
		],
	value: [
		[131, 139, 147, 156, 165, 175, 185, 196, 208, 220, 233, 247],
		[262, 277, 294, 311, 330, 349, 370, 392, 415, 440, 466, 498],
		[523, 554, 587, 622, 659, 698, 740, 784, 831, 880, 932, 988],
	],

	"チューリップ": [
		"ドレミ＿ ドレミ＿ ソミレド レミレ＿",
		"ドレミ＿ ドレミ＿ ソミレド レミド＿",
		"ソソミソ ララソ＿ ミミレレ ドーー",
	],
	"どんぐりころころ": [
		"ソーミミ ファミレド",
		"ソーミミ レーー＿",
		"ミーソソ ララーラ",
		"^ドーミミ ソーー＿",
		"ソーミミ ファミレド",
		"ソーミミ レーー＿",
		"ソーミミ ララソソ",
		"ララシシ ^ドーー",
	],
	"静かな湖畔": [
		"ドドドレ ミミミミ レドレミ ドー_ソー",
		"レレレミファ ソソソソ ファミファソ ミー＿＿ソ",
		"ミー＿＿ソ ミー＿＿ソ ミソミソ ミー",
	],

	play_data: function(data) {
		let val = [];
		let len = [];
		let key = [];
		let base = 1;
		for(let i=0; i<data.length; i++) {
			val[i] = [];
			len[i] = [];
			key[i] = [];
			for(let j=0; j < data[i].length; j++) {
				val[i][j] = 0;
				len[i][j] = 0;
				key[i][j] = -1;
				let c =  data[i].charAt(j);
				if(c == "_") {
					base = 0;
					continue;
				}
				if(c == "^") {
					base = 2;
					continue;
				}
				if(c == " ") {
					continue;
				}
				if(c == "ァ") {
					continue;
				}
				if(c == "＿") {
					len[i][j] = 1;
					continue;
				}
				if(c == "ー") {
					len[i][j] = 1;
					key[i][j] = -2;
					continue;
				}
				for(let k=0; k<this.label[base].length; k++) {
					if(c == this.label[base][k].charAt(0)) {
						val[i][j] = this.value[1][k];
						key[i][j] = ("" + base) + k;
						len[i][j] = 1;
						break;
					}
				}
				base = 1;
			}
			for(let j=key[i].length - 1; j>=0; j--) {
				if(key[i][j] == -2) {
					len[i][j - 1] += len[i][j];
					len[i][j] = 0;
					key[i][j] = -1;
				}
			}
		}
		return {val: val, len:len, key:key };
	},
};
