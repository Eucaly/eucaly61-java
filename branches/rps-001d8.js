var rpsFunc = {};
var rpsOptions = {};
var br = '<br />';

var rps$ = {};

var rpsLabels = {};

var rpsBlog = {};

var relatedPostsNum = 0;
var labelNum = 0;
var maxStar = 1;
var relatedStar = new Array();
var relatedTitles = new Array();
var relatedUrls = new Array();
var relatedDates = new Array();
var u_Idx = new Array();
var u_IdxNum = 0;

function RelatedLabels(json) {
var regex1=/</g, regex2=/>/g;
  var entryURL = "";
  rpsLabels.loadLabelNum += 1;
  labelNum += 1;
  //    rps$.msg.append('[' + labelNum + ']' + br);
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
  } // next i
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
  var myRBG;
  var myP = 0;
  var optionRGB = [ {P: 100, R :208, G: 0, B: 0}, {P: 50, R: 255, G: 204, B: 0}, {P: 0, R: 0, G: 64, B: 128} ];

  var myHeadmsg = '';
  var myPostRank = '';
  var myLine = '';
  var u_IdxFrom = 0;
  var u_IdxTo = 10;

  function DispReplace(a) {
  	  aa = a;
	  aa = aa.replace(/\[rpsPostTitle\]/gi, '<a href="' + relatedUrls[r] + '">' + relatedTitles[r] + '</a>');
	  aa = aa.replace(/\[rpsPostDate\]/gi, relatedDates[r]);
	  aa = aa.replace(/\[rpsPostRankPure\]/gi, myP + '' );
	  aa = aa.replace(/\[rpsPostRank\]/gi, myRBG + myPostRank + '</span>');
	  aa = aa.replace(/\[rpsPostNum\]/gi, u_IdxNum + '' );
	  aa = aa.replace(/\[rpsPostNumFrom\]/gi, (u_IdxFrom+1) + '' );
	  aa = aa.replace(/\[rpsPostNumTo\]/gi, u_IdxTo + '' );
	  return aa;
  };

  if (relatedTitles.length > 0) {
  	u_IdxFrom = 0;
  	u_IdxTo = 10;
    myHeadmsg = DispReplace(rpsOptions.DispListHead);
    rps$.Board.find('#headmsg').text(myHeadmsg);
    rps$.mainList.append('<ul>');
    for (var j=u_IdxFrom; j<u_IdxNum && j<u_IdxTo; j++) {
      r = u_Idx[j];
//      if (currStar!=relatedStar[r]){
//        if (currStar != 0) 
//          rps$.mainList.append('</ul>');
//        currStar = relatedStar[r];
//        myStars = "";
//        for (i=0; i<currStar; i++)
//          myStars = myStars + '★';
        myP = Math.floor(100*relatedStar[r]/labelNum);
        myRBG = spanRGB(myP, optionRGB);
//        rps$.mainList.append('<h4>' + '<span style="color: rgb(208, 52, 48);">');
//        rps$.mainList.append('<h4>' + myRBG +
//        '相關度 ' + myStars + ' ' + myP + '% 的文章 :</span></h4> <ul>' );
//        rps$.mainList.append('<h4>相關度 ' + myStars + ' (' + relatedStar[r] + '/' + labelNum + ') 的文章 :</h4> <ul>' );
//      }
//      rps$.mainList.append('<li><a href="' + relatedUrls[r] + '">' + relatedTitles[r] + '</a> - ' + relatedDates[r] + '</li>');


      myPostRank = DispReplace(rpsOptions.DispRank);
	  myLine = DispReplace(rpsOptions.DispListLine);

      rps$.mainList.append('<li>' + myLine +
//      myRBG + '(' +  myP + '%) ' + '</span>' + 
//      '<a href="' + relatedUrls[r] + '">' + relatedTitles[r] + '</a>' + 
//      ' - ' + relatedDates[r] + 
      '</li>');
    }
//    if (currStar != 0) 
      rps$.mainList.append('</ul>');
//    rps$.mainList.append('== 以上 ' + j + ' 則 ==, <u>相關文章 (json/java) 說明</u> ... 文件製作中 ... 請期待');
  }
};

function jsOK(a){
  var pp = Math.floor(90 * rpsLabels.loadLabelNum / rpsLabels.postLabelNum);
//  rps$.msg.append('<p> END callback : ' + a + ' / ' + relatedPostsNum + '</p>');
  rps$.msg.append('<p> END callback : ' + ' / ' + relatedPostsNum + '</p>');
//  rps$.msg.append('<p>' + '( ' + pp + '% )' + '</p>');
  for (var j=0; j < relatedPostsNum; j++) {
    rps$.msg.append('<p>' + relatedDates[j] + ' / ' + relatedTitles[j] + ' [' + relatedUrls[j] + '] </p>');
  }
  rps$.Board.find('#progress').text('( ' + pp + '% )');
  if (rpsLabels.loadLabelNum == rpsLabels.postLabelNum) {
    rps$.Board.find('#headmsg').text('');
    rps$.Board.find('#progress').text('');
    SortRelatedPosts();
    ShowRelatedPosts();
  }
};

