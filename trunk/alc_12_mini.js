﻿var tagListSetting={postShow:5,labelName:'',defaultPost:'',loadingImage:'<img src="http://lvchen716.googlepages.com/2-0.gif"/>&nbsp;資料載入中...',headerButton:true,tagsShow:false,lineHeight:24,dropDown:false,autoscroll:false,autohideTag:false,cloudConv:false,cloudMinFontSize:10,cloudMaxFontSize:20,cloudMinNumSize:10,cloudMaxNumSize:15,cloudShowNum:false,cloudRGB:[{P:100,R:208,G:0,B:0},{P:50,R:255,G:204,B:0},{P:0,R:0,G:64,B:128}],messagesArr:['最新文章','選擇標籤','%tagName% %range%，共有 %totalNum% 篇文章','上一頁','下一頁','一篇文章也沒有耶！<br>會不會是輸入錯誤的標籤啊？']};var tagListinner={startIndex:1,tempStr:'',blogName:''};var tagFunc={};tagFunc.addHeaderButton=function(){var a=jQuery('#'+tagListSetting.labelName);var b='<div id="headerBlock">';var c=a.find('*:has(ul):eq(0)').find('ul');if(tagListSetting.dropDown){b+=tagListinner.tempStr+'</div>';a.find('.widget-content').prepend(b);c.remove()}else{b+='<span class = "buttonStyle"><a href="javascript:if(tagListSetting.defaultPost!=&quot;&quot;) tagFunc.nextPage(0,&quot;&quot;)">'+tagListSetting.messagesArr[0]+'</a></span><span class="buttonStyle"><a href = "javascript:void(0)">'+tagListSetting.messagesArr[1]+'</a></span></div>';if(!tagListSetting.tagsShow)c.hide().find('li').css({background:'none',lineHeight:tagListSetting.lineHeight+'px'});else c.find('li').css({background:'none',lineHeight:tagListSetting.lineHeight+'px'});a.find('.widget-content').prepend(b).end().find('.buttonStyle').css('marginLeft','1em').slice(1,2).click(function(){if(c.is(':visible'))c.fadeOut();else c.fadeIn()})}};tagFunc.Util=function(e){var f=e.feed.entry;var g=e.feed.openSearch$totalResults.$t;var h=jQuery('#'+tagListSetting.labelName);if(g!=0){var j='<ul>';if(tagListinner.startIndex+tagListSetting.postShow>g)var k=g-tagListinner.startIndex+1;else var k=tagListSetting.postShow;for(var i=0;i<k;i++){post=e.feed.entry[i];var l=post.title.$t;var m=post.link[0].href;var n=post.published.$t.substr(0,10);j+='<li><a href="'+m+'">'+l+'</a> '+n+'</li>'}j+='</ul>';h.find('#postsList').html(j);function addFooterButton(){jQuery('#listLoading').remove();var a=tagListSetting.messagesArr[2];if(tagListSetting.defaultPost=='')a=a.replace(/%tagName%/,tagListSetting.messagesArr[0]);else a=a.replace(/%tagName%/,tagListSetting.defaultPost);a=a.replace(/%range%/,tagListinner.startIndex+'~'+(tagListinner.startIndex+k-1));a=a.replace(/%totalNum%/,g);a='<div id="footerInfo">'+a;var b='<br>';var c='<a href="javascript:tagFunc.nextPage(1,tagListSetting.defaultPost);">'+tagListSetting.messagesArr[4]+'</a>';var d='<a href="javascript:tagFunc.nextPage(-1,tagListSetting.defaultPost);">'+tagListSetting.messagesArr[3]+'</a>';if(tagListinner.startIndex==1){if(tagListSetting.postShow>=g)b+='</div>';else b+=c+'</div>'}else if(tagListinner.startIndex+tagListSetting.postShow>g){b+=d+'</div>'}else{b+=d+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+c+'</div>'}jQuery('#postsList').after(a+b)};addFooterButton()}else{jQuery('#postsList').html(tagListSetting.messagesArr[5]);jQuery('#listLoading').remove()}};tagFunc.convertTag=function(e){function dec2hex(a){var h=new Array('0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F');var b='';b+=h[Math.floor(a/0x1000)];a=a%0x1000;b+=h[Math.floor(a/0x100)];a=a%0x100;b+=h[Math.floor(a/0x10)];a=a%0x10;b+=h[Math.floor(a/0x1)];a=a%0x1;return b};function html_unic(a){var b='';var d,s,c;for(var i=0;i<a.length;i++){s=a.substr(i,8);if(d=s.match(/^&#[0-9]+;/)){c=d[0].replace(/[&#;]/g,'');c=dec2hex(c);c="%u"+c;c=c.replace(/^%u00/,"%");i+=d[0].length-1}else c=a.charAt(i);b+=c}return unescape(b)};return html_unic(e)};tagFunc.Run=function(a){var b=tagFunc.convertTag(a);b=encodeURIComponent(b);var c=document.createElement('script');var d='http://'+tagListinner.blogName+'/feeds/posts/summary';if(a!='')d=d+'/-/'+b;c.setAttribute('src',d+'/?alt=json-in-script&start-index='+tagListinner.startIndex+'&max-results='+tagListSetting.postShow+'&orderby=published&callback=tagFunc.Util');c.setAttribute('type','text/javascript');c.setAttribute('id','listScript');document.documentElement.firstChild.appendChild(c)};tagFunc.nextPage=function(a,b){jQuery('#listScript').remove();jQuery('#postsList').next().remove().end().after('<div id="listLoading">'+tagListSetting.loadingImage+'</div>');if(a==1)tagListinner.startIndex+=tagListSetting.postShow;else if(a==-1)tagListinner.startIndex-=tagListSetting.postShow;else{tagListinner.startIndex=1;tagListSetting.defaultPost=b}if(tagListSetting.autohideTag&!tagListSetting.dropDown)jQuery('#'+tagListSetting.labelName).find('ul:eq(0)').fadeOut();else if(tagListSetting.autoscroll&!tagListSetting.dropDown)document.documentElement.scrollTop=document.getElementById('postsList').offsetTop-16;tagFunc.Run(b)};tagFunc.fetchcategory=function(){var g=jQuery('#'+tagListSetting.labelName);var h='<option value=>'+tagListSetting.messagesArr[0]+'</option>';g.find('ul').after('<div id="postsList"></div>');tagListinner.blogName=g.find('li a:eq(0)').attr('href').replace(/http:\/\/(.+)\/search\/label.+$/,'$1');function s(a,b,i,x){if(a>b){var m=(a-b)/Math.log(x),v=a-Math.floor(Math.log(i)*m)}else{var m=(b-a)/Math.log(x),v=Math.floor(Math.log(i)*m+a)}return v}function RGB(a,b){var c,myG,myB;for(var i=0;i<b.length;i++){if(a>=b[i].P){if(i==0){c=b[i].R;myG=b[i].G;myB=b[i].B}else{var d=a-b[i].P;var e=b[i-1].P-a;var f=b[i-1].P-b[i].P;c=Math.floor((b[i-1].R*d+b[i].R*e)/f);myG=Math.floor((b[i-1].G*d+b[i].G*e)/f);myB=Math.floor((b[i-1].B*d+b[i].B*e)/f)}return('rgb('+c+','+myG+','+myB+')')}}return('')};if(tagListSetting.cloudConv){var j=0,pMax=1;g.find('ul').wrap('<div id="labelCloud"></div>');g.find('ul').get(0).className='label-cloud';g.find('li').each(function(a){var b=jQuery(this).text().match(/.+/g).pop();eval('pNum='+b+';');if(typeof(b)==='number'){pMax=Math.max(b,pMax);if(j==0){j=Math.max(b,0)}else{j=Math.min(b,j)}}});if(pMax==j){pMax+=1}}g.find('li').each(function(a){var b=jQuery('a',this).text();b=b.replace(/^\s*(\S.+)\s+/,'$1');if(tagListSetting.cloudConv){var c=jQuery(this).text().match(/.+/g).pop();eval('pNum='+c+';');if(typeof(c)!=='number'){c=1}}if(tagListSetting.dropDown){h+='<option value="'+b+'"';if(b.match(tagFunc.convertTag(tagListSetting.defaultPost))!=null)h+=' selected';h+='>'+jQuery(this).text().replace(/^\s*(\S.+\))/,'$1')+'</option>'}else jQuery('a',this).attr('href','javascript:if(tagListSetting.defaultPost!="'+b+'") tagFunc.nextPage(0,"'+b+'");');if(tagListSetting.cloudConv){var d;if(!tagListSetting.cloudShowNum){jQuery(this).get(0).style.fontSize=0}else{d=s(tagListSetting.cloudMinNumSize,tagListSetting.cloudMaxNumSize,c-j+1,pMax);jQuery(this).get(0).style.fontSize=d+'px'}d=s(tagListSetting.cloudMinFontSize,tagListSetting.cloudMaxFontSize,c-j+1,pMax);var e=RGB((100.0*(d-tagListSetting.cloudMinFontSize))/(tagListSetting.cloudMaxFontSize-tagListSetting.cloudMinFontSize),tagListSetting.cloudRGB);jQuery('a',this).get(0).style.fontSize=d+'px';jQuery('a',this).get(0).title=jQuery(this).text();if(e!==''){jQuery(this).get(0).style.color=e;jQuery('a',this).get(0).style.color=e}}});if(tagListSetting.dropDown)tagListinner.tempStr='<select onChange="javascript:var getName=this.options[this.selectedIndex].value; if (tagListSetting.defaultPost!= getName) tagFunc.nextPage(0,getName);">'+h+'</select>';if(tagListSetting.headerButton)tagFunc.addHeaderButton();tagFunc.Run(tagListSetting.defaultPost)};jQuery(document).ready(function(){if(tagListSetting.labelName=='')tagListSetting.labelName='Label1';if(document.getElementById(tagListSetting.labelName)!=null){tagFunc.fetchcategory()}});