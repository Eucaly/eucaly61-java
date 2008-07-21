//原來的樣式（非標籤雲），改成下拉條列顯示 （有開關）
// next to do??

/*
那個最新回應實在是太難寫了
難寫到我這個最新文章居然只花兩天就寫好了
幾乎一樣的格式，但是簡單100倍，一天就搞定。
喜歡就拿去玩吧
自用就不用告訴我了
如果修改後發佈，請註明參考來源<--就是我 (LVCHEN)
09/13/2007
*/
/*
tagListSetting.postShow: 每頁顯示文章數
tagListSetting.labelName: 如果有不只一個 Label，請指定 Label 的名稱，預設 Label1
tagListSetting.defaultPost: 預設標籤，預設為最新文章
tagListSetting.loadingImage: 載入時的文字與圖片
tagListSetting.headerButton: 是否顯示標籤按鈕
tagListSetting.tagsShow: 是否預設顯示標籤雲
tagListSetting.lineHeight: 設定標籤雲字間的高度，免得字大的時候疊在一起
*/

// ===== 080719, added by Eucaly61 for Tag Cloud =====
/*
tagListSetting.cloudConv: 將 Blogger 的標籤元素轉為『標籤雲』, 預設 false
tagListSetting.cloudFontSize: 標籤雲 [最小字型,最大字型,文章數最小字型,文章數最大字型]
預設 [10,20,10,15]
tagListSetting.cloudShowNum: 標籤雲 文章數是否顯示, 預設 false
tagListSetting.cloudRGB: 標籤雲顏色, P 須從 100 遞減到 0, ( 程式會配合 .cloudFontSize[0 ~ 1] 依比例調整 )
預設 [ {P:100, R:208, G:0, B:0}, {P:50, R:255, G:204, B:0}, {P:0, R:0, G:64, B:128} ]
*/
/* 不確定以下 標籤雲的 style 是否全部是必須的, ()
// Eucaly61 的版本 20080719
#headerBlock {margin:0 0 5px 0;padding:0 0 5px 0;border-bottom:1px dotted;}
#labelCloud {text-align:center;font-family:arial,sans-serif;}
#labelCloud .label-cloud li{display:inline;background-image:none !important;padding:0 1px;margin:0;vertical-align:baseline !important;border:0 !important;}
#labelCloud ul{list-style-type:none;margin:0 0 0 -2px;padding:0 0 0 0;}
#labelCloud a img{border:0;margin:0 0 0 0;padding:0 0 0 0;}
#labelCloud a{text-decoration:none}
#labelCloud a:hover{text-decoration:underline}
#labelCloud li a{}
#labelCloud .label-cloud {}
// 黑輪的版本 http://allen.ewebmaster.com.tw/2007/04/blogspot.html
#labelCloud {text-align:center;font-family:arial,sans-serif;}
#labelCloud .label-cloud li{display:inline;background-image:none !important;padding:0 5px;margin:0;vertical-align:baseline !important;border:0 !important;}
#labelCloud ul{list-style-type:none;margin:0 auto;padding:0;}
#labelCloud a img{border:0;display:inline;margin:0 0 0 3px;padding:0}
#labelCloud a{text-decoration:none}
#labelCloud a:hover{text-decoration:underline}
#labelCloud li a{}
#labelCloud .label-cloud {}
#labelCloud .label-count {padding-left:0.2em;font-size:9px;color:#000}
#labelCloud .label-cloud li:before{content:"" !important}
*/
// ----- END added code -----

var tagListSetting = {
postShow:5 ,
labelName:'',
defaultPost: '',
loadingImage: '<img src="http://lvchen716.googlepages.com/2-0.gif"/>&nbsp;資料載入中...',
headerButton:true,
tagsShow:false,
lineHeight:24,
dropDown:false,
autoscroll:false,
autohideTag:false,
// ===== 080718, added by Eucaly61 for Tag Cloud =====
cloudConv: false,
cloudFontSize:[10,20,10,15],
cloudShowNum:false,
cloudRGB:[ {P: 100, R :208, G: 0, B: 0}, {P: 50, R: 255, G: 204, B: 0}, {P: 0, R: 0, G: 64, B: 128} ],
// ----- END added code -----
messagesArr:['最新文章','選擇標籤','%tagName% %range%，共有 %totalNum% 篇文章','上一頁','下一頁','一篇文章也沒有耶！<br>會不會是輸入錯誤的標籤啊？']
};
var tagListinner = {
startIndex: 1,
tempStr:'',
blogName:''
};
var tagFunc = {};

