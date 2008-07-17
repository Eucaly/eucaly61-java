var rpsFunc = {};
var rpsOpt = {};
rpsOpt.blogRoot = '';

var rpsDisp = {};

var rps$ = {};
var rpsLabels = {};
var rpsBlog = {};

var rpsFeeds = {};
rpsFeeds.PostsNum = 0;
rpsFeeds.maxRank = 1;
rpsFeeds.Ranks = [];
rpsFeeds.Titles = [];
rpsFeeds.Urls = [];
rpsFeeds.Dates = [];
rpsFeeds.idx = [];
rpsFeeds.idxNum = 0;

rpsFunc.page = function (a) {
  rpsFeeds.Next = rpsFeeds.Lines * (a-1);
  rpsFunc.redrawBoard();
};

rpsFunc.redrawBoard = function () {

  var r = 0;
  var i = 0;
  var j;
  var currStar = 0;
  var myStars = '';
  var myRGB;
  var myP = 0;
  var optionRGB = [ {P: 100, R :208, G: 0, B: 0}, {P: 50, R: 255, G: 204, B: 0}, {P: 0, R: 0, G: 64, B: 128} ];

  var myHeadmsg = '';
  var myPostRank = '';
  var myLine = '';
  var u_idxFrom = 0;
  var u_idxTo = 10;
  
  var pNum, pThis;

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

  function DispReplace(a) {
  var aa = a;
  do {
  	  a0 = aa;
	  aa = aa.replace(/%PostTitle%/gi, '<a href="' + rpsFeeds.Urls[r] + '">' + rpsFeeds.Titles[r] + '</a>');
	  aa = aa.replace(/%PostDate%/gi, rpsFeeds.Dates[r]);
	  aa = aa.replace(/%PostRankPure%/gi, myP + '' );
	  aa = aa.replace(/%PostRank%/gi, myPostRank);
	  aa = aa.replace(/%PostNum%/gi, rpsFeeds.idxNum + '' );
	  aa = aa.replace(/%PostNumFrom%/gi, (u_idxFrom+1) + '' );
	  aa = aa.replace(/%PostNumTo%/gi, u_idxTo + '' );
  } while (a0 != aa);
	  return aa;
  }

  if (rpsFeeds.Titles.length > 0) {

  rpsFeeds.This = rpsFeeds.Next;

  if (!(rpsFeeds.Lines>0)) { rpsFeeds.Lines = 10; }
  if (rpsFeeds.This<0) {rpsFeeds.This = 0; }
  if (rpsFeeds.This>=rpsFeeds.idxNum) {rpsFeeds.This = rpsFeeds.idxNum-1; }
  pNum = Math.ceil(rpsFeeds.idxNum / rpsFeeds.Lines);
  pThis = Math.floor(rpsFeeds.This / rpsFeeds.Lines) + 1;
  u_idxFrom = (pThis-1) * rpsFeeds.Lines;
  u_idxTo = Math.min(u_idxFrom + rpsFeeds.Lines, rpsFeeds.idxNum);


    myHeadmsg = DispReplace(rpsDisp.ListHead);
    rps$.Board.find('#headmsg').text('').append(myHeadmsg);
    rps$.Board.find('#progress').text('');
    rps$.mainList.html('<ul>');		// mainList renew

    for (j=u_idxFrom; j<rpsFeeds.idxNum && j<u_idxTo; j++) {
      r = rpsFeeds.idx[j];
      
      myP = Math.floor(100*rpsFeeds.Ranks[r]/rpsLabels.loadLabelNum);
      myRGB = spanRGB(myP, optionRGB);

      myPostRank = DispReplace(myRGB + rpsDisp.Rank + '</span>');
	  myLine = DispReplace(rpsDisp.ListLine);

      rps$.mainList.append('<li>' + myLine + '</li>');
    }
      rps$.mainList.append('</ul>');

var navi$ = rps$.Board.find('#navi');
var temp;
    navi$.html('');

	temp = '上一頁';
	if (pThis>1) {
		temp = '<a id="prev" href="javascript:rpsFunc.page(' +
		(pThis-1) + ');">' + temp + '</a>';
  	}
  	temp = temp + ' / ';
    navi$.append(temp);

	temp = '下一頁';
	if (pThis<pNum) {
		temp = '<a id="prev" href="javascript:rpsFunc.page(' +
	  (pThis+1) + ');">' + temp + '</a>';
	}
  	temp = temp + ' / ';
    navi$.append(temp);

	for (i = 1; i<=pNum; i++) {
      navi$.append(' ');
      temp = '&lt;'+i+'&gt;';
      if (i != pThis) {
		temp = '<a id="prev" href="javascript:rpsFunc.page(' +
		i + ');">' + temp + '</a>';
      } else {
      	temp = '<b>' + temp + '</b>';
      }
	  navi$.append(temp);
	}
  }
};

