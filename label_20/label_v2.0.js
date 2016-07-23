/*/////////////////////////////////////////////////////////////////
程式名稱：Blogger 標籤選台器 2.0 
程式開發：LVCHEN - http://lvchen.blogspot.com
協同開發：水瓶尤加利 / Eucaly61 - http://eucaly61.blogspot.com/
版權聲明：本程式使用 Cretive Commons 3.0 （創用 CC）著作權宣告，任
		  何人皆展示、重製、散佈本程式，歡迎任何非營利目的修改與衍
		  生作品，惟必須清楚標示程式來源與作者名稱，並附上來源連結。
		  例如：
				Blogger 標籤選台器 2.0  作者：LVCHEN 
				LVCHEN 的美國生活指南 - http://lvchen.blogspot.com
		  本程式禁止任何營利性質的修改，若是得到 LVCHEN 的授權則不
		  在此限。
		  其餘 CC 著作權條款說明請參考：
		  http://creativecommons.org/licenses/by/3.0/deed.zh_TW
		  任何不當使用本程式之行為，LVCHEN 將依法保留法律追訴權。
		  如果對於版權聲明有任何不明白之處，請依以下聯絡方式與 
		  LVCHEN 聯繫
聯絡方式：1. 在 「LVCHEN 的美國生活指南」部落格留言 - http://lvchen.blogspot.com
		  2. E-mail: lvchen.blog@m2k.com.tw
/////////////////////////////////////////////////////////////////*/

/*/////////////////////////////////////////////////////////////////
						***************
						*	更新日誌  *
						***************
1. 不再使用 jQuery，程式模組最佳化，提高執行效能達 90%。
2. 內建標籤雲，增加使用 HSL 顏色分級系統。
3. 使用分頁索引，不會再按下一頁按到手軟
4. 自動紀錄上次讀取的文章標籤與頁數，有效時間為 10 分鐘
5. 如果沒有標籤元素，則會直接顯示最新文章
6. 可決定是否文章標題後顯示日期
7. 相容 IE7,8，Firefox 3.0
/////////////////////////////////////////////////////////////////*/

/*/////////////////////////////////////////////////////////////////
						***************
						*	參數說明  *
						***************
tagListSetting.postShow: 顯示每頁文章數 (number)
tagListSetting.labelName: 指定 Label 網頁元素的名稱 (string)
tagListSetting.defaultPost: 預設顯示的標籤 (string)
tagListSetting.loadingImage: 載入時的文字與圖片 (string)
tagListSetting.headerButton: 是否顯示標籤按鈕 (boolean)
tagListSetting.tagsShow: 是否預設顯示標籤雲 (boolean)
tagListSetting.lineHeight: 設定標籤雲字間的高度，免得字大的時候疊在一起 (number)
tagListSetting.showTimeStamp: 是否顯示文章日期 (boolean)
tagListSetting.upNdownOnly: 是否顯示分頁 (boolean)
tagListSetting.lastTagPage: 是有紀錄上次讀取的文章標籤與頁數 (boolean)
tagListSetting.messagesArr: 自訂顯示訊息 (array, string)
tagListSetting.seperator: 這是特別為了歐美語系做的，可以把最後的 "~" 換掉
tagListSetting.countDisplay: 是否在標籤後顯示文章數 (boolean)
tagListSetting.minColor: 標籤雲起始顏色 (array, number)
tagListSetting.maxColor: 標籤雲結束顏色 (array, number)
tagListSetting.fontSize: 標籤雲字級範圍 (array, number)
tagListSetting.colorHSL: 是否使用 HSL 標籤雲顏色系統
						0: 傳統運算方式, 1: HSL中間色『綠色』, 2: HSL中間色『紫色』
預設值請參考 tagListSetting 變數內的值
/////////////////////////////////////////////////////////////////*/

// 程式開始
// 預設程式參數
var tagListSetting = {
postShow:5 ,
labelName:'Label1',
defaultPost: '',
loadingImage: '資料載入中...',
headerButton:true,
tagsShow:false,
lineHeight:24,
useTagCould:true,
dropDown:false,
autohideTag:true,
showTimeStamp:true,
upNdownOnly:false,
lastTagPage:true,
messagesArr:['最新文章','選擇標籤','%tagName% %range%，共有 %totalNum% 篇文章','上一頁','下一頁','<p>一篇文章也沒有耶！<br>會不會是輸入錯誤的標籤啊？</p>'],
seperator: '~',
countDisplay:true,
minColor: [8, 8, 138], 		// Color setting colorHSL = 0
maxColor: [223, 116, 4],	// Color setting colorHSL = 0
//minColor: [0, 64, 128], 	// Color setting colorHSL = 2
//maxColor: [208, 0, 0],	// Color setting colorHSL = 2
fontSize: [10, 26],
colorHSL: 0
};

