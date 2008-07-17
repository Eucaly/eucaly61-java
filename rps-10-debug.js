var rpsDebug = {}; // for debug
//  mode, jsonLocal

var rpsFunc = {};
var rpsOpt = {};
var br = '<br />';

var rps$ = {};
// msg, Board, mainList
var rpsLabels = {};
// postLabelNum, loadLabelNum
var rpsBlog = {};
// postUrl

var relatedPostsNum = 0;
var maxStar = 1;
var relatedStar = new Array();
var relatedTitles = new Array();
var relatedUrls = new Array();
var relatedDates = new Array();
var u_Idx = new Array();
var u_IdxNum = 0;

rpsFunc.debugWrite = function(a) {
  rps$.msg.append('<li>' + a + '</li>');
};

function jsOK(){
  var pp = Math.floor(90 * rpsLabels.loadLabelNum / rpsLabels.postLabelNum);
//  if (rpsDebug.mode.search(/\/jsok\//i)>=0) rpsFunc.debugWrite('END callback : ' + a + ' / ' + relatedPostsNum);
  if (rpsDebug.mode.search(/\/jsok\//i)>=0) rpsFunc.debugWrite('END callback : ' + ' / ' + relatedPostsNum);
//  if (rpsDebug.mode.search(/\/jsok\//i)>=0) rpsFunc.debugWrite('( ' + pp + '% )');
if (rpsDebug.mode.search(/\/jsok-full\//i)>=0) 
    for (var j=0; j < relatedPostsNum; j++) {
    rpsFunc.debugWrite(relatedDates[j] + ' / ' + relatedTitles[j] + ' [' + relatedUrls[j] + ']');
  };
  rps$.Board.find('#progress').text('( ' + pp + '% )');
  if (rpsLabels.loadLabelNum == rpsLabels.postLabelNum) {
    rps$.Board.find('#headmsg').text('');
    rps$.Board.find('#progress').text('');
    SortRelatedPosts();
    ShowRelatedPosts();
  }
};

function RelatedLabels(json) {
	
//	document.write(1);
	
var regex1=/</g, regex2=/>/g;
  var entryURL = "";
  rpsLabels.loadLabelNum += 1;
  for (var i = 0; i < json.feed.entry.length; i++) {
    var entry = json.feed.entry[i];
    entryURL = "";
    for (var j = 0; j < entry.link.length; j++) {
      if (entry.link[j].rel == 'alternate') {
        entryURL = entry.link[j].href;
        break;
      } // endif
    }  // next j
    if (entryURL != "") {
      for (var j = 0; j <= relatedPostsNum; j++) {
        if (relatedUrls[j] == entryURL) {
          relatedStar[j]++;
          if (relatedStar[j]>maxStar)
            maxStar=relatedStar[j];
          entryURL = "";
          break;
        } // endif
      } // next j
    } // endif
    if (entryURL != "") {
      relatedTitles[relatedPostsNum] = (entry.title.$t.replace(regex1, '&lt;')).replace(regex2, '&gt;');
      relatedDates[relatedPostsNum] = entry.published.$t.substr(0,10);
      relatedUrls[relatedPostsNum] = entryURL;
      relatedStar[relatedPostsNum] = 1;
      relatedPostsNum++;
    } // endif
  }; // next i
if (!rpsDebug.jsonLocal) jsOK();
};

function SortRelatedPosts() {
  for (var j = maxStar; j > 0 ; j--) {
    for(var i = 0; i < relatedUrls.length; i++) {
      if (rpsBlog.postUrl != relatedUrls[i]) {
        if(relatedStar[i]==j) {
          u_Idx[u_IdxNum] = i;
          u_IdxNum++;
        } 
      }
    }
  }
};

function spanRGB(myP, PRGB) {
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
      return('<span style="color: rgb(' + myR + ',' + myG + ',' + myB + ');">');
      break;
    }
  }
  return('<span>');
};

function ShowRelatedPosts() {

  var r = 0;
  var i = 0;
  var currStar = 0;
  var myStars = "";
  var myRGB;
  var myP = 0;
  var optionRGB = [ {P: 100, R :208, G: 0, B: 0}, {P: 50, R: 255, G: 204, B: 0}, {P: 0, R: 0, G: 64, B: 128} ];

  var myHeadmsg = '';
  var myPostRank = '';
  var myLine = '';
  var u_IdxFrom = 0;
  var u_IdxTo = 10;

  var myQ = Math.floor(100*Math.random());
  var myQQ = spanRGB(myQ, optionRGB);

  function DispReplace(a) {
  	  aa = a;
  do {
  	  a0 = aa;
	  aa = aa.replace(/%PostTitle%/gi, '<a href="' + relatedUrls[r] + '">' + relatedTitles[r] + '</a>');
	  aa = aa.replace(/%PostDate%/gi, relatedDates[r]);
	  aa = aa.replace(/%PostRankPure%/gi, myP + '' );
	  aa = aa.replace(/%PostRank%/gi, myPostRank);
	  aa = aa.replace(/%PostNum%/gi, u_IdxNum + '' );
	  aa = aa.replace(/%PostNumFrom%/gi, (u_IdxFrom+1) + '' );
	  aa = aa.replace(/%PostNumTo%/gi, u_IdxTo + '' );
  } while (a0 != aa)
	  return aa;
  };

  if (relatedTitles.length > 0) {
  	u_IdxFrom = 0;
  	u_IdxTo = 10;
    myHeadmsg = DispReplace(rpsOpt.DispListHead);
    rps$.Board.find('#headmsg').text('').append(myQQ + myHeadmsg + '</span>'); // for debug
    rps$.mainList.append('<ul>');
    for (var j=u_IdxFrom; j<u_IdxNum && j<u_IdxTo; j++) {
      r = u_Idx[j];
      myP = Math.floor(100*relatedStar[r]/rpsLabels.loadLabelNum);
      myRGB = spanRGB(myP, optionRGB);

      myPostRank = DispReplace(myRGB + rpsOpt.DispRank + '</span>');
	  myLine = DispReplace(rpsOpt.DispListLine);

      rps$.mainList.append('<li>' + myLine + '</li>');
    }
//    if (currStar != 0) 
      rps$.mainList.append('</ul>');
//    rps$.mainList.append('== 以上 ' + j + ' 則 ==, <u>相關文章 (json/java) 說明</u> ... 文件製作中 ... 請期待');
  }
};

rpsFunc.fatchLabel = function() {
  var postLabel$ = jQuery(rpsOpt.LocateLabels[0]);
  var blogSearchLabel='/search/label/';
var json_script;
var head0 = document.getElementsByTagName('head')[0];
	
  if (rpsOpt.LocateLabels[rpsOpt.LocateLabels.length-1] != 'a') {
    rpsOpt.LocateLabels[rpsOpt.LocateLabels.length] = 'a'
  };
  for (var i=1; i<rpsOpt.LocateLabels.length; i++) {
  	if (postLabel$.length > 0) {
      if (rpsDebug.mode.search(/\/label\//i)>=0) rpsFunc.debugWrite('[' + rpsOpt.LocateLabels[i] + ']');
  	  postLabel$ = postLabel$.find(rpsOpt.LocateLabels[i]);
    }
  }

  if (postLabel$.length == 0) {
      if (rpsDebug.mode.search(/\/label\//i)>=0) rpsFunc.debugWrite('[ another try with default ]');
    postLabel$ = jQuery('.post-footer').find('.post-labels').find('a');
  }

// if no Labels found ....

  rpsLabels.postLabelNum = postLabel$.length;
  rpsLabels.loadLabelNum = 0;
  
  if (rpsDebug.mode.search(/\/label\//i)>=0) rpsFunc.debugWrite('postLabelNum = ' + rpsLabels.postLabelNum); //.append(postLabel$.text());

  for (var i=0; i<rpsLabels.postLabelNum; i++) {
    var s1 = postLabel$.eq(i).attr('href');
    var p1 = s1.search(blogSearchLabel);
    if (p1 > 0) {
      var s2 = s1.slice(p1+blogSearchLabel.length);
      s1 = postLabel$.eq(i).text();
      var p2 = s2.search(/\?/);
      if (p2>0) {
      	s2 = s2.slice(0,p2);
      };
      if (rpsDebug.mode.search(/\/label\//i)>=0) rpsFunc.debugWrite('[' + s1 + ']');
      var feedUrl = 'http://eucaly61.blogspot.com/feeds/posts/summary/-/' + s2 + '?max-results=20&alt=json-in-script&callback=RelatedLabels';
//      var feedUrl = s1.slice(1,p1) + '/feeds/posts/summary/-/' + s2 + '?max-results=20&alt=json-in-script&callback=RelatedLabels';
      if (rpsDebug.mode.search(/\/label\//i)>=0) rpsFunc.debugWrite('[' + feedUrl + ']');
if (rpsDebug.jsonLocal) {
      if (rpsDebug.mode.search(/\/label\//i)>=0) rpsFunc.debugWrite('[' + 'local' + ']');
  jQuery.getScript(s1, jsOK );
} else {
      if (rpsDebug.mode.search(/\/label\//i)>=0) rpsFunc.debugWrite('[' + 'remote' + ']');
//      jQuery.getScript(feedUrl, jsOK );

	json_script = document.createElement('script');
//	json_script.setAttribute('src', feedUrl);
//	json_script.setAttribute('type', 'text/javascript');
	json_script.src = feedUrl;
	json_script.type = 'text/javascript';
    head0.appendChild(json_script);
	
}      
      if (rpsDebug.mode.search(/\/label\//i)>=0) rpsFunc.debugWrite('[' + 'end' + ']');
    }
  }
};


rpsFunc.ToggleMsg = function(a) {
  var aa = a.get(0);
  if (aa.style.display == 'inline') {
  	aa.style.display = 'none';
  } else {
  	aa.style.display = 'inline';
  }
}

rpsFunc.initVar = function() {
  var p2;
  rpsBlog.postUrl = document.URL;
  p2 =rpsBlog.postUrl.search(/\?/);
  if (p2 > 0) rpsBlog.postUrl = rpsBlog.postUrl.slice(0,p2);
  relatedUrls[0] = rpsBlog.postUrl;
  relatedPostsNum = 1;
};

rpsFunc.initBoard = function() {
  var myLocate$ = jQuery('body');
  var myLocateRef = rpsOpt.LocateBoard[0].match(/append|prepend|before|after/i);
  if (typeof(myLocateRef)=='object')
    myLocateRef = myLocateRef[0];
  var i0 = 0;
  if (myLocateRef.length > 0) {
    i0 = 1;
  } else {
    i0 = 0;
    myLocateRef = '';
  }

  for (var i=i0; i<rpsOpt.LocateBoard.length; i++) {
    if ( (myLocate$.length>0) && (typeof(rpsOpt.LocateBoard[i])=='string') ) {
  	  myLocate$ = myLocate$.find(rpsOpt.LocateBoard[i]);
  	}
  }
  if (myLocate$.length==0) return;

  var rpsBoardHTM = '<div id="rpsBoard"></div>';
  switch(myLocateRef.toLowerCase()) {
  case 'prepend' :
    myLocate$.prepend(rpsBoardHTM);
    break;
  case 'after' :
    myLocate$.after(rpsBoardHTM);
    break;
  case 'before' :
    myLocate$.before(rpsBoardHTM);
    break;
  default :
    myLocate$.append(rpsBoardHTM);
  }
  rps$.Board = jQuery('#rpsBoard');
  rps$.Board.append('<div><p><span id="headmsg">' + rpsOpt.DispLoading + '</span>' +
  '<span id="progress"> ( 0% ) </span></p></div>' +
  '<div id="mainList"></div>');  
  rps$.mainList = rps$.Board.find('#mainList');

  rps$.Board.append('<p><a href="javascript:void(0);" onclick="javascript:rpsFunc.ToggleMsg(rps$.msg);">' + 
  	'[+/-] show/hide debug message</a></p><ul id="rps-msg" style="display:none"></ul>'); // for debug only

  rps$.msg = rps$.Board.find('#rps-msg'); // for debug only
//  rpsFunc.debugWrite('myLocateRef = ' + myLocateRef);
  rpsFunc.debugWrite('ready BEGIN');
};

rpsFunc.main01 = function() {
  jQuery(document).ready(function(){
    rpsFunc.initVar();
    rpsFunc.initBoard();
if (rpsDebug.mode.search(/\/blog\//i)>=0) rpsFunc.debugWrite('postUrl = ' + rpsBlog.postUrl);
    rpsFunc.fatchLabel();
rpsFunc.debugWrite('ready END');
  });
};

//rpsOpt.PostListLine = '[rpsPostTitle] - [rpsPostDate] ([rpsPostRank])';
rpsOpt.DispRank = '(%PostRankPure%%)';
rpsOpt.DispLoading = '相關文章載入中 ...';
rpsOpt.DispListHead = '有 %PostNum% 篇相關文章，以下是第 %PostNumFrom% 至 %PostNumTo% 篇';
rpsOpt.DispListLine = '<font size=-1>%PostRank%</font> %PostTitle% - <font size=-1>%PostDate%</font>';
rpsOpt.LocateLabels = ['.post-footer', '.post-labels', 'a'];
rpsOpt.LocateBoard = ['append', '.post-footer'];

rpsDebug.mode = '/blog/label/jsOK/jsOK-full/';
rpsDebug.mode = '/blog/label/jsOK/';
//rpsDebug.mode = '';
rpsDebug.jsonLocal = true;
rpsDebug.jsonLocal = false;

rpsOpt.test = ['after', '.post-footer', 1, 2];

rpsFunc.main01();
