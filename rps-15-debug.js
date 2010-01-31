// ==== Related Posts Selector 1.5 cooking, by Eucaly61, 2009-04
// ==== Original version rps 1.0
// ==== http://eucaly61.blogspot.com/2008/07/rps-10-beta.html

// 080718 OK, Pack with http://javascriptcompressor.com/ (Base62)
// 080718 OK, lines begin with ;;; will be ingorned after pack
// 090428 光靠『變數代換』就從 12K => 10,393 (06e) => 9844 => 9523 (06i)

/* ==== Reversion History ====
090415-2) 標籤顏色 HSL色系	=> 090415 almost done (adopt from my modification on "advanced tag cloud 2.0")
090428 (function(){})() for semi-local variables
*/
/* ==== Roadmap ====

** 大致完成, 但仍需測試, 或調整輸出格式及使用介面
0807 # 顯示每篇文章的標籤
	抓取 json 的 category.term
0807 # 調整 相關度計算方式
	抓取 json 的 category.term 標籤, 也計入相關文章 
	(例如 在 JavaScript (9) 的某些文章也有『部落格』標籤, 但如果只看『部落格 (39)』, 
	則原程式寫法超過 ?max-results=20 的部份不會被算入『部落格』標籤)
090415-1) 調整相關度, 標籤文章總數越少, 相關度權重越高, 
	抓取 json 的 openSearch$totalResults.$t
	1/(1 + n ^ scale)	rpsOpt.HalfScale, rpsOpt.WeightScale
090415-3) 非 jQuery		
// 090418 implement k_Query.find .get .length function
// 040418 "non jQuery().ready" adopted from LVCHEN label20 (ver 090316)
// 090418  "jQuery().getScript" is only for local JSON file
090416 # 權重排序程式調整
// 090427 OK
0807 # 顯示/隱藏文章摘要 & 字數
	抓取 json 的 summary.$t
// 090429 格式尚待調整

** 尚未完成
090429 // need check .... 
	#633 if (rpsOpt.blogRoot.charAt(l-1)=='/') {
	#710 myLocateRef
080715 # PostRankPure 用法及顏色語法待改良  => color OK
0807 # 顯示/隱藏文章 作者
	抓取 json 的 author.name.$t
090416 # 標籤/摘要 顯示格式尚未調整 => .post-labels .date
	或可參考 NS 的 TOC 顯示格式
090415-4) 擷取搜尋引擎的來源關鍵字, 找到站內相關文章
	(羊男 -- 加入 Google AJAX Search Box)

** 較遠的目標
0807 # 載入更多 json Feed, 目前每個標籤只載入 20 篇  
=> ** 或許不用, 因為有『計入 json 的 category.term 標籤』的機制
090415-5) NS 的 TOC + (標籤雲 ??) + 相關文章 .... (還不確定如何融合)
090415-6) 幾個有用到 json 的外掛, 重複利用 json 結果, (已經有的部份, 不會再重抓) ---- 可能會很難寫?? 
0807 # 不同模版的相容性 (e.g. 文末沒有 <p class='post-footer-line post-footer-line-1'>, 更沒有標籤)
0807 # 抓取同一網頁的其他資料, e.g. feedjit "Visitors to this page also liked"
0807 # 選擇哪些標籤的優先權較高
090416 # 獨立網頁版本 + 站外資料

	http://eucaly61.blogspot.com/2008/07/rps-10-beta.html?showComment=1238818560000#c5088862037732388490
*/
;;; var rpsDebug = {}; // for debug
//  mode, jsonLocal
;;; rpsDebug.jsonLocal = false;
;;; rpsDebug.jsonLocal = true;
;;; rpsDebug.msg_q = "";		// k_Query object

var rpsOpt = {};
// LocateBoard, LocateLabels, minColor, maxColor
	rpsOpt.blogRoot = '';

var rpsDisp = {};
// ListHead, ListLine, Loading, Rank

// ==== Begin of Option pre-Define ====