rpsFunc.readOK = function() {
  var pp = Math.floor(90 * rpsLabels.loadLabelNum / rpsLabels.postLabelNum);

  rps$.Board.find('#progress').text('( ' + pp + '% )');
  if (rpsLabels.loadLabelNum == rpsLabels.postLabelNum) {
    rps$.Board.find('#headmsg').text('');
    rps$.Board.find('#progress').text('');
    SortRelatedPosts();
rpsFeeds.Lines = rpsOpt.Lines;
rpsFeeds.This = 0;
rpsFeeds.Next = 0;
    rpsFunc.redrawBoard();
  }
};

rpsFunc.readFeed = function(json) {
	
var regex1=/</g, regex2=/>/g;
var i, j;
  var entryURL = "";
  rpsLabels.loadLabelNum += 1;
  for (i = 0; i < json.feed.entry.length; i++) {
    var entry = json.feed.entry[i];
    entryURL = "";
    for (j = 0; j < entry.link.length; j++) {
      if (entry.link[j].rel == 'alternate') {
        entryURL = entry.link[j].href;
        break;
      } // endif
    }  // next j
    if (entryURL != "") {
      for (j = 0; j <= rpsFeeds.PostsNum; j++) {
        if (rpsFeeds.Urls[j] == entryURL) {
          rpsFeeds.Ranks[j]++;
          if (rpsFeeds.Ranks[j]>rpsFeeds.maxRank) {
            rpsFeeds.maxRank=rpsFeeds.Ranks[j];
          }  
          entryURL = "";
          break;
        } // endif
      } // next j
    } // endif
    if (entryURL != "") {
      rpsFeeds.Titles[rpsFeeds.PostsNum] = (entry.title.$t.replace(regex1, '&lt;')).replace(regex2, '&gt;');
      rpsFeeds.Dates[rpsFeeds.PostsNum] = entry.published.$t.substr(0,10);
      rpsFeeds.Urls[rpsFeeds.PostsNum] = entryURL;
      rpsFeeds.Ranks[rpsFeeds.PostsNum] = 1;
      rpsFeeds.PostsNum++;
    } // endif
  } // next i
  rpsFunc.readOK();
};

function SortRelatedPosts() {
  for (var j = rpsFeeds.maxRank; j > 0 ; j--) {
    for(var i = 0; i < rpsFeeds.Urls.length; i++) {
      if (rpsBlog.postUrl != rpsFeeds.Urls[i]) {
        if(rpsFeeds.Ranks[i]==j) {
          rpsFeeds.idx[rpsFeeds.idxNum] = i;
          rpsFeeds.idxNum++;
        } 
      }
    }
  }
}

rpsFunc.fatchLabel = function() {
  var postLabel$ = jQuery(rpsOpt.LocateLabels[0]);
  var json_script;
  var head0 = document.getElementsByTagName('head')[0];
  var i, l, s1, s2, p1, feedUrl;
	
  if (rpsOpt.LocateLabels[rpsOpt.LocateLabels.length-1] != 'a') {
    rpsOpt.LocateLabels[rpsOpt.LocateLabels.length] = 'a';
  }
  for (i=1; i<rpsOpt.LocateLabels.length; i++) {
  	if (postLabel$.length > 0) {
  	  postLabel$ = postLabel$.find(rpsOpt.LocateLabels[i]);
    }
  }

  if (postLabel$.length == 0) {
    postLabel$ = jQuery('.post-footer').find('.post-labels').find('a');
  }

  rpsLabels.postLabelNum = postLabel$.length;
  rpsLabels.loadLabelNum = 0;
  
   l = rpsOpt.blogRoot.length;
  while (l > 0) {
   	if (rpsOpt.blogRoot.charAt(l-1)=='/') {
 	  rpsOpt.blogRoot = rpsOpt.blogRoot.slice(0,l-1);
      l = rpsOpt.blogRoot.length;
   	} else {
   	  l = 0;
   	}  
  }
	
  for (i=0; i<rpsLabels.postLabelNum; i++) {
    s1 = postLabel$.eq(i).attr('href');
    p1 = s1.search(rpsOpt.urlSearchLabel);
    if (p1 > 0) {
      s2 = s1.slice(p1+rpsOpt.urlSearchLabel.length);
      if (rpsOpt.blogRoot.length==0) {
      	rpsOpt.blogRoot = s1.slice(0,p1); }
      s1 = postLabel$.eq(i).text();		// s1 : label without encode, e.g. 程式設計
      var p2 = s2.search(/\?/);
      if (p2>0) {
      	s2 = s2.slice(0,p2);		// s2 : label encoded, e.g. %E7%A8%8B%E5%BC%8F%E8%A8%AD%E8%A8%88
      }

      feedUrl = rpsOpt.blogRoot + rpsOpt.feedSearchLabel + s2 + '?max-results=20&alt=json-in-script&callback=rpsFunc.readFeed';

	json_script = document.createElement('script');
	json_script.src = feedUrl;
	json_script.type = 'text/javascript';
    head0.appendChild(json_script);
    }
  }
};