// 會使用到的全域變數
var tagListinner = {
startIndex: 1,
pageNum:1,
blogName:''
};
var tagFunc = {};

// ---------------------------------------------------------------
// 這個小程式可以用來尋找 id/class 裡的某個標籤
// id: 要被尋找的元素
// name: 要尋找的標籤名稱
// type: id/class
// ---------------------------------------------------------------
tagFunc.findTag = function(id, name,type)
{
	switch (type)
	{
		case 'id':
			var tags = id.getElementsByTagName('*');
			for (var i = 0 ; i < tags.length ; i++ )
			{
				if (tags[i].id == name)
					return tags[i];
			}
			return null;
		case 'class': // while getAttribute('class') && getElementsByClassName won't work
			var tags = id.getElementsByTagName('*');
			var tagsArr = new Array();
			var idx = 0;
			for (var i = 0 ; i < tags.length ; i++ )
			{
				if (tags[i].className == name)
				{
					tagsArr[idx] = tags[i];
					idx++;
				}
			}
			return tagsArr;
	}

};

// ---------------------------------------------------------------
// Google API json-in-script 的 handler
// 取回的值會在這裡解析並加上相對的功能。
// ---------------------------------------------------------------
tagFunc.Util =function(json)
{
	var tagPostNum = json.feed.openSearch$totalResults.$t;
	if (tagListSetting.labelName != null)
		var getTag = tagFunc.findTag(document.getElementById(tagListSetting.labelName),'postsList','id');
	else
		var getTag = document.getElementById('postsList');
	var titleLinkIdx = 0;
	if (tagListSetting.headerButton && tagListSetting.countDisplay && tagListSetting.dropDown && !tagListSetting.useTagCould)	{ 
		// Dealing with Special conditin. If using drop down list and counts display after tags. Add the total count for the "Total post".
		var rpNum = document.getElementById('headerBlock').getElementsByTagName('option')[0];
		if (rpNum.innerHTML==tagListSetting.messagesArr[0])
			rpNum.innerHTML = rpNum.innerHTML + ' (' + tagPostNum + ')';
	}

	if (tagPostNum != 0) // If articles found...
	{
		var temp = '<ul>';
		if (tagListinner.startIndex+tagListSetting.postShow > tagPostNum)
			var looping = tagPostNum - tagListinner.startIndex+1;
		else
			var looping = tagListSetting.postShow;
		for (var i=0; i < looping ; i++) 
		{
			post = json.feed.entry[i];
			var j = 0;
			while (j < post.link.length && post.link[j].rel!='alternate' ) // we search for the link we want
				j++;
			titleLinkIdx = j;			
			var title=post.title.$t;
			var link=post.link[titleLinkIdx].href;
			if (tagListSetting.showTimeStamp)
			{
				var timestamp=post.published.$t.substr(0,10);
				temp += '<li><a href="'+ link +'">'+ title +'</a><span class="RP_date">'+ timestamp +'</span></li>';
			}
			else
				temp += '<li><a href="'+ link +'">'+ title +'</a></li>';
		}
		temp+='</ul>';
		getTag.innerHTML = temp;
		var object = document.getElementById('listLoading');
		// 老方法，加上頁尾
		var addFooterButton = function()
		{
			if (object != null) // Remove loading message
				object.parentNode.removeChild(object);
			var listInfo = '<span class="footerMsg">' + tagListSetting.messagesArr[2] +'</span>';
			if (tagListSetting.defaultPost == '')
				listInfo = listInfo.replace(/%tagName%/,tagListSetting.messagesArr[0]);
			else
				listInfo = listInfo.replace(/%tagName%/,tagListSetting.defaultPost);
			listInfo = listInfo.replace(/%range%/,tagListinner.startIndex + tagListSetting.seperator + (tagListinner.startIndex+looping-1));
			listInfo = listInfo.replace(/%totalNum%/,tagPostNum);
			var nNode = document.createElement('div');
			nNode.id = 'footerInfo';
			var footerButton = '';
			var number = ''; // string for page number
			if (!tagListSetting.upNdownOnly){ // In this 'if', I create the index number for the current tag
			var crPage  = tagListinner.pageNum; //current page number
			var totalPage = (tagPostNum%tagListSetting.postShow > 0)?Math.floor(tagPostNum/tagListSetting.postShow)+1:tagPostNum/tagListSetting.postShow;
			var showPageRange, endPage;
			if (totalPage <= 7) //why 7? I don't know. It just makes me feet good.
			{
				showPageRange = 1;
				endPage = totalPage;
			}
			else
			{
				if (crPage < ((7+1)/2+1))
					showPageRange = 1;
				else if (crPage > (totalPage -((7+1)/2)))
					showPageRange = totalPage - (7-1);
				else
					showPageRange = crPage - ((7+1)/2-1);
				endPage = showPageRange + 6;
			}
			if (showPageRange == 1) // Create link for first page
			{
				if (crPage == 1)
					number += '<span class="footerMsg">1&nbsp;&nbsp;';
				else 
					number += '<span class="footerMsg"><a href="javascript:tagFunc.goPage(1,tagListSetting.defaultPost);">1</a>&nbsp;&nbsp;';
			}
			else 
				number += '<span class="footerMsg"><a href="javascript:tagFunc.goPage(1,tagListSetting.defaultPost);">1</a>...&nbsp;&nbsp;';
			for (var i = showPageRange+1; i < endPage ; i++)
			{
				if (i == crPage)
					number += i;
				else
					number += '<a href="javascript:tagFunc.goPage('+i+',tagListSetting.defaultPost);">' + i + '</a>';
				number += '&nbsp;&nbsp;';
			}
			if ((showPageRange + 6) >= totalPage)
			{
				if (crPage == totalPage)
					number += totalPage+'&nbsp;&nbsp;</span>';
				else 
					number += '<a href="javascript:tagFunc.goPage('+ totalPage +',tagListSetting.defaultPost);">' + totalPage + '</a>&nbsp;&nbsp;</span>';
			}
			else
				number += '...<a href="javascript:tagFunc.goPage('+ totalPage +',tagListSetting.defaultPost);">' + totalPage + '</a>&nbsp;&nbsp;</span>';
			}
			// next and previous will display regardless of using page index
			var next = '<a class="changePage" href="javascript:tagFunc.goPage(++tagListinner.pageNum,tagListSetting.defaultPost);">'+tagListSetting.messagesArr[4]+'</a>';			
			var previous = '<a class="changePage" href="javascript:tagFunc.goPage(--tagListinner.pageNum,tagListSetting.defaultPost);">'+tagListSetting.messagesArr[3]+'</a>';
			if (tagListinner.startIndex == 1)
			{
				if (tagListSetting.postShow < tagPostNum  )
					footerButton+= '<br\>' + number + '&nbsp;&nbsp;' + next ;
			}
			else if (tagListinner.startIndex+tagListSetting.postShow > tagPostNum)
			{
				footerButton+= '<br\>' + previous+ '&nbsp;&nbsp;' + number;
			}
			else 
			{
				footerButton += '<br\>' +previous + '&nbsp;&nbsp;'+ number +'&nbsp;&nbsp;'+ next;
			}
			object = document.getElementById('postsList');
			nNode.innerHTML = listInfo + footerButton;
			object.parentNode.insertBefore(nNode,object.nextSibling);
		};
		// Almost done, add footer
		addFooterButton(); 
	}
	else
	{
		// Just in case of the wrong tag name
		getTag.innerHTML = tagListSetting.messagesArr[5];
		if (object != null) // Remove loading message
			object.parentNode.removeChild(object);
	}
};