//rpsOpt.PostListLine = '[rpsPostTitle] - [rpsPostDate] ([rpsPostRank])';
	rpsDisp.Rank = '(%PostRankPure%%)';

	rpsDisp.Loading = '相關文章載入中 ...';
	rpsDisp.ListHead = '列出 %PostNum% 篇相關文章，以下是第 %PostNumFrom% 至 %PostNumTo% 篇';

	rpsDisp.ListBegin = '<ul>';
	rpsDisp.ListLine = '<li><font size=-1> %PostRank% </font> %PostTitle% <font size=-1>%PostDate%</font> <br/><font size=-2 color="#008000">%PostTagList%</font></li>';
	rpsDisp.ListEnd = '</ul>';

	rpsDisp.ListBegin = '<table border=0>';
	rpsDisp.ListLine = '<tr valign="middle"><td><font size=-1> %PostRank% </font></td> <td> %PostTitle% <font size=-1>%PostDate%</font><br/><font size=-1>%PostSummary%</font><br/><font size=-2 color="#008000">%PostTagList%</font></td></tr>';
	rpsDisp.ListEnd = '</table>';

	rpsOpt.urlSearchLabel = '/search/label/';
	rpsOpt.feedSearchLabel = '/feeds/posts/summary/-/';
	//rpsOpt.blogRoot = 'http://eucaly61.blogspot.com/';	// ending "/" is not critical, will handle automatically
	rpsOpt.LocateLabels = ['.post-footer', '.post-labels', 'a'];
	rpsOpt.LocateBoard = ['append', '.post-footer'];
	rpsOpt.Lines = 10;
	rpsOpt.SummaryChar = 100;
	rpsOpt.minColor = [0, 32, 64];
	rpsOpt.maxColor = [254, 0, 0];
	rpsOpt.colorMode = 1;
	rpsOpt.HalfScale = 8;
	rpsOpt.WeightScale = -1;		// WeightScale = 0 will become the previous "Rank" counting
// ==== End of Option pre-Define ====

// below is for debug only;
	rpsOpt.HalfScale = 8;
	rpsOpt.WeightScale = 0.5;		// WeightScale = 0 will become the previous "Rank" counting

var rpsFunc = {};
// ToggleMsg, main01, readFeed, page