rpsFunc.ToggleMsg = function(a) {
  var aa, toDisp, i;
  if (a.length==1) {
    aa = a.get(0);
    if (aa.style.display == 'inline') {
  	  aa.style.display = 'none';
    } else {
      aa.style.display = 'inline';
    }
  } else {
	toDisp = 'inline';
	for (i=0; i<a.length; i++) {
	  if (a.get(i).style.display == 'inline') {
	  	toDisp = 'none';
	  	break;
	  }
	}
	for (i=0; i<a.length; i++) {
	  a.get(i).style.display = toDisp;
	}
  }
};

rpsFunc.initVar = function() {
  var p2;
  rpsBlog.postUrl = document.URL;
  p2 =rpsBlog.postUrl.search(/\?/);
  if (p2 > 0) { rpsBlog.postUrl = rpsBlog.postUrl.slice(0,p2); }
  rpsFeeds.Urls[0] = rpsBlog.postUrl;
  rpsFeeds.PostsNum = 1;
};

rpsFunc.initBoard = function() {
  var myLocate$ = jQuery('body');
  var myLocateRef = rpsOpt.LocateBoard[0].match(/append|prepend|before|after/i);
  var i0 = 0;
  var lmax = 1;
  var lmin = 0;

rps$.Board = '';

  if (typeof(myLocateRef) == 'object') {
    myLocateRef = myLocateRef[0]; }
  if (myLocateRef.length > 0) {
    i0 = 1;
  } else {
    i0 = 0;
    myLocateRef = '';
  }

  for (var i=i0; i<rpsOpt.LocateBoard.length; i++) {
    if (myLocate$.length>0) {
      switch (typeof(rpsOpt.LocateBoard[i])) {
      case 'string' :
    	myLocate$ = myLocate$.find(rpsOpt.LocateBoard[i]);
  	    break;
      case 'number' :
	    if (lmin==0) { lmin = rpsOpt.LocateBoard[i]; }
	    lmin = Math.min(lmin, rpsOpt.LocateBoard[i]);
	    lmax = Math.max(lmax, rpsOpt.LocateBoard[i]);
	    break;
	  default :
	  }
    }
  }
  if (myLocate$.length==0) { return; }
  if ((myLocate$.length<lmin) || (myLocate$.length>lmax)) { return; }

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
  rps$.Board.append('<div><p><span id="headmsg">' + rpsDisp.Loading + '</span>' +
  '<span id="progress"> ( 0% ) </span></p></div>' + '<p id="navi"></p>' +
  '<div id="mainList"></div>' );
  rps$.mainList = rps$.Board.find('#mainList');
  rps$.Board.append('<br />');
};

rpsFunc.main01 = function() {
  jQuery(document).ready(function(){
    rpsFunc.initVar();
    rpsFunc.initBoard();
    rpsFunc.fatchLabel();
  });
};

rpsDisp.Rank = '(%PostRankPure%%)';

rpsDisp.Loading = '相關文章載入中 ...';
rpsDisp.ListHead = '約有 %PostNum% 篇相關文章，以下是第 %PostNumFrom% 至 %PostNumTo% 篇';
rpsDisp.ListLine = '<font size=-1>%PostRank%</font> %PostTitle% - <font size=-1>%PostDate%</font>';

rpsOpt.urlSearchLabel = '/search/label/';
rpsOpt.feedSearchLabel = '/feeds/posts/summary/-/';
rpsOpt.LocateLabels = ['.post-footer', '.post-labels', 'a'];
rpsOpt.LocateBoard = ['append', '.post-footer'];
rpsOpt.Lines = 10;

rpsFunc.main01();
