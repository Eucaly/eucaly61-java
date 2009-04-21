// ===== 0904, added by Eucaly61 for HSL demo =====
/*
	0: 傳統運算方式, 1: HSL中間色『綠色』, 2: HSL中間色『紫色』
*/

var HSL01 = { };
//minColor: [8, 8, 138],	// Color setting
//maxColor: [223, 116, 4],  // Color setting
HSL01.minColor = [0, 64, 128];	 // Color setting
//minColor: [0, 1, 2],  // Color setting
HSL01.maxColor = [208, 0, 0];  // Color setting
//minColor: [128, 0, 128],  // Color setting
//minColor: [255, 0, 255],  // Color setting
//maxColor: [254, 0, 255],  // Color setting
//}, a;

HSL01.main01 = function() {
	
// interpolation of RGB or HSL (array)  ====> by Eucaly61 2009-04
	function interPn(myP, D0, D1) {
	  var Q = [0];
	  var L0 = D0.length, L1 = D1.length, Lmin=Math.min(L0,L1);
	  
	  for (var i=0; i< Lmin; i++) {
		Q[i] = D0[i]*(1-myP) + D1[i]*myP;
	  }
	  if (L0>Lmin)
		for (var i=Lmin; i< L0; i++)
		  Q[i] = D0[i];
	  if (L1>Lmin)
		for (var i=Lmin; i< L1; i++)
		  Q[i] = D1[i];
	  return(Q);
	};

//convert rgb to hsl (all values 0..255, except hue 0..359)	 ====> by Eucaly61 2009-04
	var h_scale = 360;

	function rgb2H(rgb) {
		var r = rgb[0], g = rgb[1], b = rgb[2];
		var max = Math.max(r, g, b), min = Math.min(r, g, b);
		var h;

		if(max == min){
			h = d = 0; // achromatic
		}else{
			var d = max - min;
			switch(max){
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}
			h *= (h_scale / 6);
			h = h % h_scale;
		}
		return [h, d, max];
	}

//convert rgb to hsl (all values 0..255, except hue 0..359)  ====> by Eucaly61 2009-04
	function H2rgb(hsv){
		var h = hsv[0], s = hsv[1], v = hsv[2];
		var /*r, g, b,*/ rgb=[];

		if (s==0) {
			r = g = b = v; // achromatic
		} else {
			function hue2rgb(p, q, t) {
				while (t < 0) t += 1;
				while (t > 1) t -= 1;
				if(t < 1/6) return p + (q - p) * 6 * t;
				if(t < 1/2) return q;
				if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
				return p;
			};

/*		  var q = v;
			var p = v-s;*/
			var h1 = h/h_scale;
			for (var i=0; i<3; i++)
				rgb[i] = Math.round(Math.max(Math.min(hue2rgb(v-s, v, h1+(1-i)/3 ), 255), 0));

		}
		return rgb;
	}

// dec2hex, but fixed two-byte output (e.g. 00 ~ ff)
	function Dec2Hex2 (Dec) {
		var hexChars = "0123456789ABCDEF"
		var a = Dec % 16;
		var b = (Dec - a)/16;
		hex = "" + hexChars.charAt(b) + hexChars.charAt(a);
		return hex;
	}

// encode rgb color in hex #rrggbb format
	function encodeRGB(RGB) {
		return '#' + Dec2Hex2(RGB[0]) + Dec2Hex2(RGB[1]) + Dec2Hex2(RGB[2]);
	}

	var jg = [];
	var minColor = [], maxColor = [];
	var inputColor = [];

	function initVar() {
		jg[0] = new jsGraphics("Canvas0");
		jg[1] = new jsGraphics("Canvas1");
		jg[2] = new jsGraphics("Canvas2");

		minColor[0] = HSL01.minColor;
		maxColor[0] = HSL01.maxColor;
		
		inputColor[0] = minColor[0];
		inputColor[1] = maxColor[0];
	}

	HSL01.colorChange = colorChange = function(i, j) {
		var	input0 = document.getElementById("myColor"+i+j)
		var	dom_mycolor = document.getElementById("myColor"+i)
		text0 = input0.value + '';
		value0 = text0 * 1;
		if ((text0.length>0) && (!isNaN(value0)) && (value0>=0)) {
			inputColor[i][j] = value0;
			document.getElementById("ReDraw").disabled = false;
		} else {
			input0.value = inputColor[i][j];
		}
		dom_mycolor.style.background=encodeRGB(inputColor[i]);
		if (Math.max(inputColor[i][0],inputColor[i][1],inputColor[i][2])>160)
			dom_mycolor.style.color='#000000';
		else
			dom_mycolor.style.color='#ffffff';
	}

	HSL01.drawColor = drawColor = function() {
//debugger;
	//  var cnv = document.getElementById("myCanvas");
	//  var jg = new jsGraphics(cnv);
		
		for (var k = 0 ; k < 3 ; k++) {
			jg[k].clear();
			jg[k].paint();
		}
		
		for (var i = 0 ; i < 2 ; i++) {
			for (var j = 0 ; j < 3 ; j++) {
				colorChange(i,j);
			}
		}
		
		minColor[0] = inputColor[0];
		maxColor[0] = inputColor[1];

		minColor[1] = rgb2H(minColor[0]);
		maxColor[1] = rgb2H(maxColor[0]);
		minColor[2] = rgb2H(minColor[0]);
		maxColor[2] = rgb2H(maxColor[0]);
		
		var y_max = 0;
		for (var j = 0 ; j < 3  ; j++) {
			y_max = Math.max(y_max, minColor[0][j], maxColor[0][j]);
		}

		if (minColor[2][0]<maxColor[2][0]) 
			minColor[2][0] += h_scale;
		else
			maxColor[2][0] += h_scale;

		for (var v = 0 ; v <= 100 ; v+=2) {

			var newRGB = [];
			var newColor = [];

			for (var k = 0 ; k < 3  ; k++) {
				newColor[k] = interPn(v/100, minColor[k], maxColor[k]);

			  	if (k == 0)
			  		newRGB[k] = newColor[k];
			  	else
					newRGB[k] = H2rgb(newColor[k]);

				for (var j = 0 ; j < 3  ; j++) {
					var y = newRGB[k][j];
	//			  if (y >=1) {
						var RGB = [0,0,0];
						RGB[j] = (y + 127) /1.5;
						jg[k].setColor(encodeRGB(RGB));
						jg[k].fillEllipse((v+10)*2, 180-y/2, 5, 5);
	//			  }
				}
				jg[k].setColor(encodeRGB(newRGB[k]));
				jg[k].fillRect((v+10)*2, 180-y_max/2 -25, 5, 15);
//				jg[k].paint();
			}
		}
		for (var k = 0 ; k < 3 ; k++) {
			jg[k].paint();
		}
		document.getElementById("ReDraw").disabled=true;
	
	}
   
   initVar();
   drawColor();
//  document.getElementById("myColor00");
};

