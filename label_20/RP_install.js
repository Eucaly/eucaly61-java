function getValue(name)	{
	return eval('document.makeWidget.'+ name +'.value');
};
function uncheckBox (name,option){
	eval('var nameTag = document.makeWidget.'+name);
	
	if (option)
		jQuery(nameTag).removeAttr('checked'); 
	else 
		jQuery(nameTag).attr('checked',true);
};
function replaceWords(string){
	string = string.replace(/</g,'\<');
	string = string.replace(/>/g,'\>');
	string = string.replace(/"/g,'\"');
	return string;
};
function disableInput (name,option){
	eval('var nameTag = document.makeWidget.'+name);
	if (option)
		jQuery(nameTag).removeAttr('disabled'); 
	else 
		jQuery(nameTag).attr('disabled',true);
};
function buttonText(){
	var buttonN = document.makeWidget.jumpMsgT;
	if (jQuery(buttonN).next().is('button'))
	{
		var buttonV = jQuery(buttonN).next().text();
		jQuery(buttonN).next().remove().end().after('<input style="width:50px;" name="jumpMsgB" type="text" onblur="previewEasy(5);buttonText();" value="'+buttonV+'" />');
		setTimeout('document.makeWidget.jumpMsgB.focus()',500);
	}
	else
	{
		var buttonV = jQuery(buttonN).next().val();
		
		jQuery(buttonN).next().remove().end().after('<button style="width:50px;" name="jumpMsgB" onclick="buttonText();">'+buttonV+'</button>');
	}		
};
function timeoutDisable(){
	var indexO = jQuery("#widgetMaking").find("input[name='startCSS']");
	var index = jQuery('#widgetMaking input').index(indexO) + 1;
	if (jQuery('#divrc').next().is('#showfooterButton)')){ //if the widget footer showup, it means loading is done.
		jQuery('#widgetMaking input:lt('+ index +'),#widgetMaking select,#widgetMaking button').removeAttr('disabled');
		disableInput('noTitleMsg',false);
		return
	}
	else if (jQuery('#divrc p').length > 0 && jQuery('#divrc li').length == 0)	{
		jQuery('#widgetMaking input:lt('+ index +'),#widgetMaking select,#widgetMaking button').removeAttr('disabled'); 
		disableInput('noTitleMsg',false);
		return
	}
	else 
		setTimeout('timeoutDisable()',500);
};
// ---- This function read all the parameters for future running ---

function toggleShowCode(){
	var codeShow = jQuery('#previewCode').is(':hidden');
	if (codeShow){
		jQuery('#codeButton').text('隱藏程式碼');
		jQuery('#previewEasy').hide();
		jQuery('#previewCode').show();
	}
	else{
		jQuery('#codeButton').text('顯示程式碼');
		jQuery('#previewCode').hide();
		jQuery('#previewEasy').show();
	}
};
function previewEasy(which){

	switch(which){
	case 0: // Get labels
		var blogName = $('#blogNameInput').val();
			if (blogName.search(/http:\/\//)!=-1)
				blogName = blogName.replace(/http:\/\/(.*)/i,'$1');
			blogName = blogName.replace(/\//gi,'');
		if (blogName.search(/blogspot.com/i)!=-1)
		{
			var scriptID = document.getElementById('jsonPosts'); // remove existing json call
			if (scriptID != undefined)
				document.documentElement.firstChild.removeChild(scriptID);
			var y_script = document.createElement('script');
			var callbacksrc = 'http://' + blogName + '/feeds/posts/summary?alt=json-in-script&callback=fetchIDs&max-results=1';
			y_script.setAttribute('src',callbacksrc);
			y_script.setAttribute('id', 'jsonPosts');
			y_script.setAttribute('type', 'text/javascript');
			document.documentElement.firstChild.appendChild(y_script);
		}
		else
		{
			$('#blogNameInput').val('請先輸入部落格網址');
		}
	break;
	case 1: //number of post
		var checkValue = parseInt(getValue('postNum'));
		if (checkValue <= 0 | isNaN(getValue('postNum')))
			document.makeWidget.postNum.value = 1;
		if (tagListSetting.postShow != checkValue)		{
			jQuery('#Label1').html(tempListForRecovery);
			tagListSetting.postShow = checkValue;
			tagFunc.getReady();
		}
		break;
	case 2: //Label widget
		var labelValue = document.makeWidget.labelName.value;
		tagListSetting.labelName = 'Label'+ labelValue;
	break;
	case 3: // set default category
		var category = jQuery('#categories').val();
		if (jQuery('#categories option:eq(0)').is(':selected'))
			tagListSetting.defaultPost = '';
		else
		tagListSetting.defaultPost = category;
	break;
	case 4: //using cookie?
		if(document.makeWidget.cookie.checked) 
			tagListSetting.lastTagPage =true; 
		else 
			tagListSetting.lastTagPage =false;
	break;
	case 5: //Show header?
		if (document.makeWidget.headerButton.checked) 	{
			tagListSetting.headerButton = true;
			jQuery('#table2 tr:has(input[name="tagShow"])').show();
			jQuery('#table2 tr:has(input[name="autoHide"])').show();
			jQuery('#table2 tr:has(input[name="countDisplay"])').show();
			jQuery('#table2 tr:has(input[name="lineHeight"])').show();
			jQuery('#table2 tr:has(input[name="fontSizes"])').show();
			jQuery('#table2 tr:has(input[name="headerButton1"])').show();
			jQuery('#table2 tr:has(select[name="colorSystem"])').show();
			jQuery('#table2 tr:has("#colorBar")').show();
			jQuery('#table2 tr:has(input[name="effect"])').eq(1).show();
			jQuery('#headerBlock').show(); 
		}
		else {
			tagListSetting.headerButton = false;
			//tagListSetting.autohideTag = false;
			//uncheckBox('autoHide', true);
			if (!document.makeWidget.effect[0].checked)	{
			jQuery('#table2 tr:has(input[name="tagShow"])').hide();
			jQuery('#table2 tr:has(input[name="autoHide"])').hide();
			jQuery('#table2 tr:has(input[name="countDisplay"])').hide();
			jQuery('#table2 tr:has(input[name="lineHeight"])').hide();
			jQuery('#table2 tr:has(input[name="fontSizes"])').hide();
			jQuery('#table2 tr:has(input[name="headerButton1"])').hide();
			jQuery('#table2 tr:has(select[name="colorSystem"])').hide();
			jQuery('#table2 tr:has("#colorBar")').hide();
			}
			jQuery('#table2 tr:has(input[name="effect"])').eq(1).hide();
			jQuery('#headerBlock').hide();
		}
		if (jQuery('#headerBlock').length==0)	{
			jQuery('#Label1 .widget-content').html(tempListForRecovery); 
			tagFunc.getReady();
		}
	break;
	case 6: //show tag by default
		if (jQuery('#Label1 ul').length>1)	{
			if (document.makeWidget.tagShow.checked) {
				tagListSetting.tagsShow = true;
				jQuery('#Label1 ul:eq(0)').show();
			}
			else	{
				tagListSetting.tagsShow = false;
				jQuery('#Label1 ul:eq(0)').hide();
			}
		}
	break;
	case 7: // use tagcloud
		jQuery('#table2 tr:has(input[name="tagShow"])').show();
		jQuery('#table2 tr:has(input[name="autoHide"])').show();
		jQuery('#table2 tr:has(input[name="lineHeight"])').show();
		jQuery('#table2 tr:has(input[name="fontSizes"])').show();
		jQuery('#table2 input[name="headerButton2"]').show();
		jQuery('#table2 tr:has(select[name="colorSystem"])').show();
		jQuery('#table2 tr:has("#colorBar")').show();
		jQuery('#Label1 .widget-content').html(tempListForRecovery); 
		tagListSetting.useTagCould = true; 
		tagListSetting.dropDown = false; 
		tagFunc.getReady();
		
	break;
	case 8: // use drop down box
		jQuery('#table2 tr:has(input[name="tagShow"])').hide();
		jQuery('#table2 tr:has(input[name="autoHide"])').hide();
		jQuery('#table2 tr:has(input[name="lineHeight"])').hide();
		jQuery('#table2 tr:has(input[name="fontSizes"])').hide();
		jQuery('#table2 input[name="headerButton2"]').hide();
		jQuery('#table2 tr:has(select[name="colorSystem"])').hide();
		jQuery('#table2 tr:has("#colorBar")').hide();
		jQuery('#Label1 .widget-content').html(tempListForRecovery); 
		tagListSetting.useTagCould = false;
		tagListSetting.dropDown = true;
		tagFunc.getReady();
	break;
	case 9: // auto hide tag
		if (document.makeWidget.autoHide.checked) 
			tagListSetting.autohideTag = true;
		else 
			tagListSetting.autohideTag = false;	
	break;
	case 10: //display post count
		if (document.makeWidget.countDisplay.checked)
			tagListSetting.countDisplay = true;
		else
			tagListSetting.countDisplay = false;
		jQuery('#Label1 .widget-content').html(tempListForRecovery); 
		tagFunc.getReady();
	break;	
	case 11: //tag line height
		var value =  parseInt(getValue('lineHeight'));
		if (tagListSetting.lineHeight != value) {
				tagListSetting.lineHeight = value;
			if (tagListSetting.headerButton && tagListSetting.useTagCould)
				jQuery('#RP-tagCloud li').css('line-height',value+'px');
		}
	break;		
	case 12: //
		var value = parseInt(getValue('fontSizes'));
		if (tagListSetting.fontSize[0] != value) {
			tagListSetting.fontSize[0] = value;
		jQuery('#Label1 .widget-content').html(tempListForRecovery); 
		tagFunc.getReady();
		}
		
	break;	
	case 13: //
		var value = parseInt(getValue('fontSizel'));
		if (tagListSetting.fontSize[1] != value)	{
			tagListSetting.fontSize[1] = value;
		jQuery('#Label1 .widget-content').html(tempListForRecovery); 
		tagFunc.getReady();
		}
	break;	
	case 14: // 
		var value = getValue('headerButton1');
		if (tagListSetting.messagesArr[0] != value)	{
			tagListSetting.messagesArr[0] = value;
			jQuery('#headerBlock a:eq(0)').text(value);
		}
	break;
	case 15: // 
		var value = getValue('headerButton2');
		if (tagListSetting.messagesArr[1] != value)	{
			tagListSetting.messagesArr[1] = value;
			jQuery('#headerBlock a:eq(1)').text(value);
		}
	break;
	case 16: //
		var value = getValue('loadingMsg');
		if (tagListSetting.loadingImage != value)
			tagListSetting.loadingImage = value;
	break;
	case 17: //
		var value = getValue('prevPage');
		if (tagListSetting.messagesArr[3] != value)	{
			tagListSetting.messagesArr[3] = value;
			jQuery('#footerInfo .changePage:eq(0)').text(value);
		}	
	break;
	case 18: // 
		var value = getValue('nextPage');
		if (tagListSetting.messagesArr[4] != value)	{
			tagListSetting.messagesArr[4] = value;
			jQuery('#footerInfo .changePage:eq(1)').text(value);
		}	
	break;
	case 19: //
		var value = getValue('footerMsg');
		if (tagListSetting.messagesArr[2] != value)	{
			tagListSetting.messagesArr[2] = value;
		jQuery('#Label1 .widget-content').html(tempListForRecovery); 
		tagFunc.getReady();
		}	

	break;
	case 20:
		if(document.makeWidget.showDate.checked)		{
			jQuery('.RP_date').show();
			tagListSetting.showTimeStamp = true;
		}
		else	{
			jQuery('.RP_date').hide();
			tagListSetting.showTimeStamp = false;
		}
	break;
	case 21:
		var value = getValue('nothing');
		if (tagListSetting.messagesArr[5] != value)
			tagListSetting.messagesArr[5] = value;		
	break;
	case 22:
		if (document.makeWidget.startCSS.checked)	{
			jQuery('#table3 input:gt(0), #table3 select').attr('disabled',false);
		}
		else{
			jQuery('#table3 input:gt(0), #table3 select').attr('disabled',true);
		}
	break;
	case 23:
		if (document.makeWidget.header_a_button.checked)	{
			var cssObj1 = 
			{
				'margin': '1px',
				'padding': '2px',
				'background-color': '#eee',
				'border-style': 'solid',
				'border-width': '2px 1px 1px 2px',
				'border-color': '#000000 #C0C0C0 #C0C0C0 #000000'
			};
			var cssObj2 = 
			{
				'margin': '1px',
				'padding': '2px',
				'background-color': '#fff',
				'border-style': 'solid',
				'border-width': '1px 2px 2px 1px',
				'border-color': '#C0C0C0 #000000 #000000 #C0C0C0',
				'text-decoration': 'none'
			};

		}
		else	{
			var cssObj1 = 
			{
				'margin': '',
				'padding': '',
				'background-color': '',
				'border-style': '',
				'border-width': '',
				'border-color': ''
			};
			var cssObj2 = 
			{
				'margin': '',
				'padding': '',
				'background-color': '',
				'border-style': '',
				'border-width': '',
				'border-color': '',
				'text-decoration': ''
			};

		}
		jQuery('#headerBlock .buttonStyle a').css(cssObj2).mousedown(function(){
			jQuery(this).css(cssObj1);
		}).mouseup(function(){
			jQuery(this).css(cssObj2);
		});		
	break;	
	case 24:
		if(document.makeWidget.tagCloudLine.checked)
			jQuery('#Label1 #RP-tagCloud li a').css('text-decoration','none');
		else
			jQuery('#Label1 #RP-tagCloud li a').css('text-decoration','');
	break;
	case 25:
		var value = getValue('CSS_footer_right');
		if(value == 'center')
			jQuery('#footerInfo').css('text-align','center');
		else if (value == 'right')
			jQuery('#footerInfo').css('text-align','right');
		else if (value == 'left')
			jQuery('#footerInfo').css('text-align','left');
	case 26:
	if(document.makeWidget.pageNumber.checked)	{
		tagListSetting.upNdownOnly = false;
		if (jQuery('#Label1 #footerInfo .footerMsg').length > 1)
			jQuery('#Label1 #footerInfo .footerMsg:eq(1)').show();
		else	{
			jQuery('#Label1 .widget-content').html(tempListForRecovery); 
			tagFunc.getReady();
		}
	}
	else	{
		tagListSetting.upNdownOnly = true;
		if (jQuery('#Label1 #footerInfo .footerMsg').length > 1)
			jQuery('#Label1 #footerInfo .footerMsg:eq(1)').hide();
		else	{
			jQuery('#Label1 .widget-content').html(tempListForRecovery); 
			tagFunc.getReady();
		}
	}
	break;
	case 27:
		jQuery('#Label1 .RP_date').css('margin-left',parseInt(getValue('datePost'))+'px');
	break;	
	case 28:
		var value = getValue('header_post');
		if(value == 'center')
			jQuery('#headerBlock').css('text-align','center');
		else if (value == 'right')
			jQuery('#headerBlock').css('text-align','right');
		else if (value == 'left')
			jQuery('#headerBlock').css('text-align','left');
	break;
	case 29:
		var value = getValue('colorSystem');
		tagListSetting.colorHSL = parseInt(value);
		colorBar();
	break;
	case 30:
		var value = getValue('seperator');
		var footerElem = jQuery('#footerInfo .footerMsg:eq(0)');
		var string = footerElem.text();
		var stringReg1 = '\\d+'+tagListSetting.seperator+'\\d+';
		var stringReg2 = tagListSetting.seperator;
		var regObj1 = new RegExp(stringReg1);
		var regObj2 = new RegExp(stringReg2);
		var newString = string.match(regObj1);
		newString = newString[0];
		newString = newString.replace(regObj2,value);
		string = string.replace(regObj1,newString);
		footerElem.text(string);
		tagListSetting.seperator = value;
	break;
	
	};
	saveValue();
};

function saveValue()	{
var settingString = "\<script type='text/javascript' src='http://lvchen-recentcomments.googlecode.com/svn/trunk/Advanced_Label/adv_Label2.0/label_v2.0_pack.js'\>\<\/script\>\n";
 	settingString +="\<script type='text/javascript'\>\n";
	settingString +="tagListSetting.postShow = "  		+	tagListSetting.postShow			+	";\n";
	settingString +="tagListSetting.labelName = '"  		+ 	tagListSetting.labelName 		+	"';\n";
	if (jQuery('#categories option:eq(0)').attr('selected') || jQuery('#categories option:eq(0)').attr('selected')== undefined)
		settingString +="tagListSetting.defaultPost = '';\n";
	else 
		settingString +="tagListSetting.defaultPost = '" 	+ 	jQuery('#categories').val()		+	"';\n";
	settingString +="tagListSetting.headerButton = " 	+ 	tagListSetting.headerButton 	+	";\n";
	settingString +="tagListSetting.useTagCould= " 		+ 	tagListSetting.useTagCould 		+	";\n";
	settingString +="tagListSetting.tagsShow= " 		+ 	tagListSetting.tagsShow 		+	";\n";
	settingString +="tagListSetting.dropDown= "  		+ 	tagListSetting.dropDown 		+	";\n";
	settingString +="tagListSetting.autohideTag = " 		+ 	tagListSetting.autohideTag 		+	";\n";
	settingString +="tagListSetting.showTimeStamp = "  	+ 	tagListSetting.showTimeStamp 	+	";\n";
	settingString +="tagListSetting.upNdownOnly = " 	+ 	tagListSetting.upNdownOnly 		+	";\n";
	settingString +="tagListSetting.lastTagPage = " 		+ 	tagListSetting.lastTagPage 		+	";\n";
	settingString +="tagListSetting.countDisplay = " 		+ 	tagListSetting.countDisplay		+	";\n";
	settingString +="tagListSetting.minColor= ["		+ 	tagListSetting.minColor[0] 	+	"," 
												+	tagListSetting.minColor[1]	+	"," 
												+	tagListSetting.minColor[2]	+	"];\n";
	settingString +="tagListSetting.maxColor= ["		+ 	tagListSetting.maxColor[0] 	+	"," 
												+	tagListSetting.maxColor[1]	+	"," 
												+	tagListSetting.maxColor[2]	+	"];\n";
	settingString +="tagListSetting.fontSize= ["			+ 	tagListSetting.fontSize[0] 	+	"," 
												+	tagListSetting.fontSize[1]	+	"];\n";
	settingString +="tagListSetting.messagesArr= ['"		+ 	replaceWords(tagListSetting.messagesArr[0]) +	"','" 
												+	replaceWords(tagListSetting.messagesArr[1])	+	"','" 
												+	replaceWords(tagListSetting.messagesArr[2])	+	"','" 
												+	replaceWords(tagListSetting.messagesArr[3])	+	"','" 
												+	replaceWords(tagListSetting.messagesArr[4])	+	"','" 
												+	replaceWords(tagListSetting.messagesArr[5])	+	"'];\n";
	settingString +="tagListSetting.seperator = '" 		+ 	replaceWords(tagListSetting.seperator) 	+	"';\n";
	settingString +="tagListSetting.loadingImage = '" 	+ 	replaceWords(tagListSetting.loadingImage) 	+	"';\n";
	settingString +="tagListSetting.colorHSL = " + 	tagListSetting.colorHSL 	+	";\n";
	settingString +="\<\/script\>\n";

 	if (document.makeWidget.startCSS.checked){	
		var styleSetting;
		styleSetting = "\<style\>\n";
		if (document.makeWidget.header_a_button.checked)	{
			var cssObj1 = '{margin:1px;padding:2px;background-color:#eee;border-style:solid;border-width:2px 1px 1px 2px;border-color:#000000 #C0C0C0 #C0C0C0 #000000;}';
			var cssObj2 = '{margin:1px;padding:2px;background-color:#fff;border-style:solid;border-width:1px 2px 2px 1px;border-color:#C0C0C0 #000000 #000000 #C0C0C0;text-decoration:none;}';
		styleSetting += "#headerBlock .buttonStyle a"+ cssObj2 +"\n";
		styleSetting += "#headerBlock .buttonStyle a:active"+ cssObj1 +"\n";
		}
		if (getValue('header_post') == 'center')
			styleSetting += "#headerBlock{text-align:center;}\n";
		else if (getValue('header_post') == 'right')
			styleSetting += "#headerBlock{text-align:right;}\n";
		if (document.makeWidget.tagCloudLine.checked)
			styleSetting += "#RP-tagCloud li a {text-decoration: none;}\n";
		if (getValue('datePost') != '0')
			styleSetting += "#postsList .RP_date {margin-left:"+ getValue('datePost') +"px;}\n";
		if (getValue('CSS_footer_right') == 'center')
			styleSetting += "#footerInfo{text-align:center;}\n";
		else if (getValue('CSS_footer_right') == 'right')
			styleSetting += "#footerInfo{text-align:right;}\n";
		styleSetting += "\<\/style\>\n";
		settingString = styleSetting + settingString;
	}
	jQuery('#previewCode textarea').val(settingString);
	jQuery('#mywidget_content').val(settingString);	
};

function fetchIDs(json){
	var blogID = json.feed.id.$t.match(/\d*$/);
	var userID = json.feed.author[0].uri.$t.match(/\d*$/);
	//user:16583076107196846164
	//blog:4663215299438594757
	var scriptID = document.getElementById('jsonPosts'); // remove existing json call
	if (scriptID != undefined)
		document.documentElement.firstChild.removeChild(scriptID);
	var y_script = document.createElement('script');
	//http://www.blogger.com/feeds/16583076107196846164/blogs/4663215299438594757
	var callbacksrc = 'http://www.blogger.com/feeds/' + userID + '/blogs/' + blogID + '?alt=json-in-script&callback=fetchCats';
	y_script.setAttribute('src',callbacksrc);
	y_script.setAttribute('id', 'jsonPosts');
	y_script.setAttribute('type', 'text/javascript');
	document.documentElement.firstChild.appendChild(y_script);
};

function fetchCats(json){
	var cats = json.entry.category;
	var string = '<option>最新文章</option>';
	for (var i = 0 ; i < cats.length ; i++)	{
		string += '<option>'+ cats[i].term +'</option>';
	}
	jQuery('#categories').html(string).attr('disabled',false).next().remove();	
};

function loadScript(){
	var loadingScript = document.getElementById('RP_script');
	if (loadingScript != null)
		loadingScript.parentNode.removeChild(loadingScript);
	loadingScript = document.createElement('script');
	loadingScript.setAttribute('src','label_v2.0_pack.js');
	loadingScript.type ='text/javascript';
	loadingScript.id = 'RP_script';
	document.documentElement.firstChild.appendChild(loadingScript);
	runFunc = setInterval('repeatFunc()',300);
};

function repeatFunc()	{
	if('function' == typeof window.tagFunc.getReady)	{
		tagListSetting.colorHSL = 0;
		tagListSetting.minColor= [8, 8, 138]; 	// Color setting
		tagListSetting.maxColor= [223, 116, 4];	// Color setting
		tagListSetting.fontSize= [10, 26];
		tagListSetting.seperator = '~';
		tagListSetting.loadingImage = '<img src="http://farm4.static.flickr.com/3050/2767795469_09fbcce6fa_o.gif"/>&nbsp;載入中.....';
		jQuery('#main').show().next().css('float','right');
		saveValue();
		tagFunc.getReady();	
		clearInterval(runFunc);
	}
};
		
function colorBar(){
	function s(a,b,i,x,y){
		if (x!=y)	i = Math.floor((i/x)*(x-y+1));
		else		i = 1;
		if (i == 0) i = 1;
	    if(a>b){ var m=(a-b)/Math.log(x),v=a-Math.floor(Math.log(i)*m); }
	    else{ var m=(b-a)/Math.log(x),v=Math.floor(Math.log(i)*m+a);}
	    return v;
	}
	// interpolation of RGB or HSL (array)	====> by Eucaly61 2009-04
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
	}

//convert rgb to hsl (all values 0..255, except hue 0..359)		====> by Eucaly61 2009-04
	var h_scale = 360;

	function rgb2H(r, g, b) {
	    var max = Math.max(r, g, b), min = Math.min(r, g, b);
	    var h,d;
	    if(max == min){
	        h = d = 0; // achromatic
	    }else{
	        var d = max - min;
	        // switch(max){
	            // case r: h = (g - b) / d + (g < b ? 6 : 0); break;
	            // case g: h = (b - r) / d + 2; break;
	            // case b: h = (r - g) / d + 4; break;
	        // }
			if (max == r)
	            h = (g - b) / d + (g < b ? 6 : 0);
			else if (max == g)
	            h = (b - r) / d + 2;
			else if (max == b)
	            h = (r - g) / d + 4;			
	        h *= (h_scale / 6);
	    }
	    return [h, d, max];
	}

//convert rgb to hsl (all values 0..255, except hue 0..359)		====> by Eucaly61 2009-04
	function H2rgb(h, s, l){
	    var r, g, b;

	    if(s==0){
	        r = g = b = l; // achromatic
	    }else{
	        function hue2rgb(p, q, t){
	            while (t < 0) t += 1;
	            while (t > 1) t -= 1;
	            if(t < 1/6) return p + (q - p) * 6 * t;
	            if(t < 1/2) return q;
	            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
	            return p;
	        };

	        var q = l;
	        var p = l-s;
	        var h1 = h/h_scale;            
	        r = Math.round(Math.max(Math.min(hue2rgb(p, q, h1 + 1/3), 255), 0));
	        g = Math.round(Math.max(Math.min(hue2rgb(p, q, h1), 255), 0));
	        b = Math.round(Math.max(Math.min(hue2rgb(p, q, h1 - 1/3), 255), 0));
	    }
	    return [r, g, b];
	}
	
	var colorBar = document.getElementById('colorBar');
	colorBar.innerHTML = '';
	var min = parseInt(getValue('fontSizes'));
	var max = parseInt(getValue('fontSizel'));
	var minc = jQuery('#color1').css('backgroundColor');
	var maxc = jQuery('#color2').css('backgroundColor');
	
	if (minc.search(/#/)!=-1)
		minc = [parseInt(minc.substring(1,3),16), parseInt(minc.substring(3,5),16),parseInt(minc.substring(5),16)];
	else	{
		var minc_t = minc.match(/(\d+)/g);
		minc = [parseInt(minc_t[0]), parseInt(minc_t[1]),parseInt(minc_t[2])];
	}
	if (maxc.search(/#/)!=-1)
		maxc = [parseInt(maxc.substring(1,3),16), parseInt(maxc.substring(3,5),16),parseInt(maxc.substring(5),16)];
	else	{
		var maxc_t = maxc.match(/(\d+)/g);
		maxc = [parseInt(maxc_t[0]), parseInt(maxc_t[1]),parseInt(maxc_t[2])];
	}
	var total = max-min+1;
	if (typeof tagListSetting != 'undefined' && tagListSetting.colorHSL != 0)
	{
		var minH = rgb2H(minc[0],minc[1],minc[2]);
		var maxH = rgb2H(maxc[0],maxc[1],maxc[2]);
		if (tagListSetting.colorHSL == 2) {
			if (minH[0]<maxH[0]) 
				minH[0] += h_scale;
			else
				maxH[0] += h_scale;
		}
	}		
	for (var i = 0 ; i < total ; i++)	{
		if (typeof tagListSetting != 'undefined' && tagListSetting.colorHSL != 0)	{
			var newH = interPn(i/(max-min),minH, maxH);
			var newRGB = H2rgb(newH[0],newH[1],newH[2]);
	        var r = newRGB[0];
	        var g = newRGB[1];
	        var b = newRGB[2];
		}
		else	{
			var r = s(parseInt(minc[0]), parseInt(maxc[0]), i*2+1, max, min);
			var g = s(parseInt(minc[1]), parseInt(maxc[1]), i*2+1, max, min);
			var b = s(parseInt(minc[2]), parseInt(maxc[2]), i*2+1, max, min);
		}
		var newNode = document.createElement('div');
		newNode.innerHTML = '&nbsp;';
		newNode.style.display = 'inline';
		newNode.style.backgroundColor = 'rgb('+r+','+g+','+b+')';
		colorBar.appendChild(newNode);
	}
	if (typeof tagListSetting != 'undefined')	{
		if (tagListSetting.minColor != minc)
			tagListSetting.minColor = minc;
		if (tagListSetting.maxColor != maxc)
			tagListSetting.maxColor = maxc;
		if (jQuery('#RP-tagCloud').length)
			jQuery('#Label1 .widget-content').html(tempListForRecovery); 
			tagFunc.getReady();
	}
};
