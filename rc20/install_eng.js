function getValue(name)	{
	return eval('document.makeWidget.'+ name +'.value');
}
function uncheckBox (name,option){
	eval('var nameTag = document.makeWidget.'+name);
	
	if (option)
		jQuery(nameTag).removeAttr('checked'); 
	else 
		jQuery(nameTag).attr('checked',true);
}
function replaceWords(string){
	string = string.replace(/</g,'\<');
	string = string.replace(/>/g,'\>');
	string = string.replace(/"/g,'\"');
	return string;
}
function disableInput (name,option){
	eval('var nameTag = document.makeWidget.'+name);
	if (option)
		jQuery(nameTag).removeAttr('disabled'); 
	else 
		jQuery(nameTag).attr('disabled',true);
}
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
}
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
}
// ---- This function read all the parameters for future running ---
function readParameters(){
	rcPreSetting.g_iShowCount= parseInt(getValue('postNum'));
	rcPreSetting.cachesize = parseInt(getValue('loopNum'));
	rcPreSetting.showJumpButton= document.makeWidget.useJump.checked;	
	rcPreSetting.showRCnoPost = document.makeWidget.shownoTitle.checked;
	rcPreSetting.noContent= [getValue('noTitleMsg'),getValue('nothing')];
	rcPreSetting.rcFoldImage=[getValue('openImg'),getValue('openMsg'),getValue('closeImg'),getValue('closeMsg'),getValue('loadingMsg'),getValue('openAllMsg'),getValue('hideAllMsg')];
	rcPreSetting.otherText=[getValue('jumpMsgT'),jQuery(document.makeWidget.jumpMsgB).text(),getValue('prevPage'),getValue('nextPage'),getValue('footerMsg')];
	rcPreSetting.reply = [getValue('goPostImg'),getValue('goPostMsg')];
	rcPreSetting.rcDateFormat= jQuery('#dateFormat').val();
	rcPreSetting.rcAuthorLinkFormat = getValue('customAuthor');
	rcPreSetting.rcTitleLinkFormat = getValue('customTitle');
	rcPreSetting.createDisplayFormat = getValue('customComment');	
}
function toggleShowCode(){
	var codeShow = jQuery('#previewCode').is(':hidden');
	if (codeShow){
		jQuery('#codeButton').text('Hide Code');
		jQuery('#previewEasy').hide();
		jQuery('#previewCode').show();
	}
	else{
		jQuery('#codeButton').text('Display Code');
		jQuery('#previewCode').hide();
		jQuery('#previewEasy').show();
	}
}
function previewEasy(which){
	var reload = false; // set repload = true to reload the widget
	var blogName  = getValue('blogDomain');
		if (blogName.search(/http:\/\//)!=-1)
			blogName = blogName.replace(/http:\/\/(.*)/i,'$1');
		blogName = blogName.replace(/\//gi,'');
	switch(which){
	case 0:
		rcPreSetting.g_szBlogDomain= blogName;
		rcSetting.commentStartIndex = 1;
		reload = true;
	break;
	case 1: //number of post
		var checkValue = parseInt(getValue('postNum'));
		
		if (checkValue <= 0 | isNaN(getValue('postNum')))
			document.makeWidget.postNum.value = 1;
		if (rcPreSetting.g_iShowCount > checkValue)		{
			jQuery('#divrc li:gt('+ (checkValue-1) +')').hide();
			rcPreSetting.g_iShowCount = checkValue;
			jQuery('#showfooterButton').remove();
			rcFunction.addFooterButton();
		}
		else if (rcPreSetting.g_iShowCount < checkValue)	{
			if (checkValue <= jQuery('#divrc li').length)	{
				rcPreSetting.g_iShowCount = checkValue;
				jQuery('#divrc li:lt('+ (checkValue) +'):hidden').show();
				jQuery('#showfooterButton').remove();
				rcFunction.addFooterButton();
			}
			else {
				rcPreSetting.g_iShowCount = checkValue;
				reload = true;
				}
			}
		break;
	case 2: //preset parameters
		var preSetting = parseInt(jQuery('#preSet').val());
		var authorFormat = 	{
			idefault: '<a href="%link%" title="%timestamp% &#65306; %short_content%">%author%</a>',
			wretch:   '%author%'
			};
		var titleFormat = {
			idefault: '<a href="%orgLink%">%g_szTitle%</a>',
			wretch:   '<a href="%orgLink%" title="%short_content%">Re:%g_szTitle%</a>'
			};
		var commentFormat =	{
			idefault: 'On %rcTitleLinkFormat%%replyImg%, %rcAuthorLinkFormat% %rcSay% &#12300;%content%&#12301; - %timestamp%',
			wretch:   '%rcTitleLinkFormat%%replyImg%%replyImg% %rcSay% &#12300;%content%&#12301; &nbsp;by %rcAuthorLinkFormat% (%timestamp%)'
			};
		switch(preSetting){
		case 0:
			jQuery('#dateFormat').val('1');	
			document.makeWidget.customAuthor.value = authorFormat.idefault;
			document.makeWidget.customTitle.value = titleFormat.idefault;
			document.makeWidget.customComment.value = commentFormat.idefault;
			reload = true;
		break;
		case 1:
			jQuery('#dateFormat').val('2');
			document.makeWidget.customAuthor.value = authorFormat.wretch;
			document.makeWidget.customTitle.value = titleFormat.wretch;
			document.makeWidget.customComment.value = commentFormat.wretch;
			reload = true;
		break;
		}
		document.makeWidget.postNum.value = '7';
		document.makeWidget.loopNum.value = '60';
		uncheckBox('withjQuery',false);
		uncheckBox('useJump',false);
		rcPreSetting.showJumpButton= document.makeWidget.useJump.checked;
		disableInput('jumpMsgT',true);document.makeWidget.jumpMsgT.value = 'Go To #';
		disableInput('jumpMsgB',true);document.makeWidget.jumpMsgB.value = 'Go';
		uncheckBox('shownoTitle',true);rcPreSetting.showRCnoPost= document.makeWidget.shownoTitle.checked;
		disableInput('noTitleMsg',false);document.makeWidget.noTitleMsg.value = 'Page Not Found';
		document.makeWidget.nothing.value = '<p>No comment!</p>';
		document.makeWidget.openAllMsg.value = 'Show All';
		document.makeWidget.hideAllMsg.value = 'Hide All';		
		document.makeWidget.openMsg.value = 'left a message';
		document.makeWidget.openImg.value = 'http://lvchen.atspace.com/RC20/rc_0609_f.gif';
		document.makeWidget.closeMsg.value = 'wrote:';
		document.makeWidget.closeImg.value = 'http://lvchen.atspace.com/RC20/rc_0609_uf.gif';
		document.makeWidget.loadingMsg.value = '<img src="http://lvchen.atspace.com/RC20/2-0.gif"/>&nbsp;Loading...';
		document.makeWidget.goPostImg.value = 'http://lvchen.atspace.com/RC20/external.png';
		document.makeWidget.goPostMsg.value = 'Say Something';
		document.makeWidget.prevPage.value = 'Prev';
		document.makeWidget.nextPage.value = 'Next';				
		document.makeWidget.footerMsg.value = 'Message # %range%. There are %totalNum% messages.';
		uncheckBox('startCSS',true);
		readParameters();
	break;
	case 3: // if show JUMP button
		jQuery('#jumpSet').toggle();
		rcPreSetting.showJumpButton= document.makeWidget.useJump.checked;
	break;
	case 4: //JUMP button pre-message
		rcPreSetting.otherText[0] = getValue('jumpMsgT');
		var tempString = jQuery('#jumpSet').html();
		tempString = tempString.replace(/.*(\&nbsp;){2,}\<(.*)/g,rcPreSetting.otherText[0]+'&nbsp;&nbsp;<$2');
		jQuery('#jumpSet').html(tempString);
	break;
	case 5: //the message of the JUMP button 
		jQuery('#jumpSet input:eq(1)').val(getValue('jumpMsgB'));
		rcPreSetting.otherText[1] = jQuery(document.makeWidget.jumpMsgB).val();
	break;
	case 6: //show all button, open All
		rcPreSetting.rcFoldImage[5] = getValue('openAllMsg');
		if(!rcSetting.showAllFlag)
			jQuery('#headerButton a:eq(0)').html(rcPreSetting.rcFoldImage[5]);			
	break;
	case 7: //show all button, hide All
		rcPreSetting.rcFoldImage[6] = getValue('hideAllMsg');
		if(rcSetting.showAllFlag)
			jQuery('#headerButton a:eq(0)').html(rcPreSetting.rcFoldImage[6]);
	break;
	case 8: // toggle open message
		rcPreSetting.rcFoldImage[1] = getValue('openMsg');
		jQuery('#divrc li:has(.comcontent:hidden)').find('.rcsay').html(rcPreSetting.rcFoldImage[1]);
	break;
	case 9: // toggle open image
		rcPreSetting.rcFoldImage[0] = getValue('openImg');
		jQuery('#divrc li:has(.comcontent:hidden)').find('.rcfold').css('background','url('+rcPreSetting.rcFoldImage[0]+') center no-repeat');
	break;
	case 10: // toggle close message
		rcPreSetting.rcFoldImage[3] = getValue('closeMsg');
		jQuery('#divrc li:has(.comcontent:visible)').find('.rcsay').html(rcPreSetting.rcFoldImage[3]);
	break;	
	case 11: // toggle close image
		rcPreSetting.rcFoldImage[2] = getValue('closeImg');
		jQuery('#divrc li:has(.comcontent:visible)').find('.rcfold').css('background','url('+rcPreSetting.rcFoldImage[2]+') center no-repeat');
	break;		
	case 12: //loading message and picture
		rcPreSetting.rcFoldImage[4] = getValue('loadingMsg');
	break;	
	case 13: // go reply image
		rcPreSetting.reply[0] = getValue('goPostImg');
		jQuery('.replyImg img').attr('src', rcPreSetting.reply[0]);
	break;	
	case 14: // go reply messages
		rcPreSetting.reply[1] = getValue('goPostMsg');
		jQuery('.replyImg img').attr('alt', rcPreSetting.reply[1]);		
	break;
	case 15: // next page message
		rcPreSetting.otherText[2] = getValue('prevPage');
		jQuery('#showfooterButton a').each(function(n){
			var tempString = jQuery(this).attr('href');
			if (tempString.length == 39)
				jQuery(this).html(rcPreSetting.otherText[2]);
		});
	break;
	case 16: // previous page message
		rcPreSetting.otherText[3] = getValue('nextPage');
		jQuery('#showfooterButton a').each(function(n){
			var tempString = jQuery(this).attr('href');
			if (tempString.length == 38)
				jQuery(this).html(rcPreSetting.otherText[3]);
		});			
	break;
	case 17: //footer message
		rcPreSetting.otherText[4] = getValue('footerMsg');
		jQuery('#showfooterButton').remove();
		rcFunction.addFooterButton();
	break;
	case 18: // Date format
		rcPreSetting.rcDateFormat = parseInt(jQuery('#dateFormat').val());
		switch (rcPreSetting.rcDateFormat){
		case 0: 
			jQuery('#divrc .rcTimeStamp').text('');	
			rcPreSetting.createDisplayFormat = rcPreSetting.createDisplayFormat.replace(/%timestamp%/,'');
			document.makeWidget.customComment.value = rcPreSetting.createDisplayFormat;
		break;
		case 1:	
			if (rcPreSetting.createDisplayFormat.match('%timestamp%')!= null)
				jQuery('#divrc .rcTimeStamp').text('2008-12-31');
			else{
				rcPreSetting.createDisplayFormat = rcPreSetting.createDisplayFormat + '%timestamp%';
				jQuery('#divrc li span:last-child').append('<span class="rcTimeStamp">2008-12-31</span>');
			}
			document.makeWidget.customComment.value = rcPreSetting.createDisplayFormat;
		break;
		// case 4:	
			// jQuery('#divrc .rcTimeStamp').text('12-31-2008');
			// rcPreSetting.createDisplayFormat = rcPreSetting.createDisplayFormat + '%timestamp%';
			// document.makeWidget.customComment.value = rcPreSetting.createDisplayFormat;
		// break;
		// case 3:	
			// jQuery('#divrc .rcTimeStamp').text('31-12-2008');	
			// rcPreSetting.createDisplayFormat = rcPreSetting.createDisplayFormat + '%timestamp%';
			// document.makeWidget.customComment.value = rcPreSetting.createDisplayFormat;
			// break;
		case 2:	
			if (rcPreSetting.createDisplayFormat.match('%timestamp%')!= null)
				jQuery('#divrc .rcTimeStamp').text('Jan 01');
			else { 
				rcPreSetting.createDisplayFormat = rcPreSetting.createDisplayFormat + '%timestamp%';
				jQuery('#divrc li span:last-child').append('<span class="rcTimeStamp">Jan 01</span>');
			}
			document.makeWidget.customComment.value = rcPreSetting.createDisplayFormat;
		break;
		}
	break;
	case 19: //
		rcPreSetting.rcAuthorLinkFormat = getValue('customAuthor');
		reload = true;
	break;
	case 20:
		rcPreSetting.rcTitleLinkFormat = getValue('customTitle');
		reload = true;
	break;
	case 21:
		rcPreSetting.createDisplayFormat = getValue('customComment');
		reload = true;
	break;
	case 22:
		var initCSS = jQuery('#table3 input:eq(0)').attr('checked');
		if (initCSS){
			jQuery('#table3 input:gt(0)').attr('disabled',false);
			previewEasy(23);previewEasy(24);previewEasy(25); // Run every CSS setting, if we already have previous setting there
			previewEasy(26);previewEasy(27);
		}
		else{
			jQuery('#table3 input:gt(0)').attr('disabled',true);
			reload = true;
		}
	break;
	case 23:
		if(jQuery('#table3 input:eq(1)').attr('checked'))
			jQuery('#divrc li').css('text-indent',getValue('CSS_switch_length'));
		else
			jQuery('#divrc li').css('text-indent','0');
	break;	
	case 24:
		if(jQuery('#table3 input:eq(3)').attr('checked'))
			jQuery('#divrc li a').hover(function(){
					jQuery(this).css('background-color',getValue('CSS_link_highlight_colorcode'));
				},
				function(){
					jQuery(this).css('background-color','');
				});
		else
			jQuery('#divrc li a').hover(function(){
					jQuery(this).css('background-color','');
				},
				function(){
					jQuery(this).css('background-color','');
				});
	break;
	case 25:
		if(jQuery('#table3 input:eq(5)').attr('checked'))
			jQuery('#divrc li a').css('text-decoration','none');
		else
			jQuery('#divrc li a').css('text-decoration','underline');
	break;
	case 26:
		if(jQuery('#table3 input:eq(6)').attr('checked'))
			jQuery('#showfooterButton a').hover(function(){
					jQuery(this).css('background-color',getValue('CSS_page_highlight_colorcode'));
				},
				function(){
					jQuery(this).css('background-color','');
				});
		else
			jQuery('#showfooterButton a').hover(function(){
					jQuery(this).css('background-color','');
				},
				function(){
					jQuery(this).css('background-color','');
				});
	break;
	case 27:
		if(jQuery('#table3 input:eq(8)').attr('checked'))
			jQuery('#showfooterButton').css('text-align','right');
		else
			jQuery('#showfooterButton').css('text-align','left');
	break;		
	case 28:
	break;
	default:
		readParameters();
	break;
	}
	if (blogName == '')
		reload = false; //you should show some message to promot user to input a valid domain name
	if (reload)	{
		jQuery('#previewEasy .widget-content').html('<span id="removedTag"><div id="divrc"></div></span>');
		rcSetting.maxPostsNum = 0;
		rcSetting.commentStartIndex = 1;
		rcSetting.commentTotalNum = 0;
		rcSetting.showAllFlag = false;
		rcSetting.linkArr = [];
		jQuery('#divrc').html(rcPreSetting.rcFoldImage[4]);
		readParameters();
		rcFunction.addHeaderButton();
		rcFunction.fetchComments(rcSetting.commentStartIndex, rcPreSetting.g_iShowCount);
		jQuery('#widgetMaking input,#widgetMaking select,#widgetMaking button').attr('disabled',true);
		timeoutDisable();	
	}
	saveValue();
}
function focusText (name,option){
	if (option)
		eval('document.makeWidget.'+name+'.focus()');
}
function saveValue()	{
	var blogName = getValue('blogDomain');
	if (blogName.search(/http:\/\//)!=-1)
		blogName = blogName.replace(/http:\/\/(.*)/i,'$1');
	blogName = blogName.replace(/\//gi,'');
	if (document.makeWidget.divWrap.checked)
		var settingString = "\<div class='widget-content'\>###recentComment###\<\/div\>\n";
	else
		var settingString = "###recentComment###\n";
	if (document.makeWidget.withjQuery.checked)
		settingString += "\<script type='text/javascript' src='http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.min.js'\> \<\/script\>\n";
	settingString +="\<script type='text/javascript' src='http://lvchen-recentcomments.googlecode.com/svn/trunk/RecentComment/RC20/rc20_en_pack.js'\>\<\/script\>\n";
	settingString +="\<script type='text/javascript'\>\n";
	settingString += "rcPreSetting.g_szBlogDomain='"+blogName+"';\n";
	settingString += "rcPreSetting.g_iShowCount = "+replaceWords(getValue('postNum'))+";\n";
	settingString += "rcPreSetting.noContent =['"+replaceWords(getValue('noTitleMsg'))+"','"+ replaceWords(getValue('nothing'))+"'];\n";
	settingString += "rcPreSetting.cachesize = "+ replaceWords(getValue('loopNum'))+";\n";
	if (document.makeWidget.useJump.checked)
		settingString += "rcPreSetting.showJumpButton = true;\n";
	else 
		settingString += "rcPreSetting.showJumpButton = false;\n";
	if (document.makeWidget.shownoTitle.checked)
		settingString += "rcPreSetting.showRCnoPost = true;\n";
	else 
		settingString += "rcPreSetting.showRCnoPost = false;\n";
	settingString += "rcPreSetting.rcFoldImage = ['"+ replaceWords(getValue('openImg'))+ "','" +replaceWords(getValue('openMsg'))+ "','" + replaceWords(getValue('closeImg')) + "','" + replaceWords(getValue('closeMsg')) + "','" + replaceWords(getValue('loadingMsg'))+"','"+replaceWords(getValue('openAllMsg'))+"','"+ replaceWords(getValue('hideAllMsg'))+"'];\n";
	settingString += "rcPreSetting.otherText=['" + replaceWords(getValue('jumpMsgT'))+"','"+jQuery(document.makeWidget.jumpMsgB).text()+"','"+replaceWords(getValue('prevPage'))+"','"+replaceWords(getValue('nextPage'))+"','"+replaceWords(getValue('footerMsg'))+"'];\n";
	settingString += "rcPreSetting.reply = ['"+replaceWords(getValue('goPostImg'))+"','"+replaceWords(getValue('goPostMsg'))+"'];\n";
	if (parseInt(jQuery('#dateFormat').val()) > 0)
		settingString += "rcPreSetting.rcDateFormat = "+ jQuery('#dateFormat').val() +";\n";
	settingString += "rcPreSetting.rcAuthorLinkFormat = '"+replaceWords(getValue('customAuthor'))+"';\n";
	settingString += "rcPreSetting.rcTitleLinkFormat = '"+replaceWords(getValue('customTitle'))+"';\n";
	settingString += "rcPreSetting.createDisplayFormat = '"+replaceWords(getValue('customComment'))+"';\n\<\/script\>\n";

	if (document.makeWidget.startCSS.checked){
		var styleSetting;
		styleSetting = "\<style\>\n";
		if (document.makeWidget.CSS_switch.checked)
			styleSetting += "#divrc li{ text-indent:"+ getValue('CSS_switch_length') +"};\n";
		if (document.makeWidget.CSS_link_highlight.checked)
			styleSetting += "#divrc li a:hover{background-color:" + getValue('CSS_link_highlight_colorcode') + ";}\n";
		if (document.makeWidget.CSS_link_noline.checked)
			styleSetting += "#divrc li a{text-decoration:none;}\n";
		if (document.makeWidget.CSS_page_highlight.checked)
			styleSetting += "#showfooterButton a:hover{background-color:" + getValue('CSS_page_highlight_colorcode') + ";}\n";
		if (document.makeWidget.CSS_page_right.checked)
			styleSetting += "#showfooterButton{text-align:right;}\n";
		styleSetting += "\<\/style\>\n";
		settingString = styleSetting + settingString;
	}
	jQuery('#previewCode textarea').val(settingString);
	jQuery('#mywidget_content').val(settingString);	
}