// adopted from LVCHEN label20 (ver 090316)
// Loding string after DOM ready. Hopefully it works well.
//http://www.javascriptkit.com/dhtmltutors/domready.shtml
//http://www.java2s.com/Code/JavaScriptReference/Javascript-Properties/readyState.htm
var rps_alreadyrunflag=0; //flag to indicate whether target function has already been run
if (document.addEventListener) // FF DOM ready loader
	document.addEventListener("DOMContentLoaded", function(){rps_alreadyrunflag=1; /*tagFunc.getReady();*/ HSL01.main01();}, false);
else if (document.all && !window.opera){ // IE DOM reaady loader
	document.onreadystatechange=function() {  
	  if (document.readyState=="complete") {
		rps_alreadyrunflag=1;
//	  tagFunc.getReady();
HSL01.main01();
	  }
	}; 
}
else if(/Safari/i.test(navigator.userAgent)){ //Test for Safari
  var _timer=setInterval(function(){
  if(/loaded|complete/.test(document.readyState)){
	clearInterval(_timer);
	rps_alreadyrunflag=1;
//	tagFunc.getReady(); // call target function
HSL01.main01();
  }}, 10);
}
window.onload=function()
{
	setTimeout("if (!rps_alreadyrunflag) HSL01.main01();", 0);
};