tagFunc.addHeaderButton = function ()
{
	var categoryList = jQuery('#'+tagListSetting.labelName);
	var blockInfo = '<div id="headerBlock">';
	var listTableShow = categoryList.find('*:has(ul):eq(0)').find('ul');
	if (tagListSetting.dropDown)
	{
		blockInfo += tagListinner.tempStr + '</div>';
		categoryList.find('.widget-content').prepend(blockInfo);
		listTableShow.remove();
	}
	else
	{
		blockInfo += '<span class = "buttonStyle"><a href="javascript:if(tagListSetting.defaultPost!=&quot;&quot;) tagFunc.nextPage(0,&quot;&quot;)">'+tagListSetting.messagesArr[0]+'</a></span><span class="buttonStyle"><a href = "javascript:void(0)">'+tagListSetting.messagesArr[1]+'</a></span></div>';
		if (!tagListSetting.tagsShow)
			listTableShow.hide().find('li').css({background:'none',lineHeight:tagListSetting.lineHeight+'px'});
		else
			listTableShow.find('li').css({background:'none',lineHeight:tagListSetting.lineHeight+'px'});
		categoryList.find('.widget-content').prepend(blockInfo).end().find('.buttonStyle').css('marginLeft','1em').slice(1,2).click(function(){
			if (listTableShow.is(':visible'))
				listTableShow.fadeOut();
			else
				listTableShow.fadeIn();
    });
	}
};

tagFunc.Util =function(json)
{
	var posts = json.feed.entry;
	var tagPostNum = json.feed.openSearch$totalResults.$t;
	var categoryList = jQuery('#'+tagListSetting.labelName);
	if (tagPostNum != 0)
	{
		var temp = '<ul>';
		if (tagListinner.startIndex+tagListSetting.postShow > tagPostNum)
			var looping = tagPostNum - tagListinner.startIndex+1;
		else
			var looping = tagListSetting.postShow;
		for (var i=0; i < looping ; i++) 
		{
			post = json.feed.entry[i];
			var title=post.title.$t;
			var link=post.link[0].href;
			// 未來應加入預視窗格
			var timestamp=post.published.$t.substr(0,10);
			temp += '<li><a href="'+ link +'">'+ title +'</a> '+ timestamp +'</li>';
		}
		temp+='</ul>';
		categoryList.find('#postsList').html(temp);

		// 老方法，加上頁尾
		function addFooterButton()
		{
			jQuery('#listLoading').remove();
			var listInfo = tagListSetting.messagesArr[2];
			if (tagListSetting.defaultPost == '')
				listInfo = listInfo.replace(/%tagName%/,tagListSetting.messagesArr[0]);
			else
				listInfo = listInfo.replace(/%tagName%/,tagListSetting.defaultPost);
			listInfo = listInfo.replace(/%range%/,tagListinner.startIndex +'~'+ (tagListinner.startIndex+looping-1));
			listInfo = listInfo.replace(/%totalNum%/,tagPostNum);
			listInfo = '<div id="footerInfo">'+listInfo;
			
			var footerButton = '<br>';
			var next = '<a href="javascript:tagFunc.nextPage(1,tagListSetting.defaultPost);">'+tagListSetting.messagesArr[4]+'</a>';
			var previous = '<a href="javascript:tagFunc.nextPage(-1,tagListSetting.defaultPost);">'+tagListSetting.messagesArr[3]+'</a>';
			if (tagListinner.startIndex == 1)
			{
				if (tagListSetting.postShow >= tagPostNum  ) // recent comment may have same problem
					footerButton+= '</div>';
				else
					footerButton+= next + '</div>';
			}
			else if (tagListinner.startIndex+tagListSetting.postShow > tagPostNum)
			{
				footerButton+= previous + '</div>';
			}
			else 
			{
				footerButton += previous + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ next +'</div>';
			}
			jQuery('#postsList').after(listInfo + footerButton);
						
		};
		addFooterButton();
	}
	else
	{
		//如果有人耍寶，就會跑出下面那段話
		jQuery('#postsList').html(tagListSetting.messagesArr[5]);
		jQuery('#listLoading').remove();// add 10/2
	}
};

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