// ---------------------------------------------------------------
// 將 Tag 轉換成 UTF8
// ---------------------------------------------------------------
tagFunc.convertTag = function (tag)
{
//Shit， Google 會把中文的特殊字元轉成UTF-8，我還得自己轉回去
//http://wwwrsphysse.anu.edu.au/~mxk121/javascript/
	function dec2hex(dec) 
	{
		var h = new Array('0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F');
		var hex = '';
		hex += h[Math.floor(dec / 0x1000)]; dec = dec % 0x1000;
		hex += h[Math.floor(dec / 0x100)]; dec = dec % 0x100;
		hex += h[Math.floor(dec / 0x10)]; dec = dec % 0x10;
		hex += h[Math.floor(dec / 0x1)]; dec = dec % 0x1;
		return hex;
	};
//http://wwwrsphysse.anu.edu.au/~mxk121/javascript/
// 這是個很有趣的寫法，我嘗試改變它的變數，但卻失敗了，敗的不明不白
// 還有更簡潔的寫法嗎？
	function html_unic(str) {
		var nc = '';
		var arr,s,c;
		for (var i = 0; i < str.length; i++) 
		{
			s = str.substr(i, 8);
			if (arr = s.match(/^&#[0-9]+;/)) //最神奇的是這裡，arr 變成了數字，之後居然還可以用 arr[0] 當成字串用，誇張的是，這樣轉出來的還是數字。
			{
				c = arr[0].replace(/[&#;]/g, '');
				c = dec2hex(c);
				c = "%u" + c;
				c = c.replace(/^%u00/, "%");
				i += arr[0].length - 1;
			} 
			else 
				c = str.charAt(i);
		nc += c;
		}
		return unescape(nc); // 直接丟 text 回去
	};
	return html_unic(tag);
};

// ---------------------------------------------------------------
// 這是一個取回 json 字串的函式
// tag: 標籤名稱
// ---------------------------------------------------------------
tagFunc.Run = function(tag)
{
	var encodeTag = tagFunc.convertTag(tag);
		encodeTag = encodeURIComponent(encodeTag);
	var tagList_script = document.createElement('script');
	var blogLink = 'http://'+ tagListinner.blogName +'/feeds/posts/summary';
	if (tag != '')
		blogLink = blogLink + '/-/' + encodeTag;
	tagList_script.setAttribute('src',blogLink +'/?alt=json-in-script&start-index='+ tagListinner.startIndex +'&max-results='+ tagListSetting.postShow +'&orderby=published&callback=tagFunc.Util');
	tagList_script.setAttribute('type', 'text/javascript');
	tagList_script.id ='listScript';
	document.documentElement.firstChild.appendChild(tagList_script);
};

/*---------------------------------------------------------------
// 換頁用的函式
// pageNum: 頁數
// tag: 標籤名稱
---------------------------------------------------------------*/
tagFunc.goPage = function(pageNum, tag)
{
	var nodes = document.getElementById('listScript');
	nodes.parentNode.removeChild(nodes);  // I think this is important. If you don't remove the previous loading script, the browser will sometimes crash.
	var nodes = document.getElementById('postsList');
	//nodes.parentNode.removeChild(nodes.nextSibling);
	var nNode = document.createElement('div');
	nNode.id = 'listLoading';
	nNode.innerHTML = tagListSetting.loadingImage;
	nodes.parentNode.replaceChild(nNode, nodes.nextSibling);
	tagListinner.pageNum = pageNum;
	tagListinner.startIndex = tagListSetting.postShow*(tagListinner.pageNum-1)+1;
	tagListSetting.defaultPost = tag;
	// Determine the action after select a tag dropdown list, autoscroll, autohide, you can only choose one. 
	var labelList = document.getElementById(tagListSetting.labelName).getElementsByTagName('ul')[0].getElementsByTagName('li');
	if (tagListSetting.autohideTag && (!tagListSetting.dropDown || tagListSetting.useTagCould) && tagListSetting.labelName != null) // add autohide feature 10/2
		labelList[0].parentNode.style.display = 'none';
	else {	// if no autohide, scroll into view
		if(!tagListSetting.dropDown&&tagListSetting.useTagCould)
			labelList[labelList.length-1].scrollIntoView(true);
	}
	tagFunc.setCookie('cur_pageNumber',pageNum,1000*60*10,'/');  // Set cookies
	if (tagListSetting.defaultPost == '')
		tagFunc.setCookie('cur_tag', '.', 10*60*1000, '/'); // for ie 
	else
		tagFunc.setCookie('cur_tag', tag, 10*60*1000, '/'); // Set  to cur_label , expire time to 10 mins
	tagFunc.Run(tag);
};

/*---------------------------------------------------------------
 // 做標籤雲的函式
 // 會把 Blogger 的標籤列表變成標籤雲 
---------------------------------------------------------------*/
tagFunc.labelCloud = function (){
	var arLabels = new Array();
    var arLabelCounts = new Array();
    var labelMaxCount = labelMinCount = 0;
	var categoryList = document.getElementById(tagListSetting.labelName);
	var lists = categoryList.getElementsByTagName('li');
	lists[0].parentNode.id = 'RP-tagCloud';
	//var categoryName = lists[0].innerHTML.replace(/<(?:.|\s)*?>/g,'');
	//alert(categoryName);

// delicious weighting
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
	
	for (var idx = 0 ; idx < lists.length ; idx++)
	{
        var txt = lists[idx].innerHTML.replace(/<(?:.|\s)*?>/g,''); // innerText is IE only...so this is the only way I know to do it.
        var i = txt.indexOf('(');
        var j = txt.indexOf(')');
        var labelCount = txt.substr(i+1, (j-i-1));
        arLabelCounts[idx] = parseInt(labelCount);
		if (idx ==0) labelMinCount = arLabelCounts[idx];
        if(arLabelCounts[idx] > labelMaxCount)
			labelMaxCount = arLabelCounts[idx];
		else if (arLabelCounts[idx] < labelMinCount)
			labelMinCount = arLabelCounts[idx];
	}
	
	var minFontSize = tagListSetting.fontSize[0];
	var maxFontSize = tagListSetting.fontSize[1];
	var minColor = tagListSetting.minColor;
	var maxColor = tagListSetting.maxColor;
// add for HSL TagCloud		====> by Eucaly61 2009-04
	if (tagListSetting.colorHSL != 0)
	{
		var minH = rgb2H(minColor[0],minColor[1],minColor[2]);
		var maxH = rgb2H(maxColor[0],maxColor[1],maxColor[2]);
		if (tagListSetting.colorHSL == 2) {
			if (minH[0]<maxH[0]) 
				minH[0] += h_scale;
			else
				maxH[0] += h_scale;
		}
	}
	for (var i = 0; i < lists.length; i++)
	{
		var v = s(minFontSize, maxFontSize, arLabelCounts[i], labelMaxCount, labelMinCount);
		if (tagListSetting.colorHSL == 0)
		{			
	        var r = s(minColor[0], maxColor[0], arLabelCounts[i], labelMaxCount, labelMinCount);
	        var g = s(minColor[1], maxColor[1], arLabelCounts[i], labelMaxCount, labelMinCount);
	        var b = s(minColor[2], maxColor[2], arLabelCounts[i], labelMaxCount, labelMinCount);
		} 
		else {
			var newH = interPn((v-minFontSize)/(maxFontSize-minFontSize),minH, maxH);
			var newRGB = H2rgb(newH[0],newH[1],newH[2]);
	        var r = newRGB[0];
	        var g = newRGB[1];
	        var b = newRGB[2];
		}
		var aObj = lists[i].firstChild;  // This is how I remove the unwanted text node and change the innerHTML of A tag
		while (aObj != null)	{
			if(aObj.nodeName == 'A')	{
				aObj.style.color = 'rgb('+r+','+g+','+b+')';
				if (tagListSetting.countDisplay)
					aObj.innerHTML = aObj.innerHTML + '('+arLabelCounts[i]+')';	
			}				
			else if	(/\d+/.test(aObj.nodeValue) || /\d+/.test(aObj.innerHTML))// in this case , the post counts must be attached after labels (sorry my English is bad, hope you understand)
			{
				lists[i].removeChild(aObj);				
				break;
			}				
			aObj = aObj.nextSibling;
		}		
		lists[i].style.fontSize = v+'px';
        lists[i].style.display = 'inline';
		lists[i].style.lineHeight = tagListSetting.lineHeight+'px';
	}
};

/*---------------------------------------------------------------
 // Cookie 在這裡設定，紀錄最後瀏覽頁面與標籤
---------------------------------------------------------------*/
tagFunc.setCookie = function(c_name, value, expireTime, path) {
	var exdate = new Date();
	exdate.setTime(exdate.getTime() + expireTime);
	document.cookie = c_name + "=" + escape(value) + ((expireTime==null) ? '' : ';expires='+exdate.toGMTString()) + ((path==null) ? '' :';path='  + path);
};

/*---------------------------------------------------------------
 // 取得 Cookie 紀錄
---------------------------------------------------------------*/
tagFunc.getCookie = function(c_name)
{
	if (document.cookie.length > 0)
	{
		var c_start = document.cookie.indexOf(c_name + '=');
		if (c_start!=-1)
		{ 
			c_start = c_start + c_name.length + 1; 
			c_end = document.cookie.indexOf(';', c_start);
			if (c_end==-1) c_end=document.cookie.length;
			var cookieValue = document.cookie.substring(c_start,c_end);
			if (cookieValue == '.')
				return '';
			else
				return unescape(cookieValue);
		} 
	}
	return null;
};

/*---------------------------------------------------------------
 // 檢查 Cookie 內容
---------------------------------------------------------------*/
tagFunc.checkCookie = function()
{
	cur_pageNamber = tagFunc.getCookie('cur_pageNumber');
	if (cur_pageNumber!=null && cur_pageNumber!="")
	{
		alert('Now is page:'+ cur_pageNumber +'!');
	}
	else 
	{
		tagFunc.setCookie('cur_pageNumber',tagListinner.pageNum, 10000, '/');
	}
};


/*---------------------------------------------------------------
// 在 DOM ready 之後，會先執行這段程式，有以下事件
// 檢查 Cookie
// 做標籤雲，或是產生下拉式選單
// 然後執行 tagFunc.Run()
// 註：執行的順序為 getReady --> Run --> Util
---------------------------------------------------------------*/

tagFunc.getReady = function()
{
	var object = document.createElement('div');
	object.id = 'postsList';
	if (document.getElementById(tagListSetting.labelName)!=null)
	{
		// Get the name of the category and convert them to a list
		var categoryList = document.getElementById(tagListSetting.labelName);
		var widget = tagFunc.findTag(categoryList,'widget-content','class');
		var lists = categoryList.getElementsByTagName('li');
		var listTableShow = lists[0].parentNode;
		listTableShow.parentNode.insertBefore(object,listTableShow.nextSibling);
		tagListinner.blogName = listTableShow.getElementsByTagName('a')[0].getAttribute('href').replace(/http:\/\/(.+)\/search\/label.+$/,'$1');
		if (tagListSetting.lastTagPage) // if allow cookies, checking cookie
		{
			var cur_pageNumber = tagFunc.getCookie('cur_pageNumber');
			var cur_tag = tagFunc.getCookie('cur_tag');
			if (cur_tag == null)
			{
				if (tagListSetting.defaultPost == '')
					tagFunc.setCookie('cur_tag', '.', 10*60*1000, '/'); // for ie , because empty string will clear the cookie
				else
					tagFunc.setCookie('cur_tag', tagListSetting.defaultPost, 10*60*1000, '/'); // Set  to cur_label , expire time to 10 mins
				tagFunc.setCookie('cur_pageNumber', '1', 10*60*1000, '/'); // Set page to 1, expire time to 10 mins
			}
			else //I am still thinking  if this is a proper behavior.
			{
				tagListinner.pageNum = parseInt(cur_pageNumber);
				tagListSetting.defaultPost = cur_tag; 
			}
		}
		if (tagListSetting.headerButton) // add header
		{
			var blockInfo = document.createElement('div');
			var blockInfoHTML = '';
			blockInfo.id = 'headerBlock';
			if (tagListSetting.dropDown && !tagListSetting.useTagCould) //
			{
				var dropdownStr = '<option value=""';
				if (tagListSetting.defaultPost == '')
					dropdownStr += ' selected';
				dropdownStr += '>' + tagListSetting.messagesArr[0] + '</option>';
				for (var i = 0 ; i < lists.length ; i++)
				{
					var tagName = lists[i].innerHTML.replace(/<(?:.|\s)*?>/g,'');
					var nameOnly = tagName.replace((/\(\d+\)/),'');	
					dropdownStr += '<option value="'+ nameOnly +'"';
					if (tagName.match(tagFunc.convertTag(tagListSetting.defaultPost))!=null && tagListSetting.defaultPost != '')
						dropdownStr += ' selected';
					if (tagListSetting.countDisplay) 
						dropdownStr +=  '>'+ tagName + '</option>';
					else
						dropdownStr +=  '>'+ nameOnly + '</option>';
				}
					dropdownStr = '<select onChange="javascript:var getName=this.options[this.selectedIndex].value; if (tagListSetting.defaultPost!= getName) tagFunc.goPage(1,getName);">' + dropdownStr + '</select>';
					blockInfo.innerHTML = dropdownStr;
					widget[0].insertBefore(blockInfo,widget[0].firstChild);
					listTableShow.parentNode.removeChild(listTableShow);
			}
			else	{
				blockInfoHTML += '<span class = "buttonStyle"><a href="javascript:if(tagListSetting.defaultPost!=&quot;&quot;) tagFunc.goPage(1,&quot;&quot;)">'+tagListSetting.messagesArr[0]+'</a></span><span class="buttonStyle"><a href = "javascript:void(0)">'+tagListSetting.messagesArr[1]+'</a></span>';
				blockInfo.innerHTML = blockInfoHTML;
				widget[0].insertBefore(blockInfo,widget[0].firstChild);
				var setStyle = tagFunc.findTag(categoryList,'buttonStyle','class');
				//setStyle[0].style.marginLeft = '1em';
				setStyle[1].style.marginLeft = '1em';
				setStyle[1].onclick = function()
				{
					if (listTableShow.style.display != 'none')
						listTableShow.style.display = 'none';
					else
						listTableShow.style.display = 'block';
				}		
			}			
		}
		if (!tagListSetting.dropDown)	{ // if using tag cloud, regardless of using header or not
			for (var i = 0 ; i < lists.length ; i++)
			{
				var getAnchor = lists[i].getElementsByTagName('a');
				if (getAnchor[0] == undefined)	{ // this will take care when user browering in the tag mode. ex: in http://blogname.blogspot.com/search/label/labelname
					var tagName = lists[i].innerHTML.replace(/<(?:.|\s)*?>/g,'').replace((/\(\d+\)/),'');
					var tagCount = lists[i].innerHTML.match(/\(\d+\)/);
					tagName = tagName.replace(/^\s+|\s+$/g,'');
					lists[i].innerHTML = '<a href ="javascript:if(tagListSetting.defaultPost!=&#34;'+ tagName +'&#34;) tagFunc.goPage(1,&#34;'+ tagName +'&#34;);" title="' + tagName + ' ' + tagCount +'">' + tagName +'</a> '+ tagCount;
				}
				else	{
					var tagName = getAnchor[0].firstChild.nodeValue;
					tagName = tagName.replace(/^\s+|\s+$/g,''); // fix the problem occurred on 12/16. An extra space and lots of space when fetching the name.
					getAnchor[0].href = 'javascript:if(tagListSetting.defaultPost!="'+ tagName +'") tagFunc.goPage(1,"'+ tagName +'");';
					getAnchor[0].title = tagName + ' '  + lists[i].innerHTML.match(/\(\d+\)/);
				}
				
			}
			
			if (!tagListSetting.tagsShow)
				listTableShow.style.display = 'none';
			if (tagListSetting.useTagCould)
				tagFunc.labelCloud(); //make Tag Cloud
		}
		tagListinner.startIndex = tagListSetting.postShow*(tagListinner.pageNum-1)+1;  // Go to "THE' page
		tagFunc.Run(tagListSetting.defaultPost);
	}
	else
	{
		tagListSetting.labelName = null;
		tagListSetting.headerButton = false;
		tagListSetting.useTagCould = false;
		tagListSetting.dropDown	= false;
		var getScript = document.documentElement.getElementsByTagName('script');
		for (var i = 0 ; i < getScript.length ; i++)
		{
			if (getScript[i].src.match(/label/))
				break;
		}
		getScript[i].parentNode.insertBefore(object,getScript[i].nextSibling);
		tagListinner.blogName = window.location.href.replace(/http:\/\/?((.*?)\/)?((.*)\/)?(.*)?/,'$2');
		tagFunc.Run('');
	}
};

// Loding string after DOM ready. Hopefully, it works well.
//http://www.javascriptkit.com/dhtmltutors/domready.shtml
//http://www.java2s.com/Code/JavaScriptReference/Javascript-Properties/readyState.htm
var alreadyrunflag=0; //flag to indicate whether target function has already been run
if (document.addEventListener) // FF DOM ready loader
	document.addEventListener("DOMContentLoaded", function(){alreadyrunflag=1; tagFunc.getReady();}, false);
else if (document.all && !window.opera){ // IE DOM reaady loader
	document.onreadystatechange=function() {  
      if (document.readyState=="complete") {
        alreadyrunflag=1;
		tagFunc.getReady();
      }
	}; 
}
else if(/Safari/i.test(navigator.userAgent)){ //Test for Safari
  var _timer=setInterval(function(){
  if(/loaded|complete/.test(document.readyState)){
    clearInterval(_timer);
	alreadyrunflag=1;
    tagFunc.getReady(); // call target function
  }}, 10);
}
window.onload=function()
{
	setTimeout("if (!alreadyrunflag) tagFunc.getReady();", 0);
};

// 程式結束