// main module begin
(function(){

	var rpsFunc = window.rpsFunc;
	var rpsOpt = window.rpsOpt;
	var rpsDisp = window.rpsDisp;

	var	g_Board_q; // k_query object
// need check ....  mainList
;;; var	g_msg_dom;		// DOM object	// for debug only
	var rpsLabels_postLabelNum;
	var rpsLabels_loadLabelNum;
	var rpsBlog_postUrl = '';
	
	var rpsFeeds_relatedTag = [];
	var rpsFeeds_totalWeight = 0;
	var rpsFeeds_PostsNum;
	var rpsFeeds_Sorted;

	var rpsArray_Titles = [];
	var rpsArray_Urls = [];
	var rpsArray_Dates = [];
	var rpsArray_idx = [];
	var rpsArray_idxNum = 0;
	var rpsArray_Url2 = [];
	var rpsArray_tag2postUrl = [];
	var rpsArray_postTags = [];
	var rpsArray_postTags2 = [];
	var rpsArray_Weight = [];
	var rpsArray_Summary = [];

	var rpsJSON =  Array();
;;;	var page_processing = false;

rpsFunc.page = function (a) {
;;;	if (page_processing) {		// check for repeated entrance
;;; debugger;
//		return;
;;;	};
;;;	page_processing = true;
	rpsFeeds_Next = rpsFeeds_Lines * (a-1);
	redrawBoard();
;;;	page_processing = false;
};

var redrawBoard = function () {

// BEGIN	// used in DispReplace
	var u_idxFrom = 0;
	var u_idxTo = 10;
	var myHeadmsg = '';
	var myPostRank = '';
	var postTags = '';
	var myP = 0, r=0;
// END	// used in DispReplace
	var pNum;
	var pThis; // number
	var rTags;	// string
	var rpsHtml = '';
	var myRGB;
	var tagName, s1,
		i, j, kk;	// looping (r = post index)
	var h_scale = 360;

// interpolation of RGB or HSL (array)  ====> by Eucaly61 2009-04
	var interPn = function (myP, D0, D1) {
		var Q = [0];
		var	L0 = D0.length;
		var L1 = D1.length;
		var Lmin=Math.min(L0,L1);

		for (var i=0; i< Lmin; i++) {
			Q[i] = D0[i]*(1-myP) + D1[i]*myP;
		}
		if (L0>Lmin) {
			for (var i=Lmin; i< L0; i++) {
				Q[i] = D0[i];
			}}
		if (L1>Lmin) {
			for (var i=Lmin; i< L1; i++) {
				Q[i] = D1[i];
			}}
		return(Q);
	};

//convert rgb to hsl (all values 0..255, except hue 0..359)  ====> by Eucaly61 2009-04
	function rgb2H(rgb) {
		var r = rgb[0], g = rgb[1], b = rgb[2],
			max = Math.max(r, g, b), min = Math.min(r, g, b),
			h, d;

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
		}
		return [h, d, max];
	}

//convert rgb to hsl (all values 0..255, except hue 0..359)  ====> by Eucaly61 2009-04
	function H2rgb(hsv){
		var h = hsv[0], s = hsv[1], v = hsv[2]
			rgb=[];

		if (s==0) {
			rgb = [v, v, v]; // achromatic
		} else {
			function hue2rgb(p, q, t) {
				while (t < 0) t += 1;
				while (t > 1) t -= 1;
				if(t < 1/6) return p + (q - p) * 6 * t;
				if(t < 1/2) return q;
				if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
				return p;
			};

			var h1 = h/h_scale;
			for (var i=0; i<3; i++) {
				rgb[i] = Math.round(Math.max(Math.min(hue2rgb(v-s, v, h1+(1-i)/3 ), 255), 0));
			}
		}
		return rgb;
	}

	 var DispReplace = function(a) {
		var aa = a, a0;
		do {
			a0 = aa;
			aa = aa.replace(/%PostTitle%/gi, '<a href="' + rpsArray_Urls[r] + '">' + rpsArray_Titles[r] + '</a>');
			aa = aa.replace(/%PostTagList%/gi, postTags);
			aa = aa.replace(/%PostDate%/gi, rpsArray_Dates[r]);
//debugger;
//ss = rpsArray_Summary[r];
			aa = aa.replace(/%PostSummary%/gi, rpsArray_Summary[r]);
			aa = aa.replace(/%PostRankPure%/gi, myP + '' );
			if (rpsBlog_postUrl.indexOf(rpsArray_Urls[r])>=0)
				aa = aa.replace(/%PostRank%/gi, '本篇' )
			else
 				aa = aa.replace(/%PostRank%/gi, myPostRank);
			aa = aa.replace(/%PostNum%/gi, rpsArray_idxNum + '' );
			aa = aa.replace(/%PostNumFrom%/gi, (u_idxFrom+1) + '' );
			aa = aa.replace(/%PostNumTo%/gi, u_idxTo + '' );
		} while (a0 != aa);
		return aa;
	}

	if (!(rpsArray_Titles.length > 0)) 
		return;

	if (!(rpsFeeds_Lines>0)) { rpsFeeds_Lines = 10; }
	rpsFeeds_This = Math.min(Math.max(0,rpsFeeds_Next),rpsArray_idxNum-1);
	pNum = Math.ceil(rpsArray_idxNum / rpsFeeds_Lines);
	pThis = Math.floor(rpsFeeds_This / rpsFeeds_Lines) + 1;
	u_idxFrom = (pThis - 1) * rpsFeeds_Lines;
	u_idxTo = Math.min(u_idxFrom + rpsFeeds_Lines, rpsArray_idxNum);

	rTags = '';
	for (var tagName in rpsFeeds_relatedTag) {
		if (rTags != '') {rTags += ', '}
		rTags += tagName + ' (' + rpsFeeds_relatedTag[tagName] + ')';
	}
	rTags = '<br/>' + '<font size=-2 color="#008000"> 相關標籤 : ' + rTags + '</font>';
	myHeadmsg = DispReplace(rpsDisp.ListHead);

	g_Board_q.find('#headmsg').get(0).innerHTML =  myHeadmsg + rTags;
	g_Board_q.find('#progress').get(0).innerHTML = '';

	var minColor = rpsOpt.minColor;
	var maxColor = rpsOpt.maxColor;
// for HSL color mode	  ====> by Eucaly61, 2009-04
	var minH = rgb2H(minColor);
	var maxH = rgb2H(maxColor);
	var newRGB;
	if (rpsOpt.colorMode == 2) {
		if (minH[0] < maxH[0]) 
			minH[0] += h_scale;
		else
			maxH[0] += h_scale;
	}
	
	sortPosts (u_idxFrom, u_idxTo);
	
	for (j=u_idxFrom; j<u_idxTo; j++) {
		r = rpsArray_idx[j];
//;;; debugWrite('[j,r] = '+j+' , '+r);
		
		myP = Math.round(100 * rpsArray_Weight[r] / rpsFeeds_totalWeight) 
		if (rpsOpt.colorMode < 0.5) {
			newRGB = interPn(myP/100, minColor, maxColor);
		} else {
			var newH = interPn(myP/100, minH, maxH);
			newRGB = H2rgb(newH);
		}

		if (Math.min(newRGB[0],newRGB[1],newRGB[2])>=0)
			myRGB = '<span style="color: rgb(' + Math.floor(newRGB[0]) + ',' + Math.floor(newRGB[1]) + ',' + Math.floor(newRGB[2]) + ');">';
		else
			myRGB = '<span>';

		postTags = '';
		for (var kk in rpsArray_postTags[r]) {
			if (postTags != '') {postTags += ', '}
			tagName = rpsArray_postTags[r][kk];
			if (!rpsFeeds_relatedTag[tagName]) {
				postTags += '<b>' + tagName + '</b>';
			} else {
				postTags += tagName;
			}
		}
//		postTags += rpsArray_Summary[r];

		myPostRank = DispReplace(myRGB + rpsDisp.Rank + '</span>');
//		myLine = DispReplace(rpsDisp.ListLine);
		rpsHtml += DispReplace(rpsDisp.ListLine);
	}
	g_Board_q.find('#mainList').get(0).innerHTML = rpsDisp.ListBegin + rpsHtml + rpsDisp.ListEnd;

	var navi_temp = '', temp, temp_p = [];
	temp_p['上一頁'] = [pThis-1, ' / '];
	temp_p['下一頁'] = [pThis+1, ' / '];
	for (i = 1; i<=pNum; i++) {
		temp_p['&lt;'+i+'&gt;'] = [i, ' '];
	}

	for (s1 in temp_p) {
		temp = s1;
		kk = temp_p[s1][0];
		if ((kk>0)&&(kk<=pNum)) {
			if (kk != pThis) {
				temp = '<a href="javascript:rpsFunc.page(' + kk + ');">' + temp + '</a>';
			} else {
				temp = '<b>' + temp + '</b>';
			}
		}
		navi_temp += temp + temp_p[s1][1];
	}
	g_Board_q.find('#navi').get(0).innerHTML = navi_temp;
};	// end function		// redraw board

var funcWeight = function (n) {
	return 1/(1+Math.pow(n, rpsOpt.WeightScale));
};

var addWeight = function (tagName, entryURL, j, tagWeight) {
	if(rpsArray_tag2postUrl[tagName][entryURL] == undefined) {
		rpsArray_tag2postUrl[tagName][entryURL] = j;
		rpsArray_Weight[j] += tagWeight;
	}
}

// 0717, 或許改用 setInterval() 檢查, http://www.swingingbird.com/josephj/Study/SetTimeout/index.html
var procReadOK = function() {

	
	if (rpsLabels_postLabelNum == 0) {
		g_Board_q.find('#mainList').get(0).innerHTML = '沒有標籤';
		return;
	}

	var pp = Math.floor(90 * rpsLabels_loadLabelNum / rpsLabels_postLabelNum);

;;; debugWriteIf(/%jsok%/i, 'END callback : ' + ' / ' + rpsFeeds_PostsNum);
;;; if (rpsDebug.mode.search(/%jsok-full%/i)>=0) {
;;; for (var j=0; j < rpsFeeds_PostsNum; j++) {
;;; debugWrite(rpsArray_Dates[j] + ' / ' + rpsArray_Titles[j] + ' [' + rpsArray_Urls[j] + ']');
;;; }
;;; }

	g_Board_q.find('#progress').get(0).innerText = '( ' + pp + '% )';
	if (rpsLabels_loadLabelNum == rpsLabels_postLabelNum) {

//	抓取 json 的 category.term 標籤, 也計入相關文章 
		for (var j in rpsArray_postTags) {
			for (var k in rpsArray_postTags[j]) {
				var tagName = rpsArray_postTags[j][k];
				var entryURL = rpsArray_Urls[j];
				if (rpsFeeds_relatedTag[tagName] != undefined) { 
					var tagPostNum = rpsFeeds_relatedTag[tagName];
					var tagWeight = funcWeight(tagPostNum);
					addWeight(tagName, entryURL, j, tagWeight);
				}
			}
		}
		
// first time draw related post lists
		g_Board_q.find('#headmsg').get(0).innerText = '';
		g_Board_q.find('#progress').get(0).innerText = '';
		rpsFeeds_Lines = rpsOpt.Lines;
		rpsFeeds_This = 0;
		rpsFeeds_Next = 0;
//		rpsArray_idxNum = rpsFeeds_PostsNum-1;
		redrawBoard();
	}
};

rpsFunc.readFeed = function(json) {
	
	var getLinkByRel = function(l, r) {
		for (j in l) {
			if (l[j].rel == r) {
				return l[j].href;
			}
		}
		return '';
	}
	
	var regex_lt=/</g;
	var regex_gt=/>/g;
	var i, j, k, s2;
	var entryURL = "";
	var feedLink = getLinkByRel(json.feed.link, 'alternate');
	var tagName = "";
//	var jsonIdx = rpsLabels_loadLabelNum;
//	rpsJSON[jsonIdx] = json;
	rpsLabels_loadLabelNum += 1;

	s2 = feedLink.split(rpsOpt.urlSearchLabel)[1];
//	s2 : label encoded, e.g. %E7%A8%8B%E5%BC%8F%E8%A8%AD%E8%A8%88

	if (s2) {
		s2 = s2.split('?')[0];
		tagName = decodeURIComponent(s2);
	} else {
		alert('feedLink = ' + feedLink);
	}

	var tagPostNum = json.feed.openSearch$totalResults.$t * 1; 
	var tagWeight = funcWeight(tagPostNum);
	rpsFeeds_totalWeight += tagWeight;
	
//	if (rpsFeeds_relatedTag[tagName] == undefined) {
	if (!rpsFeeds_relatedTag[tagName]) {
		rpsFeeds_relatedTag[tagName] = tagPostNum;
		rpsArray_tag2postUrl[tagName] =  Array();
	} else {
		alert('feedLink = ' + feedLink + 'tagName = ' + tagName);
		return;
	}
	
	for (i = 0; i < json.feed.entry.length; i++) {
		var entry = json.feed.entry[i];
		entryURL = getLinkByRel(entry.link, 'alternate');
		if (entryURL != "") {
//			if (rpsArray_Url2[entryURL] != undefined) {  // 已經存在的 entry, 相關度 +1
			if (rpsArray_Url2[entryURL]) {  // 已經存在的 entry, 相關度 +1
				j = rpsArray_Url2[entryURL];
				addWeight(tagName, entryURL, j, tagWeight);
			} else {
				j = rpsFeeds_PostsNum;
				rpsArray_Url2[entryURL] = j;
				rpsArray_Titles[j] = (entry.title.$t.replace(regex_lt, '&lt;')).replace(regex_gt, '&gt;');
				rpsArray_Dates[j] = entry.published.$t.substr(0,10);
				rpsArray_Urls[j] = entryURL;
				rpsArray_Weight[j] = 0;
				addWeight(tagName, entryURL, j, tagWeight);

				if ("summary" in entry) {
					var postcontent = entry.summary.$t;
               	} else 
               		var postcontent = "";
				// strip off all html-tags
				postcontent = postcontent.replace(/<\S[^>]*>/g, "");
				// reduce postcontent to numchar characters, and then cut it off at the last whole word
				if (postcontent.length > rpsOpt.SummaryChar)
					postcontent = postcontent.substring(0, rpsOpt.SummaryChar) + '...';
				rpsArray_Summary[j] = (postcontent.replace(regex_lt, '&lt;')).replace(regex_gt, '&gt;');

				var tags = new Array();
				for (k in entry.category) {
					tags[k] = entry.category[k].term;
				}
				rpsArray_postTags[j] = tags;

				rpsArray_idx[rpsArray_idxNum] = j;
				rpsArray_idxNum++;
				rpsFeeds_PostsNum++;
			}
		} // endif
	} // next i
;;; if (!rpsDebug.jsonLocal) 
	procReadOK();
};

var sortPosts = function (sortFrom, sortTo) {
	var i, j, ll=rpsFeeds_PostsNum-1;
	var lastSort, temp;
/*	if (rpsFeeds_Sorted < 0) {
		for(i = 0; i < ll; i++) {
			rpsArray_idx[i] = i+1;
		}
		rpsFeeds_Sorted = 0;
	} */
	if (rpsFeeds_Sorted < sortTo) {
		j = rpsFeeds_Sorted; 
		while (j <= sortTo) {
			lastSort = ll;
			for(i = ll-1; i>j; i--) {
				if (rpsArray_Weight[rpsArray_idx[i]]>rpsArray_Weight[rpsArray_idx[i-1]]) {
					temp = rpsArray_idx[i];
					rpsArray_idx[i] = rpsArray_idx[i-1];
					rpsArray_idx[i-1] = temp;
					lastSort = i-1;
				}
			}
			j = Math.max(lastSort,j+1);
		}
		rpsFeeds_Sorted = lastSort;
	}
};

var fatchLabel = function() {
	var json_script;
	var i, l, s1, s2, p1;
	var feedUrl;


	if (!(g_Board_q.length()>0)) return;	// do nothing if rps_board not exist

	if (rpsOpt.LocateLabels[rpsOpt.LocateLabels.length-1] != 'a') {
		rpsOpt.LocateLabels[rpsOpt.LocateLabels.length] = 'a';
	}

debugger;
	var postLabel_q = k_Query(rpsOpt.LocateLabels);		// input an array of selector

	if (postLabel_q.length() == 0) {
;;; debugWriteIf(/%label%/i, '[ another try with default ]');
		postLabel_q = k_Query('.post-footer .post-labels a');
	}


// if no Labels found ....
	rpsLabels_postLabelNum = postLabel_q.length();
	rpsLabels_loadLabelNum = 0;
	
;;; debugWriteIf(/%label%/i, 'postLabelNum = ' + rpsLabels_postLabelNum);

	s2 = rpsOpt.blogRoot;
	do {
		s1 = s2;
		s2 = s2.replace(/\/$/,'');
	} while (s1!=s2);
	rpsOpt.blogRoot = s2;
;;; debugWriteIf(/%label%/i, 'blogRoot = ' + rpsOpt.blogRoot);
	
	for (i=0; i<rpsLabels_postLabelNum; i++) {

		ss = postLabel_q.get(i).href.split(rpsOpt.urlSearchLabel);
		s1 = ss[0];
		s2 = ss[1];		// s2 : label encoded, e.g. %E7%A8%8B%E5%BC%8F%E8%A8%AD%E8%A8%88

		if (s2) {
			if (rpsOpt.blogRoot=='') {
				rpsOpt.blogRoot = s1; 
			}
			s2 = s2.split('?')[0];
			s1 = postLabel_q.get(i).innerHTML;		// s1 : label without encode, e.g. 程式設計
// innerText ??

;;; debugWriteIf(/%label%/i, 'this Label = ' + s1);

			feedUrl = rpsOpt.blogRoot + rpsOpt.feedSearchLabel + s2 + '?max-results=20&alt=json-in-script&callback=rpsFunc.readFeed';

;;; debugWriteIf(/%label%/i, 'feedUrl = ' + feedUrl);

			var head0 = document.getElementsByTagName('head')[0];
// ===== for local test only =====
;;; if (rpsDebug.jsonLocal) {
;;; debugWriteIf(/%label%/i, '[ get json-in-scipt LOCAL = ' +   s1 + ']');
/*  json_script = document.createElement('script');
	json_script.src = s1;
	json_script.type = 'text/javascript';
	head0.appendChild(json_script);*/
;;; jQuery.getScript(s1, procReadOK);
;;; } else {
// --------------------------------
;;; debugWriteIf(/%label%/i, '[ get json-in-scipt REMOTE ]');
			json_script = document.createElement('script');
			json_script.src = feedUrl;
			json_script.type = 'text/javascript';
			head0.appendChild(json_script);
;;; }	  
	
;;; debugWriteIf(/%label%/i, '[ loop next label ]');
		}   // endif s2
	}   // next i
;;; debugWriteIf(/%label%/i, '[ end fatchLabel ]');
};  // end function fatchLabel

var initVar = function() {

	rpsBlog_postUrl = document.URL.split('?')[0];

;;;	if (!rpsDebug.mode) {rpsDebug.mode = '%blog%label%jsOK%jsOK-full%';}

	rpsArray_Urls[0] = rpsBlog_postUrl;
	rpsFeeds_PostsNum = 1;
	rpsFeeds_Sorted = -1;
	if (rpsOpt.WeightScale < 0) {
		if (rpsOpt.HalfScale >= 2)
			rpsOpt.WeightScale =  Math.log(2) / Math.log(rpsOpt.HalfScale);
		else
			rpsOpt.WeightScale = 0;
	}
};  // end function		// initVar

var initBoard = function() {
	var myLocate_q = k_Query(document.body);
	var p_append = 1;
	var p_prepend = 2;
	var p_before = 3;
	var p_after = 4;
	var locRef = {
		'append' : p_append,
		'prepend' : p_prepend,
		'before' : p_before,
		'after' : p_after};
	var i0 = 0;
	var s1;
	var lmax = 1;
	var lmin = 0;

	var myLocateRef = locRef[rpsOpt.LocateBoard[0].toLowerCase()];
	if (myLocateRef) {
		i0 = 1;
	} else {
		i0 = 0;
	}

	for (var i=i0; i<rpsOpt.LocateBoard.length; i++) {
		if (myLocate_q.length()>0) {
			s1 = rpsOpt.LocateBoard[i]
			switch (typeof(s1)) {
			case 'string' :
				myLocate_q = myLocate_q.find(s1);
				break;
			case 'number' :
				if (lmin==0) { lmin = s1; }
				lmin = Math.min(lmin, s1);
				lmax = Math.max(lmax, s1);
				break;
			default :
			}
		}
	}
	s1 = myLocate_q.length();
	if ((s1==0) || (s1<lmin) || (s1>lmax)) { return; }
	var newDOM=document.createElement('div');
	newDOM.id = "rpsBoard";
	var myLocate_dom = myLocate_q.get(0);

	switch(myLocateRef) {
		case p_prepend :
			myLocate_dom.insertBefore( newDOM, myLocate_dom.firstChild );
			break;
		case p_after :
			myLocate_dom.parentNode.insertBefore( newDOM, myLocate_dom.nextSibling )
			break;
		case p_before :
			myLocate_dom.parentNode.insertBefore( newDOM, myLocate_dom )
			break;
		default :
			myLocate_dom.appendChild(newDOM);
	}

	g_Board_q = k_Query('#rpsBoard');
	if (g_Board_q.length()>0) {
		var Board_dom = g_Board_q.get(0);
		Board_dom.innerHTML +=
			('<div><p><span id="headmsg">' + rpsDisp.Loading + '</span>' +
			'<span id="progress"> ( 0% ) </span></p></div>' + '<p id="navi"></p>' +
			'<div id="mainList">' + rpsDisp.Loading + '</div>');
//		rps_dom.mainList = g_Board_q.find('#mainList').get(0);
	} else {
		return;
	}
;;; /*		// only for non-debug
	Board_dom.innerHTML +=
	('<br />');
;;; */  
// ===== DEBUG session BEGIN =====
;;; Board_dom.innerHTML += ('<p><a href="javascript:void(0);" onclick="javascript:rpsFunc.ToggleMsg(rpsDebug.msg_q);">' + '[+/-] show/hide debug message</a></p><ul id="rps-msg" style="display:none"></ul>'); // for debug only
;;; rpsDebug.msg_q = k_Query('#rpsBoard #rps-msg');
;;;	g_msg_dom = rpsDebug.msg_q.get(0);
//;;;   debugWrite('myLocateRef = ' + myLocateRef);
;;; debugWrite('ready BEGIN');
// ----- DEBUG session END -----

}; // end function		// initBoard

;;; debugWrite = function(a) {
//;;;		k_Query(document.body).find('#rpsBoard #rps-msg').get(0).innerHTML += '<li>' + a + '</li>';
;;;		g_msg_dom.innerHTML += '<li>' + a + '</li>';
;;; };

;;; debugWriteIf = function(cond, a) {
;;;		if (rpsDebug.mode.search(cond)>=0) {
//;;;			k_Query(document.body).find('#rpsBoard #rps-msg').get(0).innerHTML += '<li>' + a + '</li>';
;;;		g_msg_dom.innerHTML += '<li>' + a + '</li>';
;;;		}
;;; };

// 080717 OK, expend for more than one object (toggle all on, all off)
rpsFunc.ToggleMsg = function(a) {
	var toDisp = 'inline', i;
	for (i=0; i<a.length(); i++) {
		if (a.get(i).style.display == 'inline') {
			toDisp = 'none';
			break;
		}
	}
	for (i=0; i<a.length(); i++) {
		a.get(i).style.display = toDisp;
	}
};

rpsFunc.main01 = function() {
	initVar();
	initBoard();
//	if (!(g_Board_q.length()>0)) return;
;;; debugWriteIf(/%blog%/i, 'debugWriteIf, postUrl = ' + rpsBlog_postUrl);
	fatchLabel();
	procReadOK();
;;; debugWrite('ready END');

};

})();