tagFunc.Run = function(tag)
{
	var encodeTag = tagFunc.convertTag(tag);// 幹，轉好久終於轉好了，這下可以用了吧。
		encodeTag = encodeURIComponent(encodeTag); //才怪，如果不轉成 URL 用的 code，照樣掛
	var tagList_script = document.createElement('script');
	var blogLink = 'http://'+ tagListinner.blogName +'/feeds/posts/summary';
	if (tag != '')
		blogLink = blogLink + '/-/' + encodeTag;
	tagList_script.setAttribute('src',blogLink +'/?alt=json-in-script&start-index='+ tagListinner.startIndex +'&max-results='+ tagListSetting.postShow +'&orderby=published&callback=tagFunc.Util');
	tagList_script.setAttribute('type', 'text/javascript');
	tagList_script.setAttribute('id', 'listScript');
	document.documentElement.firstChild.appendChild(tagList_script);
};
//----------- 換頁的子程式，我改寫過了，上下頁跟換標籤都是用這哦 ---------------
// 簡單的說，傳入值 direction 可以等於 -1,0,1，分別是倒退，從頭開始，前進
// tag 就是標籤的名稱嘛
tagFunc.nextPage = function(direction, tag)
{
	jQuery('#listScript').remove(); // I think this is important. If you don't remove the previous loading script, sometimes the browser will crash.
	jQuery('#postsList').next().remove().end().after('<div id="listLoading">'+tagListSetting.loadingImage+'</div>');
	if (direction == 1)
		tagListinner.startIndex += tagListSetting.postShow;
	else if (direction == -1)
		tagListinner.startIndex -= tagListSetting.postShow;
	else 
	{
		tagListinner.startIndex = 1;
		tagListSetting.defaultPost = tag;
	}
	// Determine the action after select a tag dropdown list, autoscroll, autohide, you can only choose one. Action order is drowdown list -> autohide -> autoscroll 
	if (tagListSetting.autohideTag&!tagListSetting.dropDown) // add autohide feature 10/2
		jQuery('#'+tagListSetting.labelName).find('ul:eq(0)').fadeOut();
	else if (tagListSetting.autoscroll&!tagListSetting.dropDown)// add autoscroll feature 10/2 , 
		document.documentElement.scrollTop = document.getElementById('postsList').offsetTop - 16;
	tagFunc.Run(tag);
};