rpsFunc.fatchLabel = function() {
  var jsonLocal = true;
//  jsonLocal = false;
  var postLabel$ = $(rpsOptions.LocateLabels[0]);
  var blogSearchLabel='/search/label/';

  if (rpsOptions.LocateLabels[rpsOptions.LocateLabels.length-1] != 'a') {
    rpsOptions.LocateLabels[rpsOptions.LocateLabels.length] = 'a'
  }
  for (var i=1; i<rpsOptions.LocateLabels.length; i++) {
  	if (postLabel$.length > 0) {
      rps$.msg.append('[' + rpsOptions.LocateLabels[i] + ']' + br);
  	  postLabel$ = postLabel$.find(rpsOptions.LocateLabels[i]);
    }
  }

  if (postLabel$.length == 0) {
      rps$.msg.append('[ another try with default ]' + br);
    postLabel$ = $('.post-footer').find('.post-labels').find('a');
  }

// if no Labels found ....

  rpsLabels.postLabelNum = postLabel$.length;
  rpsLabels.loadLabelNum = 0;
  
  rps$.msg.append(rpsLabels.postLabelNum + br); //.append(postLabel$.text());
  for (var i=0; i<rpsLabels.postLabelNum; i++) {
    var s1 = postLabel$.eq(i).attr('href');
    var p1 = s1.search(blogSearchLabel);
    if (p1 > 0) {
      var s2 = s1.slice(p1+blogSearchLabel.length);
      var p2 = s2.search(/\?/);
      if (p2>0) {
      	s2 = s2.slice(0,p2);
      };
      rps$.msg.append('[' + s2 + ']' + br);
      var feedUrl = 'http://eucaly61.blogspot.com/feeds/posts/summary/-/' + s2 + '?max-results=20&alt=json-in-script&callback=RelatedLabels';
//      var feedUrl = s1.slice(1,p1) + '/feeds/posts/summary/-/' + s2 + '?max-results=20&alt=json-in-script&callback=RelatedLabels';
      rps$.msg.append('[' + feedUrl + ']' + br);
if (jsonLocal) {
  $.getScript(s2, jsOK );
} else {
      $.getScript(feedUrl, jsOK );
}      
      rps$.msg.append('[' + 'end' + ']' + br);
    }
  }
};


rpsFunc.ToggleMsg = function(a) {
//function ToggleMsg() {
//	$('body').append('click');
  var aa = a.get(0);
  if (aa.style.display == 'inline') {
  	aa.style.display = 'none';
//	$('body').append('hide');
  } else {
  	aa.style.display = 'inline';
//	$('body').append('show');
  }
}

rpsFunc.initBoard = function() {
  var myLocate$ = $('body');
  var myLocateRef = rpsOptions.LocateBoard[0].match(/append|prepend|before|after/i);
  if (typeof(myLocateRef)=='object')
    myLocateRef = myLocateRef[0];
  var i0 = 0;
  if (myLocateRef.length > 0) {
    i0 = 1;
  } else {
    i0 = 0;
  }
//document.write(myLocateRef);
  for (var i=i0; i<rpsOptions.LocateBoard.length; i++) {
    if ( (myLocate$.length>0) && (typeof(rpsOptions.LocateBoard[i])=='string') ) {
  	  myLocate$ = myLocate$.find(rpsOptions.LocateBoard[i]);
  	}
  }
//  myLocate$ = myLocate$.find('.post-footer');
  if (myLocate$.length==0) return;
//document.write(myLocateRef);
  var rpsBoardHTM = '<div id="rpsBoard"></div>';
//document.write(myLocateRef.search(/append/i));
  if (myLocateRef.search(/append/i) >= 0) {
    myLocate$.append(rpsBoardHTM);
  } else if (myLocateRef.search(/prepend/i) >= 0) {
    myLocate$.prepend(rpsBoardHTM);
  } else if (myLocateRef.search(/after/i) >= 0) {
    myLocate$.after(rpsBoardHTM);
  } else if (myLocateRef.search(/before/i) >= 0) {
    myLocate$.before(rpsBoardHTM);
  } else {
    myLocate$.append(rpsBoardHTM);
  }
  rps$.Board = $('#rpsBoard');
  rps$.Board.append('<div><p><span id="headmsg">' + rpsOptions.DispLoading + '</span>' +
  '<span id="progress"> ( 0% ) </span></p></div>');
  rps$.Board.append('<div id="mainList"></div>');  
  rps$.Board.append('<p><a href="javascript:void(0);" onclick="javascript:rpsFunc.ToggleMsg(rps$.msg);">[+/-] show/hide debug message</a></p>');
  rps$.Board.append('<div id="rps-msg" style="display:none"></div>');
  rps$.msg = rps$.Board.find('#rps-msg');
  rps$.msg.append('<p> ready BEGIN</p>');
  rps$.mainList = rps$.Board.find('#mainList');
/*  for (var i=0; i<rpsOptions.test.length; i++)
  	rps$.msg.append(i + typeof rpsOptions.test[i] + br);*/
};

rpsFunc.main01 = function() {
$(document).ready(function(){
  rpsBlog.postUrl = '';
  rpsFunc.initBoard();
  rpsFunc.fatchLabel();
  rps$.msg.append('<p> ready END </p>');
});
};

//rpsOptions.PostListLine = '[rpsPostTitle] - [rpsPostDate] ([rpsPostRank])';
rpsOptions.DispRank = '([rpsPostRankPure]%)';
rpsOptions.DispLoading = '相關文章載入中 ...';
rpsOptions.DispListHead = '約有 [rpsPostNum] 篇相關文章，以下是第 [rpsPostNumFrom] 至 [rpsPostNumTo] 篇';
rpsOptions.DispListLine = '<font size=-1>[rpsPostRank]</font> [rpsPostTitle] - [rpsPostDate]';
rpsOptions.LocateLabels = ['.post-footer', '.post-labels', 'a'];
rpsOptions.LocateBoard = ['append', '.post-footer'];
rpsOptions.test = ['append', '.post-footer', 1, 2];
//rpsOptions.LocateBoardRef = 'prepend';

rpsFunc.main01();