// ==== k_Query ==== Module Begin

(function(){
var 
	// Will speed up references to window, and allows munging its name.
	window = this,
	// Will speed up references to undefined, and allows munging its name.
	undefined,
	k_Query = window.k_Query = function(selector) {
		var ret = new k_Query.fn.init(selector);
		return ret;
	};

//var quickExpr = /^[^<]*(<(.|\s)+>)[^>]*$|^#([\w-]+)$/ ;

k_Query.fn = k_Query.prototype = {
	init: function(selector) {
		selector = selector || document;
		if ( selector.nodeType ) {
			this.DOMs = selector;
			return this;
		}
		if ((selector == undefined) || (selector == null)) {
			this.DOMs = document;
			return this;
		} else {
			this.DOMs = k_Query(document).find(selector).DOMs;
			return this;
		}
	},
	length: function () {
		if ((this.DOMs == undefined)||(this.DOMs == null)||(typeof this.DOMs == 'String'))
			return 0;
		var len0 = this.DOMs.length;
		if (isNaN(len0))
			return 1;
		else
			return len0;
	},
	get: function( num ) {
		if (isNaN(num))
			return this.DOMs;
		var len0 = this.DOMs.length;
		if (isNaN(len0))
			return this.DOMs;
		else
			return this.DOMs [ num ];
	}, 
	find: function(mask) {
//	  var match = quickExpr.exec( mask );

		var ret = k_Query();
		ret.DOMs = [];
		var mask_array;

		if (this == undefined)
			return ret;
		if (this.length() == 0)
			return ret;
// make mask_array		(mask should be string or an array)
		if ( (typeof mask) == "string" ) {
			mask_array = mask.split(" ");
		} else
			mask_array = mask;
		var len0 = mask_array.length;
		if (isNaN(len0))
			return ret;
// make k_DOM_array
		var k_DOM_array = this.DOMs;
		len0 = k_DOM_array.length;
		if (isNaN(len0))
			k_DOM_array = [k_DOM_array];

// loop for each mask_array and k_DOM_array
		for (j in mask_array) {
			var temp_DOMs = [];
			mask = mask_array[j];
			var mask_name = mask.replace(/^[#.]/ , '');		// remove the leading # (for id) or . (for class)
			for (k in k_DOM_array) {
				var k_DOM = k_DOM_array[k];
//				switch (mask[0]) {
				switch (mask.charAt(0)) {
					case '#':   // getElementsByID  ** allow multiple result
						var tags = k_DOM.getElementsByTagName('*');
						for (var i = 0 ; i < tags.length ; i++ ) {
							if (tags[i].id == mask_name)
								temp_DOMs = temp_DOMs.concat(tags[i]);
						}
						break;
					case '.': // while getAttribute('class') && getElementsByClassName won't work
						var tags = k_DOM.getElementsByTagName('*');
						for (var i = 0 ; i < tags.length ; i++ ) {
							if ((' '+tags[i].className+' ').search(' '+mask_name+' ')>=0) {
								temp_DOMs = temp_DOMs.concat(tags[i]);
							}
						}
						break;
					default:	// getElementsByTagName
						if (temp_DOMs.length==0) {
							temp_DOMs = k_DOM.getElementsByTagName(mask);
						} else {
debugger;
							temp_DOMs = temp_DOMs.concat(k_DOM.getElementsByTagName(mask));
						}
				}   // end switch
			}
			k_DOM_array = temp_DOMs;
		}
		if (temp_DOMs.length>0) {
			ret.DOMs = temp_DOMs;
		}
		return ret;
	}
};
})();

k_Query.fn.init.prototype = k_Query.fn;

// ==== k_Query ==== Module End

// adopted from LVCHEN label20 (ver 090316)
// Loding string after DOM ready. Hopefully it works well.
// http://www.javascriptkit.com/dhtmltutors/domready.shtml
// http://www.java2s.com/Code/JavaScriptReference/Javascript-Properties/readyState.htm
var rps_alreadyrunflag=0; //flag to indicate whether target function has already been run
if (document.addEventListener) // FF DOM ready loader
	document.addEventListener("DOMContentLoaded", function(){rps_alreadyrunflag=1; /*tagFunc.getReady();*/ rpsFunc.main01();}, false);
else if (document.all && !window.opera){ // IE DOM reaady loader
	document.onreadystatechange=function() {  
      if (document.readyState=="complete") {
        rps_alreadyrunflag=1;
//		tagFunc.getReady();
rpsFunc.main01();
      }
	}; 
}
else if(/Safari/i.test(navigator.userAgent)){ //Test for Safari
  var _timer=setInterval(function(){
  if(/loaded|complete/.test(document.readyState)){
    clearInterval(_timer);
	rps_alreadyrunflag=1;
//    tagFunc.getReady(); // call target function
rpsFunc.main01();
  }}, 10);
}

window.onload=function()
{
	setTimeout("if (!rps_alreadyrunflag) rpsFunc.main01();", 0);
};

/* ==== Reference ====
http://www.json.org/js.html  // JSON.parse()
http://dev.sopili.net/2008/11/javascriptarraykey_6376.html  
	// Sopili 網路程邦: javascript的array型態：以字串為key的值
			if (rpsArray_Url2[entryURL] != undefined) {  // 已經存在的 entry, 相關度 +1
				j = rpsArray_Url2[entryURL];
				...
			} else {
				rpsArray_Url2[entryURL] = rpsFeeds_PostsNum;

				tagName = rpsArray_postTags[j][k];	// why [j][k]
// hash-mapp	http://stackoverflow.com/questions/366262/search-javascript-array-for-regex-and-return-true-false-0-1-if-found
jQuery alternative
http://www.cnblogs.com/liping13599168/archive/2009/02/09/1386623.html
http://twpug.net/modules/newbb/viewtopic.php?viewmode=compact&topic_id=3405&forum=21

appendchild
createDocumentFragment

	append: function() {
				this.appendChild( elem );

	prepend: function() {
				this.insertBefore( elem, this.firstChild );

	before: function() {
			this.parentNode.insertBefore( elem, this );

	after: function() {
			this.parentNode.insertBefore( elem, this.nextSibling );

should be k_Query() rather than k_Query;
should be k_Query(...).length() rather than k_Query(...).length;
*/