tagFunc.fetchcategory = function()
{
	var categoryList = jQuery('#'+tagListSetting.labelName);
	var dropdownStr = '<option value=""';
	if (tagListSetting.defaultPost == '')
		dropdownStr += ' selected';
	dropdownStr += '>' + tagListSetting.messagesArr[0] + '</option>';
	categoryList.find('ul').after('<div id="postsList"></div>');
	tagListinner.blogName = categoryList.find('li a:eq(0)').attr('href').replace(/http:\/\/(.+)\/search\/label.+$/,'$1');

// ===== 080718, added by Eucaly61 for Tag Cloud =====
  function s(a,b,i,x){
    var m=Math.abs(a-b)/Math.log(x);
    if(a>b){
      var v=a-Math.floor(Math.log(i)*m);
    } else {
      var v=Math.floor(Math.log(i)*m+a);
    }
    return v
  };
  
  function RGB(myP, PRGB) {
  var myR, myG, myB;
  for (var i=0; i< PRGB.length; i++) {
    if (myP >= PRGB[i].P) {
      if (i==0) {
          myR = PRGB[i].R;
          myG = PRGB[i].G;
          myB = PRGB[i].B;
      } else {
          var P0 = myP - PRGB[i].P;
          var P1 = PRGB[i-1].P - myP;
          var deltaP = PRGB[i-1].P - PRGB[i].P;
          myR = Math.floor( (PRGB[i-1].R*P0 + PRGB[i].R*P1) / deltaP );
          myG = Math.floor( (PRGB[i-1].G*P0 + PRGB[i].G*P1) / deltaP );
          myB = Math.floor( (PRGB[i-1].B*P0 + PRGB[i].B*P1) / deltaP );
      }
      return('rgb(' + myR + ',' + myG + ',' + myB + ')');
    }
  }
  return('');
  };
  
if (tagListSetting.cloudConv) {
  var pMin=0, pMax=1;
  categoryList.find('ul').wrap('<div id="labelCloud"></div>');
  categoryList.find('ul').get(0).className = 'label-cloud';
  categoryList.find('li').each(function(index){
    var pNum = Number(jQuery('a~*',this).text().match(/\d+/g).pop());
    if (typeof(pNum)==='number') {
      pMax = Math.max(pNum, pMax);
      if (pMin==0) {
        pMin = Math.max(pNum, 0);
      } else {
        pMin = Math.min(pNum, pMin);
      }
    }
  });
  if (pMax == pMin) { pMax += 1; }
}
// ----- END added code -----

	categoryList.find('li').each(function(index){
		var categoryName = jQuery('a',this).text();
		categoryName = categoryName.replace(/^\s*(\S.+)\s+/,'$1'); // fix the problem occur on 12/16. An extra space and lots of space when fetching the name.
		//var nameFix = categoryName.lastIndexOf('('); // Deal with non-tagcloud format, i.e. original format. Somehow tagcloud change the inner text in the <a> tag
		//(Is this problem still exist?? It may be fixed due to the fix I did on 12/16, I will remove it for a while)
		//if (nameFix>0)
			//categoryName = categoryName.substr(0,nameFix-1);
		if (tagListSetting.dropDown)	{
			dropdownStr += '<option value="'+ categoryName +'"';
			if (categoryName.match(tagFunc.convertTag(tagListSetting.defaultPost))!=null && tagListSetting.defaultPost != '')
				dropdownStr += ' selected';
			// fix loading error 07/16/2008
			dropdownStr +=  '>'+ jQuery(this).text().replace(/^\s*(\S.+\))/,'$1') + '</option>';
			}
		else
			jQuery('a',this).attr('href','javascript:if(tagListSetting.defaultPost!="'+ categoryName +'") tagFunc.nextPage(0,"'+ categoryName +'");');
		
// ===== 080718, added by Eucaly61 for Tag Cloud =====
if (tagListSetting.cloudConv) {
;;; var dbg = '';
  var eNum = jQuery('a~*',this).get(0);
  var eTag = jQuery('a',this).get(0);
  var pNum = Number(jQuery('a~*',this).text().match(/\d+/g).pop());
  var fs0 = Math.min(tagListSetting.cloudFontSize[0], tagListSetting.cloudFontSize[1]);
  var fs1 = Math.max(tagListSetting.cloudFontSize[0], tagListSetting.cloudFontSize[1]);
  fs1 = Math.max(fs0+1,fs1);
  var fs2 = Math.min(tagListSetting.cloudFontSize[2], tagListSetting.cloudFontSize[3]);
  var fs3 = Math.max(tagListSetting.cloudFontSize[2], tagListSetting.cloudFontSize[3]);
  if (typeof(pNum)!=='number') { pNum=1; }
;;; dbg = dbg + '(' + pMin + ',' + pMax + ') ' + pNum;  
//var fs = s(minFontSize,maxFontSize,ts[t]-ta,tz);
  var fs;
  if (!tagListSetting.cloudShowNum) {
    eNum.style.fontSize = 0;
  } else {
  	fs = s(fs2,fs3,pNum-pMin+1,pMax);
    eNum.style.fontSize = fs+'px';
;;; dbg = dbg + ' (Num=' + fs + ')';  
  }
  fs = s(fs0,fs1,pNum-pMin+1,pMax);
  var color = RGB((100.0*(fs-fs0))/(fs1-fs0), tagListSetting.cloudRGB);
;;; dbg = dbg + ' (Font=' + fs + ') ' + color;  
  eTag.style.fontSize = fs+'px';
;;; eTag.title = jQuery(this).text() + dbg;
;;; /*
  eTag.title = jQuery(this).text();
;;; */
  if (color!=='') { 
    eNum.style.color = color;
    eTag.style.color = color;
  }
}
// ----- END added code -----

		});
	if (tagListSetting.dropDown)
		tagListinner.tempStr = '<select onChange="javascript:var getName=this.options[this.selectedIndex].value; if (tagListSetting.defaultPost!= getName) tagFunc.nextPage(0,getName);">' + dropdownStr + '</select>';
	if (tagListSetting.headerButton)
		tagFunc.addHeaderButton();
	tagFunc.Run(tagListSetting.defaultPost);
};

// 最後當然是在 DOM ready 之後才執行囉
jQuery(document).ready(function()
{
;;; tagListSetting.cloudConv = true;
;;; tagListSetting.cloudShowNum = true;

	if (tagListSetting.labelName == '')
		tagListSetting.labelName = 'Label1';
		
	if (document.getElementById(tagListSetting.labelName)!=null)
	{
		tagFunc.fetchcategory();
		}
});